import React from 'react';
import logo from '../assets/imagens/logo.png';
import { ShoppingBag, Search, User, Heart, LogOut, Menu, X, Bell } from 'lucide-react';
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
        { name: 'Início', view: 'HOME' },
        { name: 'Catálogo', view: 'CATALOG' },
        { name: 'Blog', view: 'BLOG' },
        { name: 'Serviços', view: 'SERVICES' },
        { name: 'Sobre Nós', view: 'ABOUT' },
        { name: 'Contacto', view: 'CONTACT' },
    ];

    return (
        <header className="flex flex-col w-full sticky top-0 z-50 shadow-sm">
            {/* Utility Top Bar */}
            <div className="bg-brand-dark text-white py-2 px-4 md:px-8 flex flex-col md:flex-row justify-between items-center text-[9px] md:text-[10px] uppercase tracking-[0.1em] md:tracking-[0.2em] font-medium gap-2 md:gap-0">
                <div className="flex gap-4 items-center">
                    <span className="hidden sm:inline">Envios para todo o país</span>
                    <span className="text-brand-primary">Ligue: +244 947 472 230</span>
                </div>
                <div className="flex gap-4">
                    {user ? (
                        <>
                            <span className="text-brand-primary">Olá, {user.name}</span>
                            <button onClick={onLogout} className="hover:text-brand-primary flex items-center gap-1 uppercase" title="Terminar Sessão">
                                Sair <LogOut className="w-3 h-3" />
                            </button>
                        </>
                    ) : (
                        <>
                            <button onClick={() => onNavigate('AUTH')} className="hover:text-brand-primary uppercase" title="Entrar na minha conta">Entrar</button>
                            <button onClick={() => onNavigate('AUTH')} className="hover:text-brand-primary uppercase" title="Criar uma nova conta">Registar</button>
                        </>
                    )}
                </div>
            </div>

            {/* Main Header Area */}
            <div className="bg-white py-4 md:py-6 px-4 md:px-8 flex justify-between items-center border-b border-gray-100">
                <div className="w-1/4 md:w-1/3 flex gap-4">
                    <button
                        className="md:hidden text-brand-dark"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Menu"
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                    <button
                        className="hidden md:block text-gray-400 hover:text-brand-primary transition-colors"
                        title="Pesquisar"
                        aria-label="Pesquisar livros"
                        onClick={() => setIsSearchOpen(!isSearchOpen)}
                    >
                        <Search className={`w-5 h-5 ${isSearchOpen ? 'text-brand-primary' : ''}`} />
                    </button>
                </div>

                <button
                    className="flex-1 md:w-1/3 flex flex-col items-center cursor-pointer hover:scale-105 transition-transform duration-300"
                    onClick={() => onNavigate('HOME')}
                    title="Editora Graça - Ir para o Início"
                    aria-label="Voltar à página inicial"
                >
                    <img src={logo} alt="Editora Graça" className="h-12 md:h-16 w-auto object-contain" />
                </button>

                <div className="w-1/4 md:w-1/3 flex justify-end gap-3 md:gap-6 items-center">
                    <button
                        onClick={() => {
                            if (!user) {
                                onNavigate('AUTH');
                            } else {
                                const dashboardView = user.role === 'adm' ? 'ADMIN' :
                                    (user.role === 'autor' ? 'AUTHOR_DASHBOARD' : 'READER_DASHBOARD');
                                onNavigate(dashboardView);
                            }
                        }}
                        className="text-brand-dark hover:text-brand-primary transition-colors flex items-center gap-2 group"
                        title="Ver o meu painel"
                    >
                        <User className="w-5 h-5" />
                        <span className="hidden lg:block text-[10px] font-bold uppercase tracking-widest text-gray-400 group-hover:text-brand-primary transition-colors">
                            {user ? 'A minha conta' : 'Entrar'}
                        </span>
                    </button>

                    <button className="hidden sm:block text-brand-dark hover:text-brand-primary transition-colors relative" title="Favoritos" aria-label="Ver favoritos">
                        <Heart className="w-5 h-5" />
                    </button>

                    <div className="relative">
                        <button
                            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                            className="text-brand-dark hover:text-brand-primary transition-colors relative group"
                            title="Notificações"
                            aria-label="Ver notificações"
                        >
                            <Bell className="w-5 h-5" />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                    {unreadCount}
                                </span>
                            )}
                        </button>

                        {isNotificationsOpen && (
                            <div className="absolute right-0 mt-4 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-[100] animate-in slide-in-from-top-2 duration-200 overflow-hidden">
                                <div className="p-4 border-b border-gray-50 flex items-center justify-between">
                                    <h4 className="font-black text-brand-dark uppercase tracking-widest text-xs">Notificações</h4>
                                    <button className="text-[10px] text-brand-primary font-bold hover:underline">Marcar todas como lidas</button>
                                </div>
                                <div className="max-h-96 overflow-y-auto">
                                    {notifications.length > 0 ? (
                                        notifications.map(n => (
                                            <div
                                                key={n.id}
                                                onClick={() => {
                                                    handleMarkRead(n.id);
                                                    if (n.link) onNavigate(n.link as any);
                                                    setIsNotificationsOpen(false);
                                                }}
                                                className={`p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-50 transition-colors ${!n.isRead ? 'bg-brand-primary/5' : ''}`}
                                            >
                                                <p className="font-bold text-brand-dark text-xs mb-1">{n.title}</p>
                                                <p className="text-gray-500 text-[11px] leading-tight mb-2">{n.content}</p>
                                                <span className="text-[9px] text-gray-400">{new Date(n.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-8 text-center">
                                            <Bell className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                                            <p className="text-xs text-gray-400 font-medium italic">Nenhuma notificação por agora.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <button className="text-brand-dark hover:text-brand-primary transition-colors relative group" onClick={() => onNavigate('CHECKOUT')}>
                        <ShoppingBag className="w-5 h-5" />
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-brand-primary text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                                {cartCount}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {/* Search Bar Overlay */}
            {isSearchOpen && (
                <div className="bg-brand-light border-b border-gray-100 py-3 px-4 md:px-8 animate-in slide-in-from-top duration-300">
                    <form onSubmit={handleSearch} className="container mx-auto max-w-4xl relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            autoFocus
                            type="text"
                            placeholder="Pesquisar livros, autores, categorias..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-12 py-3 bg-white border border-gray-200 rounded-full text-sm focus:ring-1 focus:ring-brand-primary focus:border-brand-primary"
                        />
                        <button
                            type="button"
                            onClick={() => setIsSearchOpen(false)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-dark"
                            title="Fechar pesquisa"
                            aria-label="Fechar barra de pesquisa"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </form>
                </div>
            )}

            {/* Navigation Menu Area - Desktop */}
            <nav className="hidden md:flex bg-white py-4 px-8 justify-center border-b border-gray-50">
                <ul className="flex gap-12 font-bold text-[11px] uppercase tracking-[0.2em] text-gray-500">
                    {navLinks.map((link) => (
                        <li key={link.view}>
                            <button
                                onClick={() => onNavigate(link.view as any)}
                                className={`hover:text-brand-primary transition-colors border-b pb-1 ${currentView === link.view ? 'text-brand-primary border-brand-primary' : 'border-transparent'}`}
                            >
                                {link.name}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-b border-gray-100 animate-in slide-in-from-top duration-300">
                    <ul className="flex flex-col py-4">
                        {navLinks.map((link) => (
                            <li key={link.view}>
                                <button
                                    onClick={() => {
                                        onNavigate(link.view as any);
                                        setIsMenuOpen(false);
                                    }}
                                    className={`w-full text-left px-8 py-3 text-[11px] font-bold uppercase tracking-[0.2em] ${currentView === link.view ? 'text-brand-primary bg-brand-light' : 'text-gray-500 hover:bg-gray-50'}`}
                                >
                                    {link.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </header>
    );
};

export default Navbar;
