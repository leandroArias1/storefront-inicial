import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import Logo from '../ui/Logo';

export default function Navbar() {
  const { count, setIsOpen } = useCart();

  return (
    <header className="fixed top-0 left-0 right-0 z-30 bg-white border-b-4 border-rossa-blue shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <Link to="/catalogo"><Logo size="md" /></Link>

        <div className="flex items-center gap-4">
          <a href="https://wa.me/5492615578934" target="_blank" rel="noreferrer"
            className="hidden sm:flex items-center gap-2 text-gray-500 hover:text-green-500 transition-colors text-sm font-display uppercase tracking-wider"
            style={{fontWeight:700}}>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.554 4.122 1.527 5.855L.057 23.882l6.195-1.624A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.894a9.869 9.869 0 01-5.032-1.378l-.361-.214-3.741.981.998-3.648-.235-.374A9.848 9.848 0 012.106 12C2.106 6.58 6.58 2.106 12 2.106S21.894 6.58 21.894 12 17.42 21.894 12 21.894z"/>
            </svg>
            Consultar
          </a>

          <button onClick={() => setIsOpen(true)}
            className="relative flex items-center gap-2 bg-rossa-blue text-white px-4 py-2.5 hover:bg-blue-800 transition-colors rounded-xl">
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
        </div>
      </div>
    </header>
  );
}
