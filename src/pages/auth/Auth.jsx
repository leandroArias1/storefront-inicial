import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login as loginApi, register as registerApi } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../components/ui/Logo';

export default function Auth() {
  const [tab, setTab] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const fn = tab === 'login' ? loginApi : registerApi;
      const res = await fn(form);
      const { token, user } = res.data;
      if (user.role === 'admin') {
        setError('Para el panel admin usá el panel separado.');
        return;
      }
      login(token, user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al procesar');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Panel izquierdo decorativo */}
      <div className="hidden lg:flex lg:w-1/2 bg-rossa-blue flex-col items-center justify-center p-12 relative overflow-hidden">
        {/* Patrón de fondo */}
        <div className="absolute inset-0 opacity-10"
          style={{backgroundImage:'repeating-linear-gradient(-45deg,#fff 0,#fff 1px,transparent 0,transparent 50%)',backgroundSize:'20px 20px'}} />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-rossa-red/30 rounded-full translate-x-1/3 translate-y-1/3" />
        <div className="absolute top-0 left-0 w-48 h-48 bg-white/10 rounded-full -translate-x-1/3 -translate-y-1/3" />

        <div className="relative text-center">
          <Logo size="lg" />
          <div className="w-16 h-1.5 bg-rossa-red mx-auto mt-6 mb-6" />
          <h2 className="font-display uppercase text-white text-3xl mb-4" style={{fontWeight:900}}>
            TU SOCIO EN<br/>
            <span className="text-rossa-red">REPUESTOS IVECO</span>
          </h2>
          <p className="text-white/60 text-sm leading-relaxed max-w-xs">
            Más de 15 años abasteciendo flotas y talleres con repuestos originales y alternativos de primera calidad.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-4">
            {[
              { val: '+15', label: 'Años de experiencia' },
              { val: '100%', label: 'Calidad garantizada' },
              { val: '8+', label: 'Categorías' },
              { val: '📍', label: 'Mendoza, Argentina' },
            ].map((s, i) => (
              <div key={i} className="bg-white/10 rounded-xl p-4 border border-white/20">
                <p className="font-display font-black text-2xl text-white" style={{fontWeight:900}}>{s.val}</p>
                <p className="text-white/50 text-xs uppercase tracking-wider mt-1 font-display" style={{fontWeight:600}}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Panel derecho — formulario */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">

          {/* Logo mobile */}
          <div className="lg:hidden flex justify-center mb-8">
            <Logo size="lg" />
          </div>

          {/* Tabs */}
          <div className="flex rounded-2xl overflow-hidden border-2 border-rossa-gray mb-8">
            {[['login','Ingresar'],['register','Crear cuenta']].map(([t, label]) => (
              <button key={t} onClick={() => { setTab(t); setError(''); }}
                className={`flex-1 py-3.5 font-display uppercase text-sm tracking-wider transition-all duration-200 ${
                  tab === t
                    ? 'bg-rossa-blue text-white'
                    : 'bg-white text-rossa-dark/50 hover:text-rossa-blue'
                }`}
                style={{fontWeight:700}}>
                {label}
              </button>
            ))}
          </div>

          <div className="mb-6">
            <h1 className="font-display uppercase text-3xl text-rossa-blue" style={{fontWeight:900}}>
              {tab === 'login' ? 'Bienvenido' : 'Crear cuenta'}
            </h1>
            <p className="text-rossa-dark/40 text-sm mt-1">
              {tab === 'login'
                ? 'Ingresá para acceder a tu historial de pedidos'
                : 'Registrate para hacer seguimiento de tus pedidos'}
            </p>
            <div className="w-10 h-1 bg-rossa-red mt-3" />
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-rossa-red text-rossa-red px-4 py-3 rounded-lg text-sm mb-6 flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {tab === 'register' && (
              <div>
                <label className="font-display uppercase text-xs tracking-wider text-rossa-dark/50 block mb-2" style={{fontWeight:700}}>
                  Nombre completo
                </label>
                <input
                  className="w-full border-2 border-rossa-gray rounded-xl px-4 py-3.5 text-rossa-dark
                             focus:outline-none focus:border-rossa-blue transition-colors placeholder-rossa-dark/20"
                  placeholder="Juan García"
                  value={form.name}
                  onChange={e => setForm({...form, name: e.target.value})}
                  required
                />
              </div>
            )}

            <div>
              <label className="font-display uppercase text-xs tracking-wider text-rossa-dark/50 block mb-2" style={{fontWeight:700}}>
                Email
              </label>
              <input
                type="email"
                className="w-full border-2 border-rossa-gray rounded-xl px-4 py-3.5 text-rossa-dark
                           focus:outline-none focus:border-rossa-blue transition-colors placeholder-rossa-dark/20"
                placeholder="tu@email.com"
                value={form.email}
                onChange={e => setForm({...form, email: e.target.value})}
                required
              />
            </div>

            <div>
              <label className="font-display uppercase text-xs tracking-wider text-rossa-dark/50 block mb-2" style={{fontWeight:700}}>
                Contraseña
              </label>
              <input
                type="password"
                className="w-full border-2 border-rossa-gray rounded-xl px-4 py-3.5 text-rossa-dark
                           focus:outline-none focus:border-rossa-blue transition-colors placeholder-rossa-dark/20"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({...form, password: e.target.value})}
                required
              />
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-rossa-blue text-white font-display uppercase tracking-wider py-4 rounded-xl
                         hover:bg-blue-800 active:scale-95 transition-all duration-200 disabled:opacity-40 mt-2"
              style={{fontWeight:700, fontSize:'0.9rem'}}>
              {loading ? 'Procesando...' : tab === 'login' ? 'Ingresar →' : 'Crear cuenta →'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/catalogo"
              className="text-rossa-dark/30 hover:text-rossa-blue text-sm transition-colors font-display uppercase tracking-wider"
              style={{fontWeight:600}}>
              Continuar sin cuenta →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
