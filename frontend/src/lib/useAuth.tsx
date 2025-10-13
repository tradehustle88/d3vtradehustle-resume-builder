'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    User,
    onAuthStateChanged,
    signInWithGoogle,
    signInWithEmailAndPassword,
    signUpWithEmail,
    signOut,
    auth
} from '@/lib/firebase';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signInWithGoogle: () => Promise<any>;
    signInWithEmail: (email: string, password: string) => Promise<any>;
    signUpWithEmail: (email: string, password: string) => Promise<any>;
    signOut: () => Promise<void>;
    getIdToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const getIdToken = async (): Promise<string | null> => {
        if (!user) return null;
        try {
            return await user.getIdToken();
        } catch (error) {
            console.error('Error getting ID token:', error);
            return null;
        }
    };

    const handleSignInWithEmail = (email: string, password: string) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const value: AuthContextType = {
        user,
        loading,
        signInWithGoogle,
        signInWithEmail: handleSignInWithEmail,
        signUpWithEmail,
        signOut,
        getIdToken,
    };

    return (
        <AuthContext.Provider value={value}>
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