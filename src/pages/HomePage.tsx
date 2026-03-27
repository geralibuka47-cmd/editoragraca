import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ShoppingCart, Star, ChevronLeft, ChevronRight, Play, Download, Loader2, ArrowRight, Clock, CheckCircle, Mail, Zap, TrendingUp, Eye, Sparkles } from 'lucide-react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

import { Book, BlogPost } from '../types';
import BookCard from '../components/BookCard';
import { getPublicStats, getBlogPosts, getSiteContent, getTestimonials, getTeamMembers } from '../services/dataService';
import { OptimizedImage, optimizeImageUrl } from '../components/OptimizedImage';
import SEO from '../components/SEO';
import AdUnit from '../components/AdUnit';
import UpcomingReleases from '../components/UpcomingReleases';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '../components/Toast';

interface HomePageProps {
    books: Book[];
    loading: boolean;
    siteContent?: Record<string, any>;
    onViewDetails: (book: Book) => void;
    onAddToCart: (book: Book) => void;
    onToggleWishlist: (book: Book) => void;
    onNavigate: (view: string) => void;
}

const newsletterSchema = z.object({
    email: z.string().email('Introduza um email válido'),
});

type NewsletterFormData = z.infer<typeof newsletterSchema>;

const HomePage: React.FC<HomePageProps> = ({ books, loading, siteContent = {}, onViewDetails, onAddToCart, onToggleWishlist, onNavigate }) => {
    const [stats, setStats] = useState({ booksCount: 0, authorsCount: 0, readersCount: 0 });
    const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
    const [authors, setAuthors] = useState<any[]>([]);
    const navigate = useNavigate();
    const { showToast } = useToast();

    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<NewsletterFormData>({
        resolver: zodResolver(newsletterSchema)
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                const [s, b, team] = await Promise.all([
                    getPublicStats(),
                    getBlogPosts(),
                    getTeamMembers()
                ]);
                setStats(s);
                setRecentPosts(b ? b.slice(0, 3) : []);
                setAuthors(team || []);
            } catch (error) {
                console.error("Error loading home data:", error);
            }
        };
        loadData();
    }, []);

    const now = new Date().getTime();
    const releasedBooks = useMemo(() => books.filter(b => {
        if (!b.launchDate) return true;
        const launchTime = new Date(b.launchDate).getTime();
        return isNaN(launchTime) || launchTime <= now;
    }), [books, now]);

    const futureBooks = useMemo(() => books.filter(b => {
        if (!b.launchDate) return false;
        const launchTime = new Date(b.launchDate).getTime();
        return !isNaN(launchTime) && launchTime > now;
    }), [books, now]);

    // 1. Reading of the Month (Leitura do Mês) - Must be a released book
    const readingOfMonth = (releasedBooks.find(b => b.featured) || releasedBooks[0]);

    // 2. Author of the Month (Autor do Mês)
    const authorOfMonth = authors.find(a => a.featured) || authors[0];

    // 3. Most Downloaded (Livro mais baixado) - Mandatory > 0 downloads
    const mostDownloadedBooks = useMemo(() => [...releasedBooks]
        .filter((b: Book) => (b.stats?.downloads || 0) > 0)
        .sort((a: Book, b: Book) => (b.stats?.downloads || 0) - (a.stats?.downloads || 0)), [releasedBooks]);

    const mostDownloaded = mostDownloadedBooks[0] || null;

    // 4. Most Viewed (Mais Visto)
    const mostViewed = useMemo(() => [...releasedBooks]
        .filter((b: Book) => (b.stats?.views || 0) > 0)
        .sort((a: Book, b: Book) => (b.stats?.views || 0) - (a.stats?.views || 0))
        .slice(0, 4), [releasedBooks]);

    // 5. Success Authors (Autores com mais downloads/vendas)
    const authorStatsMap = new Map<string, { author: string, count: number, id: string, photo?: string }>();
    releasedBooks.forEach((b: Book) => {
        const count = (b.stats?.copiesSold || 0) + (b.stats?.downloads || 0);
        if (count > 0) {
            const key = b.authorId || b.author;
            const current = authorStatsMap.get(key) || { author: b.author, id: b.authorId || '', count: 0 };
            authorStatsMap.set(key, { ...current, count: current.count + count });
        }
    });
    const topAuthors = Array.from(authorStatsMap.values())
        .sort((a, b) => b.count - a.count)
        .map(ts => ({
            ...ts,
            details: authors.find(a => a.id === ts.id || a.name === ts.author)
        }))
        .slice(0, 3);

    // Categories (Only released)
    const ebooks = useMemo(() => releasedBooks.filter((b: Book) => b.format === 'digital').slice(0, 4), [releasedBooks]);
    const physicalBooks = useMemo(() => releasedBooks.filter((b: Book) => b.format === 'físico').slice(0, 4), [releasedBooks]);
    const freeBooks = useMemo(() => releasedBooks.filter((b: Book) => (b.price || 0) === 0).slice(0, 4), [releasedBooks]);
    const paidBooks = useMemo(() => releasedBooks.filter((b: Book) => (b.price || 0) > 0).slice(0, 4), [releasedBooks]);

    const upcomingLaunch = useMemo(() => futureBooks
        .sort((a: Book, b: Book) => new Date(a.launchDate!).getTime() - new Date(b.launchDate!).getTime())[0], [futureBooks]);

    // Get Featured Book (Hero)
    const featuredBook = readingOfMonth;

    const fadeInUp: Variants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    const stagger: Variants = {
        visible: { transition: { staggerChildren: 0.1 } }
    };

    const onSubscribe = async (data: NewsletterFormData) => {
        const { subscribeToNewsletter } = await import('../services/newsletterService');
        const success = await subscribeToNewsletter(data.email);

        if (success) {
            showToast('Subscrição realizada com sucesso!', 'success');
            reset();
        } else {
            showToast('Erro ao realizar subscrição. Tente novamente.', 'error');
        }
    };

    return (
        <div className="bg-white overflow-hidden font-sans text-brand-dark">
            <SEO
                title="Página Inicial"
                description={siteContent['home.hero_subtitle'] || "Curadoria de excelência literária."}
            />
            {/* 1. HERO SECTION - Bold & Geometric */}
            <section className="min-h-screen section-fluid flex items-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gray-50 skew-x-12 translate-x-1/3 -z-10 hidden lg:block"></div>

                <div className="container mx-auto grid lg:grid-cols-2 gap-10 sm:gap-16 items-center w-full">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={stagger}
                        className="space-y-8"
                    >
                        <motion.div variants={fadeInUp} className="inline-flex items-center gap-3 px-4 py-2 bg-brand-primary text-white rounded-lg text-xs font-bold uppercase tracking-widest shadow-lg shadow-brand-primary/30">
                            <Zap className="w-4 h-4 text-white animate-pulse" />
                            <span>🎉 Lançamento Oficial — Já Online</span>
                        </motion.div>

                        <motion.h1 variants={fadeInUp} className="uppercase leading-[0.9] tracking-tighter">
                            {siteContent['home.hero_title'] || "Onde a Arte"} <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-amber-600">
                                {siteContent['home.hero_subtitle'] || "Encontra o Legado"}
                            </span>
                        </motion.h1>

                        <motion.p variants={fadeInUp} className="text-gray-500 font-medium max-w-lg leading-relaxed">
                            {siteContent['home.hero_subtitle'] || "Curadoria de excelência para leitores que exigem o extraordinário."}
                        </motion.p>

                        <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 pt-4">
                            <button
                                onClick={() => navigate('/livros')}
                                className="px-10 py-5 bg-brand-dark text-white font-bold uppercase tracking-widest rounded-xl hover:bg-brand-primary transition-all shadow-xl shadow-brand-dark/20 flex items-center justify-center gap-3 group"
                            >
                                Explorar Acervo <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button
                                onClick={() => navigate('/sobre')}
                                className="px-10 py-5 bg-white border border-gray-200 text-brand-dark font-bold uppercase tracking-widest rounded-xl hover:bg-gray-50 transition-all"
                            >
                                A Nossa Essência
                            </button>
                        </motion.div>

                        {/* Stats - Horizontal */}
                        <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-6 sm:gap-12 pt-8 sm:pt-12 border-t border-gray-100">
                            <div>
                                <p className="text-3xl sm:text-4xl font-black text-brand-dark">{stats.booksCount}+</p>
                                <p className="text-[10px] sm:text-xs uppercase tracking-widest text-gray-400 font-bold mt-1">Obras Publicadas</p>
                            </div>
                            <div>
                                <p className="text-3xl sm:text-4xl font-black text-brand-dark">{stats.readersCount}+</p>
                                <p className="text-[10px] sm:text-xs uppercase tracking-widest text-gray-400 font-bold mt-1">Leitores</p>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Hero Image - Architecture */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="relative hidden lg:block"
                    >
                        <div className="relative z-10 w-full max-w-[280px] sm:max-w-[350px] lg:max-w-[450px] mx-auto">
                            {featuredBook && (
                                <div className="relative group cursor-pointer" onClick={() => onViewDetails(featuredBook)}>
                                    <div className="absolute inset-0 bg-brand-primary rounded-2xl rotate-6 group-hover:rotate-0 transition-transform duration-500"></div>
                                    <OptimizedImage
                                        src={featuredBook.coverUrl}
                                        alt={featuredBook.title}
                                        width={450}
                                        className="relative w-full rounded-2xl shadow-2xl transition-transform duration-500 group-hover:-translate-y-4"
                                        priority={true}
                                        aspectRatio="book"
                                    />
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* LEITURA DO MÊS - Editorial Style */}
            {readingOfMonth && (
                <section className="py-16 sm:py-24 md:py-32 bg-white relative overflow-hidden">
                    <div className="container mx-auto px-4 sm:px-6 md:px-12">
                        <div className="grid lg:grid-cols-2 gap-12 sm:gap-16 lg:gap-24 items-center">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="relative aspect-[3/4] max-w-[280px] sm:max-w-sm lg:max-w-md mx-auto"
                            >
                                <div className="absolute inset-0 bg-brand-primary/5 blur-3xl rounded-full"></div>
                                <OptimizedImage
                                    src={readingOfMonth.coverUrl}
                                    alt={readingOfMonth.title}
                                    className="relative z-10 w-full h-full object-cover rounded-2xl sm:rounded-3xl shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)]"
                                    width={450}
                                    height={600}
                                />
                                <div className="absolute -bottom-4 -right-4 sm:-bottom-10 sm:-right-10 w-28 h-28 sm:w-36 sm:h-36 lg:w-48 lg:h-48 bg-brand-primary rounded-full flex items-center justify-center text-white text-center p-3 sm:p-6 shadow-2xl z-20 rotate-12">
                                    <span className="text-[9px] sm:text-xs font-black uppercase tracking-[0.2em]">Leitura do <br /> Mês</span>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="space-y-4 sm:space-y-8"
                            >
                                <span className="text-brand-primary font-bold uppercase tracking-[0.4em] text-[10px] sm:text-xs">Destaque Editorial</span>
                                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black text-brand-dark uppercase tracking-tighter leading-none">
                                    {readingOfMonth.title}
                                </h2>
                                <p className="text-lg sm:text-2xl font-serif italic text-gray-500">{readingOfMonth.author}</p>
                                <p className="text-base sm:text-xl text-gray-600 leading-relaxed font-light line-clamp-4 sm:line-clamp-none">
                                    {readingOfMonth.description?.substring(0, 280)}...
                                </p>
                                <div className="pt-4 sm:pt-6">
                                    <button
                                        onClick={() => onViewDetails(readingOfMonth)}
                                        className="w-full sm:w-auto px-8 sm:px-12 py-4 sm:py-5 bg-brand-dark text-white font-bold uppercase tracking-widest rounded-xl hover:bg-brand-primary transition-all flex items-center justify-center gap-3 shadow-xl min-touch"
                                    >
                                        Mergulhar na Obra <BookOpen className="w-5 h-5" />
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>
            )}

            {/* UPCOMING RELEASES (Futuros Lançamentos) - Logo após Leitura do Mês */}
            {futureBooks.length > 0 && (
                <section className="relative z-20">
                    <UpcomingReleases books={futureBooks} authors={authors} />

                    {/* AD UNIT — Posicionado estrategicamente após o slider */}
                    <div className="py-8 sm:py-12 bg-gray-50 px-4 sm:px-6 md:px-12">
                        <div className="container mx-auto">
                            <AdUnit
                                slot="SLOT_HORIZONTAL_2"
                                format="auto"
                                className="max-w-4xl mx-auto"
                            />
                        </div>
                    </div>
                </section>
            )}

            {/* Content areas */}

            {/* LIVROS FÍSICOS */}
            {physicalBooks.length > 0 && (
                <section className="py-12 sm:py-16 md:py-24 bg-gray-50 px-4 sm:px-6 md:px-12 [content-visibility:auto] [contain-intrinsic-size:1px_1000px]">
                    <div className="container mx-auto">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-8 sm:mb-16">
                            <div>
                                <span className="text-brand-primary font-bold uppercase tracking-widest text-[10px] sm:text-xs">Coleção Técnica & Literária</span>
                                <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-brand-dark mt-2 uppercase tracking-tight">Livros Físicos</h2>
                            </div>
                            <button onClick={() => navigate('/livros?tipo=fisico')} className="text-brand-dark font-black uppercase tracking-widest text-[10px] border-b-2 border-brand-primary pb-1 hover:text-brand-primary transition-all w-fit min-touch">
                                Ver Catálogo Completo
                            </button>
                        </div>
                        <motion.div
                            variants={stagger}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-12"
                        >
                            {physicalBooks.map(book => (
                                <motion.div key={book.id} variants={fadeInUp}>
                                    <BookCard
                                        book={book}
                                        onViewDetails={onViewDetails}
                                        onAddToCart={onAddToCart}
                                        onToggleWishlist={onToggleWishlist}
                                    />
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>
            )}

            {/* AD UNIT — Entre Físicos e E-Books */}
            <div className="py-8 px-4 sm:px-6 md:px-12 bg-white">
                <div className="container mx-auto">
                    <AdUnit
                        slot="SLOT_HORIZONTAL_1"
                        format="horizontal"
                        className="max-w-4xl mx-auto"
                    />
                </div>
            </div>

            {/* E-BOOKS */}
            {ebooks.length > 0 && (
                <section className="py-12 sm:py-16 md:py-24 bg-white px-4 sm:px-6 md:px-12 [content-visibility:auto] [contain-intrinsic-size:1px_1000px]">
                    <div className="container mx-auto">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-8 sm:mb-16">
                            <div>
                                <span className="text-brand-primary font-bold uppercase tracking-widest text-[10px] sm:text-xs">Biblioteca Digital</span>
                                <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-brand-dark mt-2 uppercase tracking-tight">E-Books</h2>
                            </div>
                            <button onClick={() => navigate('/livros?tipo=digital')} className="text-brand-dark font-black uppercase tracking-widest text-[10px] border-b-2 border-brand-primary pb-1 hover:text-brand-primary transition-all w-fit min-touch">
                                Explorar Digitais
                            </button>
                        </div>
                        <motion.div
                            variants={stagger}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-12"
                        >
                            {ebooks.map(book => (
                                <motion.div key={book.id} variants={fadeInUp}>
                                    <BookCard
                                        book={book}
                                        onViewDetails={onViewDetails}
                                        onAddToCart={onAddToCart}
                                        onToggleWishlist={onToggleWishlist}
                                    />
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>
            )}

            {/* MAIS VISTOS */}
            {mostViewed.length > 0 && (
                <section className="py-12 sm:py-16 md:py-24 bg-white px-4 sm:px-6 md:px-12">
                    <div className="container mx-auto">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-8 sm:mb-16">
                            <div>
                                <span className="text-brand-primary font-bold uppercase tracking-widest text-[10px] sm:text-xs">Tendências do Acervo</span>
                                <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-brand-dark mt-2 uppercase tracking-tight">Obras Mais Vistas</h2>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-500 rounded-full text-[10px] font-black uppercase tracking-widest">
                                <Eye className="w-3 h-3" />
                                <span>Curiosidade em Alta</span>
                            </div>
                        </div>
                        <motion.div
                            variants={stagger}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-12"
                        >
                            {mostViewed.map(book => (
                                <motion.div key={book.id} variants={fadeInUp}>
                                    <BookCard
                                        book={book}
                                        onViewDetails={onViewDetails}
                                        onAddToCart={onAddToCart}
                                        onToggleWishlist={onToggleWishlist}
                                    />
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>
            )}

            {/* AUTORES DE SUCESSO */}
            {topAuthors.length > 0 && (
                <section className="py-12 sm:py-16 md:py-24 bg-gray-50 px-4 sm:px-6 md:px-12">
                    <div className="container mx-auto">
                        <div className="text-center mb-12 sm:mb-20">
                            <span className="text-brand-primary font-bold uppercase tracking-widest text-[10px] sm:text-xs">Elite Intelectual</span>
                            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-brand-dark mt-2 uppercase tracking-tighter">Autores de Sucesso</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {topAuthors.map((ta, i) => (
                                <motion.div
                                    key={ta.id || i}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    viewport={{ once: true }}
                                    className="bg-white p-8 rounded-[2.5rem] border border-gray-100 hover:shadow-2xl transition-all group relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 blur-[60px] rounded-full group-hover:bg-brand-primary/10 transition-colors" />
                                    <div className="flex flex-col items-center text-center space-y-6 relative z-10">
                                        <div className="w-24 h-24 bg-gray-100 rounded-3xl overflow-hidden border-4 border-white shadow-lg">
                                            <img
                                                src={ta.details?.imageUrl || `https://ui-avatars.com/api/?name=${ta.author}&background=C4A052&color=fff`}
                                                alt={ta.author}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-brand-dark uppercase tracking-tight">{ta.author}</h3>
                                            <p className="text-brand-primary text-[10px] font-black uppercase tracking-widest mt-1">Líder de Preferência</p>
                                        </div>
                                        <div className="px-6 py-3 bg-brand-dark text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em]">
                                            {ta.count} Obras Circuladas
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* LIVROS PAGOS */}
            {paidBooks.length > 0 && (
                <section className="py-12 sm:py-16 md:py-24 bg-white px-4 sm:px-6 md:px-12 [content-visibility:auto] [contain-intrinsic-size:1px_1000px]">
                    <div className="container mx-auto">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-8 sm:mb-16">
                            <div>
                                <span className="text-brand-primary font-bold uppercase tracking-widest text-[10px] sm:text-xs">Obras de Excelência</span>
                                <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-brand-dark mt-2 uppercase tracking-tight">Livros Recomendados</h2>
                            </div>
                            <button onClick={() => navigate('/livros?preco=pago')} className="text-brand-dark font-black uppercase tracking-widest text-[10px] border-b-2 border-brand-primary pb-1 hover:text-brand-primary transition-all w-fit min-touch">
                                Ver Coleção Completa
                            </button>
                        </div>
                        <motion.div
                            variants={stagger}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-12"
                        >
                            {paidBooks.map(book => (
                                <motion.div key={book.id} variants={fadeInUp}>
                                    <BookCard
                                        book={book}
                                        onViewDetails={onViewDetails}
                                        onAddToCart={onAddToCart}
                                        onToggleWishlist={onToggleWishlist}
                                    />
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>
            )}

            {/* LIVROS GRATUITOS */}
            {freeBooks.length > 0 && (
                <section className="py-12 sm:py-16 md:py-24 bg-brand-dark text-white px-4 sm:px-6 md:px-12 [content-visibility:auto] [contain-intrinsic-size:1px_1000px]">
                    <div className="container mx-auto">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-8 sm:mb-16">
                            <div>
                                <span className="text-brand-primary font-bold uppercase tracking-widest text-[10px] sm:text-xs">Cultura Aberta</span>
                                <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white mt-2 uppercase tracking-tight">Livros Gratuitos</h2>
                            </div>
                            <button onClick={() => navigate('/livros?preco=gratis')} className="text-brand-dark font-black uppercase tracking-widest text-[10px] border-b-2 border-brand-primary pb-1 hover:text-white transition-all w-fit min-touch">
                                Ver Tudo Grátis
                            </button>
                        </div>
                        <motion.div
                            variants={stagger}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-12"
                        >
                            {freeBooks.map(book => (
                                <motion.div key={book.id} variants={fadeInUp}>
                                    <BookCard
                                        book={book}
                                        onViewDetails={onViewDetails}
                                        onAddToCart={onAddToCart}
                                        onToggleWishlist={onToggleWishlist}
                                    />
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>
            )}

            {/* 3. EXPERIENCE SECTION */}
            <section className="py-16 sm:py-24 md:py-32 bg-brand-dark text-white px-4 sm:px-6 md:px-12 relative overflow-hidden [content-visibility:auto] [contain-intrinsic-size:1px_800px]">
                <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand-primary blur-[120px] rounded-full"></div>
                </div>

                {/* MOST DOWNLOADED */}
                <div className="container mx-auto mb-16 sm:mb-24 md:mb-32 relative z-10 px-4 sm:px-0">
                    <div className="max-w-4xl mx-auto w-full">
                        {/* Most Downloaded Book */}
                        {mostDownloaded && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.98 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="bg-gradient-to-br from-brand-primary to-amber-600 rounded-2xl sm:rounded-[3rem] p-6 sm:p-12 text-white flex flex-col gap-6 sm:gap-8 relative overflow-hidden shadow-2xl"
                            >
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
                                <div className="flex justify-between items-start relative z-10">
                                    <div className="px-4 py-2 bg-white/20 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                                        Mais Baixado
                                    </div>
                                    <div className="flex items-center gap-2 text-white/80 font-bold uppercase tracking-widest text-[10px]">
                                        <TrendingUp className="w-4 h-4" />
                                        Recorde de Vendas
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-5 gap-8 items-center relative z-10">
                                    <div className="sm:col-span-2">
                                        <OptimizedImage
                                            src={mostDownloaded.coverUrl}
                                            alt={mostDownloaded.title}
                                            className="w-full max-w-[200px] sm:max-w-none mx-auto rounded-2xl shadow-2xl rotate-[-5deg] hover:rotate-0 transition-transform duration-500"
                                            width={250}
                                        />
                                    </div>
                                    <div className="sm:col-span-3 space-y-4 text-center sm:text-left">
                                        <h3 className="text-2xl sm:text-3xl font-black uppercase leading-tight line-clamp-2">{mostDownloaded.title}</h3>
                                        <p className="text-white/80 font-bold uppercase tracking-widest text-xs italic">{mostDownloaded.author}</p>
                                        <div className="pt-4 flex flex-col items-center sm:items-start gap-2 text-[10px] font-black uppercase tracking-widest">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-white rounded-full"></div>
                                                <span>{mostDownloaded.stats?.downloads || 0}+ Downloads</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-white rounded-full"></div>
                                                <span>4.9 Avaliação Média</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => onViewDetails(mostDownloaded)}
                                    className="w-full py-5 bg-white text-brand-dark font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-brand-dark hover:text-white transition-all shadow-xl relative z-10"
                                >
                                    Adquirir Obra Agora
                                </button>
                            </motion.div>
                        )}
                    </div>
                </div>

                <div className="container grid lg:grid-cols-2 gap-12 sm:gap-20 items-center relative z-10">
                    <div>
                        <span className="text-brand-primary font-bold uppercase tracking-widest text-xs sm:text-sm">Experiência</span>
                        <h2 className="mt-4 mb-6 sm:mb-8 leading-tight uppercase">
                            Mais que uma editora, <br />um movimento.
                        </h2>
                        <ul className="space-y-4 sm:space-y-6">
                            {(siteContent['home.experience.list'] || [
                                "Acabamentos de luxo em cada edição.",
                                "Curadoria internacional de autores.",
                                "Eventos exclusivos para membros."
                            ]).map((item: string, i: number) => (
                                <li key={i} className="flex items-center gap-4 text-base sm:text-xl font-medium text-gray-300">
                                    <CheckCircle className="w-6 h-6 text-brand-primary shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div className="bg-white/5 p-6 sm:p-8 rounded-2xl sm:rounded-3xl backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
                            <Star className="w-8 h-8 sm:w-10 sm:h-10 text-brand-primary mb-4 sm:mb-6" />
                            <h4 className="text-xl sm:text-2xl font-black mb-2">{siteContent['home.experience.premium_title'] || "Premium"}</h4>
                            <p className="text-xs sm:text-sm text-gray-400">{siteContent['home.experience.premium_desc'] || "Qualidade inegociável em cada página impressa."}</p>
                        </div>
                        <div className="bg-white/5 p-6 sm:p-8 rounded-2xl sm:rounded-3xl backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors sm:translate-y-8 lg:translate-y-12">
                            <Clock className="w-8 h-8 sm:w-10 sm:h-10 text-brand-primary mb-4 sm:mb-6" />
                            <h4 className="text-xl sm:text-2xl font-black mb-2">{siteContent['home.experience.eternal_title'] || "Eterno"}</h4>
                            <p className="text-xs sm:text-sm text-gray-400">{siteContent['home.experience.eternal_desc'] || "Obras feitas para durar gerações."}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. NEWSLETTER - Minimal Line (Dark Theme) */}
            <section className="py-12 sm:py-16 md:py-24 bg-brand-dark px-4 sm:px-6 md:px-12 border-t border-white/10">
                <div className="container mx-auto text-center max-w-3xl">
                    <Mail className="w-10 h-10 sm:w-12 sm:h-12 text-brand-primary mx-auto mb-4 sm:mb-6" />
                    <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-white mb-4 sm:mb-6 uppercase tracking-tight">
                        {siteContent['newsletter.title'] || "Fique a par das novidades"}
                    </h2>
                    <p className="text-gray-400 mb-6 sm:mb-10 text-sm sm:text-lg">
                        {siteContent['newsletter.subtitle'] || "Junte-se à nossa lista exclusiva de leitores e receba atualizações sobre lançamentos."}
                    </p>

                    <form onSubmit={handleSubmit(onSubscribe)} className="flex flex-col sm:flex-row gap-3 sm:gap-4 relative z-10 w-full">
                        <div className="flex-1">
                            <input
                                type="email"
                                placeholder="Seu melhor email"
                                {...register('email')}
                                className="w-full h-14 px-6 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-brand-primary transition-colors"
                            />
                            {errors.email && <p className="text-red-500 text-sm mt-1 text-left">{errors.email.message}</p>}
                        </div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="h-14 px-10 bg-brand-primary text-white font-bold uppercase tracking-widest rounded-xl hover:bg-white hover:text-brand-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Subscrever'}
                        </button>
                    </form>
                </div>
            </section>

        </div >
    );
};

export default HomePage;
