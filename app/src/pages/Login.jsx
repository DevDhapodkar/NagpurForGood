import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    
    // Check if we were redirected from a protected route
    const from = location.state?.from?.pathname || '/admin';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!email || !password) {
            setError('Please enter both email and password.');
            return;
        }

        setIsSubmitting(true);

        try {
            await login(email, password);
            navigate(from, { replace: true });
        } catch (err) {
            setError(err.message || 'Failed to login. Please check your credentials.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-20 flex items-center justify-center animate-in fade-in duration-700 px-6">
            <div className="w-full max-w-md">
                
                {/* Header */}
                <div className="text-center mb-10 text-theme-primary h-[8rem] flex flex-col items-center">
                    <img src="/logo.png" alt="Logo" className="h-20 w-auto object-contain drop-shadow-md mb-4"/>
                    <h1 className="text-3xl font-black font-serif tracking-tight">Admin Portal</h1>
                    <p className="text-xs uppercase tracking-[0.2em] font-black text-theme-primary/40 mt-1">Authentic Impact Hub</p>
                </div>

                {/* Glassmorphism Card */}
                <div className="glass-panel p-8 sm:p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden backdrop-blur-xl">
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-40 h-40 bg-orange-500/20 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>

                    <h2 className="text-xl font-black text-[var(--text-primary)] mb-6 text-center">Sign in to Continue</h2>

                    {error && (
                        <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-start gap-3 text-red-400 animate-in slide-in-from-top-2">
                            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                            <p className="text-sm font-medium leading-tight">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                        <div className="space-y-4">
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--text-muted)] group-focus-within:text-orange-400 transition-colors">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Admin Email"
                                    className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] rounded-2xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all placeholder:text-[var(--text-muted)]"
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--text-muted)] group-focus-within:text-orange-400 transition-colors">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Secure Password"
                                    className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] rounded-2xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all placeholder:text-[var(--text-muted)]"
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full py-4 rounded-2xl font-black text-white text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                                isSubmitting 
                                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                                : 'bg-gradient-to-r from-orange-600 to-red-600 shadow-[0_10px_30px_rgba(239,68,68,0.3)] hover:shadow-[0_15px_40px_rgba(239,68,68,0.5)] transform hover:-translate-y-1 active:scale-95'
                            }`}
                        >
                            {isSubmitting ? (
                                <div className="w-5 h-5 rounded-full border-2 border-zinc-500 border-t-transparent animate-spin"></div>
                            ) : (
                                <>
                                    Authenticate <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-[var(--border-color)] text-center relative z-10">
                        <p className="text-[var(--text-secondary)] text-sm">
                            Need admin access?{' '}
                            <Link to="/signup" className="text-orange-400 font-bold hover:text-orange-300 transition-colors">
                                Apply for Account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
