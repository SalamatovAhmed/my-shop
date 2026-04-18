import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { useItems } from '../context/ItemsContext';
import { api } from '../services/api';

export default function Dashboard() {
  const { user, isAdmin } = useAuth();
  const { items, total, count } = useCart();
  const { favorites } = useFavorites();
  const { myItems } = useItems();
  const [recentProducts, setRecentProducts] = useState([]);

  useEffect(() => { api.getProducts().then(p => setRecentProducts(p.slice(0, 4))); }, []);

  const userMyItems = myItems.filter(i => i.ownerId === user?.id);

  const stats = [
    { label: 'Cart Items', value: count, icon: '🛒', color: '#ede9fe', link: '/cart' },
    { label: 'Cart Total', value: `$${total.toFixed(2)}`, icon: '💰', color: '#d1fae5', link: '/cart' },
    { label: 'Favorites', value: favorites.length, icon: '♥', color: '#fce7f3', link: '/favorites' },
    { label: 'My Items', value: userMyItems.length, icon: '📦', color: '#dbeafe', link: '/my-items' },
  ];

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700 }}>
            Welcome back, {user?.name} {user?.role === 'admin' ? '🛡️' : '👋'}
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>Here's your activity overview</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {isAdmin && <Link to="/admin" className="btn btn-outline">Admin Panel</Link>}
          <Link to="/products" className="btn btn-primary">Browse Products</Link>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 40 }}>
        {stats.map(s => (
          <Link key={s.label} to={s.link} style={{ background: s.color, borderRadius: 12, padding: 20, display: 'flex', alignItems: 'center', gap: 14, textDecoration: 'none', transition: 'transform 0.2s, box-shadow 0.2s', border: '1px solid transparent' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
            <span style={{ fontSize: 28 }}>{s.icon}</span>
            <div>
              <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)' }}>{s.value}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.label}</div>
            </div>
          </Link>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>
        {/* Recent Products */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontWeight: 600 }}>Recent Products</h2>
            <Link to="/products" style={{ color: 'var(--primary)', fontSize: 14 }}>View all →</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {recentProducts.map(p => (
              <Link key={p.id} to={`/products/${p.id}`} className="card" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', textDecoration: 'none', transition: 'box-shadow 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>
                <img src={p.image} alt="" style={{ width: 48, height: 48, objectFit: 'contain', background: 'var(--bg-secondary)', borderRadius: 8, padding: 4, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 14, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text)' }}>{p.title}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'capitalize' }}>{p.category}</p>
                </div>
                <span style={{ fontWeight: 700, color: 'var(--primary)', flexShrink: 0 }}>${p.price.toFixed(2)}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Cart */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h2 style={{ fontWeight: 600 }}>Cart</h2>
              <Link to="/cart" style={{ color: 'var(--primary)', fontSize: 14 }}>View →</Link>
            </div>
            <div className="card" style={{ padding: 16 }}>
              {items.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px 0', fontSize: 14 }}>Cart is empty</div>
              ) : (
                <>
                  {items.slice(0, 3).map(i => (
                    <div key={i.id} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'center' }}>
                      <img src={i.image} alt="" style={{ width: 36, height: 36, objectFit: 'contain', background: 'var(--bg-secondary)', borderRadius: 6, padding: 3 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 12, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{i.title}</p>
                        <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>×{i.qty} · ${(i.price * i.qty).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                  {items.length > 3 && <p style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', marginBottom: 8 }}>+{items.length - 3} more</p>}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, paddingTop: 8, borderTop: '1px solid var(--border)' }}>
                    <span>Total</span><span style={{ color: 'var(--primary)' }}>${total.toFixed(2)}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Favorites preview */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h2 style={{ fontWeight: 600 }}>Favorites</h2>
              <Link to="/favorites" style={{ color: 'var(--primary)', fontSize: 14 }}>View →</Link>
            </div>
            <div className="card" style={{ padding: 16 }}>
              {favorites.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px 0', fontSize: 14 }}>No favorites yet</div>
              ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {favorites.slice(0, 6).map(f => (
                    <Link key={f.id} to={`/products/${f.id}`} style={{ width: 52, height: 52, background: 'var(--bg-secondary)', borderRadius: 8, padding: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img src={f.image} alt="" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                    </Link>
                  ))}
                  {favorites.length > 6 && <div style={{ width: 52, height: 52, background: 'var(--bg-secondary)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>+{favorites.length - 6}</div>}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}