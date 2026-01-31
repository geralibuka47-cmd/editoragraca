import React from 'react';
import logo from '../assets/imagens/logo.png';
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone } from 'lucide-react';
import { ViewState } from '../types';

interface FooterProps {
    onNavigate: (view: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
    return (
        <footer className="bg-brand-dark text-white pt-24 pb-12 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-primary/5 blur-[100px] rounded-full -mb-48 -mr-48"></div>
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

            <div className="container mx-auto px-6 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
                    <div className="space-y-8">
                        <div className="flex flex-col">
                            <img src={logo} alt="Editora Graça" className="h-14 w-auto object-contain brightness-0 invert mb-2" />
                            <div className="w-12 h-1 bg-brand-primary rounded-full"></div>
                        </div>
                        <p className="text-gray-400 text-base md:text-lg leading-relaxed font-medium">
                            Dedicados à publicação de obras literárias de excelência. Fomentando a cultura e o conhecimento através das letras.
                        </p>
                        <div className="flex gap-4">
                            {[
                                { Icon: Facebook, label: 'Facebook' },
                                { Icon: Instagram, label: 'Instagram' },
                                { Icon: Twitter, label: 'Twitter' }
                            ].map(({ Icon, label }) => (
                                <a
                                    key={label}
                                    href="#"
                                    className="w-12 h-12 glass-premium rounded-2xl flex items-center justify-center hover:bg-brand-primary hover:text-white transition-all duration-500 group shadow-lg"
                                    title={label}
                                    aria-label={`Seguir no ${label}`}
                                >
                                    <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-gradient-gold font-black mb-8 md:mb-10 uppercase tracking-widest text-[10px] md:text-[11px]">Navegação Rápida</h4>
                        <ul className="space-y-5">
                            {[
                                { label: 'Início', path: '/' },
                                { label: 'Catálogo Literário', path: '/livros' },
                                { label: 'Nossa Jornada', path: '/sobre' },
                                { label: 'Artigos & Críticas', path: '/blog' },
                                { label: 'Espaço do Autor', path: '/servicos' }
                            ].map(item => (
                                <li key={item.label}>
                                    <button
                                        onClick={() => onNavigate(item.path)}
                                        className="text-gray-400 hover:text-white transition-all text-sm font-bold flex items-center gap-3 group"
                                    >
                                        <span className="w-0 h-0.5 bg-brand-primary group-hover:w-4 transition-all duration-300"></span>
                                        {item.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-gradient-gold font-black mb-8 md:mb-10 uppercase tracking-widest text-[10px] md:text-[11px]">Legal & Suporte</h4>
                        <ul className="space-y-5">
                            {[
                                { label: 'Termos de Serviço', path: '/servicos' },
                                { label: 'Privacidade de Dados', path: '/servicos' },
                                { label: 'Políticas de Envio', path: '/servicos' },
                                { label: 'Dúvidas Frequentes', path: '/servicos' },
                                { label: 'Seja um Franqueado', path: '/contacto' }
                            ].map(item => (
                                <li key={item.label}>
                                    <button
                                        onClick={() => onNavigate(item.path)}
                                        className="text-gray-400 hover:text-white transition-all text-sm font-bold flex items-center gap-3 group"
                                    >
                                        <span className="w-0 h-0.5 bg-brand-primary group-hover:w-4 transition-all duration-300"></span>
                                        {item.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-gradient-gold font-black mb-8 md:mb-10 uppercase tracking-widest text-[10px] md:text-[11px]">Sede Administrativa</h4>
                        <ul className="space-y-8">
                            <li className="flex gap-5 items-start">
                                <div className="w-12 h-12 glass-premium rounded-2xl flex items-center justify-center shrink-0 text-brand-primary shadow-lg">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div className="text-sm font-bold text-gray-400 leading-relaxed">
                                    Bairro Voanvala, Rua 5, <br />
                                    Casa n.º 77, Malanje, Angola
                                </div>
                            </li>
                            <li className="flex gap-5 items-center">
                                <div className="w-12 h-12 glass-premium rounded-2xl flex items-center justify-center shrink-0 text-brand-primary shadow-lg">
                                    <Phone className="w-5 h-5" />
                                </div>
                                <div className="text-sm font-bold text-gray-400">+244 973 038 386</div>
                            </li>
                            <li className="flex gap-5 items-center">
                                <div className="w-12 h-12 glass-premium rounded-2xl flex items-center justify-center shrink-0 text-brand-primary shadow-lg">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div className="text-sm font-bold text-gray-400 truncate">geraleditoragraca@gmail.com</div>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">
                        © 2026 <span className="text-white">Editora Graça (SU), LDA</span>. Desenvolvido com excelência por ibuka47
                    </div>

                    <div className="flex gap-8 items-center">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">Sistemas Operacionais</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
