import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
    return (
        <div className="relative pt-32 pb-20 px-6 md:px-12 flex flex-col items-center justify-center text-center max-w-5xl mx-auto z-10">
            <div className="inline-flex m-auto items-center gap-2 px-3 py-1 rounded-full glass-panel border border-[var(--border-color)] mb-6">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-xs font-medium text-[var(--text-secondary)] tracking-wide uppercase">15 Verified NGOs</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-[var(--text-primary)] mb-6">
                Connect. Support. <br className="hidden md:block" />
                <span className="text-gradient">Transform Nagpur.</span>
            </h1>

            <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-10 leading-relaxed">
                Bridge the gap between your intent and authentic local impact. Discover verified NGOs in Nagpur needing your dynamic support right now.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <button onClick={() => window.scrollTo({ top: document.getElementById('discover').offsetTop - 100, behavior: 'smooth' })} className="px-8 py-4 rounded-xl font-bold glass-btn transition-all sm:w-auto w-full shadow-lg hover:-translate-y-1">
                    Explore Organizations
                </button>
                <Link to="/ngo/template-ngo" className="px-8 py-4 rounded-xl font-bold border border-white/10 hover:bg-white/5 transition-all sm:w-auto w-full shadow-lg hover:-translate-y-1 flex items-center justify-center">
                    See Example Profile
                </Link>
            </div>
        </div>
    );
};

export default Hero;
