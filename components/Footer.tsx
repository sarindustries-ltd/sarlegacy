
import React from 'react';
import { ArrowRightIcon, TwitterIcon, InstagramIcon, GithubIcon, MailIcon, ZapIcon } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-nexus-950/80 border-t border-white/5 backdrop-blur-xl relative overflow-hidden mt-auto">
      {/* Subtle Decorative Line */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-nexus-accent/50 to-transparent opacity-50"></div>

      <div className="w-full max-w-[2400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 items-center justify-between gap-8 lg:gap-12">
          
          {/* Left: Brand & Copyright */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-3">
             <div className="flex items-center gap-2 group cursor-default">
                <span className="w-2 h-2 bg-nexus-accent rounded-full animate-pulse"></span>
                <span className="font-display font-black text-2xl text-white tracking-[0.15em] uppercase italic group-hover:text-nexus-glow transition-colors">
                    SAR<span className="text-nexus-accent">LEGACY</span>
                </span>
             </div>
             <div className="text-slate-500 text-xs font-mono flex flex-col sm:flex-row gap-1 sm:gap-4 items-center sm:items-start">
               <span>&copy; 2025 SAR LEGACY. All rights Reserved.</span>
               <span className="hidden sm:inline text-slate-700">|</span>
               <span>Built & Developed By <span className="text-nexus-accent font-bold">SAIFUL ALAM RAFI</span></span>
             </div>
          </div>

          {/* Center: Minimalist Navigation */}
          <div className="flex flex-wrap justify-center gap-6 text-xs font-bold uppercase tracking-widest text-slate-400">
            <a href="#" className="hover:text-white hover:underline decoration-nexus-accent decoration-2 underline-offset-4 transition-all">Shop</a>
            <a href="#" className="hover:text-white hover:underline decoration-nexus-accent decoration-2 underline-offset-4 transition-all">About</a>
            <a href="#" className="hover:text-white hover:underline decoration-nexus-accent decoration-2 underline-offset-4 transition-all">Support</a>
            <a href="#" className="hover:text-white hover:underline decoration-nexus-accent decoration-2 underline-offset-4 transition-all">Terms</a>
            <a href="#" className="hover:text-white hover:underline decoration-nexus-accent decoration-2 underline-offset-4 transition-all">Privacy</a>
          </div>

          {/* Right: Compact Newsletter & Socials */}
          <div className="flex flex-col items-center lg:items-end gap-5 w-full lg:w-auto">
            
            {/* Micro Newsletter */}
            <form className="relative group w-full max-w-xs">
                <input 
                    type="email" 
                    placeholder="Join the legacy..." 
                    className="w-full bg-white/5 border border-white/10 rounded-full pl-4 pr-10 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-nexus-accent/50 focus:bg-black/40 transition-all font-mono"
                />
                <button 
                    type="button"
                    className="absolute right-1 top-1 bottom-1 w-8 flex items-center justify-center bg-white/5 text-nexus-accent rounded-full hover:bg-nexus-accent hover:text-white transition-all"
                >
                    <ArrowRightIcon size={14} />
                </button>
            </form>

            <div className="flex items-center gap-6">
                {/* Social Icons */}
                <div className="flex gap-4">
                    <a href="#" className="text-slate-500 hover:text-white transition-colors hover:scale-110 transform"><TwitterIcon size={16} /></a>
                    <a href="#" className="text-slate-500 hover:text-white transition-colors hover:scale-110 transform"><InstagramIcon size={16} /></a>
                    <a href="#" className="text-slate-500 hover:text-white transition-colors hover:scale-110 transform"><GithubIcon size={16} /></a>
                    <a href="#" className="text-slate-500 hover:text-white transition-colors hover:scale-110 transform"><MailIcon size={16} /></a>
                </div>

                {/* Status Pill */}
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full border border-green-500/20 bg-green-500/5 text-[9px] font-bold text-green-400 uppercase tracking-wider cursor-help shadow-[0_0_10px_rgba(34,197,94,0.1)]" title="All Systems Operational">
                    <ZapIcon size={10} className="fill-current" />
                    <span>Systems Online</span>
                </div>
            </div>

          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;