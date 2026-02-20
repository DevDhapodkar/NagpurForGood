import React from 'react';
import { ArrowRight, MapPin, CheckCircle2 } from 'lucide-react';

const NGOCard = ({ ngo, onClick }) => {
    const isVerified = ngo.certifications && ngo.certifications.length > 0;

    return (
        <div
            onClick={() => onClick(ngo)}
            className="glass-card rounded-3xl overflow-hidden cursor-pointer group flex flex-col h-full hover:z-30 relative"
        >
            <div className="relative h-56 w-full overflow-hidden">
                {/* Placeholder image that zooms slightly on hover */}
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out group-hover:scale-110"
                    style={{ backgroundImage: `url(${ngo.image || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800'})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-transparent opacity-90" />

                {/* Badges container */}
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    {ngo.categories.slice(0, 2).map((cat, idx) => (
                        <span key={idx} className="px-2.5 py-1 rounded-lg text-[10px] uppercase tracking-wider font-black bg-white/10 backdrop-blur-md border border-white/20 text-white">
                            {cat}
                        </span>
                    ))}
                    {isVerified && (
                        <span className="px-2.5 py-1 rounded-lg text-[10px] uppercase font-black bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Verified
                        </span>
                    )}
                </div>
            </div>

            <div className="p-7 flex flex-col flex-grow relative">
                <h3 className="text-2xl font-black text-white mb-3 group-hover:text-pink-400 transition-colors line-clamp-1">
                    {ngo.name}
                </h3>
                <p className="text-sm text-white/50 mb-6 line-clamp-2 leading-relaxed font-light">
                    {ngo.description || "Dedicated to social welfare and community support in Nagpur."}
                </p>

                <div className="mt-auto space-y-4">
                    <div className="flex items-start gap-2 text-xs text-white/40">
                        <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-violet-500" />
                        <span className="line-clamp-1">{ngo.address}</span>
                    </div>

                    <button className="w-full py-4 rounded-2xl bg-white/5 group-hover:bg-white/10 border border-white/10 group-hover:border-violet-500/30 text-white text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3">
                        Explore Portfolio
                        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NGOCard;
