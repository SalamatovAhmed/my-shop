import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const { addItem } = useCart();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    api.getProduct(id).then(setProduct).catch(() => navigate('/404')).finally(() => setLoading(false));
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

  return (
    <div className="detail-page container" style={{ padding: '40px 20px' }}>
      <Link to="/products" className="back-link">← Back to Products</Link>

      <div className="detail-grid">
        <div className="detail-img-wrap">
          <img src={product.image} alt={product.title} className="detail-img" />
        </div>

        <div className="detail-content">
          <span className="badge badge-primary" style={{ marginBottom: 12, textTransform: 'capitalize' }}>
            {product.category}
          </span>
          <h1 className="detail-title">{product.title}</h1>

          <div className="detail-rating">
            <span style={{ color: '#f59e0b' }}>{'★'.repeat(Math.round(product.rating?.rate || 4))}</span>
            <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>
              {product.rating?.rate} ({product.rating?.count} reviews)
            </span>
          </div>

          <div className="detail-price">${product.price?.toFixed(2)}</div>

          <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 24 }}>
            {product.description}
          </p>

          <div className="detail-actions">
            <div className="qty-control">
              <button onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
              <span>{qty}</span>
              <button onClick={() => setQty(q => q + 1)}>+</button>
            </div>
            <button className="btn btn-primary btn-lg" onClick={handleAdd} style={{ flex: 1 }}>
              {added ? '✓ Added!' : 'Add to Cart'}
            </button>
          </div>

          {isAdmin && (
            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
              <Link to={`/products/${id}/edit`} className="btn btn-outline">Edit Product</Link>
              <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}