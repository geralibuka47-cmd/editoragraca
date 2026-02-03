import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Upload, Eye, CheckCircle, Clock, XCircle, User as UserIcon, Loader2, Save, Sparkles, ChevronRight, ArrowRight, CreditCard, Settings, Trash2, Plus } from 'lucide-react';
import { motion as m, AnimatePresence } from 'framer-motion';
import { useToast } from '../components/Toast';
import { ViewState, User, BankInfo } from '../types';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Button } from '../components/ui/Button';

interface AuthorDashboardProps {
    user: User | null;
}

// Schema for Manuscript Submission
const manuscriptSchema = z.object({
    title: z.string().min(2, 'Título é obrigatório'),
    genre: z.string().min(1, 'Selecione um género'),
    pages: z.coerce.number().min(1, 'Número de páginas deve ser maior que 0').optional(),
    description: z.string().min(10, 'A sinopse deve ser detalhada'),
    // File validation is handled separately as it's a File object, but we can validate presence
});

type ManuscriptFormData = z.infer<typeof manuscriptSchema>;

// Schema for Profile Settings
const bankAccountSchema = z.object({
    bankName: z.string().min(1, 'Banco é obrigatório'),
    accountNumber: z.string().min(1, 'Conta é obrigatória'),
    iban: z.string().min(1, 'IBAN é obrigatório'),
    isPrimary: z.boolean().default(false),
});

const profileSchema = z.object({
    whatsappNumber: z.string().optional(),
    paymentMethods: z.array(bankAccountSchema),
});

type ProfileFormData = z.infer<typeof profileSchema>;


const AuthorDashboard: React.FC<AuthorDashboardProps> = ({ user }) => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [activeTab, setActiveTab] = useState<'manuscripts' | 'submit' | 'royalties' | 'banking'>('manuscripts');
    const [manuscripts, setManuscripts] = useState<import('../types').Manuscript[]>([]);
    const [isLoadingManuscripts, setIsLoadingManuscripts] = useState(false);
    const [authorStats, setAuthorStats] = useState({ publishedBooks: 0, totalSales: 0, totalRoyalties: 0 });
    const [confirmedSales, setConfirmedSales] = useState<any[]>([]);
    const [isLoadingStats, setIsLoadingStats] = useState(false);

    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // Manuscript Form
    const {
        register: registerManuscript,
        handleSubmit: handleSubmitManuscript,
        reset: resetManuscript,
        formState: { errors: manuscriptErrors, isSubmitting: isSubmittingManuscript }
    } = useForm<ManuscriptFormData>({
        resolver: zodResolver(manuscriptSchema)
    });

    // Profile Form
    const {
        register: registerProfile,
        handleSubmit: handleSubmitProfile,
        control: controlProfile,
        formState: { errors: profileErrors, isSubmitting: isSubmittingProfile }
    } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            whatsappNumber: user?.whatsappNumber || '',
            paymentMethods: user?.paymentMethods || [],
        }
    });

    const { fields: bankFields, append: appendBank, remove: removeBank } = useFieldArray({
        control: controlProfile,
        name: "paymentMethods"
    });

    // Temp state for new bank account input
    const [newBank, setNewBank] = useState({ bankName: '', accountNumber: '', iban: '' });


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


    const onSubmitManuscript = async (data: ManuscriptFormData) => {
        if (!user) return;
        if (!selectedFile) {
            showToast('Por favor, carregue o ficheiro do manuscrito.', 'error');
            return;
        }

        try {
            const { uploadManuscriptFile } = await import('../services/storageService');
            const { createManuscript } = await import('../services/dataService');

            const { fileUrl } = await uploadManuscriptFile(selectedFile);

            await createManuscript({
                authorId: user.id,
                authorName: user.name,
                title: data.title.trim(),
                genre: data.genre,
                pages: data.pages,
                description: data.description.trim(),
                fileUrl: fileUrl,
                fileName: selectedFile.name,
                status: 'pending',
                submittedDate: new Date().toISOString()
            });

            showToast('Manuscrito submetido com sucesso! A nossa equipa irá analisar e entrará em contacto brevemente.', 'success');
            resetManuscript();
            setSelectedFile(null);
            setActiveTab('manuscripts');
        } catch (error: any) {
            console.error('Erro ao submeter:', error);
            showToast('Erro ao submeter manuscrito.', 'error');
        }
    };

    const onSubmitProfile = async (data: ProfileFormData) => {
        if (!user) return;
        try {
            const { saveUserProfile } = await import('../services/dataService');
            await saveUserProfile({
                ...user,
                paymentMethods: data.paymentMethods as BankInfo[],
                whatsappNumber: data.whatsappNumber || ''
            });
            showToast('Perfil atualizado com sucesso!', 'success');
        } catch (error) {
            console.error('Erro ao salvar perfil:', error);
            showToast('Erro ao salvar alterações.', 'error');
        }
    };

    // Helper to add bank account from the quick/dumb inputs to the form array
    const handleAddBank = () => {
        if (newBank.bankName && newBank.accountNumber && newBank.iban) {
            appendBank({ ...newBank, isPrimary: false });
            setNewBank({ bankName: '', accountNumber: '', iban: '' });
        } else {
            showToast('Preencha todos os campos bancários', 'error');
        }
    };


    const getStatusColor = (status: 'approved' | 'pending' | 'rejected') => {
        switch (status) {
            case 'approved': return 'text-green-600 bg-green-100';
            case 'pending': return 'text-yellow-600 bg-yellow-100';
            case 'rejected': return 'text-red-600 bg-red-100';
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
                        className="px-8 py-3 bg-brand-primary text-white font-bold rounded-xl"
                    >
                        Tornar-se Autor
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-brand-primary/30 font-sans">
            {/* 1. COVER AREA */}
            <div className="h-[350px] relative w-full overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent z-10" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=2573&auto=format&fit=crop')] bg-cover bg-center opacity-40 group-hover:scale-105 transition-transform duration-1000" />

                {/* Top Nav Overlay */}
                <div className="absolute top-0 left-0 right-0 p-8 flex justify-between items-start z-20">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-3 px-4 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10 hover:bg-white/10 transition-all group/back"
                        title="Voltar ao site"
                        aria-label="Voltar ao site"
                    >
                        <ArrowRight className="w-4 h-4 text-white rotate-180 group-hover/back:-translate-x-1 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Voltar ao Site</span>
                    </button>

                    <button
                        onClick={() => navigate('/entrar')}
                        className="w-10 h-10 flex items-center justify-center bg-red-500/20 backdrop-blur-md rounded-full border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                        title="Sair"
                        aria-label="Terminar Sessão"
                    >
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* 2. PROFILE HEADER & NAV DOCK */}
            <div className="container mx-auto px-4 md:px-8 relative z-20 -mt-24">
                <div className="flex flex-col md:flex-row items-end gap-8 mb-8">
                    {/* Avatar */}
                    <div className="relative group/avatar">
                        <div className="w-40 h-40 md:w-48 md:h-48 rounded-full border-4 border-[#050505] bg-[#1a1a1a] overflow-hidden shadow-2xl relative z-10">
                            <div className="w-full h-full flex items-center justify-center bg-brand-primary/10 text-brand-primary font-black text-5xl">
                                {user.name.charAt(0)}
                            </div>
                        </div>
                        <div className="absolute bottom-4 right-4 z-20 w-8 h-8 bg-brand-primary rounded-full border-4 border-[#050505] flex items-center justify-center shadow-lg" title="Autor Verificado">
                            <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                    </div>

                    {/* Identity Info */}
                    <div className="flex-1 pb-4 text-center md:text-left">
                        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-2">{user.name}</h1>
                        <p className="text-gray-400 font-medium text-sm tracking-wide flex items-center justify-center md:justify-start gap-2">
                            <span className="text-brand-primary font-black uppercase tracking-[0.2em] text-[10px]">@{user.role}</span>
                            <span className="w-1 h-1 rounded-full bg-gray-600" />
                            <span className="text-gray-500 italic">Membro desde 2024</span>
                        </p>
                    </div>

                    {/* Action Bar */}
                    <div className="flex gap-3 pb-4">
                        <button
                            onClick={() => setActiveTab('banking')}
                            className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center gap-2"
                            title="Editar Perfil e Pagamentos"
                            aria-label="Editar Perfil"
                        >
                            <Settings className="w-4 h-4" />
                            <span>Definições</span>
                        </button>
                    </div>
                </div>

                {/* Sticky Nav Dock */}
                <div className="sticky top-4 z-50 bg-[#050505]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-2 mb-8 shadow-2xl flex flex-wrap justify-center md:justify-start gap-1">
                    {[
                        { id: 'manuscripts', label: 'Obras', icon: FileText },
                        { id: 'submit', label: 'Submeter', icon: Upload },
                        { id: 'royalties', label: 'Financeiro', icon: CreditCard },
                        { id: 'banking', label: 'Protocolos', icon: Settings }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`px-6 py-3 rounded-xl flex items-center gap-3 transition-all ${activeTab === tab.id
                                ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                            title={tab.label}
                            aria-label={tab.label}
                        >
                            <tab.icon className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* 3. CONTENT GRID */}
                <div className="grid lg:grid-cols-[350px_1fr] gap-8 pb-20">

                    {/* LEFT SIDEBAR (INTRO) */}
                    <div className="space-y-6">
                        {/* Intro Card */}
                        <div className="bg-white/5 border border-white/5 rounded-3xl p-8 backdrop-blur-sm">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-6">Autor ID</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 text-sm text-gray-300">
                                    <UserIcon className="w-4 h-4 text-brand-primary" />
                                    <span className="font-medium">{user.name}</span>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-gray-300">
                                    <Clock className="w-4 h-4 text-brand-primary" />
                                    <span className="font-medium truncate">Online Agora</span>
                                </div>
                                {user.whatsappNumber && (
                                    <div className="flex items-center gap-4 text-sm text-gray-300">
                                        <div className="w-4 h-4 flex items-center justify-center font-serif text-brand-primary text-xs font-bold">W</div>
                                        <span className="font-medium">{user.whatsappNumber}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="bg-white/5 border border-white/5 rounded-3xl p-8 backdrop-blur-sm">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-6">Performance</h3>
                            <div className="space-y-6">
                                <div>
                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Total Vendas</p>
                                    <p className="text-2xl font-black text-white">{authorStats.totalSales}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Royalties</p>
                                    <p className="text-2xl font-black text-brand-primary">{authorStats.totalRoyalties.toLocaleString()} Kz</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Manuscritos</p>
                                    <p className="text-2xl font-black text-white">{manuscripts.length}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* MAIN FEED (CONTENT) */}
                    <div className="min-h-[500px]">
                        <AnimatePresence mode="wait">
                            <m.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {/* MANUSCRIPTS TAB */}
                                {activeTab === 'manuscripts' && (
                                    <div className="bg-white/5 border border-white/5 rounded-[2.5rem] p-8 md:p-12">
                                        <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                            <div>
                                                <h2 className="text-3xl font-black uppercase italic tracking-tighter">Minhas Obras</h2>
                                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Gestão de Manuscritos</p>
                                            </div>
                                            <button
                                                onClick={() => setActiveTab('submit')}
                                                className="px-6 py-3 bg-brand-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all flex items-center gap-2"
                                                title="Novo Manuscrito"
                                                aria-label="Submeter Manuscrito"
                                            >
                                                <Upload className="w-4 h-4" />
                                                Submeter Novo
                                            </button>
                                        </div>

                                        <div className="grid gap-4">
                                            {isLoadingManuscripts ? (
                                                <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-brand-primary animate-spin" /></div>
                                            ) : manuscripts.length > 0 ? (
                                                manuscripts.map((item) => (
                                                    <div key={item.id} className="bg-black/20 rounded-3xl p-6 border border-white/5 flex flex-col md:flex-row gap-6 items-start">
                                                        <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-gray-500 flex-shrink-0">
                                                            <FileText className="w-6 h-6" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex flex-col md:flex-row md:justify-between mb-2">
                                                                <h3 className="text-xl font-black text-white">{item.title}</h3>
                                                                <div className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest inline-flex items-center gap-2 w-fit mt-2 md:mt-0 ${item.status === 'approved' ? 'bg-green-500/10 text-green-500' :
                                                                    item.status === 'rejected' ? 'bg-red-500/10 text-red-500' : 'bg-yellow-500/10 text-yellow-500'
                                                                    }`}>
                                                                    {item.status === 'approved' && <CheckCircle className="w-3 h-3" />}
                                                                    {item.status === 'rejected' && <XCircle className="w-3 h-3" />}
                                                                    {item.status === 'pending' && <Clock className="w-3 h-3" />}
                                                                    {getStatusText(item.status)}
                                                                </div>
                                                            </div>
                                                            <p className="text-sm text-gray-400 mb-4 line-clamp-2">{item.description}</p>
                                                            <div className="flex items-center gap-4 text-xs text-gray-500 font-bold uppercase tracking-wider">
                                                                <span>{item.genre}</span>
                                                                <span className="w-1 h-1 bg-gray-700 rounded-full" />
                                                                <span>{item.pages ? `${item.pages} Páginas` : 'N/A'}</span>
                                                                <span className="w-1 h-1 bg-gray-700 rounded-full" />
                                                                <span>{new Date(item.submittedDate).toLocaleDateString()}</span>
                                                            </div>
                                                            {item.feedback && (
                                                                <div className="mt-4 p-4 bg-brand-primary/5 border border-brand-primary/10 rounded-xl">
                                                                    <p className="text-[9px] font-black text-brand-primary uppercase tracking-widest mb-1">Feedback Editorial</p>
                                                                    <p className="text-xs text-gray-300 italic">"{item.feedback}"</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-center py-20 text-gray-600">
                                                    <FileText className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                                    <p className="text-sm font-medium">Você ainda não submeteu nenhum manuscrito.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* SUBMIT TAB */}
                                {activeTab === 'submit' && (
                                    <div className="bg-white/5 border border-white/5 rounded-[2.5rem] p-8 md:p-12">
                                        <div className="mb-10">
                                            <h2 className="text-3xl font-black uppercase italic tracking-tighter">Submeter</h2>
                                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Envio de Novos Manuscritos</p>
                                        </div>

                                        <form onSubmit={handleSubmitManuscript(onSubmitManuscript)} className="space-y-6 max-w-2xl">
                                            <Input
                                                label="Título da Obra *"
                                                placeholder="Título do Livro"
                                                {...registerManuscript('title')}
                                                error={manuscriptErrors.title?.message}
                                                className="bg-black/20 border-white/10 text-white placeholder:text-gray-500"
                                            />

                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 pl-2">Género *</label>
                                                    <select
                                                        {...registerManuscript('genre')}
                                                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-primary outline-none transition-colors font-bold appearance-none"
                                                    >
                                                        <option value="" className="bg-black text-gray-500">Selecione...</option>
                                                        <option value="Ficção" className="bg-black">Ficção</option>
                                                        <option value="Não-Ficção" className="bg-black">Não-Ficção</option>
                                                        <option value="Poesia" className="bg-black">Poesia</option>
                                                        <option value="Técnico" className="bg-black">Técnico</option>
                                                    </select>
                                                    {manuscriptErrors.genre && <span className="text-red-500 text-xs font-bold">{manuscriptErrors.genre.message}</span>}
                                                </div>
                                                <Input
                                                    type="number"
                                                    label="Páginas"
                                                    placeholder="Ex: 200"
                                                    {...registerManuscript('pages')}
                                                    error={manuscriptErrors.pages?.message}
                                                    className="bg-black/20 border-white/10 text-white placeholder:text-gray-500"
                                                />
                                            </div>

                                            <Textarea
                                                label="Sinopse *"
                                                placeholder="Breve descrição da obra..."
                                                rows={5}
                                                {...registerManuscript('description')}
                                                error={manuscriptErrors.description?.message}
                                                className="bg-black/20 border-white/10 text-white placeholder:text-gray-500 resize-none"
                                            />

                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 pl-2">Arquivo (PDF/DOCX) *</label>
                                                <div className="relative border-2 border-dashed border-white/10 rounded-2xl p-8 text-center hover:border-brand-primary/50 transition-colors group cursor-pointer bg-white/[0.02]">
                                                    <input
                                                        type="file"
                                                        accept=".pdf,.docx,.doc"
                                                        onChange={e => e.target.files && setSelectedFile(e.target.files[0])}
                                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                                        title="Carregar Arquivo"
                                                        aria-label="Carregar Arquivo"
                                                    />
                                                    {selectedFile ? (
                                                        <div className="flex flex-col items-center">
                                                            <CheckCircle className="w-8 h-8 text-green-500 mb-2" />
                                                            <p className="font-bold text-white">{selectedFile.name}</p>
                                                            <p className="text-xs text-gray-500">Clique para alterar</p>
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col items-center">
                                                            <Upload className="w-8 h-8 text-gray-500 group-hover:text-brand-primary transition-colors mb-2" />
                                                            <p className="font-bold text-gray-400">Carregar Manuscrito</p>
                                                            <p className="text-xs text-gray-600">Máx 50MB</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="pt-4">
                                                <Button
                                                    type="submit"
                                                    isLoading={isSubmittingManuscript}
                                                    disabled={isSubmittingManuscript}
                                                    className="w-full py-4 text-white hover:brightness-110"
                                                    leftIcon={!isSubmittingManuscript && <Upload className="w-5 h-5" />}
                                                >
                                                    Submeter Obra
                                                </Button>
                                            </div>
                                        </form>
                                    </div>
                                )}

                                {/* FINANCEIRO (ROYALTIES) TAB */}
                                {activeTab === 'royalties' && (
                                    <div className="bg-white/5 border border-white/5 rounded-[2.5rem] p-8 md:p-12">
                                        <div className="mb-10">
                                            <h2 className="text-3xl font-black uppercase italic tracking-tighter">Financeiro</h2>
                                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Relatório de Vendas e Royalties</p>
                                        </div>

                                        <div className="grid md:grid-cols-3 gap-6 mb-10">
                                            <div className="bg-black/20 p-6 rounded-2xl border border-white/5">
                                                <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-2">Total Vendas</p>
                                                <p className="text-3xl font-black text-white">{authorStats.totalSales}</p>
                                            </div>
                                            <div className="bg-black/20 p-6 rounded-2xl border border-white/5">
                                                <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-2">Royalties</p>
                                                <p className="text-3xl font-black text-brand-primary">{authorStats.totalRoyalties.toLocaleString()} Kz</p>
                                            </div>
                                            <div className="bg-black/20 p-6 rounded-2xl border border-white/5">
                                                <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-2">Obras Publicadas</p>
                                                <p className="text-3xl font-black text-white">{authorStats.publishedBooks}</p>
                                            </div>
                                        </div>

                                        <div className="overflow-x-auto bg-black/20 rounded-2xl border border-white/5 p-2">
                                            <table className="w-full text-left">
                                                <thead className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 border-b border-white/5">
                                                    <tr>
                                                        <th className="p-4">Data</th>
                                                        <th className="p-4">Obra</th>
                                                        <th className="p-4 text-right">Qtd</th>
                                                        <th className="p-4 text-right">Royalty</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-white/5">
                                                    {confirmedSales.length > 0 ? confirmedSales.map((sale) => (
                                                        <tr key={sale.id} className="hover:bg-white/5 transition-colors">
                                                            <td className="p-4 text-xs font-bold text-gray-400">{new Date(sale.date).toLocaleDateString()}</td>
                                                            <td className="p-4 text-sm font-black text-white">{sale.bookTitle}</td>
                                                            <td className="p-4 text-xs font-bold text-gray-400 text-right">{sale.quantity}</td>
                                                            <td className="p-4 text-sm font-black text-brand-primary text-right">{sale.royalty.toLocaleString()} Kz</td>
                                                        </tr>
                                                    )) : (
                                                        <tr>
                                                            <td colSpan={4} className="p-8 text-center text-gray-500 text-xs">Sem registos de vendas confirmadas.</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}

                                {/* PROTOCOLOS (BANKING/SETTINGS) TAB */}
                                {activeTab === 'banking' && (
                                    <div className="bg-white/5 border border-white/5 rounded-[2.5rem] p-8 md:p-12">
                                        <div className="mb-10">
                                            <h2 className="text-3xl font-black uppercase italic tracking-tighter">Protocolos</h2>
                                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Dados Bancários e Contacto</p>
                                        </div>

                                        <div className="grid lg:grid-cols-2 gap-12">
                                            <div className="space-y-8">
                                                <h3 className="text-sm font-black text-white uppercase tracking-widest border-b border-white/10 pb-2">Contas Bancárias</h3>
                                                {bankFields.map((field, index) => (
                                                    <div key={field.id} className="bg-black/20 p-6 rounded-2xl border border-white/5 relative group">
                                                        <p className="font-black text-white uppercase">{field.bankName}</p>
                                                        <p className="text-xs text-gray-400 font-mono mt-1">{field.iban}</p>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeBank(index)}
                                                            className="absolute top-4 right-4 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity text-xs hover:underline"
                                                            title="Remover Conta"
                                                            aria-label="Remover Conta"
                                                        >
                                                            Remover
                                                        </button>
                                                    </div>
                                                ))}

                                                <div className="space-y-4 pt-4">
                                                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-500">Adicionar Nova Conta</p>
                                                    <Input
                                                        value={newBank.bankName}
                                                        onChange={(e) => setNewBank({ ...newBank, bankName: e.target.value })}
                                                        placeholder="Nome do Banco"
                                                        className="bg-black/20 border-white/10 text-white"
                                                    />
                                                    <Input
                                                        value={newBank.accountNumber}
                                                        onChange={(e) => setNewBank({ ...newBank, accountNumber: e.target.value })}
                                                        placeholder="Número de Conta"
                                                        className="bg-black/20 border-white/10 text-white"
                                                    />
                                                    <Input
                                                        value={newBank.iban}
                                                        onChange={(e) => setNewBank({ ...newBank, iban: e.target.value })}
                                                        placeholder="IBAN"
                                                        className="bg-black/20 border-white/10 text-white"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={handleAddBank}
                                                        className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest text-white transition-all flex items-center justify-center gap-2"
                                                    >
                                                        <Plus className="w-4 h-4" /> Adicionar Conta
                                                    </button>
                                                </div>
                                            </div>

                                            <form onSubmit={handleSubmitProfile(onSubmitProfile)} className="space-y-8">
                                                <h3 className="text-sm font-black text-white uppercase tracking-widest border-b border-white/10 pb-2">Contacto</h3>
                                                <Input
                                                    label="WhatsApp"
                                                    placeholder="Seu WhatsApp"
                                                    {...registerProfile('whatsappNumber')}
                                                    error={profileErrors.whatsappNumber?.message}
                                                    className="bg-black/20 border-white/10 text-white text-white"
                                                />

                                                <div className="pt-8">
                                                    <Button
                                                        type="submit"
                                                        isLoading={isSubmittingProfile}
                                                        disabled={isSubmittingProfile}
                                                        className="w-full py-4 text-white hover:brightness-110"
                                                        leftIcon={!isSubmittingProfile && <Save className="w-5 h-5" />}
                                                    >
                                                        Salvar Alterações
                                                    </Button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                )}

                            </m.div>
                        </AnimatePresence>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AuthorDashboard;
