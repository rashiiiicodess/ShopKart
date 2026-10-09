import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const { user } = useContext(AuthContext);

  // Helper to get initials for the avatar badge
  const initials = user?.fullName
    ? user.fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  return (
    <div style={styles.container}>
      {/* Hero Welcome Header */}
      <div style={styles.heroSection}>
        <h1 style={styles.title}>
          Welcome to Shop<span style={styles.titleHighlight}>Kart</span>,{' '}
          {user?.fullName || 'Valued Customer'}!
        </h1>
        <p style={styles.subtitle}>
          Manage your account details and explore top products from your dashboard.
        </p>
      </div>

      {/* Customer Profile Card */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <div style={styles.avatarLarge}>{initials}</div>
          <div>
            <h3 style={styles.cardTitle}>Customer Profile</h3>
            <span style={styles.badge}>Active Member</span>
          </div>
        </div>

        <div style={styles.divider} />

        <div style={styles.infoGroup}>
          <div style={styles.infoRow}>
            <span style={styles.label}>Full Name</span>
            <span style={styles.value}>{user?.fullName || 'N/A'}</span>
          </div>

          <div style={styles.infoRow}>
            <span style={styles.label}>Email Address</span>
            <span style={styles.value}>{user?.email || 'N/A'}</span>
          </div>

          <div style={styles.infoRow}>
            <span style={styles.label}>Phone Number</span>
            <span style={styles.value}>{user?.phone || 'N/A'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: 'calc(100vh - 70px)',
    backgroundColor: '#0b0f19', // Dark background matching the theme
    color: '#f8fafc',
    padding: '3rem 1.5rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  heroSection: {
    textAlign: 'center',
    marginBottom: '2.5rem',
    maxWidth: '600px',
  },
  title: {
    fontSize: '2.25rem',
    fontWeight: '800',
    letterSpacing: '-0.5px',
    color: '#ffffff',
    margin: '0 0 0.5rem 0',
  },
  titleHighlight: {
    color: '#38bdf8', // Accent blue matching the Navbar
  },
  subtitle: {
    fontSize: '1rem',
    color: '#94a3b8',
    margin: 0,
    lineHeight: '1.5',
  },
  card: {
    width: '100%',
    maxWidth: '420px',
    backgroundColor: '#1e293b', // Slate navy card background
    borderRadius: '16px',
    padding: '1.75rem',
    border: '1px solid #334155',
    boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.5)',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  avatarLarge: {
    width: '54px',
    height: '54px',
    borderRadius: '50%',
    backgroundColor: '#38bdf8',
    color: '#0f172a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '800',
    fontSize: '1.25rem',
    boxShadow: '0 0 15px rgba(56, 189, 248, 0.3)',
  },
  cardTitle: {
    margin: '0 0 0.25rem 0',
    fontSize: '1.2rem',
    fontWeight: '700',
    color: '#ffffff',
  },
  badge: {
    display: 'inline-block',
    padding: '0.2rem 0.6rem',
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    color: '#38bdf8',
    fontSize: '0.75rem',
    fontWeight: '600',
    borderRadius: '9999px',
    border: '1px solid rgba(56, 189, 248, 0.3)',
  },
  divider: {
    height: '1px',
    backgroundColor: '#334155',
    margin: '1.25rem 0',
  },
  infoGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  infoRow: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'left',
    gap: '0.25rem',
  },
  label: {
    fontSize: '0.8rem',
    fontWeight: '600',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  value: {
    fontSize: '0.975rem',
    fontWeight: '500',
    color: '#e2e8f0',
    backgroundColor: '#0f172a',
    padding: '0.6rem 0.85rem',
    borderRadius: '8px',
    border: '1px solid #1e293b',
    wordBreak: 'break-all',
  },
};

export default Home;