import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion as m, AnimatePresence } from 'framer-motion';
import { Users, ShoppingCart, BookOpen, FileText, Layout, User as UserIcon, Type, ArrowRight } from 'lucide-react';
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
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user }) => {
    const navigate = useNavigate();
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
                        onClick={() => navigate('/')}
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
        <div className="min-h-screen bg-[#F8FAFC]">
            {/* Header */}
            <section className="bg-brand-dark pt-12 pb-24 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-primary/5 blur-[100px] rounded-full"></div>
                <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-blue-500/5 blur-[80px] rounded-full"></div>

                <div className="container mx-auto px-6 md:px-8 relative z-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                        <m.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <h1 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tighter text-white mb-4">
                                <span className="text-gradient-gold uppercase">Admin</span> Central
                            </h1>
                            <p className="text-gray-400 font-black tracking-[0.3em] uppercase text-[9px] md:text-[10px] opacity-60">Gestão Estratégica & Operacional</p>
                        </m.div>

                        <m.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-5 bg-white/5 backdrop-blur-xl p-3 rounded-[2rem] border border-white/10 shadow-2xl"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-brand-primary/20 flex items-center justify-center text-brand-primary font-black text-xl border border-brand-primary/20">
                                {user.name.charAt(0)}
                            </div>
                            <div className="pr-6">
                                <p className="text-white text-sm font-black leading-none mb-1.5">{user.name}</p>
                                <p className="text-brand-primary text-[9px] font-black uppercase tracking-[0.2em] opacity-80">Acesso Nível {user.role}</p>
                            </div>
                        </m.div>
                    </div>

                    {/* Stats */}
                    <AdminStats stats={stats} isLoading={isLoadingData} />
                </div>
            </section>

            {/* Main Navigation & Content */}
            <section className="-mt-12 pb-20 relative z-20">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Sidebar Navigation */}
                        <aside className="w-full lg:w-72 flex-shrink-0">
                            <m.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="glass-premium p-6 rounded-[3rem] sticky top-32 shadow-2xl shadow-brand-dark/5"
                            >
                                <nav className="space-y-2">
                                    {[
                                        { id: 'stats', label: 'Visão Geral', icon: Layout },
                                        { id: 'books', label: 'Acervo Literário', icon: BookOpen },
                                        { id: 'users', label: 'Utilizadores', icon: Users },
                                        { id: 'orders', label: 'Pedidos & Vendas', icon: ShoppingCart },
                                        { id: 'manuscripts', label: 'Manuscritos', icon: FileText },
                                        { id: 'blog', label: 'Blog & Notícias', icon: FileText },
                                        { id: 'team', label: 'Corpo Editorial', icon: Users },
                                        { id: 'services', label: 'Serviços', icon: Layout },
                                        { id: 'content', label: 'Gestão de Site', icon: Type },
                                    ].map((item) => (
                                        <m.button
                                            whileHover={{ x: 5 }}
                                            whileTap={{ scale: 0.98 }}
                                            key={item.id}
                                            onClick={() => setActiveTab(item.id as any)}
                                            className={`w-full flex items-center gap-4 px-6 py-4 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] transition-all border-2
                                                ${activeTab === item.id
                                                    ? 'bg-brand-dark text-white border-brand-dark shadow-xl shadow-brand-dark/20'
                                                    : 'text-gray-400 border-transparent hover:text-brand-dark hover:bg-gray-50'
                                                }`}
                                            title={`Navegar para ${item.label}`}
                                            aria-label={`Navegar para ${item.label}`}
                                        >
                                            <item.icon className={`w-4 h-4 ${activeTab === item.id ? 'text-brand-primary' : 'text-gray-300'}`} />
                                            <span className="truncate">{item.label}</span>
                                        </m.button>
                                    ))}
                                </nav>

                                <div className="mt-10 pt-8 border-t border-gray-100 px-4">
                                    <button
                                        onClick={() => navigate('/')}
                                        className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 hover:text-brand-primary flex items-center gap-3 transition-colors group"
                                        title="Voltar ao site público"
                                        aria-label="Voltar ao site público"
                                    >
                                        <Type className="w-4 h-4 transition-transform group-hover:rotate-12" /> Ir para o Site
                                    </button>
                                </div>
                            </m.div>
                        </aside>

                        {/* Content Area */}
                        <main className="flex-1 min-w-0">
                            <AnimatePresence mode="wait">
                                <m.div
                                    key={activeTab}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="card-premium min-h-[600px] md:min-h-[700px] relative overflow-hidden p-6 sm:p-8 md:p-14"
                                >
                                    {/* Header Decorative Accent */}
                                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-brand-primary via-brand-primary/50 to-transparent opacity-20"></div>

                                    {activeTab === 'stats' && (
                                        <div className="space-y-12">
                                            <div className="flex justify-between items-center mb-12">
                                                <div>
                                                    <h2 className="text-3xl md:text-5xl font-black text-brand-dark tracking-tighter uppercase mb-2 leading-tight">Painel de <span className="text-brand-primary italic font-serif lowercase">Controlo</span></h2>
                                                    <p className="text-gray-400 font-bold text-xs md:text-sm tracking-wide">Monitorização e gestão em tempo real.</p>
                                                </div>
                                                <button
                                                    onClick={fetchData}
                                                    disabled={isLoadingData}
                                                    className="w-14 h-14 bg-gray-50 text-gray-400 hover:text-brand-primary hover:bg-white hover:shadow-xl rounded-2xl transition-all flex items-center justify-center border border-gray-100"
                                                    title="Sincronizar dados agora"
                                                    aria-label="Sincronizar dados agora"
                                                >
                                                    <Layout className={`w-6 h-6 ${isLoadingData ? 'animate-spin' : ''}`} />
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                                <m.div
                                                    whileHover={{ y: -10 }}
                                                    className="bg-gray-50 p-10 rounded-[2.5rem] border border-gray-100 hover:border-brand-primary/30 transition-all group relative overflow-hidden"
                                                >
                                                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                                                    <div className="w-16 h-16 bg-white rounded-[1.5rem] shadow-sm flex items-center justify-center mb-8 text-brand-primary group-hover:scale-110 transition-transform shadow-brand-dark/5">
                                                        <BookOpen className="w-8 h-8" />
                                                    </div>
                                                    <h3 className="text-2xl font-black text-brand-dark mb-4">Acervo de Livros</h3>
                                                    <p className="text-gray-500 font-bold leading-relaxed mb-8 opacity-70 italic">Gerencie o catálogo completo, preços e stock físico/digital com precisão cirúrgica.</p>
                                                    <button
                                                        onClick={() => setActiveTab('books')}
                                                        className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-primary hover:text-brand-dark transition-colors flex items-center gap-3"
                                                        title="Aceder Gestão de Livros"
                                                        aria-label="Aceder Gestão de Livros"
                                                    >
                                                        Aceder Gestão <ArrowRight className="w-4 h-4 translate-y-[-1px]" />
                                                    </button>
                                                </m.div>

                                                <m.div
                                                    whileHover={{ y: -10 }}
                                                    className="bg-gray-50 p-10 rounded-[2.5rem] border border-gray-100 hover:border-brand-primary/30 transition-all group relative overflow-hidden"
                                                >
                                                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                                                    <div className="w-16 h-16 bg-white rounded-[1.5rem] shadow-sm flex items-center justify-center mb-8 text-brand-primary group-hover:scale-110 transition-transform shadow-brand-dark/5">
                                                        <ShoppingCart className="w-8 h-8" />
                                                    </div>
                                                    <h3 className="text-2xl font-black text-brand-dark mb-4">Pedidos Recentes</h3>
                                                    <p className="text-gray-500 font-bold leading-relaxed mb-8 opacity-70 italic">Acompanhe as vendas, fluxos de pagamento e estado logístico em tempo real.</p>
                                                    <button
                                                        onClick={() => setActiveTab('orders')}
                                                        className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-primary hover:text-brand-dark transition-colors flex items-center gap-3"
                                                        title="Ver Histórico de Pedidos"
                                                        aria-label="Ver Histórico de Pedidos"
                                                    >
                                                        Ver Pedidos <ArrowRight className="w-4 h-4 translate-y-[-1px]" />
                                                    </button>
                                                </m.div>
                                            </div>

                                            <m.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.5 }}
                                                className="mt-12 md:mt-20 p-6 md:p-8 bg-brand-dark rounded-[2rem] md:rounded-[2.5rem] text-white flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 shadow-2xl shadow-brand-dark/20"
                                            >
                                                <div className="space-y-1 text-center md:text-left">
                                                    <p className="text-brand-primary text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em]">Manutenção de Sistema</p>
                                                    <h4 className="text-lg md:text-xl font-black">Integridade da Base de Dados</h4>
                                                </div>
                                                <div className="flex gap-4">
                                                    <div className="px-4 md:px-6 py-2 md:py-3 bg-white/5 rounded-xl border border-white/10 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-green-400 flex items-center gap-2">
                                                        <div className="w-1.5 md:w-2 h-1.5 md:h-2 rounded-full bg-green-400 animate-pulse"></div>
                                                        Online
                                                    </div>
                                                </div>
                                            </m.div>
                                        </div>
                                    )}

                                    {activeTab === 'books' && (
                                        <AdminBooksTab onStatsRefresh={fetchData} />
                                    )}

                                    {activeTab === 'users' && (
                                        <AdminUsersTab />
                                    )}

                                    {activeTab === 'orders' && (
                                        <AdminOrdersTab user={user} />
                                    )}

                                    {activeTab === 'manuscripts' && (
                                        <AdminManuscriptsTab />
                                    )}

                                    {activeTab === 'blog' && (
                                        <AdminBlogTab posts={blogPosts} onRefresh={fetchData} />
                                    )}

                                    {activeTab === 'team' && (
                                        <AdminTeamTab />
                                    )}

                                    {activeTab === 'services' && (
                                        <AdminServicesTab />
                                    )}

                                    {activeTab === 'content' && (
                                        <AdminContentTab />
                                    )}
                                </m.div>
                            </AnimatePresence>
                        </main>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AdminDashboard;
