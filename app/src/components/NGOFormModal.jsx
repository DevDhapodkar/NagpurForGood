import React, { useState, useEffect } from 'react';
import { 
    X, Save, Building2, Phone, Shield, FileText, 
    MapPin, User, Star, Heart, Award, Instagram, 
    Facebook, Youtube, Plus, Trash2, Globe, Mail,
    BadgeCheck, ExternalLink, ChevronRight, ChevronLeft, Upload,
    Milestone, HeartPulse, ShieldCheck, Smartphone, Linkedin, Info, AlertTriangle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import FileUpload from './common/FileUpload';

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

const TABS = [
    { id: 'basic', label: 'Branding', icon: Building2 },
    { id: 'contact', label: 'Contact', icon: Phone },
    { id: 'legal', label: 'Legal', icon: Shield },
    { id: 'financials', label: 'Financials', icon: FileText },
    { id: 'reach', label: 'Reach', icon: MapPin },
    { id: 'leadership', label: 'Leadership', icon: User },
    { id: 'programs', label: 'Programs', icon: Star },
    { id: 'drives', label: 'Drives', icon: HeartPulse },
    { id: 'milestones', label: 'Milestones', icon: Milestone },
    { id: 'impact', label: 'Impact', icon: Heart },
    { id: 'socials', label: 'Digital Assets', icon: Award },
    { id: 'governance', label: 'Governance', icon: ShieldCheck },
    { id: 'needs', label: 'Urgent Needs', icon: AlertTriangle },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

const FieldLabel = ({ children, icon: Icon }) => (
    <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] flex items-center gap-2 mb-1.5">
        {Icon && <Icon className="w-3 h-3 text-amber-500/50" />} {children}
    </label>
);

const TextInput = (props) => (
    <input 
        {...props} 
        className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500/50 transition-colors"
    />
);

const NGOFormModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
    const [activeTab, setActiveTab] = useState('basic');
    const [formData, setFormData] = useState({
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
        legalDetails: { registrationNo: '', csr1: '', section80G: '', section12A: '', panNo: '', tanNo: '', certificateUrl: '' },
        financials: { upiId: '', bankName: '', auditStatus: 'Not Audited', reportsLink: '' },
        geoReach: [],
        boardOfDirectors: [],
        teamAndLeadership: [],
        programs: [],
        impactStats: [],
        milestones: [],
        drives: [],
        certifications: [],
        socialLinks: { instagram: '', facebook: '', youtube: '', email: '', linkedin: '' },
        appLinks: { android: '', ios: '' },
        awards: [],
        testimonials: [],
        volunteerOps: false,
        verified: false,
        manualScore: null,
        manualLevel: '',
        urgentNeeds: []
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...formData,
                ...initialData,
                // Map legacy field names to form state
                imageUrl: initialData.imageUrl || initialData.image || '',
                logoUrl: initialData.logoUrl || initialData.logo || '',
                // Ensure nested objects exist to avoid crashes
                legalDetails: { ...formData.legalDetails, ...(initialData.legalDetails || {}) },
                financials: { ...formData.financials, ...(initialData.financials || {}) },
                socialLinks: { ...formData.socialLinks, ...(initialData.socialLinks || {}) },
                categories: initialData.categories || [],
                geoReach: initialData.geoReach || [],
                teamAndLeadership: initialData.teamAndLeadership || initialData.leadership || [],
                boardOfDirectors: initialData.boardOfDirectors || initialData.board || [],
                programs: initialData.programs || [],
                impactStats: initialData.impactStats || [],
                milestones: initialData.milestones || [],
                drives: initialData.drives || [],
                certifications: initialData.certifications || [],
                urgentNeeds: initialData.urgentNeeds || [],
                socialLinks: { ...formData.socialLinks, ...(initialData.socialLinks || {}) },
                appLinks: { ...formData.appLinks, ...(initialData.appLinks || {}) },
                awards: initialData.awards || [],
                testimonials: initialData.testimonials || [],
                volunteerOps: initialData.volunteerOps || false,
                manualScore: initialData.manualScore !== undefined ? initialData.manualScore : null,
                manualLevel: initialData.manualLevel || ''
            });
        } else {
            // Reset to empty state if not editing
            setFormData({
                name: '', tagline: '', description: '', longDescription: '',
                categories: [], logoUrl: '', imageUrl: '', chairperson: '',
                founder: '', foundedYear: '', contact: '', email: '',
                address: '', website: '',
                legalDetails: { registrationNo: '', csr1: '', section80G: '', section12A: '', panNo: '', tanNo: '', certificateUrl: '' },
                financials: { upiId: '', bankName: '', auditStatus: 'Not Audited', reportsLink: '' },
                geoReach: [], boardOfDirectors: [], teamAndLeadership: [], programs: [], impactStats: [],
                milestones: [], drives: [],
                certifications: [], socialLinks: { instagram: '', facebook: '', youtube: '', email: '', linkedin: '' },
                appLinks: { android: '', ios: '' },
                awards: [],
                testimonials: [],
                volunteerOps: false,
                verified: false,
                manualScore: null,
                manualLevel: '',
                urgentNeeds: []
            });
        }
        setActiveTab('basic');
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNestedChange = (parent, field, value) => {
        setFormData(prev => ({
            ...prev,
            [parent]: { ...prev[parent], [field]: value }
        }));
    };

    const toggleArrayItem = (field, item) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].includes(item)
                ? prev[field].filter(i => i !== item)
                : [...prev[field], item]
        }));
    };

    const addItem = (field, template) => {
        setFormData(prev => ({ ...prev, [field]: [...prev[field], template] }));
    };

    const removeItem = (field, index) => {
        setFormData(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));
    };

    const updateItem = (field, index, subField, value) => {
        setFormData(prev => {
            const newList = [...prev[field]];
            newList[index] = { ...newList[index], [subField]: value };
            return { ...prev, [field]: newList };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Split internal metadata from data we want to save
        // NOTE: We MUST keep 'id' as it is the NGO's unique slug used for routing
        const { firestoreId, updatedAt, imageUrl, logoUrl, ...saveData } = formData;
        
        const payload = {
            ...saveData,
            mockUPI: formData.financials?.upiId || '',
            image: formData.imageUrl || saveData.image || '', 
            logo: formData.logoUrl || saveData.logo || ''
        };

        // Remove temporary state fields and undefineds
        delete payload.imageUrl;
        delete payload.logoUrl;
        Object.keys(payload).forEach(key => {
            if (payload[key] === undefined) delete payload[key];
        });

        onSubmit(payload);
        onClose();
    };


    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
            <div className="glass-panel w-full max-w-5xl rounded-[2.5rem] overflow-hidden flex flex-col h-[85vh] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] border-white/10">
                
                {/* Header */}
                <div className="px-8 py-6 flex items-center justify-between border-b border-white/5 bg-white/5">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500">
                            <Building2 className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black font-serif tracking-tight">
                                {initialData ? 'Edit Master Portfolio' : 'Configure New NGO'}
                            </h2>
                            <p className="text-xs text-[var(--text-muted)] font-medium">Manage all application data points for {formData.name || 'Organization'}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/5 rounded-xl">
                            <input 
                                type="checkbox" 
                                id="verified-toggle"
                                checked={formData.verified}
                                onChange={(e) => setFormData(prev => ({ ...prev, verified: e.target.checked }))}
                                className="w-4 h-4 rounded border-white/10 text-amber-500 focus:ring-amber-500/50 bg-black/20"
                            />
                            <label htmlFor="verified-toggle" className="text-xs font-black uppercase tracking-widest cursor-pointer select-none">Verified</label>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-xl text-[var(--text-secondary)] hover:bg-white/10 hover:text-white transition-all">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Trust Score Banner */}
                <div className="mx-6 mb-4 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex items-center justify-between gap-4 group hover:border-amber-500/30 transition-all">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-900/20 group-hover:scale-110 transition-transform">
                            <BadgeCheck className="w-4 h-4" />
                        </div>
                        <div>
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-[var(--text-primary)]">Optimize Your Trust Score</h3>
                            <p className="text-[9px] text-[var(--text-muted)] mt-0.5 font-medium">Earn the <span className="text-amber-500 font-black">"Highly Trusted"</span> badge by providing all details.</p>
                        </div>
                    </div>
                    <Link to="/trust-score" className="px-3 py-1.5 rounded-lg bg-white/5 border border-amber-500/10 text-amber-500 text-[9px] font-black uppercase tracking-widest hover:bg-amber-500 hover:text-white transition-all whitespace-nowrap">
                        How it Works
                    </Link>
                </div>

                <div className="flex flex-1 overflow-hidden">

                    {/* Sidebar Tabs */}
                    <div className="w-64 border-r border-white/5 bg-black/20 p-4 space-y-1.5 overflow-y-auto hidden md:block">
                        {TABS.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-xs font-bold transition-all ${
                                    activeTab === tab.id 
                                    ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' 
                                    : 'text-[var(--text-muted)] hover:bg-white/5 hover:text-white'
                                }`}
                            >
                                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-black' : 'text-amber-500/50'}`} />
                                {tab.label}
                                {activeTab === tab.id && <ChevronRight className="w-4 h-4 ml-auto" />}
                            </button>
                        ))}
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 flex flex-col overflow-hidden bg-[var(--bg-primary)]/30">
                        <div className="p-8 overflow-y-auto flex-1 custom-scrollbar">
                            <form id="master-ngo-form" onSubmit={handleSubmit} className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                                
                                {activeTab === 'basic' && (
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-1.5"><FieldLabel icon={Building2}>Organization Name</FieldLabel><TextInput name="name" value={formData.name} onChange={handleChange} placeholder="Official Name" required /></div>
                                            <div className="space-y-1.5"><FieldLabel icon={Star}>Tagline</FieldLabel><TextInput name="tagline" value={formData.tagline} onChange={handleChange} placeholder="One liner mission..." /></div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <FieldLabel icon={Award}>Categories</FieldLabel>
                                            <div className="flex flex-wrap gap-2 pt-2">
                                                {NGO_CATEGORIES.map(cat => (
                                                    <button key={cat} type="button" onClick={() => toggleArrayItem('categories', cat)}
                                                        className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider border transition-all ${
                                                            formData.categories.includes(cat) ? 'bg-amber-500 text-black border-amber-500' : 'bg-white/5 text-[var(--text-muted)] border-white/5 hover:border-amber-500/50'
                                                        }`}
                                                    >{cat}</button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="space-y-1.5"><FieldLabel icon={FileText}>Short Summary</FieldLabel><textarea name="description" value={formData.description} onChange={handleChange} className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500/50 transition-colors resize-none h-20" /></div>
                                        <div className="space-y-1.5"><FieldLabel icon={FileText}>Detailed Mission Statement</FieldLabel><textarea name="longDescription" value={formData.longDescription} onChange={handleChange} className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500/50 transition-colors resize-none h-40" /></div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <FileUpload 
                                                label="Organization Logo" icon={Upload}
                                                initialPreview={formData.logoUrl}
                                                onUploadComplete={(url) => setFormData(prev => ({ ...prev, logoUrl: url }))}
                                                pathPrefix="logos"
                                            />
                                            <FileUpload 
                                                label="Banner Imagery" icon={Upload}
                                                initialPreview={formData.imageUrl}
                                                onUploadComplete={(url) => setFormData(prev => ({ ...prev, imageUrl: url }))}
                                                pathPrefix="covers"
                                            />
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'contact' && (
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-1.5"><FieldLabel icon={User}>Chairperson / President</FieldLabel><TextInput name="chairperson" value={formData.chairperson} onChange={handleChange} /></div>
                                            <div className="space-y-1.5"><FieldLabel icon={User}>Founder Name</FieldLabel><TextInput name="founder" value={formData.founder} onChange={handleChange} /></div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="space-y-1.5"><FieldLabel icon={Star}>Founded Year</FieldLabel><TextInput name="foundedYear" type="number" value={formData.foundedYear} onChange={handleChange} /></div>
                                            <div className="space-y-1.5"><FieldLabel icon={Phone}>Direct Phone</FieldLabel><TextInput name="contact" value={formData.contact} onChange={handleChange} /></div>
                                            <div className="space-y-1.5"><FieldLabel icon={Mail}>Official Contact Email</FieldLabel><TextInput name="email" type="email" value={formData.email} onChange={handleChange} /></div>
                                        </div>
                                        <div className="space-y-1.5"><FieldLabel icon={MapPin}>Full Registered Address</FieldLabel><textarea name="address" value={formData.address} onChange={handleChange} className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500/50 transition-colors h-24" /></div>
                                        <div className="space-y-1.5"><FieldLabel icon={Globe}>Official Website</FieldLabel><TextInput name="website" value={formData.website} onChange={handleChange} placeholder="https://..." /></div>
                                    </div>
                                )}

                                {activeTab === 'legal' && (
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-1.5"><FieldLabel icon={Shield}>Registration Number</FieldLabel><TextInput value={formData.legalDetails.registrationNo} onChange={e => handleNestedChange('legalDetails', 'registrationNo', e.target.value)} /></div>
                                            <div className="space-y-1.5"><FieldLabel icon={BadgeCheck}>CSR-1 Registration</FieldLabel><TextInput value={formData.legalDetails.csr1} onChange={e => handleNestedChange('legalDetails', 'csr1', e.target.value)} /></div>
                                            <div className="space-y-1.5"><FieldLabel icon={Award}>Section 80G Certificate</FieldLabel><TextInput value={formData.legalDetails.section80G} onChange={e => handleNestedChange('legalDetails', 'section80G', e.target.value)} /></div>
                                            <div className="space-y-1.5"><FieldLabel icon={Award}>Section 12A Certificate</FieldLabel><TextInput value={formData.legalDetails.section12A} onChange={e => handleNestedChange('legalDetails', 'section12A', e.target.value)} /></div>
                                            <div className="space-y-1.5"><FieldLabel icon={FileText}>PAN Card No.</FieldLabel><TextInput value={formData.legalDetails.panNo} onChange={e => handleNestedChange('legalDetails', 'panNo', e.target.value)} /></div>
                                            <div className="space-y-1.5"><FieldLabel icon={FileText}>TAN ID</FieldLabel><TextInput value={formData.legalDetails.tanNo} onChange={e => handleNestedChange('legalDetails', 'tanNo', e.target.value)} /></div>
                                            <div className="space-y-1.5 pt-2">
                                                <FileUpload 
                                                    label="Registration Certificate" icon={Upload}
                                                    accept="image/*,.pdf"
                                                    initialPreview={formData.legalDetails.certificateUrl}
                                                    onUploadComplete={(url) => handleNestedChange('legalDetails', 'certificateUrl', url)}
                                                    pathPrefix="certificates"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'financials' && (
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-1.5"><FieldLabel icon={Heart}>UPI ID (Direct Donation)</FieldLabel><TextInput value={formData.financials.upiId} onChange={e => handleNestedChange('financials', 'upiId', e.target.value)} placeholder="org@upi" /></div>
                                            <div className="space-y-1.5"><FieldLabel icon={Building2}>Primary Bank Name</FieldLabel><TextInput value={formData.financials.bankName} onChange={e => handleNestedChange('financials', 'bankName', e.target.value)} /></div>
                                            <div className="space-y-1.5">
                                                <FieldLabel icon={BadgeCheck}>Annual Audit Status</FieldLabel>
                                                <select value={formData.financials.auditStatus} onChange={e => handleNestedChange('financials', 'auditStatus', e.target.value)} className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500/50">
                                                    <option>Not Audited</option>
                                                    <option>Audited (Last FY)</option>
                                                    <option>Regularly Audited</option>
                                                </select>
                                            </div>
                                            <div className="space-y-1.5">
                                                <FileUpload 
                                                    label="Audit Report" icon={Upload}
                                                    accept=".pdf,.doc,.docx"
                                                    onUploadComplete={(url) => handleNestedChange('financials', 'reportsLink', url)}
                                                    pathPrefix="reports"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'reach' && (
                                    <div className="space-y-6">
                                        <FieldLabel icon={MapPin}>Geographic Focus (Nagpur Areas)</FieldLabel>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                            {NAGPUR_AREAS.map(area => (
                                                <button key={area} type="button" onClick={() => toggleArrayItem('geoReach', area)}
                                                    className={`p-4 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                                                        formData.geoReach.includes(area) ? 'bg-orange-500 text-white border-orange-500' : 'bg-white/5 text-[var(--text-muted)] border-white/5 hover:border-orange-500/40'
                                                    }`}
                                                >{area}</button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'leadership' && (
                                    <div className="space-y-12">
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <FieldLabel icon={User}>Board of Directors</FieldLabel>
                                                <button type="button" onClick={() => addItem('boardOfDirectors', { name: '', role: '', profileUrl: '' })} className="text-[10px] font-black uppercase tracking-widest text-amber-500 hover:underline">+ Add Board Member</button>
                                            </div>
                                            <div className="space-y-4">
                                                {formData.boardOfDirectors.map((l, i) => (
                                                    <div key={i} className="bg-white/5 p-5 rounded-2xl relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 border border-white/5">
                                                        <button type="button" onClick={() => removeItem('boardOfDirectors', i)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 opacity-80 hover:opacity-100 transition-opacity"><Trash2 className="w-3 h-3" /></button>
                                                        <div className="space-y-1"><FieldLabel>Full Name</FieldLabel><TextInput value={l.name} onChange={e => updateItem('boardOfDirectors', i, 'name', e.target.value)} /></div>
                                                        <div className="space-y-1"><FieldLabel>Role</FieldLabel><TextInput value={l.role} onChange={e => updateItem('boardOfDirectors', i, 'role', e.target.value)} /></div>
                                                        <div className="space-y-1"><FieldLabel>Profile Link</FieldLabel><TextInput value={l.profileUrl} onChange={e => updateItem('boardOfDirectors', i, 'profileUrl', e.target.value)} /></div>
                                                        <div className="space-y-1 lg:col-span-3"><FieldLabel icon={Linkedin}>LinkedIn Profile</FieldLabel><TextInput value={l.linkedin} onChange={e => updateItem('boardOfDirectors', i, 'linkedin', e.target.value)} placeholder="https://linkedin.com/in/..." /></div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="pt-8 border-t border-white/5">
                                            <div className="flex items-center justify-between mb-2">
                                                <FieldLabel icon={User}>Team & Leadership</FieldLabel>
                                                <button type="button" onClick={() => addItem('teamAndLeadership', { name: '', role: '', profileUrl: '' })} className="text-[10px] font-black uppercase tracking-widest text-amber-500 hover:underline">+ Add Team Member</button>
                                            </div>
                                            <div className="space-y-4">
                                                {formData.teamAndLeadership.map((l, i) => (
                                                    <div key={i} className="bg-white/5 p-5 rounded-2xl relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 border border-white/5">
                                                        <button type="button" onClick={() => removeItem('teamAndLeadership', i)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 opacity-80 hover:opacity-100 transition-opacity"><Trash2 className="w-3 h-3" /></button>
                                                        <div className="space-y-1"><FieldLabel>Full Name</FieldLabel><TextInput value={l.name} onChange={e => updateItem('teamAndLeadership', i, 'name', e.target.value)} /></div>
                                                        <div className="space-y-1"><FieldLabel>Role</FieldLabel><TextInput value={l.role} onChange={e => updateItem('teamAndLeadership', i, 'role', e.target.value)} /></div>
                                                        <div className="space-y-1"><FieldLabel>Profile Link</FieldLabel><TextInput value={l.profileUrl} onChange={e => updateItem('teamAndLeadership', i, 'profileUrl', e.target.value)} /></div>
                                                        <div className="space-y-1 lg:col-span-3"><FieldLabel icon={Linkedin}>LinkedIn Profile</FieldLabel><TextInput value={l.linkedin} onChange={e => updateItem('teamAndLeadership', i, 'linkedin', e.target.value)} placeholder="https://linkedin.com/in/..." /></div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                 {activeTab === 'needs' && (
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <FieldLabel icon={AlertTriangle}>Urgent Needs</FieldLabel>
                                                <p className="text-[10px] text-[var(--text-muted)] font-medium -mt-1">List items or services that are currently needed most.</p>
                                            </div>
                                            <button type="button" onClick={() => addItem('urgentNeeds', { title: '', description: '', priority: 'Medium' })} className="text-[10px] font-black uppercase tracking-widest text-amber-500 hover:underline">+ Add Need</button>
                                        </div>
                                        <div className="grid grid-cols-1 gap-4">
                                            {formData.urgentNeeds.map((need, i) => (
                                                <div key={i} className="bg-white/5 p-5 rounded-2xl relative border border-white/5 group hover:border-amber-500/20 transition-all">
                                                    <button 
                                                        type="button" 
                                                        onClick={() => removeItem('urgentNeeds', i)} 
                                                        className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1.5 shadow-lg opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all hover:bg-red-500 z-10"
                                                        title="Remove Need"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                                                        <div className="md:col-span-5 space-y-1">
                                                            <FieldLabel>Requirement Title</FieldLabel>
                                                            <TextInput value={need.title} onChange={e => updateItem('urgentNeeds', i, 'title', e.target.value)} placeholder="e.g. Dry Ration Kits" />
                                                        </div>
                                                        <div className="md:col-span-4 space-y-1">
                                                            <FieldLabel>Short Description</FieldLabel>
                                                            <TextInput value={need.description} onChange={e => updateItem('urgentNeeds', i, 'description', e.target.value)} placeholder="e.g. For 50 families" />
                                                        </div>
                                                        <div className="md:col-span-3 space-y-1">
                                                            <FieldLabel>Priority Level</FieldLabel>
                                                            <select 
                                                                value={need.priority} 
                                                                onChange={e => updateItem('urgentNeeds', i, 'priority', e.target.value)}
                                                                className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500/50 transition-colors text-[var(--text-primary)]"
                                                            >
                                                                <option value="Low">Low</option>
                                                                <option value="Medium">Medium</option>
                                                                <option value="High">High</option>
                                                                <option value="Critical">Critical</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            {formData.urgentNeeds.length === 0 && (
                                                <div className="text-center py-12 border-2 border-dashed border-white/5 rounded-[2rem] bg-white/5">
                                                    <p className="text-xs text-[var(--text-muted)] font-black uppercase tracking-widest">No urgent needs listed</p>
                                                    <button type="button" onClick={() => addItem('urgentNeeds', { title: '', description: '', priority: 'Medium' })} className="mt-4 px-6 py-2 rounded-xl bg-white/5 border border-white/10 text-amber-500 text-[10px] font-black uppercase tracking-widest hover:bg-amber-500 hover:text-white transition-all">Initialize List</button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'programs' && (
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between mb-2">
                                            <FieldLabel icon={Star}>Key Programs & Initiatives</FieldLabel>
                                            <div className="flex gap-4">
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData(prev => ({ ...prev, volunteerOps: !prev.volunteerOps }))}
                                                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                                                        formData.volunteerOps ? 'bg-orange-500 text-white border-orange-500 shadow-lg' : 'bg-white/5 text-[var(--text-muted)] border-white/5'
                                                    }`}
                                                >
                                                    Volunteer Roles: {formData.volunteerOps ? 'Active' : 'Missing'}
                                                </button>
                                                <button type="button" onClick={() => addItem('programs', { title: '', description: '', impact: '', location: '' })} className="text-[10px] font-black uppercase tracking-widest text-amber-500 hover:underline">+ Add Program</button>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            {formData.programs.map((p, i) => (
                                                <div key={i} className="bg-white/5 p-6 rounded-2xl relative space-y-4 border border-white/5">
                                                    <button type="button" onClick={() => removeItem('programs', i)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 opacity-80 hover:opacity-100 transition-opacity"><Trash2 className="w-3 h-3" /></button>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                        <div className="space-y-1"><FieldLabel>Title</FieldLabel><TextInput value={p.title} onChange={e => updateItem('programs', i, 'title', e.target.value)} /></div>
                                                        <div className="space-y-1"><FieldLabel>Impact Summary</FieldLabel><TextInput value={p.impact} onChange={e => updateItem('programs', i, 'impact', e.target.value)} /></div>
                                                        <div className="space-y-1"><FieldLabel>Location</FieldLabel><TextInput value={p.location} onChange={e => updateItem('programs', i, 'location', e.target.value)} /></div>
                                                    </div>
                                                    <div className="space-y-1"><FieldLabel>Description</FieldLabel><textarea value={p.description} onChange={e => updateItem('programs', i, 'description', e.target.value)} className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500/50 resize-none h-20" /></div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'drives' && (
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between mb-2">
                                            <FieldLabel icon={HeartPulse}>Community Drives</FieldLabel>
                                            <button type="button" onClick={() => addItem('drives', { title: '', description: '', location: '' })} className="text-[10px] font-black uppercase tracking-widest text-amber-500 hover:underline">+ Add Drive</button>
                                        </div>
                                        <div className="space-y-4">
                                            {formData.drives.map((d, i) => (
                                                <div key={i} className="bg-white/5 p-6 rounded-2xl relative space-y-4 border border-white/5">
                                                    <button type="button" onClick={() => removeItem('drives', i)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 opacity-80 hover:opacity-100 transition-opacity"><Trash2 className="w-3 h-3" /></button>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div className="space-y-1"><FieldLabel>Drive Title</FieldLabel><TextInput value={d.title} onChange={e => updateItem('drives', i, 'title', e.target.value)} placeholder="e.g. Winter Clothes Collection 2024" /></div>
                                                        <div className="space-y-1"><FieldLabel>Location</FieldLabel><TextInput value={d.location} onChange={e => updateItem('drives', i, 'location', e.target.value)} placeholder="e.g. South Nagpur" /></div>
                                                    </div>
                                                    <div className="space-y-1"><FieldLabel>Description</FieldLabel><textarea value={d.description} onChange={e => updateItem('drives', i, 'description', e.target.value)} className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500/50 resize-none h-20" /></div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'milestones' && (
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between mb-2">
                                            <FieldLabel icon={Milestone}>Organizational Milestones</FieldLabel>
                                            <button type="button" onClick={() => addItem('milestones', { year: '', title: '', description: '' })} className="text-[10px] font-black uppercase tracking-widest text-amber-500 hover:underline">+ Add Milestone</button>
                                        </div>
                                        <div className="space-y-4">
                                            {formData.milestones.map((m, i) => (
                                                <div key={i} className="bg-white/5 p-6 rounded-2xl relative space-y-4 border border-white/5">
                                                    <button type="button" onClick={() => removeItem('milestones', i)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 opacity-80 hover:opacity-100 transition-opacity"><Trash2 className="w-3 h-3" /></button>
                                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                                        <div className="space-y-1"><FieldLabel>Year</FieldLabel><TextInput value={m.year} onChange={e => updateItem('milestones', i, 'year', e.target.value)} placeholder="2024" /></div>
                                                        <div className="md:col-span-3 space-y-1"><FieldLabel>Milestone Title</FieldLabel><TextInput value={m.title} onChange={e => updateItem('milestones', i, 'title', e.target.value)} placeholder="e.g. Reached 50,000+ Students" /></div>
                                                    </div>
                                                    <div className="space-y-1"><FieldLabel>Description</FieldLabel><textarea value={m.description} onChange={e => updateItem('milestones', i, 'description', e.target.value)} className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500/50 resize-none h-20" /></div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'impact' && (
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between mb-2">
                                            <FieldLabel icon={Heart}>Quantifiable Impact Metrics</FieldLabel>
                                            <button type="button" onClick={() => addItem('impactStats', { label: '', value: '' })} className="text-[10px] font-black uppercase tracking-widest text-amber-500 hover:underline">+ Add Metric</button>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {formData.impactStats.map((s, i) => (
                                                <div key={i} className="bg-white/5 p-5 rounded-2xl relative flex gap-4 border border-white/5">
                                                    <button type="button" onClick={() => removeItem('impactStats', i)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 opacity-80 hover:opacity-100 transition-opacity"><Trash2 className="w-2.5 h-2.5" /></button>
                                                    <div className="flex-1 space-y-3">
                                                        <div className="space-y-1"><FieldLabel>Value (e.g. 10k+)</FieldLabel><TextInput value={s.value} onChange={e => updateItem('impactStats', i, 'value', e.target.value)} /></div>
                                                        <div className="space-y-1"><FieldLabel>Metric Label</FieldLabel><TextInput value={s.label} onChange={e => updateItem('impactStats', i, 'label', e.target.value)} /></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'socials' && (
                                    <div className="space-y-8">
                                        <div className="space-y-4">
                                            <FieldLabel icon={Award}>Certifications & Verified Recognition</FieldLabel>
                                            <div className="flex flex-wrap gap-2 pt-2">
                                                {CERTIFICATIONS_LIST.map(cert => (
                                                    <button key={cert} type="button" onClick={() => toggleArrayItem('certifications', cert)}
                                                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                                                            formData.certifications.includes(cert) ? 'bg-amber-500 text-black border-amber-500 shadow-lg' : 'bg-white/5 text-[var(--text-muted)] border-white/5 hover:border-amber-500/40'
                                                        }`}
                                                    >{cert}</button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <FieldLabel icon={Globe}>Official Social Media Channels</FieldLabel>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-1.5"><FieldLabel icon={Instagram}>Instagram URL</FieldLabel><TextInput value={formData.socialLinks.instagram} onChange={e => handleNestedChange('socialLinks', 'instagram', e.target.value)} /></div>
                                                <div className="space-y-1.5"><FieldLabel icon={Facebook}>Facebook URL</FieldLabel><TextInput value={formData.socialLinks.facebook} onChange={e => handleNestedChange('socialLinks', 'facebook', e.target.value)} /></div>
                                                <div className="space-y-1.5"><FieldLabel icon={Youtube}>YouTube URL</FieldLabel><TextInput value={formData.socialLinks.youtube} onChange={e => handleNestedChange('socialLinks', 'youtube', e.target.value)} /></div>
                                                <div className="space-y-1.5"><FieldLabel icon={Linkedin}>LinkedIn Page</FieldLabel><TextInput value={formData.socialLinks.linkedin} onChange={e => handleNestedChange('socialLinks', 'linkedin', e.target.value)} /></div>
                                                <div className="space-y-1.5"><FieldLabel icon={Mail}>Public Inquiry Email</FieldLabel><TextInput value={formData.socialLinks.email} onChange={e => handleNestedChange('socialLinks', 'email', e.target.value)} /></div>
                                            </div>
                                        </div>

                                        <div className="space-y-4 pt-8 border-t border-white/5">
                                            <FieldLabel icon={Smartphone}>Mobile Applications</FieldLabel>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-1.5"><FieldLabel icon={Globe}>Play Store (Android)</FieldLabel><TextInput value={formData.appLinks.android} onChange={e => handleNestedChange('appLinks', 'android', e.target.value)} /></div>
                                                <div className="space-y-1.5"><FieldLabel icon={Globe}>App Store (iOS)</FieldLabel><TextInput value={formData.appLinks.ios} onChange={e => handleNestedChange('appLinks', 'ios', e.target.value)} /></div>
                                            </div>
                                        </div>

                                        <div className="space-y-4 pt-8 border-t border-white/5">
                                            <div className="flex items-center justify-between">
                                                <FieldLabel icon={Award}>Awards & Recognition</FieldLabel>
                                                <button type="button" onClick={() => addItem('awards', '')} className="text-[10px] font-black uppercase tracking-widest text-amber-500 hover:underline">+ Add Award</button>
                                            </div>
                                            <div className="space-y-3">
                                                {formData.awards.map((award, i) => (
                                                    <div key={i} className="flex gap-3">
                                                        <TextInput value={award} onChange={e => {
                                                            const newAwards = [...formData.awards];
                                                            newAwards[i] = e.target.value;
                                                            setFormData(prev => ({ ...prev, awards: newAwards }));
                                                        }} />
                                                        <button type="button" onClick={() => removeItem('awards', i)} className="p-2 text-red-500 opacity-50 hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4" /></button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-4 pt-8 border-t border-white/5">
                                            <div className="flex items-center justify-between">
                                                <FieldLabel icon={Mail}>Beneficiary Testimonials</FieldLabel>
                                                <button type="button" onClick={() => addItem('testimonials', { name: '', quote: '', role: '' })} className="text-[10px] font-black uppercase tracking-widest text-amber-500 hover:underline">+ Add Testimonial</button>
                                            </div>
                                            <div className="space-y-4">
                                                {formData.testimonials.map((t, i) => (
                                                    <div key={i} className="bg-white/5 p-5 rounded-2xl relative border border-white/5 space-y-4">
                                                        <button type="button" onClick={() => removeItem('testimonials', i)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 opacity-80 hover:opacity-100 transition-opacity"><Trash2 className="w-3 h-3" /></button>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div className="space-y-1"><FieldLabel>Name</FieldLabel><TextInput value={t.name} onChange={e => updateItem('testimonials', i, 'name', e.target.value)} /></div>
                                                            <div className="space-y-1"><FieldLabel>Role</FieldLabel><TextInput value={t.role} onChange={e => updateItem('testimonials', i, 'role', e.target.value)} /></div>
                                                        </div>
                                                        <div className="space-y-1"><FieldLabel>Quote</FieldLabel><textarea value={t.quote} onChange={e => updateItem('testimonials', i, 'quote', e.target.value)} className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500/50 resize-none h-20" /></div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'governance' && (
                                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                        <div className="bg-amber-500/5 border border-amber-500/10 p-6 rounded-[2rem] space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-1">
                                                    <h3 className="text-sm font-black text-theme-primary uppercase tracking-tight">Manual Confidence Override</h3>
                                                    <p className="text-[10px] text-theme-primary/40 font-medium uppercase tracking-widest">Bypass automated scoring for direct admin control</p>
                                                </div>
                                                <button 
                                                    type="button"
                                                    onClick={() => setFormData(prev => ({ ...prev, manualScore: prev.manualScore === null ? 85 : null }))}
                                                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                                                        formData.manualScore !== null ? 'bg-amber-500 text-black border-amber-500' : 'bg-white/5 text-theme-primary/40 border-white/5'
                                                    }`}
                                                >
                                                    {formData.manualScore !== null ? 'Manual Mode: ON' : 'Manual Mode: OFF'}
                                                </button>
                                            </div>

                                            {formData.manualScore !== null && (
                                                <div className="space-y-6 pt-4 border-t border-amber-500/10">
                                                    <div className="space-y-3">
                                                        <div className="flex justify-between items-center">
                                                            <FieldLabel icon={Star}>Assign Trust Score</FieldLabel>
                                                            <span className="text-xl font-black text-amber-500">{formData.manualScore}%</span>
                                                        </div>
                                                        <input 
                                                            type="range" 
                                                            min="0" 
                                                            max="100" 
                                                            value={formData.manualScore} 
                                                            onChange={(e) => setFormData(prev => ({ ...prev, manualScore: parseInt(e.target.value) }))}
                                                            className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-amber-500"
                                                        />
                                                    </div>

                                                    <div className="space-y-3">
                                                        <FieldLabel icon={ShieldCheck}>Trust Level Classification</FieldLabel>
                                                        <select 
                                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-theme-primary/80 focus:outline-none focus:border-amber-500/50 appearance-none"
                                                            value={formData.manualLevel}
                                                            onChange={(e) => setFormData(prev => ({ ...prev, manualLevel: e.target.value }))}
                                                        >
                                                            <option value="" className="bg-black">Auto-calculate from score</option>
                                                            <option value="High Trust" className="bg-black">High Trust</option>
                                                            <option value="Moderate Trust" className="bg-black">Moderate Trust</option>
                                                            <option value="Probationary" className="bg-black">Probationary</option>
                                                            <option value="Highly Recommended" className="bg-black">Highly Recommended</option>
                                                            <option value="Needs More Info" className="bg-black">Needs More Info</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="glass-panel p-6 rounded-[2rem] border-white/5 opacity-60">
                                            <h4 className="text-[10px] font-black text-theme-primary/40 uppercase tracking-widest mb-4">Note on Automated Scoring</h4>
                                            <p className="text-xs text-theme-primary/30 leading-relaxed italic">
                                                When Manual Mode is OFF, the "Confidence Meter" is automatically calculated based on the completeness of branding, legal documents, financial reports, and verified status.
                                            </p>
                                        </div>
                                    </div>
                                )}

                            </form>
                        </div>

                        {/* Footer */}
                        <div className="p-8 border-t border-white/5 bg-black/20 flex items-center justify-between">
                            <div className="text-xs text-[var(--text-muted)] font-medium">
                                Last updated: {initialData?.updatedAt || 'New Profile'}
                            </div>
                            <div className="flex gap-4">
                                <button type="button" onClick={onClose} className="px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest text-[var(--text-muted)] hover:text-white transition-all">Discard</button>
                                <button 
                                    type="submit" 
                                    form="master-ngo-form" 
                                    className="flex items-center gap-3 bg-amber-500 hover:bg-amber-600 text-black px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-[0_12px_24px_-8px_rgba(245,158,11,0.4)] transform hover:-translate-y-1"
                                >
                                    <Save className="w-4 h-4" />
                                    {initialData ? 'Update NGO Portfolio' : 'Initialize Portfolio'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const LinkIcon = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
);

export default NGOFormModal;

