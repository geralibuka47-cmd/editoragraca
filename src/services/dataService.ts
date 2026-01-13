import { supabase } from "./supabase";
import { Book, Order, User } from "../types";

// Supabase Tables mapping (using clean snake_case names from schema)
const TABLES = {
    BOOKS: 'books',
    ORDERS: 'orders',
    PROFILES: 'profiles',
    BLOG: 'blog_posts',
    TEAM: 'team_members',
    SERVICES: 'editorial_services',
    REVIEWS: 'reviews',
    PAYMENT_NOTIFICATIONS: 'payment_notifications',
    PAYMENT_PROOFS: 'payment_proofs',
    MANUSCRIPTS: 'manuscripts'
};

const cleanDataForSupabase = (data: any, table: string) => {
    const clean: any = {};

    // Mapping frontend CamelCase to Supabase snake_case
    const mapping: Record<string, string> = {
        'coverUrl': 'cover_url',
        'isBestseller': 'is_bestseller',
        'isNew': 'is_new',
        'authorId': 'author_id',
        'digitalFileUrl': 'digital_file_url',
        'whatsappNumber': 'whatsapp_number',
        'photoUrl': 'photo_url',
        'customerId': 'customer_id',
        'customerName': 'customer_name',
        'customerEmail': 'customer_email',
        'paymentMethod': 'payment_method',
        'totalAmount': 'total_amount',
        'readerId': 'reader_id',
        'readerName': 'reader_name',
        'readerEmail': 'reader_email',
        'orderId': 'order_id',
        'paymentNotificationId': 'payment_notification_id',
        'uploadedAt': 'uploaded_at',
        'confirmedBy': 'confirmed_by',
        'confirmedAt': 'confirmed_at',
        'submittedDate': 'submitted_date',
        'reviewedDate': 'reviewed_date',
        'userName': 'user_name',
        'bookId': 'book_id',
        'userId': 'user_id',
        'displayOrder': 'display_order',
        'imageUrl': 'image_url'
    };

    const JSONFields = ['items'];
    const ArrayFields = ['details'];

    Object.keys(data).forEach(key => {
        if (key === 'id' || key.startsWith('$')) return;

        const dbKey = mapping[key] || key;
        const value = data[key];

        if (value === undefined || value === null) return;

        if (JSONFields.includes(dbKey)) {
            // Supabase handles jsonb as objects, but let's be safe
            clean[dbKey] = typeof value === 'string' ? JSON.parse(value) : value;
        } else if (ArrayFields.includes(dbKey)) {
            clean[dbKey] = Array.isArray(value) ? value : [value];
        } else {
            clean[dbKey] = value;
        }
    });

    return clean;
};

const parseDataFromSupabase = (item: any) => {
    if (!item) return null;
    const parsed: any = { ...item };

    // Reverse mapping: snake_case to CamelCase for the frontend
    const reverseMapping: Record<string, string> = {
        'cover_url': 'coverUrl',
        'is_bestseller': 'isBestseller',
        'is_new': 'isNew',
        'author_id': 'authorId',
        'digital_file_url': 'digitalFileUrl',
        'whatsapp_number': 'whatsappNumber',
        'photo_url': 'photoUrl',
        'customer_id': 'customerId',
        'customer_name': 'customerName',
        'customer_email': 'customerEmail',
        'payment_method': 'paymentMethod',
        'total_amount': 'totalAmount',
        'reader_id': 'readerId',
        'reader_name': 'readerName',
        'reader_email': 'readerEmail',
        'order_id': 'orderId',
        'payment_notification_id': 'paymentNotificationId',
        'uploaded_at': 'uploadedAt',
        'confirmed_by': 'confirmedBy',
        'confirmed_at': 'confirmedAt',
        'submitted_date': 'submittedDate',
        'reviewed_date': 'reviewedDate',
        'user_name': 'userName',
        'book_id': 'bookId',
        'user_id': 'userId',
        'display_order': 'displayOrder', // Correcting to match frontend usage
        'image_url': 'imageUrl'
    };

    Object.keys(item).forEach(key => {
        const frontendKey = reverseMapping[key];
        if (frontendKey) {
            parsed[frontendKey] = item[key];
            delete parsed[key];
        }
    });

    return parsed;
};

// Books
export const getBooks = async (): Promise<Book[]> => {
    try {
        const { data, error } = await supabase
            .from(TABLES.BOOKS)
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return (data || []).map(parseDataFromSupabase) as Book[];
    } catch (error) {
        console.error("Erro ao procurar livros:", error);
        return [];
    }
};

export const saveBook = async (book: Book) => {
    try {
        const bookData = cleanDataForSupabase(book, TABLES.BOOKS);
        const { id } = book;

        if (id && id.length > 5 && !id.startsWith('temp_')) {
            const { error } = await supabase
                .from(TABLES.BOOKS)
                .update(bookData)
                .eq('id', id);
            if (error) throw error;
        } else {
            const { error } = await supabase
                .from(TABLES.BOOKS)
                .insert([bookData]);
            if (error) throw error;
        }
    } catch (error) {
        console.error("Erro ao salvar livro:", error);
        throw error;
    }
};

export const deleteBook = async (id: string) => {
    const { error } = await supabase
        .from(TABLES.BOOKS)
        .delete()
        .eq('id', id);
    if (error) throw error;
};

// Public Stats
export const getPublicStats = async () => {
    try {
        const { count: booksCount } = await supabase.from(TABLES.BOOKS).select('*', { count: 'exact', head: true });
        const { count: readersCount } = await supabase.from(TABLES.PROFILES).select('*', { count: 'exact', head: true });

        return {
            booksCount: booksCount || 0,
            authorsCount: 0,
            readersCount: readersCount || 0
        };
    } catch (error) {
        console.error("Error fetching public stats:", error);
        return { booksCount: 0, authorsCount: 0, readersCount: 0 };
    }
};

// Categories
export const getCategories = async (): Promise<{ name: string; count: number; image?: string }[]> => {
    try {
        const books = await getBooks();
        const categoryMap = new Map<string, { count: number; image?: string }>();

        books.forEach(book => {
            const cat = book.category || 'Outros';
            const current = categoryMap.get(cat) || { count: 0, image: book.coverUrl };
            categoryMap.set(cat, { count: current.count + 1, image: current.image });
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

// Orders
export const getOrders = async (userId?: string): Promise<Order[]> => {
    try {
        let query = supabase.from(TABLES.ORDERS).select('*').order('created_at', { ascending: false });
        if (userId) query = query.eq('customer_id', userId);

        const { data, error } = await query;
        if (error) throw error;
        return (data || []).map(parseDataFromSupabase) as Order[];
    } catch (error) {
        console.error("Erro ao procurar pedidos:", error);
        return [];
    }
};

export const createOrder = async (order: Omit<Order, 'id'>): Promise<string> => {
    const orderData = cleanDataForSupabase(order, TABLES.ORDERS);
    const { data, error } = await supabase
        .from(TABLES.ORDERS)
        .insert([orderData])
        .select();

    if (error) throw error;
    return data[0].id;
};

export const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    const { error } = await supabase
        .from(TABLES.ORDERS)
        .update({ status })
        .eq('id', orderId);
    if (error) throw error;
};

// Users / Profiles
export const getUserProfile = async (uid: string): Promise<User | null> => {
    try {
        const { data, error } = await supabase
            .from(TABLES.PROFILES)
            .select('*')
            .eq('id', uid)
            .single();

        if (error) return null;
        return parseDataFromSupabase(data) as User;
    } catch (error) {
        return null;
    }
};

export const saveUserProfile = async (user: User) => {
    const userData = cleanDataForSupabase(user, TABLES.PROFILES);
    const { error } = await supabase
        .from(TABLES.PROFILES)
        .upsert({ id: user.id, ...userData });
    if (error) console.error("Erro ao salvar perfil:", error);
};

export const getAllUsers = async (): Promise<User[]> => {
    try {
        const { data, error } = await supabase.from(TABLES.PROFILES).select('*');
        if (error) throw error;
        return (data || []).map(parseDataFromSupabase) as User[];
    } catch (error) {
        console.error("Erro ao buscar utilizadores:", error);
        return [];
    }
};

// Payment Notifications
export const createPaymentNotification = async (notification: any): Promise<string> => {
    const data = cleanDataForSupabase(notification, TABLES.PAYMENT_NOTIFICATIONS);
    const { data: result, error } = await supabase
        .from(TABLES.PAYMENT_NOTIFICATIONS)
        .insert([data])
        .select();

    if (error) throw error;
    return result[0].id;
};

export const getPaymentNotificationsByReader = async (readerId: string): Promise<any[]> => {
    const { data, error } = await supabase
        .from(TABLES.PAYMENT_NOTIFICATIONS)
        .select('*')
        .eq('reader_id', readerId)
        .order('created_at', { ascending: false });

    if (error) return [];
    return (data || []).map(parseDataFromSupabase);
};

export const getAllPaymentNotifications = async (): Promise<any[]> => {
    const { data, error } = await supabase
        .from(TABLES.PAYMENT_NOTIFICATIONS)
        .select('*')
        .order('created_at', { ascending: false });

    if (error) return [];
    return (data || []).map(parseDataFromSupabase);
};

export const updatePaymentNotificationStatus = async (id: string, status: string) => {
    const { error } = await supabase
        .from(TABLES.PAYMENT_NOTIFICATIONS)
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);
    if (error) throw error;
};

// Payment Proofs
export const createPaymentProof = async (proof: any): Promise<string> => {
    const data = cleanDataForSupabase(proof, TABLES.PAYMENT_PROOFS);
    const { data: result, error } = await supabase
        .from(TABLES.PAYMENT_PROOFS)
        .insert([data])
        .select();

    if (error) throw error;
    return result[0].id;
};

export const getPaymentProofByNotification = async (notificationId: string) => {
    const { data, error } = await supabase
        .from(TABLES.PAYMENT_PROOFS)
        .select('*')
        .eq('payment_notification_id', notificationId)
        .single();

    if (error) return null;
    return parseDataFromSupabase(data);
};

export const confirmPaymentProof = async (proofId: string, adminId: string, notes?: string) => {
    const { error } = await supabase
        .from(TABLES.PAYMENT_PROOFS)
        .update({
            confirmed_by: adminId,
            confirmed_at: new Date().toISOString(),
            notes: notes || ''
        })
        .eq('id', proofId);
    if (error) throw error;
};

// Manuscripts
export const createManuscript = async (manuscript: any): Promise<string> => {
    const data = cleanDataForSupabase(manuscript, TABLES.MANUSCRIPTS);
    const { data: result, error } = await supabase
        .from(TABLES.MANUSCRIPTS)
        .insert([data])
        .select();

    if (error) throw error;
    return result[0].id;
};

export const getManuscriptsByAuthor = async (authorId: string) => {
    const { data, error } = await supabase
        .from(TABLES.MANUSCRIPTS)
        .select('*')
        .eq('author_id', authorId)
        .order('submitted_date', { ascending: false });

    if (error) return [];
    return (data || []).map(parseDataFromSupabase);
};

export const getAllManuscripts = async () => {
    const { data, error } = await supabase
        .from(TABLES.MANUSCRIPTS)
        .select('*')
        .order('submitted_date', { ascending: false });

    if (error) return [];
    return (data || []).map(parseDataFromSupabase);
};

export const updateManuscriptStatus = async (id: string, status: string, feedback?: string) => {
    const { error } = await supabase
        .from(TABLES.MANUSCRIPTS)
        .update({ status, feedback, reviewed_date: new Date().toISOString() })
        .eq('id', id);
    if (error) throw error;
};

// Blog
export const getBlogPosts = async (): Promise<any[]> => {
    const { data, error } = await supabase
        .from(TABLES.BLOG)
        .select('*')
        .order('date', { ascending: false });

    if (error) return [];
    return (data || []).map(parseDataFromSupabase);
};

export const saveBlogPost = async (post: any) => {
    const data = cleanDataForSupabase(post, TABLES.BLOG);
    const { error } = await supabase
        .from(TABLES.BLOG)
        .upsert({ id: post.id && !post.id.startsWith('temp_') ? post.id : undefined, ...data });
    if (error) throw error;
};

export const deleteBlogPost = async (id: string) => {
    await supabase.from(TABLES.BLOG).delete().eq('id', id);
};

// Team
export const getTeamMembers = async () => {
    const { data, error } = await supabase
        .from(TABLES.TEAM)
        .select('*')
        .order('display_order', { ascending: true });

    if (error) return [];
    return (data || []).map(parseDataFromSupabase);
};

export const saveTeamMember = async (member: any) => {
    const data = cleanDataForSupabase(member, TABLES.TEAM);
    const { error } = await supabase
        .from(TABLES.TEAM)
        .upsert({ id: member.id && !member.id.startsWith('temp_') ? member.id : undefined, ...data });
    if (error) throw error;
};

export const deleteTeamMember = async (id: string) => {
    await supabase.from(TABLES.TEAM).delete().eq('id', id);
};

// Services
export const getEditorialServices = async () => {
    const { data, error } = await supabase
        .from(TABLES.SERVICES)
        .select('*')
        .order('display_order', { ascending: true });

    if (error) return [];
    return (data || []).map(parseDataFromSupabase);
};

export const saveEditorialService = async (service: any) => {
    const data = cleanDataForSupabase(service, TABLES.SERVICES);
    const { error } = await supabase
        .from(TABLES.SERVICES)
        .upsert({ id: service.id && !service.id.startsWith('temp_') ? service.id : undefined, ...data });
    if (error) throw error;
};

export const deleteEditorialService = async (id: string) => {
    await supabase.from(TABLES.SERVICES).delete().eq('id', id);
};

// Reviews
export const getBookReviews = async (bookId: string) => {
    const { data, error } = await supabase
        .from(TABLES.REVIEWS)
        .select('*')
        .eq('book_id', bookId)
        .order('date', { ascending: false });

    if (error || !data || data.length === 0) {
        return [
            { id: '1', bookId, userId: 'mock1', userName: 'Maria Silva', rating: 5, comment: 'Uma obra prima! Adorei cada página.', date: new Date().toISOString() },
            { id: '2', bookId, userId: 'mock2', userName: 'João Paulo', rating: 4, comment: 'Muito bom, mas o final poderia ser melhor.', date: new Date(Date.now() - 86400000).toISOString() }
        ];
    }
    return data.map(parseDataFromSupabase);
};

export const addBookReview = async (review: any) => {
    const data = cleanDataForSupabase(review, TABLES.REVIEWS);
    const { error } = await supabase.from(TABLES.REVIEWS).insert([data]);
    if (error) throw error;
};

// Stats helpers
export const getAdminStats = async () => {
    const { count: totalBooks } = await supabase.from(TABLES.BOOKS).select('*', { count: 'exact', head: true });
    const { count: totalUsers } = await supabase.from(TABLES.PROFILES).select('*', { count: 'exact', head: true });
    const { count: pendingOrders } = await supabase.from(TABLES.PAYMENT_NOTIFICATIONS).select('*', { count: 'exact', head: true }).eq('status', 'proof_uploaded');

    const { data: confirmedPayments } = await supabase.from(TABLES.PAYMENT_NOTIFICATIONS).select('total_amount').eq('status', 'confirmed');
    const revenue = (confirmedPayments || []).reduce((acc, curr) => acc + (Number(curr.total_amount) || 0), 0);

    return {
        totalBooks: totalBooks || 0,
        totalUsers: totalUsers || 0,
        pendingOrders: pendingOrders || 0,
        revenue
    };
};

export const getAuthorStats = async (authorId: string) => {
    const { count: publishedBooks } = await supabase.from(TABLES.BOOKS).select('*', { count: 'exact', head: true }).eq('author_id', authorId);
    const { data: sales } = await supabase.from(TABLES.PAYMENT_NOTIFICATIONS).select('items').eq('status', 'confirmed');

    let totalSales = 0;
    let revenue = 0;

    (sales || []).forEach(sale => {
        const items = Array.isArray(sale.items) ? sale.items : [];
        items.forEach((item: any) => {
            if (item.authorId === authorId) {
                totalSales += item.quantity;
                revenue += (item.price * item.quantity);
            }
        });
    });

    return {
        publishedBooks: publishedBooks || 0,
        totalSales,
        totalRoyalties: revenue * 0.7
    };
};

export const getUserBooks = async (readerId: string): Promise<Book[]> => {
    const { data: confirmed } = await supabase
        .from(TABLES.PAYMENT_NOTIFICATIONS)
        .select('items')
        .eq('reader_id', readerId)
        .eq('status', 'confirmed');

    const bookIds = new Set<string>();
    (confirmed || []).forEach(sale => {
        const items = Array.isArray(sale.items) ? sale.items : [];
        items.forEach((item: any) => bookIds.add(item.bookId));
    });

    if (bookIds.size === 0) return [];

    const allBooks = await getBooks();
    return allBooks.filter(book => bookIds.has(book.id));
};

export const incrementBookView = async (bookId: string) => {
    // No increment logic for now
};
