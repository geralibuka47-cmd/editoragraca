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
                <div className="flex flex-wrap gap-2 pt-2 w-full overflow-x-auto">
                    {(['all', 'Pendente', 'Validado', 'Cancelado'] as const).map((s) => (
                        <button
                            key={s}
                            onClick={() => setFilterStatus(s)}
                            className={`px-4 py-2 rounded-md text-xs font-semibold uppercase tracking-wider transition-colors whitespace-nowrap ${filterStatus === s
                                ? 'bg-brand-primary/10 text-brand-primary'
                                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                                }`}
                        >
                            {s === 'all' ? 'Ver Tudo' : s}
                        </button>
                    ))}
                </div>
            </AdminPageHeader>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
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
                                                    <span className="font-mono font-bold text-gray-900 text-[12px]">{o.orderNumber || `#${o.id.substring(0, 8).toUpperCase()}`}</span>
                                                    <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-medium">
                                                        <Calendar className="w-3.5 h-3.5" />
                                                        {o.date}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 sm:px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center text-gray-400">
                                                        <UserIcon className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-gray-900 text-sm tracking-tight">{o.customerName}</div>
                                                        <div className="text-[11px] text-gray-500 lowercase italic">{o.customerEmail}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 sm:px-6 py-4">
                                                <div className="space-y-1">
                                                    {o.items.map((item, i) => (
                                                        <div key={i} className="flex items-center gap-2">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-brand-primary/40 shrink-0" />
                                                            <span className="text-[11px] font-medium text-gray-600 truncate max-w-[200px]">
                                                                {item.quantity}x {item.title}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-4 sm:px-6 py-4 text-right">
                                                <div className="font-semibold text-gray-900 text-sm">
                                                    {o.total.toLocaleString()}
                                                    <span className="text-[10px] ml-1 text-gray-500">Kz</span>
                                                </div>
                                            </td>
                                            <td className="px-4 sm:px-6 py-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    {o.status === 'Pendente' ? (
                                                        <>
                                                            <button
                                                                onClick={() => handleUpdateStatus(o, 'Validado')}
                                                                disabled={actionId === o.id}
                                                                className="px-4 py-2 bg-brand-primary text-white rounded-md text-xs font-semibold hover:bg-brand-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                                            >
                                                                {actionId === o.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <><CheckCircle className="w-3.5 h-3.5" /> Validar</>}
                                                            </button>
                                                            <button
                                                                onClick={() => handleUpdateStatus(o, 'Cancelado')}
                                                                disabled={actionId === o.id}
                                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                                                title="Cancelar Pedido"
                                                            >
                                                                <XCircle className="w-4 h-4" />
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <div className={`flex items-center gap-2 px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${getStatusStyle(o.status)}`}>
                                                            {o.status === 'Validado' ? <Zap className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                                                            {o.status === 'Validado' ? 'Validado' : 'Cancelado'}
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

