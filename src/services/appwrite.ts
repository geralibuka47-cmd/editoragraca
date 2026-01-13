import { Client, Account, Databases, Storage, Messaging, ID } from "appwrite";

const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1';
const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID || '696374220002f5aab4bf';

const client = new Client();

console.log("Appwrite Endpoint:", endpoint);
console.log("Appwrite Project ID:", projectId ? "Configurado (" + projectId + ")" : "Faltando");

if (endpoint) {
    client.setEndpoint(endpoint);
}

if (projectId) {
    client.setProject(projectId);
} else {
    console.error("Appwrite Project ID is missing. Please check your .env file.");
}

// Add ping function for verification as requested
// @ts-ignore
if (typeof client.ping === 'undefined') {
    // @ts-ignore
    client.ping = async () => {
        try {
            // Using a standard health check endpoint (v1/health/version)
            const response = await fetch(endpoint + '/health/version');
            if (response.ok) {
                console.log('Appwrite setup verified: Connection successful to', endpoint);
            } else {
                console.error('Appwrite setup verification failed: API returned ' + response.status);
            }
        } catch (error) {
            console.error('Appwrite setup verification failed:', error);
        }
    };
}

// Automatically call ping verification
// @ts-ignore
client.ping();

const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);
const messaging = new Messaging(client);

export { client, account, databases, storage, messaging, ID };

