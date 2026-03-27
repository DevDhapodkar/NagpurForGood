import React from 'react';
import { Link } from 'react-router-dom';
import { useNGOs } from '../context/NGOContext';

const Hero = () => {
    const { ngoList } = useNGOs();
    const verifiedCount = ngoList.filter(ngo => ngo.verified).length;

    return (
        <div className="relative pt-32 md:pt-44 pb-20 px-6 md:px-12 flex flex-col items-center justify-center text-center max-w-5xl mx-auto z-10">
            <div className="inline-flex m-auto items-center gap-2 px-3 py-1 rounded-full glass-panel border border-[var(--border-color)] mb-6">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                <span className="text-xs font-medium text-[var(--text-secondary)] tracking-wide uppercase">{verifiedCount} Verified NGOs</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-[var(--text-primary)] mb-6">
                Connect. Support. <br className="hidden md:block" />
                <span className="text-gradient">Transform Nagpur.</span>
            </h1>

            <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-10 leading-relaxed">
                Bridge the gap between your intent and authentic local impact. Discover verified NGOs in Nagpur needing your dynamic support right now.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Link to="/directory" className="px-8 py-4 rounded-xl font-bold glass-btn transition-all sm:w-auto w-full shadow-lg hover:-translate-y-1 flex items-center justify-center">
                    Explore Organizations
                </Link>
            </div>
        </div>
    );
};

export default Hero;
