
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Product } from '../types';
import { PRODUCTS, CURRENCY } from '../constants';
import SEOHead from './SEOHead';
import { trackEvent } from '../services/pixelService';
import ProductCard from './ProductCard';
import { 
  StarIcon, 
  ShoppingCartIcon, 
  HeartIcon, 
  ArrowLeftIcon, 
  ShieldCheckIcon, 
  TruckIcon, 
  RefreshCwIcon, 
  MinusIcon, 
  PlusIcon, 
  Share2Icon,
  CheckIcon,
  ActivityIcon,
  ArrowRightIcon,
  PlayIcon,
  PauseIcon,
  Volume2Icon,
  VolumeXIcon,
  BoxIcon,
  CpuIcon,
  LayersIcon,
  FilmIcon
} from 'lucide-react';

interface ProductDetailsProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (product: Product) => void;
  onNavigateToProduct: (product: Product) => void;
  onQuickView: (product: Product) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  wishlistItems?: Product[];
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ 
  product, 
  onBack, 
  onAddToCart, 
  onNavigateToProduct,
  onQuickView,
  isWishlisted, 
  onToggleWishlist,
  wishlistItems = []
}) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedTab, setSelectedTab] = useState<'description' | 'specs' | 'reviews'>('description');
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedConfig, setSelectedConfig] = useState(0);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isZoomed, setIsZoomed] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Construct Media List (Images + Video)
  const mediaItems = useMemo(() => {
    const items = [
      { type: 'image', src: product.image, id: 'img-main' },
      { type: 'image', src: product.image, id: 'img-2' }, // Mock variants
      { type: 'image', src: product.image, id: 'img-3' },
      { type: 'image', src: product.image, id: 'img-4' },
    ];
    if (product.video) {
      // Insert video as second item for better visibility, or keep at end
      items.splice(1, 0, { type: 'video', src: product.video, id: 'vid-main' });
    }
    return items;
  }, [product]);

  // Mock Variants
  const colors = [
    { name: 'Obsidian Black', class: 'bg-slate-900' },
    { name: 'Lunar White', class: 'bg-slate-200' },
    { name: 'Nexus Blue', class: 'bg-blue-600' }
  ];

  const configs = ['Standard Edition', 'Pro Kit (+ $50)', 'Elite Bundle (+ $120)'];

  // Track ViewContent
  useEffect(() => {
    trackEvent('ViewContent', {
        content_name: product.name,
        content_ids: [product.id.toString()],
        content_type: 'product',
        content_category: product.category,
        value: product.price,
        currency: CURRENCY
    });
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Reset state
    setQuantity(1);
    setActiveMediaIndex(0);
    setSelectedTab('description');
    setSelectedColor(0);
    setSelectedConfig(0);
    setIsPlaying(false);
  }, [product.id]);

  // Parallax Effect
  useEffect(() => {
    const handleScroll = () => {
      if (parallaxRef.current && window.innerWidth >= 1024) {
        const scrolled = window.scrollY;
        const maxOffset = 80;
        const offset = Math.min(scrolled * 0.08, maxOffset);
        parallaxRef.current.style.transform = `translateY(${offset}px)`;
      } else if (parallaxRef.current) {
         parallaxRef.current.style.transform = 'none';
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-play video when switched to
  useEffect(() => {
    const activeItem = mediaItems[activeMediaIndex];
    if (activeItem.type === 'video' && videoRef.current) {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                // setIsPlaying(true) handled by onPlay
            }).catch((error) => {
                console.log("Auto-play prevented", error);
                setIsPlaying(false);
            });
        }
    } else if (videoRef.current) {
        videoRef.current.pause();
        setIsPlaying(false);
    }
    
    return () => {
        if(videoRef.current) {
            videoRef.current.pause();
        }
    };
  }, [activeMediaIndex, mediaItems]);

  const togglePlay = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (videoRef.current) {
        if (videoRef.current.paused) {
            videoRef.current.play().catch(e => console.error("Play failed", e));
        } else {
            videoRef.current.pause();
        }
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (videoRef.current) {
          videoRef.current.muted = !isMuted;
          setIsMuted(!isMuted);
      }
  };

  // Image Zoom Handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current || mediaItems[activeMediaIndex].type === 'video') return;
    const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x, y });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out the ${product.name} on SAR Legacy.`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing', error);
      }
    } else {
      alert('Link copied to clipboard!'); 
    }
  };

  const relatedProducts = useMemo(() => {
    return PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  }, [product]);

  const specs = [
    { label: 'Material', value: 'Premium Composite / Titanium Alloy' },
    { label: 'Weight', value: '240g' },
    { label: 'Warranty', value: '2 Year SAR Shield' },
    { label: 'Origin', value: 'Designed in Neo-Tokyo' },
    { label: 'SKU', value: `SAR-${product.id.toString().padStart(4, '0')}` },
    { label: 'Connectivity', value: 'Quantum Link v5.0' }
  ];

  const reviews = [
    { user: 'Alex K.', rating: 5, text: 'Absolute game changer. The build quality is unmatched.', date: '2 days ago' },
    { user: 'Sarah M.', rating: 4, text: 'Great aesthetics, fits perfectly with my setup.', date: '1 week ago' },
    { user: 'Jaxon V.', rating: 5, text: 'Worth every credit. The integration is seamless.', date: '3 weeks ago' }
  ];

  const currentMedia = mediaItems[activeMediaIndex];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24 pt-4 relative">
      <SEOHead 
        title={product.name}
        description={product.description}
        image={product.image}
        type="product"
        product={product}
      />

      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm text-slate-500 overflow-x-auto no-scrollbar whitespace-nowrap">
            <button 
            onClick={onBack}
            className="flex items-center gap-2 hover:text-white transition-colors group flex-shrink-0 font-medium"
            aria-label="Back to catalog"
            >
            <ArrowLeftIcon size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back
            </button>
            <span className="text-slate-800" aria-hidden="true">/</span>
            <span className="hover:text-nexus-accent cursor-pointer transition-colors uppercase tracking-wider text-xs font-bold">{product.category}</span>
            <span className="text-slate-800" aria-hidden="true">/</span>
            <h1 className="text-slate-200 font-medium truncate max-w-[200px] sm:max-w-none text-sm m-0 p-0">{product.name}</h1>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 font-mono">
             <ActivityIcon size={12} className="text-green-500 animate-pulse" />
             <span>24 people viewing this</span>
        </div>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 2xl:gap-24">
        
        {/* Left Column: Media Gallery */}
        <div className="space-y-6 lg:sticky lg:top-24 h-fit z-10">
          <div 
            ref={imageContainerRef}
            className={`
              aspect-square sm:aspect-[4/3] lg:aspect-square w-full rounded-3xl overflow-hidden 
              bg-white/5 border border-white/10 relative group shadow-2xl shadow-black/50 
              ${currentMedia.type === 'image' ? 'cursor-crosshair' : 'cursor-default'}
            `}
            onMouseEnter={() => currentMedia.type === 'image' && setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onMouseMove={handleMouseMove}
          >
            {currentMedia.type === 'image' && (
               <div className="absolute inset-0 bg-nexus-accent/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 mix-blend-overlay"></div>
            )}
            
            {/* Main Media Display */}
            <div 
                ref={parallaxRef} 
                className="w-full h-[115%] -mt-[7.5%] will-change-transform relative z-10 flex items-center justify-center bg-black"
            >
              {currentMedia.type === 'video' ? (
                <div className="w-full h-full relative flex items-center justify-center group/video bg-black cursor-pointer" onClick={togglePlay}>
                    <video
                        ref={videoRef}
                        src={currentMedia.src}
                        className="w-full h-full object-cover"
                        loop
                        muted={isMuted}
                        playsInline
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                    />
                    
                    {/* Overlay Gradient for controls visibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/video:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

                    {/* Center Play/Pause Button */}
                    <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${isPlaying ? 'opacity-0 group-hover/video:opacity-100' : 'opacity-100 bg-black/20'}`}>
                         <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                togglePlay();
                            }}
                            className="p-5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-nexus-accent hover:border-nexus-accent transition-all shadow-2xl hover:scale-110 active:scale-95 transform"
                        >
                            {isPlaying ? <PauseIcon size={32} fill="currentColor" /> : <PlayIcon size={32} fill="currentColor" className="ml-1" />}
                        </button>
                    </div>
                    
                    {/* Bottom Controls */}
                    <div className="absolute bottom-6 right-6 z-30 opacity-0 group-hover/video:opacity-100 transition-opacity duration-300 flex gap-4">
                        <button 
                          onClick={toggleMute} 
                          className="p-3 rounded-full bg-black/50 border border-white/10 text-white hover:bg-nexus-accent hover:border-nexus-accent backdrop-blur-md transition-all active:scale-95"
                        >
                            {isMuted ? <VolumeXIcon size={20} /> : <Volume2Icon size={20} />}
                        </button>
                    </div>
                </div>
              ) : (
                <img 
                    src={currentMedia.src} 
                    alt={product.name}
                    loading="eager"
                    // @ts-ignore
                    fetchPriority="high" 
                    className="w-full h-full object-cover transition-transform duration-200 origin-center"
                    style={{
                        transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                        transform: isZoomed ? 'scale(2)' : 'scale(1)'
                    }}
                />
              )}
            </div>
            
            {/* Floating Badges */}
            <div className="absolute top-4 left-4 z-30 flex flex-col gap-2 pointer-events-none">
                 <span className="px-3 py-1.5 bg-black/60 backdrop-blur-md text-white text-xs font-bold rounded-lg uppercase tracking-widest border border-white/10 shadow-lg w-fit">
                    {product.category}
                 </span>
                 {product.featured && (
                    <span className="px-3 py-1.5 bg-purple-500/20 backdrop-blur-md text-purple-200 text-xs font-bold rounded-lg uppercase tracking-widest border border-purple-500/30 shadow-lg w-fit flex items-center gap-1">
                        <StarIcon size={10} fill="currentColor" /> Featured
                    </span>
                 )}
            </div>

            <div className="absolute top-4 right-4 z-30">
               <button 
                 onClick={handleShare}
                 className="p-3 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white hover:bg-white/10 transition-all active:scale-95 hover:rotate-12"
                 aria-label="Share product"
               >
                 <Share2Icon size={20} />
               </button>
            </div>

            {/* Zoom Hint (Only for Images) */}
            {currentMedia.type === 'image' && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10 text-[10px] text-white uppercase tracking-widest font-bold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    Hover to Zoom
                </div>
            )}
            
            {/* Floating "Watch Video" Button if current is Image but Video Exists */}
            {currentMedia.type === 'image' && product.video && (
                <div className="absolute bottom-6 right-6 z-30">
                     <button 
                        onClick={() => {
                            // Find index of video
                            const videoIndex = mediaItems.findIndex(m => m.type === 'video');
                            if (videoIndex !== -1) setActiveMediaIndex(videoIndex);
                        }}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-nexus-accent/90 text-white text-xs font-bold uppercase tracking-widest hover:bg-nexus-accent transition-all shadow-lg active:scale-95 backdrop-blur-md border border-white/10 animate-pulse-slow"
                     >
                        <PlayIcon size={12} fill="currentColor" />
                        Watch Preview
                     </button>
                </div>
            )}
          </div>
          
          {/* Thumbnails */}
          <div className="grid grid-cols-5 gap-3">
             {mediaItems.map((item, idx) => (
               <button 
                key={idx}
                onClick={() => setActiveMediaIndex(idx)}
                className={`aspect-square rounded-xl overflow-hidden border-2 transition-all relative group ${activeMediaIndex === idx ? 'border-nexus-accent ring-2 ring-nexus-accent/20' : 'border-white/5 hover:border-white/20'}`}
               >
                 {item.type === 'video' ? (
                    <div className="w-full h-full bg-slate-900 flex items-center justify-center relative">
                        <video src={item.src} className="w-full h-full object-cover opacity-60" muted />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 text-white">
                                <PlayIcon size={14} fill="currentColor" />
                            </div>
                        </div>
                        {activeMediaIndex === idx && <div className="absolute inset-0 bg-nexus-accent/20 border-nexus-accent"></div>}
                        <div className="absolute top-1 right-1 bg-black/60 rounded px-1 text-[8px] font-bold text-white">VIDEO</div>
                    </div>
                 ) : (
                    <>
                        <img src={item.src} alt={`${product.name} view ${idx + 1}`} className={`w-full h-full object-cover transition-all duration-500 ${activeMediaIndex === idx ? 'opacity-100 scale-110' : 'opacity-60 hover:opacity-100 hover:scale-105'}`} />
                        {activeMediaIndex === idx && <div className="absolute inset-0 bg-nexus-accent/10"></div>}
                        {idx === 0 && product.video && (
                            <div className="absolute top-1 right-1 bg-nexus-accent/80 rounded-full p-0.5">
                                <FilmIcon size={8} className="text-white" />
                            </div>
                        )}
                    </>
                 )}
               </button>
             ))}
          </div>
        </div>

        {/* Right Column: Product Info */}
        <div className="flex flex-col h-full pt-2">
          <div className="mb-6">
             <h2 className="text-4xl sm:text-5xl 3xl:text-6xl font-display font-bold text-white mb-3 leading-tight tracking-tight">
                {product.name}
            </h2>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                    <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                        <StarIcon key={i} size={16} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} className={i >= Math.floor(product.rating) ? "text-slate-700" : ""} />
                        ))}
                    </div>
                    <span className="text-slate-300 text-xs font-bold ml-1 underline decoration-slate-600 underline-offset-4 cursor-pointer hover:text-white transition-colors">{reviews.length} Verified Reviews</span>
                </div>
                <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                <div className="flex items-center gap-1.5 text-green-400 text-xs font-bold uppercase tracking-wide">
                    <CheckIcon size={14} strokeWidth={3} />
                    In Stock
                </div>
            </div>
          </div>

          {/* Price Card */}
          <div className="flex items-end gap-4 mb-8 pb-8 border-b border-white/10">
            <div className="flex flex-col">
                <div className="flex items-baseline gap-2">
                    <span className="text-5xl sm:text-6xl font-display font-bold text-white tracking-tight">
                        ${product.price.toFixed(2)}
                    </span>
                    <span className="text-xl text-slate-500 font-medium line-through">
                        ${(product.price * 1.25).toFixed(2)}
                    </span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                     <span className="px-2 py-0.5 bg-nexus-accent/10 text-nexus-accent border border-nexus-accent/20 rounded text-[10px] font-bold uppercase tracking-wide">
                        Save 25%
                     </span>
                     <span className="text-xs text-slate-400">+ Free Premium Shipping</span>
                </div>
            </div>
          </div>

          {/* Description Short */}
          <div className="prose prose-invert prose-sm max-w-none text-slate-300 leading-relaxed mb-8">
            <p>{product.description}</p>
          </div>

          {/* Selectors Group */}
          <div className="space-y-8 mb-10 bg-white/5 p-6 rounded-3xl border border-white/5">
             
             {/* Color Selector */}
             <div>
                <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Select Finish</span>
                    <span className="text-xs text-white font-medium">{colors[selectedColor].name}</span>
                </div>
                <div className="flex gap-3">
                    {colors.map((color, idx) => (
                        <button
                            key={idx}
                            onClick={() => setSelectedColor(idx)}
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all relative ${selectedColor === idx ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-950 scale-110' : 'hover:scale-105 opacity-70 hover:opacity-100'}`}
                            aria-label={`Select color ${color.name}`}
                        >
                            <span className={`w-full h-full rounded-full border border-white/10 ${color.class}`}></span>
                        </button>
                    ))}
                </div>
             </div>

             {/* Config Selector */}
             <div>
                <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Configuration</span>
                    <a href="#" className="text-xs text-nexus-accent hover:text-white underline decoration-nexus-accent/30 underline-offset-2">Size Guide</a>
                </div>
                <div className="flex flex-wrap gap-3">
                   {configs.map((config, i) => (
                      <button 
                        key={i} 
                        onClick={() => setSelectedConfig(i)}
                        className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all flex-1 min-w-[140px] text-center ${selectedConfig === i ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]' : 'bg-black/40 text-slate-400 border-white/10 hover:border-white/30 hover:text-white'}`}
                      >
                         {config}
                      </button>
                   ))}
                </div>
             </div>

             {/* Quantity & Add to Cart */}
             <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row gap-4">
                <div className="flex items-center bg-black/40 rounded-xl border border-white/10 h-[56px]">
                    <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 h-full text-slate-400 hover:text-white transition-colors active:scale-90"
                    aria-label="Decrease quantity"
                    >
                    <MinusIcon size={18} />
                    </button>
                    <span className="w-12 text-center font-mono font-bold text-white text-lg">{quantity}</span>
                    <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 h-full text-slate-400 hover:text-white transition-colors active:scale-90"
                    aria-label="Increase quantity"
                    >
                    <PlusIcon size={18} />
                    </button>
                </div>

                <button 
                    onClick={() => {
                        for(let i=0; i<quantity; i++) onAddToCart(product);
                    }}
                    className="flex-1 h-[56px] bg-nexus-accent hover:bg-nexus-accentHover text-white font-bold text-lg rounded-xl shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-all hover:shadow-[0_0_50px_rgba(59,130,246,0.5)] hover:-translate-y-1 active:scale-[0.98] flex items-center justify-center gap-3 relative overflow-hidden group"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:animate-[shimmer_1s_infinite]"></div>
                    <ShoppingCartIcon size={20} />
                    <span>Add to Cart</span>
                    <span className="w-px h-4 bg-white/20 mx-1"></span>
                    <span>${(product.price * quantity).toFixed(2)}</span>
                </button>

                <button 
                onClick={() => onToggleWishlist(product)}
                className={`h-[56px] w-[56px] rounded-xl border transition-all flex items-center justify-center hover:scale-105 active:scale-95 ${isWishlisted ? 'bg-pink-500/10 border-pink-500 text-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.2)]' : 'bg-black/40 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'}`}
                title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                >
                <HeartIcon size={24} className={isWishlisted ? "fill-current" : ""} />
                </button>
             </div>
          </div>

          {/* Urgency Message */}
          <div className="bg-yellow-500/5 border border-yellow-500/10 rounded-xl p-4 flex items-start gap-3 mb-8">
             <div className="p-1.5 bg-yellow-500/10 rounded-lg text-yellow-500 mt-0.5">
                <ActivityIcon size={16} />
             </div>
             <div>
                <h4 className="text-yellow-500 font-bold text-sm mb-0.5">High Demand</h4>
                <p className="text-yellow-500/70 text-xs">
                    {Math.floor(Math.random() * 10) + 5} items sold in the last hour. Order soon to ensure availability.
                </p>
             </div>
          </div>
          
          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-4 mt-auto pt-8 border-t border-white/10 text-center">
             <div className="flex flex-col items-center gap-3 text-slate-400 group cursor-default p-4 rounded-2xl hover:bg-white/5 transition-colors">
                <div className="p-2.5 rounded-full bg-white/5 group-hover:bg-nexus-accent/20 group-hover:text-nexus-accent transition-colors">
                    <ShieldCheckIcon size={24} />
                </div>
                <div className="flex flex-col">
                    <span className="text-xs font-bold uppercase tracking-wider text-white">Secure</span>
                    <span className="text-[10px] text-slate-500">Encryption</span>
                </div>
             </div>
             <div className="flex flex-col items-center gap-3 text-slate-400 group cursor-default p-4 rounded-2xl hover:bg-white/5 transition-colors">
                <div className="p-2.5 rounded-full bg-white/5 group-hover:bg-nexus-accent/20 group-hover:text-nexus-accent transition-colors">
                    <TruckIcon size={24} />
                </div>
                <div className="flex flex-col">
                    <span className="text-xs font-bold uppercase tracking-wider text-white">Fast Ship</span>
                    <span className="text-[10px] text-slate-500">Global Delivery</span>
                </div>
             </div>
             <div className="flex flex-col items-center gap-3 text-slate-400 group cursor-default p-4 rounded-2xl hover:bg-white/5 transition-colors">
                 <div className="p-2.5 rounded-full bg-white/5 group-hover:bg-nexus-accent/20 group-hover:text-nexus-accent transition-colors">
                    <RefreshCwIcon size={24} />
                </div>
                <div className="flex flex-col">
                    <span className="text-xs font-bold uppercase tracking-wider text-white">Returns</span>
                    <span className="text-[10px] text-slate-500">30 Days</span>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Info Tabs Section */}
      <div className="mt-32 max-w-6xl mx-auto">
         <div className="flex justify-center mb-12">
             <div className="inline-flex bg-black/40 backdrop-blur-xl p-1.5 rounded-full border border-white/10 relative z-10">
                {['description', 'specs', 'reviews'].map((tab) => (
                <button
                    key={tab}
                    onClick={() => setSelectedTab(tab as any)}
                    className={`px-8 py-3 rounded-full text-sm font-bold uppercase tracking-widest transition-all relative z-10 ${selectedTab === tab ? 'text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    {tab}
                    {selectedTab === tab && (
                        <span className="absolute inset-0 bg-nexus-accent rounded-full -z-10 animate-in zoom-in-90 duration-200"></span>
                    )}
                </button>
                ))}
             </div>
         </div>

         <div className="min-h-[400px] bg-white/5 rounded-[3rem] p-8 sm:p-16 border border-white/5 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-nexus-accent/5 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

            {selectedTab === 'description' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 space-y-12 relative z-10">
                   <div className="max-w-3xl mx-auto text-center">
                        <h3 className="text-3xl sm:text-4xl font-display font-bold text-white mb-6">Engineering the Future</h3>
                        <p className="text-slate-400 leading-relaxed text-lg">
                            {product.description} Engineered for the demanding requirements of modern life, this item represents the pinnacle of SAR Legacy's design philosophy. Every curve and material choice serves a purpose, merging functionality with high-end aesthetics.
                        </p>
                   </div>
                   
                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <div className="p-8 bg-black/20 rounded-3xl border border-white/5 hover:border-nexus-accent/30 transition-colors group text-center">
                         <div className="w-14 h-14 mx-auto bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform group-hover:bg-nexus-accent group-hover:text-white">
                            <BoxIcon size={24} />
                         </div>
                         <h4 className="text-white font-bold text-lg mb-2">Premium Packaging</h4>
                         <p className="text-sm text-slate-400 leading-relaxed">Unboxing experience redesigned with sustainable, high-grade materials.</p>
                      </div>
                      <div className="p-8 bg-black/20 rounded-3xl border border-white/5 hover:border-nexus-accent/30 transition-colors group text-center">
                         <div className="w-14 h-14 mx-auto bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform group-hover:bg-nexus-accent group-hover:text-white">
                             <CpuIcon size={24} />
                         </div>
                         <h4 className="text-white font-bold text-lg mb-2">Next-Gen Materials</h4>
                         <p className="text-sm text-slate-400 leading-relaxed">Built to last a lifetime using aerospace-grade composites and alloys.</p>
                      </div>
                      <div className="p-8 bg-black/20 rounded-3xl border border-white/5 hover:border-nexus-accent/30 transition-colors group text-center">
                         <div className="w-14 h-14 mx-auto bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform group-hover:bg-nexus-accent group-hover:text-white">
                             <LayersIcon size={24} />
                         </div>
                         <h4 className="text-white font-bold text-lg mb-2">Modular Design</h4>
                         <p className="text-sm text-slate-400 leading-relaxed">Future-proof your gear with our proprietary modular attachment system.</p>
                      </div>
                   </div>
                </div>
            )}
            {selectedTab === 'specs' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-8 animate-in fade-in slide-in-from-bottom-4 relative z-10 max-w-4xl mx-auto">
                   {specs.map((spec, i) => (
                      <div key={i} className="flex justify-between py-4 border-b border-white/5 items-center group hover:border-white/20 transition-colors">
                         <span className="text-slate-500 text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-nexus-accent/50 group-hover:bg-nexus-accent transition-colors"></span>
                            {spec.label}
                         </span>
                         <span className="text-slate-200 text-base font-mono bg-black/20 px-3 py-1 rounded border border-white/5">{spec.value}</span>
                      </div>
                   ))}
                </div>
            )}
            {selectedTab === 'reviews' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 relative z-10 max-w-3xl mx-auto">
                   <div className="flex items-center justify-between mb-8 pb-8 border-b border-white/10">
                        <div>
                            <h3 className="text-2xl font-bold text-white">Customer Reviews</h3>
                            <div className="flex items-center gap-2 mt-1">
                                <div className="flex text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                    <StarIcon key={i} size={16} fill="currentColor" />
                                    ))}
                                </div>
                                <span className="text-slate-400 text-sm">Based on {reviews.length} verified reviews</span>
                            </div>
                        </div>
                        <button className="px-6 py-3 border border-white/20 rounded-xl text-white hover:bg-white/5 transition-colors font-bold text-sm">
                            Write a Review
                        </button>
                   </div>

                   {reviews.map((review, i) => (
                      <div key={i} className="p-8 rounded-3xl bg-black/20 border border-white/5 hover:border-white/10 transition-colors">
                         <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-4">
                               <div className="w-10 h-10 rounded-full bg-gradient-to-br from-nexus-accent to-blue-700 flex items-center justify-center text-sm font-bold text-white shadow-lg shadow-nexus-accent/20">
                                  {review.user.charAt(0)}
                               </div>
                               <div>
                                  <span className="font-bold text-white block text-base">{review.user}</span>
                                  <span className="text-xs text-slate-500">Verified Buyer • {review.date}</span>
                                </div>
                            </div>
                            <div className="flex text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded-lg border border-yellow-400/10">
                               {[...Array(5)].map((_, r) => (
                                  <StarIcon key={r} size={12} fill={r < review.rating ? "currentColor" : "none"} className={r >= review.rating ? "text-slate-700" : ""} />
                               ))}
                            </div>
                         </div>
                         <p className="text-slate-300 leading-relaxed pl-14 relative">
                            <span className="absolute left-4 top-0 text-4xl text-slate-700 font-serif opacity-50">"</span>
                            {review.text}
                         </p>
                      </div>
                   ))}
                </div>
            )}
         </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
         <div className="mt-32 border-t border-white/5 pt-16">
            <div className="flex items-center justify-between mb-12 px-2">
               <h3 className="text-3xl font-display font-bold text-white">You Might Also Like</h3>
               <button onClick={onBack} className="flex items-center gap-2 text-sm text-nexus-accent hover:text-white transition-colors font-bold uppercase tracking-widest group">
                 View Collection <ArrowRightIcon size={16} className="group-hover:translate-x-1 transition-transform" />
               </button>
            </div>
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-8">
               {relatedProducts.map(related => (
                  <ProductCard 
                     key={related.id} 
                     product={related}
                     onAddToCart={onAddToCart}
                     onQuickView={onQuickView}
                     onNavigateToProduct={onNavigateToProduct}
                     isWishlisted={wishlistItems.some(i => i.id === related.id)}
                     onToggleWishlist={onToggleWishlist}
                  />
               ))}
            </div>
         </div>
      )}

      {/* Sticky Mobile Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-nexus-950/80 backdrop-blur-2xl border-t border-white/10 sm:hidden z-50 pb-[calc(1rem+env(safe-area-inset-bottom))] animate-in slide-in-from-bottom-full duration-500">
         <div className="flex gap-3">
            <div className="flex items-center bg-white/5 rounded-xl border border-white/10 h-12 w-24">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex-1 h-full text-slate-400 hover:text-white transition-colors flex items-center justify-center"
                  aria-label="Decrease quantity"
                >
                   <MinusIcon size={16} />
                </button>
                <span className="text-center font-bold text-white text-sm">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="flex-1 h-full text-slate-400 hover:text-white transition-colors flex items-center justify-center"
                  aria-label="Increase quantity"
                >
                   <PlusIcon size={16} />
                </button>
            </div>
            <button 
               onClick={() => {
                 for(let i=0; i<quantity; i++) onAddToCart(product);
               }}
               className="flex-1 h-12 bg-nexus-accent text-white font-bold text-sm rounded-xl shadow-lg shadow-nexus-accent/20 flex items-center justify-center gap-2 active:scale-95 transition-transform"
             >
               <ShoppingCartIcon size={18} />
               Add - ${(product.price * quantity).toFixed(2)}
             </button>
         </div>
      </div>

    </div>
  );
};

export default ProductDetails;
