import React, { useState } from 'react';
import { motion as m, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, BookCopy, Users, CreditCard,
    FileEdit, Settings, LogOut, ChevronLeft,
    Bell, Search, User as UserIcon, Menu, X
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { logout as authLogout } from '../../services/authService';

interface AdminLayoutProps {
    children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    const { user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navItems = [
        { icon: LayoutDashboard, label: 'Geral', path: '/admin' },
        { icon: BookCopy, label: 'Acervo', path: '/admin/livros' },
        { icon: Users, label: 'Membros', path: '/admin/utilizadores' },
        { icon: CreditCard, label: 'Vendas', path: '/admin/encomendas' },
        { icon: FileEdit, label: 'Editorial', path: '/admin/blog' },
        { icon: Settings, label: 'Definições', path: '/admin/definicoes' },
    ];

    const handleLogout = async () => {
        await authLogout();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex selection:bg-brand-primary selection:text-white">

            {/* Desktop Sidebar */}
            <m.aside
                animate={{ width: isSidebarCollapsed ? 120 : 320 }}
                className="hidden lg:flex flex-col bg-brand-dark border-r border-white/5 relative z-50 pt-12 pb-8 px-6 transition-all duration-500"
            >
                <div className="flex items-center justify-between mb-20 px-4">
                    <Link to="/" className="flex items-center gap-4 group">
                        <div className="w-12 h-12 bg-brand-primary/20 backdrop-blur-xl rounded-xl flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                            <span className="font-black text-brand-primary text-xl">G</span>
                        </div>
                        {!isSidebarCollapsed && (
                            <m.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="font-black text-white uppercase tracking-tighter text-lg"
                            >
                                Admin Hub
                            </m.span>
                        )}
                    </Link>
                    <button
                        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                        className="p-2 text-gray-500 hover:text-white transition-colors"
                        title={isSidebarCollapsed ? "Expandir Menu" : "Recolher Menu"}
                        aria-label={isSidebarCollapsed ? "Expandir Menu" : "Recolher Menu"}
                    >
                        <ChevronLeft className={`w-5 h-5 transition-transform duration-500 ${isSidebarCollapsed ? 'rotate-180' : ''}`} />
                    </button>
                </div>

                <nav className="flex-grow space-y-4">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-6 px-6 py-5 rounded-[1.5rem] transition-all group relative ${isActive
                                    ? 'bg-brand-primary text-white shadow-xl shadow-brand-primary/20 scale-105'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <item.icon className={`w-6 h-6 ${isActive ? 'text-white' : 'group-hover:text-brand-primary transition-colors'}`} />
                                {!isSidebarCollapsed && (
                                    <m.span
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="font-bold text-sm uppercase tracking-widest"
                                    >
                                        {item.label}
                                    </m.span>
                                )}
                                {isActive && (
                                    <m.div
                                        layoutId="sidebarActive"
                                        className="absolute inset-0 bg-brand-primary rounded-[1.5rem] -z-10 shadow-2xl"
                                    />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="space-y-4 pt-8 border-t border-white/5">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-6 px-6 py-5 rounded-[1.5rem] text-red-400 hover:text-red-300 hover:bg-red-400/5 transition-all group"
                        title="Sair da Sessão"
                        aria-label="Sair da Sessão"
                    >
                        <LogOut className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                        {!isSidebarCollapsed && (
                            <span className="font-bold text-sm uppercase tracking-widest">Sair da Sessão</span>
                        )}
                    </button>
                </div>
            </m.aside>

            {/* Main Content Area */}
            <main className="flex-grow flex flex-col min-h-screen relative overflow-hidden">

                {/* Header (Top Bar) */}
                <header className="h-28 bg-white/80 backdrop-blur-xl border-b border-gray-100 flex items-center justify-between px-10 sticky top-0 z-40">
                    <div className="flex items-center gap-8 flex-grow max-w-2xl">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="p-3 bg-gray-50 rounded-2xl border border-gray-100"
                            title="Abrir Menu"
                            aria-label="Abrir Menu"
                        >
                            <Menu className="w-6 h-6 text-brand-dark" />
                        </button>
                        <div className="relative flex-grow group hidden md:block">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-brand-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Pesquisar no sistema..."
                                className="w-full pl-16 pr-6 py-4 bg-gray-50 rounded-2xl border border-transparent focus:border-brand-primary/20 focus:bg-white transition-all outline-none font-medium text-sm"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-8">
                        <button
                            className="relative p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-white transition-all group"
                            title="Notificações"
                            aria-label="Notificações"
                        >
                            <Bell className="w-5 h-5 text-gray-400 group-hover:text-brand-primary transition-colors" />
                            <span className="absolute top-4 right-4 w-2 h-2 bg-brand-primary rounded-full border-2 border-white"></span>
                        </button>

                        <div className="flex items-center gap-6 pl-8 border-l border-gray-100">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-black text-brand-dark uppercase tracking-tight">{user?.name || 'Administrador'}</p>
                                <p className="text-[10px] font-bold text-brand-primary uppercase tracking-[0.2em] opacity-70">Protocolo de Gestão</p>
                            </div>
                            <div className="w-14 h-14 bg-brand-light rounded-2xl border border-brand-primary/10 flex items-center justify-center shadow-lg shadow-brand-dark/5">
                                <UserIcon className="w-7 h-7 text-brand-primary" />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-grow p-10 overflow-y-auto no-scrollbar">
                    <AnimatePresence mode="wait">
                        <m.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.3 }}
                        >
                            {children}
                        </m.div>
                    </AnimatePresence>
                </div>
            </main>

            {/* Mobile Nav Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <m.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-brand-dark/40 backdrop-blur-md z-[100]"
                        />
                        <m.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            className="fixed inset-y-0 left-0 w-[85%] max-w-sm bg-brand-dark z-[110] p-10 flex flex-col"
                        >
                            <div className="flex items-center justify-between mb-16 px-4">
                                <span className="font-black text-white uppercase tracking-tighter text-2xl">Administração</span>
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    title="Fechar Menu"
                                    aria-label="Fechar Menu"
                                >
                                    <X className="w-8 h-8 text-white" />
                                </button>
                            </div>
                            <nav className="flex-grow space-y-6">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center gap-8 py-4 text-gray-400 font-bold uppercase tracking-[0.2em] text-xs hover:text-white transition-colors"
                                    >
                                        <item.icon className="w-6 h-6 text-brand-primary" />
                                        {item.label}
                                    </Link>
                                ))}
                            </nav>
                        </m.aside>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminLayout;
