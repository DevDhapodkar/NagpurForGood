import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const NGOContext = createContext();

export const useNGOs = () => useContext(NGOContext);

export const NGOProvider = ({ children }) => {
    const [ngoList, setNgoList] = useState([]);
    const { token } = useAuth();
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    const fetchNGOs = useCallback(async () => {
        try {
            const res = await fetch(`${API_URL}/ngos`);
            if (res.ok) {
                const data = await res.json();
                setNgoList(data);
            }
        } catch (error) {
            console.error("Failed to fetch NGOs", error);
        }
    }, [API_URL]);

    // Initial load from MongoDB via Express
    useEffect(() => {
        fetchNGOs();
    }, [fetchNGOs]);

    // CRUD operations mapped to API
    const addNGO = async (newNGO) => {
        try {
            const res = await fetch(`${API_URL}/ngos`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify(newNGO)
            });
            const data = await res.json();
            if (res.ok) {
                setNgoList(prev => [...prev, data]);
                return data;
            } else {
                throw new Error(data.msg || "Failed to add NGO");
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const updateNGO = async (id, updatedData) => {
        try {
            const res = await fetch(`${API_URL}/ngos/${id}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify(updatedData)
            });
            const data = await res.json();
            if (res.ok) {
                setNgoList(prev => prev.map(ngo => ngo.id === id ? data : ngo));
            } else {
                throw new Error(data.msg || "Failed to update NGO");
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const deleteNGO = async (id) => {
        try {
            const res = await fetch(`${API_URL}/ngos/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setNgoList(prev => prev.filter(ngo => ngo.id !== id));
            } else {
                const data = await res.json();
                throw new Error(data.msg || "Failed to delete NGO");
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const verifyNGO = async (id) => {
        try {
            const res = await fetch(`${API_URL}/ngos/${id}/verify`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) {
                setNgoList(prev => prev.map(ngo => ngo.id === id ? data : ngo));
            } else {
                throw new Error(data.msg || "Failed to verify NGO");
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    return (
        <NGOContext.Provider value={{
            ngoList,
            addNGO,
            updateNGO,
            deleteNGO,
            verifyNGO,
            refreshNGOs: fetchNGOs
        }}>
            {children}
        </NGOContext.Provider>
    );
};
