import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Star, Clock, CheckCircle, Mail, Zap, BookOpen } from 'lucide-react';
import { m, Variants } from 'framer-motion';
import { Book, BlogPost } from '../types';
import BookCard from '../components/BookCard';
import { getPublicStats, getBlogPosts, getSiteContent, getTestimonials } from '../services/dataService';
import { optimizeImageUrl } from '../components/OptimizedImage';

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
    const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
    const [siteContent, setSiteContent] = useState<any>({});
    const navigate = useNavigate();

    useEffect(() => {
        const loadData = async () => {
            const [s, b, content] = await Promise.all([
                getPublicStats(),
                getBlogPosts(),
                getSiteContent('home')
            ]);
            setStats(s);
            setRecentPosts(b ? b.slice(0, 3) : []);
            setSiteContent(content || {});
        };
        loadData();
    }, []);

    const upcomingLaunch = books
        .filter(b => b.launchDate && new Date(b.launchDate) > new Date())
        .sort((a, b) => new Date(a.launchDate!).getTime() - new Date(b.launchDate!).getTime())[0];

    // Get Featured Book (Bestseller or just first one)
    const featuredBook = books.find(b => b.featured) || books[0];

    const fadeInUp: Variants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    const stagger: Variants = {
        visible: { transition: { staggerChildren: 0.1 } }
    };

    return (
        <div className="bg-white overflow-hidden font-sans text-brand-dark">
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

                        <m.h1 variants={fadeInUp} className="text-6xl md:text-8xl font-black uppercase leading-[0.9] tracking-tighter">
                            Onde a Arte <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-amber-600">Encontra o Legado</span>
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

            {/* 2. SHOWCASE GRID - Tech Clean */}
            <section className="py-24 bg-gray-50 px-6 md:px-12">
                <div className="container mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                        <div>
                            <span className="text-brand-primary font-bold uppercase tracking-widest text-sm">Catálogo</span>
                            <h2 className="text-4xl md:text-5xl font-black text-brand-dark mt-2 tracking-tight uppercase">Destaques da Coleção</h2>
                        </div>
                        <button onClick={() => navigate('/livros')} className="text-brand-dark font-bold uppercase tracking-widest border-b-2 border-brand-primary pb-1 hover:text-brand-primary transition-colors">
                            Ver Todos os Livros
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {books.slice(0, 4).map(book => (
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

            {/* 3. EXPERIENCE SECTION - Black Blocks */}
            <section className="py-32 bg-brand-dark text-white px-6 md:px-12 relative overflow-hidden">
                <div className="container mx-auto grid lg:grid-cols-2 gap-20 items-center relative z-10">
                    <div>
                        <span className="text-brand-primary font-bold uppercase tracking-widest text-sm">Experiência</span>
                        <h2 className="text-4xl md:text-6xl font-black mt-4 mb-8 leading-tight uppercase">
                            Mais que uma editora, <br />um movimento.
                        </h2>
                        <ul className="space-y-6">
                            {[
                                "Acabamentos de luxo em cada edição.",
                                "Curadoria internacional de autores.",
                                "Eventos exclusivos para membros."
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-4 text-xl font-medium text-gray-300">
                                    <CheckCircle className="w-6 h-6 text-brand-primary shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="bg-white/5 p-8 rounded-3xl backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
                            <Star className="w-10 h-10 text-brand-primary mb-6" />
                            <h4 className="text-2xl font-black mb-2">Premium</h4>
                            <p className="text-sm text-gray-400">Qualidade inegociável em cada página impressa.</p>
                        </div>
                        <div className="bg-white/5 p-8 rounded-3xl backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors translate-y-12">
                            <Clock className="w-10 h-10 text-brand-primary mb-6" />
                            <h4 className="text-2xl font-black mb-2">Eterno</h4>
                            <p className="text-sm text-gray-400">Obras feitas para durar gerações.</p>
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

                    <form className="flex flex-col sm:flex-row gap-4">
                        <input
                            type="email"
                            placeholder="Seu melhor email"
                            className="flex-1 px-6 py-4 bg-gray-50 rounded-xl border border-gray-200 focus:border-brand-dark outline-none font-medium"
                        />
                        <button className="px-10 py-4 bg-brand-dark text-white font-bold uppercase tracking-widest rounded-xl hover:bg-brand-primary transition-colors">
                            Subscrever
                        </button>
                    </form>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
