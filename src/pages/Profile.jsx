import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="container" style={{ padding: '40px 20px', maxWidth: 600 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 32 }}>My Profile</h1>

      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 28 }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 700 }}>
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <h2 style={{ fontWeight: 700, fontSize: 20 }}>{user?.name}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>{user?.email}</p>
            <span className={`badge ${user?.role === 'admin' ? 'badge-error' : 'badge-primary'}`} style={{ marginTop: 6 }}>
              {user?.role}
            </span>
          </div>
        </div>

        {saved && <div className="alert-success" style={{ marginBottom: 16, background: '#d1fae5', color: '#059669', padding: '10px 14px', borderRadius: 8, fontSize: 13 }}>Profile saved!</div>}

        <div className="form-group">
          <label>Display Name</label>
          {editing ? (
            <input value={name} onChange={e => setName(e.target.value)} autoFocus />
          ) : (
            <div style={{ padding: '10px 14px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: 14, color: 'var(--text)' }}>{name}</div>
          )}
        </div>
        <div className="form-group">
          <label>Email</label>
          <div style={{ padding: '10px 14px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: 14, color: 'var(--text-muted)' }}>{user?.email}</div>
        </div>
        <div className="form-group">
          <label>Role</label>
          <div style={{ padding: '10px 14px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: 14, color: 'var(--text-muted)', textTransform: 'capitalize' }}>{user?.role}</div>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          {editing ? (
            <>
              <button className="btn btn-primary" onClick={handleSave}>Save Changes</button>
              <button className="btn btn-outline" onClick={() => setEditing(false)}>Cancel</button>
            </>
          ) : (
            <button className="btn btn-outline" onClick={() => setEditing(true)}>Edit Profile</button>
          )}
        </div>
      </div>

      <button className="btn btn-danger" onClick={handleLogout} style={{ width: '100%' }}>Sign Out</button>
    </div>
  );
}