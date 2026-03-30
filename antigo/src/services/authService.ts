import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    User as FirebaseUser,
    sendPasswordResetEmail,
    GoogleAuthProvider,
    signInWithPopup,
    RecaptchaVerifier,
    signInWithPhoneNumber,
    ConfirmationResult
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { User } from '../types';

/**
 * Convert Firebase User to our User type
 */
const convertFirebaseUser = async (firebaseUser: FirebaseUser): Promise<User> => {
    // Get additional user data from Firestore
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));

    if (userDoc.exists()) {
        const userData = userDoc.data();
        return {
            id: firebaseUser.uid,
            name: userData.name || firebaseUser.displayName || 'Utilizador',
            email: firebaseUser.email || '',
            role: userData.role || 'leitor',
            paymentMethods: userData.paymentMethods || [],
            whatsappNumber: userData.whatsappNumber,
            bio: userData.bio,
            avatarUrl: userData.avatarUrl || firebaseUser.photoURL
        };
    }

    // Fallback if no Firestore document exists
    return {
        id: firebaseUser.uid,
        name: firebaseUser.displayName || 'Utilizador',
        email: firebaseUser.email || '',
        role: 'leitor'
    };
};

/**
 * Login with email and password
 */
export const login = async (email: string, password: string): Promise<User | null> => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return await convertFirebaseUser(userCredential.user);
    } catch (error: any) {
        console.error('Erro ao fazer login:', error);

        // Translate Firebase errors to Portuguese
        if (error.code === 'auth/user-not-found' ||
            error.code === 'auth/wrong-password' ||
            error.code === 'auth/invalid-credential') {
            throw new Error('E-mail ou senha incorretos');
        } else if (error.code === 'auth/too-many-requests') {
            throw new Error('Muitas tentativas. Tente novamente mais tarde');
        } else if (error.code === 'auth/network-request-failed') {
            throw new Error('Erro de rede. Verifique sua conexão');
        }

        throw error;
    }
};

/**
 * Login with Google
 */
export const loginWithGoogle = async (): Promise<User | null> => {
    try {
        const provider = new GoogleAuthProvider();
        const userCredential = await signInWithPopup(auth, provider);
        const firebaseUser = userCredential.user;

        // Check if user already exists in Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));

        if (!userDoc.exists()) {
            // First time logging in with Google: create the doc
            await setDoc(doc(db, 'users', firebaseUser.uid), {
                name: firebaseUser.displayName || 'Utilizador',
                email: firebaseUser.email,
                role: 'leitor', // Default role for Google login
                avatarUrl: firebaseUser.photoURL,
                createdAt: new Date().toISOString()
            });
        }

        return await convertFirebaseUser(firebaseUser);
    } catch (error: any) {
        console.error('Erro ao fazer login com Google:', error);

        if (error.code === 'auth/popup-closed-by-user') {
            throw new Error('O login foi cancelado pelo utilizador');
        } else if (error.code === 'auth/network-request-failed') {
            throw new Error('Erro de rede ao contactar o Google');
        }

        throw error;
    }
};

/**
 * Sign up with email, password, and name
 */
export const signUp = async (email: string, password: string, name: string, role: 'leitor' | 'autor' = 'leitor'): Promise<User> => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;

        // Create user document in Firestore
        const newUser: User = {
            id: firebaseUser.uid,
            name: name,
            email: email,
            role: role
        };

        await setDoc(doc(db, 'users', firebaseUser.uid), {
            name,
            email,
            role: role,
            createdAt: new Date().toISOString()
        });

        return newUser;
    } catch (error: any) {
        console.error('Erro ao registar:', error);

        // Translate Firebase errors
        if (error.code === 'auth/email-already-in-use') {
            throw new Error('Este e-mail já está registado');
        } else if (error.code === 'auth/weak-password') {
            throw new Error('A senha deve ter pelo menos 6 caracteres');
        } else if (error.code === 'auth/invalid-email') {
            throw new Error('E-mail inválido');
        }

        throw error;
    }
};

/**
 * Logout
 */
export const logout = async () => {
    try {
        await firebaseSignOut(auth);
    } catch (error) {
        console.error('Erro ao fazer logout:', error);
        throw error;
    }
};

/**
 * Send OTP SMS using Firebase Phone Auth
 * @param phoneNumber - full phone number with country code, e.g. +244912345678
 * @param recaptchaContainerId - id of the div to render reCAPTCHA in
 */
export const sendPhoneOTP = async (
    phoneNumber: string,
    recaptchaContainerId: string
): Promise<ConfirmationResult> => {
    const recaptchaVerifier = new RecaptchaVerifier(auth, recaptchaContainerId, {
        size: 'invisible',
        callback: () => {},
    });
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
    return confirmationResult;
};

/**
 * Confirm OTP code and create/load user profile
 */
export const confirmPhoneOTP = async (
    confirmationResult: ConfirmationResult,
    otp: string,
    name: string,
    role: 'leitor' | 'autor' = 'leitor'
): Promise<User> => {
    const result = await confirmationResult.confirm(otp);
    const firebaseUser = result.user;

    // Check if user profile already exists
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));

    if (!userDoc.exists()) {
        // First time: create Firestore profile
        await setDoc(doc(db, 'users', firebaseUser.uid), {
            name,
            email: firebaseUser.email || '',
            phone: firebaseUser.phoneNumber || '',
            role,
            createdAt: new Date().toISOString()
        });
    }

    return await convertFirebaseUser(firebaseUser);
};

/**
 * Send password reset email
 */
export const resetPassword = async (email: string) => {
    try {
        await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
        console.error('Erro ao enviar e-mail de recuperação:', error);

        if (error.code === 'auth/user-not-found') {
            throw new Error('Nenhuma conta encontrada com este e-mail');
        }

        throw error;
    }
};

/**
 * Subscribe to auth state changes
 */
export const subscribeToAuthChanges = (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
            try {
                const user = await convertFirebaseUser(firebaseUser);
                callback(user);
            } catch (error) {
                console.error('Error converting Firebase user:', error);
                callback(null);
            }
        } else {
            callback(null);
        }
    });
};
