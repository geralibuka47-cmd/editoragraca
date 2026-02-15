import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ToastProvider, useToast } from './components/Toast';
import { Book } from './types';
import { Loader2 } from 'lucide-react';
import WhatsAppBubble from './components/WhatsAppBubble';
import { useAuth } from './contexts/AuthContext';

// Lazy loading pages
const AuthPage = React.lazy(() => import('./pages/AuthPage'));
const CatalogPage = React.lazy(() => import('./pages/CatalogPage'));
const HomePage = React.lazy(() => import('./pages/HomePage'));
const AboutPage = React.lazy(() => import('./pages/AboutPage'));
const ContactPage = React.lazy(() => import('./pages/ContactPage'));
const CheckoutPage = React.lazy(() => import('./pages/CheckoutPage'));
const ServicesPage = React.lazy(() => import('./pages/ServicesPage'));
const BlogPage = React.lazy(() => import('./pages/BlogPage'));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
const BookPage = React.lazy(() => import('./pages/BookPage'));
const MemberDetailPage = React.lazy(() => import('./pages/MemberDetailPage'));
const ProjectsPage = React.lazy(() => import('./pages/ProjectsPage'));

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
                const { getBooksMinimal } = await import('./services/dataService');
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

    return (

        <div className="flex flex-col min-h-screen">
            <ScrollToTop />
            <Navbar
                cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)}
                onNavigate={(path) => navigate(path)}
                user={user}
                currentView={location.pathname}
                onLogout={async () => {
                    const { logout } = await import('./services/authService');
                    await logout();
                    navigate('/');
                }}
            />

            <main className="flex-grow">
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
                            <CatalogPage
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
                        <Route path="/sobre" element={<AboutPage />} />
                        <Route path="/contacto" element={<ContactPage />} />
                        <Route path="/projetos" element={<ProjectsPage />} />
                        <Route path="/servicos" element={<ServicesPage />} />
                        <Route path="/blog" element={<BlogPage user={user} />} />
                        <Route path="/equipa/:id" element={<MemberDetailPage />} />
                        <Route path="/login" element={<AuthPage onLogin={() => { }} />} />

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

                        <Route path="/admin" element={
                            <ProtectedRoute allowedRoles={['adm']}>
                                <AdminDashboard />
                            </ProtectedRoute>
                        } />

                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </React.Suspense>
            </main>

            <Footer />
            <WhatsAppBubble />
        </div>

    );
};

const App: React.FC = () => {
    return (
        <Router>
            <AppContent />
        </Router>
    );
};

export default App;
