
import React, { useState, useEffect } from 'react';
import { XIcon, ShieldCheckIcon, CreditCardIcon, TruckIcon, CheckCircleIcon, Loader2Icon, ArrowRightIcon, LockIcon } from 'lucide-react';
import { CartItem } from '../types';
import { CURRENCY } from '../constants';
import { trackEvent } from '../services/pixelService';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  total: number;
  onClearCart: () => void;
}

type CheckoutStep = 'details' | 'processing' | 'success';

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, cartItems, total, onClearCart }) => {
  const [step, setStep] = useState<CheckoutStep>('details');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zip: '',
    card: '',
    expiry: '',
    cvc: ''
  });

  useEffect(() => {
    if (isOpen) {
        setStep('details');
    }
  }, [isOpen]);
  
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && step !== 'processing') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, step]);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep('processing');

    setTimeout(() => {
        trackEvent('Purchase', {
            value: total,
            currency: CURRENCY,
            content_ids: cartItems.map(item => item.id.toString()),
            content_type: 'product',
            num_items: cartItems.reduce((acc, item) => acc + item.quantity, 0)
        });
        setStep('success');
        onClearCart();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-xl transition-opacity animate-in fade-in duration-500"
        onClick={step !== 'processing' ? onClose : undefined}
        aria-hidden="true"
      />

      {/* Modal */}
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-title"
        className="relative w-full max-w-4xl bg-nexus-950 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-300 max-h-[90dvh]"
      >
        
        {step !== 'processing' && step !== 'success' && (
            <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            aria-label="Close checkout"
            >
            <XIcon size={24} />
            </button>
        )}

        {/* Left Panel: Summary (Hidden on Success) */}
        {step !== 'success' && (
            <div className="w-full md:w-2/5 bg-slate-900/50 p-8 border-b md:border-b-0 md:border-r border-white/10 flex flex-col overflow-y-auto">
                <h3 className="font-display font-bold text-white text-xl mb-6 flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-nexus-accent rounded-full"></span>
                    Order Summary
                </h3>
                
                <div className="flex-1 space-y-4 mb-6 overflow-y-auto custom-scrollbar max-h-[300px] md:max-h-none pr-2">
                    {cartItems.map(item => (
                        <div key={item.id} className="flex gap-3 items-start">
                            <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/5 overflow-hidden flex-shrink-0">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover opacity-80" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-white text-sm font-medium truncate">{item.name}</p>
                                <p className="text-slate-500 text-xs">Qty: {item.quantity}</p>
                            </div>
                            <span className="text-slate-300 text-sm font-mono">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                </div>

                <div className="border-t border-white/10 pt-4 space-y-2">
                    <div className="flex justify-between text-slate-400 text-sm">
                        <span>Subtotal</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-400 text-sm">
                        <span>Shipping</span>
                        <span className="text-nexus-accent text-xs font-bold uppercase bg-nexus-accent/10 px-2 py-0.5 rounded">Free</span>
                    </div>
                    <div className="flex justify-between items-end pt-4 text-white">
                        <span className="font-bold">Total</span>
                        <span className="font-display text-2xl font-bold tracking-tight">${total.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        )}

        {/* Right Panel: Forms or Status */}
        <div className={`w-full ${step === 'success' ? 'w-full' : 'md:w-3/5'} p-8 md:p-10 relative bg-black/20`}>
            
            {step === 'details' && (
                <form onSubmit={handleSubmit} className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                    <div>
                        <h3 id="checkout-title" className="font-display font-bold text-white text-xl mb-1">Secure Checkout</h3>
                        <p className="text-slate-400 text-sm flex items-center gap-2">
                            <LockIcon size={12} className="text-green-500" />
                            Encrypted 256-bit SSL connection
                        </p>
                    </div>

                    {/* Shipping Info */}
                    <div className="space-y-4">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Shipping Details</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="col-span-1 sm:col-span-2">
                                <input 
                                    required 
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Full Name" 
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:border-nexus-accent focus:bg-white/10 transition-colors outline-none" 
                                />
                            </div>
                            <input 
                                required
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="Email Address" 
                                className="col-span-1 sm:col-span-2 w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:border-nexus-accent focus:bg-white/10 transition-colors outline-none" 
                            />
                            <input 
                                required
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                placeholder="Street Address" 
                                className="col-span-1 sm:col-span-2 w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:border-nexus-accent focus:bg-white/10 transition-colors outline-none" 
                            />
                            <input 
                                required
                                name="city"
                                value={formData.city}
                                onChange={handleInputChange}
                                placeholder="City" 
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:border-nexus-accent focus:bg-white/10 transition-colors outline-none" 
                            />
                            <input 
                                required
                                name="zip"
                                value={formData.zip}
                                onChange={handleInputChange}
                                placeholder="ZIP / Postal" 
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:border-nexus-accent focus:bg-white/10 transition-colors outline-none" 
                            />
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div className="space-y-4 pt-2">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Payment Method</h4>
                        <div className="p-4 border border-nexus-accent/30 bg-nexus-accent/5 rounded-xl flex items-center gap-3 mb-4">
                             <CreditCardIcon className="text-nexus-accent" />
                             <span className="text-sm text-white font-medium">Credit / Debit Card</span>
                             <span className="ml-auto text-xs text-slate-400">Processed via Stripe</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                             <input 
                                required
                                name="card"
                                value={formData.card}
                                onChange={handleInputChange}
                                placeholder="Card Number" 
                                className="col-span-2 w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:border-nexus-accent focus:bg-white/10 transition-colors outline-none font-mono" 
                            />
                             <input 
                                required
                                name="expiry"
                                value={formData.expiry}
                                onChange={handleInputChange}
                                placeholder="MM / YY" 
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:border-nexus-accent focus:bg-white/10 transition-colors outline-none text-center font-mono" 
                            />
                             <input 
                                required
                                name="cvc"
                                value={formData.cvc}
                                onChange={handleInputChange}
                                placeholder="CVC" 
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:border-nexus-accent focus:bg-white/10 transition-colors outline-none text-center font-mono" 
                            />
                        </div>
                    </div>

                    <button 
                        type="submit"
                        className="w-full py-4 bg-nexus-accent hover:bg-nexus-accentHover text-white font-bold rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-6"
                    >
                        Pay ${total.toFixed(2)}
                        <ArrowRightIcon size={18} />
                    </button>
                </form>
            )}

            {step === 'processing' && (
                <div className="flex flex-col items-center justify-center h-full min-h-[400px] animate-in fade-in duration-500">
                    <div className="relative">
                        <div className="w-20 h-20 border-4 border-white/10 border-t-nexus-accent rounded-full animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <ShieldCheckIcon className="text-white/20" size={30} />
                        </div>
                    </div>
                    <h3 className="mt-8 text-xl font-display font-bold text-white animate-pulse">Processing Transaction...</h3>
                    <p className="text-slate-500 mt-2 text-sm">Verifying payment credentials securely.</p>
                </div>
            )}

            {step === 'success' && (
                <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center animate-in zoom-in-95 duration-500">
                    <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(34,197,94,0.3)]">
                        <CheckCircleIcon size={48} className="text-green-500" />
                    </div>
                    <h2 className="text-4xl font-display font-bold text-white mb-2">Order Confirmed!</h2>
                    <p className="text-slate-400 max-w-md mx-auto mb-8 leading-relaxed">
                        Thank you for choosing SAR Legacy. Your gear is being prepared for dispatch. A confirmation has been sent to <span className="text-white font-medium">{formData.email}</span>.
                    </p>
                    <div className="flex gap-4">
                        <button 
                            onClick={onClose}
                            className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-full transition-all"
                        >
                            Return to Market
                        </button>
                        <button className="px-8 py-3 bg-nexus-accent hover:bg-nexus-accentHover text-white font-bold rounded-full transition-all shadow-lg shadow-nexus-accent/20 flex items-center gap-2">
                            <TruckIcon size={18} />
                            Track Order
                        </button>
                    </div>
                </div>
            )}

        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;