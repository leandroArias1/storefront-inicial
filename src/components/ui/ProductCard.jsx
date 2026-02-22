import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

export default function ProductCard({ product }) {
  const { add } = useCart();
  const img = product.images?.[0]?.url;

  return (
    <div className="group bg-white rounded-2xl border-2 border-rossa-gray overflow-hidden
                    transition-all duration-300 hover:border-rossa-blue hover:shadow-xl hover:-translate-y-2">
      {/* Imagen */}
      <Link to={`/producto/${product._id}`} className="block aspect-square bg-rossa-light overflow-hidden relative">
        {img ? (
          <img src={img} alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-6xl opacity-10">🔧</span>
          </div>
        )}

        {/* Overlay hover con botón rápido */}
        <div className="absolute inset-0 bg-rossa-blue/80 flex items-center justify-center
                        opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="font-display uppercase text-white text-sm tracking-wider border-2 border-white px-4 py-2"
            style={{fontWeight:700}}>
            Ver detalle →
          </span>
        </div>

        {product.featured && (
          <span className="absolute top-3 left-3 bg-rossa-red text-white text-xs font-display uppercase px-2 py-1 rounded-full z-10"
            style={{fontWeight:700}}>
            ★ Destacado
          </span>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
            <span className="text-rossa-dark/50 font-display uppercase text-sm tracking-wider border-2 border-rossa-gray px-3 py-1 rounded-full">
              Sin stock
            </span>
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="p-4">
        {product.category && (
          <span className="inline-block bg-rossa-blue/8 text-rossa-blue text-xs font-display uppercase px-2 py-0.5 rounded-full mb-2"
            style={{fontWeight:700}}>
            {product.category.name}
          </span>
        )}
        <Link to={`/producto/${product._id}`}>
          <h3 className="font-body font-semibold text-rossa-dark mt-1 leading-snug line-clamp-2
                         hover:text-rossa-blue transition-colors text-sm">
            {product.name}
          </h3>
        </Link>
        {product.partNumber && (
          <p className="text-rossa-dark/30 text-xs mt-1">Nº {product.partNumber}</p>
        )}

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-rossa-gray">
          <span className="font-display font-black text-rossa-blue text-xl" style={{fontWeight:900}}>
            ${product.price?.toLocaleString('es-AR')}
          </span>
          <button
            onClick={() => add(product)}
            disabled={product.stock === 0}
            className="bg-rossa-red text-white hover:bg-red-700 transition-all duration-200
                       px-3 py-1.5 rounded-full text-xs font-display uppercase tracking-wider
                       disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
            style={{fontWeight:700}}
          >
            + Agregar
          </button>
        </div>
      </div>
    </div>
  );
}
