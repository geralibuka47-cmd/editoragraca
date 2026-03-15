import React, { useState, useEffect } from 'react';
import {
    Search,
    ShoppingBag,
    Clock,
    CheckCircle2,
    XCircle,
    MoreVertical,
    ChevronRight,
    Filter,
    Loader2,
    Mail,
    User as UserIcon,
    CreditCard
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllOrders, updateOrderStatus } from '../../services/dataService';
import { Order } from '../../types';
import { useToast } from '../../components/Toast';

const AdminOrders: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | Order['status']>('all');
    const { showToast } = useToast();

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        setLoading(true);
        try {
            const data = await getAllOrders();
            setOrders(data);
        } catch (error) {
            showToast('Erro ao carregar encomendas', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (orderId: string, newStatus: Order['status']) => {
        try {
            await updateOrderStatus(orderId, newStatus);
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
            showToast(`Estado da encomenda atualizado para ${newStatus}`, 'success');
        } catch (error) {
            showToast('Erro ao atualizar estado', 'error');
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status: Order['status']) => {
        switch (status) {
            case 'Validado': return 'bg-green-50 text-green-600 border-green-100';
            case 'Cancelado': return 'bg-red-50 text-red-600 border-red-100';
            default: return 'bg-amber-50 text-amber-600 border-amber-100';
        }
    };

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <span className="text-brand-primary font-bold uppercase tracking-[0.4em] text-[10px]">Gestão de Vendas</span>
                    <h2 className="text-4xl sm:text-5xl font-black text-brand-dark uppercase tracking-tighter leading-none mt-2">
                        Encomendas
                    </h2>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Pesquisar por cliente, número ou ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-brand-primary/20 transition-all outline-none"
                    />
                </div>
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                    className="w-full md:w-auto px-4 py-3 bg-gray-50 border-none rounded-2xl text-xs font-bold uppercase tracking-widest outline-none cursor-pointer hover:bg-gray-100 transition-colors"
                    title="Filtrar por estado"
                >
                    <option value="all">Todos os Estados</option>
                    <option value="Pendente">⏳ Pendentes</option>
                    <option value="Validado">✅ Validados</option>
                    <option value="Cancelado">❌ Cancelados</option>
                </select>
            </div>

            {/* Orders List */}
            {loading ? (
                <div className="h-64 flex flex-col items-center justify-center gap-4 text-gray-400">
                    <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
                    <span className="text-xs font-bold uppercase tracking-widest">A carregar encomendas...</span>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    <AnimatePresence mode="popLayout">
                        {filteredOrders.map((order, index) => (
                            <motion.div
                                key={order.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                transition={{ delay: index * 0.05 }}
                                className="group bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500 overflow-hidden"
                            >
                                <div className="p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center gap-8">
                                    {/* Status & ID */}
                                    <div className="shrink-0 flex flex-col items-center lg:items-start gap-4">
                                        <div className={`px-4 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </div>
                                        <div className="text-center lg:text-left">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Encomenda</p>
                                            <p className="text-sm font-black text-brand-dark">{order.orderNumber || `#${order.id.slice(-6)}`}</p>
                                        </div>
                                    </div>

                                    {/* Customer Info */}
                                    <div className="flex-1 flex items-center gap-4 border-l lg:border-l border-gray-50 pl-0 lg:pl-8">
                                        <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 shrink-0">
                                            <UserIcon className="w-5 h-5" />
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="font-black text-brand-dark truncate">{order.customerName}</h4>
                                            <p className="text-[10px] font-bold text-gray-400 lowercase tracking-tight truncate">{order.customerEmail}</p>
                                        </div>
                                    </div>

                                    {/* Order Details Preview */}
                                    <div className="hidden xl:flex flex-col gap-1 border-x border-gray-50 px-8 flex-1">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Itens</p>
                                        <p className="text-xs font-bold text-brand-dark">
                                            {order.items.length} {order.items.length === 1 ? 'produto' : 'produtos'}
                                        </p>
                                        <p className="text-[10px] text-gray-400 truncate max-w-[200px]">
                                            {order.items.map(i => i.title).join(', ')}
                                        </p>
                                    </div>

                                    {/* Total & Actions */}
                                    <div className="flex items-center justify-between lg:justify-end gap-8 shrink-0">
                                        <div className="text-right">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total</p>
                                            <p className="text-xl font-black text-brand-primary">Kz {order.total.toLocaleString()}</p>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            {order.status === 'Pendente' && (
                                                <>
                                                    <button
                                                        onClick={() => handleUpdateStatus(order.id, 'Validado')}
                                                        className="p-3 bg-green-50 text-green-600 hover:bg-green-600 hover:text-white rounded-2xl transition-all shadow-sm"
                                                        title="Validar"
                                                    >
                                                        <CheckCircle2 className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleUpdateStatus(order.id, 'Cancelado')}
                                                        className="p-3 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-2xl transition-all shadow-sm"
                                                        title="Cancelar"
                                                    >
                                                        <XCircle className="w-5 h-5" />
                                                    </button>
                                                </>
                                            )}
                                            <button className="p-3 bg-gray-50 hover:bg-brand-dark hover:text-white rounded-2xl transition-all" title="Ver Detalhes">
                                                <ChevronRight className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Expanded Item List (Subtle) */}
                                <div className="bg-gray-50/30 px-8 py-4 border-t border-gray-50 flex items-center justify-between">
                                    <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">
                                        <Clock className="w-3 h-3" />
                                        {new Date(order.date).toLocaleDateString()} às {new Date(order.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CreditCard className="w-3 h-3 text-gray-300" />
                                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Pagamento via Referência</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {!loading && filteredOrders.length === 0 && (
                <div className="py-20 text-center">
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Nenhuma encomenda encontrada</p>
                </div>
            )}
        </div>
    );
};

export default AdminOrders;
