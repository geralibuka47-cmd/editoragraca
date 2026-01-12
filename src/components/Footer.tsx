import React from 'react';
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone } from 'lucide-react';
import { ViewState } from '../types';

interface FooterProps {
    onNavigate: (view: ViewState) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
    return (
        <footer className="bg-brand-dark text-white pt-20 pb-10">
            <div className="container mx-auto px-8 grid md:grid-cols-4 gap-12 border-b border-white/5 pb-16 mb-10">
                <div className="space-y-6">
                    <div className="flex flex-col">
                        <span className="font-serif text-2xl font-bold tracking-tighter text-white">EDITORA</span>
                        <span className="font-sans text-[10px] tracking-[0.3em] font-bold text-brand-primary uppercase -mt-1">Graça</span>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed font-medium">
                        Dedicados à publicação de obras literárias de excelência em Angola. Fomentando a cultura e o conhecimento através das letras.
                    </p>
                    <div className="flex gap-4">
                        <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-brand-primary transition-colors duration-300" title="Facebook" aria-label="Seguir no Facebook">
                            <Facebook className="w-4 h-4" />
                        </a>
                        <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-brand-primary transition-colors duration-300" title="Instagram" aria-label="Seguir no Instagram">
                            <Instagram className="w-4 h-4" />
                        </a>
                        <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-brand-primary transition-colors duration-300" title="Twitter" aria-label="Seguir no Twitter">
                            <Twitter className="w-4 h-4" />
                        </a>
                    </div>
                </div>

                <div>
                    <h4 className="font-serif text-xl font-bold mb-8 text-brand-primary italic">Navegação</h4>
                    <ul className="space-y-4 text-sm text-gray-400 font-medium">
                        <li><button onClick={() => onNavigate('HOME')} className="hover:text-white transition-colors">Início</button></li>
                        <li><button onClick={() => onNavigate('CATALOG')} className="hover:text-white transition-colors">Todos os Livros</button></li>
                        <li><button onClick={() => onNavigate('CATALOG')} className="hover:text-white transition-colors">Lançamentos</button></li>
                        <li><button onClick={() => onNavigate('CATALOG')} className="hover:text-white transition-colors">Promoções</button></li>
                        <li><button onClick={() => onNavigate('ABOUT')} className="hover:text-white transition-colors">Sobre a Editora</button></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-serif text-xl font-bold mb-8 text-brand-primary italic">Informações</h4>
                    <ul className="space-y-4 text-sm text-gray-400 font-medium">
                        <li><button onClick={() => onNavigate('SERVICES')} className="hover:text-white transition-colors">Termos e Condições</button></li>
                        <li><button onClick={() => onNavigate('SERVICES')} className="hover:text-white transition-colors">Política de Privacidade</button></li>
                        <li><button onClick={() => onNavigate('SERVICES')} className="hover:text-white transition-colors">Envios e Devoluções</button></li>
                        <li><button onClick={() => onNavigate('SERVICES')} className="hover:text-white transition-colors">Perguntas Frequentes</button></li>
                        <li><button onClick={() => onNavigate('CONTACT')} className="hover:text-white transition-colors">Trabalhe Connosco</button></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-serif text-xl font-bold mb-8 text-brand-primary italic">Atendimento</h4>
                    <ul className="space-y-6 text-sm text-gray-400 font-medium">
                        <li className="flex gap-4 items-start">
                            <MapPin className="w-5 h-5 text-brand-primary shrink-0" />
                            <span>Malanje, Bairro Voanvala, <br />Rua 5, Casa n.º 77, Angola</span>
                        </li>
                        <li className="flex gap-4 items-center">
                            <Phone className="w-5 h-5 text-brand-primary shrink-0" />
                            <span>+244 973 038 386</span>
                        </li>
                        <li className="flex gap-4 items-center">
                            <Mail className="w-5 h-5 text-brand-primary shrink-0" />
                            <span>geraleditoragraca@gmail.com</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="container mx-auto px-8 flex justify-between items-center text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                <p>© 2026 Editora Graça (SU), LDA. Todos os direitos reservados.</p>
                <div className="flex gap-6">
                    <span>Feito por ibuka47</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
