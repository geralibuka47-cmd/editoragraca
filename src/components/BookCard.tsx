import React from 'react';
import { ShoppingBag, Eye, Star, ArrowUpRight, Sparkles } from 'lucide-react';
import { Book } from '../types';
import { OptimizedImage } from '../components/OptimizedImage';

interface BookCardProps {
    book: Book;
    onAddToCart: (book: Book) => void;
    onToggleWishlist: (book: Book) => void;
    onViewDetails: (book: Book) => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onAddToCart, onViewDetails, onToggleWishlist }) => {
    return (
        <div
            className="group relative flex flex-col gap-4 sm:gap-6 cursor-pointer min-w-0"
            onClick={() => onViewDetails(book)}
        >
            {/* 1. COVER ARCHITECTURE - Premium Cinematic */}
            <div className="relative aspect-[2/3] overflow-hidden rounded-2xl sm:rounded-[2.5rem] bg-gray-50 shadow-sm transition-all duration-700 group-hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.15)] group-hover:-translate-y-2 sm:group-hover:-translate-y-4">

                {/* Dynamic Image */}
                <OptimizedImage
                    src={book.coverUrl}
                    alt={book.title}
                    className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110 group-hover:rotate-1"
                    width={400}
                    aspectRatio="book"
                />

                {/* Status Badges */}
                <div className="absolute top-3 left-3 sm:top-6 sm:left-6 flex flex-col gap-1.5 sm:gap-2">
                    {book.category && book.category !== 'livro' && (
                        <div className="px-3 py-1.5 bg-brand-primary/90 text-white text-[7px] font-black uppercase tracking-[0.2em] rounded-full shadow-lg flex items-center gap-2">
                            <Sparkles className="w-3 h-3" />
                            {book.category}
                        </div>
                    )}
                    {book.isBestseller && (
                        <div className="px-4 py-2 bg-brand-primary text-white text-[8px] font-black uppercase tracking-[0.2em] rounded-full shadow-lg flex items-center gap-2">
                            <Star className="w-3 h-3 fill-current" />
                            Bestseller
                        </div>
                    )}
                    {book.isNew && (
                        <div className="px-4 py-2 bg-brand-dark text-white text-[8px] font-black uppercase tracking-[0.2em] rounded-full shadow-lg">
                            Lançamento
                        </div>
                    )}
                </div>

                {/* Quick Action Overlay - Tech Minimal */}
                <div className="absolute inset-0 bg-brand-dark/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 backdrop-blur-[2px] flex items-center justify-center gap-3">
                    <button
                        onClick={(e) => { e.stopPropagation(); onViewDetails(book); }}
                        className="p-4 sm:p-5 bg-white text-brand-dark rounded-xl sm:rounded-[1.5rem] hover:bg-brand-primary hover:text-white transition-all transform translate-y-8 group-hover:translate-y-0 duration-500 shadow-xl min-touch"
                        title="Ver Detalhes"
                        aria-label="Ver detalhes do livro"
                    >
                        <ArrowUpRight className="w-5 h-5" />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onAddToCart(book); }}
                        className="p-4 sm:p-5 bg-brand-primary text-white rounded-xl sm:rounded-[1.5rem] hover:bg-brand-dark transition-all transform translate-y-8 group-hover:translate-y-0 duration-500 delay-75 shadow-xl min-touch"
                        title="Adicionar ao Carrinho"
                        aria-label="Adicionar ao carrinho"
                    >
                        <ShoppingBag className="w-5 h-5" />
                    </button>
                </div>

                {/* Format Indicator */}
                <div className="absolute bottom-3 right-3 sm:bottom-6 sm:right-6 p-2 sm:p-3 bg-white/90 backdrop-blur-md rounded-xl sm:rounded-2xl border border-white/50 text-[7px] sm:text-[8px] font-black uppercase tracking-widest text-brand-dark shadow-sm">
                    {book.format === 'digital' ? 'E-book' : 'Físico'}
                </div>
            </div>

            {/* 2. INFORMATION SYSTEM - Clean Sans */}
            <div className="space-y-3 sm:space-y-4 px-1 sm:px-2 min-w-0">
                <div className="flex items-start justify-between gap-2 sm:gap-4">
                    <div className="space-y-1 flex-1 min-w-0">
                        <h3 className="font-sans font-black text-brand-dark text-base sm:text-lg leading-tight uppercase tracking-tight line-clamp-2 group-hover:text-brand-primary transition-colors break-words">
                            {book.title}
                        </h3>
                        <p className="text-sm text-gray-400 font-bold uppercase tracking-widest truncate">
                            {book.authors && book.authors.length > 0
                                ? book.authors.map(a => a.name).join(', ')
                                : book.author}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="font-black text-brand-dark text-xl tracking-tighter">
                            {(() => {
                                const price = Number(book.price);
                                if (isNaN(price)) return 'N/D';
                                if (price === 0) return 'Gratuito';
                                return `${price.toLocaleString()} Kz`;
                            })()}
                        </p>
                        <p className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">AOA</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <span className="px-4 py-1.5 bg-gray-50 text-gray-500 text-[9px] font-bold uppercase tracking-widest rounded-lg border border-gray-100">
                        {book.genre}
                    </span>
                    {book.stats && (
                        <div className="flex items-center gap-3 ml-auto text-gray-400">
                            <div className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                <span className="text-[10px] font-bold">{book.stats.views || 0}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                                <span className="text-[10px] font-bold">{book.stats.averageRating || 5}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookCard;
