import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Pencil, Palette, Shield, Megaphone, Printer, Check, ArrowRight, Loader2, Zap, Award, Search, FileText, CloudUpload, Sparkles, MessageSquare, Trophy, ArrowUpRight } from 'lucide-react';
import { m, AnimatePresence, Variants } from 'framer-motion';
import { ViewState, EditorialService } from '../types';
import { getEditorialServices, getSiteContent } from '../services/dataService';
import { ServiceCardSkeleton } from '../components/SkeletonLoader';
import BudgetGenerator from '../components/BudgetGenerator';

const ServicesPage: React.FC = () => {
    const navigate = useNavigate();
    const [services, setServices] = useState<EditorialService[]>([]);
    const [siteContent, setSiteContent] = useState<any>({});
    const [isLoading, setIsLoading] = useState(true);

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
        }
    };

    const FALLBACK_SERVICES: (EditorialService & { icon: any })[] = [
        {
            id: 'f-1',
            icon: Pencil,
            title: 'Revisão e Edição',
            price: '250 Kz / página',
            details: [
                'Correção ortográfica e gramatical',
                'Adequação ao acordo ortográfico',
                'Preço reduzido para > 250 páginas (200 Kz)',
                'Revisão de coerência e coesão',
                'Edição profissional completa'
            ]
        },
        {
            id: 'f-2',
            icon: BookOpen,
            title: 'Diagramação',
            price: '250 Kz / página',
            details: [
                'Layout profissional para impressão',
                'Tipografia avançada',
                'Preço reduzido para > 250 páginas (200 Kz)',
                'Inclusão de elementos gráficos',
                'Arquivo pronto para a gráfica'
            ]
        },
        {
            id: 'f-3',
            icon: Palette,
            title: 'Design de Capa',
            price: '10.000 Kz',
            details: [
                'Design exclusivo para livro físico',
                'Opção E-book por 7.500 Kz',
                'Revisões ilimitadas',
                'Adaptação para redes sociais',
                'Arquivos em alta resolução'
            ]
        },
        {
            id: 'f-4',
            icon: Shield,
            title: 'Legalização',
            price: '6.000 Kz',
            details: [
                'Registo Internacional ISBN',
                'Depósito Legal obrigatório',
                'Proteção de direitos autorais',
                'Catalogação na fonte',
                'Consultoria burocrática'
            ]
        },
        {
            id: 'f-5',
            icon: Printer,
            title: 'Impressão',
            price: 'Desde 3.500 Kz',
            details: [
                'Valor varia conforme formato',
                'Acabamento premium',
                'Preço por exemplar',
                'Sem tiragem mínima obrigatória',
                'Prova de impressão incluída'
            ]
        },
        {
            id: 'f-6',
            icon: Megaphone,
            title: 'Marketing Digital',
            price: '5.000 Kz / post',
            details: [
                'Criação de post publicitário',
                'Design otimizado para Instagram',
                'Foco em conversão e vendas',
                'Copywriting persuasivo',
                'Entrega em 24h'
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

    const processSteps = siteContent['services.methodology'] || [
        {
            icon: 'MessageSquare',
            title: 'Consulta Inicial',
            description: 'Conversamos sobre a sua obra, objetivos e público-alvo para definir a melhor estratégia.'
        },
        {
            icon: 'Search',
            title: 'Análise Editorial',
            description: 'A nossa equipa avalia o seu manuscrito e sugere os serviços ideais para o seu sucesso.'
        },
        {
            icon: 'Zap',
            title: 'Execução Criativa',
            description: 'Transformamos o seu texto com revisão, diagramação e design de capa de nível mundial.'
        },
        {
            icon: 'Award',
            title: 'Publicação Final',
            description: 'Entregamos a sua obra pronta para o mercado, com toda a qualidade da Editora Graça.'
        }
    ];

    const iconMap: Record<string, any> = {
        'MessageSquare': MessageSquare,
        'Search': Search,
        'Zap': Zap,
        'Award': Award,
        'BookOpen': BookOpen,
        'Pencil': Pencil,
        'Palette': Palette,
        'Shield': Shield,
        'Megaphone': Megaphone,
        'Printer': Printer
    };

    return (
        <div className="min-h-screen bg-white overflow-x-hidden">
            {/* Nav Padding Spacer */}
            <div className="h-20 md:h-24 bg-brand-dark"></div>

            {/* 1. CINEMATIC HERO */}
            <section className="relative bg-brand-dark text-white pt-24 pb-48 md:pt-32 md:pb-64 overflow-hidden">
                {/* Background Decorative Text */}
                <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/4 select-none pointer-events-none opacity-[0.03] whitespace-nowrap">
                    <span className="text-[30rem] font-black uppercase tracking-tighter leading-none">
                        SERVIÇOS
                    </span>
                </div>

                <div className="container mx-auto px-6 md:px-12 relative z-10 text-center lg:text-left">
                    <m.div
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                        className="max-w-6xl"
                    >
                        <m.div variants={itemVariants} className="flex items-center justify-center lg:justify-start gap-4 text-[10px] text-brand-primary font-black uppercase tracking-[0.4em] mb-12">
                            <Sparkles className="w-4 h-4" />
                            <span>Excelência Editorial de Alta Performance</span>
                        </m.div>

                        <m.h1 variants={itemVariants} className="text-6xl md:text-[10rem] font-black uppercase leading-[0.8] tracking-tighter mb-12">
                            {siteContent['hero.title'] || "O Padrão"} <br />
                            <span className="text-brand-primary italic font-serif lowercase font-normal md:text-[8rem]">{siteContent['hero.subtitle'] || "de Ouro"}</span>
                        </m.h1>

                        <m.p variants={itemVariants} className="text-xl md:text-3xl text-gray-400 font-light leading-relaxed max-w-3xl mx-auto lg:mx-0 opacity-80 mb-20">
                            {siteContent['hero.description'] || "Consultoria editorial de elite para autores que buscam transformar manuscritos em legados literários imperecíveis."}
                        </m.p>

                        <m.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-10 justify-center lg:justify-start">
                            <button
                                onClick={() => navigate('/contacto')}
                                className="w-full sm:w-auto px-16 py-8 bg-white text-brand-dark rounded-[1.5rem] font-black uppercase tracking-[0.4em] text-[11px] hover:bg-brand-primary hover:text-white hover:scale-105 active:scale-95 transition-all shadow-2xl flex items-center justify-center gap-6 group"
                                title="Agendar Auditoria Editorial"
                            >
                                Agendar Auditoria
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                            </button>

                            <div className="flex items-center gap-6 py-4 px-8 border border-white/10 rounded-[2rem] bg-white/5 backdrop-blur-md">
                                <div className="flex -space-x-4">
                                    {[21, 22, 23, 24].map((i) => (
                                        <div key={i} className="w-12 h-12 rounded-2xl border-4 border-brand-dark bg-gray-800 overflow-hidden shadow-2xl">
                                            <img src={`https://i.pravatar.cc/100?img=${i}`} alt="Autor" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                                        </div>
                                    ))}
                                </div>
                                <div className="text-left">
                                    <span className="text-[10px] font-black text-white uppercase tracking-[0.2em] block">Comunidade de Elite</span>
                                    <span className="text-[9px] font-bold text-brand-primary uppercase tracking-[0.2em]">Autores Aclamados</span>
                                </div>
                            </div>
                        </m.div>
                    </m.div>
                </div>

                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent"></div>
            </section>

            {/* 2. SERVICES GRID */}
            <section className="py-24 md:py-48 bg-white relative z-10 -mt-20">
                <div className="container mx-auto px-6 md:px-12">
                    <AnimatePresence mode="wait">
                        {isLoading ? (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-20">
                                {[1, 2, 3].map(i => <ServiceCardSkeleton key={i} />)}
                            </div>
                        ) : (
                            <m.div
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={{
                                    visible: { transition: { staggerChildren: 0.1 } }
                                }}
                                className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-20"
                            >
                                {services.map((service, index) => {
                                    const Icon = (service as any).icon || getIcon(service.title);
                                    return (
                                        <m.div
                                            key={service.id || index}
                                            variants={{
                                                hidden: { opacity: 0, y: 30 },
                                                visible: { opacity: 1, y: 0 }
                                            }}
                                            className="group relative flex flex-col gap-8 bg-white p-12 md:p-16 rounded-[3rem] border border-gray-100 hover:border-brand-primary/20 hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] transition-all duration-700"
                                        >
                                            <div className="relative z-10 flex-1 flex flex-col">
                                                <div className="w-24 h-24 bg-brand-dark text-brand-primary rounded-[2rem] flex items-center justify-center mb-10 shadow-xl group-hover:bg-brand-primary group-hover:text-white transition-all duration-500 group-hover:rotate-6">
                                                    <Icon className="w-10 h-10" />
                                                </div>

                                                <h3 className="text-4xl font-black text-brand-dark mb-6 tracking-tighter uppercase leading-none">{service.title}</h3>

                                                <div className="mb-10 pb-10 border-b border-gray-50">
                                                    <span className="text-[10px] uppercase tracking-[0.4em] text-gray-400 font-black block mb-4">Investimento Sugerido</span>
                                                    <div className="text-3xl font-black text-brand-primary flex items-baseline gap-2">
                                                        {service.price}
                                                        <span className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">Base</span>
                                                    </div>
                                                </div>

                                                <div className="space-y-6 mb-16 flex-1">
                                                    {service.details.map((feature, idx) => (
                                                        <div key={idx} className="flex items-start gap-5">
                                                            <div className="w-6 h-6 bg-brand-dark rounded-lg flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-brand-primary transition-colors duration-500">
                                                                <Check className="w-3.5 h-3.5 text-white" />
                                                            </div>
                                                            <span className="text-gray-500 font-bold text-sm leading-relaxed">{feature}</span>
                                                        </div>
                                                    ))}
                                                </div>

                                                <button
                                                    onClick={() => navigate('/contacto')}
                                                    className="w-full py-7 bg-brand-light border-2 border-brand-dark text-brand-dark rounded-[1.5rem] font-black uppercase text-[10px] tracking-[0.4em] hover:bg-brand-dark hover:text-white transition-all flex items-center justify-center gap-4 group/btn"
                                                    title={`Solicitar curadoria para ${service.title}`}
                                                    aria-label={`Solicitar curadoria para ${service.title}`}
                                                >
                                                    Explorar Solução
                                                    <ArrowUpRight className="w-5 h-5 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                                </button>
                                            </div>
                                        </m.div>
                                    );
                                })}
                            </m.div>
                        )}
                    </AnimatePresence>
                </div>
            </section>

            {/* 3. BUDGET CALCULATOR */}
            <section className="py-24 md:py-48 bg-gray-50 border-y border-gray-100 overflow-hidden relative">
                <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/4 select-none pointer-events-none opacity-[0.05] whitespace-nowrap">
                    <span className="text-[20rem] font-black uppercase tracking-tighter leading-none text-brand-dark">
                        PLANEAMENTO
                    </span>
                </div>

                <div className="container mx-auto px-6 md:px-12 relative z-10">
                    <div className="max-w-4xl mx-auto text-center mb-24">
                        <span className="text-brand-primary font-black text-[10px] uppercase tracking-[0.5em] mb-6 block">Simulador de Viabilidade</span>
                        <h2 className="text-5xl md:text-7xl font-black text-brand-dark tracking-tighter uppercase leading-none">Configure seu <br /> <span className="text-brand-primary italic font-serif lowercase font-normal">Investimento</span></h2>
                    </div>
                    <BudgetGenerator />
                </div>
            </section>

            {/* 4. METHODOLOGY (ARCHITECTURE OF LEGACY) */}
            <section className="py-24 md:py-48 bg-white relative overflow-hidden">
                <div className="container mx-auto px-6 md:px-12 relative z-10">
                    <m.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                        className="text-center mb-32"
                    >
                        <span className="text-brand-primary font-black text-[10px] uppercase tracking-[0.5em] mb-8 block">Engenharia Editorial</span>
                        <h2 className="text-6xl md:text-[8rem] font-black text-brand-dark tracking-tighter mb-10 leading-[0.85] uppercase">
                            Arquitetura <br />
                            <span className="text-brand-primary italic font-serif lowercase font-normal md:text-[7rem]">do Legado</span>
                        </h2>
                    </m.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 relative">
                        {processSteps.map((step: any, idx: number) => {
                            const Icon = iconMap[step.icon] || Sparkles;
                            return (
                                <m.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="group p-12 rounded-[3.5rem] bg-gray-50 hover:bg-white border border-transparent hover:border-gray-100 hover:shadow-2xl transition-all duration-700"
                                >
                                    <div className="mb-12 relative inline-block">
                                        <div className="w-24 h-24 bg-brand-dark text-brand-primary rounded-[2rem] flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-700">
                                            <Icon className="w-10 h-10" />
                                        </div>
                                        <div className="absolute -bottom-3 -right-3 w-10 h-10 bg-brand-primary text-white rounded-xl flex items-center justify-center text-xs font-black shadow-xl border-4 border-white">
                                            0{idx + 1}
                                        </div>
                                    </div>
                                    <h4 className="text-2xl font-black text-brand-dark mb-6 tracking-tighter uppercase leading-tight">{step.title}</h4>
                                    <p className="text-gray-500 font-medium text-base leading-relaxed opacity-70 group-hover:opacity-100 transition-opacity">
                                        {step.description}
                                    </p>
                                </m.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* 5. FINAL CTA */}
            <section className="py-32 md:py-64 bg-brand-dark text-white relative overflow-hidden">
                {/* Decorative element */}
                <div className="absolute top-0 right-0 w-[60%] aspect-square bg-brand-primary/10 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2"></div>

                <div className="container mx-auto px-6 md:px-12 text-center relative z-10">
                    <m.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-6xl mx-auto"
                    >
                        <span className="text-brand-primary font-black text-[10px] uppercase tracking-[0.5em] mb-12 block">Inicie sua Jornada de Prestígio</span>
                        <h2 className="text-6xl md:text-[10rem] font-black tracking-tighter mb-16 leading-[0.8] uppercase">
                            Crie seu <br />
                            <span className="text-brand-primary italic font-serif lowercase font-normal md:text-[9rem]">Universo</span>
                        </h2>

                        <div className="flex flex-col md:flex-row items-center justify-center gap-10">
                            <button
                                onClick={() => navigate('/contacto')}
                                className="w-full md:w-auto px-20 py-10 bg-white text-brand-dark font-black rounded-[2rem] hover:bg-brand-primary hover:text-white hover:scale-105 active:scale-95 transition-all text-[11px] uppercase tracking-[0.4em] shadow-2xl flex items-center justify-center gap-6 group"
                                title="Iniciar Consultoria Literária"
                                aria-label="Iniciar Consultoria Literária"
                            >
                                Iniciar Consultoria
                                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                            </button>

                            <div className="flex items-center gap-6 text-left border-l border-white/10 pl-10 h-20">
                                <div>
                                    <p className="text-3xl font-black text-white leading-none">Luanda</p>
                                    <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-black mt-2">Centro Editorial</p>
                                </div>
                            </div>
                        </div>
                    </m.div>
                </div>
            </section>
        </div>
    );
};

export default ServicesPage;
