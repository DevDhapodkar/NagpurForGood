import React, { useEffect, useState } from 'react';
import { X, Phone, MapPin, Globe, Instagram, Facebook, Twitter, Youtube, Mail, Award, Calendar, BarChart3, Heart, FileText, Shield, BadgeCheck, Check } from 'lucide-react';

import { getCertConfig } from '../constants/certifications';

const NGOModal = ({ ngo, onClose }) => {
    const [showDonation, setShowDonation] = useState(false);

    // Lock body scroll when modal is open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    if (!ngo) return null;

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
                        className="absolute top-4 right-4 p-2 rounded-full glass-btn text-[var(--text-primary)] hover:text-pink-400 z-10 hover:rotate-90 transition-transform duration-300"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    <div className="absolute bottom-8 left-8 right-8">
                        <h2 className="text-4xl sm:text-5xl font-black text-white mb-4 tracking-tight drop-shadow-lg">{ngo.name}</h2>
                        <div className="flex flex-wrap gap-2">
                            {ngo.categories.map((cat, idx) => (
                                <span key={idx} className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-black text-white border border-white/10 uppercase tracking-[0.2em] shadow-sm">
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
                                    className="flex-1 py-4 px-10 rounded-2xl font-black text-white bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 shadow-[0_0_30px_rgba(236,72,153,0.4)] hover:shadow-[0_0_40px_rgba(236,72,153,0.6)] transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3 uppercase tracking-widest text-xs sm:text-sm"
                                >
                                    <Heart className="w-5 h-5 animate-pulse" />
                                    GIVE DIRECT SUPPORT
                                </button>
                                <a
                                    href={ngo.website && !ngo.website.includes('example.com') ? ngo.website : `https://www.google.com/search?q=${encodeURIComponent(ngo.name + " Nagpur")}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 py-4 px-6 rounded-2xl font-black text-center border-2 border-[var(--border-color)] hover:border-violet-500/30 text-[var(--text-primary)] transition-all flex items-center justify-center gap-3 glass-panel shadow-xl uppercase tracking-widest text-xs sm:text-sm"
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
                                            <BarChart3 className="w-5 h-5 text-violet-400 mb-1" />
                                            <span className="text-2xl font-black text-[var(--text-primary)]">{stat.value}</span>
                                            <span className="text-xs text-[var(--text-muted)] uppercase tracking-tighter">{stat.label}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Certifications Modules */}
                            <section className="animate-in fade-in slide-in-from-bottom-2 delay-75 fill-mode-both">
                                <h4 className="text-[10px] uppercase tracking-[0.3em] text-[var(--text-muted)] font-black mb-6">Certifications</h4>
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
                                    <div className="w-8 h-[2px] bg-violet-500 rounded-full"></div>
                                    <h4 className="text-xs uppercase tracking-[0.2em] text-violet-400 font-black">Our Mission</h4>
                                </div>
                                <p className="text-[var(--text-secondary)] leading-relaxed text-lg italic font-light serif">
                                    "{ngo.description}"
                                </p>
                            </section>

                            {/* Recent Activities Section */}
                            {ngo.recentActivities && (
                                <section className="animate-in fade-in slide-in-from-bottom-2 delay-300 fill-mode-both">
                                    <div className="flex items-center gap-2 mb-6">
                                        <div className="w-8 h-[2px] bg-pink-500 rounded-full"></div>
                                        <h4 className="text-xs uppercase tracking-[0.2em] text-pink-400 font-black">Recent Impact & Events</h4>
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
                                            <div className="p-2 rounded-lg bg-violet-500/10 text-violet-400"><Phone className="w-4 h-4" /></div>
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
                                            <a href={ngo.socialLinks.instagram} target="_blank" className="p-4 rounded-2xl glass-card text-pink-500 hover:scale-110 transition-all"><Instagram className="w-6 h-6" /></a>
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
                                <div className="inline-flex p-3 rounded-2xl bg-violet-600/10 text-violet-400 mb-6 border border-violet-500/20">
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
                                <div className="absolute inset-0 bg-white/60 rounded-[2rem] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-[4px] cursor-not-allowed">
                                    <div className="text-white bg-zinc-950 px-6 py-4 rounded-2xl font-black text-lg shadow-2xl rotate-[-5deg] border-2 border-pink-500">VERIFIED FLOW</div>
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
