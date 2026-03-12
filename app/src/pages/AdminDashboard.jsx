import React, { useState, useEffect, useCallback } from 'react';
import { 
    Users, BarChart3, ShieldCheck, Settings, LogOut, 
    Search, Plus, Edit2, Trash2, Globe, CheckCircle2,
    Heart, Package, Phone, User, Clock, CheckCheck, XCircle, RefreshCw,
    Building2, ClipboardList, Shield, MapPin, Award, Instagram, Facebook,
    Youtube, Mail, X, ExternalLink, BadgeCheck, FileText, Star
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNGOs } from '../context/NGOContext';
import { useToast } from '../context/ToastContext';
import { useNavigate, Link } from 'react-router-dom';
import { calculateTrustScore } from '../utils/trustScore';
import NGOFormModal from '../components/NGOFormModal';
import { collection, getDocs, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../utils/firebase';

const STATUS_CONFIG = {
    pending:   { label: 'Pending',   color: 'text-amber-500',  bg: 'bg-amber-500/10',  border: 'border-amber-500/30',  icon: Clock },
    contacted: { label: 'Contacted', color: 'text-blue-400',   bg: 'bg-blue-500/10',   border: 'border-blue-500/30',   icon: Phone },
    completed: { label: 'Completed', color: 'text-green-400',  bg: 'bg-green-500/10',  border: 'border-green-500/30',  icon: CheckCheck },
    cancelled: { label: 'Cancelled', color: 'text-red-400',    bg: 'bg-red-500/10',    border: 'border-red-500/30',    icon: XCircle },
};

const TYPE_LABELS = {
    clothes:   'Clothes & Apparel',
    food:      'Food & Groceries',
    education: 'Education / Stationery',
    medical:   'Medical Supplies',
    money:     'Financial Aid',
    other:     'Other Essentials',
};

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const { ngoList, addNGO, updateNGO, deleteNGO, verifyNGO } = useNGOs();
    const { showToast } = useToast();
    const navigate = useNavigate();
    
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('overview');
    
    // Form Modal State
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingNGO, setEditingNGO] = useState(null);

    // Donations State
    const [donations, setDonations] = useState([]);
    const [donationsLoading, setDonationsLoading] = useState(false);
    const [donationSearch, setDonationSearch] = useState('');
    const [donationFilter, setDonationFilter] = useState('all');
    const [updatingDonation, setUpdatingDonation] = useState(null);

    // Applications (NGO registration submissions) State
    const [applications, setApplications] = useState([]);
    const [appsLoading, setAppsLoading] = useState(false);
    const [appSearch, setAppSearch] = useState('');
    const [selectedApp, setSelectedApp] = useState(null);
    const [isAppModalOpen, setIsAppModalOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // Fetch donations from Firestore
    const fetchDonations = useCallback(async () => {
        setDonationsLoading(true);
        try {
            const q = query(collection(db, 'donations'), orderBy('createdAt', 'desc'));
            const snapshot = await getDocs(q);
            const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
            setDonations(data);
        } catch (err) {
            console.error('Failed to fetch donations:', err);
            showToast('Could not load donations from Firestore.', 'error');
        } finally {
            setDonationsLoading(false);
        }
    }, [showToast]);

    useEffect(() => {
        if (activeTab === 'donations') fetchDonations();
        if (activeTab === 'applications') fetchApplications();
    }, [activeTab, fetchDonations]);

    const handleStatusChange = async (donationId, newStatus) => {
        setUpdatingDonation(donationId);
        try {
            const donationRef = doc(db, 'donations', donationId);
            await updateDoc(donationRef, { status: newStatus });
            setDonations(prev => prev.map(d => d.id === donationId ? { ...d, status: newStatus } : d));
            showToast(`Donation marked as ${newStatus}.`, 'success');
        } catch (err) {
            showToast('Failed to update donation status.', 'error');
        } finally {
            setUpdatingDonation(null);
        }
    };

    // Fetch NGO registration applications from Firestore
    const fetchApplications = useCallback(async () => {
        setAppsLoading(true);
        try {
            const q = query(collection(db, 'ngos'), orderBy('submittedAt', 'desc'));
            const snapshot = await getDocs(q);
            const data = snapshot.docs.map(d => ({ firestoreId: d.id, ...d.data() }));
            setApplications(data);
        } catch (err) {
            console.error('Failed to fetch applications:', err);
            showToast('Could not load NGO applications.', 'error');
        } finally {
            setAppsLoading(false);
        }
    }, [showToast]);

    const handleOpenAppModal = (app) => {
        setSelectedApp(app);
        setIsAppModalOpen(true);
    };

    const handleCloseAppModal = () => {
        setIsAppModalOpen(false);
        setSelectedApp(null);
    };

    const handleApproveApplication = async (firestoreId) => {
        try {
            await updateDoc(doc(db, 'ngos', firestoreId), { verified: true });
            setApplications(prev => prev.map(a => a.firestoreId === firestoreId ? { ...a, verified: true } : a));
            showToast('Organization approved and published to the directory!', 'success');
        } catch (err) {
            showToast('Failed to approve application.', 'error');
        }
    };

    const handleRejectApplication = async (firestoreId) => {
        if (!window.confirm('Are you sure you want to reject and delete this application?')) return;
        try {
            const { deleteDoc } = await import('firebase/firestore');
            await deleteDoc(doc(db, 'ngos', firestoreId));
            setApplications(prev => prev.filter(a => a.firestoreId !== firestoreId));
            showToast('Application rejected and removed.', 'success');
        } catch (err) {
            showToast('Failed to reject application.', 'error');
        }
    };

    // Calculate dynamic stats
    const totalNGOs = ngoList.length;
    const verifiedNGOs = ngoList.filter(ngo => ngo.verified).length;
    const pendingNGOs = totalNGOs - verifiedNGOs;
    const totalPrograms = ngoList.reduce((acc, ngo) => acc + (ngo.programs?.length || 0), 0);

    // Filter NGOs based on tab and search
    let displayedNGOs = activeTab === 'verifications' 
        ? ngoList.filter(ngo => !ngo.verified)
        : ngoList;

    displayedNGOs = displayedNGOs.filter(ngo => 
        ngo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ngo.categories.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // Filter donations
    const filteredDonations = donations.filter(d => {
        const matchesSearch = 
            d.name.toLowerCase().includes(donationSearch.toLowerCase()) ||
            d.ngoName.toLowerCase().includes(donationSearch.toLowerCase()) ||
            d.contact.toLowerCase().includes(donationSearch.toLowerCase());
        const matchesFilter = donationFilter === 'all' || d.status === donationFilter;
        return matchesSearch && matchesFilter;
    });

    const pendingDonationsCount = donations.filter(d => d.status === 'pending').length;

    // Handlers
    const handleAddClick = () => { setEditingNGO(null); setIsFormOpen(true); };
    const handleEditClick = (ngo) => { setEditingNGO(ngo); setIsFormOpen(true); };

    const handleDeleteClick = (id) => {
        if(window.confirm("Are you sure you want to delete this organization profile?")) {
            deleteNGO(id);
            showToast("Organization deleted successfully.", "success");
        }
    };

    const handleVerifyClick = (id) => {
        verifyNGO(id);
        showToast("Organization has been verified and approved.", "success");
    };

    const handleModalSubmit = (formData) => {
        if (editingNGO) {
            updateNGO(editingNGO.id, formData);
            showToast("Profile updated successfully.", "success");
        } else {
            addNGO(formData);
            showToast("New organization added. Awaiting verification.", "success");
        }
    };
    const pendingApplicationsCount = applications.filter(a => !a.verified).length;

    const sidebarItems = [
        { id: 'overview',      icon: BarChart3,     label: 'Overview' },
        { id: 'manage',        icon: Users,          label: 'Manage NGOs' },
        { id: 'verifications', icon: ShieldCheck,    label: 'Verifications', badge: pendingNGOs },
        { id: 'applications',  icon: ClipboardList,  label: 'Applications',  badge: pendingApplicationsCount },
        { id: 'donations',     icon: Heart,          label: 'Donations',     badge: pendingDonationsCount },
        { id: 'settings',      icon: Settings,       label: 'Settings' },
    ];

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans pt-32 pb-20 animate-in fade-in duration-700">
            <div className="max-w-[90rem] mx-auto px-6 h-full flex flex-col md:flex-row gap-8">
                
                {/* Sidebar Navigation */}
                <aside className="w-full md:w-64 shrink-0 space-y-6">
                    <div className="glass-panel p-6 rounded-3xl flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center font-black text-white uppercase text-lg shadow-lg">
                            {user?.name?.charAt(0) || user?.displayName?.charAt(0) || 'A'}
                        </div>
                        <div>
                            <div className="text-sm font-black line-clamp-1">{user?.name || user?.displayName}</div>
                            <div className="text-[10px] uppercase tracking-widest text-amber-500 font-bold">{user?.role || 'Admin'}</div>
                        </div>
                    </div>

                    <nav className="glass-panel p-4 rounded-3xl space-y-2">
                        <div className="px-3 py-2 text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-black mb-2">Platform Control</div>
                        
                        {sidebarItems.map(item => {
                            const Icon = item.icon;
                            const isActive = activeTab === item.id;
                            return (
                                <button 
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all ${
                                        isActive 
                                            ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20 font-bold' 
                                            : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] font-medium group'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon className="w-5 h-5" />
                                        <span className="text-sm">{item.label}</span>
                                    </div>
                                    {item.badge > 0 && (
                                        <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">{item.badge}</span>
                                    )}
                                </button>
                            );
                        })}
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
                            <h1 className="text-3xl font-black font-serif tracking-tight">
                                {activeTab === 'verifications' ? 'Pending Verifications' 
                                 : activeTab === 'donations' ? 'Donation Requests'
                                 : 'Dashboard Overview'}
                            </h1>
                            <p className="text-[var(--text-secondary)] text-sm mt-1">
                                {activeTab === 'donations' 
                                    ? 'View and manage donation requests submitted through the platform.'
                                    : 'Manage and monitor verified organizations across Nagpur.'}
                            </p>
                        </div>
                        
                        {activeTab !== 'donations' && (
                            <button 
                                onClick={handleAddClick}
                                className="py-3 px-6 rounded-2xl font-black text-white text-xs uppercase tracking-widest bg-orange-600 hover:bg-orange-500 shadow-[0_5px_15px_rgba(234,88,12,0.2)] hover:shadow-[0_10px_25px_rgba(234,88,12,0.4)] transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" /> Add Profile
                            </button>
                        )}
                        {activeTab === 'donations' && (
                            <button 
                                onClick={fetchDonations}
                                disabled={donationsLoading}
                                className="py-3 px-6 rounded-2xl font-black text-white text-xs uppercase tracking-widest bg-orange-600 hover:bg-orange-500 shadow-[0_5px_15px_rgba(234,88,12,0.2)] transition-all flex items-center gap-2 disabled:opacity-50"
                            >
                                <RefreshCw className={`w-4 h-4 ${donationsLoading ? 'animate-spin' : ''}`} /> Refresh
                            </button>
                        )}
                        {activeTab === 'applications' && (
                            <button 
                                onClick={fetchApplications}
                                disabled={appsLoading}
                                className="py-3 px-6 rounded-2xl font-black text-white text-xs uppercase tracking-widest bg-orange-600 hover:bg-orange-500 shadow-[0_5px_15px_rgba(234,88,12,0.2)] transition-all flex items-center gap-2 disabled:opacity-50"
                            >
                                <RefreshCw className={`w-4 h-4 ${appsLoading ? 'animate-spin' : ''}`} /> Refresh
                            </button>
                        )}
                    </div>

                    {/* Stats Grid */}
                    {activeTab !== 'verifications' && activeTab !== 'donations' && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4 duration-500">
                            <div className="glass-panel p-6 rounded-3xl relative overflow-hidden group">
                                <div className="absolute -right-6 -top-6 w-24 h-24 bg-red-500/10 rounded-full blur-xl group-hover:bg-red-500/20 transition-colors"></div>
                                <div className="relative z-10">
                                    <div className="text-[10px] uppercase font-black tracking-widest text-[var(--text-muted)] mb-2">Total Organizations</div>
                                    <div className="text-4xl font-black font-serif text-[var(--text-primary)] tracking-tighter">{totalNGOs}</div>
                                </div>
                            </div>

                            <div className="glass-panel p-6 rounded-3xl relative overflow-hidden group">
                                <div className="absolute -right-6 -top-6 w-24 h-24 bg-amber-500/10 rounded-full blur-xl group-hover:bg-amber-500/20 transition-colors"></div>
                                <div className="relative z-10">
                                    <div className="text-[10px] uppercase font-black tracking-widest text-[var(--text-muted)] mb-2">Verified Members</div>
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
                    )}

                    {/* ─── DONATIONS TAB ─── */}
                    {activeTab === 'donations' && (
                        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                            {/* Stats */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
                                    const count = donations.filter(d => d.status === key).length;
                                    const Icon = cfg.icon;
                                    return (
                                        <div key={key} className={`glass-panel p-4 rounded-2xl flex items-center gap-4 ${donationFilter === key ? `${cfg.bg} border ${cfg.border}` : ''} cursor-pointer transition-all`} onClick={() => setDonationFilter(donationFilter === key ? 'all' : key)}>
                                            <div className={`p-2.5 rounded-xl ${cfg.bg} border ${cfg.border}`}>
                                                <Icon className={`w-4 h-4 ${cfg.color}`} />
                                            </div>
                                            <div>
                                                <div className="text-2xl font-black font-serif">{count}</div>
                                                <div className="text-[10px] uppercase font-black tracking-widest text-[var(--text-muted)]">{cfg.label}</div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Table Panel */}
                            <div className="glass-panel rounded-[2.5rem] overflow-hidden flex flex-col h-[580px]">
                                {/* Toolbar */}
                                <div className="p-6 border-b border-[var(--border-color)] flex flex-col sm:flex-row items-center gap-4 justify-between bg-[var(--bg-primary)]/50">
                                    <h2 className="text-lg font-black tracking-tight">
                                        {donationFilter === 'all' ? 'All Submissions' : `${STATUS_CONFIG[donationFilter]?.label} Submissions`}
                                        <span className="ml-2 text-sm font-normal text-[var(--text-muted)]">({filteredDonations.length})</span>
                                    </h2>
                                    <div className="flex gap-3 w-full sm:w-auto">
                                        <div className="relative flex-1 sm:w-64 group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--text-muted)] group-focus-within:text-orange-400 transition-colors">
                                                <Search className="w-4 h-4" />
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="Search donations..."
                                                value={donationSearch}
                                                onChange={(e) => setDonationSearch(e.target.value)}
                                                className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] rounded-full pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-orange-500/50 transition-all"
                                            />
                                        </div>
                                        {donationFilter !== 'all' && (
                                            <button onClick={() => setDonationFilter('all')} className="px-4 py-2.5 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all">
                                                Clear
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* List */}
                                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-3">
                                    {donationsLoading ? (
                                        <div className="h-full flex flex-col items-center justify-center text-[var(--text-muted)] gap-4">
                                            <div className="w-8 h-8 rounded-full border-2 border-orange-500/30 border-t-orange-500 animate-spin"></div>
                                            <p className="text-sm">Loading donations...</p>
                                        </div>
                                    ) : filteredDonations.length === 0 ? (
                                        <div className="h-full flex flex-col items-center justify-center text-[var(--text-muted)] space-y-4">
                                            <Heart className="w-12 h-12 opacity-20" />
                                            <p className="text-sm font-medium">No donation submissions found.</p>
                                        </div>
                                    ) : (
                                        filteredDonations.map((donation) => {
                                            const cfg = STATUS_CONFIG[donation.status] || STATUS_CONFIG.pending;
                                            const StatusIcon = cfg.icon;
                                            const isUpdating = updatingDonation === donation.id;
                                            return (
                                                <div key={donation.id} className={`group flex flex-col lg:flex-row lg:items-center gap-4 p-5 rounded-2xl border ${cfg.border} ${cfg.bg} transition-all hover:brightness-110`}>
                                                    
                                                    {/* Donor Info */}
                                                    <div className="flex items-center gap-4 flex-1 min-w-0">
                                                        <div className={`w-10 h-10 rounded-xl ${cfg.bg} border ${cfg.border} flex items-center justify-center shrink-0`}>
                                                            <User className={`w-5 h-5 ${cfg.color}`} />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <div className="font-bold text-[var(--text-primary)] truncate">{donation.name}</div>
                                                            <div className="text-[11px] text-[var(--text-muted)] flex items-center gap-1 mt-0.5">
                                                                <Phone className="w-3 h-3 shrink-0" /> {donation.contact}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* NGO */}
                                                    <div className="hidden md:flex flex-col w-44 shrink-0">
                                                        <div className="text-[10px] uppercase font-black tracking-widest text-[var(--text-muted)] mb-0.5">NGO</div>
                                                        <div className="text-xs font-bold text-[var(--text-primary)] truncate">{donation.ngoName}</div>
                                                    </div>

                                                    {/* Type */}
                                                    <div className="hidden lg:flex flex-col w-40 shrink-0">
                                                        <div className="text-[10px] uppercase font-black tracking-widest text-[var(--text-muted)] mb-0.5">Item Type</div>
                                                        <div className="flex items-center gap-1 text-xs font-bold text-[var(--text-primary)]">
                                                            <Package className="w-3 h-3" />
                                                            {TYPE_LABELS[donation.type] || donation.type}
                                                        </div>
                                                    </div>

                                                    {/* Description */}
                                                    <div className="hidden xl:flex flex-col w-48 shrink-0">
                                                        <div className="text-[10px] uppercase font-black tracking-widest text-[var(--text-muted)] mb-0.5">Details</div>
                                                        <div className="text-xs text-[var(--text-secondary)] line-clamp-2">{donation.description}</div>
                                                    </div>

                                                    {/* Date */}
                                                    <div className="hidden lg:flex flex-col w-24 shrink-0">
                                                        <div className="text-[10px] uppercase font-black tracking-widest text-[var(--text-muted)] mb-0.5">Received</div>
                                                        <div className="text-xs text-[var(--text-secondary)]">
                                                            {new Date(donation.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                                        </div>
                                                    </div>

                                                    {/* Status + Actions */}
                                                    <div className="flex items-center gap-2 shrink-0">
                                                        <span className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border ${cfg.bg} ${cfg.border} ${cfg.color}`}>
                                                            <StatusIcon className="w-3 h-3" /> {cfg.label}
                                                        </span>
                                                        <div className="relative">
                                                            <select
                                                                value={donation.status}
                                                                disabled={isUpdating}
                                                                onChange={(e) => handleStatusChange(donation.id, e.target.value)}
                                                                className="appearance-none bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-secondary)] text-xs rounded-xl px-3 py-2 pr-6 focus:outline-none focus:border-orange-500/50 cursor-pointer disabled:opacity-50 transition-all"
                                                            >
                                                                <option value="pending">Pending</option>
                                                                <option value="contacted">Contacted</option>
                                                                <option value="completed">Completed</option>
                                                                <option value="cancelled">Cancelled</option>
                                                            </select>
                                                            {isUpdating && (
                                                                <div className="absolute inset-0 flex items-center justify-center bg-[var(--bg-primary)]/80 rounded-xl">
                                                                    <div className="w-3 h-3 rounded-full border border-orange-500/30 border-t-orange-500 animate-spin"></div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ─── APPLICATIONS TAB ─── */}
                    {activeTab === 'applications' && (
                        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                            <div className="glass-panel p-6 rounded-3xl bg-amber-500/5 border border-amber-500/20">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500">
                                        <ClipboardList className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-black font-serif">NGO Registration Applications</h2>
                                        <p className="text-[var(--text-secondary)] text-sm mt-0.5">Review submissions from organizations wanting to join NagpurGood.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="glass-panel rounded-[2.5rem] overflow-hidden flex flex-col h-[600px]">
                                <div className="p-6 border-b border-[var(--border-color)] flex flex-col sm:flex-row items-center gap-4 justify-between bg-[var(--bg-primary)]/50">
                                    <h2 className="text-lg font-black tracking-tight">
                                        Recent Submissions
                                        <span className="ml-2 text-sm font-normal text-[var(--text-muted)]">({applications.length})</span>
                                    </h2>
                                    <div className="relative w-full sm:w-64 group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--text-muted)] group-focus-within:text-orange-400 transition-colors">
                                            <Search className="w-4 h-4" />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Search applications..."
                                            value={appSearch}
                                            onChange={(e) => setAppSearch(e.target.value)}
                                            className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] rounded-full pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-orange-500/50 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-4">
                                    {appsLoading ? (
                                        <div className="h-full flex flex-col items-center justify-center text-[var(--text-muted)] gap-4">
                                            <div className="w-8 h-8 rounded-full border-2 border-orange-500/30 border-t-orange-500 animate-spin"></div>
                                            <p className="text-sm font-medium">Fetching submissions...</p>
                                        </div>
                                    ) : applications.length === 0 ? (
                                        <div className="h-full flex flex-col items-center justify-center text-[var(--text-muted)] space-y-4">
                                            <Building2 className="w-12 h-12 opacity-20" />
                                            <p className="text-sm font-medium">No applications found.</p>
                                        </div>
                                    ) : (
                                        applications.filter(app => 
                                            app.name.toLowerCase().includes(appSearch.toLowerCase()) ||
                                            app.email?.toLowerCase().includes(appSearch.toLowerCase()) ||
                                            app.chairperson?.toLowerCase().includes(appSearch.toLowerCase())
                                        ).map((app) => (
                                            <div key={app.firestoreId} className={`p-6 rounded-2xl border transition-all ${app.verified ? 'bg-green-500/5 border-green-500/20' : 'bg-[var(--bg-secondary)] border-[var(--border-color)] hover:border-orange-500/30'}`}>
                                                <div className="flex flex-col xl:flex-row gap-6">
                                                    {/* Branding & Status */}
                                                    <div className="flex items-start gap-4 flex-1">
                                                        <div className="w-14 h-14 rounded-2xl bg-[var(--border-color)] overflow-hidden shrink-0 shadow-inner">
                                                            {app.logo ? (
                                                                <img src={app.logo} alt={app.name} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-sm font-bold text-[var(--text-muted)]">NGO</div>
                                                            )}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <div className="flex items-center gap-3">
                                                                <h3 className="text-lg font-black font-serif truncate">{app.name}</h3>
                                                                {app.verified && (
                                                                    <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest bg-green-500/10 text-green-500 border border-green-500/20 px-2 py-0.5 rounded-full">
                                                                        <CheckCheck className="w-2 h-2" /> Published
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <p className="text-xs text-[var(--text-secondary)] mt-1 line-clamp-1">{app.tagline}</p>
                                                            <div className="flex flex-wrap gap-4 mt-3">
                                                                <div className="flex items-center gap-1.5 text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest">
                                                                    <User className="w-3 h-3" /> {app.chairperson || 'No Lead'}
                                                                </div>
                                                                <div className="flex items-center gap-1.5 text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest">
                                                                    <Mail className="w-3 h-3" /> {app.email}
                                                                </div>
                                                                <div className="flex items-center gap-1.5 text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest text-amber-500">
                                                                    <Clock className="w-3 h-3" /> {app.submittedAt?.toDate?.() ? new Date(app.submittedAt.toDate()).toLocaleDateString() : 'Recent'}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="flex items-center gap-3 shrink-0">
                                                        {!app.verified && (
                                                            <>
                                                                <button 
                                                                    onClick={() => handleApproveApplication(app.firestoreId)}
                                                                    className="px-6 py-2.5 rounded-xl bg-green-600 hover:bg-green-500 text-white font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-green-600/20"
                                                                >
                                                                    Approve
                                                                </button>
                                                                <button 
                                                                    onClick={() => handleRejectApplication(app.firestoreId)}
                                                                    className="px-6 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white font-black text-[10px] uppercase tracking-widest transition-all"
                                                                >
                                                                    Reject
                                                                </button>
                                                            </>
                                                        )}
                                                        <button 
                                                            onClick={() => handleOpenAppModal(app)}
                                                            className="p-2.5 rounded-xl glass-btn text-[var(--text-muted)] hover:text-orange-400" 
                                                            title="View Full Application"
                                                        >
                                                            <ExternalLink className="w-5 h-5" />
                                                        </button>
                                                        <Link to={`/ngo/${app.id}`} className="p-2.5 rounded-xl glass-btn text-[var(--text-muted)] hover:text-orange-400" title="Public Profile Preview">
                                                            <Globe className="w-5 h-5" />
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ─── NGO DATA TABLE (Overview / Manage / Verifications) ─── */}
                    {activeTab !== 'donations' && activeTab !== 'applications' && (
                        <div className="glass-panel rounded-[2.5rem] overflow-hidden flex flex-col h-[600px] animate-in slide-in-from-bottom-8 duration-700">
                            {/* Table Header / Toolbar */}
                            <div className="p-6 border-b border-[var(--border-color)] flex flex-col sm:flex-row items-center gap-4 justify-between bg-[var(--bg-primary)]/50">
                                <h2 className="text-lg font-black tracking-tight">
                                    {activeTab === 'verifications' ? 'Pending Approval Queue' : 'Registered Entities Data'}
                                </h2>
                                
                                <div className="relative w-full sm:w-64 container group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--text-muted)] group-focus-within:text-orange-400 transition-colors">
                                        <Search className="w-4 h-4" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search entries..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] rounded-full pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-orange-500/50 transition-all"
                                    />
                                </div>
                            </div>

                            {/* List */}
                            <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
                                {displayedNGOs.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-[var(--text-muted)] space-y-4">
                                        {activeTab === 'verifications' ? (
                                            <>
                                                <CheckCircle2 className="w-12 h-12 text-amber-500/50" />
                                                <p className="text-sm font-medium">Yay! No pending entries.</p>
                                            </>
                                        ) : (
                                            <>
                                                <Search className="w-12 h-12 opacity-20" />
                                                <p className="text-sm font-medium">No organizations found matching "{searchQuery}"</p>
                                            </>
                                        )}
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {displayedNGOs.map((ngo) => {
                                            const { score, level } = calculateTrustScore(ngo);
                                            return (
                                                <div key={ngo.id} className={`group flex flex-col lg:flex-row lg:items-center gap-4 p-4 rounded-2xl hover:bg-[var(--bg-secondary)] transition-all border ${!ngo.verified ? 'border-amber-500/20 bg-amber-500/5' : 'border-transparent hover:border-[var(--border-color)]'}`}>
                                                    
                                                    {/* Image & Name */}
                                                    <div className="flex items-center gap-4 flex-1 min-w-[300px]">
                                                        <div className="w-12 h-12 rounded-xl bg-[var(--border-color)] overflow-hidden shrink-0">
                                                            <img src={ngo.image} alt={ngo.name} className="w-full h-full object-cover" />
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-2 block max-w-full">
                                                                <Link to={`/ngo/${ngo.id}`} target="_blank" className="font-bold text-[var(--text-primary)] hover:text-orange-400 transition-colors truncate">{ngo.name}</Link>
                                                                {!ngo.verified && (
                                                                    <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest shrink-0">Pending</span>
                                                                )}
                                                            </div>
                                                            <div className="text-[10px] uppercase font-black tracking-widest text-[var(--text-muted)] mt-1 flex gap-2 truncate">
                                                                {(ngo.categories || []).slice(0, 2).join(' • ')}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Trust Score */}
                                                    <div className="hidden md:flex w-32 shrink-0">
                                                        <div className="flex flex-col">
                                                            <div className={`text-xs font-black flex items-center gap-1 ${
                                                                score >= 80 ? 'text-amber-500' :
                                                                score >= 50 ? 'text-orange-500' : 'text-red-500'
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
                                                            <a href={ngo.website} target="_blank" rel="noopener noreferrer" className="text-[10px] text-orange-400 hover:underline flex items-center gap-1 mt-1 truncate">
                                                                <Globe className="w-3 h-3 shrink-0" />
                                                                {ngo.website.replace(/^https?:\/\/(www\.)?/, '')}
                                                            </a>
                                                        )}
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="flex items-center justify-end gap-2 shrink-0 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                                                        {!ngo.verified && (
                                                            <button onClick={() => handleVerifyClick(ngo.id)} className="p-2 mr-2 pr-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-500 hover:bg-amber-500 hover:text-black transition-all flex items-center gap-1 font-bold text-xs">
                                                                <ShieldCheck className="w-4 h-4" /> Approve
                                                            </button>
                                                        )}
                                                        <button onClick={() => handleEditClick(ngo)} className="p-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-orange-400 hover:border-orange-500/30 transition-all" title="Edit Profile">
                                                            <Edit2 className="w-4 h-4" />
                                                        </button>
                                                        <button onClick={() => handleDeleteClick(ngo.id)} className="p-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-red-400 hover:border-red-500/30 transition-all" title="Delete Profile">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                </main>
            </div>

            {/* NGO Registration Review Modal */}
            <ApplicationDetailsModal 
                isOpen={isAppModalOpen}
                onClose={handleCloseAppModal}
                app={selectedApp}
                onApprove={handleApproveApplication}
                onReject={handleRejectApplication}
            />
        </div>
    );
};

// ─── Sub-component: Application Details Modal ────────────────────────────────
const ApplicationDetailsModal = ({ isOpen, onClose, app, onApprove, onReject }) => {
    if (!isOpen || !app) return null;

    const sections = [
        { label: 'Legal & Compliance', icon: Shield, items: [
            ['Reg No', app.legalDetails?.registrationNo],
            ['CSR-1', app.legalDetails?.csr1],
            ['80G No', app.legalDetails?.section80G],
            ['12A No', app.legalDetails?.section12A],
            ['PAN No', app.legalDetails?.panNo],
            ['TAN No', app.legalDetails?.tanNo],
        ]},
        { label: 'Financials & UPI', icon: Heart, items: [
            ['Donation UPI', app.financials?.upiId, 'text-orange-400 font-black'],
            ['Bank', app.financials?.bankName],
            ['Audit Status', app.financials?.auditStatus],
            ['Reports', app.financials?.reportsLink],
        ]},
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-[var(--bg-primary)]/80 backdrop-blur-xl" onClick={onClose} />
            
            <div className="relative w-full max-w-4xl bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[2.5rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Modal Header */}
                <div className="p-8 border-b border-[var(--border-color)] flex items-start justify-between bg-orange-500/5">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-3xl bg-[var(--bg-primary)] p-1 border border-[var(--border-color)] shadow-xl overflow-hidden shrink-0">
                            {app.logo ? <img src={app.logo} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center font-black text-2xl uppercase opacity-20">{app.name?.[0]}</div>}
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h2 className="text-3xl font-black font-serif tracking-tight">{app.name}</h2>
                                {app.verified && <BadgeCheck className="w-6 h-6 text-green-500" />}
                            </div>
                            <p className="text-orange-400 font-bold text-xs uppercase tracking-[0.2em]">{app.tagline || 'New Partner Application'}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-3 rounded-2xl hover:bg-red-500/10 text-[var(--text-muted)] hover:text-red-500 transition-all">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
                    {/* Key Stats Row */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="p-5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)]">
                            <label className="text-[9px] uppercase font-black text-[var(--text-muted)] tracking-widest block mb-2">Founded</label>
                            <div className="text-lg font-black">{app.foundedYear || '—'}</div>
                        </div>
                        <div className="p-5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)]">
                            <label className="text-[9px] uppercase font-black text-[var(--text-muted)] tracking-widest block mb-2">Category</label>
                            <div className="text-xs font-bold leading-tight line-clamp-2">{app.categories?.join(', ') || '—'}</div>
                        </div>
                        <div className="p-5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)]">
                            <label className="text-[9px] uppercase font-black text-[var(--text-muted)] tracking-widest block mb-2">Email</label>
                            <div className="text-xs font-bold truncate">{app.email}</div>
                        </div>
                        <div className="p-5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)]">
                            <label className="text-[9px] uppercase font-black text-[var(--text-muted)] tracking-widest block mb-2">Contact</label>
                            <div className="text-xs font-bold">{app.contact}</div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-3">
                        <h3 className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)] flex items-center gap-2">
                            <FileText className="w-3 h-3" /> About Organisation
                        </h3>
                        <p className="text-[var(--text-secondary)] text-sm leading-relaxed whitespace-pre-line bg-[var(--bg-primary)] p-6 rounded-3xl border border-[var(--border-color)]">
                            {app.longDescription || app.description || 'No detailed description provided.'}
                        </p>
                    </div>

                    {/* Detailed Sections */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {sections.map(section => (
                            <div key={section.label} className="space-y-4">
                                <h3 className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)] flex items-center gap-2">
                                    <section.icon className="w-3 h-3" /> {section.label}
                                </h3>
                                <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-3xl overflow-hidden divide-y divide-[var(--border-color)]">
                                    {section.items.map(([label, val, theme]) => (
                                        <div key={label} className="flex items-center justify-between p-4 text-xs">
                                            <span className="font-black text-[var(--text-muted)] uppercase tracking-tighter">{label}</span>
                                            <span className={`font-bold ${theme || 'text-[var(--text-primary)]'}`}>{val || '—'}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Geographic Reach */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)] flex items-center gap-2">
                            <MapPin className="w-3 h-3" /> Geographic Focus (Nagpur)
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {app.geoReach?.map(area => (
                                <span key={area} className="px-3 py-1.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 text-[10px] font-black uppercase tracking-widest">{area}</span>
                            )) || <span className="text-[var(--text-muted)] text-xs italic">No specific areas defined.</span>}
                        </div>
                    </div>

                    {/* Leadership & Programs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <h3 className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)] flex items-center gap-2">
                                <User className="w-3 h-3" /> Leadership Team
                            </h3>
                            <div className="space-y-3">
                                {app.leadership?.map((l, i) => (
                                    <div key={i} className="p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] flex items-center justify-between">
                                        <div className="font-bold text-sm">{l.name}</div>
                                        <div className="text-[10px] uppercase tracking-widest text-amber-500 font-black">{l.role}</div>
                                    </div>
                                )) || <div className="text-[var(--text-muted)] text-xs italic">No leadership data.</div>}
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)] flex items-center gap-2">
                                <Star className="w-3 h-3" /> Key Initiatives
                            </h3>
                            <div className="space-y-3">
                                {app.programs?.map((p, i) => (
                                    <div key={i} className="p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)]">
                                        <div className="font-bold text-sm mb-1">{p.title}</div>
                                        <div className="text-[10px] text-orange-400 font-black uppercase tracking-widest">{p.impact}</div>
                                    </div>
                                )) || <div className="text-[var(--text-muted)] text-xs italic">No program data.</div>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal Footer / Actions */}
                <div className="p-8 border-t border-[var(--border-color)] bg-[var(--bg-primary)]/50 flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className="text-xs text-[var(--text-muted)] font-medium">
                        Submitted: {app.submittedAt?.toDate?.() ? new Date(app.submittedAt.toDate()).toLocaleString() : 'Recent'}
                    </div>
                    <div className="flex gap-4 w-full sm:w-auto">
                        {!app.verified ? (
                            <>
                                <button 
                                    onClick={() => { onReject(app.firestoreId); onClose(); }} 
                                    className="px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] border-2 border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all w-full sm:w-auto"
                                >
                                    Reject Application
                                </button>
                                <button 
                                    onClick={() => { onApprove(app.firestoreId); onClose(); }} 
                                    className="px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] bg-green-600 hover:bg-green-500 text-white shadow-xl shadow-green-600/20 transition-all w-full sm:w-auto"
                                >
                                    Approve & Publish
                                </button>
                            </>
                        ) : (
                            <button onClick={onClose} className="px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] hover:border-orange-500/30 transition-all w-full sm:w-auto">
                                Close Review
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
