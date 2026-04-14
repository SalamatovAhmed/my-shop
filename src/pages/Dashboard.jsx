import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';
import './Dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();
  const { items, total, count } = useCart();
  const [products, setProducts] = useState([]);

  useEffect(() => { api.getProducts().then(p => setProducts(p.slice(0, 4))); }, []);

  const stats = [
    { label: 'Cart Items', value: count, icon: '🛒', color: '#ede9fe' },
    { label: 'Cart Total', value: `$${total.toFixed(2)}`, icon: '💰', color: '#d1fae5' },
    { label: 'Products', value: '20', icon: '📦', color: '#dbeafe' },
    { label: 'Orders', value: '3', icon: '📋', color: '#fce7f3' },
  ];

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <div className="dashboard-header">
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700 }}>Welcome back, {user?.name} 👋</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>Here's what's happening in your account</p>
        </div>
        <Link to="/products" className="btn btn-primary">Browse Products</Link>
      </div>

      <div className="stats-grid" style={{ marginBottom: 40 }}>
        {stats.map(s => (
          <div key={s.label} className="dash-stat" style={{ background: s.color }}>
            <span style={{ fontSize: 28 }}>{s.icon}</span>
            <div>
              <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)' }}>{s.value}</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <div>
          <h2 style={{ fontWeight: 600, marginBottom: 16 }}>Recent Products</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {products.map(p => (
              <Link key={p.id} to={`/products/${p.id}`} className="card dash-product">
                <img src={p.image} alt={p.title} style={{ width: 48, height: 48, objectFit: 'contain' }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 14, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</p>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>${p.price}</p>
                </div>
                <span style={{ color: 'var(--primary)', fontWeight: 600 }}>→</span>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 style={{ fontWeight: 600, marginBottom: 16 }}>Cart Summary</h2>
          <div className="card">
            {items.length === 0 ? (
              <div className="empty-state" style={{ padding: '30px 0' }}>
                <span style={{ fontSize: 32 }}>🛒</span>
                <p>Cart is empty</p>
              </div>
            ) : (
              items.slice(0, 3).map(item => (
                <div key={item.id} style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'center' }}>
                  <img src={item.image} alt={item.title} style={{ width: 40, height: 40, objectFit: 'contain', background: 'var(--bg-secondary)', borderRadius: 8, padding: 4 }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</p>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>qty: {item.qty} × ${item.price}</p>
                  </div>
                </div>
              ))
            )}
            {items.length > 0 && (
              <Link to="/cart" className="btn btn-outline" style={{ width: '100%', marginTop: 8 }}>View Cart →</Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}