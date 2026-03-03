import React, { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Mail,
    Shield,
    MoreVertical,
    User as UserIcon,
    CheckCircle2,
    XCircle,
    Loader2,
    LogOut,
    ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllUsers, saveUserProfile } from '../../services/dataService';
import { User, UserRole } from '../../types';
import { useToast } from '../../components/Toast';

const AdminUsers: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState<'all' | UserRole>('all');
    const { showToast } = useToast();

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const data = await getAllUsers();
            setUsers(data);
        } catch (error) {
            showToast('Erro ao carregar utilizadores', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateRole = async (user: User, newRole: UserRole) => {
        try {
            await saveUserProfile({ ...user, role: newRole });
            setUsers(prev => prev.map(u => u.id === user.id ? { ...u, role: newRole } : u));
            showToast(`Cargo de ${user.name} atualizado para ${newRole}`, 'success');
        } catch (error) {
            showToast('Erro ao atualizar cargo', 'error');
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === 'all' || user.role === filterRole;
        return matchesSearch && matchesRole;
    });

    const getRoleBadgeColor = (role: UserRole) => {
        switch (role) {
            case 'adm': return 'bg-purple-50 text-purple-600 border-purple-100';
            case 'autor': return 'bg-blue-50 text-blue-600 border-blue-100';
            default: return 'bg-gray-50 text-gray-600 border-gray-100';
        }
    };

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <span className="text-brand-primary font-bold uppercase tracking-[0.4em] text-[10px]">Gestão de Comunidade</span>
                    <h2 className="text-4xl sm:text-5xl font-black text-brand-dark uppercase tracking-tighter leading-none mt-2">
                        Utilizadores
                    </h2>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Pesquisar por nome ou email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-brand-primary/20 transition-all outline-none"
                    />
                </div>
                <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value as any)}
                    className="w-full md:w-auto px-4 py-3 bg-gray-50 border-none rounded-2xl text-xs font-bold uppercase tracking-widest outline-none cursor-pointer hover:bg-gray-100 transition-colors"
                    title="Filtrar por cargo"
                >
                    <option value="all">Todos os Cargos</option>
                    <option value="adm">⭐ Administradores</option>
                    <option value="autor">✍️ Autores</option>
                    <option value="leitor">📖 Leitores</option>
                </select>
            </div>

            {/* Users Grid */}
            {loading ? (
                <div className="h-64 flex flex-col items-center justify-center gap-4 text-gray-400">
                    <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
                    <span className="text-xs font-bold uppercase tracking-widest">A carregar utilizadores...</span>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    <AnimatePresence mode="popLayout">
                        {filteredUsers.map((user, index) => (
                            <motion.div
                                key={user.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: index * 0.05 }}
                                className="group bg-white p-8 rounded-[2.5rem] border border-gray-50 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500 flex flex-col items-center text-center relative overflow-hidden"
                            >
                                {/* Decorative Background Element */}
                                <div className={`absolute top-0 right-0 w-24 h-24 opacity-5 rounded-full translate-x-12 -translate-y-12 transition-transform duration-700 group-hover:scale-150 ${user.role === 'adm' ? 'bg-purple-600' : user.role === 'autor' ? 'bg-blue-600' : 'bg-gray-600'
                                    }`}></div>

                                {/* Avatar */}
                                <div className="w-20 h-20 rounded-3xl bg-gray-50 flex items-center justify-center text-gray-300 mb-6 group-hover:scale-110 transition-transform duration-500 relative">
                                    {user.avatarUrl ? (
                                        <img src={user.avatarUrl} alt="" className="w-full h-full object-cover rounded-3xl" />
                                    ) : (
                                        <UserIcon className="w-10 h-10" />
                                    )}
                                    <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-xl border-4 border-white flex items-center justify-center shadow-md ${user.role === 'adm' ? 'bg-purple-500' : user.role === 'autor' ? 'bg-blue-500' : 'bg-gray-500'
                                        }`}>
                                        <Shield className="w-3 h-3 text-white" />
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="space-y-1 mb-8">
                                    <h3 className="text-lg font-black text-brand-dark group-hover:text-brand-primary transition-colors truncate max-w-[200px]">
                                        {user.name}
                                    </h3>
                                    <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-gray-400 lowercase tracking-tight">
                                        <Mail className="w-3 h-3" />
                                        {user.email}
                                    </div>
                                </div>

                                {/* Role Toggle Area */}
                                <div className="w-full pt-6 border-t border-gray-50 space-y-4">
                                    <div className={`px-4 py-2 rounded-full border text-[9px] font-black uppercase tracking-widest inline-block ${getRoleBadgeColor(user.role)}`}>
                                        {user.role}
                                    </div>

                                    <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <button
                                            onClick={() => handleUpdateRole(user, 'autor')}
                                            disabled={user.role === 'autor'}
                                            className="px-4 py-2 bg-gray-50 hover:bg-blue-50 hover:text-blue-600 text-[8px] font-black uppercase tracking-widest rounded-xl transition-all disabled:opacity-30"
                                        >
                                            Tornar Autor
                                        </button>
                                        <button
                                            onClick={() => handleUpdateRole(user, 'adm')}
                                            disabled={user.role === 'adm'}
                                            className="px-4 py-2 bg-gray-50 hover:bg-purple-50 hover:text-purple-600 text-[8px] font-black uppercase tracking-widest rounded-xl transition-all disabled:opacity-30"
                                        >
                                            Tornar ADM
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {!loading && filteredUsers.length === 0 && (
                <div className="py-20 text-center">
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Nenhum utilizador encontrado</p>
                </div>
            )}
        </div>
    );
};

export default AdminUsers;
