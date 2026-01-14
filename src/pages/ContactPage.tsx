import React, { useState, useEffect } from 'react';
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

interface ContactPageProps {
    onNavigate: (view: ViewState) => void;
}

const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
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
        console.log('Form submitted:', formData);
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
        <div className="min-h-screen bg-brand-light">
            {/* Hero */}
            <section className="bg-brand-dark text-white py-12 md:py-16">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="flex items-center justify-center md:justify-start gap-2 text-[10px] md:text-sm text-brand-primary uppercase tracking-widest font-bold mb-6">
                        <button onClick={() => onNavigate('HOME')} className="hover:underline">Início</button>
                        <span>/</span>
                        <span>Contacto</span>
                    </div>

                    <div className="max-w-3xl text-center md:text-left">
                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 md:mb-6 leading-tight">
                            Entre em <span className="text-brand-primary italic font-serif font-normal">Contacto</span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-300 font-medium">
                            Estamos prontos para atender suas dúvidas e receber seu manuscrito.
                        </p>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-12 md:py-24">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                        {/* Contact Form */}
                        <div className="lg:col-span-3">
                            <div className="bg-white rounded-3xl shadow-xl p-6 md:p-12">
                                <div className="mb-8">
                                    <h2 className="text-2xl md:text-3xl font-black text-brand-dark tracking-tighter mb-4">
                                        Envie-nos uma Mensagem
                                    </h2>
                                    <p className="text-sm md:text-base text-gray-600">
                                        Preencha o formulário abaixo e responderemos o mais breve possível.
                                    </p>
                                </div>

                                {formStatus === 'success' && (
                                    <div className="mb-6 p-6 bg-green-50 border border-green-200 rounded-xl flex items-center gap-4 animate-fade-in">
                                        <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                                        <div>
                                            <h3 className="font-bold text-green-900">Mensagem Enviada!</h3>
                                            <p className="text-sm text-green-700">Entraremos em contacto em breve.</p>
                                        </div>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-bold text-brand-dark mb-2 uppercase tracking-wider">
                                            Nome Completo *
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${errors.name
                                                ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                                                : 'border-gray-300 focus:border-brand-primary focus:ring-brand-primary/10'
                                                }`}
                                            placeholder="Seu nome completo"
                                        />
                                        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="block text-sm font-bold text-brand-dark mb-2 uppercase tracking-wider">
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${errors.email
                                                ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                                                : 'border-gray-300 focus:border-brand-primary focus:ring-brand-primary/10'
                                                }`}
                                            placeholder="seu.email@exemplo.com"
                                        />
                                        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="subject" className="block text-sm font-bold text-brand-dark mb-2 uppercase tracking-wider">
                                            Assunto *
                                        </label>
                                        <select
                                            id="subject"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${errors.subject
                                                ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                                                : 'border-gray-300 focus:border-brand-primary focus:ring-brand-primary/10'
                                                }`}
                                        >
                                            <option value="">Selecione um assunto</option>
                                            <option value="manuscrito">Submissão de Manuscrito</option>
                                            <option value="servicos">Orçamento de Serviços</option>
                                            <option value="compra">Compra de Livros</option>
                                            <option value="parceria">Parceria / Colaboração</option>
                                            <option value="outro">Outro</option>
                                        </select>
                                        {errors.subject && <p className="mt-1 text-sm text-red-600">{errors.subject}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="message" className="block text-sm font-bold text-brand-dark mb-2 uppercase tracking-wider">
                                            Mensagem *
                                        </label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            rows={6}
                                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all resize-none ${errors.message
                                                ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                                                : 'border-gray-300 focus:border-brand-primary focus:ring-brand-primary/10'
                                                }`}
                                            placeholder="Escreva sua mensagem aqui..."
                                        />
                                        {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message}</p>}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={formStatus === 'success'}
                                        className="w-full btn-premium justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Send className="w-5 h-5" />
                                        Enviar Mensagem
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="lg:col-span-2 space-y-6">
                            {contactInfo.map((info, index) => {
                                const Icon = info.icon;
                                return (
                                    <div key={index} className="bg-white rounded-2xl shadow-lg p-5 md:p-6 hover:shadow-xl transition-all">
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 md:w-12 md:h-12 bg-brand-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                                <Icon className="w-5 h-5 md:w-6 md:h-6 text-brand-primary" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-brand-dark mb-2 text-sm md:text-base">{info.title}</h3>
                                                {info.lines.map((line, lineIndex) => (
                                                    <p key={lineIndex} className="text-gray-600 text-[13px] md:text-sm leading-relaxed">
                                                        {line}
                                                    </p>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Social Media */}
                            <div className="bg-brand-dark rounded-2xl shadow-lg p-6 text-white">
                                <h3 className="font-bold mb-4">Siga-nos nas Redes Sociais</h3>
                                <div className="flex gap-3">
                                    <a
                                        href="#"
                                        className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-brand-primary transition-all"
                                        title="Facebook"
                                        aria-label="Seguir no Facebook"
                                    >
                                        <Facebook className="w-5 h-5" />
                                    </a>
                                    <a
                                        href="#"
                                        className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-brand-primary transition-all"
                                        title="Instagram"
                                        aria-label="Seguir no Instagram"
                                    >
                                        <Instagram className="w-5 h-5" />
                                    </a>
                                    <a
                                        href="#"
                                        className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-brand-primary transition-all"
                                        title="Twitter"
                                        aria-label="Seguir no Twitter"
                                    >
                                        <Twitter className="w-5 h-5" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Map */}
            <section className="pb-16 md:pb-24">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                        <div className="aspect-video bg-gray-200 flex items-center justify-center p-6">
                            <div className="text-center space-y-4">
                                <MapPin className="w-12 h-12 md:w-16 md:h-16 text-brand-primary mx-auto" />
                                <div>
                                    <h3 className="text-lg md:text-xl font-bold text-brand-dark mb-2">Nossa Localização</h3>
                                    <p className="text-sm md:text-base text-gray-600 text-balance">Malanje, Bairro Voanvala, Rua 5, Casa n.º 77</p>
                                    <p className="text-[10px] md:text-sm text-gray-500 mt-4">
                                        (Mapa do Google Maps será integrado em breve)
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Integration */}
            <section className="py-24 bg-white border-t border-gray-100">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="text-center mb-16">
                        <span className="text-brand-primary font-black text-xs uppercase tracking-[0.3em] mb-4 block">A Nossa Gente</span>
                        <h2 className="text-4xl md:text-6xl font-black text-brand-dark tracking-tighter leading-tight">
                            Conheça a <span className="text-brand-primary italic font-serif font-normal">Equipa</span>
                        </h2>
                        <p className="text-lg text-gray-600 mt-6 max-w-2xl mx-auto font-medium">
                            Conheça os profissionais apaixonados que tornam todos os projetos literários possíveis.
                        </p>
                    </div>

                    {/* Department Filter */}
                    <div className="flex flex-wrap gap-2 md:gap-3 justify-center mb-16">
                        {departments.map(dept => (
                            <button
                                key={dept}
                                onClick={() => setSelectedDepartment(dept)}
                                className={`px-4 md:px-6 py-2 md:py-3 rounded-xl font-bold text-[10px] md:text-xs uppercase tracking-widest transition-all border-2 ${selectedDepartment === dept
                                    ? 'bg-brand-primary border-brand-primary text-white shadow-lg'
                                    : 'bg-white border-gray-100 text-gray-500 hover:border-brand-primary hover:text-brand-primary'
                                    }`}
                            >
                                {dept}
                            </button>
                        ))}
                    </div>

                    {isLoadingTeam ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="w-12 h-12 text-brand-primary animate-spin" />
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
                            {filteredMembers.map((member: TeamMember) => (
                                <div
                                    key={member.id}
                                    className="bg-brand-light/50 rounded-[2rem] shadow-sm overflow-hidden hover:shadow-xl transition-all duration-500 group cursor-pointer border border-gray-100 flex flex-col"
                                    onClick={() => setSelectedMember(member)}
                                >
                                    <div className="aspect-square overflow-hidden bg-gray-50 relative">
                                        <img
                                            src={member.photoUrl}
                                            alt={member.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                                    </div>
                                    <div className="p-8 text-center flex-1 flex flex-col">
                                        <div className="mb-4">
                                            <span className="px-3 py-1 bg-brand-primary/10 text-brand-primary text-[9px] font-black uppercase tracking-widest rounded-full">
                                                {member.department}
                                            </span>
                                        </div>
                                        <h3 className="text-2xl font-black text-brand-dark mb-1 tracking-tighter group-hover:text-brand-primary transition-colors">{member.name}</h3>
                                        <p className="text-brand-primary font-serif font-bold italic mb-4 text-base">{member.role}</p>
                                        <p className="text-gray-600 leading-relaxed line-clamp-2 text-sm font-medium mb-6 flex-1">{member.bio}</p>
                                        <div className="mt-auto">
                                            <button className="text-brand-primary font-black text-[10px] uppercase tracking-widest border-b-2 border-brand-primary pb-0.5 hover:text-brand-dark hover:border-brand-dark transition-all">
                                                Ver Perfil
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Team Member Modal */}
            {selectedMember && (
                <div
                    className="fixed inset-0 bg-brand-dark/90 z-[100] flex items-center justify-center p-4 animate-fade-in backdrop-blur-md"
                    onClick={() => setSelectedMember(null)}
                >
                    <div
                        className="bg-white rounded-[2.5rem] max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setSelectedMember(null)}
                            className="absolute top-6 right-6 w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-brand-primary hover:text-white transition-all z-20 shadow-lg text-brand-dark border border-gray-100"
                            title="Fechar"
                            aria-label="Fechar detalhes do membro"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="flex flex-col md:flex-row">
                            <div className="w-full md:w-1/2 aspect-square md:aspect-auto overflow-hidden bg-gray-100">
                                <img
                                    src={selectedMember.photoUrl}
                                    alt={selectedMember.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className="p-8 md:p-16 w-full md:w-1/2 flex flex-col justify-center">
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-primary/10 rounded-full mb-8">
                                    <Users className="w-4 h-4 text-brand-primary" />
                                    <span className="text-brand-primary font-black text-[10px] uppercase tracking-widest">
                                        {selectedMember.department}
                                    </span>
                                </div>

                                <h2 className="text-4xl font-black text-brand-dark mb-4 tracking-tighter leading-none">{selectedMember.name}</h2>
                                <p className="text-xl text-brand-primary font-serif font-bold italic mb-10">{selectedMember.role}</p>

                                <div className="w-12 h-1 bg-brand-primary/20 mb-10"></div>

                                <p className="text-gray-600 leading-relaxed text-lg font-medium italic">
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
