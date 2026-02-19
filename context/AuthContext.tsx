'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, authApi } from '../lib/authApi';
import { useRouter } from 'next/navigation';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, pass: string) => Promise<void>;
    register: (email: string, pass: string, name?: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const initAuth = async () => {
            const token = authApi.getToken();
            if (!token) {
                setIsLoading(false);
                return;
            }

            try {
                const profile = await authApi.getProfile();
                if (profile) {
                    setUser(profile);
                } else {
                    authApi.clearTokens();
                }
            } catch (error) {
                console.error('Auth initialization failed:', error);
                authApi.clearTokens();
            } finally {
                setIsLoading(false);
            }
        };

        initAuth();
    }, []);

    const login = async (email: string, pass: string) => {
        setIsLoading(true);
        try {
            const data = await authApi.login(email, pass);
            setUser(data.user);
            router.refresh(); // Refresh server components if needed
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (email: string, pass: string, name?: string) => {
        setIsLoading(true);
        try {
            const data = await authApi.register(email, pass, name);
            setUser(data.user);
            router.refresh();
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        authApi.clearTokens();
        setUser(null);
        router.push('/'); // Redirect to home on logout
        router.refresh();
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            isLoading,
            login,
            register,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
