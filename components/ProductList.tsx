
import React from 'react';
import { Product } from '../types';
import ProductCard from './ProductCard';

interface ProductListProps {
  products: Product[];
  wishlistItems: Product[];
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onNavigateToProduct: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
}

const ProductList: React.FC<ProductListProps> = ({ 
  products, 
  wishlistItems, 
  onAddToCart, 
  onQuickView, 
  onNavigateToProduct,
  onToggleWishlist 
}) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-20 animate-in fade-in zoom-in-95 duration-500">
        <p className="text-slate-500 text-lg">No products found in this category.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 4xl:grid-cols-7 gap-4 sm:gap-6 p-2 sm:p-6">
      {products.map((product, index) => (
        <div 
          key={product.id}
          className="h-full animate-in fade-in slide-in-from-bottom-10 duration-700 ease-out"
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
          />
        </div>
      ))}
    </div>
  );
};

export default ProductList;
