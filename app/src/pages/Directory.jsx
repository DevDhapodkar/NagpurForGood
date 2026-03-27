import React, { useState, useMemo } from 'react';
import FilterBar from '../components/FilterBar';
import NGOGrid from '../components/NGOGrid';
import { useNGOs } from '../context/NGOContext';
import { Search, Filter, LayoutGrid } from 'lucide-react';

const Directory = () => {
    const { ngoList } = useNGOs();
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    // Only show verified NGOs to the public
    const verifiedNGOs = useMemo(() => ngoList.filter(ngo => ngo.verified), [ngoList]);

    // Compute categories from verified NGOs
    const allCategories = useMemo(() => ["All", ...Array.from(new Set(verifiedNGOs.flatMap(ngo => ngo.categories)))].sort(), [verifiedNGOs]);

    const filteredNGOs = useMemo(() => {
        let filtered = verifiedNGOs;
        
        if (selectedCategory !== 'All') {
            filtered = filtered.filter(ngo => ngo.categories?.includes(selectedCategory));
        }
        
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(ngo => 
                ngo.name.toLowerCase().includes(query) || 
                ngo.description.toLowerCase().includes(query) ||
                ngo.categories.some(cat => cat.toLowerCase().includes(query))
            );
        }
        
        return filtered;
    }, [selectedCategory, verifiedNGOs, searchQuery]);

    return (
        <div className="min-h-screen pt-28 md:pt-40 pb-20 animate-in fade-in duration-700">
            <div className="max-w-7xl mx-auto px-6">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6">
                            <LayoutGrid className="w-4 h-4 text-amber-500" />
                            <span className="text-xs font-black text-amber-500 uppercase tracking-widest">NGO Directory</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-theme-primary mb-4 tracking-tighter font-serif">
                            Discover Nagpur's <br />
                            <span className="text-gradient">Verified Support Hub.</span>
                        </h1>
                        <p className="text-lg text-theme-primary/60 leading-relaxed">
                            Every organization listed here has been cross-referenced against official portals to ensure your support reaches its intended destination.
                        </p>
                    </div>

                    {/* Search Bar - New Addition for Directory Page */}
                    <div className="w-full md:w-96 relative group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-theme-primary/30 group-focus-within:text-amber-500 transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Search by name, cause or keyword..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-14 pr-6 py-5 rounded-[2rem] bg-theme-primary/5 border border-theme-primary/10 focus:border-amber-500/30 focus:outline-none focus:ring-4 focus:ring-amber-500/5 text-theme-primary transition-all placeholder:text-theme-primary/20"
                        />
                    </div>
                </div>

                <div className="space-y-12">
                    <div className="flex items-center justify-between border-b border-theme-primary/5 pb-8">
                        <FilterBar
                            categories={allCategories}
                            selectedCategory={selectedCategory}
                            onSelectCategory={setSelectedCategory}
                        />
                        <div className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-xl bg-theme-primary/5 text-[10px] font-black uppercase tracking-widest text-theme-primary/40">
                            <Filter className="w-3 h-3" />
                            Showing {filteredNGOs.length} Results
                        </div>
                    </div>

                    <NGOGrid
                        ngos={filteredNGOs}
                        onNgoClick={(ngo) => {
                            window.location.href = `/ngo/${ngo.id}`;
                        }}
                    />

                    {filteredNGOs.length === 0 && (
                        <div className="py-32 text-center glass-panel rounded-[3.5rem] border-theme-primary/5">
                            <div className="w-16 h-16 rounded-2xl bg-theme-primary/5 flex items-center justify-center mx-auto mb-6">
                                <Search className="w-8 h-8 text-theme-primary/20" />
                            </div>
                            <h3 className="text-2xl font-black text-theme-primary mb-2 uppercase tracking-tight">No Results Found</h3>
                            <p className="text-theme-primary/40 text-sm">Try adjusting your filters or search keywords.</p>
                            <button 
                                onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
                                className="mt-8 text-amber-500 font-black text-xs uppercase tracking-widest hover:underline"
                            >
                                Reset All Filters
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Directory;
