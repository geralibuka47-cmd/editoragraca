import React, { useState, useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { getPodcastEpisodes, PodcastEpisode } from '../services/podcastService';
import {
    GraduationCap,
    PlayCircle,
    Globe,
    Target,
    Sparkles,
    Zap,
    BookOpen,
    Users,
    CheckCircle2,
    ArrowRight,
    ArrowUpRight,
    Mic,
    Heart,
    Star,
    Award
} from 'lucide-react';

const ProjectsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'academia' | 'fundacao' | 'play'>('academia');
    const [episodes, setEpisodes] = useState<PodcastEpisode[]>([]);
    const [loadingEpisodes, setLoadingEpisodes] = useState(false);

    useEffect(() => {
        if (activeTab === 'play') {
            const loadEpisodes = async () => {
                setLoadingEpisodes(true);
                const data = await getPodcastEpisodes();
                setEpisodes(data.slice(0, 6)); // Show latest 6
                setLoadingEpisodes(false);
            };
            loadEpisodes();
        }
    }, [activeTab]);

    const academiaContent = {
        title: "Academia Graça",
        tagline: "Projeto formativo da Editora Graça",
        presentation: "A Academia Graça é um projeto educacional e formativo da Editora Graça, criado para orientar escritores de tenra idade e, de forma mais ampla, contribuir para a formação intelectual, académica e criativa de jovens estudantes.",
        extraPresentation: "Além da formação literária, a Academia Graça passa a oferecer cursos complementares fora da literatura, aulas de reforço escolar e preparação para o ensino médio, respondendo às necessidades reais de base educativa e ao desenvolvimento integral dos estudantes.",
        stats: "Atualmente, a Academia conta com 5 estudantes, afiliados à Editora Graça por intermédio do projeto, beneficiando de acompanhamento pedagógico e orientação contínua.",
        mission: "Promover a formação integral de jovens estudantes e escritores, aliando educação académica, orientação literária e preparação intelectual, com vista ao desenvolvimento de competências críticas, criativas e disciplinares.",
        vision: "Tornar-se uma referência em formação de base e orientação educacional em Angola, reconhecida pela qualidade pedagógica, pelo incentivo à leitura e pela preparação consciente de jovens para os desafios académicos e culturais.",
        objectives: {
            general: "Oferecer uma formação integrada que una educação académica, orientação literária e preparação escolar, apoiando o crescimento intelectual e criativo dos estudantes.",
            specific: [
                "Orientar jovens escritores no desenvolvimento da escrita e da leitura crítica;",
                "Oferecer cursos formativos fora da área literária, de carácter educativo e prático;",
                "Reforçar conteúdos escolares fundamentais, conforme o nível de cada estudante;",
                "Preparar estudantes para o ingresso e bom desempenho no ensino médio;",
                "Desenvolver hábitos de estudo, disciplina intelectual e autonomia académica;",
                "Criar vínculo formativo entre os estudantes e a Editora Graça."
            ]
        },
        methodology: [
            { title: "Acompanhamento personalizado", desc: "Atenção ao ritmo, idade e necessidades individuais." },
            { title: "Formação literária orientada", desc: "Escrita, leitura guiada e iniciação ao processo editorial." },
            { title: "Cursos complementares", desc: "Conteúdos educativos fora da literatura, ajustados à realidade dos estudantes." },
            { title: "Reforço escolar", desc: "Apoio sistemático nas disciplinas fundamentais." },
            { title: "Preparação para o ensino médio", desc: "Consolidação de bases académicas e orientação educacional." },
            { title: "Avaliação contínua", desc: "Feedback pedagógico e acompanhamento do progresso." }
        ]
    };

    const playContent = {
        title: "Graça Play",
        tagline: "Podcast & Plataforma de Literatura e Cultura Africana",
        quote: "O espaço onde a literatura, a cultura africana, entrevistas e histórias inspiradoras se encontram.",
        presentation: "A Graça Play é um podcast e uma plataforma de conteúdo dedicada à literatura e à cultura africana, criada com o propósito de valorizar narrativas, autores e expressões culturais do continente africano no espaço lusófono e além.",
        mission: "Dar visibilidade à literatura e à cultura africana, promovendo o diálogo entre autores, leitores e profissionais do livro, e incentivando a leitura crítica.",
        vision: "Tornar-se uma referência lusófona em podcasts e plataformas culturais africanas, contribuindo para a valorização do pensamento africano contemporâneo.",
        values: ["Valorização da cultura africana", "Compromisso com o pensamento crítico", "Inclusão e diversidade", "Acesso democrático ao conhecimento"],
        content: [
            "Entrevistas com autores e agentes culturais",
            "Debates literários e culturais",
            "Resenhas e análises de obras africanas",
            "Histórias inspiradoras e produção intelectual"
        ]
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, staggerChildren: 0.1 } }
    };

    return (
        <div className="min-h-screen bg-brand-light">
            <div className="h-20 md:h-24 bg-brand-dark"></div>

            {/* Cinematic Header */}
            <section className="bg-brand-dark text-white pt-24 pb-48 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-primary/5 blur-[120px] rounded-full translate-x-1/2"></div>

                <div className="container mx-auto px-6 md:px-12 relative z-10">
                    <m.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-4xl"
                    >
                        <span className="text-brand-primary font-black uppercase tracking-[0.4em] text-[10px] mb-6 block">Iniciativas Institucionais</span>
                        <h1 className="text-5xl sm:text-7xl md:text-[8rem] font-black uppercase leading-[0.8] tracking-tighter mb-12">
                            Nosso <span className="text-brand-primary italic font-serif lowercase font-normal text-4xl sm:text-6xl md:text-[8rem]">Ecossistema</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-400 font-light leading-relaxed mb-12">
                            Além da excelência editorial, a Editora Graça expande-se através de projetos que nutrem o conhecimento, a educação e a cultura africana.
                        </p>
                    </m.div>

                    {/* Navigation Tabs */}
                    <div className="flex flex-wrap gap-4 mt-20">
                        {[
                            { id: 'academia', label: 'Academia Graça', icon: GraduationCap },
                            { id: 'fundacao', label: 'Fundação Graça', icon: Heart },
                            { id: 'play', label: 'Graça Play', icon: PlayCircle }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex items-center gap-3 px-8 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === tab.id
                                    ? 'bg-brand-primary text-white shadow-xl shadow-brand-primary/20 scale-105'
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                    }`}
                            >
                                <tab.icon className="w-5 h-5" />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Content Area */}
            <section className="py-24 md:py-32 -mt-24 relative z-20">
                <div className="container mx-auto px-6 md:px-12">
                    <AnimatePresence mode="wait">
                        {activeTab === 'academia' && (
                            <m.div
                                key="academia"
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                                variants={containerVariants}
                                className="bg-white rounded-[4rem] shadow-2xl p-8 md:p-20 border border-gray-100"
                            >
                                <div className="grid lg:grid-cols-2 gap-20">
                                    <div className="space-y-12">
                                        <div>
                                            <span className="text-brand-primary font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">{academiaContent.tagline}</span>
                                            <h2 className="text-4xl sm:text-5xl md:text-7xl font-black text-brand-dark tracking-tighter uppercase">{academiaContent.title}</h2>
                                        </div>

                                        <p className="text-lg md:text-xl text-gray-600 leading-relaxed font-medium capitalize-first">
                                            {academiaContent.presentation}
                                        </p>

                                        <div className="bg-brand-primary/5 p-8 rounded-[2.5rem] border border-brand-primary/10">
                                            <p className="text-brand-dark font-medium leading-relaxed italic">
                                                "{academiaContent.extraPresentation}"
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-6 p-6 bg-brand-dark text-white rounded-3xl">
                                            <div className="w-16 h-16 bg-brand-primary rounded-2xl flex items-center justify-center shrink-0">
                                                <Users className="w-8 h-8" />
                                            </div>
                                            <div>
                                                <p className="text-2xl font-black text-brand-primary">5 Estudantes</p>
                                                <p className="text-[10px] uppercase font-bold tracking-widest opacity-60">Ativo atualmente</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-16">
                                        <div className="grid sm:grid-cols-2 gap-8">
                                            <div className="p-8 bg-gray-50 rounded-[2.5rem] space-y-4">
                                                <Target className="w-10 h-10 text-brand-primary" />
                                                <h3 className="text-xl font-black text-brand-dark">Missão</h3>
                                                <p className="text-sm text-gray-500 leading-relaxed">{academiaContent.mission}</p>
                                            </div>
                                            <div className="p-8 bg-gray-50 rounded-[2.5rem] space-y-4">
                                                <Sparkles className="w-10 h-10 text-brand-primary" />
                                                <h3 className="text-xl font-black text-brand-dark">Visão</h3>
                                                <p className="text-sm text-gray-500 leading-relaxed">{academiaContent.vision}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-8">
                                            <h3 className="text-2xl font-black text-brand-dark uppercase tracking-tighter">Objetivos Específicos</h3>
                                            <div className="space-y-4">
                                                {academiaContent.objectives.specific.map((obj, i) => (
                                                    <div key={i} className="flex gap-4 group">
                                                        <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 transition-transform group-hover:scale-125" />
                                                        <p className="text-gray-600 font-medium text-sm">{obj}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-32 pt-20 border-t border-gray-100">
                                    <h3 className="text-3xl font-black text-brand-dark text-center uppercase tracking-tighter mb-16">Metodologia Pedagógica</h3>
                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                        {academiaContent.methodology.map((m, i) => (
                                            <div key={i} className="p-8 border border-gray-100 rounded-3xl hover:border-brand-primary/20 hover:shadow-xl transition-all group">
                                                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-brand-primary group-hover:text-white transition-colors">
                                                    <Zap className="w-5 h-5" />
                                                </div>
                                                <h4 className="font-black text-brand-dark mb-2 text-lg uppercase tracking-tight">{m.title}</h4>
                                                <p className="text-sm text-gray-500 leading-relaxed">{m.desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </m.div>
                        )}

                        {activeTab === 'play' && (
                            <m.div
                                key="play"
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                                variants={containerVariants}
                                className="bg-brand-dark rounded-[4rem] shadow-2xl p-8 md:p-20 text-white overflow-hidden relative"
                            >
                                <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/10 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2"></div>

                                <div className="grid lg:grid-cols-2 gap-20 relative z-10">
                                    <div className="space-y-12">
                                        <div>
                                            <span className="text-brand-primary font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">{playContent.tagline}</span>
                                            <h2 className="text-4xl sm:text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-[0.9]">{playContent.title}</h2>
                                        </div>

                                        <p className="text-2xl font-serif italic text-gray-300">
                                            "{playContent.quote}"
                                        </p>

                                        {/* Radio Player Widget */}
                                        <div className="space-y-6">
                                            <h3 className="text-xl font-black uppercase tracking-widest text-brand-primary flex items-center gap-3">
                                                <Zap className="w-5 h-5" />
                                                GraçaPlay FM (Ao Vivo)
                                            </h3>
                                            <div className="relative w-full overflow-hidden rounded-3xl bg-white/5 border border-white/10 p-4 backdrop-blur-md">
                                                <iframe
                                                    src="https://zeno.fm/player/graceplay"
                                                    width="100%"
                                                    height="250"
                                                    frameBorder="0"
                                                    scrolling="no"
                                                    title="GraçaPlay FM"
                                                    className="rounded-2xl shadow-2xl relative z-10"
                                                ></iframe>
                                                <div className="mt-4 flex justify-between items-center px-4">
                                                    <a
                                                        href="https://zeno.fm/radio/graceplay"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-[10px] font-bold text-gray-500 hover:text-brand-primary uppercase tracking-[0.2em] transition-colors"
                                                    >
                                                        A Zeno.FM Station
                                                    </a>
                                                    <div className="flex items-center gap-2">
                                                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-red-500">On Air</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <p className="text-lg text-gray-400 leading-relaxed">
                                            {playContent.presentation}
                                        </p>
                                    </div>

                                    <div className="space-y-12">
                                        {/* Podcast Episodes List */}
                                        <div className="bg-white/5 backdrop-blur-xl p-8 md:p-12 rounded-[3rem] border border-white/10">
                                            <h3 className="text-2xl font-black mb-8 uppercase tracking-widest text-brand-primary flex items-center justify-between">
                                                <span>Últimos Episódios</span>
                                                <Mic className="w-6 h-6" />
                                            </h3>

                                            <div className="space-y-6 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
                                                {loadingEpisodes ? (
                                                    <div className="flex justify-center py-12">
                                                        <span className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></span>
                                                    </div>
                                                ) : episodes.length > 0 ? (
                                                    episodes.map((ep) => (
                                                        <a
                                                            key={ep.id}
                                                            href={ep.link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="block p-6 bg-white/5 rounded-2xl hover:bg-brand-primary/20 border border-white/5 hover:border-brand-primary/30 transition-all group"
                                                        >
                                                            <div className="flex justify-between items-start mb-2">
                                                                <h4 className="font-bold text-white group-hover:text-brand-primary transition-colors line-clamp-1">{ep.title}</h4>
                                                                <span className="text-[10px] font-bold text-gray-500 uppercase shrink-0 ml-4">
                                                                    {ep.duration}
                                                                </span>
                                                            </div>
                                                            <p className="text-xs text-gray-400 line-clamp-2 mb-4 leading-relaxed italic">
                                                                {ep.description}
                                                            </p>
                                                            <div className="flex items-center gap-2 text-[10px] font-black text-brand-primary uppercase tracking-widest group-hover:gap-3 transition-all">
                                                                Ouvir Agora <ArrowRight className="w-3 h-3" />
                                                            </div>
                                                        </a>
                                                    ))
                                                ) : (
                                                    <p className="text-gray-500 text-center py-8 font-medium">Nenhum episódio encontrado.</p>
                                                )}
                                            </div>

                                            <div className="mt-10 pt-8 border-t border-white/10 flex justify-center">
                                                <a
                                                    href="https://anchor.fm/editoragraca"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-brand-primary transition-colors flex items-center gap-2"
                                                >
                                                    Ver todos no Anchor.fm <ArrowUpRight className="w-4 h-4" />
                                                </a>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-8">
                                            <div className="space-y-2">
                                                <p className="text-brand-primary font-black text-3xl">Livre</p>
                                                <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Acesso Democrático</p>
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-brand-primary font-black text-3xl">Global</p>
                                                <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Presença Digital</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </m.div>
                        )}

                        {activeTab === 'fundacao' && (
                            <m.div
                                key="fundacao"
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                                variants={containerVariants}
                                className="bg-white rounded-[2.5rem] sm:rounded-[4rem] shadow-2xl p-10 md:p-40 text-center border border-gray-100 overflow-hidden relative"
                            >
                                <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                                    <span className="text-[20rem] font-black uppercase tracking-tighter block rotate-12">Filantropia</span>
                                </div>

                                <div className="relative z-10 max-w-2xl mx-auto space-y-12">
                                    <div className="w-24 h-24 bg-brand-primary/10 text-brand-primary rounded-full flex items-center justify-center mx-auto animate-bounce">
                                        <Star className="w-12 h-12" />
                                    </div>
                                    <h2 className="text-5xl md:text-7xl font-black text-brand-dark tracking-tighter uppercase">Fundação Graça</h2>
                                    <p className="text-xl text-gray-500 leading-relaxed font-medium italic">
                                        Estamos a construir os alicerces de algo transformador. A Fundação Graça será o nosso braço filantrópico dedicado ao impacto social e cultural.
                                    </p>
                                    <div className="bg-brand-primary text-white py-3 px-8 rounded-full w-fit mx-auto font-black text-[10px] uppercase tracking-[0.3em]">
                                        Brevemente
                                    </div>
                                </div>
                            </m.div>
                        )}
                    </AnimatePresence>
                </div>
            </section>

            {/* Institutional Bridge */}
            <section className="py-32 bg-brand-dark overflow-hidden">
                <div className="container mx-auto px-6 md:px-12">
                    <div className="flex flex-col lg:flex-row items-center gap-20">
                        <div className="flex-1">
                            <h3 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tighter leading-none uppercase mb-8">
                                Vinculação <br />
                                <span className="text-brand-primary italic font-serif lowercase font-normal text-3xl sm:text-5xl">Institucional</span>
                            </h3>
                            <p className="text-xl text-gray-400 leading-relaxed max-w-2xl">
                                Estes projetos são iniciativas oficiais da Editora Graça, reafirmando o nosso compromisso com a educação, a literatura e o futuro intelectual das novas gerações.
                            </p>
                        </div>
                        <div className="shrink-0">
                            <button className="px-20 py-10 bg-white text-brand-dark font-black rounded-2xl hover:bg-brand-primary hover:text-white transition-all text-[11px] uppercase tracking-[0.5em] shadow-2xl flex items-center gap-6">
                                Iniciar Parceria <ArrowUpRight className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ProjectsPage;
