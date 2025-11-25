
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { PRODUCTS, FACEBOOK_PIXEL_ID, CURRENCY, MOCK_USERS, MOCK_ORDERS } from './constants';
import { Product, ProductCategory, CartItem, User, Order } from './types';
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
import { FilterIcon, HeartIcon, EyeIcon } from 'lucide-react';
import AuthPage from './components/AuthPage';
import AdminDashboard from './components/AdminDashboard';

type ViewState = 'home' | 'product' | 'profile';

// Simple Toast Component for non-intrusive feedback
const Toast: React.FC<{ message: string; onClear: () => void }> = ({ message, onClear }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => onClear(), 3000);
      return () => clearTimeout(timer);
    }
  }, [message, onClear]);

  if (!message) return null;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 bg-nexus-900/90 backdrop-blur-md text-white rounded-full text-sm font-medium shadow-2xl border border-white/10 animate-in fade-in slide-in-from-bottom-4 duration-300 flex items-center gap-2">
      <HeartIcon size={16} className="text-pink-400" />
      {message}
    </div>
  );
};

// Custom Interactive Cursor Component
const InteractiveCursor: React.FC<{ isHovering: boolean }> = ({ isHovering }) => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    
    document.addEventListener('mousemove', onMouseMove);
    return () => document.removeEventListener('mousemove', onMouseMove);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] hidden lg:block">
      <div
        className={`absolute w-8 h-8 rounded-full border-2 border-nexus-accent transition-all duration-300 ease-out backdrop-invert -translate-x-1/2 -translate-y-1/2 ${isHovering ? 'scale-150 opacity-50 bg-nexus-accent/20' : 'scale-100 opacity-100'}`}
        style={{ left: `${position.x}px`, top: `${position.y}px` }}
      />
      <div
        className="absolute w-1 h-1 bg-nexus-accent rounded-full -translate-x-1/2 -translate-y-1/2"
        style={{ left: `${position.x}px`, top: `${position.y}px` }}
      />
    </div>
  );
};

function App() {
  // --- STATE MANAGEMENT ---
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [isAdminViewingStore, setIsAdminViewingStore] = useState(false);

  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>(ProductCategory.ALL);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [toastMessage, setToastMessage] = useState('');
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);

  // --- LIFECYCLE & GLOBAL EFFECTS ---
  useEffect(() => {
    initPixel(FACEBOOK_PIXEL_ID);
    const handleMouseEnter = (e: MouseEvent) => { if ((e.target as HTMLElement).closest('a, button, [role="button"], .group, [data-interactive]')) setIsHoveringInteractive(true); };
    const handleMouseLeave = (e: MouseEvent) => { if ((e.target as HTMLElement).closest('a, button, [role="button"], .group, [data-interactive]')) setIsHoveringInteractive(false); };
    document.body.addEventListener('mouseover', handleMouseEnter);
    document.body.addEventListener('mouseout', handleMouseLeave);
    return () => {
      document.body.removeEventListener('mouseover', handleMouseEnter);
      document.body.removeEventListener('mouseout', handleMouseLeave);
    };
  }, []);

  // --- AUTHENTICATION & USER MANAGEMENT ---
  const handleLogin = useCallback((email: string, password: string) => {
    setAuthError(null);
    const potentialUser = users.find(u => u.email === email);
    // In a real app, password would be hashed and checked
    if (email === 'admin@sar-legacy.net' && password === 'superadmin' && potentialUser?.isAdmin) {
        setCurrentUser(potentialUser);
        setIsAdminViewingStore(false); // Default to dashboard view
    } else if (potentialUser && password) { // Mock password check
        setCurrentUser(potentialUser);
        trackEvent('Contact'); 
    } else {
        setAuthError('Invalid credentials. Please try again.');
    }
  }, [users]);

  const handleRegister = useCallback((name: string, email: string) => {
    setAuthError(null);
    if (users.some(u => u.email === email)) {
        setAuthError('An account with this email already exists.');
        return;
    }
    const newUser: User = { 
        id: Date.now(), name, email, avatar: `https://i.pravatar.cc/150?u=${email}`, 
        memberSince: new Date().toISOString().split('T')[0], isAdmin: false,
        lastLogin: new Date().toISOString(), totalSpent: 0 
    };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    trackEvent('CompleteRegistration');
  }, [users]);

  const handleLogout = useCallback(() => {
    setCurrentUser(null);
    setCurrentView('home');
    setIsAdminViewingStore(false);
  }, []);
  
  // --- ADMIN DATA MANAGEMENT ---
  const handleAddProduct = useCallback((productData: Omit<Product, 'id' | 'rating'>) => {
    const newProduct: Product = { ...productData, id: Date.now(), rating: parseFloat((Math.random() * 2 + 3).toFixed(1)) };
    setProducts(prev => [newProduct, ...prev]);
  }, []);

  const handleUpdateProduct = useCallback((updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  }, []);
  
  const handleDeleteProduct = useCallback((productId: number) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  }, []);
  
  const handleUpdateUser = useCallback((updatedUser: User) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  }, []);

  const handleDeleteUser = useCallback((userId: number) => {
    if (userId === currentUser?.id) {
        alert("Cannot delete the currently logged-in user.");
        return;
    }
    setUsers(prev => prev.filter(u => u.id !== userId));
  }, [currentUser]);

  const handleUpdateOrderStatus = useCallback((orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  }, []);

  // --- DERIVED STATE & MEMOS ---
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesCategory = selectedCategory === ProductCategory.ALL || product.category === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery, products]);

  const featuredProducts = useMemo(() => products.filter(p => p.featured), [products]);
  const cartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistItemCount = wishlistItems.length;
  const cartTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  
  // --- SHOPPING & NAVIGATION HANDLERS ---
  const addToCart = useCallback((product: Product) => {
    trackEvent('AddToCart', { content_name: product.name, content_ids: [product.id.toString()], content_type: 'product', value: product.price, currency: CURRENCY });
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  }, []);

  const handleBuyNow = useCallback((product: Product) => {
    setCartItems([{ ...product, quantity: 1 }]);
    setIsCartOpen(false); // Ensure cart is closed
    setIsCheckoutOpen(true);
    trackEvent('InitiateCheckout', { content_ids: [product.id.toString()], num_items: 1, value: product.price, currency: CURRENCY });
  }, []);

  const updateQuantity = useCallback((id: number, delta: number) => setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item)), []);
  const removeFromCart = useCallback((id: number) => setCartItems(prev => prev.filter(item => item.id !== id)), []);
  const clearCart = useCallback(() => setCartItems([]), []);

  const toggleWishlist = useCallback((product: Product) => {
    setWishlistItems(prev => {
      const exists = prev.some(item => item.id === product.id);
      if (!exists) {
        trackEvent('AddToWishlist', { content_name: product.name, content_ids: [product.id.toString()], content_type: 'product', value: product.price, currency: CURRENCY });
        setToastMessage('Added to Wishlist');
        return [...prev, product];
      } else {
        setToastMessage('Removed from Wishlist');
        return prev.filter(item => item.id !== product.id);
      }
    });
  }, []);

  const removeFromWishlist = useCallback((id: number) => setWishlistItems(prev => prev.filter(item => item.id !== id)), []);
  const moveFromWishlistToCart = useCallback((product: Product) => { addToCart(product); removeFromWishlist(product.id); }, [addToCart, removeFromWishlist]);

  const navigateToProduct = useCallback((product: Product) => { setActiveProduct(product); setCurrentView('product'); window.scrollTo({ top: 0, behavior: 'smooth' }); }, []);
  const navigateToProfile = useCallback(() => { setCurrentView('profile'); window.scrollTo({ top: 0, behavior: 'smooth' }); }, []);
  const navigateHome = useCallback(() => { setCurrentView('home'); setActiveProduct(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }, []);

  const handleCheckout = useCallback(() => {
    setIsCartOpen(false);
    trackEvent('InitiateCheckout', { content_ids: cartItems.map(i => i.id.toString()), content_type: 'product', num_items: cartItems.reduce((acc, i) => acc + i.quantity, 0), value: cartTotal, currency: CURRENCY });
    setIsCheckoutOpen(true);
  }, [cartItems, cartTotal]);

  // --- MAIN RENDER LOGIC ---
  const renderContent = () => {
    if (!currentUser) return <AuthPage onLogin={handleLogin} onRegister={handleRegister} error={authError} />;
    if (currentUser.isAdmin && !isAdminViewingStore) {
      return (
        <AdminDashboard 
          user={currentUser}
          products={products}
          users={users}
          orders={orders}
          onLogout={handleLogout}
          onAddProduct={handleAddProduct}
          onUpdateProduct={handleUpdateProduct}
          onDeleteProduct={handleDeleteProduct}
          onUpdateUser={handleUpdateUser}
          onDeleteUser={handleDeleteUser}
          onUpdateOrderStatus={handleUpdateOrderStatus}
        />
      );
    }

    // Default User View or Admin Store View
    return (
      <>
        <Navbar 
          user={currentUser}
          cartItemCount={cartItemCount} 
          wishlistItemCount={wishlistItemCount}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenWishlist={() => setIsWishlistOpen(true)}
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          onLogoClick={navigateHome}
          onNavigateToProfile={navigateToProfile}
          onLogout={handleLogout}
          onNavigateToAdmin={() => setIsAdminViewingStore(false)}
        />

        {currentView === 'home' && (
          <>
            <Hero />
            <main className="w-full max-w-[2400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20" id="products">
              <div className="sticky top-16 z-30 bg-slate-950/90 backdrop-blur-lg -mx-4 px-4 py-4 mb-8 sm:mb-12 border-b border-white/5 sm:static sm:bg-transparent sm:p-0 sm:border-none sm:mx-0 transition-all duration-300">
                <div className="flex items-center gap-4 overflow-hidden">
                  <div className="hidden sm:flex items-center text-slate-400 text-sm font-medium whitespace-nowrap shrink-0"><FilterIcon size={16} className="mr-2" />Filter:</div>
                  <div className="relative flex-1 w-full overflow-hidden group">
                    <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar w-full snap-x px-1 scroll-smooth items-center">
                      {Object.values(ProductCategory).map((category) => (<button key={category} onClick={() => setSelectedCategory(category)} className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 snap-center active:scale-95 flex-shrink-0 border ${selectedCategory === category ? 'bg-nexus-accent text-white border-nexus-accent shadow-[0_0_20px_rgba(59,130,246,0.4)] scale-105' : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border-white/5 hover:border-white/10'}`}>{category}</button>))}
                    </div>
                    <div className="absolute right-0 top-0 bottom-2 w-12 bg-gradient-to-l from-slate-950 to-transparent pointer-events-none sm:hidden"></div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 sm:mb-12 gap-4 px-2">
                <div>
                  <h2 className="text-3xl sm:text-4xl font-display font-bold text-white flex items-center gap-3 tracking-tight">Marketplace<span className="w-2 h-2 bg-nexus-accent rounded-full animate-pulse"></span></h2>
                  <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-lg leading-relaxed">Explore the latest in cyber-enhanced lifestyle. Curated for the modern architect.</p>
                </div>
                <div className="text-slate-500 text-sm font-medium bg-white/5 px-4 py-2 rounded-lg border border-white/10 self-start sm:self-auto whitespace-nowrap font-mono">Showing {filteredProducts.length} result{filteredProducts.length !== 1 ? 's' : ''}</div>
              </div>
              <ProductList products={filteredProducts} wishlistItems={wishlistItems} onAddToCart={addToCart} onQuickView={setQuickViewProduct} onNavigateToProduct={navigateToProduct} onToggleWishlist={toggleWishlist} selectedCategory={selectedCategory} onBuyNow={handleBuyNow}/>
            </main>
            <FeaturedSection products={featuredProducts} wishlistItems={wishlistItems} onAddToCart={addToCart} onQuickView={setQuickViewProduct} onToggleWishlist={toggleWishlist} />
          </>
        )}
        {currentView === 'product' && activeProduct && (<div className="w-full max-w-[2400px] mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24 flex-grow"><ProductDetails product={activeProduct} onBack={navigateHome} onAddToCart={addToCart} onNavigateToProduct={navigateToProduct} onQuickView={setQuickViewProduct} isWishlisted={wishlistItems.some(item => item.id === activeProduct.id)} onToggleWishlist={toggleWishlist} wishlistItems={wishlistItems} onBuyNow={handleBuyNow} /></div>)}
        {currentView === 'profile' && (<div className="w-full max-w-[2400px] mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24 flex-grow"><UserProfile user={currentUser} orders={orders} onBack={navigateHome} onLogout={handleLogout} /></div>)}
        
        <Footer />
        
        <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cartItems={cartItems} onUpdateQuantity={updateQuantity} onRemoveItem={removeFromCart} onCheckout={handleCheckout} />
        <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} cartItems={cartItems} total={cartTotal} onClearCart={clearCart} />
        <WishlistDrawer isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} wishlistItems={wishlistItems} onRemoveItem={removeFromWishlist} onMoveToCart={moveFromWishlistToCart} />
        <GeminiAssistant />
        <QuickViewModal product={quickViewProduct} isOpen={!!quickViewProduct} onClose={() => setQuickViewProduct(null)} onAddToCart={addToCart} isInWishlist={quickViewProduct ? wishlistItems.some(item => item.id === quickViewProduct.id) : false} onToggleWishlist={() => quickViewProduct && toggleWishlist(quickViewProduct)} />
      </>
    );
  };
  
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-nexus-accent selection:text-white overflow-x-hidden flex flex-col">
      <SEOHead />
      <InteractiveCursor isHovering={isHoveringInteractive} />
      
      {/* Admin View Toggle Button */}
      {currentUser?.isAdmin && (
        <button 
          onClick={() => setIsAdminViewingStore(!isAdminViewingStore)}
          className="fixed bottom-6 right-6 z-[100] w-14 h-14 bg-nexus-accent hover:bg-nexus-accentHover rounded-full flex items-center justify-center shadow-lg text-white transition-all hover:scale-110"
          title={isAdminViewingStore ? "Return to Dashboard" : "View Storefront"}
        >
          <EyeIcon size={24} />
        </button>
      )}

      {renderContent()}
      <Toast message={toastMessage} onClear={() => setToastMessage('')} />
    </div>
  );
}

export default App;