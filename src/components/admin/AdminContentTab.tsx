import React, { useState, useEffect } from 'react';
import { motion as m, AnimatePresence } from 'framer-motion';
import { Type, MessageSquare, Save, Plus, Trash2, Edit, Users, Star, Loader2, ChevronRight, Globe, Layout, Image as ImageIcon, Briefcase, FileText, CheckCircle2, X, Tag, Zap, Sparkles } from 'lucide-react';
import { getSiteContent, saveSiteContent, getTestimonials, saveTestimonial, saveEditorialService, saveTeamMember } from '../../services/dataService';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';

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


const AdminContentTab: React.FC = () => {
    const [activeSubTab, setActiveSubTab] = useState<'text' | 'testimonials'>('text');
    const [selectedPage, setSelectedPage] = useState<'home' | 'about' | 'services' | 'team'>('home');
    const [siteContent, setSiteContent] = useState<any>({});
    const [testimonials, setTestimonials] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<string | null>(null);
    const [isSyncing, setIsSyncing] = useState(false);

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
    } = useForm<TestimonialFormData>({
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


    const PREMIUM_DEFAULTS: Record<string, { section: string; value: any }> = {
        'home.hero.title': { section: 'home', value: "Onde a Arte" },
        'home.hero.subtitle': { section: 'home', value: "Encontra o Legado" },
        'home.hero.description': { section: 'home', value: "Curadoria de excelência para leitores que exigem o extraordinário." },
        'home.experience.list': { section: 'home', value: ["Acabamentos de luxo em cada edição.", "Curadoria internacional de autores.", "Eventos exclusivos para membros."] },
        'home.experience.premium_title': { section: 'home', value: "Premium" },
        'home.experience.premium_desc': { section: 'home', value: "Qualidade inegociável em cada página impressa." },
        'home.experience.eternal_title': { section: 'home', value: "Eterno" },
        'home.experience.eternal_desc': { section: 'home', value: "Obras feitas para durar gerações." },

        'about.hero.text': { section: 'about', value: "Uma casa editorial de elite comprometida com a sofisticação intelectual e a preservação do património cultural através da curadoria literária de alta performance." },
        'about.vision.quote': { section: 'about', value: "Acreditamos que o talento angolano não merece apenas uma voz; merece um Palco Mundial de magnitude absoluta." },
        'about.philosophy': {
            section: 'about', value: [
                { icon: 'Target', label: 'Filosofia Principal', title: 'Rigor & Estética', description: 'Cada obra é submetida a uma auditoria editorial implacável para garantir o status de obra-prima.' },
                { icon: 'Sparkles', label: 'Visão Futurista', title: 'Inovação Nativa', description: 'Lideramos a evolução da narrativa em Angola, mesclando tradição impressa com tecnologia imersiva.' },
                { icon: 'Zap', label: 'Impacto Cultural', title: 'Legado Atemporal', description: 'Construímos o cânone literário do futuro, dando voz aos pensadores que definem o nosso tempo.' }
            ]
        },
        'about.values': {
            section: 'about', value: [
                { icon: 'BookOpen', title: 'Excelência Literária', description: 'Compromisso inabalável com a qualidade e rigor editorial em cada publicação.' },
                { icon: 'Heart', title: 'Paixão pela Cultura', description: 'Promover e preservar a riqueza cultural angolana através da literatura.' },
                { icon: 'Users', title: 'Valorização de Autores', description: 'Apoio integral a escritores locais, dando voz aos suas histórias únicas.' },
                { icon: 'Award', title: 'Reconhecimento', description: 'Busca constante pela excelência reconhecida nacional e internacionalmente.' }
            ]
        },
        'about.stats': {
            section: 'about', value: [
                { number: '26+', label: 'Obras Publicadas', icon: 'BookOpen' },
                { number: '100%', label: 'Autores Angolanos', icon: 'Star' },
                { number: '5+', label: 'Anos de Actividade', icon: 'Zap' },
                { number: '18', label: 'Províncias Alcançadas', icon: 'MapPin' }
            ]
        },
        'about.timeline': {
            section: 'about', value: [
                { year: '2020', title: 'Fundação', description: 'Fundada pelo designer literário Nilton Graça, com o propósito de fortalecer o setor editorial e promover a literautra lusófona.' },
                { year: '2021', title: 'Início Editorial', description: 'Início das operações de edição, diagramação e design, servindo autores independentes e parceiros.' },
                { year: '2023', title: 'Crescimento', description: 'Marca de 26+ obras publicadas sob selo próprio e através de colaborações institucionais.' },
                { year: '2026', title: 'Reestruturação', description: 'Reorganização estratégica, consolidação da comunidade e expansão para formatos digitais.' }
            ]
        },

        'services.methodology': {
            section: 'services', value: [
                { icon: 'MessageSquare', title: 'Consulta Inicial', description: 'Conversamos sobre a sua obra, objetivos e público-alvo para definir a melhor estratégia.' },
                { icon: 'Search', title: 'Análise Editorial', description: 'A nossa equipa avalia o seu manuscrito e sugere os serviços ideais para o seu sucesso.' },
                { icon: 'Zap', title: 'Execução Criativa', description: 'Transformamos o seu texto com revisão, diagramação e design de capa de nível mundial.' },
                { icon: 'Award', title: 'Publicação Final', description: 'Entregamos a sua obra pronta para o mercado, com toda a qualidade da Editora Graça.' }
            ]
        }
    };

    const PREMIUM_SERVICES = [
        { title: 'Revisão e Edição', price: '250 Kz / página', details: ['Correção ortográfica e gramatical', 'Adequação ao acordo ortográfico', 'Edição profissional completa'], order: 1 },
        { title: 'Diagramação', price: '250 Kz / página', details: ['Layout profissional para impressão', 'Tipografia avançada', 'Arquivo pronto para a gráfica'], order: 2 },
        { title: 'Design de Capa', price: '10.000 Kz', details: ['Design exclusivo para livro físico', 'Opção E-book por 7.500 Kz', 'Revisões ilimitadas'], order: 3 },
        { title: 'Legalização', price: '6.000 Kz', details: ['Registo Internacional ISBN', 'Depósito Legal obrigatório', 'Proteção de direitos autorais'], order: 4 },
        { title: 'Impressão', price: 'Desde 3.500 Kz', details: ['Valor varia conforme formato', 'Acabamento premium', 'Sem tiragem mínima'], order: 5 },
        { title: 'Marketing Digital', price: '5.000 Kz / post', details: ['Criação de post publicitário', 'Copywriting persuasivo', 'Foco em conversão'], order: 6 }
    ];

    const PREMIUM_TEAM = [
        { name: 'Geral Ibuka', role: 'Director-Geral', department: 'Administração', bio: 'Com mais de 15 anos de experiência no setor editorial, Geral lidera a visão estratégica da Editora Graça.', photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&q=80', displayOrder: 1 },
        { name: 'Maria Santos', role: 'Editora-Chefe', department: 'Editorial', bio: 'Responsável pela curadoria e revisão editorial de todas as obras publicadas.', photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&q=80', displayOrder: 2 },
        { name: 'João Ferreira', role: 'Designer Gráfico', department: 'Design', bio: 'Especialista em design de capas e diagramação, João transforma manuscritos em obras visuais.', photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80', displayOrder: 3 }
    ];

    const handleSyncPremium = async () => {
        if (!window.confirm("Isso irá sincronizar os textos 'Premium' padrão, serviços e membros da equipa para o banco de dados. Deseja continuar?")) return;

        setIsSyncing(true);
        try {
            // 1. Sync Site Content
            const contentPromises = Object.entries(PREMIUM_DEFAULTS).map(([key, data]) =>
                saveSiteContent(key, data.section, data.value)
            );

            // 2. Sync Editorial Services
            const servicesPromises = PREMIUM_SERVICES.map(s => saveEditorialService(s));

            // 3. Sync Team Members
            const teamPromises = PREMIUM_TEAM.map(m => saveTeamMember(m));

            await Promise.all([...contentPromises, ...servicesPromises, ...teamPromises]);
            alert("Sincronização profunda concluída com sucesso! Todo o acervo premium está agora no banco de dados.");
            loadData();
        } catch (error) {
            console.error("Erro na sincronização profunda:", error);
            alert("Erro ao sincronizar dados premium completos.");
        } finally {
            setIsSyncing(false);
        }
    };


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
        <div className="space-y-12">
            {/* Header ... (same as before) */}
            <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-8">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-8 bg-brand-primary rounded-full shadow-[0_0_15px_rgba(189,147,56,0.5)]" />
                        <h2 className="text-3xl font-black text-white tracking-tighter uppercase mb-0">Narrativa <span className="text-brand-primary italic font-light lowercase">Digital</span></h2>
                    </div>
                    <p className="text-gray-500 font-bold text-xs uppercase tracking-widest pl-4 italic">Gestão de Conteúdo e Identidade do Site</p>
                </div>

                <div className="flex bg-white/5 p-2 rounded-2xl border border-white/5 backdrop-blur-xl self-stretch xl:self-auto gap-2">
                    <button
                        onClick={handleSyncPremium}
                        disabled={isSyncing}
                        className="px-6 py-3.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 bg-brand-primary/10 text-brand-primary hover:bg-brand-primary hover:text-white disabled:opacity-50 group"
                        title="Sincronizar Padrões Premium"
                    >
                        {isSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-brand-primary group-hover:text-white" />}
                        SYNC PREMIUM
                    </button>
                    <div className="w-px h-8 bg-white/10 self-center mx-2 hidden xl:block"></div>
                    <button
                        onClick={() => setActiveSubTab('text')}
                        className={`flex-1 xl:flex-none px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${activeSubTab === 'text' ? 'bg-brand-primary text-white shadow-[0_10px_25px_-5px_rgba(189,147,56,0.3)]' : 'text-gray-500 hover:text-white'}`}
                    >
                        <Type className="w-4 h-4" />
                        TERMINAL DE TEXTO
                    </button>
                    <button
                        onClick={() => setActiveSubTab('testimonials')}
                        className={`flex-1 xl:flex-none px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${activeSubTab === 'testimonials' ? 'bg-brand-primary text-white shadow-[0_10px_25px_-5px_rgba(189,147,56,0.3)]' : 'text-gray-500 hover:text-white'}`}
                    >
                        <MessageSquare className="w-4 h-4" />
                        TESTEMUNHOS
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
                                    whileHover={{ x: 5, backgroundColor: 'rgba(255,255,255,0.05)' }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setSelectedPage(page as any)}
                                    className={`w-full p-6 rounded-2xl text-left transition-all border flex items-center justify-between group relative overflow-hidden ${selectedPage === page ? 'bg-brand-primary border-brand-primary text-white shadow-[0_20px_40px_-10px_rgba(189,147,56,0.4)]' : 'bg-white/5 border-white/5 text-gray-400 hover:border-white/10 hover:text-white'}`}
                                >
                                    <span className="font-black uppercase tracking-[0.3em] text-[10px] relative z-10">{page}</span>
                                    <ChevronRight className={`w-5 h-5 relative z-10 transition-transform ${selectedPage === page ? 'text-white translate-x-1' : 'text-gray-700 group-hover:text-white'}`} />
                                    {selectedPage === page && (
                                        <m.div
                                            layoutId="active-bg"
                                            className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"
                                        />
                                    )}
                                </m.button>
                            ))}
                        </div>

                        {/* Editor Area */}
                        <m.div
                            className="xl:col-span-3 bg-white/5 rounded-[3.5rem] border border-white/5 overflow-hidden shadow-2xl relative"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-primary/30 to-transparent" />

                            <div className="p-12 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 bg-brand-primary/10 rounded-2xl border border-brand-primary/20 flex items-center justify-center">
                                        <Layout className="w-6 h-6 text-brand-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-3xl font-black text-white tracking-tighter uppercase">{selectedPage}</h3>
                                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Terminal de Edição de Componentes</p>
                                    </div>
                                </div>
                                {isLoading && <Loader2 className="w-6 h-6 text-brand-primary animate-spin" />}
                            </div>

                            <div className="p-12 space-y-16 custom-scrollbar">
                                {getKeysForPage().map((key) => {
                                    const field = editFields[key];
                                    if (!field) return null;

                                    return (
                                        <m.div
                                            key={key}
                                            layout
                                            className="space-y-6 group"
                                        >
                                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-1.5 h-6 bg-brand-primary/40 rounded-full" />
                                                    <div className="flex items-center gap-3">
                                                        <field.icon className="w-4 h-4 text-brand-primary" />
                                                        <label htmlFor={`field-ctrl-${key}`} className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-500">{field.label}</label>
                                                    </div>
                                                </div>
                                                <m.button
                                                    whileHover={{ scale: 1.05, filter: 'brightness(1.1)' }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => handleSaveText(key, siteContent[key])}
                                                    disabled={isSaving}
                                                    className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-[0.3em] transition-all flex items-center gap-3 border ${lastSaved === key ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-brand-primary/10 border-brand-primary/20 text-brand-primary hover:bg-brand-primary hover:text-white shadow-lg'}`}
                                                >
                                                    {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : (lastSaved === key ? <CheckCircle2 className="w-3 h-3" /> : <Save className="w-3 h-3" />)}
                                                    {lastSaved === key ? 'PROTOCOLOS SINCRONIZADOS' : 'REGISTAR ALTERAÇÃO'}
                                                </m.button>
                                            </div>

                                            {/* We use standard HTML elements here for flexibility with the dynamic JSON/Text handling, 
                                                but styled to match our premium components */}
                                            {field.type === 'textarea' || field.type === 'json' ? (
                                                <div className="relative group/field">
                                                    <textarea
                                                        id={`field-ctrl-${key}`}
                                                        title={field.label}
                                                        placeholder={`Insira aqui os parâmetros para ${field.label.toLowerCase()}...`}
                                                        className="w-full px-10 py-8 bg-white/[0.03] rounded-[2.5rem] border border-white/5 focus:border-brand-primary/30 focus:bg-white/[0.05] outline-none transition-all h-64 min-h-[180px] font-medium text-gray-400 leading-relaxed shadow-2xl placeholder:text-gray-800 custom-scrollbar uppercase tracking-wider italic"
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
                                                <div className="relative group/field">
                                                    <input
                                                        type="text"
                                                        id={`field-ctrl-${key}`}
                                                        title={field.label}
                                                        placeholder={`Definição para ${field.label.toLowerCase()}...`}
                                                        className="w-full px-10 py-6 bg-white/[0.03] rounded-2xl border border-white/5 focus:border-brand-primary/30 focus:bg-white/[0.05] outline-none transition-all font-black text-white uppercase tracking-[0.2em] shadow-2xl text-lg placeholder:text-gray-800"
                                                        value={siteContent[key] || ''}
                                                        onChange={(e) => setSiteContent({ ...siteContent, [key]: e.target.value })}
                                                    />
                                                </div>
                                            )}
                                        </m.div>
                                    );
                                })}
                            </div>
                        </m.div>
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
                                whileHover={{ scale: 1.02, filter: 'brightness(1.1)' }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleCreateTestimonial}
                                className="px-10 py-5 bg-brand-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-[0_20px_40px_-10px_rgba(189,147,56,0.3)] hover:brightness-110 transition-all flex items-center justify-center gap-4"
                            >
                                <Plus className="w-5 h-5" />
                                <span>REGISTAR TESTEMUNHO</span>
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
                                        className="bg-white/5 p-12 rounded-[3.5rem] border border-white/5 relative group transition-all hover:bg-white/[0.07] hover:shadow-2xl hover:-translate-y-2 overflow-hidden"
                                    >
                                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-primary/20 to-transparent" />

                                        <div className="absolute top-10 right-10 flex gap-3">
                                            <m.button
                                                whileHover={{ scale: 1.1, rotate: -5 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => handleEditTestimonial(t)}
                                                className="p-3 bg-white/5 text-gray-400 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-white/10 hover:text-white border border-white/5"
                                                title="Editar Parâmetros"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </m.button>
                                        </div>

                                        <div className="flex gap-2 mb-8">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={`w-4 h-4 shadow-[0_0_10px_rgba(189,147,56,0.2)] ${i < (t.rating || 5) ? 'text-brand-primary fill-current' : 'text-white/5'}`} />
                                            ))}
                                        </div>

                                        <div className="relative mb-10">
                                            <MessageSquare className="absolute -left-4 -top-4 w-16 h-16 text-white/[0.02] -z-0" />
                                            <p className="text-gray-400 italic text-base leading-relaxed relative z-10 line-clamp-6 font-medium uppercase tracking-wide">"{t.content}"</p>
                                        </div>

                                        <div className="flex items-center gap-6 pt-10 border-t border-white/5">
                                            <div className="w-16 h-16 rounded-2xl bg-brand-primary/10 overflow-hidden flex items-center justify-center border border-white/10 shadow-xl group-hover:scale-110 transition-transform">
                                                {t.photo_url ? (
                                                    <img src={t.photo_url} alt={t.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <Users className="w-8 h-8 text-brand-primary/30" />
                                                )}
                                            </div>
                                            <div>
                                                <h4 className="font-black text-white text-lg tracking-tighter uppercase">{t.name}</h4>
                                                <p className="text-[10px] text-brand-primary font-black uppercase tracking-[0.3em]">{t.role}</p>
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
                            initial={{ opacity: 0, scale: 0.95, y: 40 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 40 }}
                            className="bg-[#0D0D0D] rounded-[4rem] w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] relative z-20 border border-white/10 flex flex-col"
                        >
                            <div className="p-12 border-b border-white/5 relative bg-gradient-to-b from-white/[0.02] to-transparent">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-primary to-transparent" />
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-4xl font-black text-white tracking-tighter uppercase mb-2">Relato de <span className="text-brand-primary lowercase italic font-light">Impacto</span></h3>
                                        <div className="flex items-center gap-3">
                                            <Sparkles className="w-4 h-4 text-brand-primary animate-pulse" />
                                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Curadoria de Prova Social</p>
                                        </div>
                                    </div>
                                    <m.button
                                        whileHover={{ rotate: 90, scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => setShowTestimonialModal(false)}
                                        className="w-14 h-14 flex items-center justify-center bg-white/5 border border-white/5 text-gray-500 hover:text-white rounded-2xl transition-all"
                                        title="Sair do Terminal"
                                        aria-label="Sair do Terminal"
                                    >
                                        <X className="w-6 h-6" />
                                    </m.button>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit(onSubmitTestimonial)} className="flex-1 overflow-y-auto p-12 space-y-12 custom-scrollbar">

                                <div className="grid md:grid-cols-2 gap-10">
                                    <Input
                                        label="AUTORIA DO RELATO"
                                        placeholder="EX: PEDRO ALVARES"
                                        icon={<Users className="w-4 h-4" />}
                                        {...register('name')}
                                        error={errors.name?.message}
                                        className="bg-white/5 border-white/5 focus:bg-white/10 text-white placeholder:text-gray-800"
                                    />
                                    <Input
                                        label="CARGO / TITULAÇÃO"
                                        placeholder="EX: LEITOR ASSÍDUO"
                                        icon={<Tag className="w-4 h-4" />}
                                        {...register('role')}
                                        error={errors.role?.message}
                                        className="bg-white/5 border-white/5 focus:bg-white/10 text-white placeholder:text-gray-800"
                                    />
                                </div>

                                <Textarea
                                    label="CORPO DO TESTEMUNHO"
                                    placeholder="DESCREVA A EXPERIÊNCIA LITERÁRIA..."
                                    rows={5}
                                    {...register('content')}
                                    error={errors.content?.message}
                                    className="bg-white/5 border-white/5 focus:bg-white/10 text-white placeholder:text-gray-800"
                                />

                                <div className="grid md:grid-cols-2 gap-10">
                                    <Input
                                        label="LOCALIZAÇÃO DA IMAGEM"
                                        placeholder="HTTPS://..."
                                        icon={<ImageIcon className="w-4 h-4" />}
                                        {...register('photo_url')}
                                        error={errors.photo_url?.message}
                                        className="bg-white/5 border-white/5 focus:bg-white/10 text-white placeholder:text-gray-800"
                                    />
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 ml-4">NÍVEL DE SATISFAÇÃO</label>
                                        <div className="flex bg-white/5 border border-white/5 p-4 rounded-[2rem] items-center justify-around h-[88px] relative top-[2px]">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    title={`Avaliar com ${star} estrelas`}
                                                    onClick={() => setValue('rating', star)}
                                                    className={`p-2 transition-all transform hover:scale-125 ${currentRating >= star ? 'text-brand-primary fill-current shadow-[0_0_15px_rgba(189,147,56,0.3)]' : 'text-gray-800'}`}
                                                >
                                                    <Star className="w-6 h-6" />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </form>

                            <div className="p-12 border-t border-white/5 bg-white/[0.01] flex flex-col sm:flex-row gap-6">
                                <button
                                    type="button"
                                    onClick={() => setShowTestimonialModal(false)}
                                    className="flex-1 px-10 py-6 border border-white/10 text-gray-500 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-white/5 hover:text-white transition-all flex items-center justify-center gap-2"
                                >
                                    ABORTAR
                                </button>
                                <Button
                                    onClick={handleSubmit(onSubmitTestimonial)}
                                    isLoading={isSavingTestimonial}
                                    disabled={isSavingTestimonial}
                                    className="flex-[1.5] py-6 px-12"
                                    leftIcon={!isSavingTestimonial && <Save className="w-5 h-5" />}
                                >
                                    SINCRONIZAR RELATO
                                </Button>
                            </div>
                        </m.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminContentTab;
