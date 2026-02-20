import React, { useState, useMemo } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FilterBar from './components/FilterBar';
import NGOGrid from './components/NGOGrid';
import NGOModal from './components/NGOModal';
import { ngoData, allCategories } from './data/ngoData';
import './App.css';

function App() {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedNGO, setSelectedNGO] = useState(null);

    // Filter NGOs based on the selected category
    const filteredNGOs = useMemo(() => {
        if (selectedCategory === 'All') return ngoData;
        return ngoData.filter(ngo => ngo.categories.includes(selectedCategory));
    }, [selectedCategory]);

    return (
        <div className="min-h-screen font-sans selection:bg-pink-500/30">
            <Navbar />

            <main>
                <Hero />

                <FilterBar
                    categories={allCategories}
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                />

                <NGOGrid
                    ngos={filteredNGOs}
                    onNgoClick={setSelectedNGO}
                />
            </main>

            {/* Footer */}
            <footer className="relative z-10 w-full border-t border-white/10 glass-panel mt-12 py-12 px-6">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-pink-400">
                            NfG
                        </span>
                        <span className="text-white/70 font-medium">© 2026 Nagpur For Good</span>
                    </div>
                    <p className="text-white/50 text-sm max-w-md text-center md:text-right">
                        Bridging the gap between intent and authentic local impact. Verified NGOs ready for your tangible support.
                    </p>
                </div>
            </footer>

            {/* Detailed Modal */}
            {selectedNGO && (
                <NGOModal
                    ngo={selectedNGO}
                    onClose={() => setSelectedNGO(null)}
                />
            )}
        </div>
    );
}

export default App;
