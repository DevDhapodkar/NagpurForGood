import React, { useState, useMemo } from 'react';
import Hero from '../components/Hero';
import FilterBar from '../components/FilterBar';
import NGOGrid from '../components/NGOGrid';
import { ngoData, allCategories } from '../data/ngoData';

const Home = () => {
    const [selectedCategory, setSelectedCategory] = useState('All');

    const filteredNGOs = useMemo(() => {
        if (selectedCategory === 'All') return ngoData;
        return ngoData.filter(ngo => ngo.categories.includes(selectedCategory));
    }, [selectedCategory]);

    return (
        <main>
            <Hero />
            <FilterBar
                categories={allCategories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
            />
            <NGOGrid
                ngos={filteredNGOs}
                onNgoClick={(ngo) => {
                    // Navigating is handled by the Link in NGOCard now, 
                    // but we'll keep this if we want to add any logic later.
                    window.location.href = `/ngo/${ngo.id}`;
                }}
            />
        </main>
    );
};

export default Home;
