import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    X, Phone, MapPin, Globe, Instagram, Facebook, Twitter, Youtube,
    Mail, Award, Calendar, BarChart3, Heart, ArrowLeft, Users,
    CheckCircle2, ExternalLink, ShieldCheck
} from 'lucide-react';
import { ngoData } from '../data/ngoData';
import { getCertConfig } from '../constants/certifications';
import { calculateTrustScore } from '../utils/trustScore';

const NGODetails = () => {
    const { id } = useParams();
    const [ngo, setNgo] = useState(null);
    const [showDonation, setShowDonation] = useState(false);
    const trustScore = ngo ? calculateTrustScore(ngo) : null;

    useEffect(() => {
        const foundNgo = ngoData.find(n => n.id.toString() === id.toString());
        setNgo(foundNgo);
        window.scrollTo(0, 0);
    }, [id]);

    if (!ngo) return (
        <div className="min-h-screen flex items-center justify-center text-theme-primary">
            <div className="animate-pulse flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-full border-4 border-orange-500 border-t-transparent animate-spin"></div>
                <p className="font-black tracking-widest uppercase text-xs">Finding Organization...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen pt-24 pb-20 animate-in fade-in duration-700">
            <div className="max-w-7xl mx-auto px-6">

                {/* Breadcrumb / Back */}
                <Link to="/" className="inline-flex items-center gap-2 text-theme-primary/40 hover:text-theme-primary transition-colors mb-8 group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-xs font-black uppercase tracking-widest">Back to Directory</span>
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Main Content (Left) */}
                    <div className="lg:col-span-8 space-y-12">

                        {/* Hero Header */}
                        <section className="relative rounded-[3rem] overflow-hidden group shadow-2xl">
                            <div className="aspect-[21/9] sm:aspect-[16/7] w-full relative">
                                <img src={ngo.image} alt={ngo.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-[var(--bg-primary)]/30 backdrop-blur-[2px] transition-colors duration-300" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-[var(--bg-primary)]/80 to-transparent transition-colors duration-300" />

                                <div className="absolute bottom-8 left-8 right-8">
                                    <div className="flex items-center gap-4 mb-4">
                                        {ngo.logo && (
                                            <div className="w-16 h-16 rounded-2xl bg-white p-2 shadow-2xl overflow-hidden backdrop-blur-md shrink-0">
                                                <img src={ngo.logo} alt="NGO Logo" className="w-full h-full object-contain" />
                                            </div>
                                        )}
                                        <div className="flex flex-wrap gap-2">
                                            {ngo.categories.map((cat, idx) => (
                                                <span key={idx} className="px-3 py-1 bg-[var(--bg-primary)]/50 backdrop-blur-md rounded-full text-[10px] font-black text-theme-primary border border-theme-primary/20 uppercase tracking-widest shadow-sm">
                                                    {cat}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <h1 className="text-4xl sm:text-6xl font-black text-theme-primary mb-2 leading-none tracking-tighter font-serif drop-shadow-xl">{ngo.name}</h1>
                                    {ngo.founder && (
                                        <p className="text-theme-primary/60 text-sm font-medium">Founded by <span className="text-red-400">{ngo.founder}</span></p>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* Team & Leadership */}
                        {ngo.leadership && (
                            <section className="glass-panel p-8 sm:p-10 rounded-[2.5rem] animate-in slide-in-from-bottom-4 duration-700">
                                <div className="flex items-center gap-3 mb-10">
                                    <span className="w-10 h-1 bg-blue-500 rounded-full"></span>
                                    <h2 className="text-xs font-black uppercase tracking-[0.3em] text-blue-400">Team & Leadership</h2>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                                    {ngo.leadership.map((lead, idx) => (
                                        <div key={idx} className="bg-theme-primary/5 p-6 rounded-2xl border border-theme-primary/5 hover:bg-theme-primary/10 transition-all text-center group/team">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-amber-600 mx-auto flex items-center justify-center text-sm font-black text-white mb-4 shadow-lg group-hover/team:scale-110 transition-transform">
                                                {lead.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <h4 className="text-sm font-black text-theme-primary line-clamp-1">{lead.name}</h4>
                                            <p className="text-[10px] uppercase font-black text-theme-primary/30 tracking-widest mt-1">{lead.role}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Mission Section */}
                        <section className="glass-panel p-8 sm:p-12 rounded-[2.5rem]">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="w-10 h-1 bg-orange-500 rounded-full"></span>
                                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-orange-400">Our Strategic Vision</h2>
                            </div>
                            <p className="text-2xl sm:text-3xl text-theme-primary/90 leading-tight font-light italic mb-8 serif">
                                "{ngo.description}"
                            </p>
                            <div className="prose prose-invert max-w-none">
                                <p className="text-theme-primary/60 leading-relaxed text-lg">
                                    {ngo.longDescription || ngo.description}
                                </p>
                            </div>
                        </section>

                        {/* Programs Deep Dive */}
                        {ngo.programs && (
                            <section className="space-y-6">
                                <div className="flex items-center gap-3 mb-8">
                                    <span className="w-10 h-1 bg-amber-500 rounded-full"></span>
                                    <h2 className="text-xs font-black uppercase tracking-[0.3em] text-red-400">Active Programs & On-ground Impact</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {ngo.programs.map((prog, idx) => (
                                        <div key={idx} className="glass-panel p-8 rounded-[2rem] border-theme-primary/5 hover:border-theme-primary/10 transition-all hover:bg-theme-primary/5 flex flex-col justify-between group">
                                            <div>
                                                <h3 className="text-xl font-black text-theme-primary mb-3 group-hover:text-red-400 transition-colors uppercase tracking-tight">{prog.title}</h3>
                                                <p className="text-theme-primary/50 text-sm leading-relaxed mb-6">{prog.description}</p>
                                            </div>
                                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 rounded-xl w-fit">
                                                <BarChart3 className="w-4 h-4 text-red-500" />
                                                <span className="text-xs font-black text-red-500 uppercase">{prog.impact}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Impact Timeline */}
                        <section className="glass-panel p-8 sm:p-10 rounded-[2.5rem]">
                            <div className="flex items-center gap-3 mb-10">
                                <span className="w-10 h-1 bg-emerald-500 rounded-full"></span>
                                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-emerald-400">Official Milestones & Drives</h2>
                            </div>
                            <div className="space-y-12 relative before:absolute before:inset-0 before:left-[11px] before:w-[2px] before:bg-theme-primary/5">
                                {ngo.recentActivities.map((activity, idx) => (
                                    <a
                                        key={idx}
                                        href={activity.sourceUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="relative pl-12 block group/milestone transition-all hover:translate-x-2"
                                    >
                                        <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-[#09090b] border-4 border-emerald-500/50 flex items-center justify-center transition-colors group-hover/milestone:border-emerald-400">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-[10px] font-black text-emerald-400/70 border border-emerald-400/20 px-2 py-1 rounded-md uppercase tracking-wider">
                                                    {activity.date}
                                                </span>
                                                <ExternalLink className="w-3 h-3 text-theme-primary/20 group-hover/milestone:text-emerald-400 transition-colors" />
                                            </div>
                                            <h4 className="text-xl font-bold text-theme-primary mb-2 group-hover/milestone:text-emerald-400 transition-colors">{activity.title}</h4>
                                            <p className="text-theme-primary/40 text-sm leading-relaxed">{activity.description}</p>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar (Right) */}
                    <aside className="lg:col-span-4 space-y-8">

                        {/* Fast Stats Card */}
                        <div className="glass-panel p-8 rounded-[2.5rem] sticky top-32">

                            {/* Action Buttons - Moved to Top */}
                            <div className="space-y-4 mb-10">
                                <button
                                    onClick={() => setShowDonation(true)}
                                    className="w-full py-5 rounded-2xl bg-gradient-to-r from-orange-600 to-red-600 font-black text-white text-sm uppercase tracking-[0.2em] shadow-[0_20px_40px_rgba(239,68,68,0.3)] hover:shadow-[0_25px_50px_rgba(239,68,68,0.5)] transition-all transform hover:-translate-y-1 active:scale-95"
                                >
                                    GIVE DIRECT SUPPORT
                                </button>
                                <a
                                    href={ngo.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full py-5 rounded-2xl border-2 border-theme-primary/10 font-black text-theme-primary text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-theme-primary/5 transition-all"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                    OFFICIAL PORTAL
                                </a>
                            </div>

                            <div className="flex items-center gap-2 mb-8">
                                <Award className="w-5 h-5 text-orange-400" />
                                <h3 className="font-black text-theme-primary uppercase tracking-widest text-sm">Transparency Hub</h3>
                            </div>
                            
                            {/* Confidence Meter */}
                            {trustScore && (
                                <div className="mb-8 relative group z-20">
                                    <div className="bg-theme-primary/5 rounded-[2rem] p-6 border border-theme-primary/5 cursor-help transition-all hover:bg-theme-primary/10">
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="text-[10px] uppercase tracking-widest text-theme-primary/40 font-black">Confidence Meter</h4>
                                            <div className={`px-3 py-1 rounded-lg border flex items-center gap-1.5 ${
                                                trustScore.score >= 80 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
                                                trustScore.score >= 50 ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' :
                                                'bg-blue-500/10 border-blue-500/20 text-blue-500'
                                            }`}>
                                                <ShieldCheck className="w-3 h-3" />
                                                <span className="font-black text-xs">{trustScore.score}% Score</span>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center text-xs mb-2">
                                            <span className="font-medium text-theme-primary/60">{trustScore.level}</span>
                                            <span className="font-black text-theme-primary">{trustScore.rawScore} Points</span>
                                        </div>
                                        <div className="w-full h-2 bg-theme-primary/10 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full rounded-full transition-all duration-1000 ${
                                                    trustScore.score >= 80 ? 'bg-emerald-500' :
                                                    trustScore.score >= 50 ? 'bg-amber-500' :
                                                    'bg-blue-500'
                                                }`}
                                                style={{ width: `${trustScore.score}%` }}
                                            />
                                        </div>
                                    </div>
                                    
                                    {/* Tooltip / Popup on Hover/Focus */}
                                    <div className="absolute top-full left-0 right-0 mt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0 drop-shadow-2xl">
                                        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 relative">
                                            {/* Up arrow */}
                                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-zinc-900 border-l border-t border-zinc-800 rotate-45"></div>
                                            
                                            <div className="relative z-10">
                                                <h5 className="text-[10px] uppercase tracking-widest text-zinc-500 font-black mb-4">Score Breakdown</h5>
                                                <div className="flex flex-col gap-2">
                                                    {trustScore.breakdown.map((item, idx) => (
                                                        <div key={idx} className="flex items-center justify-between py-2 border-b border-zinc-800/50 last:border-0">
                                                            <span className="text-xs text-zinc-400 font-medium">{item.label}</span>
                                                            <span className="text-xs font-black text-emerald-400">+{item.points}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                {ngo.impactStats?.map((stat, idx) => (
                                    <a
                                        key={idx}
                                        href={stat.sourceUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-theme-primary/5 rounded-2xl p-4 border border-theme-primary/5 hover:bg-theme-primary/10 hover:border-orange-500/30 transition-all group/stat block"
                                    >
                                        <div className="text-xl font-black text-theme-primary group-hover/stat:text-orange-400 transition-colors">{stat.value}</div>
                                        <div className="text-[10px] uppercase text-theme-primary/30 font-black tracking-tight leading-none mt-1 flex items-center gap-1">
                                            {stat.label}
                                            <ExternalLink className="w-2 h-2 opacity-0 group-hover/stat:opacity-100 transition-opacity" />
                                        </div>
                                    </a>
                                ))}
                            </div>

                            {/* Legal Badges */}
                            <div className="space-y-3 mb-8">
                                {ngo.certifications?.map((cert, idx) => {
                                    const config = getCertConfig(cert);
                                    return (
                                        <div key={idx} className={`flex items-center gap-3 p-3 rounded-xl ${config.colors.bg} border ${config.colors.border} ${config.colors.text}`}>
                                            <config.icon className="w-4 h-4" />
                                            <span className="text-xs font-black uppercase tracking-widest">{config.label} Verified</span>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="h-[1px] bg-theme-primary/5 mb-8"></div>


                            {/* Leadership Mini list */}
                            {ngo.leadership && (
                                <div className="mt-12">
                                    <h4 className="text-[10px] uppercase font-black text-theme-primary/30 tracking-[0.2em] mb-4">Board of Directors</h4>
                                    <div className="space-y-4">
                                        {ngo.leadership.slice(0, 3).map((lead, idx) => (
                                            <div key={idx} className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-theme-primary/5 border border-theme-primary/10 flex items-center justify-center text-[10px] text-theme-primary/40 font-black">
                                                    {lead.name.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-theme-primary leading-none">{lead.name}</div>
                                                    <div className="text-[9px] uppercase font-black text-theme-primary/30 tracking-widest mt-1">{lead.role}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </aside>
                </div>
            </div>

            {/* Donation Modal overlay (re-using the same aesthetic) */}
            {showDonation && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-black/80" onClick={() => setShowDonation(false)} />
                    <div className="relative w-full max-w-sm glass-panel p-10 rounded-[3rem] text-center space-y-8 animate-in zoom-in-95 duration-300">
                        <div className="inline-flex p-4 rounded-[2rem] bg-amber-500/10 text-red-400">
                            <Heart className="w-12 h-12" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-theme-primary uppercase tracking-tight">Direct Donation</h3>
                            <p className="text-theme-primary/50 text-sm mt-2">100% of your gift goes via official UPI directly to the NGO bank account.</p>
                        </div>
                        <div className="bg-white p-6 rounded-[2rem] inline-block">
                            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=${ngo.mockUPI}&pn=${encodeURIComponent(ngo.name)}`} alt="UPI QR" className="w-48 h-48 rounded-xl" />
                        </div>
                        <div className="pt-4">
                            <span className="text-[10px] uppercase font-black text-theme-primary/20 tracking-widest block mb-2">Merchant VPA</span>
                            <span className="bg-theme-primary/5 px-4 py-2 rounded-xl text-theme-primary font-mono text-sm tracking-wider border border-theme-primary/10">{ngo.mockUPI}</span>
                        </div>
                        <button onClick={() => setShowDonation(false)} className="w-full text-theme-primary/30 uppercase text-[10px] font-black tracking-widest hover:text-theme-primary transition-colors">Close Portal</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NGODetails;
