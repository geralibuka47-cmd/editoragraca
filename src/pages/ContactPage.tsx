import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, Facebook, Instagram, Twitter, Users, X, Loader2, Sparkles, ArrowRight, ArrowUpRight } from 'lucide-react';
import { m, AnimatePresence, Variants } from 'framer-motion';
import { getTeamMembers, getSiteContent } from '../services/dataService';

interface TeamMember {
    id: string;
    name: string;
    role: string;
    department: string;
    bio: string;
    photoUrl: string;
    order?: number;
}

const ContactPage: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [formStatus, setFormStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Team Content States
    const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [isLoadingTeam, setIsLoadingTeam] = useState(true);
    const [selectedDepartment, setSelectedDepartment] = useState('Todos');

    const FALLBACK_MEMBERS: TeamMember[] = [
        {
            id: 'f-1',
            name: 'Geral Ibuka',
            role: 'Director-Geral',
            department: 'Administração',
            bio: 'Com mais de 15 anos de experiência no setor editorial, Geral lidera a visão estratégica da Editora Graça, garantindo excelência em cada publicação e promovendo a cultura angolana através da literatura.',
            photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&q=80',
            order: 1
        },
        {
            id: 'f-2',
            name: 'Maria Santos',
            role: 'Editora-Chefe',
            department: 'Editorial',
            bio: 'Responsável pela curadoria e revisão editorial de todas as obras publicadas. Maria tem olho afiado para boas histórias e compromisso inabalável com a qualidade literária.',
            photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&q=80',
            order: 1
        },
        {
            id: 'f-3',
            name: 'João Ferreira',
            role: 'Designer Gráfico',
            department: 'Design',
            bio: 'Especialista em design de capas e diagramação, João transforma manuscritos em obras visualmente deslumbrantes que capturam a essência de cada história.',
            photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80',
            order: 1
        }
    ];

    useEffect(() => {
        const loadTeamData = async () => {
            setIsLoadingTeam(true);
            try {
                const membersData = await getTeamMembers();
                setMembers(membersData.length > 0 ? membersData : FALLBACK_MEMBERS);
            } catch (error) {
                console.error("Erro ao carregar dados da equipa:", error);
                setMembers(FALLBACK_MEMBERS);
            } finally {
                setIsLoadingTeam(false);
            }
        };
        loadTeamData();
    }, []);

    const departments = ['Todos', ...Array.from(new Set(members.map((m: TeamMember) => m.department)))];

    const filteredMembers = selectedDepartment === 'Todos'
        ? members
        : members.filter((m: TeamMember) => m.department === selectedDepartment);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) newErrors.name = 'Identificação necessária';
        if (!formData.email.trim()) {
            newErrors.email = 'Canal digital necessário';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Formato inválido';
        }
        if (!formData.subject.trim()) newErrors.subject = 'Tema necessário';
        if (!formData.message.trim()) newErrors.message = 'Narrativa necessária';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        setFormStatus('success');
        setTimeout(() => {
            setFormData({ name: '', email: '', subject: '', message: '' });
            setFormStatus('idle');
        }, 3000);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const contactInfo = [
        {
            icon: MapPin,
            title: 'Sede da Inspiração',
            lines: ['Malanje, Bairro Voanvala', 'Rua 5, Casa n.º 77, Angola']
        },
        {
            icon: Phone,
            title: 'Canais de Voz',
            lines: ['+244 973 038 386', '+244 947 472 230']
        },
        {
            icon: Mail,
            title: 'Correio Eletrónico',
            lines: ['geraleditoragraca@gmail.com']
        },
        {
            icon: Clock,
            title: 'Disponibilidade Atemporal',
            lines: ['Seg - Qui: 08:00 - 18:00', 'Sexta: 08:00 - 16:00']
        }
    ];

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants: Variants = {
        hidden: { y: 30, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
    };

    return (
        <div className="min-h-screen bg-white overflow-x-hidden">
            {/* Nav Padding Spacer */}
            <div className="h-20 md:h-24 bg-brand-dark"></div>

            {/* 1. CINEMATIC HERO */}
            <section className="relative bg-brand-dark text-white pt-24 pb-48 md:pt-32 md:pb-64 overflow-hidden">
                {/* Background Decorative Text */}
                <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/4 select-none pointer-events-none opacity-[0.03] whitespace-nowrap">
                    <span className="text-[30rem] font-black uppercase tracking-tighter leading-none">
                        CONTACTO
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
                            <span>Conexão Literária de Alto Nível</span>
                        </m.div>

                        <m.h1 variants={itemVariants} className="text-6xl md:text-[10rem] font-black uppercase leading-[0.8] tracking-tighter mb-12">
                            Vamos <br />
                            <span className="text-brand-primary italic font-serif lowercase font-normal md:text-[9rem]">Conversar</span>
                        </m.h1>

                        <m.p variants={itemVariants} className="text-xl md:text-3xl text-gray-400 font-light leading-relaxed max-w-3xl mx-auto lg:mx-0 opacity-80 mb-20">
                            Estamos prontos para ouvir sua história e elevar sua obra ao patamar que ela merece. <span className="text-white italic font-bold">Inicie seu legado hoje.</span>
                        </m.p>
                    </m.div>
                </div>

                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent"></div>
            </section>

            {/* 2. CONTACT CONTENT AREA */}
            <section className="py-24 md:py-48 bg-white relative z-10 -mt-20">
                <div className="container mx-auto px-6 md:px-12">
                    <div className="grid lg:grid-cols-[1fr_400px] gap-12 md:gap-24">

                        {/* THE FORM */}
                        <m.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-white p-10 md:p-20 rounded-[4rem] border border-gray-100 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.08)]"
                        >
                            <div className="mb-16">
                                <h2 className="text-4xl font-black text-brand-dark tracking-tighter uppercase mb-6">Manifeste sua <br /><span className="text-brand-primary italic font-serif lowercase font-normal">Obra</span></h2>
                                <p className="text-gray-500 font-medium text-lg">Nossa equipa de consultoria editorial analisará seu projeto com o rigor que ele exige.</p>
                            </div>

                            <AnimatePresence mode="wait">
                                {formStatus === 'success' ? (
                                    <m.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="py-20 text-center"
                                    >
                                        <div className="w-24 h-24 bg-brand-primary/10 text-brand-primary rounded-[2.5rem] flex items-center justify-center mx-auto mb-8">
                                            <CheckCircle className="w-12 h-12" />
                                        </div>
                                        <h3 className="text-3xl font-black text-brand-dark uppercase tracking-tighter mb-4">Sinal Recebido</h3>
                                        <p className="text-gray-500 font-medium">Sua mensagem está sendo processada por nossos especialistas.</p>
                                    </m.div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-10">
                                        <div className="grid md:grid-cols-2 gap-10">
                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black text-brand-primary uppercase tracking-[0.3em] ml-6">Identidade Literária</label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    placeholder="Seu nome ou pseudónimo"
                                                    className={`w-full bg-gray-50 border-2 ${errors.name ? 'border-red-200' : 'border-transparent'} focus:border-brand-primary/30 focus:bg-white rounded-[2rem] px-8 py-6 text-brand-dark font-bold outline-none transition-all placeholder:text-gray-300`}
                                                />
                                            </div>
                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black text-brand-primary uppercase tracking-[0.3em] ml-6">Canal de Comunicação</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    placeholder="seu@email.com"
                                                    className={`w-full bg-gray-50 border-2 ${errors.email ? 'border-red-200' : 'border-transparent'} focus:border-brand-primary/30 focus:bg-white rounded-[2rem] px-8 py-6 text-brand-dark font-bold outline-none transition-all placeholder:text-gray-300`}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-brand-primary uppercase tracking-[0.3em] ml-6">Natureza do Diálogo</label>
                                            <select
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                className="w-full bg-gray-50 border-2 border-transparent focus:border-brand-primary/30 focus:bg-white rounded-[2rem] px-8 py-6 text-brand-dark font-bold outline-none transition-all appearance-none cursor-pointer"
                                                title="Selecione o assunto"
                                            >
                                                <option value="">O que deseja partilhar?</option>
                                                <option value="manuscrito">Apresentação de Manuscrito</option>
                                                <option value="servicos">Consultoria de Elite</option>
                                                <option value="parceria">Parceria Estratégica</option>
                                                <option value="outro">Outras Aspirações</option>
                                            </select>
                                        </div>

                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-brand-primary uppercase tracking-[0.3em] ml-6">Sua Mensagem</label>
                                            <textarea
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                rows={5}
                                                placeholder="Descreva seu projeto ou visão..."
                                                className={`w-full bg-gray-50 border-2 ${errors.message ? 'border-red-200' : 'border-transparent'} focus:border-brand-primary/30 focus:bg-white rounded-[2.5rem] px-8 py-6 text-brand-dark font-bold outline-none transition-all resize-none placeholder:text-gray-300`}
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            className="w-full py-8 bg-brand-dark text-white rounded-[2rem] font-black uppercase text-[11px] tracking-[0.4em] hover:bg-brand-primary hover:scale-[1.02] active:scale-95 transition-all shadow-2xl flex items-center justify-center gap-6 group"
                                            title="Enviar Mensagem Editorial"
                                            aria-label="Enviar Mensagem Editorial"
                                        >
                                            <span>Transmitir Aspiração</span>
                                            <Send className="w-5 h-5 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" />
                                        </button>
                                    </form>
                                )}
                            </AnimatePresence>
                        </m.div>

                        {/* SIDEBAR INFO */}
                        <div className="space-y-8">
                            {contactInfo.map((info, i) => (
                                <m.div
                                    key={i}
                                    initial={{ opacity: 0, x: 30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="p-10 bg-white border border-gray-100 rounded-[3rem] shadow-xl hover:border-brand-primary/20 transition-all group"
                                >
                                    <div className="flex gap-8 items-start">
                                        <div className="w-16 h-16 bg-brand-dark text-brand-primary rounded-[1.2rem] flex items-center justify-center shrink-0 group-hover:bg-brand-primary group-hover:text-white transition-all duration-500">
                                            <info.icon className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <span className="text-[10px] font-black text-brand-primary uppercase tracking-[0.3em] mb-4 block">{info.title}</span>
                                            {info.lines.map((line, idx) => (
                                                <p key={idx} className="text-brand-dark font-black text-xl leading-snug">{line}</p>
                                            ))}
                                        </div>
                                    </div>
                                </m.div>
                            ))}

                            {/* SOCIAL CONNECTION */}
                            <m.div
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.4 }}
                                className="p-10 bg-brand-dark rounded-[3rem] text-white relative overflow-hidden group"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/10 blur-3xl rounded-full"></div>
                                <span className="text-brand-primary font-black uppercase tracking-[0.4em] text-[10px] block mb-10 relative z-10">Conexão Digital</span>
                                <div className="flex gap-4 relative z-10">
                                    {[Facebook, Instagram, X].map((Icon, idx) => (
                                        <a
                                            key={idx}
                                            href="#"
                                            className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center hover:bg-brand-primary hover:scale-110 active:scale-90 transition-all duration-500"
                                            title="Siga-nos nas Redes Sociais"
                                            aria-label="Siga-nos nas Redes Sociais"
                                        >
                                            <Icon className="w-7 h-7" />
                                        </a>
                                    ))}
                                </div>
                            </m.div>
                        </div>

                    </div>
                </div>
            </section>

            {/* 3. TEAM SECTION */}
            <section className="py-24 md:py-48 bg-gray-50 relative overflow-hidden">
                <div className="container mx-auto px-6 md:px-12 relative z-10">
                    <m.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={containerVariants}
                        className="text-center mb-32"
                    >
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
                                className={`px-12 py-5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.3em] transition-all border-2 ${selectedDepartment === dept
                                    ? 'bg-brand-dark border-brand-dark text-white shadow-2xl'
                                    : 'bg-white border-gray-100 text-gray-400 hover:border-brand-primary/30 hover:text-brand-primary'
                                    }`}
                            >
                                {dept}
                            </button>
                        ))}
                    </div>

                    {isLoadingTeam ? (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-20">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="aspect-[4/5] bg-white rounded-[3rem] animate-pulse"></div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-20">
                            {filteredMembers.map((member: TeamMember) => (
                                <m.div
                                    key={member.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="group cursor-pointer"
                                    onClick={() => setSelectedMember(member)}
                                >
                                    <div className="aspect-[4/5] rounded-[3.5rem] overflow-hidden bg-white border border-gray-100 relative mb-10 shadow-xl group-hover:shadow-3xl group-hover:-translate-y-4 transition-all duration-1000">
                                        <img
                                            src={member.photoUrl}
                                            alt={member.name}
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 group-hover:grayscale-[0.5]"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                                        <div className="absolute bottom-12 left-12 right-12 opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-8 group-hover:translate-y-0">
                                            <div className="flex items-center justify-between">
                                                <span className="px-5 py-2.5 bg-brand-primary text-white text-[9px] font-black uppercase tracking-widest rounded-xl">
                                                    {member.department}
                                                </span>
                                                <ArrowUpRight className="text-white w-8 h-8" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <h3 className="text-4xl font-black text-brand-dark tracking-tighter mb-2 uppercase group-hover:text-brand-primary transition-colors">{member.name}</h3>
                                        <p className="text-brand-primary font-serif font-black italic text-xl">{member.role}</p>
                                    </div>
                                </m.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* 4. TEAM MEMBER MODAL */}
            <AnimatePresence>
                {selectedMember && (
                    <m.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-brand-dark/95 z-[100] flex items-center justify-center p-6 backdrop-blur-xl"
                        onClick={() => setSelectedMember(null)}
                    >
                        <m.div
                            initial={{ scale: 0.9, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-white rounded-[5rem] max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl relative flex flex-col md:flex-row"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setSelectedMember(null)}
                                className="absolute top-10 right-10 w-16 h-16 bg-brand-dark text-white rounded-full flex items-center justify-center hover:bg-brand-primary transition-all z-20 border-4 border-white shadow-2xl"
                                title="Fechar Perfil"
                                aria-label="Fechar Perfil"
                            >
                                <X className="w-8 h-8" />
                            </button>

                            <div className="w-full md:w-[45%] h-[400px] md:h-auto shrink-0">
                                <img
                                    src={selectedMember.photoUrl}
                                    alt={selectedMember.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className="flex-1 p-12 md:p-24 flex flex-col justify-center relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-[50%] aspect-square bg-brand-primary/5 blur-[120px] rounded-full"></div>

                                <div className="relative z-10">
                                    <span className="inline-block px-8 py-3 bg-brand-dark text-brand-primary text-[10px] font-black uppercase tracking-[0.4em] rounded-2xl mb-12">
                                        {selectedMember.department}
                                    </span>

                                    <h2 className="text-6xl md:text-8xl font-black text-brand-dark mb-4 tracking-tighter uppercase leading-none">{selectedMember.name}</h2>
                                    <p className="text-3xl text-brand-primary font-serif font-black italic mb-16">{selectedMember.role}</p>

                                    <div className="w-24 h-[1px] bg-brand-primary/30 mb-16"></div>

                                    <p className="text-gray-500 leading-relaxed text-2xl font-light italic opacity-90 border-l-4 border-brand-primary/20 pl-10">
                                        "{selectedMember.bio}"
                                    </p>
                                </div>
                            </div>
                        </m.div>
                    </m.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ContactPage;
