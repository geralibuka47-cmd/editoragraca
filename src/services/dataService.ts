
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

// Payment Notifications Collection
const PAYMENT_NOTIFICATIONS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_PAYMENT_NOTIFICATIONS_COLLECTION || 'payment_notifications';
const PAYMENT_PROOFS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_PAYMENT_PROOFS_COLLECTION || 'payment_proofs';

export const createPaymentNotification = async (notification: Omit<import('../types').PaymentNotification, 'id'>): Promise<string> => {
    const response = await databases.createDocument(
        DATABASE_ID,
        PAYMENT_NOTIFICATIONS_COLLECTION_ID,
        ID.unique(),
        {
            ...notification,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
    );
    return response.$id;
};

export const getPaymentNotificationsByReader = async (readerId: string): Promise<import('../types').PaymentNotification[]> => {
    try {
        const response = await databases.listDocuments(
            DATABASE_ID,
            PAYMENT_NOTIFICATIONS_COLLECTION_ID,
            [Query.equal('readerId', readerId), Query.orderDesc('createdAt')]
        );
        return response.documents.map(doc => ({ id: doc.$id, ...doc } as unknown as import('../types').PaymentNotification));
    } catch (error) {
        console.error("Erro ao buscar notificações de pagamento:", error);
        return [];
    }
};

export const getAllPaymentNotifications = async (): Promise<import('../types').PaymentNotification[]> => {
    try {
        const response = await databases.listDocuments(
            DATABASE_ID,
            PAYMENT_NOTIFICATIONS_COLLECTION_ID,
            [Query.orderDesc('createdAt')]
        );
        return response.documents.map(doc => ({ id: doc.$id, ...doc } as unknown as import('../types').PaymentNotification));
    } catch (error) {
        console.error("Erro ao buscar notificações de pagamento:", error);
        return [];
    }
};

export const updatePaymentNotificationStatus = async (
    notificationId: string,
    status: import('../types').PaymentNotification['status']
): Promise<void> => {
    await databases.updateDocument(
        DATABASE_ID,
        PAYMENT_NOTIFICATIONS_COLLECTION_ID,
        notificationId,
        {
            status,
            updatedAt: new Date().toISOString()
        }
    );
};

// Payment Proofs Collection
export const createPaymentProof = async (proof: Omit<import('../types').PaymentProof, 'id'>): Promise<string> => {
    const response = await databases.createDocument(
        DATABASE_ID,
        PAYMENT_PROOFS_COLLECTION_ID,
        ID.unique(),
        {
            ...proof,
            uploadedAt: new Date().toISOString()
        }
    );
    return response.$id;
};

export const getPaymentProofByNotification = async (notificationId: string): Promise<import('../types').PaymentProof | null> => {
    try {
        const response = await databases.listDocuments(
            DATABASE_ID,
            PAYMENT_PROOFS_COLLECTION_ID,
            [Query.equal('paymentNotificationId', notificationId)]
        );
        if (response.documents.length > 0) {
            return { id: response.documents[0].$id, ...response.documents[0] } as unknown as import('../types').PaymentProof;
        }
        return null;
    } catch (error) {
        console.error("Erro ao buscar comprovante:", error);
        return null;
    }
};

export const confirmPaymentProof = async (
    proofId: string,
    adminId: string,
    notes?: string
): Promise<void> => {
    await databases.updateDocument(
        DATABASE_ID,
        PAYMENT_PROOFS_COLLECTION_ID,
        proofId,
        {
            confirmedBy: adminId,
            confirmedAt: new Date().toISOString(),
            notes: notes || ''
        }
    );
};

// Manuscripts Collection
const MANUSCRIPTS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_MANUSCRIPTS_COLLECTION || 'manuscripts';

export const createManuscript = async (manuscript: Omit<import('../types').Manuscript, 'id'>): Promise<string> => {
    const response = await databases.createDocument(
        DATABASE_ID,
        MANUSCRIPTS_COLLECTION_ID,
        ID.unique(),
        {
            ...manuscript,
            submittedDate: new Date().toISOString()
        }
    );
    return response.$id;
};

export const getManuscriptsByAuthor = async (authorId: string): Promise<import('../types').Manuscript[]> => {
    try {
        const response = await databases.listDocuments(
            DATABASE_ID,
            MANUSCRIPTS_COLLECTION_ID,
            [Query.equal('authorId', authorId), Query.orderDesc('submittedDate')]
        );
        return response.documents.map(doc => ({ id: doc.$id, ...doc } as unknown as import('../types').Manuscript));
    } catch (error) {
        console.error("Erro ao buscar manuscritos:", error);
        return [];
    }
};

export const getAllManuscripts = async (): Promise<import('../types').Manuscript[]> => {
    try {
        const response = await databases.listDocuments(
            DATABASE_ID,
            MANUSCRIPTS_COLLECTION_ID,
            [Query.orderDesc('submittedDate')]
        );
        return response.documents.map(doc => ({ id: doc.$id, ...doc } as unknown as import('../types').Manuscript));
    } catch (error) {
        console.error("Erro ao buscar todos os manuscritos:", error);
        return [];
    }
};

export const updateManuscriptStatus = async (
    manuscriptId: string,
    status: 'approved' | 'rejected',
    feedback?: string
): Promise<void> => {
    await databases.updateDocument(
        DATABASE_ID,
        MANUSCRIPTS_COLLECTION_ID,
        manuscriptId,
        {
            status,
            feedback: feedback || '',
            reviewedDate: new Date().toISOString()
        }
    );
};

// Statistics & Royalties
export const getAdminStats = async (): Promise<{ totalBooks: number; totalUsers: number; pendingOrders: number; revenue: number }> => {
    try {
        const books = await databases.listDocuments(DATABASE_ID, BOOKS_COLLECTION_ID, [Query.limit(1)]);
        const users = await databases.listDocuments(DATABASE_ID, USERS_COLLECTION_ID, [Query.limit(1)]);
        const confirmedPayments = await databases.listDocuments(DATABASE_ID, PAYMENT_NOTIFICATIONS_COLLECTION_ID, [Query.equal('status', 'confirmed')]);
        const pendingPayments = await databases.listDocuments(DATABASE_ID, PAYMENT_NOTIFICATIONS_COLLECTION_ID, [Query.equal('status', 'proof_uploaded')]);

        const totalRevenue = confirmedPayments.documents.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);

        return {
            totalBooks: books.total,
            totalUsers: users.total,
            pendingOrders: pendingPayments.total,
            revenue: totalRevenue
        };
    } catch (error) {
        console.error("Erro ao buscar estatísticas administrativas:", error);
        return { totalBooks: 0, totalUsers: 0, pendingOrders: 0, revenue: 0 };
    }
};

export const getAuthorStats = async (authorId: string): Promise<{ publishedBooks: number; totalSales: number; totalRoyalties: number }> => {
    try {
        // 1. Published books
        const books = await databases.listDocuments(DATABASE_ID, BOOKS_COLLECTION_ID, [Query.equal('authorId', authorId)]);

        // 2. Sales (from confirmed payments)
        const confirmedPayments = await databases.listDocuments(DATABASE_ID, PAYMENT_NOTIFICATIONS_COLLECTION_ID, [Query.equal('status', 'confirmed')]);

        let totalSales = 0;
        let authorRevenue = 0;

        confirmedPayments.documents.forEach(doc => {
            const items = doc.items as any[];
            items.forEach(item => {
                if (item.authorId === authorId) {
                    totalSales += item.quantity;
                    authorRevenue += (item.price * item.quantity);
                }
            });
        });

        return {
            publishedBooks: books.total,
            totalSales: totalSales,
            totalRoyalties: authorRevenue * 0.7 // 70% Royalty
        };
    } catch (error) {
        console.error("Erro ao buscar estatísticas do autor:", error);
        return { publishedBooks: 0, totalSales: 0, totalRoyalties: 0 };
    }
};

export const getAuthorConfirmedSales = async (authorId: string): Promise<any[]> => {
    try {
        const confirmedPayments = await databases.listDocuments(DATABASE_ID, PAYMENT_NOTIFICATIONS_COLLECTION_ID, [Query.equal('status', 'confirmed'), Query.orderDesc('createdAt')]);

        const authorSales: any[] = [];
        confirmedPayments.documents.forEach(doc => {
            const items = doc.items as any[];
            items.forEach(item => {
                if (item.authorId === authorId) {
                    authorSales.push({
                        id: doc.$id,
                        orderId: doc.orderId,
                        bookTitle: item.bookTitle,
                        quantity: item.quantity,
                        price: item.price,
                        total: item.price * item.quantity,
                        royalty: (item.price * item.quantity) * 0.7,
                        date: doc.createdAt,
                        readerName: doc.readerName
                    });
                }
            });
        });

        return authorSales;
    } catch (error) {
        console.error("Erro ao buscar vendas do autor:", error);
        return [];
    }
};

export const getUserBooks = async (readerId: string): Promise<Book[]> => {
    try {
        const confirmedPayments = await databases.listDocuments(
            DATABASE_ID,
            PAYMENT_NOTIFICATIONS_COLLECTION_ID,
            [Query.equal('readerId', readerId), Query.equal('status', 'confirmed')]
        );

        const bookIds = new Set<string>();
        confirmedPayments.documents.forEach(doc => {
            const items = doc.items as any[];
            items.forEach(item => bookIds.add(item.bookId));
        });

        if (bookIds.size === 0) return [];

        const allBooks = await getBooks();
        return allBooks.filter(book => bookIds.has(book.id));
    } catch (error) {
        console.error("Erro ao buscar livros do utilizador:", error);
        return [];
    }
};

