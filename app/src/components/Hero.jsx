import React from 'react';

const Hero = () => {
    return (
        <div className="relative pt-32 pb-20 px-6 md:px-12 flex flex-col items-center justify-center text-center max-w-5xl mx-auto z-10">
            <div className="inline-flex m-auto items-center gap-2 px-3 py-1 rounded-full glass-panel border border-white/10 mb-6">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-xs font-medium text-white/80 tracking-wide uppercase">15 Verified NGOs</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6">
                Connect. Support. <br className="hidden md:block" />
                <span className="text-gradient">Transform Nagpur.</span>
            </h1>

            <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed">
                Bridge the gap between your intent and authentic local impact. Discover verified NGOs in Nagpur needing your dynamic support right now.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <button onClick={() => window.scrollTo({ top: document.getElementById('discover').offsetTop - 100, behavior: 'smooth' })} className="px-8 py-4 rounded-xl font-bold text-white bg-white/10 hover:bg-white/20 border border-white/10 backdrop-blur-md transition-all sm:w-auto w-full shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:shadow-[0_0_25px_rgba(255,255,255,0.1)] hover:-translate-y-1">
                    Explore Organizations
                </button>
            </div>
        </div>
    );
};

export default Hero;
