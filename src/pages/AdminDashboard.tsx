import React, { useState } from 'react';
import { BookOpen, Users, ShoppingCart, Plus, Edit, Trash2, User as UserIcon, CheckCircle, FileText, XCircle, Download } from 'lucide-react';
import { ViewState, User } from '../types';

interface AdminDashboardProps {
    user: User | null;
    onNavigate: (view: ViewState) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onNavigate }) => {
    const [activeTab, setActiveTab] = useState<'books' | 'users' | 'orders' | 'manuscripts'>('books');
    const [manuscripts, setManuscripts] = useState<import('../types').Manuscript[]>([]);
    const [isLoadingManuscripts, setIsLoadingManuscripts] = useState(false);
    const [selectedManuscript, setSelectedManuscript] = useState<import('../types').Manuscript | null>(null);
    const [feedback, setFeedback] = useState('');

    const fetchManuscripts = async () => {
        setIsLoadingManuscripts(true);
        try {
            const { getAllManuscripts } = await import('../services/dataService');
            const data = await getAllManuscripts();
            setManuscripts(data);
        } catch (error) {
            console.error('Erro ao buscar manuscritos:', error);
        } finally {
            setIsLoadingManuscripts(false);
        }
    };

    React.useEffect(() => {
        if (activeTab === 'manuscripts') {
            fetchManuscripts();
        }
    }, [activeTab]);

    const handleReviewManuscript = async (status: 'approved' | 'rejected') => {
        if (!selectedManuscript) return;
        try {
            const { updateManuscriptStatus } = await import('../services/dataService');
            await updateManuscriptStatus(selectedManuscript.id, status, feedback);
            alert(`Manuscrito ${status === 'approved' ? 'aprovado' : 'rejeitado'} com sucesso.`);
            setSelectedManuscript(null);
            setFeedback('');
            fetchManuscripts();
        } catch (error) {
            console.error('Erro ao atualizar status:', error);
            alert('Erro ao atualizar o status do manuscrito.');
        }
    };

    // Mock data
    const stats = {
        totalBooks: 156,
        totalUsers: 1243,
        pendingOrders: 23,
        revenue: 4567800
    };

    const books = [
        { id: '1', title: 'A Gloriosa Família', author: 'Pepetela', price: 8500, stock: 45, category: 'Romance' },
        { id: '2', title: 'Mayombe', author: 'Pepetela', price: 7500, stock: 32, category: 'Ficção' },
        { id: '3', title: 'O Desejo de Kianda', author: 'Pepetela', price: 6500, stock: 28, category: 'Ficção' }
    ];

    const users = [
        { id: '1', name: 'João Silva', email: 'joao@example.com', role: 'reader', joined: '2025-11-15' },
        { id: '2', name: 'Maria Costa', email: 'maria@example.com', role: 'author', joined: '2025-10-20' },
        { id: '3', name: 'Carlos Mendes', email: 'carlos@example.com', role: 'reader', joined: '2025-12-05' }
    ];

    const orders = [
        { id: '1', customer: 'Ana Ferreira', items: 2, total: 17000, status: 'pending', date: '2026-01-10' },
        { id: '2', customer: 'Pedro Santos', items: 1, total: 8500, status: 'completed', date: '2026-01-09' },
        { id: '3', customer: 'Sofia Almeida', items: 3, total: 22500, status: 'shipped', date: '2026-01-08' }
    ];

    if (!user || user.role !== 'adm') {
        return (
            <div className="min-h-screen bg-brand-light flex items-center justify-center p-8">
                <div className="bg-white rounded-3xl shadow-xl p-12 text-center max-w-md">
                    <UserIcon className="w-16 h-16 text-gray-300 mx-auto mb-6" />
                    <h2 className="text-3xl font-black text-brand-dark mb-4">Acesso Restrito</h2>
                    <p className="text-gray-600 mb-8">Esta área é exclusiva para administradores.</p>
                    <button
                        onClick={() => onNavigate('HOME')}
                        className="btn-premium w-full justify-center"
                    >
                        Voltar ao Início
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brand-light">
            {/* Header */}
            <section className="bg-brand-dark text-white py-16">
                <div className="container mx-auto px-8">
                    <div className="mb-8">
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-2">
                            Painel <span className="text-brand-primary">Administrativo</span>
                        </h1>
                        <p className="text-gray-300">Gerencie livros, utilizadores e pedidos</p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-white/10 rounded-2xl p-6">
                            <BookOpen className="w-8 h-8 text-brand-primary mb-2" />
                            <p className="text-3xl font-black mb-1">{stats.totalBooks}</p>
                            <p className="text-sm text-gray-300">Livros</p>
                        </div>
                        <div className="bg-white/10 rounded-2xl p-6">
                            <Users className="w-8 h-8 text-brand-primary mb-2" />
                            <p className="text-3xl font-black mb-1">{stats.totalUsers}</p>
                            <p className="text-sm text-gray-300">Utilizadores</p>
                        </div>
                        <div className="bg-white/10 rounded-2xl p-6">
                            <ShoppingCart className="w-8 h-8 text-brand-primary mb-2" />
                            <p className="text-3xl font-black mb-1">{stats.pendingOrders}</p>
                            <p className="text-sm text-gray-300">Pedidos Pendentes</p>
                        </div>
                        <div className="bg-white/10 rounded-2xl p-6">
                            <p className="text-3xl font-black mb-1">{(stats.revenue / 1000000).toFixed(1)}M</p>
                            <p className="text-sm text-gray-300">Receita (Kz)</p>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => setActiveTab('books')}
                            className={`px-6 py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-all ${activeTab === 'books'
                                ? 'bg-brand-primary text-white'
                                : 'bg-white/10 text-white hover:bg-white/20'
                                }`}
                        >
                            <BookOpen className="w-4 h-4 inline mr-2" />
                            Livros
                        </button>
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`px-6 py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-all ${activeTab === 'users'
                                ? 'bg-brand-primary text-white'
                                : 'bg-white/10 text-white hover:bg-white/20'
                                }`}
                        >
                            <Users className="w-4 h-4 inline mr-2" />
                            Utilizadores
                        </button>
                        <button
                            onClick={() => setActiveTab('orders')}
                            className={`px-6 py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-all ${activeTab === 'orders'
                                ? 'bg-brand-primary text-white'
                                : 'bg-white/10 text-white hover:bg-white/20'
                                }`}
                        >
                            <ShoppingCart className="w-4 h-4 inline mr-2" />
                            Pedidos
                        </button>
                        <button
                            onClick={() => setActiveTab('manuscripts')}
                            className={`px-6 py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-all ${activeTab === 'manuscripts'
                                ? 'bg-brand-primary text-white'
                                : 'bg-white/10 text-white hover:bg-white/20'
                                }`}
                        >
                            <FileText className="w-4 h-4 inline mr-2" />
                            Manuscritos
                        </button>
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="py-12">
                <div className="container mx-auto px-8">
                    {/* Books Tab */}
                    {activeTab === 'books' && (
                        <div>
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-3xl font-black text-brand-dark">Gestão de Livros</h2>
                                <button className="btn-premium">
                                    <Plus className="w-5 h-5" />
                                    Adicionar Livro
                                </button>
                            </div>
                            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-brand-dark uppercase tracking-wider">Título</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-brand-dark uppercase tracking-wider">Autor</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-brand-dark uppercase tracking-wider">Categoria</th>
                                            <th className="px-6 py-4 text-right text-xs font-bold text-brand-dark uppercase tracking-wider">Preço</th>
                                            <th className="px-6 py-4 text-right text-xs font-bold text-brand-dark uppercase tracking-wider">Stock</th>
                                            <th className="px-6 py-4 text-right text-xs font-bold text-brand-dark uppercase tracking-wider">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {books.map((book) => (
                                            <tr key={book.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 font-bold text-brand-dark">{book.title}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{book.author}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{book.category}</td>
                                                <td className="px-6 py-4 text-sm font-bold text-brand-primary text-right">{book.price.toLocaleString()} Kz</td>
                                                <td className="px-6 py-4 text-sm text-gray-600 text-right">{book.stock}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button title="Editar livro" aria-label="Editar livro" className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all flex items-center justify-center">
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                        <button title="Eliminar livro" aria-label="Eliminar livro" className="w-8 h-8 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all flex items-center justify-center">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Users Tab */}
                    {activeTab === 'users' && (
                        <div>
                            <h2 className="text-3xl font-black text-brand-dark mb-8">Gestão de Utilizadores</h2>
                            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-brand-dark uppercase tracking-wider">Nome</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-brand-dark uppercase tracking-wider">Email</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-brand-dark uppercase tracking-wider">Tipo</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-brand-dark uppercase tracking-wider">Data de Registo</th>
                                            <th className="px-6 py-4 text-right text-xs font-bold text-brand-dark uppercase tracking-wider">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {users.map((u) => (
                                            <tr key={u.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 font-bold text-brand-dark">{u.name}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{u.email}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${u.role === 'admin' ? 'bg-purple-100 text-purple-600' :
                                                        u.role === 'author' ? 'bg-blue-100 text-blue-600' :
                                                            'bg-gray-100 text-gray-600'
                                                        }`}>
                                                        {u.role === 'admin' ? 'Admin' : u.role === 'author' ? 'Autor' : 'Leitor'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{new Date(u.joined).toLocaleDateString('pt-AO')}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <button title="Editar utilizador" aria-label="Editar utilizador" className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all flex items-center justify-center ml-auto">
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Orders Tab */}
                    {activeTab === 'orders' && (
                        <AdminOrdersTab user={user} />
                    )}

                    {/* Manuscripts Tab */}
                    {activeTab === 'manuscripts' && (
                        <div>
                            <h2 className="text-3xl font-black text-brand-dark mb-8">Revisão de Manuscritos</h2>
                            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-brand-dark uppercase tracking-wider">Título</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-brand-dark uppercase tracking-wider">Autor</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-brand-dark uppercase tracking-wider">Género</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-brand-dark uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-brand-dark uppercase tracking-wider">Data</th>
                                            <th className="px-6 py-4 text-right text-xs font-bold text-brand-dark uppercase tracking-wider">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {isLoadingManuscripts ? (
                                            <tr>
                                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500 italic">Carregando manuscritos...</td>
                                            </tr>
                                        ) : manuscripts.length > 0 ? (
                                            manuscripts.map((m) => (
                                                <tr key={m.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 font-bold text-brand-dark">{m.title}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">{m.authorName}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-600 uppercase text-[10px]">{m.genre}</td>
                                                    <td className="px-6 py-4 text-sm">
                                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${m.status === 'approved' ? 'bg-green-100 text-green-600' :
                                                            m.status === 'rejected' ? 'bg-red-100 text-red-600' :
                                                                'bg-yellow-100 text-yellow-600'
                                                            }`}>
                                                            {m.status === 'approved' ? 'Aprovado' : m.status === 'rejected' ? 'Rejeitado' : 'Pendente'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-500">
                                                        {new Date(m.submittedDate).toLocaleDateString('pt-AO')}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button
                                                            onClick={() => setSelectedManuscript(m)}
                                                            className="px-4 py-2 bg-brand-primary text-white text-xs font-bold rounded-lg hover:brightness-110 transition-all uppercase tracking-wider"
                                                        >
                                                            Analisar
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500 italic">Nenhum manuscrito submetido.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Review Modal */}
            {selectedManuscript && (
                <div className="fixed inset-0 bg-brand-dark/90 backdrop-blur-sm z-50 flex items-center justify-center p-8">
                    <div className="bg-white rounded-[40px] w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
                        <div className="p-8 md:p-12">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <span className="text-brand-primary font-black uppercase tracking-widest text-xs mb-2 block italic">Análise de Obra</span>
                                    <h3 className="text-4xl font-black text-brand-dark tracking-tighter leading-none">
                                        {selectedManuscript.title}
                                    </h3>
                                    <p className="text-gray-500 mt-2 font-medium">Por {selectedManuscript.authorName}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedManuscript(null)}
                                    title="Fechar análise"
                                    aria-label="Fechar análise"
                                    className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors"
                                >
                                    <XCircle className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>

                            <div className="space-y-8">
                                <div className="bg-gray-50 rounded-2xl p-6">
                                    <h4 className="text-sm font-black text-brand-dark uppercase tracking-wider mb-3">Sinopse</h4>
                                    <p className="text-gray-600 leading-relaxed text-sm italic">"{selectedManuscript.synopsis}"</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="border border-gray-100 rounded-2xl p-4">
                                        <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Género</p>
                                        <p className="text-brand-dark font-bold uppercase text-xs">{selectedManuscript.genre}</p>
                                    </div>
                                    <div className="border border-gray-100 rounded-2xl p-4">
                                        <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Páginas</p>
                                        <p className="text-brand-dark font-bold text-xs">{selectedManuscript.pages || 'N/A'}</p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-black text-brand-dark uppercase tracking-wider mb-3">Feedback ao Autor</label>
                                    <textarea
                                        value={feedback}
                                        onChange={(e) => setFeedback(e.target.value)}
                                        placeholder="Escreva a sua análise ou motivo da rejeição..."
                                        className="w-full bg-gray-50 border-none rounded-2xl p-6 text-sm text-gray-600 focus:ring-2 focus:ring-brand-primary h-32 resize-none"
                                    />
                                </div>

                                <div className="flex gap-4">
                                    <a
                                        href={selectedManuscript.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 py-4 border-2 border-brand-dark rounded-full font-black text-xs uppercase tracking-widest text-brand-dark text-center hover:bg-brand-dark hover:text-white transition-all flex items-center justify-center gap-2"
                                    >
                                        <Download className="w-4 h-4" />
                                        Ler Obra
                                    </a>
                                    <button
                                        onClick={() => handleReviewManuscript('rejected')}
                                        className="flex-1 py-4 bg-red-50 text-red-600 rounded-full font-black text-xs uppercase tracking-widest hover:bg-red-100 transition-all"
                                    >
                                        Rejeitar
                                    </button>
                                    <button
                                        onClick={() => handleReviewManuscript('approved')}
                                        className="flex-1 py-4 bg-brand-primary text-white rounded-full font-black text-xs uppercase tracking-widest shadow-lg shadow-brand-primary/20 hover:brightness-110 transition-all"
                                    >
                                        Aprovar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const AdminOrdersTab: React.FC<{ user: User }> = ({ user }) => {
    const [notifications, setNotifications] = useState<import('../types').PaymentNotification[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            const { getAllPaymentNotifications } = await import('../services/dataService');
            const data = await getAllPaymentNotifications();
            setNotifications(data);
        } catch (error) {
            console.error('Erro ao buscar notificações:', error);
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        fetchNotifications();
    }, []);

    const handleConfirm = async (notif: import('../types').PaymentNotification) => {
        if (!confirm(`Confirmar pagamento de ${notif.readerName} no valor de ${notif.totalAmount} Kz?`)) return;

        try {
            const { updatePaymentNotificationStatus, confirmPaymentProof, getPaymentProofByNotification } = await import('../services/dataService');
            const { sendPaymentConfirmationToReader } = await import('../services/emailService');

            await updatePaymentNotificationStatus(notif.id, 'confirmed');

            const proof = await getPaymentProofByNotification(notif.id);
            if (proof) {
                await confirmPaymentProof(proof.id, user.id, 'Pagamento confirmado via painel administrativo.');
            }

            // Notify reader
            const titles = notif.items.map(item => item.bookTitle);
            await sendPaymentConfirmationToReader(notif.readerEmail, notif.readerName, titles);

            alert('Pagamento confirmado e leitor notificado!');
            fetchNotifications();
        } catch (error) {
            console.error('Erro ao confirmar:', error);
            alert('Erro ao confirmar pagamento.');
        }
    };

    if (isLoading) return <div className="text-center py-12">Carregando pagamentos...</div>;

    return (
        <div>
            <h2 className="text-3xl font-black text-brand-dark mb-8">Gestão de Pagamentos</h2>
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-brand-dark uppercase tracking-wider">ID / Data</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-brand-dark uppercase tracking-wider">Leitor</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-brand-dark uppercase tracking-wider">Itens / Autores</th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-brand-dark uppercase tracking-wider">Total</th>
                            <th className="px-6 py-4 text-center text-xs font-bold text-brand-dark uppercase tracking-wider">Acções</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {notifications.map((n) => (
                            <tr key={n.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="text-sm font-mono font-bold text-brand-dark">#{n.orderId}</div>
                                    <div className="text-xs text-gray-500">{new Date(n.createdAt).toLocaleDateString()}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="font-bold text-brand-dark">{n.readerName}</div>
                                    <div className="text-xs text-gray-500">{n.readerEmail}</div>
                                </td>
                                <td className="px-6 py-4">
                                    {n.items.map((item, i) => (
                                        <div key={i} className="text-xs mb-1">
                                            <span className="font-bold">{item.bookTitle}</span> ({item.authorName})
                                        </div>
                                    ))}
                                </td>
                                <td className="px-6 py-4 text-right font-black text-brand-primary">
                                    {n.totalAmount.toLocaleString()} Kz
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        {n.status === 'proof_uploaded' && (
                                            <button
                                                onClick={async () => {
                                                    const { getPaymentProofByNotification } = await import('../services/dataService');
                                                    const proof = await getPaymentProofByNotification(n.id);
                                                    if (proof) window.open(proof.fileUrl, '_blank');
                                                }}
                                                className="px-3 py-1 bg-blue-100 text-blue-600 rounded text-[10px] font-bold uppercase hover:bg-blue-200"
                                            >
                                                Ver Talão
                                            </button>
                                        )}
                                        {n.status !== 'confirmed' ? (
                                            <button
                                                onClick={() => handleConfirm(n)}
                                                className="px-3 py-1 bg-green-600 text-white rounded text-[10px] font-bold uppercase hover:bg-brand-dark"
                                            >
                                                Confirmar
                                            </button>
                                        ) : (
                                            <span className="flex items-center gap-1 text-green-600 text-[10px] font-bold uppercase">
                                                <CheckCircle className="w-3 h-3" /> Pago
                                            </span>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {notifications.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500 italic">
                                    Nenhum registo de pagamento encontrado.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDashboard;
