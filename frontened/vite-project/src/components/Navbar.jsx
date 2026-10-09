import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useCart } from '../context/CartContext'; // Import Cart context hook

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartCount } = useCart(); // Get total quantity from CartContext

  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>
        ShopKart <span style={styles.brandDot}>.</span>
      </Link>

      <div style={styles.links}>
        <Link to="/products" style={styles.link}>
          Products
        </Link>

        {user && (
          <>
            <Link to="/wishlist" style={styles.link}>
              Wishlist ❤️
            </Link>

            {/* Dynamic Cart Link with Item Badge */}
            <Link to="/cart" style={styles.link}>
              Cart 🛒
              <span style={styles.cartBadge}>{cartCount}</span>
            </Link>
          </>
        )}

        {user ? (
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Logout
          </button>
        ) : (
          <Link to="/login" style={styles.loginBtn}>
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    height: '70px',
    backgroundColor: '#0f172a',
    borderBottom: '1px solid #334155',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 2rem',
  },
  brand: {
    fontSize: '1.5rem',
    fontWeight: '800',
    color: '#ffffff',
    textDecoration: 'none',
  },
  brandDot: {
    color: '#38bdf8',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
  },
  link: {
    color: '#94a3b8',
    textDecoration: 'none',
    fontWeight: '500',
    fontSize: '0.95rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.35rem',
  },
  cartBadge: {
    backgroundColor: '#38bdf8',
    color: '#0f172a',
    borderRadius: '12px',
    padding: '2px 8px',
    fontSize: '0.75rem',
    fontWeight: '700',
    minWidth: '18px',
    textAlign: 'center',
  },
  logoutBtn: {
    backgroundColor: 'transparent',
    border: '1px solid #334155',
    color: '#f87171',
    padding: '0.45rem 1rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  loginBtn: {
    backgroundColor: '#38bdf8',
    color: '#0f172a',
    padding: '0.45rem 1rem',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '700',
  },
};

export default Navbar;