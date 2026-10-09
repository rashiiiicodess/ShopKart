import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchWishlist, removeFromWishlistApi } from '../services/wishlistService';
import WishlistCard from '../components/WishlistCard';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [removingId, setRemovingId] = useState(null);

  const loadWishlist = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchWishlist();
      // Filter out any null objects (e.g. if a product was deleted from DB)
      setWishlist((data.wishlist || []).filter((item) => item !== null));
    } catch (err) {
      setError("We couldn't load your wishlist. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  const handleRemove = async (productId) => {
    setRemovingId(productId);
    try {
      await removeFromWishlistApi(productId);
      setWishlist((prev) => prev.filter((item) => item._id !== productId));
    } catch (err) {
      alert('Failed to remove product from wishlist. Please try again.');
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        {/* Header Section */}
        <div style={styles.header}>
          <h1 style={styles.title}>
            My <span style={styles.titleHighlight}>Wishlist</span> ❤️
          </h1>
          {!loading && !error && (
            <p style={styles.subtitle}>
              {wishlist.length} {wishlist.length === 1 ? 'product' : 'products'} saved for later
            </p>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div style={styles.stateContainer}>
            <div style={styles.spinner} />
            <p style={styles.stateText}>Loading your wishlist...</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div style={styles.stateContainer}>
            <div style={styles.errorCard}>
              <span style={styles.stateIcon}>⚠️</span>
              <h3 style={styles.errorTitle}>Something went wrong</h3>
              <p style={styles.stateText}>{error}</p>
              <button onClick={loadWishlist} style={styles.retryBtn}>
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && wishlist.length === 0 && (
          <div style={styles.stateContainer}>
            <div style={styles.emptyCard}>
              <span style={styles.emptyHeartIcon}>❤️</span>
              <h2 style={styles.emptyTitle}>Your wishlist is empty</h2>
              <p style={styles.emptySubtitle}>
                Save products you love and find them here later when you are ready to buy.
              </p>
              <Link to="/products" style={styles.browseBtn}>
                Browse Products
              </Link>
            </div>
          </div>
        )}

        {/* Wishlist Product Grid */}
        {!loading && !error && wishlist.length > 0 && (
          <div style={styles.grid}>
            {wishlist.map((product) => (
              <WishlistCard
                key={product._id}
                product={product}
                onRemove={handleRemove}
                isRemoving={removingId === product._id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    minHeight: 'calc(100vh - 70px)',
    backgroundColor: '#0b0f19',
    color: '#f8fafc',
    padding: '3rem 1rem',
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  header: {
    textAlign: 'center',
    marginBottom: '2.5rem',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '800',
    margin: '0 0 0.5rem 0',
  },
  titleHighlight: {
    color: '#38bdf8',
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: '1rem',
    margin: 0,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '2rem',
  },
  stateContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4rem 1rem',
    textAlign: 'center',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid rgba(56, 189, 248, 0.2)',
    borderTop: '3px solid #38bdf8',
    borderRadius: '50%',
    marginBottom: '1rem',
  },
  stateText: {
    color: '#94a3b8',
    fontSize: '1rem',
    margin: '0 0 1.5rem 0',
  },
  errorCard: {
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    border: '1px solid rgba(239, 68, 68, 0.25)',
    borderRadius: '16px',
    padding: '2.5rem',
    maxWidth: '420px',
    width: '100%',
  },
  errorTitle: {
    color: '#ffffff',
    fontSize: '1.25rem',
    margin: '0.5rem 0',
  },
  stateIcon: {
    fontSize: '2rem',
  },
  retryBtn: {
    backgroundColor: '#ef4444',
    color: '#ffffff',
    border: 'none',
    padding: '0.65rem 1.75rem',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  emptyCard: {
    backgroundColor: '#1e293b',
    border: '1px solid #334155',
    borderRadius: '20px',
    padding: '3.5rem 2rem',
    maxWidth: '450px',
    width: '100%',
  },
  emptyHeartIcon: {
    fontSize: '3.5rem',
    display: 'block',
    marginBottom: '1rem',
  },
  emptyTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#ffffff',
    margin: '0 0 0.75rem 0',
  },
  emptySubtitle: {
    color: '#94a3b8',
    fontSize: '0.95rem',
    lineHeight: '1.5',
    margin: '0 0 2rem 0',
  },
  browseBtn: {
    display: 'inline-block',
    backgroundColor: '#38bdf8',
    color: '#0f172a',
    padding: '0.75rem 2rem',
    borderRadius: '10px',
    fontWeight: '700',
    textDecoration: 'none',
  },
};

export default Wishlist;