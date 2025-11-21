
import React from 'react';
import { CartItem } from '../types';
import { XIcon, MinusIcon, PlusIcon, Trash2Icon, ShoppingCartIcon, ArrowRightIcon, ShieldCheckIcon } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: number, delta: number) => void;
  onRemoveItem: (id: number) => void;
  onCheckout?: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem, onCheckout }) => {
  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className={`fixed inset-y-0 right-0 w-full sm:max-w-md h-[100dvh] bg-nexus-950/95 backdrop-blur-2xl border-l border-white/10 shadow-2xl z-[70] transform transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) ${isOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>
          
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5 flex-shrink-0">
            <div className="flex items-center gap-3">
                <h2 className="text-xl font-display font-bold text-white tracking-wide">YOUR CART</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-nexus-accent/20 text-nexus-accent text-xs font-bold border border-nexus-accent/20">
                  {cartItems.length}
                </span>
            </div>
            <button 
                onClick={onClose} 
                className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors active:scale-90"
                aria-label="Close Cart"
            >
              <XIcon size={24} />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar overscroll-contain">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-6 animate-in fade-in zoom-in-95 duration-500">
                <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.05)]">
                    <ShoppingCartIcon size={40} className="text-slate-600" />
                </div>
                <div>
                  <p className="text-xl font-display font-bold text-white mb-2">Your Cart is Empty</p>
                  <p className="text-slate-500 max-w-[200px] mx-auto text-sm leading-relaxed">Time to upgrade your inventory with some legendary gear.</p>
                </div>
                <button onClick={onClose} className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-full transition-all font-medium text-sm active:scale-95">
                  Continue Shopping
                </button>
              </div>
            ) : (
              cartItems.map(item => (
                <div key={item.id} className="group flex gap-4 p-4 rounded-2xl bg-white/5 border border-transparent hover:border-white/10 transition-all hover:shadow-lg relative">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-slate-900 flex-shrink-0 border border-white/5">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-1 min-w-0">
                    <div>
                        <div className="flex justify-between items-start gap-2">
                            <h3 className="text-white font-semibold line-clamp-1 leading-tight text-sm sm:text-base">{item.name}</h3>
                            <button 
                                onClick={() => onRemoveItem(item.id)}
                                className="text-slate-500 hover:text-red-400 transition-colors p-2 -m-2 active:scale-90"
                                aria-label="Remove item"
                            >
                                <Trash2Icon size={16} />
                            </button>
                        </div>
                        <p className="text-xs text-slate-400 mt-1 truncate">{item.category}</p>
                    </div>
                    
                    <div className="flex items-center justify-between mt-3">
                      <p className="text-white font-bold font-display">${(item.price * item.quantity).toFixed(2)}</p>
                      <div className="flex items-center space-x-1 bg-black/40 rounded-lg p-1 border border-white/10">
                        <button 
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-md transition-colors disabled:opacity-30 active:scale-90"
                          disabled={item.quantity <= 1}
                        >
                          <MinusIcon size={12} />
                        </button>
                        <span className="text-xs font-bold text-white min-w-[20px] text-center">{item.quantity}</span>
                        <button 
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-md transition-colors active:scale-90"
                        >
                          <PlusIcon size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="p-6 border-t border-white/10 bg-black/40 backdrop-blur-xl space-y-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
              <div className="space-y-2">
                <div className="flex justify-between text-slate-400 text-sm">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-400 text-sm">
                  <span>Shipping</span>
                  <span className="text-nexus-accent">Free</span>
                </div>
              </div>
              <div className="flex justify-between items-end pt-4 border-t border-white/10">
                <span className="text-lg font-medium text-white">Total</span>
                <span className="text-3xl font-display font-bold text-nexus-glow tracking-tight">${total.toFixed(2)}</span>
              </div>
              <button 
                onClick={onCheckout}
                className="group w-full py-4 bg-nexus-accent hover:bg-nexus-accentHover text-white font-bold rounded-2xl transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                <span>Secure Checkout</span>
                <ArrowRightIcon size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <div className="flex justify-center items-center gap-2 text-xs text-slate-500">
                <ShieldCheckIcon size={14} />
                <span>Encrypted by SAR Security Protocol</span>
              </div>
            </div>
          )}
      </div>
    </>
  );
};

export default CartDrawer;
