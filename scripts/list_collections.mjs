import { Client, Databases } from 'node-appwrite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const {
    VITE_APPWRITE_ENDPOINT,
    VITE_APPWRITE_PROJECT_ID,
    APPWRITE_API_KEY,
    VITE_APPWRITE_DATABASE_ID = 'main'
} = process.env;

const client = new Client()
    .setEndpoint(VITE_APPWRITE_ENDPOINT)
    .setProject(VITE_APPWRITE_PROJECT_ID)
    .setKey(APPWRITE_API_KEY);

const databases = new Databases(client);

async function listCollections() {
    try {
        const result = await databases.listCollections(VITE_APPWRITE_DATABASE_ID);
        console.log('Collections in database:', VITE_APPWRITE_DATABASE_ID);
        result.collections.forEach(c => {
            console.log(`- ${c.name} (ID: ${c.$id})`);
        });
    } catch (e) {
        console.error('Error listing collections:', e.message);
    }
}

listCollections();
