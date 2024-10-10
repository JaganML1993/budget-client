import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        const id = localStorage.getItem("userId");

        if (token) {
            setIsAuthenticated(true); // User is authenticated if token exists
            setUserId(id); // Set userId if it exists in localStorage
        } else {
            setIsAuthenticated(false);
            setUserId(null);
        }

        setLoading(false); // Set loading to false after checking token
    }, []);

    const login = (id) => {
        setIsAuthenticated(true);
        setUserId(id); // Set userId when logging in
    };

    const logout = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userId");
        setIsAuthenticated(false);
        setUserId(null); // Clear userId on logout
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, loading, login, logout, userId }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
