import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Cart.css';

export default function Cart() {
  const { items, removeItem, updateQty, clearCart, total, count } = useCart();

  if (items.length === 0) {
    return (
      <div className="container" style={{ padding: '60px 20px' }}>
        <div className="empty-state">
          <div className="empty-icon">🛒</div>
          <h2 style={{ fontSize: 20, fontWeight: 600 }}>Your cart is empty</h2>
          <p style={{ color: 'var(--text-muted)' }}>Start shopping to add items</p>
          <Link to="/products" className="btn btn-primary">Browse Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 32 }}>
        Shopping Cart <span style={{ color: 'var(--text-muted)', fontSize: 18, fontWeight: 400 }}>({count} items)</span>
      </h1>

      <div className="cart-layout">
        <div className="cart-items">
          {items.map(item => (
            <div key={item.id} className="cart-item card">
              <img src={item.image} alt={item.title} className="cart-item-img" />
              <div className="cart-item-info">
                <Link to={`/products/${item.id}`} className="cart-item-title">{item.title}</Link>
                <p style={{ color: 'var(--text-muted)', fontSize: 13, textTransform: 'capitalize' }}>{item.category}</p>
                <p style={{ fontWeight: 700, color: 'var(--primary)', fontSize: 18 }}>${item.price.toFixed(2)}</p>
              </div>
              <div className="cart-item-controls">
                <div className="qty-control">
                  <button onClick={() => updateQty(item.id, item.qty - 1)}>−</button>
                  <span>{item.qty}</span>
                  <button onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
                </div>
                <p style={{ fontWeight: 600, textAlign: 'right', minWidth: 70 }}>
                  ${(item.price * item.qty).toFixed(2)}
                </p>
                <button className="btn btn-danger btn-sm" onClick={() => removeItem(item.id)}>✕</button>
              </div>
            </div>
          ))}

          <button className="btn btn-outline btn-sm" onClick={clearCart} style={{ alignSelf: 'flex-start' }}>
            Clear Cart
          </button>
        </div>

        <div className="cart-summary card">
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 20 }}>Order Summary</h2>
          <div className="summary-row"><span>Subtotal</span><span>${total.toFixed(2)}</span></div>
          <div className="summary-row"><span>Shipping</span><span style={{ color: 'var(--success)' }}>Free</span></div>
          <div className="summary-row" style={{ borderTop: '1px solid var(--border)', paddingTop: 16, fontWeight: 700, fontSize: 18 }}>
            <span>Total</span><span style={{ color: 'var(--primary)' }}>${total.toFixed(2)}</span>
          </div>
          <button className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 20 }}>
            Checkout →
          </button>
        </div>
      </div>
    </div>
  );
}