import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Search, X, Filter, BookOpen, Star, LayoutGrid, List, Sliders, Sparkles,
    ArrowRight, ChevronRight, Hash, Bookmark, Layers, TrendingUp, BookCopy
} from 'lucide-react';
import { m, AnimatePresence } from 'framer-motion';
import { Book } from '../types';
import BookCard from '../components/BookCard';
import { BookCardSkeleton } from '../components/Skeleton';
import { PageHero } from '../components/PageHero';
import { OptimizedImage } from '../components/OptimizedImage';
import SEO from '../components/SEO';
import { isReleased } from '../services/dataService';

interface LibraryPageProps {
    books: Book[];
    loading?: boolean;
    onAddToCart: (book: Book) => void;
    onToggleWishlist: (book: Book) => void;
    onViewDetails: (book: Book) => void;
}

const LibraryPage: React.FC<LibraryPageProps> = ({
    books,
    loading = false,
    onAddToCart,
    onToggleWishlist,
    onViewDetails
}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('Todos');
    const [selectedFormat, setSelectedFormat] = useState<'all' | 'físico' | 'digital'>('all');
    const [sortBy, setSortBy] = useState('title-asc');
    const [showFilters, setShowFilters] = useState(false);
    const [priceRange, setPriceRange] = useState<'all' | 'low' | 'mid' | 'high'>('all');
    const [activeView, setActiveView] = useState<'grid' | 'list'>('grid');

    // Sync with URL params if any
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tipo = params.get('tipo');
        const query = params.get('q');

        if (tipo === 'digital') setSelectedFormat('digital');
        if (tipo === 'fisico') setSelectedFormat('físico');
        if (query) setSearchQuery(query);

        const pendingSearch = localStorage.getItem('pendingSearch');
        if (pendingSearch) {
            setSearchQuery(pendingSearch);
            localStorage.removeItem('pendingSearch');
        }
    }, [location.search]);

    const genres = useMemo(() => {
        const gens = new Set(books.map(b => b.genre));
        return ['Todos', ...Array.from(gens).sort()];
    }, [books]);

    const filteredBooks = useMemo(() => {
        let result = books.filter((b: Book) => isReleased(b.launchDate));

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(book =>
                book.title.toLowerCase().includes(query) ||
                book.author.toLowerCase().includes(query) ||
                (book.description || '').toLowerCase().includes(query)
            );
        }

        if (selectedGenre !== 'Todos') {
            result = result.filter(book => book.genre === selectedGenre);
        }

        if (selectedFormat !== 'all') {
            result = result.filter(book => book.format === selectedFormat);
        }

        if (priceRange === 'low') {
            result = result.filter(book => book.price < 3500);
        } else if (priceRange === 'mid') {
            result = result.filter(book => book.price >= 3500 && book.price < 7000);
        } else if (priceRange === 'high') {
            result = result.filter(book => book.price >= 7000);
        }

        if (sortBy === 'title-asc') {
            result.sort((a, b) => a.title.localeCompare(b.title));
        } else if (sortBy === 'title-desc') {
            result.sort((a, b) => b.title.localeCompare(a.title));
        } else if (sortBy === 'price-asc') {
            result.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'price-desc') {
            result.sort((a, b) => b.price - a.price);
        } else if (sortBy === 'newest') {
            result.sort((a, b) => {
                const dateA = a.launchDate ? new Date(a.launchDate).getTime() : 0;
                const dateB = b.launchDate ? new Date(b.launchDate).getTime() : 0;
                return dateB - dateA;
            });
        }

        return result;
    }, [books, searchQuery, selectedGenre, selectedFormat, sortBy, priceRange]);

    const clearAllFilters = () => {
        setSearchQuery('');
        setSelectedGenre('Todos');
        setSelectedFormat('all');
        setSortBy('title-asc');
        setPriceRange('all');
    };

    const activeFiltersCount = useMemo(() => {
        return [
            selectedGenre !== 'Todos',
            selectedFormat !== 'all',
            priceRange !== 'all',
            searchQuery.trim() !== ''
        ].filter(Boolean).length;
    }, [selectedGenre, selectedFormat, priceRange, searchQuery]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-white font-sans text-brand-dark selection:bg-brand-primary selection:text-white">
            <SEO
                title="Biblioteca & Acervo"
                description="Explore nossa vasta coleção de obras literárias, desde clássicos a contemporâneos angolanos."
            />

            <PageHero
                title={<>O Nosso <br /><span className="text-brand-primary italic font-serif font-normal lowercase text-4xl sm:text-6xl md:text-8xl">Catálogo</span></>}
                subtitle="Um repositório vivo de conhecimento e cultura angolana, selecionado com rigor e paixão editorial."
                breadcrumb={[{ label: 'Acervo Literário' }]}
                decorativeText="CATÁLOGO"
                titleClassName="text-4xl sm:text-5xl md:text-7xl lg:text-[10rem] font-black uppercase leading-[0.8] tracking-tighter mb-4"
            />

            {/* Sidebar & Grid Layout */}
            <div className="container mx-auto px-4 sm:px-6 md:px-12 py-12 md:py-20">
                <div className="flex flex-col lg:flex-row gap-12">

                    {/* Glass Side Filter - Desktop */}
                    <aside className="hidden lg:block w-80 shrink-0 space-y-10 sticky top-32 h-fit">
                        <div className="bg-gray-50/50 backdrop-blur-xl p-10 rounded-[3rem] border border-gray-100 space-y-12">
                            {/* Search Small */}
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-primary ml-2">Pesquisa Local</label>
                                <div className="relative group">
                                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-brand-primary transition-colors" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Título ou autor..."
                                        className="w-full pl-14 pr-6 py-4 bg-white rounded-2xl border-none text-xs font-bold focus:ring-4 focus:ring-brand-primary/5 transition-all shadow-sm"
                                    />
                                </div>
                            </div>

                            {/* Genres List */}
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-primary ml-2">Géneros Literários</label>
                                <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                                    {genres.map(genre => (
                                        <button
                                            key={genre}
                                            onClick={() => setSelectedGenre(genre)}
                                            className={`w-full text-left px-6 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between group ${selectedGenre === genre ? 'bg-brand-dark text-white' : 'hover:bg-brand-light text-gray-500'
                                                }`}
                                        >
                                            {genre}
                                            <ChevronRight className={`w-3 h-3 transition-transform ${selectedGenre === genre ? 'translate-x-0' : '-translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0'}`} />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Format Toggle */}
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-primary ml-2">Formato da Obra</label>
                                <div className="grid grid-cols-1 gap-2">
                                    <button
                                        onClick={() => setSelectedFormat('all')}
                                        className={`px-6 py-3 rounded-xl text-xs font-bold border transition-all text-center ${selectedFormat === 'all' ? 'bg-brand-primary text-white border-brand-primary shadow-lg shadow-brand-primary/20' : 'bg-white text-gray-400 border-gray-100'}`}
                                    >
                                        Todos os Formatos
                                    </button>
                                    <button
                                        onClick={() => setSelectedFormat('digital')}
                                        className={`px-6 py-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-3 ${selectedFormat === 'digital' ? 'bg-brand-dark text-white border-brand-dark' : 'bg-white text-gray-400 border-gray-100'}`}
                                    >
                                        <Layers className="w-3 h-4" /> E-Books
                                    </button>
                                    <button
                                        onClick={() => setSelectedFormat('físico')}
                                        className={`px-6 py-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-3 ${selectedFormat === 'físico' ? 'bg-brand-dark text-white border-brand-dark' : 'bg-white text-gray-400 border-gray-100'}`}
                                    >
                                        <BookCopy className="w-3 h-4" /> Edições Físicas
                                    </button>
                                </div>
                            </div>

                            {/* Clear All */}
                            {activeFiltersCount > 0 && (
                                <button
                                    onClick={clearAllFilters}
                                    className="w-full py-4 text-[9px] font-black uppercase tracking-widest text-red-500 border border-red-100 rounded-xl hover:bg-red-50 transition-all flex items-center justify-center gap-2"
                                >
                                    <X className="w-3 h-3" /> Limpar Filtros
                                </button>
                            )}
                        </div>

                        {/* Promo Card */}
                        <div className="bg-brand-dark p-8 rounded-[3rem] text-white space-y-4 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/20 blur-2xl rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>
                            <Star className="w-8 h-8 text-brand-primary" />
                            <h4 className="text-xl font-black uppercase tracking-tighter">Torne-se <br />Membro Premium</h4>
                            <p className="text-xs text-gray-400 leading-relaxed font-medium">Acesso antecipado a lançamentos e edições de colecionador.</p>
                            <button className="text-[10px] font-black uppercase tracking-widest text-brand-primary flex items-center gap-2 group-hover:gap-4 transition-all">
                                Saber Mais <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <main className="flex-grow space-y-12">

                        {/* Mobile Search & Filter Trigger */}
                        <div className="lg:hidden space-y-6">
                            <div className="relative">
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Encontre o seu próximo livro..."
                                    className="w-full pl-16 pr-6 h-16 bg-gray-50 rounded-2xl border-none font-bold text-sm focus:ring-4 focus:ring-brand-primary/5 shadow-sm"
                                />
                            </div>
                            <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar whitespace-nowrap">
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className={`flex items-center gap-3 px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg ${showFilters ? 'bg-brand-primary text-white shadow-brand-primary/20' : 'bg-brand-dark text-white shadow-brand-dark/20'}`}
                                >
                                    <Filter className="w-4 h-4" /> Filtros {activeFiltersCount > 0 && `(${activeFiltersCount})`}
                                </button>
                                {genres.slice(0, 5).map(g => (
                                    <button
                                        key={g}
                                        onClick={() => setSelectedGenre(g)}
                                        className={`px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg transition-all ${selectedGenre === g ? 'bg-brand-dark text-white' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
                                    >
                                        {g}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Top Controls: View Toggle & Sorting */}
                        <div className="flex flex-col sm:flex-row justify-between items-center bg-gray-50/50 p-4 rounded-[2rem] border border-gray-100 gap-4">
                            <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
                                <button
                                    onClick={() => setActiveView('grid')}
                                    aria-label="Ver em grelha"
                                    title="Ver em grelha"
                                    className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${activeView === 'grid' ? 'bg-brand-primary text-white shadow-md' : 'text-gray-300 hover:bg-gray-50'}`}
                                >
                                    <LayoutGrid className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setActiveView('list')}
                                    aria-label="Ver em lista"
                                    title="Ver em lista"
                                    className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${activeView === 'list' ? 'bg-brand-primary text-white shadow-md' : 'text-gray-300 hover:bg-gray-50'}`}
                                >
                                    <List className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="flex-grow hidden sm:block h-[1px] bg-gray-200 mx-8"></div>

                            <div className="flex items-center gap-3">
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Ordenar:</span>
                                <div className="relative">
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        aria-label="Ordenar livros por"
                                        title="Ordenar livros por"
                                        className="appearance-none pl-6 pr-12 py-3 bg-white rounded-xl border border-gray-100 text-xs font-bold text-brand-dark focus:ring-4 focus:ring-brand-primary/5 cursor-pointer shadow-sm"
                                    >
                                        <option value="title-asc">A-Z Alfabeto</option>
                                        <option value="title-desc">Z-A Alfabeto</option>
                                        <option value="price-asc">Preço Crescente</option>
                                        <option value="price-desc">Preço Decrescente</option>
                                        <option value="newest">Recém-chegados</option>
                                    </select>
                                    <Sliders className="absolute right-4 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-300 pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        {/* Book Grid Area */}
                        <AnimatePresence mode='wait'>
                            {loading ? (
                                <m.div
                                    key="skeleton"
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="hidden"
                                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12"
                                >
                                    {Array(6).fill(0).map((_, i) => <BookCardSkeleton key={i} />)}
                                </m.div>
                            ) : filteredBooks.length > 0 ? (
                                <m.div
                                    key="results"
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="hidden"
                                    className={activeView === 'grid'
                                        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12"
                                        : "flex flex-col gap-6"
                                    }
                                >
                                    {filteredBooks.map((book) => (
                                        <m.div key={book.id} variants={itemVariants}>
                                            <BookCard
                                                book={book}
                                                onAddToCart={onAddToCart}
                                                onToggleWishlist={onToggleWishlist}
                                                onViewDetails={onViewDetails}
                                            />
                                        </m.div>
                                    ))}
                                </m.div>
                            ) : (
                                <m.div
                                    key="empty"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="py-32 text-center space-y-8 bg-gray-50 rounded-[4rem] border-2 border-dashed border-gray-200"
                                >
                                    <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center mx-auto text-gray-200 shadow-xl ring-8 ring-brand-primary/5">
                                        <BookOpen className="w-10 h-10" />
                                    </div>
                                    <div className="space-y-3">
                                        <h3 className="text-3xl font-black text-brand-dark uppercase tracking-tighter">Nenhuma obra encontrada</h3>
                                        <p className="text-gray-500 font-medium text-sm leading-relaxed max-w-sm mx-auto italic">
                                            Não existem obras que coincidam com estes critérios. Tente redefinir a sua busca intelectual.
                                        </p>
                                    </div>
                                    <button
                                        onClick={clearAllFilters}
                                        className="px-12 py-5 bg-brand-dark text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-brand-dark/20 hover:bg-brand-primary transition-all active:scale-95"
                                    >
                                        Limpar Tudo
                                    </button>
                                </m.div>
                            )}
                        </AnimatePresence>

                        {/* Pagination or Load More - Placeholder */}
                        {!loading && filteredBooks.length > 0 && (
                            <div className="flex flex-col items-center gap-6 pt-12 border-t border-gray-100">
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">A exibir {filteredBooks.length} de {books.length} obras</p>
                                <div className="flex items-center gap-4">
                                    <button
                                        aria-label="Página anterior"
                                        title="Página anterior"
                                        className="w-12 h-12 rounded-xl flex items-center justify-center border border-gray-100 text-gray-300 hover:border-brand-primary hover:text-brand-primary transition-all disabled:opacity-30"
                                        disabled
                                    >
                                        <ChevronRight className="w-5 h-5 rotate-180" />
                                    </button>
                                    <div className="flex gap-2">
                                        <button className="w-12 h-12 rounded-xl bg-brand-dark text-white font-bold text-xs shadow-lg">1</button>
                                        <button className="w-12 h-12 rounded-xl bg-white border border-gray-100 text-gray-500 font-bold text-xs hover:border-brand-primary hover:text-brand-primary transition-all">2</button>
                                    </div>
                                    <button
                                        aria-label="Próxima página"
                                        title="Próxima página"
                                        className="w-12 h-12 rounded-xl flex items-center justify-center border border-gray-100 text-gray-300 hover:border-brand-primary hover:text-brand-primary transition-all"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            </div>

            {/* Premium Footer Section */}
            <section className="py-24 bg-brand-dark text-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
                    <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[100%] bg-brand-primary blur-[150px] rounded-full"></div>
                </div>

                <div className="container mx-auto px-4 sm:px-6 md:px-12 relative z-10 grid lg:grid-cols-2 gap-20 items-center">
                    <div className="space-y-8 text-center lg:text-left">
                        <TrendingUp className="w-12 h-12 text-brand-primary mx-auto lg:mx-0" />
                        <h2 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase leading-none tracking-tighter">O seu próximo <br /><span className="text-brand-primary">legado</span> literário</h2>
                        <p className="text-lg text-gray-400 font-medium max-w-xl mx-auto lg:mx-0">
                            A curadoria da Editora Graça foca-se na qualidade e profundidade de cada obra. Cada livro da nossa biblioteca é um investimento no saber angolano.
                        </p>
                        <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                            <div className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl">
                                <p className="text-2xl font-black">{books.length}+</p>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Títulos</p>
                            </div>
                            <div className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl">
                                <p className="text-2xl font-black">20+</p>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Géneros</p>
                            </div>
                            <div className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl">
                                <p className="text-2xl font-black">100%</p>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Qualidade</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[3rem] p-12 text-brand-dark space-y-8 shadow-2xl">
                        <div className="space-y-2">
                            <h3 className="text-2xl md:text-4xl font-black uppercase tracking-tighter italic">Recomendação Editorial</h3>
                            <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Destaque Semanal</p>
                        </div>
                        <div className="flex items-center gap-8">
                            <div className="w-32 h-44 bg-gray-100 rounded-xl overflow-hidden shadow-xl shrink-0">
                                {books[0] && (
                                    <OptimizedImage
                                        src={books[0].coverUrl}
                                        alt={books[0].title}
                                        className="w-full h-full object-cover"
                                        aspectRatio="book"
                                        width={200}
                                    />
                                )}
                            </div>
                            <div className="space-y-4">
                                <h4 className="text-xl font-black uppercase tracking-tight leading-none">{books[0]?.title}</h4>
                                <p className="text-brand-primary font-serif italic text-lg">{books[0]?.author}</p>
                                <button
                                    onClick={() => books[0] && onViewDetails(books[0])}
                                    className="px-8 py-3 bg-brand-dark text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-primary transition-all"
                                >
                                    Ver Detalhes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LibraryPage;
