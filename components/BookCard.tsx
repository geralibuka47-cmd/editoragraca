
import React, { useState } from 'react';
import { ShoppingCart, Eye, Star, Sparkles, ChevronDown, BookOpen, Heart, User } from 'lucide-react';
import { Book } from '../types';

interface BookCardProps {
  book: Book;
  allBooks?: Book[];
  onAddToCart: (book: Book) => void;
  onViewDetails: (book: Book) => void;
  onToggleWishlist: (book: Book) => void;
  isInWishlist?: boolean;
}

const BookCard: React.FC<BookCardProps> = ({ 
    book, 
    allBooks = [], 
    onAddToCart, 
    onViewDetails, 
    onToggleWishlist,
    isInWishlist = false
}) => {
  const [isBioExpanded, setIsBioExpanded] = useState(false);
  const [userRating, setUserRating] = useState(3);
  const [hoverRating, setHoverRating] = useState(0);

  const otherBooks = allBooks
    .filter(b => b.author === book.author && b.id !== book.id)
    .slice(0, 3);

  return (
    <div className="group flex flex-col h-full bg-white p-3 rounded-lg hover:shadow-2xl transition-all duration-500 border border-brand-100/50 hover:border-accent-gold/30">
      {/* Imagem e Overlays */}
      <div 
        className="relative mb-6 cursor-pointer overflow-hidden rounded-md aspect-[2/3]" 
        onClick={() => onViewDetails(book)}
      >
        <img 
          src={book.coverUrl} 
          alt={book.title} 
          loading="lazy"
          className="w-full h-full object-cover book-shadow transition-transform duration-1000 group-hover:scale-110"
        />
        
        {/* Badges - Canto Superior Direito (Stack Vertical) */}
        <div className="absolute top-3 right-3 z-20 flex flex-col gap-2 items-end">
          {book.isNew && (
            <div className="bg-gradient-to-r from-accent-gold to-accent-goldLight text-white text-[7px] font-black uppercase tracking-[0.2em] px-3 py-1.5 shadow-2xl flex items-center gap-1.5 animate-slide-up rounded-sm ring-1 ring-white/20">
              <Sparkles size={10} className="animate-pulse" /> Novo
            </div>
          )}
          {book.isBestseller && (
            <div className="bg-gradient-to-r from-brand-900 to-accent-goldDark text-white text-[7px] font-black uppercase tracking-[0.2em] px-3 py-1.5 shadow-2xl flex items-center gap-1.5 animate-slide-up delay-100 rounded-sm ring-1 ring-white/20">
              <Star size={10} fill="currentColor" /> Mais Vendido
            </div>
          )}
        </div>

        {/* Wishlist Button */}
        <button 
          onClick={(e) => { e.stopPropagation(); onToggleWishlist(book); }}
          className={`absolute top-3 left-3 z-30 p-2.5 rounded-full backdrop-blur-md transition-all duration-300 shadow-lg ${isInWishlist ? 'bg-accent-gold text-white' : 'bg-white/90 text-brand-900 hover:bg-white hover:text-accent-gold'}`}
        >
          <Heart size={14} className={isInWishlist ? 'fill-current' : ''} />
        </button>

        {/* Hover Overlay "Ver Detalhes" */}
        <div className="absolute inset-0 bg-brand-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center backdrop-blur-[2px]">
          <button className="bg-white text-brand-900 font-bold uppercase text-[9px] tracking-[0.2em] px-6 py-3 rounded-sm shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 flex items-center gap-2 hover:bg-accent-gold hover:text-white">
            <Eye size={14} /> Ver Detalhes
          </button>
        </div>
      </div>
      
      {/* Informações do Livro */}
      <div className="flex flex-col flex-grow text-center">
        <span className="text-[9px] uppercase tracking-[0.3em] text-accent-gold font-bold mb-2">{book.category}</span>
        <h3 className="font-serif text-xl font-bold text-brand-900 mb-1 leading-tight group-hover:text-accent-gold transition-colors line-clamp-2 min-h-[3rem]">
          {book.title}
        </h3>
        <p className="text-xs italic text-gray-400 mb-2 font-serif">por {book.author}</p>
        
        {/* Sistema de Avaliação (Rating) */}
        <div className="flex items-center justify-center gap-1 mb-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setUserRating(star)}
              className="focus:outline-none transform transition-transform active:scale-125"
            >
              <Star 
                size={14} 
                className={`transition-colors duration-200 ${
                  star <= (hoverRating || userRating) 
                    ? 'text-accent-gold fill-accent-gold' 
                    : 'text-brand-100'
                }`} 
              />
            </button>
          ))}
          <span className="text-[9px] font-bold text-brand-200 ml-1">({userRating}.0)</span>
        </div>

        {/* ISBN Campo - Exibição Discreta */}
        {book.isbn && (
          <p className="text-[8px] text-gray-300 uppercase tracking-[0.2em] mb-4 font-medium">
            ISBN: {book.isbn}
          </p>
        )}
        
        {/* Bio Expansível do Autor */}
        <div className="mb-4">
          <button 
            onClick={() => setIsBioExpanded(!isBioExpanded)}
            className="text-[8px] font-bold uppercase tracking-widest text-brand-800 hover:text-accent-gold transition-colors flex items-center justify-center gap-1.5 mx-auto"
          >
            {isBioExpanded ? 'Fechar Perfil' : 'Conhecer Autor'}
            <ChevronDown size={10} className={`transition-transform duration-300 ${isBioExpanded ? 'rotate-180' : ''}`} />
          </button>
          
          <div className={`overflow-hidden transition-all duration-500 ${isBioExpanded ? 'max-h-56 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
            <div className="text-left p-4 bg-brand-50 rounded-lg border border-brand-100 text-[10px] leading-relaxed">
              <p className="text-gray-600 italic mb-3">
                <User size={10} className="inline mr-1" />
                Autor exclusivo da Editora Graça, focado em narrativas angolanas contemporâneas e tradição oral.
              </p>
              {otherBooks.length > 0 && (
                <div className="pt-3 border-t border-brand-200">
                  <p className="font-bold text-accent-gold uppercase tracking-tighter mb-2">Outras Obras:</p>
                  <ul className="space-y-1">
                    {otherBooks.map(b => (
                      <li key={b.id} className="text-brand-900 hover:text-accent-gold cursor-pointer transition-colors truncate">
                        • {b.title}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Preço e Compra */}
        <div className="mt-auto pt-4 border-t border-brand-50 flex items-center justify-between gap-4">
          <span className="font-bold text-brand-900 text-lg">{book.price.toLocaleString()} Kz</span>
          <button 
            onClick={() => onAddToCart(book)}
            className="bg-brand-900 text-white p-3 rounded-md hover:bg-accent-gold transition-all shadow-md active:scale-95"
            title="Adicionar ao Carrinho"
          >
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
