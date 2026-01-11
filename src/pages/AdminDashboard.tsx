
import React, { useState, useEffect } from 'react';
import SectionHeader from '../components/SectionHeader';
import { Order, Book } from '../types';
import {
    Plus,
    Trash2,
    Edit2,
    CheckCircle2,
    Clock,
    Database,
    RefreshCw,
    Save,
    X,
    Package,
    DollarSign,
    TrendingUp,
    ChevronRight
} from 'lucide-react';
import {
    getBooks,
    saveBook,
    deleteBook,
    updateOrderStatus
} from '../services/dataService';
import { migrateDataToAppwrite } from '../services/migration';

interface AdminDashboardProps {
    orders: Order[];
    setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ orders, setOrders }) => {
    const [books, setBooks] = useState<Book[]>([]);
    const [isMigrating, setIsMigrating] = useState(false);
    const [editingBook, setEditingBook] = useState<Partial<Book> | null>(null);
    const [isBookModalOpen, setIsBookModalOpen] = useState(false);
    const [isLoadingBooks, setIsLoadingBooks] = useState(true);

    useEffect(() => {
        loadBooks();
    }, []);

    const loadBooks = async () => {
        setIsLoadingBooks(true);
        try {
            const fetchedBooks = await getBooks();
            setBooks(fetchedBooks);
        } catch (error) {
            console.error("Error loading books:", error);
        } finally {
            setIsLoadingBooks(false);
        }
    };

    const handleMigrate = async () => {
        setIsMigrating(true);
        try {
            await migrateDataToAppwrite();
            await loadBooks();
            alert("Dados migrados com sucesso para o Appwrite!");
        } catch (error) {
            console.error("Migration error:", error);
            alert("Erro durante a migração. Verifique os IDs na consola.");
        } finally {
            setIsMigrating(false);
        }
    };

    const handleUpdateStatus = async (orderId: string, status: Order['status']) => {
        try {
            await updateOrderStatus(orderId, status);
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const handleDeleteBook = async (bookId: string) => {
        if (!confirm("Tem certeza que deseja excluir esta obra permanentemente?")) return;
        try {
            await deleteBook(bookId);
            await loadBooks();
        } catch (error) {
            console.error("Error deleting book:", error);
        }
    };

    const handleSaveBook = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingBook?.title || !editingBook?.author) return;

        const bookToSave: Book = {
            id: editingBook.id || Date.now().toString(),
            title: editingBook.title,
            author: editingBook.author,
            price: Number(editingBook.price) || 0,
            category: editingBook.category || "Ficção Literária",
            coverUrl: editingBook.coverUrl || "https://images.unsplash.com/photo-1543004471-240ce473781b?q=80&w=1974&auto=format&fit=crop",
            isNew: editingBook.isNew || false,
            isBestseller: editingBook.isBestseller || false,
            description: editingBook.description || "",
            isbn: editingBook.isbn || ""
        };

        try {
            await saveBook(bookToSave);
            await loadBooks();
            setIsBookModalOpen(false);
            setEditingBook(null);
        } catch (error) {
            console.error("Error saving book:", error);
        }
    };

    const stats = {
        totalSales: orders.filter(o => o.status === 'Validado').reduce((acc, o) => acc + o.total, 0),
        pendingOrders: orders.filter(o => o.status === 'Pendente').length,
        validatedOrders: orders.filter(o => o.status === 'Validado').length,
    };

    return (
        <div className="py-16 md:py-24 max-w-7xl mx-auto px-4 md:px-6 animate-fade-in space-y-20">
            <div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <SectionHeader title="Painel de Gestão" subtitle="Administração Editorial" align="left" />
                    <div className="flex gap-4">
                        <button
                            onClick={handleMigrate}
                            disabled={isMigrating}
                            className="flex items-center gap-2 px-6 py-3 bg-accent-gold text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-brand-900 transition-all disabled:opacity-50"
                            title="Exportar dados estáticos para o banco de dados"
                        >
                            {isMigrating ? <RefreshCw className="animate-spin h-4 w-4" /> : <Database className="h-4 w-4" />}
                            Migrar Dados Estáticos
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 mb-16">
                    <div className="bg-white p-8 md:p-10 rounded-3xl border border-brand-100 shadow-sm">
                        <DollarSign className="text-accent-gold mb-4" size={32} />
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Receita Validada</p>
                        <p className="text-2xl md:text-3xl font-serif font-bold mt-2">{stats.totalSales.toLocaleString()} Kz</p>
                    </div>
                    <div className="bg-white p-8 md:p-10 rounded-3xl border border-brand-100 shadow-sm">
                        <Package className="text-accent-gold mb-4" size={32} />
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pedidos Pendentes</p>
                        <p className="text-2xl md:text-3xl font-serif font-bold mt-2">{stats.pendingOrders}</p>
                    </div>
                    <div className="bg-white p-8 md:p-10 rounded-3xl border border-brand-100 shadow-sm sm:col-span-2 md:col-span-1">
                        <TrendingUp className="text-accent-gold mb-4" size={32} />
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pedidos Validados</p>
                        <p className="text-2xl md:text-3xl font-serif font-bold mt-2">{stats.validatedOrders}</p>
                    </div>
                </div>

                <div className="bg-white rounded-[2.5rem] border border-brand-100 shadow-xl overflow-hidden">
                    <div className="p-8 border-b border-brand-50 bg-brand-50/50 flex justify-between items-center">
                        <h3 className="font-serif font-bold text-xl text-brand-900">Encomendas Recentes</h3>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">{orders.length} Pedidos</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-brand-50 border-b border-brand-100">
                                <tr>
                                    {["ID", "Cliente", "Total", "Data", "Estado", "Ações"].map(h => (
                                        <th key={h} className="px-8 py-5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-brand-50">
                                {orders.map(order => (
                                    <tr key={order.id} className="hover:bg-brand-50/30 transition-colors">
                                        <td className="px-8 py-6 font-mono text-[10px] text-gray-400">#{order.id.slice(-6)}</td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-brand-900 text-sm">{order.customerName}</span>
                                                <span className="text-[10px] text-gray-400">{order.customerEmail}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 font-bold text-brand-900 text-sm">{order.total.toLocaleString()} Kz</td>
                                        <td className="px-8 py-6 text-[10px] text-gray-500">{order.date}</td>
                                        <td className="px-8 py-6">
                                            <span className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${order.status === 'Validado' ? 'bg-green-100 text-green-700' :
                                                order.status === 'Cancelado' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex gap-2">
                                                {order.status === 'Pendente' && (
                                                    <button onClick={() => handleUpdateStatus(order.id, 'Validado')} className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-all shadow-sm" title="Validar Pagamento"><CheckCircle2 size={16} /></button>
                                                )}
                                                <button onClick={() => handleUpdateStatus(order.id, 'Cancelado')} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all shadow-sm" title="Cancelar Pedido"><X size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {orders.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-8 py-16 text-center text-gray-400 italic font-serif text-lg">Nenhuma encomenda registada.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <SectionHeader title="Catálogo de Livros" subtitle="Gestão de Inventário" align="left" />
                    <button
                        onClick={() => { setEditingBook({}); setIsBookModalOpen(true); }}
                        className="flex items-center gap-3 px-8 py-4 bg-brand-900 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-accent-gold transition-all shadow-lg group"
                        title="Adicionar uma nova obra ao catálogo"
                    >
                        <Plus className="h-4 w-4" />
                        Adicionar Novo Livro
                        <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                <div className="bg-white rounded-[2.5rem] border border-brand-100 shadow-xl overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 divide-x divide-y divide-brand-100">
                        {isLoadingBooks ? (
                            <div className="col-span-full py-20 flex flex-col items-center justify-center text-gray-400 gap-4">
                                <RefreshCw className="animate-spin h-8 w-8 text-accent-gold" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Carregando acervo...</span>
                            </div>
                        ) : books.length === 0 ? (
                            <div className="col-span-full py-20 text-center text-gray-400 italic font-serif">Nenhum livro no catálogo. Use o botão migrar para começar.</div>
                        ) : books.map(book => (
                            <div key={book.id} className="p-8 flex gap-6 hover:bg-brand-50/50 transition-all group relative">
                                <div className="w-20 aspect-[2/3] shrink-0 overflow-hidden rounded-lg shadow-lg">
                                    <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                <div className="flex-1 min-w-0 flex flex-col">
                                    <span className="text-[8px] font-bold text-accent-gold uppercase tracking-[0.2em] mb-1">{book.category}</span>
                                    <h4 className="font-serif font-bold text-brand-900 truncate mb-1 text-lg">{book.title}</h4>
                                    <p className="text-[10px] text-gray-400 mb-4">{book.author}</p>
                                    <div className="flex items-center justify-between mt-auto">
                                        <span className="font-bold text-brand-900 text-sm">{book.price.toLocaleString()} Kz</span>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => { setEditingBook(book); setIsBookModalOpen(true); }}
                                                className="p-2.5 bg-brand-50 text-brand-900 rounded-xl hover:bg-brand-900 hover:text-white transition-all shadow-sm"
                                                title="Editar detalhes do livro"
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteBook(book.id)}
                                                className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                                title="Remover livro do catálogo"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {isBookModalOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-brand-900/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white w-full max-w-2xl rounded-[3rem] p-8 md:p-12 shadow-2xl animate-slide-up max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-10">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-brand-50 rounded-2xl text-accent-gold"><Package size={24} /></div>
                                <h3 className="text-2xl font-serif font-bold text-brand-900">{editingBook?.id ? 'Editar Livro' : 'Adicionar Livro'}</h3>
                            </div>
                            <button onClick={() => { setIsBookModalOpen(false); setEditingBook(null); }} className="p-2 hover:bg-brand-50 rounded-full transition-colors" title="Fechar modal"><X /></button>
                        </div>

                        <form onSubmit={handleSaveBook} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1 md:col-span-2">
                                <label className="text-[9px] font-bold text-gray-400 uppercase ml-4">Título da Obra</label>
                                <input required value={editingBook?.title || ''} onChange={e => setEditingBook({ ...editingBook, title: e.target.value })} className="w-full bg-brand-50 p-4 rounded-2xl border border-transparent focus:border-accent-gold focus:bg-white outline-none text-sm transition-all" placeholder="Título completo" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] font-bold text-gray-400 uppercase ml-4">Autor(a)</label>
                                <input required value={editingBook?.author || ''} onChange={e => setEditingBook({ ...editingBook, author: e.target.value })} className="w-full bg-brand-50 p-4 rounded-2xl border border-transparent focus:border-accent-gold focus:bg-white outline-none text-sm transition-all" placeholder="Nome do autor" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] font-bold text-gray-400 uppercase ml-4">Preço (Kwanza)</label>
                                <input required type="number" value={editingBook?.price || ''} onChange={e => setEditingBook({ ...editingBook, price: Number(e.target.value) })} className="w-full bg-brand-50 p-4 rounded-2xl border border-transparent focus:border-accent-gold focus:bg-white outline-none text-sm transition-all" placeholder="4500" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] font-bold text-gray-400 uppercase ml-4" id="category-label">Categoria</label>
                                <select aria-labelledby="category-label" value={editingBook?.category || 'Ficção Literária'} onChange={e => setEditingBook({ ...editingBook, category: e.target.value })} className="w-full bg-brand-50 p-4 rounded-2xl border border-transparent focus:border-accent-gold focus:bg-white outline-none text-sm transition-all">
                                    <option value="Ficção Literária">Ficção Literária</option>
                                    <option value="História e Biografia">História e Biografia</option>
                                    <option value="Cultura e Sociedade">Cultura e Sociedade</option>
                                    <option value="Infantil e Juvenil">Infantil e Juvenil</option>
                                    <option value="Académicos e Ensaios">Académicos e Ensaios</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] font-bold text-gray-400 uppercase ml-4">URL da Capa</label>
                                <input value={editingBook?.coverUrl || ''} onChange={e => setEditingBook({ ...editingBook, coverUrl: e.target.value })} className="w-full bg-brand-50 p-4 rounded-2xl border border-transparent focus:border-accent-gold focus:bg-white outline-none text-sm transition-all" placeholder="https://..." />
                            </div>
                            <div className="md:col-span-2 space-y-1">
                                <label className="text-[9px] font-bold text-gray-400 uppercase ml-4">Resumo da Obra</label>
                                <textarea rows={4} value={editingBook?.description || ''} onChange={e => setEditingBook({ ...editingBook, description: e.target.value })} className="w-full bg-brand-50 p-4 rounded-2xl border border-transparent focus:border-accent-gold focus:bg-white outline-none text-sm transition-all" placeholder="Breve resumo para os leitores..."></textarea>
                            </div>

                            <div className="md:col-span-2 space-y-4 bg-brand-50/50 p-6 rounded-2xl border border-brand-100">
                                <p className="text-[9px] font-bold text-gray-400 uppercase">Tags de Destaque</p>
                                <div className="flex flex-wrap gap-8">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <input type="checkbox" checked={editingBook?.isBestseller || false} onChange={e => setEditingBook({ ...editingBook, isBestseller: e.target.checked })} className="w-5 h-5 rounded-md border-brand-200 text-accent-gold focus:ring-accent-gold" />
                                        <span className="text-[10px] font-bold text-brand-900 uppercase tracking-widest group-hover:text-accent-gold transition-colors">Best Seller</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <input type="checkbox" checked={editingBook?.isNew || false} onChange={e => setEditingBook({ ...editingBook, isNew: e.target.checked })} className="w-5 h-5 rounded-md border-brand-200 text-accent-gold focus:ring-accent-gold" />
                                        <span className="text-[10px] font-bold text-brand-900 uppercase tracking-widest group-hover:text-accent-gold transition-colors">Novidade</span>
                                    </label>
                                </div>
                            </div>

                            <div className="md:col-span-2 flex gap-4 mt-4">
                                <button type="submit" className="flex-1 py-5 bg-brand-900 text-white font-bold uppercase text-[10px] tracking-widest rounded-2xl shadow-xl hover:bg-accent-gold transition-all flex items-center justify-center gap-3" title="Confirmar salvamento">
                                    <Save size={16} /> {editingBook?.id ? 'Salvar Alterações' : 'Adicionar ao Acervo'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
