import { useEffect, useState, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts, getCategories } from '../../api/products';
import ProductCard from '../../components/ui/ProductCard';

const IVECO_MODELS = [
  'Daily', 'Stralis', 'Tector', 'Eurocargo', 'Vertis',
  'Powerstar', 'Cursor', 'Hi-Way', 'Hi-Road', 'AT',
];

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const searchTimeout = useRef(null);

  const page = Number(searchParams.get('page') || 1);
  const selectedCat = searchParams.get('categoria') || '';
  const selectedModel = searchParams.get('modelo') || '';

  const load = useCallback(async (overrideSearch) => {
    setLoading(true);
    const searchVal = overrideSearch !== undefined ? overrideSearch : search;
    try {
      const [pRes, cRes] = await Promise.all([
        getProducts({
          page,
          limit: 16,
          category: selectedCat || undefined,
          search: searchVal || undefined,
          compatible: selectedModel || undefined,
        }),
        getCategories(),
      ]);
      setProducts(pRes.data.data);
      setPagination(pRes.data.pagination);
      setCategories(cRes.data.data);
    } finally { setLoading(false); }
  }, [page, selectedCat, selectedModel, search]);

  useEffect(() => { load(); }, [page, selectedCat, selectedModel]);

  // Búsqueda automática con debounce
  const handleSearchChange = (val) => {
    setSearch(val);
    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      setSearchParams(p => {
        p.set('page', 1);
        if (val) p.set('search', val);
        else p.delete('search');
        return p;
      });
      load(val);
    }, 400);
  };

  const clearAll = () => {
    setSearch('');
    clearTimeout(searchTimeout.current);
    setSearchParams({});
    setTimeout(() => load(''), 50);
  };

  const setCategory = (id) => {
    setSidebarOpen(false);
    setSearchParams(p => {
      if (id) p.set('categoria', id); else p.delete('categoria');
      p.set('page', 1);
      return p;
    });
  };

  const setModel = (model) => {
    setSidebarOpen(false);
    setSearchParams(p => {
      if (model) p.set('modelo', model); else p.delete('modelo');
      p.set('page', 1);
      return p;
    });
  };

  const hasFilters = selectedCat || selectedModel || search;

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-20">

        {/* ── Header ── */}
        <div className="mb-6">
          <p className="font-display uppercase text-rossa-red text-xs tracking-widest mb-1" style={{fontWeight:700}}>Repuestos IVECO</p>
          <h1 className="font-display uppercase text-rossa-blue" style={{fontWeight:900, fontSize:'clamp(2rem,4vw,3rem)'}}>
            Catálogo
          </h1>
          <div className="w-14 h-1.5 bg-rossa-blue mt-2 mb-3" />
          <p className="text-gray-400 text-sm">{pagination.total ?? '…'} productos disponibles</p>
        </div>

        {/* ── Barra de búsqueda ── */}
        <div className="mb-6">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                {loading
                  ? <div className="w-5 h-5 border-2 border-rossa-blue border-t-transparent rounded-full animate-spin" />
                  : <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                }
              </div>
              <input
                className="w-full border-2 border-rossa-gray rounded-2xl pl-12 pr-10 py-4 text-gray-700
                           focus:outline-none focus:border-rossa-blue transition-colors text-sm placeholder-gray-300"
                placeholder="Buscar por nombre, número de parte, marca..."
                value={search}
                onChange={e => handleSearchChange(e.target.value)}
              />
              {search && (
                <button onClick={() => handleSearchChange('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-rossa-red transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Botón filtros mobile */}
            <button onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`lg:hidden border-2 rounded-2xl px-4 py-4 flex items-center gap-2 transition-colors
                ${hasFilters ? 'border-rossa-blue bg-rossa-blue text-white' : 'border-rossa-gray bg-white text-gray-500 hover:border-rossa-blue'}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
              </svg>
              {hasFilters && <span className="text-xs font-display font-bold">Filtros</span>}
            </button>
          </div>

          {/* Tags filtros activos */}
          {hasFilters && (
            <div className="flex flex-wrap gap-2 mt-3 items-center">
              {selectedCat && (
                <span className="inline-flex items-center gap-1.5 bg-rossa-blue text-white text-xs font-display uppercase px-3 py-1.5 rounded-full" style={{fontWeight:700}}>
                  {categories.find(c => c._id === selectedCat)?.name}
                  <button onClick={() => setCategory('')} className="hover:opacity-70 transition-opacity">✕</button>
                </span>
              )}
              {selectedModel && (
                <span className="inline-flex items-center gap-1.5 bg-rossa-red text-white text-xs font-display uppercase px-3 py-1.5 rounded-full" style={{fontWeight:700}}>
                  IVECO {selectedModel}
                  <button onClick={() => setModel('')} className="hover:opacity-70 transition-opacity">✕</button>
                </span>
              )}
              {search && (
                <span className="inline-flex items-center gap-1.5 bg-rossa-gray text-gray-600 text-xs font-display uppercase px-3 py-1.5 rounded-full" style={{fontWeight:700}}>
                  "{search}"
                  <button onClick={() => handleSearchChange('')} className="hover:text-rossa-red transition-colors">✕</button>
                </span>
              )}
              <button onClick={clearAll}
                className="text-rossa-red text-xs font-display uppercase tracking-wider hover:underline ml-1"
                style={{fontWeight:700}}>
                Limpiar todo ✕
              </button>
            </div>
          )}
        </div>

        <div className="flex gap-8">

          {/* ── Sidebar ── */}
          <aside className={`lg:block lg:w-60 flex-shrink-0 ${sidebarOpen ? 'block' : 'hidden'} fixed lg:relative inset-0 lg:inset-auto z-50 lg:z-auto`}>
            <div className="lg:hidden fixed inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />

            <div className="relative lg:static bg-white w-72 lg:w-auto h-full lg:h-auto overflow-y-auto p-6 lg:p-0 shadow-2xl lg:shadow-none ml-auto lg:ml-0">

              <div className="flex items-center justify-between mb-6 lg:hidden">
                <h3 className="font-display uppercase text-rossa-blue text-sm" style={{fontWeight:800}}>Filtros</h3>
                <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-rossa-red transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Categorías */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-4 bg-rossa-blue rounded-full" />
                  <h3 className="font-display uppercase text-gray-400 text-xs tracking-widest" style={{fontWeight:700}}>Categorías</h3>
                </div>
                <div className="space-y-1">
                  <button onClick={() => setCategory('')}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-xs transition-all font-display uppercase tracking-wider
                      ${!selectedCat ? 'bg-rossa-blue text-white shadow-sm' : 'text-gray-500 hover:bg-rossa-light hover:text-rossa-blue'}`}
                    style={{fontWeight:700}}>
                    Todas las categorías
                  </button>
                  {categories.map(cat => (
                    <button key={cat._id} onClick={() => setCategory(cat._id)}
                      className={`w-full text-left px-4 py-2.5 rounded-xl text-xs transition-all font-display uppercase tracking-wider
                        ${selectedCat === cat._id ? 'bg-rossa-blue text-white shadow-sm' : 'text-gray-500 hover:bg-rossa-light hover:text-rossa-blue'}`}
                      style={{fontWeight:700}}>
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Modelos IVECO */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-4 bg-rossa-red rounded-full" />
                  <h3 className="font-display uppercase text-gray-400 text-xs tracking-widest" style={{fontWeight:700}}>Modelo IVECO</h3>
                </div>
                <div className="space-y-1">
                  <button onClick={() => setModel('')}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-xs transition-all font-display uppercase tracking-wider
                      ${!selectedModel ? 'bg-rossa-red text-white shadow-sm' : 'text-gray-500 hover:bg-red-50 hover:text-rossa-red'}`}
                    style={{fontWeight:700}}>
                    Todos los modelos
                  </button>
                  {IVECO_MODELS.map(model => (
                    <button key={model} onClick={() => setModel(model)}
                      className={`w-full text-left px-4 py-2.5 rounded-xl text-xs transition-all font-display uppercase tracking-wider
                        ${selectedModel === model ? 'bg-rossa-red text-white shadow-sm' : 'text-gray-500 hover:bg-red-50 hover:text-rossa-red'}`}
                      style={{fontWeight:700}}>
                      IVECO {model}
                    </button>
                  ))}
                </div>
              </div>

              {/* Limpiar filtros */}
              {hasFilters && (
                <button onClick={clearAll}
                  className="w-full mt-6 border-2 border-rossa-red text-rossa-red font-display uppercase text-xs py-3 rounded-xl
                             hover:bg-rossa-red hover:text-white transition-all"
                  style={{fontWeight:700}}>
                  Limpiar filtros ✕
                </button>
              )}
            </div>
          </aside>

          {/* ── Grid ── */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                {[...Array(16)].map((_, i) => (
                  <div key={i} className="bg-rossa-light rounded-2xl animate-pulse">
                    <div className="aspect-square rounded-t-2xl" />
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
                <p className="font-display uppercase text-gray-400 text-sm tracking-wider mb-1" style={{fontWeight:700}}>Sin resultados</p>
                <p className="text-gray-300 text-xs">Probá con otros términos o filtros</p>
                <button onClick={clearAll}
                  className="mt-5 bg-rossa-blue text-white font-display uppercase px-6 py-2.5 rounded-full text-xs hover:bg-blue-800 transition-colors"
                  style={{fontWeight:700}}>
                  Ver todos los productos
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                  {products.map(p => <ProductCard key={p._id} product={p} />)}
                </div>

                {pagination.pages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-12">
                    <button onClick={() => setSearchParams(p => { p.set('page', page - 1); return p; })}
                      disabled={page === 1}
                      className="w-10 h-10 rounded-full border-2 border-rossa-gray text-gray-500 hover:border-rossa-blue hover:text-rossa-blue transition-colors disabled:opacity-30">
                      ←
                    </button>
                    {[...Array(pagination.pages)].map((_, i) => (
                      <button key={i} onClick={() => setSearchParams(p => { p.set('page', i + 1); return p; })}
                        className={`w-10 h-10 rounded-full border-2 text-sm font-display transition-all ${page === i + 1 ? 'bg-rossa-blue border-rossa-blue text-white' : 'border-rossa-gray text-gray-500 hover:border-rossa-blue hover:text-rossa-blue'}`}
                        style={{fontWeight:700}}>
                        {i + 1}
                      </button>
                    ))}
                    <button onClick={() => setSearchParams(p => { p.set('page', page + 1); return p; })}
                      disabled={page === pagination.pages}
                      className="w-10 h-10 rounded-full border-2 border-rossa-gray text-gray-500 hover:border-rossa-blue hover:text-rossa-blue transition-colors disabled:opacity-30">
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
