
import { Client, Databases, Query } from 'node-appwrite';
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
    VITE_APPWRITE_DATABASE_ID = 'main',
    VITE_APPWRITE_BOOKS_COLLECTION = 'books'
} = process.env;

console.log('--- Configuration Diagnostic ---');
console.log('Endpoint:', VITE_APPWRITE_ENDPOINT);
console.log('Project ID:', VITE_APPWRITE_PROJECT_ID);
console.log('Database ID:', VITE_APPWRITE_DATABASE_ID);
console.log('Books Collection ID:', VITE_APPWRITE_BOOKS_COLLECTION);
console.log('API Key Present:', !!APPWRITE_API_KEY);
console.log('--------------------------------');

// Test 1: Server-Side Access (Admin Key)
async function testServerAccess() {
    console.log('\n🔄 Testing Server-Side Access (with API Key)...');
    try {
        const client = new Client()
            .setEndpoint(VITE_APPWRITE_ENDPOINT)
            .setProject(VITE_APPWRITE_PROJECT_ID)
            .setKey(APPWRITE_API_KEY);

        const databases = new Databases(client);
        const result = await databases.listDocuments(VITE_APPWRITE_DATABASE_ID, VITE_APPWRITE_BOOKS_COLLECTION, [Query.limit(1)]);
        console.log(`✅ Server Access Success! Found ${result.total} books.`);
        if (result.total > 0) {
            console.log(`   Sample: "${result.documents[0].title}"`);
        }
    } catch (error) {
        console.error('❌ Server Access Failed:', error.message);
    }
}

// Test 2: Public Access Simulation (No Key)
async function testPublicAccess() {
    console.log('\n🔄 Testing Public Access (No API Key)...');
    try {
        // Using fetch directly to simulate truly public access without node-appwrite's potential internal handling
        const url = `${VITE_APPWRITE_ENDPOINT}/databases/${VITE_APPWRITE_DATABASE_ID}/collections/${VITE_APPWRITE_BOOKS_COLLECTION}/documents?queries[0]=${encodeURIComponent('{"method":"limit","values":[1]}')}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'X-Appwrite-Project': VITE_APPWRITE_PROJECT_ID,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(`HTTP ${response.status}: ${data.message || response.statusText}`);
        }

        const data = await response.json();
        console.log(`✅ Public Access Success! Found ${data.total} books.`);
    } catch (error) {
        console.error('❌ Public Access Failed:', error.message);
        console.log('   -> This means the "read(\'any\')" permission is NOT working or missing.');
    }
}

async function run() {
    await testServerAccess();
    await testPublicAccess();
}

run();
