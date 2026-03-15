import React, { useState, useEffect } from 'react';
import logo from '../assets/imagens/logo.png';
import { Facebook, Instagram, Twitter, Linkedin, Heart, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getInstagramPosts, InstagramPost } from '../services/instagramService';

const Footer: React.FC = () => {
    return (
        <footer className="bg-brand-dark text-white pt-12 sm:pt-16 md:pt-24 pb-8 sm:pb-12 border-t border-white/5 font-sans safe-area-bottom">
            <div className="container mx-auto px-4 sm:px-6 md:px-12">

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-12 mb-12 sm:mb-20">
                    {/* Brand Column */}
                    <div className="md:col-span-4 space-y-8">
                        <div className="flex items-center gap-3">
                            <img src={logo} alt="Editora Graça" className="h-10 w-auto brightness-0 invert" />
                            <span className="font-serif font-black text-2xl tracking-tight uppercase">EDITORA <span className="text-brand-primary">GRAÇA</span></span>
                        </div>
                        <p className="text-gray-400 leading-relaxed max-w-sm font-medium">
                            EDITORA GRAÇA (SU), LDA | NIF 5002078139<br />
                            Malanje, Bairro Voanvala, rua 5, casa n.º 77
                        </p>
                        <div className="flex gap-4">
                            <a href="https://www.instagram.com/editoragraca" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-primary transition-colors">
                                <Instagram className="w-4 h-4" />
                            </a>
                            <a href="https://web.facebook.com/gracepu47" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-primary transition-colors">
                                <Facebook className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Links Grid */}
                    <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
                        {[
                            { title: "Empresa", links: [{ l: "Sobre Nós", p: "/sobre" }, { l: "Portefólio", p: "/projetos" }, { l: "Carreiras", p: "#" }, { l: "Imprensa", p: "#" }, { l: "Contactos", p: "/contacto" }] },
                            { title: "Catálogo", links: [{ l: "Lançamentos", p: "/livros" }, { l: "Mais Vendidos", p: "/livros" }, { l: "E-books", p: "/livros?tipo=digital" }, { l: "Autores", p: "/sobre" }] },
                            { title: "Suporte", links: [{ l: "A Minha Conta", p: "/login" }, { l: "Envios", p: "#" }, { l: "Devoluções", p: "#" }, { l: "FAQ", p: "#" }] },
                            { title: "Legal", links: [{ l: "Privacidade", p: "#" }, { l: "Termos", p: "#" }, { l: "Cookies", p: "#" }, { l: "Licenças", p: "#" }] }
                        ].map((col, idx) => (
                            <div key={idx}>
                                <h4 className="font-black text-white uppercase tracking-widest text-sm mb-6">{col.title}</h4>
                                <ul className="space-y-4">
                                    {col.links.map(link => (
                                        <li key={link.l}>
                                            <Link to={link.p} className="text-gray-400 hover:text-white transition-colors text-sm font-medium flex items-center gap-2 group">
                                                <span className="w-0 overflow-hidden group-hover:w-3 transition-all duration-300 opacity-0 group-hover:opacity-100 text-brand-primary">
                                                    <ArrowRight className="w-3 h-3" />
                                                </span>
                                                {link.l}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-6 sm:pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-gray-500 text-center md:text-left">
                    <p>&copy; {new Date().getFullYear()} Editora Graça. Todos os direitos reservados.</p>
                    <div className="flex items-center gap-2">
                        <span>desenvolvida por</span>
                        <a href="https://ibuka47.com" target="_blank" rel="noopener noreferrer" className="font-bold text-brand-primary hover:text-white transition-colors">
                            ibuka47
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
