import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, Sparkles, ArrowUpRight } from 'lucide-react';
import { m, AnimatePresence, Variants } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { getTeamMembers } from '../services/dataService';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Button } from '../components/ui/Button';

// Validation Schema
const contactSchema = z.object({
    name: z.string().min(2, 'Nome muito curto'),
    email: z.string().email('Email inválido'),
    subject: z.string().min(3, 'Assunto é obrigatório'),
    message: z.string().min(10, 'A mensagem deve ter pelo menos 10 caracteres'),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface TeamMember {
    id: string;
    name: string;
    role: string;
    department: string;
    bio: string;
    photoUrl: string;
    displayOrder?: number;
}

const ContactPage: React.FC = () => {
    const navigate = useNavigate();
    const [formStatus, setFormStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [submitting, setSubmitting] = useState(false);

    // Form Setup
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ContactFormData>({
        resolver: zodResolver(contactSchema),
        defaultValues: {
            name: '',
            email: '',
            subject: '',
            message: '',
        },
    });

    // Team Content States
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [isLoadingTeam, setIsLoadingTeam] = useState(true);
    const [selectedDepartment, setSelectedDepartment] = useState('Todos');

    const FALLBACK_MEMBERS: TeamMember[] = [
        {
            id: 'f-1',
            name: 'Geral Ibuka',
            role: 'Director-Geral',
            department: 'Administração',
            bio: 'Com mais de 15 anos de experiência no setor editorial, Geral lidera a visão estratégica da Editora Graça.',
            photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&q=80',
            displayOrder: 1
        },
        {
            id: 'f-2',
            name: 'Maria Santos',
            role: 'Editora-Chefe',
            department: 'Editorial',
            bio: 'Responsável pela curadoria e revisão editorial de todas as obras publicadas.',
            photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&q=80',
            displayOrder: 2
        }
    ];

    const loadTeam = async () => {
        setIsLoadingTeam(true);
        try {
            const data = await getTeamMembers();
            setMembers(data.length > 0 ? data : FALLBACK_MEMBERS);
        } catch (error) {
            console.error("Erro ao carregar equipa:", error);
            setMembers(FALLBACK_MEMBERS);
        } finally {
            setIsLoadingTeam(false);
        }
    };

    useEffect(() => {
        loadTeam();
    }, []);

    const departments = ['Todos', ...Array.from(new Set(members.map((m: TeamMember) => m.department)))];

    const filteredMembers = selectedDepartment === 'Todos'
        ? members
        : members.filter((m: TeamMember) => m.department === selectedDepartment);

    const onSubmit = (data: ContactFormData) => {
        setSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            console.log('Form Submitted:', data);
            setFormStatus('success');
            setSubmitting(false);
            reset();

            setTimeout(() => {
                setFormStatus('idle');
            }, 5000);
        }, 2000);
    };

    const contactInfo = [
        { icon: MapPin, title: 'Sede da Inspiração', lines: ['Malanje, Bairro Voanvala', 'Rua 5, Casa n.º 77, Angola'] },
        { icon: Phone, title: 'Canais de Voz', lines: ['+244 973 038 386', '+244 947 472 230'] },
        { icon: Mail, title: 'Correio Eletrónico', lines: ['geraleditoragraca@gmail.com'] },
        { icon: Clock, title: 'Disponibilidade Atemporal', lines: ['Seg - Qui: 08:00 - 18:00', 'Sexta: 08:00 - 16:00'] }
    ];

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
    };

    return (
        <div className="min-h-screen bg-white overflow-x-hidden pt-24 md:pt-32">
            {/* 1. CINEMATIC HERO */}
            <section className="relative bg-brand-dark text-white py-24 md:py-32 overflow-hidden">
                <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/4 select-none pointer-events-none opacity-[0.03] whitespace-nowrap">
                    <span className="text-[30rem] font-black uppercase tracking-tighter leading-none">CONTACTO</span>
                </div>

                <div className="container mx-auto px-6 md:px-12 relative z-10">
                    <m.div initial="hidden" animate="visible" variants={containerVariants}>
                        <m.div variants={itemVariants} className="flex items-center gap-4 text-[10px] text-brand-primary font-black uppercase tracking-[0.4em] mb-12">
                            <Sparkles className="w-4 h-4" />
                            <span>Conexão Literária de Alto Nível</span>
                        </m.div>

                        <m.h1 variants={itemVariants} className="text-6xl md:text-[10rem] font-black uppercase leading-[0.8] tracking-tighter mb-12">
                            Vamos <br />
                            <span className="text-brand-primary italic font-serif lowercase font-normal md:text-[9rem]">Conversar</span>
                        </m.h1>
                    </m.div>
                </div>
            </section>

            {/* 2. FORM & INFO */}
            <section className="py-24 bg-white relative z-10">
                <div className="container mx-auto px-6 md:px-12">
                    <div className="grid lg:grid-cols-[1fr_400px] gap-24">
                        <m.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-white p-10 md:p-20 rounded-[4rem] border border-gray-100 shadow-2xl">
                            <AnimatePresence mode="wait">
                                {formStatus === 'success' ? (
                                    <m.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-20 text-center">
                                        <div className="w-24 h-24 bg-brand-primary/10 text-brand-primary rounded-[2.5rem] flex items-center justify-center mx-auto mb-8">
                                            <CheckCircle className="w-12 h-12" />
                                        </div>
                                        <h3 className="text-3xl font-black text-brand-dark uppercase tracking-tighter mb-4">Sinal Recebido</h3>
                                        <p className="text-gray-500 font-medium">Sua mensagem foi entregue à nossa equipa.</p>
                                    </m.div>
                                ) : (
                                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
                                        <div className="grid md:grid-cols-2 gap-10">
                                            <Input
                                                label="Identidade Literária"
                                                placeholder="Seu nome"
                                                {...register('name')}
                                                error={errors.name?.message}
                                            />
                                            <Input
                                                type="email"
                                                label="Canal de E-mail"
                                                placeholder="seu@email.com"
                                                {...register('email')}
                                                error={errors.email?.message}
                                            />
                                        </div>

                                        <Input
                                            label="Tema da Conversa"
                                            placeholder="Sobre o que vamos falar?"
                                            {...register('subject')}
                                            error={errors.subject?.message}
                                        />

                                        <Textarea
                                            label="Sua Mensagem"
                                            placeholder="Descreva sua visão..."
                                            rows={5}
                                            {...register('message')}
                                            error={errors.message?.message}
                                        />

                                        <Button
                                            type="submit"
                                            variant="secondary"
                                            className="w-full py-8 rounded-[2rem] text-[11px] tracking-[0.4em] flex items-center justify-center gap-6 group"
                                            rightIcon={!submitting && <Send className="w-5 h-5 group-hover:translate-x-2 transition-transform" />}
                                            isLoading={submitting}
                                        >
                                            Transmitir Aspiração
                                        </Button>
                                    </form>
                                )}
                            </AnimatePresence>
                        </m.div>

                        <div className="space-y-8">
                            {contactInfo.map((info, i) => (
                                <m.div key={i} initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="p-10 bg-white border border-gray-100 rounded-[3rem] shadow-xl hover:border-brand-primary/20 transition-all">
                                    <div className="flex gap-8 items-start">
                                        <div className="w-16 h-16 bg-brand-dark text-brand-primary rounded-[1.2rem] flex items-center justify-center shrink-0">
                                            <info.icon className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <span className="text-[10px] font-black text-brand-primary uppercase tracking-widest mb-4 block">{info.title}</span>
                                            {info.lines.map((line, idx) => (
                                                <p key={idx} className="text-brand-dark font-black text-xl leading-snug">{line}</p>
                                            ))}
                                        </div>
                                    </div>
                                </m.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. TEAM SECTION */}
            <section className="py-24 md:py-48 bg-gray-50 relative overflow-hidden">
                <div className="container mx-auto px-6 md:px-12 relative z-10">
                    <m.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={containerVariants} className="text-center mb-32">
                        <span className="text-brand-primary font-black text-[10px] uppercase tracking-[0.5em] mb-8 block">Engenharia Humana</span>
                        <h2 className="text-6xl md:text-[8rem] font-black text-brand-dark tracking-tighter mb-10 leading-[0.85] uppercase">
                            Arquitetos da <br />
                            <span className="text-brand-primary italic font-serif lowercase font-normal md:text-[7rem]">Excelência</span>
                        </h2>
                    </m.div>

                    <div className="flex flex-wrap gap-4 justify-center mb-24">
                        {departments.map(dept => (
                            <button
                                key={dept}
                                onClick={() => setSelectedDepartment(dept)}
                                className={`px-12 py-5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest transition-all border-2 ${selectedDepartment === dept
                                    ? 'bg-brand-dark border-brand-dark text-white'
                                    : 'bg-white border-gray-100 text-gray-400 hover:border-brand-primary/30 hover:text-brand-primary'
                                    }`}
                            >
                                {dept}
                            </button>
                        ))}
                    </div>

                    {isLoadingTeam ? (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-20">
                            {[1, 2, 3].map(i => <div key={i} className="aspect-[4/5] bg-white rounded-[3rem] animate-pulse" />)}
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-20">
                            {filteredMembers.map((member: TeamMember) => (
                                <m.div
                                    key={member.id}
                                    variants={itemVariants}
                                    onClick={() => navigate(`/membro/${member.id}`)}
                                    className="group relative bg-white rounded-[3.5rem] overflow-hidden border border-gray-100 hover:border-brand-primary/20 hover:shadow-2xl transition-all duration-700 cursor-pointer"
                                >
                                    <div className="aspect-[4/5] rounded-[3.5rem] overflow-hidden relative mb-10 shadow-xl group-hover:-translate-y-4 transition-all duration-1000">
                                        <img src={member.photoUrl} alt={member.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                        <div className="absolute bottom-12 left-12 right-12 opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-8 group-hover:translate-y-0">
                                            <div className="flex items-center justify-between">
                                                <span className="px-5 py-2.5 bg-brand-primary text-white text-[9px] font-black uppercase tracking-widest rounded-xl">{member.department}</span>
                                                <ArrowUpRight className="text-white w-8 h-8" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-center pb-8 px-8">
                                        <h3 className="text-4xl font-black text-brand-dark tracking-tighter mb-2 uppercase group-hover:text-brand-primary transition-colors">{member.name}</h3>
                                        <p className="text-brand-primary font-serif font-black italic text-xl">{member.role}</p>
                                    </div>
                                </m.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default ContactPage;
