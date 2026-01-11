
import React from 'react';
import { X, Heart } from 'lucide-react';
import { Book } from '../types';

interface BookDetailModalProps {
    book: Book;
    onClose: () => void;
    onAddToCart: (book: Book) => void;
    onToggleWishlist: (book: Book) => void;
    isInWishlist: boolean;
}

const BookDetailModal: React.FC<BookDetailModalProps> = ({
    book,
    onClose,
    onAddToCart,
    onToggleWishlist,
    isInWishlist
}) => {
    return (
        <div className="fixed inset-0 z-[700] flex items-center justify-center p-0 md:p-4">
            <div className="absolute inset-0 bg-brand-900/95 backdrop-blur-md" onClick={onClose} />
            <div className="relative bg-white w-full max-w-5xl h-full md:h-auto md:max-h-[90vh] overflow-y-auto rounded-none md:rounded-[3rem] shadow-2xl flex flex-col md:flex-row animate-slide-up">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 md:top-10 md:right-10 text-gray-300 hover:text-brand-900 transition-colors z-[100] p-2 bg-brand-900/10 rounded-full backdrop-blur-sm md:bg-transparent"
                    title="Fechar detalhe do livro"
                    aria-label="Fechar detalhe do livro"
                >
                    <X size={24} />
                </button>

                <div className="w-full md:w-1/2 bg-brand-50 p-10 md:p-16 flex items-center justify-center relative min-h-[400px]">
                    <img src={book.coverUrl} loading="lazy" className="w-full max-w-[240px] md:max-w-[340px] aspect-[2/3] object-cover book-shadow rounded-sm relative z-10" alt={book.title} />
                </div>

                <div className="w-full md:w-1/2 p-8 md:p-24 flex flex-col justify-center space-y-6 md:space-y-10">
                    <div className="space-y-3 md:space-y-4">
                        <span className="text-accent-gold font-bold uppercase tracking-[0.5em] text-[9px] md:text-[10px]">{book.category}</span>
                        <h2 className="text-4xl md:text-6xl font-serif font-bold text-brand-900 leading-none">{book.title}</h2>
                        <p className="text-xl md:text-2xl font-serif italic text-gray-400">Obra de {book.author}</p>
                        {book.isbn && <p className="text-[9px] font-bold text-accent-gold uppercase tracking-[0.2em]">ISBN: {book.isbn}</p>}
                    </div>
                    <p className="text-gray-500 leading-relaxed md:leading-loose text-base md:text-lg font-light">{book.description}</p>
                    <div className="pt-6 flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-6 md:gap-8">
                        <span className="text-4xl md:text-5xl font-serif font-bold text-brand-900">{book.price.toLocaleString()} Kz</span>
                        <div className="flex gap-4">
                            <button
                                onClick={() => onToggleWishlist(book)}
                                className={`flex-1 md:flex-none p-5 md:p-6 rounded-2xl md:rounded-[1.5rem] border transition-all ${isInWishlist ? 'bg-accent-gold text-white' : 'border-brand-100 text-brand-900'}`}
                                title={isInWishlist ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                                aria-label={isInWishlist ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                            >
                                <Heart className={`mx-auto ${isInWishlist ? "fill-current" : ""}`} size={20} />
                            </button>
                            <button onClick={() => { onAddToCart(book); onClose(); }} className="flex-[3] md:flex-none px-8 md:px-12 py-5 md:py-6 bg-brand-900 text-white font-bold uppercase tracking-widest text-[10px] md:text-[11px] rounded-2xl md:rounded-[1.5rem] hover:bg-accent-gold transition-all shadow-2xl">Adicionar ao Carrinho</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookDetailModal;
