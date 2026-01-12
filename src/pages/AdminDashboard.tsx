import React, { useState } from 'react';
import { BookOpen, Users, ShoppingCart, Plus, Edit, Trash2, User as UserIcon } from 'lucide-react';
import { ViewState, User } from '../types';

interface AdminDashboardProps {
    user: User | null;
    onNavigate: (view: ViewState) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onNavigate }) => {
    const [activeTab, setActiveTab] = useState<'books' | 'users' | 'orders'>('books');

    // Mock data
    const stats = {
        totalBooks: 156,
        totalUsers: 1243,
        pendingOrders: 23,
        revenue: 4567800
    };

    const books = [
        { id: '1', title: 'A Gloriosa Família', author: 'Pepetela', price: 8500, stock: 45, category: 'Romance' },
        { id: '2', title: 'Mayombe', author: 'Pepetela', price: 7500, stock: 32, category: 'Ficção' },
        { id: '3', title: 'O Desejo de Kianda', author: 'Pepetela', price: 6500, stock: 28, category: 'Ficção' }
    ];

    const users = [
        { id: '1', name: 'João Silva', email: 'joao@example.com', role: 'reader', joined: '2025-11-15' },
        { id: '2', name: 'Maria Costa', email: 'maria@example.com', role: 'author', joined: '2025-10-20' },
        { id: '3', name: 'Carlos Mendes', email: 'carlos@example.com', role: 'reader', joined: '2025-12-05' }
    ];

    const orders = [
        { id: '1', customer: 'Ana Ferreira', items: 2, total: 17000, status: 'pending', date: '2026-01-10' },
        { id: '2', customer: 'Pedro Santos', items: 1, total: 8500, status: 'completed', date: '2026-01-09' },
        { id: '3', customer: 'Sofia Almeida', items: 3, total: 22500, status: 'shipped', date: '2026-01-08' }
    ];

    if (!user || user.role !== 'adm') {
        return (
            <div className="min-h-screen bg-brand-light flex items-center justify-center p-8">
                <div className="bg-white rounded-3xl shadow-xl p-12 text-center max-w-md">
                    <UserIcon className="w-16 h-16 text-gray-300 mx-auto mb-6" />
                    <h2 className="text-3xl font-black text-brand-dark mb-4">Acesso Restrito</h2>
                    <p className="text-gray-600 mb-8">Esta área é exclusiva para administradores.</p>
                    <button
                        onClick={() => onNavigate('HOME')}
                        className="btn-premium w-full justify-center"
                    >
                        Voltar ao Início
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
                    <div className="mb-8">
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-2">
                            Painel <span className="text-brand-primary">Administrativo</span>
                        </h1>
                        <p className="text-gray-300">Gerencie livros, utilizadores e pedidos</p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-white/10 rounded-2xl p-6">
                            <BookOpen className="w-8 h-8 text-brand-primary mb-2" />
                            <p className="text-3xl font-black mb-1">{stats.totalBooks}</p>
                            <p className="text-sm text-gray-300">Livros</p>
                        </div>
                        <div className="bg-white/10 rounded-2xl p-6">
                            <Users className="w-8 h-8 text-brand-primary mb-2" />
                            <p className="text-3xl font-black mb-1">{stats.totalUsers}</p>
                            <p className="text-sm text-gray-300">Utilizadores</p>
                        </div>
                        <div className="bg-white/10 rounded-2xl p-6">
                            <ShoppingCart className="w-8 h-8 text-brand-primary mb-2" />
                            <p className="text-3xl font-black mb-1">{stats.pendingOrders}</p>
                            <p className="text-sm text-gray-300">Pedidos Pendentes</p>
                        </div>
                        <div className="bg-white/10 rounded-2xl p-6">
                            <p className="text-3xl font-black mb-1">{(stats.revenue / 1000000).toFixed(1)}M</p>
                            <p className="text-sm text-gray-300">Receita (Kz)</p>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => setActiveTab('books')}
                            className={`px-6 py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-all ${activeTab === 'books'
                                ? 'bg-brand-primary text-white'
                                : 'bg-white/10 text-white hover:bg-white/20'
                                }`}
                        >
                            <BookOpen className="w-4 h-4 inline mr-2" />
                            Livros
                        </button>
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`px-6 py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-all ${activeTab === 'users'
                                ? 'bg-brand-primary text-white'
                                : 'bg-white/10 text-white hover:bg-white/20'
                                }`}
                        >
                            <Users className="w-4 h-4 inline mr-2" />
                            Utilizadores
                        </button>
                        <button
                            onClick={() => setActiveTab('orders')}
                            className={`px-6 py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-all ${activeTab === 'orders'
                                ? 'bg-brand-primary text-white'
                                : 'bg-white/10 text-white hover:bg-white/20'
                                }`}
                        >
                            <ShoppingCart className="w-4 h-4 inline mr-2" />
                            Pedidos
                        </button>
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="py-12">
                <div className="container mx-auto px-8">
                    {/* Books Tab */}
                    {activeTab === 'books' && (
                        <div>
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-3xl font-black text-brand-dark">Gestão de Livros</h2>
                                <button className="btn-premium">
                                    <Plus className="w-5 h-5" />
                                    Adicionar Livro
                                </button>
                            </div>
                            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-brand-dark uppercase tracking-wider">Título</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-brand-dark uppercase tracking-wider">Autor</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-brand-dark uppercase tracking-wider">Categoria</th>
                                            <th className="px-6 py-4 text-right text-xs font-bold text-brand-dark uppercase tracking-wider">Preço</th>
                                            <th className="px-6 py-4 text-right text-xs font-bold text-brand-dark uppercase tracking-wider">Stock</th>
                                            <th className="px-6 py-4 text-right text-xs font-bold text-brand-dark uppercase tracking-wider">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {books.map((book) => (
                                            <tr key={book.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 font-bold text-brand-dark">{book.title}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{book.author}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{book.category}</td>
                                                <td className="px-6 py-4 text-sm font-bold text-brand-primary text-right">{book.price.toLocaleString()} Kz</td>
                                                <td className="px-6 py-4 text-sm text-gray-600 text-right">{book.stock}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button title="Editar livro" aria-label="Editar livro" className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all flex items-center justify-center">
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                        <button title="Eliminar livro" aria-label="Eliminar livro" className="w-8 h-8 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all flex items-center justify-center">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Users Tab */}
                    {activeTab === 'users' && (
                        <div>
                            <h2 className="text-3xl font-black text-brand-dark mb-8">Gestão de Utilizadores</h2>
                            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-brand-dark uppercase tracking-wider">Nome</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-brand-dark uppercase tracking-wider">Email</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-brand-dark uppercase tracking-wider">Tipo</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-brand-dark uppercase tracking-wider">Data de Registo</th>
                                            <th className="px-6 py-4 text-right text-xs font-bold text-brand-dark uppercase tracking-wider">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {users.map((u) => (
                                            <tr key={u.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 font-bold text-brand-dark">{u.name}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{u.email}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${u.role === 'admin' ? 'bg-purple-100 text-purple-600' :
                                                        u.role === 'author' ? 'bg-blue-100 text-blue-600' :
                                                            'bg-gray-100 text-gray-600'
                                                        }`}>
                                                        {u.role === 'admin' ? 'Admin' : u.role === 'author' ? 'Autor' : 'Leitor'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{new Date(u.joined).toLocaleDateString('pt-AO')}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <button title="Editar utilizador" aria-label="Editar utilizador" className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all flex items-center justify-center ml-auto">
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Orders Tab */}
                    {activeTab === 'orders' && (
                        <div>
                            <h2 className="text-3xl font-black text-brand-dark mb-8">Gestão de Pedidos</h2>
                            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-brand-dark uppercase tracking-wider">ID</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-brand-dark uppercase tracking-wider">Cliente</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-brand-dark uppercase tracking-wider">Data</th>
                                            <th className="px-6 py-4 text-right text-xs font-bold text-brand-dark uppercase tracking-wider">Itens</th>
                                            <th className="px-6 py-4 text-right text-xs font-bold text-brand-dark uppercase tracking-wider">Total</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-brand-dark uppercase tracking-wider">Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {orders.map((order) => (
                                            <tr key={order.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 text-sm font-mono text-gray-600">#{order.id}</td>
                                                <td className="px-6 py-4 font-bold text-brand-dark">{order.customer}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{new Date(order.date).toLocaleDateString('pt-AO')}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600 text-right">{order.items}</td>
                                                <td className="px-6 py-4 text-sm font-bold text-brand-primary text-right">{order.total.toLocaleString()} Kz</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === 'completed' ? 'bg-green-100 text-green-600' :
                                                        order.status === 'shipped' ? 'bg-blue-100 text-blue-600' :
                                                            'bg-yellow-100 text-yellow-600'
                                                        }`}>
                                                        {order.status === 'completed' ? 'Completo' : order.status === 'shipped' ? 'Enviado' : 'Pendente'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default AdminDashboard;
