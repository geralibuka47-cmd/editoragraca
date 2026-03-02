import React, { useState, useEffect } from 'react';
import { motion as m, AnimatePresence } from 'framer-motion';
import { Type, MessageSquare, Save, Plus, Trash2, Edit, Users, Star, Loader2, ChevronRight, Globe, Layout, Image as ImageIcon, Briefcase, FileText, CheckCircle2, X, Tag, Zap, Sparkles } from 'lucide-react';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { getSiteContent, saveSiteContent, getTestimonials, saveTestimonial, saveEditorialService, saveTeamMember } from '../../services/dataService';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';

// Validation Schema for Testimonials
const testimonialSchema = z.object({
    name: z.string().min(2, 'Nome é obrigatório'),
    role: z.string().min(2, 'Cargo/Titulação é obrigatório'),
    content: z.string().min(10, 'O testemunho deve ter conteúdo'),
    rating: z.coerce.number().min(1).max(5),
    photo_url: z.string().url('URL inválida').or(z.string().length(0)).optional(),
    is_active: z.boolean().optional().default(true),
});

type TestimonialFormData = z.infer<typeof testimonialSchema>;


const AdminContentPage: React.FC = () => {
    const [activeSubTab, setActiveSubTab] = useState<'text' | 'testimonials'>('text');
    const [selectedPage, setSelectedPage] = useState<'home' | 'about' | 'services' | 'team'>('home');
    const [siteContent, setSiteContent] = useState<any>({});
    const [testimonials, setTestimonials] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<string | null>(null);

    // Testimonial Form
    const [showTestimonialModal, setShowTestimonialModal] = useState(false);
    const [selectedTestimonialId, setSelectedTestimonialId] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors, isSubmitting: isSavingTestimonial },
    } = useForm<any>({
        resolver: zodResolver(testimonialSchema),
        defaultValues: {
            name: '',
            role: '',
            content: '',
            rating: 5,
            photo_url: '',
            is_active: true,
        },
    });

    const currentRating = watch('rating');




    useEffect(() => {
        loadData();
    }, [selectedPage, activeSubTab]);

    const loadData = async () => {
        setIsLoading(true);
        try {
            if (activeSubTab === 'text') {
                const content = await getSiteContent(selectedPage);
                setSiteContent(content);
            } else {
                const t = await getTestimonials();
                setTestimonials(t);
            }
        } catch (error) {
            console.error("Error loading admin content:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveText = async (key: string, value: any) => {
        setIsSaving(true);
        setLastSaved(null);
        try {
            const sanitizedValue = typeof value === 'string' ? value.trim() : value;
            await saveSiteContent(key, selectedPage, sanitizedValue);
            setSiteContent({ ...siteContent, [key]: sanitizedValue });
            setLastSaved(key);
            setTimeout(() => setLastSaved(null), 3000);
        } catch (error) {
            console.error("Error saving text:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCreateTestimonial = () => {
        setSelectedTestimonialId(null);
        reset({
            name: '',
            role: '',
            content: '',
            rating: 5,
            photo_url: '',
            is_active: true,
        });
        setShowTestimonialModal(true);
    };

    const handleEditTestimonial = (testimonial: any) => {
        setSelectedTestimonialId(testimonial.id);
        reset({
            name: testimonial.name,
            role: testimonial.role,
            content: testimonial.content,
            rating: testimonial.rating || 5,
            photo_url: testimonial.photo_url || '',
            is_active: testimonial.is_active !== false,
        });
        setShowTestimonialModal(true);
    };

    const onSubmitTestimonial = async (data: TestimonialFormData) => {
        try {
            const sanitizedTestimonial = {
                ...data,
                id: selectedTestimonialId,
                name: data.name.trim(),
                role: data.role.trim(),
                content: data.content.trim(),
                rating: Number(data.rating) || 5,
                photo_url: data.photo_url?.trim() || ''
            };

            await saveTestimonial(sanitizedTestimonial);
            setShowTestimonialModal(false);
            loadData();
        } catch (error) {
            console.error("Error saving testimonial:", error);
        }
    };

    const editFields: Record<string, { label: string; type: 'text' | 'textarea' | 'json'; icon: any }> = {
        'home.hero.title': { label: 'Título Hero', type: 'text', icon: Type },
        'home.hero.subtitle': { label: 'Subtítulo Hero', type: 'text', icon: Type },
        'home.hero.description': { label: 'Descrição Hero', type: 'textarea', icon: Layout },
        'home.experience.list': { label: 'Lista de Experiência (JSON: string[])', type: 'json', icon: FileText },
        'home.experience.premium_title': { label: 'Card Premium - Título', type: 'text', icon: Star },
        'home.experience.premium_desc': { label: 'Card Premium - Descrição', type: 'textarea', icon: MessageSquare },
        'home.experience.eternal_title': { label: 'Card Eterno - Título', type: 'text', icon: Zap },
        'home.experience.eternal_desc': { label: 'Card Eterno - Descrição', type: 'textarea', icon: MessageSquare },
        'home.newsletter.title': { label: 'Título Newsletter', type: 'text', icon: Type },
        'home.newsletter.description': { label: 'Descrição Newsletter', type: 'textarea', icon: MessageSquare },

        'about.hero.text': { label: 'Texto Hero (Principal)', type: 'textarea', icon: Layout },
        'about.mission.title': { label: 'Título Missão', type: 'text', icon: Type },
        'about.philosophy': { label: 'Filosofia Grid (JSON)', type: 'json', icon: Sparkles },
        'about.values': { label: 'Pilhares de Prestígio (JSON)', type: 'json', icon: FileText },
        'about.stats': { label: 'Métricas de Impacto (JSON)', type: 'json', icon: Layout },
        'about.timeline': { label: 'Timeline Narrativa (JSON)', type: 'json', icon: Globe },
        'about.vision.quote': { label: 'Citação do Fundador', type: 'textarea', icon: MessageSquare },

        'services.hero.title': { label: 'Título Hero (Serviços)', type: 'text', icon: Type },
        'services.hero.subtitle': { label: 'Subtítulo Hero (Serviços)', type: 'text', icon: Type },
        'services.hero.description': { label: 'Descrição Hero (Serviços)', type: 'textarea', icon: Briefcase },
        'services.methodology': { label: 'Arquitetura do Legado (JSON)', type: 'json', icon: Sparkles },
        'services.cta.title': { label: 'Título CTA', type: 'text', icon: Type },
        'services.cta.description': { label: 'Descrição CTA', type: 'textarea', icon: MessageSquare },

        'team.hero.title': { label: 'Título Hero (Equipa)', type: 'text', icon: Type },
        'team.hero.subtitle': { label: 'Subtítulo Hero (Equipa)', type: 'text', icon: Type },
        'team.hero.description': { label: 'Descrição Hero (Equipa)', type: 'textarea', icon: Users },
        'team.cta.title': { label: 'Título CTA (Equipa)', type: 'text', icon: Type },
        'team.cta.description': { label: 'Descrição CTA (Equipa)', type: 'textarea', icon: MessageSquare },
    };

    const getKeysForPage = () => {
        if (selectedPage === 'home') return ['home.hero.title', 'home.hero.subtitle', 'home.hero.description', 'home.experience.list', 'home.experience.premium_title', 'home.experience.premium_desc', 'home.experience.eternal_title', 'home.experience.eternal_desc', 'home.newsletter.title', 'home.newsletter.description'];
        if (selectedPage === 'about') return ['about.hero.text', 'about.mission.title', 'about.philosophy', 'about.values', 'about.stats', 'about.timeline', 'about.vision.quote'];
        if (selectedPage === 'services') return ['services.hero.title', 'services.hero.subtitle', 'services.hero.description', 'services.methodology', 'services.cta.title', 'services.cta.description'];
        return ['team.hero.title', 'team.hero.subtitle', 'team.hero.description', 'team.cta.title', 'team.cta.description'];
    };

    return (
        <div className="space-y-6">
            <AdminPageHeader title="Conteúdo do Site" subtitle="Gestão de textos e testemunhos por secção" highlight="Gestão" />

            <div className="flex flex-wrap gap-2 p-1.5 bg-gray-100 rounded-lg border border-gray-200 w-fit">
                <button
                    onClick={() => setActiveSubTab('text')}
                    className={`px-6 py-2 rounded-md text-xs font-semibold transition-all ${activeSubTab === 'text' ? 'bg-white text-brand-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <Type className="w-4 h-4 inline mr-2" />
                    Textos
                </button>
                <button
                    onClick={() => setActiveSubTab('testimonials')}
                    className={`px-6 py-2 rounded-md text-xs font-semibold transition-all ${activeSubTab === 'testimonials' ? 'bg-white text-brand-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <MessageSquare className="w-4 h-4 inline mr-2" />
                    Testemunhos
                </button>
            </div>

            <AnimatePresence mode="wait">
                {activeSubTab === 'text' ? (
                    <m.div
                        key="text-editor"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="grid xl:grid-cols-4 gap-12"
                    >
                        {/* Page Selector Sidebar */}
                        <div className="xl:col-span-1 space-y-2">
                            {['home', 'about', 'services', 'team'].map((page) => (
                                <button
                                    key={page}
                                    onClick={() => setSelectedPage(page as any)}
                                    className={`w-full px-5 py-4 rounded-lg text-left transition-all border flex items-center justify-between group ${selectedPage === page ? 'bg-brand-primary border-brand-primary text-white shadow-sm' : 'bg-white border-gray-200 text-gray-500 hover:border-brand-primary/50 hover:text-gray-900'}`}
                                >
                                    <span className="font-semibold uppercase tracking-wider text-[11px]">{page}</span>
                                    <ChevronRight className={`w-4 h-4 transition-transform ${selectedPage === page ? 'text-white translate-x-1' : 'text-gray-300 group-hover:text-gray-500'}`} />
                                </button>
                            ))}
                        </div>

                        {/* Editor Area */}
                        <div className="xl:col-span-3 bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                            <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-brand-primary/10 rounded-lg flex items-center justify-center">
                                        <Layout className="w-5 h-5 text-brand-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 tracking-tight capitalize">{selectedPage}</h3>
                                        <p className="text-[10px] font-medium uppercase tracking-widest text-gray-500">Editor de Componentes</p>
                                    </div>
                                </div>
                                {isLoading && <Loader2 className="w-5 h-5 text-brand-primary animate-spin" />}
                            </div>

                            <div className="p-8 space-y-12">
                                {getKeysForPage().map((key) => {
                                    const field = editFields[key];
                                    if (!field) return null;

                                    return (
                                        <div
                                            key={key}
                                            className="space-y-4 pb-8 border-b border-gray-50 last:border-0 last:pb-0"
                                        >
                                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                                <div className="flex items-center gap-2.5">
                                                    <field.icon className="w-4 h-4 text-brand-primary" />
                                                    <label htmlFor={`field-ctrl-${key}`} className="text-xs font-semibold text-gray-700 capitalize">{field.label}</label>
                                                </div>
                                                <button
                                                    onClick={() => handleSaveText(key, siteContent[key])}
                                                    disabled={isSaving}
                                                    className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-2 border ${lastSaved === key ? 'bg-green-50 border-green-200 text-green-600' : 'bg-brand-primary/5 border-brand-primary/10 text-brand-primary hover:bg-brand-primary hover:text-white'}`}
                                                >
                                                    {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : (lastSaved === key ? <CheckCircle2 className="w-3 h-3" /> : <Save className="w-3 h-3" />)}
                                                    {lastSaved === key ? 'Gravado' : 'Gravar'}
                                                </button>
                                            </div>

                                            {/* We use standard HTML elements here for flexibility with the dynamic JSON/Text handling, 
                                                but styled to match our premium components */}
                                            {field.type === 'textarea' || field.type === 'json' ? (
                                                <Textarea
                                                    id={`field-ctrl-${key}`}
                                                    placeholder={`Insira aqui o conteúdo para ${field.label.toLowerCase()}...`}
                                                    className="h-32 min-h-[120px] text-gray-600 leading-relaxed text-sm rounded-lg"
                                                    value={field.type === 'json' ? JSON.stringify(siteContent[key] || [], null, 2) : (siteContent[key] || '')}
                                                    onChange={(e) => {
                                                        let val = e.target.value;
                                                        if (field.type === 'json') {
                                                            try { val = JSON.parse(e.target.value); } catch { return; }
                                                        }
                                                        setSiteContent({ ...siteContent, [key]: val });
                                                    }}
                                                />
                                            ) : (
                                                <Input
                                                    id={`field-ctrl-${key}`}
                                                    placeholder={`Defina o ${field.label.toLowerCase()}...`}
                                                    className="text-gray-900 text-sm font-medium rounded-lg"
                                                    value={siteContent[key] || ''}
                                                    onChange={(e) => setSiteContent({ ...siteContent, [key]: e.target.value })}
                                                />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </m.div>
                ) : (
                    <m.div
                        key="testimonials-view"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-12"
                    >
                        <div className="flex justify-end">
                            <button
                                onClick={handleCreateTestimonial}
                                className="px-6 py-2.5 bg-brand-primary text-white rounded-lg text-sm font-semibold hover:bg-brand-dark transition-colors flex items-center justify-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Novo Testemunho</span>
                            </button>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                            <AnimatePresence mode="popLayout">
                                {testimonials.map((t, idx) => (
                                    <m.div
                                        key={t.id || idx}
                                        layout
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="bg-white p-8 rounded-xl border border-gray-200 relative group transition-all hover:border-brand-primary/30 shadow-sm"
                                    >
                                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-primary/20 to-transparent" />

                                        <div className="absolute top-6 right-6 flex gap-2">
                                            <button
                                                onClick={() => handleEditTestimonial(t)}
                                                className="p-2 text-gray-400 hover:text-brand-primary hover:bg-brand-primary/10 rounded-lg transition-colors"
                                                title="Editar"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="flex gap-1 mb-6">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={`w-3.5 h-3.5 ${i < (t.rating || 5) ? 'text-brand-primary fill-current' : 'text-gray-200'}`} />
                                            ))}
                                        </div>

                                        <div className="relative mb-8">
                                            <p className="text-gray-600 italic text-sm leading-relaxed line-clamp-6">"{t.content}"</p>
                                        </div>

                                        <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
                                            <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center border border-gray-200 shadow-sm">
                                                {t.photo_url ? (
                                                    <img src={t.photo_url} alt={t.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <Users className="w-6 h-6 text-gray-400" />
                                                )}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900 text-sm tracking-tight">{t.name}</h4>
                                                <p className="text-[10px] text-brand-primary font-bold uppercase tracking-wider">{t.role}</p>
                                            </div>
                                        </div>
                                    </m.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </m.div>
                )}
            </AnimatePresence>

            {/* Testimonial Modal */}
            <AnimatePresence>
                {showTestimonialModal && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <m.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowTestimonialModal(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-2xl"
                        />
                        <m.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-xl relative z-20 border border-gray-200 flex flex-col"
                        >
                            <div className="p-8 border-b border-gray-100 relative">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 tracking-tight">Novo Testemunho</h3>
                                        <p className="text-xs text-gray-500">Gestão de prova social e impacto</p>
                                    </div>
                                    <button
                                        onClick={() => setShowTestimonialModal(false)}
                                        className="p-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
                                        title="Fechar"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit(onSubmitTestimonial)} className="flex-1 overflow-y-auto p-8 space-y-6">

                                <div className="grid md:grid-cols-2 gap-6">
                                    <Input
                                        label="Nome do Autor"
                                        placeholder="EX: PEDRO ALVARES"
                                        icon={<Users className="w-4 h-4" />}
                                        {...register('name')}
                                        error={errors.name?.message as string}
                                        className="rounded-lg"
                                    />
                                    <Input
                                        label="Cargo / Titulação"
                                        placeholder="EX: LEITOR ASSÍDUO"
                                        icon={<Tag className="w-4 h-4" />}
                                        {...register('role')}
                                        error={errors.role?.message as string}
                                        className="rounded-lg"
                                    />
                                </div>

                                <Textarea
                                    label="Conteúdo do Testemunho"
                                    placeholder="Descreva a experiência literária..."
                                    rows={4}
                                    {...register('content')}
                                    error={errors.content?.message as string}
                                    className="rounded-lg"
                                />

                                <div className="grid md:grid-cols-2 gap-6">
                                    <Input
                                        label="Foto (URL)"
                                        placeholder="HTTPS://..."
                                        icon={<ImageIcon className="w-4 h-4" />}
                                        {...register('photo_url')}
                                        error={errors.photo_url?.message as string}
                                        className="rounded-lg"
                                    />
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 ml-1">Avaliação</label>
                                        <div className="flex bg-gray-50 border border-gray-100 p-2 rounded-lg items-center justify-around h-11">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    title={`Avaliar com ${star} estrelas`}
                                                    onClick={() => setValue('rating', star)}
                                                    className={`p-1 transition-all ${currentRating >= star ? 'text-brand-primary fill-current' : 'text-gray-300'}`}
                                                >
                                                    <Star className="w-5 h-5" />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </form>

                            <div className="p-8 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowTestimonialModal(false)}
                                    className="px-6 py-2 border border-gray-200 text-gray-500 rounded-lg font-semibold text-sm hover:bg-white hover:text-gray-700 transition-all"
                                >
                                    Cancelar
                                </button>
                                <Button
                                    onClick={handleSubmit(onSubmitTestimonial)}
                                    isLoading={isSavingTestimonial}
                                    disabled={isSavingTestimonial}
                                    className="px-8 rounded-lg"
                                >
                                    Gravar Testemunho
                                </Button>
                            </div>
                        </m.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminContentPage;
