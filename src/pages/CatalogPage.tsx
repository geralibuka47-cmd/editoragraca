import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, X, ArrowRight, Filter, BookOpen, Loader2, Sparkles, Star } from 'lucide-react';
import { m, AnimatePresence, Variants } from 'framer-motion';
import { Book, ViewState } from '../types';
import BookCard from '../components/BookCard';
import { BookCardSkeleton } from '../components/SkeletonLoader';

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
        <div className="min-h-screen bg-[#F8FAFC]">
            {/* Premium Hero Header */}
            <section className="bg-brand-dark text-white pt-24 pb-32 md:pt-32 md:pb-48 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-primary/5 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-primary/20 to-transparent"></div>

                <div className="container mx-auto px-6 md:px-8 relative z-10">
                    <m.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-4xl"
                    >
                        <div className="flex items-center gap-3 text-[10px] md:text-xs text-brand-primary uppercase tracking-[0.4em] font-black mb-10">
                            <button onClick={() => navigate('/')} className="hover:text-white transition-colors">Início</button>
                            <span className="text-gray-700">/</span>
                            <span className="text-white">Explorar Catálogo</span>
                        </div>
                        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-6 md:mb-10 leading-[0.9]">
                            Nosso <span className="text-gradient-gold italic font-serif font-normal">Acervo</span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-400 font-medium leading-relaxed max-w-2xl opacity-80">
                            Uma curadoria de literatura angolana e internacional, desenhada para leitores que procuram excelência.
                        </p>
                    </m.div>
                </div>
            </section>

            {/* Sticky Search & Filter Bar */}
            <section className="sticky top-[120px] lg:top-[128px] z-40 -mt-16 md:-mt-24">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="glass-premium p-4 md:p-6 rounded-[2.5rem] shadow-2xl shadow-brand-dark/10 border border-white/40">
                        <div className="flex flex-col lg:flex-row gap-4 items-center">
                            {/* Search Input */}
                            <div className="flex-1 relative group">
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-brand-primary transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Pesquisar..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-14 md:pl-16 pr-8 md:pr-12 py-4 md:py-5 bg-white/50 border-2 border-transparent rounded-[1.2rem] md:rounded-[1.5rem] focus:bg-white focus:border-brand-primary/20 focus:ring-0 transition-all font-bold text-brand-dark placeholder:text-gray-400 placeholder:font-bold"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        title="Limpar pesquisa"
                                        className="absolute right-5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 hover:text-brand-primary transition-all"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>

                            {/* Controls */}
                            <div className="flex gap-3 w-full lg:w-auto">
                                <div className="relative flex-1 lg:flex-none">
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        title="Ordenar livros por"
                                        className="w-full lg:w-56 pl-6 pr-10 py-5 bg-white/50 border-2 border-transparent rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest text-brand-dark focus:ring-0 focus:border-brand-primary/20 appearance-none cursor-pointer"
                                    >
                                        <option value="title-asc">Ordem Alfabética</option>
                                        <option value="title-desc">Inverter Ordem</option>
                                        <option value="price-asc">Preço: Baixo para Alto</option>
                                        <option value="price-desc">Preço: Alto para Baixo</option>
                                    </select>
                                    <ArrowRight className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 rotate-90 text-gray-300 pointer-events-none" />
                                </div>

                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className={`px-6 md:px-8 py-4 md:py-5 rounded-[1.2rem] md:rounded-[1.5rem] font-black text-[9px] md:text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-xl ${showFilters || activeFiltersCount > 0
                                        ? 'bg-brand-primary text-white shadow-brand-primary/20'
                                        : 'bg-brand-dark text-white hover:bg-brand-primary shadow-brand-dark/20'
                                        }`}
                                >
                                    <Filter className="w-4 h-4" />
                                    <span className="hidden sm:inline">Filtros</span>
                                    {activeFiltersCount > 0 && <span className="w-5 h-5 md:w-6 md:h-6 bg-white text-brand-primary rounded-lg flex items-center justify-center text-[8px] md:text-[9px] font-black shadow-lg">{activeFiltersCount}</span>}
                                </button>
                            </div>
                        </div>

                        {/* Filters Panel */}
                        <AnimatePresence>
                            {showFilters && (
                                <m.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="pt-8 border-t border-gray-100 mt-6 md:px-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                                            {/* Category */}
                                            <div className="space-y-6">
                                                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-dark/30">Categorias</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {genres.map(gen => (
                                                        <button
                                                            key={gen}
                                                            onClick={() => setSelectedGenre(gen)}
                                                            className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedGenre === gen
                                                                ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20'
                                                                : 'bg-white text-gray-500 hover:bg-gray-100'
                                                                }`}
                                                        >
                                                            {gen}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Price */}
                                            <div className="space-y-6">
                                                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-dark/30">Investimento</h4>
                                                <div className="grid grid-cols-1 gap-2">
                                                    {[
                                                        { id: 'all', label: 'Todos os valores' },
                                                        { id: 'low', label: 'Até 3.500 kz' },
                                                        { id: 'mid', label: '3.500 - 4.500 kz' },
                                                        { id: 'high', label: 'Mais de 4.500 kz' }
                                                    ].map(range => (
                                                        <button
                                                            key={range.id}
                                                            onClick={() => setPriceRange(range.id as any)}
                                                            className={`w-full text-left px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] transition-all ${priceRange === range.id
                                                                ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20'
                                                                : 'bg-white text-gray-500 hover:bg-gray-100'
                                                                }`}
                                                        >
                                                            {range.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Status */}
                                            <div className="space-y-6">
                                                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-dark/30">Destaques</h4>
                                                <div className="space-y-2">
                                                    <button
                                                        onClick={() => setShowOnlyNew(!showOnlyNew)}
                                                        className={`w-full flex items-center justify-between px-5 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${showOnlyNew
                                                            ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20'
                                                            : 'bg-white text-gray-500 hover:bg-gray-100'
                                                            }`}
                                                    >
                                                        Novidades <Sparkles className={`w-3 h-3 ${showOnlyNew ? 'fill-current' : ''}`} />
                                                    </button>
                                                    <button
                                                        onClick={() => setShowOnlyBestsellers(!showOnlyBestsellers)}
                                                        className={`w-full flex items-center justify-between px-5 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${showOnlyBestsellers
                                                            ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20'
                                                            : 'bg-white text-gray-500 hover:bg-gray-100'
                                                            }`}
                                                    >
                                                        Mais Procurados <Star className={`w-3 h-3 ${showOnlyBestsellers ? 'fill-current' : ''}`} />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Reset */}
                                            <div className="flex items-end">
                                                <button
                                                    onClick={clearAllFilters}
                                                    className="w-full py-5 bg-brand-dark/5 text-brand-dark rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-brand-primary hover:text-white transition-all border border-transparent hover:border-brand-primary"
                                                >
                                                    Redefinir Filtros
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </m.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </section>

            {/* Book Grid Section */}
            <section className="py-24 md:py-32 optimize-render">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                        <div>
                            <h2 className="text-2xl md:text-4xl font-black text-brand-dark tracking-tighter">
                                {loading ? 'Carregando...' : (
                                    <>
                                        <span className="text-gradient-gold">{filteredBooks.length}</span> Obras Catalogadas
                                    </>
                                )}
                            </h2>
                            <p className="text-gray-400 font-bold uppercase tracking-[0.32em] text-[8px] md:text-[9px] mt-2">Curadoria de excelência literária</p>
                        </div>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-12">
                            {Array(8).fill(0).map((_, i) => <BookCardSkeleton key={i} />)}
                        </div>
                    ) : filteredBooks.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 md:gap-10">
                            {filteredBooks.map((book) => (
                                <m.div
                                    key={book.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                >
                                    <BookCard
                                        book={book}
                                        onAddToCart={onAddToCart}
                                        onToggleWishlist={onToggleWishlist}
                                        onViewDetails={onViewDetails}
                                    />
                                </m.div>
                            ))}
                        </div>
                    ) : (
                        <m.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white p-20 rounded-[4rem] text-center shadow-xl border border-gray-100"
                        >
                            <div className="max-w-md mx-auto space-y-8">
                                <div className="w-24 h-24 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto text-gray-200">
                                    <BookOpen className="w-10 h-10" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-3xl font-black text-brand-dark tracking-tighter">Nada Encontrado</h3>
                                    <p className="text-gray-500 font-medium">Não encontramos obras para os critérios atuais.</p>
                                </div>
                                <button
                                    onClick={clearAllFilters}
                                    className="px-10 py-5 bg-brand-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-brand-primary/20 hover:scale-105 transition-all"
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
