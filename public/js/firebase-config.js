/**
 * Editora Graça — Central Firebase Configuration (ESM)
 */
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyBRrRtWr79QZ9fM97vLfGaJLUiFXImX5B8",
    authDomain: "editora-graca.firebaseapp.com",
    projectId: "editora-graca",
    storageBucket: "editora-graca.firebasestorage.app",
    messagingSenderId: "23315043977",
    appId: "1:23315043977:web:8725df24c88dca9150d858",
    measurementId: "G-DFLWXF6BLP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Also expose to window for mixed-environment scripts
window.firebaseApp = app;
window.auth = auth;
window.db = db;
window.storage = storage;

console.log("Firebase initialized successfully (esm).");
export default app;
