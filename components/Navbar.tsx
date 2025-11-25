
import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBagIcon, MenuIcon, SearchIcon, XIcon, SparklesIcon, HeartIcon, UserIcon, SettingsIcon, PackageIcon, LogOutIcon, CreditCardIcon, ChevronDownIcon, GaugeCircleIcon } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  user: User;
  cartItemCount: number;
  wishlistItemCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onLogoClick?: () => void;
  onNavigateToProfile: () => void;
  onLogout?: () => void;
  onNavigateToAdmin?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  user,
  cartItemCount, 
  wishlistItemCount, 
  onOpenCart, 
  onOpenWishlist, 
  searchValue, 
  onSearchChange,
  onLogoClick,
  onNavigateToProfile,
  onLogout,
  onNavigateToAdmin
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogoClick = () => {
      if (onLogoClick) onLogoClick();
      else window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProfileNavigation = () => {
    onNavigateToProfile();
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
  };
  
  const handleAdminNavigation = () => {
    if(onNavigateToAdmin) onNavigateToAdmin();
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
  }

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        scrolled 
          ? 'bg-nexus-950/80 backdrop-blur-xl border-white/5 py-3' 
          : 'bg-transparent border-transparent py-5 lg:py-6'
      }`}
    >
      <div className="w-full max-w-[2400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          <div 
            className="flex-shrink-0 flex items-center cursor-pointer group relative" 
            onClick={handleLogoClick}
            data-interactive
          >
            <div className="absolute -inset-2 bg-nexus-accent/20 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <span className="relative font-display font-black text-2xl sm:text-3xl tracking-[0.15em] text-white uppercase italic leading-none">
              SAR<span className="text-nexus-accent ml-0.5">LEGACY</span>
            </span>
          </div>

          <div className="hidden md:flex flex-1 max-w-xl mx-8 lg:mx-16">
            <div className="relative w-full group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><SearchIcon className="h-4 w-4 text-slate-500 group-focus-within:text-nexus-accent transition-colors" /></div>
              <input type="text" value={searchValue} onChange={(e) => onSearchChange(e.target.value)} className="block w-full pl-10 pr-10 py-2.5 border border-white/10 rounded-full bg-white/5 text-slate-200 placeholder-slate-500 focus:outline-none focus:bg-slate-900/80 focus:border-nexus-accent/50 focus:ring-1 focus:ring-nexus-accent/50 transition-all duration-300 text-sm backdrop-blur-sm" placeholder="Search collection..." />
              {searchValue && (<button onClick={() => onSearchChange('')} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-white transition-colors" aria-label="Clear search"><XIcon className="h-4 w-4" /></button>)}
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
             <button onClick={onOpenWishlist} className="relative p-2.5 text-slate-300 hover:text-pink-400 transition-all duration-300 hover:bg-white/5 rounded-full group hidden sm:block" aria-label="Open wishlist">
              <HeartIcon size={22} className="group-hover:scale-110 transition-transform" />
              {wishlistItemCount > 0 && (<span className="absolute top-0 right-0 inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 text-[10px] font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-pink-500 rounded-full shadow-[0_0_12px_rgba(236,72,153,0.6)] border border-nexus-950">{wishlistItemCount}</span>)}
            </button>

            <button onClick={onOpenCart} className="relative p-2.5 text-slate-300 hover:text-white transition-all duration-300 hover:bg-white/5 rounded-full group" aria-label="Open cart">
              <ShoppingBagIcon size={22} className="group-hover:scale-110 transition-transform" />
              {cartItemCount > 0 && (<span className="absolute top-0 right-0 inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 text-[10px] font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-nexus-accent rounded-full shadow-[0_0_12px_rgba(59,130,246,0.6)] border border-nexus-950">{cartItemCount}</span>)}
            </button>

            <div className="relative hidden sm:block" ref={profileRef}>
              <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-2 pl-1.5 pr-2.5 py-1.5 rounded-full border border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all group">
                 <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 relative"><img src={user.avatar} alt="Profile" className="w-full h-full object-cover group-hover:scale-110 transition-transform" /></div>
                 <ChevronDownIcon size={14} className={`text-slate-400 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              <div className={`absolute right-0 top-full mt-4 w-72 bg-nexus-950/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-200 transform origin-top-right z-50 ${isProfileOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}`}>
                  <div className="p-5 border-b border-white/5 bg-white/5 relative overflow-hidden cursor-pointer" onClick={handleProfileNavigation}>
                     <div className="absolute inset-0 bg-gradient-to-r from-nexus-accent/10 to-transparent opacity-50"></div>
                     <div className="flex items-center gap-3 relative z-10">
                        <div className="w-12 h-12 rounded-full border-2 border-nexus-accent/50 overflow-hidden shadow-[0_0_15px_rgba(59,130,246,0.3)]"><img src={user.avatar} alt="User" className="w-full h-full object-cover" /></div>
                        <div className="min-w-0">
                           <h4 className="text-white font-bold truncate text-sm">{user.name}</h4>
                           <p className="text-slate-400 text-xs truncate font-mono">{user.email}</p>
                        </div>
                     </div>
                     {!user.isAdmin && (
                        <div className="mt-4 flex items-center justify-between text-xs relative z-10">
                            <div className="px-2 py-1 rounded bg-nexus-accent/20 text-nexus-accent font-bold border border-nexus-accent/20 uppercase tracking-wider flex items-center gap-1"><SparklesIcon size={10} /> {user.rank}</div>
                            <div className="text-slate-300 font-mono"><span className="text-white font-bold">{user.credits}</span> CR</div>
                        </div>
                     )}
                  </div>
                  
                  <div className="p-2">
                     {user.isAdmin && (<button onClick={handleAdminNavigation} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium"><GaugeCircleIcon size={16} className="text-slate-500" /> Control Panel</button>)}
                     <button onClick={handleProfileNavigation} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium"><PackageIcon size={16} className="text-slate-500" /> My Orders</button>
                     <button onClick={() => { onOpenWishlist(); setIsProfileOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium">
                        <HeartIcon size={16} className="text-slate-500" />Wishlist {wishlistItemCount > 0 && <span className="ml-auto bg-pink-500/20 text-pink-400 text-[10px] font-bold px-1.5 py-0.5 rounded-full">{wishlistItemCount}</span>}
                     </button>
                     <button onClick={handleProfileNavigation} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium"><CreditCardIcon size={16} className="text-slate-500" /> Wallet & Credits</button>
                     <button onClick={handleProfileNavigation} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium"><SettingsIcon size={16} className="text-slate-500" /> Settings</button>
                  </div>

                  <div className="p-2 border-t border-white/5">
                     <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors text-sm font-medium"><LogOutIcon size={16} /> Sign Out</button>
                  </div>
              </div>
            </div>
            
            <button className="sm:hidden p-2.5 text-slate-300 hover:text-white hover:bg-white/5 rounded-full transition-colors" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
            </button>
          </div>
        </div>
      </div>

      <div className={`md:hidden overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${isMobileMenuOpen ? 'max-h-[90vh] opacity-100 overflow-y-auto' : 'max-h-0 opacity-0'}`}>
        <div className="px-4 pt-4 pb-6 space-y-4 bg-nexus-950/95 backdrop-blur-xl border-b border-white/10 shadow-2xl">
          <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5" onClick={handleProfileNavigation}>
              <div className="w-12 h-12 rounded-full border border-white/10 overflow-hidden"><img src={user.avatar} alt="Profile" className="w-full h-full object-cover" /></div>
              <div className="flex-1">
                  <div className="text-white font-bold text-sm">{user.name}</div>
                  <div className="text-slate-400 text-xs font-mono">{user.email}</div>
                  {!user.isAdmin && (
                    <div className="flex items-center gap-3 mt-2">
                        <span className="text-[10px] bg-nexus-accent/20 text-nexus-accent px-2 py-0.5 rounded border border-nexus-accent/20 font-bold uppercase">{user.rank}</span>
                        <span className="text-[10px] text-slate-300">{user.credits} CR</span>
                    </div>
                  )}
              </div>
          </div>
          <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><SearchIcon className="h-5 w-5 text-slate-500" /></div>
              <input type="text" value={searchValue} onChange={(e) => onSearchChange(e.target.value)} className="block w-full pl-11 pr-10 py-3 border border-white/10 rounded-xl bg-white/5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-nexus-accent/50 transition duration-200 text-base" placeholder="Search products..." />
              {searchValue && (<button onClick={() => onSearchChange('')} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-white transition-colors" aria-label="Clear search"><XIcon className="h-5 w-5" /></button>)}
          </div>
          <nav className="flex flex-col space-y-2">
            <a href="#products" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between px-4 py-3.5 text-base font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors"><span>Shop Collection</span><span className="w-1.5 h-1.5 bg-nexus-accent rounded-full"></span></a>
            <div onClick={() => {onOpenWishlist(); setIsMobileMenuOpen(false);}} className="flex items-center justify-between px-4 py-3.5 text-base font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors cursor-pointer"><span>Wishlist</span><HeartIcon size={18} className={wishlistItemCount > 0 ? "text-pink-500 fill-pink-500" : ""} /></div>
            <a href="#ai-help" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between px-4 py-3.5 text-base font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors"><span>SAR AI Assistant</span><SparklesIcon size={16} className="text-nexus-glow" /></a>
          </nav>
          <div className="pt-4 border-t border-white/5">
            <button onClick={onLogout} className="w-full flex items-center justify-center gap-3 p-3.5 rounded-xl bg-red-500/10 text-red-400 hover:text-red-300 hover:bg-red-500/20 text-sm font-bold uppercase transition-colors"><LogOutIcon size={16} /> Sign Out</button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;