import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    BookOpen, Heart, Award, Users, MapPin, Loader2,
    Sparkles, Target, Zap, ArrowRight, Quote, Star,
    ArrowUpRight, TrendingUp, History, Globe, Shield,
    Feather, Palette, Coffee, ChevronRight
} from 'lucide-react';
import { m, Variants, AnimatePresence } from 'framer-motion';
import { getSiteContent } from '../services/dataService';
import { PageHero } from '../components/PageHero';
import SEO from '../components/SEO';
import { OptimizedImage } from '../components/OptimizedImage';
import niltonGracaImg from '../assets/imagens/niltongraca.png';

const HeritagePage: React.FC = () => {
    const navigate = useNavigate();
    const [siteContent, setSiteContent] = useState<any>({});
    const [isLoading, setIsLoading] = useState(true);

    const iconMap: Record<string, any> = {
        'BookOpen': BookOpen,
        'Heart': Heart,
        'Award': Award,
        'Users': Users,
        'TrendingUp': TrendingUp,
        'Target': Target,
        'Sparkles': Sparkles,
        'Zap': Zap,
        'Star': Star,
        'MapPin': MapPin
    };

    useEffect(() => {
        const loadContent = async () => {
            setIsLoading(true);
            try {
                const content = await getSiteContent('about');
                setSiteContent(content);
            } catch (error) {
                console.error("Erro ao carregar conteúdo institucional:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadContent();
    }, []);

    const timeline = siteContent['about.timeline'] || [
        { year: '2020', title: 'A Génese', desc: 'Fundação por Nilton Graça, unindo design e literatura.' },
        { year: '2021', title: 'Ascensão Digital', desc: 'Primeiras edições sob o selo de vanguardismo.' },
        { year: '2023', title: 'Consolidação', desc: 'Marca de 26+ obras e 18 províncias alcançadas.' },
        { year: '2026', title: 'O Futuro', desc: 'Reestruturação premium e expansão para o mercado global.' }
    ];

    return (
        <div className="min-h-screen bg-white selection:bg-brand-primary selection:text-white">
            <SEO
                title="A Nossa Herança"
                description="Conheça a visão e a história da Editora Graça. A casa editorial que está a redefinir o cânone literário angolano."
            />

            <PageHero
                title={<>Sobre <br /><span className="text-brand-primary italic font-serif font-normal lowercase text-4xl sm:text-6xl md:text-8xl">Nós</span></>}
                subtitle="Não somos apenas uma editora; somos os arquitetos de um novo renascimento intelectual angolano, onde a estética e o rigor convergem."
                breadcrumb={[{ label: 'Nossa História' }]}
                decorativeText="SOBRE NÓS"
                titleClassName="text-4xl sm:text-5xl md:text-7xl lg:text-[10rem] font-black uppercase leading-[0.8] tracking-tighter mb-4"
            />

            {/* Cinematic Storytelling Section */}
            <section className="py-32 bg-white relative overflow-hidden">
                <div className="container mx-auto px-6 md:px-12">
                    <div className="grid lg:grid-cols-2 gap-24 items-center">
                        <div className="space-y-12">
                            <span className="text-brand-primary font-black text-xs uppercase tracking-[0.5em]">A Nossa Razão de Ser</span>
                            <h2 className="text-5xl md:text-7xl font-black text-brand-dark uppercase tracking-tighter leading-none">
                                Curadoria de <span className="text-brand-primary italic font-serif lowercase font-normal">Obra-Prima</span>
                            </h2>
                            <p className="text-xl md:text-2xl text-gray-500 font-medium leading-relaxed">
                                Nascida da interseção entre o design editorial de elite e a paixão pelas letras angolanas, a Editora Graça surgiu para preencher um vazio: a necessidade de livros que fossem objetos de arte e veículos de pensamento crítico.
                            </p>
                            <div className="flex gap-12">
                                <div className="space-y-2">
                                    <p className="text-4xl font-black text-brand-dark">26+</p>
                                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Obras Imortalizadas</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-4xl font-black text-brand-dark">100%</p>
                                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Talento Lusófono</p>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="aspect-square bg-gray-100 rounded-[5rem] overflow-hidden rotate-3 hover:rotate-0 transition-transform duration-1000 shadow-3xl">
                                <OptimizedImage
                                    src="https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80"
                                    alt="Editora Graça Essence"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-brand-dark p-10 rounded-[3rem] text-white shadow-2xl -rotate-6 hidden md:block">
                                <Quote className="w-10 h-10 text-brand-primary mb-4" />
                                <p className="text-xs font-medium leading-relaxed italic">"Construímos o palco para o génio literário angolano brilhar globalmente."</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Values Carousel-like section */}
            <section className="py-32 bg-brand-dark text-white">
                <div className="container mx-auto px-6 md:px-12">
                    <div className="text-center mb-24 space-y-6">
                        <span className="text-brand-primary font-black text-xs uppercase tracking-[0.5em]">Valores Inegociáveis</span>
                        <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter">O Nosso <span className="text-brand-primary italic font-serif lowercase font-normal">ADN</span></h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12">
                        {[
                            { title: 'Estética Radical', icon: Palette, desc: 'Acreditamos que a beleza é a porta de entrada para a sabedoria intelectual.' },
                            { title: 'Rigor Editorial', icon: Shield, desc: 'Cada vírgula é auditada para garantir o padrão internacional de excelência.' },
                            { title: 'Vanguarda Digital', icon: Zap, desc: 'Exploramos novas fronteiras de leitura num mundo em constante mutação.' }
                        ].map((val, i) => (
                            <m.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="p-12 bg-white/5 rounded-[4rem] border border-white/10 hover:bg-brand-primary/10 transition-all group"
                            >
                                <val.icon className="w-12 h-12 text-brand-primary mb-10 group-hover:scale-125 transition-transform duration-500" />
                                <h3 className="text-3xl font-black uppercase tracking-tight mb-4">{val.title}</h3>
                                <p className="text-gray-400 font-medium leading-relaxed">{val.desc}</p>
                            </m.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Timeline Experience */}
            <section className="py-32 bg-white overflow-hidden">
                <div className="container mx-auto px-6 md:px-12">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center gap-10 mb-24">
                            <History className="w-12 h-12 text-brand-primary" />
                            <h2 className="text-4xl md:text-6xl font-black text-brand-dark uppercase tracking-tighter">A Jornada do <span className="text-brand-primary">Tempo</span></h2>
                        </div>

                        <div className="space-y-24 relative">
                            {/* Visual Line */}
                            <div className="absolute left-10 top-0 bottom-0 w-px bg-gray-100 md:left-1/2"></div>

                            {timeline.map((event: any, i: number) => (
                                <m.div
                                    key={i}
                                    initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    className={`relative flex flex-col md:flex-row gap-12 items-center ${i % 2 === 0 ? '' : 'md:flex-row-reverse'}`}
                                >
                                    <div className={`flex-1 ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'} pl-20 md:pl-0`}>
                                        <p className="text-5xl md:text-8xl font-black text-gray-100 mb-2 italic font-serif group-hover:text-brand-primary/20 transition-colors">{event.year || event.date}</p>
                                        <h4 className="text-2xl font-black text-brand-dark uppercase tracking-tight mb-4">{event.title}</h4>
                                        <p className="text-gray-500 font-medium leading-relaxed max-w-sm mx-auto md:mx-0">
                                            {event.description || event.desc}
                                        </p>
                                    </div>
                                    <div className="absolute left-7 md:static w-6 h-6 bg-brand-dark border-4 border-brand-primary rounded-full z-10 shadow-2xl"></div>
                                    <div className="flex-1 hidden md:block"></div>
                                </m.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Founder Spotlight */}
            <section className="py-32 bg-brand-light relative">
                <div className="container mx-auto px-6 md:px-12">
                    <div className="bg-white rounded-[5rem] p-12 md:p-32 shadow-3xl overflow-hidden relative border border-gray-100">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/10 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2"></div>

                        <div className="grid lg:grid-cols-2 gap-24 items-center">
                            <div className="order-2 lg:order-1 space-y-12">
                                <div className="space-y-4">
                                    <p className="text-brand-primary font-black text-[10px] uppercase tracking-[0.5em]">O Visionário</p>
                                    <h2 className="text-5xl md:text-8xl font-black text-brand-dark uppercase tracking-tighter leading-none">
                                        Nilton <br />Graça
                                    </h2>
                                </div>
                                <p className="text-2xl font-serif italic text-gray-500 leading-relaxed">
                                    "A literatura angolana é um gigante adormecido. A minha missão é acordá-lo com a dignidade e a estética que o nosso povo merece."
                                </p>
                                <div className="space-y-2">
                                    <p className="text-brand-dark font-black uppercase text-xs tracking-widest">Fundador & Diretor Criativo</p>
                                    <div className="w-20 h-1 bg-brand-primary"></div>
                                </div>
                            </div>
                            <div className="order-1 lg:order-2">
                                <div className="aspect-[4/5] bg-gray-100 rounded-[4rem] overflow-hidden grayscale hover:grayscale-0 transition-all duration-1000 shadow-2xl scale-95 hover:scale-100 relative">
                                    <OptimizedImage
                                        src={niltonGracaImg}
                                        alt="Nilton Graça"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-32 bg-white">
                <div className="container mx-auto px-6 md:px-12 text-center">
                    <div className="max-w-4xl mx-auto space-y-12">
                        <Star className="w-16 h-16 text-brand-primary mx-auto animate-pulse" />
                        <h2 className="text-6xl md:text-9xl font-black text-brand-dark uppercase tracking-tighter leading-none">Faça <span className="text-brand-primary">História</span> Connosco</h2>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                            <button
                                onClick={() => navigate('/contacto')}
                                className="px-16 py-10 bg-brand-dark text-white rounded-[2rem] font-black uppercase text-xs tracking-[0.4em] hover:bg-brand-primary hover:scale-105 transition-all shadow-2xl flex items-center gap-6 group"
                            >
                                Seja Autor Graça
                                <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                            </button>
                            <button
                                onClick={() => navigate('/livros')}
                                className="px-16 py-10 bg-white border-2 border-brand-dark text-brand-dark rounded-[2rem] font-black uppercase text-xs tracking-[0.4em] hover:bg-gray-50 hover:scale-105 transition-all flex items-center gap-6"
                            >
                                Ver Acervo <ArrowUpRight className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HeritagePage;
