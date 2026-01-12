import React from 'react';
import { ShoppingBag, Search, User, Heart, LogOut } from 'lucide-react';
import { User as UserType } from '../types';

interface NavbarProps {
    onNavigate: (view: any) => void;
    currentView: string;
    cartCount: number;
    user: UserType | null;
    onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentView, cartCount, user, onLogout }) => {
    return (
        <header className="flex flex-col w-full sticky top-0 z-50 shadow-sm">
            {/* Utility Top Bar */}
            <div className="bg-brand-dark text-white py-2 px-8 flex justify-between items-center text-[10px] uppercase tracking-[0.2em] font-medium">
                <div className="flex gap-4">
                    <span>Envios para todo o país</span>
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
            <div className="bg-white py-6 px-8 flex justify-between items-center border-b border-gray-100">
                <div className="w-1/3 flex gap-4">
                    <button className="text-gray-400 hover:text-brand-primary transition-colors" title="Pesquisar" aria-label="Pesquisar livros">
                        <Search className="w-5 h-5" />
                    </button>
                </div>

                <button
                    className="w-1/3 flex flex-col items-center cursor-pointer hover:scale-105 transition-transform duration-300"
                    onClick={() => onNavigate('HOME')}
                    title="Editora Graça - Ir para o Início"
                    aria-label="Voltar à página inicial"
                >
                    <span className="font-serif text-3xl md:text-4xl font-black tracking-tighter text-brand-dark leading-none">EDITORA</span>
                    <span className="font-sans text-[11px] tracking-[0.4em] font-bold text-brand-primary uppercase -mt-1 ml-1">Graça</span>
                </button>

                <div className="w-1/3 flex justify-end gap-6 items-center">
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

                    <button className="text-brand-dark hover:text-brand-primary transition-colors relative" title="Favoritos" aria-label="Ver favoritos">
                        <Heart className="w-5 h-5" />
                    </button>

                    <button className="text-brand-dark hover:text-brand-primary transition-colors relative group">
                        <ShoppingBag className="w-5 h-5" />
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-brand-primary text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                                {cartCount}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {/* Navigation Menu Area */}
            <nav className="bg-white py-4 px-8 flex justify-center border-b border-gray-50">
                <ul className="flex gap-12 font-bold text-[11px] uppercase tracking-[0.2em] text-gray-500">
                    <li><button onClick={() => onNavigate('HOME')} className={`hover:text-brand-primary transition-colors border-b pb-1 ${currentView === 'HOME' ? 'text-brand-primary border-brand-primary' : 'border-transparent'}`}>Início</button></li>
                    <li><button onClick={() => onNavigate('CATALOG')} className={`hover:text-brand-primary transition-colors border-b pb-1 ${currentView === 'CATALOG' ? 'text-brand-primary border-brand-primary' : 'border-transparent'}`}>Catálogo</button></li>
                    <li><button onClick={() => onNavigate('ABOUT')} className={`hover:text-brand-primary transition-colors border-b pb-1 ${currentView === 'ABOUT' ? 'text-brand-primary border-brand-primary' : 'border-transparent'}`}>Sobre Nós</button></li>
                    <li><button onClick={() => onNavigate('SERVICES')} className={`hover:text-brand-primary transition-colors border-b pb-1 ${currentView === 'SERVICES' ? 'text-brand-primary border-brand-primary' : 'border-transparent'}`}>Serviços</button></li>
                    <li><button onClick={() => onNavigate('CONTACT')} className={`hover:text-brand-primary transition-colors border-b pb-1 ${currentView === 'CONTACT' ? 'text-brand-primary border-brand-primary' : 'border-transparent'}`}>Contacto</button></li>
                </ul>
            </nav>
        </header>
    );
};

export default Navbar;
