
import React from 'react';
import SectionHeader from '../components/SectionHeader';

const ServicesPage: React.FC = () => {
    return (
        <div className="py-16 md:py-32 max-w-7xl mx-auto px-4 md:px-6 animate-fade-in">
            <SectionHeader title="Nossos Serviços" subtitle="Excelência Editorial" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                    { title: "Revisão e Edição", desc: "Aperfeiçoamos o seu texto mantendo a sua voz original." },
                    { title: "Diagramação", desc: "Design interior profissional para livros físicos e digitais." },
                    { title: "Design de Capa", desc: "Capas que capturam a essência da sua obra." },
                    { title: "Registos (ISBN/NIF)", desc: "Tratamos de toda a burocracia legal para a sua obra." },
                    { title: "Impressão", desc: "Parcerias com as melhores gráficas para alta qualidade." },
                    { title: "Publicidade", desc: "Marketing literário para dar visibilidade ao seu livro." }
                ].map((s, i) => (
                    <div key={i} className="bg-white p-8 rounded-3xl border border-brand-100 shadow-sm hover:border-accent-gold transition-colors">
                        <h4 className="font-serif font-bold text-xl text-brand-900 mb-4">{s.title}</h4>
                        <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ServicesPage;
