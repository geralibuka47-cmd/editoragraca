import React, { useState, useEffect } from 'react';
import {
    Settings,
    Save,
    Globe,
    Mail,
    Phone,
    Instagram,
    Linkedin,
    Twitter,
    Layout,
    Palette,
    Shield,
    Bell,
    Database,
    Loader2,
    Trash2,
    Plus,
    MapPin,
    Type,
    Sparkles,
    Youtube,
    Facebook
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../../components/Toast';
import {
    getSiteContent,
    saveSiteContent,
    getEditorialServices,
    saveEditorialService,
    deleteEditorialService
} from '../../services/dataService';
import { EditorialService } from '../../types';

type TabType = 'geral' | 'institucional' | 'social' | 'servicos' | 'seguranca';

const AdminSettings: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabType>('geral');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const { showToast } = useToast();

    // Form States
    const [generalSettings, setGeneralSettings] = useState({
        companyName: 'Editora Graça',
        contactEmail: 'geraleditoragraca@gmail.com',
        contactPhone: '+244 973 038 386',
        address: 'Malanje, Angola',
        maintenanceMode: false
    });

    const [institutionalContent, setInstitutionalContent] = useState({
        homeHeroTitle: 'Arquitetos de um Novo Renascimento',
        homeHeroSubtitle: 'A casa editorial que está a redefinir o cânone literário angolano através do design e do rigor intelectual.',
        newsletterTitle: 'Subscreva o Nosso Manifesto',
        newsletterSubtitle: 'Receba crónicas exclusivas e pré-lançamentos diretamente no seu core literário.',
        aboutHeroSubtitle: 'Não somos apenas uma editora; somos os arquitetos de um novo renascimento intelectual angolano.',
        footerDescription: 'A Editora Graça é uma instituição dedicada à excelência editorial e ao fomento da literatura lusófona de vanguarda.'
    });

    const [socialLinks, setSocialLinks] = useState({
        facebook: '',
        instagram: '',
        linkedin: '',
        twitter: '',
        youtube: '',
        tiktok: ''
    });

    const [services, setServices] = useState<EditorialService[]>([]);
    const [isRefreshingServices, setIsRefreshingServices] = useState(false);

    // Load data
    useEffect(() => {
        const loadAllSettings = async () => {
            setLoading(true);
            try {
                const [content, editorialServices] = await Promise.all([
                    getSiteContent(),
                    getEditorialServices()
                ]);

                // Map general settings
                if (content['general.config']) {
                    setGeneralSettings(prev => ({ ...prev, ...content['general.config'] }));
                }

                // Map institutional content
                const instKeys = {
                    'home.hero_title': 'homeHeroTitle',
                    'home.hero_subtitle': 'homeHeroSubtitle',
                    'newsletter.title': 'newsletterTitle',
                    'newsletter.subtitle': 'newsletterSubtitle',
                    'about.hero_subtitle': 'aboutHeroSubtitle',
                    'footer.description': 'footerDescription'
                };

                const newInst: any = { ...institutionalContent };
                Object.entries(instKeys).forEach(([dbKey, stateKey]) => {
                    if (content[dbKey]) newInst[stateKey] = content[dbKey];
                });
                setInstitutionalContent(newInst);

                // Map social links
                if (content['social.links']) {
                    setSocialLinks(prev => ({ ...prev, ...content['social.links'] }));
                }

                setServices(editorialServices);
            } catch (error) {
                console.error("Error loading settings:", error);
                showToast('Erro ao carregar configurações', 'error');
            } finally {
                setLoading(false);
            }
        };

        loadAllSettings();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            // Save based on active tab or all? Let's save all for simplicity in this UI
            await Promise.all([
                saveSiteContent('config', 'general', generalSettings),
                saveSiteContent('links', 'social', socialLinks),
                // Institutional saves
                saveSiteContent('hero_title', 'home', institutionalContent.homeHeroTitle),
                saveSiteContent('hero_subtitle', 'home', institutionalContent.homeHeroSubtitle),
                saveSiteContent('title', 'newsletter', institutionalContent.newsletterTitle),
                saveSiteContent('subtitle', 'newsletter', institutionalContent.newsletterSubtitle),
                saveSiteContent('hero_subtitle', 'about', institutionalContent.aboutHeroSubtitle),
                saveSiteContent('description', 'footer', institutionalContent.footerDescription)
            ]);

            showToast('Configurações guardadas com sucesso', 'success');
        } catch (error) {
            console.error("Error saving settings:", error);
            showToast('Erro ao guardar configurações', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleAddService = async () => {
        const title = prompt('Nome do novo serviço:');
        if (!title) return;

        const newService: Partial<EditorialService> = {
            title,
            description: 'Descrição do serviço...',
            price: 'Sob Consulta',
            isActive: true,
            displayOrder: services.length + 1
        };

        try {
            await saveEditorialService(newService);
            const updated = await getEditorialServices();
            setServices(updated);
            showToast('Serviço adicionado', 'success');
        } catch (error) {
            showToast('Erro ao adicionar serviço', 'error');
        }
    };

    const handleDeleteService = async (id: string) => {
        if (!confirm('Tem a certeza que deseja remover este serviço?')) return;
        try {
            await deleteEditorialService(id);
            setServices(services.filter(s => s.id !== id));
            showToast('Serviço removido', 'success');
        } catch (error) {
            showToast('Erro ao remover serviço', 'error');
        }
    };

    const tabs = [
        { id: 'geral', label: 'Geral', icon: Globe },
        { id: 'institucional', label: 'Institucional', icon: Type },
        { id: 'social', label: 'Redes Sociais', icon: Instagram },
        { id: 'servicos', label: 'Serviços', icon: Layout },
        { id: 'seguranca', label: 'Segurança', icon: Shield },
    ];

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
                <Loader2 className="w-12 h-12 text-brand-primary animate-spin" />
                <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Carregando Definições...</p>
            </div>
        );
    }

    return (
        <div className="space-y-12">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <span className="text-brand-primary font-bold uppercase tracking-[0.4em] text-[10px]">Configuração do Sistema</span>
                    <h2 className="text-4xl sm:text-5xl font-black text-brand-dark uppercase tracking-tighter leading-none mt-2">
                        Definições
                    </h2>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-8 py-4 bg-brand-primary text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:brightness-110 transition-all shadow-xl shadow-brand-primary/20 disabled:opacity-50"
                >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Guardar Alterações
                </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-12">
                {/* Settings Navigation */}
                <aside className="lg:w-64 shrink-0 space-y-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 font-bold text-xs uppercase tracking-widest ${activeTab === tab.id
                                ? 'bg-brand-dark text-white shadow-lg'
                                : 'text-gray-400 hover:bg-gray-50 hover:text-brand-dark'
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </aside>

                {/* Content Area */}
                <div className="flex-1">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white rounded-[3.5rem] p-8 md:p-12 border border-gray-100 shadow-sm"
                        >
                            {activeTab === 'geral' && (
                                <div className="space-y-10">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Nome da Editora</label>
                                            <input
                                                type="text"
                                                value={generalSettings.companyName}
                                                onChange={e => setGeneralSettings({ ...generalSettings, companyName: e.target.value })}
                                                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold text-brand-dark focus:ring-2 focus:ring-brand-primary/20 outline-none"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Email de Contacto</label>
                                            <div className="relative">
                                                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-primary" />
                                                <input
                                                    type="email"
                                                    value={generalSettings.contactEmail}
                                                    onChange={e => setGeneralSettings({ ...generalSettings, contactEmail: e.target.value })}
                                                    className="w-full pl-14 pr-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold text-brand-dark focus:ring-2 focus:ring-brand-primary/20 outline-none"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Telefone Principal</label>
                                            <div className="relative">
                                                <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-primary" />
                                                <input
                                                    type="text"
                                                    value={generalSettings.contactPhone}
                                                    onChange={e => setGeneralSettings({ ...generalSettings, contactPhone: e.target.value })}
                                                    className="w-full pl-14 pr-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold text-brand-dark focus:ring-2 focus:ring-brand-primary/20 outline-none"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Morada Sede</label>
                                            <div className="relative">
                                                <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-primary" />
                                                <input
                                                    type="text"
                                                    value={generalSettings.address}
                                                    onChange={e => setGeneralSettings({ ...generalSettings, address: e.target.value })}
                                                    className="w-full pl-14 pr-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold text-brand-dark focus:ring-2 focus:ring-brand-primary/20 outline-none"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-8 bg-brand-light/30 rounded-3xl border border-brand-primary/10 flex items-center justify-between">
                                        <div className="flex gap-4">
                                            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center">
                                                <Shield className="w-6 h-6 text-brand-primary" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-black uppercase tracking-tight text-brand-dark leading-none mb-2">Modo Visibilidade</h4>
                                                <p className="text-[10px] text-gray-500 font-medium">Controle se o site está acessível ao público.</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setGeneralSettings({ ...generalSettings, maintenanceMode: !generalSettings.maintenanceMode })}
                                            className={`w-14 h-8 rounded-full relative transition-colors duration-500 ${generalSettings.maintenanceMode ? 'bg-red-500' : 'bg-green-500'}`}
                                        >
                                            <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 ${generalSettings.maintenanceMode ? 'right-1' : 'left-1'}`}></div>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'institucional' && (
                                <div className="space-y-8">
                                    <div className="grid grid-cols-1 gap-8">
                                        <div className="p-8 bg-gray-50 rounded-3xl space-y-6">
                                            <div className="flex items-center gap-4 text-brand-primary">
                                                <Sparkles className="w-5 h-5" />
                                                <h4 className="text-xs font-black uppercase tracking-widest">Página Inicial (Hero)</h4>
                                            </div>
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Headline Principal</label>
                                                    <input
                                                        type="text"
                                                        value={institutionalContent.homeHeroTitle}
                                                        onChange={e => setInstitutionalContent({ ...institutionalContent, homeHeroTitle: e.target.value })}
                                                        className="w-full px-6 py-4 bg-white border-none rounded-2xl text-sm font-bold text-brand-dark focus:ring-2 focus:ring-brand-primary/20 outline-none"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Subtítulo do Hero</label>
                                                    <textarea
                                                        value={institutionalContent.homeHeroSubtitle}
                                                        onChange={e => setInstitutionalContent({ ...institutionalContent, homeHeroSubtitle: e.target.value })}
                                                        rows={2}
                                                        className="w-full px-6 py-4 bg-white border-none rounded-2xl text-sm font-bold text-brand-dark focus:ring-2 focus:ring-brand-primary/20 outline-none resize-none"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-8 bg-gray-50 rounded-3xl space-y-6">
                                            <div className="flex items-center gap-4 text-brand-primary">
                                                <Mail className="w-5 h-5" />
                                                <h4 className="text-xs font-black uppercase tracking-widest">Newsletter (Manifesto)</h4>
                                            </div>
                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Título</label>
                                                    <input
                                                        type="text"
                                                        value={institutionalContent.newsletterTitle}
                                                        onChange={e => setInstitutionalContent({ ...institutionalContent, newsletterTitle: e.target.value })}
                                                        className="w-full px-6 py-4 bg-white border-none rounded-2xl text-sm font-bold text-brand-dark focus:ring-2 focus:ring-brand-primary/20 outline-none"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Subtítulo</label>
                                                    <input
                                                        type="text"
                                                        value={institutionalContent.newsletterSubtitle}
                                                        onChange={e => setInstitutionalContent({ ...institutionalContent, newsletterSubtitle: e.target.value })}
                                                        className="w-full px-6 py-4 bg-white border-none rounded-2xl text-sm font-bold text-brand-dark focus:ring-2 focus:ring-brand-primary/20 outline-none"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-8 bg-gray-50 rounded-3xl space-y-6">
                                            <div className="flex items-center gap-4 text-brand-primary">
                                                <Layout className="w-5 h-5" />
                                                <h4 className="text-xs font-black uppercase tracking-widest">Outras Secções</h4>
                                            </div>
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Sobre Nós (Subtítulo Hero)</label>
                                                    <textarea
                                                        value={institutionalContent.aboutHeroSubtitle}
                                                        onChange={e => setInstitutionalContent({ ...institutionalContent, aboutHeroSubtitle: e.target.value })}
                                                        rows={2}
                                                        className="w-full px-6 py-4 bg-white border-none rounded-2xl text-sm font-bold text-brand-dark focus:ring-2 focus:ring-brand-primary/20 outline-none resize-none"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Descrição do Rodapé (Footer)</label>
                                                    <textarea
                                                        value={institutionalContent.footerDescription}
                                                        onChange={e => setInstitutionalContent({ ...institutionalContent, footerDescription: e.target.value })}
                                                        rows={2}
                                                        className="w-full px-6 py-4 bg-white border-none rounded-2xl text-sm font-bold text-brand-dark focus:ring-2 focus:ring-brand-primary/20 outline-none resize-none"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'social' && (
                                <div className="space-y-10">
                                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex items-center gap-4 mb-4">
                                        <div className="w-10 h-10 bg-brand-primary/10 rounded-xl flex items-center justify-center text-brand-primary">
                                            <Instagram className="w-5 h-5" />
                                        </div>
                                        <p className="text-xs font-medium text-gray-500 italic">
                                            Estes links alimentam os ícones sociais no topo e rodapé do site.
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {[
                                            { id: 'facebook', icon: Facebook, label: 'Facebook' },
                                            { id: 'instagram', icon: Instagram, label: 'Instagram' },
                                            { id: 'linkedin', icon: Linkedin, label: 'LinkedIn' },
                                            { id: 'twitter', icon: Twitter, label: 'Twitter (X)' },
                                            { id: 'youtube', icon: Youtube, label: 'YouTube' },
                                            { id: 'tiktok', icon: Globe, label: 'TikTok' },
                                        ].map((item) => (
                                            <div key={item.id} className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">{item.label}</label>
                                                <div className="relative">
                                                    <item.icon className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-primary opacity-60" />
                                                    <input
                                                        type="text"
                                                        value={(socialLinks as any)[item.id]}
                                                        onChange={e => setSocialLinks({ ...socialLinks, [item.id]: e.target.value })}
                                                        placeholder={`URL do seu ${item.label}...`}
                                                        className="w-full pl-14 pr-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold text-brand-dark focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'servicos' && (
                                <div className="space-y-8">
                                    <div className="flex items-center justify-between mb-2">
                                        <div>
                                            <h4 className="text-sm font-black uppercase tracking-tight text-brand-dark">Catálogo de Serviços</h4>
                                            <p className="text-[10px] text-gray-400 font-medium">Estes serviços aparecem na página institucional.</p>
                                        </div>
                                        <button
                                            onClick={handleAddService}
                                            className="flex items-center gap-2 px-6 py-3 bg-brand-dark text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-primary transition-all shadow-lg shadow-brand-dark/10"
                                        >
                                            <Plus className="w-3 h-3 text-brand-primary" />
                                            Novo Serviço
                                        </button>
                                    </div>

                                    <div className="grid gap-4">
                                        {services.map((service) => (
                                            <div key={service.id} className="flex items-center justify-between p-6 bg-gray-50 rounded-[2rem] border border-gray-100 group hover:border-brand-primary/20 transition-all">
                                                <div className="flex items-center gap-6">
                                                    <div className={`w-3 h-3 rounded-full ${service.isActive ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-gray-300'}`}></div>
                                                    <div>
                                                        <p className="text-base font-black text-brand-dark uppercase tracking-tight">{service.title}</p>
                                                        <p className="text-[10px] font-black text-brand-primary uppercase tracking-widest mt-1">{service.price}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button className="p-3 bg-white rounded-xl text-gray-400 hover:text-brand-primary transition-colors shadow-sm" title="Editar">
                                                        <Settings className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteService(service.id)}
                                                        className="p-3 bg-white rounded-xl text-gray-400 hover:text-red-500 transition-colors shadow-sm"
                                                        title="Remover"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        {services.length === 0 && (
                                            <div className="text-center py-12 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Nenhum serviço configurado.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'seguranca' && (
                                <div className="space-y-12">
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="p-10 bg-gray-50 rounded-[3rem] space-y-6">
                                            <div className="flex items-center gap-4 text-brand-primary">
                                                <Database className="w-6 h-6" />
                                                <h4 className="text-xs font-black uppercase tracking-widest">Backup & Backup</h4>
                                            </div>
                                            <p className="text-xs text-gray-500 leading-relaxed font-medium">
                                                Efetue o download manual de toda a base de dados (Livros, Usuários, Transações) em formato JSON.
                                            </p>
                                            <button className="w-full py-4 bg-brand-dark text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-brand-primary transition-all">
                                                Exportar JSON
                                            </button>
                                        </div>

                                        <div className="p-10 bg-gray-50 rounded-[3rem] space-y-6">
                                            <div className="flex items-center gap-4 text-brand-primary">
                                                <Bell className="w-6 h-6" />
                                                <h4 className="text-xs font-black uppercase tracking-widest">Logs do Sistema</h4>
                                            </div>
                                            <p className="text-xs text-gray-500 leading-relaxed font-medium">
                                                Visualize os logs de atividade para monitorar erros críticos ou comportamentos anómalos.
                                            </p>
                                            <button className="w-full py-4 bg-white border border-gray-200 text-brand-dark rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-gray-100 transition-all">
                                                Ver Activity Log
                                            </button>
                                        </div>
                                    </div>

                                    <div className="p-8 bg-red-50 rounded-[2rem] border border-red-100 flex items-center justify-between">
                                        <div className="flex items-center gap-6">
                                            <div className="w-12 h-12 bg-red-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-red-500/20">
                                                <Trash2 className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-black uppercase tracking-tight text-red-800">Zona de Perigo</h4>
                                                <p className="text-[10px] text-red-700 font-medium">Limpar cache persistente do site. Use com cautela.</p>
                                            </div>
                                        </div>
                                        <button className="px-6 py-3 bg-red-800 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-900 transition-all">
                                            Limpar Cache
                                        </button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
