import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    X, Phone, MapPin, Globe, Instagram, Facebook, Twitter, Youtube,
    Mail, Award, Calendar, BarChart3, Heart, ArrowLeft, Users,
    CheckCircle2, ExternalLink
} from 'lucide-react';
import { ngoData } from '../data/ngoData';

const NGODetails = () => {
    const { id } = useParams();
    const [ngo, setNgo] = useState(null);
    const [showDonation, setShowDonation] = useState(false);

    useEffect(() => {
        const foundNgo = ngoData.find(n => n.id.toString() === id.toString());
        setNgo(foundNgo);
        window.scrollTo(0, 0);
    }, [id]);

    if (!ngo) return (
        <div className="min-h-screen flex items-center justify-center text-white">
            <div className="animate-pulse flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-full border-4 border-violet-500 border-t-transparent animate-spin"></div>
                <p className="font-black tracking-widest uppercase text-xs">Finding Organization...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen pt-24 pb-20 animate-in fade-in duration-700">
            <div className="max-w-7xl mx-auto px-6">

                {/* Breadcrumb / Back */}
                <Link to="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-8 group">
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
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                                <div className="absolute bottom-8 left-8 right-8">
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {ngo.categories.map((cat, idx) => (
                                            <span key={idx} className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-black text-white/90 border border-white/10 uppercase tracking-widest">
                                                {cat}
                                            </span>
                                        ))}
                                    </div>
                                    <h1 className="text-4xl sm:text-6xl font-black text-white mb-2 leading-none tracking-tighter uppercase">{ngo.name}</h1>
                                    {ngo.founder && (
                                        <p className="text-white/60 text-sm font-medium">Founded by <span className="text-pink-400">{ngo.founder}</span></p>
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
                                        <div key={idx} className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:bg-white/10 transition-all text-center group/team">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 mx-auto flex items-center justify-center text-sm font-black text-white mb-4 shadow-lg group-hover/team:scale-110 transition-transform">
                                                {lead.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <h4 className="text-sm font-black text-white line-clamp-1">{lead.name}</h4>
                                            <p className="text-[10px] uppercase font-black text-white/30 tracking-widest mt-1">{lead.role}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Mission Section */}
                        <section className="glass-panel p-8 sm:p-12 rounded-[2.5rem]">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="w-10 h-1 bg-violet-500 rounded-full"></span>
                                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-violet-400">Our Strategic Vision</h2>
                            </div>
                            <p className="text-2xl sm:text-3xl text-white/90 leading-tight font-light italic mb-8 serif">
                                "{ngo.description}"
                            </p>
                            <div className="prose prose-invert max-w-none">
                                <p className="text-white/60 leading-relaxed text-lg">
                                    {ngo.longDescription || ngo.description}
                                </p>
                            </div>
                        </section>

                        {/* Programs Deep Dive */}
                        {ngo.programs && (
                            <section className="space-y-6">
                                <div className="flex items-center gap-3 mb-8">
                                    <span className="w-10 h-1 bg-pink-500 rounded-full"></span>
                                    <h2 className="text-xs font-black uppercase tracking-[0.3em] text-pink-400">Active Programs & On-ground Impact</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {ngo.programs.map((prog, idx) => (
                                        <div key={idx} className="glass-panel p-8 rounded-[2rem] border-white/5 hover:border-white/10 transition-all hover:bg-white/5 flex flex-col justify-between group">
                                            <div>
                                                <h3 className="text-xl font-black text-white mb-3 group-hover:text-pink-400 transition-colors uppercase tracking-tight">{prog.title}</h3>
                                                <p className="text-white/50 text-sm leading-relaxed mb-6">{prog.description}</p>
                                            </div>
                                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500/10 rounded-xl w-fit">
                                                <BarChart3 className="w-4 h-4 text-pink-500" />
                                                <span className="text-xs font-black text-pink-500 uppercase">{prog.impact}</span>
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
                                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-emerald-400">Recent Milestones</h2>
                            </div>
                            <div className="space-y-12 relative before:absolute before:inset-0 before:left-[11px] before:w-[2px] before:bg-white/5">
                                {ngo.recentActivities.map((activity, idx) => (
                                    <div key={idx} className="relative pl-12">
                                        <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-[#09090b] border-4 border-emerald-500/50 flex items-center justify-center">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                        </div>
                                        <div>
                                            <span className="text-[10px] font-black text-emerald-400/70 border border-emerald-400/20 px-2 py-1 rounded-md uppercase tracking-wider mb-2 inline-block">
                                                {activity.date}
                                            </span>
                                            <h4 className="text-xl font-bold text-white mb-2">{activity.title}</h4>
                                            <p className="text-white/40 text-sm leading-relaxed">{activity.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar (Right) */}
                    <aside className="lg:col-span-4 space-y-8">

                        {/* Fast Stats Card */}
                        <div className="glass-panel p-8 rounded-[2.5rem] sticky top-32">
                            <div className="flex items-center gap-2 mb-8">
                                <Award className="w-5 h-5 text-violet-400" />
                                <h3 className="font-black text-white uppercase tracking-widest text-sm">Transparency Hub</h3>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                {ngo.impactStats?.map((stat, idx) => (
                                    <a
                                        key={idx}
                                        href={stat.sourceUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-white/5 rounded-2xl p-4 border border-white/5 hover:bg-white/10 hover:border-violet-500/30 transition-all group/stat block"
                                    >
                                        <div className="text-xl font-black text-white group-hover/stat:text-violet-400 transition-colors">{stat.value}</div>
                                        <div className="text-[10px] uppercase text-white/30 font-black tracking-tight leading-none mt-1 flex items-center gap-1">
                                            {stat.label}
                                            <ExternalLink className="w-2 h-2 opacity-0 group-hover/stat:opacity-100 transition-opacity" />
                                        </div>
                                    </a>
                                ))}
                            </div>

                            {/* Legal Badges */}
                            <div className="space-y-3 mb-8">
                                {ngo.certifications?.map((cert, idx) => (
                                    <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                                        <CheckCircle2 className="w-4 h-4" />
                                        <span className="text-xs font-black uppercase tracking-widest">{cert} Verified</span>
                                    </div>
                                ))}
                            </div>

                            <div className="h-[1px] bg-white/5 mb-8"></div>

                            {/* Action Buttons */}
                            <div className="space-y-4">
                                <button
                                    onClick={() => setShowDonation(true)}
                                    className="w-full py-5 rounded-2xl bg-gradient-to-r from-violet-600 to-pink-600 font-black text-white text-sm uppercase tracking-[0.2em] shadow-[0_20px_40px_rgba(236,72,153,0.3)] hover:shadow-[0_25px_50px_rgba(236,72,153,0.5)] transition-all transform hover:-translate-y-1 active:scale-95"
                                >
                                    Give Direct Support
                                </button>
                                <a
                                    href={ngo.website}
                                    target="_blank"
                                    className="w-full py-5 rounded-2xl border-2 border-white/10 font-black text-white text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-white/5 transition-all"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                    Official Portal
                                </a>
                            </div>

                            {/* Leadership Mini list */}
                            {ngo.leadership && (
                                <div className="mt-12">
                                    <h4 className="text-[10px] uppercase font-black text-white/30 tracking-[0.2em] mb-4">Board of Directors</h4>
                                    <div className="space-y-4">
                                        {ngo.leadership.slice(0, 3).map((lead, idx) => (
                                            <div key={idx} className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] text-white/40 font-black">
                                                    {lead.name.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-white leading-none">{lead.name}</div>
                                                    <div className="text-[9px] uppercase font-black text-white/30 tracking-widest mt-1">{lead.role}</div>
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
                        <div className="inline-flex p-4 rounded-[2rem] bg-pink-500/10 text-pink-400">
                            <Heart className="w-12 h-12" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-white uppercase tracking-tight">Direct Donation</h3>
                            <p className="text-white/50 text-sm mt-2">100% of your gift goes via official UPI directly to the NGO bank account.</p>
                        </div>
                        <div className="bg-white p-6 rounded-[2rem] inline-block">
                            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=${ngo.mockUPI}&pn=${encodeURIComponent(ngo.name)}`} alt="UPI QR" className="w-48 h-48 rounded-xl" />
                        </div>
                        <div className="pt-4">
                            <span className="text-[10px] uppercase font-black text-white/20 tracking-widest block mb-2">Merchant VPA</span>
                            <span className="bg-white/5 px-4 py-2 rounded-xl text-white font-mono text-sm tracking-wider border border-white/10">{ngo.mockUPI}</span>
                        </div>
                        <button onClick={() => setShowDonation(false)} className="w-full text-white/30 uppercase text-[10px] font-black tracking-widest hover:text-white transition-colors">Close Portal</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NGODetails;
