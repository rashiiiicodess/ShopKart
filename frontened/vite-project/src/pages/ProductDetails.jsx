import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchProductById } from '../services/productService';
import { useCart } from '../context/CartContext';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Cart state handling
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartSuccess, setCartSuccess] = useState(false);
  const [cartError, setCartError] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    const getProduct = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await fetchProductById(id);
        setProduct(data.product);
      } catch (err) {
        setError(err.response?.data?.message || 'Something went wrong while loading product details.');
      } finally {
        setLoading(false);
      }
    };

    getProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (addingToCart || !product || product.stock <= 0) return;

    setAddingToCart(true);
    setCartError('');
    
    const result = await addToCart(product._id);
    setAddingToCart(false);

    if (result.success) {
      setCartSuccess(true);
      setTimeout(() => setCartSuccess(false), 2500);
    } else {
      setCartError(result.message || 'Failed to add item to cart.');
      setTimeout(() => setCartError(''), 3500);
    }
  };

  if (loading) return <div style={styles.centerMessage}>Loading product details...</div>;
  if (error) return <div style={styles.errorMessage}>{error}</div>;
  if (!product) return <div style={styles.centerMessage}>Product not found.</div>;

  const isOutOfStock = product.stock <= 0;

  return (
    <div style={styles.container}>
      <Link to="/products" style={styles.backLink}>&larr; Back to Products</Link>
      
      <div style={styles.detailsCard}>
        <img src={product.image} alt={product.name} style={styles.image} />
        
        <div style={styles.info}>
          <span style={styles.category}>{product.category}</span>
          <h1 style={styles.title}>{product.name}</h1>
          <p style={styles.price}>₹{product.price?.toLocaleString('en-IN')}</p>
          <p style={styles.description}>{product.description}</p>
          
          <p style={isOutOfStock ? styles.outOfStock : styles.inStock}>
            {isOutOfStock ? 'Out of Stock' : `In Stock (${product.stock} units left)`}
          </p>

          {cartError && <p style={styles.cartErrorMessage}>{cartError}</p>}

          <button
            style={{
              ...styles.cartBtn,
              backgroundColor: isOutOfStock
                ? '#cbd5e1'
                : cartSuccess
                ? '#22c55e'
                : '#38bdf8',
              cursor: isOutOfStock || addingToCart ? 'not-allowed' : 'pointer',
            }}
            disabled={isOutOfStock || addingToCart}
            onClick={handleAddToCart}
          >
            {addingToCart
              ? '⏳ Adding to Cart...'
              : cartSuccess
              ? '✓ Added to Cart!'
              : isOutOfStock
              ? 'Out of Stock'
              : '🛒 Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '900px',
    margin: '30px auto',
    padding: '0 20px',
  },
  backLink: {
    display: 'inline-block',
    marginBottom: '20px',
    color: '#38bdf8',
    textDecoration: 'none',
    fontWeight: '600',
  },
  detailsCard: {
    display: 'flex',
    gap: '30px',
    border: '1px solid #334155',
    borderRadius: '12px',
    padding: '24px',
    backgroundColor: '#1e293b',
    color: '#f8fafc',
    flexWrap: 'wrap',
  },
  image: {
    flex: '1',
    minWidth: '280px',
    maxHeight: '400px',
    objectFit: 'cover',
    borderRadius: '8px',
  },
  info: {
    flex: '1',
    minWidth: '280px',
    display: 'flex',
    flexDirection: 'column',
  },
  category: {
    color: '#38bdf8',
    textTransform: 'uppercase',
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.5px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    margin: '10px 0 5px 0',
  },
  price: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#38bdf8',
    margin: '10px 0',
  },
  description: {
    fontSize: '15px',
    lineHeight: '1.6',
    color: '#94a3b8',
    margin: '15px 0',
  },
  inStock: {
    color: '#22c55e',
    fontWeight: 'bold',
    marginBottom: '15px',
  },
  outOfStock: {
    color: '#ef4444',
    fontWeight: 'bold',
    marginBottom: '15px',
  },
  cartBtn: {
    padding: '12px 20px',
    color: '#0f172a',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '700',
    transition: 'all 0.2s ease',
  },
  cartErrorMessage: {
    color: '#ef4444',
    fontSize: '14px',
    marginBottom: '10px',
  },
  centerMessage: {
    textAlign: 'center',
    padding: '50px',
    fontSize: '18px',
    color: '#94a3b8',
  },
  errorMessage: {
    textAlign: 'center',
    padding: '50px',
    fontSize: '18px',
    color: '#ef4444',
  },
};

export default ProductDetails;