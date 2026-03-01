import React, { useState, useEffect } from 'react';
import { m } from 'framer-motion';
import {
    Users, BookOpen, ShoppingBag,
    TrendingUp, ArrowUpRight, AlertCircle,
    Calendar, Download, LayoutGrid, Filter
} from 'lucide-react';
import { getStats } from '../../services/dataService';

const AdminOverview: React.FC = () => {
    const [stats, setStats] = useState({
        totalBooks: 0,
        totalUsers: 0,
        pendingOrders: 0,
        revenue: 0,
        lowStockCount: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await getStats();
                setStats(data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const kpis = [
        { label: 'Obras no Acervo', val: stats.totalBooks, icon: BookOpen, trend: '+12%', color: 'brand-primary' },
        { label: 'Membros Ativos', val: stats.totalUsers, icon: Users, trend: 'Novos 24', color: 'blue-500' },
        { label: 'Vendas Brutas', val: `${stats.revenue.toLocaleString()} Kz`, icon: TrendingUp, trend: '+8.4%', color: 'emerald-500' },
        { label: 'Pedidos Pendentes', val: stats.pendingOrders, icon: ShoppingBag, trend: 'Urgente', color: 'red-500' },
    ];

    return (
        <div className="space-y-12 pb-24">

            {/* Action Bar */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b border-gray-100">
                <div className="space-y-4 text-center md:text-left">
                    <span className="px-5 py-2 bg-brand-primary/10 text-brand-primary text-[10px] font-black uppercase tracking-[0.4em] rounded-full shadow-sm border border-brand-primary/5">
                        Relatório Executivo
                    </span>
                    <h1 className="text-5xl md:text-7xl font-black text-brand-dark uppercase tracking-tighter leading-none">
                        Gestão <span className="text-brand-primary italic font-serif lowercase font-normal">Sistémica</span>
                    </h1>
                </div>

                <div className="flex items-center gap-4 justify-center md:justify-end">
                    <button className="flex items-center gap-3 px-8 py-5 bg-white border border-gray-100 rounded-3xl font-black text-[10px] uppercase tracking-widest text-gray-500 hover:bg-gray-50 transition-all">
                        <Download className="w-4 h-4" /> Exportar Dados
                    </button>
                    <button className="flex items-center gap-3 px-10 py-5 bg-brand-dark text-white rounded-3xl font-black text-[10px] uppercase tracking-widest hover:bg-brand-primary transition-all shadow-xl shadow-brand-dark/20">
                        Nova Obra <ArrowUpRight className="w-4 h-4" />
                    </button>
                </div>
            </header>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {kpis.map((kpi, i) => (
                    <m.div
                        key={kpi.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="group relative bg-white p-10 rounded-[3rem] border border-gray-100/60 shadow-xl shadow-brand-dark/[0.02] hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] transition-all duration-700 overflow-hidden"
                    >
                        <div className={`absolute top-0 right-0 w-24 h-24 bg-${kpi.color}/5 rounded-bl-[4rem] group-hover:scale-150 transition-transform duration-700`} />

                        <div className="relative z-10 space-y-8">
                            <div className="flex items-center justify-between">
                                <div className={`w-14 h-14 bg-brand-dark rounded-2xl flex items-center justify-center group-hover:bg-brand-primary transition-all duration-500 shadow-lg`}>
                                    <kpi.icon className="w-6 h-6 text-brand-primary group-hover:text-white transition-colors" />
                                </div>
                                <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 bg-${kpi.color}/10 text-${kpi.color} rounded-full`}>
                                    {kpi.trend}
                                </span>
                            </div>

                            <div className="space-y-2">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">{kpi.label}</p>
                                <h3 className="text-3xl font-black text-brand-dark uppercase tracking-tight">{loading ? '...' : kpi.val}</h3>
                            </div>
                        </div>
                    </m.div>
                ))}
            </div>

            {/* Main Insights Grid */}
            <div className="grid lg:grid-cols-3 gap-10">

                {/* Status Highlights */}
                <m.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-2 bg-brand-dark p-12 rounded-[4rem] text-white relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_rgba(196,160,82,0.1)_0%,_transparent_50%)]"></div>
                    <div className="relative z-10 flex flex-col h-full justify-between gap-12">
                        <div className="space-y-4">
                            <h3 className="text-3xl font-black uppercase tracking-tighter">Insights de Performance</h3>
                            <p className="text-gray-400 font-medium max-w-sm">O acervo registou um crescimento orgânico de 12% este mês, com destaque para a literatura digital.</p>
                        </div>

                        <div className="grid grid-cols-3 gap-8 pt-12 border-t border-white/5">
                            {[
                                { l: 'Taxa Conversão', v: '84%' },
                                { l: 'Rating Médio', v: '4.9' },
                                { l: 'Retenção', v: '92%' }
                            ].map((s, i) => (
                                <div key={i} className="space-y-1">
                                    <p className="text-[9px] font-black text-brand-primary uppercase tracking-widest">{s.l}</p>
                                    <p className="text-2xl font-black text-white">{s.v}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </m.div>

                {/* Alerts/Quick Actions */}
                <m.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white p-12 rounded-[4rem] border border-gray-100 shadow-2xl shadow-brand-dark/5 space-y-10"
                >
                    <div className="flex items-center justify-between">
                        <h4 className="font-black text-sm uppercase tracking-widest text-brand-dark">Alertas de Gestão</h4>
                        <AlertCircle className="w-5 h-5 text-red-500" />
                    </div>

                    <div className="space-y-6">
                        {stats.lowStockCount > 0 ? (
                            <div className="p-6 bg-red-50 rounded-3xl border border-red-100 flex gap-4 items-start">
                                <div className="p-3 bg-red-100 rounded-xl text-red-600"><ShoppingBag className="w-4 h-4" /></div>
                                <div>
                                    <p className="text-xs font-black text-red-800 uppercase tracking-tight">{stats.lowStockCount} Obras com Stock Baixo</p>
                                    <p className="text-[10px] font-bold text-red-600 uppercase mt-1">Acção imediata necessária</p>
                                </div>
                            </div>
                        ) : (
                            <div className="p-6 bg-green-50 rounded-3xl border border-green-100 flex gap-4 items-start">
                                <div className="p-3 bg-green-100 rounded-xl text-green-600"><CheckCircle className="w-4 h-4" /></div>
                                <div>
                                    <p className="text-xs font-black text-green-800 uppercase tracking-tight">Logística Nominal</p>
                                    <p className="text-[10px] font-bold text-green-600 uppercase mt-1">Stock totalmente otimizado</p>
                                </div>
                            </div>
                        )}

                        <div className="pt-6 space-y-4">
                            <button className="w-full py-5 rounded-2xl bg-gray-50 border border-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:bg-brand-primary/10 hover:text-brand-primary hover:border-brand-primary transition-all flex items-center justify-center gap-3">
                                Calendário de Lançamentos <Calendar className="w-4 h-4" />
                            </button>
                            <button className="w-full py-5 rounded-2xl bg-gray-50 border border-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:bg-brand-primary/10 hover:text-brand-primary hover:border-brand-primary transition-all flex items-center justify-center gap-3">
                                Auditoria de Sistema <ShieldCheck className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </m.div>

            </div>
        </div>
    );
};

const CheckCircle = ({ className }: { className: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const ShieldCheck = ({ className }: { className: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
);

export default AdminOverview;
