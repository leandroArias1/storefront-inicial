import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import CartDrawer from './components/cart/CartDrawer';
import Home from './pages/home/Home';
import Catalog from './pages/catalog/Catalog';
import ProductDetail from './pages/product/ProductDetail';
import Auth from './pages/auth/Auth';

function Layout({ children }) {
  return (
    <div className="noise-overlay min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/catalogo" element={<Layout><Catalog /></Layout>} />
            <Route path="/producto/:id" element={<Layout><ProductDetail /></Layout>} />
            <Route path="/ingresar" element={<Layout><Auth /></Layout>} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
