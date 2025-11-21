
import React, { useState } from 'react';
import { Product } from '../types';
import { PlusIcon, StarIcon, EyeIcon, HeartIcon, CheckIcon } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onNavigateToProduct?: (product: Product) => void;
  isWishlisted?: boolean;
  onToggleWishlist?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onAddToCart, 
  onQuickView, 
  onNavigateToProduct,
  isWishlisted = false, 
  onToggleWishlist 
}) => {
  const [isAdded, setIsAdded] = useState(false);

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log(`Direct purchase initiated for ${product.name}`);
    // Future: Navigate to checkout
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onToggleWishlist) {
          onToggleWishlist(product);
      }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isAdded) return; 
    
    onAddToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleCardClick = () => {
      if (onNavigateToProduct) {
          onNavigateToProduct(product);
      } else {
          onQuickView(product);
      }
  };

  const handleQuickViewClick = (e: React.MouseEvent) => {
      e.stopPropagation(); // Prevent card click
      onQuickView(product);
  };

  return (
    <div 
      className="group relative flex flex-col h-full bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden transition-all duration-300 hover:border-nexus-accent/30 hover:shadow-[0_0_40px_rgba(59,130,246,0.15)] hover:scale-[1.02] active:scale-[0.98] touch-manipulation cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-900/50">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-nexus-950 via-transparent to-transparent opacity-60"></div>
        
        {/* Floating Tag */}
        <div className="absolute top-4 left-4">
           <span className="px-3 py-1 text-[10px] font-bold text-white uppercase tracking-widest bg-black/40 backdrop-blur-md border border-white/10 rounded-full shadow-sm">
            {product.category}
          </span>
        </div>

        {/* Wishlist Button */}
        <button
            onClick={handleWishlistClick}
            className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md border transition-all duration-300 z-10 active:scale-90 ${
                isWishlisted 
                ? 'bg-pink-500/20 border-pink-500 text-pink-500' 
                : 'bg-black/40 border-white/10 text-white hover:bg-white/10'
            }`}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
            <HeartIcon size={18} className={isWishlisted ? "fill-current" : ""} />
        </button>

        {/* Quick View Trigger (Explicit Button now) */}
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 hidden sm:block">
          <button 
             onClick={handleQuickViewClick}
             className="bg-black/60 backdrop-blur-xl text-white p-3 rounded-full border border-white/20 hover:bg-nexus-accent hover:border-nexus-accent transition-all shadow-xl"
             title="Quick Preview"
          >
            <EyeIcon size={18} />
          </button>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex flex-col flex-grow p-5">
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
             <div className="flex items-center gap-1 text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded-md border border-yellow-500/10">
                <StarIcon size={10} fill="currentColor" />
                <span className="text-[10px] font-bold text-yellow-200">{product.rating}</span>
             </div>
          </div>
          <h3 className="text-lg font-display font-bold text-white leading-snug group-hover:text-nexus-glow transition-colors line-clamp-1">
            {product.name}
          </h3>
        </div>
        
        <p className="text-slate-400 text-sm line-clamp-2 mb-6 leading-relaxed font-light">
          {product.description}
        </p>
        
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
           <div className="flex flex-col">
             <span className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">Price</span>
             <span className="text-xl font-display font-bold text-white tracking-tight">${product.price.toFixed(2)}</span>
           </div>
           
           <div className="flex items-center gap-2">
             <button
               onClick={handleBuyNow}
               className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-white uppercase tracking-wider transition-all hover:border-white/20 hover:shadow-[0_0_10px_rgba(255,255,255,0.1)] active:scale-95 active:bg-white/20"
             >
               Buy
             </button>
             <button 
               onClick={handleAddToCart}
               className={`relative group/btn overflow-hidden rounded-xl border p-2.5 transition-all duration-300 active:scale-90 shadow-lg 
                ${isAdded 
                  ? 'bg-green-500/90 border-green-500 shadow-green-500/20 animate-cart-bounce' 
                  : 'bg-nexus-accent hover:bg-nexus-accentHover border-nexus-accent hover:border-nexus-accentHover shadow-nexus-accent/20'
                }`}
               aria-label={isAdded ? "Added to cart" : "Add to cart"}
             >
               <div className="relative z-10 w-[18px] h-[18px]">
                 <PlusIcon 
                   size={18} 
                   className={`text-white absolute inset-0 transition-all duration-300 transform ${
                     isAdded ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'
                   }`} 
                 />
                 <CheckIcon 
                   size={18} 
                   className={`text-white absolute inset-0 transition-all duration-300 transform ${
                     isAdded ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'
                   }`} 
                 />
               </div>
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
    