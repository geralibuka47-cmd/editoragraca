import React, { useState, useEffect } from 'react';
import { motion as m, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle, XCircle, FileText, ExternalLink, MessageSquare, Search, Calendar, User as UserIcon, X, Send, BookOpen, AlertCircle } from 'lucide-react';
import { Manuscript } from '../../types';
import { useToast } from '../Toast';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';

const AdminManuscriptsTab: React.FC = () => {
    const { showToast } = useToast();
    const [manuscripts, setManuscripts] = useState<Manuscript[]>([]);
    const [filteredManuscripts, setFilteredManuscripts] = useState<Manuscript[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoadingManuscripts, setIsLoadingManuscripts] = useState(true);
    const [selectedManuscript, setSelectedManuscript] = useState<Manuscript | null>(null);
    const [feedback, setFeedback] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchManuscripts = async () => {
        setIsLoadingManuscripts(true);
        try {
            const { getAllManuscripts } = await import('../../services/dataService');
            const data = await getAllManuscripts();
            setManuscripts(data);
            setFilteredManuscripts(data);
        } catch (error) {
            console.error('Erro ao buscar manuscritos:', error);
        } finally {
            setIsLoadingManuscripts(false);
        }
    };

    useEffect(() => {
        fetchManuscripts();
    }, []);

    useEffect(() => {
        const query = searchQuery.toLowerCase();
        setFilteredManuscripts(
            manuscripts.filter(m =>
                m.title?.toLowerCase().includes(query) ||
                m.authorName?.toLowerCase().includes(query)
            )
        );
    }, [searchQuery, manuscripts]);

    const handleReviewManuscript = async (status: 'approved' | 'rejected') => {
        if (!selectedManuscript) return;
        setIsSubmitting(true);
        try {
            const { updateManuscriptStatus } = await import('../../services/dataService');
            await updateManuscriptStatus(selectedManuscript.id, status, feedback);
            setSelectedManuscript(null);
            setFeedback('');
            fetchManuscripts();
            showToast(`Manuscrito ${status === 'approved' ? 'aprovado' : 'rejeitado'} com sucesso!`, 'success');
        } catch (error) {
            console.error('Erro ao atualizar status:', error);
            showToast('Erro ao atualizar o status do manuscrito.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-12">
            {/* Header Section */}
            <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-8">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-8 bg-brand-primary rounded-full shadow-[0_0_15px_rgba(189,147,56,0.5)]" />
                        <h2 className="text-3xl font-black text-white tracking-tighter uppercase mb-0">Curadoria <span className="text-brand-primary italic font-light lowercase">Editorial</span></h2>
                    </div>
                    <p className="text-gray-500 font-bold text-xs uppercase tracking-widest pl-4">Avaliação de Novas Propostas Literárias</p>
                </div>

                <Input
                    placeholder="LOCALIZAR PROPOSTA..."
                    variant="glass"
                    icon={<Search className="w-4 h-4" />}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="md:w-96"
                />
            </div>

            {/* Content Display */}
            <div className="bg-white/5 rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full min-w-[900px] border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/5">
                                <th className="px-10 py-8 text-left text-[9px] font-black text-gray-500 uppercase tracking-[0.3em]">Obra & Género</th>
                                <th className="px-10 py-8 text-left text-[9px] font-black text-gray-500 uppercase tracking-[0.3em]">Autor / Origem</th>
                                <th className="px-10 py-8 text-left text-[9px] font-black text-gray-500 uppercase tracking-[0.3em]">Estado Crítico</th>
                                <th className="px-10 py-8 text-left text-[9px] font-black text-gray-500 uppercase tracking-[0.3em]">Envio</th>
                                <th className="px-10 py-8 text-center text-[9px] font-black text-gray-500 uppercase tracking-[0.3em]">Auditoria</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            <AnimatePresence mode="popLayout">
                                {isLoadingManuscripts ? (
                                    [1, 2, 3].map(i => (
                                        <tr key={i} className="animate-pulse">
                                            <td colSpan={5} className="px-10 py-8">
                                                <div className="h-4 bg-white/5 rounded-full w-full"></div>
                                            </td>
                                        </tr>
                                    ))
                                ) : filteredManuscripts.length > 0 ? (
                                    filteredManuscripts.map((m_item) => (
                                        <m.tr
                                            key={m_item.id}
                                            layout
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="hover:bg-white/[0.03] transition-colors group"
                                        >
                                            <td className="px-10 py-8">
                                                <div className="flex flex-col gap-1.5">
                                                    <span className="font-black text-white text-[14px] tracking-tight">{m_item.title}</span>
                                                    <span className="text-[9px] font-black uppercase tracking-[0.1em] text-brand-primary/60">{m_item.genre}</span>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-bold text-gray-300 text-xs">{m_item.authorName}</span>
                                                    <span className="text-[10px] text-gray-500 font-medium lowercase italic">{m_item.email}</span>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <span className={`px-4 py-2 rounded-xl border text-[9px] font-black uppercase tracking-[0.2em] w-fit flex items-center gap-2.5 shadow-lg ${m_item.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                    m_item.status === 'rejected' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                                        'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                                    }`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${m_item.status === 'approved' ? 'bg-emerald-400' :
                                                        m_item.status === 'rejected' ? 'bg-red-400' :
                                                            'bg-amber-400'
                                                        }`} />
                                                    {m_item.status === 'approved' ? 'Aprovado' : m_item.status === 'rejected' ? 'Rejeitado' : 'Em Análise'}
                                                </span>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-3 text-[10px] text-gray-500 font-black uppercase tracking-widest">
                                                    <Calendar className="w-4 h-4 text-gray-700" />
                                                    {new Date(m_item.submittedDate).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-10 py-8 text-center">
                                                <button
                                                    onClick={() => setSelectedManuscript(m_item)}
                                                    className="px-8 py-3 bg-white/5 hover:bg-brand-primary/10 text-gray-500 hover:text-brand-primary rounded-xl transition-all border border-white/5 font-black text-[9px] uppercase tracking-widest"
                                                >
                                                    Analisar
                                                </button>
                                            </td>
                                        </m.tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="py-40 text-center">
                                            <div className="flex flex-col items-center gap-6 opacity-20">
                                                <FileText className="w-16 h-16 text-brand-primary" />
                                                <p className="font-black text-[11px] uppercase tracking-[0.4em]">Nenhum Manuscrito Identificado</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Manuscript Analysis Modal */}
            <AnimatePresence>
                {selectedManuscript && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <m.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedManuscript(null)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-2xl"
                        />
                        <m.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-[#0A0A0A] rounded-[3rem] w-full max-w-2xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] relative z-20 border border-white/10"
                        >
                            <div className="p-12 border-b border-white/5 relative bg-gradient-to-b from-white/[0.02] to-transparent">
                                <button
                                    onClick={() => setSelectedManuscript(null)}
                                    title="Fechar análise"
                                    aria-label="Fechar análise"
                                    className="absolute top-10 right-10 w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                                            <BookOpen className="w-5 h-5" />
                                        </div>
                                        <h3 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">Análise Técnica</h3>
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Obra: <span className="text-brand-primary">{selectedManuscript.title}</span></p>
                                </div>
                            </div>

                            <div className="p-12 space-y-10">
                                <div className="grid grid-cols-2 gap-10">
                                    <div className="space-y-2">
                                        <span className="block text-[9px] font-black uppercase tracking-[0.3em] text-gray-600">Proponente</span>
                                        <p className="font-bold text-white flex items-center gap-3"><UserIcon className="w-4 h-4 text-brand-primary/40" /> {selectedManuscript.authorName}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <span className="block text-[9px] font-black uppercase tracking-[0.3em] text-gray-600">Género Literário</span>
                                        <p className="font-black text-brand-primary text-xs uppercase tracking-widest">{selectedManuscript.genre}</p>
                                    </div>
                                </div>

                                <m.a
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    href={selectedManuscript.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full py-8 bg-white/5 border border-white/5 rounded-[2rem] text-center font-black text-white text-[11px] uppercase tracking-[0.3em] hover:bg-brand-primary/10 hover:border-brand-primary/20 transition-all group flex items-center justify-center gap-4 shadow-2xl"
                                >
                                    <FileText className="w-5 h-5 text-brand-primary group-hover:animate-bounce" />
                                    Download Manuscrito (PDF)
                                </m.a>

                                <Textarea
                                    label="Parecer do Conselho Editorial"
                                    variant="glass"
                                    placeholder="Descreva as razões fundamentais para a decisão final..."
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    className="h-40"
                                />
                            </div>

                            <div className="p-12 bg-white/[0.02] flex flex-wrap justify-end gap-6 border-t border-white/5">
                                <Button
                                    onClick={() => handleReviewManuscript('rejected')}
                                    disabled={isSubmitting}
                                    isLoading={isSubmitting}
                                    variant="outline"
                                    className="px-8 border-red-500/20 text-red-400 hover:bg-red-500/10"
                                    leftIcon={!isSubmitting && <XCircle className="w-4 h-4" />}
                                >
                                    Rejeitar Obra
                                </Button>
                                <Button
                                    onClick={() => handleReviewManuscript('approved')}
                                    disabled={isSubmitting}
                                    isLoading={isSubmitting}
                                    className="px-12"
                                    leftIcon={!isSubmitting && <CheckCircle className="w-4 h-4" />}
                                >
                                    Homologar Proposta
                                </Button>
                            </div>
                        </m.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminManuscriptsTab;

