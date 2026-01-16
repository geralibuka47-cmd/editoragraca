import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Pencil, Palette, Shield, Megaphone, Printer, Check, ArrowRight, Loader2, Zap, Award, Search, FileText, CloudUpload, Sparkles, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { ViewState, EditorialService } from '../types';
import { getEditorialServices, getSiteContent } from '../services/dataService';
import { ServiceCardSkeleton } from '../components/SkeletonLoader';

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
        <div className="min-h-screen bg-brand-light">
            {/* Nav Padding Spacer */}
            <div className="h-20 bg-brand-dark"></div>

            {/* Hero Section */}
            <section className="relative bg-brand-dark text-white py-24 md:py-32 overflow-hidden border-b border-white/5">
                {/* Modern Dynamic Background Elements */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-brand-primary/10 to-transparent pointer-events-none"></div>
                <motion.div
                    initial={{ opacity: 0, rotate: -45 }}
                    animate={{ opacity: 1, rotate: -45 }}
                    transition={{ duration: 2 }}
                    className="absolute -top-40 -right-20 w-[600px] h-[600px] bg-brand-primary/5 rounded-[100px] blur-[100px] pointer-events-none"
                ></motion.div>

                <div className="container mx-auto px-8 relative z-10">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                        className="max-w-4xl"
                    >
                        <motion.div variants={itemVariants} className="flex items-center gap-2 text-sm text-brand-primary uppercase tracking-[0.3em] font-black mb-8">
                            <button onClick={() => navigate('/')} className="hover:text-white transition-colors">Início</button>
                            <span>/</span>
                            <span className="text-white">Serviços</span>
                        </motion.div>

                        <motion.h1 variants={itemVariants} className="text-5xl md:text-8xl font-black tracking-tighter mb-10 leading-[0.9]">
                            {siteContent['hero.title'] || "Excelência"} <br />
                            <span className="text-brand-primary italic font-serif font-normal">{siteContent['hero.subtitle'] || "Editorial"}</span>
                        </motion.h1>

                        <motion.p variants={itemVariants} className="text-xl md:text-2xl text-gray-400 leading-relaxed font-medium mb-12 max-w-2xl">
                            {siteContent['hero.description'] || "Transformamos manuscritos em obras publicadas com o rigor e a qualidade que o mercado literário exige."}
                        </motion.p>

                        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-6">
                            <button
                                onClick={() => navigate('/contacto')}
                                className="bg-brand-primary text-white px-12 py-6 rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-white hover:text-brand-dark transition-all duration-300 shadow-2xl flex items-center gap-4 group w-full sm:w-auto justify-center"
                            >
                                Solicitar Orçamento
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                            </button>
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="w-12 h-12 rounded-full border-4 border-brand-dark bg-gray-700 flex items-center justify-center overflow-hidden">
                                        <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                                    </div>
                                ))}
                                <div className="w-12 h-12 rounded-full border-4 border-brand-dark bg-brand-primary flex items-center justify-center text-[10px] font-black">
                                    +500
                                </div>
                            </div>
                            <span className="text-sm text-gray-500 font-bold uppercase tracking-widest">Autores Satisfeitos</span>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-24 md:py-32 bg-white relative">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-primary/5 rounded-full blur-[100px] -z-10 -translate-x-1/2 translate-y-1/2"></div>

                <div className="container mx-auto px-8">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={containerVariants}
                        className="text-center max-w-3xl mx-auto mb-24"
                    >
                        <motion.div variants={itemVariants} className="inline-flex items-center gap-3 px-6 py-2.5 bg-brand-primary/10 rounded-full mb-8">
                            <Sparkles className="w-4 h-4 text-brand-primary" />
                            <span className="text-brand-primary font-black tracking-[0.2em] uppercase text-[10px]">Estratégia & Sucesso</span>
                        </motion.div>
                        <motion.h2 variants={itemVariants} className="text-4xl md:text-7xl font-black text-brand-dark tracking-tighter mb-8 leading-none">
                            Soluções <span className="text-brand-primary italic font-serif font-normal">Premium</span>
                        </motion.h2>
                        <motion.p variants={itemVariants} className="text-xl text-gray-500 font-medium leading-relaxed">
                            Cuidamos de cada detalhe técnico da sua publicação, para que você possa focar no que realmente importa: a sua história.
                        </motion.p>
                    </motion.div>

                    <AnimatePresence mode="wait">
                        {isLoading ? (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                                {[1, 2, 3].map(i => <ServiceCardSkeleton key={i} />)}
                            </div>
                        ) : (
                            <motion.div
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={containerVariants}
                                className="grid md:grid-cols-2 lg:grid-cols-3 gap-10"
                            >
                                {services.map((service, index) => {
                                    const Icon = (service as any).icon || getIcon(service.title);
                                    return (
                                        <motion.div
                                            key={service.id || index}
                                            variants={itemVariants}
                                            className="bg-white rounded-[3rem] p-12 border border-gray-100 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_40px_80px_-20px_rgba(196,160,82,0.15)] transition-all duration-500 group flex flex-col relative overflow-hidden"
                                        >
                                            {/* Hover Gradient Background */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                            <div className="relative z-10 flex-1 flex flex-col">
                                                <div className="w-20 h-20 bg-brand-primary/5 rounded-3xl flex items-center justify-center mb-10 group-hover:bg-brand-primary group-hover:rotate-6 transition-all duration-500 shadow-xl shadow-brand-primary/5">
                                                    <Icon className="w-10 h-10 text-brand-primary group-hover:text-white transition-colors" />
                                                </div>

                                                <h3 className="text-3xl font-black text-brand-dark mb-4 tracking-tighter group-hover:text-brand-primary transition-colors">{service.title}</h3>
                                                <div className="text-2xl font-black text-brand-primary mb-10 pb-10 border-b border-gray-100 flex items-baseline gap-2">
                                                    <span className="text-sm uppercase tracking-widest text-gray-400 font-bold">Investimento:</span>
                                                    {service.price}
                                                </div>

                                                <div className="space-y-4 mb-12 flex-1">
                                                    {service.details.map((feature, idx) => (
                                                        <motion.div
                                                            key={idx}
                                                            initial={{ opacity: 0, x: -10 }}
                                                            whileInView={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: 0.1 * idx }}
                                                            className="flex items-start gap-4"
                                                        >
                                                            <div className="w-6 h-6 bg-brand-primary/10 rounded-full flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-brand-primary group-hover:scale-110 transition-all duration-300">
                                                                <Check className="w-3.5 h-3.5 text-brand-primary group-hover:text-white" />
                                                            </div>
                                                            <span className="text-gray-600 font-medium">{feature}</span>
                                                        </motion.div>
                                                    ))}
                                                </div>

                                                <button
                                                    onClick={() => navigate('/contacto')}
                                                    className="w-full px-10 py-6 bg-brand-dark text-white rounded-2xl font-black hover:bg-brand-primary transition-all duration-300 uppercase text-xs tracking-[0.3em] shadow-xl hover:-translate-y-1 active:translate-y-0"
                                                >
                                                    Solicitar Agora
                                                </button>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </section>

            {/* How It Works / Process */}
            <section className="py-24 md:py-32 bg-brand-light relative overflow-hidden">
                <div className="container mx-auto px-8">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={containerVariants}
                        className="text-center mb-24"
                    >
                        <motion.h2 variants={itemVariants} className="text-4xl md:text-6xl font-black text-brand-dark tracking-tighter mb-8 leading-none">
                            O Nosso <span className="text-brand-primary italic font-serif font-normal">Caminho</span> Juntos
                        </motion.h2>
                        <motion.p variants={itemVariants} className="text-xl text-gray-500 font-medium max-w-2xl mx-auto">
                            Desde o primeiro contacto até à obra final, garantimos transparência e excelência em cada etapa.
                        </motion.p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-brand-primary/10 -translate-y-[4.5rem]"></div>

                        {processSteps.map((step, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.15 }}
                                className="relative z-10 text-center group"
                            >
                                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl border-4 border-white group-hover:border-brand-primary transition-all duration-500 relative">
                                    <step.icon className="w-10 h-10 text-brand-primary group-hover:scale-110 transition-transform" />
                                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-brand-dark text-white rounded-full flex items-center justify-center text-xs font-black ring-4 ring-brand-light">
                                        {idx + 1}
                                    </div>
                                </div>
                                <h4 className="text-2xl font-black text-brand-dark mb-4 tracking-tighter">{step.title}</h4>
                                <p className="text-gray-500 font-medium leading-relaxed">{step.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-32 bg-brand-dark text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-brand-primary/5 pattern-grid-white opacity-10"></div>
                <motion.div
                    animate={{ y: [0, -20, 0], opacity: [0.1, 0.2, 0.1] }}
                    transition={{ duration: 5, repeat: Infinity }}
                    className="absolute -top-40 -right-40 w-96 h-96 bg-brand-primary/20 rounded-full blur-[100px]"
                ></motion.div>

                <div className="container mx-auto px-8 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-4xl mx-auto"
                    >
                        <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-10 leading-none">
                            Transforme o seu <span className="text-brand-primary italic font-serif font-normal">Sonho</span> <br /> em Realidade Profissional
                        </h2>
                        <p className="text-xl md:text-2xl text-white/60 mb-16 max-w-2xl mx-auto font-medium leading-relaxed italic">
                            "A sua história merece ser contada com toda a dignidade e perfeição que a excelência editorial pode oferecer."
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-6">
                            <button
                                onClick={() => navigate('/contacto')}
                                className="px-16 py-8 bg-brand-primary text-white font-black rounded-[2rem] hover:bg-white hover:text-brand-dark transition-all duration-500 text-sm uppercase tracking-[0.3em] shadow-[0_20px_50px_rgba(196,160,82,0.3)] hover:scale-105 active:scale-95 group"
                            >
                                <span className="flex items-center gap-4">
                                    Conversar com a Equipa
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                                </span>
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default ServicesPage;
