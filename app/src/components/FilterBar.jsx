import React from 'react';

const FilterBar = ({ categories, selectedCategory, onSelectCategory }) => {
    return (
        <div className="w-full max-w-5xl mx-auto px-6 mb-12 z-20 relative" id="discover">
            <div className="flex flex-col gap-4">
                <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Discover by Cause</h2>

                <div className="flex flex-wrap gap-3">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => onSelectCategory(category)}
                            className={`
                px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 backdrop-blur-md
                ${selectedCategory === category
                                    ? 'bg-gradient-to-r from-orange-600 to-red-600 text-theme-primary shadow-[0_4px_20px_rgba(249,115,22,0.5)] border border-transparent scale-105'
                                    : 'glass-btn border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-muted)]'}
              `}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FilterBar;
