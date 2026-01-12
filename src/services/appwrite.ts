import { Client, Account, Databases, Storage, Messaging, ID } from "appwrite";

const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID;

const client = new Client();

console.log("Appwrite Endpoint:", endpoint);
console.log("Appwrite Project ID:", projectId ? "Configurado" : "Faltando");

if (endpoint) {
    client.setEndpoint(endpoint);
}

if (projectId) {
    client.setProject(projectId);
} else {
    console.error("Appwrite Project ID is missing. Please check your .env file.");
}

const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);
const messaging = new Messaging(client);

export { client, account, databases, storage, messaging, ID };

