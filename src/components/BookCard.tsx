import React from 'react';
import { ShoppingBag, Eye } from 'lucide-react';
import { Book } from '../types';
import { optimizeImageUrl } from '../components/OptimizedImage';

interface BookCardProps {
    book: Book;
    onAddToCart: (book: any) => void;
    onToggleWishlist: (book: any) => void;
    onViewDetails: (book: any) => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onAddToCart, onViewDetails }) => {
    return (
        <div
            className="group relative flex flex-col gap-4 cursor-pointer"
            onClick={() => onViewDetails(book)}
        >
            {/* Cover Image - Clean Rounded Architecture */}
            <div className="relative aspect-[2/3] overflow-hidden rounded-2xl bg-gray-100 shadow-sm transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-brand-primary/10 group-hover:-translate-y-2">
                <img
                    src={optimizeImageUrl(book.coverUrl)}
                    alt={book.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Overlay Action - Tech Minimal */}
                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-white/95 backdrop-blur-md border-t border-gray-100 flex items-center justify-between">
                    <span className="text-brand-dark font-black text-lg">
                        {new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(book.price)}
                    </span>
                    <button
                        onClick={(e) => { e.stopPropagation(); onAddToCart(book); }}
                        className="p-2 bg-brand-dark text-white rounded-xl hover:bg-brand-primary transition-colors"
                        title="Adicionar ao carrinho"
                    >
                        <ShoppingBag className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Info - Clean Sans Typography */}
            <div className="space-y-1">
                <h3 className="font-sans font-bold text-brand-dark text-base leading-tight uppercase tracking-tight line-clamp-2 group-hover:text-brand-primary transition-colors">
                    {book.title}
                </h3>
                <p className="text-sm text-gray-400 font-medium font-body truncate">
                    {book.author}
                </p>
                <div className="flex items-center gap-2 pt-1">
                    <span className="px-2 py-0.5 bg-gray-100 text-brand-dark text-[10px] font-bold uppercase tracking-widest rounded-md">
                        {book.category}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default BookCard;
