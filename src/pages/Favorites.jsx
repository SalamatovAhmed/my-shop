import { Link } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import { useCart } from '../context/CartContext';
import './Favorites.css';

export default function Favorites() {
  const { favorites, toggle } = useFavorites();
  const { addItem } = useCart();

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700 }}>Favorites</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>{favorites.length} saved items</p>
        </div>
        {favorites.length > 0 && (
          <button className="btn btn-outline btn-sm" onClick={() => favorites.forEach(f => toggle(f))}>
            Clear All
          </button>
        )}
      </div>

      {favorites.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">♡</div>
          <h2 style={{ fontSize: 20, fontWeight: 600 }}>No favorites yet</h2>
          <p style={{ color: 'var(--text-muted)' }}>Save items you love by clicking the heart icon</p>
          <Link to="/products" className="btn btn-primary">Browse Products</Link>
        </div>
      ) : (
        <div className="favorites-grid">
          {favorites.map(product => (
            <div key={product.id} className="fav-card card">
              <Link to={`/products/${product.id}`} className="fav-img-wrap">
                <img src={product.image} alt={product.title} className="fav-img" />
              </Link>
              <div className="fav-body">
                <Link to={`/products/${product.id}`} className="fav-title">{product.title}</Link>
                <span style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'capitalize' }}>{product.category}</span>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: 12 }}>
                  <span style={{ fontWeight: 700, fontSize: 18, color: 'var(--primary)' }}>${Number(product.price).toFixed(2)}</span>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-primary btn-sm" onClick={() => addItem(product)}>Add to Cart</button>
                    <button className="fav-remove-btn" onClick={() => toggle(product)} title="Remove">♥</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}