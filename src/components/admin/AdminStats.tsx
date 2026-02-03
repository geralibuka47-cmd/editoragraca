import React from 'react';
import { BookOpen, Users, ShoppingCart, TrendingUp, Zap, Activity, AlertCircle } from 'lucide-react';
import { m } from 'framer-motion';

interface AdminStatsProps {
    stats: {
        totalBooks: number;
        totalUsers: number;
        pendingOrders: number;
        revenue: number;
        lowStockCount?: number;
    };
    isLoading: boolean;
}

const AdminStats: React.FC<AdminStatsProps> = ({ stats, isLoading }) => {
    const statCards = [
        { label: 'Obras Ativas', value: stats.totalBooks, icon: BookOpen, color: 'text-brand-primary', glow: 'shadow-brand-primary/20' },
        { label: 'Utilizadores', value: stats.totalUsers, icon: Users, color: 'text-blue-400', glow: 'shadow-blue-500/20' },
        { label: 'Pendentes', value: stats.pendingOrders, icon: ShoppingCart, color: 'text-orange-400', glow: 'shadow-orange-500/20' },
        { label: 'Stock Crítico', value: stats.lowStockCount || 0, icon: AlertCircle, color: 'text-red-400', glow: 'shadow-red-500/20' },
        { label: 'Receita Est.', value: stats.revenue, icon: TrendingUp, color: 'text-green-400', glow: 'shadow-green-500/20' },
    ];

    return (
        <div className="flex flex-wrap gap-4 w-full">
            {statCards.map((stat, index) => (
                <m.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex-1 min-w-[120px] sm:min-w-[140px] bg-white/5 backdrop-blur-3xl border border-white/5 p-4 sm:p-5 rounded-2xl sm:rounded-[2rem] hover:bg-white/[0.08] transition-all group relative overflow-hidden ${stat.glow} shadow-2xl`}
                >
                    <div className="flex justify-between items-start mb-3">
                        <div className={`p-2.5 rounded-xl bg-white/5 ${stat.color} group-hover:scale-110 transition-transform`}>
                            <stat.icon className="w-4 h-4" />
                        </div>
                        <Activity className="w-3 h-3 text-white/10 animate-pulse" />
                    </div>

                    <div className="space-y-0.5">
                        <p className="text-xl sm:text-2xl font-black text-white tracking-tighter">
                            {isLoading ? (
                                <span className="inline-block w-8 h-6 bg-white/5 animate-pulse rounded" />
                            ) : (
                                stat.label.includes('Receita')
                                    ? (stats.revenue >= 1000000
                                        ? `${(stats.revenue / 1000000).toFixed(1)}M`
                                        : stats.revenue.toLocaleString())
                                    : stat.value.toLocaleString()
                            )}
                            {stat.label.includes('Receita') && !isLoading && <span className="text-[10px] ml-1 opacity-40">Kz</span>}
                        </p>
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 group-hover:text-brand-primary transition-colors truncate">
                            {stat.label}
                        </p>
                    </div>

                    {/* Background accent */}
                    <div className={`absolute -bottom-4 -right-4 w-12 h-12 rounded-full opacity-10 blur-xl ${stat.color.replace('text', 'bg')}`} />
                </m.div>
            ))}
        </div>
    );
};

export default AdminStats;

