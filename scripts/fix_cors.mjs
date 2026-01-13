
import { Client, Projects } from 'node-appwrite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const {
    VITE_APPWRITE_ENDPOINT,
    VITE_APPWRITE_PROJECT_ID,
    APPWRITE_API_KEY
} = process.env;

if (!VITE_APPWRITE_ENDPOINT || !VITE_APPWRITE_PROJECT_ID || !APPWRITE_API_KEY) {
    console.error('❌ Missing environment variables.');
    process.exit(1);
}

const client = new Client()
    .setEndpoint(VITE_APPWRITE_ENDPOINT)
    .setProject(VITE_APPWRITE_PROJECT_ID)
    .setKey(APPWRITE_API_KEY);

const projects = new Projects(client);

async function fixCors() {
    console.log('🚀 Attempting to fix CORS settings...');

    const platformsToAdd = [
        { name: 'Vercel App', type: 'web', hostname: 'editoragraca.vercel.app' },
        { name: 'Localhost', type: 'web', hostname: 'localhost' }
    ];

    try {
        // Try to list platforms to see if they exist (requires projects.read)
        // If we can't list, we might just try to create and catch error.

        // Note: SDK usually takes project ID from client, but createPlatform might need it explicitly or imply it.
        // In node-appwrite 11+, projects.createPlatform(projectId, type, name, key, store?, hostname?)

        for (const p of platformsToAdd) {
            try {
                console.log(`   Adding platform: ${p.hostname}...`);
                await projects.createPlatform(
                    VITE_APPWRITE_PROJECT_ID,
                    p.type,
                    p.name,
                    undefined, // key (bundle ID for apps, usually ignored for web)
                    undefined, // store
                    p.hostname // hostname for web
                );
                console.log(`   ✅ Added ${p.hostname}`);
            } catch (e) {
                if (e.message.includes('already exists') || e.code === 409) {
                    console.log(`      ⚠️ Platform ${p.hostname} already exists.`);
                } else {
                    console.error(`      ❌ Failed to add ${p.hostname}: ${e.message}`);
                }
            }
        }

        console.log('\n✨ CORS fix process completed.');
        console.log('If errors persist, please manually add "editoragraca.vercel.app" to your Appwrite Project > Overview > Platforms.');

    } catch (error) {
        console.error('❌ Critical Error:', error.message);
        console.log('NOTE: Your API Key might typically lack "projects.write" scope. If so, you must add the platform manually in the Appwrite Console.');
    }
}

fixCors();
