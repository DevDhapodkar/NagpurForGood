import React, { useState, useMemo } from 'react';
import Hero from '../components/Hero';
import FilterBar from '../components/FilterBar';
import NGOGrid from '../components/NGOGrid';
import { useNGOs } from '../context/NGOContext';

const Home = () => {
    const { ngoList } = useNGOs();
    const [selectedCategory, setSelectedCategory] = useState('All');

    // Only show verified NGOs to the public
    const verifiedNGOs = useMemo(() => ngoList.filter(ngo => ngo.verified), [ngoList]);

    // Compute categories from verified NGOs
    const allCategories = useMemo(() => ["All", ...Array.from(new Set(verifiedNGOs.flatMap(ngo => ngo.categories)))].sort(), [verifiedNGOs]);

    const filteredNGOs = useMemo(() => {
        if (selectedCategory === 'All') return verifiedNGOs;
        return verifiedNGOs.filter(ngo => ngo.categories?.includes(selectedCategory));
    }, [selectedCategory, verifiedNGOs]);

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
