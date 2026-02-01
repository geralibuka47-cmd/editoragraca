import React, { useState, useEffect } from 'react';
import { motion as m, AnimatePresence } from 'framer-motion';
import { CheckCircle, Loader2, ExternalLink, Receipt, User as UserIcon, Calendar, DollarSign, Package } from 'lucide-react';
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
        <div className="space-y-10">
            <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-8">
                <div>
                    <h2 className="text-4xl font-black text-brand-dark tracking-tighter uppercase mb-2">Fluxo de <span className="text-brand-primary lowercase italic font-light">Vendas</span></h2>
                    <p className="text-gray-400 font-bold text-sm">Monitorização de pedidos e validação de pagamentos.</p>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-brand-dark/5 border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1000px]">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Referência / Data</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Cliente</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Conteúdo da Ordem</th>
                                <th className="px-8 py-6 text-right text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Montante</th>
                                <th className="px-8 py-6 text-center text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Estado / Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            <AnimatePresence mode="popLayout">
                                {isLoading ? (
                                    [1, 2, 3].map(i => (
                                        <tr key={i} className="animate-pulse">
                                            <td colSpan={5} className="px-8 py-6">
                                                <div className="h-4 bg-gray-100 rounded-full w-full"></div>
                                            </td>
                                        </tr>
                                    ))
                                ) : notifications.length > 0 ? (
                                    notifications.map((n) => (
                                        <m.tr
                                            key={n.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="hover:bg-gray-50/50 transition-colors group"
                                        >
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col">
                                                    <span className="font-mono font-black text-brand-dark text-[11px] mb-1">#{n.orderId?.substring(0, 8)}</span>
                                                    <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                                        <Calendar className="w-3 h-3" />
                                                        {new Date(n.createdAt).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                                                        <UserIcon className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <div className="font-black text-brand-dark text-sm tracking-tight">{n.readerName}</div>
                                                        <div className="text-[10px] text-gray-400 font-bold tracking-tight lowercase">{n.readerEmail}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="space-y-1">
                                                    {n.items.map((item, i) => (
                                                        <div key={i} className="flex items-center gap-2 text-[11px] font-medium text-gray-600">
                                                            <Package className="w-3 h-3 text-brand-primary" />
                                                            <span className="font-bold text-brand-dark">{item.bookTitle}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="font-black text-brand-primary text-sm flex items-center justify-end gap-1">
                                                    {n.totalAmount.toLocaleString()} <span className="text-[10px] opacity-70">Kz</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center justify-center gap-3">
                                                    {n.status === 'proof_uploaded' && (
                                                        <m.button
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            onClick={async () => {
                                                                const { getPaymentProofByNotification } = await import('../../services/dataService');
                                                                const proof = await getPaymentProofByNotification(n.id);
                                                                if (proof) window.open(proof.fileUrl, '_blank');
                                                            }}
                                                            title="Ver comprovativo"
                                                            className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-[9px] font-black uppercase tracking-widest border border-blue-100 hover:bg-blue-100 transition-all"
                                                        >
                                                            Recibo
                                                        </m.button>
                                                    )}

                                                    {n.status !== 'confirmed' ? (
                                                        <m.button
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            onClick={() => handleConfirm(n)}
                                                            disabled={confirmingId === n.id}
                                                            className="px-6 py-2 bg-brand-primary text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:brightness-110 shadow-lg shadow-brand-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                                        >
                                                            {confirmingId === n.id ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Validar'}
                                                        </m.button>
                                                    ) : (
                                                        <div className="flex items-center gap-2 text-green-600 text-[9px] font-black uppercase tracking-widest bg-green-50 px-4 py-2 rounded-xl border border-green-100">
                                                            <CheckCircle className="w-3 h-3" /> Confirmado
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </m.tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-32 text-center">
                                            <div className="flex flex-col items-center gap-4 opacity-20 grayscale">
                                                <Receipt className="w-16 h-16" />
                                                <p className="font-black uppercase tracking-[0.3em] text-[10px]">Nenhum pagamento registado.</p>
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
