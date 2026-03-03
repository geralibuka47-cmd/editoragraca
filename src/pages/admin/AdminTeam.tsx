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
    const { showToast } = useToast();

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

    const handleDelete = async (id: string, name: string) => {
        if (window.confirm(`Tem a certeza que deseja remover ${name} da equipa?`)) {
            try {
                await deleteTeamMember(id);
                setMembers(prev => prev.filter(m => m.id !== id));
                showToast('Membro removido com sucesso', 'success');
            } catch (error) {
                showToast('Erro ao remover membro', 'error');
            }
        }
    };

    const filteredMembers = members.filter(m =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <span className="text-brand-primary font-bold uppercase tracking-[0.4em] text-[10px]">Quem Faz Acontecer</span>
                    <h2 className="text-4xl sm:text-5xl font-black text-brand-dark uppercase tracking-tighter leading-none mt-2">
                        Equipa
                    </h2>
                </div>
                <button className="flex items-center gap-2 px-6 py-4 bg-brand-dark text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-brand-primary transition-all shadow-xl shadow-brand-dark/20 group">
                    <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                    Adicionar Membro
                </button>
            </div>

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

            {/* Team Members Grid */}
            {loading ? (
                <div className="h-64 flex flex-col items-center justify-center gap-4 text-gray-400">
                    <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
                    <span className="text-xs font-bold uppercase tracking-widest">A carregar equipa...</span>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    <AnimatePresence mode="popLayout">
                        {filteredMembers.map((member, index) => (
                            <motion.div
                                key={member.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: index * 0.05 }}
                                className="group bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500 flex flex-col items-center text-center"
                            >
                                {/* Profile Image */}
                                <div className="w-32 h-32 rounded-[2.5rem] bg-gray-100 overflow-hidden mb-6 group-hover:scale-105 transition-transform duration-500 shadow-lg border-4 border-white">
                                    {member.imageUrl ? (
                                        <img src={member.imageUrl} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                            <User className="w-12 h-12" />
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="space-y-1 mb-6">
                                    <h3 className="text-xl font-black text-brand-dark group-hover:text-brand-primary transition-colors">
                                        {member.name}
                                    </h3>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary">
                                        {member.role}
                                    </p>
                                </div>

                                <p className="text-xs text-gray-400 font-medium leading-relaxed mb-8 line-clamp-3 px-4">
                                    {member.bio}
                                </p>

                                {/* Socials & Actions */}
                                <div className="w-full pt-8 border-t border-gray-50 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        {member.socials?.instagram && (
                                            <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-pink-500 transition-colors">
                                                <Instagram className="w-4 h-4" />
                                            </div>
                                        )}
                                        {member.socials?.linkedin && (
                                            <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-blue-600 transition-colors">
                                                <Linkedin className="w-4 h-4" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button className="p-3 bg-gray-50 hover:bg-brand-dark hover:text-white rounded-2xl transition-all" title="Editar Perfil">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(member.id, member.name)}
                                            className="p-3 bg-gray-50 hover:bg-red-500 hover:text-white rounded-2xl transition-all text-red-500"
                                            title="Remover"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {!loading && filteredMembers.length === 0 && (
                <div className="py-20 text-center">
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Nenhum membro encontrado</p>
                </div>
            )}
        </div>
    );
};

export default AdminTeam;
