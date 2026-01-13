import React, { useState, useEffect } from 'react';
import { Edit } from 'lucide-react';

const AdminUsersTab: React.FC = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [isLoadingUsers, setIsLoadingUsers] = useState(true);

    const fetchUsers = async () => {
        setIsLoadingUsers(true);
        try {
            const { getAllUsers } = await import('../../services/dataService');
            const data = await getAllUsers();
            setUsers(data);
        } catch (error) {
            console.error('Erro ao buscar utilizadores:', error);
        } finally {
            setIsLoadingUsers(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div>
            <h2 className="text-2xl md:text-3xl font-black text-brand-dark mb-8">Gestão de Utilizadores</h2>
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden overflow-x-auto">
                <table className="w-full min-w-[700px]">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-brand-dark uppercase tracking-wider">Nome</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-brand-dark uppercase tracking-wider">Email</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-brand-dark uppercase tracking-wider">Tipo</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-brand-dark uppercase tracking-wider">Data de Registo</th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-brand-dark uppercase tracking-wider">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {isLoadingUsers ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500 italic">Carregando utilizadores...</td>
                            </tr>
                        ) : users.length > 0 ? (
                            users.map((u) => (
                                <tr key={u.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-bold text-brand-dark">{u.name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{u.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${u.role === 'admin' || u.role === 'adm' ? 'bg-purple-100 text-purple-600' :
                                            u.role === 'author' ? 'bg-blue-100 text-blue-600' :
                                                'bg-gray-100 text-gray-600'
                                            }`}>
                                            {u.role === 'admin' || u.role === 'adm' ? 'Admin' : u.role === 'author' ? 'Autor' : 'Leitor'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{new Date(u.joined || Date.now()).toLocaleDateString('pt-AO')}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button title="Editar utilizador" aria-label="Editar utilizador" className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all flex items-center justify-center ml-auto">
                                            <Edit className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500 italic">Nenhum utilizador encontrado.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminUsersTab;
