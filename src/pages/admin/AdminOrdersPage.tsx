import React, { useState, useEffect } from 'react';
import { motion as m, AnimatePresence } from 'framer-motion';
import { CheckCircle, Loader2, User as UserIcon, Calendar, ShoppingCart, XCircle, Zap } from 'lucide-react';
import { User, Order } from '../../types';
import { useToast } from '../../components/Toast';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';

interface AdminOrdersPageProps {
    user: User;
}

const AdminOrdersPage: React.FC<AdminOrdersPageProps> = ({ user }) => {
    const { showToast } = useToast();
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [actionId, setActionId] = useState<string | null>(null);
    const [filterStatus, setFilterStatus] = useState<'all' | Order['status']>('all');

    const fetchOrdersData = async () => {
        setIsLoading(true);
        try {
            const { getAllOrders } = await import('../../services/dataService');
            const data = await getAllOrders();
            setOrders(data);
        } catch (error) {
            console.error('Erro ao buscar pedidos:', error);
            showToast('Erro ao carregar pedidos.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrdersData();
    }, []);

    const handleUpdateStatus = async (order: Order, newStatus: Order['status']) => {
        const confirmMsg = newStatus === 'Validado'
            ? `Confirmar pagamento do pedido ${order.orderNumber}?`
            : `Deseja realmente CANCELAR o pedido ${order.orderNumber}? O stock será devolvido.`;

        if (!confirm(confirmMsg)) return;

        setActionId(order.id);
        try {
            const { updateOrderStatus } = await import('../../services/dataService');
            const { sendPaymentConfirmationToReader } = await import('../../services/emailService');

            await updateOrderStatus(order.id, newStatus);

            if (newStatus === 'Validado') {
                const titles = order.items.map(item => item.title);
                await sendPaymentConfirmationToReader(order.customerEmail, order.customerName, titles);
                showToast('Pagamento validado e cliente notificado!', 'success');
            } else {
                showToast('Pedido cancelado e stock restaurado.', 'success');
            }

            fetchOrdersData();
        } catch (error: any) {
            console.error('Erro ao atualizar status:', error);
            showToast(error.message || 'Erro ao processar alteração.', 'error');
        } finally {
            setActionId(null);
        }
    };

    const filteredOrders = orders.filter(o =>
        filterStatus === 'all' ? true : o.status === filterStatus
    );

    const getStatusStyle = (status: Order['status']) => {
        switch (status) {
            case 'Validado': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'Cancelado': return 'bg-red-500/10 text-red-400 border-red-500/20';
            default: return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
        }
    };

    return (
        <div className="space-y-6">
            <AdminPageHeader title="Encomendas" subtitle="Monitorização de pedidos e transações" highlight="Vendas">
                <div className="flex flex-wrap gap-2 p-1.5 bg-gray-100 rounded-xl">
                    {(['all', 'Pendente', 'Validado', 'Cancelado'] as const).map((s) => (
                        <button
                            key={s}
                            onClick={() => setFilterStatus(s)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all min-touch ${filterStatus === s
                                ? 'bg-brand-primary text-white'
                                : 'text-gray-500 hover:bg-white hover:text-slate-900'
                                }`}
                        >
                            {s === 'all' ? 'Todos' : s}
                        </button>
                    ))}
                </div>
            </AdminPageHeader>

            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[720px] border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Pedido & Data</th>
                                <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Cliente</th>
                                <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Produtos</th>
                                <th className="px-4 sm:px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Montante</th>
                                <th className="px-4 sm:px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            <AnimatePresence mode="popLayout">
                                {isLoading ? (
                                    [1, 2, 3].map(i => (
                                        <tr key={i} className="animate-pulse">
                                            <td colSpan={5} className="px-4 sm:px-6 py-4">
                                                <div className="h-4 bg-gray-100 rounded w-full"></div>
                                            </td>
                                        </tr>
                                    ))
                                ) : filteredOrders.length > 0 ? (
                                    filteredOrders.map((o) => (
                                        <m.tr
                                            key={o.id}
                                            layout
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="hover:bg-gray-50 transition-colors group"
                                        >
                                            <td className="px-4 sm:px-6 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-mono font-black text-slate-900 text-[12px] tracking-tight">{o.orderNumber || `#${o.id.substring(0, 8).toUpperCase()}`}</span>
                                                    <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                                                        <Calendar className="w-3.5 h-3.5 text-gray-700" />
                                                        {o.date}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 sm:px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gray-100 border border-gray-200 rounded-full flex items-center justify-center text-gray-400">
                                                        <UserIcon className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <div className="font-black text-slate-900 text-[14px] tracking-tight">{o.customerName}</div>
                                                        <div className="text-[10px] text-gray-500 font-medium lowercase italic">{o.customerEmail}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 sm:px-6 py-4">
                                                <div className="space-y-1">
                                                    {o.items.map((item, i) => (
                                                        <div key={i} className="flex items-center gap-3">
                                                            <div className="w-2 h-2 rounded-full bg-brand-primary/40 shrink-0" />
                                                            <span className="text-[11px] font-black text-gray-400 uppercase tracking-wide truncate max-w-[200px]">
                                                                {item.quantity}x {item.title}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-4 sm:px-6 py-4 text-right">
                                                <div className="font-bold text-brand-primary text-base">
                                                    {o.total.toLocaleString()}
                                                    <span className="text-[10px] ml-1.5 opacity-40">Kz</span>
                                                </div>
                                            </td>
                                            <td className="px-4 sm:px-6 py-4">
                                                <div className="flex items-center justify-center gap-2 flex-wrap">
                                                    {o.status === 'Pendente' ? (
                                                        <>
                                                            <m.button
                                                                whileHover={{ scale: 1.05 }}
                                                                whileTap={{ scale: 0.95 }}
                                                                onClick={() => handleUpdateStatus(o, 'Validado')}
                                                                disabled={actionId === o.id}
                                                                className="px-6 py-3 bg-brand-primary text-white rounded-xl text-[9px] font-black uppercase tracking-[0.2em] hover:brightness-110 shadow-lg shadow-brand-primary/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                                            >
                                                                {actionId === o.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <><CheckCircle className="w-3.5 h-3.5" /> Validar</>}
                                                            </m.button>
                                                            <m.button
                                                                whileHover={{ scale: 1.05 }}
                                                                whileTap={{ scale: 0.95 }}
                                                                onClick={() => handleUpdateStatus(o, 'Cancelado')}
                                                                disabled={actionId === o.id}
                                                                className="w-12 h-12 bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-xl transition-all flex items-center justify-center border border-gray-200 group/btn"
                                                                title="Cancelar Pedido"
                                                            >
                                                                <XCircle className="w-4 h-4" />
                                                            </m.button>
                                                        </>
                                                    ) : (
                                                        <div className={`flex items-center gap-3 px-6 py-3 rounded-xl border text-[9px] font-black uppercase tracking-[0.2em] shadow-lg ${getStatusStyle(o.status)}`}>
                                                            {o.status === 'Validado' ? <Zap className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                                                            {o.status === 'Validado' ? 'Venda Concluída' : 'Venda Cancelada'}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </m.tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="py-16 text-center">
                                            <div className="flex flex-col items-center gap-4 text-gray-400">
                                                <ShoppingCart className="w-12 h-12" />
                                                <p className="text-sm font-semibold">Nenhum pedido encontrado</p>
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

export default AdminOrdersPage;

