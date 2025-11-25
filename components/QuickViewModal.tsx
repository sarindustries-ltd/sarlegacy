
import React, { useState, useRef, useEffect } from 'react';
import { Product } from '../types';
import { XIcon, ShoppingCartIcon, StarIcon, ShieldCheckIcon, ZapIcon, CheckIcon, HeartIcon } from 'lucide-react';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  isInWishlist?: boolean;
  onToggleWishlist?: () => void;
}

const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, isOpen, onClose, onAddToCart, isInWishlist = false, onToggleWishlist }) => {
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isZoomed, setIsZoomed] = useState(false);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  
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

  if (!isOpen || !product) return null;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;
    const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x, y });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-md transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal Content */}
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="quick-view-title"
        className="relative w-full max-w-5xl 2xl:max-w-6xl 3xl:max-w-7xl bg-nexus-950/80 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in fade-in zoom-in-95 duration-300 max-h-[90dvh] md:max-h-auto overflow-y-auto md:overflow-visible"
      >
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 bg-black/50 hover:bg-nexus-accent text-white rounded-full backdrop-blur-md transition-all border border-white/10 hover:scale-110"
          aria-label="Close quick view"
        >
          <XIcon size={18} />
        </button>

        {/* Image Section */}
        <div 
            ref={imageContainerRef}
            className="w-full md:w-1/2 relative bg-slate-900 group min-h-[300px] md:min-h-[500px] overflow-hidden cursor-crosshair"
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onMouseMove={handleMouseMove}
        >
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-200 origin-center"
            style={{
                transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                transform: isZoomed ? 'scale(2)' : 'scale(1)'
            }}
          />
          <div className={`absolute inset-0 bg-gradient-to-t from-nexus-950 via-transparent to-transparent transition-opacity duration-300 ${isZoomed ? 'opacity-0' : 'opacity-80 md:opacity-40'}`}></div>
          
          <div className="absolute top-6 left-6 pointer-events-none">
             <span className="px-4 py-1.5 bg-nexus-accent/90 backdrop-blur-md text-white text-xs font-bold rounded-full uppercase tracking-widest shadow-lg shadow-nexus-accent/20 border border-white/10">
                {product.category}
             </span>
          </div>

          {/* Zoom Hint */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10 text-[10px] text-white uppercase tracking-widest font-bold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                Hover to Zoom
          </div>
        </div>

        {/* Details Section */}
        <div className="w-full md:w-1/2 p-6 md:p-10 3xl:p-16 flex flex-col">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-6">
               <div className="flex items-center bg-yellow-500/10 px-2.5 py-1 rounded-lg text-yellow-400 border border-yellow-500/20">
                 <StarIcon size={14} fill="currentColor" />
                 <span className="ml-2 font-bold text-sm">{product.rating}</span>
               </div>
               <div className="h-4 w-px bg-white/10"></div>
               <span className="text-green-400 text-xs font-bold flex items-center gap-1.5 uppercase tracking-wide">
                 <CheckIcon size={12} className="bg-green-400/20 rounded-full p-0.5 w-4 h-4" />
                 In Stock
               </span>
            </div>
            
            <h2 id="quick-view-title" className="text-3xl md:text-4xl 3xl:text-5xl font-display font-bold text-white mb-4 leading-tight tracking-tight">
              {product.name}
            </h2>
            
            <div className="flex items-baseline gap-2 mb-8">
                <span className="text-4xl 3xl:text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                ${product.price.toFixed(2)}
                </span>
                <span className="text-slate-500 text-sm font-medium">USD</span>
            </div>
            
            <p className="text-slate-300 leading-relaxed mb-10 text-base md:text-lg 3xl:text-xl font-light">
              {product.description}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-10">
               <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                  <div className="p-2.5 rounded-xl bg-nexus-accent/10 text-nexus-accent">
                    <ShieldCheckIcon size={20} />
                  </div>
                  <div className="flex flex-col">
                     <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-0.5">Protection</span>
                     <span className="text-sm text-white font-medium">2 Year Warranty</span>
                  </div>
               </div>
               <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                  <div className="p-2.5 rounded-xl bg-nexus-accent/10 text-nexus-accent">
                    <ZapIcon size={20} />
                  </div>
                  <div className="flex flex-col">
                     <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-0.5">Speed</span>
                     <span className="text-sm text-white font-medium">Express Delivery</span>
                  </div>
               </div>
            </div>
          </div>

          <div className="mt-auto pt-8 border-t border-white/10 flex gap-4">
             {/* Wishlist Toggle in Modal */}
             {onToggleWishlist && (
                <button
                    onClick={onToggleWishlist}
                    className={`
                        p-4 rounded-2xl border transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center
                        ${isInWishlist 
                            ? 'bg-pink-500/20 border-pink-500 text-pink-500' 
                            : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'}
                    `}
                    aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                >
                    <HeartIcon size={24} className={isInWishlist ? "fill-current" : ""} />
                </button>
            )}

            <button 
              onClick={() => {
                onAddToCart(product);
                onClose();
              }}
              className="flex-1 py-4 bg-nexus-accent hover:bg-nexus-accentHover text-white font-bold text-lg rounded-2xl shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 group overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:animate-[shimmer_1s_infinite]"></div>
              <ShoppingCartIcon size={20} className="group-hover:animate-bounce relative z-10" />
              <span className="relative z-10">Add to Inventory</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;