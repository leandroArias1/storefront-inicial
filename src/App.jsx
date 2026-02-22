import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import CartDrawer from './components/cart/CartDrawer';
import Catalog from './pages/catalog/Catalog';
import ProductDetail from './pages/product/ProductDetail';

function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/catalogo" replace />} />
          <Route path="/catalogo" element={<Layout><Catalog /></Layout>} />
          <Route path="/producto/:id" element={<Layout><ProductDetail /></Layout>} />
          <Route path="*" element={<Navigate to="/catalogo" replace />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}
