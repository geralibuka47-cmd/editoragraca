import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Book, ViewState } from '../types';
import BookCard from '../components/BookCard';

interface CatalogPageProps {
    books: Book[];
    onAddToCart: (book: Book) => void;
    onToggleWishlist: (book: Book) => void;
    onViewDetails: (book: Book) => void;
    onNavigate: (view: ViewState) => void;
}

const CatalogPage: React.FC<CatalogPageProps> = ({
    books,
    onAddToCart,
    onToggleWishlist,
    onViewDetails,
    onNavigate
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Todos');
    const [sortBy, setSortBy] = useState('title-asc');
    const [showFilters, setShowFilters] = useState(false);
    const [priceRange, setPriceRange] = useState<'all' | 'low' | 'mid' | 'high'>('all');
    const [showOnlyNew, setShowOnlyNew] = useState(false);
    const [showOnlyBestsellers, setShowOnlyBestsellers] = useState(false);

    // Unique categories from books
    const categories = useMemo(() => {
        const cats = new Set(books.map(b => b.category));
        return ['Todos', ...Array.from(cats).sort()];
    }, [books]);

    // Filtered and sorted books
    const filteredBooks = useMemo(() => {
        let result = [...books];

        // Search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(book =>
                book.title.toLowerCase().includes(query) ||
                book.author.toLowerCase().includes(query) ||
                book.description.toLowerCase().includes(query)
            );
        }

        // Category filter
        if (selectedCategory !== 'Todos') {
            result = result.filter(book => book.category === selectedCategory);
        }

        // Price range filter
        if (priceRange === 'low') {
            result = result.filter(book => book.price < 3500);
        } else if (priceRange === 'mid') {
            result = result.filter(book => book.price >= 3500 && book.price < 4500);
        } else if (priceRange === 'high') {
            result = result.filter(book => book.price >= 4500);
        }

        // New books filter
        if (showOnlyNew) {
            result = result.filter(book => book.isNew);
        }

        // Bestsellers filter
        if (showOnlyBestsellers) {
            result = result.filter(book => book.isBestseller);
        }

        // Sorting
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
    }, [books, searchQuery, selectedCategory, sortBy, priceRange, showOnlyNew, showOnlyBestsellers]);

    const clearAllFilters = () => {
        setSearchQuery('');
        setSelectedCategory('Todos');
        setSortBy('title-asc');
        setPriceRange('all');
        setShowOnlyNew(false);
        setShowOnlyBestsellers(false);
    };

    const activeFiltersCount = [
        selectedCategory !== 'Todos' ? 1 : 0,
        priceRange !== 'all' ? 1 : 0,
        showOnlyNew ? 1 : 0,
        showOnlyBestsellers ? 1 : 0,
        searchQuery.trim() ? 1 : 0,
    ].reduce((a, b) => a + b, 0);

    return (
        <div className="min-h-screen bg-brand-light">
            {/* Hero Header */}
            <section className="bg-brand-dark text-white py-12 md:py-16">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="max-w-3xl text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-2 text-[10px] md:text-sm text-brand-primary uppercase tracking-widest font-bold mb-4">
                            <button onClick={() => onNavigate('HOME')} className="hover:underline">Início</button>
                            <span>/</span>
                            <span>Catálogo</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 md:mb-6 leading-[1.1]">
                            Explore o Nosso <span className="text-brand-primary italic font-serif">Catálogo</span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-400 font-medium leading-relaxed">
                            Descubra uma seleção rigorosa de literatura angolana e internacional.
                        </p>
                    </div>
                </div>
            </section>

            {/* Search and Filters Bar */}
            <section className="bg-white border-b border-gray-200 sticky top-0 md:top-[154px] lg:top-[160px] z-40 shadow-sm">
                <div className="container mx-auto px-4 md:px-8 py-4 md:py-6">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        {/* Search */}
                        <div className="flex-1 w-full md:max-w-md relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Pesquisar por título, autor ou palavra-chave..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-dark"
                                    title="Limpar pesquisa"
                                    aria-label="Limpar campo de pesquisa"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            )}
                        </div>

                        {/* Sort and Filter Toggles */}
                        <div className="flex gap-4 w-full md:w-auto">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="flex-1 md:flex-none px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-brand-primary font-medium text-sm bg-white"
                                title="Ordenar livros"
                                aria-label="Selecionar ordem dos livros"
                            >
                                <option value="title-asc">A-Z</option>
                                <option value="title-desc">Z-A</option>
                                <option value="price-asc">Preço: Baixo-Alto</option>
                                <option value="price-desc">Preço: Alto-Baixo</option>
                            </select>

                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`px-6 py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-all flex items-center gap-2 ${showFilters || activeFiltersCount > 0
                                    ? 'bg-brand-primary text-white'
                                    : 'bg-gray-100 text-brand-dark hover:bg-gray-200'
                                    }`}
                            >
                                <SlidersHorizontal className="w-4 h-4" />
                                Filtros {activeFiltersCount > 0 && `(${activeFiltersCount})`}
                            </button>
                        </div>
                    </div>

                    {/* Filters Panel */}
                    {showFilters && (
                        <div className="mt-6 p-6 bg-gray-50 rounded-xl border border-gray-200 animate-fade-in">
                            <div className="grid md:grid-cols-4 gap-6">
                                {/* Category Filter */}
                                <div>
                                    <label className="block text-sm font-bold uppercase tracking-wider text-brand-dark mb-3">
                                        Categoria
                                    </label>
                                    <div className="space-y-2">
                                        {categories.map(cat => (
                                            <button
                                                key={cat}
                                                onClick={() => setSelectedCategory(cat)}
                                                className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedCategory === cat
                                                    ? 'bg-brand-primary text-white'
                                                    : 'bg-white text-gray-700 hover:bg-gray-100'
                                                    }`}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Price Range */}
                                <div>
                                    <label className="block text-sm font-bold uppercase tracking-wider text-brand-dark mb-3">
                                        Preço
                                    </label>
                                    <div className="space-y-2">
                                        <button
                                            onClick={() => setPriceRange('all')}
                                            className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-all ${priceRange === 'all' ? 'bg-brand-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
                                                }`}
                                        >
                                            Todos
                                        </button>
                                        <button
                                            onClick={() => setPriceRange('low')}
                                            className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-all ${priceRange === 'low' ? 'bg-brand-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
                                                }`}
                                        >
                                            Até 3.500 Kz
                                        </button>
                                        <button
                                            onClick={() => setPriceRange('mid')}
                                            className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-all ${priceRange === 'mid' ? 'bg-brand-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
                                                }`}
                                        >
                                            3.500 - 4.500 Kz
                                        </button>
                                        <button
                                            onClick={() => setPriceRange('high')}
                                            className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-all ${priceRange === 'high' ? 'bg-brand-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
                                                }`}
                                        >
                                            Acima de 4.500 Kz
                                        </button>
                                    </div>
                                </div>

                                {/* Special Filters */}
                                <div>
                                    <label className="block text-sm font-bold uppercase tracking-wider text-brand-dark mb-3">
                                        Especiais
                                    </label>
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-3 px-4 py-2 bg-white rounded-lg cursor-pointer hover:bg-gray-100 transition-all">
                                            <input
                                                type="checkbox"
                                                checked={showOnlyNew}
                                                onChange={(e) => setShowOnlyNew(e.target.checked)}
                                                className="w-4 h-4 text-brand-primary focus:ring-brand-primary"
                                            />
                                            <span className="text-sm font-medium text-gray-700">Novidades</span>
                                        </label>
                                        <label className="flex items-center gap-3 px-4 py-2 bg-white rounded-lg cursor-pointer hover:bg-gray-100 transition-all">
                                            <input
                                                type="checkbox"
                                                checked={showOnlyBestsellers}
                                                onChange={(e) => setShowOnlyBestsellers(e.target.checked)}
                                                className="w-4 h-4 text-brand-primary focus:ring-brand-primary"
                                            />
                                            <span className="text-sm font-medium text-gray-700">Mais Vendidos</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Clear Filters */}
                                <div className="flex items-end">
                                    <button
                                        onClick={clearAllFilters}
                                        className="w-full px-6 py-3 bg-brand-dark text-white rounded-lg font-bold text-sm uppercase tracking-wider hover:bg-brand-primary transition-all"
                                    >
                                        Limpar Filtros
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Results */}
            <section className="py-16">
                <div className="container mx-auto px-8">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-black text-brand-dark">
                            {filteredBooks.length} {filteredBooks.length === 1 ? 'Livro Encontrado' : 'Livros Encontrados'}
                        </h2>
                    </div>

                    {filteredBooks.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {filteredBooks.map(book => (
                                <BookCard
                                    key={book.id}
                                    book={book}
                                    onAddToCart={onAddToCart}
                                    onToggleWishlist={onToggleWishlist}
                                    onViewDetails={onViewDetails}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                            <div className="max-w-md mx-auto space-y-4">
                                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                                    <Search className="w-10 h-10 text-gray-400" />
                                </div>
                                <h3 className="text-2xl font-black text-brand-dark">Nenhum Livro Encontrado</h3>
                                <p className="text-gray-500 font-medium">
                                    Não encontramos livros que correspondam aos seus critérios.
                                    Tente ajustar os filtros ou a pesquisa.
                                </p>
                                <button
                                    onClick={clearAllFilters}
                                    className="btn-premium mx-auto"
                                >
                                    Limpar Filtros
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default CatalogPage;
