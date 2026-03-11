import React, { createContext, useContext, useState, useEffect } from 'react';
import { ngoData as initialNgoData } from '../data/ngoData';

const NGOContext = createContext();

export const useNGOs = () => useContext(NGOContext);

export const NGOProvider = ({ children }) => {
    const [ngoList, setNgoList] = useState([]);

    // Load from localStorage or fallback to initial data
    useEffect(() => {
        const storedData = localStorage.getItem('nagpurForGood_ngos');
        if (storedData) {
            try {
                setNgoList(JSON.parse(storedData));
            } catch (e) {
                console.error("Failed to parse NGO data from localStorage", e);
                setNgoList(initialNgoData);
            }
        } else {
            setNgoList(initialNgoData);
            localStorage.setItem('nagpurForGood_ngos', JSON.stringify(initialNgoData));
        }
    }, []);

    // Helper to persist list
    const saveNGOs = (newList) => {
        setNgoList(newList);
        localStorage.setItem('nagpurForGood_ngos', JSON.stringify(newList));
    };

    // CRUD operations
    const addNGO = (newNGO) => {
        const ngoWithId = {
            ...newNGO,
            id: newNGO.id || newNGO.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            verified: false // Admin must verify
        };
        saveNGOs([...ngoList, ngoWithId]);
        return ngoWithId;
    };

    const updateNGO = (id, updatedData) => {
        const newList = ngoList.map(ngo => ngo.id === id ? { ...ngo, ...updatedData } : ngo);
        saveNGOs(newList);
    };

    const deleteNGO = (id) => {
        const newList = ngoList.filter(ngo => ngo.id !== id);
        saveNGOs(newList);
    };

    const verifyNGO = (id) => {
        const newList = ngoList.map(ngo => ngo.id === id ? { ...ngo, verified: true } : ngo);
        saveNGOs(newList);
    };

    return (
        <NGOContext.Provider value={{
            ngoList,
            addNGO,
            updateNGO,
            deleteNGO,
            verifyNGO
        }}>
            {children}
        </NGOContext.Provider>
    );
};
