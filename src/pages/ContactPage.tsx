import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, Facebook, Instagram, Twitter } from 'lucide-react';
import { ViewState } from '../types';

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
        </div>
    );
};

export default ContactPage;
