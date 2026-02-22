import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('rossa_cart') || '[]'); } catch { return []; }
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('rossa_cart', JSON.stringify(items));
  }, [items]);

  const add = (product, qty = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i._id === product._id);
      if (existing) return prev.map(i => i._id === product._id ? { ...i, qty: i.qty + qty } : i);
      return [...prev, { ...product, qty }];
    });
    setIsOpen(true);
  };

  const remove = (id) => setItems(prev => prev.filter(i => i._id !== id));

  const updateQty = (id, qty) => {
    if (qty <= 0) return remove(id);
    setItems(prev => prev.map(i => i._id === id ? { ...i, qty } : i));
  };

  const clear = () => setItems([]);

  const total = items.reduce((acc, i) => acc + i.price * i.qty, 0);
  const count = items.reduce((acc, i) => acc + i.qty, 0);

  const sendWhatsApp = (customerInfo = '') => {
    const WA_NUMBER = '5492615578934';
    let msg = `Hola! Quiero hacer un pedido de *Rossa Repuestos*:\n\n`;
    items.forEach(i => {
      msg += `• ${i.qty}x ${i.name} — $${(i.price * i.qty).toLocaleString('es-AR')}\n`;
    });
    msg += `\n*Total: $${total.toLocaleString('es-AR')}*`;
    if (customerInfo) msg += `\n\n${customerInfo}`;
    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  return (
    <CartContext.Provider value={{ items, add, remove, updateQty, clear, total, count, isOpen, setIsOpen, sendWhatsApp }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
