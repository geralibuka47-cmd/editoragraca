import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Loader2, Save, X } from 'lucide-react';

const AdminServicesTab: React.FC = () => {
    const [editorialServices, setEditorialServices] = useState<any[]>([]);
    const [isLoadingServices, setIsLoadingServices] = useState(true);
    const [showServiceModal, setShowServiceModal] = useState(false);
    const [serviceForm, setServiceForm] = useState<any>({ title: '', price: '', details: [], order: 0 });
    const [isSavingService, setIsSavingService] = useState(false);

    const fetchServices = async () => {
        setIsLoadingServices(true);
        try {
            const { getEditorialServices } = await import('../../services/dataService');
            const data = await getEditorialServices();
            setEditorialServices(data);
        } catch (error) {
            console.error('Erro ao buscar serviços editoriais:', error);
        } finally {
            setIsLoadingServices(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const handleSaveService = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSavingService(true);
        try {
            const { saveEditorialService } = await import('../../services/dataService');
            await saveEditorialService(serviceForm);
            alert('Serviço guardado com sucesso!');
            setShowServiceModal(false);
            fetchServices();
        } catch (error) {
            console.error('Erro ao salvar serviço:', error);
            alert('Erro ao salvar serviço. Verifique se os dados estão corretos.');
        } finally {
            setIsSavingService(false);
        }
    };

    const handleDeleteService = async (id: string) => {
        if (!confirm('Eliminar este serviço?')) return;
        try {
            const { deleteEditorialService } = await import('../../services/dataService');
            await deleteEditorialService(id);
            alert('Serviço eliminado.');
            fetchServices();
        } catch (error) {
            console.error('Erro ao eliminar serviço:', error);
            alert('Erro ao eliminar serviço.');
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl md:text-3xl font-black text-brand-dark">Gestão de Serviços Editoriais</h2>
                <button
                    onClick={() => {
                        setServiceForm({ title: '', price: '', details: [], order: 0 });
                        setShowServiceModal(true);
                    }}
                    title="Adicionar novo serviço"
                    aria-label="Adicionar novo serviço"
                    className="btn-premium py-3 px-6 text-sm"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Serviço
                </button>
            </div>
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden overflow-x-auto">
                <table className="w-full min-w-[800px]">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-brand-dark uppercase tracking-wider">Serviço</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-brand-dark uppercase tracking-wider">Detalhes</th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-brand-dark uppercase tracking-wider">Preço</th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-brand-dark uppercase tracking-wider">Ordem</th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-brand-dark uppercase tracking-wider">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {isLoadingServices ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500 italic">Carregando serviços...</td>
                            </tr>
                        ) : editorialServices.length > 0 ? (
                            editorialServices.map((service) => (
                                <tr key={service.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-bold text-brand-dark">{service.title}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        <ul className="list-disc pl-4 text-xs space-y-1">
                                            {service.details.map((d: string, i: number) => (
                                                <li key={i}>{d}</li>
                                            ))}
                                        </ul>
                                    </td>
                                    <td className="px-6 py-4 text-right font-bold text-brand-primary">
                                        {typeof service.price === 'number' ? `${service.price.toLocaleString()} Kz` : service.price}
                                    </td>
                                    <td className="px-6 py-4 text-right text-sm text-gray-600">{service.order}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => {
                                                    setServiceForm(service);
                                                    setShowServiceModal(true);
                                                }}
                                                title="Editar serviço"
                                                aria-label="Editar serviço"
                                                className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 flex items-center justify-center transition-all"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteService(service.id)}
                                                title="Eliminar serviço"
                                                aria-label="Eliminar serviço"
                                                className="w-8 h-8 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 flex items-center justify-center transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500 italic">Nenhum serviço encontrado.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Service Modal */}
            {showServiceModal && (
                <div className="fixed inset-0 bg-brand-dark/90 backdrop-blur-sm z-50 flex items-center justify-center p-8">
                    <div className="bg-white rounded-[32px] w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col animate-fade-in">
                        <div className="p-8 border-b border-gray-100 bg-gray-50">
                            <h2 className="text-2xl font-black text-brand-dark">{serviceForm.id ? 'Editar Serviço' : 'Novo Serviço'}</h2>
                        </div>
                        <form onSubmit={handleSaveService} className="flex-1 overflow-y-auto p-8 space-y-6">
                            <div className="form-group-premium">
                                <label className="label-premium">Título do Serviço</label>
                                <input
                                    type="text"
                                    required
                                    value={serviceForm.title}
                                    onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                                    className="input-premium font-bold"
                                    placeholder="Ex: Revisão Literária"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="form-group-premium">
                                    <label htmlFor="service-price" className="label-premium">Preço Estimado</label>
                                    <input
                                        id="service-price"
                                        required
                                        type="text"
                                        title="Preço do serviço"
                                        value={serviceForm.price}
                                        onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                                        placeholder="Ex: 50.000 Kz"
                                        className="input-premium"
                                    />
                                </div>
                                <div className="form-group-premium">
                                    <label htmlFor="service-order" className="label-premium">Ordem</label>
                                    <input
                                        id="service-order"
                                        type="number"
                                        title="Ordem de exibição"
                                        placeholder="0"
                                        value={serviceForm.order}
                                        onChange={(e) => setServiceForm({ ...serviceForm, order: parseInt(e.target.value) })}
                                        className="input-premium"
                                    />
                                </div>
                            </div>
                            <div className="form-group-premium">
                                <label htmlFor="service-details" className="label-premium">Detalhes (um por linha)</label>
                                <textarea
                                    id="service-details"
                                    required
                                    title="Detalhes do serviço"
                                    value={serviceForm.details.join('\n')}
                                    onChange={(e) => setServiceForm({ ...serviceForm, details: e.target.value.split('\n') })}
                                    placeholder="Detalhe 1&#10;Detalhe 2..."
                                    className="input-premium h-32 resize-none"
                                />
                            </div>
                        </form>
                        <div className="p-8 border-t border-gray-100 flex gap-4 bg-gray-50/50">
                            <button
                                type="button"
                                onClick={() => setShowServiceModal(false)}
                                className="flex-1 px-8 py-4 border-2 border-brand-dark text-brand-dark rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-brand-dark hover:text-white transition-all flex items-center justify-center gap-2"
                            >
                                <X className="w-4 h-4" />
                                Cancelar
                            </button>
                            <button
                                onClick={handleSaveService}
                                disabled={isSavingService}
                                className="flex-1 btn-premium py-4"
                            >
                                {isSavingService ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Salvando...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        <span>Salvar Serviço</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminServicesTab;
