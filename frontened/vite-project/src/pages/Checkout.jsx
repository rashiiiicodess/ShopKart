import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { createPaymentOrderApi, verifyPaymentApi } from '../services/orderService';

const Checkout = () => {
  const { cartItems, subtotal, fetchCart } = useCart();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    city: '',
    state: '',
    pincode: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!shippingAddress.fullName.trim()) newErrors.fullName = 'Full Name is required.';
    if (!(/^\d{10}$/).test(shippingAddress.phone.trim())) newErrors.phone = 'Enter a valid 10-digit phone number.';
    if (!shippingAddress.addressLine1.trim()) newErrors.addressLine1 = 'Address line is required.';
    if (!shippingAddress.city.trim()) newErrors.city = 'City is required.';
    if (!shippingAddress.state.trim()) newErrors.state = 'State is required.';
    if (!(/^\d{6}$/).test(shippingAddress.pincode.trim())) newErrors.pincode = 'Enter a valid 6-digit pincode.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setApiError('');

    try {
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        setApiError('Failed to load Razorpay SDK. Check your internet connection.');
        setLoading(false);
        return;
      }

      // Step 1: Create Order on Backend
      const orderData = await createPaymentOrderApi(shippingAddress);

      // Step 2: Open Razorpay Test Checkout
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'ShopKart',
        description: 'ShopKart Order Payment',
        order_id: orderData.razorpayOrderId,
        prefill: {
          name: shippingAddress.fullName,
          contact: shippingAddress.phone,
        },
        handler: async (response) => {
          try {
            // Step 3: Verify Payment on Backend
            const verification = await verifyPaymentApi({
              shopKartOrderId: orderData.shopKartOrderId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verification.success) {
              await fetchCart(); // Sync empty cart in global state
              navigate(`/order-success/${orderData.shopKartOrderId}`);
            }
          } catch (err) {
            setApiError(err.response?.data?.message || 'Payment verification failed.');
          }
        },
        theme: { color: '#38bdf8' },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.on('payment.failed', (resp) => {
        setApiError(`Payment failed: ${resp.error.description}`);
      });
      razorpayInstance.open();
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to initialize order.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <h1 style={styles.title}>Checkout</h1>

        {apiError && <div style={styles.errorBanner}>{apiError}</div>}

        <div style={styles.layout}>
          {/* Shipping Form */}
          <form style={styles.formCard} onSubmit={handlePlaceOrder}>
            <h2 style={styles.sectionTitle}>Shipping Details</h2>

            {['fullName', 'phone', 'addressLine1', 'city', 'state', 'pincode'].map((field) => (
              <div key={field} style={styles.fieldGroup}>
                <label style={styles.label}>{field.replace(/([A-Z0-9])/g, ' \$1').toUpperCase()}</label>
                <input
                  type="text"
                  name={field}
                  value={shippingAddress[field]}
                  onChange={handleChange}
                  style={styles.input}
                />
                {errors[field] && <span style={styles.fieldError}>{errors[field]}</span>}
              </div>
            ))}

            <button type="submit" disabled={loading} style={styles.payBtn}>
              {loading ? 'Processing...' : `Pay ₹${subtotal.toLocaleString('en-IN')}`}
            </button>
          </form>

          {/* Cart Summary */}
          <div style={styles.summaryCard}>
            <h2 style={styles.sectionTitle}>Order Summary</h2>
            {cartItems.map(({ product, quantity }) => (
              <div key={product._id} style={styles.summaryRow}>
                <span>{product.name} × {quantity}</span>
                <span>₹{(product.price * quantity).toLocaleString('en-IN')}</span>
              </div>
            ))}
            <hr style={styles.hr} />
            <div style={{ ...styles.summaryRow, fontWeight: 'bold', fontSize: '1.2rem' }}>
              <span>Total</span>
              <span style={{ color: '#38bdf8' }}>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  wrapper: { backgroundColor: '#0b0f19', color: '#f8fafc', minHeight: 'calc(100vh - 70px)', padding: '2rem 1rem' },
  container: { maxWidth: '1000px', margin: '0 auto' },
  title: { fontSize: '2rem', fontWeight: '800', marginBottom: '1.5rem', textAlign: 'center' },
  errorBanner: { backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid #f87171', color: '#f87171', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' },
  layout: { display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' },
  formCard: { backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '1.5rem' },
  summaryCard: { backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '1.5rem', height: 'fit-content' },
  sectionTitle: { fontSize: '1.25rem', fontWeight: '700', marginBottom: '1rem', color: '#38bdf8' },
  fieldGroup: { marginBottom: '1rem', display: 'flex', flexDirection: 'column' },
  label: { fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.3rem' },
  input: { padding: '0.6rem', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff', fontSize: '0.95rem' },
  fieldError: { color: '#f87171', fontSize: '0.75rem', marginTop: '0.2rem' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' },
  hr: { borderColor: '#334155', margin: '1rem 0' },
  payBtn: { width: '100%', padding: '0.8rem', backgroundColor: '#38bdf8', color: '#0f172a', fontWeight: '800', border: 'none', borderRadius: '8px', cursor: 'pointer', marginTop: '1rem' },
};

export default Checkout;