import { HashRouter as BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { ItemsProvider } from './context/ItemsContext';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import ProductForm from './pages/ProductForm';
import Cart from './pages/Cart';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import Favorites from './pages/Favorites';
import MyItems from './pages/MyItems';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <ItemsProvider>
            <FavoritesProvider>
              <BrowserRouter>
                <MainLayout>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/products/:id" element={<ProductDetail />} />

                    <Route path="/products/create" element={
                      <ProtectedRoute adminOnly><ProductForm /></ProtectedRoute>
                    } />
                    <Route path="/products/:id/edit" element={
                      <ProtectedRoute adminOnly><ProductForm /></ProtectedRoute>
                    } />
                    <Route path="/cart" element={
                      <ProtectedRoute><Cart /></ProtectedRoute>
                    } />
                    <Route path="/dashboard" element={
                      <ProtectedRoute><Dashboard /></ProtectedRoute>
                    } />
                    <Route path="/profile" element={
                      <ProtectedRoute><Profile /></ProtectedRoute>
                    } />
                    <Route path="/favorites" element={
                      <ProtectedRoute><Favorites /></ProtectedRoute>
                    } />
                    <Route path="/my-items" element={
                      <ProtectedRoute><MyItems /></ProtectedRoute>
                    } />
                    <Route path="/admin" element={
                      <ProtectedRoute adminOnly><Admin /></ProtectedRoute>
                    } />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </MainLayout>
              </BrowserRouter>
            </FavoritesProvider>
          </ItemsProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}