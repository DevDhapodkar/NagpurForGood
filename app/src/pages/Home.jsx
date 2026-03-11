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
        </main>
    );
};

export default Home;
