import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Product } from '../types';
import { PRODUCTS, CURRENCY } from '../constants';
import SEOHead from './SEOHead';
import { trackEvent } from '../services/pixelService';
import ProductCard from './ProductCard';
import { 
  StarIcon, ShoppingCartIcon, HeartIcon, ArrowLeftIcon, ShieldCheckIcon, TruckIcon, 
  RefreshCwIcon, MinusIcon, PlusIcon, Share2Icon, CheckIcon, ActivityIcon, ArrowRightIcon, 
  PlayIcon, PauseIcon, Volume2Icon, VolumeXIcon, BoxIcon, CpuIcon, LayersIcon, FilmIcon, 
  ScanIcon, SmartphoneIcon, MaximizeIcon, MinimizeIcon 
} from 'lucide-react';

// --- CUSTOM HOOK FOR VIDEO PLAYER LOGIC ---
const useVideoPlayer = (videoRef: React.RefObject<HTMLVideoElement>, videoContainerRef: React.RefObject<HTMLDivElement>) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0);
  const [isHoveringVolume, setIsHoveringVolume] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const lastVolumeRef = useRef(0.5); // Store the last non-zero volume

  useEffect(() => {
    // Update the ref whenever volume changes and is not zero
    if (volume > 0) {
      lastVolumeRef.current = volume;
    }
  }, [volume]);

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleTimeUpdate = () => videoRef.current && setCurrentTime(videoRef.current.currentTime);
  const handleLoadedMetadata = () => videoRef.current && setDuration(videoRef.current.duration);
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) videoRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const togglePlay = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (videoRef.current) {
      videoRef.current.paused ? videoRef.current.play().catch(console.error) : videoRef.current.pause();
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      const newMuted = newVolume === 0;
      videoRef.current.muted = newMuted;
      setIsMuted(newMuted);
    }
  };
  
  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      const newMuted = !isMuted;
      videoRef.current.muted = newMuted;
      
      if (!newMuted && volume === 0) { // If unmuting AND volume state is 0
        // Restore to last known volume instead of jumping to 100%
        const restoreVolume = lastVolumeRef.current;
        setVolume(restoreVolume); 
        videoRef.current.volume = restoreVolume;
      } else if (newMuted) {
        setVolume(0);
      } else {
        setVolume(videoRef.current.volume);
      }
      setIsMuted(newMuted);
    }
  };

  const toggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoContainerRef.current) {
      !document.fullscreenElement ? videoContainerRef.current.requestFullscreen().catch(console.error) : document.exitFullscreen();
    }
  };

  return {
    isPlaying, setIsPlaying, isMuted, currentTime, duration, volume, isHoveringVolume, isFullscreen,
    formatTime, handleTimeUpdate, handleLoadedMetadata, handleSeek, togglePlay, handleVolumeChange,
    toggleMute, setIsHoveringVolume, toggleFullscreen
  };
};

// --- SUB-COMPONENTS ---
const MediaGallery: React.FC<{
  product: Product;
  mediaItems: {id: string; type: string; src: string}[];
  activeMediaIndex: number;
  setActiveMediaIndex: (index: number) => void;
}> = ({ product, mediaItems, activeMediaIndex, setActiveMediaIndex }) => {
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isZoomed, setIsZoomed] = useState(false);
  const [isARMode, setIsARMode] = useState(false);
  
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);

  const player = useVideoPlayer(videoRef, videoContainerRef);

  const currentMedia = mediaItems[activeMediaIndex];

  useEffect(() => {
    const activeItem = mediaItems[activeMediaIndex];
    if (activeItem.type === 'video' && videoRef.current) {
        videoRef.current.play().catch(error => {
            console.log("Auto-play prevented", error);
            player.setIsPlaying(false);
        });
    } else if (videoRef.current) {
        videoRef.current.pause();
    }
  }, [activeMediaIndex, mediaItems, player]);

  useEffect(() => {
    const handleScroll = () => {
      if (parallaxRef.current && window.innerWidth >= 1024) {
        const scrolled = window.scrollY;
        const maxOffset = 60;
        const offset = Math.min(scrolled * 0.05, maxOffset);
        parallaxRef.current.style.transform = `translateY(${offset}px)`;
      } else if (parallaxRef.current) {
         parallaxRef.current.style.transform = 'none';
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (imageContainerRef.current && currentMedia.type === 'image') {
      const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect();
      setZoomPosition({ x: ((e.clientX - left) / width) * 100, y: ((e.clientY - top) / height) * 100 });
    }
  };
  
  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: product.name, text: `Check out the ${product.name} on SAR Legacy.`, url: window.location.href, }).catch(e => console.log('Error sharing', e));
    } else { alert('Link copied to clipboard!'); }
  };

  return (
    <div className="space-y-6 lg:sticky lg:top-28 h-fit z-10">
      <div 
        ref={imageContainerRef}
        className={`aspect-square sm:aspect-[4/3] lg:aspect-square w-full rounded-3xl overflow-hidden bg-white/5 border border-white/10 relative group shadow-2xl shadow-black/50 ${currentMedia.type === 'image' ? 'cursor-crosshair' : 'cursor-default'}`}
        onMouseEnter={() => currentMedia.type === 'image' && setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        {isARMode && (
          <div className="absolute inset-0 z-20 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in duration-300 rounded-3xl p-4">
            <div className="relative w-64 h-64 border-2 border-nexus-accent/50 rounded-3xl flex flex-col items-center justify-center overflow-hidden bg-black/40 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#3b82f620_1px,transparent_1px),linear-gradient(to_bottom,#3b82f620_1px,transparent_1px)] bg-[size:20px_20px] opacity-30"></div>
                <div className="absolute inset-x-0 h-0.5 bg-nexus-accent shadow-[0_0_20px_#3b82f6] animate-pulse" style={{ top: '50%' }}></div>
                <SmartphoneIcon size={48} className="text-white mb-4 relative z-10 animate-bounce" />
                <p className="text-white font-bold text-center px-4 relative z-10 text-sm font-display tracking-wider">AR VIEW ACTIVE</p>
                <p className="text-nexus-accent text-[10px] font-mono mt-2 animate-pulse">CALIBRATING SENSORS...</p>
            </div>
            <p className="text-slate-400 text-xs mt-6 max-w-xs text-center leading-relaxed">Scan your environment to place the <span className="text-white font-bold">{product.name}</span> in 3D space.</p>
            <button onClick={() => setIsARMode(false)} className="mt-6 px-6 py-2.5 bg-white/10 hover:bg-white/20 rounded-full text-xs font-bold uppercase tracking-wider text-white border border-white/10 transition-colors">Exit Simulation</button>
          </div>
        )}
        <div ref={parallaxRef} className={`w-full h-full ${currentMedia.type === 'image' ? 'h-[115%] -mt-[7.5%]' : ''} will-change-transform relative z-10 flex items-center justify-center bg-black`}>
          {currentMedia.type === 'video' ? (
            <div ref={videoContainerRef} className="w-full h-full relative flex items-center justify-center group/video bg-black cursor-pointer overflow-hidden" onClick={player.togglePlay}>
              <video ref={videoRef} src={currentMedia.src} className="w-full h-full object-contain" loop muted={player.isMuted} playsInline onPlay={() => player.setIsPlaying(true)} onPause={() => player.setIsPlaying(false)} onTimeUpdate={player.handleTimeUpdate} onLoadedMetadata={player.handleLoadedMetadata} />
              <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 pointer-events-none ${player.isPlaying ? 'opacity-0 scale-110' : 'opacity-100 scale-100 bg-black/20'}`}>
                <div className="p-6 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 text-white shadow-[0_0_30px_rgba(0,0,0,0.5)]">{player.isPlaying ? <PauseIcon size={40} fill="currentColor" /> : <PlayIcon size={40} fill="currentColor" className="ml-1" />}</div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 z-30 opacity-0 group-hover/video:opacity-100 transition-all duration-300 cursor-default bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-12 px-4 pb-4 sm:px-6 sm:pb-6" onClick={(e) => e.stopPropagation()}>
                <div className="group/seeker w-full h-2 mb-4 relative cursor-pointer flex items-center">
                  <div className="absolute inset-0 bg-white/20 rounded-full group-hover/seeker:h-2.5 transition-all h-1 top-1/2 -translate-y-1/2"></div>
                  <div className="absolute left-0 bg-nexus-accent rounded-full group-hover/seeker:h-2.5 transition-all h-1 top-1/2 -translate-y-1/2 z-10" style={{ width: `${(player.currentTime / (player.duration || 1)) * 100}%` }}></div>
                  <input type="range" min="0" max={player.duration || 100} step="0.1" value={player.currentTime} onChange={player.handleSeek} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-30" aria-label="Seek video" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button onClick={player.togglePlay} className="text-white hover:text-nexus-accent transition-colors" aria-label={player.isPlaying ? "Pause" : "Play"}>{player.isPlaying ? <PauseIcon size={24} fill="currentColor" /> : <PlayIcon size={24} fill="currentColor" />}</button>
                    <div className="flex items-center gap-2 group/volume" onMouseEnter={() => player.setIsHoveringVolume(true)} onMouseLeave={() => player.setIsHoveringVolume(false)}>
                      <button onClick={player.toggleMute} className="text-white hover:text-nexus-accent transition-colors">{player.isMuted || player.volume === 0 ? <VolumeXIcon size={24} /> : <Volume2Icon size={24} />}</button>
                      <div className={`overflow-hidden transition-all duration-300 ease-out ${player.isHoveringVolume ? 'w-24 opacity-100 ml-2' : 'w-0 opacity-0'}`}><input type="range" min="0" max="1" step="0.05" value={player.isMuted ? 0 : player.volume} onChange={player.handleVolumeChange} className="w-full h-1.5 bg-white/30 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full" aria-label="Volume" /></div>
                    </div>
                    <span className="text-xs font-mono text-slate-300 tabular-nums">{player.formatTime(player.currentTime)} / {player.formatTime(player.duration)}</span>
                  </div>
                  <button onClick={player.toggleFullscreen} className="text-white hover:text-nexus-accent transition-colors" aria-label={player.isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}>{player.isFullscreen ? <MinimizeIcon size={24} /> : <MaximizeIcon size={24} />}</button>
                </div>
              </div>
            </div>
          ) : (<img src={currentMedia.src} alt={product.name} loading="eager" fetchPriority="high" className="w-full h-full object-cover transition-transform duration-200 origin-center" style={{ transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`, transform: isZoomed && !isARMode ? 'scale(2)' : 'scale(1)' }} />)}
        </div>
        <div className="absolute top-4 left-4 z-30 flex flex-col gap-2 pointer-events-none">
          <span className="px-3 py-1.5 bg-black/60 backdrop-blur-md text-white text-xs font-bold rounded-lg uppercase tracking-widest border border-white/10 shadow-lg w-fit">{product.category}</span>
          {product.featured && (<span className="px-3 py-1.5 bg-purple-500/20 backdrop-blur-md text-purple-200 text-xs font-bold rounded-lg uppercase tracking-widest border border-purple-500/30 shadow-lg w-fit flex items-center gap-1"><StarIcon size={10} fill="currentColor" /> Featured</span>)}
        </div>
        <div className="absolute top-4 right-4 z-30 flex gap-3">
          <button onClick={() => setIsARMode(!isARMode)} className={`p-3 rounded-full backdrop-blur-md border transition-all active:scale-95 ${isARMode ? 'bg-nexus-accent text-white border-nexus-accent shadow-[0_0_15px_#3b82f6]' : 'bg-black/40 border-white/10 text-white hover:bg-white/10 hover:text-nexus-accent'}`} title="View in AR"><ScanIcon size={20} /></button>
          <button onClick={handleShare} className="p-3 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white hover:bg-white/10 transition-all active:scale-95 hover:rotate-12" aria-label="Share product"><Share2Icon size={20} /></button>
        </div>
        {currentMedia.type === 'image' && product.video && !isARMode && (
          <div className="absolute bottom-6 right-6 z-30">
            <button onClick={() => { const videoIndex = mediaItems.findIndex(m => m.type === 'video'); if (videoIndex !== -1) setActiveMediaIndex(videoIndex); }} className="flex items-center gap-2 px-4 py-2 rounded-full bg-nexus-accent/90 text-white text-xs font-bold uppercase tracking-widest hover:bg-nexus-accent transition-all shadow-lg active:scale-95 backdrop-blur-md border border-white/10 animate-pulse-slow">
              <PlayIcon size={12} fill="currentColor" />Watch Preview
            </button>
          </div>
        )}
      </div>
      <div className="grid grid-cols-5 gap-4">
        {mediaItems.map((item, idx) => (
          <button key={item.id} onClick={() => setActiveMediaIndex(idx)} className={`aspect-square rounded-xl overflow-hidden border-2 transition-all relative group ${activeMediaIndex === idx ? 'border-nexus-accent ring-2 ring-nexus-accent/20' : 'border-white/5 hover:border-white/20'}`}>
            {item.type === 'video' ? (
              <div className="w-full h-full bg-slate-900 flex items-center justify-center relative">
                <video src={item.src} className="w-full h-full object-cover opacity-60" muted />
                <div className="absolute inset-0 flex items-center justify-center"><div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 text-white"><PlayIcon size={14} fill="currentColor" /></div></div>
                <div className="absolute top-1 right-1 bg-black/60 rounded px-1 text-[8px] font-bold text-white">VIDEO</div>
              </div>
            ) : (
              <img src={item.src} alt={`${product.name} view ${idx + 1}`} className={`w-full h-full object-cover transition-all duration-500 ${activeMediaIndex === idx ? 'opacity-100 scale-110' : 'opacity-60 hover:opacity-100 hover:scale-105'}`} />
            )}
            {activeMediaIndex === idx && <div className="absolute inset-0 bg-nexus-accent/10"></div>}
          </button>
        ))}
      </div>
    </div>
  );
};

const ProductInformation: React.FC<{
  product: Product;
  isWishlisted?: boolean;
  onToggleWishlist: () => void;
  onAddToCart: (product: Product) => void;
  onBuyNow: (product: Product) => void;
}> = ({ product, isWishlisted, onToggleWishlist, onAddToCart, onBuyNow }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedConfig, setSelectedConfig] = useState(0);

  const colors = [{ name: 'Obsidian Black', class: 'bg-slate-900' }, { name: 'Lunar White', class: 'bg-slate-200' }, { name: 'Nexus Blue', class: 'bg-blue-600' }];
  const configs = ['Standard Edition', 'Pro Kit (+ $50)', 'Elite Bundle (+ $120)'];
  const reviews = [{ user: 'Alex K.', rating: 5, text: 'Absolute game changer. The build quality is unmatched.', date: '2 days ago' }, { user: 'Sarah M.', rating: 4, text: 'Great aesthetics, fits perfectly with my setup.', date: '1 week ago' }, { user: 'Jaxon V.', rating: 5, text: 'Worth every credit. The integration is seamless.', date: '3 weeks ago' }];
  
  const handleAddToCart = () => {
    // In a real app, you might want a different logic, but this matches what App.tsx expects
    for (let i = 0; i < quantity; i++) {
        onAddToCart(product);
    }
  };

  return (
    <div className="flex flex-col h-full pt-2">
      <div className="mb-8">
        <h2 className="text-4xl sm:text-5xl 3xl:text-6xl font-display font-bold text-white mb-4 leading-tight tracking-tight">{product.name}</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <div className="flex text-yellow-400">{[...Array(5)].map((_, i) => (<StarIcon key={i} size={16} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} className={i >= Math.floor(product.rating) ? "text-slate-700" : ""} />))}</div>
            <span className="text-slate-300 text-xs font-bold ml-1 underline decoration-slate-600 underline-offset-4 cursor-pointer hover:text-white transition-colors">{reviews.length} Verified Reviews</span>
          </div>
          <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
          <div className="flex items-center gap-1.5 text-green-400 text-xs font-bold uppercase tracking-wide"><CheckIcon size={14} strokeWidth={3} /> In Stock</div>
        </div>
      </div>
      <div className="flex items-end gap-4 mb-8 pb-8 border-b border-white/10">
        <div className="flex flex-col">
          <div className="flex items-baseline gap-3">
            <span className="text-5xl sm:text-6xl font-display font-bold text-white tracking-tight">${product.price.toFixed(2)}</span>
            <span className="text-xl text-slate-500 font-medium line-through decoration-2 decoration-slate-600/50">${(product.price * 1.25).toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="px-2.5 py-1 bg-nexus-accent/10 text-nexus-accent border border-nexus-accent/20 rounded text-[10px] font-bold uppercase tracking-wide">Save 25%</span>
            <span className="text-xs text-slate-400">+ Free Premium Shipping</span>
          </div>
        </div>
      </div>
      <div className="prose prose-invert prose-lg max-w-none text-slate-300 leading-relaxed mb-10 font-light"><p>{product.description}</p></div>
      <div className="space-y-8 mb-10 bg-white/5 p-6 sm:p-8 rounded-[2rem] border border-white/5">
        <div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Select Finish</span>
            <span className="text-xs text-white font-medium">{colors[selectedColor].name}</span>
          </div>
          <div className="flex gap-3">{colors.map((color, idx) => (<button key={idx} onClick={() => setSelectedColor(idx)} className={`w-12 h-12 rounded-full flex items-center justify-center transition-all relative ${selectedColor === idx ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-950 scale-110' : 'hover:scale-105 opacity-70 hover:opacity-100'}`} aria-label={`Select color ${color.name}`}><span className={`w-full h-full rounded-full border border-white/10 ${color.class}`}></span></button>))}</div>
        </div>
        <div>
          <div className="flex justify-between items-center mb-4"><span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Configuration</span><a href="#" className="text-xs text-nexus-accent hover:text-white underline decoration-nexus-accent/30 underline-offset-2">Size Guide</a></div>
          <div className="flex flex-wrap gap-3">{configs.map((config, i) => (<button key={i} onClick={() => setSelectedConfig(i)} className={`px-5 py-3.5 rounded-xl border text-sm font-medium transition-all flex-1 min-w-[140px] text-center ${selectedConfig === i ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]' : 'bg-black/40 text-slate-400 border-white/10 hover:border-white/30 hover:text-white'}`}>{config}</button>))}</div>
        </div>
        <div className="pt-6 border-t border-white/5 flex-col sm:flex-row gap-4 flex">
          <div className="flex items-center bg-black/40 rounded-2xl border border-white/10 h-[60px]">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-5 h-full text-slate-400 hover:text-white transition-colors active:scale-90" aria-label="Decrease quantity"><MinusIcon size={20} /></button>
            <span className="w-14 text-center font-mono font-bold text-white text-lg">{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)} className="px-5 h-full text-slate-400 hover:text-white transition-colors active:scale-90" aria-label="Increase quantity"><PlusIcon size={20} /></button>
          </div>
          <button onClick={handleAddToCart} className="flex-1 h-[60px] bg-nexus-accent hover:bg-nexus-accentHover text-white font-bold text-lg rounded-2xl shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-all hover:shadow-[0_0_50px_rgba(59,130,246,0.5)] hover:-translate-y-1 active:scale-[0.98] flex items-center justify-center gap-3 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:animate-[shimmer_1s_infinite]"></div>
            <ShoppingCartIcon size={22} /><span>Add to Cart</span>
          </button>
           <button onClick={onToggleWishlist} className={`h-[60px] w-[60px] flex items-center justify-center rounded-2xl border transition-all hover:-translate-y-1 active:scale-[0.98] ${isWishlisted ? 'bg-pink-500/20 border-pink-500 text-pink-500' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'}`} aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}>
            <HeartIcon size={24} className={isWishlisted ? "fill-current" : ""} />
          </button>
        </div>
      </div>
    </div>
  );
};


// --- MAIN PRODUCT DETAILS COMPONENT ---
interface ProductDetailsProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (product: Product) => void;
  onNavigateToProduct: (product: Product) => void;
  onQuickView: (product: Product) => void;
  isWishlisted?: boolean;
  onToggleWishlist: (product: Product) => void;
  wishlistItems: Product[];
  onBuyNow: (product: Product) => void;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ 
  product, onBack, onAddToCart, onNavigateToProduct, onQuickView, 
  isWishlisted, onToggleWishlist, wishlistItems, onBuyNow 
}) => {
  useEffect(() => {
    trackEvent('ViewContent', {
      content_name: product.name,
      content_ids: [product.id.toString()],
      content_type: 'product',
      value: product.price,
      currency: CURRENCY
    });
  }, [product]);

  const relatedProducts = useMemo(() => {
    return PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 5);
  }, [product]);

  const mediaItems = useMemo(() => {
    const items: {id: string; type: 'image' | 'video'; src: string}[] = [{ id: 'img-main', type: 'image', src: product.image }];
    if (product.video) {
      items.push({ id: 'vid-main', type: 'video', src: product.video });
    }
    // Add more placeholder images for gallery
    for (let i = 2; i < 6; i++) {
        // use a different seed for each image to avoid duplicates
        const seed = product.id + i;
        items.push({ id: `img-${i}`, type: 'image', src: `https://picsum.photos/seed/${seed}/800/800` });
    }
    return items.slice(0, 5); // Limit to 5 media items
  }, [product]);
  
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  
  useEffect(() => {
    setActiveMediaIndex(0); // Reset to main image when product changes
  }, [product]);


  return (
    <div className="animate-in fade-in duration-500">
      <SEOHead 
        title={product.name}
        description={product.description}
        image={product.image}
        type="product"
        product={product}
      />
      <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group font-medium mb-8">
        <ArrowLeftIcon size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Marketplace
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">
        <MediaGallery 
          product={product}
          mediaItems={mediaItems} 
          activeMediaIndex={activeMediaIndex}
          setActiveMediaIndex={setActiveMediaIndex}
        />
        <ProductInformation 
          product={product} 
          isWishlisted={isWishlisted} 
          onToggleWishlist={() => onToggleWishlist(product)} 
          onAddToCart={onAddToCart}
          onBuyNow={onBuyNow}
        />
      </div>

      <div className="mt-24 pt-16 border-t border-white/5">
        <div className="flex items-center gap-3 mb-8">
            <h2 className="text-3xl font-display font-bold text-white">Related Cyberware</h2>
            <div className="w-full h-px bg-gradient-to-r from-nexus-accent/30 to-transparent"></div>
        </div>
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {relatedProducts.map((p, index) => (
             <div 
                key={p.id}
                className="h-full animate-fade-in-up"
                style={{ 
                    animationDelay: `${index * 75}ms`,
                    animationFillMode: 'both' 
                }}
            >
                <ProductCard 
                    product={p} 
                    onAddToCart={onAddToCart} 
                    onQuickView={onQuickView} 
                    onNavigateToProduct={onNavigateToProduct}
                    isWishlisted={wishlistItems.some(item => item.id === p.id)}
                    onToggleWishlist={onToggleWishlist}
                    onBuyNow={onBuyNow}
                />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
// FIX: Added default export for the ProductDetails component.
export default ProductDetails;
