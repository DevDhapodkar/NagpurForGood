import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

const NGOFormModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
    const [formData, setFormData] = useState({
        name: '',
        contact: '',
        website: '',
        categories: '',
        description: '',
        image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop' // default template
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                categories: Array.isArray(initialData.categories) ? initialData.categories.join(', ') : initialData.categories || ''
            });
        } else {
            setFormData({
                name: '', contact: '', website: '', categories: '', description: '', 
                image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop'
            });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = {
            ...formData,
            categories: formData.categories.split(',').map(c => c.trim()).filter(Boolean)
        };
        onSubmit(payload);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="glass-panel w-full max-w-2xl rounded-3xl overflow-hidden flex flex-col max-h-[90vh]">
                
                <div className="px-6 py-4 flex items-center justify-between border-b border-[var(--border-color)] bg-[var(--bg-primary)]/50">
                    <h2 className="text-xl font-black">{initialData ? 'Edit Organization' : 'Add New Organization'}</h2>
                    <button onClick={onClose} className="p-2 rounded-xl text-[var(--text-secondary)] hover:bg-white/10 hover:text-white transition-all">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                    <form id="ngo-form" onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)]">Organization Name</label>
                            <input required name="name" value={formData.name} onChange={handleChange} className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500/50 transition-colors" placeholder="e.g. Hope Foundation" />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)]">Contact Number</label>
                                <input required name="contact" value={formData.contact} onChange={handleChange} className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500/50 transition-colors" placeholder="+91 0000 000000" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)]">Website URL</label>
                                <input name="website" value={formData.website} onChange={handleChange} className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500/50 transition-colors" placeholder="https://" />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)]">Categories (comma separated)</label>
                            <input name="categories" value={formData.categories} onChange={handleChange} className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500/50 transition-colors" placeholder="Education, Healthcare, Food" />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)]">Short Description</label>
                            <textarea required name="description" value={formData.description} onChange={handleChange} className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500/50 transition-colors resize-none h-24" placeholder="Brief summary of operations..." />
                        </div>
                    </form>
                </div>

                <div className="p-6 border-t border-[var(--border-color)] bg-[var(--bg-primary)]/50 flex justify-end gap-3">
                    <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl font-bold text-sm text-[var(--text-muted)] hover:text-white transition-colors">Cancel</button>
                    <button type="submit" form="ngo-form" className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-black px-6 py-2.5 rounded-xl font-black text-sm uppercase tracking-wider transition-colors">
                        <Save className="w-4 h-4" />
                        {initialData ? 'Update Profile' : 'Save Profile'}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default NGOFormModal;
