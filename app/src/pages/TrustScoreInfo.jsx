import React from 'react';
import { 
    ShieldCheck, Globe, Lock, User, Smartphone, 
    Instagram, Award, MessageSquare, ClipboardCheck,
    CheckCircle2, ArrowLeft, ExternalLink, Info,
    Milestone, HeartPulse, Building2, Phone, Mail, BadgeCheck,
    FileText
} from 'lucide-react';
import { Link } from 'react-router-dom';

const TrustScoreInfo = () => {
    const categories = [
        {
            title: "Digital Presence",
            points: 13,
            icon: Globe,
            description: "Verification of official website, email, and visual transparency.",
            items: ["Official Website (5 pts)", "Verified Email (4 pts)", "Office Photos (2 pts)", "Registered Address (2 pts)"]
        },
        {
            title: "Legal & Compliance",
            points: 25,
            icon: Lock,
            description: "The gold standard of trust—official registrations and tax exemptions.",
            items: ["CSR-1 Registration (8 pts)", "80G Tax Exemption (8 pts)", "12A Registration (5 pts)", "Registration Cert & PAN (4 pts)"]
        },
        {
            title: "Leadership Transparency",
            points: 15,
            icon: User,
            description: "Who's behind the impact? Verifying the organization's structure and leadership.",
            items: ["Organizational Chart (5 pts)", "Director LinkedIn Verification (10 pts)"]
        },
        {
            title: "Technology & Reach",
            points: 18,
            icon: Smartphone,
            description: "Modern NGOs use modern tools. Points for mobile apps and social ecosystem.",
            items: ["Mobile Apps (10 pts)", "Instagram/Facebook/YT (8 pts)"]
        },
        {
            title: "Social Proof & Impact",
            points: 30,
            icon: Award,
            description: "Real-world results verified through data, awards, and community feedback.",
            items: ["Program Details (10 pts)", "Awards & recognition (5 pts)", "Beneficiary Testimonials (5 pts)", "Volunteer Opportunities (5 pts)", "Darpan & NITI Aayog (5 pts)"]
        },
        {
            title: "Admin PR & Experience",
            points: 20,
            icon: ShieldCheck,
            description: "Physical verification and interaction by the NagpurForGood PR Team.",
            items: ["Field Visit Done (10 pts)", "Admin Experience Rating (Up to 10 pts)"]
        },
        {
            title: "Financials",
            points: 4,
            icon: FileText,
            description: "Ease of giving and transparency in donation channels.",
            items: ["Verified UPI ID (4 pts)"]
        }
    ];

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] p-6 lg:p-12 pb-24">
            <div className="max-w-6xl mx-auto space-y-16 mt-20">
                
                {/* Back Button */}
                <Link to="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-amber-500 transition-colors group">
                    <div className="p-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] group-hover:bg-amber-500/10 group-hover:border-amber-500/30">
                        <ArrowLeft className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest">Back to Directory</span>
                </Link>

                {/* Hero Section */}
                <div className="relative overflow-hidden rounded-[3rem] p-12 lg:p-20 bg-gradient-to-br from-amber-500 to-orange-600 shadow-2xl shadow-amber-900/20">
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 rounded-full -mr-40 -mt-40 blur-3xl animate-pulse" />
                    <div className="relative z-10 text-white max-w-2xl space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest">
                            <ShieldCheck className="w-4 h-4" /> The Confidence Meter
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-black font-serif leading-tight">Confidence <br/>Built on Proof.</h1>
                        <p className="text-lg text-white/80 font-medium leading-relaxed">
                            NagpurForGood's unique Confidence Meter isn't just a score—it's a multi-layered verification system designed to ensure your donations reach the most transparent and effective organizations in Nagpur.
                        </p>
                    </div>
                </div>

                {/* Score Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { label: "Total Points Possible", val: "150+", desc: "Competitive scoring system", icon: Milestone },
                        { label: "Highly Trusted Tier", val: "80%", desc: "The Gold Standard", icon: BadgeCheck },
                        { label: "Verification Layers", val: "9+", desc: "From Tech to Field Visits", icon: CheckCircle2 }
                    ].map((stat, i) => (
                        <div key={i} className="p-8 rounded-[2rem] bg-[var(--bg-secondary)] border border-[var(--border-color)] group hover:border-amber-500/30 transition-all">
                            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 mb-6 group-hover:scale-110 transition-transform">
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <div className="text-3xl font-black mb-1">{stat.val}</div>
                            <div className="text-[10px] uppercase font-black text-zinc-500 tracking-widest mb-2">{stat.label}</div>
                            <p className="text-xs text-[var(--text-muted)]">{stat.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Detailed Breakdown */}
                <div className="space-y-12">
                    <div className="text-center space-y-4">
                        <h2 className="text-3xl font-black">How We Audit NGOs</h2>
                        <p className="text-zinc-500 text-sm max-w-xl mx-auto font-medium">
                            Our proprietary algorithm weights transparency, documentation, and external proof to calculate a real-time trust level.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {categories.map((cat, i) => (
                            <div key={i} className="flex flex-col h-full rounded-[2.5rem] bg-[var(--bg-secondary)] border border-[var(--border-color)] overflow-hidden group hover:-translate-y-2 transition-all duration-500 shadow-xl shadow-black/5 hover:shadow-amber-500/5 hover:border-amber-500/20">
                                <div className="p-8 space-y-6 flex-1">
                                    <div className="flex items-start justify-between">
                                        <div className="p-4 rounded-[1.5rem] bg-amber-500/10 text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-all duration-500">
                                            <cat.icon className="w-6 h-6" />
                                        </div>
                                        <div className="text-xl font-black text-zinc-300">+{cat.points} <span className="text-[10px] uppercase tracking-tighter opacity-50">pts</span></div>
                                    </div>
                                    <div className="space-y-3">
                                        <h3 className="text-xl font-black">{cat.title}</h3>
                                        <p className="text-xs text-[var(--text-muted)] leading-relaxed font-medium">{cat.description}</p>
                                    </div>
                                    <div className="space-y-3 pt-4">
                                        {cat.items.map((item, j) => (
                                            <div key={j} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] group-hover:text-zinc-400">
                                                <div className="w-1.5 h-1.5 rounded-full bg-amber-500/40" />
                                                {item}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Final Verification Section */}
                <div className="p-12 rounded-[3rem] bg-zinc-900 border border-zinc-800 flex flex-col lg:flex-row items-center gap-12 text-center lg:text-left">
                    <div className="w-24 h-24 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500 animate-pulse shrink-0">
                        <Info className="w-10 h-10" />
                    </div>
                    <div className="space-y-4 flex-1">
                        <h3 className="text-2xl font-black text-white">Continuous Monitoring</h3>
                        <p className="text-sm text-zinc-400 font-medium leading-relaxed">
                            Our Confidence Meter is dynamic. If an NGO's registration expires or social activities stop, the meter updates in real-time. This isn't a one-time badge; it's an ongoing promise of authenticity.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 shrink-0">
                        <Link to="/directory" className="px-10 py-5 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-xs hover:bg-amber-500 hover:text-white transition-all transform active:scale-95 shadow-2xl text-center">
                            Explore Directory
                        </Link>
                        <Link to="/apply" className="px-10 py-5 rounded-2xl bg-amber-600 text-white font-black uppercase tracking-widest text-xs hover:bg-amber-500 transition-all transform active:scale-95 shadow-2xl text-center">
                            Register Your NGO
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default TrustScoreInfo;
