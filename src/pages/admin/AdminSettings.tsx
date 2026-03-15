import React, { useState } from 'react';
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
    Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../../components/Toast';

const AdminSettings: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'geral' | 'social' | 'servicos' | 'seguranca'>('geral');
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();

    const handleSave = async () => {
        setLoading(true);
        // Simulating API call
        setTimeout(() => {
            setLoading(false);
            showToast('Configurações guardadas com sucesso', 'success');
        }, 1000);
    };

    const tabs = [
        { id: 'geral', label: 'Geral', icon: Globe },
        { id: 'social', label: 'Redes Sociais', icon: Instagram },
        { id: 'servicos', label: 'Conteúdo & Serviços', icon: Layout },
        { id: 'seguranca', label: 'Segurança', icon: Shield },
    ];

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
                    disabled={loading}
                    className="flex items-center gap-2 px-8 py-4 bg-brand-primary text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:brightness-110 transition-all shadow-xl shadow-brand-primary/20 disabled:opacity-50"
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
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
                            className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm"
                        >
                            {activeTab === 'geral' && (
                                <div className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label htmlFor="companyName" className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Nome da Editora</label>
                                            <input
                                                id="companyName"
                                                type="text"
                                                defaultValue="Editora Graça"
                                                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold text-brand-dark outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="contactEmail" className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Email de Contacto</label>
                                            <div className="relative">
                                                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-primary" />
                                                <input
                                                    id="contactEmail"
                                                    type="email"
                                                    defaultValue="geral@editoragraca.com"
                                                    className="w-full pl-14 pr-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold text-brand-dark outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="contactPhone" className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Telefone / WhatsApp</label>
                                            <div className="relative">
                                                <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-primary" />
                                                <input
                                                    id="contactPhone"
                                                    type="text"
                                                    defaultValue="+351 912 345 678"
                                                    className="w-full pl-14 pr-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold text-brand-dark outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="companyAddress" className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Morada Sede</label>
                                            <input
                                                id="companyAddress"
                                                type="text"
                                                defaultValue="Avenida da Liberdade, Lisboa"
                                                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold text-brand-dark outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-8 border-t border-gray-50">
                                        <h4 className="text-sm font-black uppercase tracking-tight text-brand-dark mb-6">Identidade Visual</h4>
                                        <div className="flex flex-wrap gap-4">
                                            <div className="p-1 rounded-2xl bg-gray-50 border border-gray-100 flex items-center gap-4 pr-6">
                                                <div className="w-12 h-12 bg-brand-primary rounded-xl shadow-lg shadow-brand-primary/30"></div>
                                                <div>
                                                    <p className="text-[8px] font-black uppercase tracking-widest text-gray-400 leading-none mb-1">Cor Primária</p>
                                                    <p className="text-xs font-bold font-mono">#ブランド_プライマリ</p>
                                                </div>
                                            </div>
                                            <div className="p-1 rounded-2xl bg-gray-50 border border-gray-100 flex items-center gap-4 pr-6">
                                                <div className="w-12 h-12 bg-brand-dark rounded-xl shadow-lg shadow-brand-dark/30"></div>
                                                <div>
                                                    <p className="text-[8px] font-black uppercase tracking-widest text-gray-400 leading-none mb-1">Cor Secundária</p>
                                                    <p className="text-xs font-bold font-mono">#0F172A</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'social' && (
                                <div className="space-y-8">
                                    <p className="text-xs font-medium text-gray-400 leading-relaxed mb-4">
                                        Estes links serão utilizados no rodapé do site e nas páginas de contacto.
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {[
                                            { icon: Instagram, label: 'Instagram', value: 'https://instagram.com/editoragraca' },
                                            { icon: Linkedin, label: 'LinkedIn', value: 'https://linkedin.com/company/editoragraca' },
                                            { icon: Twitter, label: 'Twitter (X)', value: 'https://x.com/editoragraca' },
                                            { icon: Globe, label: 'Site Oficial', value: 'https://editoragraca.com' },
                                        ].map((item) => (
                                            <div key={item.label} className="space-y-2">
                                                <label htmlFor={`social-${item.label}`} className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">{item.label}</label>
                                                <div className="relative">
                                                    <item.icon className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-primary" />
                                                    <input
                                                        id={`social-${item.label}`}
                                                        type="text"
                                                        defaultValue={item.value}
                                                        className="w-full pl-14 pr-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold text-brand-dark outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'servicos' && (
                                <div className="space-y-8">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-sm font-black uppercase tracking-tight text-brand-dark">Serviços Editoriais</h4>
                                        <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-brand-primary rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-brand-primary hover:text-white transition-all">
                                            <Plus className="w-3 h-3" />
                                            Novo Serviço
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        {[
                                            { id: 1, title: 'Edição de Texto', price: 'A partir de 450.000 Kz', active: true },
                                            { id: 2, title: 'Design de Capa', price: 'A partir de 300.000 Kz', active: true },
                                            { id: 3, title: 'Paginação e Ebook', price: 'A partir de 150.000 Kz', active: false },
                                        ].map((service) => (
                                            <div key={service.id} className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl group hover:bg-gray-100 transition-all">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-3 h-3 rounded-full ${service.active ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                                    <div>
                                                        <p className="text-sm font-black text-brand-dark">{service.title}</p>
                                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{service.price}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button className="p-2 bg-white rounded-lg text-gray-400 hover:text-brand-primary transition-colors" title="Configurar serviço">
                                                        <Settings className="w-4 h-4" />
                                                    </button>
                                                    <button className="p-2 bg-white rounded-lg text-gray-400 hover:text-red-500 transition-colors" title="Remover serviço">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'seguranca' && (
                                <div className="space-y-8">
                                    <div className="bg-amber-50 border border-amber-100 p-6 rounded-2xl flex gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-white shrink-0">
                                            <Shield className="w-5 h-5" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs font-black uppercase tracking-tight text-amber-800">Modo de Manutenção</p>
                                            <p className="text-[10px] text-amber-700/80 leading-relaxed">
                                                Ao ativar o modo de manutenção, apenas os administradores terão acesso às páginas públicas do site.
                                            </p>
                                        </div>
                                        <div className="ml-auto self-center">
                                            <div className="w-12 h-6 bg-gray-200 rounded-full relative cursor-pointer">
                                                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-8 border-t border-gray-50 space-y-6">
                                        <h4 className="text-sm font-black uppercase tracking-tight text-brand-dark">Cópia de Segurança</h4>
                                        <div className="flex flex-col sm:flex-row gap-4">
                                            <button className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-gray-50 hover:bg-brand-dark hover:text-white rounded-2xl transition-all group">
                                                <Database className="w-4 h-4 text-brand-primary group-hover:text-white" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Exportar Base de Dados</span>
                                            </button>
                                            <button className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-gray-50 hover:bg-brand-dark hover:text-white rounded-2xl transition-all group">
                                                <Bell className="w-4 h-4 text-brand-primary group-hover:text-white" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Enviar Log de Erros</span>
                                            </button>
                                        </div>
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
