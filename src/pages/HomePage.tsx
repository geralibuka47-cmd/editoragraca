import React, { useEffect, useState } from 'react';
import { Sparkles, BookOpen, ArrowRight, Zap, Star, Trophy, Mail, Clock, Mic, PenTool } from 'lucide-react';
import { Book, ViewState, PodcastEpisode, BlogPost } from '../types';
import BookCard from '../components/BookCard';
import Countdown from '../components/Countdown';
import { getPublicStats, getCategories, getBlogPosts } from '../services/dataService';
import { fetchPodcastEpisodes } from '../services/podcastService';

interface HomePageProps {
    books: Book[];
    loading: boolean;
    onNavigate: (view: ViewState) => void;
    onViewDetails: (book: Book) => void;
    onAddToCart: (book: Book) => void;
    onToggleWishlist: (book: Book) => void;
}

const HomePage: React.FC<HomePageProps> = ({ books, loading, onNavigate, onViewDetails, onAddToCart, onToggleWishlist }) => {
    const [stats, setStats] = useState({ booksCount: 0, authorsCount: 0, readersCount: 0 });
    const [categories, setCategories] = useState<{ name: string; count: number; image?: string }[]>([]);
    const [latestEpisode, setLatestEpisode] = useState<PodcastEpisode | null>(null);
    const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);

    useEffect(() => {
        const loadDynamicData = async () => {
            const s = await getPublicStats();
            const c = await getCategories();
            const p = await fetchPodcastEpisodes();
            const b = await getBlogPosts();

            setStats(s);
            setCategories(c);
            if (p.length > 0) setLatestEpisode(p[0]);
            setRecentPosts(b.slice(0, 3));
        };
        loadDynamicData();
    }, [books]); // Reload if books change

    // Encontrar o próximo lançamento
    const upcomingLaunch = books
        .filter(b => b.launchDate && new Date(b.launchDate) > new Date())
        .sort((a, b) => new Date(a.launchDate!).getTime() - new Date(b.launchDate!).getTime())[0];

    // Se não houver lançamento, pegar o mais recente
    const featuredBook = upcomingLaunch || books.find(b => b.isNew) || books[0];

    return (
        <>
            {/* Hero Section */}
            <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-white">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-primary/5 -skew-x-12 transform origin-top translate-x-20"></div>

                <div className="container mx-auto px-4 md:px-8 grid lg:grid-cols-2 items-center gap-10 md:gap-20 py-10 md:py-20 relative z-10">
                    <div className="space-y-6 md:space-y-10 animate-fade-in text-center lg:text-left">
                        <div className="inline-flex items-center gap-3 px-4 py-2 bg-brand-primary/10 rounded-full text-brand-primary font-bold tracking-[0.2em] uppercase text-[9px] md:text-[10px]">
                            {upcomingLaunch ? <Clock className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                            <span>{upcomingLaunch ? 'Próximo Grande Lançamento' : 'Edições de Colecionador agora disponíveis'}</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-black leading-[0.95] text-brand-dark tracking-tighter">
                            {upcomingLaunch ? (
                                <>
                                    {upcomingLaunch.title} <br />
                                    <span className="text-brand-primary italic font-serif font-normal text-[0.6em] block mt-4">de {upcomingLaunch.author}</span>
                                </>
                            ) : (
                                <>
                                    Onde Cada Página <br />
                                    <span className="text-brand-primary italic font-serif font-normal text-[0.9em]">Ganha Vida</span>
                                </>
                            )}
                        </h1>

                        <p className="text-lg md:text-xl text-gray-500 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                            {upcomingLaunch
                                ? upcomingLaunch.description.slice(0, 150) + '...'
                                : "Descubra o catálogo da Editora Graça. Uma seleção rigorosa de literatura angolana e internacional, desenhada para leitores exigentes."
                            }
                        </p>

                        {upcomingLaunch && upcomingLaunch.launchDate && (
                            <div className="py-4 flex justify-center lg:justify-start">
                                <Countdown targetDate={upcomingLaunch.launchDate} />
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 md:gap-6 pt-4">
                            <button
                                className="btn-premium group w-full sm:w-auto justify-center"
                                onClick={() => upcomingLaunch ? onViewDetails(upcomingLaunch) : onNavigate('CATALOG')}
                            >
                                {upcomingLaunch ? 'Pré-Encomendar Agora' : 'Explorar Catálogo'}
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                            {!upcomingLaunch && (
                                <button
                                    onClick={() => onNavigate('ABOUT')}
                                    className="px-10 py-4 border-2 border-brand-dark text-brand-dark font-bold hover:bg-brand-dark hover:text-white transition-all uppercase text-[11px] tracking-[0.2em] w-full sm:w-auto"
                                >
                                    Nossa História
                                </button>
                            )}
                        </div>

                        {!upcomingLaunch && (
                            <div className="flex items-center justify-center lg:justify-start gap-6 md:gap-10 pt-8 border-t border-gray-100">
                                <div className="flex flex-col">
                                    <span className="text-2xl md:text-3xl font-black text-brand-dark">
                                        {stats.booksCount > 0 ? `${stats.booksCount}+` : '...'}
                                    </span>
                                    <span className="text-[9px] md:text-[10px] uppercase tracking-widest text-gray-400 font-bold">Livros Publicados</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-2xl md:text-3xl font-black text-brand-dark">
                                        {stats.readersCount > 0 ? `${stats.readersCount}+` : '100+'}
                                    </span>
                                    <span className="text-[9px] md:text-[10px] uppercase tracking-widest text-gray-400 font-bold">Leitores Felizes</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="relative animate-fade-in delay-200">
                        <div className="relative z-10 w-full aspect-[4/5] bg-brand-light rounded-3xl shadow-2xl overflow-hidden border-8 border-white group cursor-pointer" onClick={() => featuredBook && onViewDetails(featuredBook)}>
                            {featuredBook?.coverUrl ? (
                                <img
                                    src={featuredBook.coverUrl}
                                    alt={featuredBook.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full p-20">
                                    <div className="w-full h-full border-2 border-brand-primary/30 border-dashed rounded-2xl flex items-center justify-center">
                                        <BookOpen className="w-32 h-32 text-brand-primary/20" />
                                    </div>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        </div>

                        <div className="absolute -top-10 -left-10 w-40 h-40 bg-brand-primary/10 rounded-full blur-3xl"></div>
                        <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-brand-dark/5 rounded-full blur-3xl"></div>

                        <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-2xl flex items-center gap-5 border border-gray-50 z-20">
                            <div className="w-16 h-16 bg-brand-primary flex items-center justify-center rounded-xl text-white">
                                {upcomingLaunch ? <Clock className="w-8 h-8" /> : <Zap className="w-8 h-8 fill-current" />}
                            </div>
                            <div>
                                <h5 className="font-serif font-bold text-xl text-brand-dark italic leading-none">{upcomingLaunch ? 'Lançamento' : 'Novidade'}</h5>
                                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold pt-1">
                                    {upcomingLaunch ? 'Brevemente' : 'Acabado de Chegar'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories / Promo Banners Section */}
            <section className="py-12 md:py-24 bg-white">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-black text-brand-dark tracking-tighter mb-4">
                            Explore por <span className="text-brand-primary italic font-serif font-normal">Categorias</span>
                        </h2>
                    </div>

                    {categories.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                            {categories.map((cat, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => onNavigate('CATALOG')}
                                    className="group relative h-64 md:h-80 rounded-[2rem] overflow-hidden bg-brand-dark flex items-end p-8 md:p-10 cursor-pointer shadow-lg hover:shadow-xl transition-all"
                                >
                                    {cat.image && (
                                        <img src={cat.image} alt={cat.name} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700" />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent group-hover:from-brand-primary/80 group-hover:via-brand-primary/30 transition-colors duration-500"></div>
                                    <div className="relative z-10 space-y-2 md:space-y-3">
                                        <div className="text-white font-black text-3xl md:text-4xl leading-none">{cat.name}</div>
                                        <p className="text-white/70 text-xs md:text-sm font-medium">{cat.count} {cat.count === 1 ? 'Livro' : 'Livros'}</p>
                                        <button className="text-white font-bold text-[9px] md:text-[10px] uppercase tracking-widest flex items-center gap-2 group-hover:gap-4 transition-all">
                                            Explorar <ArrowRight className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10">
                            <p className="text-gray-500">Carregando categorias...</p>
                        </div>
                    )}
                </div>
            </section>

            {/* New Arrivals Section */}
            <section className="py-12 md:py-24 bg-brand-light">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-12 md:mb-16 gap-6 text-center md:text-left">
                        <div className="space-y-4">
                            <div className="flex items-center justify-center md:justify-start gap-2 text-brand-primary font-bold tracking-[0.2em] uppercase text-[9px] md:text-[10px]">
                                <div className="w-10 h-0.5 bg-brand-primary"></div>
                                <span>Novidades</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black text-brand-dark tracking-tighter">
                                Acabados de <span className="text-brand-primary italic font-serif font-normal text-[0.9em]">Sair do Forno</span>
                            </h2>
                        </div>
                        <button
                            onClick={() => onNavigate('CATALOG')}
                            className="group flex items-center gap-3 font-bold text-[11px] uppercase tracking-widest text-brand-dark hover:text-brand-primary transition-colors"
                        >
                            Explorar Todos os Lançamentos
                            <span className="w-10 h-10 border border-brand-dark/10 rounded-full flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-all group-hover:border-brand-primary">
                                <ArrowRight className="w-4 h-4" />
                            </span>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                        {books.filter(b => b.isNew || b.isBestseller).slice(0, 4).map(book => (
                            <BookCard
                                key={book.id}
                                book={book}
                                onAddToCart={onAddToCart}
                                onToggleWishlist={onToggleWishlist}
                                onViewDetails={onViewDetails}
                            />
                        ))}
                        {books.length === 0 && !loading && (
                            <div className="col-span-full py-16 md:py-20 text-center bg-white rounded-3xl border border-dashed border-gray-200 px-4">
                                <p className="text-gray-400 font-medium">Nenhum livro disponível no momento.</p>
                            </div>
                        )}
                    </div>
                    {/* Categories / Promo Banners Section */}
                    {/* ... (Existing code) ... */}
                    {/* The previous replace_file_content will handle the categories section content, 
                so I will assume this insertion point is AFTER the categories section closing tag.
                However, to be safe and precise with replace_file_content, I should target the space between Categories and Newsletter.
            */}
                    {/* Note: I'll target the end of the Categories section and start of Newsletter to insert in between. */}

                </div>
            </section>

            {/* Podcast & Blog Preview Section */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Podcast Feature */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 bg-brand-primary/10 rounded-full text-brand-primary">
                                    <Mic className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-black text-brand-dark">Cultura em Áudio</h3>
                            </div>

                            {latestEpisode ? (
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 items-center">
                                    <img src={latestEpisode.imageUrl} alt={latestEpisode.title} className="w-24 h-24 rounded-xl object-cover shadow-md" />
                                    <div className="flex-1 space-y-2 text-center md:text-left">
                                        <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">Último Episódio</span>
                                        <h4 className="font-bold text-brand-dark text-lg line-clamp-2">{latestEpisode.title}</h4>
                                        <button onClick={() => onNavigate('PODCAST')} className="text-sm font-medium text-gray-500 hover:text-brand-primary flex items-center justify-center md:justify-start gap-1 transition-colors">
                                            Ouvir Agora <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center py-10">
                                    <p className="text-gray-400">Carregando podcast...</p>
                                </div>
                            )}

                            {/* Call to Authors */}
                            <div className="bg-brand-dark p-8 rounded-2xl text-white relative overflow-hidden mt-8">
                                <div className="absolute top-0 right-0 p-8 opacity-10">
                                    <PenTool className="w-32 h-32" />
                                </div>
                                <div className="relative z-10 space-y-4">
                                    <h3 className="text-2xl font-black">És um Autor?</h3>
                                    <p className="text-white/80 text-sm max-w-xs">Transforme o seu manuscrito em obra publicada. Conheça os nossos serviços editoriais.</p>
                                    <button onClick={() => onNavigate('SERVICES')} className="px-6 py-3 bg-brand-primary text-white rounded-xl font-bold text-sm hover:scale-105 transition-transform">
                                        Publicar Conosco
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Recent Blog Posts */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 bg-brand-primary/10 rounded-full text-brand-primary">
                                    <BookOpen className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-black text-brand-dark">Do Nosso Blog</h3>
                            </div>

                            <div className="space-y-4">
                                {recentPosts.length > 0 ? (
                                    recentPosts.map(post => (
                                        <div key={post.id} onClick={() => onNavigate('BLOG')} className="group flex gap-4 items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all">
                                            <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
                                                <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-brand-dark line-clamp-2 group-hover:text-brand-primary transition-colors">{post.title}</h4>
                                                <span className="text-xs text-gray-400">{new Date(post.date).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-10">
                                        <p className="text-gray-400">Buscando novidades...</p>
                                    </div>
                                )}
                            </div>
                            <div className="text-right">
                                <button onClick={() => onNavigate('BLOG')} className="text-sm font-bold text-brand-primary hover:text-brand-dark transition-colors inline-flex items-center gap-1">
                                    Ver todos os artigos <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="bg-brand-dark py-24 px-8 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-primary/10 via-transparent to-transparent"></div>

                <div className="container mx-auto relative z-10 text-center">
                    <div className="max-w-2xl mx-auto space-y-8">
                        <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center text-brand-primary mx-auto rotate-12">
                            <Mail className="w-10 h-10" />
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
                                Fique por <span className="text-brand-primary italic font-serif font-normal">Dentro</span>
                            </h2>
                            <p className="text-lg text-gray-400">
                                Subscreva a nossa newsletter e receba novidades literárias, convites para lançamentos e ofertas exclusivas.
                            </p>
                        </div>

                        <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto" onSubmit={(e) => e.preventDefault()}>
                            <input
                                type="email"
                                placeholder="Seu melhor email"
                                className="flex-1 bg-white/10 border border-white/10 rounded-xl px-6 py-4 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                            />
                            <button className="bg-brand-primary text-white font-bold px-8 py-4 rounded-xl hover:bg-brand-primary/90 transition-colors uppercase tracking-widest text-sm">
                                Subscrever
                            </button>
                        </form>

                        <p className="text-xs text-gray-600">
                            Respeitamos a sua privacidade. Cancele a subscrição a qualquer momento.
                        </p>
                    </div>
                </div>
            </section>
        </>
    );
};

export default HomePage;
