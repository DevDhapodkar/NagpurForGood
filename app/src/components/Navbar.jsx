import React, { useState, useEffect } from 'react';
import { Menu, X, Share2, Moon, Sun, Search, ShieldCheck, HeartPulse, ExternalLink, LogIn, LogOut, LayoutDashboard } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ theme, toggleTheme }) => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { pathname } = useLocation();
    const { user, logout } = useAuth();

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Scroll to top on route change
    useEffect(() => {
        window.scrollTo(0, 0);
        setMobileMenuOpen(false);
    }, [pathname]);

    const handleShare = async () => {
        try {
            if (navigator.share) {
                await navigator.share({
                title: 'NagpurGoodOrg',
                    text: 'Discover and support verified NGOs in Nagpur.',
                    url: window.location.href,
                });
            } else {
                await navigator.clipboard.writeText(window.location.href);
                // Could add a toast notification here
                alert('Link copied to clipboard!');
            }
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out sm:p-6 pb-0 ${scrolled || mobileMenuOpen ? 'sm:py-4 py-0' : 'sm:py-8 py-0'}`}>
            <div className={`mx-auto max-w-7xl transition-all duration-500 ${scrolled || mobileMenuOpen ? 'sm:rounded-[2rem] rounded-none sm:shadow-2xl shadow-xl' : 'sm:rounded-[2.5rem] rounded-none'} glass-panel border-b sm:border-b-0 border-[var(--border-color)] ${mobileMenuOpen ? 'bg-[var(--bg-primary)]/95 backdrop-blur-2xl' : ''}`}>
                <div className="px-4 sm:px-8 py-4 sm:py-5 flex items-center justify-between">
                    
                    {/* Brand */}
                    <Link to="/" className="flex items-center gap-3 sm:gap-4 group relative z-50">
                        <div className="relative">
                            <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-xl group-hover:bg-orange-500/30 transition-colors duration-500"></div>
                            <img src="/logo.png" alt="NGO Logo" className="w-10 h-10 sm:w-12 sm:h-12 object-contain relative z-10 drop-shadow-lg group-hover:scale-110 transition-transform duration-500 origin-center" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-black text-lg sm:text-xl tracking-tight text-[var(--text-primary)] font-serif leading-none group-hover:text-orange-500 transition-colors">Nagpur<span className="text-[var(--text-secondary)] font-sans font-bold">GoodOrg</span></span>
                            <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.2em] font-black text-orange-500/80 mt-1">Verified Organizations</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex flex-1 items-center justify-end gap-6 pr-4 border-r border-[var(--border-color)] mr-6">
                        <Link to="/mission" className={`text-[11px] font-black uppercase tracking-widest transition-colors ${pathname === '/mission' ? 'text-orange-500' : 'text-[var(--text-secondary)] hover:text-orange-400'}`}>Mission</Link>
                        <Link to="/directory" className={`text-[11px] font-black uppercase tracking-widest transition-colors ${pathname === '/directory' ? 'text-amber-500' : 'text-[var(--text-secondary)] hover:text-amber-500'}`}>Directory</Link>
                        <Link to="/impact" className={`text-[11px] font-black uppercase tracking-widest transition-colors ${pathname === '/impact' ? 'text-red-500' : 'text-[var(--text-secondary)] hover:text-red-500'}`}>Impact</Link>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 sm:gap-3 relative z-50">
                        {/* Desktop-only Actions */}
                        <div className="hidden md:flex items-center gap-3">
                            <button onClick={toggleTheme} className="p-3 rounded-2xl glass-btn text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all group" aria-label="Toggle theme">
                                {theme === 'dark' ? <Sun className="w-4 h-4 group-hover:rotate-90 transition-transform duration-500" /> : <Moon className="w-4 h-4 group-hover:-rotate-12 transition-transform duration-500" />}
                            </button>
                            <button onClick={handleShare} className="p-3 rounded-2xl glass-btn text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all group" aria-label="Share page">
                                <Share2 className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                            </button>
                        </div>
                        
                        {/* Authentication / Dashboard */}
                        <div className="hidden sm:block">
                            {user ? (
                                <div className="flex items-center gap-3">
                                    {user.isAdmin ? (
                                        <Link to="/admin" className="py-3 px-6 rounded-2xl font-black text-white text-[11px] uppercase tracking-widest bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] hover:border-orange-500/30 hover:text-orange-400 transition-all flex items-center gap-2 group shadow-lg">
                                            <LayoutDashboard className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                            Dashboard
                                        </Link>
                                    ) : (
                                        <div className="px-4 py-2.5 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-500 text-[10px] uppercase font-black tracking-widest flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></div>
                                            Hi, {user.displayName?.split(' ')[0] || 'Partner'}
                                        </div>
                                    )}
                                    <button 
                                        onClick={logout} 
                                        className="p-3 rounded-2xl glass-btn text-[var(--text-secondary)] hover:text-red-400 hover:bg-red-500/5 transition-all group" 
                                        aria-label="Logout"
                                    >
                                        <LogOut className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                    </button>
                                </div>
                            ) : (
                                <Link to="/login" className="py-3 px-6 rounded-2xl font-black text-white text-[11px] uppercase tracking-widest bg-gradient-to-r from-orange-600 to-red-600 hover:shadow-[0_10px_30px_rgba(239,68,68,0.3)] transform hover:-translate-y-0.5 transition-all flex items-center gap-2 group shadow-lg">
                                    <LogIn className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                    Login
                                </Link>
                            )}
                        </div>

                        {/* Mobile Menu Toggle */}
                        <button 
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-3 rounded-2xl glass-btn text-[var(--text-secondary)] hover:text-orange-500 transition-all"
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Overlay */}
                <div className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${mobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="px-6 py-8 flex flex-col gap-6 border-t border-[var(--border-color)] bg-[var(--bg-primary)]/40">
                        <div className="flex flex-col gap-4">
                            <Link to="/mission" className={`text-sm font-black uppercase tracking-[0.2em] transition-colors ${pathname === '/mission' ? 'text-orange-500' : 'text-[var(--text-secondary)] hover:text-orange-400'}`}>Mission</Link>
                            <Link to="/directory" className={`text-sm font-black uppercase tracking-[0.2em] transition-colors ${pathname === '/directory' ? 'text-amber-500' : 'text-[var(--text-secondary)] hover:text-amber-500'}`}>Directory</Link>
                            <Link to="/impact" className={`text-sm font-black uppercase tracking-[0.2em] transition-colors ${pathname === '/impact' ? 'text-red-400' : 'text-[var(--text-secondary)] hover:text-red-400'}`}>Impact</Link>
                        </div>
                        
                        <div className="flex items-center gap-4 pt-4 border-t border-[var(--border-color)]">
                            <button onClick={toggleTheme} className="flex-1 p-4 rounded-2xl glass-btn flex items-center justify-center gap-3 text-sm font-bold text-[var(--text-secondary)]">
                                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                            </button>
                            <button onClick={handleShare} className="p-4 rounded-2xl glass-btn text-[var(--text-secondary)]">
                                <Share2 className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="pt-2">
                            {user ? (
                                <div className="flex flex-col gap-4">
                                    <div className="px-6 py-4 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-500 text-xs font-black uppercase tracking-widest text-center">
                                        Hi, {user.displayName || 'Partner'}
                                    </div>
                                    <div className="flex gap-3">
                                        {user.isAdmin && (
                                            <Link to="/admin" className="flex-1 py-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] font-black text-xs uppercase tracking-widest text-center">
                                                Dashboard
                                            </Link>
                                        )}
                                        <button onClick={logout} className="flex-1 py-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2">
                                            <LogOut className="w-4 h-4" /> Sign Out
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <Link to="/login" className="w-full py-5 rounded-2xl bg-gradient-to-r from-orange-600 to-red-600 text-white font-black text-xs uppercase tracking-widest text-center block shadow-xl">
                                    Member Login
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
