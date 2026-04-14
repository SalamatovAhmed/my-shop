import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

export default function ProductCard({ product, onDelete, isAdmin }) {
  const { addItem } = useCart();

  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`} className="product-img-wrap">
        <img src={product.image} alt={product.title} className="product-img" />
        <span className="product-category">{product.category}</span>
      </Link>

      <div className="product-body">
        <Link to={`/products/${product.id}`}>
          <h3 className="product-title">{product.title}</h3>
        </Link>
        <div className="product-rating">
          <span className="stars">{'★'.repeat(Math.round(product.rating?.rate || 4))}{'☆'.repeat(5 - Math.round(product.rating?.rate || 4))}</span>
          <span className="rating-count">({product.rating?.count || 0})</span>
        </div>
        <div className="product-footer">
          <span className="product-price">${product.price?.toFixed(2)}</span>
          <button className="btn btn-primary btn-sm" onClick={() => addItem(product)}>
            Add to Cart
          </button>
        </div>

        {isAdmin && (
          <div className="admin-actions">
            <Link to={`/products/${product.id}/edit`} className="btn btn-outline btn-sm">Edit</Link>
            <button className="btn btn-danger btn-sm" onClick={() => onDelete(product.id)}>Delete</button>
          </div>
        )}
      </div>
    </div>
  );
}