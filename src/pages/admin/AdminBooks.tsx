import React, { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    Filter,
    MoreHorizontal,
    ChevronRight,
    BookOpen,
    Download,
    Eye,
    Loader2,
    ShoppingBag
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getBooks, saveBook, deleteBook } from '../../services/dataService';
import { Book } from '../../types';
import { useToast } from '../../components/Toast';

const AdminBooks: React.FC = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterFormat, setFilterFormat] = useState<'all' | 'físico' | 'digital'>('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBook, setEditingBook] = useState<Book | null>(null);
    const { showToast } = useToast();

    // Form State
    const [formData, setFormData] = useState<Partial<Book>>({
        title: '',
        author: '',
        price: 0,
        coverUrl: '',
        genre: '',
        format: 'físico',
        description: '',
        stock: 0,
        featured: false
    });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        loadBooks();
    }, []);

    const loadBooks = async () => {
        setLoading(true);
        try {
            const data = await getBooks(true);
            setBooks(data);
        } catch (error) {
            showToast('Erro ao carregar catálogo', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (book?: Book) => {
        if (book) {
            setEditingBook(book);
            setFormData(book);
        } else {
            setEditingBook(null);
            setFormData({
                title: '',
                author: '',
                price: 0,
                coverUrl: '',
                genre: '',
                format: 'físico',
                description: '',
                stock: 0,
                featured: false
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const bookToSave = {
                ...formData,
                id: editingBook?.id || `temp_${Date.now()}`,
                price: Number(formData.price),
                stock: Number(formData.stock),
            } as Book;

            await saveBook(bookToSave);
            showToast(editingBook ? 'Livro atualizado!' : 'Livro adicionado!', 'success');
            setIsModalOpen(false);
            loadBooks();
        } catch (error) {
            showToast('Erro ao gravar livro', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string, title: string) => {
        if (window.confirm(`Tem a certeza que deseja eliminar "${title}"?`)) {
            try {
                await deleteBook(id);
                setBooks(prev => prev.filter(b => b.id !== id));
                showToast('Livro eliminado com sucesso', 'success');
            } catch (error) {
                showToast('Erro ao eliminar livro', 'error');
            }
        }
    };

    const filteredBooks = books.filter(book => {
        const title = book.title?.toLowerCase() || '';
        const author = book.author?.toLowerCase() || '';
        const matchesSearch =
            title.includes(searchTerm.toLowerCase()) ||
            author.includes(searchTerm.toLowerCase());
        const matchesFormat = filterFormat === 'all' || book.format === filterFormat;
        return matchesSearch && matchesFormat;
    });

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <span className="text-brand-primary font-bold uppercase tracking-[0.4em] text-[10px]">Gestão de Acervo</span>
                    <h2 className="text-4xl sm:text-5xl font-black text-brand-dark uppercase tracking-tighter leading-none mt-2">
                        Livros
                    </h2>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 px-6 py-4 bg-brand-dark text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-brand-primary transition-all shadow-xl shadow-brand-dark/20 group"
                >
                    <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                    Adicionar Obra
                </button>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="fixed inset-0 bg-brand-dark/40 backdrop-blur-sm z-[100]"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="fixed inset-x-4 top-4 bottom-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-4xl bg-white rounded-[2.5rem] shadow-2xl z-[101] overflow-hidden flex flex-col"
                        >
                            <div className="p-8 border-b border-gray-50 flex items-center justify-between shrink-0">
                                <h3 className="text-2xl font-black text-brand-dark uppercase tracking-tighter">
                                    {editingBook ? 'Editar Obra' : 'Nova Obra'}
                                </h3>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all"
                                    title="Fechar"
                                >
                                    <Plus className="w-5 h-5 rotate-45" />
                                </button>
                            </div>

                            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-8 space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Esquerda: Informação Básica */}
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Título da Obra</label>
                                            <input
                                                required
                                                type="text"
                                                value={formData.title}
                                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all"
                                                placeholder="Ex: O Alquimista"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Autor</label>
                                            <input
                                                required
                                                type="text"
                                                value={formData.author}
                                                onChange={e => setFormData({ ...formData, author: e.target.value })}
                                                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all"
                                                placeholder="Nome do autor"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Preço (€)</label>
                                                <input
                                                    id="bookPrice"
                                                    required
                                                    type="number"
                                                    step="0.01"
                                                    value={formData.price}
                                                    onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all"
                                                    placeholder="0.00"
                                                    title="Preço"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Formato</label>
                                                <select
                                                    id="bookFormat"
                                                    value={formData.format}
                                                    onChange={e => setFormData({ ...formData, format: e.target.value as any })}
                                                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all appearance-none cursor-pointer"
                                                    title="Formato"
                                                >
                                                    <option value="físico">📖 Físico</option>
                                                    <option value="digital">📱 Digital</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Direita: Imagem e Extras */}
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">URL da Capa</label>
                                            <input
                                                required
                                                type="url"
                                                value={formData.coverUrl}
                                                onChange={e => setFormData({ ...formData, coverUrl: e.target.value })}
                                                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all"
                                                placeholder="https://..."
                                            />
                                        </div>
                                        <div className="flex gap-6 items-start">
                                            <div className="w-24 h-32 bg-gray-50 rounded-xl overflow-hidden border-2 border-dashed border-gray-200 flex items-center justify-center shrink-0">
                                                {formData.coverUrl ? (
                                                    <img src={formData.coverUrl} alt="Preview" className="w-full h-full object-cover" />
                                                ) : (
                                                    <ImageIcon className="w-6 h-6 text-gray-300" />
                                                )}
                                            </div>
                                            <div className="flex-1 space-y-4 pt-2">
                                                <div className="flex items-center gap-3">
                                                    <input
                                                        type="checkbox"
                                                        id="featured-check"
                                                        checked={formData.featured}
                                                        onChange={e => setFormData({ ...formData, featured: e.target.checked })}
                                                        className="w-5 h-5 rounded-lg border-gray-200 text-brand-primary focus:ring-brand-primary/20"
                                                    />
                                                    <label htmlFor="featured-check" className="text-xs font-bold text-brand-dark uppercase tracking-widest cursor-pointer">Destacar na Home</label>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Stock Disponível</label>
                                                    <input
                                                        id="bookStock"
                                                        type="number"
                                                        value={formData.stock}
                                                        onChange={e => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                                                        className="w-full px-4 py-2 bg-gray-50 border-none rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all"
                                                        placeholder="0"
                                                        title="Stock"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Sinopse da Obra</label>
                                    <textarea
                                        rows={4}
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all resize-none"
                                        placeholder="Breve descrição da obra..."
                                    />
                                </div>
                            </form>

                            <div className="p-8 border-t border-gray-50 bg-gray-50/30 flex items-center justify-end gap-4 shrink-0">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-8 py-4 bg-white text-gray-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:text-brand-dark transition-all border border-gray-100"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="px-10 py-4 bg-brand-dark text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-primary transition-all shadow-xl shadow-brand-dark/10 flex items-center gap-3 disabled:opacity-50"
                                >
                                    {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                                    {editingBook ? 'Guardar Alterações' : 'Publicar Obra'}
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Pesquisar por título ou autor..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-brand-primary/20 transition-all outline-none"
                    />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <select
                        value={filterFormat}
                        onChange={(e) => setFilterFormat(e.target.value as any)}
                        className="flex-1 md:flex-none px-4 py-3 bg-gray-50 border-none rounded-2xl text-xs font-bold uppercase tracking-widest outline-none cursor-pointer hover:bg-gray-100 transition-colors"
                        title="Filtrar por formato"
                    >
                        <option value="all">Todos os Formatos</option>
                        <option value="físico">📖 Físico</option>
                        <option value="digital">📱 Digital</option>
                    </select>
                    <button className="p-3 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-colors" title="Mais filtros">
                        <Filter className="w-4 h-4 text-brand-dark" />
                    </button>
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="h-64 flex flex-col items-center justify-center gap-4 text-gray-400">
                    <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
                    <span className="text-xs font-bold uppercase tracking-widest">A carregar catálogo...</span>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    <AnimatePresence mode="popLayout">
                        {filteredBooks.map((book, index) => (
                            <motion.div
                                key={book.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: index * 0.05 }}
                                className="group bg-white p-4 sm:p-6 rounded-[2rem] border border-gray-50 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500 flex flex-col sm:flex-row items-center gap-6"
                            >
                                {/* Book Cover Preview */}
                                <div className="w-20 h-28 bg-gray-100 rounded-xl overflow-hidden shadow-md shrink-0 group-hover:scale-105 transition-transform duration-500">
                                    <img src={book.coverUrl} alt="" className="w-full h-full object-cover" />
                                </div>

                                {/* Details */}
                                <div className="flex-1 text-center sm:text-left min-w-0">
                                    <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-2">
                                        <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${book.format === 'digital' ? 'bg-cyan-50 text-cyan-600' : 'bg-amber-50 text-amber-600'
                                            }`}>
                                            {book.format === 'digital' ? '📱 Digital' : '📖 Físico'}
                                        </span>
                                        {book.featured && (
                                            <span className="px-3 py-1 bg-yellow-50 text-yellow-600 rounded-full text-[8px] font-black uppercase tracking-widest">
                                                ⭐ Destaque
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-lg font-black text-brand-dark truncate group-hover:text-brand-primary transition-colors">
                                        {book.title}
                                    </h3>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                        {book.author}
                                    </p>
                                </div>

                                {/* Stats Icons */}
                                <div className="hidden lg:flex items-center gap-8 px-8 border-x border-gray-50">
                                    <div className="flex flex-col items-center gap-1">
                                        <Eye className="w-4 h-4 text-gray-300" />
                                        <span className="text-[10px] font-black">{book.stats?.views || 0}</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-1">
                                        {book.format === 'digital' ? <Download className="w-4 h-4 text-gray-300" /> : <ShoppingBag className="w-4 h-4 text-gray-300" />}
                                        <span className="text-[10px] font-black">
                                            {book.format === 'digital' ? book.stats?.downloads || 0 : book.stats?.copiesSold || 0}
                                        </span>
                                    </div>
                                </div>

                                {/* Price & Actions */}
                                <div className="flex items-center gap-4 shrink-0">
                                    <div className="text-right mr-4 hidden sm:block">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Preço</p>
                                        <p className="text-lg font-black text-brand-dark">€{book.price.toFixed(2)}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleOpenModal(book)}
                                            className="p-3 bg-gray-50 hover:bg-brand-dark hover:text-white rounded-2xl transition-all"
                                            title="Editar"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(book.id, book.title)}
                                            className="p-3 bg-gray-50 hover:bg-red-500 hover:text-white rounded-2xl transition-all text-red-500"
                                            title="Eliminar"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {!loading && filteredBooks.length === 0 && (
                        <div className="py-20 text-center">
                            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Nenhum livro encontrado</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminBooks;
