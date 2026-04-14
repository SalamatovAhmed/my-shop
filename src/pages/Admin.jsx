import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import './Admin.css';

export default function Admin() {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [tab, setTab] = useState('products');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getProducts(), api.getUsers()])
      .then(([p, u]) => { setProducts(p); setUsers(u); })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    await api.deleteProduct(id);
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const stats = [
    { label: 'Total Products', value: products.length, color: '#ede9fe' },
    { label: 'Total Users', value: users.length, color: '#d1fae5' },
    { label: 'Categories', value: 4, color: '#dbeafe' },
    { label: 'Avg Price', value: products.length ? `$${(products.reduce((s, p) => s + p.price, 0) / products.length).toFixed(2)}` : '-', color: '#fce7f3' },
  ];

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700 }}>Admin Panel</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>Manage your store</p>
        </div>
        <Link to="/products/create" className="btn btn-primary">+ Add Product</Link>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 36 }}>
        {stats.map(s => (
          <div key={s.label} className="card" style={{ background: s.color, border: 'none' }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--text)' }}>{s.value}</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        <button className={`tab-btn ${tab === 'products' ? 'active' : ''}`} onClick={() => setTab('products')}>Products ({products.length})</button>
        <button className={`tab-btn ${tab === 'users' ? 'active' : ''}`} onClick={() => setTab('users')}>Users ({users.length})</button>
      </div>

      {loading ? (
        <div className="loading-center"><div className="spinner" /></div>
      ) : tab === 'products' ? (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th><th>Image</th><th>Title</th><th>Category</th><th>Price</th><th>Rating</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td><img src={p.image} alt="" style={{ width: 40, height: 40, objectFit: 'contain' }} /></td>
                  <td style={{ maxWidth: 200 }}>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 13 }}>{p.title}</div>
                  </td>
                  <td><span className="badge badge-primary" style={{ textTransform: 'capitalize', fontSize: 11 }}>{p.category}</span></td>
                  <td style={{ fontWeight: 600 }}>${p.price.toFixed(2)}</td>
                  <td>{'★'.repeat(Math.round(p.rating?.rate || 0))} <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>({p.rating?.count})</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <Link to={`/products/${p.id}`} className="btn btn-outline btn-sm">View</Link>
                      <Link to={`/products/${p.id}/edit`} className="btn btn-outline btn-sm">Edit</Link>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)}>Del</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>ID</th><th>Name</th><th>Email</th><th>City</th><th>Phone</th></tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td style={{ fontWeight: 500 }}>{u.name?.firstname} {u.name?.lastname}</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{u.email}</td>
                  <td>{u.address?.city}</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{u.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}