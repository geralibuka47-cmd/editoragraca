
import React from 'react';
import { DollarSign, Package, TrendingUp, CheckCircle, X } from 'lucide-react';
import { Order } from '../types';
import SectionHeader from '../components/SectionHeader';

interface AdminDashboardProps {
    orders: Order[];
    setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ orders, setOrders }) => {
    const stats = {
        totalSales: orders.filter(o => o.status === 'Validado').reduce((acc, o) => acc + o.total, 0),
        pendingOrders: orders.filter(o => o.status === 'Pendente').length,
        validatedOrders: orders.filter(o => o.status === 'Validado').length,
    };

    const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    };

    return (
        <div className="py-12 md:py-20 max-w-7xl mx-auto px-4 md:px-6 animate-fade-in">
            <SectionHeader title="Painel de Gestão" subtitle="Administração Editorial" align="left" />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 mb-16">
                <div className="bg-white p-8 md:p-10 rounded-3xl border border-brand-100 shadow-sm">
                    <DollarSign className="text-accent-gold mb-4" size={32} />
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Receita Validada</p>
                    <p className="text-2xl md:text-3xl font-serif font-bold mt-2">{stats.totalSales.toLocaleString()} Kz</p>
                </div>
                <div className="bg-white p-8 md:p-10 rounded-3xl border border-brand-100 shadow-sm">
                    <Package className="text-accent-gold mb-4" size={32} />
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pedidos Pendentes</p>
                    <p className="text-2xl md:text-3xl font-serif font-bold mt-2">{stats.pendingOrders}</p>
                </div>
                <div className="bg-white p-8 md:p-10 rounded-3xl border border-brand-100 shadow-sm sm:col-span-2 md:col-span-1">
                    <TrendingUp className="text-accent-gold mb-4" size={32} />
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Taxa de Conversão</p>
                    <p className="text-2xl md:text-3xl font-serif font-bold mt-2">84%</p>
                </div>
            </div>

            <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] border border-brand-100 shadow-sm overflow-hidden">
                <div className="p-6 md:p-8 border-b border-brand-50 bg-brand-50/50">
                    <h3 className="font-serif font-bold text-xl md:text-2xl">Encomendas Recentes</h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left hidden md:table">
                        <thead>
                            <tr className="text-[10px] uppercase font-bold text-gray-400 tracking-widest border-b border-brand-50">
                                <th className="p-8">Cliente</th>
                                <th className="p-8">Data</th>
                                <th className="p-8">Valor</th>
                                <th className="p-8">Status</th>
                                <th className="p-8 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-50">
                            {orders.map(order => (
                                <tr key={order.id} className="hover:bg-brand-50 transition-colors">
                                    <td className="p-8">
                                        <p className="font-bold text-brand-900">{order.customerName}</p>
                                        <p className="text-xs text-gray-400">{order.customerEmail}</p>
                                    </td>
                                    <td className="p-8 text-xs text-gray-500">{order.date}</td>
                                    <td className="p-8 font-bold">{order.total.toLocaleString()} Kz</td>
                                    <td className="p-8">
                                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${order.status === 'Validado' ? 'bg-green-100 text-green-700' :
                                                order.status === 'Cancelado' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="p-8 text-right">
                                        {order.status === 'Pendente' && (
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => handleStatusChange(order.id, 'Validado')} className="p-2 text-green-600 hover:bg-green-50 rounded-lg"><CheckCircle size={18} /></button>
                                                <button onClick={() => handleStatusChange(order.id, 'Cancelado')} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><X size={18} /></button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="md:hidden divide-y divide-brand-50">
                        {orders.map(order => (
                            <div key={order.id} className="p-6 space-y-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-bold text-brand-900">{order.customerName}</p>
                                        <p className="text-[10px] text-gray-400">{order.customerEmail}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest ${order.status === 'Validado' ? 'bg-green-100 text-green-700' :
                                            order.status === 'Cancelado' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {order.status}
                                    </span>
                                </div>
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">{order.date}</p>
                                        <p className="font-bold text-lg">{order.total.toLocaleString()} Kz</p>
                                    </div>
                                    {order.status === 'Pendente' && (
                                        <div className="flex gap-2">
                                            <button onClick={() => handleStatusChange(order.id, 'Validado')} className="p-3 bg-green-50 text-green-600 rounded-xl"><CheckCircle size={18} /></button>
                                            <button onClick={() => handleStatusChange(order.id, 'Cancelado')} className="p-3 bg-red-50 text-red-600 rounded-xl"><X size={18} /></button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {orders.length === 0 && (
                        <div className="p-20 text-center text-gray-300 italic font-serif text-xl">Nenhuma encomenda registada.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
