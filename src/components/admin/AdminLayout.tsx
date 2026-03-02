import React, { useState } from 'react';
import { motion as m, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, BookCopy, Users, CreditCard,
    FileEdit, Settings, LogOut, ChevronLeft,
    Bell, Search, User as UserIcon, Menu, X, FileText, Briefcase, UserCog
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
        { icon: FileText, label: 'Manuscritos', path: '/admin/manuscritos' },
        { icon: Briefcase, label: 'Serviços', path: '/admin/servicos' },
        { icon: UserCog, label: 'Equipa', path: '/admin/team' },
        { icon: Settings, label: 'Definições', path: '/admin/definicoes' },
    ];

    const handleLogout = async () => {
        await authLogout();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex selection:bg-brand-primary selection:text-white">

            {/* Desktop Sidebar */}
            <m.aside
                animate={{ width: isSidebarCollapsed ? 80 : 260 }}
                className="hidden lg:flex flex-col bg-white border-r border-gray-200 relative z-50 pt-8 pb-6 px-4 transition-all duration-300"
            >
                <div className="flex items-center justify-between mb-12 px-2">
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-brand-light rounded-lg flex items-center justify-center border border-brand-primary/20">
                            <span className="font-bold text-brand-primary text-lg">G</span>
                        </div>
                        {!isSidebarCollapsed && (
                            <m.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="font-semibold text-brand-dark text-lg"
                            >
                                Admin Core
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

                <nav className="flex-grow space-y-1">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-4 px-3 py-3 rounded-lg transition-colors group relative ${isActive
                                    ? 'bg-brand-primary/10 text-brand-primary'
                                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                                    }`}
                            >
                                <item.icon className="w-5 h-5 flex-shrink-0" />
                                {!isSidebarCollapsed && (
                                    <m.span
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="font-medium text-sm whitespace-nowrap"
                                    >
                                        {item.label}
                                    </m.span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="pt-6 border-t border-gray-200">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-4 px-3 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors group"
                        title="Terminar Sessão"
                        aria-label="Terminar Sessão"
                    >
                        <LogOut className="w-5 h-5 flex-shrink-0" />
                        {!isSidebarCollapsed && (
                            <span className="font-medium text-sm whitespace-nowrap">Terminar Sessão</span>
                        )}
                    </button>
                </div>
            </m.aside>

            {/* Main Content Area */}
            <main className="flex-grow flex flex-col min-h-screen relative overflow-hidden bg-gray-50">

                {/* Header (Top Bar) */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-40">
                    <div className="flex items-center gap-4 flex-grow max-w-xl">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="p-2 lg:hidden text-gray-500 hover:text-brand-dark transition-colors"
                            title="Abrir Menu"
                            aria-label="Abrir Menu"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <div className="relative flex-grow group hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Pesquisar..."
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-md border border-gray-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all outline-none text-sm"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <button
                            className="relative p-2 text-gray-400 hover:text-gray-900 transition-colors"
                            title="Notificações"
                            aria-label="Notificações"
                        >
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-primary rounded-full border border-white"></span>
                        </button>

                        <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-semibold text-gray-900">{user?.name || 'Administrador'}</p>
                                <p className="text-xs text-brand-primary">{user?.role === 'adm' ? 'Admin' : 'Equipa'}</p>
                            </div>
                            <div className="w-8 h-8 bg-brand-primary/10 rounded-full flex items-center justify-center">
                                <UserIcon className="w-4 h-4 text-brand-primary" />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-grow p-6 md:p-8 overflow-y-auto no-scrollbar">
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
                            className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-[100] lg:hidden"
                        />
                        <m.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            className="fixed inset-y-0 left-0 w-64 bg-white z-[110] p-6 flex flex-col shadow-2xl lg:hidden"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <span className="font-semibold text-brand-dark text-lg">Admin Core</span>
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="p-2 text-gray-400 hover:text-gray-900"
                                    title="Fechar Menu"
                                    aria-label="Fechar Menu"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <nav className="flex-grow space-y-2">
                                {navItems.map((item) => {
                                    const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
                                    return (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={`flex items-center gap-3 px-3 py-3 text-sm rounded-lg transition-colors ${isActive ? 'bg-brand-primary/10 text-brand-primary font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                                        >
                                            <item.icon className="w-5 h-5 flex-shrink-0" />
                                            {item.label}
                                        </Link>
                                    );
                                })}
                            </nav>
                        </m.aside>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminLayout;
