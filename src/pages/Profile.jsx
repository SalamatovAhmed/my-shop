import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import { useItems } from '../context/ItemsContext';
import { useCart } from '../context/CartContext';

export default function Profile() {
  const { user, logout, updateProfile } = useAuth();
  const { favorites } = useFavorites();
  const { myItems } = useItems();
  const { count, total } = useCart();
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '' });
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
    return e;
  };

  const handleSave = () => {
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);
    updateProfile(form);
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  const userMyItems = myItems.filter(i => i.ownerId === user?.id);

  const quickStats = [
    { label: 'Cart Items', value: count, link: '/cart', icon: '🛒', bg: '#ede9fe' },
    { label: 'Favorites', value: favorites.length, link: '/favorites', icon: '♥', bg: '#fce7f3' },
    { label: 'My Items', value: userMyItems.length, link: '/my-items', icon: '📦', bg: '#d1fae5' },
    { label: 'Cart Total', value: `$${total.toFixed(2)}`, link: '/cart', icon: '💰', bg: '#dbeafe' },
  ];

  return (
    <div className="container" style={{ padding: '40px 20px', maxWidth: 800 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 32 }}>My Profile</h1>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        {quickStats.map(s => (
          <Link key={s.label} to={s.link} className="card" style={{ background: s.bg, border: 'none', textDecoration: 'none', transition: 'transform 0.2s', display: 'flex', flexDirection: 'column', gap: 4, padding: 16 }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
            <span style={{ fontSize: 22 }}>{s.icon}</span>
            <span style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)' }}>{s.value}</span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.label}</span>
          </Link>
        ))}
      </div>

      {/* Profile Card */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 28 }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--primary)', color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 700, flexShrink: 0 }}>
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <h2 style={{ fontWeight: 700, fontSize: 20 }}>{user?.name}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>{user?.email}</p>
            <span className={`badge ${user?.role === 'admin' ? 'badge-error' : 'badge-primary'}`} style={{ marginTop: 6 }}>
              {user?.role === 'admin' ? '🛡️ Admin' : '👤 User'}
            </span>
          </div>
        </div>

        {saved && (
          <div style={{ background: '#d1fae5', color: '#059669', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 16, fontWeight: 500 }}>
            ✓ Profile updated successfully!
          </div>
        )}

        {editing ? (
          <div>
            <div className="form-group">
              <label>Display Name</label>
              <input value={form.name} onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setErrors({}); }}
                className={errors.name ? 'error' : ''} />
              {errors.name && <span className="error-msg">{errors.name}</span>}
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={form.email} onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setErrors({}); }}
                className={errors.email ? 'error' : ''} />
              {errors.email && <span className="error-msg">{errors.email}</span>}
            </div>
            <div className="form-group">
              <label>Role</label>
              <div style={{ padding: '10px 14px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: 14, color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                {user?.role} (cannot change)
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn btn-primary" onClick={handleSave}>Save Changes</button>
              <button className="btn btn-outline" onClick={() => { setEditing(false); setErrors({}); setForm({ name: user?.name, email: user?.email }); }}>Cancel</button>
            </div>
          </div>
        ) : (
          <div>
            {[['Name', user?.name], ['Email', user?.email], ['Role', user?.role]].map(([label, val]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border)', fontSize: 14 }}>
                <span style={{ color: 'var(--text-muted)' }}>{label}</span>
                <span style={{ fontWeight: 500, textTransform: 'capitalize' }}>{val}</span>
              </div>
            ))}
            <button className="btn btn-outline" style={{ marginTop: 20 }} onClick={() => setEditing(true)}>
              Edit Profile
            </button>
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className="card" style={{ marginBottom: 16 }}>
        <h3 style={{ fontWeight: 600, marginBottom: 16 }}>Quick Navigation</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {[
            { to: '/dashboard', icon: '📊', label: 'Dashboard' },
            { to: '/favorites', icon: '♥', label: 'My Favorites' },
            { to: '/my-items', icon: '📦', label: 'My Items' },
            { to: '/cart', icon: '🛒', label: 'Shopping Cart' },
            ...(user?.role === 'admin' ? [{ to: '/admin', icon: '🛡️', label: 'Admin Panel' }] : []),
          ].map(item => (
            <Link key={item.to} to={item.to} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 8, color: 'var(--text)', fontSize: 14, transition: 'background 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-secondary)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <span style={{ fontSize: 18 }}>{item.icon}</span>
              {item.label}
              <span style={{ marginLeft: 'auto', color: 'var(--text-muted)' }}>→</span>
            </Link>
          ))}
        </div>
      </div>

      <button className="btn btn-danger" onClick={handleLogout} style={{ width: '100%' }}>
        Sign Out
      </button>
    </div>
  );
}