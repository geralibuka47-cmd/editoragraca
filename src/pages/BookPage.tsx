import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    X, ShoppingCart, Heart, Share2, Check, Star, Eye,
    Download, Send, Loader2, ArrowLeft, BookOpen, Clock,
    Shield, Globe, MessageSquare, Award, Sparkles
} from 'lucide-react';
import { m, AnimatePresence } from 'framer-motion';
import { Book, User as UserType, Review } from '../types';
import {
    getBookById,
    getBookReviews,
    addBookReview,
    getBookStats,
    incrementBookView,
    checkIsFavorite,
    toggleFavorite,
    checkDownloadAccess,
    getUserProfile
} from '../services/dataService';
import { optimizeImageUrl } from '../components/OptimizedImage';
import { useToast } from '../components/Toast';
import SEO from '../components/SEO';
import CountdownTimer from '../components/CountdownTimer';

const BookPage: React.FC<{ user?: UserType | null; cart: any[]; onAddToCart: (book: Book) => void }> = ({ user, cart, onAddToCart }) => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { showToast } = useToast();

    const [book, setBook] = useState<Book | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'sinopse' | 'ficha' | 'avaliacoes'>('sinopse');
    const [authorProfile, setAuthorProfile] = useState<UserType | null>(null);
    const [stats, setStats] = useState<any>({ views: 0, rating: 0, downloads: 0, sales: 0, reviewsCount: 0 });
    const [isFavorite, setIsFavorite] = useState(false);
    const [hasDownloadAccess, setHasDownloadAccess] = useState(false);
    const [reviews, setReviews] = useState<Review[]>([]);

    const [isSubmittingReview, setIsSubmittingReview] = useState(false);
    const [reviewContent, setReviewContent] = useState('');
    const [reviewRating, setReviewRating] = useState(5);

    useEffect(() => {
        const loadBookData = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const fetchedBook = await getBookById(id);
                if (!fetchedBook) {
                    showToast('Livro não encontrado.', 'error');
                    navigate('/livros');
                    return;
                }
                setBook(fetchedBook);

                const [realStats, bookReviews, favStatus, downloadAccess, profile] = await Promise.all([
                    getBookStats(id),
                    getBookReviews(id),
                    user ? checkIsFavorite(id, user.id) : Promise.resolve(false),
                    checkDownloadAccess(id, user?.id, fetchedBook.price || 0),
                    fetchedBook.authorId ? getUserProfile(fetchedBook.authorId) : Promise.resolve(null)
                ]);

                setStats(realStats);
                setReviews(bookReviews);
                setIsFavorite(favStatus);
                setHasDownloadAccess(downloadAccess);
                setAuthorProfile(profile);

                // Track view
                await incrementBookView(id);
            } catch (error) {
                console.error("Error loading book data:", error);
                showToast('Erro ao carregar dados do livro.', 'error');
            } finally {
                setLoading(false);
            }
        };
        loadBookData();
    }, [id, user, navigate, showToast]);

    const handleToggleFavorite = async () => {
        if (!user) {
            showToast('Inicie sessão para adicionar aos favoritos.', 'info');
            return;
        }
        if (!book) return;
        const newStatus = await toggleFavorite(book.id, user.id);
        setIsFavorite(newStatus);
        showToast(newStatus ? 'Adicionado aos favoritos' : 'Removido dos favoritos', 'success');
    };

    const handleAddReview = async () => {
        if (!user || !reviewContent.trim() || !book) return;

        setIsSubmittingReview(true);
        try {
            await addBookReview({
                bookId: book.id,
                userId: user.id,
                userName: user.name,
                rating: reviewRating,
                comment: reviewContent.trim()
            });

            const [newStats, newReviews] = await Promise.all([
                getBookStats(book.id),
                getBookReviews(book.id)
            ]);
            setStats(newStats);
            setReviews(newReviews);
            setReviewContent('');
            setReviewRating(5);
            showToast('Avaliação enviada com sucesso!', 'success');
        } catch (error) {
            console.error("Error submitting review:", error);
            showToast('Erro ao enviar avaliação.', 'error');
        } finally {
            setIsSubmittingReview(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 text-brand-primary animate-spin" />
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Cimentando Literaturas...</p>
                </div>
            </div>
        );
    }

    if (!book) return null;

    const isUpcoming = book.launchDate ? new Date(book.launchDate) > new Date() : false;

    return (
        <div className="min-h-screen bg-white font-sans text-brand-dark overflow-x-hidden">
            <SEO
                title={book.title}
                description={book.description || `Detalhes da obra ${book.title} de ${book.author}`}
                image={book.coverUrl}
                type="book"
            />
            {/* Nav Spacer */}
            <div className="h-16 sm:h-20 md:h-24 bg-brand-dark"></div>

            {isUpcoming ? (
                <div className="bg-brand-dark text-white pt-12 pb-24 overflow-hidden relative">
                    {/* Background Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-brand-primary/10 blur-[150px] rounded-full" />

                    <div className="container relative z-10">
                        <m.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="max-w-4xl mx-auto flex flex-col items-center text-center space-y-12"
                        >
                            <div className="space-y-6">
                                <span className="px-6 py-2 bg-brand-primary/20 text-brand-primary font-black text-xs uppercase tracking-[0.4em] rounded-full border border-brand-primary/30">
                                    Lançamento em Breve
                                </span>
                                <h1 className="text-4xl sm:text-7xl lg:text-[10rem] font-black uppercase tracking-tighter leading-[0.8]">
                                    {book.title}
                                </h1>
                                <p className="text-xl sm:text-3xl font-light italic text-gray-400">
                                    Por <span className="text-white font-black not-italic">{book.author}</span>
                                </p>
                            </div>

                            <div className="w-full max-w-sm aspect-[2/3] rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border-4 border-white/10">
                                <img src={optimizeImageUrl(book.coverUrl)} alt={book.title} className="w-full h-full object-cover" />
                            </div>

                            <div className="space-y-8 w-full">
                                <p className="text-brand-primary font-black text-xs uppercase tracking-[0.5em]">Contagem Regressiva</p>
                                <div className="flex justify-center">
                                    <CountdownTimer targetDate={book.launchDate!} className="justify-center" />
                                </div>
                            </div>

                            <div className="max-w-2xl text-lg sm:text-xl text-gray-400 font-medium leading-relaxed italic pt-12 border-t border-white/10">
                                {book.description ? (
                                    <p className="line-clamp-6">"{book.description}"</p>
                                ) : (
                                    <p>Esta obra exclusiva da Editora Graça está prestes a transformar o panorama literário angolano.</p>
                                )}
                            </div>

                            <button
                                onClick={() => navigate('/livros')}
                                className="flex items-center gap-3 text-brand-primary font-black uppercase text-xs tracking-[0.3em] hover:text-white transition-colors group"
                            >
                                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-2 transition-transform" />
                                Voltar ao Catálogo
                            </button>
                        </m.div>
                    </div>
                </div>
            ) : (
                <>
                    {/* 1. HERO SECTION - Immersive Split */}
                    <section className="relative lg:min-h-screen flex items-center pt-8 sm:pt-12 pb-16 sm:pb-24 lg:py-0 overflow-hidden">
                        {/* Background Text Overlay - hidden on small screens */}
                        <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/4 select-none pointer-events-none opacity-[0.02] whitespace-nowrap hidden md:block">
                            <span className="text-[15rem] lg:text-[25rem] font-black uppercase tracking-tighter leading-none">
                                {book.title}
                            </span>
                        </div>

                        <div className="container mx-auto px-4 sm:px-6 md:px-12 relative z-10 w-full">
                            <div className="grid lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-24 items-center">

                                {/* Book Visual - Left */}
                                <m.div
                                    initial={{ opacity: 0, x: -50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="lg:col-span-5 flex justify-center"
                                >
                                    <div className="relative group">
                                        <div className="absolute inset-0 bg-brand-primary/20 blur-[100px] rounded-full group-hover:bg-brand-primary/30 transition-all"></div>
                                        <div className="relative w-full max-w-[240px] sm:max-w-[280px] md:max-w-sm aspect-[2/3] rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] border-2 sm:border-4 border-white transition-transform duration-700 hover:scale-[1.02] mx-auto">
                                            <img
                                                src={optimizeImageUrl(book.coverUrl)}
                                                alt={book.title}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                                        </div>

                                        {/* Floating Badge */}
                                        <div className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 w-16 h-16 sm:w-24 sm:h-24 bg-brand-dark rounded-full flex items-center justify-center border-2 sm:border-4 border-white shadow-xl rotate-12 group-hover:rotate-0 transition-all">
                                            <div className="text-center">
                                                <p className="text-[10px] text-brand-primary font-black uppercase">Obra</p>
                                                <p className="text-white font-black text-xs uppercase">{book.format === 'digital' ? 'Digital' : 'Física'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </m.div>

                                {/* Text Info - Right */}
                                <m.div
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="lg:col-span-7 space-y-10"
                                >
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <span className="px-4 py-1.5 bg-brand-primary/10 text-brand-primary font-black text-[10px] uppercase tracking-[0.2em] rounded-full border border-brand-primary/20 flex items-center gap-2">
                                                <Sparkles className="w-3 h-3" />
                                                {book.genre}
                                            </span>
                                            {book.isBestseller && (
                                                <span className="px-4 py-1.5 bg-amber-500/10 text-amber-600 font-black text-[10px] uppercase tracking-[0.2em] rounded-full border border-amber-500/20">
                                                    Bestseller
                                                </span>
                                            )}
                                        </div>

                                        <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-8xl font-black uppercase leading-[0.85] tracking-tighter break-words">
                                            {book.title}
                                        </h1>

                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-[2px] bg-brand-primary"></div>
                                            <p className="text-lg sm:text-2xl md:text-3xl font-light text-gray-500 italic tracking-tight">
                                                Escrito por <span className="text-brand-dark font-black not-italic">{book.author}</span>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-6 sm:gap-12 py-6 sm:py-8 border-y border-gray-100">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Preço Estipulado</p>
                                            <p className="text-2xl sm:text-4xl font-black text-brand-dark">
                                                {book.price === 0 ? 'Livre' : `${book.price.toLocaleString()} Kz`}
                                            </p>
                                        </div>
                                        <div className="flex flex-wrap gap-3 sm:gap-4">
                                            <div className="p-3 sm:p-4 bg-gray-50 rounded-xl sm:rounded-2xl flex flex-col items-center min-w-[70px]">
                                                <Eye className="w-5 h-5 text-gray-400 mb-1" />
                                                <span className="font-black text-brand-dark">{stats.views}</span>
                                                <span className="text-[8px] uppercase font-bold text-gray-400">Leituras</span>
                                            </div>
                                            <div className="p-3 sm:p-4 bg-gray-50 rounded-xl sm:rounded-2xl flex flex-col items-center min-w-[70px]">
                                                <Star className="w-5 h-5 text-amber-500 mb-1 fill-amber-500" />
                                                <span className="font-black text-brand-dark">{stats.rating || 'N/A'}</span>
                                                <span className="text-[8px] uppercase font-bold text-gray-400">Score</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* CTAs */}
                                    <div className="flex flex-col sm:flex-row gap-6 pt-4">
                                        {book.format === 'digital' && book.digitalFileUrl ? (
                                            <div className="flex flex-col gap-4 w-full">
                                                <div className="flex flex-col sm:flex-row gap-6">
                                                    {hasDownloadAccess ? (
                                                        <a
                                                            href={book.digitalFileUrl}
                                                            download
                                                            className="flex-1 px-12 py-6 bg-brand-dark text-white font-black uppercase tracking-widest text-sm rounded-2xl hover:bg-brand-primary transition-all shadow-2xl shadow-brand-dark/20 flex items-center justify-center gap-4 group"
                                                        >
                                                            <Download className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                                            Baixar Obra Digital
                                                        </a>
                                                    ) : (
                                                        <button
                                                            onClick={() => onAddToCart(book)}
                                                            className="flex-1 px-12 py-6 bg-brand-dark text-white font-black uppercase tracking-widest text-sm rounded-2xl hover:bg-brand-primary transition-all shadow-2xl shadow-brand-dark/20 flex items-center justify-center gap-4 group"
                                                        >
                                                            <ShoppingCart className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
                                                            Adquirir E-Book
                                                        </button>
                                                    )}

                                                    {/* Allow adding free books to cart even if downloadable, so they can "own" it in dashboard */}
                                                    {book.price === 0 && !cart.some(item => item.id === book.id) && (
                                                        <button
                                                            onClick={() => onAddToCart(book)}
                                                            className="p-6 border-2 border-brand-primary/20 text-brand-primary rounded-2xl hover:bg-brand-primary hover:text-white transition-all flex items-center justify-center gap-2 group"
                                                            title="Adicionar à Minha Biblioteca"
                                                        >
                                                            <ShoppingCart className="w-6 h-6" />
                                                            <span className="text-[10px] font-black uppercase tracking-widest">Adicionar ao Carrinho</span>
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => onAddToCart(book)}
                                                className="px-12 py-6 bg-brand-dark text-white font-black uppercase tracking-widest text-sm rounded-2xl hover:bg-brand-primary transition-all shadow-2xl shadow-brand-dark/20 flex items-center justify-center gap-4 group"
                                            >
                                                <ShoppingCart className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
                                                {book.price === 0 ? 'Adicionar Grátis ao Carrinho' : 'Adicionar ao Carrinho'}
                                            </button>
                                        )}

                                        <div className="flex gap-4">
                                            <button
                                                onClick={handleToggleFavorite}
                                                className={`p-6 border-2 rounded-2xl transition-all ${isFavorite ? 'bg-red-50 border-red-200 text-red-500' : 'border-gray-100 hover:border-brand-primary text-gray-400'}`}
                                                title={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                                                aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                                            >
                                                <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
                                            </button>
                                            <button
                                                className="p-6 border-2 border-gray-100 rounded-2xl hover:border-brand-primary text-gray-400 transition-all"
                                                title="Partilhar Obra"
                                                aria-label="Partilhar Obra"
                                            >
                                                <Share2 className="w-6 h-6" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-4 sm:gap-8 pt-6 sm:pt-8 opacity-60">
                                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                                            <Shield className="w-4 h-4 text-brand-primary" />
                                            <span>Seguro e Verificado</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                                            <Globe className="w-4 h-4 text-brand-primary" />
                                            <span>Presença Internacional</span>
                                        </div>
                                    </div>
                                </m.div>

                            </div>
                        </div>
                    </section>

                    {/* 2. SPECIFICATIONS & DESCRIPTION */}
                    <section className="bg-gray-50 py-12 sm:py-20 md:py-32">
                        <div className="container mx-auto px-4 sm:px-6 md:px-12">
                            <div className="grid lg:grid-cols-12 gap-8 sm:gap-16">

                                {/* Sidebar: Details */}
                                <div className="lg:col-span-4 space-y-12">
                                    <div className="space-y-8">
                                        <h3 className="text-xs font-black uppercase tracking-[0.4em] text-brand-primary">Ficha Médica da Obra</h3>
                                        <div className="grid gap-6">
                                            {[
                                                { label: 'Formato Principal', value: book.format === 'digital' ? 'E-Book (Digital)' : 'Papel (Físico)', icon: BookOpen },
                                                { label: 'Total de Páginas', value: `${book.pages || 'N/A'} fls`, icon: Clock },
                                                { label: 'Identificação ISBN', value: book.isbn || 'Em tramitação', icon: Shield },
                                                { label: 'Local de Registo', value: 'Malanje, Angola', icon: Globe }
                                            ].map((item, i) => (
                                                <div key={i} className="flex items-center gap-6 p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
                                                    <div className="w-12 h-12 bg-gray-50 rounded-[1.2rem] flex items-center justify-center text-brand-primary">
                                                        <item.icon className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{item.label}</p>
                                                        <p className="text-brand-dark font-black text-sm">{item.value}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Author Card - Minimalist */}
                                    <div className="bg-brand-dark rounded-[2.5rem] p-10 text-white relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/10 blur-[60px] rounded-full"></div>
                                        <div className="relative z-10 space-y-6">
                                            <div className="w-20 h-20 bg-gray-800 rounded-3xl overflow-hidden border-2 border-white/10">
                                                <img
                                                    src={authorProfile?.avatarUrl || `https://ui-avatars.com/api/?name=${book.author}&background=C4A052&color=fff`}
                                                    alt={book.author}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <h4 className="text-xl font-black uppercase tracking-tight">{book.author}</h4>
                                                <p className="text-brand-primary text-[10px] font-black uppercase tracking-widest mt-1">Autor de Prestígio</p>
                                            </div>
                                            <p className="text-xs text-gray-400 font-medium leading-relaxed italic opacity-80 line-clamp-4">
                                                {authorProfile?.bio || "Uma das vozes emergentes na curadoria literária da Editora Graça, focada em expandir os limites da narrativa contemporânea."}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Main Stream: Synopsis & Reviews */}
                                <div className="lg:col-span-8">
                                    {/* Tabs Header */}
                                    <div className="flex gap-4 sm:gap-10 border-b border-gray-200 mb-8 sm:mb-12 overflow-x-auto">
                                        {['sinopse', 'ficha', 'avaliacoes'].map((tab) => (
                                            <button
                                                key={tab}
                                                onClick={() => setActiveTab(tab as any)}
                                                className={`pb-4 sm:pb-6 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] transition-all relative shrink-0 min-touch ${activeTab === tab ? 'text-brand-dark' : 'text-gray-400 hover:text-gray-600'}`}
                                            >
                                                {tab === 'ficha' ? 'Ficha Técnica' : tab}
                                                {activeTab === tab && (
                                                    <m.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-brand-primary rounded-full"></m.div>
                                                )}
                                            </button>
                                        ))}
                                    </div>

                                    <AnimatePresence mode="wait">
                                        {activeTab === 'sinopse' ? (
                                            <m.div
                                                key="sinopse"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -20 }}
                                                className="space-y-8"
                                            >
                                                <div className="flex items-center gap-4 text-brand-primary">
                                                    <MessageSquare className="w-6 h-6" />
                                                    <h3 className="text-2xl font-black uppercase">O Coração da Narrativa</h3>
                                                </div>
                                                <div className="text-reading text-xl md:text-2xl leading-relaxed text-gray-600 space-y-6">
                                                    {book.description ? (
                                                        book.description.split('\n').map((p, i) => <p key={i}>{p}</p>)
                                                    ) : (
                                                        <p className="italic text-gray-400">Esta obra aguarda uma sinopse oficial. Entretanto, a sua essência promete desafiar convenções e enriquecer o espírito literário.</p>
                                                    )}
                                                </div>
                                            </m.div>
                                        ) : activeTab === 'ficha' ? (
                                            <m.div
                                                key="ficha"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -20 }}
                                                className="space-y-12"
                                            >
                                                <div className="flex items-center gap-4 text-brand-primary">
                                                    <BookOpen className="w-6 h-6" />
                                                    <h3 className="text-2xl font-black uppercase">Ficha Técnica da Produção</h3>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                                                    {[
                                                        { label: 'Editor Responsável', value: book.editor },
                                                        { label: 'Diagramação', value: book.diagramador },
                                                        { label: 'Paginação', value: book.paginador },
                                                        { label: 'Arte da Capa', value: book.capa },
                                                        { label: 'Revisão Linguística', value: book.revisor },
                                                        { label: 'Projeto Gráfico', value: book.projetoGrafico },
                                                        { label: 'Unidade de Impressão', value: book.impressao },
                                                        { label: 'ISBN', value: book.isbn },
                                                        { label: 'Depósito Legal', value: book.depositoLegal },
                                                    ].map((item, i) => item.value && (
                                                        <div key={i} className="flex flex-col gap-1 border-b border-gray-100 pb-4">
                                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{item.label}</span>
                                                            <span className="text-brand-dark font-bold text-lg">{item.value}</span>
                                                        </div>
                                                    ))}

                                                    {/* Static/Extra info if needed */}
                                                    <div className="flex flex-col gap-1 border-b border-gray-100 pb-4">
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Ano de Edição</span>
                                                        <span className="text-brand-dark font-bold text-lg">{book.launchDate ? new Date(book.launchDate).getFullYear() : '2024'}</span>
                                                    </div>
                                                    <div className="flex flex-col gap-1 border-b border-gray-100 pb-4">
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Selo Editorial</span>
                                                        <span className="text-brand-dark font-bold text-lg uppercase tracking-tight">Editora Graça</span>
                                                    </div>
                                                </div>
                                            </m.div>
                                        ) : (
                                            <m.div
                                                key="avaliacoes"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -20 }}
                                                className="space-y-12"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4 text-brand-primary">
                                                        <Award className="w-6 h-6" />
                                                        <h3 className="text-2xl font-black uppercase">Crítica & Opinião</h3>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-4xl font-black text-brand-dark">{stats.rating || '0.0'}</span>
                                                        <div className="flex text-amber-500">
                                                            {[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i < Math.floor(stats.rating || 0) ? 'fill-current' : ''}`} />)}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Add Review */}
                                                {user && (
                                                    <div className="bg-white p-8 rounded-[2rem] border-2 border-brand-primary/5 shadow-xl shadow-brand-dark/5">
                                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6">Deixe a sua Marca</h4>
                                                        <div className="flex items-center gap-4 mb-6">
                                                            <p className="text-sm font-bold text-brand-dark">Sua Nota:</p>
                                                            <div className="flex gap-2">
                                                                {[1, 2, 3, 4, 5].map((s) => (
                                                                    <button
                                                                        key={s}
                                                                        onClick={() => setReviewRating(s)}
                                                                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${reviewRating >= s ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
                                                                        title={`Avaliar com ${s} estrelas`}
                                                                        aria-label={`Avaliar com ${s} estrelas`}
                                                                    >
                                                                        <Star className={`w-4 h-4 ${reviewRating >= s ? 'fill-current' : ''}`} />
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <textarea
                                                            value={reviewContent}
                                                            onChange={(e) => setReviewContent(e.target.value)}
                                                            placeholder="A sua análise intelectual sobre esta obra..."
                                                            className="w-full bg-gray-50 border-0 rounded-2xl p-6 text-sm font-medium focus:ring-2 focus:ring-brand-primary/50 transition-all resize-none min-h-[120px]"
                                                        />
                                                        <div className="flex justify-end mt-6">
                                                            <button
                                                                onClick={handleAddReview}
                                                                disabled={isSubmittingReview || !reviewContent.trim()}
                                                                className="px-10 py-4 bg-brand-dark text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-brand-primary transition-all shadow-xl shadow-brand-dark/10 disabled:opacity-50"
                                                            >
                                                                {isSubmittingReview ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sematizar Opinião'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Reviews List */}
                                                <div className="space-y-6">
                                                    {reviews.length > 0 ? reviews.map((rev) => (
                                                        <div key={rev.id} className="p-8 bg-white rounded-3xl border border-gray-100 hover:shadow-xl transition-all duration-500">
                                                            <div className="flex justify-between items-start mb-4">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-brand-dark font-black text-xs uppercase">
                                                                        {rev.userName.charAt(0)}
                                                                    </div>
                                                                    <div>
                                                                        <p className="font-black text-brand-dark text-sm uppercase tracking-tight">{rev.userName}</p>
                                                                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{new Date(rev.date).toLocaleDateString()}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="flex text-amber-500 bg-amber-500/5 px-2 py-1 rounded-lg">
                                                                    {[...Array(5)].map((_, i) => <Star key={i} className={`w-3 h-3 ${i < rev.rating ? 'fill-current' : ''}`} />)}
                                                                </div>
                                                            </div>
                                                            <p className="text-gray-500 font-medium leading-relaxed italic border-l-2 border-brand-primary/20 pl-4">
                                                                "{rev.comment}"
                                                            </p>
                                                        </div>
                                                    )) : (
                                                        <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-gray-200">
                                                            <Award className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                                                            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Ainda não há críticas para esta obra.</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </m.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>
                    </section>
                </>
            )}
        </div>
    );
};

export default BookPage;
