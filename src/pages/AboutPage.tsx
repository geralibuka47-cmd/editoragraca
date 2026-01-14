import React, { useState, useEffect } from 'react';
import { BookOpen, Heart, Award, Users, TrendingUp, MapPin, Mail, Phone, Loader2, Sparkles, Target, Zap, ArrowRight, Quote, Star } from 'lucide-react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { ViewState } from '../types';
import { getSiteContent } from '../services/dataService';

interface AboutPageProps {
    onNavigate: (view: ViewState) => void;
}

const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
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
        <div className="min-h-screen bg-white overflow-x-hidden">
            {/* Premium Hero Section */}
            <section className="relative min-h-[80vh] flex items-center bg-brand-dark text-white py-20 overflow-hidden">
                {/* Visual Elements */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-brand-primary/10 to-transparent"></div>
                <motion.div
                    initial={{ opacity: 0, rotate: -30 }}
                    animate={{ opacity: 1, rotate: -30 }}
                    transition={{ duration: 2 }}
                    className="absolute -top-40 -right-20 w-[600px] h-[600px] bg-brand-primary/5 rounded-[100px] blur-[120px]"
                ></motion.div>
                <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-primary/30 to-transparent"></div>

                <div className="container mx-auto px-4 md:px-8 relative z-10">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                        className="max-w-5xl"
                    >
                        <motion.div variants={itemVariants} className="flex items-center gap-3 text-brand-primary uppercase tracking-[0.4em] font-black text-[10px] md:text-sm mb-10">
                            <div className="w-12 h-px bg-brand-primary"></div>
                            <span>Sobre a Editora Graça</span>
                        </motion.div>

                        <motion.h1 variants={itemVariants} className="text-5xl md:text-[8rem] font-black tracking-tighter mb-10 leading-[0.85]">
                            Onde Cada Página <br />
                            <span className="text-brand-primary italic font-serif font-normal">Cria Futuro</span>
                        </motion.h1>

                        <motion.p variants={itemVariants} className="text-xl md:text-3xl text-gray-400 leading-relaxed font-medium max-w-3xl mb-12">
                            Transformamos manuscritos em legados. Uma casa editorial angolana comprometida com a <span className="text-white">excelência literária</span> e o impacto cultural.
                        </motion.p>

                        <motion.div variants={itemVariants} className="flex flex-wrap gap-6">
                            <div className="flex -space-x-4">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="w-14 h-14 rounded-full border-4 border-brand-dark bg-gray-800 flex items-center justify-center overflow-hidden">
                                        <Users className="w-6 h-6 text-gray-500" />
                                    </div>
                                ))}
                            </div>
                            <div className="flex flex-col justify-center">
                                <span className="text-white font-black text-lg">Comunidade de Autores</span>
                                <span className="text-brand-primary text-xs font-bold uppercase tracking-widest">+100 Escritores Parceiros</span>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Mission/Vision/Purpose Grid */}
            <section className="py-32 bg-white relative">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="grid lg:grid-cols-3 gap-10 md:gap-16">
                        {[
                            {
                                icon: Target,
                                label: 'Missão',
                                title: 'Democratizar o Acesso',
                                description: 'Tornar a literatura de qualidade acessível a todos os angolanos, independentemente da sua localização.'
                            },
                            {
                                icon: Sparkles,
                                label: 'Propósito',
                                title: 'Inovação Literária',
                                description: 'Unir o design editorial moderno à profundidade das narrativas tradicionais angolanas.'
                            },
                            {
                                icon: Zap,
                                label: 'Impacto',
                                title: 'Transformação Social',
                                description: 'Usar a palavra escrita como motor de mudança intelectual e preservação da memória colectiva.'
                            }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={itemVariants}
                                className="group space-y-8"
                            >
                                <div className="w-20 h-20 bg-brand-light rounded-[2.5rem] flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all duration-500 group-hover:rotate-6">
                                    <item.icon className="w-10 h-10" />
                                </div>
                                <div className="space-y-4">
                                    <span className="text-brand-primary font-black uppercase tracking-[0.3em] text-[10px]">{item.label}</span>
                                    <h2 className="text-3xl font-black text-brand-dark tracking-tight">{item.title}</h2>
                                    <p className="text-gray-500 leading-relaxed text-lg">{item.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Values Section with Premium Cards */}
            <section className="py-32 bg-brand-light relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white to-transparent"></div>

                <div className="container mx-auto px-4 md:px-8 relative z-10">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={containerVariants}
                        className="text-center max-w-4xl mx-auto mb-24"
                    >
                        <motion.h2 variants={itemVariants} className="text-4xl md:text-7xl font-black text-brand-dark tracking-tighter mb-8">
                            Os Valores que <br />
                            <span className="text-brand-primary italic font-serif font-normal">Nos Movem</span>
                        </motion.h2>
                        <motion.p variants={itemVariants} className="text-xl text-gray-500 font-medium">
                            Na Editora Graça, cada detalhe é pautado por princípios que garantem a excelência da sua obra.
                        </motion.p>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
                        {values.map((value: any, index: number) => {
                            const Icon = iconMap[value.icon] || BookOpen;
                            return (
                                <motion.div
                                    key={index}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    variants={itemVariants}
                                    className="bg-white p-10 rounded-[3rem] border-2 border-transparent hover:border-brand-primary/20 shadow-2xl shadow-brand-dark/5 hover:shadow-brand-primary/10 transition-all duration-500 group"
                                >
                                    <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mb-10 group-hover:bg-brand-primary transition-all duration-500 group-hover:scale-110">
                                        <Icon className="w-10 h-10 text-brand-primary group-hover:text-white transition-colors" />
                                    </div>
                                    <h3 className="text-2xl font-black text-brand-dark mb-4">{value.title}</h3>
                                    <p className="text-gray-500 leading-relaxed font-medium">{value.description}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Founder's Quote */}
            <section className="py-32 bg-white overflow-hidden">
                <div className="container mx-auto px-4 md:px-8">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative bg-brand-dark rounded-[4rem] p-12 md:p-24 overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-primary/10 -skew-x-12 translate-x-20"></div>
                        <Quote className="absolute top-10 left-10 w-32 h-32 text-white/5" />

                        <div className="relative z-10 grid md:grid-cols-2 gap-16 items-center">
                            <div className="space-y-10">
                                <h3 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight italic font-serif">
                                    "Acreditamos que todo autor angolano merece um palco à altura do seu talento."
                                </h3>
                                <div className="space-y-2">
                                    <p className="text-brand-primary font-black text-xl uppercase tracking-widest">Nilton Graça</p>
                                    <p className="text-gray-400 font-bold uppercase tracking-[0.3em] text-[10px]">Fundador & Designer Literário</p>
                                </div>
                            </div>
                            <div className="relative">
                                <div className="aspect-square bg-brand-primary rounded-full blur-[80px] absolute inset-0 opacity-20"></div>
                                <div className="relative z-10 border-8 border-white/5 rounded-[3rem] overflow-hidden aspect-[4/5] bg-gray-900 flex items-center justify-center">
                                    <Users className="w-32 h-32 text-white/10" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Enhanced Timeline */}
            <section className="py-32 bg-brand-light">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="text-center mb-24">
                        <h2 className="text-4xl md:text-7xl font-black text-brand-dark tracking-tighter mb-8">
                            Nossa <span className="text-brand-primary italic font-serif font-normal">Jornada</span>
                        </h2>
                        <div className="w-32 h-2 bg-brand-primary mx-auto rounded-full"></div>
                    </div>

                    <div className="max-w-6xl mx-auto relative px-4">
                        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-brand-primary via-brand-primary/20 to-transparent -translate-x-1/2"></div>

                        <div className="space-y-32">
                            {timeline.map((item: any, index: number) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    transition={{ duration: 0.8 }}
                                    className={`relative flex flex-col md:flex-row items-start gap-12 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                                >
                                    {/* Year Badge */}
                                    <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-24 h-24 bg-white border-8 border-brand-light rounded-full items-center justify-center z-20 shadow-xl group">
                                        <div className="w-16 h-16 bg-brand-dark text-brand-primary rounded-full flex items-center justify-center font-black text-xl group-hover:bg-brand-primary group-hover:text-white transition-all duration-500">
                                            {item.year.slice(2)}
                                        </div>
                                    </div>

                                    {/* Content Card */}
                                    <div className={`flex-1 w-full ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                                        <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl shadow-brand-dark/5 hover:scale-105 transition-all duration-500 border border-gray-50">
                                            <span className="text-brand-primary font-black text-5xl opacity-20 block mb-6">{item.year}</span>
                                            <h3 className="text-3xl font-black text-brand-dark mb-6">{item.title}</h3>
                                            <p className="text-gray-500 text-lg leading-relaxed font-medium">{item.description}</p>
                                        </div>
                                    </div>
                                    <div className="flex-1 hidden md:block"></div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats - Dynamic Counter Style */}
            <section className="py-32 bg-brand-dark text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_white_1px,_transparent_1px)] bg-[length:40px_40px]"></div>
                </div>

                <div className="container mx-auto px-4 md:px-8 relative z-10">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 md:gap-24">
                        {stats.map((stat: any, index: number) => {
                            const StatIcon = stat.icon || BookOpen;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="text-center space-y-6 group"
                                >
                                    <div className="w-20 h-20 bg-brand-primary/20 rounded-3xl flex items-center justify-center mx-auto group-hover:scale-125 transition-transform duration-500">
                                        <StatIcon className="w-10 h-10 text-brand-primary" />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="text-5xl md:text-8xl font-black text-white tracking-tighter">
                                            {stat.number}
                                        </div>
                                        <div className="text-xs md:text-sm uppercase tracking-[0.4em] text-brand-primary font-black">
                                            {stat.label}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Contact Info - Minimalist Premium */}
            <section className="py-32 bg-white">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="grid lg:grid-cols-2 gap-24 items-center">
                        <div className="space-y-12">
                            <h2 className="text-4xl md:text-7xl font-black text-brand-dark tracking-tighter">
                                Onde as Ideias <br />
                                <span className="text-brand-primary italic font-serif font-normal">Se Encontram</span>
                            </h2>
                            <p className="text-xl text-gray-500 font-medium leading-relaxed">
                                Estamos localizados no coração de Malanje, prontos para receber o seu manuscrito ou discutir a sua próxima leitura.
                            </p>

                            <div className="space-y-10">
                                {[
                                    { icon: MapPin, title: 'Sede Social', content: 'Malanje, Bairro Voanvala, Rua 5, Casa n.º 77, Angola' },
                                    { icon: Phone, title: 'Linha Direta', content: '+244 973 038 386' },
                                    { icon: Mail, title: 'Email Geral', content: 'geraleditoragraca@gmail.com' }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-8 group">
                                        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-brand-primary transition-colors duration-500">
                                            <item.icon className="w-7 h-7 text-brand-primary group-hover:text-white" />
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="text-xs font-black uppercase tracking-widest text-brand-dark">{item.title}</h4>
                                            <p className="text-lg text-gray-500 font-medium">{item.content}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative group">
                            <div className="absolute inset-0 bg-brand-primary rounded-[4rem] rotate-3 opacity-10 group-hover:rotate-6 transition-transform duration-700"></div>
                            <div className="relative z-10 aspect-square bg-brand-dark rounded-[4rem] overflow-hidden p-2">
                                <div className="w-full h-full rounded-[3.5rem] bg-gray-900 border-4 border-white/5 flex items-center justify-center">
                                    <MapPin className="w-24 h-24 text-brand-primary/20 animate-bounce" />
                                </div>
                            </div>
                            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-brand-primary rounded-full blur-[80px] opacity-20"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Premium CTA */}
            <section className="py-32 bg-brand-light relative overflow-hidden">
                <div className="container mx-auto px-4 md:px-8 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-4xl mx-auto space-y-12"
                    >
                        <h2 className="text-4xl md:text-8xl font-black text-brand-dark tracking-tighter leading-[0.9]">
                            Escreva o Próximo <br />
                            <span className="text-brand-primary italic font-serif font-normal">Capítulo Connosco</span>
                        </h2>
                        <p className="text-xl md:text-2xl text-gray-600 font-medium">
                            Seja através de uma parceria ou da publicação do seu primeiro livro, <br className="hidden md:block" /> estamos aqui para tornar a sua visão realidade.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6 justify-center">
                            <button
                                onClick={() => onNavigate('CONTACT')}
                                className="px-12 py-6 bg-brand-primary text-white font-black rounded-2xl hover:scale-105 active:scale-95 transition-all uppercase tracking-widest text-xs shadow-2xl shadow-brand-primary/30"
                            >
                                Iniciar Projecto
                                <ArrowRight className="w-5 h-5 inline-block ml-3" />
                            </button>
                            <button
                                onClick={() => onNavigate('SERVICES')}
                                className="px-12 py-6 bg-brand-dark text-white font-black rounded-2xl hover:scale-105 active:scale-95 transition-all uppercase tracking-widest text-xs shadow-2xl shadow-brand-dark/30"
                            >
                                Ver Nossos Serviços
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
