import React, { useState } from 'react';
import { motion as m, AnimatePresence } from 'framer-motion';
import { Menu, X, LogOut, Search, Bell, ChevronDown } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { OptimizedImage } from './OptimizedImage';

interface NavItem {
    id: string;
    label: string;
    icon: any;
    path?: string; // If it links to a different route
    onClick?: () => void; // If it just changes state (like tabs)
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
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <div className="flex h-screen bg-[#F9FAFB] text-slate-800 font-sans selection:bg-brand-primary/20">
            {/* MOBILE OVERLAY */}
            <AnimatePresence>
                {!isSidebarOpen && (
                    <m.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsSidebarOpen(true)}
                        className="fixed inset-0 bg-black/20 z-40 lg:hidden backdrop-blur-sm"
                    />
                )}
            </AnimatePresence>

            {/* SIDEBAR */}
            <m.aside
                initial={false}
                animate={{ width: isSidebarOpen ? 260 : 72 }}
                className={`fixed lg:static inset-y-0 left-0 z-50 bg-white border-r border-gray-200 flex flex-col transition-all duration-300 shadow-sm ${!isSidebarOpen ? '-translate-x-full lg:translate-x-0' : ''}`}
            >
                {/* Logo Area */}
                <div className="h-16 flex items-center px-4 border-b border-gray-100">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 hover:bg-gray-100 rounded-full text-gray-500 hover:text-brand-primary transition-colors"
                        title="Menu Lateral"
                    >
                        <Menu className="w-5 h-5" />
                    </button>

                    <AnimatePresence>
                        {isSidebarOpen && (
                            <m.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="ml-4 font-serif font-bold text-lg tracking-tight flex items-center gap-1"
                            >
                                Editora<span className="text-brand-primary italic">G.</span>
                            </m.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* User Profile Snippet (Compact) */}
                <div className="p-4 border-b border-gray-100 flex flex-col items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-serif font-bold text-lg overflow-hidden border border-brand-primary/20">
                        {user?.avatarUrl ? (
                            <OptimizedImage src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                            user?.name.charAt(0)
                        )}
                    </div>
                    {isSidebarOpen && (
                        <div className="text-center overflow-hidden w-full">
                            <p className="text-sm font-bold text-slate-900 truncate">{user?.name}</p>
                            <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">{userRoleLabel}</p>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1 custom-scrollbar">
                    {sidebarItems.map((item) => {
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => {
                                    if (item.onClick) item.onClick();
                                    else if (item.path) navigate(item.path);
                                    if (onTabChange) onTabChange(item.id);
                                }}
                                className={`w-full flex items-center gap-4 px-3 py-3 rounded-xl transition-all group relative overflow-hidden
                                    ${isActive
                                        ? 'bg-brand-primary/10 text-brand-primary font-bold shadow-sm ring-1 ring-brand-primary/20'
                                        : 'text-gray-500 hover:bg-gray-50 hover:text-slate-900'
                                    }
                                `}
                                title={!isSidebarOpen ? item.label : ''}
                            >
                                {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-brand-primary rounded-r-full" />}
                                <item.icon className={`w-5 h-5 flex-shrink-0 transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />

                                {isSidebarOpen && (
                                    <span className="text-sm truncate">{item.label}</span>
                                )}
                            </button>
                        );
                    })}
                </nav>

                {/* Sidebar Footer */}
                <div className="p-4 border-t border-gray-100">
                    <button
                        onClick={handleLogout}
                        className={`w-full flex items-center gap-4 px-3 py-3 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all group ${!isSidebarOpen && 'justify-center'}`}
                        title="Terminar Sessão"
                    >
                        <LogOut className="w-5 h-5 flex-shrink-0" />
                        {isSidebarOpen && <span className="text-sm font-medium">Sair</span>}
                    </button>
                </div>
            </m.aside>


            {/* MAIN CONTENT AREA */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#F9FAFB]">
                {/* Header */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-30 shadow-sm/50">
                    <h1 className="text-xl font-bold text-slate-900 font-serif leading-none tracking-tight">
                        {title}
                    </h1>

                    <div className="flex items-center gap-4">
                        <div className="relative hidden md:block group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-brand-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Pesquisar..."
                                className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all w-64"
                            />
                        </div>
                        <button
                            className="relative p-2 text-gray-400 hover:text-brand-primary transition-colors"
                            title="Notificações"
                        >
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                        </button>
                    </div>
                </header>

                {/* Content Scroller */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    <div className="max-w-7xl mx-auto space-y-8">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
};
