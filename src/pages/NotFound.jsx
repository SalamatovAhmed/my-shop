import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 64px)', gap: 16, textAlign: 'center', padding: 20 }}>
      <div style={{ fontSize: 80 }}>🔍</div>
      <h1 style={{ fontSize: 64, fontWeight: 800, color: 'var(--primary)' }}>404</h1>
      <h2 style={{ fontSize: 24, fontWeight: 600 }}>Page Not Found</h2>
      <p style={{ color: 'var(--text-muted)', maxWidth: 400 }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="btn btn-primary btn-lg">Go Home</Link>
    </div>
  );
}