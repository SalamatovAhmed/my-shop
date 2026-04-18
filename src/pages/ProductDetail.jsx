import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';
import './ProductDetail.css';

const FAKE_REVIEWS = [
  { id: 1, name: 'Alex M.', avatar: 'A', rating: 5, date: '12 Apr 2024', text: 'Excellent quality! Fits perfectly and the material is very comfortable. Would definitely buy again.' },
  { id: 2, name: 'Sarah K.', avatar: 'S', rating: 4, date: '3 Mar 2024', text: 'Good product overall. Delivery was fast and packaging was solid. Slightly different shade than the photo.' },
  { id: 3, name: 'James R.', avatar: 'J', rating: 5, date: '18 Feb 2024', text: 'Amazing value for money! Already ordered a second one as a gift.' },
  { id: 4, name: 'Maria L.', avatar: 'M', rating: 3, date: '9 Jan 2024', text: 'Decent quality but sizing runs a bit small. Order one size up.' },
];

const RATING_DIST = [
  { stars: 5, pct: 58 },
  { stars: 4, pct: 22 },
  { stars: 3, pct: 11 },
  { stars: 2, pct: 5 },
  { stars: 1, pct: 4 },
];

export default function ProductDetail() {
  const { id } = useParams();
  const { addItem } = useCart();
  const { toggle, isFavorite } = useFavorites();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState('reviews');

  useEffect(() => {
    setLoading(true);
    api.getProduct(id)
      .then(setProduct)
      .catch(() => navigate('/404'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this product?')) return;
    await api.deleteProduct(id);
    navigate('/products');
  };

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;
  if (!product) return null;

  const fav = isFavorite(product.id);
  const stars = Math.round(product.rating?.rate || 4);
  const totalPrice = (Number(product.price) * qty).toFixed(2);

  return (
    <div className="detail-page container">
      <Link to="/products" className="back-link">← Back to Products</Link>

      <div className="detail-grid">

        {/* LEFT */}
        <div className="detail-img-section">
          <div className="detail-img-wrap">
            <img src={product.image} alt={product.title} className="detail-img" />
            <button
              className={`detail-fav-btn ${fav ? 'active' : ''}`}
              onClick={() => toggle(product)}
            >
              {fav ? '♥' : '♡'}
            </button>
          </div>

          <div className="rating-chart-card">
            <p className="rating-chart-title">Rating breakdown</p>
            {RATING_DIST.map(r => (
              <div key={r.stars} className="rating-bar-row">
                <span className="rating-bar-label">{r.stars}★</span>
                <div className="rating-bar-track">
                  <div className="rating-bar-fill" style={{ width: `${r.pct}%` }} />
                </div>
                <span className="rating-bar-pct">{r.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="detail-content">
          <span className="detail-category-badge">{product.category}</span>

          <h1 className="detail-title">{product.title}</h1>

          <div className="detail-rating-row">
            <div className="stars-large">
              {[1,2,3,4,5].map(i => (
                <span key={i} className={i <= stars ? 'star-lg filled' : 'star-lg'}>★</span>
              ))}
            </div>
            <span className="detail-rating-num">{product.rating?.rate}</span>
            <span className="detail-rating-count">({product.rating?.count} reviews)</span>
          </div>

          <p className="detail-description">{product.description}</p>

          <div className="detail-price-block">
            <div className="detail-price-main">
              <span className="detail-unit-price">${Number(product.price).toFixed(2)} each</span>
              <span className="detail-total-price">${totalPrice}</span>
            </div>
            {qty > 1 && (
              <span className="detail-price-note">
                {qty} × ${Number(product.price).toFixed(2)}
              </span>
            )}
          </div>

          <div className="detail-actions">
            <div className="qty-control">
              <button
                className="qty-btn"
                onClick={() => setQty(q => Math.max(1, q - 1))}
                disabled={qty === 1}
              >−</button>
              <span className="qty-value">{qty}</span>
              <button
                className="qty-btn"
                onClick={() => setQty(q => Math.min(99, q + 1))}
              >+</button>
            </div>

            <button
              className={`detail-add-btn ${added ? 'success' : ''}`}
              onClick={handleAdd}
            >
              {added ? '✓ Added to Cart!' : `Add to Cart — $${totalPrice}`}
            </button>

            <button
              className={`detail-fav-inline ${fav ? 'active' : ''}`}
              onClick={() => toggle(product)}
              title={fav ? 'Remove from favorites' : 'Add to favorites'}
            >
              {fav ? '♥' : '♡'}
            </button>
          </div>

          <div className="detail-shipping">
            <div className="shipping-item">
              <span className="shipping-icon">🚚</span>
              <span>Free shipping on orders over $50</span>
            </div>
            <div className="shipping-item">
              <span className="shipping-icon">↩️</span>
              <span>30-day free returns</span>
            </div>
            <div className="shipping-item">
              <span className="shipping-icon">🔒</span>
              <span>Secure checkout</span>
            </div>
          </div>

          {isAdmin && (
            <div className="detail-admin-actions">
              <Link to={`/products/${id}/edit`} className="btn btn-outline">✏ Edit Product</Link>
              <button className="btn btn-danger" onClick={handleDelete}>🗑 Delete</button>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="detail-tabs-section">
        <div className="detail-tabs">
          <button
            className={`detail-tab ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            Customer Reviews ({FAKE_REVIEWS.length})
          </button>
          <button
            className={`detail-tab ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            Rating Stats
          </button>
        </div>

        {activeTab === 'reviews' && (
          <div className="reviews-grid">
            {FAKE_REVIEWS.map(r => (
              <div key={r.id} className="review-card">
                <div className="review-header">
                  <div className="review-avatar">{r.avatar}</div>
                  <div>
                    <p className="review-name">{r.name}</p>
                    <p className="review-date">{r.date}</p>
                  </div>
                  <div className="review-stars">
                    {[1,2,3,4,5].map(i => (
                      <span key={i} style={{ color: i <= r.rating ? '#f59e0b' : 'var(--border)', fontSize: 13 }}>★</span>
                    ))}
                  </div>
                </div>
                <p className="review-text">{r.text}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="stats-chart-wrap">
            <div className="stats-score-big">
              <span className="stats-num">{product.rating?.rate}</span>
              <div>
                <div style={{ display: 'flex', gap: 2, marginBottom: 4 }}>
                  {[1,2,3,4,5].map(i => (
                    <span key={i} style={{ color: i <= stars ? '#f59e0b' : 'var(--border)', fontSize: 22 }}>★</span>
                  ))}
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>{product.rating?.count} total reviews</p>
              </div>
            </div>

            <div className="stats-bar-chart">
              <svg viewBox="0 0 400 180" style={{ width: '100%', height: 'auto' }}>
                {RATING_DIST.map((r, i) => {
                  const barW = r.pct * 2.8;
                  const y = i * 32 + 10;
                  const color = i === 0 ? '#6C63FF' : i === 1 ? '#8b83ff' : i === 2 ? '#f59e0b' : '#d1d5db';
                  return (
                    <g key={r.stars}>
                      <text x="0" y={y + 16} fontSize="12" fill="var(--text-muted)">{r.stars}★</text>
                      <rect x="30" y={y + 4} width="300" height="18" rx="9" fill="var(--border)" />
                      <rect x="30" y={y + 4} width={barW} height="18" rx="9" fill={color} />
                      <text x="338" y={y + 16} fontSize="11" fill="var(--text-muted)">{r.pct}%</text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}