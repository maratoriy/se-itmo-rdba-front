import React, { createContext, useState } from 'react';
import { OpenAPI } from '../api-client/core/OpenAPI';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));

    const login = (token) => {
        setAuthToken(token);
        localStorage.setItem('authToken', token);
        OpenAPI.TOKEN = token;  // Apply token globally in OpenAPI configuration
    };

    const logout = () => {
        setAuthToken(null);
        localStorage.removeItem('authToken');
        OpenAPI.TOKEN = null;
    };

    // Initialize the OpenAPI token when the app starts
    if (authToken) {
        OpenAPI.TOKEN = authToken;
    }

    return (
        <AuthContext.Provider value={{ authToken, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
