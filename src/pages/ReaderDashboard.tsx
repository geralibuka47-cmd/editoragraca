import React, { useState } from 'react';
import { Book, Heart, Clock, Settings, Download, User as UserIcon } from 'lucide-react';
import { ViewState, User } from '../types';

interface ReaderDashboardProps {
    user: User | null;
    onNavigate: (view: ViewState) => void;
}

const ReaderDashboard: React.FC<ReaderDashboardProps> = ({ user, onNavigate }) => {
    const [activeTab, setActiveTab] = useState<'library' | 'wishlist' | 'history' | 'settings'>('library');

    // Mock data - in real app would come from database
    const purchasedBooks = [
        {
            id: '1',
            title: 'A Gloriosa Família',
            author: 'Pepetela',
            coverUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop',
            purchaseDate: '2026-01-05',
            format: 'PDF'
        },
        {
            id: '2',
            title: 'O Desejo de Kianda',
            author: 'Pepetela',
            coverUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop',
            purchaseDate: '2025-12-28',
            format: 'EPUB'
        }
    ];

    const wishlistBooks = [
        {
            id: '3',
            title: 'Mayombe',
            author: 'Pepetela',
            coverUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop',
            price: 8500
        }
    ];

    if (!user) {
        return (
            <div className="min-h-screen bg-brand-light flex items-center justify-center p-8">
                <div className="bg-white rounded-3xl shadow-xl p-12 text-center max-w-md">
                    <UserIcon className="w-16 h-16 text-gray-300 mx-auto mb-6" />
                    <h2 className="text-3xl font-black text-brand-dark mb-4">Área Restrita</h2>
                    <p className="text-gray-600 mb-8">Faça login para aceder ao seu painel de leitor.</p>
                    <button
                        onClick={() => onNavigate('AUTH')}
                        className="btn-premium w-full justify-center"
                    >
                        Fazer Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brand-light">
            {/* Header */}
            <section className="bg-brand-dark text-white py-16">
                <div className="container mx-auto px-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-2">
                                Olá, <span className="text-brand-primary">{user.name}</span>
                            </h1>
                            <p className="text-gray-300">Bem-vindo ao seu painel de leitor</p>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => setActiveTab('library')}
                            className={`px-6 py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-all ${activeTab === 'library'
                                ? 'bg-brand-primary text-white'
                                : 'bg-white/10 text-white hover:bg-white/20'
                                }`}
                        >
                            <Book className="w-4 h-4 inline mr-2" />
                            Minha Biblioteca
                        </button>
                        <button
                            onClick={() => setActiveTab('wishlist')}
                            className={`px-6 py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-all ${activeTab === 'wishlist'
                                ? 'bg-brand-primary text-white'
                                : 'bg-white/10 text-white hover:bg-white/20'
                                }`}
                        >
                            <Heart className="w-4 h-4 inline mr-2" />
                            Lista de Desejos
                        </button>
                        <button
                            onClick={() => setActiveTab('history')}
                            className={`px-6 py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-all ${activeTab === 'history'
                                ? 'bg-brand-primary text-white'
                                : 'bg-white/10 text-white hover:bg-white/20'
                                }`}
                        >
                            <Clock className="w-4 h-4 inline mr-2" />
                            Histórico
                        </button>
                        <button
                            onClick={() => setActiveTab('settings')}
                            className={`px-6 py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-all ${activeTab === 'settings'
                                ? 'bg-brand-primary text-white'
                                : 'bg-white/10 text-white hover:bg-white/20'
                                }`}
                        >
                            <Settings className="w-4 h-4 inline mr-2" />
                            Definições
                        </button>
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="py-12">
                <div className="container mx-auto px-8">
                    {/* Library Tab */}
                    {activeTab === 'library' && (
                        <div>
                            <h2 className="text-3xl font-black text-brand-dark mb-8">Minha Biblioteca</h2>
                            {purchasedBooks.length > 0 ? (
                                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {purchasedBooks.map((book) => (
                                        <div key={book.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all group">
                                            <div className="aspect-[3/4] overflow-hidden bg-gray-200">
                                                <img
                                                    src={book.coverUrl}
                                                    alt={book.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                                />
                                            </div>
                                            <div className="p-4">
                                                <h3 className="font-bold text-brand-dark mb-1 line-clamp-1">{book.title}</h3>
                                                <p className="text-sm text-gray-600 mb-3">{book.author}</p>
                                                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                                                    <span>{book.format}</span>
                                                    <span>{new Date(book.purchaseDate).toLocaleDateString('pt-AO')}</span>
                                                </div>
                                                <button className="w-full btn-premium justify-center text-sm">
                                                    <Download className="w-4 h-4" />
                                                    Download
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-white rounded-3xl shadow-lg p-16 text-center">
                                    <Book className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                                    <h3 className="text-2xl font-bold text-brand-dark mb-4">Biblioteca Vazia</h3>
                                    <p className="text-gray-600 mb-8">Comece a explorar nosso catálogo!</p>
                                    <button onClick={() => onNavigate('CATALOG')} className="btn-premium">
                                        Ver Catálogo
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Wishlist Tab */}
                    {activeTab === 'wishlist' && (
                        <div>
                            <h2 className="text-3xl font-black text-brand-dark mb-8">Lista de Desejos</h2>
                            {wishlistBooks.length > 0 ? (
                                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {wishlistBooks.map((book) => (
                                        <div key={book.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all group">
                                            <div className="aspect-[3/4] overflow-hidden bg-gray-200">
                                                <img
                                                    src={book.coverUrl}
                                                    alt={book.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                                />
                                            </div>
                                            <div className="p-4">
                                                <h3 className="font-bold text-brand-dark mb-1 line-clamp-1">{book.title}</h3>
                                                <p className="text-sm text-gray-600 mb-3">{book.author}</p>
                                                <div className="text-xl font-black text-brand-primary mb-4">
                                                    {book.price.toLocaleString()} Kz
                                                </div>
                                                <button className="w-full btn-premium justify-center text-sm">
                                                    Comprar Agora
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-white rounded-3xl shadow-lg p-16 text-center">
                                    <Heart className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                                    <h3 className="text-2xl font-bold text-brand-dark mb-4">Lista Vazia</h3>
                                    <p className="text-gray-600 mb-8">Adicione livros à sua lista de desejos!</p>
                                    <button onClick={() => onNavigate('CATALOG')} className="btn-premium">
                                        Explorar Livros
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* History Tab */}
                    {activeTab === 'history' && (
                        <div>
                            <h2 className="text-3xl font-black text-brand-dark mb-8">Histórico de Compras</h2>
                            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-brand-dark uppercase tracking-wider">Data</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-brand-dark uppercase tracking-wider">Livro</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-brand-dark uppercase tracking-wider">Formato</th>
                                            <th className="px-6 py-4 text-right text-xs font-bold text-brand-dark uppercase tracking-wider">Valor</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {purchasedBooks.map((book) => (
                                            <tr key={book.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    {new Date(book.purchaseDate).toLocaleDateString('pt-AO')}
                                                </td>
                                                <td className="px-6 py-4 text-sm font-bold text-brand-dark">{book.title}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{book.format}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-brand-primary text-right">
                                                    8.500 Kz
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Settings Tab */}
                    {activeTab === 'settings' && (
                        <div>
                            <h2 className="text-3xl font-black text-brand-dark mb-8">Definições da Conta</h2>
                            <div className="bg-white rounded-3xl shadow-lg p-8 max-w-2xl">
                                <div className="space-y-6">
                                    <div>
                                        <label htmlFor="user-name" className="block text-sm font-bold text-brand-dark mb-2">Nome</label>
                                        <input
                                            id="user-name"
                                            type="text"
                                            value={user.name}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-brand-primary"
                                            readOnly
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="user-email" className="block text-sm font-bold text-brand-dark mb-2">Email</label>
                                        <input
                                            id="user-email"
                                            type="email"
                                            value={user.email}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-brand-primary"
                                            readOnly
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="user-role" className="block text-sm font-bold text-brand-dark mb-2">Tipo de Conta</label>
                                        <input
                                            id="user-role"
                                            type="text"
                                            value={user.role === 'admin' ? 'Administrador' : user.role === 'author' ? 'Autor' : 'Leitor'}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                                            readOnly
                                        />
                                    </div>
                                    <button className="w-full btn-premium justify-center">
                                        Alterar Palavra-passe
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default ReaderDashboard;
