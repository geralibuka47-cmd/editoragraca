import React, { useState, useMemo, useEffect } from 'react';
import { Search, SlidersHorizontal, X, ArrowRight, Filter, BookOpen, Loader2, Sparkles, Star } from 'lucide-react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Book, ViewState } from '../types';
import BookCard from '../components/BookCard';
import { BookCardSkeleton } from '../components/SkeletonLoader';

interface CatalogPageProps {
    books: Book[];
    loading?: boolean;
    onAddToCart: (book: Book) => void;
    onToggleWishlist: (book: Book) => void;
    onViewDetails: (book: Book) => void;
    onNavigate: (view: ViewState) => void;
}

const CatalogPage: React.FC<CatalogPageProps> = ({
    books,
    loading = false,
    onAddToCart,
    onToggleWishlist,
    onViewDetails,
    onNavigate
}) => {
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
                book.description.toLowerCase().includes(query)
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
            transition: { duration: 0.5, ease: "circOut" }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* Premium Hero Header */}
            <section className="bg-brand-dark text-white py-20 md:py-32 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-primary/10 -skew-x-12 translate-x-20"></div>
                <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-primary/50 to-transparent"></div>

                <div className="container mx-auto px-4 md:px-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-3xl text-center md:text-left"
                    >
                        <div className="flex items-center justify-center md:justify-start gap-3 text-[10px] md:text-xs text-brand-primary uppercase tracking-[0.3em] font-black mb-8">
                            <button onClick={() => onNavigate('HOME')} className="hover:text-white transition-colors">Início</button>
                            <span className="text-gray-600">/</span>
                            <span className="text-white">Catálogo</span>
                        </div>
                        <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9]">
                            Explore o Nosso <br />
                            <span className="text-brand-primary italic font-serif font-normal">Catálogo</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-400 font-medium leading-relaxed max-w-2xl">
                            Uma curadoria de literatura angolana e internacional, desenhada para leitores que procuram excelência em cada página.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Sticky Search & Filter Bar */}
            <section className="bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 md:top-[120px] lg:top-[128px] z-40 shadow-xl shadow-brand-dark/5">
                <div className="container mx-auto px-4 md:px-8 py-4 md:py-6">
                    <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
                        {/* Search Input */}
                        <div className="flex-1 w-full lg:max-w-2xl relative group">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-brand-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Pesquisar por título, autor ou palavra-chave..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-14 pr-12 py-4 md:py-5 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-brand-primary/30 focus:ring-0 transition-all font-medium text-brand-dark placeholder:text-gray-400"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gray-200/50 flex items-center justify-center text-gray-500 hover:bg-gray-200 hover:text-brand-dark transition-all"
                                    title="Limpar pesquisa"
                                    aria-label="Limpar campo de pesquisa"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        {/* Controls */}
                        <div className="flex gap-4 w-full lg:w-auto">
                            <div className="relative flex-1 lg:flex-none">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full lg:w-48 pl-5 pr-10 py-4 md:py-5 bg-gray-50 border-0 rounded-2xl font-black text-[10px] uppercase tracking-widest text-brand-dark focus:ring-2 focus:ring-brand-primary/20 appearance-none cursor-pointer"
                                    title="Ordenar livros"
                                >
                                    <option value="title-asc">A-Z</option>
                                    <option value="title-desc">Z-A</option>
                                    <option value="price-asc">Menor Preço</option>
                                    <option value="price-desc">Maior Preço</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                    <ArrowRight className="w-4 h-4 rotate-90" />
                                </div>
                            </div>

                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`flex-1 lg:flex-none px-8 py-4 md:py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-lg ${showFilters || activeFiltersCount > 0
                                    ? 'bg-brand-primary text-white shadow-brand-primary/30'
                                    : 'bg-brand-dark text-white hover:bg-brand-primary shadow-brand-dark/20'
                                    }`}
                            >
                                <Filter className="w-4 h-4" />
                                Filtros {activeFiltersCount > 0 && <span className="w-5 h-5 bg-white text-brand-primary rounded-full flex items-center justify-center text-[9px] font-black">{activeFiltersCount}</span>}
                            </button>
                        </div>
                    </div>

                    {/* Enhanced Filters Panel */}
                    <AnimatePresence>
                        {showFilters && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="mt-8 p-8 bg-brand-light rounded-[2.5rem] border border-brand-primary/10">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                                        {/* Category */}
                                        <div className="space-y-4">
                                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-dark flex items-center gap-2">
                                                <div className="w-4 h-1 bg-brand-primary rounded-full"></div>
                                                Categorias
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {genres.map(gen => (
                                                    <button
                                                        key={gen}
                                                        onClick={() => setSelectedGenre(gen)}
                                                        className={`px-4 py-2 rounded-xl text-xs font-black transition-all border-2 ${selectedGenre === gen
                                                            ? 'bg-brand-primary border-brand-primary text-white'
                                                            : 'bg-white border-transparent text-gray-500 hover:border-brand-primary/30'
                                                            }`}
                                                    >
                                                        {gen}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Price */}
                                        <div className="space-y-4">
                                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-dark flex items-center gap-2">
                                                <div className="w-4 h-1 bg-brand-primary rounded-full"></div>
                                                Faixa de Preço
                                            </h4>
                                            <div className="grid grid-cols-2 gap-2">
                                                {[
                                                    { id: 'all', label: 'Todos' },
                                                    { id: 'low', label: 'Até 3.500 kz' },
                                                    { id: 'mid', label: '3.500 - 4.500 kz' },
                                                    { id: 'high', label: '4.500+ kz' }
                                                ].map(range => (
                                                    <button
                                                        key={range.id}
                                                        onClick={() => setPriceRange(range.id as any)}
                                                        className={`px-3 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${priceRange === range.id
                                                            ? 'bg-brand-primary border-brand-primary text-white'
                                                            : 'bg-white border-transparent text-gray-500 hover:border-brand-primary/30'
                                                            }`}
                                                    >
                                                        {range.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Status */}
                                        <div className="space-y-4">
                                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-dark flex items-center gap-2">
                                                <div className="w-4 h-1 bg-brand-primary rounded-full"></div>
                                                Exibir apenas
                                            </h4>
                                            <div className="space-y-2">
                                                {[
                                                    { state: showOnlyNew, set: setShowOnlyNew, label: 'Novidades', icon: Sparkles },
                                                    { state: showOnlyBestsellers, set: setShowOnlyBestsellers, label: 'Mais Vendidos', icon: Star }
                                                ].map((filter, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => filter.set(!filter.state)}
                                                        className={`w-full flex items-center justify-between px-5 py-3 rounded-xl text-xs font-black transition-all border-2 ${filter.state
                                                            ? 'bg-brand-primary border-brand-primary text-white'
                                                            : 'bg-white border-transparent text-gray-500 hover:border-brand-primary/30'
                                                            }`}
                                                    >
                                                        {filter.label}
                                                        <filter.icon className={`w-4 h-4 ${filter.state ? 'fill-current' : ''}`} />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Reset */}
                                        <div className="flex items-end">
                                            <button
                                                onClick={clearAllFilters}
                                                className="w-full py-5 bg-brand-dark text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-brand-primary transition-all shadow-xl shadow-brand-dark/10"
                                            >
                                                Limpar Tudo
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </section>

            {/* Book Grid Section */}
            <section className="py-20 md:py-32 optimize-render">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
                        <div className="space-y-2 text-center md:text-left">
                            <h2 className="text-3xl md:text-5xl font-black text-brand-dark tracking-tighter">
                                {loading ? 'Carregando Catálogo' : (
                                    <>
                                        {filteredBooks.length} <span className="text-brand-primary italic font-serif font-normal">Livros</span> Disponíveis
                                    </>
                                )}
                            </h2>
                            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Mostrando resultados de toda a editora</p>
                        </div>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                            {Array(8).fill(0).map((_, i) => <BookCardSkeleton key={i} />)}
                        </div>
                    ) : filteredBooks.length > 0 ? (
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={containerVariants}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 md:gap-14"
                        >
                            {filteredBooks.map(book => (
                                <motion.div key={book.id} variants={itemVariants}>
                                    <BookCard
                                        book={book}
                                        onAddToCart={onAddToCart}
                                        onToggleWishlist={onToggleWishlist}
                                        onViewDetails={onViewDetails}
                                    />
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-32 bg-white rounded-[4rem] border-2 border-dashed border-gray-100 px-8 group"
                        >
                            <div className="max-w-md mx-auto space-y-8">
                                <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-500">
                                    <BookOpen className="w-16 h-16 text-gray-200" />
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-3xl font-black text-brand-dark tracking-tight">Nenhum Livro Encontrado</h3>
                                    <p className="text-gray-500 font-medium text-lg leading-relaxed">
                                        Não encontramos correspondências para os critérios selecionados. Talvez seja altura de tentar uma busca diferente?
                                    </p>
                                </div>
                                <button
                                    onClick={clearAllFilters}
                                    className="px-10 py-5 bg-brand-primary text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-brand-primary/40 hover:brightness-110 active:scale-95 transition-all"
                                >
                                    Limpar todos os filtros
                                </button>
                            </div>
                        </motion.div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default CatalogPage;
