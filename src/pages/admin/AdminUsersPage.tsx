import React, { useState, useEffect } from 'react';
import { motion as m, AnimatePresence } from 'framer-motion';
import { User as UserIcon, Shield, PenTool, Search, Mail, Calendar, ArrowUpCircle, ArrowDownCircle, Edit } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { UserRole } from '../../types';
import { useToast } from '../../components/Toast';
import { updateUserRole } from '../../services/dataService';

const AdminUsersPage: React.FC = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoadingUsers, setIsLoadingUsers] = useState(true);

    const fetchUsers = async () => {
        setIsLoadingUsers(true);
        try {
            const { getAllUsers } = await import('../../services/dataService');
            const data = await getAllUsers();
            setUsers(data);
            setFilteredUsers(data);
        } catch (error) {
            console.error('Erro ao buscar utilizadores:', error);
        } finally {
            setIsLoadingUsers(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const { showToast } = useToast();

    const handleUpdateRole = async (userId: string, currentRole: string, action: 'promote' | 'demote') => {
        let newRole: UserRole = 'leitor';

        if (action === 'promote') {
            if (currentRole === 'leitor') newRole = 'autor';
            else if (currentRole === 'autor' || currentRole === 'autor') newRole = 'adm';
            else return; // Already admin
        } else {
            if (currentRole === 'adm' || currentRole === 'admin') newRole = 'autor';
            else if (currentRole === 'autor') newRole = 'leitor';
            else return; // Already reader
        }

        if (!window.confirm(`Tem certeza que deseja ${action === 'promote' ? 'promover' : 'despromover'} este utilizador para ${newRole}?`)) {
            return;
        }

        try {
            await updateUserRole(userId, newRole);
            showToast('Nível de acesso atualizado com sucesso!', 'success');
            fetchUsers();
        } catch (error) {
            showToast('Erro ao atualizar nível de acesso.', 'error');
        }
    };

    useEffect(() => {
        const query = searchQuery.toLowerCase();
        setFilteredUsers(
            users.filter(u =>
                u.name?.toLowerCase().includes(query) ||
                u.email?.toLowerCase().includes(query)
            )
        );
    }, [searchQuery, users]);

    const getRoleIcon = (role: string) => {
        if (role === 'admin' || role === 'adm') return <Shield className="w-3 h-3" />;
        if (role === 'author') return <PenTool className="w-3 h-3" />;
        return <UserIcon className="w-3 h-3" />;
    };

    const getRoleStyles = (role: string) => {
        if (role === 'admin' || role === 'adm') return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
        if (role === 'author' || role === 'autor') return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    };

    return (
        <div className="space-y-6">
            <AdminPageHeader title="Utilizadores" subtitle="Gestão de utilizadores e privilégios" highlight="Comunitário">
                <Input
                    placeholder="Pesquisar por nome ou email..."
                    variant="light"
                    icon={<Search className="w-4 h-4" />}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full sm:w-72"
                />
            </AdminPageHeader>

            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[640px] border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Utilizador</th>
                                <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Contacto</th>
                                <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Nível</th>
                                <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Ingresso</th>
                                <th className="px-4 sm:px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            <AnimatePresence mode="popLayout">
                                {isLoadingUsers ? (
                                    [1, 2, 3].map(i => (
                                        <tr key={i} className="animate-pulse">
                                            <td colSpan={5} className="px-4 sm:px-6 py-4">
                                                <div className="h-4 bg-gray-100 rounded-full w-full"></div>
                                            </td>
                                        </tr>
                                    ))
                                ) : filteredUsers.length > 0 ? (
                                    filteredUsers.map((u) => (
                                        <m.tr
                                            key={u.id}
                                            layout
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="hover:bg-gray-50 transition-colors group"
                                        >
                                            <td className="px-4 sm:px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 bg-brand-primary/10 border border-brand-primary/20 rounded-2xl flex items-center justify-center text-brand-primary font-black text-sm group-hover:scale-110 transition-transform">
                                                        {u.name?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="font-black text-slate-900 text-[14px] tracking-tight">{u.name}</div>
                                                        <div className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">{u.id.substring(0, 12)}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 sm:px-6 py-4">
                                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                                                        <Mail className="w-3.4 h-3.5 text-gray-600" />
                                                    </div>
                                                    {u.email}
                                                </div>
                                            </td>
                                            <td className="px-4 sm:px-6 py-4">
                                                <span className={`inline-flex items-center gap-2 w-fit px-3 py-1.5 rounded-lg border text-xs font-bold ${getRoleStyles(u.role)}`}>
                                                    {getRoleIcon(u.role)}
                                                    {u.role === 'admin' || u.role === 'adm' ? 'Administrador' : u.role === 'author' || u.role === 'autor' ? 'Escritor' : 'Leitor'}
                                                </span>
                                            </td>
                                            <td className="px-4 sm:px-6 py-4 text-xs text-gray-500">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4 text-gray-700" />
                                                    {new Date(u.joined || Date.now()).toLocaleDateString('pt-AO')}
                                                </div>
                                            </td>
                                            <td className="px-4 sm:px-6 py-4">
                                                <div className="flex items-center justify-center gap-2 flex-wrap">
                                                    {(u.role === 'leitor' || u.role === 'autor') && (
                                                        <button
                                                            onClick={() => handleUpdateRole(u.id, u.role, 'promote')}
                                                            title="Promover Utilizador"
                                                            aria-label="Promover Utilizador"
                                                            className="w-10 h-10 bg-green-500/10 hover:bg-green-500/20 text-green-500 rounded-xl transition-all flex items-center justify-center border border-green-500/10 group/promote"
                                                        >
                                                            <ArrowUpCircle className="w-4 h-4 transition-transform group-hover/promote:-translate-y-1" />
                                                        </button>
                                                    )}
                                                    {(u.role === 'adm' || u.role === 'admin' || u.role === 'autor') && (
                                                        <button
                                                            onClick={() => handleUpdateRole(u.id, u.role, 'demote')}
                                                            title="Despromover Utilizador"
                                                            aria-label="Despromover Utilizador"
                                                            className="w-10 h-10 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl transition-all flex items-center justify-center border border-red-500/10 group/demote"
                                                        >
                                                            <ArrowDownCircle className="w-4 h-4 transition-transform group-hover/demote:translate-y-1" />
                                                        </button>
                                                    )}
                                                    <button
                                                        title="Editar Perfil"
                                                        aria-label="Editar Perfil"
                                                        className="w-10 h-10 bg-gray-50 hover:bg-brand-primary/10 text-gray-400 hover:text-brand-primary rounded-xl transition-all flex items-center justify-center border border-gray-200 group/btn"
                                                    >
                                                        <Edit className="w-4 h-4 transition-transform group-hover/btn:scale-110" />
                                                    </button>
                                                </div>
                                            </td>
                                        </m.tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="py-16 text-center">
                                            <div className="flex flex-col items-center gap-4 text-gray-400">
                                                <UserIcon className="w-12 h-12" />
                                                <p className="text-sm font-semibold">Nenhum utilizador encontrado</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminUsersPage;

