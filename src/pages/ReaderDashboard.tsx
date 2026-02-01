import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book as BookIcon, Heart, Clock, Settings, Download, User as UserIcon, CheckCircle, CreditCard, Sparkles, ChevronRight, ArrowRight, Loader2, Share2, Star } from 'lucide-react';
import { motion as m, AnimatePresence } from 'framer-motion';
import { useToast } from '../components/Toast';
import { ViewState, User, Book, PaymentNotification } from '../types';

interface ReaderDashboardProps {
    user: User | null;
}

const ReaderDashboard: React.FC<ReaderDashboardProps> = ({ user }) => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [activeTab, setActiveTab] = useState<'library' | 'wishlist' | 'history' | 'settings' | 'payments'>('library');
    const [notifications, setNotifications] = useState<PaymentNotification[]>([]);
    const [isUploading, setIsUploading] = useState<string | null>(null);
    const [purchasedBooks, setPurchasedBooks] = useState<Book[]>([]);
    const [isLoadingLibrary, setIsLoadingLibrary] = useState(false);

    const fetchLibrary = async () => {
        if (!user) return;
        setIsLoadingLibrary(true);
        try {
            const { getUserBooks } = await import('../services/dataService');
            const data = await getUserBooks(user.id);
            setPurchasedBooks(data);
        } catch (error) {
            console.error('Erro ao buscar biblioteca:', error);
        } finally {
            setIsLoadingLibrary(false);
        }
    };

    React.useEffect(() => {
        const fetchNotifications = async () => {
            if (!user) return;
            try {
                const { getPaymentNotificationsByReader } = await import('../services/dataService');
                const data = await getPaymentNotificationsByReader(user.id);
                setNotifications(data);
            } catch (error) {
                console.error('Erro ao buscar pagamentos:', error);
            }
        };

        if (activeTab === 'payments') {
            fetchNotifications();
        } else if (activeTab === 'library' || activeTab === 'history') {
            fetchLibrary();
        }
    }, [activeTab, user]);

    const handleDownload = (book: Book) => {
        if (!book.digitalFileUrl) {
            showToast('Ficheiro digital não disponível para este livro.', 'error');
            return;
        }
        window.open(book.digitalFileUrl, '_blank');
        showToast('Download iniciado.', 'success');
    };

    const handleUploadProof = async (notificationId: string, file: File) => {
        setIsUploading(notificationId);
        try {
            const { uploadPaymentProof } = await import('../services/storageService');
            const { createPaymentProof, updatePaymentNotificationStatus } = await import('../services/dataService');

            const { fileId, fileUrl } = await uploadPaymentProof(file);

            await createPaymentProof({
                paymentNotificationId: notificationId,
                readerId: user?.id || 'temp',
                fileUrl,
                fileName: file.name,
                uploadedAt: new Date().toISOString()
            });

            await updatePaymentNotificationStatus(notificationId, 'proof_uploaded');

            // Refresh notifications
            const { getPaymentNotificationsByReader } = await import('../services/dataService');
            const data = await getPaymentNotificationsByReader(user?.id || 'temp');
            setNotifications(data);

            showToast('Comprovante enviado com sucesso!', 'success');
        } catch (error) {
            console.error('Erro no upload:', error);
            showToast('Erro ao enviar comprovante.', 'error');
        } finally {
            setIsUploading(null);
        }
    };

    // Mock data - in real app would come from database

    const wishlistBooks = [
        {
            id: '3',
            title: 'Mayombe',
            author: 'Pepetela',
            coverUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop',
            price: 8500
        }
    ];

    if (!user) {
        return (
            <div className="min-h-screen bg-brand-light flex items-center justify-center p-8">
                <div className="bg-white rounded-3xl shadow-xl p-12 text-center max-w-md">
                    <UserIcon className="w-16 h-16 text-gray-300 mx-auto mb-6" />
                    <h2 className="text-3xl font-black text-brand-dark mb-4">Área Restrita</h2>
                    <p className="text-gray-600 mb-8">Faça login para aceder ao seu painel de leitor.</p>
                    <button
                        onClick={() => navigate('/entrar')}
                        className="btn-premium w-full justify-center"
                    >
                        Fazer Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-brand-primary/30">
            {/* Dashboard Internal Header */}
            <header className="h-24 bg-black/80 backdrop-blur-3xl border-b border-white/5 fixed top-0 left-0 right-0 z-[100] px-8 flex items-center justify-between">
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
                        <p className="text-[8px] text-brand-primary font-black uppercase tracking-[0.2em]">Leitor Elite | Online</p>
                    </div>
                    <button
                        onClick={() => setActiveTab('settings')}
                        className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors border border-white/5"
                        title="Protocolos de Identidade"
                    >
                        <Settings className="w-4 h-4 text-gray-400" />
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="p-3 bg-red-500/10 hover:bg-red-500/20 rounded-xl transition-colors border border-red-500/20 text-red-500"
                        title="Terminar Sessão"
                    >
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </header>

            {/* Header - Immersive */}
            <section className="pt-32 pb-24 relative overflow-hidden">
                {/* Background Decorative Text */}
                <div className="absolute top-20 left-1/2 -translate-x-1/2 pointer-events-none select-none z-0">
                    <span className="text-[15rem] md:text-[25rem] font-black text-white/[0.02] leading-none uppercase tracking-tighter">
                        LEITOR
                    </span>
                </div>

                {/* Decorative Gradients */}
                <div className="absolute top-0 right-0 w-[40%] aspect-square bg-brand-primary/10 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/4"></div>
                <div className="absolute bottom-0 left-0 w-[30%] aspect-square bg-brand-primary/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/4"></div>

                <div className="container mx-auto px-6 md:px-8 relative z-10">
                    <div className="flex flex-col xl:flex-row items-center justify-between gap-12 mb-20">
                        <div className="text-center xl:text-left">
                            <m.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="inline-flex items-center gap-3 px-6 py-2 bg-brand-primary/10 border border-brand-primary/20 rounded-full text-brand-primary font-black text-[10px] uppercase tracking-[0.4em] mb-8"
                            >
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>TERMINAL DE ACESSO</span>
                            </m.div>
                            <m.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-none mb-6"
                            >
                                OLHÁ, <span className="text-brand-primary italic font-light lowercase">{user.name.split(' ')[0]}</span>
                            </m.h1>
                            <m.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="text-gray-500 font-bold text-xs uppercase tracking-[0.3em] max-w-lg mx-auto xl:mx-0 leading-relaxed"
                            >
                                Gestão de acervo digital e jornada literária personalizada sob protocolo premium.
                            </m.p>
                        </div>

                        <m.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-8 bg-white/[0.03] backdrop-blur-3xl p-8 rounded-[3.5rem] border border-white/5 shadow-2xl relative group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-transparent rounded-[3.5rem] -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="relative">
                                <div className="w-20 h-20 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary font-black text-3xl border border-brand-primary/20 shadow-[0_0_20px_rgba(189,147,56,0.2)]">
                                    {user.name.charAt(0)}
                                </div>
                                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-brand-primary rounded-xl flex items-center justify-center border-4 border-[#0D0D0D] shadow-lg">
                                    <CheckCircle className="w-4 h-4 text-white" />
                                </div>
                            </div>

                            <div className="pr-8">
                                <h2 className="text-white text-xl font-black tracking-tight mb-2 uppercase">{user.name}</h2>
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    <span className="text-brand-primary text-[10px] font-black uppercase tracking-[0.2em]">MEMBRO NIVEL ELITE</span>
                                </div>
                                <p className="text-gray-600 text-[9px] mt-2 font-black uppercase tracking-widest">{user.email}</p>
                            </div>
                        </m.div>
                    </div>

                    {/* Tabs - Modernized */}
                    <div className="flex flex-wrap justify-center xl:justify-start gap-4 p-2 bg-white/[0.02] border border-white/5 rounded-3xl backdrop-blur-xl max-w-fit mx-auto xl:mx-0">
                        {[
                            { id: 'library', label: 'ACERVO', icon: BookIcon },
                            { id: 'wishlist', label: 'DESEJOS', icon: Heart },
                            { id: 'payments', label: 'TERMINAL FINANCEIRO', icon: CreditCard },
                            { id: 'history', label: 'LOGS DE COMPRA', icon: Clock },
                            { id: 'settings', label: 'PROTOCOLOS', icon: UserIcon }
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
                                        layoutId="tab-pill"
                                        className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"
                                    />
                                )}
                            </m.button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Content Area */}
            <section className="py-20 -mt-12 relative z-20">
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

                            {/* Library (ACERVO) Tab */}
                            {activeTab === 'library' && (
                                <div className="space-y-16">
                                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
                                        <div>
                                            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase leading-none mb-4 italic">
                                                Protocolo <span className="text-brand-primary font-light not-italic lowercase">Acervo Digital</span>
                                            </h2>
                                            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-500">Sincronização de Licenças Literárias</p>
                                        </div>
                                    </div>

                                    {isLoadingLibrary ? (
                                        <div className="flex flex-col items-center justify-center py-32 space-y-6">
                                            <Loader2 className="w-12 h-12 text-brand-primary animate-spin" />
                                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-600">Sincronizando com Servidor de Ativos...</p>
                                        </div>
                                    ) : purchasedBooks.filter(b => b.format === 'digital' && b.digitalFileUrl).length > 0 ? (
                                        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                                            {purchasedBooks.filter(b => b.format === 'digital' && b.digitalFileUrl).map((book) => (
                                                <m.div
                                                    key={book.id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    whileInView={{ opacity: 1, y: 0 }}
                                                    viewport={{ once: true }}
                                                    className="bg-white/[0.02] rounded-[3rem] border border-white/5 overflow-hidden group hover:bg-white/[0.05] transition-all relative shadow-2xl"
                                                >
                                                    <div className="aspect-[3/4.5] overflow-hidden relative">
                                                        <img
                                                            src={book.coverUrl}
                                                            alt={book.title}
                                                            className="w-full h-full object-cover group-hover:scale-110 group-hover:blur-[2px] transition-all duration-700"
                                                        />
                                                        {/* Hover Overlay */}
                                                        <div className="absolute inset-0 bg-brand-dark/80 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center p-8 text-center translate-y-4 group-hover:translate-y-0">
                                                            <div className="w-16 h-16 rounded-2xl bg-brand-primary/20 flex items-center justify-center mb-6">
                                                                <Download className="w-8 h-8 text-brand-primary" />
                                                            </div>
                                                            <h4 className="text-white font-black uppercase tracking-widest text-sm mb-4">Acesso Liberado</h4>
                                                            <m.button
                                                                whileHover={{ scale: 1.05, filter: 'brightness(1.1)' }}
                                                                whileTap={{ scale: 0.95 }}
                                                                onClick={() => handleDownload(book)}
                                                                className="px-8 py-3 bg-brand-primary text-white rounded-xl text-[10px] font-black uppercase tracking-[0.3em] shadow-lg shadow-brand-primary/20"
                                                            >
                                                                TRANSFERIR AGORA
                                                            </m.button>
                                                        </div>
                                                        <div className="absolute top-6 left-6 px-3 py-1 bg-brand-primary/90 backdrop-blur-md rounded-lg text-[8px] font-black text-white uppercase tracking-widest shadow-xl">
                                                            DIGITAL .ACERVO
                                                        </div>
                                                    </div>
                                                    <div className="p-8">
                                                        <div className="mb-4">
                                                            <h3 className="font-black text-white text-lg leading-tight uppercase tracking-tight group-hover:text-brand-primary transition-colors line-clamp-1 mb-1">{book.title}</h3>
                                                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest italic">{book.author}</p>
                                                        </div>
                                                        <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                                                            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                                                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">STATUS: SINCRONIZADO</span>
                                                        </div>
                                                    </div>
                                                </m.div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-32 text-center">
                                            <div className="w-32 h-32 bg-white/[0.02] border border-white/5 rounded-[2.5rem] flex items-center justify-center mb-10 relative">
                                                <BookIcon className="w-12 h-12 text-gray-800" />
                                                <div className="absolute inset-0 bg-brand-primary/5 blur-2xl rounded-full" />
                                            </div>
                                            <h3 className="text-3xl font-black text-white tracking-tighter uppercase mb-4">Acervo Inativo</h3>
                                            <p className="text-gray-500 font-medium uppercase tracking-[0.2em] text-[10px] max-w-sm leading-relaxed mb-10 italic">
                                                Nenhum ativo digital foi detectado em sua conta sob os protocolos atuais.
                                            </p>
                                            <m.button
                                                whileHover={{ scale: 1.05, filter: 'brightness(1.1)' }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => navigate('/catalogo')}
                                                className="px-10 py-5 bg-brand-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] shadow-[0_20px_40px_-10px_rgba(189,147,56,0.3)] transition-all"
                                            >
                                                EXPLORAR CATALOGO
                                            </m.button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Wishlist (DESEJOS) Tab */}
                            {activeTab === 'wishlist' && (
                                <div className="space-y-16">
                                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
                                        <div>
                                            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase leading-none mb-4 italic">
                                                Lista de <span className="text-brand-primary font-light not-italic lowercase">Desejos</span>
                                            </h2>
                                            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-500">Curadoria de Futuros Ativos</p>
                                        </div>
                                    </div>
                                    {wishlistBooks.length > 0 ? (
                                        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                                            {wishlistBooks.map((book) => (
                                                <m.div
                                                    key={book.id}
                                                    className="bg-white/[0.02] rounded-[3rem] border border-white/5 overflow-hidden group hover:bg-white/[0.05] transition-all relative shadow-2xl"
                                                >
                                                    <div className="aspect-[3/4.5] overflow-hidden relative">
                                                        <img
                                                            src={book.coverUrl}
                                                            alt={book.title}
                                                            className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700"
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                                                    </div>
                                                    <div className="p-8">
                                                        <div className="mb-6">
                                                            <h3 className="font-black text-white text-lg leading-tight uppercase tracking-tight group-hover:text-brand-primary transition-colors line-clamp-1 mb-1">{book.title}</h3>
                                                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest italic">{book.author}</p>
                                                        </div>
                                                        <div className="flex items-center justify-between mb-8">
                                                            <div className="text-2xl font-black text-brand-primary tracking-tighter">
                                                                {book.price.toLocaleString()} <span className="text-xs uppercase ml-1">Kz</span>
                                                            </div>
                                                        </div>
                                                        <m.button
                                                            whileHover={{ scale: 1.02, filter: 'brightness(1.1)' }}
                                                            whileTap={{ scale: 0.98 }}
                                                            className="w-full py-4 bg-white/5 border border-white/10 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-brand-primary hover:border-brand-primary transition-all flex items-center justify-center gap-3"
                                                        >
                                                            <CreditCard className="w-4 h-4" />
                                                            ADQUIRIR AGORA
                                                        </m.button>
                                                    </div>
                                                </m.div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-32 text-center">
                                            <div className="w-32 h-32 bg-white/[0.02] border border-white/5 rounded-[2.5rem] flex items-center justify-center mb-10 relative">
                                                <Heart className="w-12 h-12 text-gray-800" />
                                                <div className="absolute inset-0 bg-brand-primary/5 blur-2xl rounded-full" />
                                            </div>
                                            <h3 className="text-3xl font-black text-white tracking-tighter uppercase mb-4">Lista Virtual</h3>
                                            <p className="text-gray-500 font-medium uppercase tracking-[0.2em] text-[10px] max-w-sm leading-relaxed mb-10 italic">
                                                O seu radar de desejos literários está em modo standby.
                                            </p>
                                            <m.button
                                                whileHover={{ scale: 1.05, filter: 'brightness(1.1)' }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => navigate('/catalogo')}
                                                className="px-10 py-5 bg-brand-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] shadow-[0_20px_40px_-10px_rgba(189,147,56,0.3)] transition-all"
                                            >
                                                MAPEAR CATÁLOGO
                                            </m.button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* History (LOGS DE COMPRA) Tab */}
                            {activeTab === 'history' && (
                                <div className="space-y-16">
                                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
                                        <div>
                                            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase leading-none mb-4 italic">
                                                Logs de <span className="text-brand-primary font-light not-italic lowercase">Aquisição</span>
                                            </h2>
                                            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-500">Histórico de Transações do Terminal</p>
                                        </div>
                                    </div>

                                    <div className="bg-white/[0.02] rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl relative">
                                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-primary/10 to-transparent" />
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="border-b border-white/5 bg-white/[0.02]">
                                                    <th className="px-10 py-8 text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">ESTADO</th>
                                                    <th className="px-10 py-8 text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">ATIVO LITERÁRIO</th>
                                                    <th className="px-10 py-8 text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">FORMATO</th>
                                                    <th className="px-10 py-8 text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] text-right">VALOR SINCRONIZADO</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5">
                                                {isLoadingLibrary ? (
                                                    <tr>
                                                        <td colSpan={4} className="px-10 py-20 text-center">
                                                            <div className="flex flex-col items-center gap-4">
                                                                <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
                                                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-600">A REDEFINIR LOGS...</p>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ) : purchasedBooks.length > 0 ? (
                                                    purchasedBooks.map((book) => (
                                                        <m.tr
                                                            key={book.id}
                                                            whileHover={{ backgroundColor: 'rgba(255,255,255,0.01)' }}
                                                            className="group transition-colors"
                                                        >
                                                            <td className="px-10 py-8">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]" />
                                                                    <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">EFETUADO</span>
                                                                </div>
                                                            </td>
                                                            <td className="px-10 py-8">
                                                                <div>
                                                                    <p className="font-black text-white text-sm uppercase tracking-tight mb-1">{book.title}</p>
                                                                    <p className="text-[9px] text-gray-600 font-black uppercase tracking-[0.2em]">{book.author}</p>
                                                                </div>
                                                            </td>
                                                            <td className="px-10 py-8">
                                                                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[9px] font-black text-gray-400 uppercase tracking-widest">DIGITAL</span>
                                                            </td>
                                                            <td className="px-10 py-8 text-right">
                                                                <span className="text-sm font-black text-brand-primary tracking-tighter">
                                                                    {book.price.toLocaleString()} <span className="text-[10px] ml-1">KZ</span>
                                                                </span>
                                                            </td>
                                                        </m.tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan={4} className="px-10 py-32 text-center">
                                                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-600 italic">Nenhum registo de aquisição encontrado nos servidores.</p>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* Settings (PROTOCOLOS) Tab */}
                            {activeTab === 'settings' && (
                                <div className="space-y-16">
                                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
                                        <div>
                                            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase leading-none mb-4 italic">
                                                Protocolos de <span className="text-brand-primary font-light not-italic lowercase">Identidade</span>
                                            </h2>
                                            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-500">Configuração de Acesso e Credenciais</p>
                                        </div>
                                    </div>

                                    <div className="grid lg:grid-cols-2 gap-12">
                                        <div className="bg-white/[0.02] rounded-[3rem] border border-white/5 p-12 space-y-10 shadow-2xl relative overflow-hidden group">
                                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                            <div className="space-y-8">
                                                <div className="space-y-3">
                                                    <label htmlFor="user-name" className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 ml-4">TITULAR DA CONTA</label>
                                                    <div className="relative">
                                                        <UserIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700" />
                                                        <input
                                                            id="user-name"
                                                            type="text"
                                                            value={user.name}
                                                            className="w-full pl-16 pr-8 py-6 bg-white/[0.03] border border-white/5 rounded-2xl focus:border-brand-primary/30 outline-none transition-all font-black text-white uppercase tracking-widest text-lg"
                                                            readOnly
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-3">
                                                    <label htmlFor="user-email" className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 ml-4">TERMINAL DE COMUNICAÇÃO</label>
                                                    <div className="relative">
                                                        <Download className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700 rotate-180" />
                                                        <input
                                                            id="user-email"
                                                            type="email"
                                                            value={user.email}
                                                            className="w-full pl-16 pr-8 py-6 bg-white/[0.03] border border-white/5 rounded-2xl focus:border-brand-primary/30 outline-none transition-all font-bold text-gray-400"
                                                            readOnly
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-3">
                                                    <label htmlFor="user-role" className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 ml-4">NÍVEL DE AUTORIZAÇÃO</label>
                                                    <div className="relative">
                                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-primary">
                                                            <Sparkles className="w-full h-full" />
                                                        </div>
                                                        <input
                                                            id="user-role"
                                                            type="text"
                                                            value={user.role === 'adm' ? 'ADMINISTRADOR DE SISTEMA' : user.role === 'autor' ? 'AUTOR PREMIUM' : 'LEITOR ELITE'}
                                                            className="w-full pl-16 pr-8 py-6 bg-brand-primary/5 border border-brand-primary/10 rounded-2xl font-black text-brand-primary uppercase tracking-[0.2em]"
                                                            readOnly
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <m.button
                                                whileHover={{ scale: 1.02, filter: 'brightness(1.1)' }}
                                                whileTap={{ scale: 0.98 }}
                                                className="w-full py-6 bg-brand-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] shadow-[0_20px_40px_-10px_rgba(189,147,56,0.3)] transition-all flex items-center justify-center gap-4"
                                            >
                                                <Settings className="w-5 h-5" />
                                                REDEFINIR ACESSO
                                            </m.button>
                                        </div>

                                        <div className="bg-brand-primary/5 rounded-[3rem] border border-brand-primary/10 p-12 flex flex-col items-center justify-center text-center space-y-8">
                                            <div className="w-24 h-24 rounded-full bg-brand-primary/10 flex items-center justify-center border border-brand-primary/20 relative">
                                                <Sparkles className="w-10 h-10 text-brand-primary animate-pulse" />
                                                <div className="absolute inset-0 bg-brand-primary/5 blur-2xl rounded-full" />
                                            </div>
                                            <div>
                                                <h4 className="text-2xl font-black text-white uppercase tracking-tighter mb-2 italic">Status <span className="text-brand-primary">Privilege</span></h4>
                                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 max-w-xs leading-relaxed italic">
                                                    Sua conta está operando sob os protocolos de segurança e exclusividade mais elevados da Editora Graça.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Payments (TERMINAL FINANCEIRO) Tab */}
                            {activeTab === 'payments' && (
                                <div className="space-y-16">
                                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
                                        <div>
                                            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase leading-none mb-4 italic">
                                                Terminal <span className="text-brand-primary font-light not-italic lowercase">Financeiro</span>
                                            </h2>
                                            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-500">Monitorização de Fluxo e Liquidação</p>
                                        </div>
                                    </div>

                                    <div className="grid gap-10">
                                        {notifications.length > 0 ? notifications.map((notif) => (
                                            <m.div
                                                key={notif.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                viewport={{ once: true }}
                                                className="bg-white/[0.02] rounded-[3rem] border border-white/5 p-10 flex flex-col xl:flex-row xl:items-center justify-between gap-10 hover:bg-white/[0.04] transition-all group relative overflow-hidden"
                                            >
                                                <div className={`absolute top-0 left-0 w-2 h-full ${notif.status === 'confirmed' ? 'bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)]' :
                                                    notif.status === 'proof_uploaded' ? 'bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)]' :
                                                        'bg-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.3)]'
                                                    }`} />

                                                <div className="flex-1 space-y-6">
                                                    <div className="flex items-center gap-4">
                                                        <span className="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em]">Fatura Protocolo #{notif.orderId}</span>
                                                        <div className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${notif.status === 'confirmed' ? 'bg-green-500/10 border-green-500/20 text-green-500' :
                                                            notif.status === 'proof_uploaded' ? 'bg-blue-500/10 border-blue-500/20 text-blue-500' :
                                                                'bg-yellow-500/10 border-yellow-500/20 text-yellow-500'
                                                            }`}>
                                                            {notif.status === 'confirmed' ? 'LIQUIDADO' :
                                                                notif.status === 'proof_uploaded' ? 'EM AUDITORIA' :
                                                                    'AGUARDANDO DEPÓSITO'}
                                                        </div>
                                                    </div>
                                                    <div className="space-y-3">
                                                        {notif.items.map((item, idx) => (
                                                            <div key={idx} className="flex items-center gap-4">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-brand-primary/40" />
                                                                <p className="text-white text-sm font-black uppercase tracking-tight">
                                                                    {item.bookTitle} <span className="text-gray-600 font-medium lowercase mx-2 italic">by</span> <span className="text-brand-primary">{item.authorName}</span>
                                                                </p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="xl:text-right flex flex-col xl:items-end gap-6 pt-8 xl:pt-0 border-t xl:border-t-0 border-white/5">
                                                    <div>
                                                        <div className="text-4xl font-black text-white tracking-tighter mb-1 uppercase italic">
                                                            {notif.totalAmount.toLocaleString()} <span className="text-xs text-brand-primary not-italic font-black">KZ</span>
                                                        </div>
                                                        <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest">Registado em {new Date(notif.createdAt).toLocaleDateString('pt-AO')}</p>
                                                    </div>

                                                    {notif.status === 'pending' && (
                                                        <div className="relative group/btn">
                                                            <input
                                                                type="file"
                                                                title="Anexar comprovante de pagamento"
                                                                aria-label="Selecionar ficheiro de comprovante"
                                                                className="absolute inset-0 opacity-0 cursor-pointer w-full z-10"
                                                                onChange={(e) => e.target.files && handleUploadProof(notif.id, e.target.files[0])}
                                                                disabled={isUploading === notif.id}
                                                            />
                                                            <m.button
                                                                whileHover={{ scale: 1.05 }}
                                                                whileTap={{ scale: 0.95 }}
                                                                className="px-8 py-4 bg-brand-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-xl shadow-brand-primary/20 flex items-center gap-3"
                                                            >
                                                                <Download className="w-4 h-4" />
                                                                {isUploading === notif.id ? 'PROCESSANDO...' : 'ENVIAR COMPROVANTE'}
                                                            </m.button>
                                                        </div>
                                                    )}

                                                    {notif.status === 'proof_uploaded' && (
                                                        <div className="flex items-center gap-3 text-blue-500 font-black text-[10px] uppercase tracking-widest bg-blue-500/5 px-6 py-3 rounded-xl border border-blue-500/10">
                                                            <Clock className="w-4 h-4 animate-pulse" />
                                                            Protocolo em Verificação
                                                        </div>
                                                    )}

                                                    {notif.status === 'confirmed' && (
                                                        <div className="flex items-center gap-3 text-green-500 font-black text-[10px] uppercase tracking-widest bg-green-500/5 px-6 py-3 rounded-xl border border-green-500/10">
                                                            <CheckCircle className="w-4 h-4" />
                                                            Transação Confirmada
                                                        </div>
                                                    )}
                                                </div>
                                            </m.div>
                                        )) : (
                                            <div className="flex flex-col items-center justify-center py-32 text-center">
                                                <div className="w-32 h-32 bg-white/[0.02] border border-white/5 rounded-[2.5rem] flex items-center justify-center mb-10 relative">
                                                    <CreditCard className="w-12 h-12 text-gray-800" />
                                                    <div className="absolute inset-0 bg-brand-primary/5 blur-2xl rounded-full" />
                                                </div>
                                                <h3 className="text-3xl font-black text-white tracking-tighter uppercase mb-4">Fluxo Inativo</h3>
                                                <p className="text-gray-500 font-medium uppercase tracking-[0.2em] text-[10px] max-w-sm leading-relaxed mb-10 italic">
                                                    Nenhum pedido de liquidação pendente detetado no terminal.
                                                </p>
                                                <m.button
                                                    whileHover={{ scale: 1.05, filter: 'brightness(1.1)' }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => navigate('/catalogo')}
                                                    className="px-10 py-5 bg-brand-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] shadow-[0_20px_40px_-10px_rgba(189,147,56,0.3)] transition-all"
                                                >
                                                    INICIAR AQUISIÇÃO
                                                </m.button>
                                            </div>
                                        )}
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

export default ReaderDashboard;
