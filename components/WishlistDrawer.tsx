
import React, { useEffect } from 'react';
import { Product } from '../types';
import { XIcon, ShoppingCartIcon, Trash2Icon, HeartIcon } from 'lucide-react';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistItems: Product[];
  onRemoveItem: (id: number) => void;
  onMoveToCart: (product: Product) => void;
}

const WishlistDrawer: React.FC<WishlistDrawerProps> = ({ isOpen, onClose, wishlistItems, onRemoveItem, onMoveToCart }) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleMoveToCart = (product: Product) => {
    onMoveToCart(product);
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Drawer */}
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="wishlist-drawer-title"
        className={`fixed inset-y-0 right-0 w-full sm:max-w-md h-[100dvh] bg-nexus-950/95 backdrop-blur-2xl border-l border-white/10 shadow-2xl z-[70] transform transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) ${isOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}
      >
          
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5 flex-shrink-0">
            <div className="flex items-center gap-3">
                <h2 id="wishlist-drawer-title" className="text-xl font-display font-bold text-white tracking-wide">WISHLIST</h2>
                <span className="px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-500 text-xs font-bold border border-pink-500/20">
                  {wishlistItems.length}
                </span>
            </div>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors active:scale-90" aria-label="Close Wishlist">
              <XIcon size={24} />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar overscroll-contain">
            {wishlistItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-6 animate-in fade-in zoom-in-95 duration-500">
                <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shadow-[0_0_30px_rgba(236,72,153,0.05)]">
                    <HeartIcon size={40} className="text-slate-600" />
                </div>
                <div>
                  <p className="text-xl font-display font-bold text-white mb-2">Your Wishlist is Empty</p>
                  <p className="text-slate-500 max-w-[200px] mx-auto text-sm leading-relaxed">Save items for later tracking and analysis.</p>
                </div>
                <button onClick={onClose} className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-full transition-all font-medium text-sm active:scale-95">
                  Browse Catalog
                </button>
              </div>
            ) : (
              wishlistItems.map((item, index) => (
                <div 
                  key={item.id} 
                  className="group flex gap-4 p-4 rounded-2xl bg-white/5 border border-transparent hover:border-white/10 transition-all hover:shadow-lg relative overflow-hidden animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms`}}
                >
                  {/* Image */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-slate-900 flex-shrink-0 border border-white/5 relative cursor-pointer" onClick={() => {}}>
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                  </div>
                  
                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between py-1 z-10 min-w-0">
                    <div>
                        <div className="flex justify-between items-start gap-2">
                            <h3 className="text-white font-semibold line-clamp-1 leading-tight text-sm sm:text-base">{item.name}</h3>
                            <button 
                                onClick={() => onRemoveItem(item.id)}
                                className="text-slate-500 hover:text-red-400 transition-colors p-2 -m-2 active:scale-90"
                                title="Remove from Wishlist"
                            >
                                <Trash2Icon size={16} />
                            </button>
                        </div>
                        <p className="text-xs text-slate-400 mt-1 truncate">{item.category}</p>
                    </div>
                    
                    <div className="flex items-center justify-between mt-3">
                      <p className="text-white font-bold font-display">${item.price.toFixed(2)}</p>
                      
                      <button 
                        onClick={() => handleMoveToCart(item)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-nexus-accent/10 hover:bg-nexus-accent text-nexus-accent hover:text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all border border-nexus-accent/20 hover:border-nexus-accent active:scale-95"
                      >
                        <span className="hidden sm:inline">Add to Cart</span>
                        <span className="sm:hidden">Add</span>
                        <ShoppingCartIcon size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
      </div>
    </>
  );
};

export default WishlistDrawer;