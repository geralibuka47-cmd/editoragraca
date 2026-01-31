import React from 'react';
import logo from '../assets/imagens/logo.png';
import { ShoppingBag, Search, User, Heart, LogOut, Menu, X, Bell, Phone, ArrowRight } from 'lucide-react';
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
            const interval = setInterval(fetchNotifs, 30000); // Check every 30s
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
            // Navigate to catalog with query - we'll handle this in App.tsx or just by setting a global state
            // For now, let's assume we can pass it or just navigate
            onNavigate('CATALOG');
            // We might need a way to pass the query. Let's use localStorage or a prop.
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
        { name: 'Sobre Nós', path: '/sobre' },
        { name: 'Contacto', path: '/contacto' },
    ];

    return (
        <header className="flex flex-col w-full sticky top-0 z-50 glass-premium shadow-2xl shadow-black/[0.03]">
            {/* Utility Top Bar - Ultra Minimalist */}
            <div className="bg-brand-dark text-white/90 py-2 px-4 md:px-8 flex flex-col md:flex-row justify-between items-center text-[10px] md:text-[11px] uppercase tracking-[0.2em] font-black border-b border-white/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/10 to-transparent opacity-30"></div>
                <div className="flex gap-6 items-center relative z-10">
                    <span className="hidden sm:inline text-gray-400 font-bold">Património Literário Angolano</span>
                    <span className="text-brand-primary flex items-center gap-2">
                        <Phone className="w-3 h-3" /> +244 947 472 230
                    </span>
                </div>
                <div className="flex gap-6 relative z-10 mt-2 md:mt-0">
                    {user ? (
                        <div className="flex items-center gap-4">
                            <span className="text-brand-primary">Membro: <span className="text-white">{user.name}</span></span>
                            <button onClick={onLogout} className="hover:text-brand-primary flex items-center gap-2 transition-all hover:scale-105 active:scale-95" title="Terminar Sessão">
                                <LogOut className="w-3.5 h-3.5" /> Terminar
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-6">
                            <button onClick={() => onNavigate('/login?mode=login')} className="hover:text-brand-primary transition-all font-black" title="Entrar na minha conta">Acesso</button>
                            <span className="opacity-10">|</span>
                            <button onClick={() => onNavigate('/login?mode=register')} className="hover:text-brand-primary transition-all font-black" title="Criar uma nova conta">Registo</button>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Header Area - High Aesthetics */}
            <div className="py-4 md:py-6 px-4 md:px-8 flex justify-between items-center bg-white/20 backdrop-blur-xl relative">
                <div className="w-1/4 md:w-1/3 flex gap-6 items-center">
                    <button
                        className="md:hidden text-brand-dark p-3 bg-white/50 backdrop-blur-md rounded-2xl shadow-sm border border-white/20 transition-all active:scale-95"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Menu"
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>

                    <m.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="hidden md:flex items-center gap-3 text-gray-400 hover:text-brand-primary transition-all group px-4 py-2 rounded-2xl hover:bg-brand-primary/5 border border-transparent hover:border-brand-primary/10"
                        title="Explorar Acervo"
                        aria-label="Pesquisar livros"
                        onClick={() => setIsSearchOpen(!isSearchOpen)}
                    >
                        <Search className={`w-5 h-5 transition-transform group-hover:rotate-12 ${isSearchOpen ? 'text-brand-primary' : ''}`} />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] overflow-hidden whitespace-nowrap hidden lg:block">Procurar Obra</span>
                    </m.button>
                </div>

                <m.button
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex-1 md:w-1/3 flex flex-col items-center cursor-pointer group"
                    onClick={() => onNavigate('HOME')}
                    title="Editora Graça"
                >
                    <img src={logo} alt="Editora Graça" className="h-12 md:h-18 w-auto object-contain transition-transform duration-700 group-hover:scale-110 drop-shadow-2xl" />
                </m.button>

                <div className="w-1/4 md:w-1/3 flex justify-end gap-3 md:gap-6 items-center">
                    <m.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                            if (!user) {
                                onNavigate('/login?mode=login');
                            } else {
                                const dashboardView = user.role === 'adm' ? 'ADMIN' :
                                    (user.role === 'autor' ? 'AUTHOR_DASHBOARD' : 'READER_DASHBOARD');
                                onNavigate(dashboardView);
                            }
                        }}
                        className="text-brand-dark hover:text-brand-primary transition-all flex items-center gap-3 group p-2.5 bg-white/30 backdrop-blur-md rounded-2xl border border-white/40 shadow-sm"
                        title="Ver o meu painel"
                    >
                        <User className="w-5 h-5 transition-transform group-hover:scale-110" />
                        <span className="hidden lg:block text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 group-hover:text-brand-primary transition-colors">
                            Painel
                        </span>
                    </m.button>

                    <div className="relative">
                        <m.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                            className="text-brand-dark hover:text-brand-primary transition-all p-2.5 bg-white/30 backdrop-blur-md rounded-2xl border border-white/40 shadow-sm relative group"
                            title="Notificações"
                            aria-label="Ver notificações"
                        >
                            <Bell className="w-5 h-5 transition-transform group-hover:rotate-12" />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-brand-primary text-white text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center ring-4 ring-white shadow-xl animate-pulse">
                                    {unreadCount}
                                </span>
                            )}
                        </m.button>

                        <AnimatePresence>
                            {isNotificationsOpen && (
                                <m.div
                                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                                    className="absolute right-0 mt-6 w-96 glass-premium rounded-[2.5rem] border border-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] z-[100] overflow-hidden"
                                >
                                    <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gradient-to-br from-white to-gray-50">
                                        <h4 className="font-black text-brand-dark uppercase tracking-[0.3em] text-[11px]">Centro de Avisos</h4>
                                        <button
                                            onClick={() => setIsNotificationsOpen(false)}
                                            className="text-[10px] text-brand-primary font-black uppercase tracking-wider hover:opacity-70 transition-opacity"
                                            title="Limpar todas as notificações"
                                            aria-label="Limpar todas as notificações"
                                        >
                                            Limpar
                                        </button>
                                    </div>
                                    <div className="max-h-[30rem] overflow-y-auto custom-scrollbar">
                                        {notifications.length > 0 ? (
                                            notifications.map(n => (
                                                <m.div
                                                    key={n.id}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    onClick={() => {
                                                        handleMarkRead(n.id);
                                                        if (n.link) onNavigate(n.link as any);
                                                        setIsNotificationsOpen(false);
                                                    }}
                                                    className={`p-6 hover:bg-brand-primary/5 cursor-pointer border-b border-gray-50 transition-all flex items-start gap-4 ${!n.isRead ? 'bg-brand-primary/[0.02]' : ''}`}
                                                >
                                                    <div className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 ${!n.isRead ? 'bg-brand-primary shadow-[0_0_10px_rgba(196,160,82,0.5)]' : 'bg-gray-200'}`}></div>
                                                    <div className="space-y-1">
                                                        <p className="font-black text-brand-dark text-xs uppercase tracking-tight leading-tight">{n.title}</p>
                                                        <p className="text-gray-500 text-[11px] leading-relaxed font-bold opacity-80">{n.content}</p>
                                                        <span className="text-[10px] text-gray-300 font-black block pt-2">{new Date(n.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                </m.div>
                                            ))
                                        ) : (
                                            <div className="p-16 text-center">
                                                <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                                                    <Bell className="w-10 h-10 text-gray-200" />
                                                </div>
                                                <p className="text-[11px] text-gray-400 font-black uppercase tracking-[0.3em] leading-loose">Silêncio Absoluto<br /><span className="opacity-50 font-bold">Sem novas atualizações</span></p>
                                            </div>
                                        )}
                                    </div>
                                </m.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <m.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="text-brand-dark hover:text-brand-primary transition-all p-2.5 bg-brand-dark text-white rounded-2xl relative group shadow-xl shadow-brand-dark/10"
                        onClick={() => onNavigate('CHECKOUT')}
                    >
                        <ShoppingBag className="w-5 h-5 text-brand-primary" />
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-white text-brand-dark text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center ring-4 ring-brand-dark shadow-2xl">
                                {cartCount}
                            </span>
                        )}
                    </m.button>
                </div>
            </div>

            {/* Search Bar Overlay - Elegant Expansion */}
            <AnimatePresence>
                {isSearchOpen && (
                    <m.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-white/95 backdrop-blur-xl border-b border-gray-100 overflow-hidden"
                    >
                        <form onSubmit={handleSearch} className="container mx-auto max-w-5xl py-12 px-8 relative">
                            <m.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="relative"
                            >
                                <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-8 h-8 text-brand-primary/40" />
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="Qual obra busca hoje?"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-24 pr-16 py-8 bg-gray-50 border-transparent focus:bg-white text-4xl md:text-6xl font-black text-brand-dark placeholder:text-gray-200 outline-none transition-all rounded-[3rem] tracking-tighter italic font-serif"
                                />
                                <button
                                    type="button"
                                    onClick={() => setIsSearchOpen(false)}
                                    className="absolute right-8 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-gray-100 rounded-full text-gray-400 hover:text-brand-dark hover:bg-gray-200 transition-all"
                                    title="Fechar Pesquisa"
                                    aria-label="Fechar Pesquisa"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </m.div>
                            <div className="mt-8 flex gap-6 px-12">
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300">Sugestões:</span>
                                <div className="flex gap-4">
                                    {['Obras Primas', 'Novos Talentos', 'Ensaios'].map(tag => (
                                        <button key={tag} title={`Pesquisar por ${tag}`} className="text-[10px] font-black uppercase tracking-widest text-brand-primary hover:underline">{tag}</button>
                                    ))}
                                </div>
                            </div>
                        </form>
                    </m.div>
                )}
            </AnimatePresence>

            {/* Navigation Menu Area - Desktop - Sophisticated Links */}
            <nav className="hidden md:flex bg-white/20 py-5 px-8 justify-center border-b border-gray-100/30 backdrop-blur-md">
                <ul className="flex gap-12 lg:gap-20 font-black text-[11px] uppercase tracking-[0.4em] text-gray-400">
                    {navLinks.map((link) => {
                        const isActive = (link.path === '/' && currentView === '/') || (link.path !== '/' && currentView.startsWith(link.path));
                        return (
                            <li key={link.path}>
                                <button
                                    onClick={() => onNavigate(link.path)}
                                    className={`hover:text-brand-primary transition-all relative pb-3 group ${isActive ? 'text-brand-primary text-gradient-gold' : ''}`}
                                >
                                    {link.name}
                                    <m.span
                                        layoutId="navTab"
                                        className={`absolute bottom-0 left-0 h-1 bg-brand-primary rounded-full transition-all duration-500 ${isActive ? 'w-full' : 'w-0 group-hover:w-full opacity-30'}`}
                                    ></m.span>
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Mobile Menu - Immersive Drawer */}
            <AnimatePresence>
                {isMenuOpen && (
                    <m.div
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed inset-0 z-[100] md:hidden"
                    >
                        <div className="absolute inset-0 bg-brand-dark/60 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}></div>
                        <div className="absolute top-0 left-0 bottom-0 w-[85%] bg-white shadow-2xl flex flex-col p-10">
                            <div className="flex justify-between items-center mb-16">
                                <img src={logo} alt="Logo" className="h-10 w-auto" />
                                <button
                                    onClick={() => setIsMenuOpen(false)}
                                    className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-brand-dark active:scale-95"
                                    title="Fechar Menu"
                                    aria-label="Fechar Menu"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <ul className="space-y-4">
                                {navLinks.map((link) => {
                                    const isActive = (link.path === '/' && currentView === '/') || (link.path !== '/' && currentView?.startsWith(link.path));
                                    return (
                                        <li key={link.path}>
                                            <m.button
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                onClick={() => {
                                                    setIsMenuOpen(false);
                                                    onNavigate(link.path);
                                                }}
                                                className={`w-full text-left px-8 py-6 rounded-3xl text-sm font-black uppercase tracking-[0.3em] transition-all flex items-center justify-between group ${isActive
                                                    ? 'bg-brand-primary text-white shadow-xl shadow-brand-primary/20'
                                                    : 'text-gray-500 hover:bg-gray-50'
                                                    }`}
                                                title={`Ir para ${link.name}`}
                                                aria-label={`Ir para ${link.name}`}
                                            >
                                                {link.name}
                                                <ArrowRight className={`w-5 h-5 opacity-0 group-hover:opacity-100 transition-all ${isActive ? 'opacity-100' : ''}`} />
                                            </m.button>
                                        </li>
                                    );
                                })}
                            </ul>

                            <div className="mt-auto pt-10 border-t border-gray-100">
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300 mb-6">Membro Graça</p>
                                {user ? (
                                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-[1.5rem]">
                                        <div className="w-12 h-12 bg-brand-primary rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-black text-brand-dark leading-none">{user.name}</p>
                                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">Escritor de Elite</p>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => {
                                            setIsMenuOpen(false);
                                            onNavigate('/login?mode=login');
                                        }}
                                        className="w-full py-6 bg-brand-dark text-white rounded-[1.5rem] font-black uppercase tracking-[0.4em] text-[10px] shadow-2xl shadow-brand-dark/20"
                                        title="Entrar ou Registar"
                                        aria-label="Entrar ou Registar"
                                    >
                                        Aceder à Casa
                                    </button>
                                )}
                            </div>
                        </div>
                    </m.div>
                )}
            </AnimatePresence>
        </header >
    );
};

export default Navbar;
