import React, { useState, useEffect } from 'react';
import { motion as m, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle, XCircle, FileText, MessageSquare, Search, Calendar, User as UserIcon, X, Send, BookOpen } from 'lucide-react';
import { Manuscript } from '../../types';
import { useToast } from '../../components/Toast';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';

const AdminManuscriptsPage: React.FC = () => {
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
        <div className="space-y-6">
            <AdminPageHeader title="Manuscritos" subtitle="Avaliação de novas propostas literárias" highlight="Editorial">
                <Input
                    placeholder="Pesquisar proposta..."
                    variant="light"
                    icon={<Search className="w-4 h-4" />}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full sm:w-72"
                />
            </AdminPageHeader>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[640px] border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Obra & Género</th>
                                <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Autor</th>
                                <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Estado</th>
                                <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Envio</th>
                                <th className="px-4 sm:px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            <AnimatePresence mode="popLayout">
                                {isLoadingManuscripts ? (
                                    [1, 2, 3].map(i => (
                                        <tr key={i} className="animate-pulse">
                                            <td colSpan={5} className="px-4 sm:px-6 py-4">
                                                <div className="h-4 bg-gray-100 rounded-full w-full"></div>
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
                                            className="hover:bg-gray-50 transition-colors group"
                                        >
                                            <td className="px-4 sm:px-6 py-4">
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="font-semibold text-gray-900 text-sm tracking-tight">{m_item.title}</span>
                                                    <span className="text-[10px] font-medium text-brand-primary/70">{m_item.genre}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 sm:px-6 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-bold text-slate-700 text-xs">{m_item.authorName}</span>
                                                    <span className="text-[10px] text-gray-500 font-medium lowercase italic">{m_item.email}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 sm:px-6 py-4">
                                                <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider border flex items-center gap-2 w-fit ${m_item.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                    m_item.status === 'rejected' ? 'bg-red-50 text-red-600 border-red-100' :
                                                        'bg-amber-50 text-amber-600 border-amber-100'
                                                    }`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full ${m_item.status === 'approved' ? 'bg-emerald-500' :
                                                        m_item.status === 'rejected' ? 'bg-red-500' :
                                                            'bg-amber-500'
                                                        }`} />
                                                    {m_item.status === 'approved' ? 'Aprovado' : m_item.status === 'rejected' ? 'Rejeitado' : 'Em Análise'}
                                                </span>
                                            </td>
                                            <td className="px-4 sm:px-6 py-4">
                                                <div className="flex items-center gap-2 text-[10px] text-gray-500 font-medium">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    {new Date(m_item.submittedDate).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-4 sm:px-6 py-4 text-center">
                                                <button
                                                    onClick={() => setSelectedManuscript(m_item)}
                                                    className="px-4 py-2 bg-gray-50 hover:bg-brand-primary/10 text-gray-600 hover:text-brand-primary rounded-lg transition-colors border border-gray-200 text-xs font-semibold"
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
                            className="bg-white rounded-xl w-full max-w-2xl overflow-hidden shadow-xl relative z-20 border border-gray-200"
                        >
                            <div className="p-8 border-b border-gray-100 relative">
                                <button
                                    onClick={() => setSelectedManuscript(null)}
                                    title="Fechar"
                                    className="absolute top-8 right-8 p-2 rounded-lg bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <BookOpen className="w-5 h-5 text-brand-primary" />
                                        <h3 className="text-xl font-bold text-gray-900 tracking-tight">Análise Editorial</h3>
                                    </div>
                                    <p className="text-xs text-gray-500">Obra: <span className="font-semibold text-brand-primary">{selectedManuscript.title}</span></p>
                                </div>
                            </div>

                            <div className="p-8 space-y-8">
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-1">
                                        <span className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400">Proponente</span>
                                        <p className="text-sm font-medium text-gray-900 flex items-center gap-2"><UserIcon className="w-3.5 h-3.5 text-gray-400" /> {selectedManuscript.authorName}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400">Género Lit.</span>
                                        <p className="text-xs font-bold text-brand-primary uppercase">{selectedManuscript.genre}</p>
                                    </div>
                                </div>

                                <a
                                    href={selectedManuscript.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full py-4 bg-gray-50 border border-gray-200 rounded-xl text-center font-bold text-gray-900 text-xs uppercase tracking-wider hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                                >
                                    <FileText className="w-4 h-4 text-brand-primary" />
                                    Download PDF
                                </a>

                                <Textarea
                                    label="Parecer do Conselho Editorial"
                                    placeholder="Descreva as razões fundamentais para a decisão final..."
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    className="h-32 rounded-lg"
                                />
                            </div>

                            <div className="p-8 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
                                <Button
                                    onClick={() => handleReviewManuscript('rejected')}
                                    disabled={isSubmitting}
                                    isLoading={isSubmitting}
                                    variant="outline"
                                    className="border-red-200 text-red-600 hover:bg-red-50 rounded-lg"
                                >
                                    Rejeitar
                                </Button>
                                <Button
                                    onClick={() => handleReviewManuscript('approved')}
                                    disabled={isSubmitting}
                                    isLoading={isSubmitting}
                                    className="px-8 rounded-lg"
                                >
                                    Aprovar Obra
                                </Button>
                            </div>
                        </m.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminManuscriptsPage;

