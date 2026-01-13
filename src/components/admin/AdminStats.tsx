import React from 'react';
import { BookOpen, Users, ShoppingCart } from 'lucide-react';

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
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/10 rounded-2xl p-6">
                <BookOpen className="w-8 h-8 text-brand-primary mb-2" />
                <p className="text-3xl font-black mb-1">{isLoading ? '...' : stats.totalBooks}</p>
                <p className="text-sm text-gray-300">Livros</p>
            </div>
            <div className="bg-white/10 rounded-2xl p-6">
                <Users className="w-8 h-8 text-brand-primary mb-2" />
                <p className="text-3xl font-black mb-1">{isLoading ? '...' : stats.totalUsers}</p>
                <p className="text-sm text-gray-300">Utilizadores</p>
            </div>
            <div className="bg-white/10 rounded-2xl p-6">
                <ShoppingCart className="w-8 h-8 text-brand-primary mb-2" />
                <p className="text-3xl font-black mb-1">{isLoading ? '...' : stats.pendingOrders}</p>
                <p className="text-sm text-gray-300">Pedidos Pendentes</p>
            </div>
            <div className="bg-white/10 rounded-2xl p-6">
                <p className="text-3xl font-black mb-1">
                    {isLoading ? '...' : (stats.revenue >= 1000000
                        ? `${(stats.revenue / 1000000).toFixed(1)}M`
                        : stats.revenue.toLocaleString())}
                </p>
                <p className="text-sm text-gray-300">Receita (Kz)</p>
            </div>
        </div>
    );
};

export default AdminStats;
