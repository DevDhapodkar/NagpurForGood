import React from 'react';
import NGOCard from './NGOCard';

const NGOGrid = ({ ngos, onNgoClick }) => {
    if (ngos.length === 0) {
        return (
            <div className="w-full max-w-5xl mx-auto px-6 py-20 text-center glass-panel rounded-2xl">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 mb-4">
                    <svg className="w-8 h-8 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No NGOs Found</h3>
                <p className="text-white/60">We couldn't find any organizations matching your selected category.</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-5xl mx-auto px-6 pb-24 z-20 relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ngos.map((ngo) => (
                <NGOCard key={ngo.id} ngo={ngo} onClick={onNgoClick} />
            ))}
        </div>
    );
};

export default NGOGrid;
