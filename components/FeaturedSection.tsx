import React from 'react';
import { Product } from '../types';
import { ArrowRightIcon, SparklesIcon, ShoppingBagIcon, HeartIcon } from 'lucide-react';

interface FeaturedSectionProps {
  products: Product[];
  wishlistItems: Product[];
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
}

const FeaturedSection: React.FC<FeaturedSectionProps> = ({ products, wishlistItems, onAddToCart, onQuickView, onToggleWishlist }) => {
  if (!products.length) return null;

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-nexus-950/50 to-slate-950"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-nexus-900/20 via-slate-950/80 to-slate-950 opacity-50"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center p-2 bg-white/5 rounded-full border border-white/10 mb-4 backdrop-blur-sm">
                <SparklesIcon size={16} className="text-nexus-glow mr-2" />
                <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Curated Selection</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white tracking-tight">
                SAR <span className="text-transparent bg-clip-text bg-gradient-to-r from-nexus-accent to-white">SIGNATURE</span>
            </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {products.slice(0, 3).map((product, index) => {
            const isWishlisted = wishlistItems.some(item => item.id === product.id);
            
            return (
            <div 
                key={product.id} 
                className={`
                    group relative overflow-hidden rounded-3xl 
                    bg-gradient-to-br from-slate-900/80 to-black 
                    border border-white/10 hover:border-nexus-accent/50 
                    transition-all duration-500 hover:shadow-[0_0_50px_rgba(59,130,246,0.2)]
                    ${index === 1 ? 'lg:translate-y-[-20px] z-10' : ''}
                `}
                onClick={() => onQuickView(product)}
            >
                {/* Image Area */}
                <div className="relative aspect-[4/5] overflow-hidden cursor-pointer">
                    <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110 opacity-60 group-hover:opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90"></div>
                    
                    {/* Wishlist Button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleWishlist(product);
                        }}
                        className={`absolute top-6 left-6 p-3 rounded-full backdrop-blur-md border transition-all duration-300 z-20 ${
                            isWishlisted 
                            ? 'bg-pink-500/20 border-pink-500 text-pink-500' 
                            : 'bg-black/40 border-white/10 text-white hover:bg-white/10'
                        }`}
                    >
                        <HeartIcon size={20} className={isWishlisted ? "fill-current" : ""} />
                    </button>

                    {/* Overlay Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <div className="mb-4">
                             <span className="px-3 py-1 bg-nexus-accent text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
                                {product.category}
                             </span>
                        </div>
                        <h3 className="text-2xl font-display font-bold text-white mb-2 leading-tight group-hover:text-nexus-glow transition-colors">
                            {product.name}
                        </h3>
                        <p className="text-slate-400 text-sm line-clamp-2 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                            {product.description}
                        </p>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200 translate-y-4 group-hover:translate-y-0">
                            <div className="flex flex-col">
                                <span className="text-xs text-slate-500 uppercase tracking-wider">Exclusive Price</span>
                                <span className="text-xl font-display font-bold text-white">${product.price.toFixed(2)}</span>
                            </div>
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onAddToCart(product);
                                }}
                                className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:bg-nexus-accent hover:text-white transition-colors"
                                aria-label="Add to cart"
                            >
                                <ShoppingBagIcon size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Hover Reveal Icon */}
                    <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-300">
                        <ArrowRightIcon className="text-white" size={24} />
                    </div>
                </div>
            </div>
          )}})}
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;