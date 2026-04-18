import { useState, useEffect, useMemo } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useItems } from '../context/ItemsContext';
import './Admin.css';

export default function Admin() {
  const { isAdmin } = useAuth();
  const { myItems, deleteItem: deleteMyItem } = useItems();

  // ── все хуки сверху, до любых return ──
  const [apiProducts, setApiProducts] = useState([]);
  const [users, setUsers]             = useState([]);
  const [tab, setTab]                 = useState('products');
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState('');
  const [filterCat, setFilterCat]     = useState('all');
  const [sortField, setSortField]     = useState('default');
  const [sortDir, setSortDir]         = useState('asc');
  const [confirmId, setConfirmId]     = useState(null);
  const [confirmType, setConfirmType] = useState('');

  useEffect(() => {
    Promise.all([api.getProducts(), api.getUsers()])
      .then(([p, u]) => { setApiProducts(p); setUsers(u); })
      .finally(() => setLoading(false));
  }, []);

  const allProducts = [...apiProducts, ...myItems];
  const categories  = [...new Set(allProducts.map(p => p.category).filter(Boolean))];

  const filteredProducts = useMemo(() => {
    let list = [...allProducts];

    // фильтр по категории
    if (filterCat !== 'all') list = list.filter(p => p.category === filterCat);

    // поиск по названию
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p => p.title?.toLowerCase().includes(q));
    }

    // сортировка
    if (sortField === 'price') {
      list.sort((a, b) => sortDir === 'asc' ? a.price - b.price : b.price - a.price);
    } else if (sortField === 'title') {
      list.sort((a, b) => {
        const res = a.title?.localeCompare(b.title);
        return sortDir === 'asc' ? res : -res;
      });
    } else if (sortField === 'rating') {
      list.sort((a, b) => {
        const res = (a.rating?.rate || 0) - (b.rating?.rate || 0);
        return sortDir === 'asc' ? res : -res;
      });
    } else if (sortField === 'id') {
      list.sort((a, b) => sortDir === 'asc' ? a.id - b.id : b.id - a.id);
    }

    return list;
  }, [allProducts, filterCat, search, sortField, sortDir]);

  const filteredUsers = useMemo(() => {
    if (!search.trim()) return users;
    const q = search.toLowerCase();
    return users.filter(u =>
      u.email?.toLowerCase().includes(q) ||
      `${u.name?.firstname} ${u.name?.lastname}`.toLowerCase().includes(q) ||
      u.address?.city?.toLowerCase().includes(q)
    );
  }, [users, search]);

  // ── теперь можно редирект ──
  if (!isAdmin) return <Navigate to="/dashboard" replace />;

  // ── handlers ──
  const handleDeleteProduct = async (id, isCustom) => {
    if (isCustom) {
      deleteMyItem(id);
    } else {
      await api.deleteProduct(id);
      setApiProducts(prev => prev.filter(p => p.id !== id));
    }
    setConfirmId(null);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const resetFilters = () => {
    setSearch('');
    setFilterCat('all');
    setSortField('default');
    setSortDir('asc');
  };

  const filtersActive = search || filterCat !== 'all' || sortField !== 'default';

  // ── sub-components ──
  const SortIcon = ({ field }) => {
    if (sortField !== field) return <span className="sort-icon inactive">⇅</span>;
    return <span className="sort-icon active">{sortDir === 'asc' ? '▲' : '▼'}</span>;
  };

  const stats = [
    { label: 'Total Products', value: allProducts.length,  icon: '📦', bg: '#ede9fe' },
    { label: 'Custom Items',   value: myItems.length,       icon: '✏️', bg: '#dbeafe' },
    { label: 'Users',          value: users.length,         icon: '👥', bg: '#d1fae5' },
    { label: 'Categories',     value: categories.length,    icon: '🏷️', bg: '#fce7f3' },
  ];

  return (
    <div className="container" style={{ padding: '40px 20px' }}>

      {/* ── Header ── */}
      <div className="admin-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <span style={{ fontSize: 24 }}>🛡️</span>
            <h1 style={{ fontSize: 28, fontWeight: 700 }}>Admin Panel</h1>
          </div>
          <p style={{ color: 'var(--text-muted)' }}>Full control over your store</p>
        </div>
        <Link to="/products/create" className="btn btn-primary">+ Add Product</Link>
      </div>

      {/* ── Stats ── */}
      <div className="admin-stats-grid">
        {stats.map(s => (
          <div key={s.label} className="admin-stat-card" style={{ background: s.bg }}>
            <span className="admin-stat-icon">{s.icon}</span>
            <div>
              <div className="admin-stat-value">{s.value}</div>
              <div className="admin-stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Tabs ── */}
      <div className="admin-tabs">
        {[
          { key: 'products', label: `Products (${allProducts.length})` },
          { key: 'users',    label: `Users (${users.length})` },
        ].map(t => (
          <button
            key={t.key}
            className={`tab-btn ${tab === t.key ? 'active' : ''}`}
            onClick={() => { setTab(t.key); resetFilters(); }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Filters bar ── */}
      <div className="admin-filters">
        <input
          type="text"
          placeholder={tab === 'products' ? 'Search by title...' : 'Search by name, email, city...'}
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="search-input"
          style={{ flex: 1, minWidth: 200 }}
        />

        {tab === 'products' && (
          <>
            {/* Category filter */}
            <select
              value={filterCat}
              onChange={e => setFilterCat(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Categories</option>
              {categories.map(c => (
                <option key={c} value={c} style={{ textTransform: 'capitalize' }}>{c}</option>
              ))}
            </select>

            {/* Sort select */}
            <select
              value={`${sortField}|${sortDir}`}
              onChange={e => {
                const [f, d] = e.target.value.split('|');
                setSortField(f);
                setSortDir(d);
              }}
              className="filter-select"
            >
              <option value="default|asc">Sort: Default</option>
              <option value="title|asc">Title: A → Z</option>
              <option value="title|desc">Title: Z → A</option>
              <option value="price|asc">Price: Low → High</option>
              <option value="price|desc">Price: High → Low</option>
              <option value="rating|desc">Rating: Best first</option>
              <option value="rating|asc">Rating: Worst first</option>
              <option value="id|asc">ID: Ascending</option>
              <option value="id|desc">ID: Descending</option>
            </select>
          </>
        )}

        {filtersActive && (
          <button className="btn btn-outline btn-sm" onClick={resetFilters}>
            ✕ Reset
          </button>
        )}
      </div>

      {/* ── Result count ── */}
      <p className="admin-result-count">
        {tab === 'products'
          ? `Showing ${filteredProducts.length} of ${allProducts.length} products`
          : `Showing ${filteredUsers.length} of ${users.length} users`
        }
        {filtersActive && tab === 'products' && (
          <span className="filter-active-badge">Filters active</span>
        )}
      </p>

      {/* ── Content ── */}
      {loading ? (
        <div className="loading-center"><div className="spinner" /></div>
      ) : tab === 'products' ? (

        filteredProducts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <p>No products found. Try different filters.</p>
            <button className="btn btn-outline btn-sm" onClick={resetFilters}>Clear Filters</button>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th
                    className="sortable-th"
                    onClick={() => handleSort('id')}
                  >
                    ID <SortIcon field="id" />
                  </th>
                  <th>Image</th>
                  <th
                    className="sortable-th"
                    onClick={() => handleSort('title')}
                  >
                    Title <SortIcon field="title" />
                  </th>
                  <th>Category</th>
                  <th
                    className="sortable-th"
                    onClick={() => handleSort('price')}
                  >
                    Price <SortIcon field="price" />
                  </th>
                  <th
                    className="sortable-th"
                    onClick={() => handleSort('rating')}
                  >
                    Rating <SortIcon field="rating" />
                  </th>
                  <th>Source</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(p => {
                  const isCustom = String(p.id).startsWith('custom_');
                  return (
                    <tr key={p.id}>
                      <td className="td-muted">{isCustom ? '—' : p.id}</td>
                      <td>
                        <div className="admin-product-img-wrap">
                          <img
                            src={p.image || 'https://via.placeholder.com/44'}
                            alt=""
                            className="admin-product-img"
                          />
                        </div>
                      </td>
                      <td>
                        <div className="admin-product-title">{p.title}</div>
                      </td>
                      <td>
                        <span className="badge badge-primary admin-cat-badge">
                          {p.category}
                        </span>
                      </td>
                      <td className="td-price">${Number(p.price).toFixed(2)}</td>
                      <td>
                        <div className="admin-rating">
                          <span className="admin-stars">
                            {'★'.repeat(Math.round(p.rating?.rate || 0))}
                            {'☆'.repeat(5 - Math.round(p.rating?.rate || 0))}
                          </span>
                          <span className="td-muted">({p.rating?.count || 0})</span>
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${isCustom ? 'badge-warning' : 'badge-success'}`}>
                          {isCustom ? 'Custom' : 'API'}
                        </span>
                      </td>
                      <td>
                        <div className="admin-row-actions">
                          <Link to={`/products/${p.id}`} className="btn btn-outline btn-sm">View</Link>
                          {!isCustom && (
                            <Link to={`/products/${p.id}/edit`} className="btn btn-outline btn-sm">Edit</Link>
                          )}
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => { setConfirmId(p.id); setConfirmType(isCustom ? 'custom' : 'api'); }}
                          >
                            Del
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )

      ) : (

        filteredUsers.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👥</div>
            <p>No users found.</p>
            <button className="btn btn-outline btn-sm" onClick={resetFilters}>Clear Search</button>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Avatar</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>City</th>
                  <th>Phone</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(u => (
                  <tr key={u.id}>
                    <td className="td-muted">{u.id}</td>
                    <td>
                      <div className="admin-user-avatar">
                        {u.name?.firstname?.[0]?.toUpperCase()}
                      </div>
                    </td>
                    <td style={{ fontWeight: 500 }}>
                      {u.name?.firstname} {u.name?.lastname}
                    </td>
                    <td className="td-muted">{u.email}</td>
                    <td>{u.address?.city}</td>
                    <td className="td-muted">{u.phone}</td>
                    <td><span className="badge badge-primary">user</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      {/* ── Delete confirmation modal ── */}
      {confirmId && (
        <div className="admin-modal-overlay">
          <div className="admin-modal card">
            <div style={{ fontSize: 44, marginBottom: 12 }}>🗑️</div>
            <h2 style={{ fontWeight: 700, marginBottom: 8 }}>Delete Product?</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: 28, fontSize: 14 }}>
              This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button
                className="btn btn-danger"
                onClick={() => handleDeleteProduct(confirmId, confirmType === 'custom')}
              >
                Yes, Delete
              </button>
              <button className="btn btn-outline" onClick={() => setConfirmId(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}