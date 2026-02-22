import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import Logo from '../ui/Logo';

export default function Navbar() {
  const { count, setIsOpen } = useCart();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 z-30 bg-white border-b-4 border-rossa-blue shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-18 py-3">

        <Link to="/"><Logo size="md" /></Link>

        <nav className="hidden md:flex items-center gap-8">
          {['/', '/catalogo'].map((path, i) => (
            <Link key={path} to={path}
              className="text-rossa-dark/60 hover:text-rossa-blue font-display uppercase tracking-wider text-sm transition-colors"
              style={{fontWeight:700}}>
              {['Inicio', 'Catálogo'][i]}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="hidden md:flex items-center gap-3">
              <span className="text-rossa-dark/40 text-xs font-body">Hola, {user.name.split(' ')[0]}</span>
              <button onClick={() => { logout(); navigate('/'); }}
                className="text-rossa-dark/40 hover:text-rossa-red text-xs uppercase tracking-wider font-display transition-colors">
                Salir
              </button>
            </div>
          ) : (
            <Link to="/ingresar"
              className="hidden md:block text-rossa-dark/50 hover:text-rossa-blue text-sm uppercase font-display transition-colors"
              style={{fontWeight:700}}>
              Ingresar
            </Link>
          )}

          {/* Botón carrito */}
          <button onClick={() => setIsOpen(true)}
            className="relative flex items-center gap-2 bg-rossa-blue text-white px-4 py-2.5 hover:bg-blue-800 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {count > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-rossa-red text-white text-xs font-black w-5 h-5 flex items-center justify-center rounded-full" style={{fontWeight:900}}>
                {count}
              </span>
            )}
          </button>

          <button className="md:hidden text-rossa-blue" onClick={() => setMobileOpen(!mobileOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d={mobileOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white border-t-2 border-rossa-gray px-4 py-4 space-y-2">
          <Link to="/" onClick={() => setMobileOpen(false)} className="block py-2 font-display uppercase text-sm text-rossa-dark/60 hover:text-rossa-blue" style={{fontWeight:700}}>Inicio</Link>
          <Link to="/catalogo" onClick={() => setMobileOpen(false)} className="block py-2 font-display uppercase text-sm text-rossa-dark/60 hover:text-rossa-blue" style={{fontWeight:700}}>Catálogo</Link>
          {!user && <Link to="/ingresar" onClick={() => setMobileOpen(false)} className="block py-2 font-display uppercase text-sm text-rossa-dark/60 hover:text-rossa-blue" style={{fontWeight:700}}>Ingresar</Link>}
        </div>
      )}
    </header>
  );
}
