import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BookDetailModal from './components/BookDetailModal';
const AuthPage = React.lazy(() => import('./pages/AuthPage'));
const CatalogPage = React.lazy(() => import('./pages/CatalogPage'));
const HomePage = React.lazy(() => import('./pages/HomePage')); // Import HomePage
const AboutPage = React.lazy(() => import('./pages/AboutPage'));
const ContactPage = React.lazy(() => import('./pages/ContactPage'));
const CheckoutPage = React.lazy(() => import('./pages/CheckoutPage'));
const ServicesPage = React.lazy(() => import('./pages/ServicesPage'));
const TeamPage = React.lazy(() => import('./pages/TeamPage'));
const BlogPage = React.lazy(() => import('./pages/BlogPage'));
const PodcastPage = React.lazy(() => import('./pages/PodcastPage'));
const ReaderDashboard = React.lazy(() => import('./pages/ReaderDashboard'));
const AuthorDashboard = React.lazy(() => import('./pages/AuthorDashboard'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
import { subscribeToAuthChanges, logout } from './services/authService';
import { getBooks } from './services/dataService';
import { Book, User, ViewState } from './types';
import { Loader2 } from 'lucide-react';

const App: React.FC = () => {
    const [currentView, setCurrentView] = useState<ViewState>('HOME');
    const [user, setUser] = useState<User | null>(null);
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [cart, setCart] = useState<any[]>(() => {
        const saved = localStorage.getItem('cart');
        return saved ? JSON.parse(saved) : [];
    });
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Sync cart to local storage
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    // Auth Subscription
    useEffect(() => {
        const unsubscribe = subscribeToAuthChanges((u) => {
            setUser(u);
        });
        return () => unsubscribe();
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

    const handleNavigate = (view: ViewState) => {
        setCurrentView(view);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleAddToCart = (book: Book) => {
        setCart(prev => [...prev, book]);
    };

    const handleToggleWishlist = (book: Book) => {
        console.log('Toggled wishlist for:', book.title);
    };

    const handleUpdateQuantity = (bookId: string, newQuantity: number) => {
        setCart(prev => prev.map(item =>
            item.id === bookId ? { ...item, quantity: newQuantity } : item
        ));
    };

    const handleRemoveFromCart = (bookId: string) => {
        setCart(prev => prev.filter(item => item.id !== bookId));
    };

    const handleViewDetails = (book: Book) => {
        setSelectedBook(book);
        setIsModalOpen(true);
    };

    const handleLogout = async () => {
        await logout();
        setUser(null);
        handleNavigate('HOME');
    };

    const handleAuthSuccess = (u: User) => {
        setUser(u);
        handleNavigate('HOME');
    };



    const renderContent = () => {
        switch (currentView) {
            case 'HOME':
                return (
                    <HomePage
                        books={books}
                        loading={loading}
                        onNavigate={handleNavigate}
                        onViewDetails={handleViewDetails}
                        onAddToCart={handleAddToCart}
                        onToggleWishlist={handleToggleWishlist}
                    />
                );
            case 'AUTH':
                return <AuthPage onSuccess={handleAuthSuccess} onBack={() => handleNavigate('HOME')} />;
            case 'CATALOG':
                return (
                    <CatalogPage
                        books={books}
                        onAddToCart={handleAddToCart}
                        onToggleWishlist={handleToggleWishlist}
                        onViewDetails={handleViewDetails}
                        onNavigate={handleNavigate}
                    />
                );
            case 'ABOUT':
                return <AboutPage onNavigate={handleNavigate} />;
            case 'CONTACT':
                return <ContactPage onNavigate={handleNavigate} />;
            case 'CHECKOUT':
                return (
                    <CheckoutPage
                        cart={cart}
                        onUpdateQuantity={handleUpdateQuantity}
                        onRemoveItem={handleRemoveFromCart}
                        onNavigate={handleNavigate}
                    />
                );
            case 'SERVICES':
                return <ServicesPage onNavigate={handleNavigate} />;
            case 'TEAM':
                return <TeamPage onNavigate={handleNavigate} />;
            case 'BLOG':
                return <BlogPage onNavigate={handleNavigate} />;
            case 'PODCAST':
                return <PodcastPage onNavigate={handleNavigate} />;
            case 'READER_DASHBOARD':
                return <ReaderDashboard user={user} onNavigate={handleNavigate} />;
            case 'AUTHOR_DASHBOARD':
                return <AuthorDashboard user={user} onNavigate={handleNavigate} />;
            case 'ADMIN':
                return <AdminDashboard user={user} onNavigate={handleNavigate} />;
            default:
                return (
                    <div className="container mx-auto px-8 py-32 text-center h-[60vh] flex flex-col items-center justify-center">
                        <h2 className="text-4xl font-black text-brand-dark mb-4 tracking-tighter">Secção em Construção</h2>
                        <p className="text-gray-500 mb-8 font-medium">Estamos a preparar algo especial para si.</p>
                        <button onClick={() => handleNavigate('HOME')} className="btn-premium">Voltar ao Início</button>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen flex flex-col font-sans bg-brand-light relative">
            <Navbar
                onNavigate={handleNavigate}
                currentView={currentView}
                cartCount={cart.length}
                user={user}
                onLogout={handleLogout}
            />

            <main className="flex-grow">
                {loading && (
                    <div className="fixed inset-0 z-[200] bg-white/80 backdrop-blur-md flex flex-col items-center justify-center gap-4">
                        <Loader2 className="w-12 h-12 text-brand-primary animate-spin" />
                        <p className="font-serif text-xl font-bold text-brand-dark italic">Abrindo as portas da sabedoria...</p>
                    </div>
                )}

                <React.Suspense fallback={
                    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
                        <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
                        <p className="text-gray-400 font-serif italic text-sm">Carregando...</p>
                    </div>
                }>
                    {renderContent()}
                </React.Suspense>
            </main>

            <Footer onNavigate={handleNavigate} />

            <BookDetailModal
                book={selectedBook}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAddToCart={handleAddToCart}
            />
        </div>
    );
};

export default App;
