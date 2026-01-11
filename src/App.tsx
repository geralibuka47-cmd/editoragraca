import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BookCard from './components/BookCard';
import BookDetailModal from './components/BookDetailModal';
import AuthPage from './pages/AuthPage';
import CatalogPage from './pages/CatalogPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import CheckoutPage from './pages/CheckoutPage';
import ServicesPage from './pages/ServicesPage';
import TeamPage from './pages/TeamPage';
import { subscribeToAuthChanges, logout } from './services/authService';
import { getBooks } from './services/dataService';
import { client } from './services/appwrite';
import { Book, User, ViewState } from './types';
import { Sparkles, BookOpen, ArrowRight, Zap, Star, Trophy, Mail, Loader2 } from 'lucide-react';

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

    // Check Appwrite configuration
    useEffect(() => {
        if (!import.meta.env.VITE_APPWRITE_PROJECT_ID) {
            console.warn("Appwrite Project ID is missing. Backend features will not work.");
        }
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

    const renderHome = () => (
        <>
            {/* Hero Section */}
            <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-white">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-primary/5 -skew-x-12 transform origin-top translate-x-20"></div>

                <div className="container mx-auto px-8 grid lg:grid-cols-2 items-center gap-20 py-20 relative z-10">
                    <div className="space-y-10 animate-fade-in">
                        <div className="inline-flex items-center gap-3 px-4 py-2 bg-brand-primary/10 rounded-full text-brand-primary font-bold tracking-[0.2em] uppercase text-[10px]">
                            <Sparkles className="w-4 h-4" />
                            <span>Edições de Colecionador agora disponíveis</span>
                        </div>

                        <h1 className="text-7xl md:text-[5.5rem] font-black leading-[0.95] text-brand-dark tracking-tighter">
                            Onde Cada Página <br />
                            <span className="text-brand-primary italic font-serif font-normal text-[0.9em]">Ganha Vida</span>
                        </h1>

                        <p className="text-xl text-gray-500 max-w-xl leading-relaxed font-medium">
                            Descubra o catálogo da Editora Graça. Uma seleção rigorosa de literatura angolana e internacional, desenhada para leitores exigentes.
                        </p>

                        <div className="flex flex-wrap gap-6 pt-4">
                            <button className="btn-premium group" onClick={() => handleNavigate('CATALOG')}>
                                Explorar Catálogo
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button className="px-10 py-4 border-2 border-brand-dark text-brand-dark font-bold hover:bg-brand-dark hover:text-white transition-all uppercase text-[11px] tracking-[0.2em]">
                                Nossa História
                            </button>
                        </div>

                        <div className="flex items-center gap-10 pt-8 border-t border-gray-100">
                            <div className="flex flex-col">
                                <span className="text-3xl font-black text-brand-dark">500+</span>
                                <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Livros Publicados</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-3xl font-black text-brand-dark">10k+</span>
                                <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Leitores Felizes</span>
                            </div>
                        </div>
                    </div>

                    <div className="relative animate-fade-in delay-200">
                        <div className="relative z-10 w-full aspect-[4/5] bg-brand-light rounded-3xl shadow-2xl overflow-hidden border-8 border-white group">
                            <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/20 to-brand-dark/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                            <div className="flex flex-col items-center justify-center h-full p-20">
                                <div className="w-full h-full border-2 border-brand-primary/30 border-dashed rounded-2xl flex items-center justify-center">
                                    <BookOpen className="w-32 h-32 text-brand-primary/20" />
                                </div>
                            </div>

                            <div className="absolute -top-10 -left-10 w-40 h-40 bg-brand-primary/10 rounded-full blur-3xl"></div>
                            <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-brand-dark/5 rounded-full blur-3xl"></div>
                        </div>

                        <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-2xl flex items-center gap-5 border border-gray-50 z-20">
                            <div className="w-16 h-16 bg-brand-primary flex items-center justify-center rounded-xl text-white">
                                <Zap className="w-8 h-8 fill-current" />
                            </div>
                            <div>
                                <h5 className="font-serif font-bold text-xl text-brand-dark italic leading-none">Novidade</h5>
                                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold pt-1">Acabado de Chegar</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories / Promo Banners Section */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-8">
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="group relative h-80 rounded-3xl overflow-hidden bg-brand-dark flex items-end p-10 cursor-pointer">
                            <div className="absolute inset-0 bg-brand-primary/20 group-hover:bg-brand-primary/40 transition-colors duration-500"></div>
                            <div className="relative z-10 space-y-3">
                                <div className="text-brand-primary font-black text-4xl leading-none">Ficção</div>
                                <p className="text-white/70 text-sm font-medium">As melhores histórias de Angola</p>
                                <button className="text-white font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 group-hover:gap-4 transition-all">
                                    Ver Todos <ArrowRight className="w-3 h-3" />
                                </button>
                            </div>
                        </div>

                        <div className="group relative h-80 rounded-3xl overflow-hidden bg-brand-primary flex flex-col justify-center items-center text-center p-10 shadow-xl shadow-brand-primary/20 cursor-pointer transition-transform hover:scale-[1.02]">
                            <div className="absolute top-0 right-0 p-8">
                                <Star className="w-12 h-12 text-white/20 fill-current" />
                            </div>
                            <div className="relative z-10 space-y-4">
                                <span className="text-[10px] text-white/80 font-bold uppercase tracking-[0.3em]">Exclusivo</span>
                                <h3 className="text-4xl font-black text-white leading-none tracking-tighter">OS MAIS <br /> VENDIDOS</h3>
                                <p className="text-white/80 text-sm font-medium">O que todos estão a ler no momento</p>
                                <button className="mt-4 px-8 py-3 bg-brand-dark text-white rounded-full font-bold text-[10px] uppercase tracking-widest hover:scale-110 transition-transform">
                                    Ver Rankings
                                </button>
                            </div>
                        </div>

                        <div className="group relative h-80 rounded-3xl overflow-hidden bg-gray-100 flex items-end p-10 cursor-pointer border border-gray-200">
                            <div className="absolute inset-0 bg-white/50 group-hover:bg-transparent transition-colors duration-500"></div>
                            <div className="relative z-10 space-y-3">
                                <div className="text-brand-dark font-black text-4xl leading-none">Apoio</div>
                                <p className="text-gray-500 text-sm font-medium">Livros escolares e educativos</p>
                                <button className="text-brand-dark font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 group-hover:gap-4 transition-all">
                                    Explorar <ArrowRight className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* New Arrivals Section */}
            <section className="py-24 bg-brand-light">
                <div className="container mx-auto px-8">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-brand-primary font-bold tracking-[0.2em] uppercase text-[10px]">
                                <div className="w-10 h-0.5 bg-brand-primary"></div>
                                <span>Novidades</span>
                            </div>
                            <h2 className="text-5xl font-black text-brand-dark tracking-tighter">
                                Acabados de <span className="text-brand-primary italic font-serif font-normal text-[0.9em]">Sair do Forno</span>
                            </h2>
                        </div>
                        <button
                            onClick={() => handleNavigate('CATALOG')}
                            className="group flex items-center gap-3 font-bold text-[11px] uppercase tracking-widest text-brand-dark hover:text-brand-primary transition-colors"
                        >
                            Explorar Todos os Lançamentos
                            <span className="w-10 h-10 border border-brand-dark/10 rounded-full flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-all group-hover:border-brand-primary">
                                <ArrowRight className="w-4 h-4" />
                            </span>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {books.filter(b => b.isNew || b.isBestseller).slice(0, 4).map(book => (
                            <BookCard
                                key={book.id}
                                book={book}
                                onAddToCart={handleAddToCart}
                                onToggleWishlist={handleToggleWishlist}
                                onViewDetails={handleViewDetails}
                            />
                        ))}
                        {books.length === 0 && !loading && (
                            <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-gray-200">
                                <p className="text-gray-400 font-medium">Nenhum livro disponível no momento.</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Feature Highlights Section */}
            <section className="bg-brand-dark py-24 px-8 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-primary/10 via-transparent to-transparent"></div>

                <div className="container mx-auto grid md:grid-cols-4 gap-12 relative z-10 text-center md:text-left">
                    <div className="space-y-4">
                        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-brand-primary mx-auto md:mx-0 transition-transform hover:scale-110">
                            <Zap className="w-8 h-8" />
                        </div>
                        <h4 className="font-serif text-2xl font-bold text-white italic">Entrega Expresso</h4>
                        <p className="text-gray-500 text-sm font-medium">Receba as suas encomendas em tempo recorde em qualquer província.</p>
                    </div>

                    <div className="space-y-4">
                        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-brand-primary mx-auto md:mx-0 transition-transform hover:scale-110">
                            <Star className="w-8 h-8" />
                        </div>
                        <h4 className="font-serif text-2xl font-bold text-white italic">Qualidade Premium</h4>
                        <p className="text-gray-500 text-sm font-medium">Garantimos a melhor qualidade de impressão e encadernação de mercado.</p>
                    </div>

                    <div className="space-y-4">
                        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-brand-primary mx-auto md:mx-0 transition-transform hover:scale-110">
                            <Trophy className="w-8 h-8" />
                        </div>
                        <h4 className="font-serif text-2xl font-bold text-white italic">Best Sellers</h4>
                        <p className="text-gray-500 text-sm font-medium">Acesso direto às obras mais premiadas e lidas do ano.</p>
                    </div>

                    <div className="space-y-4">
                        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-brand-primary mx-auto md:mx-0 transition-transform hover:scale-110">
                            <Mail className="w-8 h-8" />
                        </div>
                        <h4 className="font-serif text-2xl font-bold text-white italic">Newsletter</h4>
                        <p className="text-gray-500 text-sm font-medium">Subscreva e receba 10% de desconto imediato na sua primeira compra.</p>
                    </div>
                </div>
            </section>
        </>
    );

    return (
        <div className="min-h-screen flex flex-col font-sans bg-brand-light relative">
            <Navbar onNavigate={handleNavigate} cartCount={cart.length} user={user} onLogout={handleLogout} />

            <main className="flex-grow">
                {loading && (
                    <div className="fixed inset-0 z-[200] bg-white/80 backdrop-blur-md flex flex-col items-center justify-center gap-4">
                        <Loader2 className="w-12 h-12 text-brand-primary animate-spin" />
                        <p className="font-serif text-xl font-bold text-brand-dark italic">Abrindo as portas da sabedoria...</p>
                    </div>
                )}

                {currentView === 'HOME' && renderHome()}
                {currentView === 'AUTH' && <AuthPage onSuccess={handleAuthSuccess} onBack={() => handleNavigate('HOME')} />}
                {currentView === 'CATALOG' && (
                    <CatalogPage
                        books={books}
                        onAddToCart={handleAddToCart}
                        onToggleWishlist={handleToggleWishlist}
                        onViewDetails={handleViewDetails}
                        onNavigate={handleNavigate}
                    />
                )}
                {currentView === 'ABOUT' && <AboutPage onNavigate={handleNavigate} />}
                {currentView === 'CONTACT' && <ContactPage onNavigate={handleNavigate} />}
                {currentView === 'CHECKOUT' && (
                    <CheckoutPage
                        cart={cart}
                        onUpdateQuantity={handleUpdateQuantity}
                        onRemoveItem={handleRemoveFromCart}
                        onNavigate={handleNavigate}
                    />
                )}
                {currentView === 'SERVICES' && <ServicesPage onNavigate={handleNavigate} />}
                {currentView === 'TEAM' && <TeamPage onNavigate={handleNavigate} />}
                {currentView !== 'HOME' && currentView !== 'AUTH' && currentView !== 'CATALOG' && currentView !== 'ABOUT' && currentView !== 'CONTACT' && currentView !== 'CHECKOUT' && currentView !== 'SERVICES' && currentView !== 'TEAM' && (
                    <div className="container mx-auto px-8 py-32 text-center h-[60vh] flex flex-col items-center justify-center">
                        <h2 className="text-4xl font-black text-brand-dark mb-4 tracking-tighter">Secção em Construção</h2>
                        <p className="text-gray-500 mb-8 font-medium">Estamos a preparar algo especial para si.</p>
                        <button onClick={() => handleNavigate('HOME')} className="btn-premium">Voltar ao Início</button>
                    </div>
                )}
            </main>

            <Footer />

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
