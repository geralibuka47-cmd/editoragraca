import React, { useState, useEffect } from 'react';
import { motion as m, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Loader2, Save, X, Search, User, Briefcase, Tag, Hash, Image as ImageIcon, FileText } from 'lucide-react';
import { useToast } from '../Toast';

const AdminTeamTab: React.FC = () => {
    const { showToast } = useToast();
    const [teamMembers, setTeamMembers] = useState<any[]>([]);
    const [filteredMembers, setFilteredMembers] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoadingTeam, setIsLoadingTeam] = useState(true);
    const [showTeamModal, setShowTeamModal] = useState(false);
    const [teamForm, setTeamForm] = useState<any>({ name: '', role: '', department: '', bio: '', photoUrl: '', displayOrder: 0 });
    const [isSavingTeam, setIsSavingTeam] = useState(false);
    const [teamErrors, setTeamErrors] = useState<Record<string, string>>({});

    const fetchTeamMembers = async () => {
        setIsLoadingTeam(true);
        try {
            const { getTeamMembers } = await import('../../services/dataService');
            const data = await getTeamMembers();
            setTeamMembers(data);
            setFilteredMembers(data);
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

    const handleSaveTeam = async (e: React.FormEvent) => {
        e.preventDefault();
        setTeamErrors({});

        if (!teamForm.name.trim() || !teamForm.role.trim()) {
            setTeamErrors({ form: 'Nome e Cargo são obrigatórios' });
            return;
        }

        setIsSavingTeam(true);
        try {
            const { saveTeamMember } = await import('../../services/dataService');

            const sanitizedMember = {
                ...teamForm,
                name: teamForm.name.trim(),
                role: teamForm.role.trim(),
                department: teamForm.department.trim(),
                bio: teamForm.bio.trim(),
                photoUrl: teamForm.photoUrl.trim()
            };

            await saveTeamMember(sanitizedMember);
            setShowTeamModal(false);
            setTeamErrors({});
            fetchTeamMembers();
            showToast('Membro da equipa salvo com sucesso!', 'success');
        } catch (error: any) {
            console.error('Erro ao salvar membro:', error);
            setTeamErrors({ form: error.message || 'Erro ao salvar membro. Verifique os dados e tente novamente.' });
            showToast('Erro ao salvar membro da equipa.', 'error');
        } finally {
            setIsSavingTeam(false);
        }
    };

    const handleDeleteTeam = async (id: string) => {
        if (!confirm('Eliminar este membro?')) return;
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
        <div className="space-y-10">
            <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-8">
                <div>
                    <h2 className="text-4xl font-black text-brand-dark tracking-tighter uppercase mb-2">Engrenagem <span className="text-brand-primary lowercase italic font-light">Humana</span></h2>
                    <p className="text-gray-400 font-bold text-sm">Gestão dos talentos que movem a Editora Graça.</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
                    <div className="relative group w-full sm:w-80">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-brand-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="Pesquisar membros..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-6 py-4 bg-gray-50 border-2 border-transparent focus:border-brand-primary/20 focus:bg-white rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest outline-none transition-all shadow-sm"
                        />
                    </div>

                    <m.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                            setTeamForm({ name: '', role: '', department: '', bio: '', photoUrl: '', displayOrder: 0 });
                            setShowTeamModal(true);
                        }}
                        className="btn-premium py-4 px-8 text-[10px] w-full sm:w-auto shadow-xl shadow-brand-primary/20"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        <span>Novo Membro</span>
                    </m.button>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-brand-dark/5 border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px]">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Membro / Perfil</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Cargo</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Departamento</th>
                                <th className="px-8 py-6 text-right text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Ordem</th>
                                <th className="px-8 py-6 text-center text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            <AnimatePresence mode="popLayout">
                                {isLoadingTeam ? (
                                    [1, 2, 3].map(i => (
                                        <tr key={i} className="animate-pulse">
                                            <td colSpan={5} className="px-8 py-6">
                                                <div className="h-4 bg-gray-100 rounded-full w-full"></div>
                                            </td>
                                        </tr>
                                    ))
                                ) : filteredMembers.length > 0 ? (
                                    filteredMembers.map((member) => (
                                        <m.tr
                                            key={member.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="hover:bg-gray-50/50 transition-colors group text-sm"
                                        >
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl overflow-hidden bg-gray-100 border border-gray-100 flex-shrink-0 group-hover:scale-11 transition-transform">
                                                        {member.photoUrl ? (
                                                            <img src={member.photoUrl} alt={member.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                                <User className="w-6 h-6" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <span className="font-black text-brand-dark tracking-tight">{member.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="text-gray-500 font-bold">{member.role}</span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="px-3 py-1 bg-brand-primary/5 text-brand-primary rounded-lg text-[9px] font-black uppercase tracking-widest">{member.department}</span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <span className="text-[10px] font-black text-gray-400">#{member.displayOrder || 0}</span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center justify-center gap-3">
                                                    <m.button
                                                        whileHover={{ scale: 1.1, y: -2 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => {
                                                            setTeamForm(member);
                                                            setShowTeamModal(true);
                                                        }}
                                                        className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white flex items-center justify-center transition-all shadow-sm"
                                                        title="Editar membro"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </m.button>
                                                    <m.button
                                                        whileHover={{ scale: 1.1, y: -2 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => handleDeleteTeam(member.id)}
                                                        className="w-10 h-10 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white flex items-center justify-center transition-all shadow-sm"
                                                        title="Eliminar membro"
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
                                                <p className="font-black uppercase tracking-[0.3em] text-[10px]">Nenhum colaborador encontrado.</p>
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
                                    <h3 className="text-3xl font-black text-brand-dark tracking-tighter uppercase mb-1">{teamForm.id ? 'Editar Perfil' : 'Novo Perfil'}</h3>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-brand-primary">Configuração de colaborador</p>
                                </div>
                                <m.button
                                    whileHover={{ rotate: 90, scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setShowTeamModal(false)}
                                    className="w-12 h-12 flex items-center justify-center bg-gray-50 text-gray-400 hover:text-brand-dark rounded-full transition-all"
                                    title="Fechar"
                                >
                                    <X className="w-6 h-6" />
                                </m.button>
                            </div>

                            <form onSubmit={handleSaveTeam} className="flex-1 overflow-y-auto p-10 space-y-8">
                                {teamErrors.form && (
                                    <div className="p-6 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-4 text-red-600 text-xs font-black uppercase tracking-widest">
                                        <X className="w-4 h-4" />
                                        {teamErrors.form}
                                    </div>
                                )}

                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label htmlFor="team-name" className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Nome Completo</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                            <input
                                                id="team-name"
                                                type="text"
                                                required
                                                value={teamForm.name}
                                                onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
                                                className="w-full pl-12 pr-6 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-brand-primary/20 focus:bg-white outline-none transition-all font-bold"
                                                placeholder="Ex: João Mendonça"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="team-role" className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Cargo / Título</label>
                                        <div className="relative">
                                            <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                            <input
                                                id="team-role"
                                                type="text"
                                                required
                                                value={teamForm.role}
                                                onChange={(e) => setTeamForm({ ...teamForm, role: e.target.value })}
                                                className="w-full pl-12 pr-6 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-brand-primary/20 focus:bg-white outline-none transition-all font-bold"
                                                placeholder="Ex: Editor Executivo"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label htmlFor="team-department" className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Departamento</label>
                                        <div className="relative">
                                            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                            <input
                                                id="team-department"
                                                type="text"
                                                required
                                                value={teamForm.department}
                                                onChange={(e) => setTeamForm({ ...teamForm, department: e.target.value })}
                                                className="w-full pl-12 pr-6 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-brand-primary/20 focus:bg-white outline-none transition-all font-bold"
                                                placeholder="Ex: Editorial"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="team-order" className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Ordem de Exibição</label>
                                        <div className="relative">
                                            <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                            <input
                                                id="team-order"
                                                type="number"
                                                required
                                                value={teamForm.displayOrder || 0}
                                                onChange={(e) => setTeamForm({ ...teamForm, displayOrder: parseInt(e.target.value) })}
                                                className="w-full pl-12 pr-6 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-brand-primary/20 focus:bg-white outline-none transition-all font-bold"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="team-photo" className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">URL da Foto de Perfil</label>
                                    <div className="relative">
                                        <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                        <input
                                            id="team-photo"
                                            type="url"
                                            required
                                            value={teamForm.photoUrl}
                                            onChange={(e) => setTeamForm({ ...teamForm, photoUrl: e.target.value })}
                                            className="w-full pl-12 pr-6 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-brand-primary/20 focus:bg-white outline-none transition-all text-xs font-bold"
                                            placeholder="https://images.unsplash.com/..."
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="team-bio" className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Biografia / Pequeno Resumo</label>
                                    <div className="relative">
                                        <FileText className="absolute left-4 top-6 w-4 h-4 text-gray-300" />
                                        <textarea
                                            id="team-bio"
                                            required
                                            value={teamForm.bio}
                                            onChange={(e) => setTeamForm({ ...teamForm, bio: e.target.value })}
                                            className="w-full pl-12 pr-6 py-6 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-brand-primary/20 focus:bg-white outline-none transition-all h-32 resize-none font-medium text-gray-600"
                                            placeholder="Fale um pouco sobre a trajetória deste membro..."
                                        />
                                    </div>
                                </div>
                            </form>

                            <div className="p-10 border-t border-gray-100 bg-gray-50/50 flex gap-6">
                                <button
                                    type="button"
                                    onClick={() => setShowTeamModal(false)}
                                    className="flex-1 px-8 py-5 border-2 border-gray-100 text-gray-400 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest hover:border-gray-200 hover:text-brand-dark transition-all flex items-center justify-center gap-2"
                                >
                                    Cancelar
                                </button>
                                <m.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleSaveTeam}
                                    disabled={isSavingTeam}
                                    className="flex-2 btn-premium py-5 px-12 text-[10px] shadow-xl shadow-brand-primary/20"
                                >
                                    {isSavingTeam ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4 mr-2" />
                                            <span>Salvar Alterações</span>
                                        </>
                                    )}
                                </m.button>
                            </div>
                        </m.div>
                    </div>
                )}
            </AnimatePresence>
        </div >
    );
};

export default AdminTeamTab;
