import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { m, useScroll, useTransform, Variants } from 'framer-motion';
import { ArrowLeft, Mail, Linkedin, Twitter, Sparkles, MapPin, Award, BookOpen, Quote, Loader2 } from 'lucide-react';
import { getTeamMemberById } from '../services/dataService';

const MemberDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [member, setMember] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    const { scrollY } = useScroll();
    const headerScale = useTransform(scrollY, [0, 500], [1, 1.2]);
    const headerOpacity = useTransform(scrollY, [0, 400], [1, 0.4]);

    useEffect(() => {
        const fetchMember = async () => {
            if (!id) return;
            setIsLoading(true);
            try {
                const data = await getTeamMemberById(id);
                setMember(data);
            } catch (error) {
                console.error("Erro ao carregar membro:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchMember();
    }, [id]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <Loader2 className="w-12 h-12 text-brand-primary animate-spin" />
            </div>
        );
    }

    if (!member) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6 text-center">
                <h2 className="text-4xl font-black text-brand-dark mb-6">Membro não encontrado</h2>
                <button
                    onClick={() => navigate('/contacto')}
                    className="btn-premium px-8 py-4"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Voltar para a Equipa
                </button>
            </div>
        );
    }

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
    };

    return (
        <div className="min-h-screen bg-white overflow-x-hidden">
            {/* 1. CINEMATIC HERO SECTION */}
            <section className="relative h-[80vh] md:h-[90vh] overflow-hidden bg-brand-dark">
                <m.div
                    style={{ scale: headerScale, opacity: headerOpacity }}
                    className="absolute inset-0 z-0"
                >
                    <img
                        src={member.photoUrl}
                        alt={member.name}
                        className="w-full h-full object-cover object-center grayscale hover:grayscale-0 transition-all duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/40 to-transparent" />
                </m.div>

                <div className="absolute inset-0 z-10 container mx-auto px-6 md:px-12 flex flex-col justify-end pb-24 md:pb-32">
                    <m.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={() => navigate('/contacto')}
                        className="group flex items-center gap-3 text-white/60 hover:text-brand-primary transition-all mb-12 w-fit bg-white/5 backdrop-blur-md px-6 py-3 rounded-full border border-white/10"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Perfil da Equipa</span>
                    </m.button>

                    <div className="space-y-6 max-w-5xl">
                        <m.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex items-center gap-4"
                        >
                            <div className="h-px w-12 bg-brand-primary" />
                            <span className="text-brand-primary font-black uppercase tracking-[0.5em] text-[10px]">{member.department}</span>
                        </m.div>

                        <m.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-6xl md:text-[10rem] font-black text-white tracking-tighter leading-none uppercase"
                        >
                            {member.name.split(' ')[0]} <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-amber-600">
                                {member.name.split(' ').slice(1).join(' ')}
                            </span>
                        </m.h1>

                        <m.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-2xl md:text-4xl text-gray-400 font-light italic"
                        >
                            {member.role}
                        </m.p>
                    </div>
                </div>

                {/* Vertical Text Decoration */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden xl:block pointer-events-none">
                    <span className="text-[20vh] font-black text-white/5 whitespace-nowrap uppercase tracking-tighter origin-center rotate-90 inline-block">
                        EXCELÊNCIA LITERÁRIA
                    </span>
                </div>
            </section>

            {/* 2. NARRATIVE JOURNEY */}
            <section className="py-32 md:py-48 bg-white relative z-10">
                <div className="container mx-auto px-6 md:px-12">
                    <div className="grid lg:grid-cols-12 gap-24 items-start">
                        {/* Summary Column */}
                        <div className="lg:col-span-4 space-y-20">
                            <m.div
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={itemVariants}
                                className="space-y-8"
                            >
                                <div className="space-y-2">
                                    <span className="text-brand-primary font-black uppercase tracking-[0.4em] text-[10px]">Contactos Premium</span>
                                    <h3 className="text-3xl font-black text-brand-dark tracking-tighter uppercase leading-none">Ligação Direta</h3>
                                </div>
                                <div className="space-y-4">
                                    <a href="#" className="flex items-center gap-5 p-6 rounded-3xl bg-gray-50 hover:bg-brand-primary hover:text-white transition-all duration-500 group">
                                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-brand-dark group-hover:scale-110 transition-transform">
                                            <Mail className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black uppercase tracking-widest opacity-60">Enviar E-mail</p>
                                            <p className="font-bold text-sm tracking-tight">contacto@editoragraca.com</p>
                                        </div>
                                    </a>
                                    <a href="#" className="flex items-center gap-5 p-6 rounded-3xl bg-gray-50 hover:bg-brand-primary hover:text-white transition-all duration-500 group">
                                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-brand-dark group-hover:scale-110 transition-transform">
                                            <Linkedin className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black uppercase tracking-widest opacity-60">Rede Profissional</p>
                                            <p className="font-bold text-sm tracking-tight">LinkedIn Profile</p>
                                        </div>
                                    </a>
                                </div>
                            </m.div>

                            <m.div
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={itemVariants}
                                className="p-10 rounded-[3rem] bg-brand-dark text-white space-y-10 relative overflow-hidden"
                            >
                                <Quote className="w-12 h-12 text-brand-primary opacity-40 absolute -top-2 -left-2" />
                                <div className="relative z-10 space-y-8">
                                    <p className="text-xl font-light leading-relaxed italic opacity-90">
                                        "O meu compromisso é com a verdade literária e a excelência que cada autor angolano merece transpor para o papel."
                                    </p>
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center">
                                            <Sparkles className="w-5 h-5 text-white" />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest">Manifesto Pessoal</span>
                                    </div>
                                </div>
                            </m.div>
                        </div>

                        {/* Bio Column */}
                        <div className="lg:col-span-8 space-y-24">
                            <m.div
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={itemVariants}
                                className="space-y-12"
                            >
                                <div className="inline-flex items-center gap-4 bg-gray-100 px-6 py-2 rounded-full border border-gray-200">
                                    <MapPin className="w-4 h-4 text-brand-primary" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-dark">Base em Luanda, Angola</span>
                                </div>
                                <h2 className="text-5xl md:text-7xl font-black text-brand-dark tracking-tighter uppercase leading-[0.9]">
                                    Arquitectando <br />
                                    <span className="text-gray-300 italic font-light lowercase">a visão</span> Editorial
                                </h2>
                                <div className="prose prose-2xl prose-gray font-medium leading-relaxed max-w-none text-gray-500">
                                    <p className="first-letter:text-8xl first-letter:font-black first-letter:text-brand-dark first-letter:mr-6 first-letter:float-left first-letter:leading-[0.8]">
                                        {member.bio}
                                    </p>
                                    <p className="mt-8">
                                        Além do papel executivo como {member.role}, o foco reside na curadoria de talentos que desafiam as convenções do mercado literário angolano. A visão estratégica na {member.department} assegura que cada obra seja não apenas um produto, mas um marco cultural atemporal.
                                    </p>
                                </div>
                            </m.div>

                            <div className="grid md:grid-cols-2 gap-12">
                                <m.div
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    variants={itemVariants}
                                    className="p-12 rounded-[3rem] border border-gray-100 bg-gray-50/50 space-y-8 hover:bg-white hover:shadow-2xl transition-all duration-700"
                                >
                                    <div className="w-16 h-16 bg-brand-dark text-brand-primary rounded-2xl flex items-center justify-center">
                                        <Award className="w-8 h-8" />
                                    </div>
                                    <div className="space-y-4">
                                        <h4 className="text-2xl font-black text-brand-dark uppercase tracking-tight">Especialização</h4>
                                        <p className="text-gray-500 font-medium leading-relaxed">Domínio avançado em processos editoriais de alta performance e curadoria estética de obras premium.</p>
                                    </div>
                                </m.div>

                                <m.div
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    variants={itemVariants}
                                    className="p-12 rounded-[3rem] border border-gray-100 bg-gray-50/50 space-y-8 hover:bg-white hover:shadow-2xl transition-all duration-700"
                                >
                                    <div className="w-16 h-16 bg-brand-dark text-brand-primary rounded-2xl flex items-center justify-center">
                                        <BookOpen className="w-8 h-8" />
                                    </div>
                                    <div className="space-y-4">
                                        <h4 className="text-2xl font-black text-brand-dark uppercase tracking-tight">Projectos Chave</h4>
                                        <p className="text-gray-500 font-medium leading-relaxed">Liderança na reestruturação do catálogo {new Date().getFullYear()} e expansão da narrativa nacional para o digital.</p>
                                    </div>
                                </m.div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. CTA SECTION */}
            <section className="py-24 bg-brand-dark relative overflow-hidden">
                <div className="container mx-auto px-6 md:px-12 relative z-10 text-center">
                    <m.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1 }}
                        className="space-y-12"
                    >
                        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase">Deseja colaborar com <br />esta <span className="text-brand-primary italic font-light lowercase">visão</span>?</h2>
                        <button
                            onClick={() => navigate('/contacto')}
                            className="btn-premium px-16 py-6 text-sm"
                        >
                            ENTRE EM CONTACTO
                        </button>
                    </m.div>
                </div>

                {/* Background Decor */}
                <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                </div>
            </section>
        </div>
    );
};

export default MemberDetailPage;
