import React, { useState } from 'react';
import { motion as m, AnimatePresence } from 'framer-motion';
import { Menu, X, LogOut, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { OptimizedImage } from './OptimizedImage';

export interface NavItem {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    path?: string;
    onClick?: () => void;
}

interface DashboardLayoutProps {
    sidebarItems: NavItem[];
    activeTab: string;
    onTabChange?: (id: string) => void;
    children: React.ReactNode;
    title: string;
    userRoleLabel: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
    sidebarItems,
    activeTab,
    onTabChange,
    children,
    title,
    userRoleLabel
}) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleNav = (item: NavItem) => {
        if (item.path) navigate(item.path);
        if (item.onClick) item.onClick();
        if (onTabChange) onTabChange(item.id);
        setSidebarOpen(false);
    };

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gray-50/80 flex">
            {/* Overlay mobile */}
            <AnimatePresence>
                {sidebarOpen && (
                    <m.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSidebarOpen(false)}
                        className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm"
                        aria-hidden
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <m.aside
                initial={false}
                animate={{ x: sidebarOpen ? 0 : '-100%' }}
                transition={{ type: 'tween', duration: 0.25 }}
                className="fixed lg:static inset-y-0 left-0 z-50 w-72 flex flex-col bg-white border-r border-gray-200 shadow-xl lg:shadow-none"
            >
                <div className="flex items-center justify-between h-16 px-4 border-b border-gray-100 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-brand-primary/10 flex items-center justify-center">
                            <span className="font-serif font-black text-brand-primary text-lg">G</span>
                        </div>
                        <div>
                            <p className="font-serif font-bold text-slate-900 leading-tight">Editora Graça</p>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Admin</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-500"
                        aria-label="Fechar menu"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-4 border-b border-gray-100 shrink-0">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                        <div className="w-10 h-10 rounded-full bg-brand-primary/20 flex items-center justify-center text-brand-primary font-bold text-sm overflow-hidden border border-brand-primary/30 shrink-0">
                            {user?.avatarUrl ? (
                                <OptimizedImage src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                                user?.name?.charAt(0) ?? 'A'
                            )}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-bold text-slate-900 truncate">{user?.name}</p>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{userRoleLabel}</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                    {sidebarItems.map((item) => {
                        const isActive = activeTab === item.id;
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.id}
                                onClick={() => handleNav(item)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200
                                    ${isActive
                                        ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/25'
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-slate-900'
                                    }`}
                            >
                                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : ''}`} />
                                <span className="font-medium text-sm truncate flex-1">{item.label}</span>
                                {isActive && <ChevronRight className="w-4 h-4 shrink-0 opacity-80" />}
                            </button>
                        );
                    })}
                </nav>

                <div className="p-3 border-t border-gray-100">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all font-medium text-sm"
                    >
                        <LogOut className="w-5 h-5 shrink-0" />
                        Sair
                    </button>
                </div>
            </m.aside>

            {/* Main */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-white border-b border-gray-200 flex items-center gap-4 px-4 sm:px-6 lg:px-8 shrink-0 sticky top-0 z-30">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600"
                        aria-label="Abrir menu"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <h1 className="text-lg sm:text-xl font-bold text-slate-900 truncate">
                        {title}
                    </h1>
                </header>

                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};
