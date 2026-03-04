import React, { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    Award,
    Loader2,
    ChevronRight,
    User,
    ExternalLink,
    Instagram,
    Linkedin,
    Twitter
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getTeamMembers, deleteTeamMember } from '../../services/dataService';
import { TeamMember } from '../../types';
import { useToast } from '../../components/Toast';

const AdminTeam: React.FC = () => {
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
    const { showToast } = useToast();

    // Form State
    const [formData, setFormData] = useState<Partial<TeamMember>>({
        name: '',
        role: '',
        bio: '',
        imageUrl: '',
        displayOrder: 0,
        socials: {
            instagram: '',
            linkedin: '',
            twitter: ''
        }
    });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        loadMembers();
    }, []);

    const loadMembers = async () => {
        setLoading(true);
        try {
            const data = await getTeamMembers();
            setMembers(data);
        } catch (error) {
            showToast('Erro ao carregar equipa', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (member?: TeamMember) => {
        if (member) {
            setEditingMember(member);
            setFormData({
                ...member,
                socials: member.socials || { instagram: '', linkedin: '', twitter: '' }
            });
        } else {
            setEditingMember(null);
            setFormData({
                name: '',
                role: '',
                bio: '',
                imageUrl: '',
                displayOrder: members.length + 1,
                socials: {
                    instagram: '',
                    linkedin: '',
                    twitter: ''
                }
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const memberToSave = {
                ...formData,
                id: editingMember?.id || `temp_${Date.now()}`,
                displayOrder: Number(formData.displayOrder)
            } as TeamMember;

            await saveTeamMember(memberToSave);
            showToast(editingMember ? 'Membro atualizado!' : 'Membro adicionado!', 'success');
            setIsModalOpen(false);
            loadMembers();
        } catch (error) {
            showToast('Erro ao gravar membro', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (window.confirm(`Tem a certeza que deseja eliminar "${name}" da equipa?`)) {
            try {
                await deleteTeamMember(id);
                setMembers(prev => prev.filter(m => m.id !== id));
                showToast('Membro eliminado com sucesso', 'success');
            } catch (error) {
                showToast('Erro ao eliminar membro', 'error');
            }
        }
    };

    const filteredMembers = members.filter(member =>
        (member.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (member.role?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <span className="text-brand-primary font-bold uppercase tracking-[0.4em] text-[10px]">Capital Humano</span>
                    <h2 className="text-4xl sm:text-5xl font-black text-brand-dark uppercase tracking-tighter leading-none mt-2">
                        Equipa
                    </h2>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 px-6 py-4 bg-brand-dark text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-brand-primary transition-all shadow-xl shadow-brand-dark/20 group"
                >
                    <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                    Adicionar Membro
                </button>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="fixed inset-0 bg-brand-dark/40 backdrop-blur-sm z-[100]"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="fixed inset-x-4 top-4 bottom-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-4xl bg-white rounded-[2.5rem] shadow-2xl z-[101] overflow-hidden flex flex-col"
                        >
                            <div className="p-8 border-b border-gray-50 flex items-center justify-between shrink-0">
                                <h3 className="text-2xl font-black text-brand-dark uppercase tracking-tighter">
                                    {editingMember ? 'Editar Membro' : 'Novo Membro'}
                                </h3>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all"
                                    title="Fechar"
                                >
                                    <Plus className="w-5 h-5 rotate-45" />
                                </button>
                            </div>

                            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-8 space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Left Content */}
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Nome Completo</label>
                                            <input
                                                required
                                                type="text"
                                                value={formData.name}
                                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all"
                                                placeholder="Nome do membro"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Cargo / Função</label>
                                            <input
                                                required
                                                type="text"
                                                value={formData.role}
                                                onChange={e => setFormData({ ...formData, role: e.target.value })}
                                                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all"
                                                placeholder="Diretor Editorial, etc."
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Ordem de Exibição</label>
                                            <input
                                                id="memberOrder"
                                                type="number"
                                                value={formData.displayOrder}
                                                onChange={e => setFormData({ ...formData, displayOrder: parseInt(e.target.value) })}
                                                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all"
                                                placeholder="0"
                                                title="Ordem de Exibição"
                                            />
                                        </div>
                                    </div>

                                    {/* Right Content - Photo & Socials */}
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Foto (URL)</label>
                                            <input
                                                required
                                                type="url"
                                                value={formData.imageUrl}
                                                onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                                                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all"
                                                placeholder="https://..."
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Instagram (URL)</label>
                                                <input
                                                    id="memberInstagram"
                                                    type="url"
                                                    value={formData.socials?.instagram}
                                                    onChange={e => setFormData({ ...formData, socials: { ...formData.socials!, instagram: e.target.value } })}
                                                    className="w-full px-6 py-3 bg-gray-50 border-none rounded-xl text-[10px] font-bold outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all"
                                                    placeholder="URL Instagram"
                                                    title="Instagram"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">LinkedIn (URL)</label>
                                                <input
                                                    id="memberLinkedin"
                                                    type="url"
                                                    value={formData.socials?.linkedin}
                                                    onChange={e => setFormData({ ...formData, socials: { ...formData.socials!, linkedin: e.target.value } })}
                                                    className="w-full px-6 py-3 bg-gray-50 border-none rounded-xl text-[10px] font-bold outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all"
                                                    placeholder="URL LinkedIn"
                                                    title="LinkedIn"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Biografia / Perfil Profissional</label>
                                    <textarea
                                        rows={4}
                                        value={formData.bio}
                                        onChange={e => setFormData({ ...formData, bio: e.target.value })}
                                        className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all resize-none"
                                        placeholder="Breve biografia..."
                                    />
                                </div>
                            </form>

                            <div className="p-8 border-t border-gray-50 bg-gray-50/30 flex items-center justify-end gap-4 shrink-0">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-8 py-4 bg-white text-gray-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:text-brand-dark transition-all border border-gray-100"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="px-10 py-4 bg-brand-dark text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-primary transition-all shadow-xl shadow-brand-dark/10 flex items-center gap-3 disabled:opacity-50"
                                >
                                    {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                                    {editingMember ? 'Atualizar Membro' : 'Adicionar Membro'}
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Search */}
            <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
                <div className="relative w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Pesquisar por nome ou cargo..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-brand-primary/20 transition-all outline-none"
                    />
                </div>
            </div>

            {/* Content List */}
            {loading ? (
                <div className="h-64 flex flex-col items-center justify-center gap-4 text-gray-400">
                    <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
                    <span className="text-xs font-bold uppercase tracking-widest">A carregar equipa...</span>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    <AnimatePresence mode="popLayout">
                        {filteredMembers.map((member, index) => (
                            <motion.div
                                key={member.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: index * 0.05 }}
                                className="group bg-white p-5 rounded-[2rem] border border-gray-50 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500 flex flex-col sm:flex-row items-center gap-6"
                            >
                                {/* Photo Preview */}
                                <div className="w-16 h-16 rounded-2xl bg-gray-100 overflow-hidden shadow-md shrink-0 group-hover:scale-105 transition-transform duration-500 border-2 border-white">
                                    {member.imageUrl ? (
                                        <img src={member.imageUrl} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                            <User className="w-8 h-8" />
                                        </div>
                                    )}
                                </div>

                                {/* Details */}
                                <div className="flex-1 text-center sm:text-left min-w-0">
                                    <div className="flex items-center justify-center sm:justify-start gap-3 mb-1">
                                        <h3 className="text-lg font-black text-brand-dark truncate group-hover:text-brand-primary transition-colors">
                                            {member.name}
                                        </h3>
                                        <span className="px-2 py-0.5 bg-gray-100 rounded text-[8px] font-bold text-gray-400 tabular-nums">#{member.displayOrder}</span>
                                    </div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center justify-center sm:justify-start gap-2">
                                        <Award className="w-3 h-3 text-brand-primary" />
                                        {member.role}
                                    </p>
                                </div>

                                {/* Social Links Preview */}
                                <div className="hidden lg:flex items-center gap-4 px-8 border-x border-gray-50">
                                    {member.socials?.instagram && <Instagram className="w-4 h-4 text-pink-500/40" />}
                                    {member.socials?.linkedin && <Linkedin className="w-4 h-4 text-blue-500/40" />}
                                    {member.socials?.twitter && <Twitter className="w-4 h-4 text-sky-500/40" />}
                                    {!member.socials?.instagram && !member.socials?.linkedin && !member.socials?.twitter && (
                                        <span className="text-[8px] font-black text-gray-200 uppercase tracking-widest">Sem redes sociais</span>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleOpenModal(member)}
                                        className="p-3 bg-gray-50 hover:bg-brand-dark hover:text-white rounded-2xl transition-all"
                                        title="Editar Membro"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(member.id, member.name)}
                                        className="p-3 bg-gray-50 hover:bg-red-500 hover:text-white rounded-2xl transition-all text-red-500"
                                        title="Eliminar Membro"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {!loading && filteredMembers.length === 0 && (
                        <div className="py-20 text-center">
                            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Nenhum membro encontrado</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminTeam;
