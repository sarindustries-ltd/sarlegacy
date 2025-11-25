
import React, { useState } from 'react';
import { MailIcon, LockIcon, UserIcon, ArrowRightIcon, KeyRoundIcon, UserCircleIcon, AlertTriangleIcon } from 'lucide-react';

interface AuthPageProps {
    onLogin: (email: string, password: string) => void;
    onRegister: (name: string, email: string) => void;
    error: string | null;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin, onRegister, error }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isLogin) {
            onLogin(email, password);
        } else {
            // Simple password for mock registration
            onRegister(name, email);
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        // Clear fields on mode switch if desired, and also the error
    };

    return (
        <div className="w-full min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
             {/* Dynamic Background Grid & Ambience */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_200px,#3b82f633,transparent)]"></div>
            </div>
            <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-nexus-accent/10 rounded-full blur-[120px] animate-pulse-slow"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-900/20 rounded-full blur-[100px] animate-pulse-slow animation-delay-4000"></div>

            <div className="relative z-10 w-full max-w-md animate-in fade-in zoom-in-95 duration-500">
                <div className="bg-nexus-900/50 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
                    <div className="p-8 sm:p-12">
                        <div className="text-center mb-8">
                            <h1 className="font-display font-black text-4xl text-white tracking-[0.1em] uppercase italic">
                                SAR<span className="text-nexus-accent">LEGACY</span>
                            </h1>
                            <p className="text-slate-400 mt-2 text-sm">Access the Future of Commerce</p>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                             {!isLogin && (
                                <div className="relative group animate-in fade-in duration-300">
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-nexus-accent to-purple-600 rounded-xl blur opacity-0 group-hover:opacity-50 transition duration-1000"></div>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <UserIcon className="h-4 w-4 text-slate-500 group-focus-within:text-nexus-accent transition-colors" />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Full Name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                            className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-10 py-3.5 text-white placeholder-slate-500 focus:border-nexus-accent/50 focus:ring-1 focus:ring-nexus-accent/50 outline-none transition-all duration-300"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="relative group">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-nexus-accent to-purple-600 rounded-xl blur opacity-0 group-hover:opacity-50 transition duration-1000"></div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <MailIcon className="h-4 w-4 text-slate-500 group-focus-within:text-nexus-accent transition-colors" />
                                    </div>
                                    <input
                                        type="email"
                                        placeholder="Email Address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-10 py-3.5 text-white placeholder-slate-500 focus:border-nexus-accent/50 focus:ring-1 focus:ring-nexus-accent/50 outline-none transition-all duration-300"
                                    />
                                </div>
                            </div>
                           
                            <div className="relative group">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-nexus-accent to-purple-600 rounded-xl blur opacity-0 group-hover:opacity-50 transition duration-1000"></div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <LockIcon className="h-4 w-4 text-slate-500 group-focus-within:text-nexus-accent transition-colors" />
                                    </div>
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-10 py-3.5 text-white placeholder-slate-500 focus:border-nexus-accent/50 focus:ring-1 focus:ring-nexus-accent/50 outline-none transition-all duration-300"
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="flex items-center gap-2 text-red-400 text-xs p-3 bg-red-500/10 border border-red-500/20 rounded-lg animate-in fade-in duration-300">
                                    <AlertTriangleIcon size={14} />
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="w-full group relative inline-flex items-center justify-center px-8 py-3.5 text-md font-bold text-white transition-all duration-200 bg-nexus-accent rounded-xl hover:bg-nexus-accentHover hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] active:scale-95 overflow-hidden"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    {isLogin ? 'Sign In' : 'Create Account'}
                                    <ArrowRightIcon size={18} />
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                            </button>
                        </form>
                        
                        <div className="text-center mt-6">
                            <button onClick={toggleMode} className="text-sm text-slate-400 hover:text-white hover:underline decoration-nexus-accent underline-offset-4 transition-all">
                                {isLogin ? "Don't have an account? Create one" : "Already have an account? Sign In"}
                            </button>
                        </div>

                        <div className="relative flex py-5 items-center">
                            <div className="flex-grow border-t border-white/10"></div>
                            <span className="flex-shrink mx-4 text-slate-500 text-xs uppercase">Dev Shortcuts</span>
                            <div className="flex-grow border-t border-white/10"></div>
                        </div>

                        <div className="flex gap-4">
                            <button onClick={() => onLogin('admin@sar-legacy.net', 'superadmin')} className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                                <KeyRoundIcon size={16} /> Admin
                            </button>
                             <button onClick={() => onLogin('alex.c@sar-legacy.net', 'password')} className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                                <UserCircleIcon size={16} /> User
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;