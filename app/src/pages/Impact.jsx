import React, { useMemo } from 'react';
import { useNGOs } from '../context/NGOContext';
import { BarChart3, TrendingUp, Users, Heart, Globe, ExternalLink, ShieldCheck, Award } from 'lucide-react';

const Impact = () => {
    const { ngoList } = useNGOs();
    const verifiedNGOs = useMemo(() => ngoList.filter(ngo => ngo.verified), [ngoList]);

    // Aggregate stats (mock calculations based on raw data structure)
    const aggregateStats = useMemo(() => {
        let totalLives = 0;
        let mealsServed = 0;
        let treesPlanted = 0;
        let studentsHelped = 0;

        verifiedNGOs.forEach(ngo => {
            ngo.impactStats?.forEach(stat => {
                const val = parseInt(stat.value.replace(/,/g, '').replace(/\+/g, '')) || 0;
                if (stat.label.toLowerCase().includes('lives') || stat.label.toLowerCase().includes('impacted') || stat.label.toLowerCase().includes('people')) totalLives += val;
                if (stat.label.toLowerCase().includes('meals') || stat.label.toLowerCase().includes('langar') || stat.label.toLowerCase().includes('food')) mealsServed += val;
                if (stat.label.toLowerCase().includes('trees') || stat.label.toLowerCase().includes('plantation')) treesPlanted += val;
                if (stat.label.toLowerCase().includes('students') || stat.label.toLowerCase().includes('children') || stat.label.toLowerCase().includes('education')) studentsHelped += val;
            });
        });

        return {
            totalLives: totalLives.toLocaleString(),
            mealsServed: mealsServed.toLocaleString(),
            treesPlanted: treesPlanted.toLocaleString(),
            studentsHelped: studentsHelped.toLocaleString(),
            ngoCount: verifiedNGOs.length
        };
    }, [verifiedNGOs]);

    return (
        <div className="min-h-screen pt-28 md:pt-40 pb-20 animate-in fade-in duration-700">
            <div className="max-w-7xl mx-auto px-6">
                
                {/* Header */}
                <div className="text-center mb-20">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 mb-6">
                        <TrendingUp className="w-4 h-4 text-red-500" />
                        <span className="text-xs font-black text-red-500 uppercase tracking-widest">Nagpur Collective Impact</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-theme-primary mb-6 tracking-tighter font-serif">
                        Real Data. Real People. <br />
                        <span className="text-gradient">Real Transformation.</span>
                    </h1>
                    <p className="text-xl text-theme-primary/60 max-w-3xl mx-auto leading-relaxed">
                        We track the collective footprint of change across Nagpur. Every number below is a life touched, a meal shared, or a future secured.
                    </p>
                </div>

                {/* Big Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
                    <div className="glass-panel p-10 rounded-[3rem] border-orange-500/10 hover:border-orange-500/20 transition-all text-center group">
                        <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform">
                            <Users className="w-8 h-8 text-orange-500" />
                        </div>
                        <div className="text-4xl font-black text-theme-primary mb-2 tracking-tight">{aggregateStats.totalLives}+</div>
                        <div className="text-xs font-black uppercase tracking-widest text-theme-primary/30">Lives Impacted</div>
                    </div>

                    <div className="glass-panel p-10 rounded-[3rem] border-red-500/10 hover:border-red-500/20 transition-all text-center group">
                        <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform">
                            <Heart className="w-8 h-8 text-red-500" />
                        </div>
                        <div className="text-4xl font-black text-theme-primary mb-2 tracking-tight">{aggregateStats.mealsServed}+</div>
                        <div className="text-xs font-black uppercase tracking-widest text-theme-primary/30">Langar Meals Served</div>
                    </div>

                    <div className="glass-panel p-10 rounded-[3rem] border-amber-500/10 hover:border-amber-500/20 transition-all text-center group">
                        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform">
                            <Globe className="w-8 h-8 text-amber-500" />
                        </div>
                        <div className="text-4xl font-black text-theme-primary mb-2 tracking-tight">{aggregateStats.treesPlanted}+</div>
                        <div className="text-xs font-black uppercase tracking-widest text-theme-primary/30">Trees Planted</div>
                    </div>

                    <div className="glass-panel p-10 rounded-[3rem] border-red-500/10 hover:border-red-500/20 transition-all text-center group">
                        <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform">
                            <Award className="w-8 h-8 text-red-500" />
                        </div>
                        <div className="text-4xl font-black text-theme-primary mb-2 tracking-tight">{aggregateStats.ngoCount}</div>
                        <div className="text-xs font-black uppercase tracking-widest text-theme-primary/30">Verified Partner NGOs</div>
                    </div>
                </div>

                {/* Transparency Hub Highlight */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24">
                    <div className="lg:col-span-7 space-y-8">
                        <div className="flex items-center gap-3">
                            <span className="w-10 h-1 bg-orange-500 rounded-full"></span>
                            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-orange-400">Transparency Overload</h2>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-theme-primary tracking-tight font-serif">
                            Beyond Numbers: <br />
                            A Live Redirect to Truth.
                        </h2>
                        <p className="text-lg text-theme-primary/60 leading-relaxed max-w-2xl">
                            We don't just aggregate data—we verify it. We combine rigorous digital cross-referencing with physical on-ground audits to ensure that every milestone and impact report is 100% authentic.
                        </p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="flex gap-4">
                                <div className="shrink-0 w-10 h-10 rounded-xl bg-theme-primary/5 flex items-center justify-center">
                                    <ShieldCheck className="w-5 h-5 text-orange-400" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-theme-primary text-sm uppercase mb-1">Source-Verified</h4>
                                    <p className="text-xs text-theme-primary/40">Digital records cross-referenced with physical on-site audits.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="shrink-0 w-10 h-10 rounded-xl bg-theme-primary/5 flex items-center justify-center">
                                    <BarChart3 className="w-5 h-5 text-red-400" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-theme-primary text-sm uppercase mb-1">Direct Accounting</h4>
                                    <p className="text-xs text-theme-primary/40">See exactly how many lives are changed with every drive.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="lg:col-span-5 relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-red-500/20 blur-3xl rounded-full opacity-30"></div>
                        <div className="glass-panel p-8 rounded-[3rem] relative z-10 border-theme-primary/5 animate-in slide-in-from-right-4 duration-1000">
                            <div className="space-y-6">
                                {[
                                    { title: "Langar Meals", val: "127,600+", color: "text-amber-500" },
                                    { title: "Healthcare Kits", val: "45,200+", color: "text-red-500" },
                                    { title: "Empowerment Hours", val: "18,900+", color: "text-orange-500" }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-theme-primary/5 border border-theme-primary/5 group hover:bg-theme-primary/10 transition-all">
                                        <div className="text-xs font-black uppercase text-theme-primary/40 tracking-widest">{item.title}</div>
                                        <div className={`text-xl font-black ${item.color}`}>{item.val}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Call to Action */}
                <div className="glass-panel p-12 md:p-20 rounded-[4rem] text-center bg-[var(--bg-secondary)]/30">
                    <h2 className="text-4xl font-black text-theme-primary mb-6 uppercase tracking-tight">Become Part of the Data.</h2>
                    <p className="text-lg text-theme-primary/50 max-w-2xl mx-auto mb-12">
                        Nagpur's growth depends on collective action. Support a verified organization today and help us push these numbers even higher.
                    </p>
                    <a href="/directory" className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-theme-primary text-[var(--bg-primary)] font-black uppercase tracking-widest hover:scale-105 transition-all">
                        Support an NGO
                        <ExternalLink className="w-5 h-5" />
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Impact;
