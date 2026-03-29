import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    ArrowLeft, ShoppingCart, Heart, Download, Star,
    BookOpen, Clock, Shield, Globe, Loader2, Calendar,
    Share2, Eye, Sparkles
} from 'lucide-react';
import { Book, User as UserType } from '../types';
import {
    getBookBySlug,
    getBookReviews,
    getBookStats,
    incrementBookView,
    incrementBookDownload,
    checkIsFavorite,
    toggleFavorite,
    checkDownloadAccess,
    isReleased
} from '../services/dataService';
import { useToast } from '../components/Toast';
import SEO from '../components/SEO';
import CountdownTimer from '../components/CountdownTimer';
import AdUnit from '../components/AdUnit';

interface BookPageProps {
    user?: UserType | null;
    cart: any[];
    onAddToCart: (book: Book) => void;
}

const BookPage: React.FC<BookPageProps> = ({ user, cart, onAddToCart }) => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const { showToast } = useToast();

    const [book, setBook] = useState<Book | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [stats, setStats] = useState({ views: 0, rating: 0, sales: 0, reviewsCount: 0, downloads: 0 });
    const [reviews, setReviews] = useState<any[]>([]);
    const [isFavorite, setIsFavorite] = useState(false);
    const [hasAccess, setHasAccess] = useState(false);
    const [activeTab, setActiveTab] = useState<'sinopse' | 'ficha' | 'avaliacoes'>('sinopse');

    useEffect(() => {
        if (!slug) { navigate('/livros'); return; }

        let cancelled = false;
        setLoading(true);
        setError(null);

        const load = async () => {
            try {
                const fetchedBook = await getBookBySlug(slug);
                if (cancelled) return;
                if (!fetchedBook) {
                    setError('Livro não encontrado.');
                    navigate('/livros');
                    return;
                }
                setBook(fetchedBook);
                const bookId = fetchedBook.id;

                // Load secondary data without blocking
                const promises: Promise<any>[] = [
                    getBookStats(bookId).catch(() => ({ views: 0, rating: 0, sales: 0, reviewsCount: 0, downloads: 0 })),
                    getBookReviews(bookId).catch(() => []),
                    user ? checkIsFavorite(bookId, user.id).catch(() => false) : Promise.resolve(false),
                    checkDownloadAccess(bookId, user?.id, fetchedBook.price || 0).catch(() => false),
                ];

                const [bookStats, bookReviews, favStatus, downloadAccess] = await Promise.all(promises);
                if (cancelled) return;

                // Merge stats from book object (which has the incremented counters)
                const mergedStats = {
                    ...bookStats,
                    views: Math.max(bookStats.views, fetchedBook.stats?.views || 0),
                    downloads: Math.max(bookStats.downloads || 0, fetchedBook.stats?.downloads || 0),
                    rating: bookStats.rating || fetchedBook.stats?.averageRating || 5,
                    reviewsCount: bookStats.reviewsCount || fetchedBook.stats?.totalReviews || 0
                };

                setStats(mergedStats);
                setReviews(bookReviews);
                setIsFavorite(favStatus);
                setHasAccess(downloadAccess);

                // Track view silently
                incrementBookView(bookId).catch(() => { });
            } catch (err) {
                console.error('BookPage load error:', err);
                if (!cancelled) setError('Erro ao carregar livro. Tente novamente.');
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        load();
        return () => { cancelled = true; };
    }, [slug, user, navigate]);

    const handleToggleFavorite = async () => {
        if (!user) { showToast('Inicie sessão para guardar favoritos.', 'info'); return; }
        if (!book) return;
        const newVal = await toggleFavorite(book.id, user.id);
        setIsFavorite(newVal);
        showToast(newVal ? 'Adicionado aos favoritos ❤️' : 'Removido dos favoritos', 'success');
    };

    // ─── Loading ─────────────────────────────────────────────
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 text-brand-primary animate-spin" />
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">A carregar obra...</p>
                </div>
            </div>
        );
    }

    // ─── Error ────────────────────────────────────────────────
    if (error || !book) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-6 px-4">
                <BookOpen className="w-16 h-16 text-gray-200" />
                <h2 className="text-2xl font-black text-brand-dark uppercase">{error || 'Obra não encontrada'}</h2>
                <Link to="/livros" className="px-8 py-4 bg-brand-dark text-white font-bold rounded-xl hover:bg-brand-primary transition-all">
                    Voltar ao Catálogo
                </Link>
            </div>
        );
    }

    const isUpcoming = !isReleased(book.launchDate, Date.now());
    const inCart = cart.some(item => item.id === book.id);

    // ─── UPCOMING BOOK ────────────────────────────────────────
    if (isUpcoming) {
        return (
            <div className="min-h-screen bg-[#0A0A0B] text-white">
                <SEO title={book.title} description={book.description || `${book.title} — Em breve na Editora Graça`} image={book.coverUrl} />

                {/* Back */}
                <div className="container pt-8 pb-0 px-4 sm:px-6 md:px-12">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white/40 hover:text-brand-primary transition-colors text-xs font-bold uppercase tracking-widest group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Voltar
                    </button>
                </div>

                <div className="container px-4 sm:px-6 md:px-12 py-16 sm:py-24 flex flex-col items-center text-center gap-12 max-w-3xl mx-auto">
                    {/* Badge */}
                    <span className="px-6 py-2 bg-brand-primary/20 text-brand-primary font-black text-xs uppercase tracking-[0.4em] rounded-full border border-brand-primary/30 flex items-center gap-2">
                        <Sparkles className="w-4 h-4" /> Em Breve
                    </span>

                    {/* Cover */}
                    <div className="relative w-56 sm:w-72 aspect-[2/3] rounded-[2.5rem] overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)] border border-white/5">
                        <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>

                    {/* Title */}
                    <div className="space-y-4">
                        <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter leading-none">{book.title}</h1>
                        <p className="text-xl text-gray-400 font-light italic">
                            Por {book.authors && book.authors.length > 0 ? (
                                book.authors.map((auth, idx) => (
                                    <React.Fragment key={auth.id || idx}>
                                        {auth.id ? (
                                            <Link to={`/equipa/${auth.id}`} className="text-white font-black not-italic hover:text-brand-primary transition-colors">
                                                {auth.name}
                                            </Link>
                                        ) : (
                                            <span className="text-white font-black not-italic">{auth.name}</span>
                                        )}
                                        {idx < (book.authors?.length || 0) - 1 ? (idx === (book.authors?.length || 0) - 2 ? ' e ' : ', ') : ''}
                                    </React.Fragment>
                                ))
                            ) : (
                                <span className="text-white font-black not-italic">{book.author}</span>
                            )}
                        </p>
                    </div>

                    {/* Countdown */}
                    {book.launchDate && (
                        <div className="space-y-4 w-full">
                            <p className="text-brand-primary font-black text-xs uppercase tracking-[0.5em] flex items-center justify-center gap-2">
                                <Calendar className="w-4 h-4" /> Contagem Regressiva
                            </p>
                            <CountdownTimer targetDate={book.launchDate} className="justify-center" />
                        </div>
                    )}

                    {/* Description */}
                    {book.description && (
                        <p className="text-gray-400 text-lg leading-relaxed italic max-w-xl border-t border-white/10 pt-8">
                            "{book.description.substring(0, 300)}{book.description.length > 300 ? '...' : ''}"
                        </p>
                    )}

                    <Link to="/livros" className="flex items-center gap-2 text-brand-primary font-black text-xs uppercase tracking-widest hover:text-white transition-colors group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Explorar Catálogo
                    </Link>
                </div>
            </div>
        );
    }

    // ─── RELEASED BOOK ────────────────────────────────────────
    return (
        <div className="min-h-screen bg-white font-sans text-brand-dark">
            <SEO title={book.title} description={book.description || `${book.title} de ${book.author}`} image={book.coverUrl} type="book" />

            {/* Hero */}
            <section className="bg-brand-dark text-white pt-20 pb-16 sm:pb-24 relative overflow-hidden">
                <div className="absolute inset-0 opacity-5 pointer-events-none">
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-primary blur-[120px]" />
                </div>
                <div className="container mx-auto px-4 sm:px-6 md:px-12 relative z-10">
                    {/* Back */}
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white/40 hover:text-brand-primary transition-colors text-xs font-bold uppercase tracking-widest mb-12 group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Voltar
                    </button>

                    <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-start">
                        {/* Cover */}
                        <div className="lg:col-span-4 flex justify-center lg:justify-start">
                            <div className="relative w-52 sm:w-64 lg:w-full max-w-xs aspect-[2/3] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-white/10 group">
                                <img
                                    src={book.coverUrl}
                                    alt={book.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                {/* Format badge */}
                                <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-black/60 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest rounded-full border border-white/10">
                                    {book.format === 'digital' ? 'E-Book' : 'Físico'}
                                </div>
                            </div>
                        </div>

                        {/* Info */}
                        <div className="lg:col-span-8 space-y-8">
                            {/* Genre + Bestseller + Category */}
                            <div className="flex flex-wrap items-center gap-3">
                                {book.category && book.category !== 'livro' && (
                                    <span className="px-4 py-1.5 bg-brand-primary/20 text-brand-primary font-black text-[10px] uppercase tracking-[0.4em] rounded-full border border-brand-primary/30 flex items-center gap-2">
                                        <Sparkles className="w-3 h-3" /> {book.category}
                                    </span>
                                )}
                                {book.genre && (
                                    <span className="px-4 py-1.5 bg-brand-primary/15 text-brand-primary font-black text-[10px] uppercase tracking-[0.2em] rounded-full border border-brand-primary/20">
                                        {book.genre}
                                    </span>
                                )}
                                {book.isBestseller && (
                                    <span className="px-4 py-1.5 bg-amber-500/15 text-amber-400 font-black text-[10px] uppercase tracking-[1em] rounded-full border border-amber-500/20">
                                        Bestseller
                                    </span>
                                )}
                            </div>

                            {/* Title */}
                            <div>
                                <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black uppercase leading-none tracking-tighter">
                                    {book.title}
                                </h1>
                                <p className="mt-4 text-xl sm:text-2xl text-gray-400 italic font-light">
                                    Por {book.authors && book.authors.length > 0 ? (
                                        book.authors.map((auth, idx) => (
                                            <React.Fragment key={auth.id || idx}>
                                                {auth.id ? (
                                                    <Link to={`/equipa/${auth.id}`} className="text-white font-black not-italic hover:text-brand-primary transition-colors underline decoration-brand-primary/30 underline-offset-4">
                                                        {auth.name}
                                                    </Link>
                                                ) : (
                                                    <span className="text-white font-black not-italic">{auth.name}</span>
                                                )}
                                                {idx < (book.authors?.length || 0) - 1 ? (idx === (book.authors?.length || 0) - 2 ? ' e ' : ', ') : ''}
                                            </React.Fragment>
                                        ))
                                    ) : (
                                        <span className="text-white font-black not-italic">{book.author}</span>
                                    )}
                                </p>
                            </div>

                            {/* Stats row */}
                            <div className="flex flex-wrap items-center gap-6 py-6 border-y border-white/10">
                                <div>
                                    <p className="text-3xl font-black text-white">
                                        {book.price === 0 ? 'Gratuito' : `${(book.price || 0).toLocaleString()} Kz`}
                                    </p>
                                    {book.price > 0 && <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">AOA</p>}
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
                                    <Eye className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm font-black">{stats.views}</span>
                                    <span className="text-[10px] text-gray-400 uppercase tracking-widest">vistas</span>
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
                                    <Download className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm font-black">{stats.downloads || 0}</span>
                                    <span className="text-[10px] text-gray-400 uppercase tracking-widest">baixados</span>
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
                                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                                    <span className="text-sm font-black">{stats.rating || '—'}</span>
                                    <span className="text-[10px] text-gray-400 uppercase tracking-widest">avaliação</span>
                                </div>
                            </div>

                            {/* CTAs */}
                            <div className="flex flex-wrap gap-4 items-center">
                                {book.format === 'digital' && book.digitalFileUrl && hasAccess ? (
                                    <a
                                        href={book.digitalFileUrl}
                                        download
                                        onClick={() => incrementBookDownload(book.id)}
                                        className="flex items-center gap-3 px-10 py-5 bg-brand-primary text-white font-black uppercase tracking-widest text-sm rounded-2xl hover:bg-white hover:text-brand-dark transition-all shadow-2xl"
                                    >
                                        <Download className="w-5 h-5" /> Baixar Obra
                                    </a>
                                ) : (
                                    <button
                                        onClick={() => { onAddToCart(book); showToast(`"${book.title}" adicionado!`, 'success'); }}
                                        disabled={inCart}
                                        className="flex items-center gap-3 px-10 py-5 bg-white text-brand-dark font-black uppercase tracking-widest text-sm rounded-2xl hover:bg-brand-primary hover:text-white transition-all shadow-2xl disabled:opacity-60"
                                    >
                                        <ShoppingCart className="w-5 h-5" />
                                        {inCart ? 'No Carrinho' : book.price === 0 ? 'Adicionar Grátis' : 'Adicionar ao Carrinho'}
                                    </button>
                                )}

                                <button
                                    onClick={handleToggleFavorite}
                                    className={`p-5 rounded-2xl border-2 transition-all ${isFavorite ? 'bg-red-500/20 border-red-500/40 text-red-400' : 'border-white/10 text-white/40 hover:border-brand-primary hover:text-brand-primary'}`}
                                    title={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                                >
                                    <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                                </button>

                                <button
                                    onClick={() => navigator.share?.({ title: book.title, url: window.location.href })}
                                    className="p-5 rounded-2xl border-2 border-white/10 text-white/40 hover:border-brand-primary hover:text-brand-primary transition-all"
                                    title="Partilhar"
                                >
                                    <Share2 className="w-5 h-5" />
                                </button>
                            </div>

                            {/* AdSense Book Detail Mid */}
                            <div className="pt-12">
                                <AdUnit slot="SLOT_BOOK_DETAIL" format="auto" className="max-w-2xl" />
                            </div>

                            {/* Trust badges */}
                            <div className="flex flex-wrap gap-6 text-xs text-white/30 font-bold uppercase tracking-widest">
                                <span className="flex items-center gap-2"><Shield className="w-4 h-4" /> Seguro</span>
                                <span className="flex items-center gap-2"><Globe className="w-4 h-4" /> Editora Graça</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Tabs */}
            <section className="bg-gray-50 py-16 sm:py-24">
                <div className="container mx-auto px-4 sm:px-6 md:px-12">
                    <div className="grid lg:grid-cols-12 gap-12">
                        {/* Sidebar */}
                        <aside className="lg:col-span-4 space-y-8">
                            {/* Ficha técnica */}
                            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
                                <h3 className="text-xs font-black uppercase tracking-[0.4em] text-brand-primary">Ficha da Obra</h3>
                                <ul className="space-y-4">
                                    {[
                                        { icon: BookOpen, label: 'Formato', value: book.format === 'digital' ? 'E-Book Digital' : 'Livro Físico' },
                                        { icon: Clock, label: 'Páginas', value: book.pages ? `${book.pages} págs.` : 'N/A' },
                                        { icon: Shield, label: 'ISBN', value: book.isbn || 'Em tramitação' },
                                        { icon: Globe, label: 'Editora', value: 'Editora Graça' },
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-brand-primary shrink-0">
                                                <item.icon className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{item.label}</p>
                                                <p className="text-sm font-bold text-brand-dark">{item.value}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Author(s) card */}
                            <div className="bg-brand-dark text-white rounded-3xl p-8 space-y-6">
                                {book.authors && book.authors.length > 0 ? (
                                    book.authors.map((auth, idx) => (
                                        <div key={auth.id || idx} className={`flex items-center gap-4 ${idx > 0 ? 'pt-6 border-t border-white/5' : ''}`}>
                                            <div className="w-12 h-12 bg-gray-700 rounded-xl overflow-hidden shrink-0">
                                                <img
                                                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(auth.name)}&background=C4A052&color=fff`}
                                                    alt={auth.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="min-w-0">
                                                {auth.id ? (
                                                    <Link to={`/equipa/${auth.id}`} className="font-black uppercase tracking-tight hover:text-brand-primary transition-colors block truncate">
                                                        {auth.name}
                                                    </Link>
                                                ) : (
                                                    <h4 className="font-black uppercase tracking-tight truncate">{auth.name}</h4>
                                                )}
                                                <p className="text-brand-primary text-[9px] font-black uppercase tracking-widest mt-0.5">
                                                    {book.category === 'antologia' ? 'Colaborador' : 'Autor da Obra'}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gray-700 rounded-xl overflow-hidden shrink-0">
                                            <img
                                                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(book.author)}&background=C4A052&color=fff`}
                                                alt={book.author}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div>
                                            <h4 className="font-black uppercase tracking-tight">{book.author}</h4>
                                            <p className="text-brand-primary text-[9px] font-black uppercase tracking-widest mt-0.5">Autor da Obra</p>
                                        </div>
                                    </div>
                                )}
                                <p className="text-xs text-gray-400 leading-relaxed italic pt-2">
                                    {book.category === 'antologia' ? 'Esta obra reúne talentos diversos no acervo da Editora Graça.' : 'Obra de referência no acervo da Editora Graça.'}
                                </p>
                            </div>
                        </aside>

                        {/* Main content */}
                        <div className="lg:col-span-8">
                            {/* Tabs */}
                            <div className="flex gap-8 border-b border-gray-200 mb-10">
                                {(['sinopse', 'ficha', 'avaliacoes'] as const).map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`pb-4 text-xs font-black uppercase tracking-[0.2em] transition-all relative ${activeTab === tab ? 'text-brand-dark' : 'text-gray-400 hover:text-gray-600'}`}
                                    >
                                        {tab === 'ficha' ? 'Ficha Técnica' : tab === 'avaliacoes' ? 'Avaliações' : 'Sinopse'}
                                        {activeTab === tab && (
                                            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary rounded-full" />
                                        )}
                                    </button>
                                ))}
                            </div>

                            {/* Sinopse */}
                            {activeTab === 'sinopse' && (
                                <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed">
                                    {book.description
                                        ? book.description.split('\n').map((p, i) => <p key={i}>{p}</p>)
                                        : <p className="italic text-gray-400">Sinopse ainda não disponível.</p>
                                    }
                                </div>
                            )}

                            {/* Ficha técnica */}
                            {activeTab === 'ficha' && (
                                <div className="grid sm:grid-cols-2 gap-6">
                                    {[
                                        { label: 'Editor', value: (book as any).editor },
                                        { label: 'Diagramação', value: (book as any).diagramador },
                                        { label: 'Arte da Capa', value: (book as any).capa },
                                        { label: 'Revisão', value: (book as any).revisor },
                                        { label: 'ISBN', value: book.isbn },
                                        { label: 'Depósito Legal', value: (book as any).depositoLegal },
                                        { label: 'Ano de Edição', value: book.launchDate ? new Date(book.launchDate).getFullYear().toString() : '—' },
                                        { label: 'Selo Editorial', value: 'Editora Graça' },
                                    ].filter(i => i.value).map((item, i) => (
                                        <div key={i} className="flex flex-col gap-1 border-b border-gray-100 pb-4">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{item.label}</span>
                                            <span className="font-bold text-brand-dark">{item.value}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Avaliações */}
                            {activeTab === 'avaliacoes' && (
                                <div className="space-y-6">
                                    {stats.reviewsCount > 0 && (
                                        <div className="flex items-center gap-4 mb-8">
                                            <span className="text-5xl font-black text-brand-dark">{stats.rating}</span>
                                            <div>
                                                <div className="flex gap-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} className={`w-5 h-5 ${i < Math.floor(stats.rating) ? 'text-amber-500 fill-amber-500' : 'text-gray-200'}`} />
                                                    ))}
                                                </div>
                                                <p className="text-sm text-gray-400 mt-1">{stats.reviewsCount} avaliações</p>
                                            </div>
                                        </div>
                                    )}
                                    {reviews.length > 0 ? reviews.map((rev: any) => (
                                        <div key={rev.id} className="bg-white p-8 rounded-3xl border border-gray-100">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center font-black text-xs text-brand-dark">
                                                        {rev.userName?.charAt(0) || '?'}
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-brand-dark text-sm">{rev.userName}</p>
                                                        <p className="text-[10px] text-gray-400">{new Date(rev.date).toLocaleDateString('pt-PT')}</p>
                                                    </div>
                                                </div>
                                                <div className="flex">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} className={`w-3 h-3 ${i < rev.rating ? 'text-amber-500 fill-amber-500' : 'text-gray-200'}`} />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-gray-500 italic border-l-2 border-brand-primary/20 pl-4">"{rev.comment}"</p>
                                        </div>
                                    )) : (
                                        <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-3xl">
                                            <Star className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                                            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Ainda sem avaliações</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default BookPage;
