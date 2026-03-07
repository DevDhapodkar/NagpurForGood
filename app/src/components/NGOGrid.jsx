import React from 'react';
import NGOCard from './NGOCard';

const NGOGrid = ({ ngos }) => {
    if (ngos.length === 0) {
        return (
            <div className="w-full max-w-5xl mx-auto px-6 py-20 text-center glass-panel rounded-2xl">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--bg-secondary)] mb-4 border border-[var(--border-color)]">
                    <svg className="w-8 h-8 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">No NGOs Found</h3>
                <p className="text-[var(--text-secondary)]">We couldn't find any organizations matching your selected category.</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-5xl mx-auto px-6 pb-24 z-20 relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {ngos.map((ngo) => (
                <NGOCard key={ngo.id} ngo={ngo} />
            ))}
        </div>
    );
};

export default NGOGrid;
