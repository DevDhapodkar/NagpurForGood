import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Mock initial check from localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem('ngo_admin_user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error("Failed to parse stored user", error);
                localStorage.removeItem('ngo_admin_user');
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Mock verification against stored users
                const storedUsers = JSON.parse(localStorage.getItem('ngo_admin_users') || '[]');
                const foundUser = storedUsers.find(u => u.email === email && u.password === password);

                // Default admin fallback if none exists
                if (email === 'admin@nagpur.org' && password === 'admin123') {
                     const adminUser = { id: 'admin-1', email, name: 'Super Admin', role: 'admin' };
                     setUser(adminUser);
                     localStorage.setItem('ngo_admin_user', JSON.stringify(adminUser));
                     resolve(adminUser);
                     return;
                }

                if (foundUser) {
                    // Omit password from session
                    const sessionUser = { id: foundUser.id, email: foundUser.email, name: foundUser.name, role: 'admin' };
                    setUser(sessionUser);
                    localStorage.setItem('ngo_admin_user', JSON.stringify(sessionUser));
                    resolve(sessionUser);
                } else {
                    reject(new Error("Invalid email or password"));
                }
            }, 800); // Simulate network latency
        });
    };

    const signup = async (name, email, password) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const storedUsers = JSON.parse(localStorage.getItem('ngo_admin_users') || '[]');
                
                if (storedUsers.some(u => u.email === email)) {
                    reject(new Error("Email already registered"));
                    return;
                }

                const newUser = {
                    id: Date.now().toString(),
                    name,
                    email,
                    password // Storing in plain text locally for mock purposes only
                };

                storedUsers.push(newUser);
                localStorage.setItem('ngo_admin_users', JSON.stringify(storedUsers));
                
                const sessionUser = { id: newUser.id, email: newUser.email, name: newUser.name, role: 'admin' };
                setUser(sessionUser);
                localStorage.setItem('ngo_admin_user', JSON.stringify(sessionUser));
                resolve(sessionUser);
            }, 800);
        });
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('ngo_admin_user');
    };

    const value = {
        user,
        loading,
        login,
        signup,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
