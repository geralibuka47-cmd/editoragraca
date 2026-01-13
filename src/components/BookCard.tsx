import React from 'react';
import { ShoppingCart, Heart, Eye } from 'lucide-react';

interface BookCardProps {
    book: {
        id: string;
        title: string;
        author: string;
        price: number;
        category: string;
        description: string;
        coverUrl: string;
        format?: string;
        isBestseller?: boolean;
        isNew?: boolean;
    };
    onAddToCart: (book: any) => void;
    onToggleWishlist: (book: any) => void;
    onViewDetails: (book: any) => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onAddToCart, onToggleWishlist, onViewDetails }) => {
    return (
        <div className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
            {/* Badges */}
            <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                {book.isBestseller && (
                    <span className="bg-brand-primary text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                        Best Seller
                    </span>
                )}
                {book.isNew && (
                    <span className="bg-brand-dark text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                        Novidade
                    </span>
                )}
                {book.format === 'digital' && (
                    <span className="bg-blue-600 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                        Digital
                    </span>
                )}
            </div>

            {/* Image Area */}
            <div className="relative aspect-[3/4] bg-brand-light flex items-center justify-center overflow-hidden">
                {book.coverUrl ? (
                    <img
                        src={book.coverUrl}
                        alt={book.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full p-8 flex items-center justify-center">
                        <div className="w-full h-full bg-white/40 border border-brand-primary/10 rounded shadow-md transform group-hover:rotate-3 transition-transform duration-500 flex items-center justify-center">
                            <div className="text-center p-4">
                                <p className="font-serif font-bold text-brand-dark group-hover:text-brand-primary transition-colors leading-tight">{book.title}</p>
                                <div className="w-8 h-0.5 bg-brand-primary mx-auto mt-2"></div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Action Overlay */}
                <div className="absolute inset-0 bg-brand-dark/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                    <button
                        onClick={() => onToggleWishlist(book)}
                        className="p-3 bg-white rounded-full text-brand-dark hover:bg-brand-primary hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300"
                        title="Adicionar à Wishlist"
                    >
                        <Heart className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => onViewDetails(book)}
                        className="p-3 bg-white rounded-full text-brand-dark hover:bg-brand-primary hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-500"
                        title="Ver Detalhes"
                    >
                        <Eye className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => onAddToCart(book)}
                        className="p-3 bg-brand-primary rounded-full text-white hover:bg-brand-dark transition-all transform translate-y-4 group-hover:translate-y-0 duration-700 shadow-xl"
                        title="Adicionar ao Carrinho"
                    >
                        <ShoppingCart className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="p-6 space-y-2">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{book.category}</p>
                <h3 className="font-serif text-lg font-bold text-brand-dark line-clamp-1 group-hover:text-brand-primary transition-colors">
                    {book.title}
                </h3>
                <p className="text-sm text-gray-500 font-medium italic">{book.author}</p>

                <div className="flex justify-between items-center pt-4 border-t border-gray-50 mt-4">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Preço</span>
                        <span className="text-xl font-black text-brand-dark">{book.price.toLocaleString()} Kz</span>
                    </div>
                    <button
                        onClick={() => onAddToCart(book)}
                        className="text-brand-primary font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all"
                    >
                        Comprar <ArrowRight className="w-3 h-3" />
                    </button>
                </div>
            </div>
        </div>
    );
};

// Internal Import for the Arrow icon used in the component
import { ArrowRight } from 'lucide-react';

export default BookCard;
