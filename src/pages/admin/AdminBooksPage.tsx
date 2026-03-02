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
                <button
                    onClick={openAddModal}
                    className="bg-brand-primary hover:bg-brand-dark text-white font-medium text-sm px-4 py-2 rounded-lg flex items-center gap-2 transition-colors min-h-[40px]"
                >
                    <Plus className="w-4 h-4" />
                    Nova Obra
                </button>
            </AdminPageHeader>

            <div className="flex flex-wrap gap-2 pt-2 w-full overflow-x-auto">
                {(['all', 'físico', 'digital'] as const).map((format) => (
                    <button
                        key={format}
                        onClick={() => setFilterFormat(format)}
                        className={`px-4 py-2 rounded-md text-xs font-semibold uppercase tracking-wider transition-colors whitespace-nowrap ${filterFormat === format
                            ? 'bg-brand-primary/10 text-brand-primary'
                            : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                            }`}
                    >
                        {format === 'all' ? 'Ver Tudo' : format}
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
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
                                                    <span className="text-xs font-medium text-gray-500">{book.genre}</span>
                                                    <div className="flex items-center gap-1.5 mt-1">
                                                        <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded border ${book.format === 'digital'
                                                            ? 'bg-blue-50 border-blue-200 text-blue-600'
                                                            : 'bg-emerald-50 border-emerald-200 text-emerald-600'
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
                                                <div className="flex flex-col items-end gap-1.5">
                                                    {book.format === 'digital' ? (
                                                        <div className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                                                            Ilimitado
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <div className={`text-sm font-semibold ${Number(book.stock ?? 0) < 10 ? 'text-red-500' : 'text-gray-900'}`}>
                                                                {book.stock ?? 0}
                                                                {Number(book.stock ?? 0) < 5 && <AlertCircle className="w-3 h-3 inline ml-1" />}
                                                            </div>
                                                            <div className="h-1.5 w-16 bg-gray-100 rounded-full overflow-hidden">
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
                                                        className="p-2 text-gray-400 hover:text-brand-primary hover:bg-brand-primary/10 rounded-md transition-colors"
                                                        title="Editar"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteBook(book.id)}
                                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                                                        title="Eliminar"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
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

