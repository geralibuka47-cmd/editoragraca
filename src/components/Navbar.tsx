import React from 'react';
import logo from '../assets/imagens/logo.png';
import { ShoppingBag, Search, User, LogOut, Menu, X, Bell } from 'lucide-react';
import { motion as m, AnimatePresence } from 'framer-motion';
import { User as UserType, Notification } from '../types';
import { getNotifications, markNotificationAsRead } from '../services/dataService';

interface NavbarProps {
    onNavigate: (view: any) => void;
    currentView: string;
    cartCount: number;
    user: UserType | null;
    onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentView, cartCount, user, onLogout }) => {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const [isSearchOpen, setIsSearchOpen] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [isNotificationsOpen, setIsNotificationsOpen] = React.useState(false);
    const [notifications, setNotifications] = React.useState<Notification[]>([]);

    React.useEffect(() => {
        if (user) {
            const fetchNotifs = async () => {
                const data = await getNotifications(user.id);
                setNotifications(data);
            };
            fetchNotifs();
            const interval = setInterval(fetchNotifs, 30000);
            return () => clearInterval(interval);
        }
    }, [user]);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const handleMarkRead = async (id: string) => {
        await markNotificationAsRead(id);
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            onNavigate('CATALOG');
            localStorage.setItem('pendingSearch', searchQuery.trim());
            setIsSearchOpen(false);
            setSearchQuery('');
        }
    };

    const navLinks = [
        { name: 'Início', path: '/' },
        { name: 'Catálogo', path: '/livros' },
        { name: 'Blog', path: '/blog' },
        { name: 'Serviços', path: '/servicos' },
        { name: 'Sobre', path: '/sobre' },
        { name: 'Contacto', path: '/contacto' },
    ];

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 shadow-sm h-20 md:h-24 flex items-center transition-all">
            <div className="container mx-auto px-6 md:px-12 flex justify-between items-center h-full">
                {/* 1. Brand Identity - Clean & Iconic */}
                <div
                    className="flex items-center gap-3 cursor-pointer group"
                    onClick={() => onNavigate('HOME')}
                >
                    <img src={logo} alt="Editora Graça" className="h-10 w-auto md:h-12 object-contain" />
                    <div className="flex flex-col">
                        <span className="font-serif font-black text-brand-dark text-xl leading-none tracking-tight">EDITORA <span className="text-brand-primary">GRAÇA</span></span>
                        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-400 hidden lg:block">Património Literário</span>
                    </div>
                </div>

                {/* 2. Primary Navigation - Centered & Modern */}
                <nav className="hidden md:flex items-center gap-10">
                    {navLinks.map((link) => {
                        const isActive = (link.path === '/' && currentView === '/') || (link.path !== '/' && currentView.startsWith(link.path));
                        return (
                            <button
                                key={link.path}
                                onClick={() => onNavigate(link.path)}
                                className={`text-sm font-bold uppercase tracking-widest transition-colors relative py-2 ${isActive ? 'text-brand-primary' : 'text-brand-dark/70 hover:text-brand-dark'
                                    }`}
                            >
                                {link.name}
                                {isActive && (
                                    <m.div layoutId="navUnderline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary" />
                                )}
                            </button>
                        );
                    })}
                </nav>

                {/* 3. Actions - Minimalist Icons */}
                <div className="flex items-center gap-4 md:gap-6">
                    <button
                        onClick={() => setIsSearchOpen(!isSearchOpen)}
                        className="p-2 text-brand-dark/80 hover:text-brand-primary transition-colors rounded-full hover:bg-gray-50"
                        aria-label="Pesquisar"
                    >
                        <Search className="w-5 h-5" />
                    </button>

                    <button
                        onClick={() => user ? onNavigate(user.role === 'adm' ? 'ADMIN' : 'READER_DASHBOARD') : onNavigate('/login?mode=login')}
                        className="p-2 text-brand-dark/80 hover:text-brand-primary transition-colors rounded-full hover:bg-gray-50"
                        title={user ? "Minha Conta" : "Entrar"}
                    >
                        <User className="w-5 h-5" />
                    </button>

                    <button
                        onClick={() => onNavigate('CHECKOUT')}
                        className="relative p-2 text-brand-dark/80 hover:text-brand-primary transition-colors rounded-full hover:bg-gray-50"
                    >
                        <ShoppingBag className="w-5 h-5" />
                        {cartCount > 0 && (
                            <span className="absolute top-1 right-1 w-4 h-4 bg-brand-primary text-white text-[9px] font-black flex items-center justify-center rounded-full">
                                {cartCount}
                            </span>
                        )}
                    </button>

                    <button
                        className="md:hidden p-2 text-brand-dark"
                        onClick={() => setIsMenuOpen(true)}
                        aria-label="Abrir menu"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Mobile Menu Drawer */}
            <AnimatePresence>
                {isMenuOpen && (
                    <m.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: "tween", duration: 0.3 }}
                        className="fixed inset-0 z-[60] bg-white flex flex-col pt-8 px-8 md:hidden shadow-2xl"
                    >
                        <div className="flex justify-between items-center mb-12">
                            <span className="font-serif font-black text-2xl text-brand-dark">MENU</span>
                            <button onClick={() => setIsMenuOpen(false)} className="p-2 bg-gray-50 rounded-full" aria-label="Fechar menu">
                                <X className="w-6 h-6 text-brand-dark" />
                            </button>
                        </div>
                        <div className="flex flex-col gap-6">
                            {navLinks.map((link, idx) => (
                                <button
                                    key={link.path}
                                    onClick={() => { setIsMenuOpen(false); onNavigate(link.path); }}
                                    className="text-2xl font-black text-brand-dark text-left uppercase tracking-tight py-4 border-b border-gray-100 last:border-0"
                                >
                                    {link.name}
                                </button>
                            ))}
                        </div>
                    </m.div>
                )}
            </AnimatePresence>

            {/* Search Overlay */}
            <AnimatePresence>
                {isSearchOpen && (
                    <m.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-xl py-6 px-4 md:px-12 flex justify-center"
                    >
                        <form onSubmit={handleSearch} className="w-full max-w-3xl relative">
                            <input
                                autoFocus
                                type="text"
                                placeholder="O que procura..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-6 pr-14 py-4 bg-gray-50 rounded-xl text-lg font-medium outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all font-sans"
                            />
                            <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-primary font-bold uppercase text-xs tracking-widest">
                                Buscar
                            </button>
                        </form>
                    </m.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Navbar;
