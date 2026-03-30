import React, { useState, useEffect } from 'react';
import {
    FileText,
    Search,
    Clock,
    CheckCircle2,
    XCircle,
    Eye,
    Download,
    MoreVertical,
    ChevronRight,
    Filter,
    Loader2,
    Mail,
    User as UserIcon,
    MessageSquare,
    BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../../services/firebase';
import { collection, query, getDocs, orderBy, updateDoc, doc } from 'firebase/firestore';
import { Manuscript } from '../../types';
import { useToast } from '../../components/Toast';

const AdminManuscripts: React.FC = () => {
    const [manuscripts, setManuscripts] = useState<Manuscript[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | Manuscript['status']>('all');
    const { showToast } = useToast();

    useEffect(() => {
        loadManuscripts();
    }, []);

    const loadManuscripts = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, 'manuscripts'), orderBy('submittedDate', 'desc'));
            const snapshot = await getDocs(q);
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Manuscript[];
            setManuscripts(data);
        } catch (error) {
            showToast('Erro ao carregar manuscritos', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id: string, newStatus: Manuscript['status']) => {
        try {
            const docRef = doc(db, 'manuscripts', id);
            await updateDoc(docRef, {
                status: newStatus,
                reviewedDate: new Date().toISOString()
            });
            setManuscripts(prev => prev.map(m => m.id === id ? { ...m, status: newStatus } : m));
            showToast(`Estado do manuscrito atualizado para ${newStatus}`, 'success');
        } catch (error) {
            showToast('Erro ao atualizar estado', 'error');
        }
    };

    const filteredManuscripts = manuscripts.filter(m => {
        const matchesSearch =
            m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.authorName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || m.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status: Manuscript['status']) => {
        switch (status) {
            case 'approved': return 'bg-green-50 text-green-600 border-green-100';
            case 'rejected': return 'bg-red-50 text-red-600 border-red-100';
            case 'review': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'published': return 'bg-brand-primary/10 text-brand-primary border-brand-primary/20';
            default: return 'bg-amber-50 text-amber-600 border-amber-100';
        }
    };

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <span className="text-brand-primary font-bold uppercase tracking-[0.4em] text-[10px]">Novos Talentos</span>
                    <h2 className="text-4xl sm:text-5xl font-black text-brand-dark uppercase tracking-tighter leading-none mt-2">
                        Manuscritos
                    </h2>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Pesquisar por título ou autor..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-brand-primary/20 transition-all outline-none"
                    />
                </div>
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                    className="w-full md:w-auto px-4 py-3 bg-gray-50 border-none rounded-2xl text-xs font-bold uppercase tracking-widest outline-none cursor-pointer hover:bg-gray-100 transition-colors"
                    title="Filtrar por estado"
                >
                    <option value="all">Todos os Estados</option>
                    <option value="pending">⏳ Pendentes</option>
                    <option value="review">🔍 Em Análise</option>
                    <option value="approved">✅ Aprovados</option>
                    <option value="rejected">❌ Rejeitados</option>
                    <option value="published">📚 Publicados</option>
                </select>
            </div>

            {/* Manuscripts List */}
            {loading ? (
                <div className="h-64 flex flex-col items-center justify-center gap-4 text-gray-400">
                    <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
                    <span className="text-xs font-bold uppercase tracking-widest">A carregar manuscritos...</span>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    <AnimatePresence mode="popLayout">
                        {filteredManuscripts.map((m, index) => (
                            <motion.div
                                key={m.id}
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: index * 0.05 }}
                                className="group bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500 overflow-hidden"
                            >
                                <div className="p-8 flex flex-col lg:flex-row gap-8 items-start lg:items-center">
                                    {/* Icon & Status */}
                                    <div className="shrink-0 flex flex-col items-center gap-4">
                                        <div className="w-16 h-16 rounded-2xl bg-brand-primary/5 flex items-center justify-center text-brand-primary group-hover:scale-110 transition-transform">
                                            <FileText className="w-8 h-8" />
                                        </div>
                                        <div className={`px-4 py-1.5 rounded-full border text-[8px] font-black uppercase tracking-widest ${getStatusColor(m.status)}`}>
                                            {m.status}
                                        </div>
                                    </div>

                                    {/* Basic Info */}
                                    <div className="flex-1 min-w-0">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-brand-primary mb-1 block">
                                            {m.genre}
                                        </span>
                                        <h3 className="text-xl font-black text-brand-dark mb-2 group-hover:text-brand-primary transition-colors">
                                            {m.title}
                                        </h3>
                                        <div className="flex items-center gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                                            <span className="flex items-center gap-2">
                                                <UserIcon className="w-3 h-3" />
                                                {m.authorName}
                                            </span>
                                            <span className="hidden sm:block">•</span>
                                            <span className="hidden sm:flex items-center gap-2">
                                                <BookOpen className="w-3 h-3" />
                                                {m.pages || '?'} Páginas
                                            </span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-3 shrink-0 self-center lg:self-auto">
                                        <a
                                            href={m.fileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-4 bg-gray-50 hover:bg-brand-dark hover:text-white rounded-2xl transition-all shadow-sm flex items-center gap-3"
                                            title="Descarregar Manuscrito"
                                        >
                                            <Download className="w-5 h-5" />
                                            <span className="text-[10px] font-black uppercase tracking-widest hidden sm:block">PDF</span>
                                        </a>

                                        <div className="w-px h-8 bg-gray-100 mx-2" />

                                        <div className="flex items-center gap-2">
                                            {m.status === 'pending' && (
                                                <button
                                                    onClick={() => handleUpdateStatus(m.id, 'review')}
                                                    className="px-4 py-3 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
                                                >
                                                    Iniciar Análise
                                                </button>
                                            )}
                                            {(m.status === 'pending' || m.status === 'review') && (
                                                <>
                                                    <button
                                                        onClick={() => handleUpdateStatus(m.id, 'approved')}
                                                        className="p-3 bg-green-50 text-green-600 hover:bg-green-600 hover:text-white rounded-xl transition-all"
                                                        title="Aprovar"
                                                    >
                                                        <CheckCircle2 className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleUpdateStatus(m.id, 'rejected')}
                                                        className="p-3 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-xl transition-all"
                                                        title="Rejeitar"
                                                    >
                                                        <XCircle className="w-5 h-5" />
                                                    </button>
                                                </>
                                            )}
                                            <button className="p-3 bg-gray-50 hover:bg-brand-primary hover:text-white rounded-xl transition-all" title="Feedback">
                                                <MessageSquare className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer Meta */}
                                <div className="bg-gray-50/50 px-8 py-3 border-t border-gray-50 flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-gray-400">
                                    <div className="flex items-center gap-4">
                                        <span className="flex items-center gap-2">
                                            <Clock className="w-3 h-3" />
                                            Submetido em {new Date(m.submittedDate).toLocaleDateString()}
                                        </span>
                                        {m.email && (
                                            <span className="flex items-center gap-2">
                                                <Mail className="w-3 h-3" />
                                                {m.email}
                                            </span>
                                        )}
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-gray-300" />
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {!loading && filteredManuscripts.length === 0 && (
                <div className="py-20 text-center">
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Nenhum manuscrito encontrado</p>
                </div>
            )}
        </div>
    );
};

export default AdminManuscripts;
