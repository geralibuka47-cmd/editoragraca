import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, limit, query } from 'firebase/firestore';
import * as dotenv from 'dotenv';

dotenv.config();

const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID,
    measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID
};

console.log("Checking Firebase connection for Project:", firebaseConfig.projectId);

async function testConnection() {
    try {
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);

        console.log("Attempting to fetch 'books' collection...");
        const q = query(collection(db, 'books'), limit(1));
        const snapshot = await getDocs(q);

        console.log("Connection Successful!");
        console.log(`Found ${snapshot.size} books in the collection.`);

        process.exit(0);
    } catch (error) {
        console.error("Firebase connection failed:");
        console.error(error);
        process.exit(1);
    }
}

testConnection();
