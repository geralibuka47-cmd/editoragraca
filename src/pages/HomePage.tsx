import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, BookOpen, ArrowRight, Zap, Star, Trophy, Mail, Clock, PenTool, Users, CheckCircle, Loader2, ChevronUp } from 'lucide-react';
import { m, AnimatePresence, Variants } from 'framer-motion';
import { Book, ViewState, BlogPost } from '../types';
import BookCard from '../components/BookCard';
import Countdown from '../components/Countdown';
import { getPublicStats, getBlogPosts, getSiteContent, getTestimonials } from '../services/dataService';
import { BookCardSkeleton, PostCardSkeleton } from '../components/SkeletonLoader';

interface HomePageProps {
    books: Book[];
    loading: boolean;
    onViewDetails: (book: Book) => void;
    onAddToCart: (book: Book) => void;
    onToggleWishlist: (book: Book) => void;
    onNavigate: (view: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ books, loading, onViewDetails, onAddToCart, onToggleWishlist, onNavigate }) => {
    const [stats, setStats] = useState({ booksCount: 0, authorsCount: 0, readersCount: 0 });
    const [categories, setCategories] = useState<{ name: string; count: number; image?: string }[]>([]);
    const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
    const [siteContent, setSiteContent] = useState<any>({});
    const navigate = useNavigate();
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
                const [s, b, content, t] = await Promise.all([
                    getPublicStats(),
                    getBlogPosts(),
                    getSiteContent('home'),
                    getTestimonials()
                ]);

                setStats(s);
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

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants: Variants = {
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
        <div className="relative overflow-x-hidden bg-[#F8FAFC]">
            {/* Hero Section - OPUS Style */}
            <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-white pt-20">
                {/* Immersive Background Elements - OPUS Style */}
                <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-brand-primary/5 pointer-events-none"></div>
                <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_30%,_rgba(196,160,82,0.03)_0%,_transparent_70%)] pointer-events-none"></div>

                <div className="container mx-auto px-6 md:px-8 grid lg:grid-cols-2 lg:items-center gap-16 md:gap-32 py-12 md:py-20 relative z-20">
                    <m.div
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                        className="space-y-6 md:space-y-10 text-center lg:text-left"
                    >
                        <m.div variants={itemVariants} className="inline-flex items-center gap-4 px-5 py-2 bg-brand-dark/5 backdrop-blur-md rounded-full border border-gray-100 text-brand-primary font-black tracking-[0.4em] uppercase text-[9px] md:text-[10px]">
                            {upcomingLaunch ? <Clock className="w-3.5 h-3.5 animate-pulse" /> : <Sparkles className="w-3.5 h-3.5" />}
                            <span>{upcomingLaunch ? 'Brevemente' : 'Legado Editorial'}</span>
                        </m.div>

                        <m.h1 variants={itemVariants} className="text-5xl sm:text-7xl md:text-[5rem] lg:text-[6.5rem] font-black leading-[1] text-brand-dark tracking-tighter">
                            {upcomingLaunch ? (
                                <>
                                    <span className="text-gradient-gold uppercase text-[0.4em] block tracking-[0.2em] mb-4">O Próximo</span>
                                    <span className="italic font-serif font-normal">{upcomingLaunch.title}</span>
                                </>
                            ) : (
                                <>
                                    {siteContent['hero.title'] || "Onde a Arte"} <br />
                                    <span className="text-gradient-gold italic font-serif font-normal text-[0.9em] lowercase">{siteContent['hero.subtitle'] || "Encontra o Legado"}</span>
                                </>
                            )}
                        </m.h1>

                        <m.p variants={itemVariants} className="text-reading max-w-xl mx-auto lg:mx-0 opacity-80">
                            {upcomingLaunch
                                ? (upcomingLaunch.description || '').slice(0, 150) + '...'
                                : (siteContent['hero.description'] || "Curadoria de excelência para leitores que exigem o extraordinário. Literatura angolana elevada ao patamar mundial.")
                            }
                        </m.p>

                        <m.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-4">
                            <button
                                className="w-full sm:w-auto py-5 px-10 bg-brand-dark text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-brand-primary hover:scale-105 transition-all shadow-xl shadow-brand-dark/10 flex items-center justify-center gap-4 group"
                                onClick={() => upcomingLaunch ? onViewDetails(upcomingLaunch) : navigate('/livros')}
                            >
                                {upcomingLaunch ? 'Garantir Exemplar' : 'Explorar o Acervo'}
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                            {!upcomingLaunch && (
                                <button
                                    onClick={() => onNavigate('/sobre')}
                                    className="w-full sm:w-auto py-5 px-10 bg-white border border-gray-100 text-brand-dark rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-gray-50 transition-all flex items-center justify-center"
                                >
                                    Nossa Essência
                                </button>
                            )}
                        </m.div>

                        {/* High Impact Stats */}
                        <m.div variants={itemVariants} className="flex items-center justify-center lg:justify-start gap-8 md:gap-12 pt-8 md:pt-12 border-t border-gray-100">
                            <div className="flex flex-col">
                                <span className="text-3xl md:text-5xl font-black text-brand-dark tracking-tighter">
                                    {stats.booksCount > 0 ? (
                                        <m.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                            {stats.booksCount}<span className="text-brand-primary italic">+</span>
                                        </m.span>
                                    ) : '...'}
                                </span>
                                <span className="text-[9px] uppercase tracking-[0.3em] text-gray-400 font-black mt-2">Obras de Arte</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-3xl md:text-5xl font-black text-brand-dark tracking-tighter">
                                    {stats.readersCount > 0 ? (
                                        <m.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                            {stats.readersCount}<span className="text-brand-primary italic">+</span>
                                        </m.span>
                                    ) : 'Mil+'}
                                </span>
                                <span className="text-[9px] uppercase tracking-[0.3em] text-gray-400 font-black mt-2">Leitores Fidelizados</span>
                            </div>
                        </m.div>
                    </m.div>

                    <m.div
                        initial={{ opacity: 0, scale: 0.9, x: 50 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="relative hidden lg:block"
                    >
                        <div className="relative z-10 w-full aspect-[3/4] max-w-[440px] ml-auto bg-gray-50 rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] overflow-hidden border border-gray-100 group cursor-pointer" onClick={() => featuredBook && onViewDetails(featuredBook)}>
                            {featuredBook?.coverUrl ? (
                                <img
                                    src={featuredBook.coverUrl}
                                    alt={featuredBook.title}
                                    loading="eager"
                                    className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105"
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full bg-gray-50">
                                    <BookOpen className="w-32 h-32 text-gray-200" />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex items-end p-12">
                                <div className="space-y-3 translate-y-8 group-hover:translate-y-0 transition-transform duration-700">
                                    <h4 className="text-white font-black text-3xl uppercase leading-none tracking-tighter">{featuredBook?.title}</h4>
                                    <p className="text-brand-primary font-serif italic text-lg">Por {featuredBook?.author}</p>
                                    <span className="inline-flex items-center gap-3 text-white font-black text-[10px] uppercase tracking-[0.3em] pt-4 border-b border-brand-primary/0 group-hover:border-brand-primary transition-all">
                                        Explorar Obra <ArrowRight className="w-4 h-4" />
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Floating Metadata Card - Refined */}
                        <m.div
                            animate={{ y: [0, -15, 0] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute bottom-12 -left-12 bg-white p-6 rounded-[2rem] shadow-xl border border-gray-100 z-30 group"
                        >
                            <div className="flex items-center gap-5">
                                <div className="w-16 h-16 bg-brand-dark text-brand-primary flex items-center justify-center rounded-2xl shadow-lg group-hover:rotate-6 transition-transform">
                                    {upcomingLaunch ? <Clock className="w-8 h-8" /> : <Trophy className="w-8 h-8" />}
                                </div>
                                <div>
                                    <h5 className="font-serif font-black text-2xl text-brand-dark italic leading-none">{upcomingLaunch ? 'Countdown' : 'Bestseller'}</h5>
                                    <p className="text-[9px] uppercase tracking-[0.3em] text-brand-primary font-black pt-2">
                                        {upcomingLaunch ? 'Lançamento Breve' : 'Mérito Editorial'}
                                    </p>
                                </div>
                            </div>
                        </m.div>
                    </m.div>
                </div>
            </section>

            {/* Categories Section - Redesigned for Impact */}
            <m.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={containerVariants}
                className="py-24 md:py-48 bg-white relative overflow-hidden optimize-render px-6"
            >
                <div className="container mx-auto relative z-10">
                    <m.div variants={itemVariants} className="text-center mb-20 md:mb-32">
                        <span className="text-brand-primary font-black text-[10px] md:text-xs uppercase tracking-[0.5em] mb-4 md:mb-6 block text-center">Curadoria Estruturada</span>
                        <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-brand-dark tracking-tighter mb-8 md:mb-10 uppercase leading-[0.9] text-center">
                            Universo <span className="text-gradient-gold italic font-serif lowercase">Literário</span>
                        </h2>
                        <div className="w-16 md:w-24 h-1.5 md:h-2 bg-brand-primary mx-auto rounded-full"></div>
                    </m.div>

                    {categories.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
                            {categories.map((cat, idx) => {
                                const isWide = (idx % 5 === 0);
                                return (
                                    <m.div
                                        key={idx}
                                        variants={itemVariants}
                                        onClick={() => navigate('/livros')}
                                        className={`group relative h-[300px] sm:h-[400px] md:h-[600px] rounded-[2rem] md:rounded-[3.5rem] overflow-hidden bg-brand-dark p-6 sm:p-8 md:p-16 flex items-end cursor-pointer shadow-2xl transition-all duration-700 ${isWide ? 'md:col-span-8' : 'md:col-span-4'}`}
                                    >
                                        {cat.image && (
                                            <img src={cat.image} alt={cat.name} loading="lazy" className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000" />
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/20 to-transparent group-hover:from-brand-primary/80 transition-all duration-700"></div>
                                        <div className="relative z-10 space-y-3 sm:space-y-4 md:space-y-6 translate-y-2 sm:translate-y-4 md:translate-y-8 group-hover:translate-y-0 transition-transform duration-700">
                                            <div className="text-white font-black text-2xl sm:text-3xl md:text-5xl lg:text-6xl leading-none tracking-tighter uppercase">{cat.name}</div>
                                            <div className="flex items-center gap-3 md:gap-4">
                                                <p className="text-white/60 text-[9px] md:text-xs font-black uppercase tracking-[0.3em]">{cat.count} Edições</p>
                                                <div className="h-px w-8 md:w-12 bg-white/20"></div>
                                            </div>
                                            <button className="text-white font-black text-[9px] md:text-[11px] uppercase tracking-[0.4em] flex items-center gap-3 md:gap-4 opacity-0 group-hover:opacity-100 transition-all delay-100 py-2 sm:py-4 border-b border-white/0 group-hover:border-white/40">
                                                Inspecionar <ArrowRight className="w-3 md:w-4 h-3 md:h-4" />
                                            </button>
                                        </div>
                                    </m.div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-32 bg-gray-50 rounded-[4rem] border border-gray-100">
                            {isFetching ? (
                                <Loader2 className="w-16 h-16 text-brand-primary animate-spin mx-auto mb-6" />
                            ) : (
                                <p className="text-gray-400 font-black uppercase tracking-[0.4em] text-xs">Coleção sob curadoria</p>
                            )}
                        </div>
                    )}
                </div>
            </m.section>

            {/* New Arrivals Section - High Contrast */}
            <m.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={containerVariants}
                className="py-24 md:py-48 bg-brand-dark relative overflow-hidden optimize-render"
            >
                <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-primary/5 blur-[120px] rounded-full"></div>

                <div className="container mx-auto px-6 md:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-24 gap-8">
                        <div className="space-y-6 text-center md:text-left">
                            <m.div variants={itemVariants} className="flex items-center justify-center md:justify-start gap-4 text-brand-primary font-black tracking-[0.5em] uppercase text-[10px]">
                                <div className="w-16 h-1 bg-brand-primary rounded-full"></div>
                                <span>Recentemente Catalogados</span>
                            </m.div>
                            <m.h2 variants={itemVariants} className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-[0.9] uppercase text-center md:text-left">
                                Novas <br />
                                <span className="text-gradient-gold italic font-serif lowercase">Perspectivas</span>
                            </m.h2>
                        </div>
                        <m.button
                            variants={itemVariants}
                            onClick={() => navigate('/livros')}
                            className="group flex items-center gap-6 font-black text-[11px] uppercase tracking-[0.3em] text-white bg-white/5 border border-white/10 px-12 py-7 rounded-[2rem] hover:bg-brand-primary hover:border-brand-primary transition-all backdrop-blur-md"
                        >
                            Ver Tudo
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                        </m.button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                        {(loading || isFetching) ? (
                            Array(4).fill(0).map((_, i) => <BookCardSkeleton key={i} />)
                        ) : (
                            books.filter(b => b.isNew || b.isBestseller).slice(0, 4).map(book => (
                                <m.div key={book.id} variants={itemVariants}>
                                    <BookCard
                                        book={book}
                                        onAddToCart={onAddToCart}
                                        onToggleWishlist={onToggleWishlist}
                                        onViewDetails={onViewDetails}
                                    />
                                </m.div>
                            ))
                        )}
                    </div>
                </div>
            </m.section>

            {/* Premium Blog & Call to Authors */}
            <m.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={containerVariants}
                className="py-24 md:py-48 bg-white overflow-hidden optimize-render px-6"
            >
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-center">
                        {/* High End Call to Authors */}
                        <m.div variants={itemVariants} className="lg:col-span-6">
                            <div className="bg-brand-dark rounded-[4rem] p-16 md:p-24 text-white relative overflow-hidden group shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)]">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/10 blur-[80px] rounded-full"></div>
                                <div className="relative z-10 space-y-10">
                                    <span className="text-brand-primary text-xs font-black uppercase tracking-[0.5em] block">Laboratório de Talentos</span>
                                    <h3 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter leading-none uppercase">
                                        Seu Nome na <br />
                                        <span className="text-gradient-gold italic font-serif lowercase">História</span>
                                    </h3>
                                    <p className="text-gray-400 text-xl font-medium leading-relaxed max-w-md">
                                        Oferecemos consultoria editorial de nível mundial para autores com visão. Transformamos manuscritos em legados.
                                    </p>
                                    <button onClick={() => onNavigate('/servicos')} className="group flex items-center gap-6 font-black text-[11px] uppercase tracking-[0.3em] text-brand-dark bg-white px-12 py-7 rounded-[2rem] hover:bg-brand-primary hover:text-white transition-all">
                                        Edição de Elite
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </m.div>

                        {/* Recent Blog Posts - Minimalist & Premium */}
                        <m.div variants={itemVariants} className="lg:col-span-6 space-y-16">
                            <div className="space-y-6">
                                <span className="text-brand-primary text-xs font-black uppercase tracking-[0.5em] block">Crônica Contemporânea</span>
                                <h3 className="text-5xl md:text-7xl font-black text-brand-dark tracking-tighter uppercase leading-none">Dialogo Editorial</h3>
                            </div>

                            <div className="divide-y divide-gray-100">
                                {isFetching ? (
                                    Array(3).fill(0).map((_, i) => (
                                        <div key={i} className="py-10 bg-gray-50/50 animate-pulse rounded-3xl" />
                                    ))
                                ) : (
                                    recentPosts.map(post => (
                                        <div key={post.id} onClick={() => navigate('/blog')} className="group py-8 md:py-12 flex flex-col sm:flex-row gap-6 md:gap-10 items-start cursor-pointer hover:bg-gray-50 transition-all px-4 md:px-6 rounded-[1.5rem] md:rounded-[2rem] -mx-4 md:-mx-6">
                                            <div className="w-full sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden shrink-0 shadow-lg md:shadow-2xl transition-all duration-700 group-hover:scale-95">
                                                <img src={post.imageUrl} alt={post.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1s]" />
                                            </div>
                                            <div className="flex-1 space-y-3 md:space-y-4">
                                                <div className="flex items-center gap-4 text-[9px] md:text-[10px] text-gray-400 font-black uppercase tracking-[0.3em]">
                                                    <Clock className="w-3 h-3 text-brand-primary" />
                                                    <span>{new Date(post.date).toLocaleDateString('pt-AO', { month: 'long', year: 'numeric' })}</span>
                                                </div>
                                                <h4 className="font-black text-brand-dark text-xl md:text-2xl lg:text-3xl line-clamp-2 uppercase tracking-tighter leading-tight group-hover:text-brand-primary transition-colors">
                                                    {post.title}
                                                </h4>
                                                <p className="text-gray-400 text-xs md:text-sm font-medium line-clamp-2 leading-relaxed opacity-0 group-hover:opacity-100 transition-all duration-500">
                                                    Explore as nuances profundas desta narrativa exclusiva da Editora Graça.
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </m.div>
                    </div>
                </div>
            </m.section>

            {/* Testimonials - Immersive Design */}
            {
                testimonials.length > 0 && (
                    <m.section
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={containerVariants}
                        className="py-24 md:py-48 bg-[#F8FAFC] overflow-hidden optimize-render"
                    >
                        <div className="container mx-auto px-6 md:px-8">
                            <m.div variants={itemVariants} className="text-center mb-20 md:mb-32">
                                <span className="text-brand-primary text-[10px] md:text-xs font-black uppercase tracking-[0.5em] block mb-6 md:mb-8 text-center">Vozes da Autoridade</span>
                                <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-[7rem] font-black text-brand-dark tracking-tighter leading-[0.9] uppercase text-center">
                                    Reverberação <br />
                                    <span className="text-gradient-gold italic font-serif lowercase">Eternizada</span>
                                </h2>
                            </m.div>

                            <div className="grid md:grid-cols-3 gap-12 md:gap-16">
                                {testimonials.map((t, idx) => (
                                    <m.div
                                        key={t.id || idx}
                                        variants={itemVariants}
                                        className="glass-premium p-12 md:p-16 rounded-[4rem] relative group border border-white shadow-2xl hover:-translate-y-4 transition-all duration-700"
                                    >
                                        <div className="absolute -top-8 left-16 w-20 h-20 bg-brand-dark text-brand-primary rounded-[1.5rem] flex items-center justify-center shadow-2xl border-4 border-white">
                                            <Star className="w-8 h-8 fill-current" />
                                        </div>
                                        <p className="text-gray-600 italic font-black text-2xl mb-12 leading-relaxed opacity-90 border-l-4 border-brand-primary/20 pl-8">"{t.content}"</p>
                                        <div className="flex items-center gap-6">
                                            <div className="w-20 h-20 rounded-[1.5rem] overflow-hidden bg-brand-dark shadow-2xl grayscale group-hover:grayscale-0 transition-all duration-700">
                                                {t.photoUrl ? <img src={t.photoUrl} alt={t.name} className="w-full h-full object-cover" /> : <Users className="w-full h-full p-6 text-white/10" />}
                                            </div>
                                            <div>
                                                <h4 className="font-black text-brand-dark text-2xl tracking-tighter uppercase">{t.name}</h4>
                                                <p className="text-[10px] uppercase tracking-[0.4em] text-brand-primary font-black mt-2">{t.role}</p>
                                            </div>
                                        </div>
                                    </m.div>
                                ))}
                            </div>
                        </div>
                    </m.section>
                )
            }

            {/* Newsletter - Closing with Elegance */}
            <m.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="bg-brand-dark py-24 md:py-48 px-4 sm:px-6 overflow-hidden relative"
            >
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_rgba(196,160,82,0.1)_0%,_transparent_70%)]"></div>

                <div className="container mx-auto relative z-10 text-center">
                    <div className="max-w-4xl mx-auto space-y-12 md:space-y-16">
                        <m.div
                            initial={{ y: 20, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            transition={{ duration: 1 }}
                            className="w-20 h-20 md:w-24 md:h-24 glass-premium rounded-[2.5rem] flex items-center justify-center text-brand-primary mx-auto shadow-[0_20px_50px_rgba(196,160,82,0.2)] border border-white/5"
                        >
                            <Mail className="w-8 h-8 md:w-10 md:h-10" />
                        </m.div>

                        <div className="space-y-6 md:space-y-8">
                            <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-[6.5rem] font-black text-white tracking-tighter leading-[1] md:leading-none uppercase">
                                Convite ao <br />
                                <span className="text-gradient-gold italic font-serif lowercase">Inesquecível</span>
                            </h2>
                            <p className="text-lg md:text-2xl text-gray-400 font-medium max-w-2xl mx-auto leading-relaxed opacity-80">
                                Seja o primeiro a acessar lançamentos exclusivos e insights editoriais de elite.
                            </p>
                        </div>

                        <m.form
                            initial={{ y: 20, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className="flex flex-col md:flex-row gap-4 md:gap-6 max-w-2xl mx-auto glass-premium p-3 md:p-6 rounded-[2rem] md:rounded-[3rem] border border-white/10 shadow-2xl"
                            onSubmit={handleSubscribe}
                        >
                            <input
                                type="email"
                                required
                                placeholder="Seu email de prestígio"
                                className="flex-1 bg-transparent border-0 px-6 md:px-8 py-4 md:py-5 text-white focus:ring-0 text-lg md:text-xl font-medium placeholder:text-gray-600"
                                value={newsletterEmail}
                                onChange={(e) => setNewsletterEmail(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="px-10 md:px-12 py-4 md:py-5 bg-brand-primary text-white rounded-[1.2rem] md:rounded-[1.5rem] font-black text-[10px] md:text-[11px] uppercase tracking-[0.4em] shadow-2xl hover:bg-white hover:text-brand-dark hover:scale-105 active:scale-95 transition-all duration-500"
                                disabled={isSubscribing}
                            >
                                {isSubscribing ? 'Codificando...' : 'Filiar-se'}
                            </button>
                        </m.form>
                    </div>
                </div>

                {/* Back to Top - Premium Button */}
                <m.button
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 md:bottom-12 md:right-12 w-16 h-16 md:w-20 md:h-20 bg-brand-primary text-white rounded-full shadow-[0_20px_50px_rgba(196,160,82,0.4)] z-50 flex items-center justify-center group hover:bg-white hover:text-brand-dark transition-all duration-700 border-2 md:border-4 border-brand-dark"
                >
                    <ChevronUp className="w-6 h-6 md:w-8 md:h-8 group-hover:-translate-y-2 transition-transform duration-500" />
                </m.button>
            </m.section>
        </div>
    );
};

export default HomePage;
