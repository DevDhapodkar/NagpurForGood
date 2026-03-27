import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../utils/firebase';
import { doc, getDoc, updateDoc, collection, addDoc, serverTimestamp, arrayUnion, arrayRemove } from 'firebase/firestore';
import { 
    LayoutDashboard, Edit, Heart, Send, Plus, Trash2, Camera, Loader2, CheckCircle,
    Building2, User, Phone, Mail, Globe, MapPin, FileText, Award, Shield, 
    BadgeCheck, Upload, Instagram, Youtube, Facebook, Star, ChevronDown, 
    Milestone, HeartPulse, ArrowRight, ArrowLeft
} from 'lucide-react';
import FileUpload from '../components/common/FileUpload';

const NAGPUR_AREAS = [
    'South Nagpur', 'North Nagpur', 'East Nagpur', 'West Nagpur', 'Central Nagpur',
    'Dharampeth', 'Sitabuldi', 'Wadi', 'Sonegaon', 'Manewada', 'Trimurti Nagar',
    'Nandanvan', 'Mihan', 'Kamptee Road', 'Wardha Road', 'Other'
];

const NGO_CATEGORIES = [
    'Education', 'Healthcare', 'Environment', 'Women Empowerment',
    'Child Welfare', 'Animal Welfare', 'Disability', 'Elderly Care',
    'Rural Development', 'Poverty Alleviation', 'Disaster Relief',
    'Legal Aid', 'Art & Culture', 'Sports', 'Mental Health', 'Sanitation', 'Other'
];

const CERTIFICATIONS_LIST = ['80G', '12A', 'NITI Aayog', 'NGO Darpan', 'FCRA', 'ISO certified', 'Section 8 Registered', 'CSR-1'];

// ─── Reusable Field Components ─────────────────────────────────────────────
const FieldLabel = ({ icon: Icon, children, required }) => (
    <label className="text-[10px] uppercase font-black text-[var(--text-muted)] tracking-widest flex items-center gap-2 mb-2">
        {Icon && <Icon className="w-3 h-3" />} {children}
        {required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
);

const InputField = ({ label, icon, required, ...props }) => (
    <div>
        <FieldLabel icon={icon} required={required}>{label}</FieldLabel>
        <input
            {...props}
            required={required}
            className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-4 text-[var(--text-primary)] focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 transition-all text-sm"
        />
    </div>
);

const TextareaField = ({ label, icon, required, rows = 4, ...props }) => (
    <div>
        <FieldLabel icon={icon} required={required}>{label}</FieldLabel>
        <textarea
            {...props}
            required={required}
            rows={rows}
            className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-4 text-[var(--text-primary)] focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 transition-all text-sm resize-none"
        />
    </div>
);

const NGODashboard = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');
    const [ngoData, setNgoData] = useState(null);
    const [loading, setLoading] = useState(true);

    // States for Needs
    const [newNeed, setNewNeed] = useState({ title: '', urgency: 'Medium' });

    // States for Edit Request
    const [editForm, setEditForm] = useState({
        name: '',
        tagline: '',
        description: '',
        longDescription: '',
        categories: [],
        logoUrl: '',
        imageUrl: '',
        chairperson: '',
        founder: '',
        foundedYear: '',
        contact: '',
        email: '',
        address: '',
        website: '',
        legalDetails: { 
            registrationNo: '', 
            csr1: '', 
            section80G: '', 
            section12A: '',
            panNo: '',
            tanNo: '',
            certificateUrl: ''
        },
        financials: {
            upiId: '',
            bankName: '',
            auditStatus: 'Not Audited',
            transparencyLevel: 'Basic',
            reportsLink: ''
        },
        geoReach: [],
        boardOfDirectors: [{ name: '', role: '', profileUrl: '' }],
        teamAndLeadership: [{ name: '', role: '', profileUrl: '' }],
        programs: [{ title: '', description: '', impact: '', location: '' }],
        drives: [{ title: '', description: '', location: '' }],
        impactStats: [{ label: '', value: '', icon: 'Heart' }],
        milestones: [{ year: '', title: '', description: '' }],
        certifications: [],
        socialLinks: { instagram: '', facebook: '', youtube: '', email: '' },
    });
    const [editSubmitting, setEditSubmitting] = useState(false);
    const [editSuccess, setEditSuccess] = useState(false);

    useEffect(() => {
        const fetchNGOData = async () => {
            if (user?.ngoId) {
                const docRef = doc(db, 'ngos', user.ngoId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setNgoData(data);
                    setEditForm({
                        name: data.name || '',
                        tagline: data.tagline || '',
                        description: data.description || '',
                        longDescription: data.longDescription || '',
                        categories: data.categories || [],
                        logoUrl: data.logo || '',
                        imageUrl: data.image || '',
                        chairperson: data.chairperson || '',
                        founder: data.founder || '',
                        foundedYear: data.foundedYear || '',
                        contact: data.contact || '',
                        email: data.email || '',
                        address: data.address || '',
                        website: data.website || '',
                        legalDetails: data.legalDetails || { 
                            registrationNo: '', 
                            csr1: '', 
                            section80G: '', 
                            section12A: '',
                            panNo: '',
                            tanNo: '',
                            certificateUrl: ''
                        },
                        financials: data.financials || {
                            upiId: '',
                            bankName: '',
                            auditStatus: 'Not Audited',
                            transparencyLevel: 'Basic',
                            reportsLink: ''
                        },
                        geoReach: data.geoReach || [],
                        boardOfDirectors: data.boardOfDirectors || [{ name: '', role: '', profileUrl: '' }],
                        teamAndLeadership: data.teamAndLeadership || [{ name: '', role: '', profileUrl: '' }],
                        programs: data.programs || [{ title: '', description: '', impact: '', location: '' }],
                        drives: data.drives || [{ title: '', description: '', location: '' }],
                        impactStats: data.impactStats || [{ label: '', value: '', icon: 'Heart' }],
                        milestones: data.milestones || [{ year: '', title: '', description: '' }],
                        certifications: data.certifications || [],
                        socialLinks: data.socialLinks || { instagram: '', facebook: '', youtube: '', email: '' },
                    });
                }
            }
            setLoading(false);
        };
        fetchNGOData();
    }, [user]);

    const handleAddNeed = async (e) => {
        e.preventDefault();
        if (!newNeed.title.trim()) return;
        
        try {
            const docRef = doc(db, 'ngos', user.ngoId);
            const needObj = { ...newNeed, id: Date.now().toString(), createdAt: new Date().toISOString() };
            await updateDoc(docRef, {
                needs: arrayUnion(needObj)
            });
            setNgoData(prev => ({ ...prev, needs: [...(prev.needs || []), needObj] }));
            setNewNeed({ title: '', urgency: 'Medium' });
        } catch (error) {
            console.error("Error adding need:", error);
        }
    };

    const handleRemoveNeed = async (needObj) => {
        try {
            const docRef = doc(db, 'ngos', user.ngoId);
            await updateDoc(docRef, {
                needs: arrayRemove(needObj)
            });
            setNgoData(prev => ({ ...prev, needs: prev.needs.filter(n => n.id !== needObj.id) }));
        } catch (error) {
            console.error("Error removing need:", error);
        }
    };

    const setRequest = (key, value) => setEditForm(prev => ({ ...prev, [key]: value }));
    const setNestedRequest = (key, subKey, value) => setEditForm(prev => ({ ...prev, [key]: { ...prev[key], [subKey]: value } }));

    const toggleArrayItem = (key, item) => {
        setRequest(key, editForm[key].includes(item)
            ? editForm[key].filter(i => i !== item)
            : [...editForm[key], item]
        );
    };

    const addListItem = (key, template) => setRequest(key, [...editForm[key], template]);
    const removeListItem = (key, i) => setRequest(key, editForm[key].filter((_, idx) => idx !== i));
    const updateListItem = (key, i, subKey, val) => {
        const updated = [...editForm[key]];
        updated[i] = { ...updated[i], [subKey]: val };
        setRequest(key, updated);
    };

    const handleSubmitEditRequest = async (e) => {
        e.preventDefault();
        setEditSubmitting(true);
        try {
            const changesToSubmit = { ...editForm };
            // Map logoUrl back to logo and imageUrl back to image to match schema
            changesToSubmit.logo = editForm.logoUrl;
            changesToSubmit.image = editForm.imageUrl;
            
            await addDoc(collection(db, 'ngo_edit_requests'), {
                ngoId: user.ngoId,
                ngoName: ngoData.name,
                requestedChanges: changesToSubmit,
                status: 'pending',
                submittedAt: serverTimestamp(),
                submittedBy: user.email
            });
            setEditSuccess(true);
            setTimeout(() => setEditSuccess(false), 5000);
        } catch (error) {
            console.error("Error submitting edit request:", error);
        } finally {
            setEditSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-24">
                <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            </div>
        );
    }

    if (!user?.isNgo || !ngoData) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-24">
                <p className="text-xl font-bold">You do not have NGO privileges.</p>
            </div>
        );
    }

    const tabs = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'needs', label: 'Manage Needs', icon: Heart },
        { id: 'edit', label: 'Edit Profile Request', icon: Edit }
    ];

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans pt-32 pb-20">
            <div className="max-w-7xl mx-auto px-6">
                
                <div className="mb-10 flex items-center gap-6">
                    {ngoData.logo ? (
                        <div className="w-20 h-20 rounded-2xl bg-white p-2 shadow-lg overflow-hidden shrink-0">
                            <img src={ngoData.logo} alt="NGO Logo" className="w-full h-full object-contain" />
                        </div>
                    ) : (
                        <div className="w-20 h-20 rounded-2xl bg-orange-500/10 flex items-center justify-center font-black text-3xl text-orange-500">
                            {ngoData.name?.[0]}
                        </div>
                    )}
                    <div>
                        <h1 className="text-4xl font-black font-serif tracking-tight">{ngoData.name} Workspace</h1>
                        <p className="text-[var(--text-secondary)] mt-1">Manage your public presence and requirements.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Sidebar / Tabs */}
                    <div className="lg:col-span-3">
                        <div className="glass-panel p-4 rounded-3xl sticky top-32 space-y-2">
                            {tabs.map(tab => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl font-bold text-sm transition-all ${
                                            isActive 
                                            ? 'bg-orange-500 text-white shadow-lg' 
                                            : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'
                                        }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-9">
                        <div className="glass-panel p-8 sm:p-10 rounded-[2.5rem] min-h-[500px]">
                            
                            {/* OVERVIEW TAB */}
                            {activeTab === 'overview' && (
                                <div className="space-y-8 animate-in fade-in duration-500">
                                    <h2 className="text-2xl font-black font-serif">Hello, {user.displayName?.split(' ')[0]}!</h2>
                                    <p className="text-[var(--text-secondary)]">Here's how your profile is performing.</p>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                                        <div className="bg-orange-500/5 border border-orange-500/10 p-8 rounded-3xl flex items-center gap-6">
                                            <div className="p-4 bg-orange-500/10 rounded-2xl text-orange-500">
                                                <LayoutDashboard className="w-8 h-8" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-widest">Profile Views</div>
                                                <div className="text-4xl font-black mt-1">{ngoData.views || 0}</div>
                                            </div>
                                        </div>
                                        
                                        <div className="bg-red-500/5 border border-red-500/10 p-8 rounded-3xl flex items-center gap-6">
                                            <div className="p-4 bg-red-500/10 rounded-2xl text-red-500">
                                                <Heart className="w-8 h-8" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-widest">Donation Clicks</div>
                                                <div className="text-4xl font-black mt-1">{ngoData.donationsCount || 0}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* MANAGE NEEDS TAB */}
                            {activeTab === 'needs' && (
                                <div className="space-y-8 animate-in fade-in duration-500">
                                    <div>
                                        <h2 className="text-2xl font-black font-serif mb-2">Manage Current Needs</h2>
                                        <p className="text-[var(--text-secondary)] text-sm">List items, volunteers, or specific resources you currently require. This will be publicly visible on your profile.</p>
                                    </div>

                                    <form onSubmit={handleAddNeed} className="flex flex-col sm:flex-row gap-4 p-6 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl">
                                        <div className="flex-1">
                                            <input 
                                                type="text" 
                                                placeholder="e.g. Winter Blankets, 5 Volunteers" 
                                                required
                                                value={newNeed.title}
                                                onChange={e => setNewNeed({...newNeed, title: e.target.value})}
                                                className="w-full bg-transparent border-none text-[var(--text-primary)] focus:outline-none focus:ring-0 p-2"
                                            />
                                        </div>
                                        <div className="sm:w-40 border-l border-t sm:border-t-0 border-[var(--border-color)] pl-0 sm:pl-4 pt-4 sm:pt-0">
                                            <select 
                                                value={newNeed.urgency}
                                                onChange={e => setNewNeed({...newNeed, urgency: e.target.value})}
                                                className="w-full bg-transparent border-none text-[var(--text-primary)] focus:outline-none focus:ring-0 p-2 text-sm"
                                            >
                                                <option value="Low">Low Urgency</option>
                                                <option value="Medium">Medium Urgency</option>
                                                <option value="High">High Urgency</option>
                                            </select>
                                        </div>
                                        <button type="submit" className="py-3 px-6 rounded-xl font-bold text-white text-sm bg-orange-500 hover:bg-orange-600 transition-all flex items-center justify-center gap-2">
                                            <Plus className="w-4 h-4" /> Add
                                        </button>
                                    </form>

                                    <div className="space-y-3 mt-8">
                                        {ngoData.needs?.length > 0 ? (
                                            ngoData.needs.map(need => (
                                                <div key={need.id} className="flex items-center justify-between p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)]/50">
                                                    <div>
                                                        <div className="font-bold text-lg">{need.title}</div>
                                                        <div className={`text-xs font-black uppercase tracking-widest mt-1 ${
                                                            need.urgency === 'High' ? 'text-red-500' : 
                                                            need.urgency === 'Medium' ? 'text-orange-500' : 'text-blue-500'
                                                        }`}>
                                                            {need.urgency} Urgency
                                                        </div>
                                                    </div>
                                                    <button onClick={() => handleRemoveNeed(need)} className="p-2 text-red-500 opacity-50 hover:opacity-100 transition-opacity bg-red-500/10 rounded-lg">
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center p-10 text-[var(--text-secondary)] border-2 border-dashed border-[var(--border-color)] rounded-3xl">
                                                No specific needs listed right now.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* EDIT PROFILE REQUEST TAB */}
                            {activeTab === 'edit' && (
                                <div className="space-y-8 animate-in fade-in duration-500">
                                    <div>
                                        <h2 className="text-2xl font-black font-serif mb-2">Request Profile Changes</h2>
                                        <p className="text-[var(--text-secondary)] text-sm">Modifying your core profile details requires verification. Submit your proposed changes, and our team will review and approve them shortly.</p>
                                    </div>

                                    {editSuccess && (
                                        <div className="p-4 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-500 flex items-center gap-3 font-bold text-sm">
                                            <CheckCircle className="w-5 h-5" />
                                            Change request submitted successfully! Pending admin approval.
                                        </div>
                                    )}

                                    <form onSubmit={handleSubmitEditRequest} className="space-y-12 pb-10">
                                        
                                        {/* Section 1: Core Branding */}
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-3 border-b border-[var(--border-color)] pb-3">
                                                <Building2 className="w-5 h-5 text-orange-500" />
                                                <h3 className="text-xl font-black font-serif">Branding & Identity</h3>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <InputField label="Organization Name" value={editForm.name} onChange={e => setRequest('name', e.target.value)} required />
                                                <InputField label="Tagline" value={editForm.tagline} onChange={e => setRequest('tagline', e.target.value)} />
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <FileUpload 
                                                    label="Update Logo" 
                                                    onUploadComplete={url => setRequest('logoUrl', url)} 
                                                    pathPrefix="logos"
                                                />
                                                <FileUpload 
                                                    label="Update Cover Image" 
                                                    onUploadComplete={url => setRequest('imageUrl', url)} 
                                                    pathPrefix="covers"
                                                />
                                            </div>
                                            <TextareaField label="Short Description" rows={2} value={editForm.description} onChange={e => setRequest('description', e.target.value)} required />
                                            <TextareaField label="Full Description / Mission" rows={4} value={editForm.longDescription} onChange={e => setRequest('longDescription', e.target.value)} />
                                            
                                            <div>
                                                <FieldLabel icon={Award}>Focus Categories</FieldLabel>
                                                <div className="flex flex-wrap gap-2">
                                                    {NGO_CATEGORIES.map(cat => (
                                                        <button key={cat} type="button"
                                                            onClick={() => toggleArrayItem('categories', cat)}
                                                            className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
                                                                editForm.categories.includes(cat)
                                                                    ? 'bg-orange-500 text-white border-orange-500'
                                                                    : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border-color)]'
                                                            }`}
                                                        >{cat}</button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Section 2: Contact & Location */}
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-3 border-b border-[var(--border-color)] pb-3">
                                                <Phone className="w-5 h-5 text-orange-500" />
                                                <h3 className="text-xl font-black font-serif">Contact & Location</h3>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <InputField label="Chairperson" value={editForm.chairperson} onChange={e => setRequest('chairperson', e.target.value)} required />
                                                <InputField label="Founder" value={editForm.founder} onChange={e => setRequest('founder', e.target.value)} />
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                <InputField label="Year Founded" type="number" value={editForm.foundedYear} onChange={e => setRequest('foundedYear', e.target.value)} required />
                                                <InputField label="Public Contact" value={editForm.contact} onChange={e => setRequest('contact', e.target.value)} required />
                                                <InputField label="Public Email" value={editForm.email} onChange={e => setRequest('email', e.target.value)} required />
                                            </div>
                                            <TextareaField label="Head Office Address" rows={2} value={editForm.address} onChange={e => setRequest('address', e.target.value)} required />
                                            <InputField label="Website URL" value={editForm.website} onChange={e => setRequest('website', e.target.value)} />
                                        </div>

                                        {/* Section 3: Legal & Financials */}
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-3 border-b border-[var(--border-color)] pb-3">
                                                <Shield className="w-5 h-5 text-orange-500" />
                                                <h3 className="text-xl font-black font-serif">Legal & Financials</h3>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <InputField label="Registration Number" value={editForm.legalDetails.registrationNo} onChange={e => setNestedRequest('legalDetails', 'registrationNo', e.target.value)} required />
                                                <InputField label="UPI ID" value={editForm.financials.upiId} onChange={e => setNestedRequest('financials', 'upiId', e.target.value)} required />
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <InputField label="Audit Status" value={editForm.financials.auditStatus} onChange={e => setNestedRequest('financials', 'auditStatus', e.target.value)} />
                                                <FileUpload 
                                                    label="Update Registration Certificate" 
                                                    onUploadComplete={url => setNestedRequest('legalDetails', 'certificateUrl', url)} 
                                                    pathPrefix="certificates"
                                                />
                                            </div>
                                        </div>

                                        {/* Section 4: Leadership & Team */}
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-3 border-b border-[var(--border-color)] pb-3">
                                                <User className="w-5 h-5 text-orange-500" />
                                                <h3 className="text-xl font-black font-serif">Leadership & Team</h3>
                                            </div>

                                            {/* Board of Directors */}
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <FieldLabel icon={User}>Board of Directors</FieldLabel>
                                                    <button type="button" onClick={() => addListItem('boardOfDirectors', { name: '', role: '', profileUrl: '' })} className="flex items-center gap-2 px-3 py-1.5 bg-orange-500/10 text-orange-500 rounded-lg text-[10px] font-black uppercase">
                                                        <Plus className="w-3 h-3" /> Add Board Member
                                                    </button>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {editForm.boardOfDirectors.map((l, i) => (
                                                        <div key={i} className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl relative space-y-3">
                                                            <button type="button" onClick={() => removeListItem('boardOfDirectors', i)} className="absolute top-2 right-2 text-red-400 opacity-30 hover:opacity-100 transition-opacity"><Trash2 className="w-3 h-3" /></button>
                                                            <InputField label="Name" value={l.name} onChange={e => updateListItem('boardOfDirectors', i, 'name', e.target.value)} />
                                                            <InputField label="Role" value={l.role} onChange={e => updateListItem('boardOfDirectors', i, 'role', e.target.value)} />
                                                            <InputField label="LinkedIn URL" value={l.profileUrl} onChange={e => updateListItem('boardOfDirectors', i, 'profileUrl', e.target.value)} />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Team & Leadership */}
                                            <div className="space-y-4 pt-6">
                                                <div className="flex items-center justify-between">
                                                    <FieldLabel icon={User}>Team & Operational Leadership</FieldLabel>
                                                    <button type="button" onClick={() => addListItem('teamAndLeadership', { name: '', role: '', profileUrl: '' })} className="flex items-center gap-2 px-3 py-1.5 bg-orange-500/10 text-orange-500 rounded-lg text-[10px] font-black uppercase">
                                                        <Plus className="w-3 h-3" /> Add Team Member
                                                    </button>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {editForm.teamAndLeadership.map((l, i) => (
                                                        <div key={i} className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl relative space-y-3">
                                                            <button type="button" onClick={() => removeListItem('teamAndLeadership', i)} className="absolute top-2 right-2 text-red-400 opacity-30 hover:opacity-100 transition-opacity"><Trash2 className="w-3 h-3" /></button>
                                                            <InputField label="Name" value={l.name} onChange={e => updateListItem('teamAndLeadership', i, 'name', e.target.value)} />
                                                            <InputField label="Role" value={l.role} onChange={e => updateListItem('teamAndLeadership', i, 'role', e.target.value)} />
                                                            <InputField label="LinkedIn URL" value={l.profileUrl} onChange={e => updateListItem('teamAndLeadership', i, 'profileUrl', e.target.value)} />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Section 5: Programs & Impact */}
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-3 border-b border-[var(--border-color)] pb-3">
                                                <Star className="w-5 h-5 text-orange-500" />
                                                <h3 className="text-xl font-black font-serif">Programs & Impact</h3>
                                            </div>
                                            
                                            {/* Programs */}
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <FieldLabel icon={Star}>Key Programs</FieldLabel>
                                                    <button type="button" onClick={() => addListItem('programs', { title: '', description: '', impact: '', location: '' })} className="flex items-center gap-2 px-3 py-1.5 bg-orange-500/10 text-orange-500 rounded-lg text-[10px] font-black uppercase">
                                                        <Plus className="w-3 h-3" /> Add Program
                                                    </button>
                                                </div>
                                                {editForm.programs.map((p, i) => (
                                                    <div key={i} className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl relative space-y-4">
                                                        <button type="button" onClick={() => removeListItem('programs', i)} className="absolute top-4 right-4 text-red-400 opacity-50"><Trash2 className="w-4 h-4" /></button>
                                                        <InputField label="Title" value={p.title} onChange={e => updateListItem('programs', i, 'title', e.target.value)} />
                                                        <TextareaField label="Brief Description" rows={2} value={p.description} onChange={e => updateListItem('programs', i, 'description', e.target.value)} />
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Impact Stats */}
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <FieldLabel icon={Heart}>Impact Metrics</FieldLabel>
                                                    <button type="button" onClick={() => addListItem('impactStats', { label: '', value: '', icon: 'Heart' })} className="flex items-center gap-2 px-3 py-1.5 bg-orange-500/10 text-orange-500 rounded-lg text-[10px] font-black uppercase">
                                                        <Plus className="w-3 h-3" /> Add Metric
                                                    </button>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {editForm.impactStats.map((s, i) => (
                                                        <div key={i} className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl relative flex gap-4">
                                                            <button type="button" onClick={() => removeListItem('impactStats', i)} className="absolute top-2 right-2 text-red-400 opacity-30"><Trash2 className="w-3 h-3" /></button>
                                                            <div className="flex-1 space-y-3">
                                                                <InputField label="Value (e.g. 10k+)" value={s.value} onChange={e => updateListItem('impactStats', i, 'value', e.target.value)} />
                                                                <InputField label="Label" value={s.label} onChange={e => updateListItem('impactStats', i, 'label', e.target.value)} />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Section 6: Social Presence */}
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-3 border-b border-[var(--border-color)] pb-3">
                                                <Globe className="w-5 h-5 text-orange-500" />
                                                <h3 className="text-xl font-black font-serif">Social Presence</h3>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <InputField label="Instagram" icon={Instagram} value={editForm.socialLinks.instagram} onChange={e => setNestedRequest('socialLinks', 'instagram', e.target.value)} />
                                                <InputField label="Facebook" icon={Facebook} value={editForm.socialLinks.facebook} onChange={e => setNestedRequest('socialLinks', 'facebook', e.target.value)} />
                                                <InputField label="YouTube" icon={Youtube} value={editForm.socialLinks.youtube} onChange={e => setNestedRequest('socialLinks', 'youtube', e.target.value)} />
                                                <InputField label="Public Email" icon={Mail} value={editForm.socialLinks.email} onChange={e => setNestedRequest('socialLinks', 'email', e.target.value)} />
                                            </div>
                                        </div>

                                        <div className="pt-8 border-t border-[var(--border-color)]">
                                            <button 
                                                type="submit" 
                                                disabled={editSubmitting}
                                                className="py-5 px-10 rounded-[1.5rem] font-black text-white text-base uppercase tracking-widest bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 shadow-2xl transition-all transform hover:-translate-y-1 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 w-full"
                                            >
                                                {editSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                                Submit Comprehensive Profile Update
                                            </button>
                                            <p className="text-center text-[var(--text-muted)] text-[10px] mt-4 font-bold uppercase tracking-widest">
                                                Requesting verification for changes. This will be reviewed by NagpurGoodOrg admins.
                                            </p>
                                        </div>
                                    </form>
                                    
                                </div>
                            )}

                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default NGODashboard;
