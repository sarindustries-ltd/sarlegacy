
import React, { useState, useMemo, useEffect } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { PRODUCTS, FACEBOOK_PIXEL_ID, CURRENCY } from './constants';
import { Product, ProductCategory, CartItem } from './types';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductList from './components/ProductList';
import CartDrawer from './components/CartDrawer';
import WishlistDrawer from './components/WishlistDrawer';
import GeminiAssistant from './components/GeminiAssistant';
import Footer from './components/Footer';
import QuickViewModal from './components/QuickViewModal';
import FeaturedSection from './components/FeaturedSection';
import ProductDetails from './components/ProductDetails';
import CheckoutModal from './components/CheckoutModal';
import SEOHead from './components/SEOHead';
import UserProfile from './components/UserProfile';
import { initPixel, trackEvent } from './services/pixelService';
import { FilterIcon, ChevronRightIcon } from 'lucide-react';

type ViewState = 'home' | 'product' | 'profile';

function App() {
  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>(ProductCategory.ALL);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null); // For Modal
  const [activeProduct, setActiveProduct] = useState<Product | null>(null); // For Full Page

  // Initialize Analytics
  useEffect(() => {
    initPixel(FACEBOOK_PIXEL_ID);
  }, []);

  // Track Search Event
  useEffect(() => {
    if (searchQuery.length > 2) {
        const timeoutId = setTimeout(() => {
            trackEvent('Search', {
                search_string: searchQuery
            });
        }, 1000); // Debounce search tracking
        return () => clearTimeout(timeoutId);
    }
  }, [searchQuery]);

  // Filter Products
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(product => {
      const matchesCategory = selectedCategory === ProductCategory.ALL || product.category === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Get Featured Products
  const featuredProducts = useMemo(() => PRODUCTS.filter(p => p.featured), []);

  // Cart Logic
  const addToCart = (product: Product) => {
    // Track FB Pixel Event
    trackEvent('AddToCart', {
      content_name: product.name,
      content_ids: [product.id.toString()],
      content_type: 'product',
      value: product.price,
      currency: CURRENCY
    });

    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: number, delta: number) => {
    setCartItems(prev => 
      prev.map(item => {
        if (item.id === id) {
          return { ...item, quantity: Math.max(1, item.quantity + delta) };
        }
        return item;
      })
    );
  };

  const removeFromCart = (id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Wishlist Logic
  const toggleWishlist = (product: Product) => {
    setWishlistItems(prev => {
      const exists = prev.some(item => item.id === product.id);
      if (!exists) {
        // Track AddToWishlist
        trackEvent('AddToWishlist', {
            content_name: product.name,
            content_ids: [product.id.toString()],
            content_type: 'product',
            value: product.price,
            currency: CURRENCY
        });
        return [...prev, product];
      } else {
        return prev.filter(item => item.id !== product.id);
      }
    });
  };

  const removeFromWishlist = (id: number) => {
    setWishlistItems(prev => prev.filter(item => item.id !== id));
  };

  const moveFromWishlistToCart = (product: Product) => {
    addToCart(product);
  };

  // Navigation Logic
  const navigateToProduct = (product: Product) => {
    setActiveProduct(product);
    setCurrentView('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToProfile = () => {
    setCurrentView('profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateHome = () => {
    setCurrentView('home');
    setActiveProduct(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    
    // Track InitiateCheckout
    // Critical for Pixel optimization as it marks intent
    const totalValue = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    trackEvent('InitiateCheckout', {
        content_ids: cartItems.map(i => i.id.toString()),
        content_type: 'product',
        num_items: cartItems.reduce((acc, i) => acc + i.quantity, 0),
        value: totalValue,
        currency: CURRENCY
    });

    setIsCheckoutOpen(true);
  };

  const cartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistItemCount = wishlistItems.length;
  const cartTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <HelmetProvider>
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-nexus-accent selection:text-white overflow-x-hidden">
        <SEOHead /> {/* Global SEO defaults */}
        
        <Navbar 
          cartItemCount={cartItemCount} 
          wishlistItemCount={wishlistItemCount}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenWishlist={() => setIsWishlistOpen(true)}
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          onLogoClick={navigateHome}
          onNavigateToProfile={navigateToProfile}
        />

        {/* Conditional Rendering based on View State */}
        {currentView === 'home' && (
          <>
            <Hero />

            <main className="w-full max-w-[2400px] mx-auto px-4 sm:px-6 lg:px-8 py-12" id="products">
              
              {/* Sticky Filter Bar */}
              <div className="sticky top-16 z-30 bg-slate-950/90 backdrop-blur-lg -mx-4 px-4 py-4 mb-8 border-b border-slate-800/50 sm:static sm:bg-transparent sm:p-0 sm:border-none sm:mx-0 transition-all duration-300">
                <div className="flex items-center gap-4 overflow-hidden">
                  <div className="hidden sm:flex items-center text-slate-400 text-sm font-medium whitespace-nowrap shrink-0">
                      <FilterIcon size={16} className="mr-2" />
                      Filter:
                  </div>
                  
                  <div className="relative flex-1 w-full overflow-hidden group">
                      <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar w-full snap-x px-1 scroll-smooth items-center">
                      {Object.values(ProductCategory).map((category) => (
                          <button
                          key={category}
                          onClick={() => setSelectedCategory(category)}
                          className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 snap-center active:scale-95 flex-shrink-0 ${
                              selectedCategory === category
                              ? 'bg-nexus-accent text-white shadow-[0_0_20px_rgba(99,102,241,0.4)] scale-105'
                              : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 hover:border-slate-600'
                          }`}
                          >
                          {category}
                          </button>
                      ))}
                      </div>
                      <div className="absolute right-0 top-0 bottom-2 w-12 bg-gradient-to-l from-slate-950 to-transparent pointer-events-none sm:hidden"></div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 px-2">
                <div>
                  <h2 className="text-3xl font-display font-bold text-white flex items-center gap-2">
                      Marketplace
                      <span className="w-2 h-2 bg-nexus-accent rounded-full animate-pulse"></span>
                  </h2>
                  <p className="text-slate-400 text-sm mt-1">Explore the latest in cyber-enhanced lifestyle.</p>
                </div>
                <div className="text-slate-500 text-sm font-medium bg-slate-900/50 px-3 py-1 rounded-lg border border-slate-800 self-start sm:self-auto whitespace-nowrap">
                  Showing {filteredProducts.length} result{filteredProducts.length !== 1 ? 's' : ''}
                </div>
              </div>

              <ProductList 
                products={filteredProducts} 
                wishlistItems={wishlistItems}
                onAddToCart={addToCart} 
                onQuickView={setQuickViewProduct}
                onNavigateToProduct={navigateToProduct}
                onToggleWishlist={toggleWishlist}
              />
            </main>

            <FeaturedSection 
              products={featuredProducts}
              wishlistItems={wishlistItems}
              onAddToCart={addToCart} 
              onQuickView={setQuickViewProduct}
              onToggleWishlist={toggleWishlist}
            />
          </>
        )}

        {/* Product View */}
        {currentView === 'product' && activeProduct && (
          <div className="w-full max-w-[2400px] mx-auto px-4 sm:px-6 lg:px-8 py-24">
             <ProductDetails 
               product={activeProduct}
               onBack={navigateHome}
               onAddToCart={addToCart}
               onNavigateToProduct={navigateToProduct}
               onQuickView={setQuickViewProduct}
               isWishlisted={wishlistItems.some(item => item.id === activeProduct.id)}
               onToggleWishlist={toggleWishlist}
               wishlistItems={wishlistItems}
             />
          </div>
        )}

        {/* Profile View */}
        {currentView === 'profile' && (
          <div className="w-full max-w-[2400px] mx-auto px-4 sm:px-6 lg:px-8 py-24">
              <UserProfile onBack={navigateHome} />
          </div>
        )}

        <Footer />

        <CartDrawer 
          isOpen={isCartOpen} 
          onClose={() => setIsCartOpen(false)}
          cartItems={cartItems}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeFromCart}
          onCheckout={handleCheckout}
        />

        <CheckoutModal 
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          cartItems={cartItems}
          total={cartTotal}
          onClearCart={clearCart}
        />

        <WishlistDrawer 
          isOpen={isWishlistOpen} 
          onClose={() => setIsWishlistOpen(false)}
          wishlistItems={wishlistItems}
          onRemoveItem={removeFromWishlist}
          onMoveToCart={moveFromWishlistToCart}
        />

        <GeminiAssistant />
        
        {/* Keep QuickView modal accessible even if we have a full page, as "preview" */}
        <QuickViewModal 
          product={quickViewProduct} 
          isOpen={!!quickViewProduct} 
          onClose={() => setQuickViewProduct(null)}
          onAddToCart={addToCart}
          isInWishlist={quickViewProduct ? wishlistItems.some(item => item.id === quickViewProduct.id) : false}
          onToggleWishlist={() => quickViewProduct && toggleWishlist(quickViewProduct)}
        />
      </div>
    </HelmetProvider>
  );
}

export default App;
