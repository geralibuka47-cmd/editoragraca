import React, { useState, useEffect } from 'react';
import { motion as m, AnimatePresence } from 'framer-motion';
import { Type, MessageSquare, Save, Plus, Trash2, Edit, Users, Star, Loader2, ChevronRight, Globe, Layout, Image as ImageIcon, Briefcase, FileText, CheckCircle2, X, Tag } from 'lucide-react';
import { getSiteContent, saveSiteContent, getTestimonials, saveTestimonial } from '../../services/dataService';

const AdminContentTab: React.FC = () => {
    const [activeSubTab, setActiveSubTab] = useState<'text' | 'testimonials'>('text');
    const [selectedPage, setSelectedPage] = useState<'home' | 'about' | 'services' | 'team'>('home');
    const [siteContent, setSiteContent] = useState<any>({});
    const [testimonials, setTestimonials] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<string | null>(null);

    // Testimonial Modal
    const [showTestimonialModal, setShowTestimonialModal] = useState(false);
    const [testimonialForm, setTestimonialForm] = useState<any>({ name: '', role: '', content: '', rating: 5, photo_url: '', is_active: true });

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

    const handleSaveTestimonial = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!testimonialForm.name.trim() || !testimonialForm.content.trim()) {
            return;
        }

        setIsSaving(true);
        try {
            const sanitizedTestimonial = {
                ...testimonialForm,
                name: testimonialForm.name.trim(),
                role: testimonialForm.role.trim(),
                content: testimonialForm.content.trim(),
                rating: Number(testimonialForm.rating) || 5
            };

            await saveTestimonial(sanitizedTestimonial);
            setShowTestimonialModal(false);
            loadData();
        } catch (error) {
            console.error("Error saving testimonial:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const editFields: Record<string, { label: string; type: 'text' | 'textarea' | 'json'; icon: any }> = {
        'home.hero.title': { label: 'Título Hero', type: 'text', icon: Type },
        'home.hero.subtitle': { label: 'Subtítulo Hero', type: 'text', icon: Type },
        'home.hero.description': { label: 'Descrição Hero', type: 'textarea', icon: Layout },
        'home.newsletter.title': { label: 'Título Newsletter', type: 'text', icon: Type },
        'home.newsletter.description': { label: 'Descrição Newsletter', type: 'textarea', icon: MessageSquare },

        'about.mission.title': { label: 'Título Missão', type: 'text', icon: Type },
        'about.values': { label: 'Valores (Estrutura JSON)', type: 'json', icon: FileText },
        'about.stats': { label: 'Estatísticas (Estrutura JSON)', type: 'json', icon: Layout },
        'about.timeline': { label: 'Timeline (Estrutura JSON)', type: 'json', icon: Globe },

        'services.hero.title': { label: 'Título Hero (Serviços)', type: 'text', icon: Type },
        'services.hero.subtitle': { label: 'Subtítulo Hero (Serviços)', type: 'text', icon: Type },
        'services.hero.description': { label: 'Descrição Hero (Serviços)', type: 'textarea', icon: Briefcase },
        'services.cta.title': { label: 'Título CTA', type: 'text', icon: Type },
        'services.cta.description': { label: 'Descrição CTA', type: 'textarea', icon: MessageSquare },

        'team.hero.title': { label: 'Título Hero (Equipa)', type: 'text', icon: Type },
        'team.hero.subtitle': { label: 'Subtítulo Hero (Equipa)', type: 'text', icon: Type },
        'team.hero.description': { label: 'Descrição Hero (Equipa)', type: 'textarea', icon: Users },
        'team.cta.title': { label: 'Título CTA (Equipa)', type: 'text', icon: Type },
        'team.cta.description': { label: 'Descrição CTA (Equipa)', type: 'textarea', icon: MessageSquare },
    };

    const getKeysForPage = () => {
        if (selectedPage === 'home') return ['home.hero.title', 'home.hero.subtitle', 'home.hero.description', 'home.newsletter.title', 'home.newsletter.description'];
        if (selectedPage === 'about') return ['about.values', 'about.stats', 'about.timeline', 'about.mission.title'];
        if (selectedPage === 'services') return ['services.hero.title', 'services.hero.subtitle', 'services.hero.description', 'services.cta.title', 'services.cta.description'];
        return ['team.hero.title', 'team.hero.subtitle', 'team.hero.description', 'team.cta.title', 'team.cta.description'];
    };

    return (
        <div className="space-y-12">
            <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-8">
                <div>
                    <h2 className="text-4xl font-black text-brand-dark tracking-tighter uppercase mb-2">Narrativa <span className="text-brand-primary lowercase italic font-light">Digital</span></h2>
                    <p className="text-gray-400 font-bold text-sm">Esculpa cada palavra e depoimento que define o site.</p>
                </div>

                <div className="flex bg-gray-100/50 p-2 rounded-[1.5rem] backdrop-blur-sm self-stretch xl:self-auto">
                    <button
                        onClick={() => setActiveSubTab('text')}
                        className={`flex-1 xl:flex-none px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${activeSubTab === 'text' ? 'bg-white text-brand-primary shadow-xl scale-105' : 'text-gray-400 hover:text-brand-dark'}`}
                    >
                        <Type className="w-4 h-4" />
                        Textos
                    </button>
                    <button
                        onClick={() => setActiveSubTab('testimonials')}
                        className={`flex-1 xl:flex-none px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${activeSubTab === 'testimonials' ? 'bg-white text-brand-primary shadow-xl scale-105' : 'text-gray-400 hover:text-brand-dark'}`}
                    >
                        <MessageSquare className="w-4 h-4" />
                        Depoimentos
                    </button>
                </div>
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
                        <div className="xl:col-span-1 space-y-4">
                            {['home', 'about', 'services', 'team'].map((page) => (
                                <m.button
                                    key={page}
                                    whileHover={{ x: 5 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setSelectedPage(page as any)}
                                    className={`w-full p-6 rounded-[2rem] text-left transition-all border-2 flex items-center justify-between group relative overflow-hidden ${selectedPage === page ? 'bg-brand-primary border-brand-primary text-white shadow-2xl' : 'bg-white border-gray-100 text-brand-dark hover:border-brand-primary/20 hover:shadow-lg'}`}
                                >
                                    <span className="font-black uppercase tracking-[0.2em] text-[11px] relative z-10">{page}</span>
                                    <ChevronRight className={`w-5 h-5 relative z-10 ${selectedPage === page ? 'text-white' : 'text-brand-primary opacity-20 group-hover:opacity-100'}`} />
                                    {selectedPage === page && (
                                        <m.div
                                            layoutId="active-bg"
                                            className="absolute inset-0 bg-gradient-to-r from-brand-primary to-brand-dark opacity-10"
                                        />
                                    )}
                                </m.button>
                            ))}
                        </div>

                        {/* Editor Area */}
                        <div className="xl:col-span-3 bg-white rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden">
                            <div className="p-12 border-b border-gray-50 bg-gray-50/30 flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center">
                                        <Layout className="w-6 h-6 text-brand-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-brand-dark tracking-tighter uppercase">{selectedPage}</h3>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-300">Editor de Componentes</p>
                                    </div>
                                </div>
                                {isLoading && <Loader2 className="w-6 h-6 text-brand-primary animate-spin" />}
                            </div>

                            <div className="p-12 space-y-12">
                                {getKeysForPage().map((key) => {
                                    const field = editFields[key];
                                    if (!field) return null;

                                    return (
                                        <m.div
                                            key={key}
                                            layout
                                            className="space-y-4 group"
                                        >
                                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                                                <div className="flex items-center gap-3">
                                                    <field.icon className="w-4 h-4 text-brand-primary" />
                                                    <label htmlFor={`field-ctrl-${key}`} className="text-[11px] font-black uppercase tracking-widest text-gray-400">{field.label}</label>
                                                </div>
                                                <m.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => handleSaveText(key, siteContent[key])}
                                                    disabled={isSaving}
                                                    className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2 ${lastSaved === key ? 'bg-green-50 text-green-600' : 'bg-brand-primary/5 text-brand-primary hover:bg-brand-primary hover:text-white shadow-sm'}`}
                                                >
                                                    {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : (lastSaved === key ? <CheckCircle2 className="w-3 h-3" /> : <Save className="w-3 h-3" />)}
                                                    {lastSaved === key ? 'Gravado!' : 'Gravar'}
                                                </m.button>
                                            </div>

                                            {field.type === 'textarea' || field.type === 'json' ? (
                                                <div className="relative">
                                                    <textarea
                                                        id={`field-ctrl-${key}`}
                                                        title={field.label}
                                                        placeholder={`Descreva aqui o conteúdo para ${field.label.toLowerCase()}...`}
                                                        className="w-full px-8 py-6 bg-gray-50/50 rounded-[2rem] border-2 border-transparent focus:border-brand-primary/20 focus:bg-white outline-none transition-all h-60 min-h-[150px] font-medium text-gray-600 shadow-inner"
                                                        value={field.type === 'json' ? JSON.stringify(siteContent[key] || [], null, 2) : (siteContent[key] || '')}
                                                        onChange={(e) => {
                                                            let val = e.target.value;
                                                            if (field.type === 'json') {
                                                                try { val = JSON.parse(e.target.value); } catch { return; }
                                                            }
                                                            setSiteContent({ ...siteContent, [key]: val });
                                                        }}
                                                    />
                                                </div>
                                            ) : (
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        id={`field-ctrl-${key}`}
                                                        title={field.label}
                                                        placeholder={`Texto para ${field.label.toLowerCase()}...`}
                                                        className="w-full px-8 py-5 bg-gray-50/50 rounded-2xl border-2 border-transparent focus:border-brand-primary/20 focus:bg-white outline-none transition-all font-black text-brand-dark shadow-inner text-lg"
                                                        value={siteContent[key] || ''}
                                                        onChange={(e) => setSiteContent({ ...siteContent, [key]: e.target.value })}
                                                    />
                                                </div>
                                            )}
                                        </m.div>
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
                            <m.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                    setTestimonialForm({ name: '', role: '', content: '', rating: 5, photo_url: '', is_active: true });
                                    setShowTestimonialModal(true);
                                }}
                                className="btn-premium px-10 py-5 text-[10px] shadow-2xl shadow-brand-primary/20"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                <span>Novo Depoimento</span>
                            </m.button>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                            <AnimatePresence mode="popLayout">
                                {testimonials.map((t, idx) => (
                                    <m.div
                                        key={t.id || idx}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="bg-white p-10 rounded-[3rem] shadow-xl border border-gray-50 relative group transition-all hover:shadow-2xl hover:-translate-y-2"
                                    >
                                        <div className="absolute top-8 right-8 flex gap-2">
                                            <m.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => {
                                                    setTestimonialForm(t);
                                                    setShowTestimonialModal(true);
                                                }}
                                                className="p-3 bg-blue-50 text-blue-600 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-blue-600 hover:text-white"
                                                title="Editar"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </m.button>
                                        </div>

                                        <div className="flex gap-1.5 mb-6">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={`w-4 h-4 ${i < t.rating ? 'text-yellow-400 fill-current' : 'text-gray-100'}`} />
                                            ))}
                                        </div>

                                        <div className="relative mb-8">
                                            <MessageSquare className="absolute -left-2 -top-2 w-12 h-12 text-gray-50 -z-0" />
                                            <p className="text-gray-600 italic text-sm leading-relaxed relative z-10 line-clamp-5">"{t.content}"</p>
                                        </div>

                                        <div className="flex items-center gap-5 pt-8 border-t border-gray-50">
                                            <div className="w-14 h-14 rounded-2xl bg-brand-primary/5 overflow-hidden flex items-center justify-center border-2 border-white shadow-lg">
                                                {t.photo_url ? (
                                                    <img src={t.photo_url} alt={t.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <Users className="w-6 h-6 text-brand-primary/30" />
                                                )}
                                            </div>
                                            <div>
                                                <h4 className="font-black text-brand-dark tracking-tighter">{t.name}</h4>
                                                <p className="text-[10px] text-brand-primary font-black uppercase tracking-widest">{t.role}</p>
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
                            className="absolute inset-0 bg-brand-dark/40 backdrop-blur-2xl"
                        />
                        <m.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white rounded-[3.5rem] w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl relative z-20 border border-white/20 flex flex-col"
                        >
                            <div className="p-10 border-b border-gray-100 flex items-center justify-between bg-gray-50/30">
                                <div>
                                    <h3 className="text-3xl font-black text-brand-dark tracking-tighter uppercase mb-1">Feedback de <span className="text-brand-primary lowercase italic font-light">Impacto</span></h3>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Edição de depoimento social</p>
                                </div>
                                <m.button
                                    whileHover={{ rotate: 90, scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setShowTestimonialModal(false)}
                                    className="w-12 h-12 flex items-center justify-center bg-white shadow-sm border border-gray-100 text-gray-400 hover:text-brand-dark rounded-full transition-all"
                                    title="Fechar"
                                >
                                    <X className="w-6 h-6" />
                                </m.button>
                            </div>

                            <form onSubmit={handleSaveTestimonial} className="flex-1 overflow-y-auto p-12 space-y-10">
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label htmlFor="t-name" className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Nome do Autor</label>
                                        <div className="relative">
                                            <Users className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                            <input
                                                id="t-name"
                                                type="text"
                                                required
                                                value={testimonialForm.name}
                                                onChange={(e) => setTestimonialForm({ ...testimonialForm, name: e.target.value })}
                                                className="w-full pl-12 pr-8 py-5 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-brand-primary/20 focus:bg-white outline-none transition-all font-black text-brand-dark"
                                                placeholder="Ex: Pedro Alvares"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label htmlFor="t-role" className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Cargo ou Título</label>
                                        <div className="relative">
                                            <Tag className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                            <input
                                                id="t-role"
                                                type="text"
                                                required
                                                value={testimonialForm.role}
                                                onChange={(e) => setTestimonialForm({ ...testimonialForm, role: e.target.value })}
                                                className="w-full pl-12 pr-8 py-5 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-brand-primary/20 focus:bg-white outline-none transition-all font-bold text-gray-600"
                                                placeholder="Ex: Leitor Assíduo"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label htmlFor="t-content" className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Conteúdo do Relato</label>
                                    <div className="relative">
                                        <MessageSquare className="absolute left-5 top-6 w-4 h-4 text-gray-300" />
                                        <textarea
                                            id="t-content"
                                            required
                                            value={testimonialForm.content}
                                            onChange={(e) => setTestimonialForm({ ...testimonialForm, content: e.target.value })}
                                            className="w-full pl-12 pr-8 py-6 bg-gray-50 rounded-[2rem] border-2 border-transparent focus:border-brand-primary/20 focus:bg-white outline-none transition-all h-40 resize-none font-medium text-gray-600 leading-relaxed shadow-inner"
                                            placeholder="Compartilhe a experiência vivida..."
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label htmlFor="t-photo" className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">URL da Imagem de Perfil</label>
                                        <div className="relative">
                                            <ImageIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                            <input
                                                id="t-photo"
                                                type="url"
                                                value={testimonialForm.photo_url || ''}
                                                onChange={(e) => setTestimonialForm({ ...testimonialForm, photo_url: e.target.value })}
                                                className="w-full pl-12 pr-8 py-5 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-brand-primary/20 focus:bg-white outline-none transition-all text-[11px] font-black uppercase tracking-widest text-gray-400"
                                                placeholder="https://..."
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label htmlFor="t-rating" className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Classificação Estelar</label>
                                        <div id="t-rating" className="flex bg-gray-50 p-2.5 rounded-2xl items-center justify-around">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    title={`Avaliar com ${star} estrelas`}
                                                    aria-label={`Avaliar com ${star} estrelas`}
                                                    onClick={() => setTestimonialForm({ ...testimonialForm, rating: star })}
                                                    className={`p-2 transition-all transform hover:scale-125 ${testimonialForm.rating >= star ? 'text-yellow-400 fill-current' : 'text-gray-200'}`}
                                                >
                                                    <Star className="w-5 h-5" />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </form>

                            <div className="p-12 border-t border-gray-100 bg-gray-50/50 flex gap-6">
                                <button
                                    type="button"
                                    onClick={() => setShowTestimonialModal(false)}
                                    className="flex-1 px-8 py-5 border-2 border-gray-100 text-gray-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:border-gray-200 hover:text-brand-dark transition-all"
                                >
                                    Cancelar
                                </button>
                                <m.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    onClick={handleSaveTestimonial}
                                    disabled={isSaving}
                                    className="flex-2 btn-premium py-5 px-12 text-[10px] shadow-2xl shadow-brand-primary/20"
                                >
                                    {isSaving ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4 mr-3" />
                                            <span>Guardar Depoimento</span>
                                        </>
                                    )}
                                </m.button>
                            </div>
                        </m.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminContentTab;
