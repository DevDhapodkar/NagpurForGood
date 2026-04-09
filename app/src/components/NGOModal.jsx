import React, { useEffect, useState } from 'react';
import { X, Phone, MapPin, Globe, Instagram, Facebook, Twitter, Youtube, Mail, Award, Calendar, BarChart3, Heart, FileText, Shield, ShieldCheck, BadgeCheck, Check } from 'lucide-react';

import { getCertConfig } from '../constants/certifications';
import { calculateTrustScore } from '../utils/trustScore';

const NGOModal = ({ ngo, onClose }) => {
    const [showDonation, setShowDonation] = useState(false);
    const trustScore = ngo ? calculateTrustScore(ngo) : null;

    // Lock body scroll when modal is open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    if (!ngo || !trustScore) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-6 backdrop-blur-sm animate-in fade-in duration-300">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 transition-opacity"
                onClick={onClose}
            />

            {/* Modal Container */}
            <div className="relative w-full max-w-3xl max-h-[95vh] overflow-y-auto glass-panel rounded-3xl shadow-2xl flex flex-col animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-300">

                {/* Cover Image & Header */}
                <div className="relative h-56 sm:h-80 w-full shrink-0">
                    <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${ngo.image})` }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-[var(--bg-primary)]/40 to-transparent" />

                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-full glass-btn text-[var(--text-primary)] hover:text-red-400 z-10 hover:rotate-90 transition-transform duration-300"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    <div className="absolute bottom-8 left-8 right-8">
                        <h2 className="text-4xl sm:text-5xl font-black text-theme-primary mb-4 tracking-tight drop-shadow-lg font-serif">{ngo.name}</h2>
                        <div className="flex flex-wrap gap-2">
                            {ngo.categories.map((cat, idx) => (
                                <span key={idx} className="px-3 py-1 bg-theme-primary/10 backdrop-blur-md rounded-full text-[10px] font-black text-theme-primary border border-theme-primary/10 uppercase tracking-[0.2em] shadow-sm">
                                    {cat}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 sm:p-10 flex-1">
                    {!showDonation ? (
                        <div className="space-y-12">

                            {/* Action Buttons - Moved to Top */}
                            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                                <button
                                    onClick={() => setShowDonation(true)}
                                    className="flex-1 py-4 px-10 rounded-2xl font-black text-white bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 shadow-[0_0_30px_rgba(239,68,68,0.4)] hover:shadow-[0_0_40px_rgba(239,68,68,0.6)] transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3 uppercase tracking-widest text-xs sm:text-sm"
                                >
                                    <Heart className="w-5 h-5 animate-pulse" />
                                    GIVE DIRECT SUPPORT
                                </button>
                                <a
                                    href={ngo.website && !ngo.website.includes('example.com') ? ngo.website : `https://www.google.com/search?q=${encodeURIComponent(ngo.name + " Nagpur")}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 py-4 px-6 rounded-2xl font-black text-center border-2 border-[var(--border-color)] hover:border-orange-500/30 text-[var(--text-primary)] transition-all flex items-center justify-center gap-3 glass-panel shadow-xl uppercase tracking-widest text-xs sm:text-sm"
                                >
                                    <Globe className="w-5 h-5" />
                                    OFFICIAL PORTAL
                                </a>
                            </div>

                            {/* Top Stats Bar */}
                            {ngo.impactStats && (
                                <div className="grid grid-cols-2 gap-4">
                                    {ngo.impactStats.map((stat, idx) => (
                                        <div key={idx} className="glass-card p-4 rounded-2xl flex flex-col items-center">
                                            <BarChart3 className="w-5 h-5 text-orange-400 mb-1" />
                                            <span className="text-2xl font-black text-[var(--text-primary)]">{stat.value}</span>
                                            <span className="text-xs text-[var(--text-muted)] uppercase tracking-tighter">{stat.label}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Certifications Modules */}
                            <section className="animate-in fade-in slide-in-from-bottom-2 delay-75 fill-mode-both">
                                <div className="flex items-center justify-between mb-6">
                                    <h4 className="text-[10px] uppercase tracking-[0.3em] text-[var(--text-muted)] font-black">Trust & Transparency</h4>
                                    <div className={`px-4 py-1.5 rounded-xl border flex items-center gap-2 ${
                                        trustScore.score >= 80 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
                                        trustScore.score >= 50 ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' :
                                        'bg-blue-500/10 border-blue-500/20 text-blue-500'
                                    }`}>
                                        <ShieldCheck className="w-4 h-4" />
                                        <span className="font-black text-sm">{trustScore.score}% Score</span>
                                        <span className="text-[10px] uppercase tracking-wider opacity-60">({trustScore.level})</span>
                                    </div>
                                </div>
                                
                                {/* Score Breakdown */}
                                <div className="mb-6 relative group z-20">
                                    <div className="bg-theme-primary/5 rounded-[2rem] p-6 border border-theme-primary/5 cursor-help transition-all hover:bg-theme-primary/10">
                                        <div className="flex items-center justify-between">
                                            <h5 className="text-[10px] uppercase tracking-widest text-theme-primary/40 font-black">Confidence Meter Breakdown</h5>
                                            <span className="text-xs font-medium text-theme-primary/60">Hover for Details</span>
                                        </div>
                                    </div>
                                    
                                    {/* Tooltip / Popup on Hover/Focus */}
                                    <div className="absolute top-full left-0 right-0 mt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0 drop-shadow-2xl">
                                        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 relative">
                                            {/* Up arrow */}
                                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-zinc-900 border-l border-t border-zinc-800 rotate-45"></div>
                                            
                                            <div className="relative z-10">
                                                <div className="flex flex-col gap-2">
                                                    {trustScore.breakdown.map((item, idx) => (
                                                        <div key={idx} className="flex items-center justify-between py-2 border-b border-zinc-800/50 last:border-0">
                                                            <span className="text-sm text-zinc-300 font-medium">{item.label}</span>
                                                            <span className="text-sm font-black text-emerald-400">+{item.points}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {(ngo.certifications || ["80G", "12A", "NITI Aayog", "NGO Darpan"]).map((cert, idx) => {
                                        const config = getCertConfig(cert);
                                        const Icon = config.icon;
                                        return (
                                            <div key={idx} className={`flex items-center justify-between p-6 rounded-[2rem] ${config.colors.bg} border ${config.colors.border} ${config.colors.bgHover} transition-all group cursor-default`}>
                                                <div className="flex items-center gap-5">
                                                    <div className={`p-3 rounded-2xl ${config.colors.bgSubtle} ${config.colors.text} ${config.colors.shadow}`}>
                                                        <Icon className="w-6 h-6" />
                                                    </div>
                                                    <span className={`text-xl font-black tracking-tight ${config.colors.text}`}>{config.label}</span>
                                                </div>
                                                <div className={`p-1.5 rounded-full ${config.colors.bgSubtle} border ${config.colors.border}`}>
                                                    <Check className={`w-4 h-4 ${config.colors.text} stroke-[3]`} />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>

                            {/* About section */}
                            <section className="animate-in fade-in slide-in-from-bottom-2 delay-150 fill-mode-both">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-8 h-[2px] bg-orange-500 rounded-full"></div>
                                    <h4 className="text-xs uppercase tracking-[0.2em] text-orange-400 font-black">Our Mission</h4>
                                </div>
                                <p className="text-[var(--text-secondary)] leading-relaxed text-lg italic font-light serif">
                                    "{ngo.description}"
                                </p>
                            </section>

                            {/* Recent Activities Section */}
                            {ngo.recentActivities && (
                                <section className="animate-in fade-in slide-in-from-bottom-2 delay-300 fill-mode-both">
                                    <div className="flex items-center gap-2 mb-6">
                                        <div className="w-8 h-[2px] bg-amber-500 rounded-full"></div>
                                        <h4 className="text-xs uppercase tracking-[0.2em] text-red-400 font-black">Recent Impact & Events</h4>
                                    </div>
                                    <div className="space-y-4">
                                        {ngo.recentActivities.map((activity, idx) => (
                                            <div key={idx} className="glass-card p-5 rounded-2xl flex flex-col sm:flex-row gap-5 transition-all">
                                                <div className="w-full sm:w-24 h-24 rounded-xl bg-[var(--bg-secondary)] shrink-0 flex items-center justify-center border border-[var(--border-color)]">
                                                    <Calendar className="w-10 h-10 text-[var(--text-muted)] opacity-30" />
                                                </div>
                                                <div>
                                                    <div className="flex justify-between items-start mb-1">
                                                        <h5 className="font-bold text-[var(--text-primary)] text-lg">{activity.title}</h5>
                                                        <span className="text-xs font-bold text-[var(--text-muted)] bg-[var(--bg-secondary)] px-2 py-0.5 rounded border border-[var(--border-color)]">{activity.date}</span>
                                                    </div>
                                                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{activity.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Contact & Legal Grid */}
                            <section className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8 border-t border-[var(--border-color)] animate-in fade-in slide-in-from-bottom-2 delay-500 fill-mode-both">
                                <div className="space-y-4">
                                    <h4 className="text-xs uppercase tracking-widest text-[var(--text-muted)] font-black">Contact Outreach</h4>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 text-[var(--text-primary)]">
                                            <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400"><Phone className="w-4 h-4" /></div>
                                            <span className="text-sm font-medium">{ngo.contact}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-[var(--text-primary)]">
                                            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400"><Mail className="w-4 h-4" /></div>
                                            <span className="text-sm font-medium">{ngo.socialLinks?.email || 'contact@nagpurgoodorganisation.org'}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-[var(--text-primary)]">
                                            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400"><MapPin className="w-4 h-4 shrink-0" /></div>
                                            <span className="text-sm font-medium truncate">{ngo.address}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-xs uppercase tracking-widest text-[var(--text-muted)] font-black">Social Presence</h4>
                                    <div className="flex flex-wrap gap-3">
                                        {ngo.socialLinks?.instagram && (
                                            <a href={ngo.socialLinks.instagram} target="_blank" className="p-4 rounded-2xl glass-card text-red-500 hover:scale-110 transition-all"><Instagram className="w-6 h-6" /></a>
                                        )}
                                        {ngo.socialLinks?.facebook && (
                                            <a href={ngo.socialLinks.facebook} target="_blank" className="p-4 rounded-2xl glass-card text-blue-500 hover:scale-110 transition-all"><Facebook className="w-6 h-6" /></a>
                                        )}
                                        {ngo.socialLinks?.youtube && (
                                            <a href={ngo.socialLinks.youtube} target="_blank" className="p-4 rounded-2xl glass-card text-red-500 hover:scale-110 transition-all"><Youtube className="w-6 h-6" /></a>
                                        )}
                                        {!ngo.socialLinks?.instagram && !ngo.socialLinks?.facebook && !ngo.socialLinks?.youtube && (
                                            <div className="text-[var(--text-muted)] text-xs italic py-4">Direct social links coming soon...</div>
                                        )}
                                    </div>
                                </div>
                            </section>

                        </div>
                    ) : (
                        /* Donation View */
                        <div className="flex flex-col items-center justify-center py-12 space-y-10 animate-in slide-in-from-right-12 duration-500">
                            <div className="text-center">
                                <div className="inline-flex p-3 rounded-2xl bg-orange-600/10 text-orange-400 mb-6 border border-orange-500/20">
                                    <Heart className="w-10 h-10" />
                                </div>
                                <h3 className="text-4xl font-black text-[var(--text-primary)] mb-3">Support {ngo.name}</h3>
                                <p className="text-[var(--text-secondary)] text-lg max-w-sm mx-auto">100% of your donation goes directly to {ngo.name} via official UPI.</p>
                            </div>

                            <div className="p-8 bg-white rounded-[2rem] shadow-2xl relative group">
                                <img
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=upi://pay?pa=${ngo.mockUPI}&pn=${encodeURIComponent(ngo.name)}`}
                                    alt="UPI QR Code"
                                    className="w-56 h-56 sm:w-64 sm:h-64 rounded-xl pointer-events-none"
                                />
                                <div className="absolute inset-0 bg-theme-primary/60 rounded-[2rem] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-[4px] cursor-not-allowed">
                                    <div className="text-white bg-zinc-950 px-6 py-4 rounded-2xl font-black text-lg shadow-2xl rotate-[-5deg] border-2 border-red-500">VERIFIED FLOW</div>
                                </div>
                            </div>

                            <div className="w-full max-w-sm flex flex-col gap-4">
                                <div className="glass-panel p-5 rounded-2xl flex items-center justify-between border border-[var(--border-color)]">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] uppercase font-black text-[var(--text-muted)] tracking-widest">Merchant VPA</span>
                                        <span className="text-lg text-[var(--text-primary)] font-mono font-black">{ngo.mockUPI}</span>
                                    </div>
                                    <button onClick={() => navigator.clipboard.writeText(ngo.mockUPI)} className="p-3 rounded-xl glass-btn text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                                        <Award className="w-5 h-5" />
                                    </button>
                                </div>

                                <button
                                    onClick={() => setShowDonation(false)}
                                    className="py-5 w-full rounded-2xl font-black glass-btn text-xs uppercase tracking-widest transition-all"
                                >
                                    Back to NGO Profile
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NGOModal;
