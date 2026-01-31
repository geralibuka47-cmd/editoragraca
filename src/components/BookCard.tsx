import React from 'react';
import { ShoppingCart, Heart, Eye, ArrowRight, Book as BookIcon } from 'lucide-react';
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
        <div className="card-premium group h-full flex flex-col hover-lift">
            {/* Badges Overlay */}
            <div className="absolute top-4 left-4 z-20 flex flex-wrap gap-2 pointer-events-none">
                {book.isBestseller && (
                    <span className="bg-brand-primary text-white text-[8px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest shadow-lg animate-pulse">
                        Best Seller
                    </span>
                )}
                {book.isNew && (
                    <span className="bg-brand-dark text-white text-[8px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest shadow-lg">
                        Novo
                    </span>
                )}
                {book.format === 'digital' && (
                    <span className="bg-blue-600/90 backdrop-blur-md text-white text-[8px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest shadow-lg">
                        Digital
                    </span>
                )}
            </div>

            {/* Image Area */}
            <div className="relative aspect-[3/4.2] rounded-2xl overflow-hidden bg-[#F1F5F9]">
                {book.coverUrl ? (
                    <img
                        src={optimizeImageUrl(book.coverUrl, 400, 560)}
                        alt={book.title}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 cursor-pointer"
                        loading="lazy"
                        onClick={() => onViewDetails(book)}
                    />
                ) : (
                    <div
                        className="w-full h-full p-8 flex items-center justify-center cursor-pointer bg-gradient-to-br from-gray-50 to-gray-100"
                        onClick={() => onViewDetails(book)}
                    >
                        <BookIcon className="w-16 h-16 text-gray-200" />
                    </div>
                )}

                {/* Glass Action Overlay */}
                <div className="absolute inset-x-0 bottom-4 flex justify-center gap-3 px-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-30">
                    <button
                        onClick={(e) => { e.stopPropagation(); onToggleWishlist(book); }}
                        className="w-12 h-12 glass-premium rounded-xl text-brand-dark hover:bg-brand-primary hover:text-white transition-all flex items-center justify-center shadow-xl active:scale-90"
                        title="Favorito"
                    >
                        <Heart className="w-5 h-5" />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onViewDetails(book); }}
                        className="w-12 h-12 glass-premium rounded-xl text-brand-dark hover:bg-brand-primary hover:text-white transition-all flex items-center justify-center shadow-xl active:scale-90"
                        title="Ver Detalhes"
                    >
                        <Eye className="w-5 h-5" />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onAddToCart(book); }}
                        className="w-12 h-12 bg-brand-primary rounded-xl text-white hover:bg-brand-dark transition-all flex items-center justify-center shadow-xl shadow-brand-primary/30 active:scale-90"
                        title="Carrinho"
                    >
                        <ShoppingCart className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="p-5 flex-1 flex flex-col">
                <div className="mb-2">
                    <p className="text-[9px] font-black text-brand-primary/50 uppercase tracking-[0.2em] mb-1">{book.genre || 'Literatura'}</p>
                    <h3
                        className="font-serif text-lg font-black text-brand-dark line-clamp-2 leading-tight group-hover:text-brand-primary transition-colors cursor-pointer min-h-[3rem]"
                        onClick={() => onViewDetails(book)}
                    >
                        {book.title}
                    </h3>
                </div>

                <p className="text-xs text-gray-400 font-bold mb-4 italic">por {book.author}</p>

                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest mb-0.5">Investimento</p>
                        <p className="text-xl font-black text-brand-dark tracking-tighter">
                            {book.price === 0 ? (
                                <span className="text-green-600">GRÁTIS</span>
                            ) : (
                                <span>{book.price.toLocaleString()}<span className="text-[10px] ml-1">Kz</span></span>
                            )}
                        </p>
                    </div>

                    <button
                        onClick={() => onViewDetails(book)}
                        title="Ver Detalhes do Livro"
                        className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-brand-primary hover:border-brand-primary hover:text-white transition-all active:scale-90 group/btn shadow-sm"
                    >
                        <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookCard;
