import React, { createContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { API_URL } from '../config/api';


interface User {
    id: number;
    email: string;
    role: string;
    civility?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    address?: string;
    city?: string;
    postalCode?: string;
    createdAt?: string;
}

interface AuthContextType {
    user: User | null;
    isAdmin: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    logout: () => void;
    updateUser: (partial: Partial<User>) => void;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    isAdmin: false,
    isLoading: true,
    login: async () => { throw new Error('AuthProvider non trovato'); },
    register: async () => { throw new Error('AuthProvider non trovato'); },
    logout: () => { throw new Error('AuthProvider non trovato'); },
    updateUser: () => { throw new Error('AuthProvider non trovato'); },
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const isAdmin = user?.role === 'admin';

    useEffect(() => {
        const verifyToken = async () => {
            const token = localStorage.getItem('authToken');

            if (!token) {
                setIsLoading(false);
                return;
            }

            try {
                const response = await axios.get(`${API_URL}/auth/verify`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setUser(response.data.user);
            } catch (error) {
                localStorage.removeItem('authToken');
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        verifyToken();
    }, []);

    const register = async (email: string, password: string) => {
        try {
            const response = await axios.post(`${API_URL}/auth/register`, {
                email,
                password
            });

            const { user, token } = response.data;
            localStorage.setItem('authToken', token);
            setUser(user);

        } catch (error: any) {
            const errorMessage = error.response?.data?.error || 'Registration failed';
            throw new Error(errorMessage);
        }
    };

    const login = async (email: string, password: string) => {
        try {
            const response = await axios.post(`${API_URL}/auth/login`, {
                email,
                password
            });

            const { token } = response.data;
            localStorage.setItem('authToken', token);

            // Load full profile from DB (verifyToken returns all fields)
            const profileResponse = await axios.get(`${API_URL}/auth/verify`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(profileResponse.data.user);

        } catch (error: any) {
            const errorMessage = error.response?.data?.error || 'Invalid credentials';
            throw new Error(errorMessage);
        }
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        setUser(null);
    };

    const updateUser = (partial: Partial<User>) => {
        setUser(prev => prev ? { ...prev, ...partial } : prev);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAdmin,
                isLoading,
                login,
                register,
                logout,
                updateUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};