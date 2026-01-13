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

        // Get extra profile info from Database
        const profile = await getUserProfile(data.user.id);
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
        await supabase.auth.signOut();
    } catch (error) {
        console.error("Erro ao fazer logout:", error);
    }
};

export const subscribeToAuthChanges = (callback: (user: User | null) => void) => {
    // Check initial session
    const checkInitialSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
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
