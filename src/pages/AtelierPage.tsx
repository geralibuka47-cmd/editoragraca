import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    BookOpen, Pencil, Palette, Shield, Megaphone, Printer,
    Check, ArrowRight, Zap, Award, Search, Sparkles,
    MessageSquare, ArrowUpRight, Star, Layers, Globe, Feather
} from 'lucide-react';
import { m, AnimatePresence, Variants } from 'framer-motion';
import { EditorialService } from '../types';
import { getEditorialServices, getSiteContent } from '../services/dataService';
import { ServiceCardSkeleton } from '../components/Skeleton';
import BudgetGenerator from '../components/BudgetGenerator';
import { PageHero } from '../components/PageHero';
import SEO from '../components/SEO';

const AtelierPage: React.FC = () => {
    const navigate = useNavigate();
    const [services, setServices] = useState<EditorialService[]>([]);
    const [siteContent, setSiteContent] = useState<any>({});
    const [isLoading, setIsLoading] = useState(true);

    const FALLBACK_SERVICES: any[] = [
        {
            id: 'f-1',
            icon: Pencil,
            title: 'Curadoria Editorial',
            price: '250 Kz / pág',
            details: [
                'Revisão crítica e estrutural',
                'Refinamento estilístico profundo',
                'Adequação técnica normativa',
                'Consultoria de voz autoral',
                'Edição de luxo para colecionadores'
            ]
        },
        {
            id: 'f-2',
            icon: Layers,
            title: 'Arquitetura de Layout',
            price: '250 Kz / pág',
            details: [
                'Diagramação artística personalizada',
                'Tipografia de fundição exclusiva',
                'Gestão cromática para impressão',
                'Design de grelhas complexas',
                'Preparação técnica para offset'
            ]
        },
        {
            id: 'f-3',
            icon: Palette,
            title: 'Design de Capa Iconográfica',
            price: '10.000 Kz',
            details: [
                'Ilustração digital sob medida',
                'Lettering manual e exclusivo',
                'Simulação de acabamentos (Verniz/Relevo)',
                'Kit completo para marketing',
                'Versão premium para e-book'
            ]
        },
        {
            id: 'f-4',
            icon: Globe,
            title: 'Gestão de Direitos & ISBN',
            price: '6.000 Kz',
            details: [
                'Legalização internacional completa',
                'Depósito Legal em Luanda',
                'Ficha catalográfica técnica',
                'Consultoria de direitos patrimoniais',
                'Registo em base de dados globais'
            ]
        },
        {
            id: 'f-5',
            icon: Feather,
            title: 'Ghostwriting & Biografias',
            price: 'Sob Consulta',
            details: [
                'Entrevistas de profundidade',
                'Escrita narrativa profissional',
                'Pesquisa histórica de contexto',
                'Preservação do legado pessoal',
                'Confidencialidade absoluta'
            ]
        },
        {
            id: 'f-6',
            icon: Megaphone,
            title: 'Estratégia de Lançamento',
            price: '5.000 Kz / ativação',
            details: [
                'Campanha digital de alta conversão',
                'Organização de eventos elitistas',
                'Assessoria de imprensa literária',
                'Gestão de provas antecipadas',
                'Análise de performance de vendas'
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
                console.error("Erro ao carregar serviços do atelier:", error);
                setServices(FALLBACK_SERVICES as any);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    const getIcon = (title: string) => {
        const lowerTitle = title.toLowerCase();
        if (lowerTitle.includes('revisão') || lowerTitle.includes('edição')) return Pencil;
        if (lowerTitle.includes('layout') || lowerTitle.includes('diagramação')) return Layers;
        if (lowerTitle.includes('capa')) return Palette;
        if (lowerTitle.includes('legal') || lowerTitle.includes('direitos')) return Globe;
        if (lowerTitle.includes('escrita') || lowerTitle.includes('biografia')) return Feather;
        return Star;
    };

    return (
        <div className="min-h-screen bg-white selection:bg-brand-primary selection:text-white">
            <SEO
                title="Atelier Editorial"
                description="Onde manuscritos se transformam em obras de arte. Serviços editoriais de elite com o selo Editora Graça."
            />

            <PageHero
                title={<>Nossos <br /><span className="text-brand-primary italic font-serif font-normal lowercase text-4xl sm:text-6xl md:text-8xl">Serviços</span></>}
                subtitle="Transformamos manuscritos em objetos de desejo e legados culturais através de uma curadoria técnica rigorosa e estética vanguardista."
                breadcrumb={[{ label: 'Serviços Editoriais' }]}
                decorativeText="EXCELÊNCIA"
                titleClassName="text-4xl sm:text-5xl md:text-7xl lg:text-[10rem] font-black uppercase leading-[0.8] tracking-tighter mb-4"
            />

            {/* Feature Teasers */}
            <section className="py-12 bg-brand-dark -mt-24 relative z-10 border-b border-white/5">
                <div className="container mx-auto px-6 md:px-12">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { label: 'Qualidade', val: 'UNESCO Standard' },
                            { label: 'Entrega', val: 'Expressa 48h' },
                            { label: 'Autores', val: '+500 Publicados' },
                            { label: 'Suporte', val: 'Consultoria 1-on-1' }
                        ].map((item, i) => (
                            <div key={i} className="text-center md:text-left space-y-1">
                                <p className="text-[9px] font-black text-brand-primary uppercase tracking-[0.3em]">{item.label}</p>
                                <p className="text-sm font-bold text-white uppercase tracking-tight">{item.val}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Services Showcase */}
            <section className="py-32 bg-white relative">
                <div className="container mx-auto px-6 md:px-12">
                    <div className="flex flex-col md:flex-row items-end justify-between mb-24 gap-8">
                        <div className="max-w-2xl space-y-6">
                            <span className="text-brand-primary font-black text-xs uppercase tracking-[0.5em]">O Nosso Ecossistema</span>
                            <h2 className="text-5xl md:text-7xl font-black text-brand-dark uppercase tracking-tighter leading-[0.9]">
                                Soluções <span className="text-brand-primary italic font-serif lowercase font-normal">360°</span> para o seu Livro
                            </h2>
                        </div>
                        <p className="text-gray-400 font-medium max-w-xs text-right">
                            Da primeira revisão à estratégia de lançamento, garantimos que cada detalhe reflita a grandeza da sua obra.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {isLoading ? (
                            Array(6).fill(0).map((_, i) => <ServiceCardSkeleton key={i} />)
                        ) : (
                            services.map((service, i) => {
                                const Icon = (service as any).icon || getIcon(service.title);
                                return (
                                    <m.div
                                        key={service.id || i}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 }}
                                        className="group relative bg-white rounded-[3rem] p-12 border border-gray-100 hover:border-brand-primary/30 transition-all duration-700 hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-bl-[5rem] translate-x-12 -translate-y-12 transition-transform group-hover:translate-x-0 group-hover:-translate-y-0 duration-700" />

                                        <div className="relative z-10 space-y-10">
                                            <div className="w-20 h-20 bg-brand-dark text-brand-primary rounded-2xl flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-all duration-500 group-hover:rotate-[10deg] shadow-lg">
                                                <Icon className="w-10 h-10" />
                                            </div>

                                            <div className="space-y-4">
                                                <h3 className="text-3xl font-black text-brand-dark uppercase tracking-tight leading-none group-hover:text-brand-primary transition-colors">{service.title}</h3>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">A partir de</span>
                                                    <span className="text-xl font-black text-brand-dark">{service.price}</span>
                                                </div>
                                            </div>

                                            <ul className="space-y-4 border-t border-gray-50 pt-8">
                                                {service.details.map((detail, idx) => (
                                                    <li key={idx} className="flex gap-4 items-start text-sm text-gray-500 font-medium leading-relaxed">
                                                        <div className="w-5 h-5 bg-brand-light rounded-md flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-brand-primary/20 transition-colors">
                                                            <Check className="w-3 h-3 text-brand-primary" />
                                                        </div>
                                                        {detail}
                                                    </li>
                                                ))}
                                            </ul>

                                            <button
                                                onClick={() => navigate('/contacto')}
                                                title={`Solicitar ${service.title}`}
                                                aria-label={`Solicitar ${service.title}`}
                                                className="w-full py-6 bg-brand-dark text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-brand-primary transition-all flex items-center justify-center gap-4 group/btn"
                                            >
                                                Solicitar Proposta
                                                <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                            </button>
                                        </div>
                                    </m.div>
                                );
                            })
                        )}
                    </div>
                </div>
            </section>

            {/* Methodology: The Graça Way */}
            <section className="py-32 bg-brand-dark text-white overflow-hidden relative">
                <div className="container mx-auto px-6 md:px-12 relative z-10">
                    <div className="flex flex-col lg:flex-row gap-20 items-center">
                        <div className="lg:w-1/2 space-y-12">
                            <span className="text-brand-primary font-black text-xs uppercase tracking-[0.5em]">A Nossa Metodologia</span>
                            <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.8]">
                                Dos Pixels <br />à <span className="text-brand-primary italic font-serif lowercase font-normal">Alma</span>
                            </h2>
                            <p className="text-xl text-gray-400 font-medium leading-relaxed max-w-lg">
                                Não fazemos apenas livros. Construímos monumentos intelectuais através de um processo iterativo de excelência técnica e sensibilidade artística.
                            </p>
                            <div className="space-y-8">
                                {[
                                    { t: 'Imersão', d: 'Análise profunda da essência da obra.' },
                                    { t: 'Transmutação', d: 'Refinamento técnico e estilístico rigoroso.' },
                                    { t: 'Manifesto', d: 'O lançamento da obra como um evento cultural.' }
                                ].map((step, i) => (
                                    <div key={i} className="flex gap-6 items-center group">
                                        <span className="text-4xl font-black text-white/10 group-hover:text-brand-primary transition-colors italic font-serif">0{i + 1}</span>
                                        <div>
                                            <h4 className="font-black text-sm uppercase tracking-widest">{step.t}</h4>
                                            <p className="text-xs text-gray-500 font-bold uppercase tracking-tight">{step.d}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="lg:w-1/2 relative">
                            <div className="aspect-square bg-brand-primary/10 rounded-full blur-[120px] absolute inset-0" />
                            <div className="grid grid-cols-2 gap-6 relative z-10 transform lg:rotate-6">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className={`aspect-[4/5] bg-white/5 backdrop-blur-3xl rounded-[2rem] border border-white/10 flex items-center justify-center group hover:bg-white/10 transition-colors ${i % 2 !== 0 ? '-translate-y-8' : 'translate-y-8'}`}>
                                        <Sparkles className="w-12 h-12 text-brand-primary group-hover:scale-125 transition-transform duration-700" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Budget Generator Integration */}
            <section className="py-32 bg-gray-50">
                <div className="container mx-auto px-6 md:px-12">
                    <div className="text-center mb-24 space-y-6">
                        <span className="text-brand-primary font-black text-xs uppercase tracking-[0.5em]">Transparência Total</span>
                        <h2 className="text-5xl md:text-7xl font-black text-brand-dark uppercase tracking-tighter">Budget <span className="text-brand-primary italic font-serif lowercase font-normal">Simulator</span></h2>
                    </div>
                    <div className="max-w-5xl mx-auto bg-white rounded-[3rem] p-12 shadow-2xl shadow-brand-dark/5 border border-gray-100">
                        <BudgetGenerator />
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-32 bg-white">
                <div className="container mx-auto px-6 md:px-12 text-center">
                    <div className="max-w-4xl mx-auto space-y-12">
                        <Feather className="w-16 h-16 text-brand-primary mx-auto animate-bounce" />
                        <h2 className="text-6xl md:text-9xl font-black text-brand-dark uppercase tracking-tighter leading-none">A Sua Obra <br /><span className="text-brand-primary">Mundial</span></h2>
                        <p className="text-xl text-gray-400 font-medium max-w-xl mx-auto">
                            Estás pronto para dar o próximo passo na tua carreira literária? O Atelier da Editora Graça está à tua espera.
                        </p>
                        <button
                            onClick={() => navigate('/contacto')}
                            title="Conversar com um Especialista"
                            aria-label="Conversar com um Especialista"
                            className="px-16 py-10 bg-brand-dark text-white rounded-[2rem] font-black uppercase text-xs tracking-[0.4em] hover:bg-brand-primary hover:scale-105 active:scale-95 transition-all shadow-2xl flex items-center justify-center gap-6 mx-auto group"
                        >
                            Agendar Consultoria
                            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AtelierPage;
