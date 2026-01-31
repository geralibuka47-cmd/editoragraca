import React from 'react';
import { ShoppingCart, Heart, Eye } from 'lucide-react';
import { Book } from '../types';
import { optimizeImageUrl } from '../components/OptimizedImage';

interface BookCardProps {
    book: Book;
    onAddToCart: (book: any) => void;
    onToggleWishlist: (book: any) => void;
    onViewDetails: (book: any) => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onAddToCart, onToggleWishlist, onViewDetails }) => {
    return (
        <div className="group relative flex flex-col h-full bg-transparent hover:-translate-y-2 transition-transform duration-700 ease-out">
            {/* Minimalist Image Container */}
            <div className="relative aspect-[2/3] overflow-hidden rounded-[2px] mb-6 shadow-xl bg-[#F0F0F0]">
                {book.coverUrl ? (
                    <img
                        src={optimizeImageUrl(book.coverUrl, 400, 600)}
                        alt={book.title}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-in-out cursor-pointer"
                        loading="lazy"
                        onClick={() => onViewDetails(book)}
                    />
                ) : (
                    <div
                        className="w-full h-full flex items-center justify-center cursor-pointer bg-gray-50"
                        onClick={() => onViewDetails(book)}
                    >
                        <span className="text-brand-primary/20 font-serif italic text-4xl">OPUS</span>
                    </div>
                )}

                {/* Subtle Overlay Actions */}
                <div className="absolute inset-0 bg-brand-dark/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                <div className="absolute top-4 right-4 flex flex-col gap-3 translate-x-10 group-hover:translate-x-0 transition-transform duration-500 stagger-100 opacity-0 group-hover:opacity-100 z-20">
                    <button
                        onClick={(e) => { e.stopPropagation(); onToggleWishlist(book); }}
                        className="w-10 h-10 bg-white text-brand-dark hover:bg-brand-primary hover:text-white flex items-center justify-center transition-all duration-300 shadow-lg"
                        title="Favorito"
                    >
                        <Heart className="w-4 h-4" />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onViewDetails(book); }}
                        className="w-10 h-10 bg-white text-brand-dark hover:bg-brand-primary hover:text-white flex items-center justify-center transition-all duration-300 shadow-lg"
                        title="Ver Detalhes"
                    >
                        <Eye className="w-4 h-4" />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onAddToCart(book); }}
                        className="w-10 h-10 bg-brand-dark text-white hover:bg-brand-primary flex items-center justify-center transition-all duration-300 shadow-lg"
                        title="Adicionar ao Carrinho"
                    >
                        <ShoppingCart className="w-4 h-4" />
                    </button>
                </div>

                {/* Status Badges - Minimal */}
                <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
                    {book.isBestseller && (
                        <span className="bg-brand-primary text-white text-[8px] font-black px-3 py-1 uppercase tracking-[0.2em] shadow-md">
                            Bestseller
                        </span>
                    )}
                    {book.isNew && (
                        <span className="bg-white text-brand-dark text-[8px] font-black px-3 py-1 uppercase tracking-[0.2em] shadow-md border border-gray-100">
                            Novo
                        </span>
                    )}
                </div>
            </div>

            {/* Editorial Metadata */}
            <div className="flex-1 flex flex-col items-center text-center space-y-3 px-2">
                <span className="text-[9px] font-black text-brand-primary uppercase tracking-[0.3em] block">
                    {book.genre || 'Coleção'}
                </span>

                <h3
                    className="font-serif text-xl md:text-2xl text-brand-dark leading-none cursor-pointer hover:text-brand-primary transition-colors duration-300"
                    onClick={() => onViewDetails(book)}
                >
                    {book.title}
                </h3>

                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-[0.1em] border-b border-gray-100 pb-4 w-12 mx-auto">
                    {book.author}
                </p>

                <div className="mt-auto pt-2">
                    <p className="text-lg font-serif italic text-brand-dark">
                        {book.price === 0 ? (
                            <span className="text-brand-primary decoration-1 underline-offset-4">Cortesia</span>
                        ) : (
                            <span>{book.price.toLocaleString()} Kz</span>
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default BookCard;
