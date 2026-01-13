import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Book } from '../../types';
import BookFormModal from './BookFormModal';

interface AdminBooksTabProps {
    onStatsRefresh: () => void;
}

const AdminBooksTab: React.FC<AdminBooksTabProps> = ({ onStatsRefresh }) => {
    const [books, setBooks] = useState<Book[]>([]);
    const [isLoadingBooks, setIsLoadingBooks] = useState(true);
    const [isBookModalOpen, setIsBookModalOpen] = useState(false);
    const [editingBook, setEditingBook] = useState<Book | null>(null);
    const [isSavingBook, setIsSavingBook] = useState(false);

    const fetchBooks = async () => {
        setIsLoadingBooks(true);
        try {
            const { getBooks } = await import('../../services/dataService');
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
            const { saveBook } = await import('../../services/dataService');
            const { uploadFile } = await import('../../services/storageService');

            // Handle file uploads if present
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

            // Clean up empty optional fields
            const dataToSave = {
                ...bookData,
                id: editingBook?.id || '',
                price: parseInt(bookData.price),
                stock: parseInt(bookData.stock),
                coverUrl: finalCoverUrl,
                digitalFileUrl: finalDigitalUrl,
                launchDate: bookData.launchDate || undefined
            };

            await saveBook(dataToSave);

            alert('Livro guardado com sucesso!');
            setIsBookModalOpen(false);
            setEditingBook(null);
            fetchBooks();
            onStatsRefresh();
        } catch (error) {
            console.error('Erro ao salvar livro:', error);
            alert('Erro ao salvar livro. Verifique os dados e tente novamente.');
        } finally {
            setIsSavingBook(false);
        }
    };

    const handleDeleteBook = async (id: string) => {
        if (!confirm('Tem a certeza que deseja eliminar este livro?')) return;
        try {
            const { deleteBook } = await import('../../services/dataService');
            await deleteBook(id);
            alert('Livro eliminado com sucesso.');
            fetchBooks();
            onStatsRefresh();
        } catch (error) {
            console.error('Erro ao eliminar livro:', error);
            alert('Erro ao eliminar livro.');
        }
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                <h2 className="text-2xl md:text-3xl font-black text-brand-dark">Gestão de Livros</h2>
                <button
                    onClick={openAddModal}
                    title="Registar novo livro"
                    aria-label="Registar novo livro"
                    className="btn-premium w-full sm:w-auto justify-center"
                >
                    <Plus className="w-5 h-5" />
                    Adicionar Livro
                </button>
            </div>
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden overflow-x-auto">
                <table className="w-full min-w-[800px]">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-brand-dark uppercase tracking-wider">Título</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-brand-dark uppercase tracking-wider">Autor</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-brand-dark uppercase tracking-wider">Categoria</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-brand-dark uppercase tracking-wider">Formato</th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-brand-dark uppercase tracking-wider">Preço</th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-brand-dark uppercase tracking-wider">Stock</th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-brand-dark uppercase tracking-wider">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {isLoadingBooks ? (
                            <tr>
                                <td colSpan={7} className="px-6 py-12 text-center text-gray-500 italic">Carregando livros...</td>
                            </tr>
                        ) : books.length > 0 ? (
                            books.map((book) => (
                                <tr key={book.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-bold text-brand-dark">{book.title}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{book.author}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{book.category}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${book.format === 'digital' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                                            {book.format || 'físico'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-bold text-brand-primary text-right">{book.price.toLocaleString()} Kz</td>
                                    <td className="px-6 py-4 text-sm text-gray-600 text-right">{book.stock}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => openEditModal(book)}
                                                title="Editar livro"
                                                aria-label="Editar livro"
                                                className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all flex items-center justify-center"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteBook(book.id)}
                                                title="Eliminar livro"
                                                aria-label="Eliminar livro"
                                                className="w-8 h-8 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all flex items-center justify-center"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="px-6 py-12 text-center text-gray-500 italic">Nenhum livro cadastrado.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
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
