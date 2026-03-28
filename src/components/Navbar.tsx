import React from 'react';
import logo from '../assets/imagens/logo.png';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, User, LogOut, Menu, X, Bell, Loader2, ShoppingCart, ChevronRight, ArrowRight } from 'lucide-react';
import { Input } from './ui/Input';
import { motion as m, AnimatePresence } from 'framer-motion';
import { User as UserType, Notification } from '../types';
import { getNotifications, markNotificationAsRead } from '../services/dataService';

interface NavbarProps {
    onNavigate: (view: any) => void;
    currentView: string;
    cartCount: number;
    user: UserType | null;
    onLogout: () => void;
    announcementOffset?: number;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentView, cartCount, user, onLogout, announcementOffset = 0 }) => {
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const [isSearchOpen, setIsSearchOpen] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [searchResults, setSearchResults] = React.useState<any[]>([]);
    const [isSearching, setIsSearching] = React.useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = React.useState(false);
    const [notifications, setNotifications] = React.useState<Notification[]>([]);

    React.useEffect(() => {
        const delaySearch = setTimeout(async () => {
            if (searchQuery.length >= 2) {
                setIsSearching(true);
                const { instantSearch } = await import('../services/searchService');
                const results = await instantSearch(searchQuery);
                setSearchResults(results);
                setIsSearching(false);
            } else {
                setSearchResults([]);
            }
        }, 300);

        return () => clearTimeout(delaySearch);
    }, [searchQuery]);

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
            onNavigate('/livros');
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
        { name: 'Portefólio', path: '/projetos' },
        { name: 'Sobre Nós', path: '/sobre' },
        { name: 'Contactos', path: '/contacto' },
    ];

    return (
        <header
            className="fixed left-0 right-0 z-50 bg-white border-b border-gray-100 shadow-sm h-16 sm:h-20 lg:h-24 flex items-center transition-all safe-area-top"
            style={{ top: `${announcementOffset}px` }}
        >
            <div className="container flex justify-between items-center h-full gap-2">
                {/* 1. Brand Identity - Clean & Iconic */}
                <Link
                    to="/"
                    className="flex items-center gap-3 cursor-pointer group"
                    aria-label="Editora Graça - Página inicial"
                >
                    <img src={logo} alt="" className="h-8 sm:h-10 w-auto md:h-12 object-contain" />
                    <div className="flex flex-col leading-[0.85] min-w-0">
                        <span className="font-serif font-black text-brand-dark text-[10px] sm:text-[13px] uppercase tracking-tight">Editora</span>
                        <span className="font-serif font-black text-brand-primary text-base sm:text-2xl uppercase tracking-tighter">Graça</span>
                    </div>
                </Link>

                {/* 2. Primary Navigation - Centered & Modern */}
                <nav className="hidden md:flex items-center gap-10" aria-label="Navegação principal">
                    {navLinks.map((link) => {
                        const isActive = (link.path === '/' && location.pathname === '/') || (link.path !== '/' && location.pathname.startsWith(link.path));
                        return (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`text-sm font-bold uppercase tracking-widest transition-colors relative py-2 ${isActive ? 'text-brand-primary' : 'text-brand-dark/70 hover:text-brand-dark'
                                    }`}
                            >
                                {link.name}
                                {isActive && (
                                    <m.div layoutId="navUnderline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* 3. Actions - Minimalist Icons */}
                <div className="flex items-center gap-2 sm:gap-4 md:gap-6 shrink-0">
                    <button
                        onClick={() => setIsSearchOpen(!isSearchOpen)}
                        className="p-2 text-brand-dark/80 hover:text-brand-primary transition-colors rounded-full hover:bg-gray-50"
                        aria-label="Pesquisar"
                    >
                        <Search className="w-5 h-5" />
                    </button>

                    {user ? (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => onNavigate(user.role === 'adm' ? '/admin' : '/perfil')}
                                className="p-2 text-brand-dark/80 hover:text-brand-primary transition-colors rounded-full hover:bg-gray-50 flex items-center gap-2"
                                aria-label="Minha conta"
                            >
                                <User className="w-5 h-5" />
                                <span className="text-[10px] font-black uppercase tracking-widest hidden lg:block">Painel</span>
                            </button>
                            <button
                                onClick={onLogout}
                                className="p-2 text-red-500/80 hover:text-red-500 transition-colors rounded-full hover:bg-red-50"
                                aria-label="Terminar sessão"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => onNavigate('/login')}
                            className="p-2 text-brand-dark/80 hover:text-brand-primary transition-colors rounded-full hover:bg-gray-50"
                            aria-label="Iniciar sessão"
                        >
                            <User className="w-5 h-5" />
                        </button>
                    )}

                    <button
                        onClick={() => onNavigate('/carrinho')}
                        className="relative p-2 text-brand-dark/80 hover:text-brand-primary transition-colors rounded-full hover:bg-gray-50"
                        aria-label={`Carrinho de compras${cartCount > 0 ? `, ${cartCount} itens` : ''}`}
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
                    <>
                        {/* Backdrop */}
                        <m.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMenuOpen(false)}
                            className="fixed inset-0 z-[59] bg-black/40 backdrop-blur-sm md:hidden"
                        />
                        {/* Drawer */}
                        <m.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: "spring", damping: 28, stiffness: 220 }}
                            className="fixed top-0 right-0 bottom-0 z-[60] w-72 bg-brand-dark text-white flex flex-col md:hidden shadow-2xl"
                        >
                            {/* Header */}
                            <div className="flex justify-between items-center px-6 py-5 border-b border-white/10">
                                <div className="flex items-center gap-2">
                                    <img src={logo} alt="Editora Graça" className="h-6 w-auto brightness-0 invert opacity-70" />
                                    <span className="font-serif font-black text-sm uppercase tracking-widest text-white/70">Editora <span className="text-brand-primary">Graça</span></span>
                                </div>
                                <button onClick={() => setIsMenuOpen(false)} className="p-2 rounded-xl hover:bg-white/10 transition-colors" aria-label="Fechar menu">
                                    <X className="w-5 h-5 text-white/60" />
                                </button>
                            </div>

                            {/* Nav Links */}
                            <nav className="flex-1 overflow-y-auto py-4 px-3">
                                {navLinks.map((link, i) => {
                                    const isActive = (link.path === '/' && location.pathname === '/') || (link.path !== '/' && location.pathname.startsWith(link.path));
                                    return (
                                        <m.div
                                            key={link.path}
                                            initial={{ opacity: 0, x: 16 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.04 }}
                                        >
                                            <Link
                                                to={link.path}
                                                onClick={() => setIsMenuOpen(false)}
                                                className={`flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl text-sm font-bold uppercase tracking-widest transition-all duration-200 group ${isActive ? 'bg-brand-primary/15 text-brand-primary' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
                                            >
                                                {link.name}
                                                <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? 'text-brand-primary' : 'text-white/20 group-hover:text-white/50 group-hover:translate-x-0.5'}`} />
                                            </Link>
                                        </m.div>
                                    );
                                })}
                            </nav>

                            {/* Footer */}
                            <div className="px-6 py-5 border-t border-white/10">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-white/20 text-center">© {new Date().getFullYear()} Editora Graça</p>
                            </div>
                        </m.div>
                    </>
                )}
            </AnimatePresence>

            {/* Search Overlay */}
            <AnimatePresence>
                {isSearchOpen && (
                    <m.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-xl py-6 px-4 flex justify-center w-full"
                    >
                        <div className="container px-0 flex justify-center">
                            <form onSubmit={handleSearch} className="w-full max-w-4xl relative">
                                <Input
                                    autoFocus
                                    type="text"
                                    variant="light"
                                    placeholder="O que procura..."
                                    value={searchQuery}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                                    className="pr-14"
                                    icon={<Search className="w-5 h-5" />}
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                    {isSearching && <Loader2 className="w-4 h-4 animate-spin text-brand-primary" />}
                                    <button
                                        type="submit"
                                        className="text-brand-primary font-bold uppercase text-xs tracking-widest px-2 hover:brightness-110 transition-all"
                                        title="Efetuar Pesquisa"
                                        aria-label="Efetuar Pesquisa"
                                    >
                                        Buscar
                                    </button>
                                </div>

                                {/* Instant Results Dropdown */}
                                <AnimatePresence>
                                    {searchResults.length > 0 && (
                                        <m.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute top-full mt-4 left-0 right-0 bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 z-50 p-4"
                                        >
                                            <div className="px-6 pt-4 pb-2">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Resultados Rápidos</span>
                                            </div>
                                            <div className="space-y-2">
                                                {searchResults.map((result) => (
                                                    <button
                                                        key={result.id}
                                                        onClick={() => {
                                                            onNavigate(result.url);
                                                            setIsSearchOpen(false);
                                                            setSearchQuery('');
                                                        }}
                                                        className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 rounded-2xl transition-all text-left group"
                                                    >
                                                        <div className="w-12 h-16 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                                                            {result.image && (
                                                                <img src={result.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                                            )}
                                                        </div>
                                                        <div className="flex-1">
                                                            <h4 className="font-black text-brand-dark leading-tight group-hover:text-brand-primary transition-colors">{result.title}</h4>
                                                            <p className="text-xs text-gray-500 font-medium">{result.subtitle}</p>
                                                        </div>
                                                        <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${result.type === 'book' ? 'bg-brand-primary/10 text-brand-primary' : 'bg-brand-dark/10 text-brand-dark'
                                                            }`}>
                                                            {result.type === 'book' ? 'Livro' : 'Post'}
                                                        </span>
                                                    </button>
                                                ))}
                                            </div>
                                        </m.div>
                                    )}
                                </AnimatePresence>
                            </form>
                        </div>
                    </m.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Navbar;
