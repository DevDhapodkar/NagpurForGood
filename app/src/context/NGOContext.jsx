import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
    collection, 
    getDocs, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    doc, 
    query, 
    orderBy 
} from 'firebase/firestore';
import { db } from '../utils/firebase';
import { useAuth } from './AuthContext';

const NGOContext = createContext();

export const useNGOs = () => useContext(NGOContext);

export const NGOProvider = ({ children }) => {
    const [ngoList, setNgoList] = useState([]);
    const { user } = useAuth();

    const fetchNGOs = useCallback(async () => {
        try {
            const ngosCol = collection(db, 'ngos');
            const q = query(ngosCol, orderBy('name'));
            const ngoSnapshot = await getDocs(q);
            const list = ngoSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setNgoList(list);
        } catch (error) {
            console.error("Failed to fetch NGOs", error);
        }
    }, []);

    // Initial load from Firestore
    useEffect(() => {
        fetchNGOs();
    }, [fetchNGOs]);

    // CRUD operations mapped to Firestore
    const addNGO = async (newNGO) => {
        try {
            const docRef = await addDoc(collection(db, 'ngos'), {
                ...newNGO,
                createdAt: new Date().toISOString(),
                verified: false
            });
            const addedNGO = { id: docRef.id, ...newNGO };
            setNgoList(prev => [...prev, addedNGO]);
            return addedNGO;
        } catch (error) {
            console.error("Failed to add NGO", error);
            throw error;
        }
    };

    const updateNGO = async (id, updatedData) => {
        try {
            const ngoRef = doc(db, 'ngos', id);
            await updateDoc(ngoRef, updatedData);
            setNgoList(prev => prev.map(ngo => ngo.id === id ? { ...ngo, ...updatedData } : ngo));
        } catch (error) {
            console.error("Failed to update NGO", error);
            throw error;
        }
    };

    const deleteNGO = async (id) => {
        try {
            const ngoRef = doc(db, 'ngos', id);
            await deleteDoc(ngoRef);
            setNgoList(prev => prev.filter(ngo => ngo.id !== id));
        } catch (error) {
            console.error("Failed to delete NGO", error);
            throw error;
        }
    };

    const verifyNGO = async (id) => {
        try {
            const ngoRef = doc(db, 'ngos', id);
            await updateDoc(ngoRef, { verified: true });
            setNgoList(prev => prev.map(ngo => ngo.id === id ? { ...ngo, verified: true } : ngo));
        } catch (error) {
            console.error("Failed to verify NGO", error);
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

