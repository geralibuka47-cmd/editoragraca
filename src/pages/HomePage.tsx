import React, { useState, useEffect } from 'react';
import { Sparkles, BookOpen, ArrowRight, Zap, Star, Trophy, Mail, Clock, Mic, PenTool, Users, CheckCircle, Loader2, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Book, ViewState, PodcastEpisode, BlogPost } from '../types';
import BookCard from '../components/BookCard';
import Countdown from '../components/Countdown';
import { getPublicStats, getBlogPosts, getSiteContent, getTestimonials } from '../services/dataService';
import { fetchPodcastEpisodes } from '../services/podcastService';
import { BookCardSkeleton, PostCardSkeleton } from '../components/SkeletonLoader';

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
    const [siteContent, setSiteContent] = useState<any>({});
    const [testimonials, setTestimonials] = useState<any[]>([]);
    const [isFetching, setIsFetching] = useState(true);
    const [newsletterEmail, setNewsletterEmail] = useState('');
    const [isSubscribing, setIsSubscribing] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);

    useEffect(() => {
        const loadDynamicData = async () => {
            // Compute categories from books prop instead of fetching again
            const genreMap = new Map<string, { count: number; image?: string }>();
            books.forEach(book => {
                const gen = book.genre || 'Outros';
                const current = genreMap.get(gen) || { count: 0, image: book.coverUrl };
                genreMap.set(gen, { count: current.count + 1, image: current.image || book.coverUrl });
            });
            const computedCategories = Array.from(genreMap.entries()).map(([name, data]) => ({
                name,
                count: data.count,
                image: data.image
            }));
            setCategories(computedCategories);

            // Fetch other data in parallel
            try {
                const [s, p, b, content, t] = await Promise.all([
                    getPublicStats(),
                    fetchPodcastEpisodes(),
                    getBlogPosts(),
                    getSiteContent('home'),
                    getTestimonials()
                ]);

                setStats(s);
                if (p && p.length > 0) setLatestEpisode(p[0]);
                setRecentPosts(b ? b.slice(0, 3) : []);
                setSiteContent(content || {});
                setTestimonials(t || []);
            } catch (error) {
                console.error("Error loading home page data:", error);
            } finally {
                setIsFetching(false);
            }
        };
        loadDynamicData();
    }, [books]);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    // Encontrar o próximo lançamento
    const upcomingLaunch = books
        .filter(b => b.launchDate && new Date(b.launchDate) > new Date())
        .sort((a, b) => new Date(a.launchDate!).getTime() - new Date(b.launchDate!).getTime())[0];

    // Se não houver lançamento, pegar o mais recente
    const featuredBook = upcomingLaunch || books.find(b => b.isNew) || books[0];

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubscribing(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSubscribing(false);
        setIsSubscribed(true);
        setNewsletterEmail('');
        setTimeout(() => setIsSubscribed(false), 5000);
    };

    return (
        <div className="relative overflow-x-hidden">
            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-white">
                {/* Modern Dynamic Background Elements */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-brand-primary/5 to-transparent pointer-events-none"></div>
                <motion.div
                    initial={{ opacity: 0, rotate: -45 }}
                    animate={{ opacity: 1, rotate: -45 }}
                    transition={{ duration: 2 }}
                    className="absolute -top-40 -right-20 w-[600px] h-[600px] bg-brand-primary/5 rounded-[100px] blur-[100px] pointer-events-none"
                ></motion.div>

                <div className="container mx-auto px-4 md:px-8 grid lg:grid-cols-2 items-center gap-10 md:gap-20 py-10 md:py-20 relative z-10">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                        className="space-y-6 md:space-y-10 text-center lg:text-left"
                    >
                        <motion.div variants={itemVariants} className="inline-flex items-center gap-3 px-5 py-2.5 bg-brand-primary/10 rounded-full text-brand-primary font-bold tracking-[0.2em] uppercase text-[10px]">
                            {upcomingLaunch ? <Clock className="w-4 h-4 animate-pulse" /> : <Sparkles className="w-4 h-4" />}
                            <span>{upcomingLaunch ? 'Próximo Grande Lançamento' : 'Edições de Colecionador agora disponíveis'}</span>
                        </motion.div>

                        <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl lg:text-[6.5rem] font-black leading-[0.9] text-brand-dark tracking-tighter">
                            {upcomingLaunch ? (
                                <>
                                    {upcomingLaunch.title} <br />
                                    <span className="text-brand-primary italic font-serif font-normal text-[0.55em] block mt-4">de {upcomingLaunch.author}</span>
                                </>
                            ) : (
                                <>
                                    {siteContent['hero.title'] || "Onde Cada Página"} <br />
                                    <span className="text-brand-primary italic font-serif font-normal text-[0.85em]">{siteContent['hero.subtitle'] || "Ganha Vida"}</span>
                                </>
                            )}
                        </motion.h1>

                        <motion.p variants={itemVariants} className="text-lg md:text-xl text-gray-500 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                            {upcomingLaunch
                                ? upcomingLaunch.description.slice(0, 180) + '...'
                                : (siteContent['hero.description'] || "Descubra o catálogo da Editora Graça. Uma seleção rigorosa de literatura angolana e internacional, desenhada para leitores exigentes.")
                            }
                        </motion.p>

                        {upcomingLaunch && upcomingLaunch.launchDate && (
                            <motion.div variants={itemVariants} className="py-4 flex justify-center lg:justify-start">
                                <Countdown targetDate={upcomingLaunch.launchDate} />
                            </motion.div>
                        )}

                        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 md:gap-6 pt-4">
                            <button
                                className="btn-premium group w-full sm:w-auto justify-center py-5 px-10 text-sm shadow-2xl shadow-brand-primary/20"
                                onClick={() => upcomingLaunch ? onViewDetails(upcomingLaunch) : onNavigate('CATALOG')}
                            >
                                {upcomingLaunch ? 'Pré-Encomendar Agora' : 'Explorar Catálogo'}
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                            {!upcomingLaunch && (
                                <button
                                    onClick={() => onNavigate('ABOUT')}
                                    className="px-12 py-5 border-2 border-brand-dark text-brand-dark font-black hover:bg-brand-dark hover:text-white transition-all uppercase text-[12px] tracking-[0.2em] w-full sm:w-auto rounded-2xl"
                                >
                                    Nossa História
                                </button>
                            )}
                        </motion.div>

                        {!upcomingLaunch && (
                            <motion.div variants={itemVariants} className="flex items-center justify-center lg:justify-start gap-8 md:gap-12 pt-10 border-t border-gray-100/50">
                                <div className="flex flex-col">
                                    <span className="text-3xl md:text-5xl font-black text-brand-dark tracking-tighter">
                                        {stats.booksCount > 0 ? (
                                            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                                {stats.booksCount}+
                                            </motion.span>
                                        ) : '...'}
                                    </span>
                                    <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-black">Livros Publicados</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-3xl md:text-5xl font-black text-brand-dark tracking-tighter">
                                        {stats.readersCount > 0 ? (
                                            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                                {stats.readersCount}+
                                            </motion.span>
                                        ) : '100+'}
                                    </span>
                                    <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-black">Leitores</span>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, x: 50 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative"
                    >
                        <div className="relative z-10 w-full aspect-[4/5] bg-brand-light rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.25)] overflow-hidden border-[12px] border-white group cursor-pointer" onClick={() => featuredBook && onViewDetails(featuredBook)}>
                            {featuredBook?.coverUrl ? (
                                <img
                                    src={featuredBook.coverUrl}
                                    alt={featuredBook.title}
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full p-20">
                                    <BookOpen className="w-32 h-32 text-brand-primary/20" />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-10">
                                <span className="text-white font-black text-lg uppercase tracking-widest flex items-center gap-3">
                                    Ver Detalhes <ArrowRight className="w-5 h-5" />
                                </span>
                            </div>
                        </div>

                        {/* Floating elements for depth */}
                        <motion.div
                            animate={{ y: [0, -20, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -top-12 -right-12 w-48 h-48 bg-brand-primary/20 rounded-full blur-3xl -z-10"
                        ></motion.div>

                        <div className="absolute -bottom-8 -left-8 bg-white p-7 rounded-[2rem] shadow-2xl flex items-center gap-6 border border-gray-100 z-20 group hover:translate-y-[-5px] transition-all">
                            <div className="w-16 h-16 bg-brand-primary flex items-center justify-center rounded-2xl text-white shadow-lg shadow-brand-primary/30 group-hover:rotate-12 transition-transform">
                                {upcomingLaunch ? <Clock className="w-8 h-8" /> : <Zap className="w-8 h-8 fill-current" />}
                            </div>
                            <div>
                                <h5 className="font-serif font-black text-2xl text-brand-dark italic leading-none">{upcomingLaunch ? 'Lançamento' : 'Novidade'}</h5>
                                <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-black pt-2">
                                    {upcomingLaunch ? 'Brevemente' : 'Acabado de Chegar'}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Categories Section */}
            <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={containerVariants}
                className="py-12 md:py-32 bg-white relative overflow-hidden optimize-render"
            >
                {/* Decorative blob */}
                <div className="absolute -left-20 top-40 w-80 h-80 bg-brand-primary/5 rounded-full blur-[80px]"></div>

                <div className="container mx-auto px-4 md:px-8 relative z-10">
                    <motion.div variants={itemVariants} className="text-center mb-16 md:mb-24">
                        <h2 className="text-4xl md:text-6xl font-black text-brand-dark tracking-tighter mb-4">
                            Explore por <span className="text-brand-primary italic font-serif font-normal">Categorias</span>
                        </h2>
                        <div className="w-24 h-1.5 bg-brand-primary mx-auto rounded-full"></div>
                    </motion.div>

                    {categories.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                            {categories.map((cat, idx) => (
                                <motion.div
                                    key={idx}
                                    variants={itemVariants}
                                    onClick={() => onNavigate('CATALOG')}
                                    className="group relative h-[400px] rounded-[3rem] overflow-hidden bg-brand-dark flex items-end p-10 md:p-12 cursor-pointer shadow-2xl hover:shadow-brand-primary/20 transition-all border-4 border-white"
                                >
                                    {cat.image && (
                                        <img src={cat.image} alt={cat.name} loading="lazy" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-110 transition-transform duration-1000" />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent group-hover:from-brand-primary/90 group-hover:via-brand-primary/40 transition-all duration-700"></div>
                                    <div className="relative z-10 space-y-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                        <div className="text-white font-black text-4xl md:text-5xl leading-none tracking-tighter">{cat.name}</div>
                                        <p className="text-white/70 text-sm font-bold uppercase tracking-widest">{cat.count} {cat.count === 1 ? 'Livro Disponível' : 'Livros Disponíveis'}</p>
                                        <button className="text-white font-black text-[11px] uppercase tracking-[0.3em] flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all delay-100">
                                            Explorar Tudo <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            {isFetching ? (
                                <div className="flex flex-col items-center gap-4">
                                    <Loader2 className="w-10 h-10 text-brand-primary animate-spin" />
                                    <p className="text-gray-500 uppercase tracking-widest font-black text-[10px]">Organizando Prateleiras...</p>
                                </div>
                            ) : (
                                <p className="text-gray-400 font-bold">Nenhuma categoria encontrada.</p>
                            )}
                        </div>
                    )}
                </div>
            </motion.section>

            {/* New Arrivals Section */}
            <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={containerVariants}
                className="py-12 md:py-32 bg-brand-light relative optimize-render"
            >
                <div className="container mx-auto px-4 md:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 md:mb-24 gap-8 text-center md:text-left">
                        <div className="space-y-5">
                            <motion.div variants={itemVariants} className="flex items-center justify-center md:justify-start gap-3 text-brand-primary font-black tracking-[0.3em] uppercase text-[10px]">
                                <div className="w-12 h-1 bg-brand-primary rounded-full"></div>
                                <span>Novidades</span>
                            </motion.div>
                            <motion.h2 variants={itemVariants} className="text-5xl md:text-7xl font-black text-brand-dark tracking-tighter leading-tight">
                                Acabados de <br />
                                <span className="text-brand-primary italic font-serif font-normal">Sair do Forno</span>
                            </motion.h2>
                        </div>
                        <motion.button
                            variants={itemVariants}
                            onClick={() => onNavigate('CATALOG')}
                            className="group flex items-center gap-5 font-black text-[12px] uppercase tracking-[0.2em] text-brand-dark hover:text-brand-primary transition-all bg-white px-8 py-4 rounded-2xl shadow-xl hover:shadow-brand-primary/10"
                        >
                            Ver Todo o Catálogo
                            <span className="w-10 h-10 bg-brand-dark text-white rounded-full flex items-center justify-center group-hover:bg-brand-primary transition-all">
                                <ArrowRight className="w-5 h-5" />
                            </span>
                        </motion.button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
                        {loading || isFetching ? (
                            Array(4).fill(0).map((_, i) => <BookCardSkeleton key={i} />)
                        ) : (
                            books.filter(b => b.isNew || b.isBestseller).slice(0, 4).map(book => (
                                <motion.div key={book.id} variants={itemVariants}>
                                    <BookCard
                                        book={book}
                                        onAddToCart={onAddToCart}
                                        onToggleWishlist={onToggleWishlist}
                                        onViewDetails={onViewDetails}
                                    />
                                </motion.div>
                            ))
                        )}
                        {!loading && !isFetching && books.length === 0 && (
                            <div className="col-span-full py-24 text-center bg-white rounded-[3rem] border-2 border-dashed border-gray-100 px-8">
                                <BookOpen className="w-20 h-20 text-gray-100 mx-auto mb-6" />
                                <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Prateleiras Vigorosamente Vazias</p>
                            </div>
                        )}
                    </div>
                </div>
            </motion.section>

            {/* Podcast & Blog Preview Section */}
            <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={containerVariants}
                className="py-24 bg-gray-50 overflow-hidden optimize-render"
            >
                <div className="container mx-auto px-4 md:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24">
                        {/* Podcast Feature */}
                        <motion.div variants={itemVariants} className="space-y-10">
                            <div className="flex items-center gap-5">
                                <div className="p-4 bg-brand-primary/10 rounded-3xl text-brand-primary shadow-lg shadow-brand-primary/5">
                                    <Mic className="w-8 h-8" />
                                </div>
                                <h3 className="text-3xl md:text-5xl font-black text-brand-dark tracking-tighter">Cultura em Áudio</h3>
                            </div>

                            {isFetching ? (
                                <div className="h-48 bg-white rounded-[2rem] border border-gray-100 flex items-center justify-center">
                                    <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
                                </div>
                            ) : latestEpisode ? (
                                <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-brand-dark/5 border border-gray-100 flex flex-col md:flex-row gap-8 items-center group hover:translate-y-[-5px] transition-all">
                                    <div className="w-40 h-40 rounded-3xl overflow-hidden shadow-xl shrink-0">
                                        <img src={latestEpisode.imageUrl} alt={latestEpisode.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    </div>
                                    <div className="flex-1 space-y-4 text-center md:text-left">
                                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-primary/10 rounded-full">
                                            <div className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-pulse"></div>
                                            <span className="text-[10px] font-black text-brand-primary uppercase tracking-widest">Último Episódio</span>
                                        </div>
                                        <h4 className="font-black text-brand-dark text-2xl tracking-tight leading-tight group-hover:text-brand-primary transition-colors">{latestEpisode.title}</h4>
                                        <button onClick={() => onNavigate('BLOG')} className="btn-premium !py-3 !px-6 !text-[10px] inline-flex">
                                            Conectar & Ouvir <ArrowRight className="w-4 h-4 ml-2" />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white p-10 rounded-3xl border border-dashed border-gray-200 text-center">
                                    <p className="text-gray-400 font-bold">O silêncio é de ouro. Novos episódios brevemente.</p>
                                </div>
                            )}

                            {/* Call to Authors */}
                            <div className="bg-brand-dark p-10 md:p-12 rounded-[3rem] text-white relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-12 opacity-5 -translate-y-1/4 translate-x-1/4 group-hover:scale-110 transition-transform duration-1000">
                                    <PenTool className="w-64 h-64" />
                                </div>
                                <div className="relative z-10 space-y-6">
                                    <h3 className="text-3xl md:text-5xl font-black tracking-tighter leading-none">És um Autor?</h3>
                                    <p className="text-white/60 text-lg max-w-sm font-medium leading-relaxed">Damos vida às tuas palavras. Explore os nossos serviços de edição e publicação de excelência.</p>
                                    <button onClick={() => onNavigate('SERVICES')} className="px-10 py-5 bg-brand-primary text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:brightness-110 shadow-xl shadow-brand-primary/20 transition-all active:scale-95">
                                        Publicar Conosco
                                    </button>
                                </div>
                            </div>
                        </motion.div>

                        {/* Recent Blog Posts */}
                        <motion.div variants={itemVariants} className="space-y-10">
                            <div className="flex items-center gap-5">
                                <div className="p-4 bg-brand-primary/10 rounded-3xl text-brand-primary shadow-lg shadow-brand-primary/5">
                                    <BookOpen className="w-8 h-8" />
                                </div>
                                <h3 className="text-3xl md:text-5xl font-black text-brand-dark tracking-tighter">Do Nosso Blog</h3>
                            </div>

                            <div className="space-y-6">
                                {isFetching ? (
                                    Array(3).fill(0).map((_, i) => (
                                        <div key={i} className="h-24 bg-white rounded-2xl animate-pulse" />
                                    ))
                                ) : recentPosts.length > 0 ? (
                                    recentPosts.map(post => (
                                        <div key={post.id} onClick={() => onNavigate('BLOG')} className="group flex gap-6 items-center bg-white p-5 rounded-3xl shadow-sm border border-gray-50 cursor-pointer hover:shadow-2xl hover:translate-x-2 transition-all">
                                            <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 shadow-md">
                                                <img src={post.imageUrl} alt={post.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                            </div>
                                            <div className="flex-1 space-y-2">
                                                <h4 className="font-black text-brand-dark text-lg md:text-xl line-clamp-2 group-hover:text-brand-primary transition-colors tracking-tight leading-tight">{post.title}</h4>
                                                <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                                    <Clock className="w-3 h-3" />
                                                    <span>{new Date(post.date).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-100">
                                        <p className="text-gray-400 font-bold">Nenhum artigo publicado ainda.</p>
                                    </div>
                                )}
                            </div>
                            <div className="text-right">
                                <button onClick={() => onNavigate('BLOG')} className="text-sm font-black text-brand-primary hover:text-brand-dark transition-all inline-flex items-center gap-3 uppercase tracking-widest group">
                                    Ver todas as novidades
                                    <span className="w-10 h-10 border-2 border-brand-primary/20 rounded-full flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-all">
                                        <ArrowRight className="w-4 h-4" />
                                    </span>
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.section>

            {/* Testimonials Section */}
            {testimonials.length > 0 && (
                <motion.section
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={containerVariants}
                    className="py-24 md:py-40 bg-white overflow-hidden optimize-render"
                >
                    <div className="container mx-auto px-4 md:px-8">
                        <motion.div variants={itemVariants} className="text-center mb-24">
                            <h2 className="text-5xl md:text-7xl font-black text-brand-dark tracking-tighter leading-tight">
                                O que dizem os nossos <br />
                                <span className="text-brand-primary italic font-serif font-normal">Autores e Leitores</span>
                            </h2>
                        </motion.div>

                        <div className="grid md:grid-cols-3 gap-10 md:gap-14">
                            {testimonials.map((t, idx) => (
                                <motion.div
                                    key={t.id || idx}
                                    variants={itemVariants}
                                    className="bg-brand-light p-12 rounded-[3.5rem] relative group border border-gray-100/50 shadow-2xl shadow-brand-dark/5 hover:translate-y-[-10px] transition-all duration-500"
                                >
                                    <div className="absolute -top-6 left-12 w-12 h-12 bg-brand-primary rounded-2xl flex items-center justify-center text-white shadow-xl shadow-brand-primary/30">
                                        <Star className="w-6 h-6 fill-current" />
                                    </div>
                                    <div className="flex gap-1 mb-8 text-yellow-400">
                                        {[...Array(t.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                                    </div>
                                    <p className="text-gray-600 italic font-medium mb-10 text-lg leading-relaxed">"{t.content}"</p>
                                    <div className="flex items-center gap-5 border-t border-gray-200/50 pt-10">
                                        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-200 shadow-md">
                                            {t.photoUrl ? <img src={t.photoUrl} alt={t.name} className="w-full h-full object-cover" /> : <Users className="w-full h-full p-4 text-gray-400" />}
                                        </div>
                                        <div>
                                            <h4 className="font-black text-brand-dark text-xl tracking-tight">{t.name}</h4>
                                            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-black">{t.role}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.section>
            )}

            {/* Newsletter Section with Premium Glassmorphism */}
            <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="bg-brand-dark py-32 px-4 overflow-hidden relative"
            >
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-primary/20 via-transparent to-transparent"></div>
                <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-brand-primary/10 rounded-full blur-[120px]"></div>

                <div className="container mx-auto relative z-10 text-center">
                    <div className="max-w-3xl mx-auto space-y-12">
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.6 }}
                            className="w-24 h-24 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] flex items-center justify-center text-brand-primary mx-auto rotate-12 shadow-2xl"
                        >
                            <Mail className="w-10 h-10" />
                        </motion.div>

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="space-y-6"
                        >
                            <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter leading-none">
                                {siteContent['newsletter.title'] || "Fique por Dentro"}
                            </h2>
                            <p className="text-xl text-gray-400 font-medium max-w-2xl mx-auto leading-relaxed">
                                {siteContent['newsletter.description'] || "Subscreva a nossa newsletter e receba novidades literárias, convites para lançamentos e ofertas exclusivas."}
                            </p>
                        </motion.div>

                        <motion.form
                            initial={{ y: 20, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="flex flex-col md:flex-row gap-5 max-w-2xl mx-auto bg-white/5 backdrop-blur-md p-3 rounded-[2rem] border border-white/10"
                            onSubmit={handleSubscribe}
                        >
                            <div className="flex-1">
                                <input
                                    type="email"
                                    required
                                    placeholder="O seu melhor email"
                                    className="w-full bg-transparent border-0 px-8 py-5 text-white placeholder-gray-500 focus:ring-0 text-lg font-medium"
                                    value={newsletterEmail}
                                    onChange={(e) => setNewsletterEmail(e.target.value)}
                                    disabled={isSubscribing || isSubscribed}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isSubscribing || isSubscribed}
                                className="px-10 py-5 bg-brand-primary text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-brand-primary/40 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 min-w-[200px]"
                            >
                                {isSubscribing ? (
                                    <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                                ) : isSubscribed ? (
                                    <div className="flex items-center justify-center gap-3">
                                        <CheckCircle className="w-6 h-6" />
                                        <span>Subscrito!</span>
                                    </div>
                                ) : (
                                    <span>Subscrever</span>
                                )}
                            </button>
                        </motion.form>

                        <p className="text-sm text-gray-500 font-medium tracking-wide">
                            Respeitamos a sua privacidade. Cancele quando quiser.
                        </p>
                    </div>
                </div>

                {/* Back to Top Floating Button - Functional */}
                <motion.button
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={scrollToTop}
                    className="fixed bottom-10 right-10 w-16 h-16 bg-brand-primary text-white rounded-full shadow-2xl z-50 flex items-center justify-center group border-4 border-white"
                    title="Voltar ao Topo"
                >
                    <ChevronUp className="w-7 h-7 group-hover:-translate-y-1 transition-transform" />
                </motion.button>
            </motion.section>
        </div>
    );
};

export default HomePage;
