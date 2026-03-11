import React, { useState, useEffect } from 'react';
import { Menu, X, Share2, Moon, Sun, Search, ShieldCheck, HeartPulse, ExternalLink, LogIn, LayoutDashboard } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ theme, toggleTheme }) => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { pathname } = useLocation();
    const { user } = useAuth();

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
                    title: 'Nagpur Good Organisation',
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
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out sm:p-6 pb-0 ${scrolled ? 'sm:py-4 py-0' : 'sm:py-8 py-0'}`}>
            <div className={`mx-auto max-w-7xl transition-all duration-500 ${scrolled ? 'sm:rounded-[2rem] rounded-none sm:shadow-2xl shadow-xl' : 'sm:rounded-[2.5rem] rounded-none'} glass-panel border-b sm:border-b-0 border-[var(--border-color)]`}>
                <div className="px-4 sm:px-8 py-4 sm:py-5 flex items-center justify-between">
                    
                    {/* Brand */}
                    <Link to="/" className="flex items-center gap-3 sm:gap-4 group relative z-50">
                        <div className="relative">
                            <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-xl group-hover:bg-orange-500/30 transition-colors duration-500"></div>
                            <img src="/logo.png" alt="NGO Logo" className="w-10 h-10 sm:w-12 sm:h-12 object-contain relative z-10 drop-shadow-lg group-hover:scale-110 transition-transform duration-500 origin-center" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-black text-lg sm:text-xl tracking-tight text-[var(--text-primary)] font-serif leading-none group-hover:text-orange-500 transition-colors">Nagpur<span className="text-[var(--text-secondary)] font-sans font-bold">Good</span></span>
                            <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.2em] font-black text-orange-500/80 mt-1">Verified Organizations</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex flex-1 items-center justify-end gap-6 pr-4 border-r border-[var(--border-color)] mr-6">
                        <a href="#about" onClick={(e) => { e.preventDefault(); /* Smooth scroll to about if on home */ }} className="text-[11px] font-black uppercase tracking-widest text-[var(--text-secondary)] hover:text-orange-400 transition-colors">Mission</a>
                        <a href="#directory" onClick={(e) => { e.preventDefault(); }} className="text-[11px] font-black uppercase tracking-widest text-[var(--text-secondary)] hover:text-emerald-400 transition-colors">Directory</a>
                        <a href="#impact" onClick={(e) => { e.preventDefault(); }} className="text-[11px] font-black uppercase tracking-widest text-[var(--text-secondary)] hover:text-blue-400 transition-colors">Impact</a>
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center gap-3 relative z-50">
                        <button onClick={toggleTheme} className="p-3 rounded-2xl glass-btn text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all group" aria-label="Toggle theme">
                            {theme === 'dark' ? <Sun className="w-4 h-4 group-hover:rotate-90 transition-transform duration-500" /> : <Moon className="w-4 h-4 group-hover:-rotate-12 transition-transform duration-500" />}
                        </button>
                        <button onClick={handleShare} className="p-3 rounded-2xl glass-btn text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all group" aria-label="Share page">
                            <Share2 className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                        </button>
                        
                        {user && (
                            <Link to="/admin" className="ml-2 py-3 px-6 rounded-2xl font-black text-white text-[11px] uppercase tracking-widest bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] hover:border-blue-500/30 hover:text-blue-400 transition-all flex items-center gap-2 group shadow-lg">
                                <LayoutDashboard className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                Dashboard
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
