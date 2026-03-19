import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem('qr_gallery_user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = (email, password) => {
        // Mock authentication
        if (email === 'admin@admin.com' && password === '3211234') {
            const userData = { email, id: 'admin-1', role: 'admin' };
            setUser(userData);
            localStorage.setItem('qr_gallery_user', JSON.stringify(userData));
            return { success: true };
        }
        return { success: false, message: 'Invalid email or password' };
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('qr_gallery_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
