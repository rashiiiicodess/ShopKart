import { useState, useEffect, useContext } from 'react';
import { fetchProducts } from '../services/productService';
import { fetchWishlist } from '../services/wishlistService';
import { AuthContext } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';

const Products = () => {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('');

  // Fetch user's wishlist IDs on mount
  useEffect(() => {
    const loadWishlistIds = async () => {
      if (!user) return;
      try {
        const data = await fetchWishlist();
        const ids = (data.wishlist || []).map((item) => (item._id ? item._id : item));
        setWishlistIds(ids);
      } catch (err) {
        console.error('Failed to fetch wishlist state:', err);
      }
    };

    loadWishlistIds();
  }, [user]);

  // Fetch products with search/filter parameters
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError('');
      try {
        const params = {};
        if (search.trim()) params.search = search;
        if (category !== 'All') params.category = category;
        if (sort) params.sort = sort;

        const data = await fetchProducts(params);
        setProducts(data.products || []);
      } catch (err) {
        setError('Something went wrong while loading products.');
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      loadProducts();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, category, sort]);

  // Update local wishlist state when user clicks heart icon in a card
  const handleWishlistToggle = (productId, isAdded) => {
    setWishlistIds((prev) =>
      isAdded ? [...prev, productId] : prev.filter((id) => id !== productId)
    );
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        {/* Page Title & Subtitle Header */}
        <div style={styles.header}>
          <h2 style={styles.title}>
            Explore <span style={styles.titleHighlight}>Products</span>
          </h2>
          <p style={styles.subtitle}>
            Browse through our premium selection with real-time filtering and search.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div style={styles.searchBarWrapper}>
          <SearchBar
            search={search}
            setSearch={setSearch}
            category={category}
            setCategory={setCategory}
            sort={sort}
            setSort={setSort}
          />
        </div>

        {/* Loading State */}
        {loading && (
          <div style={styles.stateContainer}>
            <div style={styles.spinner} />
            <p style={styles.loadingMessage}>Loading products...</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div style={styles.stateContainer}>
            <div style={styles.errorCard}>
              <span style={styles.errorIcon}>⚠️</span>
              <p style={styles.errorMessage}>{error}</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && products.length === 0 && (
          <div style={styles.stateContainer}>
            <div style={styles.emptyCard}>
              <span style={styles.emptyIcon}>🔍</span>
              <h3 style={styles.emptyTitle}>No products found</h3>
              <p style={styles.emptySubtitle}>
                Try adjusting your search terms or filter selections.
              </p>
            </div>
          </div>
        )}

        {/* Product Cards Grid */}
        {!loading && !error && products.length > 0 && (
          <div style={styles.grid}>
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                initialIsWishlisted={wishlistIds.includes(product._id)}
                onWishlistToggle={handleWishlistToggle}
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
    padding: '2.5rem 1rem',
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
  },
  header: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  title: {
    fontSize: '2.25rem',
    fontWeight: '800',
    letterSpacing: '-0.5px',
    color: '#ffffff',
    margin: '0 0 0.5rem 0',
  },
  titleHighlight: {
    color: '#38bdf8',
  },
  subtitle: {
    fontSize: '1rem',
    color: '#94a3b8',
    margin: 0,
  },
  searchBarWrapper: {
    marginBottom: '2.5rem',
    backgroundColor: '#1e293b',
    padding: '1.25rem',
    borderRadius: '16px',
    border: '1px solid #334155',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: '1.75rem',
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
  loadingMessage: {
    fontSize: '1.1rem',
    color: '#94a3b8',
    margin: 0,
    fontWeight: '500',
  },
  errorMessage: {
    fontSize: '1.05rem',
    color: '#f87171',
    margin: 0,
    fontWeight: '500',
  },
  errorCard: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '12px',
    padding: '1.5rem 2.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  errorIcon: {
    fontSize: '1.5rem',
  },
  emptyCard: {
    backgroundColor: '#1e293b',
    border: '1px solid #334155',
    borderRadius: '16px',
    padding: '3rem 2rem',
    maxWidth: '400px',
    width: '100%',
  },
  emptyIcon: {
    fontSize: '2.5rem',
    display: 'block',
    marginBottom: '1rem',
  },
  emptyTitle: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#ffffff',
    margin: '0 0 0.5rem 0',
  },
  emptySubtitle: {
    fontSize: '0.925rem',
    color: '#94a3b8',
    margin: 0,
  },
};

export default Products;