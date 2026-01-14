import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Loader2, Save, X } from 'lucide-react';

const AdminTeamTab: React.FC = () => {
    const [teamMembers, setTeamMembers] = useState<any[]>([]);
    const [isLoadingTeam, setIsLoadingTeam] = useState(true);
    const [showTeamModal, setShowTeamModal] = useState(false);
    const [teamForm, setTeamForm] = useState<any>({ name: '', role: '', department: '', bio: '', photoUrl: '', order: 0 });
    const [isSavingTeam, setIsSavingTeam] = useState(false);
    const [teamErrors, setTeamErrors] = useState<Record<string, string>>({});

    const fetchTeamMembers = async () => {
        setIsLoadingTeam(true);
        try {
            const { getTeamMembers } = await import('../../services/dataService');
            const data = await getTeamMembers();
            setTeamMembers(data);
        } catch (error) {
            console.error('Erro ao buscar membros da equipa:', error);
        } finally {
            setIsLoadingTeam(false);
        }
    };

    useEffect(() => {
        fetchTeamMembers();
    }, []);

    const handleSaveTeam = async (e: React.FormEvent) => {
        e.preventDefault();
        setTeamErrors({});

        // Basic validation
        if (!teamForm.name.trim() || !teamForm.role.trim()) {
            setTeamErrors({ form: 'Nome e Cargo são obrigatórios' });
            return;
        }

        setIsSavingTeam(true);
        try {
            const { saveTeamMember } = await import('../../services/dataService');

            // Sanitize
            const sanitizedMember = {
                ...teamForm,
                name: teamForm.name.trim(),
                role: teamForm.role.trim(),
                department: teamForm.department.trim(),
                bio: teamForm.bio.trim(),
                photoUrl: teamForm.photoUrl.trim()
            };

            await saveTeamMember(sanitizedMember);
            alert('Membro guardado com sucesso!');
            setShowTeamModal(false);
            setTeamErrors({});
            fetchTeamMembers();
        } catch (error: any) {
            console.error('Erro ao salvar membro:', error);
            setTeamErrors({ form: error.message || 'Erro ao salvar membro. Verifique os dados e tente novamente.' });
        } finally {
            setIsSavingTeam(false);
        }
    };

    const handleDeleteTeam = async (id: string) => {
        if (!confirm('Eliminar este membro?')) return;
        try {
            const { deleteTeamMember } = await import('../../services/dataService');
            await deleteTeamMember(id);
            alert('Membro eliminado.');
            fetchTeamMembers();
        } catch (error) {
            console.error('Erro ao eliminar membro:', error);
            alert('Erro ao eliminar membro.');
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl md:text-3xl font-black text-brand-dark">Gestão da Equipa</h2>
                <button
                    onClick={() => {
                        setTeamForm({ name: '', role: '', department: '', bio: '', photoUrl: '', order: 0 });
                        setShowTeamModal(true);
                    }}
                    title="Adicionar novo membro"
                    aria-label="Adicionar novo membro"
                    className="btn-premium py-3 px-6 text-sm"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Membro
                </button>
            </div>
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden overflow-x-auto">
                <table className="w-full min-w-[800px]">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-brand-dark uppercase tracking-wider">Nome</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-brand-dark uppercase tracking-wider">Cargo</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-brand-dark uppercase tracking-wider">Departamento</th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-brand-dark uppercase tracking-wider">Ordem</th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-brand-dark uppercase tracking-wider">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {isLoadingTeam ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500 italic">Carregando equipa...</td>
                            </tr>
                        ) : teamMembers.length > 0 ? (
                            teamMembers.map((member) => (
                                <tr key={member.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-bold text-brand-dark">{member.name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{member.role}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{member.department}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600 text-right">{member.order}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => {
                                                    setTeamForm(member);
                                                    setShowTeamModal(true);
                                                }}
                                                title="Editar membro"
                                                aria-label="Editar membro"
                                                className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 flex items-center justify-center transition-all"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteTeam(member.id)}
                                                title="Eliminar membro"
                                                aria-label="Eliminar membro"
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
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500 italic">Nenhum membro encontrado.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Team Modal */}
            {showTeamModal && (
                <div className="fixed inset-0 bg-brand-dark/90 backdrop-blur-sm z-50 flex items-center justify-center p-8">
                    <div className="bg-white rounded-[32px] w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-fade-in">
                        <div className="p-8 border-b border-gray-100 bg-gray-50">
                            <h2 className="text-2xl font-black text-brand-dark">{teamForm.id ? 'Editar Membro' : 'Novo Membro'}</h2>
                        </div>
                        <form onSubmit={handleSaveTeam} className="flex-1 overflow-y-auto p-8 space-y-6">
                            {teamErrors.form && (
                                <div className="p-4 bg-red-50 border border-red-200 rounded-xl mb-6 flex items-center gap-2 text-red-600 text-sm font-bold">
                                    <X className="w-5 h-5" />
                                    {teamErrors.form}
                                </div>
                            )}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="form-group-premium">
                                    <label htmlFor="team-name" className="label-premium">Nome</label>
                                    <input
                                        id="team-name"
                                        type="text"
                                        required
                                        value={teamForm.name}
                                        onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
                                        className="input-premium"
                                        placeholder="Nome do Membro"
                                        title="Nome do Membro"
                                    />
                                </div>
                                <div className="form-group-premium">
                                    <label htmlFor="team-role" className="label-premium">Cargo</label>
                                    <input
                                        id="team-role"
                                        type="text"
                                        required
                                        value={teamForm.role}
                                        onChange={(e) => setTeamForm({ ...teamForm, role: e.target.value })}
                                        className="input-premium"
                                        placeholder="Cargo do Membro"
                                        title="Cargo do Membro"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="form-group-premium">
                                    <label htmlFor="team-department" className="label-premium">Departamento</label>
                                    <input
                                        id="team-department"
                                        type="text"
                                        required
                                        value={teamForm.department}
                                        onChange={(e) => setTeamForm({ ...teamForm, department: e.target.value })}
                                        className="input-premium"
                                        placeholder="Departamento"
                                        title="Departamento"
                                    />
                                </div>
                                <div className="form-group-premium">
                                    <label htmlFor="team-order" className="label-premium">Ordem</label>
                                    <input
                                        id="team-order"
                                        type="number"
                                        required
                                        value={teamForm.order}
                                        onChange={(e) => setTeamForm({ ...teamForm, order: parseInt(e.target.value) })}
                                        className="input-premium"
                                        placeholder="Ordem de Exibição"
                                        title="Ordem de Exibição"
                                    />
                                </div>
                            </div>
                            <div className="form-group-premium">
                                <label htmlFor="team-photo" className="label-premium">URL da Foto</label>
                                <input
                                    id="team-photo"
                                    type="url"
                                    required
                                    value={teamForm.photoUrl}
                                    onChange={(e) => setTeamForm({ ...teamForm, photoUrl: e.target.value })}
                                    className="input-premium"
                                    placeholder="https://..."
                                    title="URL da Foto"
                                />
                            </div>
                            <div className="form-group-premium">
                                <label htmlFor="team-bio" className="label-premium">Bio</label>
                                <textarea
                                    id="team-bio"
                                    required
                                    value={teamForm.bio}
                                    onChange={(e) => setTeamForm({ ...teamForm, bio: e.target.value })}
                                    className="input-premium h-32 resize-none"
                                    placeholder="Biografia do Membro"
                                    title="Biografia do Membro"
                                />
                            </div>
                        </form>
                        <div className="p-8 border-t border-gray-100 flex gap-4 bg-gray-50/50">
                            <button
                                type="button"
                                onClick={() => setShowTeamModal(false)}
                                className="flex-1 px-8 py-4 border-2 border-brand-dark text-brand-dark rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-brand-dark hover:text-white transition-all flex items-center justify-center gap-2"
                            >
                                <X className="w-4 h-4" />
                                Cancelar
                            </button>
                            <button
                                onClick={handleSaveTeam}
                                disabled={isSavingTeam}
                                className="flex-1 btn-premium py-4"
                            >
                                {isSavingTeam ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Salvando...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        <span>Salvar Membro</span>
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

export default AdminTeamTab;
