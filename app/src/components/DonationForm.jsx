import React, { useState } from 'react';
import { Heart, User, Phone, Package, MessageSquare, CheckCircle, ArrowRight } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../utils/firebase';

const DonationForm = ({ ngoName, upiId, onBack }) => {
    const [status, setStatus] = useState('idle'); // idle, submitting, success
    const [formData, setFormData] = useState({
        name: '',
        contact: '',
        type: 'clothes',
        description: '',
        message: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('submitting');
        
        try {
            await addDoc(collection(db, 'donations'), {
                ngoName,
                ...formData,
                status: 'pending',
                createdAt: serverTimestamp(),
            });
            setStatus('success');
        } catch (error) {
            console.error('Error submitting donation:', error);
            alert('Something went wrong. Please try again.');
            setStatus('idle');
        }
    };

    if (status === 'success') {
        return (
            <div className="flex flex-col items-center justify-center py-12 space-y-6 text-center animate-in zoom-in-95 duration-500">
                <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center border border-green-500/20 mb-4">
                    <CheckCircle className="w-12 h-12" />
                </div>
                <h3 className="text-3xl font-black text-[var(--text-primary)]">Donation Reported!</h3>
                <p className="text-[var(--text-secondary)] text-lg max-w-sm mx-auto">
                    Thank you! Your donation request for {ngoName} has been received. Our team or the NGO will reach out shortly.
                </p>
                <button
                    onClick={onBack}
                    className="mt-8 py-4 px-10 rounded-2xl font-black text-white bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 shadow-xl transition-all transform hover:-translate-y-1"
                >
                    BACK TO PROFILE
                </button>
            </div>
        );
    }

    return (
        <div className="w-full max-w-xl mx-auto space-y-8 animate-in slide-in-from-right-12 duration-500">
            <div className="text-center">
                <div className="inline-flex p-3 rounded-2xl bg-orange-600/10 text-orange-400 mb-6 border border-orange-500/20">
                    <Heart className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-black text-[var(--text-primary)] mb-2">Support {ngoName}</h3>
                <p className="text-[var(--text-secondary)]">Report an item or in-kind donation to this NGO.</p>
            </div>


            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-black text-[var(--text-muted)] tracking-widest flex items-center gap-2">
                            <User className="w-3 h-3" /> Full Name
                        </label>
                        <input
                            required
                            type="text"
                            placeholder="John Doe"
                            className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-4 text-[var(--text-primary)] focus:outline-none focus:border-orange-500/50 transition-all font-medium"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    {/* Contact */}
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-black text-[var(--text-muted)] tracking-widest flex items-center gap-2">
                            <Phone className="w-3 h-3" /> Contact Number
                        </label>
                        <input
                            required
                            type="tel"
                            placeholder="+91 00000 00000"
                            className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-4 text-[var(--text-primary)] focus:outline-none focus:border-orange-500/50 transition-all font-medium"
                            value={formData.contact}
                            onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                        />
                    </div>
                </div>

                {/* Donation Type */}
                <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black text-[var(--text-muted)] tracking-widest flex items-center gap-2">
                        <Package className="w-3 h-3" /> What are you donating?
                    </label>
                    <select
                        className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-4 text-[var(--text-primary)] focus:outline-none focus:border-orange-500/50 transition-all font-medium appearance-none"
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    >
                        <option value="clothes">Clothes & Apparel</option>
                        <option value="food">Food & Groceries</option>
                        <option value="education">Education / Stationery</option>
                        <option value="medical">Medical Supplies</option>
                        <option value="money">Financial Aid (Interest)</option>
                        <option value="other">Other Essentials</option>
                    </select>
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black text-[var(--text-muted)] tracking-widest flex items-center gap-2">
                        <MessageSquare className="w-3 h-3" /> Details (Items, Quantity)
                    </label>
                    <textarea
                        required
                        placeholder="e.g. 5 bags of winter clothes, 10kg Rice"
                        rows="3"
                        className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-4 text-[var(--text-primary)] focus:outline-none focus:border-orange-500/50 transition-all font-medium"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <button
                        type="button"
                        onClick={onBack}
                        className="flex-1 py-4 px-6 rounded-2xl border-2 border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-primary)] font-black uppercase tracking-widest text-xs transition-all"
                    >
                        Back
                    </button>
                    <button
                        disabled={status === 'submitting'}
                        type="submit"
                        className="flex-[2] py-4 px-10 rounded-2xl font-black text-white bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 shadow-xl transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 uppercase tracking-widest text-sm"
                    >
                        {status === 'submitting' ? 'Submitting...' : 'Report Donation'}
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default DonationForm;
