import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { LazyMotion, domAnimation } from 'framer-motion';
import { ToastProvider, useToast } from './components/Toast';
import { Book } from './types';
import {
    getBooksMinimal,
    getSiteContent,
} from './services/dataService';
import { logout as authLogout } from './services/authService';
import { Loader2 } from 'lucide-react';
import WhatsAppBubble from './components/WhatsAppBubble';
import AnnouncementBar from './components/AnnouncementBar';
import { useAuth } from './contexts/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';

// Admin pages will be lazy loaded

// Lazy loading pages
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const RegisterPage = React.lazy(() => import('./pages/RegisterPage'));
const LibraryPage = React.lazy(() => import('./pages/LibraryPage'));
const HomePage = React.lazy(() => import('./pages/HomePage'));
const HeritagePage = React.lazy(() => import('./pages/HeritagePage'));
const ConciergePage = React.lazy(() => import('./pages/ConciergePage'));
const CheckoutPage = React.lazy(() => import('./pages/CheckoutPage'));
const JournalPage = React.lazy(() => import('./pages/JournalPage'));
const AtelierPage = React.lazy(() => import('./pages/AtelierPage'));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage'));
const AdminLayout = React.lazy(() => import('./components/admin/AdminLayout'));
const AdminOverview = React.lazy(() => import('./pages/admin/AdminOverview'));
const AdminBooksPage = React.lazy(() => import('./pages/admin/AdminBooks'));
const AdminUsersPage = React.lazy(() => import('./pages/admin/AdminUsers'));
const AdminOrdersPage = React.lazy(() => import('./pages/admin/AdminOrders'));
const AdminManuscriptsPage = React.lazy(() => import('./pages/admin/AdminManuscripts'));
const AdminBlogPage = React.lazy(() => import('./pages/admin/AdminBlog'));
const AdminTeamPage = React.lazy(() => import('./pages/admin/AdminTeam'));
const AdminSettingsPage = React.lazy(() => import('./pages/admin/AdminSettings'));
const BookPage = React.lazy(() => import('./pages/BookPage'));
const MemberDetailPage = React.lazy(() => import('./pages/MemberDetailPage'));
const ExhibitionPage = React.lazy(() => import('./pages/ExhibitionPage'));

// Scroll to top on route change
const ScrollToTop = () => {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
};

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) => {
    const { user, loading } = useAuth();

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
    // Initialize from cache if possible for instant render
    const [books, setBooks] = useState<Book[]>(() => {
        const saved = localStorage.getItem('eg_cache_books');
        return saved ? JSON.parse(saved).data : [];
    });
    const [siteContent, setSiteContent] = useState<Record<string, any>>(() => {
        const saved = localStorage.getItem('eg_cache_site_content_all');
        return saved ? JSON.parse(saved).data : {};
    });
    const [dataLoading, setDataLoading] = useState(!books.length); // Only show loader if no cache
    const [cart, setCart] = useState<any[]>(() => {
        const saved = localStorage.getItem('cart');
        return saved ? JSON.parse(saved) : [];
    });
    const [announcementVisible, setAnnouncementVisible] = useState(false);
    const { showToast } = useToast();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();

    // Altura do AnnouncementBar (py-2.5 = ~42px)
    const ANNOUNCEMENT_HEIGHT = 42;

    // Sync cart to local storage
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    // Fetch Data with stale-while-revalidate logic
    useEffect(() => {
        const loadData = async () => {
            try {
                // If we have cache, we already started rendering. 
                // We fetch in background to update.
                const [fetchedBooks, fetchedContent] = await Promise.all([
                    getBooksMinimal(),
                    getSiteContent()
                ]);
                setBooks(fetchedBooks);
                setSiteContent(fetchedContent);
            } catch (error) {
                console.error("Failed to fetch/refresh data:", error);
            } finally {
                setDataLoading(false);
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
        showToast(`"${book.title}" adicionado ao carrinho!`, 'success');
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
            navigate(`/livro/${payload.id}`);
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
                'READER_DASHBOARD': '/perfil',
                'AUTHOR_DASHBOARD': '/perfil',
                'ADMIN_DASHBOARD': '/admin'
            };
            if (routes[payload]) navigate(routes[payload]);
        }
    };

    const isDashboardRoute = location.pathname.startsWith('/admin') || location.pathname.startsWith('/perfil');
    const showShell = !isDashboardRoute;
    const topOffset = showShell && announcementVisible ? ANNOUNCEMENT_HEIGHT : 0;

    return (
        <div className="flex flex-col min-h-screen">
            <ScrollToTop />
            {showShell && (
                <>
                    <AnnouncementBar onVisibilityChange={setAnnouncementVisible} />
                    <a
                        href="#main-content"
                        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-3 focus:bg-brand-primary focus:text-white focus:font-bold focus:rounded-lg focus:shadow-lg focus:text-sm min-touch"
                    >
                        Saltar para o conteúdo
                    </a>
                    <Navbar
                        cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)}
                        onNavigate={(path) => navigate(path)}
                        user={user}
                        currentView={location.pathname}
                        announcementOffset={topOffset}
                        onLogout={async () => {
                            await authLogout();
                            navigate('/');
                        }}
                    />
                </>
            )}

            <main
                id="main-content"
                className="flex-grow flex flex-col min-h-0"
                style={showShell ? { paddingTop: `calc(${topOffset}px + clamp(64px, 6vw, 96px))` } : {}}
                tabIndex={-1}
            >
                <React.Suspense fallback={
                    <div className="h-screen flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
                    </div>
                }>
                    <Routes>
                        <Route path="/" element={
                            <HomePage
                                books={books}
                                loading={dataLoading}
                                onViewDetails={(b) => handleAction('VIEW_BOOK', b)}
                                onAddToCart={(b) => handleAction('ADD_TO_CART', b)}
                                onToggleWishlist={(b) => { }}
                                onNavigate={(v) => handleAction('NAVIGATE', v)}
                            />
                        } />
                        <Route path="/livros" element={
                            <LibraryPage
                                books={books}
                                loading={dataLoading}
                                onViewDetails={(b) => handleAction('VIEW_BOOK', b)}
                                onAddToCart={(b) => handleAction('ADD_TO_CART', b)}
                                onToggleWishlist={(b) => { }}
                            />
                        } />
                        <Route path="/livro/:id" element={
                            <BookPage
                                user={user}
                                cart={cart}
                                onAddToCart={(b) => handleAction('ADD_TO_CART', b)}
                            />
                        } />
                        <Route path="/sobre" element={<HeritagePage siteContent={siteContent} />} />
                        <Route path="/contacto" element={<ConciergePage siteContent={siteContent} />} />
                        <Route path="/projetos" element={<ExhibitionPage siteContent={siteContent} />} />
                        <Route path="/servicos" element={<AtelierPage siteContent={siteContent} />} />
                        <Route path="/blog" element={<JournalPage user={user} />} />
                        <Route path="/equipa/:id" element={<MemberDetailPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/registo" element={<RegisterPage />} />

                        <Route path="/carrinho" element={
                            <CheckoutPage
                                cart={cart}
                                onUpdateQuantity={handleUpdateQuantity}
                                onRemoveItem={(id) => handleUpdateQuantity(id, 0)}
                            />
                        } />

                        {/* Protected Routes */}
                        <Route path="/perfil" element={
                            <ProtectedRoute allowedRoles={['leitor', 'autor', 'adm']}>
                                <ProfilePage />
                            </ProtectedRoute>
                        } />

                        <Route path="/admin/*" element={
                            <ProtectedRoute allowedRoles={['adm']}>
                                <AdminLayout>
                                    <Routes>
                                        <Route path="/" element={<AdminOverview />} />
                                        <Route path="livros" element={<AdminBooksPage />} />
                                        <Route path="utilizadores" element={<AdminUsersPage />} />
                                        <Route path="encomendas" element={<AdminOrdersPage />} />
                                        <Route path="manuscritos" element={<AdminManuscriptsPage />} />
                                        <Route path="blog" element={<AdminBlogPage />} />
                                        <Route path="equipa" element={<AdminTeamPage />} />
                                        <Route path="settings" element={<AdminSettingsPage />} />
                                        {/* Future admin pages will be added here */}
                                    </Routes>
                                </AdminLayout>
                            </ProtectedRoute>
                        } />

                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </React.Suspense>
            </main>

            {showShell && <Footer content={siteContent} />}
            {showShell && <WhatsAppBubble />}
        </div >

    );
};

const App: React.FC = () => {
    return (
        <ErrorBoundary>
            <Router>
                <LazyMotion features={domAnimation}>
                    <ToastProvider>
                        <AppContent />
                    </ToastProvider>
                </LazyMotion>
            </Router>
        </ErrorBoundary>
    );
};

export default App;
