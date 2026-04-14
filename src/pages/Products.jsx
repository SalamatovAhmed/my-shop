import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useDebounce } from '../hooks/useDebounce';
import './Products.css';

const PER_PAGE = 8;

export default function Products() {
  const { isAdmin } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('default');
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    Promise.all([api.getProducts(), api.getCategories()])
      .then(([prods, cats]) => { setProducts(prods); setCategories(cats); })
      .catch(() => setError('Failed to load products'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    await api.deleteProduct(id);
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const filtered = useMemo(() => {
    let result = [...products];
    if (category !== 'all') result = result.filter(p => p.category === category);
    if (debouncedSearch) result = result.filter(p =>
      p.title.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
    if (sort === 'price-asc') result.sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') result.sort((a, b) => b.price - a.price);
    if (sort === 'rating') result.sort((a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0));
    return result;
  }, [products, category, debouncedSearch, sort]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;
  if (error) return <div className="loading-center" style={{ color: 'var(--error)' }}>{error}</div>;

  return (
    <div className="products-page container" style={{ padding: '40px 20px' }}>
      <div className="products-header">
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700 }}>All Products</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>{filtered.length} products found</p>
        </div>
        {isAdmin && (
          <Link to="/products/create" className="btn btn-primary">+ Add Product</Link>
        )}
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          className="search-input"
        />
        <select value={category} onChange={e => { setCategory(e.target.value); setPage(1); }} className="filter-select">
          <option value="all">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={sort} onChange={e => setSort(e.target.value)} className="filter-select">
          <option value="default">Sort: Default</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Best Rating</option>
        </select>
      </div>

      {paginated.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <p>No products found. Try different filters.</p>
        </div>
      ) : (
        <div className="products-grid">
          {paginated.map(p => (
            <ProductCard key={p.id} product={p} isAdmin={isAdmin} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button className="btn btn-outline btn-sm" onClick={() => setPage(p => p - 1)} disabled={page === 1}>‹ Prev</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button key={p} className={`btn btn-sm ${p === page ? 'btn-primary' : 'btn-outline'}`} onClick={() => setPage(p)}>{p}</button>
          ))}
          <button className="btn btn-outline btn-sm" onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>Next ›</button>
        </div>
      )}
    </div>
  );
}