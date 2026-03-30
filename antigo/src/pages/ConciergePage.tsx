import React, { useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    Mail, Phone, MapPin, Send, Clock, CheckCircle,
    ArrowUpRight, Globe, Shield, MessageSquare,
    Headphones, Radio, Sparkles, Loader2
} from 'lucide-react';
import { sendEmail } from '../services/emailService';
import Map from '../components/Map';
import { PageHero } from '../components/PageHero';
import SEO from '../components/SEO';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Button } from '../components/ui/Button';

// Validation Schema
const contactSchema = z.object({
    name: z.string().min(2, 'Nome é necessário para a etiqueta protocolar'),
    email: z.string().email('Endereço de email inválido'),
    subject: z.string().min(3, 'Assunto é essencial'),
    message: z.string().min(10, 'A sua mensagem deve ter profundidade (mín. 10 chars)'),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface ConciergePageProps {
    siteContent?: Record<string, any>;
}

const ConciergePage: React.FC<ConciergePageProps> = ({ siteContent = {} }) => {
    const [formStatus, setFormStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const general = siteContent['general.config'] || {};

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ContactFormData>({
        resolver: zodResolver(contactSchema),
    });

    const onSubmit = async (data: ContactFormData) => {
        try {
            const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_CONTACT_TEMPLATE_ID || 'contact_placeholder';
            await sendEmail(TEMPLATE_ID, {
                from_name: data.name,
                from_email: data.email,
                subject: data.subject,
                message: data.message,
                to_name: 'Concierge Editora Graça',
            });
            setFormStatus('success');
            reset();
            setTimeout(() => setFormStatus('idle'), 6000);
        } catch (error) {
            console.error('Submission Error:', error);
            setFormStatus('error');
        }
    };

    const channels = [
        {
            icon: Phone,
            label: 'Linha Directa',
            val: general.contactPhone || '+244 973 038 386 | +244 947 472 230',
            sub: 'Disponível para consultoria imediata'
        },
        {
            icon: Mail,
            label: 'Correio Digital',
            val: general.contactEmail || 'geraleditoragraca@gmail.com',
            sub: 'Resposta garantida em 24h úteis'
        },
        {
            icon: MapPin,
            label: 'Atelier Físico',
            val: general.address || 'Malanje, Bairro Voanvala',
            sub: general.addressDetail || 'Rua 5, Casa n.º 77, Malanje, Angola'
        }
    ];

    return (
        <div className="min-h-screen bg-white selection:bg-brand-primary selection:text-white">
            <SEO
                title="Concierge & Contacto"
                description="Entre em contacto com o serviço de concierge da Editora Graça. Consultoria editorial de elite ao seu dispor."
            />

            <PageHero
                title={<>Nossos <br /><span className="text-brand-primary italic font-serif font-normal lowercase text-4xl sm:text-6xl md:text-8xl">Contactos</span></>}
                subtitle="Inicie um diálogo com a vanguarda literária. Estamos preparados para transformar a sua visão num legado imortal."
                breadcrumb={[{ label: 'Fale Connosco' }]}
                decorativeText="CONTACTO"
                titleClassName="text-4xl sm:text-5xl md:text-7xl lg:text-[10rem] font-black uppercase leading-[0.8] tracking-tighter mb-4"
            />

            <section className="section-fluid relative overflow-hidden">
                <div className="container">
                    <div className="grid lg:grid-cols-2 gap-24 items-start">
                        {/* Status & Info */}
                        <div className="space-y-16">
                            <div className="space-y-6">
                                <span className="text-brand-primary font-black text-xs uppercase tracking-[0.5em]">Excelência no Atendimento</span>
                                <h2 className="uppercase tracking-tighter leading-none">
                                    Canais de <br /><span className="text-brand-primary italic font-serif lowercase font-normal">Exclusividade</span>
                                </h2>
                                <p className="text-xl text-gray-400 font-medium leading-relaxed max-w-xl">
                                    Valorizamos o seu tempo e a sua visão. Escolha o canal que melhor se adapta à urgência do seu projecto.
                                </p>
                            </div>

                            <div className="space-y-8">
                                {channels.map((ch, i) => (
                                    <m.div
                                        key={i}
                                        initial={{ opacity: 0, x: -30 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 }}
                                        className="group p-10 bg-gray-50 rounded-[3rem] border border-gray-100 hover:border-brand-primary/20 transition-all duration-700 hover:shadow-2xl"
                                    >
                                        <div className="flex items-center gap-8">
                                            <div className="w-16 h-16 bg-brand-dark text-brand-primary rounded-2xl flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-colors duration-500">
                                                <ch.icon className="w-8 h-8" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-brand-primary mb-1">{ch.label}</p>
                                                <p className="text-2xl font-black text-brand-dark tracking-tight">{ch.val}</p>
                                                <p className="text-xs text-gray-400 mt-1 font-medium italic">{ch.sub}</p>
                                            </div>
                                        </div>
                                    </m.div>
                                ))}
                            </div>

                            <div className="p-10 bg-brand-dark rounded-[3rem] text-white flex items-center gap-8 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary opacity-10 blur-3xl"></div>
                                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center shrink-0 border border-white/10">
                                    <Clock className="w-8 h-8 text-brand-primary animate-pulse" />
                                </div>
                                <div>
                                    <h4 className="font-black uppercase tracking-widest text-sm">Disponibilidade Atemporal</h4>
                                    <p className="text-gray-400 text-sm mt-1 leading-relaxed">Segunda a Sexta, das 08h às 18h. <br />Sábados por marcação exclusiva.</p>
                                </div>
                            </div>
                        </div>

                        {/* Minimalist Form */}
                        <m.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-white p-12 md:p-20 rounded-[4rem] border border-gray-100 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.08)] relative"
                        >
                            <AnimatePresence mode="wait">
                                {formStatus === 'success' ? (
                                    <m.div
                                        key="success"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="py-20 text-center space-y-8"
                                    >
                                        <div className="w-32 h-32 bg-brand-primary/10 text-brand-primary rounded-[3rem] flex items-center justify-center mx-auto shadow-2xl">
                                            <CheckCircle className="w-16 h-16" />
                                        </div>
                                        <div className="space-y-4">
                                            <h3 className="text-4xl font-black text-brand-dark uppercase tracking-tighter">Mensagem Entregue</h3>
                                            <p className="text-gray-400 font-medium max-w-xs mx-auto">O nosso concierge irá analisar a sua solicitação com o máximo rigor intelectual.</p>
                                        </div>
                                        <button
                                            onClick={() => setFormStatus('idle')}
                                            className="px-10 py-5 bg-brand-dark text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-brand-primary transition-all"
                                        >
                                            Nova Mensagem
                                        </button>
                                    </m.div>
                                ) : (
                                    <m.form
                                        key="form"
                                        onSubmit={handleSubmit(onSubmit)}
                                        className="space-y-12"
                                    >
                                        <div className="space-y-10">
                                            <Input
                                                label="IDENTIFICAÇÃO PROTOCOLAR"
                                                variant="light"
                                                placeholder="O seu nome completo..."
                                                {...register('name')}
                                                error={errors.name?.message}
                                                className="border-b-2 focus:border-brand-primary transition-colors"
                                            />
                                            <Input
                                                label="ENDEREÇO DE RESPOSTA"
                                                variant="light"
                                                type="email"
                                                placeholder="email@instituicao.com"
                                                {...register('email')}
                                                error={errors.email?.message}
                                                className="border-b-2 focus:border-brand-primary transition-colors"
                                            />
                                            <Input
                                                label="NATUREZA DA SOLICITAÇÃO"
                                                variant="light"
                                                placeholder="Assunto da sua mensagem..."
                                                {...register('subject')}
                                                error={errors.subject?.message}
                                                className="border-b-2 focus:border-brand-primary transition-colors"
                                            />
                                            <Textarea
                                                label="CORPO DO TEXTO"
                                                variant="light"
                                                placeholder="Descreva a sua visão literária ou necessidade técnica..."
                                                rows={4}
                                                {...register('message')}
                                                error={errors.message?.message}
                                                className="border-b-2 focus:border-brand-primary transition-colors"
                                            />
                                        </div>

                                        <Button
                                            type="submit"
                                            isLoading={isSubmitting}
                                            className="w-full h-20 bg-brand-dark text-white rounded-3xl font-black text-[11px] uppercase tracking-[0.5em] hover:bg-brand-primary hover:scale-[1.02] shadow-2xl transition-all"
                                            rightIcon={!isSubmitting && <Send className="w-5 h-5 ml-4" />}
                                        >
                                            {isSubmitting ? 'A Sincronizar Mensagem...' : 'Enviar para o Concierge'}
                                        </Button>

                                        {formStatus === 'error' && (
                                            <p className="text-red-500 text-center font-bold text-xs animate-shake">
                                                Erro ao enviar. Por favor, utilize os canais directos acima.
                                            </p>
                                        )}
                                    </m.form>
                                )}
                            </AnimatePresence>
                        </m.div>
                    </div>
                </div>

                {/* Decorative background blur */}
                <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-brand-primary/5 blur-[150px] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
            </section>

            {/* Interactive Location Hub */}
            <section className="py-24 bg-gray-50">
                <div className="container mx-auto px-6 md:px-12">
                    <div className="bg-white rounded-[4rem] overflow-hidden shadow-3xl border border-gray-100">
                        <div className="grid lg:grid-cols-[1fr_450px]">
                            <div className="h-[600px] relative">
                                <Map
                                    center={[-9.540, 16.347]}
                                    zoom={15}
                                    markerLabel="Editora Graça - Atelier Central"
                                />
                            </div>
                            <div className="p-16 md:p-24 flex flex-col justify-center space-y-12">
                                <div className="space-y-4">
                                    <h3 className="text-4xl font-black text-brand-dark uppercase tracking-tighter">O Nosso <br />Locus Mundi</h3>
                                    <p className="text-gray-400 font-medium leading-relaxed italic">
                                        "No coração de Malanje, onde a tradição se encontra com o amanhã literário."
                                    </p>
                                </div>

                                <div className="space-y-8">
                                    <div className="flex items-center gap-6">
                                        <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100">
                                            <Globe className="w-6 h-6 text-brand-primary" />
                                        </div>
                                        <div>
                                            <p className="font-black text-brand-dark text-lg uppercase tracking-tight">Angola</p>
                                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Base de Operações</p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => window.open('https://maps.google.com?q=-9.540,16.347', '_blank')}
                                        className="w-full py-6 border-2 border-brand-dark text-brand-dark rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-brand-dark hover:text-white transition-all flex items-center justify-center gap-4 group"
                                    >
                                        Obter Direcções <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final Reassurance */}
            <section className="py-32 bg-white">
                <div className="container mx-auto px-6 md:px-12 text-center max-w-4xl space-y-12">
                    <Sparkles className="w-16 h-16 text-brand-primary mx-auto opacity-50" />
                    <h2 className="text-5xl md:text-8xl font-black text-brand-dark uppercase tracking-tighter leading-none">
                        Privacidade <br /><span className="text-brand-primary">Absoluta</span>
                    </h2>
                    <p className="text-2xl text-gray-400 font-medium leading-relaxed italic">
                        "Toda a comunicação literária é tratada com o mais alto nível de confidencialidade e respeito pela propriedade intelectual."
                    </p>
                </div>
            </section>
        </div>
    );
};

export default ConciergePage;
