import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    Globe, Mail, Phone, MapPin, Award, CheckCircle2,
    Users, ShieldCheck, Heart, Share2, ArrowLeft, Instagram,
    Linkedin, Youtube, Facebook, MessageSquare, Info,
    ExternalLink, HeartPulse, BarChart3, Smartphone, Milestone, BadgeCheck, Star, TrendingUp, AlertTriangle
} from 'lucide-react';
import { useNGOs } from '../context/NGOContext';
import { getCertConfig } from '../constants/certifications';
import { calculateTrustScore } from '../utils/trustScore';
import DonationForm from '../components/DonationForm';
import { db } from '../utils/firebase';
import { doc, updateDoc, increment } from 'firebase/firestore';

const NGODetails = () => {
    const { id } = useParams();
    const { ngoList } = useNGOs();
    const [ngo, setNgo] = useState(null);
    const [showDonation, setShowDonation] = useState(false);
    const trustScore = ngo ? calculateTrustScore(ngo) : null;

    useEffect(() => {
        const foundNgo = ngoList.find(n => n.id.toString() === id.toString());
        setNgo(foundNgo);
        window.scrollTo(0, 0);

        // Increment Views for this NGO (only logic runs if ngo exists, fires once due to strict dependency checking)
        if (foundNgo) {
            try {
                const docRef = doc(db, 'ngos', foundNgo.id.toString());
                updateDoc(docRef, {
                    views: increment(1)
                });
            } catch (error) {
                console.error("Failed tracking view metric", error);
            }
        }
    }, [id, ngoList]);

    const handleGiveDirectSupport = () => {
        setShowDonation(true);
        if (ngo) {
            try {
                const docRef = doc(db, 'ngos', ngo.id.toString());
                updateDoc(docRef, {
                    donationsCount: increment(1)
                });
            } catch (error) {
                console.error("Failed tracking donation interaction", error);
            }
        }
    };

    if (!ngo) return (
        <div className="min-h-screen flex items-center justify-center text-theme-primary">
            <div className="animate-pulse flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-full border-4 border-orange-500 border-t-transparent animate-spin"></div>
                <p className="font-black tracking-widest uppercase text-xs">Finding Organization...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans pt-32 md:pt-44 pb-20 animate-in fade-in duration-700">
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
                            <div className="min-h-[500px] sm:min-h-0 sm:aspect-[16/7] w-full relative flex flex-col justify-end">
                                <img src={ngo.image} alt={ngo.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-[var(--bg-primary)]/40 backdrop-blur-[2px] transition-colors duration-300" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-[var(--bg-primary)]/80 to-transparent transition-colors duration-300" />

                                <div className="relative p-8 sm:p-12">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-6">
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
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 mt-4">
                                        {ngo.tagline && (
                                            <p className="text-lg sm:text-xl text-amber-400/80 font-semibold italic drop-shadow-md">{ngo.tagline}</p>
                                        )}
                                        {ngo.appLinks && (ngo.appLinks.android || ngo.appLinks.ios) && (
                                            <div className="flex gap-3">
                                                {ngo.appLinks.android && (
                                                    <a href={ngo.appLinks.android} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-xl border border-white/10 transition-all group/app">
                                                        <Smartphone className="w-4 h-4 text-orange-400" />
                                                        <div className="text-left">
                                                            <div className="text-[8px] uppercase font-black text-white/40 leading-none">Get it on</div>
                                                            <div className="text-[10px] font-black text-white leading-none mt-0.5">Google Play</div>
                                                        </div>
                                                    </a>
                                                )}
                                                {ngo.appLinks.ios && (
                                                    <a href={ngo.appLinks.ios} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-xl border border-white/10 transition-all group/app">
                                                        <Smartphone className="w-4 h-4 text-orange-400" />
                                                        <div className="text-left">
                                                            <div className="text-[8px] uppercase font-black text-white/40 leading-none">Download on</div>
                                                            <div className="text-[10px] font-black text-white leading-none mt-0.5">App Store</div>
                                                        </div>
                                                    </a>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <div className="mt-4 flex flex-wrap items-center gap-6">
                                        {ngo.founder && (
                                            <p className="text-theme-primary/60 text-sm font-medium uppercase tracking-widest text-[10px] font-black">Founder: <span className="text-red-400">{ngo.founder}</span></p>
                                        )}
                                        {ngo.volunteerOps && (
                                            <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                                                <Users className="w-3 h-3 text-green-500" />
                                                <span className="text-[9px] font-black text-green-500 uppercase tracking-widest">Active Volunteers Welcome</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Urgent Needs Banner */}
                        {ngo.urgentNeeds && ngo.urgentNeeds.length > 0 && (
                            <section className="mb-12 animate-in slide-in-from-bottom-4 duration-700">
                                <div className="bg-orange-600 rounded-[2.5rem] p-8 sm:p-10 shadow-2xl shadow-orange-900/20 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-white/20 transition-all duration-700"></div>
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                                <AlertTriangle className="w-6 h-6 text-orange-600" />
                                            </div>
                                            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-white">Current Urgent Needs</h2>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {ngo.urgentNeeds.map((need, idx) => (
                                                <div key={idx} className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:bg-white/20 transition-all">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
                                                            need.priority === 'Critical' ? 'bg-red-500 text-white animate-pulse' :
                                                            need.priority === 'High' ? 'bg-orange-500 text-white' :
                                                            'bg-white/20 text-white'
                                                        }`}>
                                                            {need.priority} Priority
                                                        </span>
                                                        <Heart className="w-3 h-3 text-white/40" />
                                                    </div>
                                                    <h3 className="text-base font-black text-white leading-tight mb-1">{need.title}</h3>
                                                    <p className="text-xs text-white/70 font-medium line-clamp-1">{need.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                        <button onClick={() => setShowDonation(true)} className="mt-8 px-8 py-4 rounded-2xl bg-white text-orange-600 font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl">
                                            Help Now
                                        </button>
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* Board of Directors */}
                        {ngo.boardOfDirectors && ngo.boardOfDirectors.length > 0 && (
                            <section className="glass-panel p-8 sm:p-10 rounded-[2.5rem] animate-in slide-in-from-bottom-4 duration-700">
                                <div className="flex items-center gap-3 mb-10">
                                    <span className="w-10 h-1 bg-amber-500 rounded-full"></span>
                                    <h2 className="text-xs font-black uppercase tracking-[0.3em] text-amber-500">Board of Directors</h2>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                                    {ngo.boardOfDirectors.map((member, idx) => (
                                        <div key={idx} className="bg-theme-primary/5 p-6 rounded-2xl border border-theme-primary/5 hover:bg-theme-primary/10 transition-all text-center group/team">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-600 to-orange-600 mx-auto flex items-center justify-center text-sm font-black text-white mb-4 shadow-lg group-hover/team:scale-110 transition-transform">
                                                {member.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <h4 className="text-sm font-black text-theme-primary leading-tight">{member.name}</h4>
                                            <p className="text-[10px] uppercase font-black text-theme-primary/30 tracking-widest mt-1">{member.role}</p>
                                            <div className="flex items-center justify-center gap-2 mt-2">
                                                {member.profileUrl && (
                                                    <a href={member.profileUrl} target="_blank" rel="noopener noreferrer" className="text-theme-primary/20 hover:text-amber-500 transition-colors">
                                                        <Globe className="w-3 h-3" />
                                                    </a>
                                                )}
                                                {member.linkedin && (
                                                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-theme-primary/20 hover:text-blue-500 transition-colors">
                                                        <Linkedin className="w-3 h-3" />
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Team & Leadership */}
                        {( (ngo.teamAndLeadership && ngo.teamAndLeadership.length > 0) || (ngo.leadership && ngo.leadership.length > 0) ) && (
                            <section className="glass-panel p-8 sm:p-10 rounded-[2.5rem] animate-in slide-in-from-bottom-4 duration-700">
                                <div className="flex items-center gap-3 mb-10">
                                    <span className="w-10 h-1 bg-red-500 rounded-full"></span>
                                    <h2 className="text-xs font-black uppercase tracking-[0.3em] text-red-400">Team & Leadership</h2>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                                    {(ngo.teamAndLeadership && ngo.teamAndLeadership.length > 0 ? ngo.teamAndLeadership : ngo.leadership).map((lead, idx) => (
                                        <div key={idx} className="bg-theme-primary/5 p-6 rounded-2xl border border-theme-primary/5 hover:bg-theme-primary/10 transition-all text-center group/team">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-600 to-amber-600 mx-auto flex items-center justify-center text-sm font-black text-white mb-4 shadow-lg group-hover/team:scale-110 transition-transform">
                                                {lead.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <h4 className="text-sm font-black text-theme-primary">{lead.name}</h4>
                                            <p className="text-[10px] uppercase font-black text-theme-primary/30 tracking-widest mt-1">{lead.role}</p>
                                            <div className="flex items-center justify-center gap-2 mt-2">
                                                {lead.profileUrl && (
                                                    <a href={lead.profileUrl} target="_blank" rel="noopener noreferrer" className="text-theme-primary/20 hover:text-red-400 transition-colors">
                                                        <Globe className="w-3 h-3" />
                                                    </a>
                                                )}
                                                {lead.linkedin && (
                                                    <a href={lead.linkedin} target="_blank" rel="noopener noreferrer" className="text-theme-primary/20 hover:text-blue-500 transition-colors">
                                                        <Linkedin className="w-3 h-3" />
                                                    </a>
                                                )}
                                            </div>
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

                        {/* Active Needs Section */}
                        {ngo.needs && ngo.needs.length > 0 && (
                            <section className="glass-panel p-8 sm:p-12 rounded-[2.5rem] bg-orange-500/5 border-orange-500/10 shadow-inner">
                                <div className="flex items-center gap-3 mb-8">
                                    <span className="w-10 h-1 bg-red-500 rounded-full"></span>
                                    <h2 className="text-xs font-black uppercase tracking-[0.3em] text-red-500 font-serif">Current Urgent Needs</h2>
                                </div>
                                <div className="space-y-4">
                                    {ngo.needs.map(need => (
                                        <div key={need.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[var(--bg-primary)] shadow-sm border border-[var(--border-color)]">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-3 h-3 rounded-full shrink-0 ${
                                                    need.urgency === 'High' ? 'bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]' : 
                                                    need.urgency === 'Medium' ? 'bg-amber-500' : 'bg-blue-500'
                                                }`} />
                                                <h4 className="text-lg font-black font-serif">{need.title}</h4>
                                            </div>
                                            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border ${
                                                need.urgency === 'High' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                                                need.urgency === 'Medium' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 
                                                'bg-blue-500/10 text-blue-500 border-blue-500/20'
                                            }`}>
                                                {need.urgency} Urgency
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

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

                        {/* Community Drives */}
                        {ngo.drives && ngo.drives.length > 0 && (
                            <section className="glass-panel p-8 sm:p-10 rounded-[2.5rem]">
                                <div className="flex items-center gap-3 mb-10">
                                    <span className="w-10 h-1 bg-red-400 rounded-full"></span>
                                    <h2 className="text-xs font-black uppercase tracking-[0.3em] text-red-500">Community Drives & Engagement</h2>
                                </div>
                                <div className="grid grid-cols-1 gap-8">
                                    {ngo.drives.map((drive, idx) => (
                                        <div key={idx} className="relative pl-10 border-l border-red-500/10 group/drive">
                                            <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
                                            <div className="flex items-center gap-3 mb-2">
                                                <HeartPulse className="w-4 h-4 text-red-400" />
                                                <h4 className="text-xl font-black text-theme-primary uppercase tracking-tight">{drive.title}</h4>
                                            </div>
                                            <div className="flex items-center gap-2 mb-4 text-[10px] font-black uppercase tracking-widest text-theme-primary/40">
                                                <MapPin className="w-3 h-3" /> {drive.location}
                                            </div>
                                            <p className="text-theme-primary/50 text-sm leading-relaxed">{drive.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Organizational Milestones */}
                        {ngo.milestones && ngo.milestones.length > 0 && (
                            <section className="glass-panel p-8 sm:p-10 rounded-[2.5rem]">
                                <div className="flex items-center gap-3 mb-10">
                                    <span className="w-10 h-1 bg-amber-500 rounded-full"></span>
                                    <h2 className="text-xs font-black uppercase tracking-[0.3em] text-amber-500">Historic Milestones</h2>
                                </div>
                                <div className="space-y-12 relative before:absolute before:inset-0 before:left-[11px] before:w-[2px] before:bg-theme-primary/5">
                                    {ngo.milestones.map((milestone, idx) => (
                                        <div key={idx} className="relative pl-12 group/milestone">
                                            <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-[var(--bg-primary)] border-4 border-amber-500/50 flex items-center justify-center transition-colors group-hover/milestone:border-amber-400">
                                                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                                            </div>
                                            <div>
                                                <div className="text-[10px] font-black text-amber-500/70 border border-amber-500/20 px-2 py-1 rounded-md uppercase tracking-wider w-fit mb-3">
                                                    {milestone.year}
                                                </div>
                                                <h4 className="text-xl font-bold text-theme-primary mb-2 group-hover/milestone:text-amber-500 transition-colors uppercase tracking-tight">{milestone.title}</h4>
                                                <p className="text-theme-primary/40 text-sm leading-relaxed">{milestone.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Awards & Recognition */}
                        {ngo.awards && ngo.awards.length > 0 && (
                            <section className="glass-panel p-8 sm:p-12 rounded-[2.5rem] bg-amber-500/5 border-amber-500/10">
                                <div className="flex items-center gap-3 mb-8">
                                    <span className="w-10 h-1 bg-amber-500 rounded-full"></span>
                                    <h2 className="text-xs font-black uppercase tracking-[0.3em] text-amber-500">Awards & Recognition</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {ngo.awards.map((award, idx) => (
                                        <div key={idx} className="flex items-center gap-4 p-5 rounded-2xl bg-black/20 border border-white/5 group hover:bg-black/30 transition-all">
                                            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500 group-hover:scale-110 transition-transform">
                                                <Award className="w-5 h-5" />
                                            </div>
                                            <p className="text-sm font-bold text-theme-primary/80">{award}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Testimonials */}
                        {ngo.testimonials && ngo.testimonials.length > 0 && (
                            <section className="space-y-6">
                                <div className="flex items-center gap-3 mb-8">
                                    <span className="w-10 h-1 bg-blue-500 rounded-full"></span>
                                    <h2 className="text-xs font-black uppercase tracking-[0.3em] text-blue-400">Beneficiary Testimonials</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                                    {ngo.testimonials.map((t, idx) => (
                                        <div key={idx} className="glass-panel p-8 rounded-[2rem] border-white/5 bg-blue-500/5 relative">
                                            <div className="text-blue-500 mb-4 opacity-50">
                                                <Mail className="w-8 h-8" />
                                            </div>
                                            <p className="text-theme-primary/80 italic mb-6 leading-relaxed">"{t.quote}"</p>
                                            <div className="mt-auto">
                                                <h4 className="font-black text-theme-primary uppercase tracking-tight">{t.name}</h4>
                                                <p className="text-[10px] text-theme-primary/40 font-black uppercase tracking-widest">{t.role}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Sidebar (Right) */}
                    <aside className="lg:col-span-4 space-y-8">

                        {/* Fast Stats Card */}
                        <div className="glass-panel p-8 rounded-[2.5rem] sticky top-32">

                            {/* Action Buttons - Moved to Top */}
                            <div className="space-y-4 mb-10">
                                <button
                                    onClick={handleGiveDirectSupport}
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
                                            <div className="flex items-center gap-2">
                                                <h4 className="text-[10px] uppercase tracking-widest text-theme-primary/40 font-black">Confidence Meter</h4>
                                                <Link to="/trust-score" className="p-1 rounded-full hover:bg-amber-500/10 text-amber-500 transition-colors" title="How is this calculated?">
                                                    <Info className="w-3 h-3" />
                                                </Link>
                                            </div>
                                            <div className={`px-3 py-1 rounded-lg border flex items-center gap-1.5 ${
                                                trustScore.score >= 80 ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' :
                                                trustScore.score >= 50 ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' :
                                                'bg-red-500/10 border-red-500/20 text-red-500'
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
                                                    trustScore.score >= 80 ? 'bg-amber-500' :
                                                    trustScore.score >= 50 ? 'bg-amber-500' :
                                                    'bg-red-500'
                                                }`}
                                                style={{ width: `${trustScore.score}%` }}
                                            />
                                        </div>
                                    </div>
                                    
                                    {/* Tooltip / Popup on Hover/Focus */}
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-[450px] mt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0 drop-shadow-2xl pointer-events-none group-hover:pointer-events-auto">
                                        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 relative max-h-[500px] overflow-y-auto scrollbar-hide">
                                            {/* Up arrow */}
                                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-zinc-900 border-l border-t border-zinc-800 rotate-45"></div>
                                            
                                            <div className="relative z-10">
                                                <h5 className="text-[10px] uppercase tracking-widest text-zinc-500 font-black mb-4">Score Breakdown</h5>
                                                <div className="grid grid-cols-2 gap-x-8 gap-y-1">
                                                    {trustScore.breakdown.map((item, idx) => (
                                                        <div key={idx} className="flex items-center justify-between py-1.5 border-b border-zinc-800/30 last:border-0 hover:bg-white/5 px-2 rounded-lg transition-colors">
                                                            <span className="text-[10px] text-zinc-400 font-medium truncate pr-2" title={item.label}>{item.label}</span>
                                                            <span className="text-[10px] font-black text-amber-500 shrink-0">+{item.points}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Board of Directors Mini list */}
                            {(ngo.boardOfDirectors?.length > 0 || ngo.board?.length > 0) && (
                                <div className="mb-8">
                                    <h4 className="text-[10px] uppercase font-black text-theme-primary/30 tracking-[0.2em] mb-4">Board of Directors</h4>
                                    <div className="space-y-4">
                                        {(ngo.boardOfDirectors?.length > 0 ? ngo.boardOfDirectors : ngo.board).slice(0, 3).map((lead, idx) => (
                                            <div key={idx} className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-theme-primary/5 border border-theme-primary/10 flex items-center justify-center text-[10px] text-theme-primary/40 font-black">
                                                    {lead.name.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="text-sm font-bold text-theme-primary leading-none">{lead.name}</div>
                                                    <div className="text-[9px] uppercase font-black text-theme-primary/30 tracking-widest mt-1">{lead.role}</div>
                                                </div>
                                                {lead.linkedin && (
                                                    <a href={lead.linkedin} target="_blank" rel="noopener noreferrer" className="text-theme-primary/20 hover:text-blue-500 transition-colors">
                                                        <Linkedin className="w-3 h-3" />
                                                    </a>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4 mb-12">
                                {ngo.impactStats?.map((stat, idx) => (
                                    <div
                                        key={idx}
                                        className="bg-theme-primary/5 rounded-2xl p-4 border border-theme-primary/5 hover:bg-theme-primary/10 hover:border-orange-500/30 transition-all group/stat block"
                                    >
                                        <div className="text-xl font-black text-theme-primary group-hover/stat:text-orange-400 transition-colors">{stat.value}</div>
                                        <div className="text-[10px] uppercase text-theme-primary/30 font-black tracking-tight leading-none mt-1 flex items-center gap-1">
                                            {stat.label}
                                        </div>
                                    </div>
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
                                {/* Dynamic Legal Badges from Application */}
                                {ngo.legalDetails?.section80G && (
                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-500 shadow-sm">
                                        <ShieldCheck className="w-4 h-4" />
                                        <span className="text-xs font-black uppercase tracking-widest">80G Tax Exempt</span>
                                    </div>
                                )}
                                {ngo.legalDetails?.csr1 && (
                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 shadow-sm">
                                        <Award className="w-4 h-4" />
                                        <span className="text-xs font-black uppercase tracking-widest">CSR-1 Registered</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </aside>
                </div>
            </div>

            {/* Donation Modal overlay (re-using the same aesthetic) */}
            {showDonation && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-black/80" onClick={() => setShowDonation(false)} />
                    <div className="relative w-full max-w-2xl glass-panel p-10 rounded-[3rem] animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto overscroll-contain custom-scrollbar">
                        <DonationForm 
                            ngoName={ngo.name} 
                            upiId={ngo.financials?.upiId}
                            onBack={() => setShowDonation(false)} 
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default NGODetails;
