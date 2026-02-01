import React, { useState, useEffect } from 'react';
import { motion as m, AnimatePresence } from 'framer-motion';
import { Edit, Search, User as UserIcon, Shield, PenTool, Mail, Calendar } from 'lucide-react';

const AdminUsersTab: React.FC = () => {
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
        if (role === 'admin' || role === 'adm') return 'bg-purple-50 text-purple-600 border-purple-100';
        if (role === 'author') return 'bg-blue-50 text-blue-600 border-blue-100';
        return 'bg-gray-50 text-gray-600 border-gray-100';
    };

    return (
        <div className="space-y-10">
            <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-8">
                <div>
                    <h2 className="text-4xl font-black text-brand-dark tracking-tighter uppercase mb-2">Comunidade <span className="text-brand-primary lowercase italic font-light">Graciana</span></h2>
                    <p className="text-gray-400 font-bold text-sm">Controle de acessos e perfis de utilizadores.</p>
                </div>

                <div className="relative group w-full xl:w-96">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-brand-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Pesquisar por nome ou email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-6 py-4 bg-gray-50 border-2 border-transparent focus:border-brand-primary/20 focus:bg-white rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest outline-none transition-all shadow-sm"
                    />
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-brand-dark/5 border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[800px]">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Identidade</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Contacto</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Privilégio</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Membro Desde</th>
                                <th className="px-8 py-6 text-center text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Gestão</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            <AnimatePresence mode="popLayout">
                                {isLoadingUsers ? (
                                    [1, 2, 3].map(i => (
                                        <tr key={i} className="animate-pulse">
                                            <td colSpan={5} className="px-8 py-6">
                                                <div className="h-4 bg-gray-100 rounded-full w-full"></div>
                                            </td>
                                        </tr>
                                    ))
                                ) : filteredUsers.length > 0 ? (
                                    filteredUsers.map((u) => (
                                        <m.tr
                                            key={u.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="hover:bg-gray-50/50 transition-colors group"
                                        >
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary font-black text-[10px]">
                                                        {u.name?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="font-black text-brand-dark text-sm tracking-tight">{u.name}</div>
                                                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{u.id.substring(0, 8)}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2 text-xs text-gray-600 font-medium">
                                                    <Mail className="w-3 h-3 text-gray-300" />
                                                    {u.email}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`flex items-center gap-2 w-fit px-3 py-1.5 rounded-lg border text-[9px] font-black uppercase tracking-[0.2em] ${getRoleStyles(u.role)}`}>
                                                    {getRoleIcon(u.role)}
                                                    {u.role === 'admin' || u.role === 'adm' ? 'Administrador' : u.role === 'author' ? 'Autor' : 'Leitor'}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                                    <Calendar className="w-3 h-3" />
                                                    {new Date(u.joined || Date.now()).toLocaleDateString('pt-AO')}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center justify-center">
                                                    <m.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        title="Editar utilizador"
                                                        aria-label="Editar utilizador"
                                                        className="w-10 h-10 bg-white shadow-sm border border-gray-100 text-gray-400 hover:text-brand-primary hover:border-brand-primary/20 transition-all flex items-center justify-center rounded-xl"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </m.button>
                                                </div>
                                            </td>
                                        </m.tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-32 text-center">
                                            <div className="flex flex-col items-center gap-4 opacity-20 grayscale">
                                                <UserIcon className="w-16 h-16" />
                                                <p className="font-black uppercase tracking-[0.3em] text-[10px]">Nenhum utilizador encontrado.</p>
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

export default AdminUsersTab;
