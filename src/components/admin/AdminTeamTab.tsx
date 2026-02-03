import React, { useState, useEffect } from 'react';
import { motion as m, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Search, User, Briefcase, Tag, Hash, Image as ImageIcon, FileText, Shield, Crosshair, Save, X, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '../Toast';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';

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

const AdminTeamTab: React.FC = () => {
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
    } = useForm<TeamFormData>({
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
                id: selectedMemberId, // Pass ID if editing
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
        <div className="space-y-12">
            {/* Header Section */}
            <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-8">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-8 bg-brand-primary rounded-full shadow-[0_0_15px_rgba(189,147,56,0.5)]" />
                        <h2 className="text-3xl font-black text-white tracking-tighter uppercase mb-0">Comando de <span className="text-brand-primary italic font-light lowercase">Elite</span></h2>
                    </div>
                    <p className="text-gray-500 font-bold text-xs uppercase tracking-widest pl-4 italic">Directório de Operadores e Especialistas</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6 w-full xl:w-auto">
                    <div className="relative group w-full sm:w-80">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-brand-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="PESQUISAR OPERADOR..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-14 pr-8 py-5 bg-white/5 border border-white/5 focus:border-brand-primary/20 focus:bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-white outline-none transition-all shadow-2xl"
                        />
                    </div>

                    <m.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleCreate}
                        className="w-full sm:w-auto px-10 py-5 bg-brand-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-[0_15px_40px_-10px_rgba(189,147,56,0.3)] hover:brightness-110 transition-all flex items-center justify-center gap-4"
                    >
                        <Plus className="w-5 h-5" />
                        <span>RECRUTAR COLABORADOR</span>
                    </m.button>
                </div>
            </div>

            {/* Table Container */}
            <div className="bg-white/5 rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-primary/20 to-transparent" />

                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full min-w-[1000px] border-collapse">
                        <thead>
                            <tr className="bg-white/[0.02]">
                                <th className="px-10 py-8 text-left text-[9px] font-black text-gray-500 uppercase tracking-[0.4em]">Identificação / Perfil</th>
                                <th className="px-10 py-8 text-left text-[9px] font-black text-gray-500 uppercase tracking-[0.4em]">Função Estratégica</th>
                                <th className="px-10 py-8 text-left text-[9px] font-black text-gray-500 uppercase tracking-[0.4em]">Sectores</th>
                                <th className="px-10 py-8 text-right text-[9px] font-black text-gray-500 uppercase tracking-[0.4em]">Hierarquia</th>
                                <th className="px-10 py-8 text-center text-[9px] font-black text-gray-500 uppercase tracking-[0.4em]">Acções de Comando</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            <AnimatePresence mode="popLayout">
                                {isLoadingTeam ? (
                                    [1, 2, 3, 4, 5].map(i => (
                                        <tr key={i} className="animate-pulse">
                                            <td colSpan={5} className="px-10 py-8">
                                                <div className="h-6 bg-white/5 rounded-full w-full"></div>
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
                                            className="hover:bg-white/[0.03] transition-colors group"
                                        >
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-6">
                                                    <div className="w-16 h-16 rounded-[1.5rem] overflow-hidden bg-white/5 border border-white/10 flex-shrink-0 group-hover:border-brand-primary/40 transition-all duration-500 relative">
                                                        {member.photoUrl ? (
                                                            <>
                                                                <img src={member.photoUrl} alt={member.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                                                                <div className="absolute inset-0 bg-brand-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                            </>
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-gray-700">
                                                                <User className="w-8 h-8" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="space-y-1">
                                                        <span className="block font-black text-white text-base tracking-tighter uppercase group-hover:text-brand-primary transition-colors">{member.name}</span>
                                                        <span className="block text-[8px] font-bold text-gray-600 uppercase tracking-[0.3em]">Status: Active Operator</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="flex flex-col">
                                                    <span className="text-gray-300 font-black text-[11px] uppercase tracking-widest">{member.role}</span>
                                                    <span className="text-[9px] text-gray-600 font-bold uppercase">Technical Specialist</span>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <span className="px-4 py-2 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary rounded-lg text-[9px] font-black uppercase tracking-[0.2em] shadow-lg shadow-brand-primary/5">
                                                    {member.department}
                                                </span>
                                            </td>
                                            <td className="px-10 py-8 text-right">
                                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5">
                                                    <div className="w-1 h-1 rounded-full bg-brand-primary" />
                                                    <span className="text-[10px] font-black text-gray-400">LEV. {member.displayOrder || 0}</span>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="flex items-center justify-center gap-4">
                                                    <m.button
                                                        whileHover={{ scale: 1.1, rotate: -5 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => handleEdit(member)}
                                                        className="w-12 h-12 bg-white/5 border border-white/5 text-gray-400 rounded-2xl hover:bg-white/10 hover:text-white flex items-center justify-center transition-all shadow-xl group/edit"
                                                        title="Editar Operador"
                                                    >
                                                        <Edit className="w-5 h-5 transition-transform group-hover/edit:scale-110" />
                                                    </m.button>
                                                    <m.button
                                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => handleDeleteTeam(member.id)}
                                                        className="w-12 h-12 bg-red-500/5 border border-red-500/10 text-red-500/50 rounded-2xl hover:bg-red-500 hover:text-white flex items-center justify-center transition-all shadow-xl group/delete"
                                                        title="Revogar Acesso"
                                                    >
                                                        <Trash2 className="w-5 h-5 transition-transform group-hover/delete:scale-110" />
                                                    </m.button>
                                                </div>
                                            </td>
                                        </m.tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-10 py-40 text-center">
                                            <div className="flex flex-col items-center gap-8 opacity-10 grayscale">
                                                <Shield className="w-24 h-24 text-brand-primary" />
                                                <p className="font-black uppercase tracking-[0.5em] text-[11px]">Nenhum Operador Detectado no Perímetro.</p>
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
                            initial={{ opacity: 0, scale: 0.95, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 30 }}
                            className="bg-[#0D0D0D] rounded-[4rem] w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] relative z-20 border border-white/10 flex flex-col"
                        >
                            <div className="p-12 border-b border-white/5 relative bg-gradient-to-b from-white/[0.02] to-transparent">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-primary to-transparent" />
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-4xl font-black text-white tracking-tighter uppercase mb-2">{selectedMemberId ? 'Refinar Perfil' : 'Integrar Operador'}</h3>
                                        <div className="flex items-center gap-3">
                                            <Crosshair className="w-4 h-4 text-brand-primary" />
                                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Configuração de Payload de Equipa</p>
                                        </div>
                                    </div>
                                    <m.button
                                        whileHover={{ rotate: 90, scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => setShowTeamModal(false)}
                                        className="w-14 h-14 flex items-center justify-center bg-white/5 border border-white/5 text-gray-500 hover:text-white rounded-2xl transition-all"
                                        title="Fechar Terminal"
                                        aria-label="Fechar Terminal"
                                    >
                                        <X className="w-6 h-6" />
                                    </m.button>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-12 space-y-10 custom-scrollbar">

                                <div className="grid md:grid-cols-2 gap-10">
                                    <Input
                                        label="NOME CODIFICADO"
                                        placeholder="OPERADOR ALFA"
                                        icon={<User className="w-4 h-4" />}
                                        {...register('name')}
                                        error={errors.name?.message}
                                        className="bg-white/5 border-white/5 focus:bg-white/10 text-white placeholder:text-gray-800"
                                    />
                                    <Input
                                        label="ESPECIALIZAÇÃO"
                                        placeholder="ESTRATEGISTA"
                                        icon={<Tag className="w-4 h-4" />}
                                        {...register('role')}
                                        error={errors.role?.message}
                                        className="bg-white/5 border-white/5 focus:bg-white/10 text-white placeholder:text-gray-800"
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-10">
                                    <Input
                                        label="SECTOR DE ATUAÇÃO"
                                        placeholder="NÚCLEO CENTRAL"
                                        icon={<Briefcase className="w-4 h-4" />}
                                        {...register('department')}
                                        error={errors.department?.message}
                                        className="bg-white/5 border-white/5 focus:bg-white/10 text-white placeholder:text-gray-800"
                                    />
                                    <Input
                                        type="number"
                                        label="NÍVEL DE ACESSO"
                                        icon={<Hash className="w-4 h-4" />}
                                        {...register('displayOrder')}
                                        error={errors.displayOrder?.message}
                                        className="bg-white/5 border-white/5 focus:bg-white/10 text-white placeholder:text-gray-800"
                                    />
                                </div>

                                <Input
                                    label="BIOMETRIC ASSET (FOTO URL)"
                                    placeholder="HTTPS://..."
                                    icon={<ImageIcon className="w-4 h-4" />}
                                    {...register('photoUrl')}
                                    error={errors.photoUrl?.message}
                                    className="bg-white/5 border-white/5 focus:bg-white/10 text-white placeholder:text-gray-800"
                                />

                                <Textarea
                                    label="DOSSIER TÉCNICO (BIO)"
                                    placeholder="REGISTO DE TRAJECTÓRIA E IMPACTO..."
                                    rows={5}
                                    {...register('bio')}
                                    error={errors.bio?.message}
                                    className="bg-white/5 border-white/5 focus:bg-white/10 text-white placeholder:text-gray-800"
                                />
                            </form>

                            <div className="p-12 border-t border-white/5 bg-white/[0.01] flex flex-col sm:flex-row gap-6">
                                <button
                                    type="button"
                                    onClick={() => setShowTeamModal(false)}
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
                                    EFECTUAR REGISTO
                                </Button>
                            </div>
                        </m.div>
                    </div>
                )}
            </AnimatePresence>
        </div >
    );
};

export default AdminTeamTab;
