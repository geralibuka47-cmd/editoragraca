import React, { useState, useEffect } from 'react';
import { Type, MessageSquare, Save, Plus, Trash2, Edit, Users, Star, Loader2 } from 'lucide-react';
import { getSiteContent, saveSiteContent, getTestimonials, saveTestimonial } from '../../services/dataService';

const AdminContentTab: React.FC = () => {
    const [activeSubTab, setActiveSubTab] = useState<'text' | 'testimonials'>('text');
    const [selectedPage, setSelectedPage] = useState<'home' | 'about' | 'services' | 'team'>('home');
    const [siteContent, setSiteContent] = useState<any>({});
    const [testimonials, setTestimonials] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

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
        try {
            // Sanitize string content
            const sanitizedValue = typeof value === 'string' ? value.trim() : value;

            await saveSiteContent(key, selectedPage, sanitizedValue);
            setSiteContent({ ...siteContent, [key]: sanitizedValue });
        } catch (error) {
            console.error("Error saving text:", error);
            alert('Erro ao salvar conteúdo.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveTestimonial = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!testimonialForm.name.trim() || !testimonialForm.content.trim()) {
            alert('Nome e conteúdo do depoimento são obrigatórios.');
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
            alert('Erro ao salvar depoimento.');
        } finally {
            setIsSaving(false);
        }
    };

    const editFields: Record<string, { label: string; type: 'text' | 'textarea' | 'json' }> = {
        'home.hero.title': { label: 'Home: Título Hero', type: 'text' },
        'home.hero.subtitle': { label: 'Home: Subtítulo Hero', type: 'text' },
        'home.hero.description': { label: 'Home: Descrição Hero', type: 'textarea' },
        'home.newsletter.title': { label: 'Home: Título Newsletter', type: 'text' },
        'home.newsletter.description': { label: 'Home: Descrição Newsletter', type: 'textarea' },

        'about.mission.title': { label: 'Sobre: Título Missão', type: 'text' },
        'about.values': { label: 'Sobre: Valores (JSON)', type: 'json' },
        'about.stats': { label: 'Sobre: Estatísticas (JSON)', type: 'json' },
        'about.timeline': { label: 'Sobre: Timeline (JSON)', type: 'json' },

        'services.hero.title': { label: 'Serviços: Título Hero', type: 'text' },
        'services.hero.subtitle': { label: 'Serviços: Subtítulo Hero', type: 'text' },
        'services.hero.description': { label: 'Serviços: Descrição Hero', type: 'textarea' },
        'services.cta.title': { label: 'Serviços: Título Form/CTA', type: 'text' },
        'services.cta.description': { label: 'Serviços: Descrição Form/CTA', type: 'textarea' },

        'team.hero.title': { label: 'Equipa: Título Hero', type: 'text' },
        'team.hero.subtitle': { label: 'Equipa: Subtítulo Hero', type: 'text' },
        'team.hero.description': { label: 'Equipa: Descrição Hero', type: 'textarea' },
        'team.cta.title': { label: 'Equipa: Título CTA', type: 'text' },
        'team.cta.description': { label: 'Equipa: Descrição CTA', type: 'textarea' },
    };

    const getKeysForPage = () => {
        if (selectedPage === 'home') return ['home.hero.title', 'home.hero.subtitle', 'home.hero.description', 'home.newsletter.title', 'home.newsletter.description'];
        if (selectedPage === 'about') return ['about.values', 'about.stats', 'about.timeline'];
        if (selectedPage === 'services') return ['services.hero.title', 'services.hero.subtitle', 'services.hero.description', 'services.cta.title', 'services.cta.description'];
        return ['team.hero.title', 'team.hero.subtitle', 'team.hero.description', 'team.cta.title', 'team.cta.description'];
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-3xl font-black text-brand-dark tracking-tighter">Gestão de Conteúdo Dinâmico</h2>
                    <p className="text-gray-500 font-medium">Edite os textos do site e gerencie os depoimentos dos clientes.</p>
                </div>

                <div className="flex bg-gray-100 p-1.5 rounded-2xl">
                    <button
                        onClick={() => setActiveSubTab('text')}
                        className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeSubTab === 'text' ? 'bg-white text-brand-primary shadow-sm' : 'text-gray-500 hover:text-brand-dark'}`}
                    >
                        <Type className="w-4 h-4 inline mr-2" />
                        Textos do Site
                    </button>
                    <button
                        onClick={() => setActiveSubTab('testimonials')}
                        className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeSubTab === 'testimonials' ? 'bg-white text-brand-primary shadow-sm' : 'text-gray-500 hover:text-brand-dark'}`}
                    >
                        <MessageSquare className="w-4 h-4 inline mr-2" />
                        Depoimentos
                    </button>
                </div>
            </div>

            {activeSubTab === 'text' ? (
                <div className="grid lg:grid-cols-4 gap-8">
                    {/* Page Selector Sidebar */}
                    <div className="lg:col-span-1 space-y-3">
                        {['home', 'about', 'services', 'team'].map((page) => (
                            <button
                                key={page}
                                onClick={() => setSelectedPage(page as any)}
                                className={`w-full p-6 rounded-[2rem] text-left transition-all border-2 flex items-center justify-between group ${selectedPage === page ? 'bg-brand-primary border-brand-primary text-white shadow-xl' : 'bg-white border-gray-100 text-brand-dark hover:border-brand-primary/20'}`}
                            >
                                <span className="font-black uppercase tracking-widest text-xs capitalize">{page}</span>
                                <Edit className={`w-4 h-4 ${selectedPage === page ? 'text-white' : 'text-brand-primary opacity-0 group-hover:opacity-100'} transition-all`} />
                            </button>
                        ))}
                    </div>

                    {/* Editor Area */}
                    <div className="lg:col-span-3 bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
                        <div className="p-10 border-b border-gray-50 flex justify-between items-center">
                            <h3 className="text-xl font-black text-brand-dark uppercase tracking-tighter">Editando: {selectedPage}</h3>
                            {isLoading && <Loader2 className="w-5 h-5 text-brand-primary animate-spin" />}
                        </div>

                        <div className="p-10 space-y-10">
                            {getKeysForPage().map((key) => {
                                const field = editFields[key];
                                if (!field) return null;

                                return (
                                    <div key={key} className="space-y-4">
                                        <div className="flex justify-between items-end">
                                            <label className="label-premium">{field.label}</label>
                                            <button
                                                onClick={() => handleSaveText(key, siteContent[key])}
                                                disabled={isSaving}
                                                className="text-[10px] font-black text-brand-primary uppercase tracking-[0.2em] hover:text-brand-dark transition-colors flex items-center gap-2"
                                            >
                                                {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                                                Salvar Alteração
                                            </button>
                                        </div>

                                        {field.type === 'textarea' || field.type === 'json' ? (
                                            <textarea
                                                title={field.label}
                                                placeholder={`Insira ${field.label.toLowerCase()}...`}
                                                className="input-premium h-48 resize-none"
                                                value={field.type === 'json' ? JSON.stringify(siteContent[key] || [], null, 2) : (siteContent[key] || '')}
                                                onChange={(e) => {
                                                    let val = e.target.value;
                                                    if (field.type === 'json') {
                                                        try { val = JSON.parse(e.target.value); } catch { return; } // Don't update state if invalid JSON during typing
                                                    }
                                                    setSiteContent({ ...siteContent, [key]: val });
                                                }}
                                            />
                                        ) : (
                                            <input
                                                type="text"
                                                id={key}
                                                title={field.label}
                                                placeholder={`Insira ${field.label.toLowerCase()}...`}
                                                className="input-premium font-bold"
                                                value={siteContent[key] || ''}
                                                onChange={(e) => setSiteContent({ ...siteContent, [key]: e.target.value })}
                                            />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-8">
                    <div className="flex justify-end">
                        <button
                            onClick={() => {
                                setTestimonialForm({ name: '', role: '', content: '', rating: 5, photo_url: '', is_active: true });
                                setShowTestimonialModal(true);
                            }}
                            className="btn-premium px-8 py-4 text-xs"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Novo Depoimento
                        </button>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {testimonials.map((t) => (
                            <div key={t.id} className="bg-white p-8 rounded-[2rem] shadow-lg border border-gray-50 relative group">
                                <button
                                    onClick={() => {
                                        setTestimonialForm(t);
                                        setShowTestimonialModal(true);
                                    }}
                                    title="Editar depoimento"
                                    aria-label="Editar depoimento"
                                    className="absolute top-4 right-4 p-2 bg-blue-50 text-blue-600 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                >
                                    <Edit className="w-4 h-4" />
                                </button>

                                <div className="flex gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`w-3 h-3 ${i < t.rating ? 'text-yellow-400 fill-current' : 'text-gray-200'}`} />
                                    ))}
                                </div>
                                <p className="text-gray-600 italic text-sm mb-6 line-clamp-4">"{t.content}"</p>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-brand-primary/10 overflow-hidden flex items-center justify-center">
                                        {t.photoUrl ? <img src={t.photoUrl} alt={t.name} className="w-full h-full object-cover" /> : <Users className="w-5 h-5 text-brand-primary" />}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-brand-dark text-sm">{t.name}</h4>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{t.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Testimonial Modal */}
            {showTestimonialModal && (
                <div className="fixed inset-0 bg-brand-dark/90 backdrop-blur-sm z-[200] flex items-center justify-center p-8">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-xl overflow-hidden shadow-2xl animate-fade-in">
                        <div className="p-8 border-b border-gray-50 bg-gray-50 flex justify-between items-center">
                            <h3 className="text-xl font-black text-brand-dark uppercase tracking-tighter">Gerenciar Depoimento</h3>
                            <button onClick={() => setShowTestimonialModal(false)} title="Fechar modal" className="text-gray-400 hover:text-brand-dark transition-colors">
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveTestimonial} className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="form-group-premium">
                                    <label htmlFor="testimonial-name" className="label-premium">Nome</label>
                                    <input
                                        id="testimonial-name"
                                        type="text"
                                        required
                                        title="Nome do autor do depoimento"
                                        placeholder="Ex: João Silva"
                                        className="input-premium"
                                        value={testimonialForm.name}
                                        onChange={(e) => setTestimonialForm({ ...testimonialForm, name: e.target.value })}
                                    />
                                </div>
                                <div className="form-group-premium">
                                    <label htmlFor="testimonial-role" className="label-premium">Cargo/Título</label>
                                    <input
                                        id="testimonial-role"
                                        type="text"
                                        title="Cargo ou título do autor"
                                        placeholder="Ex: Escritor ou Leitor"
                                        className="input-premium"
                                        value={testimonialForm.role}
                                        onChange={(e) => setTestimonialForm({ ...testimonialForm, role: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="form-group-premium">
                                <label htmlFor="testimonial-content" className="label-premium">Depoimento</label>
                                <textarea
                                    id="testimonial-content"
                                    required
                                    title="Conteúdo do depoimento"
                                    placeholder="Escreva aqui o depoimento..."
                                    className="input-premium h-32 resize-none"
                                    value={testimonialForm.content}
                                    onChange={(e) => setTestimonialForm({ ...testimonialForm, content: e.target.value })}
                                />
                            </div>

                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setShowTestimonialModal(false)}
                                    className="flex-1 py-4 border-2 border-brand-dark rounded-2xl font-black text-xs uppercase tracking-widest"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="flex-1 btn-premium py-4"
                                >
                                    {isSaving ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span>Salvando...</span>
                                        </>
                                    ) : (
                                        <span>Guardar Depoimento</span>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminContentTab;
