import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Book as BookIcon, Heart, Clock, Settings, Download,
    User as UserIcon, CheckCircle, CreditCard, Sparkles,
    ChevronRight, ArrowRight, Loader2, Share2, Star,
    LayoutGrid, LogOut, ShieldCheck, Zap
} from 'lucide-react';
import { m, AnimatePresence } from 'framer-motion';
import { useToast } from '../components/Toast';
import { User, Book, PaymentNotification } from '../types';
import { OptimizedImage } from '../components/OptimizedImage';

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

    // Settings state
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        whatsapp: user?.whatsappNumber || ''
    });
    const [isSavingProfile, setIsSavingProfile] = useState(false);

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

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;
            try {
                if (activeTab === 'payments') {
                    const { getPaymentNotificationsByReader } = await import('../services/dataService');
                    const data = await getPaymentNotificationsByReader(user.id);
                    setNotifications(data);
                } else if (activeTab === 'library' || activeTab === 'history') {
                    await fetchLibrary();
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
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
            const { createPaymentProof, updatePaymentNotificationStatus, getPaymentNotificationsByReader } = await import('../services/dataService');

            const { fileUrl } = await uploadPaymentProof(file);
            await createPaymentProof({
                paymentNotificationId: notificationId,
                readerId: user?.id || 'temp',
                fileUrl,
                fileName: file.name,
                uploadedAt: new Date().toISOString()
            });

            await updatePaymentNotificationStatus(notificationId, 'proof_uploaded');
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

    const handleSaveProfile = async () => {
        if (!user) return;
        setIsSavingProfile(true);
        try {
            const { saveUserProfile } = await import('../services/dataService');
            await saveUserProfile({
                ...user,
                name: profileData.name,
                whatsappNumber: profileData.whatsapp
            });
            showToast('Perfil atualizado com sucesso!', 'success');
        } catch (error) {
            console.error('Erro ao salvar perfil:', error);
            showToast('Erro ao salvar alterações.', 'error');
        } finally {
            setIsSavingProfile(false);
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center p-8">
                <m.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white/5 border border-white/10 rounded-[2.5rem] p-12 text-center max-w-md backdrop-blur-xl"
                >
                    <UserIcon className="w-16 h-16 text-brand-primary mx-auto mb-6" />
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">Área Restrita</h2>
                    <p className="text-gray-400 mb-8 font-medium">Faça login para aceder ao seu painel de leitor.</p>
                    <button
                        onClick={() => navigate('/login')}
                        className="w-full py-5 bg-brand-primary text-white font-black uppercase tracking-widest rounded-2xl hover:brightness-110 transition-all shadow-xl shadow-brand-primary/20"
                    >
                        Fazer Login
                    </button>
                </m.div>
            </div>
        );
    }

    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-brand-primary/30 font-sans pb-20">
            {/* 1. CINEMATIC BACKGROUND BLOOMS */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand-primary/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full" />
            </div>

            {/* 2. HEADER AREA */}
            <header className="relative pt-32 pb-16 px-6 md:px-12 overflow-hidden">
                <div className="container mx-auto">
                    <div className="flex flex-col md:flex-row items-center gap-10">
                        {/* Avatar Architecture */}
                        <div className="relative">
                            <div className="w-40 h-40 md:w-56 md:h-56 rounded-full border-4 border-white/5 p-2 bg-white/5 backdrop-blur-3xl overflow-hidden shadow-2xl relative z-10 group">
                                <div className="w-full h-full rounded-full bg-gradient-to-br from-brand-primary/20 to-brand-dark flex items-center justify-center text-7xl font-black text-brand-primary transition-transform duration-700 group-hover:scale-110">
                                    {user.name.charAt(0)}
                                </div>
                            </div>
                            <m.div
                                initial={{ scale: 0 }} animate={{ scale: 1 }}
                                className="absolute bottom-4 right-4 z-20 w-10 h-10 bg-blue-500 rounded-full border-4 border-[#050505] flex items-center justify-center shadow-lg"
                            >
                                <ShieldCheck className="w-5 h-5 text-white" />
                            </m.div>
                        </div>

                        {/* Identity Pillar */}
                        <div className="flex-1 text-center md:text-left space-y-4">
                            <div className="flex flex-col md:flex-row items-center gap-4">
                                <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-none">
                                    {user.name.split(' ')[0]} <span className="text-brand-primary italic font-serif font-normal lowercase">{user.name.split(' ')[1] || ''}</span>
                                </h1>
                                <span className="px-4 py-1.5 bg-brand-primary/10 border border-brand-primary/20 rounded-full text-[10px] font-black tracking-widest uppercase text-brand-primary">
                                    Leitor Premium
                                </span>
                            </div>
                            <p className="text-gray-500 font-bold uppercase tracking-[0.3em] text-[10px] flex items-center justify-center md:justify-start gap-3">
                                <Zap className="w-3 h-3 text-brand-primary" />
                                Membro da Elite Literária desde 2024
                            </p>
                        </div>

                        {/* Quick Stats Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 border border-white/5 rounded-3xl p-6 text-center backdrop-blur-md">
                                <p className="text-3xl font-black text-brand-primary">{purchasedBooks.length}</p>
                                <p className="text-[8px] font-black uppercase tracking-widest text-gray-500 mt-1">Obras Adquiridas</p>
                            </div>
                            <div className="bg-white/5 border border-white/5 rounded-3xl p-6 text-center backdrop-blur-md">
                                <p className="text-3xl font-black text-brand-primary">0</p>
                                <p className="text-[8px] font-black uppercase tracking-widest text-gray-500 mt-1">Avaliações</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* 3. NAVIGATION DOCK */}
            <nav className="sticky top-8 z-50 container mx-auto px-6 mb-16">
                <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-2 flex items-center justify-between shadow-2xl overflow-x-auto no-scrollbar">
                    <div className="flex gap-2">
                        {[
                            { id: 'library', label: 'Acervo', icon: BookIcon },
                            { id: 'wishlist', label: 'Desejos', icon: Heart },
                            { id: 'history', label: 'Logs', icon: Clock },
                            { id: 'payments', label: 'Financeiro', icon: CreditCard },
                            { id: 'settings', label: 'Definições', icon: Settings }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`px-6 py-4 rounded-2xl flex items-center gap-3 transition-all whitespace-nowrap ${activeTab === tab.id
                                    ? 'bg-brand-primary text-white shadow-xl shadow-brand-primary/20'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                <span className="text-[10px] font-black uppercase tracking-widest">{tab.label}</span>
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-4 pr-2">
                        <button
                            onClick={async () => {
                                const { logout } = await import('../services/authService');
                                await logout();
                                navigate('/');
                            }}
                            className="p-4 rounded-2xl text-red-400 hover:bg-red-400/10 transition-colors"
                            title="Terminar Sessão"
                            aria-label="Terminar Sessão"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </nav>

            {/* 4. CONTENT GRID AREA */}
            <main className="container mx-auto px-6">
                <AnimatePresence mode="wait">
                    <m.div
                        key={activeTab}
                        {...fadeInUp}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                        {/* Tab Content Architecture */}
                        <div className="bg-white/5 border border-white/10 rounded-[3rem] p-8 md:p-16 backdrop-blur-2xl shadow-3xl">

                            {/* Section Header */}
                            <div className="mb-12 flex flex-col md:flex-row justify-between items-baseline gap-6 border-b border-white/5 pb-12">
                                <div>
                                    <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic">
                                        {activeTab === 'library' && 'Seu Legado'}
                                        {activeTab === 'wishlist' && 'Horizonte'}
                                        {activeTab === 'history' && 'Trajetória'}
                                        {activeTab === 'payments' && 'Saldos'}
                                        {activeTab === 'settings' && 'Identidade'}
                                    </h2>
                                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-primary mt-2">
                                        {activeTab === 'library' && 'Obras digitais licenciadas em seu nome'}
                                        {activeTab === 'wishlist' && 'Próximas explorações literárias'}
                                        {activeTab === 'history' && 'Registros de licenciamento e atividade'}
                                        {activeTab === 'payments' && 'Status de transações e comprovantes'}
                                        {activeTab === 'settings' && 'Personalize sua presença digital'}
                                    </p>
                                </div>
                                <div className="text-gray-800 text-6xl font-black uppercase tracking-tighter opacity-10 select-none hidden lg:block">
                                    {activeTab}
                                </div>
                            </div>

                            {/* Dynamic Sections */}
                            {activeTab === 'library' && (
                                <div className="space-y-12">
                                    {isLoadingLibrary ? (
                                        <div className="flex justify-center py-24"><Loader2 className="w-12 h-12 text-brand-primary animate-spin" /></div>
                                    ) : purchasedBooks.filter(b => b.format === 'digital' && b.digitalFileUrl).length > 0 ? (
                                        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-10">
                                            {purchasedBooks.filter(b => b.format === 'digital' && b.digitalFileUrl).map((book) => (
                                                <m.div
                                                    whileHover={{ y: -10 }}
                                                    key={book.id}
                                                    className="group space-y-4"
                                                >
                                                    <div className="aspect-[2/3] rounded-[2rem] overflow-hidden relative shadow-2xl bg-white/5 border border-white/5">
                                                        <OptimizedImage
                                                            src={book.coverUrl}
                                                            alt={book.title}
                                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                                        />
                                                        <div className="absolute inset-0 bg-brand-dark/40 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px] flex items-center justify-center p-6">
                                                            <button
                                                                onClick={() => handleDownload(book)}
                                                                className="w-full py-4 bg-brand-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 transform translate-y-8 group-hover:translate-y-0 transition-all duration-500 shadow-3xl shadow-brand-primary/20"
                                                            >
                                                                <Download className="w-4 h-4" /> Baixar PDF
                                                            </button>
                                                        </div>
                                                        <div className="absolute top-4 right-4 p-3 bg-black/60 backdrop-blur-md rounded-xl border border-white/10 text-[8px] font-black uppercase tracking-widest">
                                                            Digital Original
                                                        </div>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <h3 className="font-black text-sm uppercase tracking-tight truncate">{book.title}</h3>
                                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest italic">{book.author}</p>
                                                    </div>
                                                </m.div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-32 space-y-6">
                                            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/5">
                                                <BookIcon className="w-8 h-8 text-gray-600" />
                                            </div>
                                            <p className="text-gray-500 font-medium uppercase tracking-[0.2em] text-[10px]">Páginas em branco. Seu acervo está vazio.</p>
                                            <button
                                                onClick={() => navigate('/livros')}
                                                className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                                            >
                                                Ver Catálogo
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'wishlist' && (
                                <div className="text-center py-32 space-y-6">
                                    <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/5">
                                        <Heart className="w-8 h-8 text-brand-primary opacity-20" />
                                    </div>
                                    <p className="text-gray-500 font-medium uppercase tracking-[0.2em] text-[10px]">Sua lista de desejos aguarda novas inspirações.</p>
                                </div>
                            )}

                            {activeTab === 'payments' && (
                                <div className="space-y-8">
                                    <div className="grid gap-6">
                                        {notifications.map((notif) => (
                                            <m.div
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                key={notif.id}
                                                className="bg-white/5 p-8 rounded-[2rem] border border-white/5 flex flex-col sm:flex-row gap-8 items-start sm:items-center justify-between group hover:bg-white/10 transition-colors"
                                            >
                                                <div className="flex gap-6 items-center">
                                                    <div className={`w-16 h-16 rounded-[1.25rem] flex items-center justify-center ${notif.status === 'confirmed' ? 'bg-green-500/10 text-green-500' :
                                                        notif.status === 'proof_uploaded' ? 'bg-blue-500/10 text-blue-500' : 'bg-yellow-500/10 text-yellow-500'
                                                        }`}>
                                                        <CreditCard className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-3 mb-1">
                                                            <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Pedido #{notif.orderId.substring(0, 8)}</span>
                                                            <span className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${notif.status === 'confirmed' ? 'bg-green-500 text-white' :
                                                                notif.status === 'proof_uploaded' ? 'bg-blue-500 text-white' : 'bg-yellow-500 text-black'
                                                                }`}>
                                                                {notif.status === 'confirmed' ? 'Confirmado' : notif.status === 'proof_uploaded' ? 'Em Análise' : 'Pendente'}
                                                            </span>
                                                        </div>
                                                        <p className="text-3xl font-black text-white italic tracking-tighter">{notif.totalAmount.toLocaleString()} Kz</p>
                                                    </div>
                                                </div>

                                                {notif.status === 'pending' && (
                                                    <div className="relative w-full sm:w-auto">
                                                        <input
                                                            type="file"
                                                            className="absolute inset-0 opacity-0 cursor-pointer z-20"
                                                            onChange={(e) => e.target.files && handleUploadProof(notif.id, e.target.files[0])}
                                                            disabled={!!isUploading}
                                                            title="Enviar Comprovante Digital"
                                                        />
                                                        <button className="w-full sm:w-auto px-10 py-5 bg-white text-brand-dark rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-brand-primary hover:text-white transition-all shadow-2xl relative z-10 flex items-center justify-center gap-3">
                                                            {isUploading === notif.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <ChevronRight className="w-4 h-4" />}
                                                            {isUploading === notif.id ? 'Processando' : 'Anexar Comprovante'}
                                                        </button>
                                                    </div>
                                                )}
                                            </m.div>
                                        ))}
                                    </div>
                                    {notifications.length === 0 && (
                                        <div className="py-24 text-center text-gray-600 text-[10px] font-black uppercase tracking-widest">
                                            Nenhuma transação financeira pendente.
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'history' && (
                                <div className="overflow-hidden bg-black/20 rounded-[2rem] border border-white/5">
                                    <table className="w-full text-left">
                                        <thead className="bg-white/5">
                                            <tr className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500">
                                                <th className="px-8 py-6">Obra Literária</th>
                                                <th className="px-8 py-6">Evento</th>
                                                <th className="px-8 py-6 text-right">Licenciamento</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {purchasedBooks.map((book, i) => (
                                                <m.tr
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: i * 0.05 }}
                                                    key={book.id}
                                                    className="hover:bg-white/5 transition-colors"
                                                >
                                                    <td className="px-8 py-6">
                                                        <p className="font-black text-sm uppercase tracking-tight">{book.title}</p>
                                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{book.author}</p>
                                                    </td>
                                                    <td className="px-8 py-6 text-xs text-brand-primary font-bold uppercase tracking-widest">
                                                        Acesso Cedido
                                                    </td>
                                                    <td className="px-8 py-6 text-right font-mono text-white/50 text-sm">
                                                        {book.price.toLocaleString()} KZ
                                                    </td>
                                                </m.tr>
                                            ))}
                                            {purchasedBooks.length === 0 && (
                                                <tr>
                                                    <td colSpan={3} className="px-8 py-16 text-center text-gray-600 text-[10px] font-black uppercase tracking-widest">
                                                        Histórico de licenciamento vazio.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {activeTab === 'settings' && (
                                <m.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="max-w-xl space-y-10"
                                >
                                    <div className="grid gap-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Nome de Exibição / Pseudónimo</label>
                                            <input
                                                type="text"
                                                value={profileData.name}
                                                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                                className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-5 text-white focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 outline-none transition-all font-bold tracking-tight text-lg"
                                                title="Nome completo"
                                            />
                                        </div>
                                        <div className="space-y-3 opacity-50">
                                            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Endereço de Acesso (Imutável)</label>
                                            <div className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-5 text-gray-400 font-bold tracking-tight text-lg">
                                                {profileData.email}
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">WhatsApp de Contacto Direto</label>
                                            <input
                                                type="text"
                                                value={profileData.whatsapp}
                                                onChange={(e) => setProfileData({ ...profileData, whatsapp: e.target.value })}
                                                className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-5 text-white focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 outline-none transition-all font-bold tracking-tight text-lg"
                                                placeholder="+244..."
                                                title="Telemóvel"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleSaveProfile}
                                        disabled={isSavingProfile}
                                        className="w-full py-6 bg-brand-primary text-white rounded-2xl font-black uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 shadow-2xl shadow-brand-primary/20 flex items-center justify-center gap-3"
                                    >
                                        {isSavingProfile ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
                                        {isSavingProfile ? 'Certificando Alterações' : 'Selar Novo Perfil'}
                                    </button>
                                </m.div>
                            )}
                        </div>
                    </m.div>
                </AnimatePresence>
            </main>
        </div>
    );
};

export default ReaderDashboard;
