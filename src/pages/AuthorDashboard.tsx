import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Upload, Eye, CheckCircle, Clock, XCircle, User as UserIcon, Loader2, Save, Sparkles, ChevronRight, ArrowRight, CreditCard, Settings } from 'lucide-react';
import { motion as m, AnimatePresence } from 'framer-motion';
import { useToast } from '../components/Toast';
import { ViewState, User } from '../types';

interface AuthorDashboardProps {
    user: User | null;
}

const AuthorDashboard: React.FC<AuthorDashboardProps> = ({ user }) => {
    const navigate = useNavigate();
    const { showToast } = useToast();
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
        description: ''
    });
    const [submitErrors, setSubmitErrors] = useState<Record<string, string>>({});
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
            showToast('Perfil atualizado com sucesso!', 'success');
        } catch (error) {
            console.error('Erro ao salvar perfil:', error);
            showToast('Erro ao salvar alterações.', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const validateManuscript = () => {
        const errors: Record<string, string> = {};
        if (!submitData.title.trim()) errors.title = 'Título é obrigatório';
        if (!submitData.genre) errors.genre = 'Género é obrigatório';
        if (!submitData.description.trim()) errors.description = 'Sinopse é obrigatória';
        if (!selectedFile) errors.file = 'Ficheiro do manuscrito é obrigatório';
        setSubmitErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmitManuscript = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setSubmitErrors({});

        if (!validateManuscript()) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        setSubmitLoading(true);
        try {
            const { uploadManuscriptFile } = await import('../services/storageService');
            const { createManuscript } = await import('../services/dataService');

            const { fileUrl } = await uploadManuscriptFile(selectedFile as File);

            await createManuscript({
                authorId: user.id,
                authorName: user.name,
                title: submitData.title.trim(),
                genre: submitData.genre,
                pages: submitData.pages ? parseInt(submitData.pages) : undefined,
                description: submitData.description.trim(),
                fileUrl: fileUrl,
                fileName: (selectedFile as File).name,
                status: 'pending',
                submittedDate: new Date().toISOString()
            });

            showToast('Manuscrito submetido com sucesso! A nossa equipa irá analisar e entrará em contacto brevemente.', 'success');
            setSubmitData({ title: '', genre: '', pages: '', description: '' });
            setSelectedFile(null);
            setSubmitErrors({});
            setActiveTab('manuscripts');
        } catch (error: any) {
            console.error('Erro ao submeter:', error);
            setSubmitErrors({
                form: error.message || 'Ocorreu um erro ao submeter o manuscrito. Por favor, verifique os dados e tente novamente.'
            });
            showToast('Erro ao submeter manuscrito.', 'error');
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
                        onClick={() => navigate('/contacto')}
                        className="btn-premium w-full justify-center"
                    >
                        Tornar-se Autor
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-brand-primary/30">
            {/* Dashboard Internal Header */}
            <header className="h-24 bg-brand-dark/80 backdrop-blur-3xl border-b border-white/5 fixed top-0 left-0 right-0 z-[100] px-8 flex items-center justify-between">
                <div
                    onClick={() => navigate('/')}
                    className="flex items-center gap-3 cursor-pointer group"
                >
                    <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(189,147,56,0.3)] transition-all">
                        <ArrowRight className="text-white w-5 h-5 rotate-180" />
                    </div>
                    <span className="text-[10px] font-black text-white uppercase tracking-[0.3em] hidden sm:block">Voltar ao Site</span>
                </div>

                <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                        <p className="text-[10px] font-black text-white">{user.name}</p>
                        <p className="text-[8px] text-brand-primary font-black uppercase tracking-[0.2em]">Escritor Protocol | Online</p>
                    </div>
                    <button
                        onClick={() => navigate('/')}
                        className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors border border-white/5"
                        title="Configurações"
                    >
                        <Settings className="w-4 h-4 text-gray-400" />
                    </button>
                </div>
            </header>

            {/* Header - Immersive */}
            <section className="bg-brand-dark text-white pt-32 pb-32 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[60%] aspect-square bg-brand-primary/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4"></div>

                <div className="container mx-auto px-6 md:px-8 relative z-10">
                    <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-8">
                        <div>
                            <m.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="inline-flex items-center gap-3 px-4 py-1.5 bg-brand-primary/10 border border-brand-primary/20 rounded-full text-brand-primary font-black text-[10px] uppercase tracking-[0.3em] mb-6"
                            >
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>Ambiente do Autor</span>
                            </m.div>
                            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none">
                                Painel do <span className="text-gradient-gold italic font-light lowercase">Autor</span>
                            </h1>
                            <p className="text-gray-400 font-bold mt-4 opacity-70">Sua central de produção e gestão literária.</p>
                        </div>

                        <m.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-6 bg-white/[0.03] backdrop-blur-3xl p-6 rounded-[2.5rem] border border-white/5 shadow-2xl relative group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-transparent rounded-[2.5rem] -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="relative">
                                <div className="w-16 h-16 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary font-black text-2xl border border-brand-primary/20 shadow-[0_0_20px_rgba(189,147,56,0.2)]">
                                    {user.name.charAt(0)}
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-brand-primary rounded-lg flex items-center justify-center border-2 border-[#0D0D0D] shadow-lg">
                                    <CheckCircle className="w-3 h-3 text-white" />
                                </div>
                            </div>

                            <div className="pr-8">
                                <h2 className="text-white text-lg font-black tracking-tight mb-1 uppercase">{user.name}</h2>
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                    <span className="text-brand-primary text-[8px] font-black uppercase tracking-[0.2em]">ESCRITOR PREMIUM</span>
                                </div>
                            </div>
                        </m.div>
                    </div>

                    {/* Tabs - Modernized */}
                    <div className="flex flex-wrap justify-center md:justify-start gap-4 p-2 bg-white/[0.02] border border-white/5 rounded-3xl backdrop-blur-xl max-w-fit mx-auto md:mx-0">
                        {[
                            { id: 'manuscripts', label: 'OBRAS', icon: FileText },
                            { id: 'submit', label: 'SUBMETER', icon: Upload },
                            { id: 'royalties', label: 'FINANCEIRO', icon: CreditCard },
                            { id: 'banking', label: 'PROTOCOLOS', icon: Settings }
                        ].map((tab) => (
                            <m.button
                                whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.05)' }}
                                whileTap={{ scale: 0.98 }}
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`px-8 py-4 rounded-2xl font-black text-[9px] uppercase tracking-[0.3em] transition-all flex items-center gap-4 relative overflow-hidden group
                                    ${activeTab === tab.id
                                        ? 'bg-brand-primary text-white shadow-[0_20px_40px_-10px_rgba(189,147,56,0.3)]'
                                        : 'text-gray-500 hover:text-white'
                                    }`}
                            >
                                <tab.icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${activeTab === tab.id ? 'text-white' : 'text-brand-primary'}`} />
                                <span className="relative z-10">{tab.label}</span>
                                {activeTab === tab.id && (
                                    <m.div
                                        layoutId="tab-pill-auth"
                                        className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"
                                    />
                                )}
                            </m.button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Content Area */}
            <section className="py-20 md:py-32 -mt-12 md:-mt-16 relative z-20">
                <div className="container mx-auto px-6 md:px-8">
                    <AnimatePresence mode="wait">
                        <m.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-white/5 backdrop-blur-3xl rounded-[4rem] border border-white/5 p-12 md:p-20 min-h-[700px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-primary/20 to-transparent" />
                            {/* Manuscripts Tab */}
                            {activeTab === 'manuscripts' && (
                                <div className="space-y-12">
                                    <div className="flex items-center justify-between mb-8">
                                        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase leading-none">
                                            Meus <span className="text-brand-primary italic font-light lowercase">Manuscritos</span>
                                        </h2>
                                    </div>
                                    <div className="grid gap-6">
                                        {isLoadingManuscripts ? (
                                            <div className="text-center py-20 text-gray-500 italic font-black uppercase text-[10px] tracking-widest">Sincronizando arquivos...</div>
                                        ) : manuscripts.length > 0 ? (
                                            manuscripts.map((manuscript) => (
                                                <div key={manuscript.id} className="bg-white/[0.03] rounded-3xl border border-white/5 p-8 hover:bg-white/[0.05] transition-all group">
                                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                                                        <div className="flex-1">
                                                            <h3 className="text-2xl font-black text-white mb-2 group-hover:text-brand-primary transition-colors">{manuscript.title}</h3>
                                                            <div className="flex flex-wrap gap-4 text-[10px] font-black uppercase tracking-widest text-gray-500">
                                                                <span className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-lg border border-white/5">
                                                                    <FileText className="w-3 h-3 text-brand-primary" />
                                                                    {manuscript.genre}
                                                                </span>
                                                                <span className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-lg border border-white/5">
                                                                    Submetido: {new Date(manuscript.submittedDate).toLocaleDateString('pt-AO')}
                                                                </span>
                                                                {manuscript.reviewedDate && (
                                                                    <span className="flex items-center gap-2 px-3 py-1 bg-brand-primary/10 rounded-lg border border-brand-primary/10 text-brand-primary">
                                                                        Analisado: {new Date(manuscript.reviewedDate).toLocaleDateString('pt-AO')}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-4">
                                                            <div className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] border ${getStatusColor(manuscript.status)}`}>
                                                                {getStatusIcon(manuscript.status)}
                                                                {getStatusText(manuscript.status)}
                                                            </div>
                                                            <a
                                                                href={manuscript.fileUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                title="Ver manuscrito"
                                                                aria-label="Ver ficheiro do manuscrito"
                                                                className="w-12 h-12 bg-white/5 hover:bg-brand-primary/20 rounded-xl flex items-center justify-center border border-white/5 text-gray-400 hover:text-brand-primary transition-all"
                                                            >
                                                                <Eye className="w-5 h-5" />
                                                            </a>
                                                        </div>
                                                    </div>

                                                    {manuscript.feedback && (
                                                        <div className="mt-6 p-6 bg-brand-primary/5 rounded-2xl border border-brand-primary/10">
                                                            <p className="text-[9px] font-black text-brand-primary uppercase tracking-[0.3em] mb-2">Comentário Editorial</p>
                                                            <p className="text-sm text-gray-400 font-medium italic leading-relaxed">"{manuscript.feedback}"</p>
                                                        </div>
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="bg-white/5 rounded-3xl p-20 text-center border-2 border-dashed border-white/10">
                                                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8">
                                                    <FileText className="w-10 h-10 text-brand-primary opacity-50" />
                                                </div>
                                                <p className="text-gray-500 font-black uppercase text-[11px] tracking-[0.3em]">Nenhum manuscrito identificado</p>
                                                <button
                                                    onClick={() => setActiveTab('submit')}
                                                    className="px-10 py-4 mt-10 bg-brand-primary hover:bg-brand-primary/90 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl transition-all shadow-xl shadow-brand-primary/20"
                                                >
                                                    Submeter Primeira Obra
                                                </button>
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
                                            {submitErrors.form && (
                                                <div className="p-4 bg-red-50 border border-red-200 rounded-xl mb-6">
                                                    <p className="text-red-600 text-sm font-bold flex items-center gap-2">
                                                        <XCircle className="w-5 h-5" />
                                                        {submitErrors.form}
                                                    </p>
                                                </div>
                                            )}
                                            <div className="form-group-premium">
                                                <label className="label-premium">
                                                    Título da Obra *
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={submitData.title}
                                                    onChange={e => {
                                                        setSubmitData(prev => ({ ...prev, title: e.target.value }));
                                                        if (submitErrors.title) setSubmitErrors(prev => ({ ...prev, title: '' }));
                                                    }}
                                                    className={`input-premium ${submitErrors.title ? 'border-red-500 bg-red-50' : ''}`}
                                                    placeholder="Digite o título"
                                                />
                                                {submitErrors.title && <p className="text-red-500 text-[10px] mt-1 font-bold italic">{submitErrors.title}</p>}
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div className="form-group-premium">
                                                    <label className="label-premium">
                                                        Género Literário *
                                                    </label>
                                                    <select
                                                        required
                                                        aria-label="Género Literário"
                                                        value={submitData.genre}
                                                        onChange={e => {
                                                            setSubmitData(prev => ({ ...prev, genre: e.target.value }));
                                                            if (submitErrors.genre) setSubmitErrors(prev => ({ ...prev, genre: '' }));
                                                        }}
                                                        className={`input-premium ${submitErrors.genre ? 'border-red-500 bg-red-50' : ''}`}
                                                    >
                                                        <option value="">Selecione...</option>
                                                        <option value="Ficção">Ficção</option>
                                                        <option value="Não-Ficção">Não-Ficção</option>
                                                        <option value="Técnico">Técnico</option>
                                                        <option value="Infantil">Infantil</option>
                                                        <option value="Poesia">Poesia</option>
                                                        <option value="Literatura Angolana">Literatura Angolana</option>
                                                    </select>
                                                    {submitErrors.genre && <p className="text-red-500 text-[10px] mt-1 font-bold italic">{submitErrors.genre}</p>}
                                                </div>

                                                <div className="form-group-premium">
                                                    <label className="label-premium">
                                                        Número de Páginas
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={submitData.pages}
                                                        onChange={e => setSubmitData(prev => ({ ...prev, pages: e.target.value }))}
                                                        className="input-premium"
                                                        placeholder="Ex: 250"
                                                    />
                                                </div>
                                            </div>

                                            <div className="form-group-premium">
                                                <label htmlFor="ms-description" className="label-premium">
                                                    Sinopse *
                                                </label>
                                                <textarea
                                                    id="ms-description"
                                                    required
                                                    spellCheck="false"
                                                    autoComplete="off"
                                                    data-gramm="false"
                                                    rows={6}
                                                    value={submitData.description}
                                                    onChange={e => {
                                                        setSubmitData(prev => ({ ...prev, description: e.target.value }));
                                                        if (submitErrors.description) setSubmitErrors(prev => ({ ...prev, description: '' }));
                                                    }}
                                                    className={`input-premium h-32 resize-none ${submitErrors.description ? 'border-red-500 bg-red-50' : ''}`}
                                                    placeholder="Descreva brevemente a sua obra..."
                                                />
                                                {submitErrors.description && <p className="text-red-500 text-[10px] mt-1 font-bold italic">{submitErrors.description}</p>}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-bold text-brand-dark mb-2 uppercase tracking-wider">
                                                    Manuscrito (PDF, DOCX) *
                                                </label>
                                                <div className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-all cursor-pointer ${submitErrors.file ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-brand-primary'}`}>
                                                    <input
                                                        type="file"
                                                        required
                                                        accept=".pdf,.docx,.doc"
                                                        title="Carregar manuscrito"
                                                        aria-label="Carregar manuscrito"
                                                        onChange={e => {
                                                            if (e.target.files && e.target.files[0]) {
                                                                setSelectedFile(e.target.files[0]);
                                                                if (submitErrors.file) setSubmitErrors(prev => ({ ...prev, file: '' }));
                                                            }
                                                        }}
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
                                                            {submitErrors.file && <p className="text-red-500 text-[10px] mt-2 font-bold italic">{submitErrors.file}</p>}
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={submitLoading}
                                                className="w-full btn-premium py-4 justify-center text-lg disabled:opacity-50"
                                            >
                                                {submitLoading ? (
                                                    <>
                                                        <Loader2 className="w-5 h-5 animate-spin" />
                                                        <span>Submetendo...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Upload className="w-5 h-5" />
                                                        <span>Submeter Manuscrito</span>
                                                    </>
                                                )}
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            )}

                            {/* Royalties Tab */}
                            {activeTab === 'royalties' && (
                                <div className="space-y-12">
                                    <h2 className="text-3xl md:text-5xl font-black text-brand-dark tracking-tighter uppercase leading-none">
                                        Royalties e <span className="text-gradient-gold italic font-light lowercase">Vendas</span>
                                    </h2>
                                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                                        <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                                            <p className="text-gray-500 font-bold text-xs uppercase tracking-widest mb-2 opacity-60">Total de Vendas</p>
                                            <p className="text-4xl font-black text-brand-dark">{isLoadingStats ? '...' : authorStats.totalSales}</p>
                                        </div>
                                        <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                                            <p className="text-gray-500 font-bold text-xs uppercase tracking-widest mb-2 opacity-60">Royalties Acumulados</p>
                                            <p className="text-4xl font-black text-brand-primary">{isLoadingStats ? '...' : authorStats.totalRoyalties.toLocaleString()} Kz</p>
                                        </div>
                                        <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                                            <p className="text-gray-500 font-bold text-xs uppercase tracking-widest mb-2 opacity-60">Livros Publicados</p>
                                            <p className="text-4xl font-black text-brand-dark">{isLoadingStats ? '...' : authorStats.publishedBooks}</p>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
                                        <div className="p-8 border-b border-gray-50 bg-gray-50/50">
                                            <h3 className="text-lg font-black text-brand-dark uppercase tracking-tight">Histórico de Pagamentos</h3>
                                        </div>
                                        <div className="overflow-x-auto">
                                            <table className="w-full">
                                                <thead className="bg-gray-50/30">
                                                    <tr>
                                                        <th className="px-8 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Mês</th>
                                                        <th className="px-8 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Livro</th>
                                                        <th className="px-8 py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Vendas</th>
                                                        <th className="px-8 py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Valor</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-50">
                                                    {isLoadingStats ? (
                                                        <tr>
                                                            <td colSpan={4} className="px-8 py-12 text-center text-gray-400 italic font-bold">Carregando histórico...</td>
                                                        </tr>
                                                    ) : confirmedSales.length > 0 ? (
                                                        confirmedSales.map((sale) => (
                                                            <tr key={sale.id} className="hover:bg-gray-50/50 transition-colors">
                                                                <td className="px-8 py-6 text-sm font-bold text-gray-500">
                                                                    {new Date(sale.date).toLocaleDateString('pt-AO', { month: 'short', year: 'numeric' })}
                                                                </td>
                                                                <td className="px-8 py-6 text-sm font-black text-brand-dark">{sale.bookTitle}</td>
                                                                <td className="px-8 py-6 text-sm text-gray-500 text-right font-bold">{sale.quantity}</td>
                                                                <td className="px-8 py-6 text-sm font-black text-brand-primary text-right">{sale.royalty.toLocaleString()} Kz</td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan={4} className="px-8 py-12 text-center text-gray-400 italic font-bold">Nenhuma venda registada até ao momento.</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Banking Details Tab */}
                            {activeTab === 'banking' && (
                                <div className="space-y-12">
                                    <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-6">
                                        <h2 className="text-3xl md:text-5xl font-black text-brand-dark tracking-tighter uppercase leading-none">
                                            Dados <span className="text-gradient-gold italic font-light lowercase">Bancários</span>
                                        </h2>
                                        <button
                                            onClick={handleSaveProfile}
                                            disabled={isSaving}
                                            className="btn-premium px-10 py-5 shadow-2xl shadow-brand-primary/20"
                                        >
                                            {isSaving ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    <span>Salvando...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="w-5 h-5" />
                                                    <span>Guardar Alterações</span>
                                                </>
                                            )}
                                        </button>
                                    </div>

                                    <div className="grid lg:grid-cols-2 gap-12">
                                        {/* Bank Accounts */}
                                        <div className="space-y-8">
                                            <div className="bg-gray-50 rounded-[2.5rem] p-10 border border-gray-100">
                                                <h3 className="text-xl font-black text-brand-dark mb-8 uppercase tracking-tight">Contas para Recebimento</h3>

                                                <div className="space-y-4 mb-10">
                                                    {bankAccounts.map((acc: import('../types').BankInfo, index: number) => (
                                                        <div key={index} className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 relative group transition-all hover:shadow-md">
                                                            <div className="font-black text-brand-dark mb-1">{acc.bankName}</div>
                                                            <div className="text-sm text-gray-500 font-bold mb-1">Conta: {acc.accountNumber}</div>
                                                            <div className="text-[10px] text-gray-400 font-mono tracking-tighter break-all">IBAN: {acc.iban}</div>
                                                            {acc.isPrimary && (
                                                                <span className="absolute top-6 right-6 bg-brand-primary/10 text-brand-primary text-[9px] px-3 py-1 rounded-full font-black uppercase tracking-widest">Principal</span>
                                                            )}
                                                            <button
                                                                onClick={() => setBankAccounts((prev: import('../types').BankInfo[]) => prev.filter((_: any, i: number) => i !== index))}
                                                                className="absolute bottom-6 right-6 text-red-500 hover:scale-110 transition-transform opacity-0 group-hover:opacity-100 font-black text-[9px] uppercase tracking-widest"
                                                            >
                                                                Eliminar
                                                            </button>
                                                        </div>
                                                    ))}
                                                    {bankAccounts.length === 0 && (
                                                        <p className="text-gray-400 text-center py-8 italic font-bold">Nenhuma conta registada.</p>
                                                    )}
                                                </div>

                                                <div className="space-y-4 pt-8 border-t border-gray-200">
                                                    <h4 className="font-black text-brand-dark text-xs uppercase tracking-[0.2em] mb-4">Adicionar Nova Conta</h4>
                                                    <div className="space-y-4">
                                                        <input id="new-bank-name" type="text" placeholder="Nome do Banco" className="input-premium" />
                                                        <input id="new-bank-acc" type="text" placeholder="Número de Conta" className="input-premium" />
                                                        <input id="new-bank-iban" type="text" placeholder="IBAN" className="input-premium" />
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
                                                            className="w-full py-4 bg-brand-dark text-white rounded-[1.5rem] font-black uppercase text-[10px] tracking-[0.3em] hover:bg-brand-primary transition-all shadow-xl shadow-brand-dark/20"
                                                        >
                                                            Confirmar Adição
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Contact Details */}
                                        <div className="space-y-8">
                                            <div className="bg-gray-50 rounded-[2.5rem] p-10 border border-gray-100">
                                                <h3 className="text-xl font-black text-brand-dark mb-8 uppercase tracking-tight">Contacto de Notificação</h3>
                                                <div className="form-group-premium">
                                                    <label className="label-premium">Número de WhatsApp *</label>
                                                    <div className="relative">
                                                        <span className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-400 font-black">+244</span>
                                                        <input
                                                            type="tel"
                                                            value={whatsapp}
                                                            onChange={(e) => setWhatsapp(e.target.value)}
                                                            className="input-premium !pl-20"
                                                            placeholder="9XX XXX XXX"
                                                        />
                                                    </div>
                                                    <p className="text-xs text-brand-primary font-bold mt-4 italic opacity-80 leading-relaxed">
                                                        Usaremos este canal para enviar relatórios de vendas e comprovativos.
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="bg-brand-primary/5 border border-brand-primary/10 rounded-[2.5rem] p-10 relative overflow-hidden">
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                                                <h4 className="font-black text-brand-primary mb-4 uppercase text-xs tracking-widest">Conselho Editorial</h4>
                                                <p className="text-sm text-gray-700 leading-relaxed font-bold opacity-80">
                                                    Mantenha seus dados sempre atualizados. A Editora Graça processa os pagamentos de royalties mensalmente com base nestas informações.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </m.div>
                    </AnimatePresence>
                </div>
            </section>
        </div>
    );
};

export default AuthorDashboard;
