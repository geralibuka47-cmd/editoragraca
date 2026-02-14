import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion as m, AnimatePresence } from 'framer-motion';
import {
    Users, ShoppingCart, BookOpen, FileText, Layout,
    User as UserIcon, Type, ArrowRight, Activity,
    Shield, Globe, Zap, Settings, LogOut, Menu, X,
    Bell, Search, Clock, ChevronRight, TrendingUp, Monitor
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
        revenue: 0,
        lowStockCount: 0
    });
    const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
            <div className="min-h-screen bg-[#050505] flex items-center justify-center p-8">
                <m.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white/5 border border-white/10 rounded-[2.5rem] p-12 text-center max-w-md backdrop-blur-xl"
                >
                    <Shield className="w-16 h-16 text-brand-primary mx-auto mb-6" />
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">Acesso Restrito</h2>
                    <p className="text-gray-400 mb-8 font-medium">Esta área é exclusiva para administradores.</p>
                    <button
                        onClick={() => navigate('/')}
                        className="w-full py-5 bg-brand-primary text-white font-black uppercase tracking-widest rounded-2xl hover:brightness-110 transition-all shadow-xl shadow-brand-primary/20"
                    >
                        Voltar ao Início
                    </button>
                </m.div>
            </div>
        );
    }

    const navItems = [
        { id: 'stats', label: 'Consola', icon: Monitor },
        { id: 'books', label: 'Acervo', icon: BookOpen },
        { id: 'users', label: 'Gestores', icon: Users },
        { id: 'orders', label: 'Vendas', icon: ShoppingCart },
        { id: 'content', label: 'Portal', icon: Globe },
        { id: 'team', label: 'Equipa', icon: Shield },
        { id: 'blog', label: 'Editorial', icon: Type },
        { id: 'services', label: 'Módulos', icon: Zap },
        { id: 'manuscripts', label: 'Manuscritos', icon: FileText },
        { id: 'settings', label: 'Terminal', icon: Settings },
    ];

    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 }
    };

    return (
        <div className="flex h-screen bg-[#050505] text-white overflow-hidden font-sans selection:bg-brand-primary/30">
            {/* KINETIC BACKGROUND */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-5%] left-[-5%] w-[50%] h-[50%] bg-brand-primary/5 blur-[150px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-600/5 blur-[200px] rounded-full" />
            </div>

            {/* 1. SIDEBAR (Premium Monolith Style) */}
            <aside
                className={`${isSidebarOpen ? 'w-80' : 'w-24'} hidden lg:flex flex-shrink-0 transition-all duration-700 bg-black/40 backdrop-blur-3xl border-r border-white/5 flex-col z-50 relative`}
            >
                {/* Logo Area */}
                <div className="p-10 flex items-center justify-between">
                    <div className={`flex items-center gap-4 ${!isSidebarOpen && 'opacity-0 scale-90 translate-x-[-20px] absolute'} transition-all duration-500`}>
                        <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center shadow-2xl shadow-brand-primary/20">
                            <Shield className="text-white w-6 h-6" />
                        </div>
                        <div className="font-black text-2xl tracking-tighter uppercase italic">
                            Editora<span className="text-brand-primary">G.</span>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className={`p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5 ${!isSidebarOpen && 'mx-auto'}`}
                    >
                        {isSidebarOpen ? <X className="w-4 h-4 text-gray-400" /> : <Menu className="w-4 h-4 text-brand-primary" />}
                    </button>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto no-scrollbar py-6">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id as any)}
                            className={`w-full flex items-center gap-5 px-6 py-4.5 rounded-[1.5rem] transition-all relative group overflow-hidden
                                ${activeTab === item.id
                                    ? 'bg-brand-primary text-white shadow-3xl shadow-brand-primary/20'
                                    : 'text-gray-500 hover:text-white hover:bg-white/5'
                                }`}
                            title={item.label}
                        >
                            <item.icon className={`flex-shrink-0 w-5 h-5 transition-all duration-500 ${activeTab === item.id ? 'scale-110' : 'group-hover:text-brand-primary'}`} />
                            <span className={`text-[10px] font-black uppercase tracking-[0.25em] transition-all duration-500 ${!isSidebarOpen && 'opacity-0 translate-x-10 scale-50 pointer-events-none'}`}>
                                {item.label}
                            </span>

                            {/* Active Indicator Glow */}
                            {activeTab === item.id && (
                                <m.div
                                    layoutId="sidebarActiveGlow"
                                    className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-50"
                                />
                            )}
                        </button>
                    ))}
                </nav>

                {/* Sidebar Footer */}
                <div className="p-6">
                    <div className={`bg-gradient-to-br from-white/5 to-transparent rounded-[2.5rem] p-6 border border-white/5 transition-all duration-700 ${!isSidebarOpen ? 'opacity-0 scale-90 translate-y-10' : 'opacity-100'}`}>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-[#111] border border-white/10 flex items-center justify-center font-black text-xl text-brand-primary rotate-3">
                                {user.name.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[10px] font-black uppercase text-white truncate">{user.name}</p>
                                <p className="text-[8px] font-black uppercase tracking-widest text-brand-primary/60">Sénior Admin</p>
                            </div>
                        </div>
                        <button
                            onClick={async () => {
                                const { logout } = await import('../services/authService');
                                await logout();
                                navigate('/');
                            }}
                            className="w-full py-4 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all"
                        >
                            Log Out
                        </button>
                    </div>
                </div>
            </aside>

            {/* 2. MAIN CONSOLE AREA */}
            <main className="flex-1 overflow-y-auto relative no-scrollbar flex flex-col">

                {/* Top Terminal Bar */}
                <header className="sticky top-0 z-40 bg-[#050505]/60 backdrop-blur-3xl border-b border-white/5 px-8 sm:px-12 py-6 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="lg:hidden p-3 bg-white/5 rounded-xl border border-white/5"
                            title="Abrir Menu"
                            aria-label="Abrir Menu"
                        >
                            <Menu className="w-5 h-5 text-brand-primary" />
                        </button>
                        <div className="hidden md:flex items-center gap-4 px-5 py-2.5 bg-white/5 rounded-full border border-white/5">
                            <Activity className="w-4 h-4 text-brand-primary animate-pulse" />
                            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-400">Sistema Operacional</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/5 text-[10px] font-mono text-brand-primary/60">
                            <Clock className="w-3.5 h-3.5" />
                            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <button
                            className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-all"
                            title="Notificações"
                            aria-label="Notificações"
                        >
                            <Bell className="w-4 h-4 text-gray-400" />
                        </button>
                    </div>
                </header>

                <div className="flex-1 container mx-auto px-8 sm:px-12 py-12">
                    <AnimatePresence mode="wait">
                        <m.div
                            key={activeTab}
                            {...fadeInUp}
                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                            className="space-y-12"
                        >
                            {/* Page Identity Block */}
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="px-3 py-1 bg-brand-primary/10 rounded-lg text-brand-primary border border-brand-primary/20 text-[9px] font-black uppercase tracking-widest">
                                            Mod: {activeTab}
                                        </div>
                                    </div>
                                    <h2 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-none">
                                        {navItems.find(i => i.id === activeTab)?.label}
                                    </h2>
                                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-500 max-w-xl">
                                        Interface de gestão centralizada para controlo total da infraestrutura digital da Editora Graça.
                                    </p>
                                </div>
                                {activeTab === 'stats' && (
                                    <button
                                        onClick={fetchData}
                                        className="px-8 py-4 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-brand-primary hover:text-white transition-all shadow-3xl shadow-white/5"
                                    >
                                        Sincronizar Dados
                                    </button>
                                )}
                            </div>

                            {/* TAB CONTENT */}
                            <div className="min-h-[600px] bg-white/5 border border-white/10 rounded-[3.5rem] p-8 md:p-12 backdrop-blur-3xl shadow-5xl relative overflow-hidden">
                                {activeTab === 'stats' && (
                                    <div className="space-y-12">
                                        <AdminStats stats={stats} isLoading={isLoadingData} />

                                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                            {[
                                                { id: 'books', title: 'Inventário Literário', desc: 'Gerir títulos, stock e categorias.', icon: BookOpen, color: 'blue' },
                                                { id: 'users', title: 'Controle de Acessos', desc: 'Gerir permissões e perfis de utilizadores.', icon: Users, color: 'brand-primary' },
                                                { id: 'content', title: 'Experience Design', desc: 'Configurar elementos visuais do portal.', icon: Globe, color: 'purple' }
                                            ].map((card) => (
                                                <m.button
                                                    key={card.id}
                                                    whileHover={{ y: -10 }}
                                                    onClick={() => setActiveTab(card.id as any)}
                                                    className="p-10 bg-black/40 rounded-[2.5rem] border border-white/5 text-left group hover:border-brand-primary/30 transition-all"
                                                >
                                                    <div className={`w-14 h-14 bg-${card.color}/10 rounded-2xl flex items-center justify-center mb-10 group-hover:scale-110 transition-transform`}>
                                                        <card.icon className={`w-6 h-6 text-${card.color}`} />
                                                    </div>
                                                    <h4 className="text-2xl font-black uppercase tracking-tight mb-3 group-hover:text-brand-primary transition-colors">{card.title}</h4>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-8">{card.desc}</p>
                                                    <div className="flex items-center gap-3 text-brand-primary font-black uppercase tracking-widest text-[9px]">
                                                        Gerir Agora <ChevronRight className="w-4 h-4" />
                                                    </div>
                                                </m.button>
                                            ))}
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
                                {activeTab === 'settings' && <AdminSettingsTab user={user} onUpdate={() => { }} />}
                            </div>
                        </m.div>
                    </AnimatePresence>
                </div>
            </main>

            {/* MOBILE MENU MODAL */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <m.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-[#050505]/95 backdrop-blur-2xl lg:hidden flex flex-col"
                    >
                        <div className="p-8 flex justify-between items-center border-b border-white/5">
                            <div className="font-black text-2xl uppercase tracking-tighter">Terminal <span className="text-brand-primary">Móvel</span></div>
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="p-4 bg-white/5 rounded-2xl"
                                title="Fechar Menu"
                                aria-label="Fechar Menu"
                            >
                                <X className="w-6 h-6 text-brand-primary" />
                            </button>
                        </div>
                        <nav className="flex-1 p-8 overflow-y-auto space-y-4">
                            {navItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => { setActiveTab(item.id as any); setIsMobileMenuOpen(false); }}
                                    className={`w-full p-6 bg-white/5 rounded-[2rem] flex items-center gap-6 border border-white/5 transition-all ${activeTab === item.id ? 'bg-brand-primary text-white border-brand-primary' : 'text-gray-400'}`}
                                >
                                    <item.icon className="w-6 h-6" />
                                    <span className="text-xs font-black uppercase tracking-widest">{item.label}</span>
                                </button>
                            ))}
                        </nav>
                        <div className="p-8">
                            <button onClick={() => navigate('/')} className="w-full py-6 bg-brand-primary text-white rounded-[2rem] font-black uppercase tracking-widest">Sair do Dashboard</button>
                        </div>
                    </m.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminDashboard;
