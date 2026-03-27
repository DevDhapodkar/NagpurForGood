import React, { useState } from 'react';
import { 
    Building2, User, Phone, Mail, Globe, MapPin, FileText, 
    Award, Shield, BadgeCheck, Plus, Trash2, ArrowRight, 
    ArrowLeft, CheckCircle, Heart, Upload, Instagram, Youtube,
    Facebook, Star, ChevronDown, Milestone, HeartPulse, Smartphone, Linkedin, Info
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../utils/firebase';
import FileUpload from '../components/common/FileUpload';

// ─── Steps Definition ────────────────────────────────────────────────────────
const STEPS = [
    { id: 1,  label: 'Branding',       icon: Building2 },
    { id: 2,  label: 'Contact',        icon: Phone },
    { id: 3,  label: 'Legal',          icon: Shield },
    { id: 4,  label: 'Financials',     icon: FileText },
    { id: 5,  label: 'Geo Reach',      icon: MapPin },
    { id: 6,  label: 'Leadership',     icon: User },
    { id: 7,  label: 'Programs',       icon: Star },
    { id: 8,  label: 'Impact',         icon: Heart },
    { id: 9,  label: 'Certificates',   icon: Award },
    { id: 10, label: 'Review',         icon: CheckCircle },
];

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

// ─── Section Header ─────────────────────────────────────────────────────────
const SectionHeader = ({ icon: Icon, title, subtitle }) => (
    <div className="flex items-start gap-4 pb-6 border-b border-[var(--border-color)]">
        <div className="p-3 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400 shrink-0">
            <Icon className="w-6 h-6" />
        </div>
        <div>
            <h2 className="text-2xl font-black font-serif">{title}</h2>
            <p className="text-[var(--text-secondary)] text-sm mt-1">{subtitle}</p>
        </div>
    </div>
);

// ─── Main Component ──────────────────────────────────────────────────────────
const RegisterNGO = () => {
    const [step, setStep] = useState(1);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const [form, setForm] = useState({
        // Step 1 – Branding
        name: '',
        tagline: '',
        description: '',
        longDescription: '',
        categories: [],
        logoUrl: '',
        imageUrl: '',
        // Step 2 – Contact
        chairperson: '',
        founder: '',
        foundedYear: '',
        contact: '',
        email: '',
        address: '',
        website: '',
        // Step 3 – Legal
        legalDetails: { 
            registrationNo: '', 
            csr1: '', 
            section80G: '', 
            section12A: '',
            panNo: '',
            tanNo: '',
            certificateUrl: ''
        },
        // Step 4 – Financials & Transparency
        financials: {
            upiId: '',
            bankName: '',
            auditStatus: 'Not Audited',
            transparencyLevel: 'Basic',
            reportsLink: ''
        },
        geoReach: [],
        // Step 6 – Leadership
        boardOfDirectors: [{ name: '', role: '', profileUrl: '', linkedin: '' }],
        teamAndLeadership: [{ name: '', role: '', profileUrl: '', linkedin: '' }],
        // Step 7 – Programs
        programs: [{ title: '', description: '', impact: '', location: '' }],
        drives: [{ title: '', description: '', location: '' }],
        volunteerOps: false,
        // Step 8 – Impact Stats
        impactStats: [{ label: '', value: '', icon: 'Heart' }],
        milestones: [{ year: '', title: '', description: '' }],
        // Step 9 – Certifications & Assets
        certifications: [],
        socialLinks: { instagram: '', facebook: '', youtube: '', email: '', linkedin: '' },
        appLinks: { android: '', ios: '' },
        awards: [''],
        testimonials: [{ name: '', quote: '', role: '' }]
    });

    const set = (key, value) => setForm(prev => ({ ...prev, [key]: value }));
    const setNested = (key, subKey, value) => setForm(prev => ({ ...prev, [key]: { ...prev[key], [subKey]: value } }));

    // Toggle arrays (categories, geoReach, certifications)
    const toggleArrayItem = (key, item) => {
        set(key, form[key].includes(item)
            ? form[key].filter(i => i !== item)
            : [...form[key], item]
        );
    };

    // Arrays Management
    const addListItem = (key, template) => set(key, [...form[key], template]);
    const removeListItem = (key, i) => set(key, form[key].filter((_, idx) => idx !== i));
    const updateListItem = (key, i, subKey, val) => {
        const updated = [...form[key]];
        updated[i] = { ...updated[i], [subKey]: val };
        set(key, updated);
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const slugId = form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now().toString(36);
            await addDoc(collection(db, 'ngos'), {
                ...form,
                id: slugId,
                verified: false,
                submittedAt: serverTimestamp(),
                createdAt: new Date().toISOString(),
                image: form.imageUrl || 'https://placehold.co/1200x600?text=' + encodeURIComponent(form.name),
                logo: form.logoUrl || '',
                mockUPI: form.financials.upiId,
                recentActivities: [],
            });
            setSubmitted(true);
        } catch (err) {
            console.error('Submission error:', err);
            alert('Something went wrong. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    // ─── Success Screen ───────────────────────────────────────────────────
    if (submitted) {
        return (
            <div className="min-h-screen bg-[var(--bg-primary)] pt-32 pb-20 flex items-center justify-center px-6">
                <div className="glass-panel p-12 rounded-[3rem] max-w-lg w-full text-center space-y-6 animate-in zoom-in-95 duration-700 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5 pointer-events-none" />
                    <div className="w-24 h-24 mx-auto rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                        <CheckCircle className="w-14 h-14 text-green-400" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black font-serif">Application Submitted!</h2>
                        <p className="text-[var(--text-secondary)] mt-3 leading-relaxed">
                            Thank you, <strong className="text-[var(--text-primary)]">{form.name}</strong>! Your application is now under review by our team. We'll verify your details and list your organization in the directory upon approval.
                        </p>
                    </div>
                    <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-500 text-sm font-medium">
                        ⏳ Typical review time: 2–5 business days
                    </div>
                    <a href="/" className="block w-full py-4 rounded-2xl font-black text-white bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 shadow-xl transition-all transform hover:-translate-y-0.5 uppercase tracking-widest text-sm">
                        Back to Home
                    </a>
                </div>
            </div>
        );
    }

    // ─── Step Renderer ────────────────────────────────────────────────────
    const renderStep = () => {
        switch (step) {
            // ── Step 1: Branding ────────────────────────────────────────
            case 1: return (
                <div className="space-y-6">
                    <SectionHeader icon={Building2} title="Branding & Identity" subtitle="Define how your organization appears in the directory." />
                    <InputField label="Organization Name" icon={Building2} required
                        placeholder="e.g. Vidarbha Welfare Society"
                        value={form.name}
                        onChange={e => set('name', e.target.value)}
                    />
                    <InputField label="Tagline / Motto" icon={Star}
                        placeholder="e.g. Empowering lives through education"
                        value={form.tagline}
                        onChange={e => set('tagline', e.target.value)}
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <FileUpload 
                            label="Organization Logo" icon={Upload} required
                            onUploadComplete={(url) => set('logoUrl', url)}
                            pathPrefix="logos"
                        />
                        <FileUpload 
                            label="Cover Image" icon={Upload} required
                            onUploadComplete={(url) => set('imageUrl', url)}
                            pathPrefix="covers"
                        />
                    </div>
                    <TextareaField label="Short Description" icon={FileText} required rows={2}
                        placeholder="A brief 1–2 sentence description shown in search results."
                        value={form.description}
                        onChange={e => set('description', e.target.value)}
                    />
                    <TextareaField label="Full Description / Mission" icon={FileText} rows={4}
                        placeholder="Detailed mission, vision and values of your NGO."
                        value={form.longDescription}
                        onChange={e => set('longDescription', e.target.value)}
                    />
                    <div>
                        <FieldLabel icon={Award} required>Focus Categories</FieldLabel>
                        <div className="flex flex-wrap gap-2">
                            {NGO_CATEGORIES.map(cat => (
                                <button key={cat} type="button"
                                    onClick={() => toggleArrayItem('categories', cat)}
                                    className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
                                        form.categories.includes(cat)
                                            ? 'bg-orange-500 text-white border-orange-500 shadow-lg'
                                            : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border-color)] hover:border-orange-500/50'
                                    }`}
                                >{cat}</button>
                            ))}
                        </div>

                        {/* Drives Subsection */}
                        <div className="mt-12 pt-10 border-t border-[var(--border-color)]">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-lg font-black font-serif flex items-center gap-2">
                                        <HeartPulse className="w-5 h-5 text-red-400" />
                                        Community Drives
                                    </h3>
                                    <p className="text-[var(--text-secondary)] text-xs mt-1">Specific events or community mobilization efforts (e.g. Tree Plantation Drive)</p>
                                </div>
                                <button type="button" onClick={() => addListItem('drives', { title: '', description: '', location: '' })} className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-500 text-[10px] font-black uppercase tracking-widest hover:bg-amber-500/20 transition-all shadow-sm">
                                    <Plus className="w-3 h-3" /> Add Drive
                                </button>
                            </div>
                            <div className="space-y-6">
                                {form.drives.map((d, i) => (
                                    <div key={i} className="glass-panel p-6 rounded-3xl relative animate-in slide-in-from-top-2 duration-300">
                                        <button type="button" onClick={() => removeListItem('drives', i)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow-lg"><Trash2 className="w-3 h-3" /></button>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <InputField label="Drive Title" value={d.title} onChange={e => updateListItem('drives', i, 'title', e.target.value)} placeholder="e.g. Winter Clothes Collection 2024" />
                                            <InputField label="Location/Area" value={d.location} onChange={e => updateListItem('drives', i, 'location', e.target.value)} placeholder="e.g. East Nagpur" />
                                            <div className="md:col-span-2">
                                                <TextareaField label="Brief Description" value={d.description} onChange={e => updateListItem('drives', i, 'description', e.target.value)} placeholder="What was the goal and outcome of this drive?" rows={2} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            );

            // ── Step 2: Contact ─────────────────────────────────────────
            case 2: return (
                <div className="space-y-6">
                    <SectionHeader icon={Phone} title="Contact & Location" subtitle="Official contact details for NagpurGoodOrg verification." />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <InputField label="Chairperson / President" icon={User} required
                            placeholder="Full Name"
                            value={form.chairperson}
                            onChange={e => set('chairperson', e.target.value)}
                        />
                        <InputField label="Founder Name" icon={User}
                            placeholder="Full Name"
                            value={form.founder}
                            onChange={e => set('founder', e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <InputField label="Year Founded" icon={Star} required
                            type="number" placeholder="2010"
                            value={form.foundedYear}
                            onChange={e => set('foundedYear', e.target.value)}
                        />
                        <InputField label="Phone Number" icon={Phone} required
                            type="tel" placeholder="+91 98..."
                            value={form.contact}
                            onChange={e => set('contact', e.target.value)}
                        />
                        <InputField label="Official Email" icon={Mail} required
                            type="email" placeholder="hr@ngo.org"
                            value={form.email}
                            onChange={e => set('email', e.target.value)}
                        />
                    </div>
                    <TextareaField label="Full Address" icon={MapPin} required rows={2}
                        placeholder="NGO Head Office Address"
                        value={form.address}
                        onChange={e => set('address', e.target.value)}
                    />
                    <InputField label="Website URL" icon={Globe}
                        type="url" placeholder="https://www.yourngo.org"
                        value={form.website}
                        onChange={e => set('website', e.target.value)}
                    />
                </div>
            );

            // ── Step 3: Legal ───────────────────────────────────────────
            case 3: return (
                <div className="space-y-6">
                    <SectionHeader icon={Shield} title="Legal Compliance" subtitle="Provide registration details for verification." />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <InputField label="Registration Number" icon={FileText} required
                            placeholder="e.g. MH/NAG/..."
                            value={form.legalDetails.registrationNo}
                            onChange={e => setNested('legalDetails', 'registrationNo', e.target.value)}
                        />
                        <InputField label="CSR-1 Number" icon={Shield}
                            placeholder="CSR-1 ID"
                            value={form.legalDetails.csr1}
                            onChange={e => setNested('legalDetails', 'csr1', e.target.value)}
                        />
                        <InputField label="80G Certificate No." icon={Award}
                            value={form.legalDetails.section80G}
                            onChange={e => setNested('legalDetails', 'section80G', e.target.value)}
                        />
                        <InputField label="12A Certificate No." icon={Award}
                            value={form.legalDetails.section12A}
                            onChange={e => setNested('legalDetails', 'section12A', e.target.value)}
                        />
                        <InputField label="PAN Card Number" icon={FileText}
                            placeholder="ABCDE1234F"
                            value={form.legalDetails.panNo}
                            onChange={e => setNested('legalDetails', 'panNo', e.target.value)}
                        />
                        <InputField label="TAN Number" icon={FileText}
                            value={form.legalDetails.tanNo}
                            onChange={e => setNested('legalDetails', 'tanNo', e.target.value)}
                        />
                        <FileUpload 
                            label="Registration Certificate (PDF/Image)" icon={Upload}
                            accept="image/*,.pdf"
                            onUploadComplete={(url) => setNested('legalDetails', 'certificateUrl', url)}
                            pathPrefix="certificates"
                        />
                    </div>
                </div>
            );

            // ── Step 4: Financials ──────────────────────────────────────
            case 4: return (
                <div className="space-y-6">
                    <SectionHeader icon={FileText} title="Financials & Transparency" subtitle="Details for donation routing and trust building." />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <InputField label="UPI ID for Donations" icon={Heart} required
                            placeholder="ngo@upi"
                            value={form.financials.upiId}
                            onChange={e => setNested('financials', 'upiId', e.target.value)}
                        />
                        <InputField label="Bank Name" icon={Building2}
                            placeholder="State Bank of India"
                            value={form.financials.bankName}
                            onChange={e => setNested('financials', 'bankName', e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <FieldLabel icon={BadgeCheck}>Audit Status</FieldLabel>
                            <select 
                                value={form.financials.auditStatus}
                                onChange={e => setNested('financials', 'auditStatus', e.target.value)}
                                className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-4 text-[var(--text-primary)] focus:outline-none focus:border-orange-500/50 transition-all text-sm"
                            >
                                <option>Not Audited</option>
                                <option>Audited (Last FY)</option>
                                <option>Regularly Audited</option>
                            </select>
                        </div>
                        <FileUpload 
                            label="Recent Audit Report" icon={Upload}
                            accept=".pdf,.doc,.docx"
                            onUploadComplete={(url) => setNested('financials', 'reportsLink', url)}
                            pathPrefix="reports"
                        />
                    </div>
                </div>
            );

            // ── Step 5: Geo Reach ───────────────────────────────────────
            case 5: return (
                <div className="space-y-6">
                    <SectionHeader icon={MapPin} title="Geographic Focus" subtitle="Where does your NGO carry out its primary activities in Nagpur?" />
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {NAGPUR_AREAS.map(area => (
                            <button key={area} type="button"
                                onClick={() => toggleArrayItem('geoReach', area)}
                                className={`p-4 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                                    form.geoReach.includes(area)
                                        ? 'bg-orange-500 text-white border-orange-500 shadow-lg'
                                        : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border-color)] hover:border-orange-500/40'
                                }`}
                            >{area}</button>
                        ))}
                    </div>
                </div>
            );

            // ── Step 6: Leadership ───────────────────────────────────────
            case 6: return (
                <div className="space-y-12">
                    <div>
                        <SectionHeader icon={User} title="Board of Directors" subtitle="Add individual members of your governing board." />
                        <div className="space-y-4 mt-6">
                            {form.boardOfDirectors.map((l, i) => (
                                <div key={i} className="glass-panel p-6 rounded-2xl relative space-y-4">
                                    <button type="button" onClick={() => removeListItem('boardOfDirectors', i)} className="absolute top-4 right-4 text-red-400 opacity-50 hover:opacity-100"><Trash2 className="w-4 h-4" /></button>
                                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                                        <InputField label="Full Name" icon={User} value={l.name} onChange={e => updateListItem('boardOfDirectors', i, 'name', e.target.value)} />
                                        <InputField label="Role" icon={Award} value={l.role} onChange={e => updateListItem('boardOfDirectors', i, 'role', e.target.value)} />
                                        <InputField label="Profile Link" icon={Globe} value={l.profileUrl} onChange={e => updateListItem('boardOfDirectors', i, 'profileUrl', e.target.value)} />
                                        <InputField label="LinkedIn" icon={Linkedin} value={l.linkedin} onChange={e => updateListItem('boardOfDirectors', i, 'linkedin', e.target.value)} />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button type="button" onClick={() => addListItem('boardOfDirectors', { name: '', role: '', profileUrl: '', linkedin: '' })} className="w-full py-4 rounded-2xl border-2 border-dashed border-[var(--border-color)] text-[var(--text-muted)] hover:text-orange-400 hover:border-orange-500/50 transition-all font-bold flex items-center justify-center gap-2 mt-4">
                            <Plus className="w-4 h-4" /> Add Board Member
                        </button>
                    </div>

                    <div className="pt-10 border-t border-[var(--border-color)]">
                        <SectionHeader icon={User} title="Team & Leadership" subtitle="Add individual members of your operational team." />
                        <div className="space-y-4 mt-6">
                            {form.teamAndLeadership.map((l, i) => (
                                <div key={i} className="glass-panel p-6 rounded-2xl relative space-y-4">
                                    <button type="button" onClick={() => removeListItem('teamAndLeadership', i)} className="absolute top-4 right-4 text-red-400 opacity-50 hover:opacity-100"><Trash2 className="w-4 h-4" /></button>
                                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                                        <InputField label="Full Name" icon={User} value={l.name} onChange={e => updateListItem('teamAndLeadership', i, 'name', e.target.value)} />
                                        <InputField label="Role" icon={Award} value={l.role} onChange={e => updateListItem('teamAndLeadership', i, 'role', e.target.value)} />
                                        <InputField label="Profile Link" icon={Globe} value={l.profileUrl} onChange={e => updateListItem('teamAndLeadership', i, 'profileUrl', e.target.value)} />
                                        <InputField label="LinkedIn" icon={Linkedin} value={l.linkedin} onChange={e => updateListItem('teamAndLeadership', i, 'linkedin', e.target.value)} />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button type="button" onClick={() => addListItem('teamAndLeadership', { name: '', role: '', profileUrl: '', linkedin: '' })} className="w-full py-4 rounded-2xl border-2 border-dashed border-[var(--border-color)] text-[var(--text-muted)] hover:text-orange-400 hover:border-orange-500/50 transition-all font-bold flex items-center justify-center gap-2 mt-4">
                            <Plus className="w-4 h-4" /> Add Team Member
                        </button>
                    </div>
                </div>
            );

            // ── Step 7: Programs ───────────────────────────────────────
            case 7: return (
                <div className="space-y-6">
                    <SectionHeader icon={Star} title="Key Programs" subtitle="Highlight your ongoing projects." />
                    <div className="space-y-4">
                        {form.programs.map((p, i) => (
                            <div key={i} className="glass-panel p-6 rounded-2xl relative space-y-4">
                                <button type="button" onClick={() => removeListItem('programs', i)} className="absolute top-4 right-4 text-red-400 opacity-50 hover:opacity-100"><Trash2 className="w-4 h-4" /></button>
                                <InputField label="Program Title" icon={Star} value={p.title} onChange={e => updateListItem('programs', i, 'title', e.target.value)} />
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <InputField label="Impact Reach" icon={Heart} placeholder="e.g. 500+ women" value={p.impact} onChange={e => updateListItem('programs', i, 'impact', e.target.value)} />
                                    <InputField label="Primary Location" icon={MapPin} value={p.location} onChange={e => updateListItem('programs', i, 'location', e.target.value)} />
                                </div>
                                <TextareaField label="Brief Description" icon={FileText} rows={2} value={p.description} onChange={e => updateListItem('programs', i, 'description', e.target.value)} />
                            </div>
                        ))}
                    </div>
                    <button type="button" onClick={() => addListItem('programs', { title: '', description: '', impact: '', location: '' })} className="w-full py-4 rounded-2xl border-2 border-dashed border-[var(--border-color)] text-[var(--text-muted)] hover:text-orange-400 hover:border-orange-500/50 transition-all font-bold flex items-center justify-center gap-2">
                        <Plus className="w-4 h-4" /> Add Program
                    </button>

                    <div className="mt-8 flex items-center justify-between p-6 glass-panel rounded-3xl border-orange-500/20">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-2xl bg-orange-500/10 text-orange-400">
                                <Heart className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black font-serif">Volunteer Opportunities</h3>
                                <p className="text-[var(--text-secondary)] text-xs">Do you offer active volunteer roles for citizens?</p>
                            </div>
                        </div>
                        <button 
                            type="button"
                            onClick={() => set('volunteerOps', !form.volunteerOps)}
                            className={`px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${form.volunteerOps ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' : 'bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-muted)]'}`}
                        >
                            {form.volunteerOps ? 'Enabled' : 'Disabled'}
                        </button>
                    </div>

                    {/* Drives Subsection */}
                    <div className="mt-12 pt-10 border-t border-[var(--border-color)]">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-black font-serif flex items-center gap-2">
                                    <HeartPulse className="w-5 h-5 text-red-400" />
                                    Community Drives
                                </h3>
                                <p className="text-[var(--text-secondary)] text-xs mt-1">Specific events or community mobilization efforts (e.g. Tree Plantation Drive)</p>
                            </div>
                            <button type="button" onClick={() => addListItem('drives', { title: '', description: '', location: '' })} className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-500 text-[10px] font-black uppercase tracking-widest hover:bg-amber-500/20 transition-all shadow-sm">
                                <Plus className="w-3 h-3" /> Add Drive
                            </button>
                        </div>
                        <div className="space-y-6">
                            {form.drives.map((d, i) => (
                                <div key={i} className="glass-panel p-6 rounded-3xl relative animate-in slide-in-from-top-2 duration-300">
                                    <button type="button" onClick={() => removeListItem('drives', i)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow-lg z-10"><Trash2 className="w-3 h-3" /></button>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <InputField label="Drive Title" value={d.title} onChange={e => updateListItem('drives', i, 'title', e.target.value)} placeholder="e.g. Winter Clothes Collection 2024" />
                                        <InputField label="Location/Area" value={d.location} onChange={e => updateListItem('drives', i, 'location', e.target.value)} placeholder="e.g. East Nagpur" />
                                        <div className="md:col-span-2">
                                            <TextareaField label="Brief Description" value={d.description} onChange={e => updateListItem('drives', i, 'description', e.target.value)} placeholder="What was the goal and outcome of this drive?" rows={2} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            );

            // ── Step 8: Impact Stats ────────────────────────────────────
            case 8: return (
                <div className="space-y-6">
                    <SectionHeader icon={Heart} title="Impact Metrics" subtitle="Quantifiable data that highlights your work." />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {form.impactStats.map((s, i) => (
                            <div key={i} className="glass-panel p-5 rounded-2xl relative flex gap-4">
                                <button type="button" onClick={() => removeListItem('impactStats', i)} className="absolute top-2 right-2 text-red-400 opacity-30 hover:opacity-100"><Trash2 className="w-3 h-3" /></button>
                                <div className="flex-1 space-y-3">
                                    <InputField label="Impact Value" placeholder="e.g. 10k+" value={s.value} onChange={e => updateListItem('impactStats', i, 'value', e.target.value)} />
                                    <InputField label="Metric Label" placeholder="e.g. Trees Planted" value={s.label} onChange={e => updateListItem('impactStats', i, 'label', e.target.value)} />
                                </div>
                            </div>
                        ))}
                    </div>
                    <button type="button" onClick={() => addListItem('impactStats', { label: '', value: '', icon: 'Heart' })} className="w-full py-4 rounded-2xl border-2 border-dashed border-[var(--border-color)] text-[var(--text-muted)] hover:text-orange-400 hover:border-orange-500/50 transition-all font-bold flex items-center justify-center gap-2">
                        <Plus className="w-4 h-4" /> Add Impact Statistic
                    </button>

                    {/* Milestones Subsection */}
                    <div className="mt-12 pt-10 border-t border-[var(--border-color)]">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-black font-serif flex items-center gap-2">
                                    <Milestone className="w-5 h-5 text-amber-500" />
                                    Organizational Milestones
                                </h3>
                                <p className="text-[var(--text-secondary)] text-xs mt-1">Key achievements and historical timeline of the NGO</p>
                            </div>
                            <button type="button" onClick={() => addListItem('milestones', { year: '', title: '', description: '' })} className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-500 text-[10px] font-black uppercase tracking-widest hover:bg-amber-500/20 transition-all shadow-sm">
                                <Plus className="w-3 h-3" /> Add Milestone
                            </button>
                        </div>
                        <div className="space-y-6">
                            {form.milestones.map((m, i) => (
                                <div key={i} className="glass-panel p-6 rounded-3xl relative animate-in slide-in-from-top-2 duration-300">
                                    <button type="button" onClick={() => removeListItem('milestones', i)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow-lg z-10"><Trash2 className="w-3 h-3" /></button>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                        <InputField label="Year" value={m.year} onChange={e => updateListItem('milestones', i, 'year', e.target.value)} placeholder="2024" />
                                        <div className="md:col-span-3">
                                            <InputField label="Milestone Title" value={m.title} onChange={e => updateListItem('milestones', i, 'title', e.target.value)} placeholder="e.g. Awarded Best City NGO" />
                                        </div>
                                        <div className="md:col-span-4">
                                            <TextareaField label="Description" value={m.description} onChange={e => updateListItem('milestones', i, 'description', e.target.value)} placeholder="Context or details about this milestone..." rows={2} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            );

            // ── Step 9: Certificates ────────────────────────────────────
            case 9: return (
                <div className="space-y-6">
                    <SectionHeader icon={Award} title="Certifications & Socials" subtitle="Build trust through verification and social presence." />
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {CERTIFICATIONS_LIST.map(cert => (
                            <button key={cert} type="button"
                                onClick={() => toggleArrayItem('certifications', cert)}
                                className={`p-4 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                                    form.certifications.includes(cert)
                                        ? 'bg-orange-500 text-white border-orange-500 shadow-lg'
                                        : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border-color)] hover:border-orange-500/40'
                                }`}
                            >{cert}</button>
                        ))}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
                        <InputField label="Instagram" icon={Instagram} placeholder="URL" value={form.socialLinks.instagram} onChange={e => setNested('socialLinks', 'instagram', e.target.value)} />
                        <InputField label="Facebook" icon={Facebook} placeholder="URL" value={form.socialLinks.facebook} onChange={e => setNested('socialLinks', 'facebook', e.target.value)} />
                        <InputField label="YouTube" icon={Youtube} placeholder="URL" value={form.socialLinks.youtube} onChange={e => setNested('socialLinks', 'youtube', e.target.value)} />
                        <InputField label="LinkedIn (Page)" icon={Linkedin} placeholder="URL" value={form.socialLinks.linkedin} onChange={e => setNested('socialLinks', 'linkedin', e.target.value)} />
                    </div>

                    <div className="mt-12 pt-10 border-t border-[var(--border-color)]">
                        <SectionHeader icon={Smartphone} title="Mobile Applications" subtitle="Provide links to your official apps for extra trust points." />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                            <InputField label="Play Store (Android)" icon={Globe} placeholder="https://play.google.com/..." value={form.appLinks.android} onChange={e => setNested('appLinks', 'android', e.target.value)} />
                            <InputField label="App Store (iOS)" icon={Globe} placeholder="https://apps.apple.com/..." value={form.appLinks.ios} onChange={e => setNested('appLinks', 'ios', e.target.value)} />
                        </div>
                    </div>

                    <div className="mt-12 pt-10 border-t border-[var(--border-color)]">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-black font-serif flex items-center gap-2">
                                <Award className="w-5 h-5 text-amber-500" />
                                Awards & Recognition
                            </h3>
                            <button type="button" onClick={() => addListItem('awards', '')} className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 transition-all">
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="space-y-3">
                            {form.awards.map((a, i) => (
                                <div key={i} className="flex gap-3">
                                    <input value={a} onChange={e => {
                                        const updated = [...form.awards];
                                        updated[i] = e.target.value;
                                        set('awards', updated);
                                    }} placeholder="e.g. Nagpur NGO Excellence Award 2023" className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-3 text-sm focus:outline-none focus:border-orange-500/50 transition-all" />
                                    <button type="button" onClick={() => removeListItem('awards', i)} className="p-3 text-red-400 opacity-50 hover:opacity-100"><Trash2 className="w-4 h-4" /></button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-12 pt-10 border-t border-[var(--border-color)]">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-black font-serif flex items-center gap-2">
                                <Mail className="w-5 h-5 text-blue-500" />
                                Beneficiary Testimonials
                            </h3>
                            <button type="button" onClick={() => addListItem('testimonials', { name: '', quote: '', role: '' })} className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-all">
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            {form.testimonials.map((t, i) => (
                                <div key={i} className="glass-panel p-5 rounded-2xl relative space-y-3">
                                    <button type="button" onClick={() => removeListItem('testimonials', i)} className="absolute top-4 right-4 text-red-400 opacity-50 hover:opacity-100"><Trash2 className="w-4 h-4" /></button>
                                    <div className="grid grid-cols-2 gap-4">
                                        <InputField label="Name" value={t.name} onChange={e => updateListItem('testimonials', i, 'name', e.target.value)} />
                                        <InputField label="Role/Relation" placeholder="e.g. Student" value={t.role} onChange={e => updateListItem('testimonials', i, 'role', e.target.value)} />
                                    </div>
                                    <TextareaField label="Quote" rows={2} value={t.quote} onChange={e => updateListItem('testimonials', i, 'quote', e.target.value)} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            );

            // ── Step 10: Review ──────────────────────────────────────────
            case 10: return (
                <div className="space-y-6 pb-6">
                    <SectionHeader icon={CheckCircle} title="Final Application Review" subtitle="Verify all details. Once submitted, our PR team will review your application for NagpurGoodOrg listing." />
                    <div className="glass-panel rounded-3xl overflow-hidden border-orange-500/20 bg-orange-500/5 p-8">
                        <div className="flex items-center gap-6 mb-8">
                            <div className="w-20 h-20 rounded-3xl bg-white/10 overflow-hidden border border-white/20 shadow-xl">
                                {form.logoUrl ? <img src={form.logoUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center font-black text-2xl uppercase">{form.name?.[0]}</div>}
                            </div>
                            <div>
                                <h3 className="text-3xl font-black font-serif tracking-tight">{form.name || 'Your NGO Name'}</h3>
                                <p className="text-orange-400 font-bold text-sm tracking-wide uppercase mt-1">Partnership Application</p>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                            <div className="space-y-4">
                                <div><label className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest block mb-1">Chairperson</label> <div className="font-bold">{form.chairperson}</div></div>
                                <div><label className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest block mb-1">Registration</label> <div className="font-bold">{form.legalDetails.registrationNo}</div></div>
                                <div><label className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest block mb-1">UPI for Donations</label> <div className="font-bold text-orange-400">{form.financials.upiId}</div></div>
                            </div>
                            <div className="space-y-4">
                                <div><label className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest block mb-1">Contact</label> <div className="font-bold">{form.contact} | {form.email}</div></div>
                                <div><label className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest block mb-1">Areas Covered</label> <div className="font-bold">{form.geoReach.join(', ') || '—'}</div></div>
                            </div>
                        </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex gap-4 items-start">
                        <Shield className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                        <p className="text-xs text-amber-600 font-medium">By submitting, you declare that all information provided is accurate and you authorize the NagpurGoodOrg team to display this data in the public directory upon verification.</p>
                    </div>
                </div>
            );

            default: return null;
        }
    };

    const canProceed = () => {
        if (step === 1) return form.name.trim() && form.description.trim() && form.categories.length > 0;
        if (step === 2) return form.chairperson.trim() && form.foundedYear && form.contact.trim() && form.email.trim();
        if (step === 3) return form.legalDetails.registrationNo.trim();
        if (step === 4) return form.financials.upiId.trim();
        if (step === 5) return form.geoReach.length > 0;
        return true;
    };

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans pt-32 pb-20">
            <div className="max-w-3xl mx-auto px-6">

                {/* Page Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400 mb-5">
                        <Building2 className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl font-black font-serif tracking-tight mb-3">Register Your NGO</h1>
                    <p className="text-[var(--text-secondary)] max-w-lg mx-auto">
                        Submit your organization's details to be listed in our verified NGO directory. Our team will review and approve your profile.
                    </p>
                </div>

                {/* Trust Score Banner */}
                <div className="mb-10 p-6 rounded-[2.5rem] bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-6 group hover:border-amber-500/40 transition-all shadow-xl shadow-amber-900/5">
                    <div className="flex items-center gap-4 text-center sm:text-left">
                        <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-900/20 group-hover:scale-110 transition-transform shrink-0">
                            <BadgeCheck className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-sm font-black uppercase tracking-widest text-[var(--text-primary)]">Maximize Your Trust Score</h3>
                            <p className="text-[10px] text-[var(--text-muted)] mt-1 font-medium leading-relaxed">Complete all fields to earn the <span className="text-amber-500 font-black">"Highly Trusted"</span> badge automatically.</p>
                        </div>
                    </div>
                    <Link to="/trust-score" className="px-6 py-2.5 rounded-xl bg-white/5 border border-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-widest hover:bg-amber-500 hover:text-white transition-all whitespace-nowrap shadow-sm hover:shadow-amber-500/20">
                        Learn How it Works
                    </Link>
                </div>

                {/* Step Progress */}
                <div className="flex items-center justify-between mb-10 overflow-x-auto pb-2">
                    {STEPS.map((s, idx) => {
                        const Icon = s.icon;
                        const isDone = step > s.id;
                        const isActive = step === s.id;
                        return (
                            <React.Fragment key={s.id}>
                                <div className="flex flex-col items-center gap-1.5 shrink-0">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all duration-300 ${
                                        isDone ? 'bg-green-500 border-green-500 text-white' :
                                        isActive ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/30 scale-110' :
                                        'bg-[var(--bg-secondary)] border-[var(--border-color)] text-[var(--text-muted)]'
                                    }`}>
                                        {isDone ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
                                    </div>
                                    <span className={`text-[9px] font-black uppercase tracking-widest hidden sm:block ${isActive ? 'text-orange-400' : isDone ? 'text-green-400' : 'text-[var(--text-muted)]'}`}>
                                        {s.label}
                                    </span>
                                </div>
                                {idx < STEPS.length - 1 && (
                                    <div className={`flex-1 h-0.5 mx-2 rounded-full transition-all duration-500 ${step > s.id ? 'bg-green-500' : 'bg-[var(--border-color)]'}`} />
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>

                {/* Form Content */}
                <div className="glass-panel p-8 sm:p-10 rounded-[2.5rem] shadow-2xl animate-in slide-in-from-bottom-4 duration-500">
                    {renderStep()}
                    
                    {/* Navigation Buttons */}
                    <div className="flex gap-4 mt-10 pt-6 border-t border-[var(--border-color)]">
                        {step > 1 && (
                            <button type="button" onClick={() => setStep(s => s - 1)}
                                className="flex-1 py-4 rounded-2xl border-2 border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-muted)] font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2">
                                <ArrowLeft className="w-4 h-4" /> Back
                            </button>
                        )}
                        {step < STEPS.length ? (
                            <button type="button"
                                disabled={!canProceed()}
                                onClick={() => setStep(s => s + 1)}
                                className="flex-[2] py-4 rounded-2xl font-black text-white text-xs uppercase tracking-widest bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 shadow-xl transition-all transform hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2">
                                Continue <ArrowRight className="w-4 h-4" />
                            </button>
                        ) : (
                            <button type="button"
                                disabled={submitting}
                                onClick={handleSubmit}
                                className="flex-[2] py-4 rounded-2xl font-black text-white text-xs uppercase tracking-widest bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 shadow-xl transition-all transform hover:-translate-y-0.5 disabled:opacity-50 flex items-center justify-center gap-2">
                                {submitting ? (
                                    <><div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Submitting...</>
                                ) : (
                                    <><CheckCircle className="w-4 h-4" /> Submit Application</>
                                )}
                            </button>
                        )}
                    </div>
                </div>

                <p className="text-center text-xs text-[var(--text-muted)] mt-6">
                    Already registered? <a href="/directory" className="text-orange-400 font-bold hover:underline">View our directory</a>
                </p>
            </div>
        </div>
    );
};

export default RegisterNGO;
