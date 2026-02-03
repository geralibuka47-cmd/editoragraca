import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ShoppingCart, Star, ChevronLeft, ChevronRight, Play, Download, Loader2, ArrowRight, Clock, CheckCircle, Mail, Zap, TrendingUp } from 'lucide-react';
import { m, AnimatePresence, Variants } from 'framer-motion';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useBookSearch } from '../hooks/useBookSearch';
import { Book, BlogPost } from '../types';
import BookCard from '../components/BookCard';
import { getPublicStats, getBlogPosts, getSiteContent, getTestimonials, getTeamMembers } from '../services/dataService';
import { optimizeImageUrl } from '../components/OptimizedImage';
import SEO from '../components/SEO';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '../components/Toast';

interface HomePageProps {
    books: Book[];
    loading: boolean;
    onViewDetails: (book: Book) => void;
    onAddToCart: (book: Book) => void;
    onToggleWishlist: (book: Book) => void;
    onNavigate: (view: string) => void;
}

const newsletterSchema = z.object({
    email: z.string().email('Introduza um email válido'),
});

type NewsletterFormData = z.infer<typeof newsletterSchema>;

const HomePage: React.FC<HomePageProps> = ({ books, loading, onViewDetails, onAddToCart, onToggleWishlist, onNavigate }) => {
    const [stats, setStats] = useState({ booksCount: 0, authorsCount: 0, readersCount: 0 });
    const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
    const [siteContent, setSiteContent] = useState<any>({});
    const [authors, setAuthors] = useState<any[]>([]);
    const navigate = useNavigate();
    const { showToast } = useToast();

    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<NewsletterFormData>({
        resolver: zodResolver(newsletterSchema)
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                const [s, b, content, team] = await Promise.all([
                    getPublicStats(),
                    getBlogPosts(),
                    getSiteContent('home'),
                    getTeamMembers()
                ]);
                setStats(s);
                setRecentPosts(b ? b.slice(0, 3) : []);
                setSiteContent(content || {});
                setAuthors(team || []);
            } catch (error) {
                console.error("Error loading home data:", error);
            }
        };
        loadData();
    }, []);

    // 1. Reading of the Month (Leitura do Mês)
    const readingOfMonth = books.find(b => b.featured) || books[0];

    // 2. Author of the Month (Autor do Mês)
    const authorOfMonth = authors.find(a => a.featured) || authors[0];

    // 3. Most Downloaded (Livro mais baixado)
    const mostDownloaded = [...books]
        .filter(b => b.format === 'digital' && b.stats?.downloads)
        .sort((a, b) => (b.stats?.downloads || 0) - (a.stats?.downloads || 0))[0] ||
        books.find(b => b.format === 'digital');

    // 4. Categories
    const ebooks = books.filter(b => b.format === 'digital').slice(0, 4);
    const physicalBooks = books.filter(b => b.format === 'físico').slice(0, 4);
    const freeBooks = books.filter(b => b.price === 0).slice(0, 4);

    const upcomingLaunch = books
        .filter(b => b.launchDate && new Date(b.launchDate) > new Date())
        .sort((a, b) => new Date(a.launchDate!).getTime() - new Date(b.launchDate!).getTime())[0];

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
                description={siteContent['hero.description']}
            />
            {/* 1. HERO SECTION - Bold & Geometric */}
            <section className="min-h-screen pt-24 md:pt-32 pb-20 px-6 md:px-12 flex items-center relative">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gray-50 skew-x-12 translate-x-1/3 -z-10"></div>

                <div className="container mx-auto grid lg:grid-cols-2 gap-16 items-center">
                    <m.div
                        initial="hidden"
                        animate="visible"
                        variants={stagger}
                        className="space-y-8"
                    >
                        <m.div variants={fadeInUp} className="inline-flex items-center gap-3 px-4 py-2 bg-brand-dark text-white rounded-lg text-xs font-bold uppercase tracking-widest">
                            <Zap className="w-4 h-4 text-brand-primary" />
                            <span>Nova Era Editorial</span>
                        </m.div>

                        <m.h1 variants={fadeInUp} className="text-5xl sm:text-7xl md:text-8xl font-black uppercase leading-[0.9] tracking-tighter">
                            {siteContent['home.hero.title'] || "Onde a Arte"} <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-amber-600">
                                {siteContent['home.hero.subtitle'] || "Encontra o Legado"}
                            </span>
                        </m.h1>

                        <m.p variants={fadeInUp} className="text-xl md:text-2xl text-gray-500 font-medium max-w-lg leading-relaxed">
                            {siteContent['hero.description'] || "Curadoria de excelência para leitores que exigem o extraordinário."}
                        </m.p>

                        <m.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 pt-4">
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
                                Nossa Essência
                            </button>
                        </m.div>

                        {/* Stats - Horizontal */}
                        <m.div variants={fadeInUp} className="flex items-center gap-12 pt-12 border-t border-gray-100">
                            <div>
                                <p className="text-4xl font-black text-brand-dark">{stats.booksCount}+</p>
                                <p className="text-xs uppercase tracking-widest text-gray-400 font-bold mt-1">Obras Publicadas</p>
                            </div>
                            <div>
                                <p className="text-4xl font-black text-brand-dark">{stats.readersCount}+</p>
                                <p className="text-xs uppercase tracking-widest text-gray-400 font-bold mt-1">Leitores</p>
                            </div>
                        </m.div>
                    </m.div>

                    {/* Hero Image - Architecture */}
                    <m.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="relative hidden lg:block"
                    >
                        <div className="relative z-10 w-[450px] mx-auto">
                            {featuredBook && (
                                <div className="relative group cursor-pointer" onClick={() => onViewDetails(featuredBook)}>
                                    <div className="absolute inset-0 bg-brand-primary rounded-2xl rotate-6 group-hover:rotate-0 transition-transform duration-500"></div>
                                    <img
                                        src={optimizeImageUrl(featuredBook.coverUrl)}
                                        alt={featuredBook.title}
                                        className="relative w-full rounded-2xl shadow-2xl transition-transform duration-500 group-hover:-translate-y-4"
                                    />
                                </div>
                            )}
                        </div>
                    </m.div>
                </div>
            </section>

            {/* LEITURA DO MÊS - Editorial Style */}
            {readingOfMonth && (
                <section className="py-32 bg-white relative overflow-hidden">
                    <div className="container mx-auto px-6 md:px-12">
                        <div className="grid lg:grid-cols-2 gap-24 items-center">
                            <m.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="relative aspect-[3/4] max-w-md mx-auto"
                            >
                                <div className="absolute inset-0 bg-brand-primary/5 blur-3xl rounded-full"></div>
                                <img
                                    src={optimizeImageUrl(readingOfMonth.coverUrl)}
                                    alt={readingOfMonth.title}
                                    className="relative z-10 w-full h-full object-cover rounded-3xl shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)]"
                                />
                                <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-brand-primary rounded-full flex items-center justify-center text-white text-center p-6 shadow-2xl z-20 rotate-12">
                                    <span className="text-xs font-black uppercase tracking-[0.2em]">Leitura do <br /> Mês</span>
                                </div>
                            </m.div>

                            <m.div
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="space-y-8"
                            >
                                <span className="text-brand-primary font-bold uppercase tracking-[0.4em] text-xs">Destaque Editorial</span>
                                <h2 className="text-5xl md:text-7xl font-black text-brand-dark uppercase tracking-tighter leading-none">
                                    {readingOfMonth.title}
                                </h2>
                                <p className="text-2xl font-serif italic text-gray-500">{readingOfMonth.author}</p>
                                <p className="text-xl text-gray-600 leading-relaxed font-light">
                                    {readingOfMonth.description?.substring(0, 280)}...
                                </p>
                                <div className="pt-6">
                                    <button
                                        onClick={() => onViewDetails(readingOfMonth)}
                                        className="px-12 py-5 bg-brand-dark text-white font-bold uppercase tracking-widest rounded-xl hover:bg-brand-primary transition-all flex items-center gap-3 shadow-xl"
                                    >
                                        Mergulhar na Obra <BookOpen className="w-5 h-5" />
                                    </button>
                                </div>
                            </m.div>
                        </div>
                    </div>
                </section>
            )}

            {/* LIVROS FÍSICOS */}
            {physicalBooks.length > 0 && (
                <section className="py-24 bg-gray-50 px-6 md:px-12">
                    <div className="container mx-auto">
                        <div className="flex justify-between items-end mb-16">
                            <div>
                                <span className="text-brand-primary font-bold uppercase tracking-widest text-xs">Coleção Técnica & Literária</span>
                                <h2 className="text-4xl md:text-5xl font-black text-brand-dark mt-2 uppercase tracking-tight">Livros Físicos</h2>
                            </div>
                            <button onClick={() => navigate('/livros?tipo=fisico')} className="text-brand-dark font-black uppercase tracking-widest text-[10px] border-b-2 border-brand-primary pb-1 hover:text-brand-primary transition-all">
                                Ver Catálogo Completo
                            </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                            {physicalBooks.map(book => (
                                <BookCard
                                    key={book.id}
                                    book={book}
                                    onViewDetails={onViewDetails}
                                    onAddToCart={onAddToCart}
                                    onToggleWishlist={onToggleWishlist}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* E-BOOKS */}
            {ebooks.length > 0 && (
                <section className="py-24 bg-white px-6 md:px-12">
                    <div className="container mx-auto">
                        <div className="flex justify-between items-end mb-16">
                            <div>
                                <span className="text-brand-primary font-bold uppercase tracking-widest text-xs">Biblioteca Digital</span>
                                <h2 className="text-4xl md:text-5xl font-black text-brand-dark mt-2 uppercase tracking-tight">E-Books</h2>
                            </div>
                            <button onClick={() => navigate('/livros?tipo=digital')} className="text-brand-dark font-black uppercase tracking-widest text-[10px] border-b-2 border-brand-primary pb-1 hover:text-brand-primary transition-all">
                                Explorar Digitais
                            </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                            {ebooks.map(book => (
                                <BookCard
                                    key={book.id}
                                    book={book}
                                    onViewDetails={onViewDetails}
                                    onAddToCart={onAddToCart}
                                    onToggleWishlist={onToggleWishlist}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* LIVROS GRATUITOS */}
            {freeBooks.length > 0 && (
                <section className="py-24 bg-brand-dark text-white px-6 md:px-12">
                    <div className="container mx-auto">
                        <div className="flex justify-between items-end mb-16">
                            <div>
                                <span className="text-brand-primary font-bold uppercase tracking-widest text-xs">Cultura Aberta</span>
                                <h2 className="text-4xl md:text-5xl font-black text-white mt-2 uppercase tracking-tight">Livros Gratuitos</h2>
                            </div>
                            <button onClick={() => navigate('/livros?preco=gratis')} className="text-brand-primary font-black uppercase tracking-widest text-[10px] border-b-2 border-brand-primary pb-1 hover:text-white transition-all">
                                Ver Tudo Grátis
                            </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                            {freeBooks.map(book => (
                                <BookCard
                                    key={book.id}
                                    book={book}
                                    onViewDetails={onViewDetails}
                                    onAddToCart={onAddToCart}
                                    onToggleWishlist={onToggleWishlist}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* 3. EXPERIENCE SECTION - Black Blocks */}
            <section className="py-32 bg-brand-dark text-white px-6 md:px-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand-primary blur-[120px] rounded-full"></div>
                </div>

                {/* AUTHOR OF THE MONTH & MOST DOWNLOADED */}
                <div className="container mx-auto mb-32 grid lg:grid-cols-2 gap-12 items-stretch relative z-10">
                    {/* Author of the Month */}
                    {authorOfMonth && (
                        <m.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="bg-white/5 border border-white/10 rounded-[3rem] p-12 backdrop-blur-md flex flex-col items-center text-center gap-8 relative group"
                        >
                            <div className="absolute top-8 left-12 px-4 py-2 bg-brand-primary text-white text-[10px] font-black uppercase tracking-widest rounded-full z-20">
                                Autor em Destaque
                            </div>
                            <div className="relative w-48 h-48">
                                <div className="absolute inset-0 bg-brand-primary rounded-full scale-110 blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                                <img
                                    src={optimizeImageUrl(authorOfMonth.photoUrl || authorOfMonth.avatarUrl)}
                                    alt={authorOfMonth.name}
                                    className="relative w-full h-full object-cover rounded-full border-4 border-white/10"
                                />
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-4xl font-black uppercase tracking-tight">{authorOfMonth.name}</h3>
                                <p className="text-brand-primary font-bold uppercase tracking-[0.3em] text-[10px]">{authorOfMonth.role || 'Autor de Excelência'}</p>
                                <p className="text-gray-400 text-lg leading-relaxed max-w-sm italic">
                                    "{authorOfMonth.bio?.substring(0, 150)}..."
                                </p>
                            </div>
                            <button
                                onClick={() => navigate('/sobre')}
                                className="px-8 py-4 bg-white text-brand-dark font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-brand-primary hover:text-white transition-all shadow-xl"
                            >
                                Conhecer Autor
                            </button>
                        </m.div>
                    )}

                    {/* Most Downloaded Book */}
                    {mostDownloaded && (
                        <m.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="bg-gradient-to-br from-brand-primary to-amber-600 rounded-[3rem] p-12 text-white flex flex-col gap-8 relative overflow-hidden shadow-2xl"
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
                                    <img
                                        src={optimizeImageUrl(mostDownloaded.coverUrl)}
                                        alt={mostDownloaded.title}
                                        className="w-full max-w-[200px] sm:max-w-none mx-auto rounded-2xl shadow-2xl rotate-[-5deg] hover:rotate-0 transition-transform duration-500"
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
                        </m.div>
                    )}
                </div>

                <div className="container mx-auto grid lg:grid-cols-2 gap-20 items-center relative z-10">
                    <div>
                        <span className="text-brand-primary font-bold uppercase tracking-widest text-sm">Experiência</span>
                        <h2 className="text-4xl md:text-6xl font-black mt-4 mb-8 leading-tight uppercase">
                            Mais que uma editora, <br />um movimento.
                        </h2>
                        <ul className="space-y-6">
                            {(siteContent['home.experience.list'] || [
                                "Acabamentos de luxo em cada edição.",
                                "Curadoria internacional de autores.",
                                "Eventos exclusivos para membros."
                            ]).map((item: string, i: number) => (
                                <li key={i} className="flex items-center gap-4 text-xl font-medium text-gray-300">
                                    <CheckCircle className="w-6 h-6 text-brand-primary shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="bg-white/5 p-8 rounded-3xl backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
                            <Star className="w-10 h-10 text-brand-primary mb-6" />
                            <h4 className="text-2xl font-black mb-2">{siteContent['home.experience.premium_title'] || "Premium"}</h4>
                            <p className="text-sm text-gray-400">{siteContent['home.experience.premium_desc'] || "Qualidade inegociável em cada página impressa."}</p>
                        </div>
                        <div className="bg-white/5 p-8 rounded-3xl backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors sm:translate-y-12">
                            <Clock className="w-10 h-10 text-brand-primary mb-6" />
                            <h4 className="text-2xl font-black mb-2">{siteContent['home.experience.eternal_title'] || "Eterno"}</h4>
                            <p className="text-sm text-gray-400">{siteContent['home.experience.eternal_desc'] || "Obras feitas para durar gerações."}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. NEWSLETTER - Minimal Line */}
            <section className="py-24 bg-white px-6 md:px-12 border-t border-gray-100">
                <div className="container mx-auto text-center max-w-3xl">
                    <Mail className="w-12 h-12 text-brand-dark mx-auto mb-6" />
                    <h2 className="text-3xl md:text-5xl font-black text-brand-dark mb-6 uppercase tracking-tight">Fique a par das novidades</h2>
                    <p className="text-gray-500 mb-10 text-lg">Junte-se à nossa lista exclusiva de leitores e receba atualizações sobre lançamentos.</p>

                    <form onSubmit={handleSubmit(onSubscribe)} className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <Input
                                variant="light"
                                type="email"
                                placeholder="Seu melhor email"
                                {...register('email')}
                                error={errors.email?.message}
                                className="h-14"
                            />
                        </div>
                        <Button
                            type="submit"
                            isLoading={isSubmitting}
                            className="px-10 h-14"
                        >
                            Subscrever
                        </Button>
                    </form>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
