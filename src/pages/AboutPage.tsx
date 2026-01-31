import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Heart, Award, Users, TrendingUp, MapPin, Mail, Phone, Loader2, Sparkles, Target, Zap, ArrowRight, Quote, Star } from 'lucide-react';
import { m, AnimatePresence, Variants } from 'framer-motion';
import { ViewState } from '../types';
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
            <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-brand-light">
                <Loader2 className="w-12 h-12 text-brand-primary animate-spin" />
                <p className="text-gray-400 font-serif italic text-lg animate-pulse">Carregando a nossa história...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] overflow-x-hidden">
            {/* Nav Padding Spacer */}
            <div className="h-[120px] lg:h-[128px] bg-brand-dark"></div>

            {/* Premium Hero Section - Ultra Deep Immersive */}
            <section className="relative min-h-screen flex items-center bg-brand-dark text-white pt-24 pb-48 md:pb-64 overflow-hidden">
                {/* Visual Elements */}
                <m.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 2 }}
                    className="absolute top-0 right-0 w-[90%] aspect-square bg-[#C4A052]/5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/4"
                ></m.div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(196,160,82,0.1)_0%,_transparent_70%)]"></div>

                <div className="container mx-auto px-6 md:px-8 relative z-10 text-center lg:text-left">
                    <m.div
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                        className="max-w-6xl"
                    >
                        <m.div variants={itemVariants} className="inline-flex items-center gap-4 px-6 py-2.5 bg-white/5 backdrop-blur-xl rounded-full border border-white/10 text-brand-primary font-black text-[10px] md:text-xs uppercase tracking-[0.5em] mb-12">
                            <Sparkles className="w-4 h-4" />
                            <span>Vanguardismo Literário Angolano</span>
                        </m.div>

                        <m.h1 variants={itemVariants} className="text-4xl sm:text-5xl md:text-8xl lg:text-[7rem] font-black tracking-tighter mb-8 md:mb-10 leading-[0.9] uppercase">
                            Onde a Arte <br />
                            <span className="text-gradient-gold italic font-serif lowercase font-normal">Se Eterniza</span>
                        </m.h1>

                        <m.p variants={itemVariants} className="text-lg md:text-2xl text-gray-400 font-medium leading-relaxed max-w-4xl mx-auto lg:mx-0 mb-16 opacity-90">
                            Uma casa editorial de elite comprometida com a sofisticação intelectual e a preservação do <span className="text-white">património cultural</span> através da curadoria literária de alta performance.
                        </m.p>

                        <m.div variants={itemVariants} className="flex flex-wrap justify-center lg:justify-start gap-12 items-center">
                            <div className="flex -space-x-4">
                                {[26, 27, 28, 29].map(i => (
                                    <div key={i} className="w-20 h-20 rounded-2xl border-4 border-brand-dark bg-gray-800 overflow-hidden shadow-2xl grayscale hover:grayscale-0 transition-all duration-700">
                                        <img src={`https://i.pravatar.cc/100?img=${i}`} alt="Autor de Elite" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                            <div className="text-left py-2 px-6 border-l border-white/10">
                                <span className="text-white font-black text-2xl tracking-tighter block">Ecossistema de Elite</span>
                                <span className="text-brand-primary text-[10px] font-black uppercase tracking-[0.4em]">Propulsão Literária Mundial</span>
                            </div>
                        </m.div>
                    </m.div>
                </div>
            </section>

            {/* Mission/Vision/Purpose Grid - Redesigned for Impact */}
            <section className="py-24 md:py-48 -mt-32 md:-mt-48 relative z-20 optimize-render">
                <div className="container mx-auto px-6 md:px-8">
                    <div className="grid lg:grid-cols-3 gap-12 md:gap-16">
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
                                className="glass-premium p-16 rounded-[4rem] border border-white shadow-2xl hover:-translate-y-4 transition-all duration-700 group flex flex-col items-center text-center"
                            >
                                <div className="w-24 h-24 bg-brand-dark text-brand-primary rounded-[2rem] flex items-center justify-center mb-12 group-hover:bg-brand-primary group-hover:text-white transition-all duration-500 group-hover:rotate-12 shadow-2xl">
                                    <item.icon className="w-12 h-12" />
                                </div>
                                <div className="space-y-6">
                                    <span className="text-brand-primary font-black uppercase tracking-[0.5em] text-[10px] block">{item.label}</span>
                                    <h2 className="text-3xl font-black text-brand-dark tracking-tighter uppercase leading-none">{item.title}</h2>
                                    <p className="text-reading group-hover:opacity-100 transition-opacity duration-700">{item.description}</p>
                                </div>
                            </m.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Values Section - Premium Design */}
            <section className="py-32 md:py-64 bg-white relative overflow-hidden">
                <m.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="absolute -left-20 top-40 w-80 h-80 bg-brand-primary/5 rounded-full blur-[100px]"
                ></m.div>

                <div className="container mx-auto px-6 md:px-8 relative z-10">
                    <m.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={containerVariants}
                        className="text-center max-w-5xl mx-auto mb-32"
                    >
                        <span className="text-brand-primary font-black text-xs uppercase tracking-[0.5em] mb-8 block">Nossa Bússola Ética</span>
                        <m.h2 variants={itemVariants} className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-brand-dark tracking-tighter mb-8 md:mb-10 uppercase leading-[0.9]">
                            Pilares de <br />
                            <span className="text-gradient-gold italic font-serif font-normal lowercase">Prestígio</span>
                        </m.h2>
                        <div className="w-32 h-2 bg-brand-primary mx-auto rounded-full"></div>
                    </m.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                        {values.map((value: any, index: number) => {
                            const Icon = iconMap[value.icon] || BookOpen;
                            return (
                                <m.div
                                    key={index}
                                    variants={itemVariants}
                                    className="p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] border border-gray-100 hover:border-brand-primary/40 hover:bg-gray-50 transition-all duration-700 group flex flex-col items-center text-center"
                                >
                                    <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-50 rounded-[1.2rem] md:rounded-[1.5rem] flex items-center justify-center mb-8 md:mb-10 group-hover:bg-brand-primary transition-all duration-500 shadow-xl border border-gray-100/50">
                                        <Icon className="w-8 h-8 md:w-10 md:h-10 text-brand-primary group-hover:text-white" />
                                    </div>
                                    <h3 className="text-xl md:text-2xl font-black text-brand-dark mb-4 md:mb-6 tracking-tighter uppercase leading-none">{value.title}</h3>
                                    <p className="text-reading">{value.description}</p>
                                </m.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Founder's Master Quote - Cinematic Design */}
            <section className="py-32 md:py-64 bg-brand-dark relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(196,160,82,0.1)_0%,_transparent_100%)]"></div>

                <div className="container mx-auto px-6 md:px-8">
                    <m.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                        className="relative glass-premium p-12 md:p-32 rounded-[5rem] border border-white/5 overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/5 to-transparent"></div>
                        <Quote className="absolute top-16 left-16 w-32 h-32 text-white/5 opacity-10" />

                        <div className="grid lg:grid-cols-2 gap-24 items-center relative z-10">
                            <div className="space-y-16">
                                <h3 className="text-3xl sm:text-4xl md:text-6xl font-black text-white tracking-tighter leading-[1] font-serif italic">
                                    "Acreditamos que o talento angolano não merece apenas uma voz; merece um <span className="text-gradient-gold">palco mundial</span> de magnitude absoluta."
                                </h3>

                                <div className="flex items-center gap-10">
                                    <div className="w-24 h-[2px] bg-brand-primary rounded-full"></div>
                                    <div>
                                        <p className="text-white font-black text-4xl tracking-tighter uppercase">Nilton Graça</p>
                                        <p className="text-brand-primary text-[11px] font-black uppercase tracking-[0.5em] mt-2">Visionário & Mentor Editorial</p>
                                    </div>
                                </div>
                            </div>

                            <div className="relative group cursor-none">
                                <m.div
                                    animate={{
                                        scale: [1, 1.05, 1],
                                        rotate: [0, 2, 0]
                                    }}
                                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                                    className="relative z-10 aspect-square lg:aspect-[4/5] bg-gray-900 rounded-[4rem] border border-white/10 flex items-center justify-center overflow-hidden shadow-2xl group-hover:border-brand-primary/50 transition-colors"
                                >
                                    <div className="absolute inset-0 bg-brand-primary/10 mix-blend-overlay"></div>
                                    <Users className="w-48 h-48 text-white/5 group-hover:scale-110 transition-transform duration-1000" />
                                    <div className="absolute inset-x-0 bottom-0 p-12 bg-gradient-to-t from-brand-dark to-transparent">
                                        <p className="text-white/60 font-black text-[10px] uppercase tracking-[0.4em] text-center">Essência do Autor</p>
                                    </div>
                                </m.div>
                                {/* Floating elements */}
                                <div className="absolute -top-12 -right-12 w-48 h-48 bg-brand-primary/20 blur-[60px] rounded-full group-hover:bg-brand-primary/40 transition-all"></div>
                            </div>
                        </div>
                    </m.div>
                </div>
            </section>

            {/* Timeline - Sophisticated Visual Narrative */}
            <section className="py-32 md:py-64 bg-white relative">
                <div className="container mx-auto px-6 md:px-8">
                    <m.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={containerVariants}
                        className="text-center mb-48"
                    >
                        <span className="text-brand-primary font-black text-xs uppercase tracking-[0.5em] mb-8 block">A Jornada do Sucesso</span>
                        <m.h2 variants={itemVariants} className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-brand-dark tracking-tighter mb-8 md:mb-10 uppercase leading-[0.9]">
                            Evolução do <br />
                            <span className="text-gradient-gold italic font-serif font-normal lowercase">Impossível</span>
                        </m.h2>
                        <div className="w-32 h-2 bg-brand-primary mx-auto rounded-full"></div>
                    </m.div>

                    <div className="max-w-6xl mx-auto space-y-24 md:space-y-40 relative">
                        {/* Central Line */}
                        <div className="absolute left-[50%] top-0 bottom-0 w-[1px] bg-gray-100 hidden md:block"></div>

                        {timeline.map((item: any, index: number) => (
                            <m.div
                                key={index}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className={`flex flex-col md:flex-row gap-8 md:gap-20 items-center relative ${index % 2 === 0 ? '' : 'md:flex-row-reverse'}`}
                            >
                                <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                                    <m.span
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        whileInView={{ opacity: 0.1, scale: 1 }}
                                        className="text-brand-primary text-[5rem] sm:text-[8rem] md:text-[10rem] font-black leading-none block mb-[-1rem] md:-mb-12"
                                    >
                                        {item.date?.slice(-2) || item.year?.slice(-2)}
                                    </m.span>
                                    <div className="relative z-10 text-center md:text-inherit px-4 md:px-0">
                                        <h3 className="text-2xl md:text-4xl font-black text-brand-dark mb-4 md:mb-6 uppercase tracking-tighter">{item.title}</h3>
                                        <p className="text-gray-500 font-bold text-base md:text-lg leading-relaxed max-w-lg mx-auto md:mx-0 ${index % 2 === 0 ? 'md:ml-auto' : ''}">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                                <div className="w-8 h-8 md:w-10 md:h-10 rounded-[1rem] md:rounded-[1.5rem] bg-brand-dark border-4 border-brand-primary shadow-[0_0_40px_rgba(196,160,82,0.4)] shrink-0 z-20 hidden md:block transition-transform duration-500"></div>
                                <div className="flex-1 hidden md:block px-12">
                                    <div className="w-full h-px bg-gray-100 relative">
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-gray-200 rounded-full"></div>
                                    </div>
                                </div>
                            </m.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* High impact Stats - Power Grid */}
            <section className="py-32 md:py-64 bg-brand-dark text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_30%,_rgba(196,160,82,0.05)_0%,_transparent_70%)]"></div>

                <div className="container mx-auto px-6 md:px-8 relative z-10">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-16 md:gap-32">
                        {stats.map((stat: any, index: number) => {
                            const StatIcon = stat.icon || BookOpen;
                            return (
                                <m.div
                                    key={index}
                                    variants={itemVariants}
                                    className="text-center group"
                                >
                                    <div className="w-24 h-24 glass-premium rounded-[2rem] flex items-center justify-center mx-auto mb-10 group-hover:bg-brand-primary group-hover:scale-110 transition-all duration-700 shadow-2xl border border-white/5">
                                        <StatIcon className="w-12 h-12 text-brand-primary group-hover:text-white" />
                                    </div>
                                    <div className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter mb-4 md:mb-6 leading-none group-hover:text-gradient-gold transition-all">
                                        {stat.number}
                                    </div>
                                    <div className="text-[10px] md:text-[12px] font-black uppercase tracking-[0.5em] text-gray-500 group-hover:text-brand-primary transition-colors">
                                        {stat.label}
                                    </div>
                                </m.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Final Artistic CTA */}
            <section className="py-32 md:py-64 bg-white relative">
                <div className="container mx-auto px-6 md:px-8 text-center relative z-10">
                    <m.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                        className="max-w-6xl mx-auto space-y-20"
                    >
                        <h2 className="text-4xl sm:text-6xl md:text-8xl lg:text-[7.5rem] font-black text-brand-dark tracking-tighter leading-[0.9] uppercase">
                            Vamos Criar <br />
                            <span className="text-gradient-gold italic font-serif lowercase font-normal">Sua História?</span>
                        </h2>

                        <div className="flex flex-col sm:flex-row gap-10 justify-center items-center">
                            <button
                                onClick={() => navigate('/contacto')}
                                className="w-full sm:w-auto px-20 py-10 bg-brand-dark text-white font-black rounded-[2rem] hover:bg-brand-primary hover:scale-105 active:scale-95 transition-all text-xs uppercase tracking-[0.5em] shadow-2xl flex items-center justify-center gap-6 group"
                            >
                                Iniciar Parceria de Elite
                                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                            </button>

                            <button
                                onClick={() => navigate('/livros')}
                                className="w-full sm:w-auto px-20 py-10 glass-premium border border-gray-100 text-brand-dark font-black rounded-[2rem] hover:bg-gray-50 hover:scale-105 active:scale-95 transition-all text-xs uppercase tracking-[0.5em] flex items-center justify-center gap-6"
                            >
                                Ver Curadoria Atual
                                <BookOpen className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="pt-20 border-t border-gray-100">
                            <p className="text-gray-400 font-serif italic text-2xl">"Editora Graça: Onde cada página é um legado eternizado."</p>
                        </div>
                    </m.div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
