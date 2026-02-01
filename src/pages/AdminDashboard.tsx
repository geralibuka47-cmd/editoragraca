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
    ];

    return (
        <div className="flex h-screen bg-[#070707] text-white overflow-hidden font-sans">
            {/* 1. SIDEBAR NAVIGATION (Glassmorphism App Style) */}
            <aside
                className={`${isSidebarOpen ? 'w-80' : 'w-24'} flex-shrink-0 transition-all duration-500 bg-[#0A0A0A] border-r border-white/5 flex flex-col z-50`}
            >
                {/* Logo Area */}
                <div className="p-8 flex items-center justify-between mb-8">
                    <div className={`flex items-center gap-4 ${!isSidebarOpen && 'hidden'}`}>
                        <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center">
                            <Shield className="text-white w-6 h-6" />
                        </div>
                        <div className="font-black text-xl tracking-tighter uppercase">
                            Admin<span className="text-brand-primary">Hub</span>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
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
                            className={`w-full flex items-center gap-4 px-6 py-5 rounded-2xl transition-all group overflow-hidden relative
                                ${activeTab === item.id
                                    ? 'bg-brand-primary text-white shadow-[0_0_40px_-5px_rgba(189,147,56,0.3)]'
                                    : 'text-gray-500 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <item.icon className={`flex-shrink-0 w-5 h-5 ${activeTab === item.id ? 'text-white' : 'text-gray-600 group-hover:text-brand-primary'}`} />
                            <span className={`text-[11px] font-black uppercase tracking-[0.2em] transition-opacity duration-300 ${!isSidebarOpen && 'opacity-0'}`}>
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
                    <div className={`bg-white/5 rounded-3xl p-6 transition-all duration-500 ${!isSidebarOpen && 'opacity-0 scale-90 translate-y-10'}`}>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-primary to-amber-600 flex items-center justify-center font-black">
                                {user.name.charAt(0)}
                            </div>
                            <div>
                                <p className="text-xs font-black uppercase truncate max-w-[120px]">{user.name}</p>
                                <p className="text-[9px] text-brand-primary font-black uppercase tracking-widest">{user.role}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/')}
                            className="w-full py-3 bg-white/5 hover:bg-red-500/10 hover:text-red-500 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                        >
                            <LogOut className="w-3 h-3" /> Terminar Sessão
                        </button>
                    </div>
                </div>
            </aside>

            {/* 2. MAIN WORKSPACE */}
            <main className="flex-1 flex flex-col min-w-0 bg-[#050505] relative">
                {/* Header (Mission Control) */}
                <header className="h-24 border-b border-white/5 flex items-center justify-between px-10 relative z-30 bg-[#050505]/80 backdrop-blur-3xl">
                    <div className="flex items-center gap-8">
                        <div>
                            <h2 className="text-xl font-black uppercase tracking-tighter text-white">
                                {navItems.find(i => i.id === activeTab)?.label}
                            </h2>
                            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Sistema Operacional
                            </p>
                        </div>

                        <div className="hidden lg:flex items-center gap-3 px-6 py-2.5 bg-white/5 rounded-full border border-white/5">
                            <Search className="w-4 h-4 text-gray-600" />
                            <input
                                type="text"
                                placeholder="COMANDO GLOBAL..."
                                className="bg-transparent border-none outline-none text-[10px] font-black tracking-widest text-white placeholder:text-gray-700 w-48"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="text-right hidden sm:block">
                            <p className="text-[10px] font-black text-white">{new Date().toLocaleTimeString()}</p>
                            <p className="text-[8px] text-gray-500 font-black uppercase tracking-[0.2em]">Live Stream</p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center border border-white/5 relative"
                                title="Notificações do Sistema"
                                aria-label="Notificações do Sistema"
                            >
                                <Bell className="w-4 h-4 text-gray-400" />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-brand-primary rounded-full border-2 border-[#050505]" />
                            </button>
                            <button
                                className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center border border-white/5"
                                title="Configurações Locais"
                                aria-label="Configurações Locais"
                            >
                                <Settings className="w-4 h-4 text-gray-400" />
                            </button>
                        </div>
                    </div>
                </header>

                {/* Content Workspace */}
                <div className="flex-1 overflow-y-auto p-10 custom-scrollbar relative z-10">
                    <div className="container mx-auto max-w-7xl">
                        {/* Tab Header Banner */}
                        <div className="mb-12 relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-[#111] to-[#070707] border border-white/5 p-12 group">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/10 blur-[120px] rounded-full group-hover:bg-brand-primary/20 transition-all duration-1000" />

                            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                                <div>
                                    <m.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="flex items-center gap-4 mb-4"
                                    >
                                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-brand-primary border border-white/5">
                                            {React.createElement(navItems.find(i => i.id === activeTab)?.icon || Activity, { className: "w-6 h-6" })}
                                        </div>
                                        <span className="text-[10px] font-black text-brand-primary uppercase tracking-[0.5em]">Central de Operações</span>
                                    </m.div>
                                    <m.h3
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 }}
                                        className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase leading-none"
                                    >
                                        Gestão de <br />
                                        <span className="italic font-serif font-light text-brand-primary lowercase text-5xl md:text-7xl">
                                            {navItems.find(i => i.id === activeTab)?.label}
                                        </span>
                                    </m.h3>
                                </div>

                                {activeTab === 'stats' && (
                                    <AdminStats stats={stats} isLoading={isLoadingData} />
                                )}
                            </div>
                        </div>

                        {/* Sub-tab Content Area */}
                        <AnimatePresence mode="wait">
                            <m.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                                className="bg-[#0A0A0A] border border-white/5 rounded-[3.5rem] p-1 md:p-12 relative overflow-hidden"
                            >
                                {/* Decorative grid background */}
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.02] pointer-events-none" />

                                <div className="relative z-10">
                                    {activeTab === 'stats' && (
                                        <div className="grid md:grid-cols-2 gap-8">
                                            <div className="bg-white/5 p-12 rounded-[2.5rem] border border-white/5 hover:border-brand-primary/20 transition-all group">
                                                <h4 className="text-3xl font-black mb-6 uppercase tracking-tighter">Acervo de Elite</h4>
                                                <p className="text-gray-500 font-medium leading-relaxed mb-10">Gerencie sua biblioteca premium com ferramentas de organização cirúrgica.</p>
                                                <button
                                                    onClick={() => setActiveTab('books')}
                                                    className="flex items-center gap-3 text-brand-primary font-black uppercase text-[10px] tracking-widest group-hover:gap-6 transition-all"
                                                >
                                                    Aceder arquivo <ArrowRight className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <div className="bg-white/5 p-12 rounded-[2.5rem] border border-white/5 hover:border-brand-primary/20 transition-all group">
                                                <h4 className="text-3xl font-black mb-6 uppercase tracking-tighter">Fluxo Comercial</h4>
                                                <p className="text-gray-500 font-medium leading-relaxed mb-10">Monitorize transações e pedidos com total transparência e controlo.</p>
                                                <button
                                                    onClick={() => setActiveTab('orders')}
                                                    className="flex items-center gap-3 text-brand-primary font-black uppercase text-[10px] tracking-widest group-hover:gap-6 transition-all"
                                                >
                                                    Ver pedidos <ArrowRight className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'books' && <AdminBooksTab onStatsRefresh={fetchData} />}
                                    {activeTab === 'users' && <AdminUsersTab />}
                                    {activeTab === 'orders' && <AdminOrdersTab user={user} />}
                                    {activeTab === 'manuscripts' && <AdminManuscriptsTab />}
                                    {activeTab === 'blog' && <AdminBlogTab posts={blogPosts} onRefresh={fetchData} />}
                                    {activeTab === 'team' && <AdminTeamTab />}
                                    {activeTab === 'services' && <AdminServicesTab />}
                                    {activeTab === 'content' && <AdminContentTab />}
                                </div>
                            </m.div>
                        </AnimatePresence>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;

