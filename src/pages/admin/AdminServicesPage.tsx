import React, { useState, useEffect } from 'react';
import { motion as m, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Search, Briefcase, Save, X, Loader2, Zap, Hash, Cpu, Tag, DollarSign } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '../../components/Toast';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';

// Validation Schema
const serviceSchema = z.object({
    title: z.string().min(2, 'Título é obrigatório'),
    price: z.string().min(1, 'Preço é obrigatório'),
    order: z.coerce.number().min(0, 'Ordem inválida'),
    details: z.string().min(5, 'Especificações são necessárias'),
});

type ServiceFormData = z.infer<typeof serviceSchema>;

const AdminServicesPage: React.FC = () => {
    const { showToast } = useToast();
    const [editorialServices, setEditorialServices] = useState<any[]>([]);
    const [filteredServices, setFilteredServices] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoadingServices, setIsLoadingServices] = useState(true);
    const [showServiceModal, setShowServiceModal] = useState(false);
    const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<any>({
        resolver: zodResolver(serviceSchema),
        defaultValues: {
            title: '',
            price: '',
            order: 0,
            details: '',
        },
    });

    const fetchServices = async () => {
        setIsLoadingServices(true);
        try {
            const { getEditorialServices } = await import('../../services/dataService');
            const data = await getEditorialServices();
            setEditorialServices(data || []);
            setFilteredServices(data || []);
        } catch (error) {
            console.error('Erro ao buscar serviços editoriais:', error);
            showToast('Erro ao carregar serviços.', 'error');
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

    const handleCreate = () => {
        setSelectedServiceId(null);
        reset({
            title: '',
            price: '',
            order: 0,
            details: '',
        });
        setShowServiceModal(true);
    };

    const handleEdit = (service: any) => {
        setSelectedServiceId(service.id);
        reset({
            title: service.title,
            price: service.price.toString(),
            order: service.order,
            details: Array.isArray(service.details) ? service.details.join('\n') : service.details,
        });
        setShowServiceModal(true);
    };

    const onSubmit = async (data: ServiceFormData) => {
        try {
            const { saveEditorialService } = await import('../../services/dataService');

            const sanitizedService = {
                ...data,
                id: selectedServiceId || undefined,
                title: data.title.trim(),
                price: data.price.trim(),
                details: data.details
                    .split('\n')
                    .map((d: string) => d.trim())
                    .filter((d: string) => d.length > 0),
                order: Number(data.order) || 0
            };

            await saveEditorialService(sanitizedService);
            setShowServiceModal(false);
            fetchServices();
            showToast('Estratégia de serviço actualizada!', 'success');
        } catch (error: any) {
            console.error('Erro ao salvar serviço:', error);
            showToast('Erro ao gravar alterações.', 'error');
        }
    };

    const handleDeleteService = async (id: string) => {
        if (!confirm('Eliminar este serviço do catálogo de operações?')) return;
        try {
            const { deleteEditorialService } = await import('../../services/dataService');
            await deleteEditorialService(id);
            fetchServices();
            showToast('Serviço removido com sucesso!', 'success');
        } catch (error) {
            console.error('Erro ao eliminar serviço:', error);
            showToast('Erro ao abortar operação.', 'error');
        }
    };

    return (
        <div className="space-y-6">
            <AdminPageHeader title="Serviços" subtitle="Catálogo de serviços editoriais" highlight="Soluções">
                <Input placeholder="Pesquisar..." variant="light" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full sm:w-64" />
                <button onClick={handleCreate} className="bg-brand-primary text-white font-semibold text-sm px-5 py-2 rounded-lg flex items-center gap-2 hover:bg-brand-dark transition-colors min-h-[40px]">
                    <Plus className="w-4 h-4" /> Novo Serviço
                </button>
            </AdminPageHeader>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[720px] border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Serviço</th>
                                <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Detalhes</th>
                                <th className="px-4 sm:px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Preço</th>
                                <th className="px-4 sm:px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Ordem</th>
                                <th className="px-4 sm:px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            <AnimatePresence mode="popLayout">
                                {isLoadingServices ? (
                                    [1, 2, 3, 4].map(i => (
                                        <tr key={i} className="animate-pulse">
                                            <td colSpan={5} className="px-4 sm:px-6 py-4">
                                                <div className="h-8 bg-gray-100 rounded w-full"></div>
                                            </td>
                                        </tr>
                                    ))
                                ) : filteredServices.length > 0 ? (
                                    filteredServices.map((service) => (
                                        <m.tr
                                            key={service.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className="hover:bg-gray-50 transition-colors group/row"
                                        >
                                            <td className="px-4 sm:px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                                                        <Zap className="w-5 h-5" />
                                                    </div>
                                                    <span className="font-semibold text-gray-900 text-sm tracking-tight">{service.title}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 sm:px-6 py-4">
                                                <div className="flex flex-wrap gap-1.5">
                                                    {service.details.slice(0, 3).map((d: string, i: number) => (
                                                        <span key={i} className="px-2 py-0.5 bg-gray-50 border border-gray-200 text-[10px] font-medium text-gray-500 rounded">
                                                            {d}
                                                        </span>
                                                    ))}
                                                    {service.details.length > 3 && (
                                                        <span className="px-2 py-0.5 bg-brand-primary/10 text-brand-primary text-[10px] font-bold rounded border border-brand-primary/20">
                                                            +{service.details.length - 3} itens
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 sm:px-6 py-4 text-right font-bold text-gray-900 text-sm">
                                                {typeof service.price === 'number' ?
                                                    `${service.price.toLocaleString()} Kz` :
                                                    <span className="text-[10px] uppercase font-bold text-gray-500">{service.price}</span>
                                                }
                                            </td>
                                            <td className="px-4 sm:px-6 py-4 text-right">
                                                <div className="inline-flex items-center gap-1.5 text-xs text-gray-500">
                                                    <Hash className="w-3 h-3" />
                                                    <span>{service.order}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 sm:px-6 py-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => handleEdit(service)}
                                                        className="p-2 text-gray-400 hover:text-brand-primary hover:bg-brand-primary/10 rounded-md transition-colors"
                                                        title="Editar"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteService(service.id)}
                                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                                        title="Eliminar"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </m.tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="py-24 text-center">
                                            <div className="flex flex-col items-center gap-4 text-gray-300">
                                                <Cpu className="w-12 h-12" />
                                                <p className="font-semibold text-sm">Nenhum serviço registado</p>
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
                                        <h3 className="text-xl font-bold text-gray-900 tracking-tight">
                                            {selectedServiceId ? 'Editar Serviço' : 'Novo Serviço'}
                                        </h3>
                                        <p className="text-xs text-gray-500">Configuração de catálogo editorial</p>
                                    </div>
                                    <button
                                        onClick={() => setShowServiceModal(false)}
                                        className="p-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
                                        title="Fechar"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-8 space-y-6">

                                <div className="space-y-1">
                                    <Input
                                        label="Título do Serviço"
                                        placeholder="Ex: Design Editorial"
                                        icon={<Tag className="w-4 h-4" />}
                                        {...register('title')}
                                        error={errors.title?.message as string}
                                        className="rounded-lg"
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <Input
                                        label="Investimento Base"
                                        placeholder="Ex: 45.000 Kz"
                                        icon={<DollarSign className="w-4 h-4" />}
                                        {...register('price')}
                                        error={errors.price?.message as string}
                                        className="rounded-lg"
                                    />
                                    <Input
                                        type="number"
                                        label="Ordem de Exibição"
                                        icon={<Hash className="w-4 h-4" />}
                                        {...register('order')}
                                        error={errors.order?.message as string}
                                        className="rounded-lg"
                                    />
                                </div>

                                <div className="space-y-4">
                                    <Textarea
                                        label="Especificações (uma por linha)"
                                        placeholder="Revisão ortográfica&#10;Design de capa&#10;Registo de ISBN"
                                        rows={6}
                                        {...register('details')}
                                        error={errors.details?.message as string}
                                        className="rounded-lg"
                                    />
                                </div>
                            </form>

                            <div className="p-8 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowServiceModal(false)}
                                    className="px-6 py-2 border border-gray-200 text-gray-500 rounded-lg font-semibold text-sm hover:bg-white hover:text-gray-700 transition-all"
                                >
                                    Cancelar
                                </button>
                                <Button
                                    onClick={handleSubmit(onSubmit)}
                                    isLoading={isSubmitting}
                                    disabled={isSubmitting}
                                    className="px-8 rounded-lg"
                                >
                                    Gravar Serviço
                                </Button>
                            </div>
                        </m.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminServicesPage;
