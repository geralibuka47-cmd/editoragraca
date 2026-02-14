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
        <div className="min-h-screen bg-[#050505] text-white selection:bg-brand-primary/30 font-sans">
            {/* 1. COVER AREA */}
            <div className="h-[350px] relative w-full overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent z-10" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=2228&auto=format&fit=crop')] bg-cover bg-center opacity-40 group-hover:scale-105 transition-transform duration-1000" />

                {/* Top Nav Overlay */}
                <div className="absolute top-0 left-0 right-0 p-8 flex justify-between items-start z-20">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-3 px-4 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10 hover:bg-white/10 transition-all group/back"
                    >
                        <ArrowRight className="w-4 h-4 text-white rotate-180 group-hover/back:-translate-x-1 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Voltar ao Site</span>
                    </button>

                    <button
                        onClick={() => navigate('/entrar')}
                        className="w-10 h-10 flex items-center justify-center bg-red-500/20 backdrop-blur-md rounded-full border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                        title="Sair"
                        aria-label="Sair"
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
                        <div className="absolute bottom-4 right-4 z-20 w-8 h-8 bg-blue-500 rounded-full border-4 border-[#050505] flex items-center justify-center shadow-lg" title="Verificado">
                            <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                    </div>

                    {/* Identity Info */}
                    <div className="flex-1 pb-4 text-center md:text-left">
                        <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-2 truncate max-w-full">{user.name}</h1>
                        <p className="text-gray-400 font-medium text-sm tracking-wide flex items-center justify-center md:justify-start gap-2">
                            <span className="text-brand-primary font-black uppercase tracking-[0.2em] text-[10px]">@{user.role}</span>
                            <span className="w-1 h-1 rounded-full bg-gray-600" />
                            <span className="text-gray-500 italic">Membro desde 2024</span>
                        </p>
                    </div>

                    {/* Action Bar */}
                    <div className="flex gap-3 pb-4">
                        <button
                            onClick={() => setActiveTab('settings')}
                            className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center gap-2"
                        >
                            <Settings className="w-4 h-4" />
                            <span>Editar Perfil</span>
                        </button>
                    </div>
                </div>

                {/* Sticky Nav Dock */}
                <div className="sticky top-4 z-50 bg-[#050505]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-2 mb-8 shadow-2xl flex md:flex-wrap overflow-x-auto no-scrollbar justify-start gap-1">
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
                            className={`px-4 sm:px-6 py-3 rounded-xl flex items-center gap-2 sm:gap-3 transition-all flex-shrink-0 ${activeTab === tab.id
                                ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
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
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-6">Identidade</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 text-sm text-gray-300">
                                    <UserIcon className="w-4 h-4 text-brand-primary" />
                                    <span className="font-medium">{user.name}</span>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-gray-300">
                                    <Download className="w-4 h-4 text-brand-primary rotate-180" />
                                    <span className="font-medium truncate">{user.email}</span>
                                </div>
                                {user.whatsappNumber && (
                                    <div className="flex items-center gap-4 text-sm text-gray-300">
                                        <div className="w-4 h-4 flex items-center justify-center font-serif text-brand-primary text-xs font-bold">W</div>
                                        <span className="font-medium">{user.whatsappNumber}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Stats / Badges */}
                        <div className="bg-white/5 border border-white/5 rounded-3xl p-8 backdrop-blur-sm">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-6">Credenciais</h3>
                            <div className="flex flex-wrap gap-2">
                                <span className="px-3 py-1.5 bg-brand-primary/10 border border-brand-primary/20 rounded-lg text-[9px] font-black text-brand-primary uppercase tracking-widest">Leitor Elite</span>
                                <span className="px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-lg text-[9px] font-black text-blue-500 uppercase tracking-widest">Verificado</span>
                                <span className="px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-lg text-[9px] font-black text-purple-500 uppercase tracking-widest">Beta Tester</span>
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
                                {activeTab === 'library' && (
                                    <div className="bg-white/5 border border-white/5 rounded-[2.5rem] p-8 md:p-12">
                                        <div className="mb-10">
                                            <h2 className="text-3xl font-black uppercase italic tracking-tighter">Acervo Digital</h2>
                                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Sua coleção de obras licenciadas</p>
                                        </div>

                                        {isLoadingLibrary ? (
                                            <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-brand-primary animate-spin" /></div>
                                        ) : purchasedBooks.filter(b => b.format === 'digital' && b.digitalFileUrl).length > 0 ? (
                                            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                                {purchasedBooks.filter(b => b.format === 'digital' && b.digitalFileUrl).map((book) => (
                                                    <div key={book.id} className="bg-black/20 rounded-3xl p-4 border border-white/5 hover:border-brand-primary/30 transition-all group">
                                                        <div className="aspect-[2/3] rounded-2xl overflow-hidden mb-4 relative">
                                                            <img src={book.coverUrl} className="w-full h-full object-cover" alt={book.title} />
                                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                                <button onClick={() => handleDownload(book)} className="p-3 bg-brand-primary rounded-xl text-white hover:scale-110 transition-transform" title="Baixar Livro" aria-label="Baixar Livro"><Download className="w-5 h-5" /></button>
                                                            </div>
                                                        </div>
                                                        <h3 className="font-bold text-sm truncate">{book.title}</h3>
                                                        <p className="text-xs text-gray-500">{book.author}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-20 text-gray-600">
                                                <BookIcon className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                                <p className="text-sm font-medium">Nenhuma obra no acervo.</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'wishlist' && (
                                    <div className="bg-white/5 border border-white/5 rounded-[2.5rem] p-8 md:p-12">
                                        <div className="mb-10">
                                            <h2 className="text-3xl font-black uppercase italic tracking-tighter">Lista de Desejos</h2>
                                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Obras que pretende adquirir futuramente</p>
                                        </div>
                                        <div className="text-center py-20 text-gray-600">
                                            <Heart className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                            <p className="text-sm font-medium uppercase tracking-[0.2em]">Sua lista de desejos está vazia.</p>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'payments' && (
                                    <div className="bg-white/5 border border-white/5 rounded-[2.5rem] p-8 md:p-12">
                                        <div className="mb-10">
                                            <h2 className="text-3xl font-black uppercase italic tracking-tighter">Financeiro</h2>
                                        </div>
                                        <div className="space-y-4">
                                            {notifications.map((notif) => (
                                                <div key={notif.id} className="bg-black/20 p-6 rounded-3xl border border-white/5 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
                                                    <div>
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <span className="text-xs font-black uppercase text-gray-500">#{notif.orderId}</span>
                                                            <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${notif.status === 'confirmed' ? 'bg-green-500/20 text-green-500' :
                                                                notif.status === 'proof_uploaded' ? 'bg-blue-500/20 text-blue-500' : 'bg-yellow-500/20 text-yellow-500'
                                                                }`}>
                                                                {notif.status === 'confirmed' ? 'PAGO' : notif.status === 'proof_uploaded' ? 'ANÁLISE' : 'PEDENTE'}
                                                            </span>
                                                        </div>
                                                        <p className="text-xl font-black text-white">{notif.totalAmount.toLocaleString()} Kz</p>
                                                    </div>
                                                    {notif.status === 'pending' && (
                                                        <div className="relative">
                                                            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => e.target.files && handleUploadProof(notif.id, e.target.files[0])} disabled={isUploading === notif.id} title="Enviar Comprovante" aria-label="Enviar Comprovante" />
                                                            <button className="px-6 py-3 bg-brand-primary rounded-xl text-[10px] font-black uppercase tracking-widest text-white hover:brightness-110 transition-all">
                                                                {isUploading === notif.id ? 'ENVIANDO...' : 'ENVIAR COMPROVANTE'}
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                            {notifications.length === 0 && <p className="text-center text-gray-500 py-10">Sem transações recentes.</p>}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'history' && (
                                    <div className="bg-white/5 border border-white/5 rounded-[2.5rem] p-8 md:p-12">
                                        <div className="mb-10">
                                            <h2 className="text-3xl font-black uppercase italic tracking-tighter">Logs de Atividade</h2>
                                        </div>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left">
                                                <thead className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 border-b border-white/5">
                                                    <tr>
                                                        <th className="pb-4 pl-4">Obra</th>
                                                        <th className="pb-4">Data</th>
                                                        <th className="pb-4 text-right pr-4">Valor</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-white/5">
                                                    {purchasedBooks.map(book => (
                                                        <tr key={book.id}>
                                                            <td className="py-4 pl-4 font-bold text-sm">{book.title}</td>
                                                            <td className="py-4 text-xs text-gray-500">Hoje</td>
                                                            <td className="py-4 text-right pr-4 font-mono text-brand-primary">{book.price.toLocaleString()} Kz</td>
                                                        </tr>
                                                    ))}
                                                    {purchasedBooks.length === 0 && (
                                                        <tr><td colSpan={3} className="py-8 text-center text-gray-600 text-xs">Sem registos</td></tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'settings' && (
                                    <div className="bg-white/5 border border-white/5 rounded-[2.5rem] p-8 md:p-12">
                                        <div className="mb-10">
                                            <h2 className="text-3xl font-black uppercase italic tracking-tighter">Editar Perfil</h2>
                                        </div>
                                        <div className="space-y-6 max-w-lg">
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 pl-2">Nome</label>
                                                <input
                                                    type="text"
                                                    value={profileData.name}
                                                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-primary outline-none transition-colors font-bold"
                                                    placeholder="Seu Nome"
                                                    title="Nome"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 pl-2">Email</label>
                                                <input
                                                    type="text"
                                                    value={profileData.email}
                                                    readOnly
                                                    className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-3 text-gray-500 cursor-not-allowed font-bold"
                                                    title="Email"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 pl-2">WhatsApp</label>
                                                <input
                                                    type="text"
                                                    value={profileData.whatsapp}
                                                    onChange={(e) => setProfileData({ ...profileData, whatsapp: e.target.value })}
                                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-primary outline-none transition-colors font-bold"
                                                    placeholder="Seu WhatsApp"
                                                    title="WhatsApp"
                                                />
                                            </div>
                                            <div className="pt-4">
                                                <button
                                                    onClick={handleSaveProfile}
                                                    disabled={isSavingProfile}
                                                    className="w-full py-4 bg-brand-primary rounded-xl text-white font-black uppercase tracking-[0.2em] hover:brightness-110 transition-all disabled:opacity-50"
                                                >
                                                    {isSavingProfile ? 'Salvando...' : 'Salvar Alterações'}
                                                </button>
                                            </div>
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

export default ReaderDashboard;
