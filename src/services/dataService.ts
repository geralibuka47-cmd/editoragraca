
import { ID, Query } from "appwrite";
import { databases } from "./appwrite";
import { Book, Order, User } from "../types";

// Appwrite Configuration
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || 'main';
const BOOKS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_BOOKS_COLLECTION || 'books';
const ORDERS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_ORDERS_COLLECTION || 'orders';
const USERS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_USERS_COLLECTION || 'users';

// Helper to clean data for Appwrite (removes system fields and custom id)
const cleanData = (data: any) => {
    const clean: any = {};
    Object.keys(data).forEach(key => {
        if (!key.startsWith('$') && key !== 'id') {
            clean[key] = data[key];
        }
    });
    return clean;
};

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
        const { id } = book;
        const bookData = cleanData(book);

        // Ensure numeric fields are valid
        if (typeof bookData.price === 'string') bookData.price = parseInt(bookData.price) || 0;
        if (typeof bookData.stock === 'string') bookData.stock = parseInt(bookData.stock) || 0;
        if (isNaN(bookData.price)) bookData.price = 0;
        if (isNaN(bookData.stock)) bookData.stock = 0;

        // Validation
        if (!bookData.title || !bookData.author) {
            throw new Error("Título e Autor são obrigatórios.");
        }

        // If it's an existing book
        if (id && id.length > 5 && !id.startsWith('temp_')) {
            try {
                await databases.updateDocument(DATABASE_ID, BOOKS_COLLECTION_ID, id, bookData);
                console.log("Livro atualizado com sucesso:", id);
                return;
            } catch (e: any) {
                console.warn("Falha ao atualizar, tentando criar novo:", e.message);
            }
        }

        await databases.createDocument(DATABASE_ID, BOOKS_COLLECTION_ID, ID.unique(), bookData);
        console.log("Novo livro criado com sucesso");
    } catch (error: any) {
        console.error("Erro total ao salvar livro:", error);
        throw error;
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
    const orderData = cleanData(order);
    const response = await databases.createDocument(
        DATABASE_ID,
        ORDERS_COLLECTION_ID,
        ID.unique(),
        {
            ...orderData,
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
    const userData = cleanData(user);
    try {
        await databases.updateDocument(DATABASE_ID, USERS_COLLECTION_ID, user.id, userData);
    } catch (error) {
        try {
            await databases.createDocument(DATABASE_ID, USERS_COLLECTION_ID, user.id, userData);
        } catch (e) {
            console.error("Erro ao salvar perfil:", e);
        }
    }
};

export const getAllUsers = async (): Promise<User[]> => {
    try {
        const response = await databases.listDocuments(DATABASE_ID, USERS_COLLECTION_ID);
        return response.documents.map(doc => ({ id: doc.$id, ...doc } as unknown as User));
    } catch (error) {
        console.error("Erro ao buscar utilizadores:", error);
        return [];
    }
};

// Payment Notifications Collection
const PAYMENT_NOTIFICATIONS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_PAYMENT_NOTIFICATIONS_COLLECTION || 'payment_notifications';
const PAYMENT_PROOFS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_PAYMENT_PROOFS_COLLECTION || 'payment_proofs';

export const createPaymentNotification = async (notification: Omit<import('../types').PaymentNotification, 'id'>): Promise<string> => {
    const data = cleanData(notification);
    const response = await databases.createDocument(
        DATABASE_ID,
        PAYMENT_NOTIFICATIONS_COLLECTION_ID,
        ID.unique(),
        {
            ...data,
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
    const data = cleanData(proof);
    const response = await databases.createDocument(
        DATABASE_ID,
        PAYMENT_PROOFS_COLLECTION_ID,
        ID.unique(),
        {
            ...data,
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
    const data = cleanData(manuscript);
    const response = await databases.createDocument(
        DATABASE_ID,
        MANUSCRIPTS_COLLECTION_ID,
        ID.unique(),
        {
            ...data,
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

const BLOG_COLLECTION_ID = import.meta.env.VITE_APPWRITE_BLOG_COLLECTION || 'blog_posts';
const TEAM_COLLECTION_ID = import.meta.env.VITE_APPWRITE_TEAM_COLLECTION || 'team_members';
const SERVICES_COLLECTION_ID = import.meta.env.VITE_APPWRITE_SERVICES_COLLECTION || 'editorial_services';

// Blog Posts
export const getBlogPosts = async (): Promise<import('../types').BlogPost[]> => {
    try {
        const response = await databases.listDocuments(DATABASE_ID, BLOG_COLLECTION_ID, [Query.orderDesc('date')]);
        return response.documents.map(doc => ({ id: doc.$id, ...doc } as unknown as import('../types').BlogPost));
    } catch (error) {
        console.error("Erro ao buscar blog posts:", error);
        return [];
    }
};

export const saveBlogPost = async (post: import('../types').BlogPost) => {
    const data = cleanData(post);
    if (post.id && !post.id.startsWith('temp_')) {
        await databases.updateDocument(DATABASE_ID, BLOG_COLLECTION_ID, post.id, data);
    } else {
        await databases.createDocument(DATABASE_ID, BLOG_COLLECTION_ID, ID.unique(), data);
    }
};

export const deleteBlogPost = async (id: string) => {
    await databases.deleteDocument(DATABASE_ID, BLOG_COLLECTION_ID, id);
};

// Team Members
export const getTeamMembers = async (): Promise<any[]> => {
    try {
        const response = await databases.listDocuments(DATABASE_ID, TEAM_COLLECTION_ID, [Query.orderAsc('order')]);
        return response.documents.map(doc => ({ id: doc.$id, ...doc }));
    } catch (error) {
        console.error("Erro ao buscar equipa:", error);
        return [];
    }
};

export const saveTeamMember = async (member: any) => {
    const data = cleanData(member);
    if (member.id && !member.id.startsWith('temp_')) {
        await databases.updateDocument(DATABASE_ID, TEAM_COLLECTION_ID, member.id, data);
    } else {
        await databases.createDocument(DATABASE_ID, TEAM_COLLECTION_ID, ID.unique(), data);
    }
};

export const deleteTeamMember = async (id: string) => {
    await databases.deleteDocument(DATABASE_ID, TEAM_COLLECTION_ID, id);
};

// Editorial Services
export const getEditorialServices = async (): Promise<import('../types').EditorialService[]> => {
    try {
        const response = await databases.listDocuments(DATABASE_ID, SERVICES_COLLECTION_ID, [Query.orderAsc('order')]);
        return response.documents.map(doc => ({ id: doc.$id, ...doc } as unknown as import('../types').EditorialService));
    } catch (error) {
        console.error("Erro ao buscar serviços:", error);
        return [];
    }
};

export const saveEditorialService = async (service: import('../types').EditorialService) => {
    const data = cleanData(service);
    if (service.id && !service.id.startsWith('temp_')) {
        await databases.updateDocument(DATABASE_ID, SERVICES_COLLECTION_ID, service.id, data);
    } else {
        await databases.createDocument(DATABASE_ID, SERVICES_COLLECTION_ID, ID.unique(), data);
    }
};

export const deleteEditorialService = async (id: string) => {
    await databases.deleteDocument(DATABASE_ID, SERVICES_COLLECTION_ID, id);
};
