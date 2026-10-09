import crypto from 'crypto';
import Order from '../models/order.model.js';
import Customer from '../models/customer.model.js';
import Product from '../models/product.model.js';
import razorpay from '../utils/razorpay.js'; // 1. Fixed import

// @desc    Validate cart, calculate total server-side, create pending Order & Razorpay Order
// @route   POST /orders/create-payment-order
export const createPaymentOrder = async (req, res) => {
  try {
    const customerId = req.user._id;
    const { shippingAddress } = req.body;

    // 1. Basic shipping address validation
    if (
      !shippingAddress ||
      !shippingAddress.fullName ||
      !shippingAddress.phone ||
      !shippingAddress.addressLine1 ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.pincode
    ) {
      return res.status(400).json({ success: false, message: 'All shipping address fields are required.' });
    }

    // 2. Fixed Regex dollar sign anchors
    if (!/^\d{10}$/.test(shippingAddress.phone.trim())) {
      return res.status(400).json({ success: false, message: 'Phone number must be exactly 10 digits.' });
    }

    if (!/^\d{6}$/.test(shippingAddress.pincode.trim())) {
      return res.status(400).json({ success: false, message: 'Pincode must be exactly 6 digits.' });
    }
    // 3. Fetch Customer and Cart
    const customer = await Customer.findById(customerId).populate('cart.product');
    if (!customer || !customer.cart || customer.cart.length === 0) {
      return res.status(400).json({ success: false, message: 'Your cart is empty.' });
    }

    let calculatedTotal = 0;
    const orderItemsSnapshot = [];

    // 4. Re-verify stock and snapshot product details
    for (const item of customer.cart) {
      const productId = item.product?._id || item.product;
      const product = await Product.findById(productId);
      
      if (!product) {
        return res.status(404).json({ success: false, message: 'A product in your cart no longer exists.' });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${product.name}". Requested: ${item.quantity}, Available: ${product.stock}`,
        });
      }

      calculatedTotal += product.price * item.quantity;

      orderItemsSnapshot.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.image,
      });
    }

    // 5. Create Pending ShopKart Order
    const shopKartOrder = new Order({
      customer: customerId,
      items: orderItemsSnapshot,
      shippingAddress,
      totalAmount: calculatedTotal,
      paymentStatus: 'PENDING',
      status: 'PENDING_PAYMENT',
    });

    await shopKartOrder.save();

    // 6. Create Razorpay Order (Amount in paise)
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(calculatedTotal * 100),
      currency: 'INR',
      receipt: shopKartOrder._id.toString(),
    });

    shopKartOrder.razorpayOrderId = razorpayOrder.id;
    await shopKartOrder.save();

    res.status(201).json({
      success: true,
      shopKartOrderId: shopKartOrder._id,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Verify Razorpay HMAC Signature, set Order to PAID, deduct stock & clear cart
// @route   POST /orders/verify-payment
export const verifyPayment = async (req, res) => {
  try {
    const { shopKartOrderId, razorpay_payment_id, razorpay_signature } = req.body;

    const order = await Order.findById(shopKartOrderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    if (order.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized access to order.' });
    }

    // Generate HMAC SHA256 signature check
    const body = `${order.razorpayOrderId}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      order.paymentStatus = 'FAILED';
      await order.save();
      return res.status(400).json({ success: false, message: 'Invalid payment signature.' });
    }

    // Fixed MongoDB \$inc operator
   // ✅ Fixed: Removed backslashes before $inc
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    order.paymentStatus = 'PAID';
    order.status = 'PLACED';
    order.razorpayPaymentId = razorpay_payment_id;
    await order.save();

    // ✅ Fixed: Removed backslashes before $set
    await Customer.findByIdAndUpdate(req.user._id, { $set: { cart: [] } });
   
    res.status(200).json({
      success: true,
      message: 'Payment verified and order placed successfully.',
      order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all orders for current customer
// @route   GET /orders
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single order details by ID
// @route   GET /orders/:id
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    if (order.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};