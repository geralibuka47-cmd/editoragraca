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
                <m.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleCreate} className="bg-brand-primary text-white font-bold text-sm px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-md min-h-[44px]">
                    <Plus className="w-4 h-4" /> Novo Serviço
                </m.button>
            </AdminPageHeader>

            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
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
                                            className="hover:bg-white/[0.03] transition-all duration-300 group/row"
                                        >
                                            <td className="px-4 sm:px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary group-hover/row:scale-110 transition-transform">
                                                        <Zap className="w-5 h-5 shadow-[0_0_15px_rgba(189,147,56,0.3)]" />
                                                    </div>
                                                    <span className="font-black text-white text-base tracking-tighter uppercase group-hover/row:text-brand-primary transition-colors">{service.title}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 sm:px-6 py-4">
                                                <div className="flex flex-wrap gap-2">
                                                    {service.details.slice(0, 3).map((d: string, i: number) => (
                                                        <span key={i} className="px-4 py-1.5 bg-white/5 border border-white/5 text-[8px] font-black text-gray-400 rounded-full uppercase tracking-widest">
                                                            {d}
                                                        </span>
                                                    ))}
                                                    {service.details.length > 3 && (
                                                        <span className="px-3 py-1.5 bg-brand-primary/20 text-brand-primary text-[8px] font-black rounded-full border border-brand-primary/30 uppercase tracking-widest">
                                                            +{service.details.length - 3} SPEC
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 sm:px-6 py-4 text-right font-black text-lg text-brand-primary tracking-tighter">
                                                {typeof service.price === 'number' ?
                                                    `${service.price.toLocaleString()} Kz` :
                                                    <span className="text-[10px] uppercase tracking-widest text-gray-500">{service.price}</span>
                                                }
                                            </td>
                                            <td className="px-4 sm:px-6 py-4 text-right font-black text-gray-700">
                                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-lg border border-white/5">
                                                    <Hash className="w-3 h-3" />
                                                    <span className="text-xs">{service.order}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 sm:px-6 py-4">
                                                <div className="flex items-center justify-center gap-4">
                                                    <m.button
                                                        whileHover={{ scale: 1.1, rotate: -5 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => handleEdit(service)}
                                                        className="w-12 h-12 bg-white/5 border border-white/5 text-gray-400 rounded-2xl hover:bg-white/10 hover:text-white flex items-center justify-center transition-all shadow-xl group/edit"
                                                        title="Refinar Parâmetros"
                                                    >
                                                        <Edit className="w-5 h-5 transition-transform group-hover/edit:scale-110" />
                                                    </m.button>
                                                    <m.button
                                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => handleDeleteService(service.id)}
                                                        className="w-12 h-12 bg-red-500/5 border border-red-500/10 text-red-500/50 rounded-2xl hover:bg-red-500 hover:text-white flex items-center justify-center transition-all shadow-xl group/delete"
                                                        title="Abortar Serviço"
                                                    >
                                                        <Trash2 className="w-5 h-5 transition-transform group-hover/delete:scale-110" />
                                                    </m.button>
                                                </div>
                                            </td>
                                        </m.tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-10 py-48 text-center">
                                            <div className="flex flex-col items-center gap-8 opacity-20 grayscale">
                                                <Cpu className="w-24 h-24 text-brand-primary" />
                                                <p className="font-black uppercase tracking-[0.6em] text-[11px] text-gray-400">Sem Protocolos de Serviço Registados.</p>
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
                            initial={{ opacity: 0, scale: 0.95, y: 40 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 40 }}
                            className="bg-[#0D0D0D] rounded-[4rem] w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] relative z-20 border border-white/10 flex flex-col"
                        >
                            <div className="p-12 border-b border-white/5 relative bg-gradient-to-b from-white/[0.02] to-transparent">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-primary to-transparent" />
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-4xl font-black text-white tracking-tighter uppercase mb-2">
                                            {selectedServiceId ? 'Refinar Protocolo' : 'Novo Protocolo'}
                                        </h3>
                                        <div className="flex items-center gap-3">
                                            <Zap className="w-4 h-4 text-brand-primary animate-pulse" />
                                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Configuração de Solução Editorial</p>
                                        </div>
                                    </div>
                                    <m.button
                                        whileHover={{ rotate: 90, scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => setShowServiceModal(false)}
                                        className="w-14 h-14 flex items-center justify-center bg-white/5 border border-white/5 text-gray-500 hover:text-white rounded-2xl transition-all"
                                        title="Sair do Terminal"
                                        aria-label="Sair do Terminal"
                                    >
                                        <X className="w-6 h-6" />
                                    </m.button>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-12 space-y-12 custom-scrollbar">

                                <div className="space-y-4">
                                    <Input
                                        label="TITULAÇÃO DO SERVIÇO"
                                        placeholder="EX: DESIGN EDITORIAL AVANÇADO"
                                        icon={<Tag className="w-4 h-4" />}
                                        variant="glass"
                                        {...register('title')}
                                        error={errors.title?.message as string}
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-10">
                                    <Input
                                        label="INVESTIMENTO BASE"
                                        placeholder="EX: 45.000 KZ"
                                        icon={<DollarSign className="w-4 h-4" />}
                                        variant="glass"
                                        {...register('price')}
                                        error={errors.price?.message as string}
                                    />
                                    <Input
                                        type="number"
                                        label="SEQUÊNCIA DE EXIBIÇÃO"
                                        icon={<Hash className="w-4 h-4" />}
                                        variant="glass"
                                        {...register('order')}
                                        error={errors.order?.message as string}
                                    />
                                </div>

                                <div className="space-y-4">
                                    <Textarea
                                        label="ESPECIFICAÇÕES TÉCNICAS (LINHA A LINHA)"
                                        placeholder="EX:&#10;REVISÃO ORTOGRÁFICA&#10;DIAGRAMAÇÃO DE CAPA&#10;REGISTO DE ISBN"
                                        rows={8}
                                        variant="glass"
                                        {...register('details')}
                                        error={errors.details?.message as string}
                                        className="custom-scrollbar"
                                    />
                                </div>
                            </form>

                            <div className="p-12 border-t border-white/5 bg-white/[0.01] flex flex-col sm:flex-row gap-6">
                                <button
                                    type="button"
                                    onClick={() => setShowServiceModal(false)}
                                    className="flex-1 px-10 py-6 border border-white/10 text-gray-500 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-white/5 hover:text-white transition-all flex items-center justify-center gap-2"
                                >
                                    ABORTAR
                                </button>
                                <Button
                                    onClick={handleSubmit(onSubmit)}
                                    isLoading={isSubmitting}
                                    disabled={isSubmitting}
                                    className="flex-[1.5] py-6 px-12"
                                    leftIcon={!isSubmitting && <Save className="w-5 h-5" />}
                                >
                                    REGISTAR PROTOCOLO
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
