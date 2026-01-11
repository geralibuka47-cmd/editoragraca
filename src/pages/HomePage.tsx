
import React from 'react';
import { BookOpen, PenTool, Globe, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { ViewState, Book } from '../types';
import BookCard from '../components/BookCard';

interface HomePageProps {
    onNavigate: (view: ViewState) => void;
    books: Book[];
    addToCart: (book: Book) => void;
    toggleWishlist: (book: Book) => void;
    wishlist: Book[];
    setSelectedBook: (book: Book | null) => void;
}

const HomePage: React.FC<HomePageProps> = ({
    onNavigate,
    books,
    addToCart,
    toggleWishlist,
    wishlist,
    setSelectedBook
}) => {
    const featuredBooks = books.filter(b => b.isBestseller || b.isNew).slice(0, 4);

    return (
        <div className="animate-fade-in">
            {/* Hero Section */}
            <section className="relative h-[85vh] md:h-[95vh] flex items-center bg-brand-900 overflow-hidden text-white">
                <div className="absolute inset-0 opacity-30 bg-[url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-brand-900 via-brand-900/80 to-transparent"></div>

                <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10 w-full">
                    <div className="max-w-3xl space-y-8 md:space-y-12 animate-slide-up">
                        <div className="space-y-4">
                            <span className="flex items-center gap-3 text-accent-gold font-bold uppercase tracking-[0.5em] text-[10px] md:text-[12px]">
                                <Sparkles className="h-4 w-4 animate-pulse" />
                                Editora Graça · Malanje
                            </span>
                            <h1 className="text-6xl sm:text-8xl md:text-[10rem] font-serif font-bold leading-[0.9] tracking-tighter italic">
                                Elevando a <br />
                                <span className="text-accent-gold">Literatura</span>.
                            </h1>
                            <p className="text-gray-300 text-sm md:text-lg max-w-xl font-light leading-relaxed">
                                Descubra obras que transcendem o tempo. Da tradição oral à narrativa contemporânea, cultivamos o brilho das letras angolanas.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
                            <button
                                onClick={() => onNavigate('CATALOG')}
                                className="group w-full sm:w-auto px-10 md:px-16 py-5 md:py-6 bg-accent-gold text-white font-bold uppercase text-[10px] md:text-[11px] tracking-widest hover:bg-white hover:text-brand-900 transition-all shadow-2xl rounded-sm flex items-center justify-center gap-3"
                            >
                                Explorar Catálogo
                                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button
                                onClick={() => onNavigate('ABOUT')}
                                className="w-full sm:w-auto px-10 md:px-16 py-5 md:py-6 border border-white/20 text-white font-bold uppercase text-[10px] md:text-[11px] tracking-widest hover:bg-white/10 transition-all rounded-sm"
                            >
                                Nossa História
                            </button>
                        </div>
                    </div>
                </div>

                {/* Decorative Element */}
                <div className="absolute bottom-0 right-0 w-1/3 h-1/2 bg-accent-gold/10 blur-[120px] rounded-full translate-x-1/2 translate-y-1/2"></div>
            </section>

            {/* Featured Books Section */}
            {featuredBooks.length > 0 && (
                <section className="py-24 md:py-32 bg-brand-50/30">
                    <div className="max-w-7xl mx-auto px-4 md:px-6">
                        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                            <div className="space-y-2">
                                <span className="text-accent-gold font-bold uppercase tracking-widest text-[10px]">Sugestões da Editora</span>
                                <h2 className="text-4xl md:text-5xl font-serif font-bold text-brand-900">Destaques da Temporada</h2>
                            </div>
                            <button
                                onClick={() => onNavigate('CATALOG')}
                                className="text-[10px] font-bold text-brand-900 uppercase tracking-widest hover:text-accent-gold transition-colors flex items-center gap-2 border-b-2 border-accent-gold pb-1"
                            >
                                Ver todos os livros <ArrowRight size={14} />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                            {featuredBooks.map(book => (
                                <BookCard
                                    key={book.id}
                                    book={book}
                                    onAddToCart={addToCart}
                                    onToggleWishlist={toggleWishlist}
                                    onViewDetails={setSelectedBook}
                                    isInWishlist={wishlist.some(w => w.id === book.id)}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Stats Section */}
            <section className="py-20 md:py-32 bg-white">
                <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-20">
                    {[
                        { label: "Obras no Acervo", val: "150+", icon: <BookOpen className="h-6 w-6" /> },
                        { label: "Autores Angolanos", val: "45+", icon: <PenTool className="h-6 w-6" /> },
                        { label: "Distribuição Nacional", val: "18 Provas.", icon: <Globe className="h-6 w-6" /> },
                        { label: "Padrão de Qualidade", val: "Premium", icon: <ShieldCheck className="h-6 w-6" /> }
                    ].map((s, i) => (
                        <div key={i} className="text-center group">
                            <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center mx-auto text-accent-gold group-hover:bg-brand-900 group-hover:text-white transition-all transform group-hover:rotate-6 shadow-sm group-hover:shadow-xl">
                                {s.icon}
                            </div>
                            <p className="text-3xl md:text-4xl font-serif font-bold text-brand-900 mt-6">{s.val}</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-2">{s.label}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default HomePage;
