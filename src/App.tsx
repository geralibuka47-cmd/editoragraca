import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ToastProvider } from './components/Toast';
import { subscribeToAuthChanges } from './services/authService';
import { getBooks } from './services/dataService';
import { Book, User } from './types';
import { Loader2 } from 'lucide-react';

// Lazy loading pages
const BookDetailModal = React.lazy(() => import('./components/BookDetailModal'));
const AuthPage = React.lazy(() => import('./pages/AuthPage'));
const CatalogPage = React.lazy(() => import('./pages/CatalogPage'));
const HomePage = React.lazy(() => import('./pages/HomePage'));
const AboutPage = React.lazy(() => import('./pages/AboutPage'));
const ContactPage = React.lazy(() => import('./pages/ContactPage'));
const CheckoutPage = React.lazy(() => import('./pages/CheckoutPage'));
const ServicesPage = React.lazy(() => import('./pages/ServicesPage'));
const BlogPage = React.lazy(() => import('./pages/BlogPage'));
const ReaderDashboard = React.lazy(() => import('./pages/ReaderDashboard'));
const AuthorDashboard = React.lazy(() => import('./pages/AuthorDashboard'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));

// Scroll to top on route change
const ScrollToTop = () => {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
};

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles, user, loading }: { children: React.ReactNode, allowedRoles?: string[], user: User | null, loading: boolean }) => {
    if (loading) return (
        <div className="h-screen flex items-center justify-center bg-brand-light">
            <Loader2 className="w-12 h-12 text-brand-primary animate-spin" />
        </div>
    );

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    return children;
};

const AppContent: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [authLoading, setAuthLoading] = useState(true); // Start true to block until auth check
    const [cart, setCart] = useState<any[]>(() => {
        const saved = localStorage.getItem('cart');
        return saved ? JSON.parse(saved) : [];
    });
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);
    const navigate = useNavigate();

    // Sync cart to local storage
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    // Auth Subscription
    useEffect(() => {
        const unsubscribe = subscribeToAuthChanges((u) => {
            setUser(u);
            setAuthLoading(false);
        });

        // Safety timeout: If auth takes too long (e.g. 8s), force unblock
        const safetyTimer = setTimeout(() => {
            setAuthLoading((prev) => {
                if (prev) {
                    console.warn("Auth timed out, forcing UI unlock");
                    return false;
                }
                return prev;
            });
        }, 8000);

        return () => {
            unsubscribe();
            clearTimeout(safetyTimer);
        };
    }, []);

    // Fetch Data
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const fetchedBooks = await getBooks();
                setBooks(fetchedBooks);
            } catch (error) {
                console.error("Failed to fetch books:", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const handleAddToCart = (book: Book) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === book.id);
            if (existing) {
                return prev.map(item => item.id === book.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prev, { ...book, quantity: 1 }];
        });
    };

    const handleUpdateQuantity = (bookId: string, newQuantity: number) => {
        if (newQuantity < 1) {
            setCart(prev => prev.filter(item => item.id !== bookId));
        } else {
            setCart(prev => prev.map(item => item.id === bookId ? { ...item, quantity: newQuantity } : item));
        }
    };

    const handleAction = (type: string, payload?: any) => {
        if (type === 'VIEW_BOOK') {
            setSelectedBook(payload);
        } else if (type === 'ADD_TO_CART') {
            handleAddToCart(payload);
        } else if (type === 'NAVIGATE') {
            // Map legacy ViewState to routes
            const routes: Record<string, string> = {
                'HOME': '/',
                'CATALOG': '/livros',
                'BLOG': '/blog',
                'SERVICES': '/servicos',
                'ABOUT': '/sobre',
                'CONTACT': '/contacto',
                'CHECKOUT': '/carrinho',
                'AUTH': '/login',
                'READER_DASHBOARD': '/minha-biblioteca',
                'AUTHOR_DASHBOARD': '/autor',
                'ADMIN': '/admin'
            };
            if (routes[payload]) {
                navigate(routes[payload]);
            } else if (typeof payload === 'string' && payload.startsWith('/')) {
                // If payload is a direct path
                navigate(payload);
            } else {
                // Unknown view key
                console.warn('Unknown view/route:', payload);
            }
        }
    };

    if (authLoading) {
        return (
            <div className="h-screen flex items-center justify-center bg-brand-light">
                <Loader2 className="w-12 h-12 text-brand-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col font-sans text-brand-dark bg-brand-light">
            <Navbar
                cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)}
                user={user}
                onLogout={async () => {
                    const { logout } = await import('./services/authService');
                    await logout();
                    navigate('/');
                }}
                currentView={location.pathname} // Passing path as currentView for now
                onNavigate={(v: string) => handleAction('NAVIGATE', v)}
            />

            <main className="flex-grow">
                <React.Suspense fallback={
                    <div className="h-96 flex items-center justify-center">
                        <Loader2 className="w-12 h-12 text-brand-primary animate-spin" />
                    </div>
                }>
                    <Routes>
                        <Route path="/" element={
                            <HomePage
                                books={books}
                                loading={loading}
                                onViewDetails={(b) => handleAction('VIEW_BOOK', b)}
                                onAddToCart={(b) => handleAction('ADD_TO_CART', b)}
                                onToggleWishlist={(b) => { }}
                                onNavigate={(v) => handleAction('NAVIGATE', v)}
                            />
                        } />
                        <Route path="/livros" element={
                            <CatalogPage
                                books={books}
                                loading={loading}
                                onViewDetails={(b) => handleAction('VIEW_BOOK', b)}
                                onAddToCart={(b) => handleAction('ADD_TO_CART', b)}
                                onToggleWishlist={(b) => { }}
                            />
                        } />
                        <Route path="/blog" element={<BlogPage user={user} />} />
                        <Route path="/servicos" element={<ServicesPage />} />
                        <Route path="/sobre" element={<AboutPage />} />
                        <Route path="/contacto" element={<ContactPage />} />

                        <Route path="/carrinho" element={
                            <CheckoutPage
                                cart={cart}
                                onUpdateQuantity={handleUpdateQuantity}
                                onRemoveItem={(id) => handleUpdateQuantity(id, 0)}
                            />
                        } />

                        <Route path="/login" element={
                            user ? <Navigate to="/" replace /> : <AuthPage onLogin={() => { }} />
                        } />

                        {/* Protected Routes */}
                        <Route path="/minha-biblioteca" element={
                            <ProtectedRoute user={user} loading={authLoading}>
                                <ReaderDashboard user={user} />
                            </ProtectedRoute>
                        } />

                        <Route path="/autor" element={
                            <ProtectedRoute user={user} loading={authLoading} allowedRoles={['autor', 'adm']}>
                                <AuthorDashboard user={user} />
                            </ProtectedRoute>
                        } />

                        <Route path="/admin" element={
                            <ProtectedRoute user={user} loading={authLoading} allowedRoles={['adm']}>
                                <AdminDashboard user={user} />
                            </ProtectedRoute>
                        } />

                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </React.Suspense>
            </main>

            <Footer onNavigate={(v: string) => handleAction('NAVIGATE', v)} />

            {/* Logic for Book Modal - kept global for simplicity */}
            {selectedBook && (
                <React.Suspense fallback={null}>
                    <BookDetailModal
                        isOpen={!!selectedBook}
                        onClose={() => setSelectedBook(null)}
                        book={selectedBook}
                        onAddToCart={(b) => {
                            handleAction('ADD_TO_CART', b);
                            setSelectedBook(null);
                        }}
                        onNavigate={(v: string) => handleAction('NAVIGATE', v)}
                        user={user}
                    />
                </React.Suspense>
            )}
        </div>
    );
};

import ErrorBoundary from './components/ErrorBoundary';

// APP_VERSION: Change this string to force a cache clear on all users' devices
const APP_VERSION = '2.1.0';

const checkAppVersion = () => {
    const storedVersion = localStorage.getItem('app_version');
    if (storedVersion !== APP_VERSION) {
        console.log(`New version detected (${APP_VERSION}). Clearing cache...`);

        // Keep essential data if needed, or clear everything
        // For this case, we clear everything to ensure a clean slate
        localStorage.clear();

        // Set new version
        localStorage.setItem('app_version', APP_VERSION);

        // Force a reload to ensure the new version is loaded
        window.location.reload();
    }
};

// Helper to determine the correct basename
const getBasename = () => {
    // If we are on localhost and in the subdir
    if (window.location.hostname === 'localhost' && window.location.pathname.startsWith('/editoragraca-novo')) {
        return '/editoragraca-novo';
    }
    // Vercel or other root deployments
    return '/';
};

const App: React.FC = () => {
    // Check version before render
    useEffect(() => {
        checkAppVersion();
    }, []);

    return (
        <ErrorBoundary>
            <Router basename={getBasename()}>
                <ToastProvider>
                    <ScrollToTop />
                    <AppContent />
                </ToastProvider>
            </Router>
        </ErrorBoundary>
    );
};

export default App;
