import { Link } from 'react-router-dom';
import Logo from '../ui/Logo';

export default function Footer() {
  return (
    <footer className="bg-rossa-dark text-white mt-20">
      {/* Franja roja superior */}
      <div className="h-1.5 bg-rossa-red" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">

        <div className="md:col-span-1">
          <Logo size="md" />
          <p className="text-white/40 text-sm leading-relaxed mt-4">
            Especialistas exclusivos en repuestos para camiones IVECO. Más de 15 años de experiencia.
          </p>
        </div>

        <div>
          <h4 className="font-display uppercase text-xs tracking-widest text-white/40 mb-4 border-b border-white/10 pb-2" style={{fontWeight:700}}>Navegación</h4>
          <div className="space-y-2">
            {[['/', 'Inicio'], ['/catalogo', 'Catálogo']].map(([path, label]) => (
              <Link key={path} to={path} className="block text-white/50 hover:text-white text-sm transition-colors">{label}</Link>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-display uppercase text-xs tracking-widest text-white/40 mb-4 border-b border-white/10 pb-2" style={{fontWeight:700}}>Categorías</h4>
          <div className="space-y-2">
            {['Motor', 'Frenos', 'Suspensión', 'Electricidad', 'Carrocería', 'Transmisión'].map(c => (
              <Link key={c} to={`/catalogo`} className="block text-white/50 hover:text-white text-sm transition-colors">{c}</Link>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-display uppercase text-xs tracking-widest text-white/40 mb-4 border-b border-white/10 pb-2" style={{fontWeight:700}}>Contacto</h4>
          <div className="space-y-3 text-sm text-white/50">
            <a href="https://wa.me/5492615578934" target="_blank" rel="noreferrer"
              className="flex items-center gap-2 hover:text-green-400 transition-colors">
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.554 4.122 1.527 5.855L.057 23.882l6.195-1.624A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.894a9.869 9.869 0 01-5.032-1.378l-.361-.214-3.741.981.998-3.648-.235-.374A9.848 9.848 0 012.106 12C2.106 6.58 6.58 2.106 12 2.106S21.894 6.58 21.894 12 17.42 21.894 12 21.894z"/>
              </svg>
              +54 9 2615 57-8934
            </a>
            <p className="flex items-start gap-2">
              <span className="mt-0.5">📍</span>
              <span>Juan Agustín Maza Norte 3188, Maipú, Mendoza</span>
            </p>
            <p>✉️ rossarepuestos@gmail.com</p>
            <p>🕐 Lun–Vie: 8:30–18:00 · Sáb: 8:30–13:00</p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <p className="text-white/20 text-xs">© 2026 Rossa Repuestos · Todos los derechos reservados</p>
          <p className="text-white/20 text-xs">Repuestos exclusivos para camiones IVECO</p>
        </div>
      </div>
    </footer>
  );
}
