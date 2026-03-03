import React from 'react';
import {
    Users,
    BookOpen,
    ShoppingBag,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    Clock,
    ChevronRight,
    Zap
} from 'lucide-react';
import { motion } from 'framer-motion';

const AdminOverview: React.FC = () => {
    const stats = [
        { name: 'Utilizadores Ativos', value: '1,284', trend: '+12.5%', isUp: true, icon: Users, color: 'brand-primary' },
        { name: 'Vendas Totais', value: '€12,450', trend: '+8.2%', isUp: true, icon: ShoppingBag, color: 'brand-dark' },
        { name: 'Livros no Acervo', value: '142', trend: '+2', isUp: true, icon: BookOpen, color: 'amber-600' },
        { name: 'Taxa de Conversão', value: '3.2%', trend: '-1.1%', isUp: false, icon: TrendingUp, color: 'brand-accent' },
    ];

    const recentActivities = [
        { id: 1, type: 'order', title: 'Nova encomenda #4829', user: 'Carlos Mendes', time: 'Há 5 minutos', amount: '€45.00' },
        { id: 2, type: 'user', title: 'Novo registo de autor', user: 'Ana Paula Santos', time: 'Há 22 minutos', amount: null },
        { id: 3, type: 'book', title: 'Atualização de Stock', user: 'Sistema', time: 'Há 1 hora', amount: '20 un.' },
        { id: 4, type: 'order', title: 'Encomenda expedida #4825', user: 'João Silva', time: 'Há 2 horas', amount: '€120.00' },
    ];

    return (
        <div className="space-y-12">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 overflow-hidden">
                <div>
                    <span className="text-brand-primary font-bold uppercase tracking-[0.4em] text-[10px]">Visão Geral</span>
                    <h2 className="text-4xl sm:text-5xl font-black text-brand-dark uppercase tracking-tighter leading-none mt-2">
                        Dashboard
                    </h2>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-brand-dark text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        Últimos 30 dias
                    </div>
                    <button
                        className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                        title="Ações rápidas"
                    >
                        <Zap className="w-4 h-4 text-brand-primary" />
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group p-8 bg-white rounded-[2rem] shadow-sm border border-gray-50 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500 relative overflow-hidden"
                    >
                        <div className={`absolute top-0 right-0 w-32 h-32 bg-${stat.color}/5 rounded-full translate-x-12 -translate-y-12 group-hover:scale-150 transition-transform duration-700`}></div>

                        <div className="flex items-center justify-between mb-6 relative">
                            <div className={`p-4 rounded-2xl bg-${stat.color}/10 text-${stat.color === 'brand-primary' ? 'brand-primary' : 'brand-dark'}`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <div className={`flex items-center gap-1 text-xs font-black ${stat.isUp ? 'text-green-500' : 'text-red-500'}`}>
                                {stat.isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                {stat.trend}
                            </div>
                        </div>

                        <div className="relative">
                            <p className="text-3xl font-black text-brand-dark mb-1">{stat.value}</p>
                            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">{stat.name}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Bottom Grid: Recent Activity & Quick Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Activity Feed */}
                <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-10 border border-gray-50 shadow-sm">
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="text-xl font-black uppercase tracking-tight text-brand-dark">Atividade Recente</h3>
                        <button className="text-[10px] font-black uppercase tracking-widest text-brand-primary hover:text-brand-dark transition-colors border-b-2 border-brand-primary/20 pb-1">
                            Ver Todo o Histórico
                        </button>
                    </div>

                    <div className="space-y-6">
                        {recentActivities.map((activity, index) => (
                            <div key={activity.id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors group cursor-pointer border border-transparent hover:border-gray-100">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-brand-primary group-hover:text-white transition-all duration-500">
                                        {activity.type === 'order' && <ShoppingBag className="w-5 h-5" />}
                                        {activity.type === 'user' && <Users className="w-5 h-5" />}
                                        {activity.type === 'book' && <BookOpen className="w-5 h-5" />}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-black text-brand-dark leading-tight">{activity.title}</span>
                                        <span className="text-xs text-gray-400 font-medium">Por {activity.user} • {activity.time}</span>
                                    </div>
                                </div>
                                {activity.amount && (
                                    <span className="text-sm font-black text-brand-dark">{activity.amount}</span>
                                )}
                                {!activity.amount && (
                                    <ChevronRight className="w-4 h-4 text-gray-300" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions / Integration Status */}
                <div className="bg-brand-dark rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
                        <div className="absolute top-[-20%] right-[-20%] w-[80%] h-[80%] bg-brand-primary blur-[100px] rounded-full"></div>
                    </div>

                    <h3 className="text-xl font-black uppercase tracking-tight mb-10 relative z-10">Estado do Sistema</h3>

                    <div className="space-y-8 relative z-10">
                        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Banco de Dados</span>
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                            </div>
                            <p className="text-sm font-bold text-white/90">Sincronizado via Supabase</p>
                            <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest">Última sync: há 2m</p>
                        </div>

                        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Armazenamento</span>
                                <span className="text-[10px] font-black">82%</span>
                            </div>
                            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                <div className="w-[82%] h-full bg-brand-primary"></div>
                            </div>
                            <p className="text-[10px] text-gray-500 mt-4 uppercase tracking-widest">Capacidade do Firebase</p>
                        </div>

                        <button className="w-full py-4 bg-brand-primary text-white font-black uppercase tracking-widest text-xs rounded-xl hover:brightness-110 transition-all shadow-xl shadow-brand-primary/20">
                            Lançar Nova Obra
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminOverview;
