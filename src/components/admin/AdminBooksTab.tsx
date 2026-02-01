import React, { useState, useEffect, useMemo } from 'react';
import { motion as m, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Search, Filter, BookOpen, Package, DollarSign, ArrowUpRight, ChevronRight, Loader2, Sparkles, AlertCircle, Zap } from 'lucide-react';
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
            {/* 1. Header & Quick Actions */}
            <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-8">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-8 bg-brand-primary rounded-full shadow-[0_0_15px_rgba(189,147,56,0.5)]" />
                        <h2 className="text-3xl font-black text-white tracking-tighter uppercase mb-0">Arquivos Literários</h2>
                    </div>
                    <p className="text-gray-500 font-bold text-xs uppercase tracking-widest pl-4">Gestão de Catálogo e Direitos Digitais</p>
                </div>

                <div className="flex flex-col md:flex-row gap-4 w-full xl:w-auto">
                    <div className="relative group flex-1 md:w-80">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-brand-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="LOCALIZAR OBRA..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/5 focus:border-brand-primary/20 focus:bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white outline-none transition-all shadow-xl"
                        />
                    </div>
                    <m.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={openAddModal}
                        className="bg-brand-primary hover:bg-brand-primary/90 text-white font-black uppercase text-[10px] tracking-[0.3em] px-10 py-4 rounded-2xl flex items-center justify-center gap-3 shadow-[0_10px_40px_-10px_rgba(189,147,56,0.4)] transition-all"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Nova Obra</span>
                    </m.button>
                </div>
            </div>

            {/* 2. Micro Stats Row */}
            <div className="flex bg-white/5 p-2 rounded-2xl border border-white/5 w-fit">
                {(['all', 'físico', 'digital'] as const).map((format) => (
                    <button
                        key={format}
                        onClick={() => setFilterFormat(format)}
                        className={`px-10 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${filterFormat === format
                            ? 'bg-brand-primary text-white shadow-lg'
                            : 'text-gray-500 hover:text-white'
                            }`}
                    >
                        {format === 'all' ? 'Ver Tudo' : format}
                    </button>
                ))}
            </div>

            {/* 3. High-Fidelity Data Table */}
            <div className="bg-white/5 rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl relative">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full min-w-[900px] border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/5">
                                <th className="px-10 py-8 text-left text-[9px] font-black text-gray-500 uppercase tracking-[0.3em]">Capa & Título</th>
                                <th className="px-10 py-8 text-left text-[9px] font-black text-gray-500 uppercase tracking-[0.3em]">Formato & Género</th>
                                <th className="px-10 py-8 text-right text-[9px] font-black text-gray-500 uppercase tracking-[0.3em]">Valor</th>
                                <th className="px-10 py-8 text-right text-[9px] font-black text-gray-500 uppercase tracking-[0.3em]">Stock Atual</th>
                                <th className="px-10 py-8 text-center text-[9px] font-black text-gray-500 uppercase tracking-[0.3em]">Operações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            <AnimatePresence mode="popLayout">
                                {isLoadingBooks ? (
                                    [1, 2, 3, 4, 5].map(i => (
                                        <tr key={i} className="animate-pulse">
                                            <td className="px-10 py-8"><div className="h-20 bg-white/5 rounded-2xl w-full" /></td>
                                            <td colSpan={4} className="px-10 py-8"><div className="h-4 bg-white/5 rounded-full w-full" /></td>
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
                                            className="hover:bg-white/[0.03] transition-colors group"
                                        >
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-6">
                                                    <div className="w-16 h-20 bg-brand-dark/40 rounded-xl overflow-hidden border border-white/5 shadow-2xl group-hover:scale-105 transition-transform duration-500 shrink-0">
                                                        {book.coverUrl ? (
                                                            <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-gray-800">
                                                                <BookOpen className="w-8 h-8" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="space-y-1">
                                                        <div className="font-black text-white text-[15px] tracking-tight hover:text-brand-primary transition-colors cursor-pointer">{book.title}</div>
                                                        <div className="text-[9px] text-brand-primary font-black uppercase tracking-widest">{book.author}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="flex flex-col gap-2">
                                                    <span className="text-[10px] font-black uppercase text-gray-400">{book.genre}</span>
                                                    <div className="flex items-center gap-2">
                                                        <span className={`text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border ${book.format === 'digital'
                                                            ? 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                                                            : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                                            }`}>
                                                            {book.format === 'digital' ? 'E-Book' : 'Físico'}
                                                        </span>
                                                        {book.format === 'digital' && <Zap className="w-3 h-3 text-brand-primary" />}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8 text-right">
                                                <div className="text-white font-black text-lg tracking-tighter">
                                                    {Number(book.price).toLocaleString()}
                                                    <span className="text-[10px] text-gray-600 ml-1.5 uppercase tracking-widest">Kz</span>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8 text-right">
                                                <div className="flex flex-col items-end gap-1.5">
                                                    <div className={`text-md font-black ${Number(book.stock ?? 0) < 10 ? 'text-red-500' : 'text-white'}`}>
                                                        {book.stock ?? 0}
                                                        {Number(book.stock ?? 0) < 5 && <AlertCircle className="w-3 h-3 inline ml-2 animate-bounce" />}
                                                    </div>
                                                    <div className="h-1 w-20 bg-white/5 rounded-full overflow-hidden">
                                                        <m.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${Math.min(((book.stock ?? 0) / 50) * 100, 100)}%` }}
                                                            className={`h-full ${Number(book.stock ?? 0) < 10 ? 'bg-red-500' : 'bg-brand-primary'}`}
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="flex items-center justify-center gap-3">
                                                    <button
                                                        onClick={() => openEditModal(book)}
                                                        className="w-12 h-12 bg-white/5 hover:bg-brand-primary/10 text-gray-500 hover:text-brand-primary rounded-xl transition-all flex items-center justify-center border border-white/5 group/btn"
                                                        title="Editar Obra"
                                                        aria-label="Editar Obra"
                                                    >
                                                        <Edit className="w-4 h-4 transition-transform group-hover/btn:scale-110" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteBook(book.id)}
                                                        className="w-12 h-12 bg-white/5 hover:bg-red-500/10 text-gray-500 hover:text-red-500 rounded-xl transition-all flex items-center justify-center border border-white/5 group/btn"
                                                        title="Eliminar Obra"
                                                        aria-label="Eliminar Obra"
                                                    >
                                                        <Trash2 className="w-4 h-4 transition-transform group-hover/btn:scale-110" />
                                                    </button>
                                                </div>
                                            </td>
                                        </m.tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="py-40 text-center">
                                            <div className="flex flex-col items-center gap-6 opacity-20">
                                                <BookOpen className="w-16 h-16 text-brand-primary" />
                                                <p className="font-black text-[11px] uppercase tracking-[0.4em]">Acervo não Identificado</p>
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

