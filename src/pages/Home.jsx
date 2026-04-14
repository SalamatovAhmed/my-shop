import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-text">
            <span className="badge badge-primary" style={{ marginBottom: 16 }}>New Collection 2024</span>
            <h1 className="hero-title">Discover Premium Products</h1>
            <p className="hero-subtitle">Shop the latest trends with exclusive deals and fast delivery worldwide.</p>
            <div className="hero-actions">
              <Link to="/products" className="btn btn-primary btn-lg">Shop Now</Link>
              <Link to="/register" className="btn btn-outline btn-lg">Get Started</Link>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-card">
              <div style={{ fontSize: 80 }}>🛍️</div>
              <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>20,000+ products</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {[
              { label: 'Products', value: '20K+' },
              { label: 'Customers', value: '150K+' },
              { label: 'Countries', value: '80+' },
              { label: 'Rating', value: '4.9★' },
            ].map(s => (
              <div key={s.label} className="stat-card">
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="categories-section">
        <div className="container">
          <h2 className="section-title">Shop by Category</h2>
          <div className="categories-grid">
            {[
              { name: "Electronics", icon: "💻", color: "#ede9fe" },
              { name: "Jewelery", icon: "💍", color: "#fce7f3" },
              { name: "Men's Clothing", icon: "👔", color: "#dbeafe" },
              { name: "Women's Clothing", icon: "👗", color: "#dcfce7" },
            ].map(cat => (
              <Link key={cat.name} to={`/products?category=${encodeURIComponent(cat.name.toLowerCase())}`} className="category-card" style={{ background: cat.color }}>
                <span style={{ fontSize: 36 }}>{cat.icon}</span>
                <span style={{ fontWeight: 600, color: 'var(--text)' }}>{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}