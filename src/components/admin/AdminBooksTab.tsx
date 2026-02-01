import React, { useState, useEffect, useMemo } from 'react';
import { motion as m, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Search, Filter, BookOpen, Package, DollarSign, ArrowUpRight, ChevronRight, Loader2 } from 'lucide-react';
import { Book } from '../../types';
import { useToast } from '../Toast';
import BookFormModal from './BookFormModal';
import { saveBook, getBooks, deleteBook } from '../../services/dataService';
import { uploadFile } from '../../services/storageService';

interface AdminBooksTabProps {
    onStatsRefresh: () => void;
}

const AdminBooksTab: React.FC<AdminBooksTabProps> = ({ onStatsRefresh }) => {
    const { showToast } = useToast();
    const [books, setBooks] = useState<Book[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterFormat, setFilterFormat] = useState<'all' | 'físico' | 'digital'>('all');
    const [isLoadingBooks, setIsLoadingBooks] = useState(true);
    const [isBookModalOpen, setIsBookModalOpen] = useState(false);
    const [editingBook, setEditingBook] = useState<Book | null>(null);
    const [isSavingBook, setIsSavingBook] = useState(false);

    const fetchBooks = async () => {
        setIsLoadingBooks(true);
        try {
            const data = await getBooks();
            setBooks(data);
        } catch (error) {
            console.error('Erro ao buscar livros:', error);
        } finally {
            setIsLoadingBooks(false);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    const filteredBooks = useMemo(() => {
        const query = searchQuery.toLowerCase();
        return books.filter(book => {
            const matchesQuery = book.title.toLowerCase().includes(query) ||
                book.author.toLowerCase().includes(query) ||
                book.genre.toLowerCase().includes(query);
            const matchesFormat = filterFormat === 'all' || book.format === filterFormat;
            return matchesQuery && matchesFormat;
        });
    }, [searchQuery, books, filterFormat]);

    const stats = useMemo(() => {
        const total = books.length;
        const lowStock = books.filter(b => (b.stock ?? 0) < 5 && b.format === 'físico').length;
        const digital = books.filter(b => b.format === 'digital').length;
        const totalValue = books.reduce((acc, b) => acc + (b.price * (b.stock ?? 0)), 0);
        return { total, lowStock, digital, totalValue };
    }, [books]);

    const openAddModal = () => {
        setEditingBook(null);
        setIsBookModalOpen(true);
    };

    const openEditModal = (book: Book) => {
        setEditingBook(book);
        setIsBookModalOpen(true);
    };

    const handleSaveBook = async (bookData: any, coverFile: File | null, digitalFile: File | null) => {
        setIsSavingBook(true);
        try {
            let finalCoverUrl = bookData.coverUrl;
            let finalDigitalUrl = bookData.digitalFileUrl;

            if (coverFile) {
                const { fileUrl } = await uploadFile(coverFile);
                finalCoverUrl = fileUrl;
            }

            if (digitalFile) {
                const { fileUrl } = await uploadFile(digitalFile);
                finalDigitalUrl = fileUrl;
            }

            const dataToSave = {
                ...bookData,
                price: Number(bookData.price) || 0,
                stock: Number(bookData.stock) || 0,
                coverUrl: finalCoverUrl,
                digitalFileUrl: finalDigitalUrl,
            };

            await saveBook(dataToSave);
            setIsBookModalOpen(false);
            setEditingBook(null);
            fetchBooks();
            onStatsRefresh();
            showToast('Obra salva com sucesso no acervo!', 'success');
        } catch (error) {
            console.error('Erro ao salvar livro:', error);
            showToast('Erro ao salvar a obra. Verifique os dados.', 'error');
        } finally {
            setIsSavingBook(false);
        }
    };

    const handleDeleteBook = async (id: string) => {
        if (!confirm('Tem a certeza que deseja eliminar esta obra do acervo?')) return;
        try {
            await deleteBook(id);
            fetchBooks();
            onStatsRefresh();
            showToast('Obra eliminada do acervo.', 'success');
        } catch (error) {
            console.error('Erro ao eliminar livro:', error);
            showToast('Erro ao eliminar a obra.', 'error');
        }
    };

    return (
        <div className="space-y-12">
            {/* Header Section */}
            <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-8">
                <div>
                    <h2 className="text-4xl font-black text-brand-dark tracking-tighter uppercase mb-2">Acervo <span className="text-brand-primary lowercase italic font-light">Literário</span></h2>
                    <p className="text-gray-400 font-bold text-sm">Controlo total de catálogo, stock e distribuição digital.</p>
                </div>

                <div className="flex flex-col md:flex-row gap-4 w-full xl:w-auto">
                    <div className="relative group flex-1 md:w-80">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-brand-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="Procurar título, autor ou gênero..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-6 py-4 bg-gray-50/50 border-2 border-transparent focus:border-brand-primary/10 focus:bg-white rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest outline-none transition-all shadow-sm"
                        />
                    </div>
                    <m.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={openAddModal}
                        className="btn-premium px-10 py-5 justify-center shadow-2xl shadow-brand-primary/20"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Nova Obra</span>
                    </m.button>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total de Obras', value: stats.total, icon: BookOpen, color: 'brand-primary' },
                    { label: 'Stock Crítico', value: stats.lowStock, icon: Package, color: 'orange-500' },
                    { label: 'Distribuição Digital', value: stats.digital, icon: ArrowUpRight, color: 'blue-500' },
                    { label: 'Valor Estimado', value: `${(stats.totalValue / 1000).toFixed(1)}k Kz`, icon: DollarSign, color: 'emerald-500' },
                ].map((stat, idx) => (
                    <m.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white p-8 rounded-[2.5rem] border border-gray-50 shadow-xl shadow-brand-dark/5 flex items-center justify-between group hover:border-brand-primary/20 transition-all pointer-events-none"
                    >
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{stat.label}</p>
                            <h4 className="text-3xl font-black text-brand-dark tracking-tighter">{stat.value}</h4>
                        </div>
                        <div className={`w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-${stat.color} group-hover:scale-110 transition-transform`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                    </m.div>
                ))}
            </div>

            {/* Table Controls */}
            <div className="flex bg-gray-50/50 p-2 rounded-[1.8rem] backdrop-blur-sm w-fit">
                {(['all', 'físico', 'digital'] as const).map((format) => (
                    <button
                        key={format}
                        onClick={() => setFilterFormat(format)}
                        className={`px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${filterFormat === format ? 'bg-white text-brand-primary shadow-xl scale-105' : 'text-gray-400 hover:text-brand-dark'}`}
                    >
                        {format === 'all' ? 'Ver Tudo' : format}
                    </button>
                ))}
            </div>

            {/* Content Display */}
            <div className="bg-white rounded-[3.5rem] shadow-2xl shadow-brand-dark/5 border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1000px]">
                        <thead>
                            <tr className="bg-gray-50/30">
                                <th className="px-10 py-8 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.25em]">Identidade Editorial</th>
                                <th className="px-10 py-8 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.25em]">Categoria</th>
                                <th className="px-10 py-8 text-right text-[10px] font-black text-gray-400 uppercase tracking-[0.25em]">Valor Unitário</th>
                                <th className="px-10 py-8 text-right text-[10px] font-black text-gray-400 uppercase tracking-[0.25em]">Stock</th>
                                <th className="px-10 py-8 text-center text-[10px] font-black text-gray-400 uppercase tracking-[0.25em]">Gestão</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            <AnimatePresence mode="popLayout">
                                {isLoadingBooks ? (
                                    [1, 2, 3, 4, 5].map(i => (
                                        <tr key={i} className="animate-pulse">
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-6">
                                                    <div className="w-16 h-20 bg-gray-50 rounded-2xl" />
                                                    <div className="space-y-3">
                                                        <div className="h-4 bg-gray-50 rounded-full w-48" />
                                                        <div className="h-3 bg-gray-50 rounded-full w-32" />
                                                    </div>
                                                </div>
                                            </td>
                                            <td colSpan={4}><div className="h-4 bg-gray-50 rounded-full mx-10" /></td>
                                        </tr>
                                    ))
                                ) : filteredBooks.length > 0 ? (
                                    filteredBooks.map((book) => (
                                        <m.tr
                                            key={book.id}
                                            layout
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="hover:bg-gray-50/20 transition-all group"
                                        >
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-6">
                                                    <div className="w-16 h-20 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 shadow-xl group-hover:scale-110 transition-transform duration-500 relative">
                                                        {book.coverUrl ? (
                                                            <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-gray-200">
                                                                <BookOpen className="w-8 h-8" />
                                                            </div>
                                                        )}
                                                        {book.format === 'digital' && (
                                                            <div className="absolute top-1 right-1 bg-brand-primary p-1 rounded-md shadow-lg">
                                                                <ArrowUpRight className="w-2.5 h-2.5 text-white" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="font-black text-brand-dark text-[15px] tracking-tight hover:text-brand-primary transition-colors mb-1">{book.title}</div>
                                                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{book.author}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="flex flex-col gap-2">
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-dark/60">{book.genre}</span>
                                                    <span className={`text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border w-fit ${book.format === 'digital' ? 'text-blue-500 border-blue-100 bg-blue-50' : 'text-emerald-500 border-emerald-100 bg-emerald-50'}`}>
                                                        {book.format || 'físico'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8 text-right font-black text-brand-primary">
                                                <span className="text-sm">{Number(book.price).toLocaleString()}</span>
                                                <span className="text-[10px] ml-1.5 opacity-60">Kz</span>
                                            </td>
                                            <td className="px-10 py-8 text-right">
                                                <div className="flex flex-col items-end gap-1">
                                                    <div className={`text-sm font-black ${Number(book.stock ?? 0) < 10 ? 'text-red-500' : 'text-brand-dark'}`}>
                                                        {book.stock ?? 0}
                                                    </div>
                                                    <div className="h-1.5 w-16 bg-gray-100 rounded-full overflow-hidden">
                                                        <m.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${Math.min(((book.stock ?? 0) / 50) * 100, 100)}%` }}
                                                            className={`h-full rounded-full ${Number(book.stock ?? 0) < 10 ? 'bg-red-500' : 'bg-brand-primary'}`}
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="flex items-center justify-center gap-4">
                                                    <m.button
                                                        whileHover={{ scale: 1.1, rotate: -3 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => openEditModal(book)}
                                                        className="w-12 h-12 bg-white shadow-lg border border-gray-100 text-gray-400 hover:text-brand-primary rounded-2xl transition-all flex items-center justify-center"
                                                        title="Editar Obra"
                                                    >
                                                        <Edit className="w-5 h-5" />
                                                    </m.button>
                                                    <m.button
                                                        whileHover={{ scale: 1.1, rotate: 3 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => handleDeleteBook(book.id)}
                                                        className="w-12 h-12 bg-white shadow-lg border border-gray-100 text-gray-400 hover:text-red-500 rounded-2xl transition-all flex items-center justify-center"
                                                        title="Eliminar Obra"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </m.button>
                                                </div>
                                            </td>
                                        </m.tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-10 py-40 text-center">
                                            <div className="flex flex-col items-center gap-6 opacity-20 grayscale scale-110">
                                                <BookOpen className="w-20 h-20 text-brand-primary" />
                                                <div className="space-y-2">
                                                    <p className="font-black uppercase tracking-[0.4em] text-[11px] text-brand-dark">Acervo Deserto</p>
                                                    <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Nenhum resultado para os filtros atuais.</p>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </div>

            <BookFormModal
                isOpen={isBookModalOpen}
                onClose={() => setIsBookModalOpen(false)}
                book={editingBook}
                onSave={handleSaveBook}
            />
        </div>
    );
};

export default AdminBooksTab;
