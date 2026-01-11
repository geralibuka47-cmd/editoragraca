
import React from 'react';
import { Facebook, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-brand-900 text-white py-16 md:py-32 mt-20">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 md:gap-24">
                <div className="space-y-6 md:space-y-8">
                    <h2 className="font-serif font-bold text-3xl">Editora Graça</h2>
                    <p className="text-gray-500 text-sm leading-relaxed font-serif italic max-w-xs">Eleve o seu potencial literário com a editora líder em Malanje. Qualidade e tradição ao seu serviço.</p>
                    <div className="flex gap-4">
                        <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-accent-gold transition-all cursor-pointer"><Facebook size={18} /></div>
                        <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-accent-gold transition-all cursor-pointer"><Instagram size={18} /></div>
                    </div>
                </div>
                <div className="space-y-6">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-accent-gold">Sede Oficial</p>
                    <div className="space-y-4 text-xs text-gray-400 font-bold uppercase tracking-widest">
                        <p>geraleditoragraca@gmail.com</p>
                        <p>+244 973 038 386 | 947 472 230</p>
                        <p>Malanje, Voanvala, Rua 5, 77</p>
                    </div>
                </div>
                <div className="space-y-6 lg:text-right">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-accent-gold">Direcção</p>
                    <p className="text-sm font-serif italic">António Graça Muondo Mendonça</p>
                    <p className="text-[8px] text-gray-600 tracking-[0.5em] mt-12 md:mt-24 uppercase">© {new Date().getFullYear()} EDITORA GRAÇA (SU), LDA.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
