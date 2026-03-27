import React from 'react';
import Hero from '../components/Hero';
import { ArrowRight, ShieldCheck, Heart, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <main className="animate-in fade-in duration-1000">
            <Hero />
            
            {/* Quick Impact Section */}
            <section className="max-w-7xl mx-auto px-6 py-24">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <Link to="/mission" className="glass-panel p-10 rounded-[2.5rem] border-orange-500/10 hover:border-orange-500/30 transition-all hover:-translate-y-2 group">
                        <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <ShieldCheck className="w-6 h-6 text-orange-500" />
                        </div>
                        <h3 className="text-xl font-black text-theme-primary mb-3 uppercase tracking-tight">Our Mission</h3>
                        <p className="text-sm text-theme-primary/50 leading-relaxed mb-6">Discover why we enforce a strict multi-layer verification standard for all Nagpur NGOs.</p>
                        <div className="text-orange-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                            Learn More <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </Link>

                    <Link to="/directory" className="glass-panel p-10 rounded-[2.5rem] border-amber-500/10 hover:border-amber-500/30 transition-all hover:-translate-y-2 group">
                        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Heart className="w-6 h-6 text-amber-500" />
                        </div>
                        <h3 className="text-xl font-black text-theme-primary mb-3 uppercase tracking-tight">The Directory</h3>
                        <p className="text-sm text-theme-primary/50 leading-relaxed mb-6">Browse and support a curated list of verified organizations working on the ground in Nagpur.</p>
                        <div className="text-amber-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                            Explore Now <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </Link>

                    <Link to="/impact" className="glass-panel p-10 rounded-[2.5rem] border-red-500/10 hover:border-red-500/30 transition-all hover:-translate-y-2 group">
                        <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <TrendingUp className="w-6 h-6 text-red-500" />
                        </div>
                        <h3 className="text-xl font-black text-theme-primary mb-3 uppercase tracking-tight">Nagpur Impact</h3>
                        <p className="text-sm text-theme-primary/50 leading-relaxed mb-6">See the collective data of transformation across all our verified partner organizations.</p>
                        <div className="text-red-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                            View Stats <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </Link>
                </div>
            </section>

            {/* Trust Score Hook */}
            <section className="max-w-7xl mx-auto px-6 pb-32">
                <div className="relative overflow-hidden rounded-[3rem] bg-zinc-900 border border-zinc-800 p-8 lg:p-16 flex flex-col lg:flex-row items-center gap-12 group">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full -mr-20 -mt-20 blur-3xl animate-pulse"></div>
                    <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-[2.5rem] bg-amber-500 flex items-center justify-center shadow-2xl shadow-amber-900/40 relative z-10 group-hover:scale-110 transition-transform duration-700">
                        <ShieldCheck className="w-12 h-12 lg:w-16 lg:h-16 text-white" />
                    </div>
                    <div className="flex-1 space-y-6 relative z-10 text-center lg:text-left">
                        <div className="inline-flex py-1 px-3 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-widest">
                            Built on Transparency
                        </div>
                        <h2 className="text-3xl lg:text-5xl font-black font-serif text-white tracking-tight leading-tight">
                            The Nagpur <br className="hidden lg:block"/> Confidence Meter
                        </h2>
                        <p className="text-zinc-400 text-sm lg:text-base max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                            Every NGO on our platform undergoes a rigorous 12+ layer verification process. From physical field visits to tax compliance audits—we ensure your support reaches the right hands.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 justify-center lg:justify-start">
                            <Link to="/trust-score" className="px-8 py-4 rounded-2xl bg-white text-black text-xs font-black uppercase tracking-widest hover:bg-amber-500 hover:text-white transition-all transform active:scale-95 shadow-xl">
                                How it Works
                            </Link>
                            <Link to="/apply" className="px-8 py-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-black uppercase tracking-widest hover:bg-amber-500/20 transition-all">
                                Register Your NGO
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Home;
