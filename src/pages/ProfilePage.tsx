import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Book } from '../types';
import { BookOpen, Heart, User as UserIcon, LogOut, Settings, Download, ShoppingCart } from 'lucide-react';
import { motion as m, AnimatePresence } from 'framer-motion';
import { OptimizedImage } from '../components/OptimizedImage';
import { useToast } from '../components/Toast';

const ProfilePage: React.FC = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [activeTab, setActiveTab] = useState<'library' | 'wishlist' | 'settings'>('library');
    const [purchasedBooks, setPurchasedBooks] = useState<Book[]>([]);
    const [isLoadingLibrary, setIsLoadingLibrary] = useState(false);
    const [wishlist, setWishlist] = useState<Book[]>(() => {
        const saved = localStorage.getItem('wishlist');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        if (!loading && !user) {
            navigate('/login');
        }
    }, [user, loading, navigate]);

    useEffect(() => {
        const fetchLibrary = async () => {
            if (!user) return;
            if (activeTab === 'library') {
                setIsLoadingLibrary(true);
                try {
                    const { getUserBooks } = await import('../services/dataService');
                    const data = await getUserBooks(user.id);
                    setPurchasedBooks(data);
                } catch (error) {
                    console.error('Error fetching library:', error);
                } finally {
                    setIsLoadingLibrary(false);
                }
            }
        };
        fetchLibrary();
    }, [user, activeTab]);

    // Update wishlist from local storage when tab changes (simple sync)
    useEffect(() => {
        if (activeTab === 'wishlist') {
            const saved = localStorage.getItem('wishlist');
            if (saved) setWishlist(JSON.parse(saved));
        }
    }, [activeTab]);

    const handleDownload = (book: Book) => {
        if (!book.digitalFileUrl) {
            showToast('Ficheiro digital não disponível.', 'error');
            return;
        }
        window.open(book.digitalFileUrl, '_blank');
    };

    const handleLogout = async () => {
        const { logout } = await import('../services/authService');
        await logout();
        navigate('/');
    };

    if (loading || !user) return null; // Or loader

    return (
        <div className="min-h-screen bg-gray-50 pt-32 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8 flex flex-col md:flex-row items-center gap-8">
                    <div className="w-24 h-24 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center text-4xl font-bold uppercase">
                        {user.name.charAt(0)}
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                        <p className="text-gray-500">{user.email}</p>
                        <div className="flex items-center justify-center md:justify-start gap-4 mt-4">
                            <span className="px-3 py-1 bg-brand-primary/10 text-brand-primary rounded-full text-xs font-bold uppercase tracking-wider">
                                {user.role === 'adm' ? 'Administrador' : 'Leitor Membro'}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-6 py-3 border border-gray-200 rounded-xl hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all font-medium text-gray-600"
                    >
                        <LogOut className="w-4 h-4" /> Terminar Sessão
                    </button>
                </div>

                {/* Navigation */}
                <div className="flex justify-center mb-8">
                    <div className="bg-white p-1.5 rounded-xl shadow-sm border border-gray-100 flex gap-2 overflow-x-auto">
                        {[
                            { id: 'library', label: 'Minha Biblioteca', icon: BookOpen },
                            { id: 'wishlist', label: 'Lista de Desejos', icon: Heart },
                            { id: 'settings', label: 'Definições', icon: Settings },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-sm transition-all whitespace-nowrap ${activeTab === tab.id
                                    ? 'bg-brand-primary text-white shadow-md'
                                    : 'text-gray-500 hover:bg-gray-50'
                                    }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <AnimatePresence mode="wait">
                    <m.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {activeTab === 'library' && (
                            <div className="space-y-6">
                                {isLoadingLibrary ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                        {[1, 2, 3, 4].map((i) => (
                                            <div key={i} className="bg-white rounded-2xl h-80 animate-pulse border border-gray-100" />
                                        ))}
                                    </div>
                                ) : purchasedBooks.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                        {purchasedBooks.map((book) => (
                                            <div key={book.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-lg transition-all">
                                                <div className="aspect-[2/3] relative overflow-hidden bg-gray-100">
                                                    <OptimizedImage
                                                        src={book.coverUrl}
                                                        alt={book.title}
                                                        className="object-cover w-full h-full"
                                                    />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <button
                                                            onClick={() => handleDownload(book)}
                                                            className="flex items-center gap-2 px-6 py-3 bg-white text-brand-dark rounded-full font-bold transform translate-y-4 group-hover:translate-y-0 transition-all shadow-xl hover:bg-brand-primary hover:text-white"
                                                        >
                                                            <Download className="w-4 h-4" /> Ler / Baixar
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="p-4">
                                                    <h3 className="font-bold text-gray-900 line-clamp-1">{book.title}</h3>
                                                    <p className="text-sm text-gray-500 mb-2">{book.author}</p>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs font-bold uppercase text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">Adquirido</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                                        <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">A sua biblioteca está vazia</h3>
                                        <p className="text-gray-500 mb-6">Explore o nosso catálogo e comece a sua coleção de leitura.</p>
                                        <button
                                            onClick={() => navigate('/livros')}
                                            className="px-8 py-3 bg-brand-primary text-white font-bold rounded-xl hover:bg-brand-dark transition-colors shadow-lg shadow-brand-primary/20"
                                        >
                                            Explorar Livros
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'wishlist' && (
                            <div>
                                {wishlist.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                        {wishlist.map((book) => (
                                            <div key={book.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-lg transition-all">
                                                <div className="aspect-[2/3] relative overflow-hidden bg-gray-100">
                                                    <OptimizedImage
                                                        src={book.coverUrl}
                                                        alt={book.title}
                                                        className="object-cover w-full h-full"
                                                    />
                                                    <button
                                                        title="Remover dos favoritos"
                                                        aria-label="Remover dos favoritos"
                                                        className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full text-red-500 shadow-sm hover:bg-white"
                                                        onClick={() => {
                                                            // Logic to remove from wishlist would go here, updating local storage and state
                                                            const newWishlist = wishlist.filter(b => b.id !== book.id);
                                                            setWishlist(newWishlist);
                                                            localStorage.setItem('wishlist', JSON.stringify(newWishlist));
                                                            showToast('Removido da lista de desejos', 'info');
                                                            // Dispatch custom event to notify App.tsx if needed, or rely on App.tsx finding out later
                                                            window.dispatchEvent(new Event('storage'));
                                                        }}
                                                    >
                                                        <Heart className="w-5 h-5 fill-current" />
                                                    </button>
                                                </div>
                                                <div className="p-4">
                                                    <h3 className="font-bold text-gray-900 line-clamp-1">{book.title}</h3>
                                                    <p className="text-sm text-gray-500 mb-3">{book.author}</p>
                                                    <button
                                                        onClick={() => {
                                                            navigate(`/livro/${book.id}`);
                                                        }}
                                                        className="w-full py-2 bg-brand-primary/10 text-brand-primary font-bold rounded-lg hover:bg-brand-primary hover:text-white transition-colors flex items-center justify-center gap-2"
                                                    >
                                                        <ShoppingCart className="w-4 h-4" /> Comprar
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                                        <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">Lista de desejos vazia</h3>
                                        <p className="text-gray-500 mb-6">Guarde os livros que mais gosta para comprar mais tarde.</p>
                                        <button
                                            onClick={() => navigate('/livros')}
                                            className="px-8 py-3 bg-brand-primary text-white font-bold rounded-xl hover:bg-brand-dark transition-colors shadow-lg shadow-brand-primary/20"
                                        >
                                            Ver Catálogo
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'settings' && (
                            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm max-w-2xl mx-auto">
                                <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">Informações da Conta</h2>
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">Nome Completo</label>
                                        <div className="p-3 bg-gray-50 rounded-lg text-gray-900 font-medium border border-gray-200">
                                            {user.name}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                                        <div className="p-3 bg-gray-50 rounded-lg text-gray-900 font-medium border border-gray-200">
                                            {user.email}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">Tipo de Membro</label>
                                        <div className="p-3 bg-gray-50 rounded-lg text-gray-900 font-medium border border-gray-200 capitalize">
                                            {user.role}
                                        </div>
                                    </div>

                                    <div className="pt-6">
                                        <button className="text-brand-primary font-bold hover:underline text-sm">
                                            Alterar Palavra-passe
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </m.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ProfilePage;
