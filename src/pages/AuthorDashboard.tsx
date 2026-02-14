import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FileText, Send, DollarSign, User as UserIcon,
    TrendingUp, Plus, Clock, CheckCircle,
    ChevronRight, ArrowRight, Loader2, Target,
    Zap, BookOpen, ShieldCheck, LogOut,
    Eye, MoreVertical, CreditCard, Banknote,
    Upload, Info, Settings, Save, Trash2, X
} from 'lucide-react';
import { m, AnimatePresence } from 'framer-motion';
import { useToast } from '../components/Toast';
import { User, Manuscript, Royalties } from '../types';

interface AuthorDashboardProps {
    user: User | null;
}

const AuthorDashboard: React.FC<AuthorDashboardProps> = ({ user }) => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [activeTab, setActiveTab] = useState<'overview' | 'manuscripts' | 'royalties' | 'profile' | 'banking'>('overview');
    const [manuscripts, setManuscripts] = useState<Manuscript[]>([]);
    const [royalties, setRoyalties] = useState<Royalties | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Profile & Banking state
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        bio: '',
        whatsapp: user?.whatsappNumber || ''
    });
    const [bankData, setBankData] = useState({
        bankName: '',
        iban: '',
        accountHolder: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;
            setIsLoading(true);
            try {
                const { getAuthorManuscripts, getAuthorRoyalties } = await import('../services/dataService');
                const [manuscriptData, royaltyData] = await Promise.all([
                    getAuthorManuscripts(user.id),
                    getAuthorRoyalties(user.id)
                ]);
                setManuscripts(manuscriptData);
                setRoyalties(royaltyData);
            } catch (error) {
                console.error('Error fetching author data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [user]);

    const handleAction = (type: string) => {
        showToast(`Função "${type}" será implementada em breve.`, 'info');
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
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">Área do Autor</h2>
                    <p className="text-gray-400 mb-8 font-medium">Autentique-se para gerir as suas obras e royalties.</p>
                    <button
                        onClick={() => navigate('/login')}
                        className="w-full py-5 bg-brand-primary text-white font-black uppercase tracking-widest rounded-2xl hover:brightness-110 transition-all shadow-xl shadow-brand-primary/20"
                    >
                        Entrar como Autor
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
            {/* 1. KINETIC BACKGROUND */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-5%] left-[-5%] w-[60%] h-[60%] bg-brand-primary/10 blur-[150px] rounded-full" />
                <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] bg-blue-600/5 blur-[120px] rounded-full" />
            </div>

            {/* 2. PREMIUM HEADER */}
            <header className="relative pt-32 pb-16 px-6 md:px-12 overflow-hidden border-b border-white/5">
                <div className="container mx-auto">
                    <div className="flex flex-col md:flex-row items-center gap-12">
                        {/* Avatar / Portrait */}
                        <div className="relative group">
                            <div className="w-44 h-44 md:w-60 md:h-60 rounded-[3rem] p-2 bg-gradient-to-tr from-brand-primary to-blue-600 shadow-2xl relative z-10 overflow-hidden transform group-hover:rotate-3 transition-transform duration-700">
                                <div className="w-full h-full rounded-[2.5rem] bg-[#050505] flex items-center justify-center text-7xl font-black text-white uppercase">
                                    {user.name.charAt(0)}
                                </div>
                            </div>
                            <m.div
                                initial={{ scale: 0 }} animate={{ scale: 1 }}
                                className="absolute -bottom-4 -right-4 z-20 w-12 h-12 bg-white text-brand-dark rounded-2xl flex items-center justify-center shadow-3xl"
                            >
                                <Zap className="w-6 h-6 fill-brand-primary text-brand-primary" />
                            </m.div>
                        </div>

                        {/* identity & Mission */}
                        <div className="flex-1 text-center md:text-left space-y-6">
                            <div className="space-y-2">
                                <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none flex flex-wrap items-center justify-center md:justify-start gap-x-4">
                                    {user.name.split(' ')[0]}
                                    <span className="italic font-serif font-light lowercase text-brand-primary">{user.name.split(' ').slice(1).join(' ')}</span>
                                </h1>
                                <p className="text-gray-500 font-bold uppercase tracking-[0.4em] text-[10px] flex items-center justify-center md:justify-start gap-4">
                                    <ShieldCheck className="w-4 h-4 text-brand-primary" />
                                    Autor Premium Certificado • {new Date().getFullYear()}
                                </p>
                            </div>

                            <div className="flex flex-wrap justify-center md:justify-start gap-4">
                                <div className="px-6 py-4 bg-white/5 border border-white/5 rounded-2xl backdrop-blur-xl">
                                    <p className="text-2xl font-black text-white">{manuscripts.length}</p>
                                    <p className="text-[8px] font-black uppercase tracking-widest text-gray-500">Obras Registadas</p>
                                </div>
                                <div className="px-6 py-4 bg-brand-primary/10 border border-brand-primary/20 rounded-2xl backdrop-blur-xl">
                                    <p className="text-2xl font-black text-brand-primary">{royalties?.totalSales || 0}</p>
                                    <p className="text-[8px] font-black uppercase tracking-widest text-brand-primary/60">Vendas Totais</p>
                                </div>
                            </div>
                        </div>

                        {/* Floating Action */}
                        <m.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleAction('submeter_manuscrito')}
                            className="px-10 py-6 bg-white text-brand-dark rounded-[2rem] font-black text-[10px] uppercase tracking-widest flex items-center gap-4 shadow-3xl hover:bg-brand-primary hover:text-white transition-all"
                        >
                            <Plus className="w-4 h-4" /> Submeter Nova Obra
                        </m.button>
                    </div>
                </div>
            </header>

            {/* 3. NAVIGATION DOCK */}
            <nav className="sticky top-8 z-50 container mx-auto px-6 mt-12 mb-16">
                <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-3 flex items-center justify-between shadow-4xl overflow-x-auto no-scrollbar">
                    <div className="flex gap-2">
                        {[
                            { id: 'overview', label: 'Dashboard', icon: TrendingUp },
                            { id: 'manuscripts', label: 'Obras', icon: FileText },
                            { id: 'royalties', label: 'Receitas', icon: DollarSign },
                            { id: 'profile', label: 'Escritor', icon: UserIcon },
                            { id: 'banking', label: 'Bancário', icon: CreditCard }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`px-8 py-5 rounded-[1.75rem] flex items-center gap-4 transition-all whitespace-nowrap ${activeTab === tab.id
                                    ? 'bg-brand-primary text-white shadow-2xl shadow-brand-primary/30'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'animate-pulse' : ''}`} />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">{tab.label}</span>
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={async () => {
                            const { logout } = await import('../services/authService');
                            await logout();
                            navigate('/');
                        }}
                        className="p-5 rounded-2xl text-red-400 hover:bg-red-400/10 transition-colors"
                        title="Sair da Plataforma"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </nav>

            {/* 4. MAIN CONTENT */}
            <main className="container mx-auto px-6">
                <AnimatePresence mode="wait">
                    <m.div
                        key={activeTab}
                        {...fadeInUp}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <div className="bg-white/5 border border-white/10 rounded-[3.5rem] p-10 md:p-20 backdrop-blur-3xl shadow-5xl min-h-[600px] relative overflow-hidden">

                            {/* Decorative Tab Label */}
                            <div className="absolute top-10 right-10 text-[120px] font-black uppercase text-white/5 select-none pointer-events-none leading-none tracking-tighter">
                                {activeTab}
                            </div>

                            {/* TAB: OVERVIEW */}
                            {activeTab === 'overview' && (
                                <div className="space-y-16">
                                    <div className="space-y-6 pt-4">
                                        <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-tight">Insight Editorial</h2>
                                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-primary max-w-lg">Visão estratégica do desempenho das suas obras publicadas.</p>
                                    </div>

                                    <div className="grid md:grid-cols-3 gap-8">
                                        <div className="bg-black/20 p-10 rounded-[2.5rem] border border-white/5 space-y-4 group hover:border-brand-primary/30 transition-all">
                                            <div className="w-12 h-12 bg-brand-primary/10 rounded-xl flex items-center justify-center text-brand-primary">
                                                <Eye className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="text-4xl font-black uppercase tracking-tighter">0.0k</p>
                                                <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 mt-2">Leituras Estimadas</p>
                                            </div>
                                        </div>
                                        <div className="bg-black/20 p-10 rounded-[2.5rem] border border-white/5 space-y-4 group hover:border-blue-500/30 transition-all">
                                            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500">
                                                <BookOpen className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="text-4xl font-black uppercase tracking-tighter">{manuscripts.length}</p>
                                                <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 mt-2">Obras em Circulação</p>
                                            </div>
                                        </div>
                                        <div className="bg-black/20 p-10 rounded-[2.5rem] border border-white/5 space-y-4 group hover:border-yellow-500/30 transition-all">
                                            <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center text-yellow-500">
                                                <DollarSign className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="text-4xl font-black uppercase tracking-tighter">{royalties?.pendingAmount.toLocaleString() || 0} Kz</p>
                                                <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 mt-2">Saldo a Liquidar</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-brand-primary/5 border border-brand-primary/10 rounded-[3rem] p-12 text-center space-y-6">
                                        <Target className="w-12 h-12 text-brand-primary mx-auto opacity-40" />
                                        <h3 className="text-2xl font-black uppercase tracking-tight">Novos Mercados em Breve</h3>
                                        <p className="text-sm text-gray-400 max-w-md mx-auto">Estamos a expandir a distribuição das suas obras para mercados internacionais. Mantenha os seus dados atualizados.</p>
                                    </div>
                                </div>
                            )}

                            {/* TAB: MANUSCRIPTS */}
                            {activeTab === 'manuscripts' && (
                                <div className="space-y-12">
                                    <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-10">
                                        <div className="space-y-4">
                                            <h2 className="text-5xl font-black uppercase italic tracking-tighter">Obras & Arquivos</h2>
                                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-primary">Gestão de manuscritos e edições finais.</p>
                                        </div>
                                        <div className="flex gap-4">
                                            <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest text-gray-400">Filtrar</button>
                                            <button className="px-6 py-3 bg-brand-primary text-white rounded-xl text-[9px] font-black uppercase tracking-widest">Todos</button>
                                        </div>
                                    </div>

                                    {isLoading ? (
                                        <div className="flex justify-center py-24"><Loader2 className="w-12 h-12 text-brand-primary animate-spin" /></div>
                                    ) : manuscripts.length > 0 ? (
                                        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-8">
                                            {manuscripts.map((item) => (
                                                <m.div
                                                    key={item.id}
                                                    whileHover={{ y: -8 }}
                                                    className="bg-black/30 rounded-[2.5rem] p-8 border border-white/5 space-y-6 group"
                                                >
                                                    <div className="flex justify-between items-start">
                                                        <div className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest ${item.status === 'published' ? 'bg-green-500 text-white' :
                                                            item.status === 'review' ? 'bg-yellow-500 text-black' : 'bg-white/10 text-white'
                                                            }`}>
                                                            {item.status === 'published' ? 'Publicado' : item.status === 'review' ? 'Em Revisão' : 'Pendente'}
                                                        </div>
                                                        <button
                                                            className="p-2 text-gray-600 hover:text-white"
                                                            title="Opções da Obra"
                                                            aria-label="Opções da Obra"
                                                        >
                                                            <MoreVertical className="w-5 h-5" />
                                                        </button>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <h3 className="text-xl font-black uppercase tracking-tight group-hover:text-brand-primary transition-colors">{item.title}</h3>
                                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{item.genre}</p>
                                                    </div>

                                                    <div className="pt-4 flex justify-between items-center border-t border-white/5">
                                                        <div className="flex items-center gap-2 text-gray-500">
                                                            <Clock className="w-3 h-3" />
                                                            <span className="text-[9px] font-black uppercase tracking-widest">Atualizado Ontem</span>
                                                        </div>
                                                        <ChevronRight className="w-4 h-4 text-brand-primary group-hover:translate-x-2 transition-transform" />
                                                    </div>
                                                </m.div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-32 space-y-6 opacity-30">
                                            <FileText className="w-20 h-20 mx-auto" />
                                            <p className="text-xs font-black uppercase tracking-[0.3em]">Nenhum manuscrito registado.</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* TAB: ROYALTIES */}
                            {activeTab === 'royalties' && (
                                <div className="space-y-16">
                                    <div className="space-y-6 pt-4">
                                        <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter">Fluxo de Caixa</h2>
                                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-primary">Contabilidade transparente dos seus direitos de autor.</p>
                                    </div>

                                    <div className="bg-black/20 rounded-[3rem] p-12 border border-white/5 flex flex-col md:flex-row gap-12 items-center">
                                        <div className="flex-1 space-y-4 text-center md:text-left">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Saldo a Liquidar</p>
                                            <h3 className="text-6xl md:text-8xl font-black uppercase tracking-tighter italic text-brand-primary">
                                                {royalties?.pendingAmount.toLocaleString() || 0} <span className="text-2xl not-italic text-white">KZ</span>
                                            </h3>
                                            <p className="text-sm text-gray-400">Próxima liquidação estimada para o dia 30 de cada mês.</p>
                                        </div>
                                        <button className="px-12 py-6 bg-white text-brand-dark rounded-3xl font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-4xl shadow-white/5">
                                            Solicitar Liquidação
                                        </button>
                                    </div>

                                    <div className="space-y-6">
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500 pl-4">Histórico de Pagamentos</h4>
                                        <div className="overflow-hidden bg-black/40 rounded-[2.5rem] border border-white/5">
                                            <table className="w-full text-left">
                                                <thead className="bg-white/5">
                                                    <tr className="text-[9px] font-black uppercase tracking-widest text-gray-500">
                                                        <th className="px-10 py-6">ID / Referência</th>
                                                        <th className="px-10 py-6 text-center">Data</th>
                                                        <th className="px-10 py-6 text-right">Montante</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td colSpan={3} className="px-10 py-16 text-center text-gray-600 text-[10px] font-black uppercase tracking-widest">
                                                            Nenhum pagamento efetuado até à data.
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB: PROFILE & BANKING */}
                            {activeTab === 'profile' && (
                                <div className="max-w-xl space-y-12">
                                    <div className="space-y-4">
                                        <h2 className="text-5xl font-black uppercase italic tracking-tighter">Identidade</h2>
                                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-primary">Informações públicas de autor.</p>
                                    </div>

                                    <div className="grid gap-10">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 pl-2">Nome Editorial</label>
                                            <input
                                                type="text"
                                                value={profileData.name}
                                                readOnly
                                                className="w-full bg-white/5 border border-white/5 rounded-2xl p-6 text-white font-bold text-xl outline-none opacity-60"
                                                title="Nome Editorial"
                                                placeholder="Nome Editorial"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 pl-2">Biografia Sintetizada</label>
                                            <textarea className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white font-medium text-lg outline-none focus:border-brand-primary transition-all h-40" placeholder="Escreva sobre a sua trajetória literária..." defaultValue={profileData.bio}></textarea>
                                        </div>
                                        <button className="w-full py-6 bg-brand-primary text-white rounded-3xl font-black uppercase tracking-widest hover:brightness-110 shadow-3xl shadow-brand-primary/20 transition-all">
                                            Atualizar Identidade
                                        </button>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'banking' && (
                                <div className="max-w-xl space-y-12">
                                    <div className="space-y-4">
                                        <h2 className="text-5xl font-black uppercase italic tracking-tighter">Terminal Bancário</h2>
                                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-primary">Dados para liquidação de royalties.</p>
                                    </div>

                                    <div className="bg-gradient-to-br from-[#111] to-black p-10 rounded-[3rem] border border-white/10 space-y-10 relative overflow-hidden group shadow-6xl">
                                        <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                                            <Banknote className="w-40 h-40" />
                                        </div>

                                        <div className="space-y-8 relative z-10">
                                            <div className="space-y-1">
                                                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500">Banco de Destino</p>
                                                <p className="text-xl font-black uppercase text-white">{bankData.bankName || 'Não Definido'}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500">IBAN para Transferências</p>
                                                <p className="text-xl font-black tracking-widest text-white">{bankData.iban || 'AO06 0000 0000 0000 0000 0'}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500">Titular da Conta</p>
                                                <p className="text-xl font-black uppercase text-white">{bankData.accountHolder || (user.name)}</p>
                                            </div>
                                        </div>

                                        <button onClick={() => showToast('Edição de dados bancários bloqueada. Contacte o suporte.', 'warning')} className="w-full py-5 bg-white/5 border border-white/5 rounded-2xl text-[9px] font-black uppercase tracking-[0.3em] hover:bg-white/10 transition-all">
                                            Solicitar Alteração de Dados
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-4 text-gray-500 px-4">
                                        <ShieldCheck className="w-5 h-5" />
                                        <p className="text-[8px] font-black uppercase tracking-widest">Os seus dados bancários são encriptados e processados apenas para liquidação de royalties.</p>
                                    </div>
                                </div>
                            )}

                        </div>
                    </m.div>
                </AnimatePresence>
            </main>
        </div>
    );
};

export default AuthorDashboard;
