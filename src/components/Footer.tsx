import React, { useState, useEffect } from 'react';
import logo from '../assets/imagens/logo.png';
import { Facebook, Instagram, Twitter, Linkedin, Heart, ArrowRight, Loader2 } from 'lucide-react';
import { getInstagramPosts, InstagramPost } from '../services/instagramService';

const Footer: React.FC = () => {
    return (
        <footer className="bg-brand-dark text-white pt-24 pb-12 border-t border-white/5 font-sans">
            <div className="container mx-auto px-6 md:px-12">

                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">
                    {/* Brand Column */}
                    <div className="md:col-span-4 space-y-8">
                        <div className="flex items-center gap-3">
                            <img src={logo} alt="Editora Graça" className="h-10 w-auto brightness-0 invert" />
                            <span className="font-serif font-black text-2xl tracking-tight uppercase">EDITORA <span className="text-brand-primary">GRAÇA</span></span>
                        </div>
                        <p className="text-gray-400 leading-relaxed max-w-sm font-medium">
                            Elevando a literatura angolana ao mundo. Obras de excelência para leitores exigentes.
                        </p>
                        <div className="flex gap-4">
                            {[Instagram, Facebook, Twitter, Linkedin].map((Icon, i) => (
                                <a key={i} href="#" aria-label={`Visitar nosso ${['Instagram', 'Facebook', 'Twitter', 'LinkedIn'][i]}`} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-primary transition-colors">
                                    <Icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links Grid */}
                    <div className="md:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { title: "Empresa", links: ["Sobre Nós", "Projetos", "Carreiras", "Imprensa", "Contactos"] },
                            { title: "Catálogo", links: ["Lançamentos", "Mais Vendidos", "eBooks", "Autores"] },
                            { title: "Suporte", links: ["Minha Conta", "Envios", "Devoluções", "FAQ"] },
                            { title: "Legal", links: ["Privacidade", "Termos", "Cookies", "Licenças"] }
                        ].map((col, idx) => (
                            <div key={idx}>
                                <h4 className="font-black text-white uppercase tracking-widest text-sm mb-6">{col.title}</h4>
                                <ul className="space-y-4">
                                    {col.links.map(link => (
                                        <li key={link}>
                                            <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm font-medium flex items-center gap-2 group">
                                                <span className="w-0 overflow-hidden group-hover:w-3 transition-all duration-300 opacity-0 group-hover:opacity-100 text-brand-primary">
                                                    <ArrowRight className="w-3 h-3" />
                                                </span>
                                                {link}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold uppercase tracking-widest text-gray-500">
                    <p>&copy; {new Date().getFullYear()} Editora Graça. Todos os direitos reservados.</p>
                    <div className="flex items-center gap-2">
                        <span>Feito com</span>
                        <Heart className="w-3 h-3 text-brand-primary fill-current" />
                        <span>em Angola</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
