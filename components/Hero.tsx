
import React, { useEffect, useState } from 'react';
import { ArrowRightIcon, SparklesIcon, ChevronDownIcon } from 'lucide-react';

const Hero: React.FC = () => {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [displayText, setDisplayText] = useState({ line1: '', line2: '' });
  const [showCursor1, setShowCursor1] = useState(true);
  const [showCursor2, setShowCursor2] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate mouse position relative to center of screen
      // Multiplier determines the intensity of the parallax
      setOffset({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    
    // Only add listener on larger screens to save performance on mobile
    if (window.matchMedia("(min-width: 768px)").matches) {
        window.addEventListener('mousemove', handleMouseMove);
    }
    
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Dynamic Typing Animation
  useEffect(() => {
    const line1Text = "SAR";
    const line2Text = "LEGACY";
    let cancelled = false;

    const runTyping = async () => {
        // Initial delay before typing starts
        await new Promise(resolve => setTimeout(resolve, 800));

        // Type Line 1 (SAR)
        for (let i = 0; i <= line1Text.length; i++) {
            if (cancelled) return;
            setDisplayText(prev => ({ ...prev, line1: line1Text.slice(0, i) }));
            const delay = 150 + Math.random() * 100; // Randomize typing speed slightly
            await new Promise(resolve => setTimeout(resolve, delay));
        }
        
        // Switch Cursor
        setShowCursor1(false);
        setShowCursor2(true);
        await new Promise(resolve => setTimeout(resolve, 300));

        // Type Line 2 (LEGACY)
        for (let i = 0; i <= line2Text.length; i++) {
            if (cancelled) return;
            setDisplayText(prev => ({ ...prev, line2: line2Text.slice(0, i) }));
            const delay = 100 + Math.random() * 50; // Faster typing for second line
            await new Promise(resolve => setTimeout(resolve, delay));
        }
        
        // Optional: Hide second cursor after a while, or keep it blinking
        // await new Promise(resolve => setTimeout(resolve, 2000));
        // if (!cancelled) setShowCursor2(false);
    };

    runTyping();

    return () => { cancelled = true; };
  }, []);

  return (
    <div className="relative h-[100dvh] w-full flex items-center justify-center overflow-hidden bg-slate-950 selection:bg-nexus-accent selection:text-white">
      
      {/* Dynamic Background Grid */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_200px,#3b82f633,transparent)]"></div>
      </div>

      {/* Animated Background Ambience with Parallax */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
         <div 
            className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-nexus-accent/10 rounded-full blur-[120px] animate-subtle-pulse transition-transform duration-100 ease-out"
            style={{ transform: `translate(${offset.x * -1.5}px, ${offset.y * -1.5}px)` }}
         ></div>
         <div 
            className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-900/20 rounded-full blur-[100px] animate-subtle-pulse delay-700 transition-transform duration-100 ease-out"
            style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
         ></div>
      </div>

      {/* Main Content */}
      <div className="relative w-full max-w-[2400px] mx-auto px-4 sm:px-8 lg:px-12 z-10 flex flex-col items-center justify-center h-full pt-16">
        
        {/* Floating Elements Container */}
        <div className="flex flex-col items-center justify-center transform transition-transform duration-100 ease-out w-full" style={{ transform: `translate(${offset.x * 0.5}px, ${offset.y * 0.5}px)` }}>
            
            {/* Badge */}
            <div className="inline-flex items-center justify-center px-5 py-2 mb-8 md:mb-12 border border-white/10 rounded-full bg-white/5 backdrop-blur-md hover:bg-white/10 transition-all cursor-default group animate-in fade-in slide-in-from-top-4 duration-700 shadow-lg">
            <span className="relative flex h-2 w-2 mr-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-nexus-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-nexus-accent"></span>
            </span>
            <span className="text-xs sm:text-sm font-bold text-slate-300 tracking-[0.15em] uppercase group-hover:text-white transition-colors">
                SAR DIGITAL MARKETPLACE
            </span>
            </div>
            
            {/* Headline with Typing Animation */}
            <h1 className="text-center text-7xl xs:text-8xl sm:text-9xl md:text-[10rem] lg:text-[12rem] xl:text-[14rem] 2xl:text-[16rem] tracking-tighter font-display font-black text-white mb-6 leading-[0.85] uppercase italic drop-shadow-2xl w-full select-none">
                <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 min-h-[0.85em]">
                    {displayText.line1}{showCursor1 && <span className="text-white animate-pulse ml-1 md:ml-4 font-light align-middle">|</span>}
                    {/* Using min-h prevents layout shift, but we can also render a zero-width space if empty */}
                    {!displayText.line1 && !showCursor1 && <span>&nbsp;</span>}
                </span>
                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-nexus-accent via-nexus-glow to-white animate-gradient-x min-h-[0.85em]">
                    {displayText.line2}{showCursor2 && <span className="text-white animate-pulse ml-1 md:ml-4 font-light align-middle">|</span>}
                </span>
            </h1>
            
            {/* Subtext */}
            <p className="text-center max-w-md sm:max-w-2xl md:max-w-4xl lg:max-w-5xl mx-auto text-lg sm:text-2xl md:text-3xl text-slate-400 font-light leading-relaxed mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300 px-6">
            Experience the intersection of precision engineering and digital aesthetics. 
            Gear designed for the architects of the future.
            </p>
            
            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 w-full animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
            <a 
                href="#products" 
                className="group relative w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-nexus-accent rounded-full hover:bg-nexus-accentHover hover:shadow-[0_0_60px_rgba(59,130,246,0.6)] hover:-translate-y-1 active:scale-95 overflow-hidden min-w-[200px]"
            >
                <span className="relative z-10 flex items-center gap-2">
                Shop Collection
                <ArrowRightIcon size={20} className="group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
            </a>
            
            <a 
                href="#ai-help" 
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-slate-300 transition-all duration-200 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:text-white hover:border-white/30 backdrop-blur-sm hover:-translate-y-1 active:scale-95 min-w-[200px]"
            >
                <SparklesIcon size={20} className="mr-2 text-nexus-glow" />
                Ask SAR AI
            </a>
            </div>
        </div>

        {/* Bottom Status Bar / Scroll Indicator */}
        <div className="absolute bottom-0 left-0 w-full border-t border-white/5 bg-nexus-950/30 backdrop-blur-md">
            <div className="max-w-[2400px] mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between text-[10px] sm:text-xs text-slate-500 uppercase tracking-widest font-bold">
                <div className="hidden sm:flex items-center gap-6">
                    <span>System: Online</span>
                    <span className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                        Secure Connection
                    </span>
                </div>

                <a href="#products" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 text-slate-400 hover:text-white transition-colors animate-bounce cursor-pointer group pt-2">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">Explore</span>
                    <ChevronDownIcon size={18} className="text-nexus-accent" />
                </a>

                <div className="hidden sm:flex items-center gap-6">
                    <span>Loc: Global</span>
                    <span>Ver: 2.5.0</span>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default Hero;