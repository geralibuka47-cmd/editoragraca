import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Book } from '../types';
import { BookOpen, Heart, User as UserIcon, LogOut, Settings, Download, ShoppingCart, TrendingUp, Eye, BarChart3, Star, Zap, DollarSign, Package, Check, X as CloseIcon, Clock } from 'lucide-react';
import { motion as m, AnimatePresence } from 'framer-motion';
import { OptimizedImage } from '../components/OptimizedImage';
import { useToast } from '../components/Toast';
import SEO from '../components/SEO';
import { generateBookSlug } from '../services/dataService';

const ProfilePage: React.FC = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const { showToast } = useToast();

    const [activeTab, setActiveTab] = useState<string>(() => {
        const tabParam = searchParams.get('tab');
        if (tabParam) return tabParam;
        if (user?.role === 'autor') return 'author_dashboard';
        return 'library';
    });

    // Sync state with URL parameter if it changes
    useEffect(() => {
        const tabParam = searchParams.get('tab');
        if (tabParam && tabParam !== activeTab) {
            setActiveTab(tabParam);
        }
    }, [searchParams]);

    // Update URL when tab changes manually
    const handleTabChange = (newTab: string) => {
        setActiveTab(newTab);
        setSearchParams({ tab: newTab });
    };
    const [purchasedBooks, setPurchasedBooks] = useState<Book[]>([]);
    const [authorBooks, setAuthorBooks] = useState<Book[]>([]);
    const [authorStats, setAuthorStats] = useState<any>(null);
    const [authorOrders, setAuthorOrders] = useState<any[]>([]);
    const [isLoadingLibrary, setIsLoadingLibrary] = useState(false);
    const [isLoadingAuthor, setIsLoadingAuthor] = useState(false);
    const [isLoadingOrders, setIsLoadingOrders] = useState(false);
    const [wishlist, setWishlist] = useState<Book[]>(() => {
        const saved = localStorage.getItem('wishlist');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        if (!loading && !user) {
            navigate('/login');
        }
    }, [user, loading, navigate]);

    useEffect(() => {
        const fetchLibrary = async () => {
            if (!user) return;
            if (activeTab === 'library') {
                setIsLoadingLibrary(true);
                try {
                    const { getUserBooks } = await import('../services/dataService');
                    const data = await getUserBooks(user.id);
                    setPurchasedBooks(data);
                } catch (error) {
                    console.error('Error fetching library:', error);
                } finally {
                    setIsLoadingLibrary(false);
                }
            }
        };
        fetchLibrary();
    }, [user, activeTab]);

    useEffect(() => {
        const fetchAuthorData = async () => {
            if (!user || user.role !== 'autor') return;

            const isDashOrBooks = activeTab === 'author_dashboard' || activeTab === 'author_books';
            const isOrders = activeTab === 'author_orders';

            if (isDashOrBooks) {
                setIsLoadingAuthor(true);
                try {
                    const { getAuthorStats, getBooksMinimal } = await import('../services/dataService');
                    const [stats, allBooks] = await Promise.all([
                        getAuthorStats(user.id),
                        getBooksMinimal()
                    ]);

                    setAuthorStats(stats);

                    // Filter books where user is the author
                    const filtered = allBooks.filter((b: Book) =>
                        b.authorId === user.id ||
                        (b.author && b.author.toLowerCase() === user.name.toLowerCase())
                    );
                    setAuthorBooks(filtered);
                } catch (error) {
                    console.error('Error fetching author data:', error);
                } finally {
                    setIsLoadingAuthor(false);
                }
            }

            if (isOrders) {
                setIsLoadingOrders(true);
                try {
                    const { getAllOrders } = await import('../services/dataService');
                    const allOrders = await getAllOrders();

                    // Filter orders that have items from this author
                    const filtered = allOrders.filter(order =>
                        order.items?.some((item: any) =>
                            item.authorId === user.id ||
                            (item.authorIds && item.authorIds.includes(user.id)) ||
                            (item.author && item.author.toLowerCase().includes(user.name?.toLowerCase() || ''))
                        )
                    );
                    setAuthorOrders(filtered);
                } catch (error) {
                    console.error('Error fetching author orders:', error);
                } finally {
                    setIsLoadingOrders(false);
                }
            }
        };
        fetchAuthorData();
    }, [user, activeTab]);

    const handleUpdateStatus = async (orderId: string, newStatus: string) => {
        try {
            const { updateOrderStatus } = await import('../services/dataService');
            await updateOrderStatus(orderId, newStatus as any);
            showToast(`Encomenda ${newStatus.toLowerCase()} com sucesso!`, 'success');

            // Refresh orders
            setAuthorOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        } catch (error) {
            showToast('Erro ao atualizar estado da encomenda.', 'error');
        }
    };

    // Update wishlist from local storage when tab changes (simple sync)
    useEffect(() => {
        if (activeTab === 'wishlist') {
            const saved = localStorage.getItem('wishlist');
            if (saved) setWishlist(JSON.parse(saved));
        }
    }, [activeTab]);

    const handleDownload = async (book: Book) => {
        if (!book.digitalFileUrl) {
            showToast('Ficheiro digital não disponível.', 'error');
            return;
        }

        try {
            showToast('A preparar download...', 'info');
            const response = await fetch(book.digitalFileUrl);
            if (!response.ok) throw new Error('Download failed');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            const extension = book.digitalFileUrl.split('?')[0].split('.').pop() || 'pdf';
            a.download = `${book.title}.${extension}`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            showToast('Download concluído!', 'success');
        } catch (error) {
            console.error('Download error:', error);
            window.open(book.digitalFileUrl, '_blank');
            showToast('O ficheiro abrirá no navegador.', 'info');
        }
    };

    const handleLogout = async () => {
        const { logout } = await import('../services/authService');
        await logout();
        navigate('/');
    };

    const handleChangePassword = async () => {
        if (!user?.email) return;
        try {
            const { resetPassword } = await import('../services/authService');
            await resetPassword(user.email);
            showToast('Email de recuperação enviado para ' + user.email, 'success');
        } catch (error) {
            showToast('Erro ao enviar email de recuperação.', 'error');
        }
    };

    if (loading || !user) return null; // Or loader

    return (
        <div className="min-h-screen bg-gray-50 pt-32 pb-12 px-4 sm:px-6 lg:px-8">
            <SEO title="O Meu Perfil" description="Gerencie sua biblioteca, lista de desejos e definições da conta na Editora Graça." />
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8 flex flex-col md:flex-row items-center gap-8">
                    <div className="w-24 h-24 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center text-4xl font-bold uppercase overflow-hidden border-4 border-white shadow-sm">
                        {user.avatarUrl ? (
                            <OptimizedImage
                                src={user.avatarUrl}
                                alt={user.name}
                                className="w-full h-full object-cover"
                                aspectRatio="square"
                            />
                        ) : (
                            user.name.charAt(0)
                        )}
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                        <p className="text-gray-500">{user.email}</p>
                        <div className="flex items-center justify-center md:justify-start gap-4 mt-4">
                            <span className="px-3 py-1 bg-brand-primary/10 text-brand-primary rounded-full text-xs font-bold uppercase tracking-wider">
                                {user.role === 'adm' ? 'Administrador' : user.role === 'autor' ? 'Autor Verificado' : 'Leitor Membro'}
                            </span>
                            {user.role === 'adm' && (
                                <button
                                    onClick={() => navigate('/admin')}
                                    className="text-xs font-bold text-gray-400 hover:text-brand-primary uppercase tracking-wider underline flex items-center gap-1"
                                >
                                    <Zap className="w-3 h-3" /> Painel de Gestão
                                </button>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        aria-label="Encerrar sessão"
                        className="flex items-center gap-2 px-6 py-3 border border-gray-200 rounded-xl hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all font-medium text-gray-600"
                    >
                        <LogOut className="w-4 h-4" /> Terminar Sessão
                    </button>
                </div>

                {/* Navigation */}
                <div className="flex justify-center mb-8">
                    <div role="tablist" className="bg-white p-1.5 rounded-xl shadow-sm border border-gray-100 flex gap-2 overflow-x-auto max-w-full no-scrollbar">
                        {[
                            ...(user.role === 'autor' ? [
                                { id: 'author_dashboard', label: 'Dashboard', icon: BarChart3 },
                                { id: 'author_books', label: 'Minhas Obras', icon: BookOpen },
                                { id: 'author_orders', label: 'Meus Pedidos', icon: Package },
                            ] : []),
                            { id: 'library', label: 'Minha Biblioteca', icon: Download },
                            { id: 'wishlist', label: 'Lista de Desejos', icon: Heart },
                            { id: 'settings', label: 'Definições', icon: Settings },
                        ].map((tab) => {
                            const isSelected = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => handleTabChange(tab.id)}
                                    role="tab"
                                    {...({ 'aria-selected': isSelected })}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-sm transition-all whitespace-nowrap ${isSelected
                                        ? 'bg-brand-primary text-white shadow-md'
                                        : 'text-gray-500 hover:bg-gray-50'
                                        }`}
                                >
                                    <tab.icon className="w-4 h-4" />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Content */}
                <AnimatePresence mode="wait">
                    <m.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {activeTab === 'author_dashboard' && (
                            <div className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                                <BookOpen className="w-6 h-6" />
                                            </div>
                                            <h3 className="font-bold text-gray-500 text-sm uppercase tracking-wider">Obras Publicadas</h3>
                                        </div>
                                        <p className="text-4xl font-black text-gray-900">{authorStats?.publishedBooks || 0}</p>
                                    </div>
                                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                                <TrendingUp className="w-6 h-6" />
                                            </div>
                                            <h3 className="font-bold text-gray-500 text-sm uppercase tracking-wider">Total de Vendas</h3>
                                        </div>
                                        <p className="text-4xl font-black text-gray-900">{authorStats?.totalSales || 0}</p>
                                    </div>
                                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                                                <DollarSign className="w-6 h-6" />
                                            </div>
                                            <h3 className="font-bold text-gray-500 text-sm uppercase tracking-wider">Royalties Estimados</h3>
                                        </div>
                                        <div className="flex items-baseline gap-2">
                                            <p className="text-4xl font-black text-gray-900">{(authorStats?.totalRoyalties || 0).toLocaleString('pt-PT')}</p>
                                            <span className="font-bold text-gray-400">AKZ</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-brand-dark rounded-3xl p-8 text-white relative overflow-hidden">
                                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                                        <div className="text-center md:text-left">
                                            <h2 className="text-2xl font-bold mb-2">Compromisso com o Autor</h2>
                                            <p className="text-gray-400 max-w-md">O seu talento é o nosso legado. Receba acompanhamento personalizado e relatórios detalhados trimestralmente.</p>
                                        </div>
                                        <button
                                            onClick={() => navigate('/contacto')}
                                            className="px-8 py-4 bg-brand-primary text-white font-bold rounded-xl hover:bg-white hover:text-brand-dark transition-all whitespace-nowrap"
                                        >
                                            Solicitar Relatório Detalhado
                                        </button>
                                    </div>
                                    <Zap className="absolute top-1/2 right-10 -translate-y-1/2 w-64 h-64 text-white/5 pointer-events-none" />
                                </div>
                            </div>
                        )}

                        {activeTab === 'author_books' && (
                            <div className="space-y-6">
                                {isLoadingAuthor ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="bg-white rounded-2xl h-48 animate-pulse border border-gray-100" />
                                        ))}
                                    </div>
                                ) : authorBooks.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {authorBooks.map(book => (
                                            <div key={book.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex gap-6 hover:shadow-md transition-shadow">
                                                <div className="w-24 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-50 shadow-sm">
                                                    <OptimizedImage src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex-1 flex flex-col justify-between">
                                                    <div>
                                                        <h3 className="font-bold text-gray-900 line-clamp-2 mb-1">{book.title}</h3>
                                                        <span className="text-[10px] font-bold uppercase py-1 px-2 bg-gray-100 rounded text-gray-500">
                                                            {book.format === 'digital' ? 'Digital' : 'Físico'}
                                                        </span>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-50">
                                                        <div className="flex items-center gap-2">
                                                            <Eye className="w-3 h-3 text-brand-primary" />
                                                            <span className="text-xs font-bold text-gray-700">{book.stats?.views || 0} <span className="text-[10px] text-gray-400 uppercase font-medium">Views</span></span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Download className="w-3 h-3 text-brand-primary" />
                                                            <span className="text-xs font-bold text-gray-700">{book.stats?.downloads || book.stats?.copiesSold || 0} <span className="text-[10px] text-gray-400 uppercase font-medium">Sales</span></span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                                        <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">Nenhuma obra encontrada</h3>
                                        <p className="text-gray-500 mb-6">Comece a sua jornada connosco submetendo o seu primeiro manuscrito.</p>
                                        <button
                                            onClick={() => navigate('/servicos')}
                                            className="px-8 py-3 bg-brand-primary text-white font-bold rounded-xl hover:bg-brand-dark transition-colors shadow-lg"
                                        >
                                            Saiba Como Publicar
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'author_orders' && (
                            <div className="space-y-6">
                                {isLoadingOrders ? (
                                    <div className="space-y-4">
                                        {[1, 2].map(i => (
                                            <div key={i} className="bg-white h-32 rounded-2xl animate-pulse border border-gray-100" />
                                        ))}
                                    </div>
                                ) : authorOrders.length > 0 ? (
                                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left">
                                                <thead className="bg-gray-50 border-b border-gray-100">
                                                    <tr>
                                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Pedido</th>
                                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Cliente</th>
                                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Obras</th>
                                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Estado</th>
                                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Ações</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-50">
                                                    {authorOrders.map(order => (
                                                        <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                                            <td className="px-6 py-4">
                                                                <span className="font-black text-brand-dark block">{order.orderNumber}</span>
                                                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{new Date(order.createdAt).toLocaleDateString()}</span>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <span className="font-bold text-gray-900 block">{order.customerName}</span>
                                                                <span className="text-xs text-gray-500">{order.customerEmail}</span>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <div className="flex -space-x-2">
                                                                    {order.items.filter((i: any) =>
                                                                        i.authorId === user.id ||
                                                                        (i.authorIds && i.authorIds.includes(user.id)) ||
                                                                        (i.author && i.author.toLowerCase().includes(user.name?.toLowerCase() || ''))
                                                                    ).map((item: any, idx: number) => (
                                                                        <div key={idx} className="w-8 h-12 rounded bg-gray-100 border-2 border-white overflow-hidden shadow-sm" title={item.title}>
                                                                            <img src={item.coverUrl} alt="" className="w-full h-full object-cover" />
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${order.status === 'Validado' ? 'bg-emerald-50 text-emerald-600' :
                                                                    order.status === 'Cancelado' ? 'bg-red-50 text-red-600' :
                                                                        'bg-amber-50 text-amber-600'
                                                                    }`}>
                                                                    {order.status}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 text-right">
                                                                {order.status === 'Pendente' && (
                                                                    <div className="flex justify-end gap-2">
                                                                        <button
                                                                            onClick={() => handleUpdateStatus(order.id, 'Validado')}
                                                                            className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                                                                            title="Aprovar Venda"
                                                                        >
                                                                            <Check className="w-4 h-4" />
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handleUpdateStatus(order.id, 'Cancelado')}
                                                                            className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                                                            title="Rejeitar/Cancelar"
                                                                        >
                                                                            <CloseIcon className="w-4 h-4" />
                                                                        </button>
                                                                    </div>
                                                                )}
                                                                {order.status !== 'Pendente' && (
                                                                    <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Concluído</span>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                                        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">Sem pedidos de compra</h3>
                                        <p className="text-gray-500 mb-6">Ainda não recebeu pedidos para as suas obras. Continue a divulgar o seu trabalho!</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'library' && (
                            <div className="space-y-6">
                                {isLoadingLibrary ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                        {[1, 2, 3, 4].map((i) => (
                                            <div key={i} className="bg-white rounded-2xl h-80 animate-pulse border border-gray-100" />
                                        ))}
                                    </div>
                                ) : purchasedBooks.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                        {purchasedBooks.map((book) => (
                                            <div key={book.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-lg transition-all">
                                                <div className="aspect-[2/3] relative overflow-hidden bg-gray-100">
                                                    <OptimizedImage
                                                        src={book.coverUrl}
                                                        alt={book.title}
                                                        className="object-cover w-full h-full"
                                                    />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <button
                                                            onClick={() => handleDownload(book)}
                                                            aria-label={`Ler ou baixar ${book.title}`}
                                                            className="flex items-center gap-2 px-6 py-3 bg-white text-brand-dark rounded-full font-bold transform translate-y-4 group-hover:translate-y-0 transition-all shadow-xl hover:bg-brand-primary hover:text-white"
                                                        >
                                                            <Download className="w-4 h-4" /> Ler / Baixar
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="p-4">
                                                    <h3 className="font-bold text-gray-900 line-clamp-1">{book.title}</h3>
                                                    <p className="text-sm text-gray-500 mb-2">{book.author}</p>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs font-bold uppercase text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">Adquirido</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                                        <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">A sua biblioteca está vazia</h3>
                                        <p className="text-gray-500 mb-6">Explore o nosso catálogo e comece a sua coleção de leitura.</p>
                                        <button
                                            onClick={() => navigate('/livros')}
                                            className="px-8 py-3 bg-brand-primary text-white font-bold rounded-xl hover:bg-brand-dark transition-colors shadow-lg shadow-brand-primary/20"
                                        >
                                            Explorar Livros
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'wishlist' && (
                            <div>
                                {wishlist.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                        {wishlist.map((book) => (
                                            <div key={book.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-lg transition-all">
                                                <div className="aspect-[2/3] relative overflow-hidden bg-gray-100">
                                                    <OptimizedImage
                                                        src={book.coverUrl}
                                                        alt={book.title}
                                                        className="object-cover w-full h-full"
                                                    />
                                                    <button
                                                        title="Remover dos favoritos"
                                                        aria-label="Remover dos favoritos"
                                                        className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full text-red-500 shadow-sm hover:bg-white"
                                                        onClick={() => {
                                                            // Logic to remove from wishlist would go here, updating local storage and state
                                                            const newWishlist = wishlist.filter(b => b.id !== book.id);
                                                            setWishlist(newWishlist);
                                                            localStorage.setItem('wishlist', JSON.stringify(newWishlist));
                                                            showToast('Removido da lista de desejos', 'info');
                                                            // Dispatch custom event to notify App.tsx if needed, or rely on App.tsx finding out later
                                                            window.dispatchEvent(new Event('storage'));
                                                        }}
                                                    >
                                                        <Heart className="w-5 h-5 fill-current" />
                                                    </button>
                                                </div>
                                                <div className="p-4">
                                                    <h3 className="font-bold text-gray-900 line-clamp-1">{book.title}</h3>
                                                    <p className="text-sm text-gray-500 mb-3">{book.author}</p>
                                                    <button
                                                        onClick={() => {
                                                            const slug = (book as any).slug || generateBookSlug(book.title, book.launchDate);
                                                            navigate(`/livro/${slug}`);
                                                        }}
                                                        aria-label={`Comprar ${book.title}`}
                                                        className="w-full py-2 bg-brand-primary/10 text-brand-primary font-bold rounded-lg hover:bg-brand-primary hover:text-white transition-colors flex items-center justify-center gap-2"
                                                    >
                                                        <ShoppingCart className="w-4 h-4" /> Comprar
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                                        <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">Lista de desejos vazia</h3>
                                        <p className="text-gray-500 mb-6">Guarde os livros que mais gosta para comprar mais tarde.</p>
                                        <button
                                            onClick={() => navigate('/livros')}
                                            className="px-8 py-3 bg-brand-primary text-white font-bold rounded-xl hover:bg-brand-dark transition-colors shadow-lg shadow-brand-primary/20"
                                        >
                                            Ver Catálogo
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'settings' && (
                            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm max-w-2xl mx-auto">
                                <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">Informações da Conta</h2>
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">Nome Completo</label>
                                        <div className="p-3 bg-gray-50 rounded-lg text-gray-900 font-medium border border-gray-200">
                                            {user.name}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                                        <div className="p-3 bg-gray-50 rounded-lg text-gray-900 font-medium border border-gray-200">
                                            {user.email}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">Tipo de Membro</label>
                                        <div className="p-3 bg-gray-50 rounded-lg text-gray-900 font-medium border border-gray-200 capitalize">
                                            {user.role}
                                        </div>
                                    </div>

                                    <div className="pt-6">
                                        <button
                                            onClick={handleChangePassword}
                                            className="text-brand-primary font-bold hover:underline text-sm"
                                        >
                                            Alterar Palavra-passe
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </m.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ProfilePage;
