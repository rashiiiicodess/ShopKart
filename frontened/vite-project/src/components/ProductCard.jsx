import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { addToWishlistApi, removeFromWishlistApi } from '../services/wishlistService';
import { useCart } from '../context/CartContext'; // 1. Import Cart context hook

const ProductCard = ({ product, initialIsWishlisted = false, onWishlistToggle }) => {
  const [status, setStatus] = useState(initialIsWishlisted ? 'saved' : 'idle'); // 'idle' | 'saving' | 'saved' | 'error'
  const [errorMessage, setErrorMessage] = useState('');
  
  // Cart state handling
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartSuccess, setCartSuccess] = useState(false);
  const { addToCart } = useCart(); // 2. Destructure addToCart function

  // Keep internal state updated if initialIsWishlisted prop changes
  useEffect(() => {
    setStatus(initialIsWishlisted ? 'saved' : 'idle');
  }, [initialIsWishlisted]);

  const handleToggleWishlist = async () => {
    if (status === 'saving') return;

    const currentlySaved = status === 'saved';
    setStatus('saving');
    setErrorMessage('');

    try {
      if (currentlySaved) {
        await removeFromWishlistApi(product._id);
        setStatus('idle');
        if (onWishlistToggle) onWishlistToggle(product._id, false);
      } else {
        await addToWishlistApi(product._id);
        setStatus('saved');
        if (onWishlistToggle) onWishlistToggle(product._id, true);
      }
    } catch (err) {
      if (err.response && err.response.status === 409) {
        setStatus('saved');
      } else {
        setStatus('error');
        setErrorMessage('Unable to update wishlist.');
        setTimeout(() => setStatus(currentlySaved ? 'saved' : 'idle'), 3000);
      }
    }
  };

  const handleAddToCart = async () => {
    if (addingToCart || product.stock <= 0) return;

    setAddingToCart(true);
    try {
      await addToCart(product._id, 1);
      setCartSuccess(true);
      setTimeout(() => setCartSuccess(false), 2000); // Reset button label after 2s
    } catch (err) {
      setErrorMessage('Failed to add to cart.');
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <div style={styles.card}>
      <div style={styles.imageContainer}>
        <img src={product.image} alt={product.name} style={styles.image} />

        {/* Quick Heart Overlay Button */}
        <button
          onClick={handleToggleWishlist}
          disabled={status === 'saving'}
          style={{
            ...styles.quickWishlistBtn,
            color: status === 'saved' ? '#e74c3c' : '#888',
          }}
          title={status === 'saved' ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          {status === 'saved' ? '♥' : '♡'}
        </button>
      </div>

      <div style={styles.content}>
        <span style={styles.category}>{product.category}</span>
        <h3 style={styles.title}>{product.name}</h3>
        <p style={styles.price}>₹{product.price?.toLocaleString('en-IN')}</p>
        <p style={product.stock > 0 ? styles.inStock : styles.outOfStock}>
          {product.stock > 0 ? `${product.stock} units left` : 'Out of Stock'}
        </p>

        {errorMessage && status === 'error' && (
          <p style={styles.errorMessage}>{errorMessage}</p>
        )}

        <div style={styles.actions}>
          {/* Add to Cart Primary Button */}
          <button
            onClick={handleAddToCart}
            disabled={addingToCart || product.stock <= 0}
            style={{
              ...styles.cartBtn,
              backgroundColor: product.stock <= 0 ? '#cbd5e1' : cartSuccess ? '#22c55e' : '#38bdf8',
              cursor: product.stock <= 0 || addingToCart ? 'not-allowed' : 'pointer',
            }}
          >
            {addingToCart ? '⏳ Adding...' : cartSuccess ? '✓ Added to Cart!' : product.stock <= 0 ? 'Out of Stock' : '🛒 Add to Cart'}
          </button>

          <div style={styles.secondaryActions}>
            <Link to={`/products/${product._id}`} style={styles.button}>
              View Details
            </Link>

            <button
              onClick={handleToggleWishlist}
              disabled={status === 'saving'}
              style={{
                ...styles.wishlistBtn,
                backgroundColor: status === 'saved' ? '#fdf2f2' : '#ffffff',
                color: status === 'saved' ? '#e74c3c' : '#333333',
                borderColor: status === 'saved' ? '#f8b4b4' : '#cccccc',
                cursor: status === 'saving' ? 'default' : 'pointer',
              }}
            >
              {status === 'saving' && '⏳'}
              {status === 'saved' && '♥'}
              {status === 'idle' && '♡'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  card: {
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#fff',
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: '180px',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  quickWishlistBtn: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    border: '1px solid #eee',
    borderRadius: '50%',
    width: '32px',
    height: '32px',
    fontSize: '16px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  content: {
    padding: '15px',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },
  category: {
    fontSize: '12px',
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  title: {
    fontSize: '16px',
    margin: '5px 0',
    color: '#333',
  },
  price: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#2c3e50',
    margin: '5px 0',
  },
  inStock: {
    fontSize: '12px',
    color: '#27ae60',
    margin: '5px 0 10px 0',
  },
  outOfStock: {
    fontSize: '12px',
    color: '#e74c3c',
    margin: '5px 0 10px 0',
  },
  errorMessage: {
    fontSize: '12px',
    color: '#e74c3c',
    margin: '0 0 8px 0',
  },
  actions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginTop: 'auto',
  },
  secondaryActions: {
    display: 'flex',
    gap: '8px',
  },
  cartBtn: {
    width: '100%',
    padding: '10px 12px',
    border: 'none',
    borderRadius: '6px',
    color: '#0f172a',
    fontWeight: '700',
    fontSize: '14px',
    transition: 'all 0.2s ease',
  },
  button: {
    flex: 1,
    textAlign: 'center',
    padding: '8px 12px',
    backgroundColor: '#0f172a',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '6px',
    fontWeight: '500',
    fontSize: '13px',
  },
  wishlistBtn: {
    padding: '8px 12px',
    border: '1px solid #cccccc',
    borderRadius: '6px',
    fontWeight: '500',
    fontSize: '14px',
    transition: 'all 0.2s ease',
  },
};

export default ProductCard;