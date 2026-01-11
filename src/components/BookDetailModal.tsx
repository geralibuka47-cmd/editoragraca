import React from 'react';
import { X, ShoppingCart, Heart, Share2, Check } from 'lucide-react';

interface BookDetailModalProps {
    book: any;
    isOpen: boolean;
    onClose: () => void;
    onAddToCart: (book: any) => void;
}

const BookDetailModal: React.FC<BookDetailModalProps> = ({ book, isOpen, onClose, onAddToCart }) => {
    if (!isOpen || !book) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-brand-dark/60 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-white w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row animate-fade-in group">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 z-20 p-2 bg-gray-100 rounded-full hover:bg-brand-primary hover:text-white transition-all text-gray-500"
                    title="Fechar"
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Left: Image Section */}
                <div className="md:w-5/12 bg-brand-light p-12 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-brand-primary/10 to-transparent"></div>
                    <div className="relative z-10 w-full aspect-[3/4] bg-white rounded-lg shadow-2xl flex items-center justify-center p-12 border-4 border-white group-hover:scale-105 transition-transform duration-700">
                        <div className="text-center">
                            <h4 className="font-serif text-2xl font-black text-brand-dark mb-4">{book.title}</h4>
                            <div className="w-12 h-1 bg-brand-primary mx-auto"></div>
                        </div>
                    </div>
                </div>

                {/* Right: Info Section */}
                <div className="md:w-7/12 p-10 md:p-16 flex flex-col justify-center">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-brand-primary/10 text-brand-primary font-black text-[10px] uppercase tracking-widest rounded-full">
                                {book.category}
                            </span>
                            {book.isBestseller && (
                                <span className="flex items-center gap-1 text-orange-500 font-bold text-[10px] uppercase tracking-widest">
                                    <Star className="w-3 h-3 fill-current" /> Best Seller
                                </span>
                            )}
                        </div>

                        <h2 className="text-4xl md:text-5xl font-black text-brand-dark tracking-tighter leading-none">
                            {book.title}
                        </h2>

                        <p className="text-xl font-serif font-bold text-gray-500 italic">
                            {book.author}
                        </p>

                        <div className="flex items-center gap-2 text-green-600 font-bold text-xs uppercase tracking-widest">
                            <Check className="w-4 h-4" />
                            <span>Disponível em Stock</span>
                        </div>

                        <p className="text-gray-500 text-lg leading-relaxed font-normal py-4 border-y border-gray-100">
                            {book.description || "Uma obra literária excepcional que promete envolver o leitor do início ao fim, explorando temas universais com uma voz única."}
                        </p>

                        <div className="flex items-end justify-between pt-4">
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Preço Online</span>
                                <span className="text-4xl font-black text-brand-dark">{book.price?.toLocaleString()} Kz</span>
                            </div>

                            <div className="flex gap-4">
                                <button className="p-4 border-2 border-gray-100 rounded-2xl hover:border-brand-primary hover:text-brand-primary transition-all text-gray-400">
                                    <Heart className="w-6 h-6" />
                                </button>
                                <button className="p-4 border-2 border-gray-100 rounded-2xl hover:border-brand-primary hover:text-brand-primary transition-all text-gray-400">
                                    <Share2 className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        <div className="pt-6">
                            <button
                                onClick={() => {
                                    onAddToCart(book);
                                    onClose();
                                }}
                                className="w-full btn-premium py-5 justify-center text-lg rounded-2xl shadow-xl shadow-brand-primary/30"
                            >
                                <ShoppingCart className="w-6 h-6" />
                                Adicionar ao Meu Carrinho
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

import { Star } from 'lucide-react';

export default BookDetailModal;
