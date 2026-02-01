import React from 'react';
import { ShoppingBag, Eye, Star, ArrowUpRight } from 'lucide-react';
import { Book } from '../types';
import { optimizeImageUrl } from '../components/OptimizedImage';

interface BookCardProps {
    book: Book;
    onAddToCart: (book: Book) => void;
    onToggleWishlist: (book: Book) => void;
    onViewDetails: (book: Book) => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onAddToCart, onViewDetails }) => {
    return (
        <div
            className="group relative flex flex-col gap-6 cursor-pointer"
            onClick={() => onViewDetails(book)}
        >
            {/* 1. COVER ARCHITECTURE - Premium Cinematic */}
            <div className="relative aspect-[2/3] overflow-hidden rounded-[2.5rem] bg-gray-50 shadow-sm transition-all duration-700 group-hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.15)] group-hover:-translate-y-4">

                {/* Dynamic Image */}
                <img
                    src={optimizeImageUrl(book.coverUrl)}
                    alt={book.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110 group-hover:rotate-1"
                />

                {/* Status Badges */}
                <div className="absolute top-6 left-6 flex flex-col gap-2">
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
                        className="p-5 bg-white text-brand-dark rounded-[1.5rem] hover:bg-brand-primary hover:text-white transition-all transform translate-y-8 group-hover:translate-y-0 duration-500 shadow-xl"
                        title="Ver Detalhes"
                    >
                        <ArrowUpRight className="w-5 h-5" />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onAddToCart(book); }}
                        className="p-5 bg-brand-primary text-white rounded-[1.5rem] hover:bg-brand-dark transition-all transform translate-y-8 group-hover:translate-y-0 duration-500 delay-75 shadow-xl"
                        title="Adicionar ao Carrinho"
                    >
                        <ShoppingBag className="w-5 h-5" />
                    </button>
                </div>

                {/* Format Indicator */}
                <div className="absolute bottom-6 right-6 p-3 bg-white/90 backdrop-blur-md rounded-2xl border border-white/50 text-[8px] font-black uppercase tracking-widest text-brand-dark shadow-sm">
                    {book.format === 'digital' ? 'E-book' : 'Físico'}
                </div>
            </div>

            {/* 2. INFORMATION SYSTEM - Clean Sans */}
            <div className="space-y-4 px-2">
                <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1 flex-1">
                        <h3 className="font-sans font-black text-brand-dark text-lg leading-tight uppercase tracking-tight line-clamp-2 group-hover:text-brand-primary transition-colors">
                            {book.title}
                        </h3>
                        <p className="text-sm text-gray-400 font-bold uppercase tracking-widest truncate">
                            {book.author}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="font-black text-brand-dark text-xl tracking-tighter">
                            {book.price === 0 ? 'Gratuito' : `${book.price.toLocaleString()} Kz`}
                        </p>
                        <p className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">AOA</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <span className="px-4 py-1.5 bg-gray-50 text-gray-500 text-[9px] font-bold uppercase tracking-widest rounded-lg border border-gray-100">
                        {book.genre}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default BookCard;
