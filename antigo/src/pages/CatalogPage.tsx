
import React from 'react';
import SectionHeader from '../components/SectionHeader';
import BookCard from '../components/BookCard';
import { CATEGORIES } from '../constants';
import { Book } from '../types';

interface CatalogPageProps {
    books: Book[];
    activeCategory: string;
    setActiveCategory: (cat: string) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    wishlist: Book[];
    toggleWishlist: (book: Book) => void;
    addToCart: (book: Book) => void;
    setSelectedBook: (book: Book | null) => void;
}

const CatalogPage: React.FC<CatalogPageProps> = ({
    books,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    wishlist,
    toggleWishlist,
    addToCart,
    setSelectedBook
}) => {
    const filteredBooks = React.useMemo(() => {
        return books.filter(b => {
            const matchesCategory = activeCategory === "Todos" || b.category === activeCategory;
            return matchesCategory && b.title.toLowerCase().includes(searchQuery.toLowerCase());
        });
    }, [books, activeCategory, searchQuery]);

    return (
        <div className="py-16 md:py-32 max-w-7xl mx-auto px-4 md:px-6 animate-fade-in">
            <SectionHeader title="Catálogo de Luxo" subtitle="Obras Seleccionadas" align="left" />
            <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center mb-12 md:mb-16 gap-6">
                <div className="flex bg-brand-50 rounded-full p-1 border border-brand-100 overflow-x-auto no-scrollbar max-w-full">
                    {CATEGORIES.map(cat => (
                        <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-6 md:px-8 py-2.5 md:py-3 rounded-full text-[8px] md:text-[9px] font-bold uppercase tracking-[0.2em] transition-all whitespace-nowrap ${activeCategory === cat ? 'bg-brand-900 text-white shadow-xl' : 'text-gray-400 hover:text-brand-900'}`}>{cat}</button>
                    ))}
                </div>
                <div className="relative w-full md:w-64">
                    <input
                        type="text"
                        placeholder="Procurar título..."
                        className="w-full bg-brand-50 border border-brand-100 rounded-full px-6 py-3 text-xs outline-none focus:border-accent-gold transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 md:gap-12">
                {filteredBooks.map(b => (
                    <BookCard
                        key={b.id}
                        book={b}
                        allBooks={books}
                        onAddToCart={addToCart}
                        onToggleWishlist={toggleWishlist}
                        onViewDetails={setSelectedBook}
                        isInWishlist={wishlist.some(w => w.id === b.id)}
                    />
                ))}
            </div>
        </div>
    );
};

export default CatalogPage;
