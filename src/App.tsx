import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { LazyMotion, domAnimation } from 'framer-motion';
import { ToastProvider, useToast } from './components/Toast';
import { Book } from './types';
import { getBooksMinimal } from './services/dataService';
import { logout as authLogout } from './services/authService';
import { Loader2 } from 'lucide-react';
import WhatsAppBubble from './components/WhatsAppBubble';
import { useAuth } from './contexts/AuthContext';

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
const BookPage = React.lazy(() => import('./pages/BookPage'));
const MemberDetailPage = React.lazy(() => import('./pages/MemberDetailPage'));
const ExhibitionPage = React.lazy(() => import('./pages/ExhibitionPage'));

// Lazy loading admin pages
const AdminBooksPage = React.lazy(() => import('./pages/admin/AdminBooksPage'));
const AdminUsersPage = React.lazy(() => import('./pages/admin/AdminUsersPage'));
const AdminOrdersPage = React.lazy(() => import('./pages/admin/AdminOrdersPage'));
const AdminBlogPage = React.lazy(() => import('./pages/admin/AdminBlogPage'));
const AdminManuscriptsPage = React.lazy(() => import('./pages/admin/AdminManuscriptsPage'));
const AdminServicesPage = React.lazy(() => import('./pages/admin/AdminServicesPage'));
const AdminTeamPage = React.lazy(() => import('./pages/admin/AdminTeamPage'));
const AdminContentPage = React.lazy(() => import('./pages/admin/AdminContentPage'));

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
    const [books, setBooks] = useState<Book[]>([]);
    const [dataLoading, setDataLoading] = useState(true);
    const [cart, setCart] = useState<any[]>(() => {
        const saved = localStorage.getItem('cart');
        return saved ? JSON.parse(saved) : [];
    });
    const { showToast } = useToast();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();

    // Sync cart to local storage
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    // Fetch Data
    useEffect(() => {
        const loadData = async () => {
            setDataLoading(true);
            try {
                const fetchedBooks = await getBooksMinimal();
                setBooks(fetchedBooks);
            } catch (error) {
                console.error("Failed to fetch books:", error);
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

    const isDashboardRoute = location.pathname === '/admin' || location.pathname === '/perfil';
    const showShell = !isDashboardRoute;

    return (
        <div className="flex flex-col min-h-screen">
            <ScrollToTop />
            {showShell && (
                <>
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
                        onLogout={async () => {
                            await authLogout();
                            navigate('/');
                        }}
                    />
                </>
            )}

            <main
                id="main-content"
                className={`flex-grow flex flex-col min-h-0 ${showShell ? 'pt-16 sm:pt-20 md:pt-24' : ''}`}
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
                                cart={cart}
                                onAddToCart={(b) => handleAction('ADD_TO_CART', b)}
                            />
                        } />
                        <Route path="/sobre" element={<HeritagePage />} />
                        <Route path="/contacto" element={<ConciergePage />} />
                        <Route path="/projetos" element={<ExhibitionPage />} />
                        <Route path="/servicos" element={<AtelierPage />} />
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
                                        <Route path="livros" element={<AdminBooksPage onStatsRefresh={() => { }} />} />
                                        <Route path="utilizadores" element={<AdminUsersPage />} />
                                        <Route path="encomendas" element={<AdminOrdersPage user={user!} />} />
                                        <Route path="blog" element={<AdminBlogPage posts={[]} onRefresh={() => { }} />} />
                                        <Route path="manuscritos" element={<AdminManuscriptsPage />} />
                                        <Route path="servicos" element={<AdminServicesPage />} />
                                        <Route path="team" element={<AdminTeamPage />} />
                                        <Route path="definicoes" element={<AdminContentPage />} />
                                    </Routes>
                                </AdminLayout>
                            </ProtectedRoute>
                        } />

                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </React.Suspense>
            </main>

            {showShell && <Footer />}
            {showShell && <WhatsAppBubble />}
        </div>

    );
};

const App: React.FC = () => {
    return (
        <Router>
            <LazyMotion features={domAnimation}>
                <AppContent />
            </LazyMotion>
        </Router>
    );
};

export default App;
