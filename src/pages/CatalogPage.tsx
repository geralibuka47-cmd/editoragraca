import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, X, ArrowRight, Filter, BookOpen, Loader2, Sparkles, Star, LayoutGrid, List, Sliders } from 'lucide-react';
import { m, AnimatePresence, Variants } from 'framer-motion';
import { Book } from '../types';
import BookCard from '../components/BookCard';
import { BookCardSkeleton } from '../components/Skeleton';

interface CatalogPageProps {
    books: Book[];
    loading?: boolean;
    onAddToCart: (book: Book) => void;
    onToggleWishlist: (book: Book) => void;
    onViewDetails: (book: Book) => void;
}

const CatalogPage: React.FC<CatalogPageProps> = ({
    books,
    loading = false,
    onAddToCart,
    onToggleWishlist,
    onViewDetails
}) => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('Todos');
    const [sortBy, setSortBy] = useState('title-asc');
    const [showFilters, setShowFilters] = useState(false);
    const [priceRange, setPriceRange] = useState<'all' | 'low' | 'mid' | 'high'>('all');
    const [showOnlyNew, setShowOnlyNew] = useState(false);
    const [showOnlyBestsellers, setShowOnlyBestsellers] = useState(false);

    useEffect(() => {
        const pendingSearch = localStorage.getItem('pendingSearch');
        if (pendingSearch) {
            setSearchQuery(pendingSearch);
            localStorage.removeItem('pendingSearch');
        }
    }, []);

    const genres = useMemo(() => {
        const gens = new Set(books.map(b => b.genre));
        return ['Todos', ...Array.from(gens).sort()];
    }, [books]);

    const filteredBooks = useMemo(() => {
        let result = [...books];

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

        if (priceRange === 'low') {
            result = result.filter(book => book.price < 3500);
        } else if (priceRange === 'mid') {
            result = result.filter(book => book.price >= 3500 && book.price < 4500);
        } else if (priceRange === 'high') {
            result = result.filter(book => book.price >= 4500);
        }

        if (showOnlyNew) {
            result = result.filter(book => book.isNew);
        }

        if (showOnlyBestsellers) {
            result = result.filter(book => book.isBestseller);
        }

        if (sortBy === 'title-asc') {
            result.sort((a, b) => a.title.localeCompare(b.title));
        } else if (sortBy === 'title-desc') {
            result.sort((a, b) => b.title.localeCompare(a.title));
        } else if (sortBy === 'price-asc') {
            result.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'price-desc') {
            result.sort((a, b) => b.price - a.price);
        }

        return result;
    }, [books, searchQuery, selectedGenre, sortBy, priceRange, showOnlyNew, showOnlyBestsellers]);

    const clearAllFilters = () => {
        setSearchQuery('');
        setSelectedGenre('Todos');
        setSortBy('title-asc');
        setPriceRange('all');
        setShowOnlyNew(false);
        setShowOnlyBestsellers(false);
    };

    const activeFiltersCount = [
        selectedGenre !== 'Todos' ? 1 : 0,
        priceRange !== 'all' ? 1 : 0,
        showOnlyNew ? 1 : 0,
        showOnlyBestsellers ? 1 : 0,
        searchQuery.trim() ? 1 : 0,
    ].reduce((a, b) => a + b, 0);

    return (
        <div className="min-h-screen bg-white font-sans text-brand-dark overflow-x-hidden">
            {/* Nav Padding Spacer */}
            <div className="h-20 md:h-24 bg-brand-dark"></div>

            {/* 1. CINEMATIC HERO SECTION */}
            <section className="relative bg-brand-dark text-white pt-24 pb-48 md:pt-32 md:pb-64 overflow-hidden">
                {/* Background Decorative Text */}
                <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/4 select-none pointer-events-none opacity-[0.03] whitespace-nowrap">
                    <span className="text-[30rem] font-black uppercase tracking-tighter leading-none">
                        ACERVO
                    </span>
                </div>

                <div className="container mx-auto px-6 md:px-12 relative z-10">
                    <m.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-5xl"
                    >
                        {/* Breadcrumbs */}
                        <div className="flex items-center gap-4 text-[10px] text-brand-primary font-black uppercase tracking-[0.4em] mb-12">
                            <button onClick={() => navigate('/')} className="hover:text-white transition-colors">Início</button>
                            <span className="text-gray-700">/</span>
                            <span className="text-white">Curadoria Literária</span>
                        </div>

                        <h1 className="text-6xl md:text-[10rem] font-black uppercase leading-[0.8] tracking-tighter mb-12">
                            Explorar <br />
                            <span className="text-brand-primary italic font-serif font-normal lowercase md:text-[8rem]">Literatura</span>
                        </h1>
                        <p className="text-xl md:text-3xl text-gray-400 font-light leading-relaxed max-w-2xl">
                            Uma seleção rigorosa de obras que definem o <span className="text-white font-black italic">status quo</span> da escrita contemporânea em Angola.
                        </p>
                    </m.div>
                </div>

                {/* Aesthetic Gradient Bottom */}
                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent"></div>
            </section>

            {/* 2. SMART SEARCH & FILTER BAR */}
            <section className="sticky top-20 md:top-24 z-40 -mt-16 md:-mt-24">
                <div className="container mx-auto px-6 md:px-12">
                    <div className="bg-white/80 backdrop-blur-2xl p-4 md:p-8 rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border border-white flex flex-col xl:flex-row gap-6 items-center">

                        {/* Search Block */}
                        <div className="flex-grow w-full relative group">
                            <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-brand-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Busque por título, autor ou essência..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-20 pr-12 py-5 md:py-6 bg-gray-50 border-0 rounded-[2rem] focus:bg-white focus:ring-4 focus:ring-brand-primary/5 transition-all font-bold text-brand-dark placeholder:text-gray-300 placeholder:font-black placeholder:uppercase placeholder:text-[10px] placeholder:tracking-widest"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    title="Limpar pesquisa"
                                    aria-label="Limpar pesquisa"
                                    className="absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-gray-400 hover:text-brand-primary transition-all"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            )}
                        </div>

                        {/* Controls Block */}
                        <div className="flex flex-wrap sm:flex-nowrap gap-4 w-full xl:w-auto">
                            <div className="relative flex-grow sm:w-64">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    title="Ordenar obras por"
                                    aria-label="Ordenar obras por"
                                    className="w-full pl-8 pr-12 py-6 bg-gray-50 border-0 rounded-[2rem] font-black text-[10px] uppercase tracking-widest text-brand-dark focus:ring-4 focus:ring-brand-primary/5 appearance-none cursor-pointer"
                                >
                                    <option value="title-asc">A-Z (Alfabética)</option>
                                    <option value="title-desc">Z-A (Inverso)</option>
                                    <option value="price-asc">Preço Ascendente</option>
                                    <option value="price-desc">Preço Descendente</option>
                                </select>
                                <Sliders className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
                            </div>

                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`px-10 py-6 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-4 shadow-xl ${showFilters || activeFiltersCount > 0
                                    ? 'bg-brand-primary text-white shadow-brand-primary/30'
                                    : 'bg-brand-dark text-white hover:bg-brand-primary'
                                    }`}
                            >
                                <Filter className="w-5 h-5" />
                                <span>Filtros</span>
                                {activeFiltersCount > 0 && (
                                    <span className="w-6 h-6 bg-white text-brand-primary rounded-lg flex items-center justify-center text-[10px] font-black">
                                        {activeFiltersCount}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Expandable Filter Panel */}
                    <AnimatePresence>
                        {showFilters && (
                            <m.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden bg-white/50 backdrop-blur-md mt-4 rounded-[3rem] border border-gray-100"
                            >
                                <div className="p-10 md:p-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">

                                    {/* Genres */}
                                    <div className="space-y-8">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-primary">Género Literário</h4>
                                        <div className="flex flex-wrap gap-3">
                                            {genres.map(gen => (
                                                <button
                                                    key={gen}
                                                    onClick={() => setSelectedGenre(gen)}
                                                    className={`px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedGenre === gen
                                                        ? 'bg-brand-dark text-white shadow-lg shadow-brand-dark/20'
                                                        : 'bg-white text-gray-400 hover:text-brand-dark border border-gray-100 hover:border-brand-dark'
                                                        }`}
                                                >
                                                    {gen}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Investment */}
                                    <div className="space-y-8">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-primary">Investimento</h4>
                                        <div className="grid gap-3">
                                            {[
                                                { id: 'all', label: 'Todas as Faixas' },
                                                { id: 'low', label: 'Económicos (< 3.500 kz)' },
                                                { id: 'mid', label: 'Premium (3.500 - 4.500 kz)' },
                                                { id: 'high', label: 'Exclusivos (> 4.500 kz)' }
                                            ].map(range => (
                                                <button
                                                    key={range.id}
                                                    onClick={() => setPriceRange(range.id as any)}
                                                    className={`w-full text-left px-6 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${priceRange === range.id
                                                        ? 'bg-brand-dark text-white shadow-lg shadow-brand-dark/20'
                                                        : 'bg-white text-gray-400 hover:text-brand-dark border border-gray-100 hover:border-brand-dark'
                                                        }`}
                                                >
                                                    {range.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Exclusives */}
                                    <div className="space-y-8">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-primary">Destaques</h4>
                                        <div className="space-y-4">
                                            <button
                                                onClick={() => setShowOnlyNew(!showOnlyNew)}
                                                className={`w-full flex items-center justify-between px-6 py-5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${showOnlyNew
                                                    ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20'
                                                    : 'bg-white text-gray-400 hover:text-amber-500 border border-gray-100 hover:border-amber-500'
                                                    }`}
                                            >
                                                Novas Edições <Sparkles className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => setShowOnlyBestsellers(!showOnlyBestsellers)}
                                                className={`w-full flex items-center justify-between px-6 py-5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${showOnlyBestsellers
                                                    ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20'
                                                    : 'bg-white text-gray-400 hover:text-brand-primary border border-gray-100 hover:border-brand-primary'
                                                    }`}
                                            >
                                                Obras Premiadas <Star className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Action */}
                                    <div className="flex items-end">
                                        <button
                                            onClick={clearAllFilters}
                                            className="w-full py-6 bg-brand-dark text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] hover:bg-brand-primary transition-all shadow-2xl shadow-brand-dark/10"
                                        >
                                            Redefinir Filtros
                                        </button>
                                    </div>
                                </div>
                            </m.div>
                        )}
                    </AnimatePresence>
                </div>
            </section>

            {/* 3. BOOK GRID AREA */}
            <section className="py-32 md:py-48 bg-white">
                <div className="container mx-auto px-6 md:px-12">
                    {/* Catalog Header Info */}
                    <div className="flex flex-col md:flex-row justify-between items-baseline mb-24 gap-8">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-primary mb-4 shrink-0">Status do Acervo</p>
                            <h2 className="text-4xl md:text-6xl font-black text-brand-dark tracking-tighter uppercase leading-none">
                                {loading ? 'Curando Obras...' : (
                                    <>
                                        Total <span className="text-brand-primary">{filteredBooks.length}</span> <span className="font-light italic lowercase text-gray-300">items</span>
                                    </>
                                )}
                            </h2>
                        </div>
                        <div className="w-full md:w-1/3 h-[1px] bg-gray-100 hidden md:block"></div>
                        <div className="flex items-center gap-6 opacity-40">
                            <LayoutGrid className="w-5 h-5" />
                            <List className="w-5 h-5" />
                        </div>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 md:gap-16">
                            {Array(8).fill(0).map((_, i) => <BookCardSkeleton key={i} />)}
                        </div>
                    ) : filteredBooks.length > 0 ? (
                        <m.div
                            variants={{
                                hidden: { opacity: 0 },
                                visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
                            }}
                            initial="hidden"
                            animate="visible"
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 md:gap-16"
                        >
                            {filteredBooks.map((book) => (
                                <m.div
                                    key={book.id}
                                    variants={{
                                        hidden: { opacity: 0, y: 30 },
                                        visible: { opacity: 1, y: 0 }
                                    }}
                                >
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
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-gray-50 p-24 md:p-40 rounded-[4rem] text-center border-2 border-dashed border-gray-100"
                        >
                            <div className="max-w-md mx-auto space-y-12">
                                <div className="w-32 h-32 bg-white rounded-[3rem] flex items-center justify-center mx-auto text-gray-200 shadow-xl">
                                    <BookOpen className="w-12 h-12" />
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-4xl font-black text-brand-dark uppercase tracking-tighter">O Silêncio Literário</h3>
                                    <p className="text-gray-500 font-medium text-lg leading-relaxed italic">
                                        Não encontramos obras que correspondam à sua busca intelectual. Tente refinar os filtros para descobrir novos horizontes.
                                    </p>
                                </div>
                                <button
                                    onClick={clearAllFilters}
                                    className="px-16 py-6 bg-brand-dark text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-brand-dark/20 hover:bg-brand-primary transition-all"
                                >
                                    Limpar Filtros
                                </button>
                            </div>
                        </m.div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default CatalogPage;
