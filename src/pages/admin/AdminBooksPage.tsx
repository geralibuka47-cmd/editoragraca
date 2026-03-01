import React, { useState, useEffect, useMemo } from 'react';
import { motion as m, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Search, BookOpen, AlertCircle, Zap } from 'lucide-react';
import { Book } from '../../types';
import { useToast } from '../../components/Toast';
import BookFormModal from '../../components/admin/BookFormModal';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { Input } from '../../components/ui/Input';
import { saveBook, getBooks, deleteBook } from '../../services/dataService';
import { uploadFile } from '../../services/storageService';

interface AdminBooksPageProps {
    onStatsRefresh: () => void;
}

const AdminBooksPage: React.FC<AdminBooksPageProps> = ({ onStatsRefresh }) => {
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
        <div className="space-y-6">
            <AdminPageHeader
                title="Acervo"
                subtitle="Gestão de catálogo e direitos digitais"
                highlight="Literário"
            >
                <Input
                    placeholder="Pesquisar obra..."
                    variant="light"
                    className="w-full sm:w-64"
                    value={searchQuery}
                    onChange={(e: any) => setSearchQuery(e.target.value)}
                />
                <m.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={openAddModal}
                    className="bg-brand-primary hover:bg-brand-primary/90 text-white font-bold text-sm px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-md transition-all min-h-[44px]"
                >
                    <Plus className="w-4 h-4" />
                    Nova Obra
                </m.button>
            </AdminPageHeader>

            <div className="flex flex-wrap gap-2 p-2 bg-gray-100 rounded-xl w-full overflow-x-auto">
                {(['all', 'físico', 'digital'] as const).map((format) => (
                    <button
                        key={format}
                        onClick={() => setFilterFormat(format)}
                        className={`px-6 sm:px-10 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${filterFormat === format
                            ? 'bg-brand-primary text-white shadow-lg'
                            : 'text-gray-500 hover:text-slate-900'
                            }`}
                    >
                        {format === 'all' ? 'Ver Tudo' : format}
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[640px] border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Capa & Título</th>
                                <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Formato & Género</th>
                                <th className="px-4 sm:px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Valor</th>
                                <th className="px-4 sm:px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Stock</th>
                                <th className="px-4 sm:px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            <AnimatePresence mode="popLayout">
                                {isLoadingBooks ? (
                                    [1, 2, 3, 4, 5].map(i => (
                                        <tr key={i} className="animate-pulse">
                                            <td className="px-4 sm:px-6 py-4"><div className="h-16 bg-gray-100 rounded-xl w-full" /></td>
                                            <td colSpan={4} className="px-4 sm:px-6 py-4"><div className="h-4 bg-gray-100 rounded w-3/4" /></td>
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
                                            className="hover:bg-gray-50 transition-colors group"
                                        >
                                            <td className="px-4 sm:px-6 py-4">
                                                <div className="flex items-center gap-3 sm:gap-4">
                                                    <div className="w-12 h-16 sm:w-16 sm:h-20 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shrink-0">
                                                        {book.coverUrl ? (
                                                            <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-gray-800">
                                                                <BookOpen className="w-8 h-8" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="space-y-1">
                                                        <div className="font-black text-slate-900 text-[15px] tracking-tight hover:text-brand-primary transition-colors cursor-pointer">{book.title}</div>
                                                        <div className="text-[9px] text-brand-primary font-black uppercase tracking-widest">{book.author}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 sm:px-6 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-xs font-semibold text-gray-500">{book.genre}</span>
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
                                            <td className="px-4 sm:px-6 py-4 text-right">
                                                <div className="text-slate-900 font-bold text-base">
                                                    {Number(book.price).toLocaleString()}
                                                    <span className="text-[10px] text-gray-600 ml-1.5 uppercase tracking-widest">Kz</span>
                                                </div>
                                            </td>
                                            <td className="px-4 sm:px-6 py-4 text-right">
                                                <div className="flex flex-col items-end gap-1.5 min-w-[80px]">
                                                    {book.format === 'digital' ? (
                                                        <div className="text-[10px] font-black uppercase tracking-widest text-blue-400 bg-blue-500/10 px-3 py-1 rounded-lg border border-blue-500/20">
                                                            Ilimitado
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <div className={`text-md font-black ${Number(book.stock ?? 0) < 10 ? 'text-red-500' : 'text-slate-900'}`}>
                                                                {book.stock ?? 0}
                                                                {Number(book.stock ?? 0) < 5 && <AlertCircle className="w-3 h-3 inline ml-2 animate-bounce" />}
                                                            </div>
                                                            <div className="h-1 w-20 bg-gray-200 rounded-full overflow-hidden">
                                                                <m.div
                                                                    initial={{ width: 0 }}
                                                                    animate={{ width: `${Math.min(((book.stock ?? 0) / 50) * 100, 100)}%` }}
                                                                    className={`h-full ${Number(book.stock ?? 0) < 10 ? 'bg-red-500' : 'bg-brand-primary'}`}
                                                                />
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 sm:px-6 py-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => openEditModal(book)}
                                                        className="w-10 h-10 sm:w-11 sm:h-11 bg-gray-50 hover:bg-brand-primary/10 text-gray-500 hover:text-brand-primary rounded-lg transition-all flex items-center justify-center border border-gray-200 min-touch"
                                                        title="Editar Obra"
                                                        aria-label="Editar Obra"
                                                    >
                                                        <Edit className="w-4 h-4 transition-transform group-hover/btn:scale-110" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteBook(book.id)}
                                                        className="w-10 h-10 sm:w-11 sm:h-11 bg-gray-50 hover:bg-red-50 text-gray-500 hover:text-red-500 rounded-lg transition-all flex items-center justify-center border border-gray-200 min-touch"
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
                                        <td colSpan={5} className="py-16 text-center">
                                            <div className="flex flex-col items-center gap-4 text-gray-400">
                                                <BookOpen className="w-12 h-12" />
                                                <p className="text-sm font-semibold">Nenhuma obra encontrada</p>
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

export default AdminBooksPage;

