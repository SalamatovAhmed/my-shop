import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import './ProductForm.css';

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({ title: '', price: '', description: '', category: '', image: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const categories = ['electronics', "jewelery", "men's clothing", "women's clothing"];

  useEffect(() => {
    if (isEdit) {
      api.getProduct(id).then(p => setForm({
        title: p.title, price: p.price, description: p.description,
        category: p.category, image: p.image
      }));
    }
  }, [id, isEdit]);

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.price || isNaN(form.price) || +form.price <= 0) e.price = 'Enter valid price';
    if (!form.category) e.category = 'Select a category';
    if (!form.description.trim()) e.description = 'Description is required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);
    setLoading(true);
    try {
      if (isEdit) {
        await api.updateProduct(id, form);
        setSuccess('Product updated successfully!');
      } else {
        await api.createProduct(form);
        setSuccess('Product created successfully!');
      }
      setTimeout(() => navigate('/products'), 1500);
    } catch {
      setErrors({ submit: 'Something went wrong' });
    } finally {
      setLoading(false);
    }
  };

  const set = (field, val) => {
    setForm(f => ({ ...f, [field]: val }));
    setErrors(e => ({ ...e, [field]: '' }));
  };

  return (
    <div className="form-page container" style={{ padding: '40px 20px' }}>
      <Link to="/products" className="back-link">← Back to Products</Link>

      <div className="form-card card">
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>
          {isEdit ? 'Edit Product' : 'Create Product'}
        </h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: 28, fontSize: 14 }}>
          {isEdit ? 'Update product details' : 'Add a new product to the store'}
        </p>

        {success && <div className="alert-success">{success}</div>}
        {errors.submit && <div className="alert-error">{errors.submit}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-row">
            <div className="form-group" style={{ flex: 2 }}>
              <label>Product Title</label>
              <input type="text" value={form.title} onChange={e => set('title', e.target.value)}
                placeholder="e.g. Wireless Headphones" className={errors.title ? 'error' : ''} />
              {errors.title && <span className="error-msg">{errors.title}</span>}
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Price ($)</label>
              <input type="number" value={form.price} onChange={e => set('price', e.target.value)}
                placeholder="29.99" min="0" step="0.01" className={errors.price ? 'error' : ''} />
              {errors.price && <span className="error-msg">{errors.price}</span>}
            </div>
          </div>

          <div className="form-group">
            <label>Category</label>
            <select value={form.category} onChange={e => set('category', e.target.value)} className={errors.category ? 'error' : ''}>
              <option value="">Select category</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            {errors.category && <span className="error-msg">{errors.category}</span>}
          </div>

          <div className="form-group">
            <label>Image URL</label>
            <input type="text" value={form.image} onChange={e => set('image', e.target.value)}
              placeholder="https://..." />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)}
              placeholder="Product description..." rows={4}
              style={{ resize: 'vertical' }} className={errors.description ? 'error' : ''} />
            {errors.description && <span className="error-msg">{errors.description}</span>}
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
              {loading ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
            </button>
            <Link to="/products" className="btn btn-outline btn-lg">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
}