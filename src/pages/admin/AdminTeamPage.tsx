import React, { useState, useEffect } from 'react';
import { motion as m, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Search, User, Briefcase, Image as ImageIcon, Save, X, Loader2, Shield, Crosshair, Tag, Hash } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '../../components/Toast';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';

// Validation Schema
const teamSchema = z.object({
    name: z.string().min(2, 'Nome é obrigatório'),
    role: z.string().min(2, 'Cargo é obrigatório'),
    department: z.string().min(2, 'Departamento é obrigatório'),
    bio: z.string().min(10, 'A biografia deve ser detalhada'),
    photoUrl: z.string().url('URL da foto inválida').or(z.string().length(0)), // Allow empty string or valid URL
    displayOrder: z.coerce.number().min(0, 'Ordem inválida'),
});

type TeamFormData = z.infer<typeof teamSchema>;

const AdminTeamPage: React.FC = () => {
    const { showToast } = useToast();
    const [teamMembers, setTeamMembers] = useState<any[]>([]);
    const [filteredMembers, setFilteredMembers] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoadingTeam, setIsLoadingTeam] = useState(true);
    const [showTeamModal, setShowTeamModal] = useState(false);
    const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<any>({
        resolver: zodResolver(teamSchema),
        defaultValues: {
            name: '',
            role: '',
            department: '',
            bio: '',
            photoUrl: '',
            displayOrder: 0,
        },
    });

    const fetchTeamMembers = async () => {
        setIsLoadingTeam(true);
        try {
            const { getTeamMembers } = await import('../../services/dataService');
            const data = await getTeamMembers();
            setTeamMembers(data);
            setFilteredMembers(data || []);
        } catch (error) {
            console.error('Erro ao buscar membros da equipa:', error);
            showToast('Erro ao carregar membros da equipa.', 'error');
        } finally {
            setIsLoadingTeam(false);
        }
    };

    useEffect(() => {
        fetchTeamMembers();
    }, []);

    useEffect(() => {
        const query = searchQuery.toLowerCase();
        setFilteredMembers(
            teamMembers.filter(m_item =>
                m_item.name?.toLowerCase().includes(query) ||
                m_item.role?.toLowerCase().includes(query) ||
                m_item.department?.toLowerCase().includes(query)
            )
        );
    }, [searchQuery, teamMembers]);

    const handleEdit = (member: any) => {
        setSelectedMemberId(member.id);
        reset({
            name: member.name,
            role: member.role,
            department: member.department,
            bio: member.bio,
            photoUrl: member.photoUrl,
            displayOrder: member.displayOrder,
        });
        setShowTeamModal(true);
    };

    const handleCreate = () => {
        setSelectedMemberId(null);
        reset({
            name: '',
            role: '',
            department: '',
            bio: '',
            photoUrl: '',
            displayOrder: 0,
        });
        setShowTeamModal(true);
    };

    const onSubmit = async (data: TeamFormData) => {
        try {
            const { saveTeamMember } = await import('../../services/dataService');

            const sanitizedMember = {
                ...data,
                id: selectedMemberId || undefined, // Pass ID if editing
                name: data.name.trim(),
                role: data.role.trim(),
                department: data.department.trim(),
                bio: data.bio.trim(),
                photoUrl: data.photoUrl?.trim() || ''
            };

            await saveTeamMember(sanitizedMember);
            setShowTeamModal(false);
            fetchTeamMembers();
            showToast('Membro da equipa salvo com sucesso!', 'success');
        } catch (error: any) {
            console.error('Erro ao salvar membro:', error);
            showToast('Erro ao salvar membro da equipa.', 'error');
        }
    };

    const handleDeleteTeam = async (id: string) => {
        if (!confirm('Eliminar este membro do directório de missões?')) return;
        try {
            const { deleteTeamMember } = await import('../../services/dataService');
            await deleteTeamMember(id);
            fetchTeamMembers();
            showToast('Membro da equipa eliminado com sucesso!', 'success');
        } catch (error) {
            console.error('Erro ao eliminar membro:', error);
            showToast('Erro ao eliminar membro da equipa.', 'error');
        }
    };

    return (
        <div className="space-y-6">
            <AdminPageHeader title="Equipa" subtitle="Directório de colaboradores" highlight="Gestão">
                <Input placeholder="Pesquisar..." variant="light" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full sm:w-64" />
                <button onClick={handleCreate} className="bg-brand-primary text-white font-semibold text-sm px-5 py-2 rounded-lg flex items-center gap-2 hover:bg-brand-dark transition-colors min-h-[40px]">
                    <Plus className="w-4 h-4" /> Novo Membro
                </button>
            </AdminPageHeader>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[720px] border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Membro</th>
                                <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Função</th>
                                <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Departamento</th>
                                <th className="px-4 sm:px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Ordem</th>
                                <th className="px-4 sm:px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            <AnimatePresence mode="popLayout">
                                {isLoadingTeam ? (
                                    [1, 2, 3, 4, 5].map(i => (
                                        <tr key={i} className="animate-pulse">
                                            <td colSpan={5} className="px-4 sm:px-6 py-4">
                                                <div className="h-6 bg-gray-100 rounded-full w-full"></div>
                                            </td>
                                        </tr>
                                    ))
                                ) : filteredMembers.length > 0 ? (
                                    filteredMembers.map((member) => (
                                        <m.tr
                                            key={member.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 10 }}
                                            className="hover:bg-gray-50 transition-colors group"
                                        >
                                            <td className="px-4 sm:px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0 relative">
                                                        {member.photoUrl ? (
                                                            <img src={member.photoUrl} alt={member.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                                <User className="w-6 h-6" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <span className="block font-semibold text-gray-900 text-sm tracking-tight">{member.name}</span>
                                                        <span className="block text-[10px] text-gray-500 font-medium tracking-wide italic">Colaborador Ativo</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 sm:px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-gray-900 font-semibold text-xs tracking-tight">{member.role}</span>
                                                    <span className="text-[10px] text-gray-500 font-medium">Equipa Editorial</span>
                                                </div>
                                            </td>
                                            <td className="px-4 sm:px-6 py-4">
                                                <span className="px-2.5 py-1 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary rounded text-[10px] font-bold uppercase tracking-wider">
                                                    {member.department}
                                                </span>
                                            </td>
                                            <td className="px-4 sm:px-6 py-4 text-right">
                                                <div className="inline-flex items-center gap-1.5 text-xs text-gray-500">
                                                    <Hash className="w-3 h-3 text-brand-primary" />
                                                    <span>{member.displayOrder || 0}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 sm:px-6 py-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => handleEdit(member)}
                                                        className="p-2 text-gray-400 hover:text-brand-primary hover:bg-brand-primary/10 rounded-md transition-colors"
                                                        title="Editar"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteTeam(member.id)}
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
                                                <Shield className="w-12 h-12" />
                                                <p className="font-semibold text-sm">Nenhum membro registado</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Team Modal */}
            <AnimatePresence>
                {showTeamModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <m.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowTeamModal(false)}
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
                                            {selectedMemberId ? 'Editar Perfil' : 'Novo Membro'}
                                        </h3>
                                        <p className="text-xs text-gray-500">Configuração de colaborador editorial</p>
                                    </div>
                                    <button
                                        onClick={() => setShowTeamModal(false)}
                                        className="p-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
                                        title="Fechar"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-8 space-y-6">

                                <div className="grid md:grid-cols-2 gap-6">
                                    <Input
                                        label="Nome do Colaborador"
                                        placeholder="Ex: João Silva"
                                        icon={<User className="w-4 h-4" />}
                                        {...register('name')}
                                        error={errors.name?.message as string}
                                        className="rounded-lg"
                                    />
                                    <Input
                                        label="Função / Cargo"
                                        placeholder="Ex: Editor Chefe"
                                        icon={<Tag className="w-4 h-4" />}
                                        {...register('role')}
                                        error={errors.role?.message as string}
                                        className="rounded-lg"
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <Input
                                        label="Departamento"
                                        placeholder="Ex: Editorial"
                                        icon={<Briefcase className="w-4 h-4" />}
                                        {...register('department')}
                                        error={errors.department?.message as string}
                                        className="rounded-lg"
                                    />
                                    <Input
                                        type="number"
                                        label="Ordem de Exibição"
                                        icon={<Hash className="w-4 h-4" />}
                                        {...register('displayOrder')}
                                        error={errors.displayOrder?.message as string}
                                        className="rounded-lg"
                                    />
                                </div>

                                <Input
                                    label="Foto (URL)"
                                    placeholder="https://..."
                                    icon={<ImageIcon className="w-4 h-4" />}
                                    {...register('photoUrl')}
                                    error={errors.photoUrl?.message as string}
                                    className="rounded-lg"
                                />

                                <div className="space-y-4">
                                    <Textarea
                                        label="Biografia"
                                        placeholder="Descreva a trajectória e impacto do colaborador..."
                                        rows={4}
                                        {...register('bio')}
                                        error={errors.bio?.message as string}
                                        className="rounded-lg"
                                    />
                                </div>
                            </form>

                            <div className="p-8 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowTeamModal(false)}
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
                                    Gravar Perfil
                                </Button>
                            </div>
                        </m.div>
                    </div>
                )}
            </AnimatePresence>
        </div >
    );
};

export default AdminTeamPage;
