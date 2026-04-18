import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useItems } from '../context/ItemsContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './MyItems.css';

const CATEGORIES = ['electronics', 'jewelery', "men's clothing", "women's clothing", 'other'];

export default function MyItems() {
  const { myItems, addItem, updateItem, deleteItem } = useItems();
  const { user } = useAuth();
  const { addItem: addToCart } = useCart();

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [sort, setSort] = useState('newest');
  const [confirmId, setConfirmId] = useState(null);

  const emptyForm = { title: '', price: '', description: '', category: '', image: '' };
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  // Filter & Sort
  const filtered = myItems
    .filter(i => i.ownerId === user?.id || user?.role === 'admin')
    .filter(i => filterCat === 'all' || i.category === filterCat)
    .filter(i => i.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sort === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      if (sort === 'price-asc') return Number(a.price) - Number(b.price);
      if (sort === 'price-desc') return Number(b.price) - Number(a.price);
      if (sort === 'alpha') return a.title.localeCompare(b.title);
      return 0;
    });

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.price || isNaN(form.price) || +form.price <= 0) e.price = 'Valid price required';
    if (!form.category) e.category = 'Select a category';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);

    if (editId) {
      updateItem(editId, { ...form, price: Number(form.price) });
    } else {
      addItem({ ...form, price: Number(form.price), ownerId: user.id, ownerName: user.name,
        image: form.image || 'https://via.placeholder.com/300x300?text=Product',
        rating: { rate: 0, count: 0 }
      });
    }
    setForm(emptyForm);
    setEditId(null);
    setShowForm(false);
    setErrors({});
  };

  const startEdit = (item) => {
    setForm({ title: item.title, price: item.price, description: item.description, category: item.category, image: item.image });
    setEditId(item.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    deleteItem(id);
    setConfirmId(null);
  };

  const resetFilters = () => { setSearch(''); setFilterCat('all'); setSort('newest'); };

  const set = (field, val) => {
    setForm(f => ({ ...f, [field]: val }));
    setErrors(e => ({ ...e, [field]: '' }));
  };

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      {/* Header */}
      <div className="myitems-header">
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700 }}>My Items</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>{filtered.length} item{filtered.length !== 1 ? 's' : ''}</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setShowForm(!showForm); setEditId(null); setForm(emptyForm); }}>
          {showForm ? '✕ Cancel' : '+ Add Item'}
        </button>
      </div>

      {/* Create/Edit Form */}
      {showForm && (
        <div className="card myitems-form">
          <h2 style={{ fontWeight: 600, marginBottom: 20 }}>{editId ? 'Edit Item' : 'Add New Item'}</h2>
          <form onSubmit={handleSubmit} noValidate>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Title</label>
                <input type="text" value={form.title} onChange={e => set('title', e.target.value)}
                  placeholder="Product title" className={errors.title ? 'error' : ''} />
                {errors.title && <span className="error-msg">{errors.title}</span>}
              </div>
              <div className="form-group">
                <label>Price ($)</label>
                <input type="number" value={form.price} onChange={e => set('price', e.target.value)}
                  placeholder="9.99" min="0" step="0.01" className={errors.price ? 'error' : ''} />
                {errors.price && <span className="error-msg">{errors.price}</span>}
              </div>
              <div className="form-group">
                <label>Category</label>
                <select value={form.category} onChange={e => set('category', e.target.value)} className={errors.category ? 'error' : ''}>
                  <option value="">Select...</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.category && <span className="error-msg">{errors.category}</span>}
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Image URL <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span></label>
                <input type="text" value={form.image} onChange={e => set('image', e.target.value)} placeholder="https://..." />
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Description</label>
                <textarea value={form.description} onChange={e => set('description', e.target.value)}
                  placeholder="Describe your product..." rows={3} style={{ resize: 'vertical' }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
              <button type="submit" className="btn btn-primary">{editId ? 'Save Changes' : 'Add Item'}</button>
              <button type="button" className="btn btn-outline" onClick={() => { setShowForm(false); setEditId(null); setForm(emptyForm); setErrors({}); }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="myitems-filters">
        <input
          type="text" placeholder="Search my items..." value={search}
          onChange={e => setSearch(e.target.value)} className="search-input" style={{ flex: 1, minWidth: 180 }}
        />
        <select value={filterCat} onChange={e => setFilterCat(e.target.value)} className="filter-select">
          <option value="all">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={sort} onChange={e => setSort(e.target.value)} className="filter-select">
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="price-asc">Price ↑</option>
          <option value="price-desc">Price ↓</option>
          <option value="alpha">A → Z</option>
        </select>
        {(search || filterCat !== 'all' || sort !== 'newest') && (
          <button className="btn btn-outline btn-sm" onClick={resetFilters}>Reset</button>
        )}
      </div>

      {/* Items List */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h2 style={{ fontSize: 20, fontWeight: 600 }}>
            {myItems.length === 0 ? 'No items yet' : 'No items match filters'}
          </h2>
          <p style={{ color: 'var(--text-muted)' }}>
            {myItems.length === 0 ? 'Create your first item using the button above' : 'Try changing filters or search query'}
          </p>
          {myItems.length > 0 && <button className="btn btn-outline" onClick={resetFilters}>Clear Filters</button>}
        </div>
      ) : (
        <div className="myitems-grid">
          {filtered.map(item => (
            <div key={item.id} className="myitem-card card">
              <div className="myitem-img-wrap">
                <img src={item.image || 'https://via.placeholder.com/300x300?text=Product'} alt={item.title} className="myitem-img" />
                <span className="myitem-owner-badge">Mine</span>
              </div>
              <div className="myitem-body">
                <div>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'capitalize', fontWeight: 500 }}>{item.category}</span>
                  <h3 style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.4, margin: '4px 0 6px',
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {item.title}
                  </h3>
                  {item.description && (
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5,
                      display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {item.description}
                    </p>
                  )}
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <span style={{ fontWeight: 700, fontSize: 18, color: 'var(--primary)' }}>${Number(item.price).toFixed(2)}</span>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-primary btn-sm" style={{ flex: 1 }} onClick={() => addToCart(item)}>Add to Cart</button>
                    <button className="btn btn-outline btn-sm" onClick={() => startEdit(item)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => setConfirmId(item.id)}>Del</button>
                  </div>
                </div>
              </div>

              {/* Confirm Delete */}
              {confirmId === item.id && (
                <div className="confirm-overlay">
                  <div className="confirm-box">
                    <p style={{ fontWeight: 600, marginBottom: 16 }}>Delete this item?</p>
                    <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.id)}>Yes, Delete</button>
                      <button className="btn btn-outline btn-sm" onClick={() => setConfirmId(null)}>Cancel</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}