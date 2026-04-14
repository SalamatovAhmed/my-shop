const BASE = 'https://fakestoreapi.com';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export const api = {
  getProducts: () => request('/products'),
  getProduct: (id) => request(`/products/${id}`),
  getCategories: () => request('/products/categories'),
  getProductsByCategory: (cat) => request(`/products/category/${cat}`),
  createProduct: (data) => request('/products', { method: 'POST', body: JSON.stringify(data) }),
  updateProduct: (id, data) => request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProduct: (id) => request(`/products/${id}`, { method: 'DELETE' }),
  getUsers: () => request('/users'),
};