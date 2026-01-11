
import { ID } from "appwrite";
import { account } from "./appwrite";
import { User } from "../types";
import { getUserProfile, saveUserProfile } from "./dataService";

export const login = async (email: string, password: string): Promise<User | null> => {
    try {
        await account.createEmailPasswordSession(email, password);
        const appwriteUser = await account.get();

        // Get extra profile info from Database
        const profile = await getUserProfile(appwriteUser.$id);
        if (profile) return profile;

        return {
            id: appwriteUser.$id,
            name: appwriteUser.name || 'Utilizador',
            email: appwriteUser.email,
            role: 'leitor'
        };
    } catch (error) {
        console.error("Erro ao fazer login:", error);
        throw error;
    }
};

export const signUp = async (email: string, password: string, name: string): Promise<User> => {
    try {
        const appwriteUser = await account.create(ID.unique(), email, password, name);
        // Login immediately after signup
        await account.createEmailPasswordSession(email, password);

        const newUser: User = {
            id: appwriteUser.$id,
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
        await account.deleteSession('current');
    } catch (error) {
        console.error("Erro ao fazer logout:", error);
    }
};

export const subscribeToAuthChanges = (callback: (user: User | null) => void) => {
    // Appwrite doesn't have a listener like Firebase, so we check on mount
    const checkSession = async () => {
        try {
            const appwriteUser = await account.get();
            const profile = await getUserProfile(appwriteUser.$id);
            if (profile) {
                callback(profile);
            } else {
                callback({
                    id: appwriteUser.$id,
                    name: appwriteUser.name || 'Utilizador',
                    email: appwriteUser.email,
                    role: 'leitor'
                });
            }
        } catch (error) {
            callback(null);
        }
    };

    checkSession();

    // Return a dummy unsubscribe
    return () => { };
};
