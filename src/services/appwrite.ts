import { Client, Account, Databases } from "appwrite";

const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID;

const client = new Client();

if (endpoint) {
    client.setEndpoint(endpoint);
}

if (projectId) {
    client.setProject(projectId);
} else {
    console.warn("Appwrite Project ID is missing. Please check your environment variables.");
}

const account = new Account(client);
const databases = new Databases(client);

export { client, account, databases };
