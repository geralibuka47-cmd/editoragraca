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
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Expose to window FOR ALL SCRIPTS (Safe-check)
window.firebaseApp = app;
window.auth = auth;
window.db = db;
window.storage = storage;

console.log("Firebase initialized & exposed (esm).");

export { app, auth, db, storage };
export default app;
