import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts, getCategories } from '../../api/products';
import ProductCard from '../../components/ui/ProductCard';

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const page = Number(searchParams.get('page') || 1);
  const selectedCat = searchParams.get('categoria') || '';

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [pRes, cRes] = await Promise.all([
        getProducts({ page, limit: 16, category: selectedCat || undefined, search: search || undefined }),
        getCategories(),
      ]);
      setProducts(pRes.data.data);
      setPagination(pRes.data.pagination);
      setCategories(cRes.data.data);
    } finally { setLoading(false); }
  }, [page, selectedCat, search]);

  useEffect(() => { load(); }, [page, selectedCat]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams(p => { p.set('page', 1); if (search) p.set('search', search); else p.delete('search'); return p; });
    load();
  };

  const clearSearch = () => {
    setSearch('');
    setSearchParams(p => { p.delete('search'); p.set('page', 1); return p; });
  };

  const setCategory = (id) => {
    setSidebarOpen(false);
    if (id) setSearchParams({ categoria: id, page: 1 });
    else setSearchParams({ page: 1 });
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-20">

        {/* ── Header ── */}
        <div className="mb-8">
          <p className="font-display uppercase text-rossa-red text-xs tracking-widest mb-1" style={{fontWeight:700}}>
            Repuestos IVECO
          </p>
          <h1 className="font-display uppercase text-rossa-blue" style={{fontWeight:900, fontSize:'clamp(2rem,4vw,3rem)'}}>
            Catálogo
          </h1>
          <div className="w-14 h-1.5 bg-rossa-blue mt-2 mb-4" />
          <p className="text-gray-400 text-sm">{pagination.total ?? '…'} productos disponibles</p>
        </div>

        {/* ── Barra de búsqueda ── */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              {/* Icono lupa */}
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                className="w-full border-2 border-rossa-gray rounded-2xl pl-12 pr-12 py-4 text-gray-700
                           focus:outline-none focus:border-rossa-blue transition-colors text-sm
                           placeholder-gray-300"
                placeholder="Buscar por nombre, número de parte, marca..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {/* Botón limpiar */}
              {search && (
                <button type="button" onClick={clearSearch}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-rossa-red transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            <button type="submit"
              className="bg-rossa-blue text-white px-8 py-4 rounded-2xl font-display uppercase tracking-wider
                         hover:bg-blue-800 active:scale-95 transition-all duration-200 hidden sm:block"
              style={{fontWeight:700, fontSize:'0.8rem'}}>
              Buscar
            </button>
            {/* Botón filtros mobile */}
            <button type="button" onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden bg-rossa-light border-2 border-rossa-gray rounded-2xl px-4 py-4
                         hover:border-rossa-blue transition-colors flex items-center gap-2 text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
              </svg>
              {selectedCat && <span className="w-2 h-2 bg-rossa-red rounded-full" />}
            </button>
          </div>

          {/* Tags de filtros activos */}
          {(selectedCat || search) && (
            <div className="flex flex-wrap gap-2 mt-3">
              {selectedCat && (
                <span className="inline-flex items-center gap-1.5 bg-rossa-blue/10 text-rossa-blue text-xs font-display uppercase px-3 py-1.5 rounded-full" style={{fontWeight:700}}>
                  {categories.find(c => c._id === selectedCat)?.name || 'Categoría'}
                  <button onClick={() => setCategory('')} className="hover:text-rossa-red transition-colors">✕</button>
                </span>
              )}
              {search && (
                <span className="inline-flex items-center gap-1.5 bg-rossa-gray text-gray-600 text-xs font-display uppercase px-3 py-1.5 rounded-full" style={{fontWeight:700}}>
                  "{search}"
                  <button onClick={clearSearch} className="hover:text-rossa-red transition-colors">✕</button>
                </span>
              )}
              <button onClick={() => { setCategory(''); clearSearch(); }}
                className="text-rossa-red text-xs font-display uppercase tracking-wider hover:underline"
                style={{fontWeight:700}}>
                Limpiar todo
              </button>
            </div>
          )}
        </form>

        <div className="flex gap-8">

          {/* ── Sidebar filtros ── */}
          <aside className={`
            lg:block lg:w-56 flex-shrink-0
            ${sidebarOpen ? 'block' : 'hidden'}
            fixed lg:relative inset-0 lg:inset-auto z-50 lg:z-auto
          `}>
            {/* Overlay mobile */}
            <div className="lg:hidden fixed inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />

            <div className="relative lg:static bg-white lg:bg-transparent w-72 lg:w-auto h-full lg:h-auto
                            overflow-y-auto p-6 lg:p-0 shadow-2xl lg:shadow-none ml-auto lg:ml-0">

              {/* Header sidebar mobile */}
              <div className="flex items-center justify-between mb-6 lg:hidden">
                <h3 className="font-display uppercase text-rossa-blue text-sm" style={{fontWeight:800}}>Filtros</h3>
                <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-rossa-red transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Título categorías */}
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-5 bg-rossa-red rounded-full" />
                <h3 className="font-display uppercase text-gray-500 text-xs tracking-widest" style={{fontWeight:700}}>
                  Categorías
                </h3>
              </div>

              <div className="space-y-1">
                <button onClick={() => setCategory('')}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all duration-150 font-display uppercase tracking-wider flex items-center justify-between
                    ${!selectedCat
                      ? 'bg-rossa-blue text-white shadow-md'
                      : 'text-gray-500 hover:bg-rossa-light hover:text-rossa-blue'
                    }`}
                  style={{fontWeight:700, fontSize:'0.7rem'}}>
                  <span>Todos</span>
                  {!selectedCat && <span className="text-white/60 text-xs">{pagination.total}</span>}
                </button>

                {categories.map(cat => (
                  <button key={cat._id} onClick={() => setCategory(cat._id)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all duration-150 font-display uppercase tracking-wider flex items-center justify-between
                      ${selectedCat === cat._id
                        ? 'bg-rossa-blue text-white shadow-md'
                        : 'text-gray-500 hover:bg-rossa-light hover:text-rossa-blue'
                      }`}
                    style={{fontWeight:700, fontSize:'0.7rem'}}>
                    <span>{cat.name}</span>
                    {selectedCat === cat._id && <span className="w-2 h-2 bg-white/60 rounded-full" />}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* ── Grid productos ── */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                {[...Array(16)].map((_, i) => (
                  <div key={i} className="bg-rossa-light rounded-2xl animate-pulse">
                    <div className="aspect-square rounded-2xl" />
                    <div className="p-4 space-y-2">
                      <div className="h-3 bg-rossa-gray rounded-full w-3/4" />
                      <div className="h-3 bg-rossa-gray rounded-full w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24">
                <div className="w-20 h-20 bg-rossa-light rounded-full flex items-center justify-center mb-4">
                  <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <p className="font-display uppercase text-gray-400 text-sm tracking-wider" style={{fontWeight:700}}>Sin resultados</p>
                <p className="text-gray-300 text-xs mt-1">Probá con otros términos de búsqueda</p>
                <button onClick={() => { setCategory(''); clearSearch(); }}
                  className="mt-4 bg-rossa-blue text-white font-display uppercase px-6 py-2.5 rounded-full text-xs hover:bg-blue-800 transition-colors"
                  style={{fontWeight:700}}>
                  Ver todos los productos
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                  {products.map(p => <ProductCard key={p._id} product={p} />)}
                </div>

                {/* Paginación */}
                {pagination.pages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-12">
                    <button
                      onClick={() => setSearchParams(p => { p.set('page', page - 1); return p; })}
                      disabled={page === 1}
                      className="w-10 h-10 rounded-full border-2 border-rossa-gray flex items-center justify-center
                                 text-gray-500 hover:border-rossa-blue hover:text-rossa-blue transition-colors
                                 disabled:opacity-30 disabled:cursor-not-allowed">
                      ←
                    </button>

                    {[...Array(pagination.pages)].map((_, i) => (
                      <button key={i}
                        onClick={() => setSearchParams(p => { p.set('page', i + 1); return p; })}
                        className={`w-10 h-10 rounded-full border-2 text-sm font-display transition-all
                          ${page === i + 1
                            ? 'bg-rossa-blue border-rossa-blue text-white shadow-md'
                            : 'border-rossa-gray text-gray-500 hover:border-rossa-blue hover:text-rossa-blue'
                          }`}
                        style={{fontWeight:700}}>
                        {i + 1}
                      </button>
                    ))}

                    <button
                      onClick={() => setSearchParams(p => { p.set('page', page + 1); return p; })}
                      disabled={page === pagination.pages}
                      className="w-10 h-10 rounded-full border-2 border-rossa-gray flex items-center justify-center
                                 text-gray-500 hover:border-rossa-blue hover:text-rossa-blue transition-colors
                                 disabled:opacity-30 disabled:cursor-not-allowed">
                      →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
