import React from 'react';
import { ShieldCheck, Target, Heart, Eye, Users, CheckCircle2, ArrowRight } from 'lucide-react';

const Mission = () => {
    return (
        <div className="min-h-screen pt-28 md:pt-40 pb-20 animate-in fade-in duration-700">
            <div className="max-w-7xl mx-auto px-6">
                
                {/* Hero section */}
                <div className="text-center mb-20">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 mb-6">
                        <Target className="w-4 h-4 text-orange-500" />
                        <span className="text-xs font-black text-orange-500 uppercase tracking-widest">Our Strategic Vision</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-theme-primary mb-6 tracking-tighter font-serif">
                        Empowering Nagpur's <br />
                        <span className="text-gradient">Authentic Impact.</span>
                    </h1>
                    <p className="text-xl text-theme-primary/60 max-w-3xl mx-auto leading-relaxed">
                        NagpurGoodOrg is not just a directory; it's a verification standard. We bridge the gap between people who want to help and NGOs that actually deliver.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
                    <div className="glass-panel p-10 md:p-12 rounded-[3rem] border-orange-500/10 hover:border-orange-500/20 transition-all group">
                        <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                            <Eye className="w-8 h-8 text-orange-500" />
                        </div>
                        <h2 className="text-3xl font-black text-theme-primary mb-4 uppercase tracking-tight">The "Why"</h2>
                        <p className="text-theme-primary/60 leading-relaxed text-lg mb-6">
                            In an era of information overload, finding trustworthy organizations can be difficult. We cut through the noise by providing a curated, deep-dive portal for Nagpur's most impactful social entities.
                        </p>
                        <ul className="space-y-4">
                            {[
                                "Eliminate second-guessing in donations",
                                "Provide horizontal accountability",
                                "Showcase real-time on-ground drives",
                                "Unify collective impact data"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-theme-primary/80 font-medium">
                                    <CheckCircle2 className="w-5 h-5 text-orange-500 shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="glass-panel p-10 md:p-12 rounded-[3rem] border-red-500/10 hover:border-red-500/20 transition-all group">
                        <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                            <ShieldCheck className="w-8 h-8 text-red-500" />
                        </div>
                        <h2 className="text-3xl font-black text-theme-primary mb-4 uppercase tracking-tight">The "Standard"</h2>
                        <p className="text-theme-primary/60 leading-relaxed text-lg mb-6">
                            Every NGO on our platform undergoes a multi-layer verification process. We combine digital cross-referencing with physical on-ground audits by our team to ensure absolute authenticity.
                        </p>
                        <div className="space-y-6">
                            <div className="p-6 rounded-2xl bg-theme-primary/5 border border-theme-primary/5">
                                <h4 className="text-sm font-black text-theme-primary uppercase mb-2 tracking-widest">NGO Darpan Verified</h4>
                                <p className="text-xs text-theme-primary/50">Cross-referenced with NITI Aayog's official portal for legal compliance.</p>
                            </div>
                            <div className="p-6 rounded-2xl bg-theme-primary/5 border border-theme-primary/5">
                                <h4 className="text-sm font-black text-theme-primary uppercase mb-2 tracking-widest">Primary Sourcing</h4>
                                <p className="text-xs text-theme-primary/50">Impact metrics are pulled from the organization's own official reports and platforms.</p>
                            </div>
                            <div className="p-6 rounded-2xl bg-theme-primary/5 border border-theme-primary/5">
                                <h4 className="text-sm font-black text-theme-primary uppercase mb-2 tracking-widest">Physical Audit</h4>
                                <p className="text-xs text-theme-primary/50">Our team personally visits and verifies the physical headquarters and active mission sites of every partner NGO.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Values section */}
                <div className="glass-panel p-12 md:p-20 rounded-[4rem] text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 blur-[100px] rounded-full -mr-32 -mt-32"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-500/5 blur-[100px] rounded-full -ml-32 -mb-32"></div>
                    
                    <h2 className="text-4xl font-black text-theme-primary mb-12 uppercase tracking-tight relative z-10">Our Core Pillars</h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 relative z-10">
                        <div className="space-y-4">
                            <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mx-auto">
                                <Users className="w-6 h-6 text-orange-500" />
                            </div>
                            <h3 className="text-xl font-bold text-theme-primary">Transparency</h3>
                            <p className="text-sm text-theme-primary/50">Open access to leadership, financials, and on-ground activities.</p>
                        </div>
                        <div className="space-y-4">
                            <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mx-auto">
                                <Heart className="w-6 h-6 text-red-500" />
                            </div>
                            <h3 className="text-xl font-bold text-theme-primary">Directness</h3>
                            <p className="text-sm text-theme-primary/50">Connecting donors directly to NGO VPA handles for 0% commission support.</p>
                        </div>
                        <div className="space-y-4">
                            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mx-auto">
                                <ShieldCheck className="w-6 h-6 text-amber-500" />
                            </div>
                            <h3 className="text-xl font-bold text-theme-primary">Truth</h3>
                            <p className="text-sm text-theme-primary/50">Data backed by official records and verified digital footprints.</p>
                        </div>
                    </div>
                </div>

                <div className="mt-24 text-center">
                    <p className="text-theme-primary/40 uppercase text-xs font-black tracking-[0.3em] mb-8">Ready to see the difference?</p>
                    <a href="/directory" className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-gradient-to-r from-orange-600 to-red-600 text-white font-black uppercase tracking-widest shadow-2xl hover:shadow-orange-600/30 hover:-translate-y-1 transition-all group">
                        Explore the Directory
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Mission;
