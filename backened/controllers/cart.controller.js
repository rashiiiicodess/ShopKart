import Customer from '../models/customer.model.js';
import Product from '../models/product.model.js';

// Helper to format/populate customer cart
const getPopulatedCart = async (customerId) => {
  const customer = await Customer.findById(customerId).populate('cart.product');
  return customer ? customer.cart : [];
};

// @desc    Add product to cart or increment quantity
// @route   POST /cart/:productId
export const addToCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const customerId = req.user._id;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const customer = await Customer.findById(customerId);
    const existingCartItem = customer.cart.find(
      (item) => item.product.toString() === productId
    );

    const currentQty = existingCartItem ? existingCartItem.quantity : 0;
    if (currentQty + 1 > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Cannot add more units. Only ${product.stock} items in stock.`,
      });
    }

    if (existingCartItem) {
      existingCartItem.quantity += 1;
    } else {
      customer.cart.push({ product: productId, quantity: 1 });
    }

    await customer.save();
    const updatedCart = await getPopulatedCart(customerId);

    res.status(200).json({
      success: true,
      message: 'Product added to cart',
      cart: updatedCart,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get logged in customer's cart
// @route   GET /cart
export const getCart = async (req, res) => {
  try {
    const cart = await getPopulatedCart(req.user._id);
    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update item quantity in cart
// @route   PATCH /cart/:productId
export const updateCartQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    const customerId = req.user._id;

    if (typeof quantity !== 'number' || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be a valid number and at least 1',
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (quantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Requested quantity exceeds available stock (${product.stock})`,
      });
    }

    const customer = await Customer.findById(customerId);
    const cartItem = customer.cart.find(
      (item) => item.product.toString() === productId
    );

    if (!cartItem) {
      return res.status(404).json({ success: false, message: 'Item not found in cart' });
    }

    cartItem.quantity = quantity;
    await customer.save();

    const updatedCart = await getPopulatedCart(customerId);
    res.status(200).json({ success: true, cart: updatedCart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Remove item from cart
// @route   DELETE /cart/:productId
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const customerId = req.user._id;

    const customer = await Customer.findById(customerId);
    customer.cart = customer.cart.filter(
      (item) => item.product.toString() !== productId
    );

    await customer.save();
    const updatedCart = await getPopulatedCart(customerId);

    res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      cart: updatedCart,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};