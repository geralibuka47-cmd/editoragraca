import React from 'react';
import { BookOpen, Users, ShoppingCart, TrendingUp } from 'lucide-react';
import { m } from 'framer-motion';

interface AdminStatsProps {
    stats: {
        totalBooks: number;
        totalUsers: number;
        pendingOrders: number;
        revenue: number;
    };
    isLoading: boolean;
}

const AdminStats: React.FC<AdminStatsProps> = ({ stats, isLoading }) => {
    const statCards = [
        { label: 'Livros', value: stats.totalBooks, icon: BookOpen, color: 'text-brand-primary' },
        { label: 'Utilizadores', value: stats.totalUsers, icon: Users, color: 'text-blue-400' },
        { label: 'Pendentes', value: stats.pendingOrders, icon: ShoppingCart, color: 'text-orange-400' },
        { label: 'Receita (Kz)', value: stats.revenue, icon: TrendingUp, color: 'text-green-400' },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat, index) => (
                <m.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/5 backdrop-blur-xl border border-white/5 p-6 rounded-[2rem] hover:bg-white/[0.08] transition-all group"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className={`p-3 rounded-2xl bg-white/5 ${stat.color} group-hover:scale-110 transition-transform`}>
                            <stat.icon className="w-5 h-5" />
                        </div>
                        <div className="text-[10px] font-black text-white/20 uppercase tracking-widest">Live</div>
                    </div>

                    <p className="text-3xl font-black text-white mb-1 tracking-tighter">
                        {isLoading ? (
                            <span className="inline-block w-12 h-8 skeleton"></span>
                        ) : (
                            stat.label.includes('Receita')
                                ? (stat.value >= 1000000
                                    ? `${(stat.value / 1000000).toFixed(1)}M`
                                    : stat.value.toLocaleString())
                                : stat.value.toLocaleString()
                        )}
                    </p>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 group-hover:text-brand-primary transition-colors">
                        {stat.label}
                    </p>
                </m.div>
            ))}
        </div>
    );
};

export default AdminStats;
