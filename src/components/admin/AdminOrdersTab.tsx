import React, { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import { User } from '../../types';

interface AdminOrdersTabProps {
    user: User;
}

const AdminOrdersTab: React.FC<AdminOrdersTabProps> = ({ user }) => {
    const [notifications, setNotifications] = useState<import('../../types').PaymentNotification[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchNotifications = async () => {
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

            alert('Pagamento confirmado e leitor notificado!');
            fetchNotifications();
        } catch (error) {
            console.error('Erro ao confirmar:', error);
            alert('Erro ao confirmar pagamento.');
        }
    };

    if (isLoading) return <div className="text-center py-12 text-brand-dark/50 font-bold uppercase tracking-widest text-xs">Carregando pagamentos...</div>;

    return (
        <div>
            <h2 className="text-2xl md:text-3xl font-black text-brand-dark mb-8">Gestão de Pagamentos</h2>
            <div className="bg-white rounded-[32px] shadow-xl overflow-hidden border border-gray-100 overflow-x-auto">
                <table className="w-full min-w-[900px]">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">ID / Data</th>
                            <th className="px-6 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Leitor</th>
                            <th className="px-6 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Itens / Autores</th>
                            <th className="px-6 py-6 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Total</th>
                            <th className="px-6 py-6 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {notifications.map((n) => (
                            <tr key={n.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-6">
                                    <div className="text-xs font-mono font-bold text-brand-dark">#{n.orderId?.substring(0, 8)}</div>
                                    <div className="text-[10px] text-gray-400 font-bold uppercase mt-1">{new Date(n.createdAt).toLocaleDateString()}</div>
                                </td>
                                <td className="px-6 py-6">
                                    <div className="font-bold text-brand-dark text-sm">{n.readerName}</div>
                                    <div className="text-[10px] text-gray-400 font-medium">{n.readerEmail}</div>
                                </td>
                                <td className="px-6 py-6 font-medium">
                                    {n.items.map((item, i) => (
                                        <div key={i} className="text-[11px] mb-1 text-gray-600">
                                            <span className="font-bold text-brand-dark">{item.bookTitle}</span>
                                            <span className="text-gray-400 ml-1 italic">({item.authorName})</span>
                                        </div>
                                    ))}
                                </td>
                                <td className="px-6 py-6 text-right font-black text-brand-primary">
                                    {n.totalAmount.toLocaleString()} Kz
                                </td>
                                <td className="px-6 py-6">
                                    <div className="flex items-center justify-center gap-2">
                                        {n.status === 'proof_uploaded' && (
                                            <button
                                                onClick={async () => {
                                                    const { getPaymentProofByNotification } = await import('../../services/dataService');
                                                    const proof = await getPaymentProofByNotification(n.id);
                                                    if (proof) window.open(proof.fileUrl, '_blank');
                                                }}
                                                title="Visualizar comprovativo de pagamento"
                                                aria-label="Visualizar comprovativo de pagamento"
                                                className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-100 transition-all"
                                            >
                                                Ver Comprovativo
                                            </button>
                                        )}
                                        {n.status !== 'confirmed' ? (
                                            <button
                                                onClick={() => handleConfirm(n)}
                                                title="Confirmar este pagamento"
                                                aria-label="Confirmar este pagamento"
                                                className="px-4 py-2 bg-brand-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:brightness-110 shadow-lg shadow-brand-primary/20 transition-all"
                                            >
                                                Confirmar
                                            </button>
                                        ) : (
                                            <span className="flex items-center gap-2 text-green-600 text-[10px] font-black uppercase tracking-widest bg-green-50 px-4 py-2 rounded-xl">
                                                <CheckCircle className="w-3 h-3" /> Pago
                                            </span>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {notifications.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-20 text-center text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                                    Nenhuma notificação de pagamento pendente.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminOrdersTab;
