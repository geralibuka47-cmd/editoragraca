import React from 'react';
import logo from '../assets/imagens/logo.png';
import { ShoppingBag, Search, User, Heart, LogOut, Menu, X } from 'lucide-react';
import { User as UserType } from '../types';

interface NavbarProps {
    onNavigate: (view: any) => void;
    currentView: string;
    cartCount: number;
    user: UserType | null;
    onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentView, cartCount, user, onLogout }) => {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    const navLinks = [
        { name: 'Início', view: 'HOME' },
        { name: 'Catálogo', view: 'CATALOG' },
        { name: 'Sobre Nós', view: 'ABOUT' },
        { name: 'Serviços', view: 'SERVICES' },
        { name: 'Podcast', view: 'PODCAST' },
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
                    <button className="hidden md:block text-gray-400 hover:text-brand-primary transition-colors" title="Pesquisar" aria-label="Pesquisar livros">
                        <Search className="w-5 h-5" />
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

            {/* Navigation Menu Area - Desktop */}
            <nav className="hidden md:flex bg-white py-4 px-8 justify-center border-b border-gray-50">
                <ul className="flex gap-12 font-bold text-[11px] uppercase tracking-[0.2em] text-gray-500">
                    {navLinks.map((link) => (
                        <li key={link.view}>
                            <button
                                onClick={() => onNavigate(link.view as any)}
                                className={`hover: text - brand - primary transition - colors border - b pb - 1 ${currentView === link.view ? 'text-brand-primary border-brand-primary' : 'border-transparent'} `}
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
                                    className={`w - full text - left px - 8 py - 3 text - [11px] font - bold uppercase tracking - [0.2em] ${currentView === link.view ? 'text-brand-primary bg-brand-light' : 'text-gray-500 hover:bg-gray-50'} `}
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
