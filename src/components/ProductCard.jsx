import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';
import './ProductCard.css';

export default function ProductCard({ product, onDelete }) {
  const { addItem } = useCart();
  const { toggle, isFavorite } = useFavorites();
  const { isAdmin, user } = useAuth();

  const canManage = isAdmin || (product.ownerId && product.ownerId === user?.id);
  const fav = isFavorite(product.id);
  const stars = Math.round(product.rating?.rate || 4);

  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`} className="product-img-wrap">
        <img src={product.image} alt={product.title} className="product-img" />
        <span className="product-category-badge">{product.category}</span>
        <button
          className={`fav-overlay-btn ${fav ? 'active' : ''}`}
          onClick={(e) => { e.preventDefault(); toggle(product); }}
          title={fav ? 'Remove from favorites' : 'Add to favorites'}
        >
          {fav ? '♥' : '♡'}
        </button>
      </Link>

      <div className="product-body">
        <Link to={`/products/${product.id}`} className="product-title-link">
          <h3 className="product-title">{product.title}</h3>
        </Link>

        <div className="product-rating">
          <div className="stars-row">
            {[1,2,3,4,5].map(i => (
              <span key={i} className={i <= stars ? 'star filled' : 'star'}>★</span>
            ))}
          </div>
          <span className="rating-count">({product.rating?.count || 0})</span>
        </div>

        <div className="product-footer">
          <span className="product-price">${Number(product.price).toFixed(2)}</span>
          <button className="add-cart-btn" onClick={() => addItem(product)}>
            Add to Cart
          </button>
        </div>

        {canManage && (
          <div className="admin-actions">
            <Link to={`/products/${product.id}/edit`} className="btn btn-outline btn-sm">Edit</Link>
            <button className="btn btn-danger btn-sm" onClick={() => onDelete && onDelete(product.id)}>Delete</button>
          </div>
        )}
      </div>
    </div>
  );
}