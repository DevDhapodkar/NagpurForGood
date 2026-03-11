import React, { useState } from 'react';
import { 
    Users, BarChart3, ShieldCheck, Settings, LogOut, 
    Search, Plus, MoreVertical, Edit2, Trash2, Globe
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { ngoData } from '../data/ngoData';
import { calculateTrustScore } from '../utils/trustScore';

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // Calculate mock stats
    const totalNGOs = ngoData.length;
    const verifiedNGOs = ngoData.filter(ngo => ngo.verified).length;
    const totalPrograms = ngoData.reduce((acc, ngo) => acc + (ngo.programs?.length || 0), 0);

    // Filter NGOs
    const filteredNGOs = ngoData.filter(ngo => 
        ngo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ngo.categories.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="min-h-screen bg-[#09090b] text-[var(--text-primary)] font-sans pt-24 pb-20 animate-in fade-in duration-700">
            <div className="max-w-[90rem] mx-auto px-6 h-full flex flex-col md:flex-row gap-8">
                
                {/* Sidebar Navigation */}
                <aside className="w-full md:w-64 shrink-0 space-y-6">
                    <div className="glass-panel p-6 rounded-3xl flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center font-black text-white uppercase text-lg shadow-lg">
                            {user?.name?.charAt(0) || 'A'}
                        </div>
                        <div>
                            <div className="text-sm font-black line-clamp-1">{user?.name}</div>
                            <div className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold">{user?.role || 'Admin'}</div>
                        </div>
                    </div>

                    <nav className="glass-panel p-4 rounded-3xl space-y-2">
                        <div className="px-3 py-2 text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-black mb-2">Platform Control</div>
                        
                        <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-orange-500/10 text-orange-400 border border-orange-500/20 font-bold transition-all">
                            <BarChart3 className="w-5 h-5" />
                            <span className="text-sm">Overview</span>
                        </a>
                        
                        <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-2xl text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] transition-all group">
                            <Users className="w-5 h-5 group-hover:text-amber-400 transition-colors" />
                            <span className="text-sm font-medium">Manage NGOs</span>
                        </a>

                        <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-2xl text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] transition-all group">
                            <ShieldCheck className="w-5 h-5 group-hover:text-emerald-400 transition-colors" />
                            <span className="text-sm font-medium">Verifications</span>
                        </a>

                        <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-2xl text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] transition-all group">
                            <Settings className="w-5 h-5 group-hover:text-blue-400 transition-colors" />
                            <span className="text-sm font-medium">Settings</span>
                        </a>
                    </nav>

                    <button 
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl glass-panel text-[var(--text-secondary)] hover:text-red-400 hover:border-red-500/30 transition-all group font-bold text-sm tracking-wide"
                    >
                        <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Sign Out
                    </button>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 space-y-8">
                    
                    {/* Header line */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[var(--border-color)] pb-6">
                        <div>
                            <h1 className="text-3xl font-black font-serif tracking-tight">Dashboard Overview</h1>
                            <p className="text-[var(--text-secondary)] text-sm mt-1">Manage and monitor verified organizations across Nagpur.</p>
                        </div>
                        
                        <button className="py-3 px-6 rounded-2xl font-black text-white text-xs uppercase tracking-widest bg-emerald-600 hover:bg-emerald-500 shadow-[0_5px_15px_rgba(16,185,129,0.2)] hover:shadow-[0_10px_25px_rgba(16,185,129,0.4)] transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center gap-2">
                            <Plus className="w-4 h-4" /> Add NGO Profile
                        </button>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="glass-panel p-6 rounded-3xl relative overflow-hidden group">
                            <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-500/10 rounded-full blur-xl group-hover:bg-blue-500/20 transition-colors"></div>
                            <div className="relative z-10">
                                <div className="text-[10px] uppercase font-black tracking-widest text-[var(--text-muted)] mb-2">Total Organizations</div>
                                <div className="text-4xl font-black font-serif text-[var(--text-primary)] tracking-tighter">{totalNGOs}</div>
                            </div>
                        </div>

                        <div className="glass-panel p-6 rounded-3xl relative overflow-hidden group">
                            <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl group-hover:bg-emerald-500/20 transition-colors"></div>
                            <div className="relative z-10">
                                <div className="text-[10px] uppercase font-black tracking-widest text-[var(--text-muted)] mb-2">Verified Direct Access</div>
                                <div className="text-4xl font-black font-serif text-[var(--text-primary)] tracking-tighter">{verifiedNGOs}</div>
                            </div>
                        </div>

                        <div className="glass-panel p-6 rounded-3xl relative overflow-hidden group">
                            <div className="absolute -right-6 -top-6 w-24 h-24 bg-orange-500/10 rounded-full blur-xl group-hover:bg-orange-500/20 transition-colors"></div>
                            <div className="relative z-10">
                                <div className="text-[10px] uppercase font-black tracking-widest text-[var(--text-muted)] mb-2">Active Impact Programs</div>
                                <div className="text-4xl font-black font-serif text-[var(--text-primary)] tracking-tighter">{totalPrograms}</div>
                            </div>
                        </div>
                    </div>

                    {/* Data Table Area */}
                    <div className="glass-panel rounded-[2.5rem] overflow-hidden flex flex-col h-[600px]">
                        {/* Table Header / Toolbar */}
                        <div className="p-6 border-b border-[var(--border-color)] flex flex-col sm:flex-row items-center gap-4 justify-between bg-[var(--bg-primary)]/50">
                            <h2 className="text-lg font-black tracking-tight">Registered Entities Data</h2>
                            
                            <div className="relative w-full sm:w-64 container group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--text-muted)] group-focus-within:text-blue-400 transition-colors">
                                    <Search className="w-4 h-4" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search by name or category..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] rounded-full pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-blue-500/50 transition-all"
                                />
                            </div>
                        </div>

                        {/* List */}
                        <div className="flex-1 overflow-y-auto p-2">
                            {filteredNGOs.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-[var(--text-muted)] space-y-4">
                                    <Search className="w-12 h-12 opacity-20" />
                                    <p className="text-sm font-medium">No organizations found matching "{searchQuery}"</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {filteredNGOs.map((ngo) => {
                                        const { score, level } = calculateTrustScore(ngo);
                                        return (
                                            <div key={ngo.id} className="group flex flex-col lg:flex-row lg:items-center gap-4 p-4 rounded-2xl hover:bg-[var(--bg-secondary)] transition-all border border-transparent hover:border-[var(--border-color)]">
                                                
                                                {/* Image & Name */}
                                                <div className="flex items-center gap-4 flex-1 min-w-[300px]">
                                                    <div className="w-12 h-12 rounded-xl bg-[var(--border-color)] overflow-hidden shrink-0">
                                                        <img src={ngo.image} alt={ngo.name} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div>
                                                        <Link to={`/ngo/${ngo.id}`} target="_blank" className="font-bold text-[var(--text-primary)] hover:text-blue-400 transition-colors block line-clamp-1">{ngo.name}</Link>
                                                        <div className="text-[10px] uppercase font-black tracking-widest text-[var(--text-muted)] mt-1 flex gap-2 truncate">
                                                            {ngo.categories.slice(0, 2).join(' • ')}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Trust Score */}
                                                <div className="hidden md:flex w-32 shrink-0">
                                                    <div className="flex flex-col">
                                                        <div className={`text-xs font-black flex items-center gap-1 ${
                                                            score >= 80 ? 'text-emerald-400' :
                                                            score >= 50 ? 'text-amber-400' : 'text-blue-400'
                                                        }`}>
                                                            <ShieldCheck className="w-3 h-3" />
                                                            {score}%
                                                        </div>
                                                        <span className="text-[9px] uppercase tracking-widest text-[var(--text-muted)] font-black mt-0.5">{level}</span>
                                                    </div>
                                                </div>

                                                {/* Contact/Website */}
                                                <div className="hidden lg:flex flex-col w-48 shrink-0 text-[var(--text-secondary)]">
                                                    <div className="text-xs truncate">{ngo.contact}</div>
                                                    {ngo.website && (
                                                        <a href={ngo.website} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-400 hover:underline flex items-center gap-1 mt-1 truncate">
                                                            <Globe className="w-3 h-3 shrink-0" />
                                                            {ngo.website.replace(/^https?:\/\/(www\.)?/, '')}
                                                        </a>
                                                    )}
                                                </div>

                                                {/* Actions */}
                                                <div className="flex items-center justify-end gap-2 shrink-0 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                                                    <button className="p-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-blue-400 hover:border-blue-500/30 transition-all" title="Edit Profile">
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button className="p-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-red-400 hover:border-red-500/30 transition-all" title="Delete Profile">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                    <button className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all">
                                                        <MoreVertical className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
