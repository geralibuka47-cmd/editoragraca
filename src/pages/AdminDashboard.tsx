import React, { useState, useEffect } from 'react';
import { Users, ShoppingCart, BookOpen, FileText, Layout, User as UserIcon, Type } from 'lucide-react';
import { ViewState, User, BlogPost } from '../types';

import AdminStats from '../components/admin/AdminStats';
import AdminBooksTab from '../components/admin/AdminBooksTab';
import AdminUsersTab from '../components/admin/AdminUsersTab';
import AdminOrdersTab from '../components/admin/AdminOrdersTab';
import AdminManuscriptsTab from '../components/admin/AdminManuscriptsTab';
import AdminBlogTab from '../components/admin/AdminBlogTab';
import AdminTeamTab from '../components/admin/AdminTeamTab';
import AdminServicesTab from '../components/admin/AdminServicesTab';
import AdminContentTab from '../components/admin/AdminContentTab';
import { getAdminStats, getBlogPosts } from '../services/dataService';

interface AdminDashboardProps {
    user: User | null;
    onNavigate: (view: ViewState) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onNavigate }) => {
    const [activeTab, setActiveTab] = useState<'stats' | 'books' | 'users' | 'manuscripts' | 'orders' | 'blog' | 'team' | 'services' | 'content'>('stats');
    const [stats, setStats] = useState({
        totalBooks: 0,
        totalUsers: 0,
        pendingOrders: 0,
        revenue: 0
    });
    const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(true);

    const fetchData = async () => {
        setIsLoadingData(true);
        try {
            const [statsData, postsData] = await Promise.all([
                getAdminStats(),
                getBlogPosts()
            ]);
            setStats(statsData);
            setBlogPosts(postsData);
        } catch (error) {
            console.error('Erro ao buscar dados do dashboard:', error);
        } finally {
            setIsLoadingData(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    if (!user || user.role !== 'adm') {
        return (
            <div className="min-h-screen bg-brand-light flex items-center justify-center p-8">
                <div className="bg-white rounded-3xl shadow-xl p-12 text-center max-w-md">
                    <UserIcon className="w-16 h-16 text-gray-300 mx-auto mb-6" />
                    <h2 className="text-3xl font-black text-brand-dark mb-4">Acesso Restrito</h2>
                    <p className="text-gray-600 mb-8">Esta área é exclusiva para administradores.</p>
                    <button
                        onClick={() => onNavigate('HOME')}
                        title="Voltar para a página inicial"
                        aria-label="Voltar para a página inicial"
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
                    <AdminStats stats={stats} isLoading={isLoadingData} />

                    {/* Tabs */}
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => setActiveTab('books')}
                            title="Ver listagem de livros"
                            aria-label="Ver listagem de livros"
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
                            title="Gerir utilizadores"
                            aria-label="Gerir utilizadores"
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
                            title="Ver encomendas"
                            aria-label="Ver encomendas"
                            className={`px-6 py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-all ${activeTab === 'orders'
                                ? 'bg-brand-primary text-white'
                                : 'bg-white/10 text-white hover:bg-white/20'
                                }`}
                        >
                            <ShoppingCart className="w-4 h-4 inline mr-2" />
                            Pedidos
                        </button>
                        <button
                            onClick={() => setActiveTab('manuscripts')}
                            title="Rever manuscritos"
                            aria-label="Rever manuscritos"
                            className={`px-6 py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-all ${activeTab === 'manuscripts'
                                ? 'bg-brand-primary text-white'
                                : 'bg-white/10 text-white hover:bg-white/20'
                                }`}
                        >
                            <FileText className="w-4 h-4 inline mr-2" />
                            Manuscritos
                        </button>
                        <button
                            onClick={() => setActiveTab('blog')}
                            title="Gerir blog"
                            aria-label="Gerir blog"
                            className={`px-6 py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-all ${activeTab === 'blog'
                                ? 'bg-brand-primary text-white'
                                : 'bg-white/10 text-white hover:bg-white/20'
                                }`}
                        >
                            <FileText className="w-4 h-4 inline mr-2" />
                            Blog
                        </button>
                        <button
                            onClick={() => setActiveTab('team')}
                            title="Gerir equipa"
                            aria-label="Gerir equipa"
                            className={`px-6 py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-all ${activeTab === 'team'
                                ? 'bg-brand-primary text-white'
                                : 'bg-white/10 text-white hover:bg-white/20'
                                }`}
                        >
                            <Users className="w-4 h-4 inline mr-2" />
                            Equipa
                        </button>
                        <button
                            onClick={() => setActiveTab('services')}
                            title="Gerir serviços"
                            aria-label="Gerir serviços"
                            className={`px-6 py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-all ${activeTab === 'services'
                                ? 'bg-brand-primary text-white'
                                : 'bg-white/10 text-white hover:bg-white/20'
                                }`}
                        >
                            <Layout className="w-4 h-4 inline mr-2" />
                            Serviços
                        </button>
                        <button
                            onClick={() => setActiveTab('content')}
                            title="Gerir conteúdo dinâmico"
                            aria-label="Gerir conteúdo dinâmico"
                            className={`px-6 py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-all ${activeTab === 'content'
                                ? 'bg-brand-primary text-white'
                                : 'bg-white/10 text-white hover:bg-white/20'
                                }`}
                        >
                            <Type className="w-4 h-4 inline mr-2" />
                            Conteúdo
                        </button>
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="py-6 md:py-12">
                <div className="container mx-auto px-4 md:px-8">
                    {/* Books Tab */}
                    {activeTab === 'books' && (
                        <AdminBooksTab onStatsRefresh={fetchData} />
                    )}

                    {/* Users Tab */}
                    {activeTab === 'users' && (
                        <AdminUsersTab />
                    )}

                    {/* Orders Tab */}
                    {activeTab === 'orders' && (
                        <AdminOrdersTab user={user} />
                    )}

                    {/* Manuscripts Tab */}
                    {activeTab === 'manuscripts' && (
                        <AdminManuscriptsTab />
                    )}

                    {/* Blog Tab */}
                    {activeTab === 'blog' && (
                        <AdminBlogTab posts={blogPosts} onRefresh={fetchData} />
                    )}

                    {/* Team Tab */}
                    {activeTab === 'team' && (
                        <AdminTeamTab />
                    )}

                    {/* Services Tab */}
                    {activeTab === 'services' && (
                        <AdminServicesTab />
                    )}

                    {/* Content Tab */}
                    {activeTab === 'content' && (
                        <AdminContentTab />
                    )}
                </div>
            </section>
        </div>
    );
};

export default AdminDashboard;
