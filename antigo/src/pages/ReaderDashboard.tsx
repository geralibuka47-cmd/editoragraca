
import React from 'react';
import { Heart } from 'lucide-react';
import { User, Order, Book } from '../types';
import SectionHeader from '../components/SectionHeader';

interface ReaderDashboardProps {
    user: User;
    orders: Order[];
    wishlist: Book[];
}

const ReaderDashboard: React.FC<ReaderDashboardProps> = ({ user, orders, wishlist }) => {
    const myOrders = orders.filter(o => o.customerEmail === user.email);
    return (
        <div className="py-12 md:py-20 max-w-7xl mx-auto px-4 md:px-6 animate-fade-in">
            <SectionHeader title={`Estante de ${user.name}`} subtitle="Área Pessoal" align="left" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
                <div className="lg:col-span-8 space-y-8 md:space-y-12">
                    <div className="bg-white p-6 md:p-12 rounded-[2rem] md:rounded-[2.5rem] border border-brand-100 shadow-sm">
                        <h3 className="font-serif font-bold text-xl md:text-2xl mb-8">Minhas Encomendas</h3>
                        <div className="space-y-4 md:space-y-6">
                            {myOrders.map(order => (
                                <div key={order.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 md:p-8 bg-brand-50 rounded-2xl border border-transparent hover:border-accent-gold transition-all gap-4">
                                    <div>
                                        <p className="font-bold text-brand-900">Pedido #{order.id}</p>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">{order.date}</p>
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {order.items.map((it, idx) => (
                                                <span key={idx} className="text-[8px] bg-white px-2 py-1 rounded border border-brand-100">{it.title} (x{it.quantity})</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="text-left sm:text-right w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-brand-100">
                                        <p className="font-bold text-lg">{order.total.toLocaleString()} Kz</p>
                                        <span className={`text-[9px] font-bold uppercase tracking-widest ${order.status === 'Validado' ? 'text-green-600' : 'text-accent-gold'}`}>{order.status}</span>
                                    </div>
                                </div>
                            ))}
                            {myOrders.length === 0 && <p className="text-center py-10 text-gray-400 italic">Ainda não realizou nenhuma compra.</p>}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4">
                    <div className="bg-white p-8 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-brand-100 shadow-sm">
                        <h3 className="font-serif font-bold text-xl mb-8 flex items-center gap-3"><Heart className="text-accent-gold" size={20} /> Favoritos</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {wishlist.map(book => (
                                <div key={book.id} className="aspect-[2/3] relative rounded-lg overflow-hidden group">
                                    <img src={book.coverUrl} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt={book.title} />
                                    <div className="absolute inset-0 bg-brand-900/20 group-hover:bg-brand-900/40 transition-all flex items-end p-2">
                                        <p className="text-[8px] text-white font-bold uppercase truncate">{book.title}</p>
                                    </div>
                                </div>
                            ))}
                            {wishlist.length === 0 && <p className="col-span-2 text-center text-gray-300 text-xs py-10">Lista vazia.</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReaderDashboard;
