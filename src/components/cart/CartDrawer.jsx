import { useCart } from '../../context/CartContext';
import { useState } from 'react';

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, remove, updateQty, total, count, clear, sendWhatsApp } = useCart();
  const [step, setStep] = useState('cart');
  const [form, setForm] = useState({ name: '', phone: '', notes: '' });

  const handleCheckout = () => {
    if (!form.name.trim()) return;
    const info = `Nombre: ${form.name}${form.phone ? `\nTeléfono: ${form.phone}` : ''}${form.notes ? `\nNotas: ${form.notes}` : ''}`;
    sendWhatsApp(info);
    setStep('cart');
    setForm({ name: '', phone: '', notes: '' });
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={() => setIsOpen(false)} />

      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 animate-slide-in flex flex-col shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b-2 border-rossa-gray bg-rossa-light">
          <div>
            <h2 className="font-display font-black uppercase text-xl text-rossa-dark" style={{fontWeight:800}}>
              {step === 'cart' ? 'Tu pedido' : 'Tus datos'}
            </h2>
            {step === 'cart' && count > 0 && (
              <p className="text-rossa-dark/40 text-sm mt-0.5">{count} {count === 1 ? 'producto' : 'productos'}</p>
            )}
          </div>
          <button onClick={() => { setIsOpen(false); setStep('cart'); }} className="text-rossa-dark/30 hover:text-rossa-red transition-colors text-2xl leading-none">✕</button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto bg-rossa-light">
          {step === 'cart' ? (
            items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-6">
                <div className="text-6xl mb-4 opacity-20">🔧</div>
                <p className="text-rossa-dark/30 font-display uppercase tracking-wider text-sm">El carrito está vacío</p>
              </div>
            ) : (
              <div className="p-4 space-y-3">
                {items.map(item => (
                  <div key={item._id} className="flex gap-4 bg-white p-4 border border-rossa-gray shadow-sm">
                    <div className="w-16 h-16 bg-rossa-gray flex-shrink-0 overflow-hidden">
                      {item.images?.[0] ? (
                        <img src={item.images[0].url} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-rossa-dark/20 text-2xl">🔧</div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-rossa-dark text-sm font-medium leading-tight line-clamp-2">{item.name}</p>
                      {item.partNumber && <p className="text-rossa-dark/30 text-xs mt-0.5">#{item.partNumber}</p>}
                      <p className="text-rossa-blue font-display font-bold mt-1" style={{fontWeight:700}}>
                        ${(item.price * item.qty).toLocaleString('es-AR')}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <button onClick={() => remove(item._id)} className="text-rossa-dark/20 hover:text-rossa-red text-xs transition-colors">✕</button>
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQty(item._id, item.qty - 1)} className="w-6 h-6 bg-rossa-gray border border-rossa-steel text-rossa-dark hover:border-rossa-blue hover:text-rossa-blue transition-colors text-sm flex items-center justify-center">−</button>
                        <span className="text-rossa-dark text-sm w-4 text-center font-medium">{item.qty}</span>
                        <button onClick={() => updateQty(item._id, item.qty + 1)} className="w-6 h-6 bg-rossa-gray border border-rossa-steel text-rossa-dark hover:border-rossa-blue hover:text-rossa-blue transition-colors text-sm flex items-center justify-center">+</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="p-6 space-y-4">
              <p className="text-rossa-dark/50 text-sm">Completá tus datos y te enviamos al chat de WhatsApp para confirmar el pedido.</p>
              <div>
                <label className="text-xs uppercase tracking-wider text-rossa-dark/40 font-display block mb-1.5" style={{fontWeight:600}}>Nombre *</label>
                <input className="input-field" placeholder="Tu nombre completo" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-rossa-dark/40 font-display block mb-1.5" style={{fontWeight:600}}>Teléfono (opcional)</label>
                <input className="input-field" placeholder="+54 9 261..." value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-rossa-dark/40 font-display block mb-1.5" style={{fontWeight:600}}>Notas del pedido (opcional)</label>
                <textarea className="input-field h-20 resize-none" placeholder="Modelo de tu camión, urgencia, etc." value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t-2 border-rossa-gray p-6 space-y-4 bg-white">
            {step === 'cart' && (
              <div className="flex justify-between items-center">
                <span className="text-rossa-dark/50 text-sm uppercase tracking-wider font-display" style={{fontWeight:600}}>Total estimado</span>
                <span className="font-display font-black text-2xl text-rossa-blue" style={{fontWeight:800}}>${total.toLocaleString('es-AR')}</span>
              </div>
            )}

            {step === 'cart' ? (
              <div className="space-y-2">
                <button onClick={() => setStep('checkout')} className="btn-primary w-full flex items-center justify-center gap-2">
                  <span>Pedir por WhatsApp</span>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.554 4.122 1.527 5.855L.057 23.882l6.195-1.624A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.894a9.869 9.869 0 01-5.032-1.378l-.361-.214-3.741.981.998-3.648-.235-.374A9.848 9.848 0 012.106 12C2.106 6.58 6.58 2.106 12 2.106S21.894 6.58 21.894 12 17.42 21.894 12 21.894z"/>
                  </svg>
                </button>
                <button onClick={clear} className="w-full text-center text-rossa-dark/30 hover:text-rossa-red text-xs py-1 transition-colors">Vaciar carrito</button>
              </div>
            ) : (
              <div className="space-y-2">
                <button onClick={handleCheckout} disabled={!form.name.trim()} className="btn-primary w-full">Abrir WhatsApp →</button>
                <button onClick={() => setStep('cart')} className="btn-ghost w-full text-center">← Volver al carrito</button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
