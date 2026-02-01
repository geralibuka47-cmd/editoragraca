import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Heart, Award, Users, TrendingUp, MapPin, Mail, Phone, Loader2, Sparkles, Target, Zap, ArrowRight, Quote, Star, ArrowUpRight } from 'lucide-react';
import { m, AnimatePresence, Variants } from 'framer-motion';
import { getSiteContent } from '../services/dataService';

const AboutPage: React.FC = () => {
    const navigate = useNavigate();
    const [siteContent, setSiteContent] = useState<any>({});
    const [isLoading, setIsLoading] = useState(true);

    const iconMap: Record<string, any> = {
        'BookOpen': BookOpen,
        'Heart': Heart,
        'Award': Award,
        'Users': Users,
        'TrendingUp': TrendingUp
    };

    useEffect(() => {
        const loadContent = async () => {
            setIsLoading(true);
            try {
                const content = await getSiteContent('about');
                setSiteContent(content);
            } catch (error) {
                console.error("Error loading about content:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadContent();
    }, []);

    const values = siteContent['about.values'] || [
        {
            icon: 'BookOpen',
            title: 'Excelência Literária',
            description: 'Compromisso inabalável com a qualidade e rigor editorial em cada publicação.'
        },
        {
            icon: 'Heart',
            title: 'Paixão pela Cultura',
            description: 'Promover e preservar a riqueza cultural angolana através da literatura.'
        },
        {
            icon: 'Users',
            title: 'Valorização de Autores',
            description: 'Apoio integral a escritores locais, dando voz às suas histórias únicas.'
        },
        {
            icon: 'Award',
            title: 'Reconhecimento',
            description: 'Busca constante pela excelência reconhecida nacional e internacionalmente.'
        }
    ];

    const stats = siteContent['about.stats'] || [
        { number: '26+', label: 'Obras Publicadas', icon: BookOpen },
        { number: '100%', label: 'Autores Angolanos', icon: Star },
        { number: '5+', label: 'Anos de Actividade', icon: Zap },
        { number: '18', label: 'Províncias Alcançadas', icon: MapPin }
    ];

    const timeline = siteContent['about.timeline'] || [
        {
            year: '2020',
            title: 'Fundação',
            description: 'Fundada pelo designer literário Nilton Graça, com o propósito de fortalecer o setor editorial e promover a literautra lusófona.'
        },
        {
            year: '2021',
            title: 'Início Editorial',
            description: 'Início das operações de edição, diagramação e design, servindo autores independentes e parceiros.'
        },
        {
            year: '2023',
            title: 'Crescimento',
            description: 'Marca de 26+ obras publicadas sob selo próprio e através de colaborações institucionais.'
        },
        {
            year: '2026',
            title: 'Reestruturação',
            description: 'Reorganização estratégica, consolidação da comunidade e expansão para formatos digitais.'
        }
    ];

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
        }
    };

    const itemVariants: Variants = {
        hidden: { y: 30, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.8, ease: "easeOut" }
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-white">
                <Loader2 className="w-12 h-12 text-brand-primary animate-spin" />
                <p className="text-gray-400 font-light italic text-lg animate-pulse">Tecendo narrativas imortais...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white overflow-x-hidden">
            {/* Nav Padding Spacer */}
            <div className="h-20 md:h-24 bg-brand-dark"></div>

            {/* 1. CINEMATIC HERO */}
            <section className="relative bg-brand-dark text-white pt-24 pb-48 md:pt-32 md:pb-64 overflow-hidden">
                {/* Background Decorative Text */}
                <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/4 select-none pointer-events-none opacity-[0.03] whitespace-nowrap">
                    <span className="text-[30rem] font-black uppercase tracking-tighter leading-none">
                        HISTÓRIA
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
                            <span>Vanguardismo Literário Angolano</span>
                        </m.div>

                        <m.h1 variants={itemVariants} className="text-6xl md:text-[10rem] font-black uppercase leading-[0.8] tracking-tighter mb-12">
                            A Arte de <br />
                            <span className="text-brand-primary italic font-serif lowercase font-normal md:text-[8rem]">Eternizar</span>
                        </m.h1>

                        <m.p variants={itemVariants} className="text-xl md:text-3xl text-gray-400 font-light leading-relaxed max-w-4xl mx-auto lg:mx-0 opacity-80 mb-20">
                            Uma casa editorial de elite comprometida com a sofisticação intelectual e a preservação do <span className="text-white font-black italic">património cultural</span> através da curadoria literária de alta performance.
                        </m.p>

                        <m.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-10 justify-center lg:justify-start">
                            <div className="flex -space-x-4">
                                {[26, 27, 28, 29].map(i => (
                                    <div key={i} className="w-14 h-14 rounded-2xl border-4 border-brand-dark bg-gray-800 overflow-hidden shadow-2xl grayscale hover:grayscale-0 transition-all duration-700">
                                        <img src={`https://i.pravatar.cc/100?img=${i}`} alt="Autor de Elite" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                            <div className="text-left py-2 px-6 border-l border-white/10">
                                <span className="text-white font-black text-2xl tracking-tighter block leading-none">Ecossistema de Elite</span>
                                <span className="text-brand-primary text-[9px] font-black uppercase tracking-[0.4em] mt-2 block">Propulsão Literária Mundial</span>
                            </div>
                        </m.div>
                    </m.div>
                </div>

                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent"></div>
            </section>

            {/* 2. PHILOSOPHY GRID */}
            <section className="py-24 md:py-48 bg-white relative z-10 -mt-20">
                <div className="container mx-auto px-6 md:px-12">
                    <div className="grid lg:grid-cols-3 gap-12 md:gap-20">
                        {[
                            {
                                icon: Target,
                                label: 'Filosofia Principal',
                                title: 'Rigor & Estética',
                                description: 'Cada obra é submetida a uma auditoria editorial implacável para garantir o status de obra-prima.'
                            },
                            {
                                icon: Sparkles,
                                label: 'Visão Futurista',
                                title: 'Inovação Nativa',
                                description: 'Lideramos a evolução da narrativa em Angola, mesclando tradição impressa com tecnologia imersiva.'
                            },
                            {
                                icon: Zap,
                                label: 'Impacto Cultural',
                                title: 'Legado Atemporal',
                                description: 'Construímos o cânone literário do futuro, dando voz aos pensadores que definem o nosso tempo.'
                            }
                        ].map((item, i) => (
                            <m.div
                                key={i}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={itemVariants}
                                className="group relative flex flex-col gap-8 bg-white p-12 md:p-16 rounded-[4rem] border border-gray-100 hover:border-brand-primary/20 hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] transition-all duration-700"
                            >
                                <div className="w-20 h-20 bg-brand-dark text-brand-primary rounded-[1.5rem] flex items-center justify-center mb-4 group-hover:bg-brand-primary group-hover:text-white transition-all duration-500 group-hover:rotate-12">
                                    <item.icon className="w-10 h-10" />
                                </div>
                                <div className="space-y-6">
                                    <span className="text-brand-primary font-black uppercase tracking-[0.4em] text-[10px] block">{item.label}</span>
                                    <h2 className="text-4xl font-black text-brand-dark tracking-tighter uppercase leading-none">{item.title}</h2>
                                    <p className="text-gray-500 font-medium text-lg leading-relaxed">{item.description}</p>
                                </div>
                            </m.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. VALUES - POWER PILLARS */}
            <section className="py-24 md:py-48 bg-gray-50 border-y border-gray-100">
                <div className="container mx-auto px-6 md:px-12">
                    <m.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={containerVariants}
                        className="text-center max-w-5xl mx-auto mb-32"
                    >
                        <span className="text-brand-primary font-black text-[10px] uppercase tracking-[0.5em] mb-8 block">Bússola Axiológica</span>
                        <m.h2 variants={itemVariants} className="text-6xl md:text-[8rem] font-black text-brand-dark tracking-tighter mb-10 leading-[0.85] uppercase">
                            Pilares de <br />
                            <span className="text-brand-primary italic font-serif lowercase font-normal md:text-[7rem]">Prestígio</span>
                        </m.h2>
                    </m.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                        {values.map((value: any, index: number) => {
                            const Icon = iconMap[value.icon] || BookOpen;
                            return (
                                <m.div
                                    key={index}
                                    variants={itemVariants}
                                    className="p-12 rounded-[3.5rem] bg-white border border-transparent hover:border-brand-primary/20 transition-all duration-700 group flex flex-col items-center text-center hover:shadow-2xl"
                                >
                                    <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mb-10 group-hover:bg-brand-primary transition-all duration-500">
                                        <Icon className="w-10 h-10 text-brand-primary group-hover:text-white" />
                                    </div>
                                    <h3 className="text-2xl font-black text-brand-dark mb-6 tracking-tighter uppercase leading-tight">{value.title}</h3>
                                    <p className="text-gray-500 font-medium leading-relaxed">{value.description}</p>
                                </m.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* 4. FOUNDER'S VISION */}
            <section className="py-32 md:py-64 bg-brand-dark overflow-hidden relative">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(196,160,82,0.1)_0%,_transparent_100%)]"></div>

                <div className="container mx-auto px-6 md:px-12 relative z-10">
                    <m.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2 }}
                        className="relative bg-white/5 backdrop-blur-3xl p-12 md:p-32 rounded-[5rem] border border-white/10 overflow-hidden"
                    >
                        <Quote className="absolute top-16 left-16 w-32 h-32 text-brand-primary opacity-5" />

                        <div className="grid lg:grid-cols-2 gap-24 items-center">
                            <div className="space-y-16">
                                <h3 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-[0.9] uppercase italic font-serif">
                                    "Acreditamos que o talento angolano não merece apenas uma voz; merece um <span className="text-brand-primary not-italic font-sans">Palco Mundial</span> de magnitude absoluta."
                                </h3>

                                <div className="flex items-center gap-10">
                                    <div className="w-24 h-[1px] bg-brand-primary"></div>
                                    <div>
                                        <p className="text-white font-black text-4xl tracking-tighter uppercase leading-none">Nilton Graça</p>
                                        <p className="text-brand-primary text-[10px] font-black uppercase tracking-[0.5em] mt-4">Visionário & Mentor Editorial</p>
                                    </div>
                                </div>
                            </div>

                            <div className="relative group overflow-hidden rounded-[4rem]">
                                <div className="aspect-[4/5] bg-gray-900 border border-white/5 flex items-center justify-center relative transition-transform duration-1000 group-hover:scale-105">
                                    <div className="absolute inset-0 bg-brand-primary/5 mix-blend-overlay"></div>
                                    <Users className="w-48 h-48 text-white/5 opacity-50 group-hover:scale-110 transition-transform duration-1000" />
                                    <div className="absolute inset-0 flex flex-col justify-end p-12 bg-gradient-to-t from-brand-dark to-transparent">
                                        <p className="text-brand-primary font-black text-[10px] uppercase tracking-[0.4em]">Essência Curatorial</p>
                                        <p className="text-white/40 text-[9px] font-bold uppercase tracking-[0.2em] mt-2">Fundador da Editora Graça</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </m.div>
                </div>
            </section>

            {/* 5. TIMELINE NARRATIVE */}
            <section className="py-24 md:py-48 bg-white overflow-hidden relative">
                <div className="container mx-auto px-6 md:px-12">
                    <m.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={containerVariants}
                        className="text-center mb-48"
                    >
                        <span className="text-brand-primary font-black text-[10px] uppercase tracking-[0.5em] mb-8 block">Cronologia da Excelência</span>
                        <m.h2 variants={itemVariants} className="text-6xl md:text-[8rem] font-black text-brand-dark tracking-tighter mb-10 leading-[0.85] uppercase">
                            Génese do <br />
                            <span className="text-brand-primary italic font-serif lowercase font-normal md:text-[7rem]">Impossível</span>
                        </m.h2>
                    </m.div>

                    <div className="max-w-6xl mx-auto space-y-32 md:space-y-64 relative">
                        {/* Central Spine */}
                        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-100 hidden md:block"></div>

                        {timeline.map((item: any, index: number) => (
                            <m.div
                                key={index}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className={`flex flex-col md:flex-row gap-8 md:gap-24 items-center relative ${index % 2 === 0 ? '' : 'md:flex-row-reverse'}`}
                            >
                                <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                                    <m.span
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        whileInView={{ opacity: 0.05, scale: 1 }}
                                        className="text-brand-primary text-[10rem] md:text-[15rem] font-black leading-none block mb-[-2rem] md:-mb-24 pointer-events-none select-none"
                                    >
                                        {item.date?.slice(-2) || item.year?.slice(-2)}
                                    </m.span>
                                    <div className="relative z-10 px-4">
                                        <h3 className="text-3xl md:text-5xl font-black text-brand-dark mb-6 uppercase tracking-tighter">{item.title}</h3>
                                        <p className="text-gray-500 font-medium text-lg md:text-xl leading-relaxed max-w-lg mx-auto md:mx-0 ${index % 2 === 0 ? 'md:ml-auto' : ''}">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>

                                <div className="w-10 h-10 rounded-2xl bg-brand-dark border-4 border-brand-primary shadow-2xl shrink-0 z-20 hidden md:block group-hover:scale-125 transition-transform duration-700"></div>

                                <div className="flex-1 hidden md:block"></div>
                            </m.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 6. POWER STATS */}
            <section className="py-32 md:py-64 bg-brand-dark text-white relative overflow-hidden">
                <div className="container mx-auto px-6 md:px-12 relative z-10">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 md:gap-32">
                        {stats.map((stat: any, index: number) => {
                            const StatIcon = stat.icon || BookOpen;
                            return (
                                <m.div
                                    key={index}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="text-center group"
                                >
                                    <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center mx-auto mb-10 group-hover:bg-brand-primary group-hover:scale-110 transition-all duration-700 shadow-2xl">
                                        <StatIcon className="w-10 h-10 text-brand-primary group-hover:text-white" />
                                    </div>
                                    <div className="text-5xl md:text-8xl font-black text-white tracking-tighter mb-4 leading-none group-hover:text-brand-primary transition-colors">
                                        {stat.number}
                                    </div>
                                    <div className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-500 group-hover:text-white transition-colors">
                                        {stat.label}
                                    </div>
                                </m.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* 7. FINAL CTA */}
            <section className="py-32 md:py-64 bg-white relative">
                <div className="container mx-auto px-6 md:px-12 text-center relative z-10">
                    <m.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="max-w-6xl mx-auto space-y-20"
                    >
                        <h2 className="text-6xl md:text-[10rem] font-black text-brand-dark tracking-tighter leading-[0.8] uppercase">
                            Faça Parte <br />
                            <span className="text-brand-primary italic font-serif lowercase font-normal md:text-[9rem]">do Futuro</span>
                        </h2>

                        <div className="flex flex-col sm:flex-row gap-10 justify-center items-center">
                            <button
                                onClick={() => navigate('/contacto')}
                                className="w-full sm:w-auto px-20 py-10 bg-brand-dark text-white font-black rounded-2xl hover:bg-brand-primary hover:scale-105 active:scale-95 transition-all text-[11px] uppercase tracking-[0.5em] shadow-2xl flex items-center justify-center gap-6 group"
                                title="Iniciar Parceria Editorial de Alta Performance"
                                aria-label="Iniciar Parceria Editorial de Alta Performance"
                            >
                                Iniciar Parceria
                                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                            </button>

                            <button
                                onClick={() => navigate('/livros')}
                                className="w-full sm:w-auto px-20 py-10 bg-white border-2 border-brand-dark text-brand-dark font-black rounded-2xl hover:bg-gray-50 hover:scale-105 active:scale-95 transition-all text-[11px] uppercase tracking-[0.5em] flex items-center justify-center gap-6 group"
                                title="Ver Catálogo de Atemporal"
                                aria-label="Ver Catálogo de Atemporal"
                            >
                                Ver Acervo <ArrowUpRight className="w-6 h-6" />
                            </button>
                        </div>
                    </m.div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
