
import React from 'react';
import SectionHeader from '../components/SectionHeader';

const AboutPage: React.FC = () => (
    <div className="py-12 md:py-20 animate-fade-in px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
            <SectionHeader title="Nossa História" subtitle="Desde Malanje para o Mundo" />
            <div className="space-y-8 md:space-y-12 text-base md:text-lg text-gray-600 leading-relaxed font-light">
                <p>A <span className="text-brand-900 font-bold">Editora Graça (SU), LDA</span> nasceu da visão do seu fundador, António Graça Muondo Mendonça, em proporcionar uma plataforma digna para as vozes literárias de Angola, com especial foco na província de Malanje.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-12 py-6 md:py-10">
                    <div className="bg-brand-50 p-8 md:p-10 rounded-3xl border border-brand-100">
                        <h4 className="font-serif font-bold text-xl md:text-2xl text-brand-900 mb-4">Missão</h4>
                        <p className="text-sm">Promover a cultura angolana através de publicações de alta qualidade técnica e editorial, descentralizando a produção literária.</p>
                    </div>
                    <div className="bg-brand-50 p-8 md:p-10 rounded-3xl border border-brand-100">
                        <h4 className="font-serif font-bold text-xl md:text-2xl text-brand-900 mb-4">Visão</h4>
                        <p className="text-sm">Ser a editora de referência no norte de Angola e uma das mais prestigiadas do país pela inovação e excelência dos seus autores.</p>
                    </div>
                </div>
                <p>Estamos localizados no Bairro Voanvala, em Malanje, onde mantemos um centro de criação e revisão que serve como ponto de encontro para a nova geração de intelectuais angolanos.</p>
                <div className="relative h-64 md:h-80 overflow-hidden rounded-[2rem] md:rounded-[3rem] shadow-xl">
                    <img src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover" alt="Livraria" />
                </div>
            </div>
        </div>
    </div>
);

export default AboutPage;
