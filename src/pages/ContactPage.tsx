import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, Facebook, Instagram, Twitter, Users, X, Loader2 } from 'lucide-react';
import { ViewState } from '../types';
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
    const [siteContent, setTeamSiteContent] = useState<any>({});
    const [isLoadingTeam, setIsLoadingTeam] = useState(true);
    const [selectedDepartment, setSelectedDepartment] = useState('Todos');

    const FALLBACK_MEMBERS: TeamMember[] = [
        {
            id: 'f-1',
            name: 'Geral Ibuka',
            role: 'Director-Geral',
            department: 'Administração',
            bio: 'Com mais de 15 anos de experiência no setor editorial, Geral lidera a visão estratégica da Editora Graça, garantindo excelência em cada publicação e promovendo a cultura angolana através da literatura.',
            photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
            order: 1
        },
        {
            id: 'f-2',
            name: 'Maria Santos',
            role: 'Editora-Chefe',
            department: 'Editorial',
            bio: 'Responsável pela curadoria e revisão editorial de todas as obras publicadas. Maria tem olho afiado para boas histórias e compromisso inabalável com a qualidade literária.',
            photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
            order: 2
        },
        {
            id: 'f-3',
            name: 'João Ferreira',
            role: 'Designer Gráfico',
            department: 'Design',
            bio: 'Especialista em design de capas e diagramação, João transforma manuscritos em obras visualmente deslumbrantes que capturam a essência de cada história.',
            photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
            order: 3
        }
    ];

    useEffect(() => {
        const loadTeamData = async () => {
            setIsLoadingTeam(true);
            try {
                const [membersData, content] = await Promise.all([
                    getTeamMembers(),
                    getSiteContent('team')
                ]);
                setMembers(membersData.length > 0 ? membersData : FALLBACK_MEMBERS);
                setTeamSiteContent(content);
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

        if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
        if (!formData.email.trim()) {
            newErrors.email = 'Email é obrigatório';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Email inválido';
        }
        if (!formData.subject.trim()) newErrors.subject = 'Assunto é obrigatório';
        if (!formData.message.trim()) newErrors.message = 'Mensagem é obrigatória';
        if (formData.message.trim().length < 10) newErrors.message = 'Mensagem muito curta (mínimo 10 caracteres)';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        // Simulate form submission

        setFormStatus('success');

        // Reset form after 3 seconds
        setTimeout(() => {
            setFormData({ name: '', email: '', subject: '', message: '' });
            setFormStatus('idle');
        }, 3000);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const contactInfo = [
        {
            icon: MapPin,
            title: 'Endereço',
            lines: [
                'Malanje, Bairro Voanvala',
                'Rua 5, Casa n.º 77',
                'Angola'
            ]
        },
        {
            icon: Phone,
            title: 'Telefones',
            lines: [
                '+244 973 038 386',
                '+244 947 472 230'
            ]
        },
        {
            icon: Mail,
            title: 'Email',
            lines: [
                'geraleditoragraca@gmail.com'
            ]
        },
        {
            icon: Clock,
            title: 'Horário',
            lines: [
                'Segunda a Quinta: 08:00 - 18:00',
                'Sexta-feira: 08:00 - 16:00',
                'Sábado e Domingo: Fechado'
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            {/* Nav Padding Spacer */}
            <div className="h-[120px] lg:h-[128px] bg-brand-dark"></div>

            {/* Hero */}
            <section className="relative bg-brand-dark text-white pt-24 pb-48 overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-primary/5 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-primary/20 to-transparent"></div>

                <div className="container mx-auto px-6 md:px-8 relative z-10">
                    <div className="flex items-center gap-3 text-brand-primary uppercase tracking-[0.4em] font-black text-[10px] md:text-xs mb-10">
                        <button onClick={() => navigate('/')} className="hover:text-white transition-colors">Início</button>
                        <span className="text-gray-700">/</span>
                        <span className="text-white">Conexão Literária</span>
                    </div>

                    <div className="max-w-4xl">
                        <h1 className="text-5xl md:text-[8rem] font-black tracking-tighter mb-10 leading-[0.85]">
                            Vamos <span className="text-gradient-gold italic font-serif font-normal">Conversar</span>
                        </h1>
                        <p className="text-xl md:text-3xl text-gray-400 font-medium leading-relaxed max-w-2xl opacity-80">
                            Estamos prontos para ouvir sua história e elevar sua obra ao patamar que ela merece.
                        </p>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-24 md:py-32 -mt-32 relative z-20 optimize-render">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                        {/* Contact Form */}
                        <div className="lg:col-span-3">
                            <div className="glass-premium rounded-[3.5rem] p-10 md:p-16 border border-white/40 shadow-2xl shadow-brand-dark/5">
                                <div className="mb-12">
                                    <h2 className="text-3xl font-black text-brand-dark tracking-tighter mb-4 uppercase">
                                        Expanda seu <span className="text-gradient-gold italic font-serif lowercase">Legado</span>
                                    </h2>
                                    <p className="text-gray-500 font-bold text-sm opacity-80">
                                        Preencha os detalhes e nossa equipa de consultoria entrará em contacto.
                                    </p>
                                </div>

                                {formStatus === 'success' && (
                                    <div className="mb-8 p-8 bg-brand-primary/10 rounded-3xl flex items-center gap-6 animate-fade-in border border-brand-primary/20">
                                        <CheckCircle className="w-8 h-8 text-brand-primary flex-shrink-0" />
                                        <div>
                                            <h3 className="font-black text-brand-dark uppercase tracking-tight">Sinal Enviado!</h3>
                                            <p className="text-sm text-gray-500 font-bold">Nossa equipa já está a analisar o seu pedido.</p>
                                        </div>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-8">
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label htmlFor="name" className="text-[10px] uppercase tracking-[0.3em] font-black text-gray-400 ml-4">Nome de Autor</label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className={`w-full bg-gray-50/50 border-2 ${errors.name ? 'border-red-200' : 'border-transparent'} focus:border-brand-primary/30 focus:bg-white rounded-2xl px-6 py-5 text-brand-dark font-bold transition-all outline-none`}
                                                placeholder="Como gostaria de ser chamado?"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label htmlFor="email" className="text-[10px] uppercase tracking-[0.3em] font-black text-gray-400 ml-4">Canal Digital</label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className={`w-full bg-gray-50/50 border-2 ${errors.email ? 'border-red-200' : 'border-transparent'} focus:border-brand-primary/30 focus:bg-white rounded-2xl px-6 py-5 text-brand-dark font-bold transition-all outline-none`}
                                                placeholder="autor@exemplo.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label htmlFor="subject" className="text-[10px] uppercase tracking-[0.3em] font-black text-gray-400 ml-4">Tema do Diálogo</label>
                                        <select
                                            id="subject"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            className="w-full bg-gray-50/50 border-2 border-transparent focus:border-brand-primary/30 focus:bg-white rounded-2xl px-6 py-5 text-brand-dark font-bold transition-all outline-none appearance-none"
                                            title="Assunto"
                                        >
                                            <option value="">O que deseja partilhar?</option>
                                            <option value="manuscrito">Apresentação de Manuscrito</option>
                                            <option value="servicos">Consultoria Editorial de Elite</option>
                                            <option value="compra">Aquisição Corporativa</option>
                                            <option value="parceria">Aliança Estratégica</option>
                                            <option value="outro">Outras Aspirações</option>
                                        </select>
                                    </div>

                                    <div className="space-y-3">
                                        <label htmlFor="message" className="text-[10px] uppercase tracking-[0.3em] font-black text-gray-400 ml-4">A sua Narrativa</label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            rows={5}
                                            className="w-full bg-gray-50/50 border-2 border-transparent focus:border-brand-primary/30 focus:bg-white rounded-2xl px-6 py-5 text-brand-dark font-bold transition-all outline-none resize-none"
                                            placeholder="Descreva seu projeto ou necessidade..."
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={formStatus === 'success'}
                                        className="w-full py-7 bg-brand-dark text-white rounded-[1.5rem] font-black uppercase text-[11px] tracking-[0.3em] hover:bg-brand-primary hover:scale-[1.02] transition-all shadow-2xl shadow-brand-dark/10 flex items-center justify-center gap-4 group"
                                    >
                                        <span>Consolidar Mensagem</span>
                                        <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="lg:col-span-2 space-y-8">
                            {contactInfo.map((info, index) => {
                                const Icon = info.icon;
                                return (
                                    <div key={index} className="glass-premium rounded-[2.5rem] p-8 md:p-10 border border-white/40 shadow-xl shadow-brand-dark/5 hover:-translate-y-1 transition-all duration-500 group">
                                        <div className="flex items-start gap-6">
                                            <div className="w-16 h-16 bg-brand-primary/10 rounded-[1.5rem] flex items-center justify-center flex-shrink-0 group-hover:bg-brand-primary transition-all duration-500">
                                                <Icon className="w-7 h-7 text-brand-primary group-hover:text-white" />
                                            </div>
                                            <div>
                                                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 mb-2">{info.title}</h3>
                                                {info.lines.map((line, lineIndex) => (
                                                    <p key={lineIndex} className="text-brand-dark font-black text-lg md:text-xl leading-tight">
                                                        {line}
                                                    </p>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Social Media */}
                            <div className="bg-brand-dark rounded-[2.5rem] p-10 text-white relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/10 blur-[60px] rounded-full"></div>
                                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-brand-primary mb-8 relative z-10">Conexão Digital</h3>
                                <div className="flex gap-4 relative z-10">
                                    {[
                                        { icon: Facebook, label: 'Facebook' },
                                        { icon: Instagram, label: 'Instagram' },
                                        { icon: X, label: 'Twitter' }
                                    ].map((social, i) => (
                                        <a
                                            key={i}
                                            href="#"
                                            className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-brand-primary transition-all duration-500 hover:-translate-y-2 border border-white/10"
                                            title={social.label}
                                        >
                                            <social.icon className="w-6 h-6" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Map - Premium Version */}
            <section className="pb-24 md:pb-48">
                <div className="container mx-auto px-6 md:px-8">
                    <div className="relative group overflow-hidden rounded-[4rem] border border-gray-100 shadow-2xl">
                        <div className="aspect-[21/9] bg-gray-100 flex items-center justify-center">
                            <div className="text-center relative z-10">
                                <MapPin className="w-20 h-20 text-brand-primary mx-auto mb-8 animate-bounce" />
                                <h3 className="text-3xl font-black text-brand-dark tracking-tighter uppercase mb-4">Malanje, Angola</h3>
                                <p className="text-gray-400 font-bold uppercase tracking-[0.3em] text-xs">A Sede da Inspiração</p>
                            </div>
                            <div className="absolute inset-0 bg-brand-primary/5 opacity-50"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Section - Revamped */}
            <section className="py-24 md:py-48 bg-white border-t border-gray-100 relative overflow-hidden">
                <div className="container mx-auto px-6 md:px-8">
                    <div className="text-center mb-24">
                        <h2 className="text-4xl md:text-8xl font-black text-brand-dark tracking-tighter uppercase mb-8">
                            A Mente por trás da <br />
                            <span className="text-gradient-gold italic font-serif lowercase">excelência</span>
                        </h2>
                        <div className="w-24 h-2 bg-brand-primary mx-auto rounded-full"></div>
                    </div>

                    <div className="flex flex-wrap gap-4 justify-center mb-20">
                        {departments.map(dept => (
                            <button
                                key={dept}
                                onClick={() => setSelectedDepartment(dept)}
                                className={`px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all border-2 ${selectedDepartment === dept
                                    ? 'bg-brand-dark border-brand-dark text-white shadow-2xl'
                                    : 'bg-gray-50 border-transparent text-gray-400 hover:border-brand-primary/30 hover:text-brand-primary'
                                    }`}
                            >
                                {dept}
                            </button>
                        ))}
                    </div>

                    {isLoadingTeam ? (
                        <div className="flex justify-center py-32">
                            <Loader2 className="w-12 h-12 text-brand-primary animate-spin" />
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-12">
                            {filteredMembers.map((member: TeamMember) => (
                                <div
                                    key={member.id}
                                    className="group relative cursor-pointer"
                                    onClick={() => setSelectedMember(member)}
                                >
                                    <div className="aspect-[4/5] rounded-[3rem] overflow-hidden bg-gray-100 relative mb-8 shadow-2xl shadow-brand-dark/5 transition-all duration-700 group-hover:-translate-y-4">
                                        <img
                                            src={member.photoUrl}
                                            alt={member.name}
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                        <div className="absolute bottom-10 left-10 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                                            <span className="px-4 py-2 bg-brand-primary text-white text-[9px] font-black uppercase tracking-widest rounded-xl">
                                                {member.department}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-center px-4">
                                        <h3 className="text-3xl font-black text-brand-dark tracking-tighter mb-2 uppercase group-hover:text-brand-primary transition-colors">{member.name}</h3>
                                        <p className="text-gradient-gold font-serif font-black italic text-lg">{member.role}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Team Modal - Premium */}
            {selectedMember && (
                <div
                    className="fixed inset-0 bg-brand-dark/95 z-[100] flex items-center justify-center p-6 backdrop-blur-xl transition-all duration-500"
                    onClick={() => setSelectedMember(null)}
                >
                    <div
                        className="bg-white rounded-[4rem] max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-[0_0_100px_rgba(196,160,82,0.2)] relative flex flex-col md:flex-row"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setSelectedMember(null)}
                            className="absolute top-10 right-10 w-16 h-16 bg-brand-dark text-white rounded-full flex items-center justify-center hover:bg-brand-primary transition-all z-20 border-4 border-white shadow-2xl"
                            title="Fechar"
                        >
                            <X className="w-8 h-8" />
                        </button>

                        <div className="w-full md:w-[45%] aspect-square md:aspect-auto">
                            <img
                                src={selectedMember.photoUrl}
                                alt={selectedMember.name}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div className="flex-1 p-12 md:p-20 flex flex-col justify-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 blur-[80px] rounded-full"></div>

                            <div className="relative z-10">
                                <span className="inline-block px-6 py-2.5 bg-brand-primary/10 text-brand-primary text-[10px] font-black uppercase tracking-[0.3em] rounded-full mb-10">
                                    {selectedMember.department}
                                </span>

                                <h2 className="text-5xl md:text-7xl font-black text-brand-dark mb-4 tracking-tighter uppercase leading-none">{selectedMember.name}</h2>
                                <p className="text-2xl text-gradient-gold font-serif font-black italic mb-12">{selectedMember.role}</p>

                                <div className="w-20 h-2 bg-brand-primary/20 mb-12 rounded-full"></div>

                                <p className="text-gray-500 leading-relaxed text-xl font-medium italic opacity-90 border-l-4 border-brand-primary/20 pl-8">
                                    "{selectedMember.bio}"
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContactPage;
