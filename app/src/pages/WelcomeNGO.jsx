import React from 'react';
import { Link } from 'react-router-dom';
import { PartyPopper, ChevronRight, UserPlus, LogIn, LayoutDashboard, Heart, ShieldCheck, Zap } from 'lucide-react';

const WelcomeNGO = () => {
    const steps = [
        {
            title: "Create Your Account",
            desc: "Register with the exact email used in your NGO application to link your dashboard automatically.",
            icon: UserPlus,
            color: "text-blue-500",
            bg: "bg-blue-500/10"
        },
        {
            title: "Sign In",
            desc: "Verify your email and log in to access your secure NGO Workspace.",
            icon: LogIn,
            color: "text-orange-500",
            bg: "bg-orange-500/10"
        },
        {
            title: "Manage Dashboard",
            desc: "Update your profile, list urgent needs, and track engagement with donors.",
            icon: LayoutDashboard,
            color: "text-green-500",
            bg: "bg-green-500/10"
        }
    ];

    const features = [
        "Real-time Engagement Tracking",
        "Urgent Needs Management",
        "Verified Profile Badge",
        "Direct Donor Communication",
        "Admin-Verified Profile Edits"
    ];

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans pt-32 pb-20 overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 -z-10" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 -z-10" />

            <div className="max-w-5xl mx-auto px-6">
                {/* Hero Section */}
                <div className="text-center space-y-6 mb-20 animate-in fade-in slide-in-from-top-10 duration-1000">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-xs font-black uppercase tracking-widest mb-4">
                        <PartyPopper className="w-4 h-4" />
                        Welcome to the Community
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black font-serif tracking-tight leading-tight">
                        Congratulations, <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">You're Approved!</span>
                    </h1>
                    <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
                        Your organization is now a verified partner of NagpurForGood. Join our network of high-impact NGOs making a real difference in the city.
                    </p>
                </div>

                {/* Steps Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        return (
                            <div key={index} className="glass-panel p-8 rounded-[2.5rem] relative group hover:border-orange-500/30 transition-all animate-in fade-in slide-in-from-bottom-10 duration-700" style={{ animationDelay: `${index * 150}ms` }}>
                                <div className="absolute -top-4 -right-4 w-12 h-12 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] flex items-center justify-center font-black text-xs text-[var(--text-muted)]">
                                    0{index + 1}
                                </div>
                                <div className={`w-14 h-14 rounded-2xl ${step.bg} ${step.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                    <Icon className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-black mb-3">{step.title}</h3>
                                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{step.desc}</p>
                            </div>
                        );
                    })}
                </div>

                {/* Account Creation Block */}
                <div className="glass-panel p-10 md:p-16 rounded-[3rem] bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-primary)] border border-orange-500/10 mb-20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-10 opacity-5">
                        <ShieldCheck className="w-64 h-64" />
                    </div>
                    
                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-black font-serif mb-6">Ready to get started?</h2>
                            <p className="text-[var(--text-secondary)] mb-8 leading-relaxed">
                                Create your representative account today to start managing your profile, listing recruitment needs, and seeing your impact metrics.
                            </p>
                            <div className="space-y-3 mb-10">
                                {features.map((feature, i) => (
                                    <div key={i} className="flex items-center gap-3 text-sm font-bold text-[var(--text-primary)]">
                                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                                        {feature}
                                    </div>
                                ))}
                            </div>
                            <Link 
                                to="/signup" 
                                className="inline-flex items-center gap-3 py-4 px-10 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-orange-500/20 transition-all transform hover:-translate-y-1"
                            >
                                Create NGO Account
                                <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>
                        
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <Zap className="w-5 h-5 text-yellow-500" />
                                <span className="text-xs font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Quick Tips</span>
                            </div>
                            <ul className="space-y-6">
                                <li className="flex gap-4">
                                    <div className="w-6 h-6 rounded-full bg-orange-500/20 text-orange-500 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">!</div>
                                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                                        <strong className="text-[var(--text-primary)]">Consistency is Key:</strong> Use the same email address as your application to skip manual verification.
                                    </p>
                                </li>
                                <li className="flex gap-4">
                                    <div className="w-6 h-6 rounded-full bg-orange-500/20 text-orange-500 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">!</div>
                                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                                        <strong className="text-[var(--text-primary)]">Public Presence:</strong> Your profile is already live! Login to add "Currently Needed" items which shown up instantly.
                                    </p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Support Footer */}
                <div className="text-center">
                    <p className="text-sm text-[var(--text-secondary)]">
                        Need help setting up? Contact us at <a href="mailto:support@nagpurforgood.org" className="text-orange-500 font-bold">support@nagpurforgood.org</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default WelcomeNGO;
