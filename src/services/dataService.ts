import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    Timestamp,
    Query,
    DocumentData,
    increment,
    writeBatch,
    runTransaction
} from 'firebase/firestore';
import { db } from './firebase';
import { Book, Order, User } from '../types';

// Firestore Collections
const COLLECTIONS = {
    BOOKS: 'books',
    ORDERS: 'orders',
    USERS: 'users',
    BLOG: 'blog_posts',
    TEAM: 'team_members',
    SERVICES: 'editorial_services',
    REVIEWS: 'reviews',
    PAYMENT_NOTIFICATIONS: 'payment_notifications',
    PAYMENT_PROOFS: 'payment_proofs',
    MANUSCRIPTS: 'manuscripts',
    BLOG_LIKES: 'blog_likes',
    BLOG_COMMENTS: 'blog_comments',
    BOOK_VIEWS: 'book_views',
    BOOK_FAVORITES: 'book_favorites',
    SITE_CONTENT: 'site_content',
    TESTIMONIALS: 'testimonials',
    NOTIFICATIONS: 'notifications'
};

// Helper: Convert Firestore Timestamp to ISO string
const timestampToString = (timestamp: any): string | undefined => {
    if (!timestamp) return undefined;
    if (timestamp.toDate) return timestamp.toDate().toISOString();
    if (timestamp instanceof Date) return timestamp.toISOString();
    return timestamp;
};

// Helper: Parse Firestore document to frontend format
const parseFirestoreDoc = (docData: any, id: string): any => {
    if (!docData) return null;

    const parsed: any = { id, ...docData };

    // Convert timestamps
    if (parsed.createdAt) parsed.createdAt = timestampToString(parsed.createdAt);
    if (parsed.updatedAt) parsed.updatedAt = timestampToString(parsed.updatedAt);
    if (parsed.publishedAt) parsed.publishedAt = timestampToString(parsed.publishedAt);
    if (parsed.submittedDate) parsed.submittedDate = timestampToString(parsed.submittedDate);
    if (parsed.reviewedDate) parsed.reviewedDate = timestampToString(parsed.reviewedDate);
    if (parsed.launchDate) parsed.launchDate = timestampToString(parsed.launchDate);
    if (parsed.uploadedAt) parsed.uploadedAt = timestampToString(parsed.uploadedAt);
    if (parsed.confirmedAt) parsed.confirmedAt = timestampToString(parsed.confirmedAt);
    if (parsed.date) parsed.date = timestampToString(parsed.date);

    return parsed;
};

// Helper: Prepare data for Firestore (convert dates, remove undefined)
const prepareForFirestore = (data: any): any => {
    const clean: any = {};

    Object.keys(data).forEach(key => {
        let value = data[key];

        // Skip undefined values
        if (value === undefined) return;

        // Skip temporary IDs
        if (key === 'id' && typeof value === 'string' && value.startsWith('temp_')) return;

        // Convert ISO strings to Timestamps
        if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
            try {
                clean[key] = Timestamp.fromDate(new Date(value));
                return;
            } catch (e) {
                // Keep as string if conversion fails
            }
        }

        // Handle numbers
        if (['price', 'total', 'rating', 'pages', 'displayOrder'].includes(key)) {
            clean[key] = Number(value) || 0;
        } else if (key === 'stock') {
            // Allow stock to be null for digital books, otherwise default to 0
            if (value === null || value === undefined) {
                clean[key] = data.format === 'digital' ? null : 0;
            } else {
                clean[key] = Number(value);
            }
        } else {
            clean[key] = value;
        }
    });

    return clean;
};

// ==================== BOOKS ====================

// Cache implementation
let booksCache: Book[] | null = null;
let lastBooksFetch = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const getBooks = async (forceRefresh = false): Promise<Book[]> => {
    const now = Date.now();
    if (!forceRefresh && booksCache && (now - lastBooksFetch < CACHE_DURATION)) {
        return booksCache;
    }

    try {
        const q = query(collection(db, COLLECTIONS.BOOKS), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);

        const books = snapshot.docs.map(doc =>
            parseFirestoreDoc(doc.data(), doc.id)
        ) as Book[];

        booksCache = books;
        lastBooksFetch = now;

        return books;
    } catch (error) {
        console.error('Erro ao procurar livros:', error);
        return booksCache || [];
    }
};

export const getBooksMinimal = async (forceRefresh = false): Promise<Book[]> => {
    // For Firestore, we fetch all since there's no SELECT equivalent
    // But we could optimize by using a separate minimal collection if needed
    return getBooks(forceRefresh);
};

export const getBookById = async (id: string): Promise<Book | null> => {
    try {
        const docRef = doc(db, COLLECTIONS.BOOKS, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return parseFirestoreDoc(docSnap.data(), docSnap.id) as Book;
        }
        return null;
    } catch (error) {
        console.error('Erro ao buscar livro:', error);
        return null;
    }
};

export const saveBook = async (book: Book) => {
    try {
        const bookData = prepareForFirestore(book);
        const { id, ...payload } = bookData;

        if (id && id.length > 5 && !id.startsWith('temp_')) {
            // Update existing
            const docRef = doc(db, COLLECTIONS.BOOKS, id);
            await updateDoc(docRef, {
                ...payload,
                updatedAt: Timestamp.now()
            });
        } else {
            // Create new
            await addDoc(collection(db, COLLECTIONS.BOOKS), {
                ...payload,
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now()
            });
        }

        // Invalidate cache
        booksCache = null;
        lastBooksFetch = 0;
    } catch (error) {
        console.error('Erro ao salvar livro:', error);
        throw error;
    }
};

export const deleteBook = async (id: string) => {
    try {
        await deleteDoc(doc(db, COLLECTIONS.BOOKS, id));
        // Invalidate cache
        booksCache = null;
        lastBooksFetch = 0;
    } catch (error) {
        console.error('Erro ao eliminar livro:', error);
        throw error;
    }
};

// ==================== ORDERS ====================

export const getOrders = async (userId?: string): Promise<Order[]> => {
    try {
        let q;
        if (userId) {
            q = query(
                collection(db, COLLECTIONS.ORDERS),
                where('customerId', '==', userId),
                orderBy('createdAt', 'desc')
            );
        } else {
            q = query(collection(db, COLLECTIONS.ORDERS), orderBy('createdAt', 'desc'));
        }

        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc =>
            parseFirestoreDoc(doc.data(), doc.id)
        ) as Order[];
    } catch (error) {
        console.error('Erro ao procurar pedidos:', error);
        return [];
    }
};

export const createOrder = async (order: Omit<Order, 'id'>): Promise<{ id: string; orderNumber: string }> => {
    try {
        const orderNumber = `#GRA-${Date.now().toString().slice(-6)}`;
        const orderData = prepareForFirestore({
            ...order,
            orderNumber
        });

        // Use a transaction to create the order AND decrement stock
        const resultId = await runTransaction(db, async (transaction) => {
            // 1. Check stock for all items
            for (const item of order.items) {
                if (!item.bookId) continue;

                const bookRef = doc(db, COLLECTIONS.BOOKS, item.bookId);
                const bookDoc = await transaction.get(bookRef);

                if (!bookDoc.exists()) {
                    throw new Error(`Livro não encontrado: ${item.title}`);
                }

                const bookData = bookDoc.data() as Book;
                const currentStock = bookData.stock;
                const isDigital = bookData.format === 'digital';

                // Skip stock check for digital books
                if (isDigital) continue;

                // If stock is defined and less than requested quantity
                if (currentStock !== undefined && currentStock !== null && currentStock < item.quantity) {
                    throw new Error(`Stock insuficiente para: ${item.title} (Disponível: ${currentStock})`);
                }

                // 2. Decrement stock if it exists
                if (currentStock !== undefined && currentStock !== null) {
                    transaction.update(bookRef, {
                        stock: currentStock - item.quantity,
                        updatedAt: Timestamp.now()
                    });
                }
            }

            // 3. Create the order document
            const orderRef = doc(collection(db, COLLECTIONS.ORDERS));
            transaction.set(orderRef, {
                ...orderData,
                createdAt: Timestamp.now()
            });

            return orderRef.id;
        });

        // Clear cache as books stock changed
        booksCache = null;
        lastBooksFetch = 0;

        return { id: resultId, orderNumber };
    } catch (error) {
        console.error('Erro ao criar pedido:', error);
        throw error;
    }
};

export const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
        const orderRef = doc(db, COLLECTIONS.ORDERS, orderId);

        await runTransaction(db, async (transaction) => {
            const orderDoc = await transaction.get(orderRef);
            if (!orderDoc.exists()) throw new Error("Pedido não encontrado");

            const orderData = orderDoc.data() as Order;
            const currentStatus = orderData.status;

            // If we are cancelling an order that wasn't already cancelled
            if (status === 'Cancelado' && currentStatus !== 'Cancelado') {
                for (const item of orderData.items) {
                    if (!item.bookId) continue;
                    const bookRef = doc(db, COLLECTIONS.BOOKS, item.bookId);
                    const bookDoc = await transaction.get(bookRef);
                    if (bookDoc.exists()) {
                        const stock = bookDoc.data().stock;
                        if (stock !== undefined && stock !== null) {
                            transaction.update(bookRef, {
                                stock: stock + item.quantity,
                                updatedAt: Timestamp.now()
                            });
                        }
                    }
                }
            }
            // If we are restoring an order from cancelled status
            else if (currentStatus === 'Cancelado' && status !== 'Cancelado') {
                // Should probably check stock again here, but let's keep it simple for now or prevent this in UI
                for (const item of orderData.items) {
                    if (!item.bookId) continue;
                    const bookRef = doc(db, COLLECTIONS.BOOKS, item.bookId);
                    const bookDoc = await transaction.get(bookRef);
                    if (bookDoc.exists()) {
                        const stock = bookDoc.data().stock;
                        if (stock !== undefined && stock !== null) {
                            if (stock < item.quantity) throw new Error(`Stock insuficiente para reativar: ${item.title}`);
                            transaction.update(bookRef, {
                                stock: stock - item.quantity,
                                updatedAt: Timestamp.now()
                            });
                        }
                    }
                }
            }

            transaction.update(orderRef, {
                status,
                updatedAt: Timestamp.now()
            });
        });

        // Clear cache as books stock might have changed
        booksCache = null;
        lastBooksFetch = 0;
    } catch (error) {
        console.error('Erro ao atualizar status do pedido:', error);
        throw error;
    }
};

export const getAllOrders = async (): Promise<Order[]> => {
    try {
        const q = query(
            collection(db, COLLECTIONS.ORDERS),
            orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => parseFirestoreDoc(doc.data(), doc.id)) as Order[];
    } catch (error) {
        console.error('Erro ao buscar todos os pedidos:', error);
        return [];
    }
};

// ==================== USERS / PROFILES ====================

export const getUserProfile = async (uid: string): Promise<User | null> => {
    try {
        const docRef = doc(db, COLLECTIONS.USERS, uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return parseFirestoreDoc(docSnap.data(), docSnap.id) as User;
        }
        return null;
    } catch (error) {
        console.error('Erro ao buscar perfil:', error);
        return null;
    }
};

export const saveUserProfile = async (user: User) => {
    try {
        const userData = prepareForFirestore(user);
        const { id, ...payload } = userData;

        if (id) {
            const docRef = doc(db, COLLECTIONS.USERS, id);
            await setDoc(docRef, {
                ...payload,
                updatedAt: Timestamp.now()
            }, { merge: true });
        }
    } catch (error) {
        console.error('Erro ao salvar perfil:', error);
        throw error;
    }
};

export const getAllUsers = async (): Promise<User[]> => {
    try {
        const snapshot = await getDocs(collection(db, COLLECTIONS.USERS));
        return snapshot.docs.map(doc =>
            parseFirestoreDoc(doc.data(), doc.id)
        ) as User[];
    } catch (error) {
        console.error('Erro ao buscar utilizadores:', error);
        return [];
    }
};

// ==================== PUBLIC STATS ====================

let lastStatsData: any = null;
let lastStatsFetch = 0;
const SHORT_CACHE = 1 * 60 * 1000; // 1 minute

export const getPublicStats = async () => {
    const now = Date.now();
    if (lastStatsData && (now - lastStatsFetch < SHORT_CACHE)) {
        return lastStatsData;
    }

    try {
        // Individual fetches to prevent one failure from breaking all stats
        let booksCount = 0;
        let readersCount = 0;

        try {
            const booksSnapshot = await getDocs(collection(db, COLLECTIONS.BOOKS));
            booksCount = booksSnapshot.size;
        } catch (e) {
            console.warn('Could not fetch books count for stats (likely permission restricted)');
        }

        try {
            const usersSnapshot = await getDocs(collection(db, COLLECTIONS.USERS));
            readersCount = usersSnapshot.size;
        } catch (e) {
            console.warn('Could not fetch users count for stats (likely permission restricted)');
        }

        const stats = {
            booksCount,
            authorsCount: 0,
            readersCount
        };

        lastStatsData = stats;
        lastStatsFetch = now;
        return stats;
    } catch (error) {
        console.error('Error in getPublicStats wrapper:', error);
        return lastStatsData || { booksCount: 0, authorsCount: 0, readersCount: 0 };
    }
};

// ==================== CATEGORIES ====================

export const getCategories = async (): Promise<{ name: string; count: number; image?: string }[]> => {
    try {
        const books = await getBooks();
        const genreMap = new Map<string, { count: number; image?: string }>();

        books.forEach(book => {
            const gen = book.genre || 'Outros';
            const current = genreMap.get(gen) || { count: 0, image: book.coverUrl };
            genreMap.set(gen, { count: current.count + 1, image: current.image });
        });

        return Array.from(genreMap.entries()).map(([name, data]) => ({
            name,
            count: data.count,
            image: data.image
        }));
    } catch (error) {
        return [];
    }
};

// Export the backup function names to maintain compatibility
export { getPublicStats as getSiteStats };

// ==================== BLOG ====================

let blogPostsCache: any[] | null = null;
let lastBlogFetch = 0;

export const getBlogPosts = async (forceRefresh = false): Promise<any[]> => {
    const now = Date.now();
    if (!forceRefresh && blogPostsCache && (now - lastBlogFetch < CACHE_DURATION)) {
        return blogPostsCache;
    }

    try {
        const q = query(collection(db, COLLECTIONS.BLOG), orderBy('date', 'desc'));
        const snapshot = await getDocs(q);

        const posts = snapshot.docs.map(doc => parseFirestoreDoc(doc.data(), doc.id));

        blogPostsCache = posts;
        lastBlogFetch = now;

        return posts;
    } catch (error) {
        console.error('Erro ao buscar posts:', error);
        return blogPostsCache || [];
    }
};

export const saveBlogPost = async (post: any) => {
    try {
        const postData = prepareForFirestore(post);
        const { id, ...payload } = postData;

        if (id && !id.startsWith('temp_')) {
            const docRef = doc(db, COLLECTIONS.BLOG, id);
            await setDoc(docRef, { ...payload, updatedAt: Timestamp.now() }, { merge: true });
        } else {
            await addDoc(collection(db, COLLECTIONS.BLOG), {
                ...payload,
                date: Timestamp.now()
            });
        }

        blogPostsCache = null;
        lastBlogFetch = 0;
    } catch (error) {
        console.error('Erro ao salvar post:', error);
        throw error;
    }
};

export const deleteBlogPost = async (id: string) => {
    try {
        await deleteDoc(doc(db, COLLECTIONS.BLOG, id));
        blogPostsCache = null;
        lastBlogFetch = 0;
    } catch (error) {
        console.error('Erro ao eliminar post:', error);
        throw error;
    }
};

// Blog Interactions
export const getBlogPostInteractions = async (postId: string) => {
    try {
        const likesQuery = query(collection(db, COLLECTIONS.BLOG_LIKES), where('postId', '==', postId));
        const commentsQuery = query(
            collection(db, COLLECTIONS.BLOG_COMMENTS),
            where('postId', '==', postId),
            orderBy('createdAt', 'asc')
        );

        const [likesSnapshot, commentsSnapshot] = await Promise.all([
            getDocs(likesQuery),
            getDocs(commentsQuery)
        ]);

        return {
            likesCount: likesSnapshot.size,
            comments: commentsSnapshot.docs.map(doc => parseFirestoreDoc(doc.data(), doc.id))
        };
    } catch (error) {
        console.error('Error fetching interactions:', error);
        return { likesCount: 0, comments: [] };
    }
};

export const checkUserLike = async (postId: string, userId: string): Promise<boolean> => {
    try {
        const q = query(
            collection(db, COLLECTIONS.BLOG_LIKES),
            where('postId', '==', postId),
            where('userId', '==', userId)
        );
        const snapshot = await getDocs(q);
        return !snapshot.empty;
    } catch (error) {
        return false;
    }
};

export const toggleBlogPostLike = async (postId: string, userId: string): Promise<boolean> => {
    try {
        const isLiked = await checkUserLike(postId, userId);

        if (isLiked) {
            const q = query(
                collection(db, COLLECTIONS.BLOG_LIKES),
                where('postId', '==', postId),
                where('userId', '==', userId)
            );
            const snapshot = await getDocs(q);
            snapshot.forEach(async (docSnapshot) => {
                await deleteDoc(docSnapshot.ref);
            });
            return false;
        } else {
            await addDoc(collection(db, COLLECTIONS.BLOG_LIKES), {
                postId,
                userId,
                createdAt: Timestamp.now()
            });
            return true;
        }
    } catch (error) {
        console.error('Error toggling like:', error);
        return false;
    }
};

export const addBlogPostComment = async (comment: { postId: string; userId: string; userName: string; content: string }) => {
    try {
        await addDoc(collection(db, COLLECTIONS.BLOG_COMMENTS), {
            ...comment,
            createdAt: Timestamp.now()
        });
    } catch (error) {
        console.error('Error adding comment:', error);
        throw error;
    }
};

// ==================== TEAM ====================

export const getTeamMembers = async () => {
    try {
        const q = query(collection(db, COLLECTIONS.TEAM), orderBy('displayOrder', 'asc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => parseFirestoreDoc(doc.data(), doc.id));
    } catch (error) {
        console.error('Erro ao buscar equipe:', error);
        return [];
    }
};

export const getTeamMemberById = async (id: string) => {
    try {
        const docRef = doc(db, COLLECTIONS.TEAM, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return parseFirestoreDoc(docSnap.data(), docSnap.id);
        }
        return null;
    } catch (error) {
        console.error('Erro ao buscar membro da equipe:', error);
        return null;
    }
};

export const saveTeamMember = async (member: any) => {
    try {
        const memberData = prepareForFirestore(member);
        const { id, ...payload } = memberData;

        if (id && !id.startsWith('temp_')) {
            await setDoc(doc(db, COLLECTIONS.TEAM, id), payload, { merge: true });
        } else {
            await addDoc(collection(db, COLLECTIONS.TEAM), payload);
        }
    } catch (error) {
        console.error('Erro ao salvar membro:', error);
        throw error;
    }
};

export const deleteTeamMember = async (id: string) => {
    try {
        await deleteDoc(doc(db, COLLECTIONS.TEAM, id));
    } catch (error) {
        console.error('Erro ao eliminar membro:', error);
        throw error;
    }
};

// ==================== SERVICES ====================

export const getEditorialServices = async () => {
    try {
        const q = query(collection(db, COLLECTIONS.SERVICES), orderBy('displayOrder', 'asc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => parseFirestoreDoc(doc.data(), doc.id));
    } catch (error) {
        console.error('Erro ao buscar serviços:', error);
        return [];
    }
};

export const saveEditorialService = async (service: any) => {
    try {
        const serviceData = prepareForFirestore(service);
        const { id, ...payload } = serviceData;

        if (id && !id.startsWith('temp_')) {
            await setDoc(doc(db, COLLECTIONS.SERVICES, id), payload, { merge: true });
        } else {
            await addDoc(collection(db, COLLECTIONS.SERVICES), payload);
        }
    } catch (error) {
        console.error('Erro ao salvar serviço:', error);
        throw error;
    }
};

export const deleteEditorialService = async (id: string) => {
    try {
        await deleteDoc(doc(db, COLLECTIONS.SERVICES, id));
    } catch (error) {
        console.error('Erro ao eliminar serviço:', error);
        throw error;
    }
};

// Alias exports for compatibility
export const getServices = getEditorialServices;
export const saveService = saveEditorialService;
export const deleteService = deleteEditorialService;

// ==================== REVIEWS ====================

export const getBookReviews = async (bookId: string) => {
    try {
        const q = query(
            collection(db, COLLECTIONS.REVIEWS),
            where('bookId', '==', bookId),
            orderBy('date', 'desc')
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => parseFirestoreDoc(doc.data(), doc.id));
    } catch (error) {
        console.error('Error fetching reviews:', error);
        return [];
    }
};

export const addBookReview = async (review: { bookId: string; userId: string; userName: string; rating: number; comment: string }) => {
    try {
        await addDoc(collection(db, COLLECTIONS.REVIEWS), {
            ...review,
            date: Timestamp.now()
        });
    } catch (error) {
        console.error('Error adding review:', error);
        throw error;
    }
};

export const getReviews = getBookReviews; // Alias

// ==================== MANUSCRIPTS ====================

export const createManuscript = async (manuscript: any): Promise<string> => {
    try {
        const manuscriptData = prepareForFirestore(manuscript);
        const docRef = await addDoc(collection(db, COLLECTIONS.MANUSCRIPTS), {
            ...manuscriptData,
            submittedDate: Timestamp.now()
        });
        return docRef.id;
    } catch (error) {
        console.error('Erro ao criar manuscrito:', error);
        throw error;
    }
};

export const getManuscriptsByAuthor = async (authorId: string) => {
    try {
        const q = query(
            collection(db, COLLECTIONS.MANUSCRIPTS),
            where('authorId', '==', authorId),
            orderBy('submittedDate', 'desc')
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => parseFirestoreDoc(doc.data(), doc.id));
    } catch (error) {
        console.error('Erro ao buscar manuscritos:', error);
        return [];
    }
};

export const getAllManuscripts = async () => {
    try {
        const q = query(collection(db, COLLECTIONS.MANUSCRIPTS), orderBy('submittedDate', 'desc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => parseFirestoreDoc(doc.data(), doc.id));
    } catch (error) {
        console.error('Erro ao buscar manuscritos:', error);
        return [];
    }
};

export const updateManuscriptStatus = async (id: string, status: string, feedback?: string) => {
    try {
        const docRef = doc(db, COLLECTIONS.MANUSCRIPTS, id);
        await updateDoc(docRef, {
            status,
            feedback: feedback || '',
            reviewedDate: Timestamp.now()
        });
    } catch (error) {
        console.error('Erro ao atualizar manuscrito:', error);
        throw error;
    }
};

export const getManuscripts = getAllManuscripts; // Alias

// ==================== SITE CONTENT ====================

let siteContentCache: Map<string, Record<string, any>> = new Map();

export const getSiteContent = async (section?: string) => {
    const cacheKey = section || 'all';
    const cached = siteContentCache.get(cacheKey);

    if (cached) {
        return cached;
    }

    try {
        let q;
        if (section) {
            q = query(collection(db, COLLECTIONS.SITE_CONTENT), where('section', '==', section));
        } else {
            q = collection(db, COLLECTIONS.SITE_CONTENT);
        }

        const snapshot = await getDocs(q);
        const contentMap: Record<string, any> = {};

        snapshot.docs.forEach(doc => {
            const data = doc.data();
            contentMap[data.key] = data.content;
        });

        siteContentCache.set(cacheKey, contentMap);
        return contentMap;
    } catch (error) {
        console.error('Error fetching site content:', error);
        return {};
    }
};

export const saveSiteContent = async (key: string, section: string, content: any) => {
    try {
        const docId = `${section}_${key}`;
        const docRef = doc(db, COLLECTIONS.SITE_CONTENT, docId);
        await setDoc(docRef, {
            key,
            section,
            content,
            updatedAt: Timestamp.now()
        }, { merge: true });

        siteContentCache.clear();
    } catch (error) {
        console.error('Error saving site content:', error);
        throw error;
    }
};

// ==================== TESTIMONIALS ====================

let testimonialsCache: any[] | null = null;
let lastTestimonialsFetch = 0;

export const getTestimonials = async (forceRefresh = false) => {
    const now = Date.now();
    if (!forceRefresh && testimonialsCache && (now - lastTestimonialsFetch < CACHE_DURATION)) {
        return testimonialsCache;
    }

    try {
        const q = query(
            collection(db, COLLECTIONS.TESTIMONIALS),
            where('isActive', '==', true),
            orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        const testimonials = snapshot.docs.map(doc => parseFirestoreDoc(doc.data(), doc.id));

        testimonialsCache = testimonials;
        lastTestimonialsFetch = now;

        return testimonials;
    } catch (error: any) {
        // Handle missing index or permissions
        if (error.code === 'failed-precondition') {
            console.warn('Firestore index required for testimonials query. Falling back to all active.');
            try {
                const fallbackQ = query(collection(db, COLLECTIONS.TESTIMONIALS), where('isActive', '==', true));
                const snapshot = await getDocs(fallbackQ);
                return snapshot.docs.map(doc => parseFirestoreDoc(doc.data(), doc.id));
            } catch (e) {
                return [];
            }
        }
        console.error('Error fetching testimonials:', error);
        return testimonialsCache || [];
    }
};

export const saveTestimonial = async (testimonial: any) => {
    try {
        const testimonialData = prepareForFirestore(testimonial);
        const { id, ...payload } = testimonialData;

        if (id && !id.startsWith('temp_')) {
            await setDoc(doc(db, COLLECTIONS.TESTIMONIALS, id), payload, { merge: true });
        } else {
            await addDoc(collection(db, COLLECTIONS.TESTIMONIALS), {
                ...payload,
                createdAt: Timestamp.now(),
                isActive: true
            });
        }

        testimonialsCache = null;
        lastTestimonialsFetch = 0;
    } catch (error) {
        console.error('Error saving testimonial:', error);
        throw error;
    }
};

export const deleteTestimonial = async (id: string) => {
    try {
        await deleteDoc(doc(db, COLLECTIONS.TESTIMONIALS, id));
        testimonialsCache = null;
        lastTestimonialsFetch = 0;
    } catch (error) {
        console.error('Error deleting testimonial:', error);
        throw error;
    }
};

// ==================== PAYMENT NOTIFICATIONS ====================

export const createPaymentNotification = async (notification: any): Promise<string> => {
    try {
        const notificationData = prepareForFirestore(notification);
        const docRef = await addDoc(collection(db, COLLECTIONS.PAYMENT_NOTIFICATIONS), {
            ...notificationData,
            createdAt: Timestamp.now()
        });
        return docRef.id;
    } catch (error) {
        console.error('Erro ao criar notificação de pagamento:', error);
        throw error;
    }
};

export const getPaymentNotificationsByReader = async (readerId: string): Promise<any[]> => {
    try {
        const q = query(
            collection(db, COLLECTIONS.PAYMENT_NOTIFICATIONS),
            where('readerId', '==', readerId),
            orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => parseFirestoreDoc(doc.data(), doc.id));
    } catch (error) {
        console.error('Erro ao buscar notificações:', error);
        return [];
    }
};

export const getAllPaymentNotifications = async (): Promise<any[]> => {
    try {
        const q = query(collection(db, COLLECTIONS.PAYMENT_NOTIFICATIONS), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => parseFirestoreDoc(doc.data(), doc.id));
    } catch (error) {
        console.error('Erro ao buscar notificações:', error);
        return [];
    }
};

export const updatePaymentNotificationStatus = async (id: string, status: string) => {
    try {
        const docRef = doc(db, COLLECTIONS.PAYMENT_NOTIFICATIONS, id);
        await updateDoc(docRef, {
            status,
            updatedAt: Timestamp.now()
        });
    } catch (error) {
        console.error('Erro ao atualizar notificação:', error);
        throw error;
    }
};

// ==================== PAYMENT PROOFS ====================

export const createPaymentProof = async (proof: any): Promise<string> => {
    try {
        const proofData = prepareForFirestore(proof);
        const docRef = await addDoc(collection(db, COLLECTIONS.PAYMENT_PROOFS), {
            ...proofData,
            uploadedAt: Timestamp.now()
        });
        return docRef.id;
    } catch (error) {
        console.error('Erro ao criar comprovativo:', error);
        throw error;
    }
};

export const getPaymentProofByNotification = async (notificationId: string) => {
    try {
        const q = query(
            collection(db, COLLECTIONS.PAYMENT_PROOFS),
            where('paymentNotificationId', '==', notificationId),
            limit(1)
        );
        const snapshot = await getDocs(q);
        if (snapshot.empty) return null;
        return parseFirestoreDoc(snapshot.docs[0].data(), snapshot.docs[0].id);
    } catch (error) {
        console.error('Erro ao buscar comprovativo:', error);
        return null;
    }
};

export const confirmPaymentProof = async (proofId: string, adminId: string, notes?: string) => {
    try {
        const docRef = doc(db, COLLECTIONS.PAYMENT_PROOFS, proofId);
        await updateDoc(docRef, {
            confirmedBy: adminId,
            confirmedAt: Timestamp.now(),
            notes: notes || ''
        });
    } catch (error) {
        console.error('Erro ao confirmar comprovativo:', error);
        throw error;
    }
};

// ==================== BOOK STATS & INTERACTIONS ====================

export const getBookStats = async (bookId: string) => {
    try {
        const viewsQuery = query(collection(db, COLLECTIONS.BOOK_VIEWS), where('bookId', '==', bookId));
        const reviewsQuery = query(collection(db, COLLECTIONS.REVIEWS), where('bookId', '==', bookId));
        const salesQuery = query(
            collection(db, COLLECTIONS.PAYMENT_NOTIFICATIONS),
            where('status', '==', 'confirmed')
        );

        const [viewsSnapshot, reviewsSnapshot, salesSnapshot] = await Promise.all([
            getDocs(viewsQuery),
            getDocs(reviewsQuery),
            getDocs(salesQuery)
        ]);

        // Calculate average rating
        const ratings = reviewsSnapshot.docs.map(doc => doc.data().rating || 0);
        const avgRating = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;

        // Calculate sales
        let salesCount = 0;
        salesSnapshot.docs.forEach(doc => {
            const items = doc.data().items || [];
            items.forEach((item: any) => {
                if (item.id === bookId || item.bookId === bookId) {
                    salesCount += item.quantity || 1;
                }
            });
        });

        return {
            views: viewsSnapshot.size,
            rating: Number(avgRating.toFixed(1)),
            sales: salesCount,
            reviewsCount: reviewsSnapshot.size
        };
    } catch (error) {
        console.error('Error fetching book stats:', error);
        return { views: 0, rating: 0, sales: 0, reviewsCount: 0 };
    }
};

export const incrementBookView = async (bookId: string) => {
    try {
        await addDoc(collection(db, COLLECTIONS.BOOK_VIEWS), {
            bookId,
            viewedAt: Timestamp.now()
        });
    } catch (error) {
        // Fail silently
    }
};

export const checkIsFavorite = async (bookId: string, userId: string): Promise<boolean> => {
    try {
        const q = query(
            collection(db, COLLECTIONS.BOOK_FAVORITES),
            where('bookId', '==', bookId),
            where('userId', '==', userId)
        );
        const snapshot = await getDocs(q);
        return !snapshot.empty;
    } catch (error) {
        return false;
    }
};

export const toggleFavorite = async (bookId: string, userId: string): Promise<boolean> => {
    try {
        const isFav = await checkIsFavorite(bookId, userId);

        if (isFav) {
            const q = query(
                collection(db, COLLECTIONS.BOOK_FAVORITES),
                where('bookId', '==', bookId),
                where('userId', '==', userId)
            );
            const snapshot = await getDocs(q);
            snapshot.forEach(async (docSnapshot) => {
                await deleteDoc(docSnapshot.ref);
            });
            return false;
        } else {
            await addDoc(collection(db, COLLECTIONS.BOOK_FAVORITES), {
                bookId,
                userId,
                createdAt: Timestamp.now()
            });
            return true;
        }
    } catch (error) {
        console.error('Error toggling favorite:', error);
        return false;
    }
};

// ==================== ADMIN & AUTHOR STATS ====================

export const getAdminStats = async () => {
    try {
        const booksSnapshot = await getDocs(collection(db, COLLECTIONS.BOOKS));
        const usersSnapshot = await getDocs(collection(db, COLLECTIONS.USERS));

        // New Orders tracking
        const ordersSnapshot = await getDocs(collection(db, COLLECTIONS.ORDERS));

        let pendingOrders = 0;
        let revenue = 0;
        let lowStockCount = 0;

        ordersSnapshot.docs.forEach(doc => {
            const data = doc.data();
            if (data.status === 'Pendente') pendingOrders++;
            if (data.status === 'Validado') revenue += Number(data.total || 0);
        });

        // Add legacy confirmed sales to revenue
        const confirmedLegacyQuery = query(
            collection(db, COLLECTIONS.PAYMENT_NOTIFICATIONS),
            where('status', '==', 'confirmed')
        );
        const legacySnapshot = await getDocs(confirmedLegacyQuery);
        legacySnapshot.docs.forEach(doc => {
            revenue += Number(doc.data().totalAmount || 0);
        });

        // Count low stock books
        booksSnapshot.docs.forEach(doc => {
            const data = doc.data();
            if (data.format === 'físico' && (data.stock ?? 0) < 5) {
                lowStockCount++;
            }
        });

        return {
            totalBooks: booksSnapshot.size,
            totalUsers: usersSnapshot.size,
            pendingOrders,
            revenue,
            lowStockCount
        };
    } catch (error) {
        console.error('Error fetching admin stats:', error);
        return { totalBooks: 0, totalUsers: 0, pendingOrders: 0, revenue: 0, lowStockCount: 0 };
    }
};

export const getAuthorStats = async (authorId: string) => {
    try {
        const booksQuery = query(
            collection(db, COLLECTIONS.BOOKS),
            where('authorId', '==', authorId)
        );
        const booksSnapshot = await getDocs(booksQuery);

        // Both new Orders and legacy Notifications for author stats
        const ordersSnapshot = await getDocs(collection(db, COLLECTIONS.ORDERS));
        const salesSnapshot = await getDocs(query(collection(db, COLLECTIONS.PAYMENT_NOTIFICATIONS), where('status', '==', 'confirmed')));

        let totalSales = 0;
        let revenue = 0;

        // Process new Orders
        ordersSnapshot.docs.forEach(doc => {
            const data = doc.data();
            if (data.status !== 'Validado') return;
            const items = data.items || [];
            items.forEach((item: any) => {
                if (item.authorId === authorId) {
                    totalSales += item.quantity || 1;
                    revenue += (item.price || 0) * (item.quantity || 1);
                }
            });
        });

        // Process legacy Sales
        salesSnapshot.docs.forEach(doc => {
            const items = doc.data().items || [];
            items.forEach((item: any) => {
                if (item.authorId === authorId) {
                    totalSales += item.quantity || 1;
                    revenue += (item.price || 0) * (item.quantity || 1);
                }
            });
        });

        return {
            publishedBooks: booksSnapshot.size,
            totalSales,
            totalRoyalties: revenue * 0.7
        };
    } catch (error) {
        console.error('Error fetching author stats:', error);
        return { publishedBooks: 0, totalSales: 0, totalRoyalties: 0 };
    }
};

export const getAuthorConfirmedSales = async (authorId: string) => {
    try {
        const q = query(
            collection(db, COLLECTIONS.PAYMENT_NOTIFICATIONS),
            where('status', '==', 'confirmed')
        );
        const snapshot = await getDocs(q);

        const sales: any[] = [];
        snapshot.docs.forEach(doc => {
            const data = doc.data();
            const items = data.items || [];
            items.forEach((item: any) => {
                if (item.authorId === authorId) {
                    sales.push({
                        ...parseFirestoreDoc(data, doc.id),
                        item
                    });
                }
            });
        });

        return sales;
    } catch (error) {
        console.error('Error fetching confirmed sales:', error);
        return [];
    }
};

// ==================== USER BOOKS & DOWNLOADS ====================

export const getUserBooks = async (readerId: string): Promise<Book[]> => {
    try {
        const q = query(
            collection(db, COLLECTIONS.PAYMENT_NOTIFICATIONS),
            where('readerId', '==', readerId),
            where('status', '==', 'confirmed')
        );
        const snapshot = await getDocs(q);

        const bookIds = new Set<string>();
        snapshot.docs.forEach(doc => {
            const items = doc.data().items || [];
            items.forEach((item: any) => bookIds.add(item.bookId));
        });

        if (bookIds.size === 0) return [];

        const allBooks = await getBooks();
        return allBooks.filter(book => bookIds.has(book.id));
    } catch (error) {
        console.error('Error fetching user books:', error);
        return [];
    }
};

export const checkDownloadAccess = async (bookId: string, userId: string | undefined, bookPrice: number): Promise<boolean> => {
    // Free books are always accessible
    if (bookPrice === 0) {
        return true;
    }

    // Paid books require authentication and confirmed payment
    if (!userId) {
        return false;
    }

    try {
        const q = query(
            collection(db, COLLECTIONS.PAYMENT_NOTIFICATIONS),
            where('readerId', '==', userId),
            where('status', '==', 'confirmed')
        );
        const snapshot = await getDocs(q);

        // Check if user has purchased this book
        const hasPurchased = snapshot.docs.some(doc => {
            const items = doc.data().items || [];
            return items.some((item: any) => item.bookId === bookId);
        });

        return hasPurchased;
    } catch (error) {
        console.error('Error checking download access:', error);
        return false;
    }
};

export const getUserPurchasedDigitalBooks = async (readerId: string): Promise<Book[]> => {
    const allPurchased = await getUserBooks(readerId);
    return allPurchased.filter(book => book.format === 'digital' && book.digitalFileUrl);
};

// ==================== NOTIFICATIONS ====================

export const getNotifications = async (userId: string) => {
    try {
        const q = query(
            collection(db, COLLECTIONS.NOTIFICATIONS),
            where('userId', '==', userId),
            where('isRead', '==', false),
            orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => parseFirestoreDoc(doc.data(), doc.id));
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return [];
    }
};

export const markNotificationAsRead = async (notificationId: string) => {
    try {
        const docRef = doc(db, COLLECTIONS.NOTIFICATIONS, notificationId);
        await updateDoc(docRef, { isRead: true });
    } catch (error) {
        console.error('Error marking notification as read:', error);
        throw error;
    }
};

export const createNotification = async (notification: any) => {
    try {
        await addDoc(collection(db, COLLECTIONS.NOTIFICATIONS), {
            ...notification,
            isRead: false,
            createdAt: Timestamp.now()
        });
    } catch (error) {
        console.error('Error creating notification:', error);
        throw error;
    }
};