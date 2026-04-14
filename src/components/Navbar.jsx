import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { count } = useCart();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">◈</span>
          ShopFlow
        </Link>

        <div className="navbar-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/products" className="nav-link">Products</Link>
          {user && <Link to="/dashboard" className="nav-link">Dashboard</Link>}
          {isAdmin && <Link to="/admin" className="nav-link nav-admin">Admin</Link>}
        </div>

        <div className="navbar-actions">
          <button className="icon-btn" onClick={toggle} title="Toggle theme">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>

          {user ? (
            <>
              <Link to="/cart" className="icon-btn cart-btn">
                🛒
                {count > 0 && <span className="cart-badge">{count}</span>}
              </Link>
              <Link to="/profile" className="nav-avatar" title={user.name}>
                {user.name[0].toUpperCase()}
              </Link>
              <button className="btn btn-outline btn-sm" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}