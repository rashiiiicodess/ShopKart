import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cartItems, loading, error, subtotal, cartCount, updateQuantity, removeFromCart, fetchCart } = useCart();
  const [updatingId, setUpdatingId] = useState(null);
  const navigate = useNavigate(); // 1. Added useNavigate hook

  const handleQtyChange = async (productId, currentQty, delta, stock) => {
    const newQty = currentQty + delta;
    if (newQty < 1 || newQty > stock) return;

    setUpdatingId(productId);
    await updateQuantity(productId, newQty);
    setUpdatingId(null);
  };

  const handleRemove = async (productId) => {
    setUpdatingId(productId);
    await removeFromCart(productId);
    setUpdatingId(null);
  };

  if (loading) return <div style={styles.center}>Loading your cart...</div>;
  if (error)
    return (
      <div style={styles.center}>
        <p style={{ color: '#e74c3c' }}>{error}</p>
        <button onClick={fetchCart} style={styles.retryBtn}>Try Again</button>
      </div>
    );

  if (cartItems.length === 0)
    return (
      <div style={styles.center}>
        <h2>Your cart is empty 🛒</h2>
        <p>Looks like you haven't added anything yet.</p>
        <Link to="/products" style={styles.shopBtn}>Browse Products</Link>
      </div>
    );

  return (
    <div style={styles.container}>
      <h2>My Cart ({cartCount} Items)</h2>

      <div style={styles.layout}>
        {/* Cart Item List */}
        <div style={styles.itemsList}>
          {cartItems.map(({ product, quantity }) => {
            if (!product) return null; // Safe guard for deleted products

            return (
              <div key={product._id} style={styles.itemRow}>
                <img src={product.image} alt={product.name} style={styles.itemImg} />
                
                <div style={styles.itemDetails}>
                  <h4>{product.name}</h4>
                  <p>₹{product.price?.toLocaleString('en-IN')}</p>
                  <span style={{ fontSize: '0.8rem', color: '#666' }}>
                    Stock available: {product.stock}
                  </span>
                </div>

                {/* Quantity Controls */}
                <div style={styles.qtyContainer}>
                  <button
                    onClick={() => handleQtyChange(product._id, quantity, -1, product.stock)}
                    disabled={quantity <= 1 || updatingId === product._id}
                    style={styles.qtyBtn}
                  >
                    -
                  </button>
                  <span style={styles.qtyText}>{quantity}</span>
                  <button
                    onClick={() => handleQtyChange(product._id, quantity, 1, product.stock)}
                    disabled={quantity >= product.stock || updatingId === product._id}
                    style={styles.qtyBtn}
                  >
                    +
                  </button>
                </div>

                {/* Item Subtotal */}
                <div style={styles.itemTotal}>
                  ₹{(product.price * quantity).toLocaleString('en-IN')}
                </div>

                <button
                  onClick={() => handleRemove(product._id)}
                  disabled={updatingId === product._id}
                  style={styles.removeBtn}
                >
                  Remove
                </button>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div style={styles.summaryCard}>
          <h3>Order Summary</h3>
          <hr />
          <div style={styles.summaryRow}>
            <span>Total Units:</span>
            <span>{cartCount}</span>
          </div>
          <div style={styles.summaryRow}>
            <span>Subtotal:</span>
            <strong>₹{subtotal.toLocaleString('en-IN')}</strong>
          </div>
          {/* 2. Added onClick navigation */}
          <button 
            onClick={() => navigate('/checkout')} 
            style={styles.checkoutBtn}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: '1000px', margin: '2rem auto', padding: '0 1rem' },
  center: { textAlign: 'center', marginTop: '4rem' },
  layout: { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' },
  itemsList: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  itemRow: { display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid #ddd', padding: '1rem', borderRadius: '6px' },
  itemImg: { width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' },
  itemDetails: { flex: 1 },
  qtyContainer: { display: 'flex', alignItems: 'center', gap: '0.5rem' },
  qtyBtn: { width: '30px', height: '30px', cursor: 'pointer', border: '1px solid #ccc', background: '#fff', borderRadius: '4px' },
  qtyText: { minWidth: '20px', textAlign: 'center', fontWeight: 'bold' },
  itemTotal: { minWidth: '90px', textAlign: 'right', fontWeight: 'bold' },
  removeBtn: { border: 'none', background: 'transparent', color: '#e74c3c', cursor: 'pointer' },
  summaryCard: { border: '1px solid #ddd', padding: '1.5rem', borderRadius: '6px', height: 'fit-content', background: '#f9f9f9' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', margin: '1rem 0' },
  checkoutBtn: { width: '100%', padding: '12px', backgroundColor: '#27ae60', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold' },
  retryBtn: { padding: '8px 16px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', marginTop: '10px' },
  shopBtn: { display: 'inline-block', marginTop: '1rem', padding: '10px 20px', background: '#007bff', color: '#fff', textDecoration: 'none', borderRadius: '4px' },
};

export default Cart;