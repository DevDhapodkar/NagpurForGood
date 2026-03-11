import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    // Verify token on load
    useEffect(() => {
        const verifySession = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const res = await fetch(`${API_URL}/auth/me`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    
                    if (res.ok) {
                        const userData = await res.json();
                        setUser(userData);
                    } else {
                        localStorage.removeItem('token');
                    }
                } catch (error) {
                    console.error("Session verification failed", error);
                    localStorage.removeItem('token');
                }
            }
            setLoading(false);
        };
        verifySession();
    }, [API_URL]);

    const login = async (email, password) => {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await res.json();
        
        if (!res.ok) {
            throw new Error(data.msg || "Login failed");
        }

        localStorage.setItem('token', data.token);
        setUser(data.user);
        return data.user;
    };

    const signup = async (name, email, password) => {
        const res = await fetch(`${API_URL}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });
        
        const data = await res.json();
        
        if (!res.ok) {
            throw new Error(data.msg || "Signup failed");
        }

        localStorage.setItem('token', data.token);
        setUser(data.user);
        return data.user;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
    };

    const value = {
        user,
        loading,
        login,
        signup,
        logout,
        token: localStorage.getItem('token')
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
