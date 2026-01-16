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
    MANUSCRIPTS: 'manuscripts',
    BLOG_LIKES: 'blog_likes',
    BLOG_COMMENTS: 'blog_comments',
    BOOK_VIEWS: 'book_views',
    BOOK_FAVORITES: 'book_favorites',
    SITE_CONTENT: 'site_content',
    TESTIMONIALS: 'testimonials',
    NOTIFICATIONS: 'notifications'
};

const cleanDataForSupabase = (data: any, table: string) => {
    const clean: any = {};

    // Mapping frontend CamelCase to Supabase snake_case
    const mapping: Record<string, string> = {
        'coverUrl': 'cover_url',
        'digitalFileUrl': 'digital_file_url',
        'authorId': 'author_id',
        'createdAt': 'created_at',
        'updatedAt': 'updated_at',
        'publishedAt': 'published_at',
        'userId': 'user_id',
        'orderId': 'order_id',
        'bookId': 'book_id',
        'customerName': 'customer_name',
        'customerEmail': 'customer_email',
        'customerId': 'customer_id',
        'paymentNotificationId': 'payment_notification_id',
        'totalAmount': 'total_amount',
        'readerId': 'reader_id',
        'readerName': 'reader_name',
        'readerEmail': 'reader_email',
        'userName': 'user_name',
        'postId': 'post_id',
        'imageUrl': 'image_url',
        'likesCount': 'likes_count',
        'commentsCount': 'comments_count',
        'sharesCount': 'shares_count',
        'authorName': 'author_name',
        'submittedDate': 'submitted_date',
        'reviewedDate': 'reviewed_date',
        'fileUrl': 'file_url',
        'fileName': 'file_name',
        'isRead': 'is_read',
        'isNew': 'is_new',
        'isBestseller': 'is_bestseller',
        'launchDate': 'launch_date',
        'bankName': 'bank_name',
        'accountNumber': 'account_number',
        'isPrimary': 'is_primary',
        'paymentMethods': 'payment_methods',
        'whatsappNumber': 'whatsapp_number',
        'preferredContact': 'preferred_contact',
        'avatarUrl': 'avatar_url',
        'photoUrl': 'photo_url', // Legacy support
        'bio': 'bio',
        'address': 'address',
        'paymentInfo': 'payment_info',
        'paymentInfoNotes': 'payment_info_notes',
        'displayOrder': 'display_order'
    };

    const JSONFields = ['items', 'payment_methods', 'preferred_contact'];
    const ArrayFields = ['details'];
    const MappingTables = [TABLES.BOOKS];
    const NumericFields = ['price', 'stock', 'pages', 'display_order', 'total_amount', 'rating', 'total'];

    Object.keys(data).forEach(key => {
        let value = data[key];
        let dbKey = mapping[key] || key;

        // Custom mapping for specific tables (e.g. books)
        if (MappingTables.includes(table)) {
            if (key === 'genre') dbKey = 'category';
        }
        // Skip internal or temporary id fields
        if (key.startsWith('$')) return;

        // Skip id if it's temporary (starts with temp_)
        if (key === 'id' && (typeof value === 'string' && value.startsWith('temp_'))) return;
        // Skip id if it's empty
        if (key === 'id' && !value) return;

        // 1. Skip undefined/null (except if it's an intentional clear, but usually we want to skip)
        if (value === undefined || value === null) return;

        // 2. Sanitize Strings
        if (typeof value === 'string') {
            value = value.trim();
        }

        // 3. Handle specific types
        if (JSONFields.includes(dbKey)) {
            try {
                if (typeof value === 'string') {
                    clean[dbKey] = value.trim() ? JSON.parse(value) : [];
                } else {
                    clean[dbKey] = value;
                }
            } catch (e) {
                console.warn(`Erro ao processar JSON para ${dbKey}:`, value);
                clean[dbKey] = [];
            }
        } else if (ArrayFields.includes(dbKey)) {
            clean[dbKey] = Array.isArray(value) ? value : (value ? [value] : []);
        } else if (NumericFields.includes(dbKey)) {
            // Ensure numbers are numbers, not strings from forms
            const num = Number(value);
            clean[dbKey] = isNaN(num) ? 0 : num;
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
        'photo_url': 'avatarUrl',
        'customer_id': 'customerId',
        'customer_name': 'customerName',
        'customer_email': 'customerEmail',
        'payment_method': 'paymentMethod',
        'payment_methods': 'paymentMethods',
        'preferred_contact': 'preferredContact',
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
        'image_url': 'imageUrl',
        'post_id': 'postId',
        'created_at': 'createdAt',
        'file_url': 'fileUrl',
        'file_name': 'fileName',
        'author_name': 'authorName',
        'payment_info': 'paymentInfo',
        'payment_info_notes': 'paymentInfoNotes',
        'launch_date': 'launchDate',
        'category': 'genre'
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
    const TIMEOUT_MS = 15000; // 15 second timeout

    const savePromise = (async () => {
        try {
            console.log("dataService.saveBook - Iniciando limpeza de dados...");
            const bookData = cleanDataForSupabase(book, TABLES.BOOKS);

            // Critical: Remove ID from payload to avoid Supabase errors on update/insert
            const { id, ...payload } = bookData;
            console.log("dataService.saveBook - Payload (sem ID):", payload);

            if (id && id.length > 5 && !id.startsWith('temp_')) {
                console.log("dataService.saveBook - Executando UPDATE para id:", id);
                const { error } = await supabase
                    .from(TABLES.BOOKS)
                    .update(payload)
                    .eq('id', id);
                if (error) {
                    console.error("dataService.saveBook - Erro no UPDATE:", error);
                    throw error;
                }
                console.log("dataService.saveBook - UPDATE concluído com sucesso");
            } else {
                console.log("dataService.saveBook - Executando INSERT...");
                const { error } = await supabase
                    .from(TABLES.BOOKS)
                    .insert([payload]);
                if (error) {
                    console.error("dataService.saveBook - Erro no INSERT:", error);
                    throw error;
                }
                console.log("dataService.saveBook - INSERT concluído com sucesso");
            }
        } catch (error) {
            console.error("Erro interno no saveBook:", error);
            throw error;
        }
    })();

    const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Tempo de espera excedido. O servidor demorou muito a responder.")), TIMEOUT_MS)
    );

    return Promise.race([savePromise, timeoutPromise]);
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

// Blog Interactions
export const getBlogPostInteractions = async (postId: string) => {
    try {
        const [{ count: likesCount }, { data: comments, error: commentsError }] = await Promise.all([
            supabase.from(TABLES.BLOG_LIKES).select('*', { count: 'exact', head: true }).eq('post_id', postId),
            supabase.from(TABLES.BLOG_COMMENTS).select('*').eq('post_id', postId).order('created_at', { ascending: true })
        ]);

        if (commentsError) throw commentsError;

        return {
            likesCount: likesCount || 0,
            comments: (comments || []).map(parseDataFromSupabase)
        };
    } catch (error) {
        console.error("Error fetching interactions:", error);
        return { likesCount: 0, comments: [] };
    }
};

export const checkUserLike = async (postId: string, userId: string) => {
    try {
        const { data, error } = await supabase
            .from(TABLES.BLOG_LIKES)
            .select('*')
            .eq('post_id', postId)
            .eq('user_id', userId)
            .single();

        return !!data;
    } catch (error) {
        return false;
    }
};

export const toggleBlogPostLike = async (postId: string, userId: string): Promise<boolean> => {
    try {
        const isLiked = await checkUserLike(postId, userId);

        if (isLiked) {
            const { error } = await supabase
                .from(TABLES.BLOG_LIKES)
                .delete()
                .eq('post_id', postId)
                .eq('user_id', userId);
            if (error) throw error;
            return false;
        } else {
            const { error } = await supabase
                .from(TABLES.BLOG_LIKES)
                .insert([{ post_id: postId, user_id: userId }]);
            if (error) throw error;
            return true;
        }
    } catch (error) {
        console.error("Error toggling like:", error);
        return false;
    }
};

export const addBlogPostComment = async (comment: { postId: string; userId: string; userName: string; content: string }) => {
    try {
        const data = cleanDataForSupabase(comment, TABLES.BLOG_COMMENTS);
        const { error } = await supabase.from(TABLES.BLOG_COMMENTS).insert([data]);
        if (error) throw error;
    } catch (error) {
        console.error("Error adding comment:", error);
        throw error;
    }
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
    try {
        const { data, error } = await supabase
            .from(TABLES.REVIEWS)
            .select('*')
            .eq('book_id', bookId)
            .order('date', { ascending: false });

        if (error) throw error;
        return (data || []).map(parseDataFromSupabase);
    } catch (error) {
        console.error("Error fetching reviews:", error);
        return [];
    }
};

export const addBookReview = async (review: { bookId: string; userId: string; userName: string; rating: number; comment: string }) => {
    try {
        const data = cleanDataForSupabase(review, TABLES.REVIEWS);
        const { error } = await supabase.from(TABLES.REVIEWS).insert([data]);
        if (error) throw error;
    } catch (error) {
        console.error("Error adding review:", error);
        throw error;
    }
};

// Book Stats & Interactions
export const getBookStats = async (bookId: string) => {
    try {
        const [
            { count: viewsCount },
            { data: reviewsData },
            { data: salesData }
        ] = await Promise.all([
            supabase.from(TABLES.BOOK_VIEWS).select('*', { count: 'exact', head: true }).eq('book_id', bookId),
            supabase.from(TABLES.REVIEWS).select('rating').eq('book_id', bookId),
            supabase.from(TABLES.PAYMENT_NOTIFICATIONS).select('items').eq('status', 'confirmed')
        ]);

        // Calculate average rating
        const ratings = (reviewsData || []).map(r => r.rating);
        const avgRating = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;

        // Calculate sales for this specific book
        let salesCount = 0;
        (salesData || []).forEach(sale => {
            const items = Array.isArray(sale.items) ? sale.items : [];
            items.forEach((item: any) => {
                if (item.id === bookId || item.bookId === bookId) {
                    salesCount += item.quantity || 1;
                }
            });
        });

        return {
            views: viewsCount || 0,
            rating: Number(avgRating.toFixed(1)),
            sales: salesCount,
            reviewsCount: reviewsData?.length || 0
        };
    } catch (error) {
        console.error("Error fetching book stats:", error);
        return { views: 0, rating: 0, sales: 0, reviewsCount: 0 };
    }
};

export const incrementBookView = async (bookId: string) => {
    try {
        await supabase.from(TABLES.BOOK_VIEWS).insert([{ book_id: bookId }]);
    } catch (error) {
        // Fail silently for views
    }
};

export const checkIsFavorite = async (bookId: string, userId: string): Promise<boolean> => {
    try {
        const { data } = await supabase
            .from(TABLES.BOOK_FAVORITES)
            .select('*')
            .eq('book_id', bookId)
            .eq('user_id', userId)
            .single();
        return !!data;
    } catch (error) {
        return false;
    }
};

export const toggleFavorite = async (bookId: string, userId: string): Promise<boolean> => {
    try {
        const isFav = await checkIsFavorite(bookId, userId);
        if (isFav) {
            await supabase.from(TABLES.BOOK_FAVORITES).delete().eq('book_id', bookId).eq('user_id', userId);
            return false;
        } else {
            await supabase.from(TABLES.BOOK_FAVORITES).insert([{ book_id: bookId, user_id: userId }]);
            return true;
        }
    } catch (error) {
        console.error("Error toggling favorite:", error);
        return false;
    }
};

// Site Content & Testimonials
export const getSiteContent = async (section?: string) => {
    try {
        let query = supabase.from(TABLES.SITE_CONTENT).select('*');
        if (section) query = query.eq('section', section);

        const { data, error } = await query;
        if (error) throw error;

        // Convert to a convenient key-value object
        const contentMap: Record<string, any> = {};
        (data || []).forEach(item => {
            contentMap[item.key] = item.content;
        });
        return contentMap;
    } catch (error) {
        console.error("Error fetching site content:", error);
        return {};
    }
};

export const saveSiteContent = async (key: string, section: string, content: any) => {
    try {
        const { error } = await supabase.from(TABLES.SITE_CONTENT).upsert({
            key,
            section,
            content,
            updated_at: new Date().toISOString()
        }, { onConflict: 'key' });
        if (error) throw error;
    } catch (error) {
        console.error("Error saving site content:", error);
        throw error;
    }
};

export const getTestimonials = async () => {
    try {
        const { data, error } = await supabase
            .from(TABLES.TESTIMONIALS)
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return (data || []).map(parseDataFromSupabase);
    } catch (error) {
        console.error("Error fetching testimonials:", error);
        return [];
    }
};

export const saveTestimonial = async (testimonial: any) => {
    try {
        const data = cleanDataForSupabase(testimonial, TABLES.TESTIMONIALS);
        const { error } = await supabase.from(TABLES.TESTIMONIALS).upsert(data, { onConflict: 'id' });
        if (error) throw error;
    } catch (error) {
        console.error("Error saving testimonial:", error);
        throw error;
    }
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

export const getAuthorConfirmedSales = async (authorId: string) => {
    const { data: sales, error } = await supabase
        .from(TABLES.PAYMENT_NOTIFICATIONS)
        .select('id, created_at, items')
        .eq('status', 'confirmed');

    if (error) return [];

    const authorSales: any[] = [];
    (sales || []).forEach(sale => {
        const items = Array.isArray(sale.items) ? sale.items : [];
        items.forEach((item: any) => {
            if (item.authorId === authorId) {
                authorSales.push({
                    id: `${sale.id}-${item.bookId}`,
                    date: sale.created_at,
                    bookTitle: item.bookTitle,
                    quantity: item.quantity,
                    royalty: (item.price * item.quantity) * 0.7
                });
            }
        });
    });

    return authorSales;
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

// Notifications
export const getNotifications = async (userId: string) => {
    try {
        const { data, error } = await supabase
            .from(TABLES.NOTIFICATIONS)
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return (data || []).map(parseDataFromSupabase);
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return [];
    }
};

export const markNotificationAsRead = async (id: string) => {
    try {
        const { error } = await supabase
            .from(TABLES.NOTIFICATIONS)
            .update({ is_read: true })
            .eq('id', id);
        if (error) throw error;
    } catch (error) {
        console.error("Error marking notification as read:", error);
    }
};

export const createNotification = async (notif: { userId: string; type: string; title: string; content: string; link?: string }) => {
    try {
        const data = cleanDataForSupabase(notif, TABLES.NOTIFICATIONS);
        const { error } = await supabase.from(TABLES.NOTIFICATIONS).insert([data]);
        if (error) throw error;
    } catch (error) {
        console.error("Error creating notification:", error);
    }
};
