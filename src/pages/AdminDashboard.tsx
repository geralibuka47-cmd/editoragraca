import React, { useState, useEffect } from 'react';
import { motion as m, AnimatePresence } from 'framer-motion';
import { BarChart3, Users, BookOpen, ShoppingBag, FileText, Settings, Shield, Plus, Briefcase, Zap, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/DashboardLayout';

// Sub-components
import AdminStats from '../components/admin/AdminStats';
import AdminBooksTab from '../components/admin/AdminBooksTab';
import AdminUsersTab from '../components/admin/AdminUsersTab';
import AdminContentTab from '../components/admin/AdminContentTab';
import AdminBlogTab from '../components/admin/AdminBlogTab';
import AdminOrdersTab from '../components/admin/AdminOrdersTab';
import AdminManuscriptsTab from '../components/admin/AdminManuscriptsTab';
import AdminTeamTab from '../components/admin/AdminTeamTab';
import AdminServicesTab from '../components/admin/AdminServicesTab';

import { getBooks, getStats, getBlogPosts } from '../services/dataService';
import { BlogPost, User } from '../types';

type TabType = 'stats' | 'books' | 'users' | 'orders' | 'manuscripts' | 'blog' | 'team' | 'services' | 'content';

const AdminDashboard: React.FC = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<TabType>('stats');

    // Data States
    const [stats, setStats] = useState({
        totalBooks: 0,
        totalUsers: 0,
        totalOrders: 0,
        revenue: 0,
        pendingManuscripts: 0
    });
    const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Initial Data Fetch
    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;
            setIsLoading(true);
            try {
                const [statsData, postsData] = await Promise.all([
                    getStats(), // key point to check
                    getBlogPosts()
                ]);
                setStats(statsData);
                setBlogPosts(postsData);
            } catch (error) {
                console.error("Error loading admin data", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [user]);

    // Role Check
    useEffect(() => {
        if (!loading && (!user || user.role !== 'adm')) {
            navigate('/');
        }
    }, [user, loading, navigate]);

    if (loading) return null; // Or a unified loader

    const navItems = [
        { id: 'stats', label: 'Visão Geral', icon: BarChart3 },
        { id: 'books', label: 'Acervo', icon: BookOpen },
        { id: 'users', label: 'Utilizadores', icon: Users },
        { id: 'orders', label: 'Encomendas', icon: ShoppingBag },
        { id: 'manuscripts', label: 'Manuscritos', icon: FileText },
        { id: 'blog', label: 'Blog & Notícias', icon: ImageIcon },
        { id: 'services', label: 'Serviços', icon: Briefcase },
        { id: 'team', label: 'Equipa', icon: Shield },
        { id: 'content', label: 'Conteúdo Site', icon: Zap },
    ];

    return (
        <DashboardLayout
            title="Painel Administrativo"
            userRoleLabel="Administrador"
            activeTab={activeTab}
            onTabChange={(id) => setActiveTab(id as TabType)}
            sidebarItems={navItems}
        >
            <AnimatePresence mode="wait">
                <m.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    {activeTab === 'stats' && <AdminStats stats={stats} isLoading={isLoading} />}
                    {activeTab === 'books' && <AdminBooksTab onStatsRefresh={() => { }} />}
                    {activeTab === 'users' && <AdminUsersTab />}
                    {activeTab === 'orders' && <AdminOrdersTab user={user!} />}
                    {activeTab === 'manuscripts' && <AdminManuscriptsTab />}
                    {activeTab === 'blog' && <AdminBlogTab posts={blogPosts} onRefresh={() => { }} />}
                    {activeTab === 'services' && <AdminServicesTab />}
                    {activeTab === 'team' && <AdminTeamTab />}
                    {activeTab === 'content' && <AdminContentTab />}
                </m.div>
            </AnimatePresence>
        </DashboardLayout>
    );
};

export default AdminDashboard;
