
import React from 'react';
import { BookOpen, PenTool, Globe, ShieldCheck } from 'lucide-react';
import { ViewState } from '../types';

interface HomePageProps {
    onNavigate: (view: ViewState) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
    return (
        <div className="animate-fade-in">
            <section className="relative h-[80vh] md:h-[90vh] flex items-center bg-brand-900 overflow-hidden text-white">
                <div className="absolute inset-0 opacity-20 paper-texture"></div>
                <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10 space-y-8 md:space-y-12">
                    <div className="space-y-4 animate-slide-up">
                        <span className="text-accent-gold font-bold uppercase tracking-[0.6em] text-[10px] block">Malanje · Angola</span>
                        <h1 className="text-5xl sm:text-7xl md:text-9xl font-serif font-bold leading-none tracking-tighter italic">Excelência<br /><span className="text-accent-gold">Editorial</span>.</h1>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
                        <button onClick={() => onNavigate('CATALOG')} className="w-full sm:w-auto px-10 md:px-16 py-5 md:py-6 bg-white text-brand-900 font-bold uppercase text-[10px] md:text-[11px] tracking-widest hover:bg-accent-gold hover:text-white transition-all shadow-2xl rounded-sm">Livraria</button>
                        <button onClick={() => onNavigate('ABOUT')} className="w-full sm:w-auto px-10 md:px-16 py-5 md:py-6 border border-white/20 text-white font-bold uppercase text-[10px] md:text-[11px] tracking-widest hover:bg-white hover:text-brand-900 transition-all rounded-sm">Sobre Nós</button>
                    </div>
                </div>
            </section>

            <section className="py-20 md:py-32 bg-white">
                <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-20">
                    {[
                        { label: "Livros", val: "150+", icon: <BookOpen /> },
                        { label: "Autores", val: "45+", icon: <PenTool /> },
                        { label: "Províncias", val: "18", icon: <Globe /> },
                        { label: "Qualidade", val: "Elite", icon: <ShieldCheck /> }
                    ].map((s, i) => (
                        <div key={i} className="text-center group">
                            <div className="w-12 h-12 md:w-16 md:h-16 bg-brand-50 rounded-full flex items-center justify-center mx-auto text-accent-gold group-hover:bg-brand-900 group-hover:text-white transition-all">{s.icon}</div>
                            <p className="text-2xl md:text-4xl font-serif font-bold text-brand-900 mt-4">{s.val}</p>
                            <p className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest">{s.label}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default HomePage;
