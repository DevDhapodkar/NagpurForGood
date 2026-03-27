import React, { useState, useEffect } from 'react';
import { Menu, X, Share2, Moon, Sun, ExternalLink, LogIn, LogOut, LayoutDashboard, ArrowRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ theme, toggleTheme }) => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { pathname } = useLocation();
    const { user, logout } = useAuth();

    const [visible, setVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    // Handle scroll effect & direction
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            
            // Show if scrolling up, hide if scrolling down and scrolled > 100px
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                if (!mobileMenuOpen) setVisible(false);
            } else {
                setVisible(true);
            }
            
            setScrolled(currentScrollY > 20);
            setLastScrollY(currentScrollY);
        };
        
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY, mobileMenuOpen]);

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
        <nav className={`fixed top-0 left-0 right-0 transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] sm:p-6 pb-0 
            ${mobileMenuOpen ? 'z-[100]' : 'z-50'}
            ${scrolled || mobileMenuOpen ? 'sm:py-4 py-0' : 'sm:py-8 py-0'} 
            ${visible || mobileMenuOpen ? 'translate-y-0 opacity-100 scale-100 blur-0 brightness-100 saturate-100' : '-translate-y-6 opacity-0 scale-90 blur-2xl brightness-125 saturate-150 pointer-events-none'}`}>
            <div className={`mx-auto max-w-7xl transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] 
                ${scrolled || mobileMenuOpen ? 'sm:rounded-[2rem] rounded-b-[2.5rem] sm:shadow-2xl shadow-[0_50px_100px_rgba(0,0,0,0.5)]' : 'sm:rounded-[2.5rem] rounded-none'} 
                glass-panel border-b sm:border-b-0 border-[var(--border-color)] 
                ${mobileMenuOpen ? 'bg-[var(--bg-primary)] backdrop-blur-[100px]' : ''}`}>
                <div className="px-4 sm:px-8 py-4 sm:py-5 flex items-center justify-between">
                    
                    {/* Brand */}
                    <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 sm:gap-4 group relative z-50">
                        <div className="relative">
                            <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-xl group-hover:bg-orange-500/30 transition-colors duration-500"></div>
                            <img src="/logo.png" alt="NGO Logo" className="w-10 h-10 sm:w-12 sm:h-12 object-contain relative z-10 drop-shadow-lg group-hover:scale-110 transition-transform duration-500 origin-center" />
                        </div>
                        <div className="flex flex-col text-left">
                            <span className="font-black text-lg sm:text-xl tracking-tight text-[var(--text-primary)] font-serif leading-none group-hover:text-orange-500 transition-colors">Nagpur<span className="text-[var(--text-secondary)] font-sans font-bold">GoodOrg</span></span>
                            <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.2em] font-black text-orange-500/80 mt-1">Verified Organizations</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex flex-1 items-center justify-end gap-6 pr-4 border-r border-[var(--border-color)] mr-6">
                        <Link to="/mission" className={`text-[11px] font-black uppercase tracking-widest transition-colors ${pathname === '/mission' ? 'text-orange-500' : 'text-[var(--text-secondary)] hover:text-orange-400'}`}>Mission</Link>
                        <Link to="/directory" className={`text-[11px] font-black uppercase tracking-widest transition-colors ${pathname === '/directory' ? 'text-amber-500' : 'text-[var(--text-secondary)] hover:text-amber-500'}`}>Directory</Link>
                        <Link to="/impact" className={`text-[11px] font-black uppercase tracking-widest transition-colors ${pathname === '/impact' ? 'text-red-400' : 'text-[var(--text-secondary)] hover:text-red-400'}`}>Impact</Link>
                        <Link to="/trust-score" className={`text-[11px] font-black uppercase tracking-widest transition-colors ${pathname === '/trust-score' ? 'text-amber-500' : 'text-[var(--text-secondary)] hover:text-amber-500'}`}>Verify Score</Link>
                        <Link to="/apply" className="py-2 px-4 rounded-xl border border-orange-500/20 text-orange-500 text-[10px] font-black uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all whitespace-nowrap">Join as NGO</Link>
                        
                        <div className="flex items-center gap-2 pl-2 border-l border-[var(--border-color)]">
                            <button onClick={toggleTheme} className="p-2.5 rounded-2xl glass-btn text-[var(--text-secondary)] hover:text-orange-500 transition-all group" aria-label="Toggle theme">
                                {theme === 'dark' ? <Sun className="w-4 h-4 group-hover:rotate-45 transition-transform" /> : <Moon className="w-4 h-4 group-hover:-rotate-12 transition-transform" />}
                            </button>
                            <button onClick={handleShare} className="p-2.5 rounded-2xl glass-btn text-[var(--text-secondary)] hover:text-orange-500 transition-all group" aria-label="Share">
                                <Share2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            </button>
                        </div>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-4">
                        <div className="hidden md:block">
                            {user ? (
                                <div className="flex items-center gap-3">
                                    {user.isAdmin ? (
                                        <Link to="/admin" className="py-3 px-6 rounded-2xl font-black text-white text-[11px] uppercase tracking-widest bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] hover:border-orange-500/30 hover:text-orange-400 transition-all flex items-center gap-2 group shadow-lg">
                                            <LayoutDashboard className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                            Dashboard
                                        </Link>
                                    ) : user.isNgo ? (
                                        <Link to="/ngo-dashboard" className="py-3 px-6 rounded-2xl font-black text-white text-[11px] uppercase tracking-widest bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] hover:border-orange-500/30 hover:text-orange-400 transition-all flex items-center gap-2 group shadow-lg">
                                            <LayoutDashboard className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                            NGO Dashboard
                                        </Link>
                                    ) : (
                                        <div className="px-4 py-2.5 rounded-2xl bg-orange-500/5 border border-orange-500/10 text-[var(--text-primary)] text-[10px] uppercase font-black tracking-widest flex items-center gap-2">
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
                            className={`md:hidden p-3 rounded-2xl transition-all ${mobileMenuOpen ? 'bg-orange-500 text-white shadow-xl rotate-90' : 'glass-btn text-[var(--text-secondary)]'}`}
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Overlay */}
                <div className={`md:hidden overflow-y-auto transition-all duration-500 ease-in-out scrollbar-hide relative ${mobileMenuOpen ? 'max-h-[85vh] opacity-100 pointer-events-auto' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                    <div className="px-6 pt-8 pb-16 flex flex-col gap-6 border-t border-[var(--border-color)] bg-[var(--bg-primary)]">
                        <div className="flex flex-col gap-5">
                            <Link to="/mission" onClick={() => setMobileMenuOpen(false)} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${pathname === '/mission' ? 'bg-orange-500/10 border-orange-500/20 text-orange-500' : 'bg-[var(--bg-secondary)]/50 border-[var(--border-color)] text-[var(--text-secondary)]'}`}>
                                <span className="text-sm font-black uppercase tracking-[0.2em]">Mission</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link to="/directory" onClick={() => setMobileMenuOpen(false)} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${pathname === '/directory' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' : 'bg-[var(--bg-secondary)]/50 border-[var(--border-color)] text-[var(--text-secondary)]'}`}>
                                <span className="text-sm font-black uppercase tracking-[0.2em]">Directory</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link to="/impact" onClick={() => setMobileMenuOpen(false)} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${pathname === '/impact' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-[var(--bg-secondary)]/50 border-[var(--border-color)] text-[var(--text-secondary)]'}`}>
                                <span className="text-sm font-black uppercase tracking-[0.2em]">Impact</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link to="/trust-score" onClick={() => setMobileMenuOpen(false)} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${pathname === '/trust-score' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' : 'bg-[var(--bg-secondary)]/50 border-[var(--border-color)] text-[var(--text-secondary)]'}`}>
                                <span className="text-sm font-black uppercase tracking-[0.2em]">Trust Score</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link to="/apply" onClick={() => setMobileMenuOpen(false)} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${pathname === '/apply' ? 'bg-orange-500/10 border-orange-500/20 text-orange-500' : 'bg-[var(--bg-secondary)]/50 border-[var(--border-color)] text-[var(--text-secondary)]'}`}>
                                <span className="text-sm font-black uppercase tracking-[0.2em]">Register NGO</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                        
                        <div className="flex items-center gap-4 pt-6 border-t border-[var(--border-color)]">
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
                                    <div className="px-6 py-4 rounded-2xl bg-orange-500/5 border border-orange-500/10 text-[var(--text-primary)] text-xs font-black uppercase tracking-widest text-center">
                                        Hi, {user.displayName || 'Partner'}
                                    </div>
                                    <div className="flex gap-3">
                                        {user.isAdmin && (
                                            <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="flex-1 py-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] font-black text-xs uppercase tracking-widest text-center shadow-md">
                                                Dashboard
                                            </Link>
                                        )}
                                        {user.isNgo && (
                                            <Link to="/ngo-dashboard" onClick={() => setMobileMenuOpen(false)} className="flex-1 py-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] font-black text-xs uppercase tracking-widest text-center shadow-md">
                                                NGO Dashboard
                                            </Link>
                                        )}
                                        <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="flex-1 py-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2">
                                            <LogOut className="w-4 h-4" /> Sign Out
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-full py-5 rounded-2xl bg-gradient-to-r from-orange-600 to-red-600 text-white font-black text-xs uppercase tracking-widest text-center block shadow-2xl">
                                    Member Login
                                </Link>
                            )}
                        </div>
                    </div>
                    {/* Glass Fader at bottom */}
                    <div className="sticky bottom-0 h-16 w-full bg-gradient-to-t from-[var(--bg-primary)] to-transparent pointer-events-none backdrop-blur-sm z-50"></div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
