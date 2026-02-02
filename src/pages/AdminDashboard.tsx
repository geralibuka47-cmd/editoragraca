import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion as m, AnimatePresence } from 'framer-motion';
import {
    Users, ShoppingCart, BookOpen, FileText, Layout,
    User as UserIcon, Type, ArrowRight, Activity,
    Shield, Globe, Zap, Settings, LogOut, Menu, X,
    Bell, Search, Clock
} from 'lucide-react';
import { User, BlogPost } from '../types';

import AdminStats from '../components/admin/AdminStats';
import AdminBooksTab from '../components/admin/AdminBooksTab';
import AdminUsersTab from '../components/admin/AdminUsersTab';
import AdminOrdersTab from '../components/admin/AdminOrdersTab';
import AdminManuscriptsTab from '../components/admin/AdminManuscriptsTab';
import AdminBlogTab from '../components/admin/AdminBlogTab';
import AdminTeamTab from '../components/admin/AdminTeamTab';
import AdminServicesTab from '../components/admin/AdminServicesTab';
import AdminContentTab from '../components/admin/AdminContentTab';
import AdminSettingsTab from '../components/admin/AdminSettingsTab';
import { getAdminStats, getBlogPosts } from '../services/dataService';

interface AdminDashboardProps {
    user: User | null;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user }) => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'stats' | 'books' | 'users' | 'manuscripts' | 'orders' | 'blog' | 'team' | 'services' | 'content' | 'settings'>('stats');
    const [stats, setStats] = useState({
        totalBooks: 0,
        totalUsers: 0,
        pendingOrders: 0,
        revenue: 0
    });
    const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
    }, []);

    if (!user || user.role !== 'adm') {
        return (
            <div className="min-h-screen bg-brand-light flex items-center justify-center p-8">
                <div className="bg-white rounded-3xl shadow-xl p-12 text-center max-w-md">
                    <UserIcon className="w-16 h-16 text-gray-300 mx-auto mb-6" />
                    <h2 className="text-3xl font-black text-brand-dark mb-4">Acesso Restrito</h2>
                    <p className="text-gray-600 mb-8">Esta área é exclusiva para administradores.</p>
                    <button
                        onClick={() => navigate('/')}
                        className="btn-premium w-full justify-center"
                    >
                        Voltar ao Início
                    </button>
                </div>
            </div>
        );
    }

    const navItems = [
        { id: 'stats', label: 'Dashboard', icon: Activity },
        { id: 'books', label: 'Acervo', icon: BookOpen },
        { id: 'users', label: 'Utilizadores', icon: Users },
        { id: 'orders', label: 'Vendas', icon: ShoppingCart },
        { id: 'content', label: 'Gestão de Site', icon: Layout },
        { id: 'team', label: 'Equipa', icon: Shield },
        { id: 'blog', label: 'Blog', icon: Type },
        { id: 'services', label: 'Serviços', icon: Zap },
        { id: 'manuscripts', label: 'Manuscritos', icon: FileText },
        { id: 'settings', label: 'Configurações', icon: Settings },
    ];

    return (
        <div className="flex h-screen bg-[#050505] text-white overflow-hidden font-sans">
            {/* 1. SIDEBAR NAVIGATION (Glassmorphism App Style) */}
            <aside
                className={`${isSidebarOpen ? 'w-80' : 'w-24'} flex-shrink-0 transition-all duration-500 bg-[#0A0A0A] border-r border-white/5 flex flex-col z-50`}
            >
                {/* Logo Area */}
                <div className="p-8 flex items-center justify-between mb-8">
                    <div className={`flex items-center gap-4 ${!isSidebarOpen && 'hidden'}`}>
                        <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center shadow-lg shadow-brand-primary/20">
                            <Shield className="text-white w-6 h-6" />
                        </div>
                        <div className="font-black text-xl tracking-tighter uppercase">
                            Admin<span className="text-brand-primary">Hub</span>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors border border-white/5"
                        aria-label={isSidebarOpen ? "Fechar Menu" : "Abrir Menu"}
                    >
                        {isSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                    </button>
                </div>

                {/* Nav Links */}
                <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id as any)}
                            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all group overflow-hidden relative
                                ${activeTab === item.id
                                    ? 'bg-brand-primary text-white shadow-[0_0_40px_-10px_rgba(189,147,56,0.3)]'
                                    : 'text-gray-500 hover:text-white hover:bg-white/5'
                                }`}
                            title={item.label}
                        >
                            <item.icon className={`flex-shrink-0 w-5 h-5 transition-colors ${activeTab === item.id ? 'text-white' : 'text-gray-600 group-hover:text-brand-primary'}`} />
                            <span className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${!isSidebarOpen && 'opacity-0 translate-x-10 hidden'}`}>
                                {item.label}
                            </span>
                            {activeTab === item.id && (
                                <m.div
                                    layoutId="navGlow"
                                    className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent pointer-events-none"
                                />
                            )}
                        </button>
                    ))}
                </nav>

                {/* Footer Sidebar info */}
                <div className="p-6 mt-auto">
                    <div className={`bg-white/5 rounded-3xl p-6 border border-white/5 transition-all duration-500 ${!isSidebarOpen && 'opacity-0 scale-90 translate-y-10'}`}>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-primary to-amber-600 flex items-center justify-center font-black shadow-lg">
                                {user.name.charAt(0)}
                            </div>
                            <div>
                                <p className="text-xs font-black uppercase truncate max-w-[120px]">{user.name}</p>
                                <p className="text-[9px] text-brand-primary font-black uppercase tracking-widest">{user.role}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/')}
                            className="w-full py-3 bg-white/5 hover:bg-red-500/10 hover:text-red-500 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 border border-white/5"
                            title="Terminar Sessão"
                        >
                            <LogOut className="w-3 h-3" /> Terminar Sessão
                        </button>
                    </div>
                </div>
            </aside>

            {/* 2. MAIN CONTENT AREA (Social Protocol Layout) */}
            <main className="flex-1 overflow-y-auto bg-[#050505] relative custom-scrollbar">

                {/* 2.1 COVER AREA */}
                <div className="h-[250px] relative w-full overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/50 to-[#050505] z-10" />
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-30 group-hover:scale-105 transition-transform duration-1000" />

                    {/* Top Action Bar (Absolute) */}
                    <div className="absolute top-0 left-0 right-0 p-8 flex justify-between items-start z-20">
                        <div className="flex items-center gap-3 px-4 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Sistema Online</span>
                        </div>

                        <div className="flex gap-2">
                            <button
                                className="w-10 h-10 bg-black/40 hover:bg-white/10 backdrop-blur-md rounded-full border border-white/10 flex items-center justify-center text-gray-300 hover:text-white transition-colors relative"
                                title="Notificações"
                            >
                                <Bell className="w-4 h-4" />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-brand-primary rounded-full border-2 border-[#050505]" />
                            </button>
                            <button
                                onClick={() => setActiveTab('settings')}
                                className="w-10 h-10 bg-black/40 hover:bg-white/10 backdrop-blur-md rounded-full border border-white/10 flex items-center justify-center text-gray-300 hover:text-white transition-colors"
                                title="Configurações"
                            >
                                <Settings className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* 2.2 PAGE HEADER & IDENTITY */}
                <div className="container mx-auto px-8 relative z-20 -mt-16">
                    <div className="flex flex-col md:flex-row items-end gap-8 mb-8">
                        {/* Avatar/Logo */}
                        <div className="relative">
                            <div className="w-32 h-32 rounded-3xl border-4 border-[#050505] bg-[#111] overflow-hidden shadow-2xl relative z-10 flex items-center justify-center group-hover:rotate-3 transition-transform">
                                <Shield className="w-12 h-12 text-brand-primary" />
                            </div>
                            <div className="absolute -bottom-2 -right-2 z-20 px-3 py-1 bg-brand-primary rounded-lg border-4 border-[#050505] flex items-center justify-center shadow-lg">
                                <span className="text-[9px] font-black uppercase tracking-widest text-white">Admin</span>
                            </div>
                        </div>

                        {/* Identity Info */}
                        <div className="flex-1 pb-2">
                            <div className="flex items-center gap-3 mb-1">
                                <h1 className="text-4xl font-black uppercase tracking-tight text-white">Central de Comando</h1>
                                <Activity className="w-5 h-5 text-brand-primary animate-pulse" />
                            </div>
                            <p className="text-gray-400 font-medium text-sm tracking-wide flex items-center gap-2">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Editora Graça</span>
                                <span className="w-1 h-1 rounded-full bg-gray-600" />
                                <span className="text-gray-500 italic">v2.4.0 (Stable)</span>
                            </p>
                        </div>
                    </div>

                    {/* 2.3 SOCIAL PAGE GRID LAYOUT */}
                    <div className="grid lg:grid-cols-[300px_1fr] gap-8 pb-20">
                        {/* LEFT SIDEBAR (System Health & Quick Actions) */}
                        <div className="space-y-6">
                            {/* System Health Card */}
                            <div className="bg-white/5 border border-white/5 rounded-3xl p-8 backdrop-blur-sm">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-6">Estado do Sistema</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-400">Servidor</span>
                                        <span className="font-bold text-green-500 flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500" /> Online</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-400">Base de Dados</span>
                                        <span className="font-bold text-green-500 flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500" /> Conectado</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-400">Latência</span>
                                        <span className="font-bold text-white">24ms</span>
                                    </div>
                                    <div className="h-px bg-white/5 my-2" />
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-400">Último Backup</span>
                                        <span className="font-bold text-gray-300">Hoje, 04:00</span>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Stats Mini */}
                            <div className="bg-white/5 border border-white/5 rounded-3xl p-8 backdrop-blur-sm">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-6">Hoje</h3>
                                <div className="space-y-6">
                                    <div>
                                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Vendas Novas</p>
                                        <p className="text-2xl font-black text-white">{stats.pendingOrders > 0 ? `+${stats.pendingOrders}` : '0'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Receita</p>
                                        <p className="text-2xl font-black text-brand-primary">{(stats.revenue / 30).toFixed(0)} Kz</p>
                                        <p className="text-[10px] text-gray-600 mt-1">*Estimativa diária</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* MAIN FEED (Context Driven) */}
                        <div className="min-h-[500px]">
                            <AnimatePresence mode="wait">
                                <m.div
                                    key={activeTab}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="h-full"
                                >
                                    {/* DYNAMIC TITLE FOR TAB */}
                                    <div className="bg-white/5 border border-white/5 rounded-[2rem] p-8 mb-6 flex items-center justify-between backdrop-blur-md">
                                        <div>
                                            <h2 className="text-2xl font-black uppercase tracking-tight text-white">
                                                {navItems.find(i => i.id === activeTab)?.label}
                                            </h2>
                                            <p className="text-[10px] font-black text-brand-primary uppercase tracking-[0.3em]">
                                                {activeTab === 'stats' ? 'Visão Geral' : 'Gestão de Recursos'}
                                            </p>
                                        </div>
                                        <div className="hidden md:block">
                                            <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center">
                                                {React.createElement(navItems.find(i => i.id === activeTab)?.icon || Activity, { className: "w-5 h-5 text-gray-400" })}
                                            </div>
                                        </div>
                                    </div>

                                    {/* CONTENT */}
                                    {activeTab === 'stats' && (
                                        <div className="space-y-6">
                                            <AdminStats stats={stats} isLoading={isLoadingData} />
                                            {/* Shortcuts Grid */}
                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div
                                                    onClick={() => setActiveTab('books')}
                                                    className="bg-white/5 p-8 rounded-[2rem] border border-white/5 hover:bg-white/10 hover:border-brand-primary/30 transition-all cursor-pointer group"
                                                >
                                                    <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                                        <BookOpen className="w-6 h-6 text-blue-500" />
                                                    </div>
                                                    <h4 className="text-xl font-black uppercase tracking-tight mb-2">Acervo</h4>
                                                    <p className="text-sm text-gray-400 mb-6">Gerir livros, categorias e stocks da livraria.</p>
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-500 flex items-center gap-2">Aceder <ArrowRight className="w-3 h-3" /></span>
                                                </div>

                                                <div
                                                    onClick={() => setActiveTab('orders')}
                                                    className="bg-white/5 p-8 rounded-[2rem] border border-white/5 hover:bg-white/10 hover:border-brand-primary/30 transition-all cursor-pointer group"
                                                >
                                                    <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                                        <ShoppingCart className="w-6 h-6 text-green-500" />
                                                    </div>
                                                    <h4 className="text-xl font-black uppercase tracking-tight mb-2">Pedidos</h4>
                                                    <p className="text-sm text-gray-400 mb-6">Processar encomendas e verificar pagamentos.</p>
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-green-500 flex items-center gap-2">Aceder <ArrowRight className="w-3 h-3" /></span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'books' && <div className="bg-white/5 border border-white/5 rounded-[2rem] p-6 md:p-8"><AdminBooksTab onStatsRefresh={fetchData} /></div>}
                                    {activeTab === 'users' && <div className="bg-white/5 border border-white/5 rounded-[2rem] p-6 md:p-8"><AdminUsersTab /></div>}
                                    {activeTab === 'orders' && <div className="bg-white/5 border border-white/5 rounded-[2rem] p-6 md:p-8"><AdminOrdersTab user={user} /></div>}
                                    {activeTab === 'manuscripts' && <div className="bg-white/5 border border-white/5 rounded-[2rem] p-6 md:p-8"><AdminManuscriptsTab /></div>}
                                    {activeTab === 'blog' && <div className="bg-white/5 border border-white/5 rounded-[2rem] p-6 md:p-8"><AdminBlogTab posts={blogPosts} onRefresh={fetchData} /></div>}
                                    {activeTab === 'team' && <div className="bg-white/5 border border-white/5 rounded-[2rem] p-6 md:p-8"><AdminTeamTab /></div>}
                                    {activeTab === 'services' && <div className="bg-white/5 border border-white/5 rounded-[2rem] p-6 md:p-8"><AdminServicesTab /></div>}
                                    {activeTab === 'content' && <div className="bg-white/5 border border-white/5 rounded-[2rem] p-6 md:p-8"><AdminContentTab /></div>}
                                    {activeTab === 'settings' && <div className="bg-white/5 border border-white/5 rounded-[2rem] p-6 md:p-8"><AdminSettingsTab user={user} onUpdate={() => { }} /></div>}

                                </m.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;

