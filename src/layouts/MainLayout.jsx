import Navbar from '../components/Navbar';
import Toast from '../components/Toast';
import { useToast } from '../hooks/useToast';
import { createContext, useContext } from 'react';

export const ToastContext = createContext(null);

export function useGlobalToast() {
  return useContext(ToastContext);
}

export default function MainLayout({ children }) {
  const { toasts, addToast } = useToast();

  return (
    <ToastContext.Provider value={addToast}>
      <div className="app-layout">
        <Navbar />
        <main style={{ minHeight: 'calc(100vh - 64px)' }}>
          {children}
        </main>
        <footer style={{ padding: '32px 0', borderTop: '1px solid var(--border)', marginTop: 60, textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
          © 2024 ShopFlow — All rights reserved
        </footer>
        <Toast toasts={toasts} />
      </div>
    </ToastContext.Provider>
  );
}