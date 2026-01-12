import React, { useState } from 'react';
import { FileText, Upload, Eye, CheckCircle, Clock, XCircle, User as UserIcon } from 'lucide-react';
import { ViewState, User } from '../types';

interface AuthorDashboardProps {
    user: User | null;
    onNavigate: (view: ViewState) => void;
}

const AuthorDashboard: React.FC<AuthorDashboardProps> = ({ user, onNavigate }) => {
    const [activeTab, setActiveTab] = useState<'manuscripts' | 'submit' | 'royalties' | 'banking'>('manuscripts');
    const [bankAccounts, setBankAccounts] = useState<import('../types').BankInfo[]>(user?.paymentMethods || []);
    const [whatsapp, setWhatsapp] = useState(user?.whatsappNumber || '');
    const [isSaving, setIsSaving] = useState(false);
    const [manuscripts, setManuscripts] = useState<import('../types').Manuscript[]>([]);
    const [isLoadingManuscripts, setIsLoadingManuscripts] = useState(false);
    const [authorStats, setAuthorStats] = useState({ publishedBooks: 0, totalSales: 0, totalRoyalties: 0 });
    const [confirmedSales, setConfirmedSales] = useState<any[]>([]);
    const [isLoadingStats, setIsLoadingStats] = useState(false);

    // Submit form state
    const [submitLoading, setSubmitLoading] = useState(false);
    const [submitData, setSubmitData] = useState({
        title: '',
        genre: '',
        pages: '',
        synopsis: ''
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const fetchManuscripts = async () => {
        if (!user) return;
        setIsLoadingManuscripts(true);
        try {
            const { getManuscriptsByAuthor } = await import('../services/dataService');
            const data = await getManuscriptsByAuthor(user.id);
            setManuscripts(data);
        } catch (error) {
            console.error('Erro ao buscar manuscritos:', error);
        } finally {
            setIsLoadingManuscripts(false);
        }
    };

    const fetchAuthorData = async () => {
        if (!user) return;
        setIsLoadingStats(true);
        try {
            const { getAuthorStats, getAuthorConfirmedSales } = await import('../services/dataService');
            const [stats, sales] = await Promise.all([
                getAuthorStats(user.id),
                getAuthorConfirmedSales(user.id)
            ]);
            setAuthorStats(stats);
            setConfirmedSales(sales);
        } catch (error) {
            console.error('Erro ao buscar dados do autor:', error);
        } finally {
            setIsLoadingStats(false);
        }
    };

    React.useEffect(() => {
        if (activeTab === 'manuscripts') {
            fetchManuscripts();
        } else if (activeTab === 'royalties') {
            fetchAuthorData();
        }
    }, [activeTab, user?.id]);

    const handleSaveProfile = async () => {
        if (!user) return;
        setIsSaving(true);
        try {
            const { saveUserProfile } = await import('../services/dataService');
            await saveUserProfile({
                ...user,
                paymentMethods: bankAccounts,
                whatsappNumber: whatsapp
            });
            alert('Perfil atualizado com sucesso!');
        } catch (error) {
            console.error('Erro ao salvar perfil:', error);
            alert('Erro ao salvar alterações.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleSubmitManuscript = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !selectedFile) {
            alert('Por favor, selecione um ficheiro.');
            return;
        }

        setSubmitLoading(true);
        try {
            const { uploadManuscriptFile } = await import('../services/storageService');
            const { createManuscript } = await import('../services/dataService');

            // 1. Upload file
            const { fileId, fileUrl } = await uploadManuscriptFile(selectedFile);

            // 2. Create document
            await createManuscript({
                authorId: user.id,
                authorName: user.name,
                title: submitData.title,
                genre: submitData.genre,
                pages: submitData.pages ? parseInt(submitData.pages) : undefined,
                synopsis: submitData.synopsis,
                fileUrl: fileUrl,
                fileName: selectedFile.name,
                status: 'pending',
                submittedDate: new Date().toISOString()
            });

            alert('Manuscrito submetido com sucesso! A nossa equipa irá analisar e entrará em contacto brevemente.');
            setSubmitData({ title: '', genre: '', pages: '', synopsis: '' });
            setSelectedFile(null);
            setActiveTab('manuscripts');
        } catch (error) {
            console.error('Erro ao submeter:', error);
            alert('Ocorreu um erro ao submeter o manuscrito. Por favor, tente novamente.');
        } finally {
            setSubmitLoading(false);
        }
    };

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

    if (!user || user.role !== 'autor') {
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
                        <button
                            onClick={() => setActiveTab('banking')}
                            className={`px-6 py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-all ${activeTab === 'banking'
                                ? 'bg-brand-primary text-white'
                                : 'bg-white/10 text-white hover:bg-white/20'
                                }`}
                        >
                            Dados Bancários
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
                                {isLoadingManuscripts ? (
                                    <div className="text-center py-20 text-gray-500 italic">Carregando manuscritos...</div>
                                ) : manuscripts.length > 0 ? (
                                    manuscripts.map((manuscript) => (
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
                                                    <a href={manuscript.fileUrl} target="_blank" rel="noopener noreferrer" title="Ver manuscrito" aria-label="Ver ficheiro do manuscrito" className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-brand-primary hover:text-white transition-all">
                                                        <Eye className="w-5 h-5" />
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-gray-100">
                                        <FileText className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                                        <p className="text-gray-500 font-medium">Ainda não submeteu nenhum manuscrito.</p>
                                        <button onClick={() => setActiveTab('submit')} className="btn-premium mt-6 mx-auto">Submeter Primeiro Trabalho</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Submit Tab */}
                    {activeTab === 'submit' && (
                        <div>
                            <h2 className="text-3xl font-black text-brand-dark mb-8">Submeter Novo Manuscrito</h2>
                            <div className="bg-white rounded-3xl shadow-lg p-8 max-w-3xl">
                                <form onSubmit={handleSubmitManuscript} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold text-brand-dark mb-2 uppercase tracking-wider">
                                            Título da Obra *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={submitData.title}
                                            onChange={e => setSubmitData(prev => ({ ...prev, title: e.target.value }))}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-brand-primary"
                                            placeholder="Digite o título"
                                        />
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-bold text-brand-dark mb-2 uppercase tracking-wider">
                                                Género Literário *
                                            </label>
                                            <select
                                                required
                                                aria-label="Género Literário"
                                                value={submitData.genre}
                                                onChange={e => setSubmitData(prev => ({ ...prev, genre: e.target.value }))}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-brand-primary"
                                            >
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
                                                value={submitData.pages}
                                                onChange={e => setSubmitData(prev => ({ ...prev, pages: e.target.value }))}
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
                                            required
                                            rows={6}
                                            value={submitData.synopsis}
                                            onChange={e => setSubmitData(prev => ({ ...prev, synopsis: e.target.value }))}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-brand-primary resize-none"
                                            placeholder="Descreva brevemente a sua obra..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-brand-dark mb-2 uppercase tracking-wider">
                                            Manuscrito (PDF, DOCX) *
                                        </label>
                                        <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-brand-primary transition-all cursor-pointer">
                                            <input
                                                type="file"
                                                required
                                                accept=".pdf,.docx,.doc"
                                                title="Carregar manuscrito"
                                                aria-label="Carregar manuscrito"
                                                onChange={e => e.target.files && setSelectedFile(e.target.files[0])}
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                            />
                                            {selectedFile ? (
                                                <div className="space-y-2">
                                                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
                                                    <p className="font-bold text-brand-dark">{selectedFile.name}</p>
                                                    <button type="button" onClick={() => setSelectedFile(null)} className="text-red-500 text-xs hover:underline">Remover ficheiro</button>
                                                </div>
                                            ) : (
                                                <>
                                                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                                    <p className="text-gray-600 font-medium mb-2">Clique para carregar ou arraste o arquivo</p>
                                                    <p className="text-sm text-gray-500">Máximo 50MB (PDF, DOCX)</p>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={submitLoading}
                                        className="w-full btn-premium justify-center text-lg disabled:opacity-50"
                                    >
                                        {submitLoading ? 'Submetendo...' : 'Submeter Manuscrito'}
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
                                    <p className="text-4xl font-black text-brand-dark">{isLoadingStats ? '...' : authorStats.totalSales}</p>
                                </div>
                                <div className="bg-white rounded-2xl shadow-lg p-6">
                                    <p className="text-gray-600 mb-2">Royalties Acumulados</p>
                                    <p className="text-4xl font-black text-brand-primary">{isLoadingStats ? '...' : authorStats.totalRoyalties.toLocaleString()} Kz</p>
                                </div>
                                <div className="bg-white rounded-2xl shadow-lg p-6">
                                    <p className="text-gray-600 mb-2">Livros Publicados</p>
                                    <p className="text-4xl font-black text-brand-dark">{isLoadingStats ? '...' : authorStats.publishedBooks}</p>
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
                                        {isLoadingStats ? (
                                            <tr>
                                                <td colSpan={4} className="px-4 py-8 text-center text-gray-500 italic">Carregando histórico...</td>
                                            </tr>
                                        ) : confirmedSales.length > 0 ? (
                                            confirmedSales.map((sale) => (
                                                <tr key={sale.id} className="hover:bg-gray-50">
                                                    <td className="px-4 py-4 text-sm text-gray-600">
                                                        {new Date(sale.date).toLocaleDateString('pt-AO', { month: 'short', year: 'numeric' })}
                                                    </td>
                                                    <td className="px-4 py-4 text-sm font-bold text-brand-dark">{sale.bookTitle}</td>
                                                    <td className="px-4 py-4 text-sm text-gray-600 text-right">{sale.quantity}</td>
                                                    <td className="px-4 py-4 text-sm font-bold text-brand-primary text-right">{sale.royalty.toLocaleString()} Kz</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={4} className="px-4 py-8 text-center text-gray-500 italic">Nenhuma venda registada até ao momento.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Banking Details Tab */}
                    {activeTab === 'banking' && (
                        <div>
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-3xl font-black text-brand-dark">Meus Dados Bancários</h2>
                                <button
                                    onClick={handleSaveProfile}
                                    disabled={isSaving}
                                    className="btn-premium"
                                >
                                    {isSaving ? 'Salvando...' : 'Guardar Alterações'}
                                </button>
                            </div>

                            <div className="grid lg:grid-cols-2 gap-8">
                                {/* Bank Accounts */}
                                <div className="space-y-6">
                                    <div className="bg-white rounded-3xl shadow-lg p-8">
                                        <h3 className="text-xl font-bold text-brand-dark mb-6">Contas para Recebimento</h3>

                                        <div className="space-y-4 mb-8">
                                            {bankAccounts.map((acc: import('../types').BankInfo, index: number) => (
                                                <div key={index} className="border border-gray-100 rounded-xl p-4 bg-gray-50 relative group">
                                                    <div className="font-bold text-brand-dark">{acc.bankName}</div>
                                                    <div className="text-sm text-gray-600">CC: {acc.accountNumber}</div>
                                                    <div className="text-xs text-gray-500 font-mono">IBAN: {acc.iban}</div>
                                                    {acc.isPrimary && (
                                                        <span className="absolute top-4 right-4 bg-brand-primary/10 text-brand-primary text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">Primária</span>
                                                    )}
                                                    <button
                                                        onClick={() => setBankAccounts((prev: import('../types').BankInfo[]) => prev.filter((_: any, i: number) => i !== index))}
                                                        className="absolute bottom-4 right-4 text-red-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                                                    >
                                                        Eliminar
                                                    </button>
                                                </div>
                                            ))}
                                            {bankAccounts.length === 0 && (
                                                <p className="text-gray-500 text-center py-4 italic">Nenhuma conta registada.</p>
                                            )}
                                        </div>

                                        <div className="border-t border-gray-100 pt-6">
                                            <h4 className="font-bold text-brand-dark mb-4 text-sm uppercase tracking-wider">Adicionar Nova Conta</h4>
                                            <div className="space-y-4">
                                                <input
                                                    id="new-bank-name"
                                                    type="text"
                                                    placeholder="Nome do Banco (Ex: BFA, Atlântico)"
                                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-primary"
                                                />
                                                <input
                                                    id="new-bank-acc"
                                                    type="text"
                                                    placeholder="Número de Conta"
                                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-primary"
                                                />
                                                <input
                                                    id="new-bank-iban"
                                                    type="text"
                                                    placeholder="IBAN"
                                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-primary"
                                                />
                                                <button
                                                    onClick={() => {
                                                        const name = (document.getElementById('new-bank-name') as HTMLInputElement).value;
                                                        const acc = (document.getElementById('new-bank-acc') as HTMLInputElement).value;
                                                        const iban = (document.getElementById('new-bank-iban') as HTMLInputElement).value;
                                                        if (name && acc) {
                                                            setBankAccounts((prev: import('../types').BankInfo[]) => [...prev, {
                                                                id: Math.random().toString(36).substr(2, 9),
                                                                bankName: name,
                                                                accountNumber: acc,
                                                                iban: iban,
                                                                isPrimary: prev.length === 0
                                                            }]);
                                                            (document.getElementById('new-bank-name') as HTMLInputElement).value = '';
                                                            (document.getElementById('new-bank-acc') as HTMLInputElement).value = '';
                                                            (document.getElementById('new-bank-iban') as HTMLInputElement).value = '';
                                                        }
                                                    }}
                                                    className="w-full py-2 bg-brand-dark text-white rounded-lg font-bold hover:bg-brand-primary transition-all text-sm"
                                                >
                                                    Adicionar Conta
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Details */}
                                <div className="space-y-6">
                                    <div className="bg-white rounded-3xl shadow-lg p-8">
                                        <h3 className="text-xl font-bold text-brand-dark mb-6">Contacto de Notificação</h3>
                                        <div>
                                            <label className="block text-sm font-bold text-brand-dark mb-2 uppercase tracking-wider">Número de WhatsApp *</label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">+244</span>
                                                <input
                                                    type="tel"
                                                    value={whatsapp}
                                                    onChange={(e) => setWhatsapp(e.target.value)}
                                                    className="w-full pl-16 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-primary"
                                                    placeholder="9XX XXX XXX"
                                                />
                                            </div>
                                            <p className="text-xs text-gray-500 mt-3 italic">
                                                Este número será usado para lhe enviarmos os comprovantes de pagamento via WhatsApp.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="bg-brand-primary/5 border border-brand-primary/10 rounded-3xl p-8">
                                        <h4 className="font-bold text-brand-primary mb-3">Dica de Segurança</h4>
                                        <p className="text-sm text-gray-700 leading-relaxed">
                                            Os seus dados bancários apenas serão visíveis para leitores que queiram adquirir as suas obras pagas. Certifique-se que o IBAN está correcto para evitar atrasos nos pagamentos.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>

    );
};

export default AuthorDashboard;
