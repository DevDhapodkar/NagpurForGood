import React, { useEffect, useState } from 'react';

const NGOModal = ({ ngo, onClose }) => {
    const [showDonation, setShowDonation] = useState(false);

    // Lock body scroll when modal is open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    if (!ngo) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Container */}
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-panel rounded-2xl shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200">

                {/* Cover Image */}
                <div className="relative h-48 sm:h-64 w-full shrink-0">
                    <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${ngo.image})` }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/50 to-transparent" />

                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-full glass-btn text-white hover:text-pink-400 z-10"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <div className="absolute bottom-6 left-6 right-6">
                        <h2 className="text-3xl font-extrabold text-white mb-2">{ngo.name}</h2>
                        <div className="flex flex-wrap gap-2">
                            {ngo.categories.map((cat, idx) => (
                                <span key={idx} className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-white/90">
                                    {cat}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-8 flex-1">
                    {!showDonation ? (
                        <div className="space-y-8">
                            {/* About section */}
                            <div>
                                <h4 className="text-sm uppercase tracking-widest text-violet-400 font-bold mb-3">About</h4>
                                <p className="text-white/80 leading-relaxed text-sm sm:text-base">
                                    {ngo.description}
                                </p>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-5 rounded-xl bg-white/5 border border-white/5">
                                <div>
                                    <h4 className="text-xs uppercase text-gray-500 font-bold mb-1">President / Contact Info</h4>
                                    <p className="text-white text-sm font-medium">{ngo.president}</p>
                                    <p className="text-white/70 text-sm mt-1 flex items-center gap-2">
                                        <svg className="w-4 h-4 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                        {ngo.contact}
                                    </p>
                                </div>
                                <div>
                                    <h4 className="text-xs uppercase text-gray-500 font-bold mb-1">Registered Address</h4>
                                    <p className="text-white text-sm flex items-start gap-2">
                                        <svg className="w-4 h-4 mt-0.5 shrink-0 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <span>{ngo.address}</span>
                                    </p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-white/5">
                                <a
                                    href={ngo.website !== "https://example.com" && ngo.website ? ngo.website : `https://www.google.com/search?q=${encodeURIComponent(ngo.name + " Nagpur ngo")}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 py-3 px-4 rounded-xl font-bold text-center border-2 border-white/10 hover:border-white/30 text-white transition-colors flex items-center justify-center gap-2"
                                >
                                    Visit Website
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </a>
                                <button
                                    onClick={() => setShowDonation(true)}
                                    className="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.3)] hover:shadow-[0_0_25px_rgba(236,72,153,0.5)] transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                    Support Now
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* Donation View */
                        <div className="flex flex-col items-center justify-center py-4 space-y-6 animate-in slide-in-from-right-8 duration-300">
                            <div className="text-center">
                                <h3 className="text-2xl font-bold text-white mb-2">Support {ngo.name}</h3>
                                <p className="text-white/60 text-sm">Scan the QR code below using any UPI app.</p>
                            </div>

                            <div className="p-4 bg-white rounded-2xl shadow-xl relative group">
                                {/* Mock QR generator using an open API for realistic UI */}
                                <img
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=${ngo.mockUPI}&pn=${encodeURIComponent(ngo.name)}`}
                                    alt="UPI QR Code"
                                    className="w-48 h-48 sm:w-56 sm:h-56 rounded-lg pointer-events-none"
                                />
                                <div className="absolute inset-0 bg-white/80 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                                    <span className="text-emerald-600 font-bold bg-emerald-100 px-4 py-2 rounded-full text-sm outline border border-emerald-200">Mock Data Only</span>
                                </div>
                            </div>

                            <div className="w-full max-w-xs flex flex-col gap-3">
                                <div className="glass-panel p-3 rounded-xl flex items-center justify-between">
                                    <span className="text-sm text-gray-400">UPI ID</span>
                                    <span className="text-sm text-white font-mono font-bold bg-white/10 px-2 py-1 rounded">{ngo.mockUPI}</span>
                                </div>

                                <button
                                    onClick={() => setShowDonation(false)}
                                    className="py-3 w-full rounded-xl font-bold text-white/80 hover:text-white border border-white/10 hover:bg-white/5 transition-colors"
                                >
                                    Back to Details
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NGOModal;
