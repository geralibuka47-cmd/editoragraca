import React from 'react';
import { BookOpen, Users, ShoppingCart, TrendingUp, Zap, Activity, AlertCircle } from 'lucide-react';
import { m } from 'framer-motion';
import { Skeleton } from '../Skeleton';

interface AdminStatsProps {
    stats: {
        totalBooks: number;
        totalUsers: number;
        pendingOrders: number;
        revenue: number;
        lowStockCount: number;
    };
    isLoading: boolean;
}

const AdminStats: React.FC<AdminStatsProps> = ({ stats, isLoading }) => {
    const statCards = [
        { label: 'Obras Ativas', value: stats.totalBooks, icon: BookOpen, color: 'text-brand-primary', bg: 'bg-brand-primary/10', glow: 'shadow-brand-primary/10' },
        { label: 'Utilizadores', value: stats.totalUsers, icon: Users, color: 'text-blue-500', bg: 'bg-blue-50', glow: 'shadow-blue-500/10' },
        { label: 'Pendentes', value: stats.pendingOrders, icon: ShoppingCart, color: 'text-emerald-500', bg: 'bg-emerald-50', glow: 'shadow-emerald-500/10' },
        { label: 'Receita', value: `${stats.revenue.toLocaleString('pt-AO')} Kz`, icon: TrendingUp, color: 'text-purple-500', bg: 'bg-purple-50', glow: 'shadow-purple-500/10' },
        { label: 'Baixo Stock', value: stats.lowStockCount, icon: AlertCircle, color: 'text-amber-500', bg: 'bg-amber-50', glow: 'shadow-amber-500/10' },
    ];

    return (
        <div className="flex flex-wrap gap-4 w-full">
            {statCards.map((stat, index) => (
                <m.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex-1 min-w-[120px] sm:min-w-[140px] bg-white border border-gray-100 p-4 sm:p-5 rounded-2xl sm:rounded-[2rem] hover:shadow-lg transition-all group relative overflow-hidden ${stat.glow} shadow-sm`}
                >
                    <div className="flex justify-between items-start mb-3">
                        <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                            <stat.icon className="w-4 h-4" />
                        </div>
                        <Activity className="w-3 h-3 text-gray-300 animate-pulse" />
                    </div>

                    <div className="space-y-0.5">
                        <p className="text-xl sm:text-2xl font-black text-slate-900 tracking-tighter">
                            {isLoading ? (
                                <Skeleton className="h-8 w-16 bg-gray-100" />
                            ) : (
                                stat.label.includes('Receita')
                                    ? (stats.revenue >= 1000000
                                        ? `${(stats.revenue / 1000000).toFixed(1)}M`
                                        : stats.revenue.toLocaleString())
                                    : stat.value.toLocaleString()
                            )}
                            {stat.label.includes('Receita') && !isLoading && <span className="text-[10px] ml-1 opacity-40">Kz</span>}
                        </p>
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 group-hover:text-brand-primary transition-colors truncate">
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

