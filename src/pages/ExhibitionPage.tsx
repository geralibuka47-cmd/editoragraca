import React, { useState, useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import {
    GraduationCap, PlayCircle, Heart, Zap, Users,
    CheckCircle2, ArrowRight, ArrowUpRight, Mic,
    Star, Sparkles, Target, GraduationCap as AcademiaIcon,
    ChevronRight, Headphones, Radio, Globe, Layers, BookOpen
} from 'lucide-react';
import { getPodcastEpisodes, PodcastEpisode } from '../services/podcastService';
import { PageHero } from '../components/PageHero';
import SEO from '../components/SEO';
import { OptimizedImage } from '../components/OptimizedImage';

const ExhibitionPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'academia' | 'fundacao' | 'play'>('academia');
    const [episodes, setEpisodes] = useState<PodcastEpisode[]>([]);
    const [loadingEpisodes, setLoadingEpisodes] = useState(false);

    useEffect(() => {
        if (activeTab === 'play') {
            const loadEpisodes = async () => {
                setLoadingEpisodes(true);
                try {
                    const data = await getPodcastEpisodes();
                    setEpisodes(data.slice(0, 6));
                } catch (e) {
                    console.error("Erro ao carregar episódios:", e);
                } finally {
                    setLoadingEpisodes(false);
                }
            };
            loadEpisodes();
        }
    }, [activeTab]);

    const tabs = [
        { id: 'academia', label: 'Academia Graça', icon: GraduationCap, color: 'brand-primary' },
        { id: 'fundacao', label: 'Fundação Graça', icon: Heart, color: 'red-500' },
        { id: 'play', label: 'Graça Play', icon: PlayCircle, color: 'brand-primary' }
    ];

    const academiaContent = {
        title: "Academia Graça",
        tagline: "Cultivando o intelecto e a escrita",
        presentation: "A Academia Graça é um projeto educacional e formativo da Editora Graça, criado para orientar escritores de tenra idade e contribuir para a formação intelectual de jovens estudantes.",
        vision: "Tornar-se uma referência em formação de base e orientação educacional em Angola, reconhecida pela qualidade pedagógica.",
        stats: [
            { label: 'Estudantes', val: '5 Ativos', icon: Users },
            { label: 'Foco', val: 'Integral', icon: Target },
            { label: 'Status', val: 'Pedagógico', icon: Radio }
        ],
        pillars: [
            { title: "Escrita Criativa", desc: "Desenvolvimento da voz autoral desde cedo." },
            { title: "Reforço Escolar", desc: "Apoio sistemático nas disciplinas fundamentais." },
            { title: "Mentoria G7", desc: "Acompanhamento individualizado de alta performance." }
        ]
    };

    const playContent = {
        title: "Graça Play",
        tagline: "A Voz da Literatura Africana",
        presentation: "O Graça Play é o nosso hub de áudio e conteúdo multimédia, onde a literatura, a cultura africana e histórias inspiradoras se cruzam.",
        features: [
            "Entrevistas Exclusivas",
            "Debates Literários",
            "Crónicas em Áudio",
            "Resenhas Críticas"
        ]
    };

    return (
        <div className="min-h-screen bg-white selection:bg-brand-primary selection:text-white">
            <SEO
                title="Exposição de Iniciativas"
                description="Conheça a Academia Graça, Fundação Graça e Graça Play. O nosso compromisso com a educação e cultura angolana."
            />

            <PageHero
                title={<>Nosso <br /><span className="text-brand-primary italic font-serif font-normal lowercase text-4xl sm:text-6xl md:text-8xl">Portefólio</span></>}
                subtitle="Além do papel e da tinta, construímos pontes para o conhecimento e ferramentas para a preservação da nossa identidade cultural."
                breadcrumb={[{ label: 'Projetos & Iniciativas' }]}
                decorativeText="IMPACTO"
                titleClassName="text-4xl sm:text-5xl md:text-7xl lg:text-[10rem] font-black uppercase leading-[0.8] tracking-tighter mb-4"
            />

            {/* Navigation / Tab Bar */}
            <div className="sticky top-20 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100 py-6">
                <div className="container mx-auto px-6 md:px-12 flex justify-center gap-4 md:gap-8 overflow-x-auto no-scrollbar pb-2 md:pb-0">
                    {tabs.map(tab => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                title={`Ver ${tab.label}`}
                                aria-label={`Ver ${tab.label}`}
                                className={`flex items-center gap-3 px-8 py-4 rounded-2xl whitespace-nowrap transition-all duration-500 font-black text-[10px] uppercase tracking-widest ${isActive
                                    ? 'bg-brand-dark text-white shadow-2xl shadow-brand-dark/20 scale-105'
                                    : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                                    }`}
                            >
                                <Icon className={`w-4 h-4 ${isActive ? 'text-brand-primary' : ''}`} />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            <main className="py-24 md:py-32">
                <AnimatePresence mode="wait">
                    {activeTab === 'academia' && (
                        <m.div
                            key="academia"
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -40 }}
                            transition={{ duration: 0.8, ease: "circOut" }}
                            className="container mx-auto px-6 md:px-12"
                        >
                            <div className="grid lg:grid-cols-2 gap-24 items-center">
                                <div className="space-y-12">
                                    <div className="space-y-4">
                                        <span className="text-brand-primary font-black text-xs uppercase tracking-[0.5em]">{academiaContent.tagline}</span>
                                        <h2 className="text-6xl md:text-8xl font-black text-brand-dark uppercase tracking-tighter leading-tight">
                                            Academia <br /><span className="text-brand-primary italic font-serif lowercase font-normal">Intelectual</span>
                                        </h2>
                                    </div>

                                    <p className="text-xl md:text-2xl text-gray-500 font-medium leading-relaxed max-w-xl">
                                        {academiaContent.presentation}
                                    </p>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {academiaContent.stats.map((stat, i) => (
                                            <div key={i} className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 space-y-4 hover:shadow-xl transition-shadow">
                                                <stat.icon className="w-8 h-8 text-brand-primary" />
                                                <div>
                                                    <p className="text-2xl font-black text-brand-dark">{stat.val}</p>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <button className="px-12 py-8 bg-brand-dark text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] hover:bg-brand-primary transition-all flex items-center gap-4 group">
                                        Explorar Currículo
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                                    </button>
                                </div>

                                <div className="relative">
                                    <div className="aspect-[4/5] bg-gray-100 rounded-[4rem] overflow-hidden relative shadow-2xl skew-y-1 transform transition-transform hover:skew-y-0 duration-1000">
                                        <OptimizedImage
                                            src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80"
                                            alt="Academia Graça"
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-transparent to-transparent" />
                                        <div className="absolute bottom-12 left-12 right-12 p-10 bg-white/10 backdrop-blur-xl rounded-[2rem] border border-white/20 text-white">
                                            <p className="text-sm font-medium leading-relaxed italic">
                                                "Onde a curiosidade infantil se torna rigor intelectual angolano."
                                            </p>
                                        </div>
                                    </div>
                                    {/* Floating stats */}
                                    <div className="absolute -top-12 -right-12 w-48 h-48 bg-brand-primary p-8 rounded-full flex flex-col items-center justify-center text-white shadow-2xl animate-pulsate">
                                        <span className="text-4xl font-black">100%</span>
                                        <span className="text-[8px] font-black uppercase text-center tracking-widest">Aproveitamento Pedagógico</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-40 grid md:grid-cols-3 gap-12">
                                {academiaContent.pillars.map((pillar, i) => (
                                    <div key={i} className="group p-12 bg-white border border-gray-100 rounded-[3rem] hover:border-brand-primary transition-all duration-700 hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)]">
                                        <div className="w-16 h-16 bg-brand-dark text-white rounded-2xl flex items-center justify-center mb-10 group-hover:bg-brand-primary transition-colors">
                                            <Sparkles className="w-8 h-8" />
                                        </div>
                                        <h3 className="text-2xl font-black text-brand-dark uppercase tracking-tight mb-4">{pillar.title}</h3>
                                        <p className="text-gray-500 font-medium">{pillar.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </m.div>
                    )}

                    {activeTab === 'play' && (
                        <m.div
                            key="play"
                            initial={{ opacity: 0, x: 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -40 }}
                            className="container mx-auto px-6 md:px-12"
                        >
                            <div className="bg-brand-dark rounded-[4rem] p-12 md:p-24 overflow-hidden relative text-white">
                                <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none bg-[radial-gradient(circle_at_70%_30%,#f0a500_0%,transparent_50%)]"></div>

                                <div className="grid lg:grid-cols-2 gap-24 relative z-10">
                                    <div className="space-y-12">
                                        <div className="space-y-6">
                                            <span className="text-brand-primary font-black text-xs uppercase tracking-[0.5em] flex items-center gap-4">
                                                <Radio className="w-4 h-4 animate-pulse" /> Live Literature
                                            </span>
                                            <h2 className="text-6xl md:text-9xl font-black uppercase tracking-tighter leading-none">
                                                Graça <br /><span className="text-brand-primary">Play</span>
                                            </h2>
                                        </div>

                                        <p className="text-xl text-gray-400 font-medium leading-relaxed max-w-lg">
                                            {playContent.presentation} Sintoniza a nossa estação ou explora o arquivo de vozes que definem Angola hoje.
                                        </p>

                                        {/* Player Widget */}
                                        <div className="bg-white/5 backdrop-blur-2xl rounded-[3rem] p-8 border border-white/10 shadow-3xl">
                                            <div className="flex items-center gap-6 mb-8">
                                                <div className="w-16 h-16 bg-brand-primary rounded-full flex items-center justify-center animate-spin-slow">
                                                    <Headphones className="w-8 h-8 text-white" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-brand-primary">Broadcasting</p>
                                                    <p className="text-xl font-black">Emissão Directa</p>
                                                </div>
                                            </div>
                                            <iframe
                                                src="https://zeno.fm/player/graceplay"
                                                width="100%"
                                                height="180"
                                                frameBorder="0"
                                                scrolling="no"
                                                title="GraçaPlay FM"
                                                className="rounded-2xl shadow-inner grayscale contrast-125 opacity-80"
                                            ></iframe>
                                        </div>

                                        <div className="flex flex-wrap gap-4">
                                            {playContent.features.map((f, i) => (
                                                <span key={i} className="px-6 py-3 bg-white/5 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/5">
                                                    {f}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-12">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-2xl font-black uppercase tracking-widest">Episódios Recentes</h3>
                                            <Mic className="w-6 h-6 text-brand-primary" />
                                        </div>

                                        <div className="space-y-6 max-h-[600px] overflow-y-auto pr-6 custom-scrollbar">
                                            {loadingEpisodes ? (
                                                <div className="flex justify-center py-20">
                                                    <Loader2 className="w-12 h-12 text-brand-primary animate-spin" />
                                                </div>
                                            ) : episodes.map((ep, i) => (
                                                <m.a
                                                    href={ep.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    key={ep.id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: i * 0.1 }}
                                                    className="group block p-8 bg-white/5 rounded-[2.5rem] border border-white/5 hover:bg-brand-primary/10 hover:border-brand-primary/30 transition-all"
                                                >
                                                    <div className="flex justify-between items-start gap-6">
                                                        <div className="space-y-3">
                                                            <p className="text-[10px] font-black uppercase tracking-widest text-brand-primary">{ep.duration} • Podcast</p>
                                                            <h4 className="text-xl font-black uppercase tracking-tight group-hover:text-brand-primary transition-colors">{ep.title}</h4>
                                                            <p className="text-sm text-gray-500 line-clamp-2 italic">{ep.description}</p>
                                                        </div>
                                                        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-brand-primary transition-colors">
                                                            <ArrowUpRight className="w-6 h-6" />
                                                        </div>
                                                    </div>
                                                </m.a>
                                            ))}
                                        </div>

                                        <button className="w-full py-8 bg-white text-brand-dark rounded-3xl font-black text-[10px] uppercase tracking-[0.4em] hover:bg-brand-primary hover:text-white transition-all shadow-2xl">
                                            Explorar Arquivo Completo
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </m.div>
                    )}

                    {activeTab === 'fundacao' && (
                        <m.div
                            key="fundacao"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            className="container mx-auto px-6 md:px-12 text-center"
                        >
                            <div className="max-w-4xl mx-auto py-40 space-y-16 relative">
                                <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none flex items-center justify-center overflow-hidden">
                                    <span className="text-[30rem] font-black uppercase tracking-tighter -rotate-12 translate-y-20">Graça</span>
                                </div>

                                <m.div
                                    animate={{ y: [0, -20, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="w-32 h-32 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-red-500/10"
                                >
                                    <Heart className="w-16 h-16 fill-current" />
                                </m.div>

                                <div className="space-y-6">
                                    <h2 className="text-6xl md:text-9xl font-black text-brand-dark tracking-tighter uppercase leading-none">
                                        Fundação <br /><span className="text-red-500 italic font-serif lowercase font-normal">Graça</span>
                                    </h2>
                                    <p className="text-2xl text-gray-400 font-medium max-w-2xl mx-auto leading-relaxed">
                                        O nosso braço de responsabilidade social focado na erradicação do analfabetismo literário e apoio a talentos periféricos africanos.
                                    </p>
                                </div>

                                <div className="flex items-center gap-6 justify-center">
                                    <div className="h-[1px] w-20 bg-gray-200"></div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-300">Em Desenvolvimento</span>
                                    <div className="h-[1px] w-20 bg-gray-200"></div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
                                    <div className="p-10 bg-gray-50 rounded-[3rem] border border-gray-100 text-left space-y-4">
                                        <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center">
                                            <Globe className="w-5 h-5 text-brand-primary" />
                                        </div>
                                        <h4 className="font-black text-sm uppercase tracking-widest text-brand-dark">Impacto Rural</h4>
                                        <p className="text-xs text-gray-500 leading-relaxed">Expansão literária para além das capitais provinciais angolanas.</p>
                                    </div>
                                    <div className="p-10 bg-gray-50 rounded-[3rem] border border-gray-100 text-left space-y-4">
                                        <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center">
                                            <Layers className="w-5 h-5 text-brand-primary" />
                                        </div>
                                        <h4 className="font-black text-sm uppercase tracking-widest text-brand-dark">Acervo Digital</h4>
                                        <p className="text-xs text-gray-500 leading-relaxed">Digitalização de obras raras para preservação do património.</p>
                                    </div>
                                </div>
                            </div>
                        </m.div>
                    )}
                </AnimatePresence>
            </main>

            {/* Final Institutional Bridge */}
            <section className="py-32 bg-brand-light relative overflow-hidden">
                <div className="container mx-auto px-6 md:px-12 relative z-10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                        <div className="max-w-2xl space-y-8">
                            <h3 className="text-4xl md:text-7xl font-black text-brand-dark uppercase tracking-tighter leading-none">
                                Sustente esta <br /><span className="text-brand-primary">Inovação</span>
                            </h3>
                            <p className="text-xl text-gray-500 font-medium leading-relaxed">
                                Estas iniciativas são financiadas através de parcerias estratégicas e de uma percentagem da venda de cada livro da Editora Graça.
                            </p>
                        </div>
                        <button className="px-16 py-10 bg-brand-dark text-white rounded-[2rem] font-black uppercase text-xs tracking-[0.4em] hover:bg-brand-primary hover:scale-105 active:scale-95 transition-all shadow-2xl flex items-center gap-6 group">
                            Seja Parceiro
                            <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                        </button>
                    </div>
                </div>
                {/* Decorative backgrounds */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-primary/5 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2"></div>
            </section>
        </div>
    );
};

const Loader2 = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
);

export default ExhibitionPage;
