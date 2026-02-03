import React, { useState, useEffect } from 'react';
import { motion as m, AnimatePresence } from 'framer-motion';
import { CheckCircle, Loader2, Receipt, User as UserIcon, Calendar, ShoppingCart, XCircle, Package, Zap } from 'lucide-react';
import { User, Order } from '../../types';
import { useToast } from '../Toast';

interface AdminOrdersTabProps {
    user: User;
}

const AdminOrdersTab: React.FC<AdminOrdersTabProps> = ({ user }) => {
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

                <div className="flex bg-white/5 p-2 rounded-2xl border border-white/5">
                    {(['all', 'Pendente', 'Validado', 'Cancelado'] as const).map((s) => (
                        <button
                            key={s}
                            onClick={() => setFilterStatus(s)}
                            className={`px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${filterStatus === s
                                ? 'bg-brand-primary text-white shadow-lg'
                                : 'text-gray-500 hover:text-white'
                                }`}
                        >
                            {s === 'all' ? 'Ver Tudo' : s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Display */}
            <div className="bg-white/5 rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full min-w-[1000px] border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/5">
                                <th className="px-10 py-8 text-left text-[9px] font-black text-gray-500 uppercase tracking-[0.3em]">Pedido & Data</th>
                                <th className="px-10 py-8 text-left text-[9px] font-black text-gray-500 uppercase tracking-[0.3em]">Adquirente</th>
                                <th className="px-10 py-8 text-left text-[9px] font-black text-gray-500 uppercase tracking-[0.3em]">Produtos</th>
                                <th className="px-10 py-8 text-right text-[9px] font-black text-gray-500 uppercase tracking-[0.3em]">Montante</th>
                                <th className="px-10 py-8 text-center text-[9px] font-black text-gray-500 uppercase tracking-[0.3em]">Ações</th>
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
                                ) : filteredOrders.length > 0 ? (
                                    filteredOrders.map((o) => (
                                        <m.tr
                                            key={o.id}
                                            layout
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="hover:bg-white/[0.03] transition-colors group"
                                        >
                                            <td className="px-10 py-8">
                                                <div className="flex flex-col gap-1.5">
                                                    <span className="font-mono font-black text-white text-[12px] tracking-tight">{o.orderNumber || `#${o.id.substring(0, 8).toUpperCase()}`}</span>
                                                    <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                                                        <Calendar className="w-3.5 h-3.5 text-gray-700" />
                                                        {o.date}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-white/5 border border-white/5 rounded-full flex items-center justify-center text-gray-500">
                                                        <UserIcon className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <div className="font-black text-white text-[14px] tracking-tight">{o.customerName}</div>
                                                        <div className="text-[10px] text-gray-500 font-medium lowercase italic">{o.customerEmail}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="space-y-2">
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
                                            <td className="px-10 py-8 text-right">
                                                <div className="font-black text-brand-primary text-[16px] tracking-tighter">
                                                    {o.total.toLocaleString()}
                                                    <span className="text-[10px] ml-1.5 opacity-40">Kz</span>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="flex items-center justify-center gap-3">
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
                                                                className="w-12 h-12 bg-white/5 hover:bg-red-500/10 text-gray-500 hover:text-red-500 rounded-xl transition-all flex items-center justify-center border border-white/5 group/btn"
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
                                        <td colSpan={5} className="py-40 text-center">
                                            <div className="flex flex-col items-center gap-6 opacity-20">
                                                <ShoppingCart className="w-16 h-16 text-brand-primary" />
                                                <p className="font-black text-[11px] uppercase tracking-[0.4em]">Histórico de Vendas Deserto</p>
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

