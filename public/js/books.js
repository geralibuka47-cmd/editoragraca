import { db } from './firebase-config.js';
import {
    collection,
    query,
    getDocs,
    orderBy,
    limit,
    where,
    doc,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    Timestamp
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

/**
 * Fetches all books from Firestore
 */
export async function getBooks(filters = {}) {
    try {
        if (!db) throw new Error("Firebase DB not initialized.");

        const booksRef = collection(db, "books");
        let q = query(booksRef, orderBy("launchDate", "desc"));

        if (filters.limit) {
            q = query(q, limit(filters.limit));
        }

        if (filters.format && filters.format !== 'todos') {
            q = query(q, where("format", "==", filters.format));
        }

        const snapshot = await getDocs(q);
        const now = Date.now();

        return snapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .filter(book => {
                // Filter by release date if not admin
                if (filters.includeFuture) return true;
                return !book.launchDate || new Date(book.launchDate).getTime() <= now;
            });
    } catch (error) {
        console.error("Error fetching books:", error);
        return [];
    }
}

/**
 * Fetches only upcoming books (future launch dates)
 */
export async function getUpcomingBooks() {
    try {
        const booksRef = collection(db, "books");
        const snapshot = await getDocs(query(booksRef, orderBy("launchDate", "asc")));
        const now = Date.now();

        return snapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .filter(book => book.launchDate && new Date(book.launchDate).getTime() > now);
    } catch (error) {
        console.error("Error fetching upcoming books:", error);
        return [];
    }
}

/**
 * Fetches a single book by its slug or ID
 */
export async function getBookBySlug(slug) {
    try {
        const booksRef = collection(db, "books");
        const q = query(booksRef, where("slug", "==", slug), limit(1));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            // Try by ID as fallback
            const docRef = doc(db, "books", slug);
            const docSnap = await getDoc(docRef);
            return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
        }

        return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
    } catch (error) {
        console.error("Error fetching book by slug:", error);
        return null;
    }
}

/**
 * Get all authors (users with role 'autor')
 */
export async function getAuthors() {
    try {
        const q = query(collection(db, "users"), where('role', '==', 'autor'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error fetching authors:", error);
        return [];
    }
}

/**
 * Register a new author (internal use during book save)
 */
async function registerAuthor(author) {
    try {
        const authorData = {
            ...author,
            role: 'autor',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        const docRef = await addDoc(collection(db, "users"), authorData);
        return docRef.id;
    } catch (error) {
        console.error("Error registering author:", error);
        throw error;
    }
}

/**
 * Save or Update a book with full technical data and multi-author support
 */
export async function saveBook(book, newAuthor = null) {
    try {
        let authorId = book.authorId;

        // 1. Handle new author registration
        if (newAuthor && newAuthor.name) {
            authorId = await registerAuthor(newAuthor);
            book.authorId = authorId;
            book.author = newAuthor.name;
        }

        // 2. Normalize multi-author arrays
        if (book.authorId && (!book.authorIds || !book.authorIds.includes(book.authorId))) {
            book.authorIds = Array.from(new Set([...(book.authorIds || []), book.authorId]));
        }

        if (book.author && book.authorId && (!book.authors || book.authors.length === 0)) {
            book.authors = [{ id: book.authorId, name: book.author }];
        }

        // 3. Generate robust slug
        const normalizedTitle = (book.title || '').trim().toLowerCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
        const date = book.launchDate ? new Date(book.launchDate) : new Date();
        const dateStr = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
        book.slug = `${normalizedTitle}-${dateStr}`;

        // 4. Prepare payload (remove ID, add timestamps)
        const { id, ...payload } = book;
        const dataToSave = {
            ...payload,
            updatedAt: new Date().toISOString()
        };

        // 5. Commit to Firestore
        if (id && id.length > 5 && !id.startsWith('temp_')) {
            await updateDoc(doc(db, "books", id), dataToSave);
        } else {
            await addDoc(collection(db, "books"), {
                ...dataToSave,
                createdAt: new Date().toISOString()
            });
        }
    } catch (error) {
        console.error("Error saving book:", error);
        throw error;
    }
}

/**
 * Delete a book from Firestore
 */
export async function deleteBook(id) {
    try {
        await deleteDoc(doc(db, "books", id));
    } catch (error) {
        console.error("Error deleting book:", error);
        throw error;
    }
}
