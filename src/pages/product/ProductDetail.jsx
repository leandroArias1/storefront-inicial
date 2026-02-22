import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProduct } from '../../api/products';
import { useCart } from '../../context/CartContext';

export default function ProductDetail() {
  const { id } = useParams();
  const { add } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    getProduct(id)
      .then(res => setProduct(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleAdd = () => {
    add(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-rossa-blue border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white/30">
      <p className="font-display uppercase text-xl">Producto no encontrado</p>
      <Link to="/catalogo" className="mt-4 text-rossa-blue text-sm">← Volver al catálogo</Link>
    </div>
  );

  const images = product.images?.length > 0 ? product.images : [{ url: null }];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-20">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-white/30 text-xs mb-8 font-display uppercase tracking-wider" style={{fontWeight:500}}>
        <Link to="/" className="hover:text-white transition-colors">Inicio</Link>
        <span>›</span>
        <Link to="/catalogo" className="hover:text-white transition-colors">Catálogo</Link>
        <span>›</span>
        <span className="text-white/60">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-12">
        {/* ── Imágenes ── */}
        <div>
          {/* Imagen principal */}
          <div className="aspect-square bg-rossa-gray border border-white/5 overflow-hidden mb-3">
            {images[selectedImg]?.url ? (
              <img
                src={images[selectedImg].url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-8xl opacity-5">🔧</div>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImg(i)}
                  className={`w-16 h-16 bg-rossa-gray border overflow-hidden transition-colors ${selectedImg === i ? 'border-rossa-blue' : 'border-white/10 hover:border-white/30'}`}
                >
                  {img.url
                    ? <img src={img.url} alt="" className="w-full h-full object-cover" />
                    : <span className="flex items-center justify-center h-full text-white/10">🔧</span>
                  }
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Info ── */}
        <div>
          {product.category && (
            <span className="tag text-rossa-blue/60 border-rossa-blue/20">{product.category.name}</span>
          )}
          <h1 className="font-display uppercase text-2xl md:text-3xl text-rossa-light mt-3 leading-tight" style={{fontWeight:800}}>
            {product.name}
          </h1>

          <div className="flex items-center gap-4 mt-2 text-white/30 text-sm">
            {product.brand && <span>Marca: <span className="text-white/50">{product.brand}</span></span>}
            {product.partNumber && <span>Nº parte: <span className="text-white/50">{product.partNumber}</span></span>}
          </div>

          <div className="mt-6 py-6 border-y border-white/5">
            <span className="font-display font-900 text-4xl text-rossa-blue" style={{fontWeight:900}}>
              ${product.price?.toLocaleString('es-AR')}
            </span>
            <div className="mt-2">
              {product.stock > 0 ? (
                <span className="text-green-400 text-sm font-display uppercase tracking-wider" style={{fontWeight:600}}>
                  ✓ En stock ({product.stock} u.)
                </span>
              ) : (
                <span className="text-red-400 text-sm font-display uppercase tracking-wider" style={{fontWeight:600}}>
                  Sin stock
                </span>
              )}
            </div>
          </div>

          {/* Qty + Agregar */}
          {product.stock > 0 && (
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="w-10 h-10 bg-rossa-steel border border-white/10 hover:border-rossa-blue text-white/60 hover:text-rossa-blue transition-colors flex items-center justify-center text-lg"
                >−</button>
                <span className="font-display font-700 text-xl w-8 text-center" style={{fontWeight:700}}>{qty}</span>
                <button
                  onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                  className="w-10 h-10 bg-rossa-steel border border-white/10 hover:border-rossa-blue text-white/60 hover:text-rossa-blue transition-colors flex items-center justify-center text-lg"
                >+</button>
              </div>

              <button
                onClick={handleAdd}
                className={`btn-primary w-full transition-all ${added ? 'bg-rossa-blue hover:bg-blue-900' : ''}`}
              >
                {added ? '✓ Agregado al carrito' : '+ Agregar al carrito'}
              </button>

              <a
                href={`https://wa.me/5492615578934?text=${encodeURIComponent(`Hola! Me interesa: ${product.name} (x${qty}). ¿Está disponible?`)}`}
                target="_blank" rel="noreferrer"
                className="btn-ghost w-full flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.554 4.122 1.527 5.855L.057 23.882l6.195-1.624A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.894a9.869 9.869 0 01-5.032-1.378l-.361-.214-3.741.981.998-3.648-.235-.374A9.848 9.848 0 012.106 12C2.106 6.58 6.58 2.106 12 2.106S21.894 6.58 21.894 12 17.42 21.894 12 21.894z"/>
                </svg>
                Consultar disponibilidad
              </a>
            </div>
          )}

          {/* Descripción */}
          {product.description && (
            <div className="mt-8">
              <h3 className="font-display uppercase text-xs tracking-wider text-white/30 mb-3" style={{fontWeight:600}}>Descripción</h3>
              <p className="text-white/50 text-sm leading-relaxed">{product.description}</p>
            </div>
          )}

          {/* Modelos compatibles */}
          {product.compatible?.length > 0 && (
            <div className="mt-6">
              <h3 className="font-display uppercase text-xs tracking-wider text-white/30 mb-3" style={{fontWeight:600}}>
                Modelos compatibles
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.compatible.map((m, i) => (
                  <span key={i} className="tag">{m}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
