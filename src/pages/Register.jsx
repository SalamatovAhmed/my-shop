import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    if (!form.password || form.password.length < 6) e.password = 'Min 6 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);
    register(form.name, form.email);
    navigate('/dashboard');
  };

  const set = (field, val) => {
    setForm(f => ({ ...f, [field]: val }));
    setErrors(e => ({ ...e, [field]: '' }));
  };

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <div className="auth-header">
          <div className="auth-logo">◈</div>
          <h1 className="auth-title">Create account</h1>
          <p className="auth-sub">Join ShopFlow today</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {[
            { field: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe' },
            { field: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
            { field: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
            { field: 'confirm', label: 'Confirm Password', type: 'password', placeholder: '••••••••' },
          ].map(({ field, label, type, placeholder }) => (
            <div className="form-group" key={field}>
              <label>{label}</label>
              <input type={type} value={form[field]} onChange={e => set(field, e.target.value)}
                placeholder={placeholder} className={errors[field] ? 'error' : ''} />
              {errors[field] && <span className="error-msg">{errors[field]}</span>}
            </div>
          ))}

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 8 }}>
            Create Account
          </button>
        </form>

        <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
      </div>
    </div>
  );
}