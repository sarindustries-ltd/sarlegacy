
import React from 'react';
import { Product, ProductCategory } from '../types';
import ProductCard from './ProductCard';
import { SearchXIcon } from 'lucide-react';

interface ProductListProps {
  products: Product[];
  wishlistItems: Product[];
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onNavigateToProduct: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  onBuyNow: (product: Product) => void;
  selectedCategory: ProductCategory;
}

const ProductList: React.FC<ProductListProps> = ({ 
  products, 
  wishlistItems, 
  onAddToCart, 
  onQuickView, 
  onNavigateToProduct,
  onToggleWishlist,
  onBuyNow,
  selectedCategory
}) => {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-20 animate-in fade-in zoom-in-95 duration-500">
        <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.05)] mb-6">
            <SearchXIcon size={40} className="text-slate-600" />
        </div>
        <h3 className="text-xl font-display font-bold text-white">No Matches Found</h3>
        <p className="text-slate-500 text-lg mt-2 max-w-sm">
          There are no products matching your search in the "{selectedCategory}" category.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 4xl:grid-cols-7 gap-4 sm:gap-6 p-2 sm:p-6">
      {products.map((product, index) => (
        <div 
          key={product.id}
          className="h-full animate-fade-in-up"
          style={{ 
            animationDelay: `${index * 75}ms`,
            animationFillMode: 'both' 
          }}
        >
          <ProductCard 
            product={product} 
            onAddToCart={onAddToCart} 
            onQuickView={onQuickView}
            onNavigateToProduct={onNavigateToProduct}
            isWishlisted={wishlistItems.some(item => item.id === product.id)}
            onToggleWishlist={onToggleWishlist}
            onBuyNow={onBuyNow}
          />
        </div>
      ))}
    </div>
  );
};

export default ProductList;