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
  const [search, setSearch] = useState('');

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

  const handleSearch = (e) => { e.preventDefault(); setSearchParams({}); load(); };

  const setCategory = (id) => {
    if (id) setSearchParams({ categoria: id });
    else setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-20">
      {/* Header */}
      <div className="mb-10">
        <h1 className="section-title">Catálogo</h1>
        <span className="accent-line" />
        <p className="text-white/30 text-sm">{pagination.total ?? '…'} productos disponibles</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* ── Sidebar filtros ── */}
        <aside className="lg:w-56 flex-shrink-0">
          {/* Búsqueda */}
          <form onSubmit={handleSearch} className="mb-6">
            <label className="text-xs uppercase tracking-wider text-white/30 font-display block mb-2" style={{fontWeight:600}}>Buscar</label>
            <div className="flex gap-2">
              <input
                className="input-dark flex-1 text-sm"
                placeholder="Nombre, nº parte..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <button type="submit" className="bg-rossa-blue text-rossa-dark px-3 hover:bg-orange-400 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </form>

          {/* Categorías */}
          <div>
            <label className="text-xs uppercase tracking-wider text-white/30 font-display block mb-2" style={{fontWeight:600}}>Categorías</label>
            <div className="space-y-1">
              <button
                onClick={() => setCategory('')}
                className={`w-full text-left px-3 py-2 text-sm transition-colors font-display uppercase tracking-wider border
                  ${!selectedCat
                    ? 'border-rossa-blue text-rossa-blue bg-rossa-blue/5'
                    : 'border-white/5 text-white/40 hover:text-white hover:border-white/20'
                  }`}
                style={{fontWeight:600, fontSize:'0.7rem'}}
              >
                Todos
              </button>
              {categories.map(cat => (
                <button
                  key={cat._id}
                  onClick={() => setCategory(cat._id)}
                  className={`w-full text-left px-3 py-2 text-sm transition-colors font-display uppercase tracking-wider border
                    ${selectedCat === cat._id
                      ? 'border-rossa-blue text-rossa-blue bg-rossa-blue/5'
                      : 'border-white/5 text-white/40 hover:text-white hover:border-white/20'
                    }`}
                  style={{fontWeight:600, fontSize:'0.7rem'}}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* ── Grid productos ── */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(16)].map((_, i) => (
                <div key={i} className="bg-rossa-gray animate-pulse">
                  <div className="aspect-square" />
                  <div className="p-4 space-y-2">
                    <div className="h-3 bg-white/5 rounded w-3/4" />
                    <div className="h-3 bg-white/5 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-white/20">
              <span className="text-5xl mb-4">🔍</span>
              <p className="font-display uppercase tracking-wider text-sm">Sin resultados</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map(p => <ProductCard key={p._id} product={p} />)}
              </div>

              {/* Paginación */}
              {pagination.pages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  <button
                    onClick={() => setSearchParams(p => { p.set('page', page - 1); return p; })}
                    disabled={page === 1}
                    className="btn-ghost px-4 py-2 disabled:opacity-30"
                  >←</button>
                  <span className="text-white/40 font-display text-sm">
                    {page} / {pagination.pages}
                  </span>
                  <button
                    onClick={() => setSearchParams(p => { p.set('page', page + 1); return p; })}
                    disabled={page === pagination.pages}
                    className="btn-ghost px-4 py-2 disabled:opacity-30"
                  >→</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
