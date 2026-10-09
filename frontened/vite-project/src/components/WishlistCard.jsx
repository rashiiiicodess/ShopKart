import { Link } from 'react-router-dom';

const WishlistCard = ({ product, onRemove, isRemoving }) => {
  return (
    <div style={styles.card}>
      <div style={styles.imageContainer}>
        <img
          src={product.image || 'https://via.placeholder.com/300x200?text=No+Image'}
          alt={product.name}
          style={styles.image}
        />
        <span style={styles.categoryBadge}>{product.category}</span>
      </div>

      <div style={styles.content}>
        <h3 style={styles.title}>{product.name}</h3>
        <p style={styles.price}>₹{product.price?.toLocaleString('en-IN')}</p>
        
        <p style={styles.stockStatus}>
          {product.stock > 0 ? (
            <span style={{ color: '#10b981' }}>● {product.stock} units left</span>
          ) : (
            <span style={{ color: '#ef4444' }}>● Out of stock</span>
          )}
        </p>

        <div style={styles.actions}>
          <Link to={`/products/${product._id}`} style={styles.viewBtn}>
            View Details
          </Link>
          
          <button
            onClick={() => onRemove(product._id)}
            disabled={isRemoving}
            style={{
              ...styles.removeBtn,
              opacity: isRemoving ? 0.6 : 1,
              cursor: isRemoving ? 'not-allowed' : 'pointer',
            }}
          >
            {isRemoving ? '⏳ Removing...' : '♥ Remove'}
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: '#1e293b',
    borderRadius: '16px',
    border: '1px solid #334155',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: '180px',
    backgroundColor: '#0f172a',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  categoryBadge: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    color: '#38bdf8',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: '600',
    border: '1px solid rgba(56, 189, 248, 0.3)',
  },
  content: {
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },
  title: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#ffffff',
    margin: '0 0 0.5rem 0',
  },
  price: {
    fontSize: '1.2rem',
    fontWeight: '800',
    color: '#38bdf8',
    margin: '0 0 0.5rem 0',
  },
  stockStatus: {
    fontSize: '0.85rem',
    margin: '0 0 1.25rem 0',
  },
  actions: {
    display: 'flex',
    gap: '0.75rem',
    marginTop: 'auto',
  },
  viewBtn: {
    flex: 1,
    textAlign: 'center',
    padding: '0.6rem 0',
    backgroundColor: '#334155',
    color: '#ffffff',
    borderRadius: '8px',
    textDecoration: 'none',
    fontSize: '0.875rem',
    fontWeight: '600',
  },
  removeBtn: {
    flex: 1,
    padding: '0.6rem 0',
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    color: '#f87171',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '8px',
    fontSize: '0.875rem',
    fontWeight: '600',
  },
};

export default WishlistCard;