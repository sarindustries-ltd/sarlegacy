
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black/40 border-t border-white/5 py-16 backdrop-blur-lg">
      <div className="w-full max-w-[2400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1 space-y-4">
             <span className="font-display font-black text-2xl text-white tracking-[0.2em] uppercase italic block">SAR<span className="text-nexus-accent">LEGACY</span></span>
             <p className="text-slate-500 text-sm leading-relaxed">
               The premier destination for futuristic lifestyle enhancements. We curate the best gear for the modern era.
             </p>
          </div>
          
          <div>
            <h3 className="text-xs font-bold text-white tracking-widest uppercase mb-6">Collection</h3>
            <ul className="space-y-3 text-slate-400 text-sm">
              <li><a href="#" className="hover:text-nexus-accent transition-colors">Electronics</a></li>
              <li><a href="#" className="hover:text-nexus-accent transition-colors">Fashion</a></li>
              <li><a href="#" className="hover:text-nexus-accent transition-colors">Home Automation</a></li>
              <li><a href="#" className="hover:text-nexus-accent transition-colors">Accessories</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold text-white tracking-widest uppercase mb-6">Support</h3>
            <ul className="space-y-3 text-slate-400 text-sm">
              <li><a href="#" className="hover:text-nexus-accent transition-colors">SAR Assistant</a></li>
              <li><a href="#" className="hover:text-nexus-accent transition-colors">Order Tracking</a></li>
              <li><a href="#" className="hover:text-nexus-accent transition-colors">Returns & Warranty</a></li>
              <li><a href="#" className="hover:text-nexus-accent transition-colors">Contact Us</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold text-white tracking-widest uppercase mb-6">Connect</h3>
            <ul className="space-y-3 text-slate-400 text-sm">
              <li><a href="#" className="hover:text-nexus-accent transition-colors">Twitter / X</a></li>
              <li><a href="#" className="hover:text-nexus-accent transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-nexus-accent transition-colors">Discord Community</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-16 border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-slate-600 text-xs">
          <p>&copy; {new Date().getFullYear()} SAR Legacy. All systems operational.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-slate-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
