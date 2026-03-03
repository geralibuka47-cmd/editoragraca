import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Book,
    Users,
    ShoppingBag,
    FileText,
    Settings,
    LogOut,
    Menu,
    X,
    ChevronRight,
    TrendingUp,
    User,
    MessageSquare,
    Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { logout as authLogout } from '../../services/authService';
import { useAuth } from '../../contexts/AuthContext';
import logo from '../../assets/imagens/logo.png';

interface AdminLayoutProps {
    children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    const menuItems = [
        { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
        { name: 'Livros', path: '/admin/livros', icon: Book },
        { name: 'Utilizadores', path: '/admin/utilizadores', icon: Users },
        { name: 'Encomendas', path: '/admin/encomendas', icon: ShoppingBag },
        { name: 'Manuscritos', path: '/admin/manuscritos', icon: FileText },
        { name: 'Blog', path: '/admin/blog', icon: MessageSquare },
        { name: 'Equipa', path: '/admin/equipa', icon: Award },
        { name: 'Definições', path: '/admin/settings', icon: Settings },
    ];

    const handleLogout = async () => {
        await authLogout();
        navigate('/');
    };

    return (
        <div className="flex h-screen bg-[#F8FAFC] font-sans text-brand-dark overflow-hidden">
            {/* Sidebar - Premium Glass Style */}
            <AnimatePresence mode="wait">
                {isSidebarOpen && (
                    <motion.aside
                        initial={{ x: -300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -280, opacity: 0 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed lg:relative z-50 w-72 h-full bg-white border-r border-gray-100 shadow-xl lg:shadow-none flex flex-col"
                    >
                        {/* Sidebar Header */}
                        <div className="p-8 flex items-center gap-4 border-b border-gray-50">
                            <img src={logo} alt="Logo" className="h-10 w-auto" />
                            <div className="flex flex-col">
                                <span className="font-serif font-black text-brand-dark text-lg leading-none tracking-tight">EDITORA <span className="text-brand-primary">GRAÇA</span></span>
                                <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-gray-400">Admin Panel</span>
                            </div>
                        </div>

                        {/* Navigation */}
                        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
                            {menuItems.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    end={item.path === '/admin'}
                                    className={({ isActive }) => `
                    flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group
                    ${isActive
                                            ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20 scale-[1.02]'
                                            : 'text-gray-400 hover:bg-gray-50 hover:text-brand-dark'}
                  `}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span className="text-sm font-bold uppercase tracking-wider">{item.name}</span>
                                    {/* Decorative dot for active state */}
                                    <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ChevronRight className="w-4 h-4" />
                                    </div>
                                </NavLink>
                            ))}
                        </nav>

                        {/* Sidebar Footer - User Profile & Logout */}
                        <div className="p-6 mt-auto border-t border-gray-50">
                            <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-4 mb-4">
                                <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                                    <User className="w-5 h-5" />
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-sm font-black text-brand-dark truncate">{user?.name || 'Administrador'}</span>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Master Admin</span>
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors font-bold text-xs uppercase tracking-widest"
                            >
                                <LogOut className="w-4 h-4" />
                                Sair do Painel
                            </button>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                {/* Top Header - Glass Effect */}
                <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 flex items-center justify-between sticky top-0 z-40">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                        <h1 className="text-xl font-black uppercase tracking-tight text-brand-dark">
                            Bem-vindo, <span className="text-brand-primary">{user?.name?.split(' ')[0] || 'Admin'}</span>
                        </h1>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-100">
                            <TrendingUp className="w-3 h-3" />
                            Sistema Online
                        </div>
                        <div className="w-px h-6 bg-gray-200" />
                        <button
                            onClick={() => navigate('/')}
                            className="text-xs font-bold uppercase tracking-widest text-brand-dark hover:text-brand-primary transition-colors"
                        >
                            Ver Site
                        </button>
                    </div>
                </header>

                {/* Content Container */}
                <div className="flex-1 overflow-y-auto p-8 lg:p-12 custom-scrollbar">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {children}
                    </motion.div>
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
