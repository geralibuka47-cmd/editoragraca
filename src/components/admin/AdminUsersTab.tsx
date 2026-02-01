import React, { useState, useEffect } from 'react';
import { motion as m, AnimatePresence } from 'framer-motion';
import { Edit, Search, User as UserIcon, Shield, PenTool, Mail, Calendar, Activity } from 'lucide-react';

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
        if (role === 'admin' || role === 'adm') return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
        if (role === 'author') return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    };

    return (
        <div className="space-y-12">
            {/* Header Section */}
            <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-8">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-8 bg-brand-primary rounded-full shadow-[0_0_15px_rgba(189,147,56,0.5)]" />
                        <h2 className="text-3xl font-black text-white tracking-tighter uppercase mb-0">Diretório <span className="text-brand-primary italic font-light lowercase">Comunitário</span></h2>
                    </div>
                    <p className="text-gray-500 font-bold text-xs uppercase tracking-widest pl-4">Gestão de Utilizadores e Privilégios</p>
                </div>

                <div className="relative group w-full xl:w-96">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-brand-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="LOCALIZAR UTILIZADOR..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/5 focus:border-brand-primary/20 focus:bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white outline-none transition-all shadow-xl"
                    />
                </div>
            </div>

            {/* Content Display */}
            <div className="bg-white/5 rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full min-w-[800px] border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/5">
                                <th className="px-10 py-8 text-left text-[9px] font-black text-gray-500 uppercase tracking-[0.3em]">Utilizador</th>
                                <th className="px-10 py-8 text-left text-[9px] font-black text-gray-500 uppercase tracking-[0.3em]">Contacto Directo</th>
                                <th className="px-10 py-8 text-left text-[9px] font-black text-gray-500 uppercase tracking-[0.3em]">Nível de Acesso</th>
                                <th className="px-10 py-8 text-left text-[9px] font-black text-gray-500 uppercase tracking-[0.3em]">Ingresso</th>
                                <th className="px-10 py-8 text-center text-[9px] font-black text-gray-500 uppercase tracking-[0.3em]">Operações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            <AnimatePresence mode="popLayout">
                                {isLoadingUsers ? (
                                    [1, 2, 3].map(i => (
                                        <tr key={i} className="animate-pulse">
                                            <td colSpan={5} className="px-10 py-8">
                                                <div className="h-4 bg-white/5 rounded-full w-full"></div>
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
                                            className="hover:bg-white/[0.03] transition-colors group"
                                        >
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-5">
                                                    <div className="w-12 h-12 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center text-brand-primary font-black text-sm group-hover:scale-110 transition-transform">
                                                        {u.name?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="font-black text-white text-[14px] tracking-tight">{u.name}</div>
                                                        <div className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">{u.id.substring(0, 12)}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-3 text-[12px] text-gray-400 font-medium">
                                                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                                                        <Mail className="w-3.4 h-3.5 text-gray-600" />
                                                    </div>
                                                    {u.email}
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <span className={`flex items-center gap-2.5 w-fit px-4 py-2 rounded-xl border text-[9px] font-black uppercase tracking-[0.2em] shadow-lg ${getRoleStyles(u.role)}`}>
                                                    {getRoleIcon(u.role)}
                                                    {u.role === 'admin' || u.role === 'adm' ? 'Administrador' : u.role === 'author' ? 'Escritor' : 'Explorador'}
                                                </span>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-3 text-[10px] text-gray-500 font-black uppercase tracking-widest">
                                                    <Calendar className="w-4 h-4 text-gray-700" />
                                                    {new Date(u.joined || Date.now()).toLocaleDateString('pt-AO')}
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="flex items-center justify-center">
                                                    <button
                                                        title="Aceder Perfil Completo"
                                                        aria-label="Aceder Perfil Completo"
                                                        className="w-12 h-12 bg-white/5 hover:bg-brand-primary/10 text-gray-500 hover:text-brand-primary rounded-xl transition-all flex items-center justify-center border border-white/5 group/btn"
                                                    >
                                                        <Edit className="w-4 h-4 transition-transform group-hover/btn:scale-110" />
                                                    </button>
                                                </div>
                                            </td>
                                        </m.tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="py-40 text-center">
                                            <div className="flex flex-col items-center gap-6 opacity-20">
                                                <UserIcon className="w-16 h-16 text-brand-primary" />
                                                <p className="font-black text-[11px] uppercase tracking-[0.4em]">Nenhum Identidade Localizada</p>
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

