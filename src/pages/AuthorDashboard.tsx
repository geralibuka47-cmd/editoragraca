import React, { useState } from 'react';
import { FileText, Upload, Eye, CheckCircle, Clock, XCircle, User as UserIcon } from 'lucide-react';
import { ViewState, User } from '../types';

interface AuthorDashboardProps {
    user: User | null;
    onNavigate: (view: ViewState) => void;
}

const AuthorDashboard: React.FC<AuthorDashboardProps> = ({ user, onNavigate }) => {
    const [activeTab, setActiveTab] = useState<'manuscripts' | 'submit' | 'royalties'>('manuscripts');
    const [showSubmitForm, setShowSubmitForm] = useState(false);

    // Mock data
    const manuscripts = [
        {
            id: '1',
            title: 'Memórias do Futuro',
            genre: 'Ficção',
            status: 'approved' as const,
            submittedDate: '2025-12-15',
            reviewedDate: '2026-01-02'
        },
        {
            id: '2',
            title: 'Cantos da Savana',
            genre: 'Poesia',
            status: 'pending' as const,
            submittedDate: '2026-01-08',
            reviewedDate: null
        },
        {
            id: '3',
            title: 'A Jornada',
            genre: 'Romance',
            status: 'rejected' as const,
            submittedDate: '2025-11-20',
            reviewedDate: '2025-12-01'
        }
    ];

    const getStatusColor = (status: 'approved' | 'pending' | 'rejected') => {
        switch (status) {
            case 'approved': return 'text-green-600 bg-green-100';
            case 'pending': return 'text-yellow-600 bg-yellow-100';
            case 'rejected': return 'text-red-600 bg-red-100';
        }
    };

    const getStatusIcon = (status: 'approved' | 'pending' | 'rejected') => {
        switch (status) {
            case 'approved': return <CheckCircle className="w-5 h-5" />;
            case 'pending': return <Clock className="w-5 h-5" />;
            case 'rejected': return <XCircle className="w-5 h-5" />;
        }
    };

    const getStatusText = (status: 'approved' | 'pending' | 'rejected') => {
        switch (status) {
            case 'approved': return 'Aprovado';
            case 'pending': return 'Em Análise';
            case 'rejected': return 'Rejeitado';
        }
    };

    if (!user || user.role !== 'author') {
        return (
            <div className="min-h-screen bg-brand-light flex items-center justify-center p-8">
                <div className="bg-white rounded-3xl shadow-xl p-12 text-center max-w-md">
                    <UserIcon className="w-16 h-16 text-gray-300 mx-auto mb-6" />
                    <h2 className="text-3xl font-black text-brand-dark mb-4">Área para Autores</h2>
                    <p className="text-gray-600 mb-8">Esta área é exclusiva para autores registados.</p>
                    <button
                        onClick={() => onNavigate('CONTACT')}
                        className="btn-premium w-full justify-center"
                    >
                        Tornar-se Autor
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brand-light">
            {/* Header */}
            <section className="bg-brand-dark text-white py-16">
                <div className="container mx-auto px-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-2">
                                Painel do <span className="text-brand-primary">Autor</span>
                            </h1>
                            <p className="text-gray-300">Gerencie seus manuscritos e publicações</p>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => setActiveTab('manuscripts')}
                            className={`px-6 py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-all ${activeTab === 'manuscripts'
                                    ? 'bg-brand-primary text-white'
                                    : 'bg-white/10 text-white hover:bg-white/20'
                                }`}
                        >
                            <FileText className="w-4 h-4 inline mr-2" />
                            Meus Manuscritos
                        </button>
                        <button
                            onClick={() => setActiveTab('submit')}
                            className={`px-6 py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-all ${activeTab === 'submit'
                                    ? 'bg-brand-primary text-white'
                                    : 'bg-white/10 text-white hover:bg-white/20'
                                }`}
                        >
                            <Upload className="w-4 h-4 inline mr-2" />
                            Submeter Manuscrito
                        </button>
                        <button
                            onClick={() => setActiveTab('royalties')}
                            className={`px-6 py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-all ${activeTab === 'royalties'
                                    ? 'bg-brand-primary text-white'
                                    : 'bg-white/10 text-white hover:bg-white/20'
                                }`}
                        >
                            Royalties
                        </button>
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="py-12">
                <div className="container mx-auto px-8">
                    {/* Manuscripts Tab */}
                    {activeTab === 'manuscripts' && (
                        <div>
                            <h2 className="text-3xl font-black text-brand-dark mb-8">Meus Manuscritos</h2>
                            <div className="grid gap-6">
                                {manuscripts.map((manuscript) => (
                                    <div key={manuscript.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all">
                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                            <div className="flex-1">
                                                <h3 className="text-2xl font-black text-brand-dark mb-2">{manuscript.title}</h3>
                                                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                                    <span className="flex items-center gap-2">
                                                        <FileText className="w-4 h-4" />
                                                        {manuscript.genre}
                                                    </span>
                                                    <span>Submetido: {new Date(manuscript.submittedDate).toLocaleDateString('pt-AO')}</span>
                                                    {manuscript.reviewedDate && (
                                                        <span>Analisado: {new Date(manuscript.reviewedDate).toLocaleDateString('pt-AO')}</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold ${getStatusColor(manuscript.status)}`}>
                                                    {getStatusIcon(manuscript.status)}
                                                    {getStatusText(manuscript.status)}
                                                </div>
                                                <button className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-brand-primary hover:text-white transition-all">
                                                    <Eye className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Submit Tab */}
                    {activeTab === 'submit' && (
                        <div>
                            <h2 className="text-3xl font-black text-brand-dark mb-8">Submeter Novo Manuscrito</h2>
                            <div className="bg-white rounded-3xl shadow-lg p-8 max-w-3xl">
                                <form className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold text-brand-dark mb-2 uppercase tracking-wider">
                                            Título da Obra *
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-brand-primary"
                                            placeholder="Digite o título"
                                        />
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-bold text-brand-dark mb-2 uppercase tracking-wider">
                                                Género Literário *
                                            </label>
                                            <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-brand-primary">
                                                <option value="">Selecione...</option>
                                                <option value="romance">Romance</option>
                                                <option value="ficcao">Ficção</option>
                                                <option value="poesia">Poesia</option>
                                                <option value="nao-ficcao">Não-Ficção</option>
                                                <option value="infantil">Infantil</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-brand-dark mb-2 uppercase tracking-wider">
                                                Número de Páginas
                                            </label>
                                            <input
                                                type="number"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-brand-primary"
                                                placeholder="Ex: 250"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-brand-dark mb-2 uppercase tracking-wider">
                                            Sinopse *
                                        </label>
                                        <textarea
                                            rows={6}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-brand-primary resize-none"
                                            placeholder="Descreva brevemente a sua obra..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-brand-dark mb-2 uppercase tracking-wider">
                                            Manuscrito (PDF, DOCX) *
                                        </label>
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-brand-primary transition-all cursor-pointer">
                                            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                            <p className="text-gray-600 font-medium mb-2">Clique para carregar ou arraste o arquivo</p>
                                            <p className="text-sm text-gray-500">Máximo 50MB</p>
                                        </div>
                                    </div>

                                    <button type="submit" className="w-full btn-premium justify-center text-lg">
                                        Submeter Manuscrito
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Royalties Tab */}
                    {activeTab === 'royalties' && (
                        <div>
                            <h2 className="text-3xl font-black text-brand-dark mb-8">Royalties e Vendas</h2>
                            <div className="grid md:grid-cols-3 gap-6 mb-8">
                                <div className="bg-white rounded-2xl shadow-lg p-6">
                                    <p className="text-gray-600 mb-2">Total de Vendas</p>
                                    <p className="text-4xl font-black text-brand-dark">127</p>
                                </div>
                                <div className="bg-white rounded-2xl shadow-lg p-6">
                                    <p className="text-gray-600 mb-2">Royalties Acumulados</p>
                                    <p className="text-4xl font-black text-brand-primary">45.600 Kz</p>
                                </div>
                                <div className="bg-white rounded-2xl shadow-lg p-6">
                                    <p className="text-gray-600 mb-2">Último Pagamento</p>
                                    <p className="text-4xl font-black text-brand-dark">15.000 Kz</p>
                                    <p className="text-xs text-gray-500 mt-1">Dezembro 2025</p>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h3 className="text-xl font-bold text-brand-dark mb-6">Histórico de Pagamentos</h3>
                                <table className="w-full">
                                    <thead className="border-b border-gray-200">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-bold text-brand-dark uppercase">Mês</th>
                                            <th className="px-4 py-3 text-left text-xs font-bold text-brand-dark uppercase">Livro</th>
                                            <th className="px-4 py-3 text-right text-xs font-bold text-brand-dark uppercase">Vendas</th>
                                            <th className="px-4 py-3 text-right text-xs font-bold text-brand-dark uppercase">Valor</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-4 py-4 text-sm text-gray-600">Dez 2025</td>
                                            <td className="px-4 py-4 text-sm font-bold text-brand-dark">Memórias do Futuro</td>
                                            <td className="px-4 py-4 text-sm text-gray-600 text-right">45</td>
                                            <td className="px-4 py-4 text-sm font-bold text-brand-primary text-right">15.000 Kz</td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-4 py-4 text-sm text-gray-600">Nov 2025</td>
                                            <td className="px-4 py-4 text-sm font-bold text-brand-dark">Memórias do Futuro</td>
                                            <td className="px-4 py-4 text-sm text-gray-600 text-right">52</td>
                                            <td className="px-4 py-4 text-sm font-bold text-brand-primary text-right">17.400 Kz</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default AuthorDashboard;
