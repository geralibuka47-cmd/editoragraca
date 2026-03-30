/**
 * Editora Graça — Authentication Service (Vanila JS)
 */
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

/**
 * Login with email and password
 */
export async function login(email, password) {
    try {
        const auth = window.auth;
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        console.error("Login error:", error);
        throw translateError(error.code);
    }
}

/**
 * Register a new user
 */
export async function register(email, password, name) {
    try {
        const auth = window.auth;
        const db = window.db;

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Create Firestore profile
        await setDoc(doc(db, "users", user.uid), {
            name: name,
            email: email,
            role: 'leitor',
            createdAt: new Date().toISOString()
        });

        return user;
    } catch (error) {
        console.error("Register error:", error);
        throw translateError(error.code);
    }
}

/**
 * Logout
 */
export async function logout() {
    try {
        await signOut(window.auth);
        window.location.href = '/';
    } catch (error) {
        console.error("Logout error:", error);
    }
}

/**
 * Send password reset email
 */
export async function forgotPassword(email) {
    try {
        const auth = window.auth;
        await sendPasswordResetEmail(auth, email);
        return { success: true };
    } catch (error) {
        console.error("Forgot password error:", error);
        throw translateError(error.code);
    }
}

/**
 * Subscribe to auth changes
 */
export function onAuth(callback) {
    return onAuthStateChanged(window.auth, async (firebaseUser) => {
        if (firebaseUser) {
            const db = window.db;
            const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
            const userData = userDoc.exists() ? userDoc.data() : {};
            callback({ id: firebaseUser.uid, ...firebaseUser, ...userData });
        } else {
            callback(null);
        }
    });
}

function translateError(code) {
    switch (code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
            return 'E-mail ou senha incorretos.';
        case 'auth/email-already-in-use':
            return 'Este e-mail já está em uso.';
        case 'auth/weak-password':
            return 'A senha deve ter pelo menos 6 caracteres.';
        case 'auth/network-request-failed':
            return 'Erro de rede. Verifique a sua conexão.';
        default:
            return 'Ocorreu um erro. Tente novamente.';
    }
}
