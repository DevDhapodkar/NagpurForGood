import React, { useState, useEffect, useMemo } from 'react';
import { X, Star, ShieldCheck, MessageSquare, MapPin, Save, AlertCircle, Award, ClipboardList, PenTool, RotateCcw, CheckCircle2 } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { calculateTrustScore } from '../utils/trustScore';

const AdminPRModal = ({ isOpen, onClose, ngo, onUpdate }) => {
    const [activeTab, setActiveTab] = useState('experience'); // 'experience' | 'report-card'
    const [formData, setFormData] = useState({
        experienceScore: 5,
        transparencyRating: 5,
        teamResponsiveness: 5,
        reputationScore: 5,
        fieldVisitDone: false,
        visitNotes: ''
    });
    const [overrides, setOverrides] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (ngo?.adminPR) {
            setFormData({
                experienceScore: ngo.adminPR.experienceScore || 5,
                transparencyRating: ngo.adminPR.transparencyRating || 5,
                teamResponsiveness: ngo.adminPR.teamResponsiveness || 5,
                reputationScore: ngo.adminPR.reputationScore || 5,
                fieldVisitDone: ngo.adminPR.fieldVisitDone || false,
                visitNotes: ngo.adminPR.visitNotes || ''
            });
        }
        if (ngo?.trustScoreOverrides) {
            setOverrides(ngo.trustScoreOverrides);
        }
    }, [ngo]);

    const scoreData = useMemo(() => {
        // Create a temporary NGO object with current local state to see live score updates
        const tempNGO = { ...ngo, adminPR: formData, trustScoreOverrides: overrides };
        return calculateTrustScore(tempNGO);
    }, [ngo, formData, overrides]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const ngoRef = doc(db, 'ngos', ngo.firestoreId || ngo.id);
            const prData = {
                ...formData,
                lastUpdated: new Date()
            };
            await updateDoc(ngoRef, { 
                adminPR: prData,
                trustScoreOverrides: overrides
            });
            onUpdate?.({ adminPR: prData, trustScoreOverrides: overrides });
            onClose();
        } catch (error) {
            console.error("PR Form failed:", error);
            alert("Failed to save PR data");
        } finally {
            setLoading(false);
        }
    };

    const handleOverrideChange = (label, value) => {
        if (value === '' || value === null) {
            const newOverrides = { ...overrides };
            delete newOverrides[label];
            setOverrides(newOverrides);
        } else {
            setOverrides(prev => ({ ...prev, [label]: parseInt(value) }));
        }
    };

    const RatingInput = ({ label, value, onChange, icon: Icon }) => (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-amber-500" />
                    <span className="text-[10px] uppercase font-black tracking-widest text-zinc-400">{label}</span>
                </div>
                <span className="text-xl font-black text-amber-500">{value}/10</span>
            </div>
            <input 
                type="range" 
                min="1" 
                max="10" 
                value={value} 
                onChange={(e) => onChange(parseInt(e.target.value))}
                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
        </div>
    );

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 backdrop-blur-xl animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-black/80" onClick={onClose} />
            <div className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800/50 rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className="p-8 border-b border-zinc-800/50 bg-gradient-to-r from-amber-500/10 to-transparent flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-white leading-tight">NGO Trust Evaluation</h2>
                                <p className="text-xs text-zinc-500 font-medium">{ngo?.name}</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <div className="text-3xl font-black text-amber-500 leading-none">{scoreData.score}%</div>
                            <div className="text-[10px] uppercase font-black tracking-[0.2em] text-zinc-500 mt-1">{scoreData.level}</div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2 p-1 bg-black/20 rounded-2xl border border-white/5 self-start">
                        <button 
                            onClick={() => setActiveTab('experience')}
                            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'experience' ? 'bg-amber-500 text-white shadow-lg shadow-amber-900/20' : 'text-zinc-500 hover:text-zinc-300'}`}
                        >
                            <div className="flex items-center gap-2">
                                <MessageSquare className="w-3 h-3" /> PR Experience
                            </div>
                        </button>
                        <button 
                            onClick={() => setActiveTab('report-card')}
                            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'report-card' ? 'bg-amber-500 text-white shadow-lg shadow-amber-900/20' : 'text-zinc-500 hover:text-zinc-300'}`}
                        >
                            <div className="flex items-center gap-2">
                                <ClipboardList className="w-3 h-3" /> Report Card & Overrides
                            </div>
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    {activeTab === 'experience' ? (
                        <div className="space-y-8 animate-in slide-in-from-left-4 duration-300">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <RatingInput 
                                    label="Our Experience Score" 
                                    value={formData.experienceScore} 
                                    onChange={(v) => setFormData(prev => ({ ...prev, experienceScore: v }))} 
                                    icon={Star}
                                />
                                <RatingInput 
                                    label="Transparency Level" 
                                    value={formData.transparencyRating} 
                                    onChange={(v) => setFormData(prev => ({ ...prev, transparencyRating: v }))} 
                                    icon={ShieldCheck}
                                />
                                <RatingInput 
                                    label="Team Responsiveness" 
                                    value={formData.teamResponsiveness} 
                                    onChange={(v) => setFormData(prev => ({ ...prev, teamResponsiveness: v }))} 
                                    icon={MessageSquare}
                                />
                                <RatingInput 
                                    label="Market Reputation" 
                                    value={formData.reputationScore} 
                                    onChange={(v) => setFormData(prev => ({ ...prev, reputationScore: v }))} 
                                    icon={Award}
                                />
                            </div>

                            <div className="pt-6 border-t border-zinc-800/50 space-y-6">
                                <div className="flex items-center justify-between p-5 bg-zinc-800/30 rounded-3xl border border-zinc-800/50 group transition-all hover:border-amber-500/30">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-2xl transition-all ${formData.fieldVisitDone ? 'bg-amber-500 text-white' : 'bg-zinc-800 text-zinc-500'}`}>
                                            <MapPin className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-black text-white">Physical Verification</div>
                                            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Has the team visited their office?</p>
                                        </div>
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, fieldVisitDone: !prev.fieldVisitDone }))}
                                        className={`w-14 h-8 rounded-full relative transition-all ${formData.fieldVisitDone ? 'bg-amber-600' : 'bg-zinc-700'}`}
                                    >
                                        <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all ${formData.fieldVisitDone ? 'left-7' : 'left-1'}`} />
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] uppercase font-black tracking-widest text-zinc-400 block px-2">Visit Notes & Internal Feedback</label>
                                    <textarea 
                                        value={formData.visitNotes}
                                        onChange={(e) => setFormData(prev => ({ ...prev, visitNotes: e.target.value }))}
                                        placeholder="Describe the field visit experience..."
                                        className="w-full bg-zinc-800/50 border border-zinc-800 rounded-[1.5rem] px-5 py-4 text-sm text-zinc-300 focus:outline-none focus:border-amber-500/50 min-h-[120px] resize-none"
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <div className="p-4 bg-blue-500/5 rounded-2xl border border-blue-500/10 flex gap-3 mb-6">
                                <PenTool className="w-5 h-5 text-blue-500 shrink-0" />
                                <p className="text-[10px] text-zinc-400 font-medium leading-relaxed">
                                    Manually override points for specific criteria. Leave blank to return to auto-calculated points. Total score is capped at 100%.
                                </p>
                            </div>

                            <div className="space-y-2">
                                {scoreData.breakdown.map((item) => (
                                    <div key={item.label} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${item.overridden ? 'bg-blue-500/5 border-blue-500/30' : 'bg-zinc-800/30 border-zinc-800/50'}`}>
                                        <div className="flex items-center gap-4">
                                            <div className={`p-1.5 rounded-lg ${item.achieved ? 'bg-green-500/10 text-green-500' : 'bg-zinc-800 text-zinc-600'}`}>
                                                <CheckCircle2 className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <div className="text-xs font-bold text-white flex items-center gap-2">
                                                    {item.label}
                                                    {item.overridden && <span className="text-[8px] uppercase px-1.5 py-0.5 rounded bg-blue-500 text-white tracking-widest">Manual</span>}
                                                </div>
                                                <div className="text-[9px] text-zinc-500 uppercase tracking-wider font-black">Value: {item.points} / {item.maxPoints}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input 
                                                type="number"
                                                min="0"
                                                max={item.maxPoints * 2}
                                                value={overrides[item.label] ?? ''}
                                                placeholder={item.achieved ? item.maxPoints : '0'}
                                                onChange={(e) => handleOverrideChange(item.label, e.target.value)}
                                                className="w-16 bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1 text-xs text-center font-bold text-amber-500 focus:outline-none focus:border-amber-500"
                                            />
                                            {item.overridden && (
                                                <button 
                                                    onClick={() => handleOverrideChange(item.label, '')}
                                                    className="p-1.5 rounded-lg hover:bg-zinc-700 text-zinc-500 transition-colors"
                                                    title="Reset to Auto"
                                                >
                                                    <RotateCcw className="w-3 h-3" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-8 border-t border-zinc-800/50 bg-zinc-900/50 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <AlertCircle className="w-4 h-4 text-zinc-500" />
                        <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Calculated Raw: {scoreData.rawScore} pts</span>
                    </div>
                    <div className="flex gap-4">
                        <button onClick={onClose} className="px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest text-zinc-400 hover:bg-zinc-800 transition-all">Cancel</button>
                        <button 
                            onClick={handleSubmit}
                            disabled={loading}
                            className="px-8 py-3 rounded-2xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 font-black text-white text-xs uppercase tracking-widest shadow-lg shadow-amber-900/20 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
                        >
                            <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Save Evaluation'}
                        </button>
                    </div>
                </div>
            </div>
            <button onClick={onClose} className="absolute top-8 right-8 p-3 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-all"><X className="w-6 h-6" /></button>
        </div>
    );
};

export default AdminPRModal;
