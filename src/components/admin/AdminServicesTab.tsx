import React, { useState, useEffect } from 'react';
import { motion as m, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Loader2, Save, X, Search, Briefcase, DollarSign, Hash, List, Tag } from 'lucide-react';
import { useToast } from '../Toast';

const AdminServicesTab: React.FC = () => {
    const { showToast } = useToast();
    const [editorialServices, setEditorialServices] = useState<any[]>([]);
    const [filteredServices, setFilteredServices] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoadingServices, setIsLoadingServices] = useState(true);
    const [showServiceModal, setShowServiceModal] = useState(false);
    const [serviceForm, setServiceForm] = useState<any>({ title: '', price: '', details: [], order: 0 });
    const [isSavingService, setIsSavingService] = useState(false);
    const [serviceErrors, setServiceErrors] = useState<Record<string, string>>({});

    const fetchServices = async () => {
        setIsLoadingServices(true);
        try {
            const { getEditorialServices } = await import('../../services/dataService');
            const data = await getEditorialServices();
            setEditorialServices(data);
            setFilteredServices(data);
        } catch (error) {
            console.error('Erro ao buscar serviços editoriais:', error);
        } finally {
            setIsLoadingServices(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    useEffect(() => {
        const query = searchQuery.toLowerCase();
        setFilteredServices(
            editorialServices.filter(s =>
                s.title?.toLowerCase().includes(query) ||
                s.details?.some((d: string) => d.toLowerCase().includes(query))
            )
        );
    }, [searchQuery, editorialServices]);

    const handleSaveService = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!serviceForm.title.trim()) {
            return;
        }

        setIsSavingService(true);
        try {
            const { saveEditorialService } = await import('../../services/dataService');

            const sanitizedService = {
                ...serviceForm,
                title: serviceForm.title.trim(),
                price: serviceForm.price.trim(),
                details: serviceForm.details
                    .map((d: string) => d.trim())
                    .filter((d: string) => d.length > 0),
                order: Number(serviceForm.order) || 0
            };

            await saveEditorialService(sanitizedService);
            setShowServiceModal(false);
            fetchServices();
            showToast('Serviço salvo com sucesso!', 'success');
        } catch (error: any) {
            console.error('Erro ao salvar serviço:', error);
            setServiceErrors({ form: error.message || 'Erro ao salvar serviço.' });
            showToast('Erro ao salvar serviço.', 'error');
        } finally {
            setIsSavingService(false);
        }
    };

    const handleDeleteService = async (id: string) => {
        if (!confirm('Eliminar este serviço?')) return;
        try {
            const { deleteEditorialService } = await import('../../services/dataService');
            await deleteEditorialService(id);
            fetchServices();
            showToast('Serviço eliminado com sucesso!', 'success');
        } catch (error) {
            console.error('Erro ao eliminar serviço:', error);
            showToast('Erro ao eliminar serviço.', 'error');
        }
    };

    return (
        <div className="space-y-10">
            <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-8">
                <div>
                    <h2 className="text-4xl font-black text-brand-dark tracking-tighter uppercase mb-2">Serviços <span className="text-brand-primary lowercase italic font-light">Premium</span></h2>
                    <p className="text-gray-400 font-bold text-sm">Configuração do catálogo de soluções editoriais.</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
                    <div className="relative group w-full sm:w-80">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-brand-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="Pesquisar serviços..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-6 py-4 bg-gray-50 border-2 border-transparent focus:border-brand-primary/20 focus:bg-white rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest outline-none transition-all shadow-sm"
                        />
                    </div>

                    <m.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                            setServiceForm({ title: '', price: '', details: [], order: 0 });
                            setShowServiceModal(true);
                        }}
                        className="btn-premium py-4 px-8 text-[10px] w-full sm:w-auto shadow-xl shadow-brand-primary/20"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        <span>Novo Serviço</span>
                    </m.button>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-brand-dark/5 border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px]">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Serviço / Título</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Principais Detalhes</th>
                                <th className="px-8 py-6 text-right text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Investimento</th>
                                <th className="px-8 py-6 text-right text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Ordem</th>
                                <th className="px-8 py-6 text-center text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            <AnimatePresence mode="popLayout">
                                {isLoadingServices ? (
                                    [1, 2, 3].map(i => (
                                        <tr key={i} className="animate-pulse">
                                            <td colSpan={5} className="px-8 py-6">
                                                <div className="h-4 bg-gray-100 rounded-full w-full"></div>
                                            </td>
                                        </tr>
                                    ))
                                ) : filteredServices.length > 0 ? (
                                    filteredServices.map((service) => (
                                        <m.tr
                                            key={service.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="hover:bg-gray-50/50 transition-colors group text-sm"
                                        >
                                            <td className="px-8 py-6">
                                                <span className="font-black text-brand-dark tracking-tight">{service.title}</span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-wrap gap-2">
                                                    {service.details.slice(0, 2).map((d: string, i: number) => (
                                                        <span key={i} className="px-2 py-1 bg-gray-100 text-[9px] font-bold text-gray-500 rounded-md whitespace-nowrap">
                                                            {d}
                                                        </span>
                                                    ))}
                                                    {service.details.length > 2 && (
                                                        <span className="px-2 py-1 bg-brand-primary/10 text-brand-primary text-[9px] font-black rounded-md">
                                                            +{service.details.length - 2}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right font-black text-brand-primary">
                                                {typeof service.price === 'number' ? `${service.price.toLocaleString()} Kz` : service.price}
                                            </td>
                                            <td className="px-8 py-6 text-right font-black text-gray-300">
                                                #{service.order}
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center justify-center gap-3">
                                                    <m.button
                                                        whileHover={{ scale: 1.1, y: -2 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => {
                                                            setServiceForm(service);
                                                            setShowServiceModal(true);
                                                        }}
                                                        className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white flex items-center justify-center transition-all shadow-sm"
                                                        title="Editar serviço"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </m.button>
                                                    <m.button
                                                        whileHover={{ scale: 1.1, y: -2 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => handleDeleteService(service.id)}
                                                        className="w-10 h-10 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white flex items-center justify-center transition-all shadow-sm"
                                                        title="Eliminar serviço"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </m.button>
                                                </div>
                                            </td>
                                        </m.tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-32 text-center">
                                            <div className="flex flex-col items-center gap-4 opacity-20 grayscale">
                                                <Briefcase className="w-16 h-16" />
                                                <p className="font-black uppercase tracking-[0.3em] text-[10px]">Nenhum serviço disponível.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Service Modal */}
            <AnimatePresence>
                {showServiceModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <m.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowServiceModal(false)}
                            className="absolute inset-0 bg-brand-dark/40 backdrop-blur-xl"
                        />
                        <m.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white rounded-[3rem] w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl relative z-20 border border-white/20 flex flex-col"
                        >
                            <div className="p-10 border-b border-gray-100 flex items-center justify-between">
                                <div>
                                    <h3 className="text-3xl font-black text-brand-dark tracking-tighter uppercase mb-1">{serviceForm.id ? 'Editar Serviço' : 'Novo Serviço'}</h3>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-brand-primary">Configuração de oferta</p>
                                </div>
                                <m.button
                                    whileHover={{ rotate: 90, scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setShowServiceModal(false)}
                                    className="w-12 h-12 flex items-center justify-center bg-gray-50 text-gray-400 hover:text-brand-dark rounded-full transition-all"
                                    title="Fechar"
                                >
                                    <X className="w-6 h-6" />
                                </m.button>
                            </div>

                            <form onSubmit={handleSaveService} className="flex-1 overflow-y-auto p-10 space-y-8">
                                <div className="space-y-2">
                                    <label htmlFor="service-title" className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Título do Serviço</label>
                                    <div className="relative">
                                        <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                        <input
                                            id="service-title"
                                            type="text"
                                            required
                                            value={serviceForm.title}
                                            onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                                            className="w-full pl-12 pr-6 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-brand-primary/20 focus:bg-white outline-none transition-all font-black text-brand-dark"
                                            placeholder="Ex: Consultoria Editorial Completa"
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label htmlFor="service-price" className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Investimento Estimado</label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                            <input
                                                id="service-price"
                                                type="text"
                                                required
                                                value={serviceForm.price}
                                                onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                                                className="w-full pl-12 pr-6 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-brand-primary/20 focus:bg-white outline-none transition-all font-bold"
                                                placeholder="Ex: Sob Consulta ou 50.000 Kz"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="service-order" className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Ordem de Exibição</label>
                                        <div className="relative">
                                            <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                            <input
                                                id="service-order"
                                                type="number"
                                                required
                                                value={serviceForm.order}
                                                onChange={(e) => setServiceForm({ ...serviceForm, order: parseInt(e.target.value) })}
                                                className="w-full pl-12 pr-6 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-brand-primary/20 focus:bg-white outline-none transition-all font-bold"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="service-details" className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Recursos inclusos (um por linha)</label>
                                    <div className="relative">
                                        <List className="absolute left-4 top-6 w-4 h-4 text-gray-300" />
                                        <textarea
                                            id="service-details"
                                            required
                                            value={serviceForm.details.join('\n')}
                                            onChange={(e) => setServiceForm({ ...serviceForm, details: e.target.value.split('\n') })}
                                            className="w-full pl-12 pr-6 py-6 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-brand-primary/20 focus:bg-white outline-none transition-all h-40 resize-none font-medium text-gray-600"
                                            placeholder="Ex:&#10;Revisão Gramatical&#10;Projeto Gráfico&#10;Distribuição Digital"
                                        />
                                    </div>
                                </div>
                            </form>

                            <div className="p-10 border-t border-gray-100 bg-gray-50/50 flex gap-6">
                                <button
                                    type="button"
                                    onClick={() => setShowServiceModal(false)}
                                    className="flex-1 px-8 py-5 border-2 border-gray-100 text-gray-400 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest hover:border-gray-200 hover:text-brand-dark transition-all flex items-center justify-center gap-2"
                                >
                                    Cancelar
                                </button>
                                <m.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleSaveService}
                                    disabled={isSavingService}
                                    className="flex-2 btn-premium py-5 px-12 text-[10px] shadow-xl shadow-brand-primary/20"
                                >
                                    {isSavingService ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4 mr-2" />
                                            <span>Salvar Serviço</span>
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

export default AdminServicesTab;
