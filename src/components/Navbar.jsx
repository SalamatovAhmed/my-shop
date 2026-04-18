import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { useFavorites } from '../context/FavoritesContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { count } = useCart();
  const { theme, toggle } = useTheme();
  const { favorites } = useFavorites();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navbar">
      <div className="container navbar-inner">

        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">◈</span>
          ShopFlow
        </Link>

        {/* Desktop Links */}
        <div className="navbar-links">
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>Home</Link>
          <Link to="/products" className={`nav-link ${isActive('/products') ? 'active' : ''}`}>Products</Link>
          {user && (
            <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>Dashboard</Link>
          )}
          {user && (
            <Link to="/my-items" className={`nav-link ${isActive('/my-items') ? 'active' : ''}`}>My Items</Link>
          )}
          {isAdmin && (
            <Link to="/admin" className={`nav-link nav-admin ${isActive('/admin') ? 'active' : ''}`}>
              ⚙ Admin
            </Link>
          )}
        </div>

        {/* Actions */}
        <div className="navbar-actions">

          {/* Theme toggle */}
          <button className="icon-btn" onClick={toggle} title="Toggle theme">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>

          {/* Favorites — visible always */}
          <Link
            to={user ? '/favorites' : '/login'}
            className="icon-btn"
            title="Favorites"
          >
            <span className={`fav-heart ${favorites.length > 0 ? 'has-items' : ''}`}>
              {favorites.length > 0 ? '♥' : '♡'}
            </span>
            {favorites.length > 0 && (
              <span className="cart-badge">{favorites.length}</span>
            )}
          </Link>

          {/* Cart — only logged in */}
          {user && (
            <Link to="/cart" className="icon-btn" title="Cart">
              <span style={{ fontSize: 18 }}>🛒</span>
              {count > 0 && <span className="cart-badge">{count}</span>}
            </Link>
          )}

          {user ? (
            <>
              {/* Avatar */}
              <Link to="/profile" className="nav-avatar" title={user.name}>
                {user.name?.[0]?.toUpperCase()}
                {isAdmin && <span className="admin-dot" />}
              </Link>

              {/* Logout */}
              <button className="btn btn-outline btn-sm logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <div className="auth-btns">
              <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
            </div>
          )}

        </div>
      </div>
    </nav>
  );
}