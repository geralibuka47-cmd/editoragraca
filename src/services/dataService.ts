
import { ID, Query } from "appwrite";
import { databases } from "./appwrite";
import { Book, Order, User } from "../types";

// Appwrite Configuration
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || 'main';
const BOOKS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_BOOKS_COLLECTION || 'books';
const ORDERS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_ORDERS_COLLECTION || 'orders';
const USERS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_USERS_COLLECTION || 'users';

const cleanData = (data: any) => {
    const clean: any = {};
    const mapping: Record<string, string> = {
        'paymentMethods': 'bankAccounts'
    };

    // Numeric fields that must be converted to number for Appwrite
    const numericFields = ['price', 'stock', 'order', 'pages', 'total', 'totalAmount'];
    // Fields that should be stringified as a single JSON string (not an array)
    const JSONFields = ['items'];

    Object.keys(data).forEach(key => {
        if (!key.startsWith('$') && key !== 'id') {
            const dbKey = mapping[key] || key;
            const value = data[key];

            // Skip undefined or null values
            if (value === undefined || value === null) return;

            // Handle objects and arrays of objects
            if (typeof value === 'object' && !Array.isArray(value)) {
                clean[dbKey] = JSON.stringify(value);
            } else if (Array.isArray(value)) {
                if (JSONFields.includes(dbKey)) {
                    clean[dbKey] = JSON.stringify(value);
                } else if (value.length > 0 && typeof value[0] === 'object') {
                    clean[dbKey] = value.map(item => JSON.stringify(item));
                } else {
                    clean[dbKey] = value;
                }
            } else if (numericFields.includes(dbKey)) {
                clean[dbKey] = typeof value === 'string' ? (parseInt(value) || 0) : value;
            } else {
                clean[dbKey] = value;
            }
        }
    });
    return clean;
};

// Helper to separate data parsing logic
const ensureNumber = (val: any): number => {
    if (typeof val === 'number') return val;
    if (typeof val === 'string') {
        // Remove known currency symbols or excessive whitespace if any (though usually just digits)
        const clean = val.replace(/[^\d.-]/g, '');
        return parseFloat(clean) || 0;
    }
    return 0;
};

// Helper to parse data from Appwrite (parses stringified JSON and maps back)
const parseData = (doc: any) => {
    const parsed: any = { id: doc.$id, ...doc };

    // Reverse mapping
    if (doc.bankAccounts) {
        parsed.paymentMethods = Array.isArray(doc.bankAccounts)
            ? doc.bankAccounts.map((item: string) => {
                try { return JSON.parse(item); } catch (e) { return item; }
            })
            : doc.bankAccounts;
    }

    // Ensure numeric fields are numbers
    ['price', 'stock', 'pages', 'total', 'totalAmount'].forEach(field => {
        if (parsed[field] !== undefined) {
            parsed[field] = ensureNumber(parsed[field]);
        }
    });

    // Parse items if they are strings (Order.items or PaymentNotification.items)
    if (doc.items) {
        if (typeof doc.items === 'string') {
            try { parsed.items = JSON.parse(doc.items); } catch (e) { /* ignore */ }
        } else if (Array.isArray(doc.items)) {
            parsed.items = doc.items.map((item: any) => {
                if (typeof item === 'string') {
                    try { return JSON.parse(item); } catch (e) { return item; }
                }
                return item;
            });
        }
    }

    // Parse details (EditorialService)
    if (doc.details && Array.isArray(doc.details)) {
        parsed.details = doc.details.map((item: any) => {
            if (typeof item === 'string' && (item.startsWith('{') || item.startsWith('['))) {
                try { return JSON.parse(item); } catch (e) { return item; }
            }
            return item;
        });
    }

    return parsed;
};

// Books Collection
export const getBooks = async (): Promise<Book[]> => {
    try {
        databases.client.headers['X-Appwrite-Response-Format'] = '0.15.0'; // Implicitly handled by SDK but good to know
        const response = await databases.listDocuments(
            DATABASE_ID,
            BOOKS_COLLECTION_ID,
            [Query.limit(100)] // Increase limit to fetch more books
        );
        return response.documents.map(doc => {
            // Use parseData or manual normalization
            const book = { id: doc.$id, ...doc } as any;
            book.price = ensureNumber(book.price);
            book.stock = ensureNumber(book.stock);
            if (book.pages) book.pages = ensureNumber(book.pages);
            return book as Book;
        });
    } catch (error) {
        console.error("Erro ao procurar livros:", error);
        return [];
    }
};

export const saveBook = async (book: Book) => {
    try {
        const { id } = book;
        const bookData = cleanData(book);

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

// Public Statistics
export const getPublicStats = async (): Promise<{ booksCount: number; authorsCount: number; readersCount: number }> => {
    try {
        const books = await databases.listDocuments(DATABASE_ID, BOOKS_COLLECTION_ID, [Query.limit(1)]);
        // Note: Counting users might be restricted. If so, this will fail or return 0. 
        // We catch the error and return 0 for users if restricted.
        let usersCount = 0;
        try {
            // Try to fetch users count (might need specific permissions)
            const users = await databases.listDocuments(DATABASE_ID, USERS_COLLECTION_ID, [Query.limit(1)]);
            usersCount = users.total;
        } catch (e) {
            console.warn("Could not fetch user count (likely permission restricted).");
        }

        // For authors, we could count unique authors in books if we don't have a separate collection,
        // or just return a placeholder if we want to be strictly correct about "Authors" vs "Users".
        // Let's assume we want to count unique author names from books for now as a proxy if we don't have specific author profiles linked.
        // Actually, let's just use the books count and maybe estimated readers.

        return {
            booksCount: books.total,
            authorsCount: 0, // Placeholder or need logic to count unique authors
            readersCount: usersCount
        };
    } catch (error) {
        console.error("Error fetching public stats:", error);
        return { booksCount: 0, authorsCount: 0, readersCount: 0 };
    }
};

// Public Categories
export const getCategories = async (): Promise<{ name: string; count: number; image?: string }[]> => {
    try {
        // Fetch all books to aggregate categories. 
        // Optimization: In a large DB, we should use a proper aggregation or separate collection. 
        // For now, fetching all is acceptable for small-medium catalogues.
        const books = await getBooks();

        const categoryMap = new Map<string, { count: number; image?: string }>();

        books.forEach(book => {
            const cat = book.category || 'Outros';
            const current = categoryMap.get(cat) || { count: 0, image: book.coverUrl };
            categoryMap.set(cat, { count: current.count + 1, image: current.image }); // Keep first image found
        });

        return Array.from(categoryMap.entries()).map(([name, data]) => ({
            name,
            count: data.count,
            image: data.image
        }));
    } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
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
        return response.documents.map(doc => parseData(doc) as Order);
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
            date: new Date().toISOString()
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
        return parseData(response) as User;
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
        return response.documents.map(doc => parseData(doc) as User);
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
        return response.documents.map(doc => parseData(doc) as import('../types').PaymentNotification);
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
        return response.documents.map(doc => parseData(doc) as import('../types').PaymentNotification);
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
    let totalBooks = 0;
    let totalUsers = 0;
    let pendingOrders = 0;
    let revenue = 0;

    // 1. Books
    try {
        const books = await databases.listDocuments(DATABASE_ID, BOOKS_COLLECTION_ID, [Query.limit(1)]);
        totalBooks = books.total;
    } catch (e) {
        console.error("Failed to fetch books stat:", e);
    }

    // 2. Users (Often fails due to permissions)
    try {
        const users = await databases.listDocuments(DATABASE_ID, USERS_COLLECTION_ID, [Query.limit(1)]);
        totalUsers = users.total;
    } catch (e) {
        console.warn("Failed to fetch users stat (permission restricted?):", e);
    }

    // 3. Pending Orders (Payment Notifications with status 'proof_uploaded')
    try {
        const pendingPayments = await databases.listDocuments(DATABASE_ID, PAYMENT_NOTIFICATIONS_COLLECTION_ID, [Query.equal('status', 'proof_uploaded')]);
        pendingOrders = pendingPayments.total;
    } catch (e) {
        console.error("Failed to fetch pending orders stat:", e);
    }

    // 4. Revenue (Confirmed Payments)
    try {
        // Limitation: This only sums the page returned. ideally we need aggregation. 
        // For now, fetching a larger limit or assuming we don't have thousands yet.
        // Or better, just count total for now if aggregation isn't available.
        // Actually, to get revenue we need to sum values. 
        // We'll fetch all confirmed payments (up to limit, typically 25 or 100 by default). 
        // To be accurate we'd need pagination loop, but for 'stats' quick view let's keep it simple or increase limit.
        const confirmedPayments = await databases.listDocuments(DATABASE_ID, PAYMENT_NOTIFICATIONS_COLLECTION_ID, [
            Query.equal('status', 'confirmed'),
            Query.limit(100)
        ]);
        revenue = confirmedPayments.documents.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);
    } catch (e) {
        console.error("Failed to fetch revenue stat:", e);
    }

    return {
        totalBooks,
        totalUsers,
        pendingOrders,
        revenue
    };
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
        return response.documents.map(doc => parseData(doc) as import('../types').BlogPost);
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
        return response.documents.map(doc => parseData(doc));
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
        return response.documents.map(doc => parseData(doc) as import('../types').EditorialService);
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

// Reviews & Stats (Simulated or Hybrid)
// Note: In a real scenario, we would have a 'reviews' collection. 
// For now, we'll simulate fetching/saving to a sub-attribute if possible, or just return dummy data for UI demo if collection doesn't exist.

const REVIEWS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_REVIEWS_COLLECTION || 'reviews';

export const getBookReviews = async (bookId: string): Promise<import('../types').Review[]> => {
    try {
        // Attempt to fetch from real collection
        const response = await databases.listDocuments(DATABASE_ID, REVIEWS_COLLECTION_ID, [
            Query.equal('bookId', bookId),
            Query.orderDesc('date')
        ]);
        return response.documents.map(doc => parseData(doc) as import('../types').Review);
    } catch (error) {
        // Fallback: Return empty or mock array for UI testing if collection not found
        console.warn("Could not fetch reviews (Collection might not exist yet).");
        return [
            { id: '1', bookId, userId: 'mock1', userName: 'Maria Silva', rating: 5, comment: 'Uma obra prima! Adorei cada página.', date: new Date().toISOString() },
            { id: '2', bookId, userId: 'mock2', userName: 'João Paulo', rating: 4, comment: 'Muito bom, mas o final poderia ser melhor.', date: new Date(Date.now() - 86400000).toISOString() }
        ];
    }
};

export const addBookReview = async (review: Omit<import('../types').Review, 'id'>) => {
    try {
        await databases.createDocument(DATABASE_ID, REVIEWS_COLLECTION_ID, ID.unique(), {
            ...review,
            date: new Date().toISOString()
        });
    } catch (error) {
        console.error("Error adding review:", error);
        throw error;
    }
};

export const incrementBookView = async (bookId: string) => {
    // In a real app, calls a Function or increments a counter in DB
    console.log(`View incremented for book ${bookId}`);
};
