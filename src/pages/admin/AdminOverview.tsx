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
        <div className="space-y-8 pb-12">

            {/* Action Bar */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-200">
                <div className="space-y-1 text-center md:text-left">
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                        Visão Geral
                    </h1>
                    <p className="text-sm text-gray-500">Métricas e performance do sistema.</p>
                </div>

                <div className="flex items-center gap-3 justify-center md:justify-end">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                        <Download className="w-4 h-4" /> Exportar
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg text-sm font-medium hover:bg-brand-dark transition-colors">
                        <ArrowUpRight className="w-4 h-4" /> Relatório Detalhado
                    </button>
                </div>
            </header>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {kpis.map((kpi, i) => (
                    <m.div
                        key={kpi.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white p-5 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-50 border border-gray-100">
                                <kpi.icon className="w-5 h-5 text-gray-600" />
                            </div>
                            <span className={`text-xs font-semibold px-2 py-1 rounded bg-${kpi.color}/10 text-${kpi.color}`}>
                                {kpi.trend}
                            </span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">{kpi.label}</p>
                            <h3 className="text-2xl font-bold text-gray-900 leading-none">{loading ? '...' : kpi.val}</h3>
                        </div>
                    </m.div>
                ))}
            </div>

            {/* Main Insights Grid */}
            <div className="grid lg:grid-cols-3 gap-6">

                {/* Status Highlights */}
                <m.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-6"
                >
                    <div className="flex flex-col h-full justify-between gap-8">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Insights de Performance</h3>
                            <p className="text-sm text-gray-500">O acervo registou um crescimento orgânico de 12% este mês, com destaque para a literatura digital.</p>
                        </div>

                        <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-100">
                            {[
                                { l: 'Taxa Conversão', v: '84%' },
                                { l: 'Rating Médio', v: '4.9' },
                                { l: 'Retenção', v: '92%' }
                            ].map((s, i) => (
                                <div key={i}>
                                    <p className="text-xs font-medium text-gray-500 mb-1">{s.l}</p>
                                    <p className="text-xl font-bold text-gray-900">{s.v}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </m.div>

                {/* Alerts/Quick Actions */}
                <m.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white p-6 rounded-xl border border-gray-200"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h4 className="font-bold text-sm text-gray-900">Alertas de Gestão</h4>
                        <AlertCircle className="w-4 h-4 text-gray-400" />
                    </div>

                    <div className="space-y-4">
                        {stats.lowStockCount > 0 ? (
                            <div className="p-4 bg-red-50 rounded-lg border border-red-100 flex gap-3 items-start">
                                <ShoppingBag className="w-5 h-5 text-red-500 flex-shrink-0" />
                                <div>
                                    <p className="text-sm font-semibold text-red-800">{stats.lowStockCount} Obras com Stock Baixo</p>
                                    <p className="text-xs text-red-600 mt-1">Revisão de inventário necessária.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="p-4 bg-green-50 rounded-lg border border-green-100 flex gap-3 items-start">
                                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                                <div>
                                    <p className="text-sm font-semibold text-green-800">Logística Nominal</p>
                                    <p className="text-xs text-green-600 mt-1">Stock perfeitamente otimizado.</p>
                                </div>
                            </div>
                        )}

                        <div className="pt-2 space-y-2">
                            <button className="w-full py-2.5 px-4 rounded-lg bg-gray-50 border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors flex items-center justify-center gap-2">
                                <Calendar className="w-4 h-4" /> Calendário Lançamentos
                            </button>
                            <button className="w-full py-2.5 px-4 rounded-lg bg-gray-50 border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors flex items-center justify-center gap-2">
                                <ShieldCheck className="w-4 h-4" /> Auditoria Geral
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
