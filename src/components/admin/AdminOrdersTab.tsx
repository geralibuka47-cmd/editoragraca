import React, { useState, useEffect } from 'react';
import { motion as m, AnimatePresence } from 'framer-motion';
import { CheckCircle, Loader2, ExternalLink, Receipt, User as UserIcon, Calendar, DollarSign, Package, ArrowUpRight, Zap } from 'lucide-react';
import { User } from '../../types';
import { useToast } from '../Toast';

interface AdminOrdersTabProps {
    user: User;
}

const AdminOrdersTab: React.FC<AdminOrdersTabProps> = ({ user }) => {
    const { showToast } = useToast();
    const [notifications, setNotifications] = useState<import('../../types').PaymentNotification[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [confirmingId, setConfirmingId] = useState<string | null>(null);

    const fetchNotifications = async () => {
        setIsLoading(true);
        try {
            const { getAllPaymentNotifications } = await import('../../services/dataService');
            const data = await getAllPaymentNotifications();
            setNotifications(data);
        } catch (error) {
            console.error('Erro ao buscar notificações:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleConfirm = async (notif: import('../../types').PaymentNotification) => {
        if (!confirm(`Confirmar pagamento de ${notif.readerName} no valor de ${notif.totalAmount} Kz?`)) return;

        setConfirmingId(notif.id);
        try {
            const { updatePaymentNotificationStatus, confirmPaymentProof, getPaymentProofByNotification } = await import('../../services/dataService');
            const { sendPaymentConfirmationToReader } = await import('../../services/emailService');

            await updatePaymentNotificationStatus(notif.id, 'confirmed');

            const proof = await getPaymentProofByNotification(notif.id);
            if (proof) {
                await confirmPaymentProof(proof.id, user.id, 'Pagamento confirmado via painel administrativo.');
            }

            // Notify reader
            const titles = notif.items.map(item => item.bookTitle);
            await sendPaymentConfirmationToReader(notif.readerEmail, notif.readerName, titles);

            fetchNotifications();
            showToast('Pagamento confirmado e e-mail enviado ao cliente!', 'success');
        } catch (error) {
            console.error('Erro ao confirmar:', error);
            showToast('Erro ao confirmar pagamento.', 'error');
        } finally {
            setConfirmingId(null);
        }
    };

    return (
        <div className="space-y-12">
            {/* Header Section */}
            <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-8">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-8 bg-brand-primary rounded-full shadow-[0_0_15px_rgba(189,147,56,0.5)]" />
                        <h2 className="text-3xl font-black text-white tracking-tighter uppercase mb-0">Fluxo de <span className="text-brand-primary italic font-light lowercase">Vendas</span></h2>
                    </div>
                    <p className="text-gray-500 font-bold text-xs uppercase tracking-widest pl-4">Monitorização de Pedidos e Transações</p>
                </div>
            </div>

            {/* Content Display */}
            <div className="bg-white/5 rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full min-w-[1000px] border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/5">
                                <th className="px-10 py-8 text-left text-[9px] font-black text-gray-500 uppercase tracking-[0.3em]">Referência & Data</th>
                                <th className="px-10 py-8 text-left text-[9px] font-black text-gray-500 uppercase tracking-[0.3em]">Adquirente</th>
                                <th className="px-10 py-8 text-left text-[9px] font-black text-gray-500 uppercase tracking-[0.3em]">Produtos</th>
                                <th className="px-10 py-8 text-right text-[9px] font-black text-gray-500 uppercase tracking-[0.3em]">Montante</th>
                                <th className="px-10 py-8 text-center text-[9px] font-black text-gray-500 uppercase tracking-[0.3em]">Validar</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            <AnimatePresence mode="popLayout">
                                {isLoading ? (
                                    [1, 2, 3].map(i => (
                                        <tr key={i} className="animate-pulse">
                                            <td colSpan={5} className="px-10 py-8">
                                                <div className="h-4 bg-white/5 rounded-full w-full"></div>
                                            </td>
                                        </tr>
                                    ))
                                ) : notifications.length > 0 ? (
                                    notifications.map((n) => (
                                        <m.tr
                                            key={n.id}
                                            layout
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="hover:bg-white/[0.03] transition-colors group"
                                        >
                                            <td className="px-10 py-8">
                                                <div className="flex flex-col gap-1.5">
                                                    <span className="font-mono font-black text-white text-[12px] tracking-tight">#{n.orderId?.substring(0, 12).toUpperCase()}</span>
                                                    <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                                                        <Calendar className="w-3.5 h-3.5 text-gray-700" />
                                                        {new Date(n.createdAt).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-white/5 border border-white/5 rounded-full flex items-center justify-center text-gray-500">
                                                        <UserIcon className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <div className="font-black text-white text-[14px] tracking-tight">{n.readerName}</div>
                                                        <div className="text-[10px] text-gray-500 font-medium lowercase italic">{n.readerEmail}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="space-y-2">
                                                    {n.items.map((item, i) => (
                                                        <div key={i} className="flex items-center gap-3">
                                                            <div className="w-2 h-2 rounded-full bg-brand-primary/40 shrink-0" />
                                                            <span className="text-[11px] font-black text-gray-400 uppercase tracking-wide truncate max-w-[200px]">{item.bookTitle}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-10 py-8 text-right">
                                                <div className="font-black text-brand-primary text-[16px] tracking-tighter">
                                                    {n.totalAmount.toLocaleString()}
                                                    <span className="text-[10px] ml-1.5 opacity-40">Kz</span>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="flex items-center justify-center gap-3">
                                                    {n.status === 'proof_uploaded' && (
                                                        <button
                                                            onClick={async () => {
                                                                const { getPaymentProofByNotification } = await import('../../services/dataService');
                                                                const proof = await getPaymentProofByNotification(n.id);
                                                                if (proof) window.open(proof.fileUrl, '_blank');
                                                            }}
                                                            title="Ver Recibo de Transferência"
                                                            aria-label="Ver Recibo de Transferência"
                                                            className="w-12 h-12 bg-white/5 hover:bg-blue-500/10 text-gray-500 hover:text-blue-400 rounded-xl transition-all flex items-center justify-center border border-white/5 group/btn"
                                                        >
                                                            <Receipt className="w-4 h-4 transition-transform group-hover/btn:scale-110" />
                                                        </button>
                                                    )}

                                                    {n.status !== 'confirmed' ? (
                                                        <m.button
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            onClick={() => handleConfirm(n)}
                                                            disabled={confirmingId === n.id}
                                                            className="px-8 py-3 bg-brand-primary text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:brightness-110 shadow-lg shadow-brand-primary/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                                        >
                                                            {confirmingId === n.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <><CheckCircle className="w-3.5 h-3.5" /> Validar</>}
                                                        </m.button>
                                                    ) : (
                                                        <div className="flex items-center gap-3 px-6 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-[0.2em] shadow-lg">
                                                            <Zap className="w-3.5 h-3.5" /> Transação Concluída
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </m.tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="py-40 text-center">
                                            <div className="flex flex-col items-center gap-6 opacity-20">
                                                <Receipt className="w-16 h-16 text-brand-primary" />
                                                <p className="font-black text-[11px] uppercase tracking-[0.4em]">Arquivo de Vendas Deserto</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminOrdersTab;

