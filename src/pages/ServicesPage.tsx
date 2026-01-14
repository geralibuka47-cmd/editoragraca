import React, { useState, useEffect } from 'react';
import { BookOpen, Pencil, Palette, Shield, Megaphone, Printer, Check, ArrowRight, Loader2 } from 'lucide-react';
import { ViewState, EditorialService } from '../types';
import { getEditorialServices, getSiteContent } from '../services/dataService';

interface ServicesPageProps {
    onNavigate: (view: ViewState) => void;
}

const ServicesPage: React.FC<ServicesPageProps> = ({ onNavigate }) => {
    const [services, setServices] = useState<EditorialService[]>([]);
    const [siteContent, setSiteContent] = useState<any>({});
    const [isLoading, setIsLoading] = useState(true);

    const FALLBACK_SERVICES: (EditorialService & { icon: any })[] = [
        {
            id: 'f-1',
            icon: Pencil,
            title: 'Revisão e Edição de Texto',
            price: 'Desde 15.000 Kz',
            details: [
                'Correção ortográfica e gramatical',
                'Adequação ao acordo ortográfico',
                'Sugestões de melhoria estilística',
                'Revisão de coerência e coesão',
                'Até 2 rondas de revisão'
            ]
        },
        {
            id: 'f-2',
            icon: BookOpen,
            title: 'Diagramação Profissional',
            price: 'Desde 20.000 Kz',
            details: [
                'Design de páginas interno',
                'Tipografia profissional',
                'Formatação de capítulos',
                'Inclusão de imagens e gráficos',
                'Arquivo pronto para impressão'
            ]
        },
        {
            id: 'f-3',
            icon: Palette,
            title: 'Design de Capa',
            price: 'Desde 25.000 Kz',
            details: [
                'Design exclusivo e original',
                'Até 3 propostas de capa',
                'Revisões ilimitadas',
                'Capa + lombada + contracapa',
                'Arquivos em alta resolução'
            ]
        }
    ];

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const [servicesData, content] = await Promise.all([
                    getEditorialServices(),
                    getSiteContent('services')
                ]);
                setServices(servicesData.length > 0 ? servicesData : FALLBACK_SERVICES as any);
                setSiteContent(content);
            } catch (error) {
                console.error("Erro ao carregar dados dos serviços:", error);
                setServices(FALLBACK_SERVICES as any);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    const getIcon = (title: string) => {
        const lowerTitle = title.toLowerCase();
        if (lowerTitle.includes('revisão') || lowerTitle.includes('edição') || lowerTitle.includes('texto')) return Pencil;
        if (lowerTitle.includes('diagramação') || lowerTitle.includes('layout')) return BookOpen;
        if (lowerTitle.includes('capa') || lowerTitle.includes('design')) return Palette;
        if (lowerTitle.includes('registo') || lowerTitle.includes('legal')) return Shield;
        if (lowerTitle.includes('marketing') || lowerTitle.includes('publicidade')) return Megaphone;
        if (lowerTitle.includes('impressão') || lowerTitle.includes('distribuição')) return Printer;
        return BookOpen;
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-brand-light flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-brand-primary animate-spin mx-auto mb-4" />
                    <p className="font-serif text-xl font-bold text-brand-dark italic">Preparando os nossos serviços...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brand-light">
            {/* Hero */}
            <section className="bg-brand-dark text-white py-20">
                <div className="container mx-auto px-8 border-b border-white/5 pb-20">
                    <div className="flex items-center gap-2 text-sm text-brand-primary uppercase tracking-widest font-bold mb-6">
                        <button onClick={() => onNavigate('HOME')} className="hover:underline">Início</button>
                        <span>/</span>
                        <span>Serviços</span>
                    </div>

                    <div className="max-w-4xl">
                        <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 leading-none">
                            {siteContent['hero.title'] || "Serviços"} <span className="text-brand-primary italic font-serif font-normal">{siteContent['hero.subtitle'] || "Editoriais"}</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-300 leading-relaxed font-medium mb-12 max-w-2xl">
                            {siteContent['hero.description'] || "Transformamos manuscritos em obras publicadas com excelência profissional. Oferecemos soluções completas para autores independentes."}
                        </p>
                        <button
                            onClick={() => onNavigate('CONTACT')}
                            className="bg-brand-primary text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-white hover:text-brand-dark transition-all duration-300 shadow-2xl flex items-center gap-4 group"
                        >
                            Solicitar Orçamento
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                        </button>
                    </div>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-24">
                <div className="container mx-auto px-8">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <div className="inline-flex items-center gap-3 px-5 py-2 bg-brand-primary/10 rounded-full mb-8">
                            <span className="w-2 h-2 bg-brand-primary rounded-full animate-pulse"></span>
                            <span className="text-brand-primary font-black tracking-[0.2em] uppercase text-xs">Expor seu Talento</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-brand-dark tracking-tighter mb-8">
                            Soluções <span className="text-brand-primary italic font-serif font-normal underline underline-offset-8 decoration-brand-primary/20">Sob Medida</span>
                        </h2>
                        <p className="text-xl text-gray-500 font-medium">
                            Da primeira linha à prateleira, cuidamos de cada detalhe técnico da sua publicação.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {services.map((service, index) => {
                            const Icon = (service as any).icon || getIcon(service.title);
                            return (
                                <div
                                    key={service.id || index}
                                    className="bg-white rounded-[2.5rem] shadow-2xl hover:shadow-brand-primary/10 transition-all duration-500 overflow-hidden group flex flex-col border border-gray-100"
                                >
                                    <div className="p-10 flex-1 flex flex-col">
                                        <div className="w-20 h-20 bg-brand-primary/5 rounded-3xl flex items-center justify-center mb-10 group-hover:bg-brand-primary group-hover:rotate-6 transition-all duration-500">
                                            <Icon className="w-10 h-10 text-brand-primary group-hover:text-white transition-colors" />
                                        </div>

                                        <h3 className="text-3xl font-black text-brand-dark mb-4 tracking-tighter">{service.title}</h3>
                                        <div className="text-2xl font-black text-brand-primary mb-10 pb-10 border-b border-gray-50">{service.price}</div>

                                        <div className="space-y-4 mb-10 flex-1">
                                            {service.details.map((feature, idx) => (
                                                <div key={idx} className="flex items-start gap-4">
                                                    <div className="w-6 h-6 bg-green-50 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                                                        <Check className="w-4 h-4 text-green-600" />
                                                    </div>
                                                    <span className="text-gray-600 font-medium">{feature}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <button
                                            onClick={() => onNavigate('CONTACT')}
                                            className="w-full px-8 py-5 bg-brand-dark text-white rounded-2xl font-black hover:bg-brand-primary transition-all duration-300 uppercase text-xs tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-95"
                                        >
                                            Solicitar Agora
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 bg-brand-dark text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-brand-primary/5 pattern-grid-white opacity-10"></div>
                <div className="container mx-auto px-8 text-center relative z-10">
                    <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-8 italic font-serif">
                        {siteContent['cta.title'] || "Transforme o seu Sonho em Realidade"}
                    </h2>
                    <p className="text-xl text-white/70 mb-12 max-w-2xl mx-auto font-medium">
                        {siteContent['cta.description'] || "Não deixe o seu manuscrito guardado. A Editora Graça ajuda-te a ser o próximo autor de sucesso em Angola."}
                    </p>
                    <button
                        onClick={() => onNavigate('CONTACT')}
                        className="px-16 py-6 bg-white text-brand-primary font-black rounded-2xl hover:bg-brand-primary hover:text-white transition-all duration-300 text-sm uppercase tracking-[0.3em] shadow-2xl hover:scale-105 active:scale-95 translate-y-0"
                    >
                        Conversar com a Equipa
                    </button>
                </div>
            </section>
        </div>
    );
};

export default ServicesPage;
