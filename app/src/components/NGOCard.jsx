import React from 'react';

const NGOCard = ({ ngo, onClick }) => {
    return (
        <div
            onClick={() => onClick(ngo)}
            className="glass-card rounded-2xl overflow-hidden cursor-pointer group flex flex-col h-full"
        >
            <div className="relative h-48 w-full overflow-hidden">
                {/* Placeholder image that zooms slightly on hover */}
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
                    style={{ backgroundImage: `url(${ngo.image || 'https://via.placeholder.com/400x300?text=NGO'})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent opacity-90" />

                {/* Badges container */}
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    {ngo.categories.slice(0, 2).map((cat, idx) => (
                        <span key={idx} className="px-2.5 py-1 rounded-md text-[10px] uppercase tracking-wider font-bold bg-white/10 backdrop-blur-md border border-white/20 text-white">
                            {cat}
                        </span>
                    ))}
                    {ngo.categories.length > 2 && (
                        <span className="px-2 py-1 rounded-md text-[10px] uppercase font-bold bg-white/5 backdrop-blur-md text-white/70">
                            +{ngo.categories.length - 2}
                        </span>
                    )}
                </div>
            </div>

            <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-pink-300 transition-colors line-clamp-1 cursor-pointer">
                    {ngo.name}
                </h3>
                <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                    {ngo.description || "Dedicated to social welfare and community support in Nagpur."}
                </p>

                <div className="mt-auto space-y-3">
                    <div className="flex items-start gap-2 text-xs text-gray-500">
                        <svg className="w-4 h-4 mt-0.5 shrink-0 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="line-clamp-2">{ngo.address}</span>
                    </div>

                    <button className="w-full py-2.5 mt-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-medium transition-colors flex items-center justify-center gap-2 group-hover:border-violet-500/50">
                        <span>View Profile & Donate</span>
                        <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NGOCard;
