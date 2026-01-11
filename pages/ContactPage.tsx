
import React from 'react';
import SectionHeader from '../components/SectionHeader';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const ContactPage: React.FC = () => {
    return (
        <div className="py-16 md:py-32 max-w-7xl mx-auto px-4 md:px-6 animate-fade-in">
            <SectionHeader title="Contacte-nos" subtitle="Estamos Perto de Si" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20">
                <div className="space-y-10">
                    <p className="text-lg text-gray-500 font-light leading-relaxed">
                        Tem um manuscrito ou quer saber mais sobre as nossas obras? A nossa equipa está pronta para o receber em Malanje ou responder digitalmente.
                    </p>
                    <div className="space-y-6">
                        {[
                            { icon: <Mail />, label: "E-mail", val: "geraleditoragraca@gmail.com" },
                            { icon: <Phone />, label: "Telefones", val: "+244 973 038 386 / 947 472 230" },
                            { icon: <MapPin />, label: "Endereço", val: "Malanje, Voanvala, Rua 5, 77" }
                        ].map((c, i) => (
                            <div key={i} className="flex gap-6 items-start">
                                <div className="w-12 h-12 bg-brand-50 rounded-2xl flex items-center justify-center text-accent-gold shrink-0">{c.icon}</div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{c.label}</p>
                                    <p className="text-brand-900 font-bold">{c.val}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-brand-100 shadow-xl">
                    <form className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2"><label className="text-[10px] font-bold text-gray-400 uppercase ml-4">Nome</label><input type="text" className="w-full bg-brand-50 p-4 rounded-2xl outline-none focus:ring-1 focus:ring-accent-gold text-sm" placeholder="O seu nome" /></div>
                            <div className="space-y-2"><label className="text-[10px] font-bold text-gray-400 uppercase ml-4">E-mail</label><input type="email" className="w-full bg-brand-50 p-4 rounded-2xl outline-none focus:ring-1 focus:ring-accent-gold text-sm" placeholder="seu@email.ao" /></div>
                        </div>
                        <div className="space-y-2"><label className="text-[10px] font-bold text-gray-400 uppercase ml-4">Assunto</label><input type="text" className="w-full bg-brand-50 p-4 rounded-2xl outline-none focus:ring-1 focus:ring-accent-gold text-sm" placeholder="Como podemos ajudar?" /></div>
                        <div className="space-y-2"><label className="text-[10px] font-bold text-gray-400 uppercase ml-4">Mensagem</label><textarea rows={4} className="w-full bg-brand-50 p-4 rounded-2xl outline-none focus:ring-1 focus:ring-accent-gold text-sm" placeholder="Escreva aqui a sua mensagem..."></textarea></div>
                        <button className="w-full py-5 bg-brand-900 text-white font-bold uppercase text-[10px] tracking-widest rounded-2xl shadow-xl hover:bg-accent-gold transition-all flex items-center justify-center gap-3">
                            <Send size={16} /> Enviar Mensagem
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
