import React, { useState, useEffect } from 'react';
import { motion as m, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle, XCircle, FileText, ExternalLink, MessageSquare, Search, Calendar, User as UserIcon, X, Send } from 'lucide-react';
import { Manuscript } from '../../types';
import { useToast } from '../Toast';

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
        <div className="space-y-10">
            <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-8">
                <div>
                    <h2 className="text-4xl font-black text-brand-dark tracking-tighter uppercase mb-2">Curadoria <span className="text-brand-primary lowercase italic font-serif">Original</span></h2>
                    <p className="text-gray-400 font-bold text-sm">Avaliação e feedback de novas propostas literárias.</p>
                </div>

                <div className="relative group w-full xl:w-96">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-brand-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Pesquisar por título ou autor..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-6 py-4 bg-gray-50 border-2 border-transparent focus:border-brand-primary/20 focus:bg-white rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest outline-none transition-all shadow-sm"
                    />
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-brand-dark/5 border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px]">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Obra / Gênero</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Autor / Contacto</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Estado</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Data de Envio</th>
                                <th className="px-8 py-6 text-center text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Revisão</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            <AnimatePresence mode="popLayout">
                                {isLoadingManuscripts ? (
                                    [1, 2, 3].map(i => (
                                        <tr key={i} className="animate-pulse">
                                            <td colSpan={5} className="px-8 py-6">
                                                <div className="h-4 bg-gray-100 rounded-full w-full"></div>
                                            </td>
                                        </tr>
                                    ))
                                ) : filteredManuscripts.length > 0 ? (
                                    filteredManuscripts.map((m_item) => (
                                        <m.tr
                                            key={m_item.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="hover:bg-gray-50/50 transition-colors group"
                                        >
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col">
                                                    <span className="font-black text-brand-dark text-sm tracking-tight mb-1">{m_item.title}</span>
                                                    <span className="text-[9px] font-black uppercase tracking-[0.1em] text-brand-primary/60">{m_item.genre}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-gray-600 text-xs">{m_item.authorName}</span>
                                                    <span className="text-[10px] text-gray-400 lowercase">{m_item.email}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`px-3 py-1.5 rounded-lg border text-[9px] font-black uppercase tracking-[0.2em] w-fit flex items-center gap-2 ${m_item.status === 'approved' ? 'bg-green-50 text-green-600 border-green-100' :
                                                    m_item.status === 'rejected' ? 'bg-red-50 text-red-600 border-red-100' :
                                                        'bg-yellow-50 text-yellow-600 border-yellow-100'
                                                    }`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full ${m_item.status === 'approved' ? 'bg-green-600' :
                                                        m_item.status === 'rejected' ? 'bg-red-600' :
                                                            'bg-yellow-600'
                                                        }`} />
                                                    {m_item.status === 'approved' ? 'Aprovado' : m_item.status === 'rejected' ? 'Rejeitado' : 'Pendente'}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                                    <Calendar className="w-3 h-3" />
                                                    {new Date(m_item.submittedDate).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <m.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => setSelectedManuscript(m_item)}
                                                    className="px-6 py-2 bg-brand-dark text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-brand-primary transition-all shadow-lg shadow-brand-dark/5"
                                                >
                                                    Analisar
                                                </m.button>
                                            </td>
                                        </m.tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-32 text-center">
                                            <div className="flex flex-col items-center gap-4 opacity-20 grayscale">
                                                <FileText className="w-16 h-16" />
                                                <p className="font-black uppercase tracking-[0.3em] text-[10px]">Nenhum manuscrito encontrado.</p>
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
                            className="absolute inset-0 bg-brand-dark/40 backdrop-blur-xl"
                        />
                        <m.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white rounded-[3rem] w-full max-w-2xl overflow-hidden shadow-2xl relative z-20 border border-white/20"
                        >
                            <div className="p-10 border-b border-gray-100">
                                <h3 className="text-3xl font-black text-brand-dark tracking-tighter uppercase mb-1 leading-none">Análise Técnica</h3>
                                <p className="text-[10px] font-black uppercase tracking-widest text-brand-primary">Obra: {selectedManuscript.title}</p>
                            </div>

                            <div className="p-10 space-y-8">
                                <div className="grid grid-cols-2 gap-8">
                                    <div>
                                        <span className="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Autor</span>
                                        <p className="font-bold text-brand-dark flex items-center gap-2"><UserIcon className="w-3 h-3" /> {selectedManuscript.authorName}</p>
                                    </div>
                                    <div>
                                        <span className="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Gênero</span>
                                        <p className="font-black text-brand-primary text-xs uppercase tracking-tight">{selectedManuscript.genre}</p>
                                    </div>
                                </div>

                                <m.a
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    href={selectedManuscript.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full py-6 bg-gray-50 border-2 border-dashed border-gray-100 rounded-2xl text-center font-black text-brand-dark text-xs uppercase tracking-widest hover:bg-brand-primary/5 hover:border-brand-primary/20 transition-all group flex items-center justify-center gap-3"
                                >
                                    <FileText className="w-4 h-4 text-brand-primary" />
                                    Ler Obra Completa (PDF)
                                </m.a>

                                <div className="space-y-2">
                                    <label htmlFor="manuscript-feedback" className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Parecer Literário / Feedback</label>
                                    <textarea
                                        id="manuscript-feedback"
                                        className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-2 border-transparent transition-all outline-none font-medium text-gray-600 focus:bg-white focus:border-brand-primary/20 h-32 resize-none"
                                        placeholder="Descreva as razões da decisão técnica..."
                                        value={feedback}
                                        onChange={(e) => setFeedback(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="p-10 bg-gray-50/50 flex flex-wrap justify-end gap-6 border-t border-gray-100">
                                <button
                                    onClick={() => setSelectedManuscript(null)}
                                    className="px-6 py-4 font-black text-[10px] text-gray-400 hover:text-brand-dark uppercase tracking-widest transition-colors"
                                >
                                    Cancelar
                                </button>
                                <m.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleReviewManuscript('rejected')}
                                    disabled={isSubmitting}
                                    className="px-8 py-4 bg-white text-red-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-50 transition-all flex items-center gap-2 border border-red-100 disabled:opacity-50"
                                >
                                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                                    Rejeitar
                                </m.button>
                                <m.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleReviewManuscript('approved')}
                                    disabled={isSubmitting}
                                    className="btn-premium px-10 py-4 text-[10px] shadow-xl shadow-brand-primary/20"
                                >
                                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                                    <span>Aprovar Publicação</span>
                                </m.button>
                            </div>
                        </m.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminManuscriptsTab;
