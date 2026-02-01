import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Pencil, Palette, Shield, Megaphone, Printer, Check, ArrowRight, Loader2, Zap, Award, Search, FileText, CloudUpload, Sparkles, MessageSquare, Trophy } from 'lucide-react';
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
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
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

    const processSteps = [
        {
            icon: MessageSquare,
            title: 'Consulta Inicial',
            description: 'Conversamos sobre a sua obra, objetivos e público-alvo para definir a melhor estratégia.'
        },
        {
            icon: Search,
            title: 'Análise Editorial',
            description: 'A nossa equipa avalia o seu manuscrito e sugere os serviços ideais para o seu sucesso.'
        },
        {
            icon: Zap,
            title: 'Execução Criativa',
            description: 'Transformamos o seu texto com revisão, diagramação e design de capa de nível mundial.'
        },
        {
            icon: Award,
            title: 'Publicação Final',
            description: 'Entregamos a sua obra pronta para o mercado, com toda a qualidade da Editora Graça.'
        }
    ];

    return (
        <div className="min-h-screen bg-[#F8FAFC] overflow-x-hidden">
            {/* Nav Padding Spacer */}
            <div className="h-[120px] lg:h-[128px] bg-brand-dark"></div>

            {/* Hero Section - Deep Immersive */}
            <section className="relative bg-brand-dark text-white pt-24 pb-48 md:pt-40 md:pb-72 overflow-hidden">
                {/* Immersive Background Elements */}
                <m.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 2 }}
                    className="absolute top-0 right-0 w-[80%] aspect-square bg-brand-primary/10 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/4"
                ></m.div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(196,160,82,0.05)_0%,_transparent_70%)]"></div>

                <div className="container mx-auto px-6 md:px-8 relative z-10 text-center lg:text-left">
                    <m.div
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                        className="max-w-5xl"
                    >
                        <m.div variants={itemVariants} className="inline-flex items-center gap-4 px-6 py-2.5 bg-white/5 backdrop-blur-xl rounded-full border border-white/10 text-brand-primary font-black tracking-[0.4em] uppercase text-[10px] md:text-xs mb-12">
                            <Sparkles className="w-4 h-4" />
                            <span>Excelência Editorial Angolana</span>
                        </m.div>

                        <m.h1 variants={itemVariants} className="text-5xl md:text-[9rem] font-black tracking-tighter mb-12 leading-[0.85] uppercase">
                            {siteContent['hero.title'] || "Padrão"} <br />
                            <span className="text-gradient-gold italic font-serif lowercase font-normal">{siteContent['hero.subtitle'] || "de Ouro"}</span>
                        </m.h1>

                        <m.p variants={itemVariants} className="text-xl md:text-3xl text-gray-400 font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0 opacity-80 mb-20">
                            {siteContent['hero.description'] || "Consultoria editorial de elite para autores que buscam transformar manuscritos em legados literários imperecíveis."}
                        </m.p>

                        <m.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-10">
                            <button
                                onClick={() => navigate('/contacto')}
                                className="w-full sm:w-auto px-16 py-8 bg-white text-brand-dark rounded-[1.5rem] font-black uppercase tracking-[0.4em] text-[11px] hover:bg-brand-primary hover:text-white hover:scale-105 active:scale-95 transition-all shadow-2xl flex items-center justify-center gap-6 group"
                            >
                                Agendar Auditoria
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                            </button>

                            <div className="flex items-center gap-6 py-4 px-8 glass-premium rounded-[2rem] border border-white/10">
                                <div className="flex -space-x-4">
                                    {[21, 22, 23, 24].map((i) => (
                                        <div key={i} className="w-14 h-14 rounded-2xl border-4 border-brand-dark bg-gray-800 overflow-hidden shadow-2xl">
                                            <img src={`https://i.pravatar.cc/100?img=${i}`} alt="Autor" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                                        </div>
                                    ))}
                                </div>
                                <div className="text-left">
                                    <span className="text-xs font-black text-white uppercase tracking-[0.2em] block">Comunidade de Elite</span>
                                    <span className="text-[10px] font-bold text-brand-primary uppercase tracking-[0.2em]">Autores Aclamados</span>
                                </div>
                            </div>
                        </m.div>
                    </m.div>
                </div>
            </section>

            {/* Special Conditions Banner - NEW */}
            <section className="bg-brand-primary py-8 relative overflow-hidden">
                <div className="container mx-auto px-6 md:px-8">
                    <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-24 text-white">
                        <m.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-4 group"
                        >
                            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                                <Zap className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <span className="font-black uppercase tracking-[0.2em] text-[10px] block opacity-70">Facilidade</span>
                                <span className="font-bold uppercase tracking-[0.1em] text-sm">Pagamento em 2 prestações</span>
                            </div>
                        </m.div>
                        <div className="w-px h-10 bg-white/20 hidden md:block"></div>
                        <m.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="flex items-center gap-4 group"
                        >
                            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <span className="font-black uppercase tracking-[0.2em] text-[10px] block opacity-70">Bónus Editorial</span>
                                <span className="font-bold uppercase tracking-[0.1em] text-sm">2 Exemplares prova incluídos</span>
                            </div>
                        </m.div>
                    </div>
                </div>
            </section>

            {/* Services Grid - High End Cards */}
            <section className="py-24 md:py-48 -mt-32 md:-mt-48 relative z-20 optimize-render">
                <div className="container mx-auto px-6 md:px-8">
                    <AnimatePresence mode="wait">
                        {isLoading ? (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16">
                                {[1, 2, 3].map(i => <ServiceCardSkeleton key={i} />)}
                            </div>
                        ) : (
                            <m.div
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={containerVariants}
                                className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16"
                            >
                                {services.map((service, index) => {
                                    const Icon = (service as any).icon || getIcon(service.title);
                                    return (
                                        <m.div
                                            key={service.id || index}
                                            variants={itemVariants}
                                            className="glass-premium rounded-[4rem] p-12 md:p-16 border border-white shadow-2xl hover:-translate-y-4 transition-all duration-700 group flex flex-col relative overflow-hidden"
                                        >
                                            {/* Decorative element */}
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                                            <div className="relative z-10 flex-1 flex flex-col">
                                                <div className="w-24 h-24 bg-brand-dark text-brand-primary rounded-[2rem] flex items-center justify-center mb-12 shadow-[0_20px_40px_rgba(0,0,0,0.1)] group-hover:bg-brand-primary group-hover:text-white transition-all duration-500 group-hover:rotate-6">
                                                    <Icon className="w-10 h-10" />
                                                </div>

                                                <h3 className="text-4xl font-black text-brand-dark mb-6 tracking-tighter uppercase leading-none">{service.title}</h3>

                                                <div className="mb-12 pb-12 border-b border-gray-100/50">
                                                    <span className="text-[10px] uppercase tracking-[0.4em] text-gray-400 font-black block mb-4">Investimento de Prestígio</span>
                                                    <div className="text-3xl font-black text-brand-primary flex items-baseline gap-2">
                                                        {service.price}
                                                        <span className="text-xs text-gray-400 font-medium">/projeto</span>
                                                    </div>
                                                </div>

                                                <div className="space-y-6 mb-16 flex-1">
                                                    {service.details.map((feature, idx) => (
                                                        <div key={idx} className="flex items-start gap-5">
                                                            <div className="w-7 h-7 bg-brand-primary/10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-brand-primary transition-colors duration-500">
                                                                <Check className="w-4 h-4 text-brand-primary group-hover:text-white" />
                                                            </div>
                                                            <span className="text-gray-500 font-bold text-base leading-relaxed">{feature}</span>
                                                        </div>
                                                    ))}
                                                </div>

                                                <button
                                                    onClick={() => navigate('/contacto')}
                                                    className="w-full py-7 bg-brand-dark text-white rounded-[1.5rem] font-black uppercase text-[11px] tracking-[0.4em] hover:bg-brand-primary transition-all shadow-2xl group/btn overflow-hidden relative"
                                                >
                                                    <span className="relative z-10 flex items-center justify-center gap-4">
                                                        Solicitar Curadoria
                                                        <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform" />
                                                    </span>
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

            {/* Budget Calculator Section - NEW */}
            <section className="py-24 bg-brand-dark/5 border-y border-brand-dark/10">
                <div className="container mx-auto px-6 md:px-8">
                    <div className="text-center mb-16">
                        <span className="text-brand-primary font-black text-xs uppercase tracking-[0.5em] mb-4 block">Planejamento</span>
                        <h2 className="text-4xl md:text-5xl font-black text-brand-dark tracking-tighter uppercase leading-none">Simule seu Investimento</h2>
                    </div>
                    <BudgetGenerator />
                </div>
            </section>

            {/* Methodology Section - Scientific & Artistic */}
            <section className="py-24 md:py-48 bg-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-[#F8FAFC] to-transparent"></div>

                <div className="container mx-auto px-6 md:px-8 relative z-10">
                    <m.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={containerVariants}
                        className="text-center mb-32"
                    >
                        <span className="text-brand-primary font-black text-xs uppercase tracking-[0.5em] mb-8 block">Processo de Alta Performance</span>
                        <m.h2 variants={itemVariants} className="text-5xl md:text-[8rem] font-black text-brand-dark tracking-tighter mb-10 leading-[0.85] uppercase">
                            Arquitetura <br />
                            <span className="text-gradient-gold italic font-serif lowercase font-normal">do Legado</span>
                        </m.h2>
                        <div className="w-32 h-2 bg-brand-primary mx-auto rounded-full"></div>
                    </m.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 relative">
                        {processSteps.map((step, idx) => (
                            <m.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.2, duration: 0.8 }}
                                className="group p-10 rounded-[3rem] hover:bg-gray-50 transition-all duration-700 border border-transparent hover:border-gray-100"
                            >
                                <div className="mb-12 relative inline-block">
                                    <div className="w-28 h-28 bg-brand-dark text-brand-primary rounded-[2.5rem] flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-700">
                                        <step.icon className="w-12 h-12" />
                                    </div>
                                    <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-brand-primary text-white rounded-2xl flex items-center justify-center text-sm font-black shadow-2xl border-4 border-white">
                                        0{idx + 1}
                                    </div>
                                </div>
                                <h4 className="text-3xl font-black text-brand-dark mb-6 tracking-tighter uppercase leading-none">{step.title}</h4>
                                <p className="text-gray-500 font-bold text-base leading-relaxed opacity-70 group-hover:opacity-100 transition-opacity duration-500">
                                    {step.description}
                                </p>
                            </m.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Snippet - Reused from Home for consistency */}
            <section className="py-24 md:py-48 bg-[#F8FAFC]">
                <div className="container mx-auto px-6 md:px-8 text-center">
                    <m.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="max-w-4xl mx-auto space-y-12"
                    >
                        <Trophy className="w-20 h-20 text-brand-primary mx-auto opacity-20" />
                        <h2 className="text-4xl md:text-6xl font-black text-brand-dark tracking-tighter uppercase leading-none italic font-serif">
                            "A Editora Graça não apenas publica livros; <br />
                            <span className="text-brand-primary not-italic font-sans">Eternaiza Pensamentos.</span>"
                        </h2>
                        <div className="flex items-center justify-center gap-4">
                            <div className="w-16 h-px bg-gray-200"></div>
                            <span className="text-[10px] uppercase tracking-[0.5em] text-gray-400 font-black">Crítica Literária Nacional</span>
                            <div className="w-16 h-px bg-gray-200"></div>
                        </div>
                    </m.div>
                </div>
            </section>

            {/* Final High-Impact CTA */}
            <section className="py-32 md:py-64 bg-brand-dark text-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_rgba(196,160,82,0.1)_0%,_transparent_70%)]"></div>

                <div className="container mx-auto px-6 md:px-8 text-center relative z-10">
                    <m.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                        className="max-w-6xl mx-auto"
                    >
                        <span className="text-brand-primary font-black text-xs uppercase tracking-[0.5em] mb-12 block">Chamada para Autores Visionários</span>
                        <h2 className="text-5xl md:text-[9rem] font-black tracking-tighter mb-16 leading-[0.85] uppercase">
                            Pronto para o <br />
                            <span className="text-gradient-gold italic font-serif lowercase font-normal">Próximo Nível?</span>
                        </h2>

                        <div className="flex flex-col md:flex-row items-center justify-center gap-10">
                            <button
                                onClick={() => navigate('/contacto')}
                                className="w-full md:w-auto px-20 py-10 bg-white text-brand-dark font-black rounded-[2rem] hover:bg-brand-primary hover:text-white hover:scale-105 active:scale-95 transition-all text-xs uppercase tracking-[0.4em] shadow-2xl flex items-center justify-center gap-6 group"
                            >
                                Iniciar Consultoria de Elite
                                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                            </button>

                            <div className="flex items-center gap-6 text-left border-l border-white/10 pl-10 h-20">
                                <div>
                                    <p className="text-3xl font-black text-white leading-none">Angola</p>
                                    <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-black mt-2">Sede Global</p>
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
