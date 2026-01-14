import React, { useState, useEffect } from 'react';
import { Manuscript } from '../../types';
import { Loader2, CheckCircle, XCircle, FileText, ExternalLink, MessageSquare } from 'lucide-react';

const AdminManuscriptsTab: React.FC = () => {
    const [manuscripts, setManuscripts] = useState<Manuscript[]>([]);
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
        } catch (error) {
            console.error('Erro ao buscar manuscritos:', error);
        } finally {
            setIsLoadingManuscripts(false);
        }
    };

    useEffect(() => {
        fetchManuscripts();
    }, []);

    const handleReviewManuscript = async (status: 'approved' | 'rejected') => {
        if (!selectedManuscript) return;
        setIsSubmitting(true);
        try {
            const { updateManuscriptStatus } = await import('../../services/dataService');
            await updateManuscriptStatus(selectedManuscript.id, status, feedback);
            alert(`Manuscrito ${status === 'approved' ? 'aprovado' : 'rejeitado'} com sucesso.`);
            setSelectedManuscript(null);
            setFeedback('');
            fetchManuscripts();
        } catch (error) {
            console.error('Erro ao atualizar status:', error);
            alert('Erro ao atualizar o status do manuscrito.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <h2 className="text-2xl md:text-3xl font-black text-brand-dark mb-8">Revisão de Manuscritos</h2>
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden overflow-x-auto">
                <table className="w-full min-w-[800px]">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-brand-dark uppercase tracking-wider">Título</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-brand-dark uppercase tracking-wider">Autor</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-brand-dark uppercase tracking-wider">Género</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-brand-dark uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-brand-dark uppercase tracking-wider">Data</th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-brand-dark uppercase tracking-wider">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {isLoadingManuscripts ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500 italic">Carregando manuscritos...</td>
                            </tr>
                        ) : manuscripts.length > 0 ? (
                            manuscripts.map((m) => (
                                <tr key={m.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-bold text-brand-dark">{m.title}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{m.authorName}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600 uppercase text-[10px]">{m.genre}</td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${m.status === 'approved' ? 'bg-green-100 text-green-600' :
                                            m.status === 'rejected' ? 'bg-red-100 text-red-600' :
                                                'bg-yellow-100 text-yellow-600'
                                            }`}>
                                            {m.status === 'approved' ? 'Aprovado' : m.status === 'rejected' ? 'Rejeitado' : 'Pendente'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(m.submittedDate).toLocaleDateString('pt-AO')}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => setSelectedManuscript(m)}
                                            title="Analisar este manuscrito"
                                            aria-label="Analisar este manuscrito"
                                            className="px-4 py-2 bg-brand-primary text-white text-xs font-bold rounded-lg hover:brightness-110 transition-all uppercase tracking-wider"
                                        >
                                            Analisar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500 italic">Nenhum manuscrito submetido.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Manuscript Analysis Modal */}
            {selectedManuscript && (
                <div className="fixed inset-0 bg-brand-dark/90 backdrop-blur-sm z-50 flex items-center justify-center p-8">
                    <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-fade-in">
                        <div className="p-8 border-b border-gray-100">
                            <h3 className="text-2xl font-black text-brand-dark mb-1">Análise de Manuscrito</h3>
                            <p className="text-gray-500 text-sm">Reviewing: {selectedManuscript.title}</p>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Autor</span>
                                    <p className="font-bold text-brand-dark">{selectedManuscript.authorName}</p>
                                </div>
                                <div>
                                    <span className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Email</span>
                                    <p className="font-bold text-brand-dark">{selectedManuscript.email}</p>
                                </div>
                                <div>
                                    <span className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Género</span>
                                    <p className="font-bold text-brand-dark">{selectedManuscript.genre}</p>
                                </div>
                                <div>
                                    <span className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Data</span>
                                    <p className="font-bold text-brand-dark">{new Date(selectedManuscript.submittedDate).toLocaleDateString()}</p>
                                </div>
                            </div>

                            <a
                                href={selectedManuscript.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full py-4 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl text-center font-bold text-brand-dark hover:bg-brand-primary/5 hover:border-brand-primary transition-all group"
                            >
                                Ler Manuscrito (PDF)
                            </a>

                            <div className="form-group-premium">
                                <label className="label-premium">Feedback para o Autor</label>
                                <textarea
                                    className="input-premium h-32 resize-none"
                                    placeholder="Escreva as razões da aprovação ou rejeição..."
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                ></textarea>
                            </div>
                        </div>
                        <div className="p-8 bg-gray-50 flex justify-end gap-4 border-t border-gray-100">
                            <button
                                onClick={() => setSelectedManuscript(null)}
                                className="px-8 py-4 font-black text-xs text-gray-400 hover:text-brand-dark uppercase tracking-widest transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => handleReviewManuscript('rejected')}
                                disabled={isSubmitting}
                                className="px-8 py-4 bg-red-50 text-red-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all flex items-center gap-2 border border-red-100 disabled:opacity-50"
                            >
                                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                                Rejeitar
                            </button>
                            <button
                                onClick={() => handleReviewManuscript('approved')}
                                disabled={isSubmitting}
                                className="btn-premium py-4 text-[10px]"
                            >
                                {isSubmitting ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <>
                                        <CheckCircle className="w-4 h-4" />
                                        <span>Aprovar</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminManuscriptsTab;
