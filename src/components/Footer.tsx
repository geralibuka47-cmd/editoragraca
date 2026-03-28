import React from 'react';
import logo from '../assets/imagens/logo.png';
import { Facebook, Instagram, Linkedin, Home, BookOpen, Info, Briefcase, Mail, User, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FooterProps {
    content?: Record<string, any>;
}

const NAV_ICONS = [
    { Icon: Home, label: 'Início', to: '/' },
    { Icon: BookOpen, label: 'Catálogo', to: '/livros' },
    { Icon: Info, label: 'Sobre', to: '/sobre' },
    { Icon: Briefcase, label: 'Serviços', to: '/servicos' },
    { Icon: Mail, label: 'Contacto', to: '/contacto' },
    { Icon: User, label: 'Conta', to: '/login' },
    { Icon: ShoppingBag, label: 'Carrinho', to: '/carrinho' },
];

const Footer: React.FC<FooterProps> = ({ content = {} }) => {
    const social = content['social.links'] || {};
    const year = new Date().getFullYear();

    return (
        <footer className="bg-brand-dark text-white border-t border-white/5 font-sans safe-area-bottom">
            <div className="container mx-auto px-4 sm:px-6 md:px-12 py-8 sm:py-10">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 shrink-0">
                        <img src={logo} alt="Editora Graça" className="h-8 w-auto brightness-0 invert opacity-80 hover:opacity-100 transition-opacity" />
                        <span className="font-serif font-black text-lg tracking-tight uppercase hidden sm:inline">
                            Editora <span className="text-brand-primary">Graça</span>
                        </span>
                    </Link>

                    {/* Icon Navigation */}
                    <nav className="flex items-center gap-1 sm:gap-2" aria-label="Navegação principal">
                        {NAV_ICONS.map(({ Icon, label, to }) => (
                            <Link
                                key={to}
                                to={to}
                                title={label}
                                aria-label={label}
                                className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/5 transition-all group relative"
                            >
                                <Icon className="w-4 h-4" />
                                {/* Tooltip */}
                                <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-white/10 backdrop-blur-md text-white text-[10px] font-bold rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                    {label}
                                </span>
                            </Link>
                        ))}
                    </nav>

                    {/* Social + Copyright */}
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        {/* Social icons */}
                        <div className="flex items-center gap-2">
                            {social.instagram && (
                                <a href={social.instagram} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-primary transition-colors" aria-label="Instagram">
                                    <Instagram className="w-3.5 h-3.5" />
                                </a>
                            )}
                            {social.facebook && (
                                <a href={social.facebook} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-primary transition-colors" aria-label="Facebook">
                                    <Facebook className="w-3.5 h-3.5" />
                                </a>
                            )}
                            {social.linkedin && (
                                <a href={social.linkedin} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-primary transition-colors" aria-label="LinkedIn">
                                    <Linkedin className="w-3.5 h-3.5" />
                                </a>
                            )}
                        </div>

                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600">
                            © {year} Editora Graça · <a href="https://ibuka47.com" target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:text-white transition-colors">ibuka47</a>
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
