import React, { useState, useEffect } from 'react';
import { X, ShoppingCart, Heart, Share2, Check, Star, Eye, Download, Send, Loader2 } from 'lucide-react';
import { Book, User as UserType } from '../types';
import {
    getBookReviews,
    addBookReview,
    getBookStats,
    incrementBookView,
    checkIsFavorite,
    toggleFavorite,
    checkDownloadAccess
} from '../services/dataService';

interface BookDetailModalProps {
    book: any;
    isOpen: boolean;
    onClose: () => void;
    onAddToCart: (book: any) => void;
}

const BookDetailModal: React.FC<BookDetailModalProps & { user?: UserType | null; onNavigate?: (path: string) => void }> = ({ book, isOpen, onClose, onAddToCart, user, onNavigate }) => {
    const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details');
    const [stats, setStats] = useState<any>({ views: 0, rating: 0, downloads: 0, sales: 0, reviewsCount: 0 });
    const [isFavorite, setIsFavorite] = useState(false);
    const [hasDownloadAccess, setHasDownloadAccess] = useState(false);
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);
    const [reviewContent, setReviewContent] = useState('');
    const [reviewRating, setReviewRating] = useState(5);
    const [reviews, setReviews] = useState<any[]>([]);

    useEffect(() => {
        if (isOpen && book) {
            const loadData = async () => {
                const [realStats, bookReviews, favStatus, downloadAccess] = await Promise.all([
                    getBookStats(book.id),
                    getBookReviews(book.id),
                    user ? checkIsFavorite(book.id, user.id) : Promise.resolve(false),
                    checkDownloadAccess(book.id, user?.id, book.price || 0)
                ]);

                setStats(realStats);
                setReviews(bookReviews);
                setIsFavorite(favStatus);
                setHasDownloadAccess(downloadAccess);

                // Track view
                await incrementBookView(book.id);
            };
            loadData();
        }
    }, [isOpen, book, user]);

    const handleToggleFavorite = async () => {
        if (!user) {
            // Handle if not logged in - maybe toast?
            return;
        }
        const newStatus = await toggleFavorite(book.id, user.id);
        setIsFavorite(newStatus);
    };

    const handleAddReview = async () => {
        if (!user || !reviewContent.trim()) return;

        setIsSubmittingReview(true);
        try {
            await addBookReview({
                bookId: book.id,
                userId: user.id,
                userName: user.name,
                rating: reviewRating,
                comment: reviewContent.trim()
            });

            // Reload data
            const [newStats, newReviews] = await Promise.all([
                getBookStats(book.id),
                getBookReviews(book.id)
            ]);
            setStats(newStats);
            setReviews(newReviews);
            setReviewContent('');
            setReviewRating(5);
        } catch (error) {
            console.error("Error submitting review:", error);
        } finally {
            setIsSubmittingReview(false);
        }
    };

    if (!isOpen || !book) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-brand-dark/60 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-white w-full max-w-5xl rounded-3xl shadow-2xl flex flex-col md:flex-row animate-fade-in group max-h-[90vh] md:h-auto overflow-y-auto md:overflow-visible my-auto">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 md:top-6 md:right-6 z-30 p-2 bg-white/80 md:bg-gray-100 backdrop-blur-sm rounded-full hover:bg-brand-primary hover:text-white transition-all text-gray-500 shadow-lg"
                    title="Fechar"
                >
                    <X className="w-5 h-5 md:w-6 md:h-6" />
                </button>

                {/* Left: Image Section */}
                <div className="w-full md:w-5/12 bg-brand-light p-8 md:p-12 flex flex-col items-center justify-center relative shrink-0 min-h-[400px]">
                    <div className="absolute inset-0 bg-gradient-to-tr from-brand-primary/10 to-transparent"></div>
                    <div className="relative z-10 w-full max-w-[240px] md:max-w-none aspect-[3/4] rounded-lg shadow-2xl flex items-center justify-center overflow-hidden border-4 border-white group-hover:scale-105 transition-transform duration-700 mb-8">
                        {book.coverUrl ? (
                            <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
                        ) : (
                            <div className="text-center p-6 bg-white w-full h-full flex flex-col items-center justify-center">
                                <h4 className="font-serif text-xl md:text-2xl font-black text-brand-dark mb-4">{book.title}</h4>
                                <div className="w-10 h-1 bg-brand-primary mx-auto"></div>
                            </div>
                        )}
                    </div>

                    {/* Stats Grid */}
                    <div className="relative z-10 grid grid-cols-2 gap-4 w-full max-w-xs">
                        <div className="bg-white/80 backdrop-blur rounded-xl p-3 text-center shadow-sm">
                            <Eye className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                            <div className="font-black text-brand-dark text-lg">{stats.views}</div>
                            <div className="text-[10px] uppercase tracking-widest text-gray-500">Visualizações</div>
                        </div>
                        <div className="bg-white/80 backdrop-blur rounded-xl p-3 text-center shadow-sm">
                            <Star className="w-5 h-5 text-yellow-400 mx-auto mb-1 fill-yellow-400" />
                            <div className="font-black text-brand-dark text-lg">{stats.rating}</div>
                            <div className="text-[10px] uppercase tracking-widest text-gray-500">Avaliação</div>
                        </div>
                        {book.format === 'digital' ? (
                            <div className="bg-white/80 backdrop-blur rounded-xl p-3 text-center shadow-sm col-span-2">
                                <Download className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                                <div className="font-black text-brand-dark text-lg">{stats.sales}</div>
                                <div className="text-[10px] uppercase tracking-widest text-gray-500">Downloads</div>
                            </div>
                        ) : (
                            <div className="bg-white/80 backdrop-blur rounded-xl p-3 text-center shadow-sm col-span-2">
                                <ShoppingCart className="w-5 h-5 text-green-500 mx-auto mb-1" />
                                <div className="font-black text-brand-dark text-lg">{stats.sales}</div>
                                <div className="text-[10px] uppercase tracking-widest text-gray-500">Exemplares Vendidos</div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Info Section */}
                <div className="w-full md:w-7/12 flex flex-col bg-white">
                    <div className="p-6 md:p-8 border-b border-gray-100 flex gap-6">
                        <button
                            onClick={() => setActiveTab('details')}
                            className={`pb-2 text-sm font-bold uppercase tracking-widest border-b-2 transition-all ${activeTab === 'details' ? 'border-brand-primary text-brand-dark' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                        >
                            Detalhes
                        </button>
                        <button
                            onClick={() => setActiveTab('reviews')}
                            className={`pb-2 text-sm font-bold uppercase tracking-widest border-b-2 transition-all ${activeTab === 'reviews' ? 'border-brand-primary text-brand-dark' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                        >
                            Avaliações ({reviews.length})
                        </button>
                    </div>

                    <div className="p-6 md:p-8">
                        {activeTab === 'details' ? (
                            <div className="space-y-6">
                                <div className="flex flex-wrap items-center gap-2 md:gap-3">
                                    <span className="px-2 md:px-3 py-1 bg-brand-primary/10 text-brand-primary font-black text-[9px] md:text-[10px] uppercase tracking-widest rounded-full">
                                        {book.genre}
                                    </span>
                                    <span className={`px-2 md:px-3 py-1 font-black text-[9px] md:text-[10px] uppercase tracking-widest rounded-full ${book.format === 'digital' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
                                        {book.format === 'digital' ? 'E-Book' : 'Livro Físico'}
                                    </span>
                                </div>

                                <h2 className="text-3xl md:text-5xl font-black text-brand-dark tracking-tighter leading-tight">
                                    {book.title}
                                </h2>

                                <p className="text-lg md:text-xl font-serif font-bold text-gray-500 italic">
                                    {book.author}
                                </p>

                                <div className="flex items-center gap-2 text-green-600 font-bold text-[10px] md:text-xs uppercase tracking-widest">
                                    <Check className="w-3 h-3 md:w-4 md:h-4" />
                                    <span>{book.format === 'digital' ? 'Download Imediato' : 'Disponível em Stock'}</span>
                                </div>

                                <p className="text-gray-500 text-sm md:text-lg leading-relaxed font-normal py-4 border-y border-gray-100">
                                    {book.description || "Uma obra literária excepcional que promete envolver o leitor do início ao fim."}
                                </p>

                                <div className="flex items-center justify-between pt-2">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Preço Online</span>
                                        <span className="text-2xl md:text-4xl font-black text-brand-dark">
                                            {book.price === 0 ? 'GRATUITO' : `${book.price?.toLocaleString()} Kz`}
                                        </span>
                                    </div>

                                    <div className="flex gap-2 md:gap-4">
                                        <button
                                            onClick={handleToggleFavorite}
                                            className={`p-3 md:p-4 border-2 rounded-xl md:rounded-2xl transition-all ${isFavorite ? 'bg-red-50 border-red-200 text-red-500' : 'border-gray-100 hover:border-brand-primary hover:text-brand-primary text-gray-400'}`}
                                            title={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                                            aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                                        >
                                            <Heart className={`w-5 h-5 md:w-6 md:h-6 ${isFavorite ? 'fill-current' : ''}`} />
                                        </button>
                                        <button className="p-3 md:p-4 border-2 border-gray-100 rounded-xl md:rounded-2xl hover:border-brand-primary hover:text-brand-primary transition-all text-gray-400" title="Partilhar" aria-label="Partilhar">
                                            <Share2 className="w-5 h-5 md:w-6 md:h-6" />
                                        </button>
                                    </div>
                                </div>

                                <div className="pt-4 md:pt-6 space-y-3">
                                    {/* Download Button for Digital Books */}
                                    {book.format === 'digital' && book.digitalFileUrl && (
                                        <div>
                                            {book.price === 0 ? (
                                                <a
                                                    href={book.digitalFileUrl}
                                                    download
                                                    className="w-full btn-premium py-4 md:py-5 justify-center text-base md:text-lg rounded-xl md:rounded-2xl shadow-xl shadow-green-500/30 !bg-green-600 hover:!bg-green-700"
                                                >
                                                    <Download className="w-5 h-5 md:w-6 md:h-6" />
                                                    Download Gratuito
                                                </a>
                                            ) : hasDownloadAccess ? (
                                                <a
                                                    href={book.digitalFileUrl}
                                                    download
                                                    className="w-full btn-premium py-4 md:py-5 justify-center text-base md:text-lg rounded-xl md:rounded-2xl shadow-xl shadow-blue-500/30 !bg-blue-600 hover:!bg-blue-700"
                                                >
                                                    <Download className="w-5 h-5 md:w-6 md:h-6" />
                                                    Fazer Download
                                                </a>
                                            ) : (
                                                <button
                                                    onClick={() => {
                                                        onAddToCart(book);
                                                        onClose();
                                                    }}
                                                    className="w-full btn-premium py-4 md:py-5 justify-center text-base md:text-lg rounded-xl md:rounded-2xl shadow-xl shadow-brand-primary/30"
                                                >
                                                    <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
                                                    Comprar para Download
                                                </button>
                                            )}
                                        </div>
                                    )}

                                    {/* Add to Cart Button (for physical books or digital without download access) */}
                                    {(book.format !== 'digital' || !book.digitalFileUrl) && (
                                        <button
                                            onClick={() => {
                                                onAddToCart(book);
                                                onClose();
                                            }}
                                            className="w-full btn-premium py-4 md:py-5 justify-center text-base md:text-lg rounded-xl md:rounded-2xl shadow-xl shadow-brand-primary/30"
                                        >
                                            <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
                                            Adicionar ao Carrinho
                                        </button>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* Review List */}
                                {reviews.length > 0 ? (
                                    <div className="space-y-4">
                                        {reviews.map(review => (
                                            <div key={review.id} className="bg-gray-50 rounded-xl p-4">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <h5 className="font-bold text-brand-dark">{review.userName}</h5>
                                                        <div className="flex text-yellow-400">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} />
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <span className="text-xs text-gray-400">{new Date(review.date).toLocaleDateString()}</span>
                                                </div>
                                                <p className="text-sm text-gray-600">{review.comment}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 text-gray-500">
                                        <p>Ainda não há avaliações para este livro.</p>
                                        <p className="text-sm">Seja o primeiro a avaliar!</p>
                                    </div>
                                )}

                                {/* Add Review Form */}
                                <div className="border-t pt-6">
                                    <h4 className="font-bold text-brand-dark mb-4">Escrever Avaliação</h4>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-sm text-gray-500 font-bold uppercase tracking-widest">A sua nota:</span>
                                            <div className="flex gap-1">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button
                                                        key={star}
                                                        onClick={() => setReviewRating(star)}
                                                        className="focus:outline-none transition-transform hover:scale-110"
                                                        title={`${star} estrelas`}
                                                        aria-label={`Avaliar com ${star} estrelas`}
                                                    >
                                                        <Star
                                                            className={`w-6 h-6 ${star <= reviewRating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                                        />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="relative">
                                            <textarea
                                                placeholder={user ? "Partilhe a sua opinião sobre o livro..." : "Inicie sessão para avaliar este livro."}
                                                value={reviewContent}
                                                onChange={(e) => setReviewContent(e.target.value)}
                                                disabled={!user || isSubmittingReview}
                                                className="input-premium h-32 resize-none !text-sm"
                                                rows={3}
                                            />
                                            <button
                                                onClick={handleAddReview}
                                                disabled={!user || isSubmittingReview || !reviewContent.trim()}
                                                className="absolute right-3 bottom-3 p-3 bg-brand-primary text-white rounded-xl shadow-lg shadow-brand-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                                                title="Enviar Avaliação"
                                                aria-label="Enviar Avaliação"
                                            >
                                                {isSubmittingReview ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Send className="w-4 h-4" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookDetailModal;
