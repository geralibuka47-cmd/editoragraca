import { supabase } from "./supabase";
import { User } from "../types";
import { getUserProfile, saveUserProfile } from "./dataService";

export const login = async (email: string, password: string): Promise<User | null> => {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw error;
        if (!data.user) return null;

        // Get extra profile info from Database with timeout
        // If profile fetch hangs, we proceed with basic auth data
        const profilePromise = getUserProfile(data.user.id);
        const timeoutProfile = new Promise<null>((resolve) => setTimeout(() => resolve(null), 3000));

        const profile = await Promise.race([profilePromise, timeoutProfile]);

        if (profile) return profile;

        return {
            id: data.user.id,
            name: data.user.user_metadata?.name || 'Utilizador',
            email: data.user.email || email,
            role: 'leitor'
        };
    } catch (error) {
        console.error("Erro ao fazer login:", error);
        throw error;
    }
};

export const signUp = async (email: string, password: string, name: string): Promise<User> => {
    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name: name,
                }
            }
        });

        if (error) throw error;
        if (!data.user) throw new Error("Erro ao criar utilizador.");

        const newUser: User = {
            id: data.user.id,
            name: name,
            email: email,
            role: 'leitor'
        };

        await saveUserProfile(newUser);
        return newUser;
    } catch (error) {
        console.error("Erro ao registar:", error);
        throw error;
    }
};

export const logout = async () => {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;

        // Manual cleanup as a fallback
        for (const key in localStorage) {
            if (key.startsWith('sb-') || key.includes('supabase.auth')) {
                localStorage.removeItem(key);
            }
        }
    } catch (error) {
        console.error("Erro ao fazer logout:", error);
        // Even if supabase fails, we should clear local storage
        for (const key in localStorage) {
            if (key.startsWith('sb-') || key.includes('supabase.auth')) {
                localStorage.removeItem(key);
            }
        }
    }
};

export const subscribeToAuthChanges = (callback: (user: User | null) => void) => {
    // Check initial session
    const checkInitialSession = async () => {
        try {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (error) throw error;

            if (session?.user) {
                const profile = await getUserProfile(session.user.id);
                callback(profile || {
                    id: session.user.id,
                    name: session.user.user_metadata?.name || 'Utilizador',
                    email: session.user.email || '',
                    role: 'leitor'
                });
            } else {
                callback(null);
            }
        } catch (error) {
            console.error("Auth check failed:", error);
            callback(null); // Ensure we unblock the UI even on error
        }
    };

    checkInitialSession();

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
            const profile = await getUserProfile(session.user.id);
            callback(profile || {
                id: session.user.id,
                name: session.user.user_metadata?.name || 'Utilizador',
                email: session.user.email || '',
                role: 'leitor'
            });
        } else {
            callback(null);
        }
    });

    return () => {
        subscription.unsubscribe();
    };
};
