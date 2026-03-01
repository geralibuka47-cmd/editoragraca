import React from 'react';
import { BookOpen, Users, ShoppingCart, TrendingUp, AlertCircle } from 'lucide-react';
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

const cards: { key: keyof AdminStatsProps['stats']; label: string; icon: typeof BookOpen }[] = [
    { key: 'totalBooks', label: 'Obras', icon: BookOpen },
    { key: 'totalUsers', label: 'Utilizadores', icon: Users },
    { key: 'pendingOrders', label: 'Pendentes', icon: ShoppingCart },
    { key: 'revenue', label: 'Receita', icon: TrendingUp },
    { key: 'lowStockCount', label: 'Baixo stock', icon: AlertCircle },
];

const styles = [
    { bg: 'bg-brand-primary/10', text: 'text-brand-primary' },
    { bg: 'bg-blue-500/10', text: 'text-blue-600' },
    { bg: 'bg-emerald-500/10', text: 'text-emerald-600' },
    { bg: 'bg-purple-500/10', text: 'text-purple-600' },
    { bg: 'bg-amber-500/10', text: 'text-amber-600' },
];

const AdminStats: React.FC<AdminStatsProps> = ({ stats, isLoading }) => {
    const formatVal = (key: string, val: number) =>
        key === 'revenue' ? (val >= 1e6 ? `${(val / 1e6).toFixed(1)}M` : val.toLocaleString('pt-AO')) : val.toLocaleString('pt-AO');

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {cards.map((card, i) => {
                const val = stats[card.key];
                const s = styles[i];
                const Icon = card.icon;
                return (
                    <m.div
                        key={card.key}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-start justify-between gap-2">
                            <div className={`p-2.5 rounded-xl ${s.bg} ${s.text}`}>
                                <Icon className="w-5 h-5" />
                            </div>
                            <span className="text-lg sm:text-xl font-bold text-slate-900 tabular-nums">
                                {isLoading ? <Skeleton className="h-7 w-14 bg-gray-100 rounded" /> : formatVal(card.key, val)}
                                {!isLoading && card.key === 'revenue' && <span className="text-xs font-normal text-gray-400 ml-0.5">Kz</span>}
                            </span>
                        </div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mt-3">{card.label}</p>
                    </m.div>
                );
            })}
        </div>
    );
};

export default AdminStats;

