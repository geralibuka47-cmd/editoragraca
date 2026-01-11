
import { ID, Query } from "appwrite";
import { databases } from "./appwrite";
import { Book, Order, User } from "../types";

// Appwrite Configuration
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || 'main';
const BOOKS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_BOOKS_COLLECTION || 'books';
const ORDERS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_ORDERS_COLLECTION || 'orders';
const USERS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_USERS_COLLECTION || 'users';

// Books Collection
export const getBooks = async (): Promise<Book[]> => {
    try {
        const response = await databases.listDocuments(
            DATABASE_ID,
            BOOKS_COLLECTION_ID
        );
        return response.documents.map(doc => ({ id: doc.$id, ...doc } as unknown as Book));
    } catch (error) {
        console.error("Erro ao procurar livros:", error);
        return [];
    }
};

export const saveBook = async (book: Book) => {
    try {
        // Appwrite uses updateDocument if it exists, or createDocument if new
        // Check if book.id is a timestamp or a real ID
        if (book.id.length > 10 && !book.id.startsWith('ID')) {
            try {
                await databases.updateDocument(DATABASE_ID, BOOKS_COLLECTION_ID, book.id, book);
                return;
            } catch (e) {
                // If not found, create it
            }
        }
        await databases.createDocument(DATABASE_ID, BOOKS_COLLECTION_ID, ID.unique(), book);
    } catch (error) {
        console.error("Erro ao salvar livro:", error);
    }
};

export const deleteBook = async (id: string) => {
    await databases.deleteDocument(DATABASE_ID, BOOKS_COLLECTION_ID, id);
};

// Orders Collection
export const getOrders = async (userId?: string): Promise<Order[]> => {
    try {
        const queries = [Query.orderDesc('date')];
        if (userId) {
            queries.push(Query.equal('customerId', userId));
        }
        const response = await databases.listDocuments(
            DATABASE_ID,
            ORDERS_COLLECTION_ID,
            queries
        );
        return response.documents.map(doc => ({ id: doc.$id, ...doc } as unknown as Order));
    } catch (error) {
        console.error("Erro ao procurar pedidos:", error);
        return [];
    }
};

export const createOrder = async (order: Omit<Order, 'id'>): Promise<string> => {
    const response = await databases.createDocument(
        DATABASE_ID,
        ORDERS_COLLECTION_ID,
        ID.unique(),
        {
            ...order,
            createdAt: new Date().toISOString()
        }
    );
    return response.$id;
};

export const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    await databases.updateDocument(DATABASE_ID, ORDERS_COLLECTION_ID, orderId, { status });
};

// Users Collection
export const getUserProfile = async (uid: string): Promise<User | null> => {
    try {
        const response = await databases.getDocument(DATABASE_ID, USERS_COLLECTION_ID, uid);
        return { id: response.$id, ...response } as unknown as User;
    } catch (error) {
        return null;
    }
};

export const saveUserProfile = async (user: User) => {
    try {
        await databases.updateDocument(DATABASE_ID, USERS_COLLECTION_ID, user.id, user);
    } catch (error) {
        try {
            await databases.createDocument(DATABASE_ID, USERS_COLLECTION_ID, user.id, user);
        } catch (e) {
            console.error("Erro ao salvar perfil:", e);
        }
    }
};
