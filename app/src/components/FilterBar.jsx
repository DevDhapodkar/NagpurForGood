import React from 'react';

const FilterBar = ({ categories, selectedCategory, onSelectCategory }) => {
    return (
        <div className="w-full max-w-5xl mx-auto px-6 mb-12 z-20 relative" id="discover">
            <div className="flex flex-col gap-4">
                <h2 className="text-2xl font-bold text-white mb-2">Discover by Cause</h2>

                <div className="flex flex-wrap gap-3">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => onSelectCategory(category)}
                            className={`
                px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 backdrop-blur-md
                ${selectedCategory === category
                                    ? 'bg-gradient-to-r from-violet-600 to-pink-600 text-white shadow-[0_4px_20px_rgba(139,92,246,0.5)] border border-transparent scale-105'
                                    : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white hover:border-white/20'}
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
