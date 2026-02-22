import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, getCategories } from '../../api/products';
import ProductCard from '../../components/ui/ProductCard';

const MODELS = ['IVECO Daily', 'IVECO Stralis', 'IVECO Tector', 'IVECO Eurocargo', 'IVECO Vertis'];

const FEATURES = [
  { icon: '✅', title: 'Calidad Garantizada', desc: 'Repuestos originales y alternativos de primera línea para camiones IVECO.' },
  { icon: '🔩', title: 'Especialistas IVECO', desc: 'Dedicación exclusiva a la marca IVECO — conocemos cada modelo en profundidad.' },
  { icon: '📦', title: 'Stock Permanente', desc: 'Amplio stock para abastecer tu taller o flota sin demoras. Disponibilidad inmediata.' },
  { icon: '🤝', title: 'Atención Personalizada', desc: 'Asesoramiento técnico especializado para encontrar la pieza exacta que necesitás.' },
];

const SOCIAL = [
  {
    label: 'WhatsApp',
    href: 'https://wa.me/5492615578934',
    color: 'bg-green-500 hover:bg-green-600',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.554 4.122 1.527 5.855L.057 23.882l6.195-1.624A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.894a9.869 9.869 0 01-5.032-1.378l-.361-.214-3.741.981.998-3.648-.235-.374A9.848 9.848 0 012.106 12C2.106 6.58 6.58 2.106 12 2.106S21.894 6.58 21.894 12 17.42 21.894 12 21.894z"/>
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: 'https://instagram.com/rossarepuestos',
    color: 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 hover:opacity-90',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>
    ),
  },
  {
    label: 'Facebook',
    href: 'https://facebook.com/rossarepuestos',
    color: 'bg-blue-600 hover:bg-blue-700',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
  {
    label: 'Maps',
    href: 'https://maps.google.com/?q=Juan+Agustín+Maza+Norte+3188+Maipú+Mendoza',
    color: 'bg-rossa-red hover:bg-red-700',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      </svg>
    ),
  },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getProducts({ featured: true, limit: 8 }), getCategories()])
      .then(([pRes, cRes]) => {
        setFeatured(pRes.data.data);
        setCategories(cRes.data.data.slice(0, 6));
      }).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* ══ HERO con imagen de fondo ══ */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Imagen de fondo */}
        <div className="absolute inset-0">
          <img
            src="/hero-bg.jpg"
            alt=""
            className="w-full h-full object-cover"
            onError={e => { e.target.style.display = 'none'; }}
          />
          {/* Overlay azul fuerte */}
          <div className="absolute inset-0 bg-rossa-blue/60" />
          {/* Patrón sutil encima */}
          <div className="absolute inset-0 opacity-[0.06]"
            style={{backgroundImage:'repeating-linear-gradient(-45deg,#fff 0,#fff 1px,transparent 0,transparent 50%)',backgroundSize:'24px 24px'}} />
        </div>

        {/* Barra roja lateral */}
        <div className="absolute left-0 top-0 bottom-0 w-2 bg-rossa-red z-10" />

        <div className="relative z-10 max-w-7xl mx-auto px-8 sm:px-12 pt-28 pb-20 w-full grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-8 animate-fade-up">
              <div className="w-2 h-2 bg-rossa-red rounded-full animate-pulse" />
              <span className="font-display uppercase text-white/80 text-xs tracking-widest" style={{fontWeight:700}}>
                Especialistas IVECO · +15 años de experiencia
              </span>
            </div>

            <h1 className="font-display uppercase leading-none mb-8 animate-fade-up stagger-1"
              style={{fontWeight:900, fontSize:'clamp(2.8rem,6vw,5.5rem)'}}>
              <span className="text-white block">REPUESTOS PARA</span>
              <span className="text-white block">CAMIONES</span>
              <span className="text-rossa-red block">IVECO</span>
            </h1>

            <p className="text-white/60 text-lg leading-relaxed mb-10 animate-fade-up stagger-2 max-w-lg">
              Calidad garantizada, stock permanente y atención personalizada para mantener tu flota en movimiento.
            </p>

            <div className="flex flex-wrap gap-4 animate-fade-up stagger-3">
              <a href="https://wa.me/5492615578934?text=Hola%2C%20quiero%20consultar%20por%20un%20repuesto"
                target="_blank" rel="noreferrer"
                className="bg-rossa-red text-white font-display uppercase tracking-wider px-7 py-4 rounded-full
                           hover:bg-red-600 active:scale-95 transition-all duration-200 flex items-center gap-2"
                style={{fontWeight:700}}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.554 4.122 1.527 5.855L.057 23.882l6.195-1.624A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.894a9.869 9.869 0 01-5.032-1.378l-.361-.214-3.741.981.998-3.648-.235-.374A9.848 9.848 0 012.106 12C2.106 6.58 6.58 2.106 12 2.106S21.894 6.58 21.894 12 17.42 21.894 12 21.894z"/>
                </svg>
                CONSULTAR POR WHATSAPP
              </a>
              <Link to="/catalogo"
                className="bg-white/10 border-2 border-white/40 text-white font-display uppercase tracking-wider px-7 py-4 rounded-full
                           hover:bg-white hover:text-rossa-blue active:scale-95 transition-all duration-200"
                style={{fontWeight:700}}>
                VER PRODUCTOS →
              </Link>
            </div>

            {/* Botones sociales */}
            <div className="flex items-center gap-3 mt-8 animate-fade-up stagger-4">
              <span className="text-white/30 text-xs font-display uppercase tracking-wider" style={{fontWeight:600}}>Seguinos:</span>
              {SOCIAL.map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer"
                  title={s.label}
                  className={`${s.color} text-white w-10 h-10 rounded-full flex items-center justify-center
                              transition-all duration-200 hover:scale-110 active:scale-95`}>
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Stats cards */}
          <div className="hidden lg:grid grid-cols-2 gap-4 animate-fade-up stagger-4">
            {[
              { val: '+15', label: 'Años de experiencia', color: 'border-rossa-red' },
              { val: '100%', label: 'Calidad garantizada', color: 'border-white/30' },
              { val: '8+', label: 'Categorías', color: 'border-white/30' },
              { val: 'Stock', label: 'Permanente', color: 'border-rossa-red' },
            ].map((s, i) => (
              <div key={i} className={`bg-white/10 backdrop-blur-sm border-2 ${s.color} rounded-2xl p-6`}>
                <p className="font-display font-black text-3xl text-white" style={{fontWeight:900}}>{s.val}</p>
                <p className="text-white/50 text-xs uppercase tracking-wider mt-1 font-display" style={{fontWeight:600}}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ STRIP ══ */}
      <section className="bg-rossa-red overflow-hidden py-3.5">
        <div className="flex animate-[scroll_25s_linear_infinite] whitespace-nowrap">
          {[...MODELS, ...MODELS].map((m, i) => (
            <span key={i} className="inline-flex items-center gap-4 px-8 text-white/80 font-display uppercase text-sm tracking-widest" style={{fontWeight:700}}>
              {m} <span className="text-white/40">◆</span>
            </span>
          ))}
        </div>
      </section>

      {/* ══ POR QUÉ ELEGIRNOS ══ */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <p className="font-display uppercase text-rossa-red text-sm tracking-widest mb-2" style={{fontWeight:700}}>¿Por qué elegirnos?</p>
            <h2 className="font-display uppercase text-rossa-blue" style={{fontWeight:900, fontSize:'clamp(2rem,4vw,3rem)'}}>
              ESPECIALISTAS EN IVECO
            </h2>
            <div className="w-16 h-1.5 bg-rossa-red mx-auto mt-3" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f, i) => (
              <div key={i} className="bg-white border-2 border-rossa-gray rounded-2xl hover:border-rossa-blue
                                      hover:shadow-xl transition-all duration-300 p-6 group hover:-translate-y-1">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="font-display uppercase text-rossa-blue text-base mb-2" style={{fontWeight:800}}>{f.title}</h3>
                <p className="text-rossa-dark/50 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CATEGORÍAS ══ */}
      {categories.length > 0 && (
        <section className="bg-rossa-light py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="mb-12">
              <p className="font-display uppercase text-rossa-red text-sm tracking-widest mb-2" style={{fontWeight:700}}>Explorá nuestro catálogo</p>
              <h2 className="font-display uppercase text-rossa-blue" style={{fontWeight:900, fontSize:'clamp(2rem,4vw,3rem)'}}>
                NUESTRAS CATEGORÍAS
              </h2>
              <div className="w-14 h-1.5 bg-rossa-blue mt-3 mb-0" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map(cat => (
                <Link key={cat._id} to={`/catalogo?categoria=${cat._id}`}
                  className="bg-white border-2 border-rossa-gray rounded-2xl hover:border-rossa-blue hover:shadow-lg
                             hover:-translate-y-1 transition-all duration-200 p-5 text-center group">
                  <span className="block text-3xl mb-3">🔧</span>
                  <span className="font-display uppercase text-xs tracking-wider text-rossa-dark/60 group-hover:text-rossa-blue transition-colors block" style={{fontWeight:700}}>
                    {cat.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══ PRODUCTOS DESTACADOS ══ */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="font-display uppercase text-rossa-red text-sm tracking-widest mb-2" style={{fontWeight:700}}>Lo más buscado</p>
              <h2 className="font-display uppercase text-rossa-blue" style={{fontWeight:900, fontSize:'clamp(2rem,4vw,3rem)'}}>
                TODAS LAS PIEZAS <span className="text-rossa-red">QUE NECESITÁS</span>
              </h2>
              <div className="w-14 h-1.5 bg-rossa-blue mt-3" />
            </div>
            <Link to="/catalogo" className="text-rossa-blue hover:text-blue-900 text-sm font-display uppercase tracking-wider transition-colors hidden sm:block" style={{fontWeight:700}}>
              Ver todos →
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-rossa-gray rounded-2xl animate-pulse aspect-square" />
              ))}
            </div>
          ) : featured.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-display uppercase tracking-wider text-rossa-dark/30">Sin productos destacados aún</p>
              <Link to="/catalogo" className="mt-6 inline-block bg-rossa-blue text-white font-display uppercase px-6 py-3 rounded-full hover:bg-blue-800 transition-colors" style={{fontWeight:700}}>Ver catálogo</Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {featured.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* ══ CTA FINAL ══ */}
      <section className="bg-rossa-blue py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="font-display uppercase text-rossa-red text-sm tracking-widest mb-3" style={{fontWeight:700}}>
            Stock permanente · Envíos a todo el país
          </p>
          <h2 className="font-display uppercase text-white mb-6" style={{fontWeight:900, fontSize:'clamp(1.8rem,4vw,3rem)'}}>
            ¿NECESITÁS UN REPUESTO<br/>PARA TU CAMIÓN IVECO?
          </h2>
          <p className="text-white/60 mb-10 text-lg">Consultanos y te asesoramos al instante.</p>

          {/* Botones sociales grandes */}
          <div className="flex flex-wrap justify-center gap-4">
            {SOCIAL.map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer"
                className={`${s.color} text-white font-display uppercase tracking-wider px-6 py-3.5 rounded-full
                            flex items-center gap-2.5 transition-all duration-200 hover:scale-105 active:scale-95`}
                style={{fontWeight:700}}>
                {s.icon}
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
