import { useEffect, useState } from 'react';
import { getMyOrdersApi } from '../services/orderService';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getMyOrdersApi();
        setOrders(data.orders || []);
      } catch (err) {
        setError('Failed to load order history.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div style={styles.center}>Loading your orders...</div>;
  if (error) return <div style={{ ...styles.center, color: '#f87171' }}>{error}</div>;
  if (orders.length === 0) return <div style={styles.center}>You have not placed any orders yet. 📦</div>;

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <h1 style={styles.title}>My Orders</h1>
        <div style={styles.list}>
          {orders.map((order) => (
            <div key={order._id} style={styles.orderCard}>
              <div style={styles.header}>
                <div>
                  <span style={styles.orderId}>Order #{order._id}</span>
                  <span style={styles.date}>{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                <span style={order.paymentStatus === 'PAID' ? styles.badgePaid : styles.badgePending}>
                  {order.status}
                </span>
              </div>

              <div style={styles.items}>
                {order.items.map((item) => (
                  <div key={item._id} style={styles.itemRow}>
                    <span>{item.name} × {item.quantity}</span>
                    <span>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>

              <div style={styles.footer}>
                <span>Total Amount:</span>
                <strong style={{ color: '#38bdf8' }}>₹{order.totalAmount.toLocaleString('en-IN')}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  wrapper: { backgroundColor: '#0b0f19', color: '#f8fafc', minHeight: 'calc(100vh - 70px)', padding: '2rem 1rem' },
  container: { maxWidth: '800px', margin: '0 auto' },
  title: { fontSize: '2rem', fontWeight: '800', marginBottom: '1.5rem' },
  center: { textAlign: 'center', marginTop: '4rem', color: '#94a3b8' },
  list: { display: 'flex', flexDirection: 'column', gap: '1.5rem' },
  orderCard: { backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '1.5rem' },
  header: { display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid #334155', paddingBottom: '0.5rem' },
  orderId: { fontWeight: '700', marginRight: '1rem' },
  date: { color: '#94a3b8', fontSize: '0.85rem' },
  badgePaid: { backgroundColor: 'rgba(34, 197, 94, 0.2)', color: '#4ade80', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700' },
  badgePending: { backgroundColor: 'rgba(234, 179, 8, 0.2)', color: '#fde047', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700' },
  items: { marginBottom: '1rem' },
  itemRow: { display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.3rem' },
  footer: { display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #334155', paddingTop: '0.75rem', fontWeight: '700' },
};

export default Orders;