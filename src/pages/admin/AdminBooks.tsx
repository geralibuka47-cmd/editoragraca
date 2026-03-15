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
    ShoppingBag,
    Image,
    CreditCard
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getBooks, saveBook, deleteBook, getAuthors } from '../../services/dataService';
import { Book, User } from '../../types';
import { useToast } from '../../components/Toast';

const AdminBooks: React.FC = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [authors, setAuthors] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [formatFilter, setFormatFilter] = useState<string>('todos');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBook, setEditingBook] = useState<Book | null>(null);
    const { showToast } = useToast();

    // Form State
    const [formData, setFormData] = useState<Partial<Book>>({
        title: '',
        author: '',
        authorId: '',
        price: 0,
        coverUrl: '',
        format: 'físico',
        description: '',
        stock: 0,
        featured: false,
        digitalFileUrl: '',
        iban: '',
        genre: '',
        accountHolder: '',
        accountNumber: '',
        express: '',
        launchDate: ''
    });

    const [currentStep, setCurrentStep] = useState(1);
    const [isNewAuthor, setIsNewAuthor] = useState(false);
    const [newAuthorData, setNewAuthorData] = useState({ name: '', email: '', bio: '', whatsappNumber: '+244 ' });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [booksData, authorsData] = await Promise.all([
                getBooks(true),
                getAuthors()
            ]);
            setBooks(booksData);
            setAuthors(authorsData);
        } catch (error) {
            showToast('Erro ao carregar dados', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (book?: Book) => {
        if (book) {
            setEditingBook(book);
            setFormData(book);
            setIsNewAuthor(false);
        } else {
            setEditingBook(null);
            setFormData({
                title: '',
                author: '',
                authorId: '',
                price: 0,
                coverUrl: '',
                format: 'físico',
                description: '',
                stock: 0,
                featured: false,
                digitalFileUrl: '',
                genre: '',
                iban: '',
                accountHolder: '',
                accountNumber: '',
                express: '',
                launchDate: ''
            });
            setIsNewAuthor(false);
            setNewAuthorData({ name: '', email: '', bio: '', whatsappNumber: '+244 ' });
        }
        setCurrentStep(1);
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        if (e) e.preventDefault();

        // If clicking next in step 1 or 2
        if (currentStep < 3) {
            handleNext();
            return;
        }

        setIsSaving(true);
        try {
            let bookToSave = {
                ...formData,
                id: editingBook?.id || `temp_${Date.now()}`, // Keep ID for existing books, generate temp for new
                price: Number(formData.price),
                stock: Number(formData.stock),
            } as Book;
            const authorData = isNewAuthor ? { ...newAuthorData } : undefined;

            await saveBook(bookToSave, authorData);
            showToast(editingBook ? 'Obra atualizada!' : 'Obra publicada!', 'success');
            setIsModalOpen(false);
            loadData();
        } catch (error) {
            showToast('Erro ao gravar obra', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleNext = () => {
        if (currentStep < 3) setCurrentStep(prev => prev + 1);
    };

    const handleBack = () => {
        if (currentStep > 1) setCurrentStep(prev => prev - 1);
    };

    const handleDelete = async (id: string, title: string) => {
        if (window.confirm(`Tem a certeza que deseja eliminar "${title}"?`)) {
            try {
                await deleteBook(id);
                setBooks(prev => prev.filter(b => b.id !== id));
                showToast('Obra eliminada com sucesso', 'success');
            } catch (error) {
                showToast('Erro ao eliminar obra', 'error');
            }
        }
    };

    const filteredBooks = books.filter(book => {
        const matchesSearch = (book.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (book.author?.toLowerCase() || '').includes(searchTerm.toLowerCase());
        const matchesFormat = formatFilter === 'todos' || book.format === formatFilter;
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
                            {/* Modal Header with Progress */}
                            <div className="p-8 border-b border-gray-50 shrink-0">
                                <div className="flex items-center justify-between mb-6">
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

                                {/* Progress Indicator */}
                                <div className="flex items-center gap-4">
                                    {[1, 2, 3].map((step) => (
                                        <div key={step} className="flex-1 flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-black transition-all ${currentStep >= step ? 'bg-brand-dark text-white' : 'bg-gray-100 text-gray-400'
                                                }`}>
                                                {step}
                                            </div>
                                            <div className={`h-1 flex-1 rounded-full transition-all ${currentStep > step ? 'bg-brand-dark' : 'bg-gray-100'
                                                }`} />
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-between mt-2 px-2 text-[8px] font-black uppercase tracking-widest text-gray-400">
                                    <span>Geral</span>
                                    <span>Autor</span>
                                    <span>Detalhes</span>
                                </div>
                            </div>

                            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-8">
                                <AnimatePresence mode="wait">
                                    {currentStep === 1 && (
                                        <motion.div
                                            key="step1"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="space-y-8"
                                        >
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div className="space-y-6">
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Título</label>
                                                        <input
                                                            required
                                                            type="text"
                                                            value={formData.title}
                                                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                                                            className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all"
                                                            placeholder="Título da obra"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Gênero</label>
                                                        <input
                                                            required
                                                            type="text"
                                                            value={formData.genre}
                                                            onChange={e => setFormData({ ...formData, genre: e.target.value })}
                                                            className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all"
                                                            placeholder="Ex: Romance, Poesia, Acadêmico..."
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Preço (Kz)</label>
                                                            <input
                                                                required
                                                                type="number"
                                                                value={formData.price}
                                                                onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                                                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all"
                                                                placeholder="0"
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Formato</label>
                                                            <select
                                                                title="Formato da Obra"
                                                                value={formData.format}
                                                                onChange={e => setFormData({ ...formData, format: e.target.value as any })}
                                                                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all appearance-none cursor-pointer"
                                                            >
                                                                <option value="físico">📖 Físico</option>
                                                                <option value="digital">📱 Digital</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Data de Lançamento</label>
                                                        <input
                                                            required
                                                            type="date"
                                                            value={formData.launchDate ? formData.launchDate.split('T')[0] : ''}
                                                            onChange={e => setFormData({ ...formData, launchDate: e.target.value })}
                                                            className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all"
                                                        />
                                                    </div>
                                                </div>
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
                                                    <div className="flex items-center gap-6">
                                                        <div className="w-20 h-28 bg-gray-50 rounded-xl overflow-hidden border-2 border-dashed border-gray-200 flex items-center justify-center shrink-0">
                                                            {formData.coverUrl ? (
                                                                <img src={formData.coverUrl} alt="Preview" className="w-full h-full object-cover" />
                                                            ) : (
                                                                <Image className="w-6 h-6 text-gray-300" />
                                                            )}
                                                        </div>
                                                        <div className="flex-1 space-y-4">
                                                            <div className="flex items-center gap-3">
                                                                <input
                                                                    type="checkbox"
                                                                    id="featured-check"
                                                                    checked={formData.featured}
                                                                    onChange={e => setFormData({ ...formData, featured: e.target.checked })}
                                                                    className="w-5 h-5 rounded-lg border-gray-200 text-brand-primary"
                                                                />
                                                                <label htmlFor="featured-check" className="text-xs font-bold text-brand-dark uppercase tracking-widest cursor-pointer">Destacar</label>
                                                            </div>
                                                            <div className="space-y-1">
                                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Stock</label>
                                                                <input
                                                                    type="number"
                                                                    value={formData.stock}
                                                                    onChange={e => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                                                                    className="w-full px-4 py-2 bg-gray-50 border-none rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all"
                                                                    placeholder="0"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Sinopse</label>
                                                <textarea
                                                    rows={4}
                                                    value={formData.description}
                                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all resize-none"
                                                    placeholder="Breve descrição da obra..."
                                                />
                                            </div>
                                        </motion.div>
                                    )}

                                    {currentStep === 2 && (
                                        <motion.div
                                            key="step2"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="space-y-8"
                                        >
                                            <div className="flex items-center justify-between p-2 bg-gray-50 rounded-[2rem]">
                                                <button
                                                    type="button"
                                                    onClick={() => setIsNewAuthor(false)}
                                                    className={`flex-1 py-4 rounded-[1.8rem] text-[10px] font-black uppercase tracking-widest transition-all ${!isNewAuthor ? 'bg-white shadow-xl text-brand-dark' : 'text-gray-400 hover:text-gray-600'}`}
                                                >
                                                    Selecionar Existente
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setIsNewAuthor(true)}
                                                    className={`flex-1 py-4 rounded-[1.8rem] text-[10px] font-black uppercase tracking-widest transition-all ${isNewAuthor ? 'bg-white shadow-xl text-brand-dark' : 'text-gray-400 hover:text-gray-600'}`}
                                                >
                                                    Registrar Novo
                                                </button>
                                            </div>

                                            {!isNewAuthor ? (
                                                <div className="space-y-4">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Autor do Acervo</label>
                                                    <select
                                                        value={formData.authorId}
                                                        onChange={e => {
                                                            const author = authors.find(a => a.id === e.target.value);
                                                            setFormData({ ...formData, authorId: e.target.value, author: author?.name || '' });
                                                        }}
                                                        className="w-full px-8 py-6 bg-gray-50 border-none rounded-[2rem] text-lg font-black outline-none focus:ring-4 focus:ring-brand-primary/10 transition-all appearance-none cursor-pointer"
                                                        title="Selecionar Autor"
                                                    >
                                                        <option value="">-- Selecione um autor --</option>
                                                        {authors.map(author => (
                                                            <option key={author.id} value={author.id}>{author.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                    <div className="space-y-6">
                                                        <div className="space-y-2">
                                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Nome do Autor</label>
                                                            <input
                                                                type="text"
                                                                value={newAuthorData.name}
                                                                onChange={e => setNewAuthorData({ ...newAuthorData, name: e.target.value })}
                                                                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all"
                                                                placeholder="Nome completo"
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Telemóvel (WhatsApp)</label>
                                                            <input
                                                                type="tel"
                                                                value={newAuthorData.whatsappNumber}
                                                                onChange={e => setNewAuthorData({ ...newAuthorData, whatsappNumber: e.target.value })}
                                                                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all"
                                                                placeholder="+244 9..."
                                                            />
                                                            <p className="text-[8px] font-bold text-brand-primary uppercase tracking-widest ml-4">
                                                                * Usado para login e notificações.
                                                            </p>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Email (Opcional)</label>
                                                            <input
                                                                type="email"
                                                                value={newAuthorData.email}
                                                                onChange={e => setNewAuthorData({ ...newAuthorData, email: e.target.value })}
                                                                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all"
                                                                placeholder="email@exemplo.com"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Biografia</label>
                                                        <textarea
                                                            rows={6}
                                                            value={newAuthorData.bio}
                                                            onChange={e => setNewAuthorData({ ...newAuthorData, bio: e.target.value })}
                                                            className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-medium resize-none"
                                                            placeholder="Breve biografia do autor..."
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </motion.div>
                                    )}

                                    {currentStep === 3 && (
                                        <motion.div
                                            key="step3"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="space-y-8"
                                        >
                                            <div className="p-8 bg-brand-primary/5 rounded-[2.5rem] border-2 border-brand-primary/10">
                                                <div className="flex items-center gap-4 mb-8">
                                                    <div className="p-3 bg-brand-primary text-white rounded-2xl">
                                                        {formData.format === 'digital' ? <Download className="w-6 h-6" /> : <CreditCard className="w-6 h-6" />}
                                                    </div>
                                                    <div>
                                                        <h4 className="text-xl font-black text-brand-dark uppercase tracking-tighter">Especificações do Formato</h4>
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-brand-primary">Configurações para livro {formData.format}</p>
                                                    </div>
                                                </div>

                                                {formData.format === 'digital' ? (
                                                    <div className="space-y-4">
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Link Permanente de Download</label>
                                                        <input
                                                            required
                                                            type="url"
                                                            value={formData.digitalFileUrl}
                                                            onChange={e => setFormData({ ...formData, digitalFileUrl: e.target.value })}
                                                            className="w-full px-8 py-6 bg-white border-2 border-brand-primary/5 rounded-[2rem] text-sm font-bold outline-none focus:ring-4 focus:ring-brand-primary/10 transition-all"
                                                            placeholder="URL do PDF ou ePub (Google Drive, Dropbox, etc.)"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        <div className="space-y-2">
                                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Titular da Conta</label>
                                                            <input
                                                                id="accountHolder"
                                                                type="text"
                                                                value={formData.accountHolder}
                                                                onChange={e => setFormData({ ...formData, accountHolder: e.target.value })}
                                                                className="w-full px-6 py-4 bg-white border-none rounded-2xl text-sm font-bold"
                                                                placeholder="Nome completo"
                                                                title="Titular da Conta"
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">IBAN</label>
                                                            <input
                                                                id="accountIban"
                                                                type="text"
                                                                value={formData.iban}
                                                                onChange={e => setFormData({ ...formData, iban: e.target.value })}
                                                                className="w-full px-6 py-4 bg-white border-none rounded-2xl text-sm font-bold"
                                                                placeholder="AO06..."
                                                                title="IBAN"
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Número de Conta</label>
                                                            <input
                                                                id="accountNumber"
                                                                type="text"
                                                                value={formData.accountNumber}
                                                                onChange={e => setFormData({ ...formData, accountNumber: e.target.value })}
                                                                className="w-full px-6 py-4 bg-white border-none rounded-2xl text-sm font-bold"
                                                                placeholder="Opcional"
                                                                title="Número da Conta"
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Express</label>
                                                            <input
                                                                id="accountExpress"
                                                                type="text"
                                                                value={formData.express}
                                                                onChange={e => setFormData({ ...formData, express: e.target.value })}
                                                                className="w-full px-6 py-4 bg-white border-none rounded-2xl text-sm font-bold"
                                                                placeholder="Opcional"
                                                                title="Express"
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                                <div className="p-8 border-t border-gray-50 bg-gray-50/30 flex items-center justify-between shrink-0">
                                    <button
                                        type="button"
                                        onClick={currentStep === 1 ? () => setIsModalOpen(false) : handleBack}
                                        className="px-8 py-4 bg-white text-gray-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:text-brand-dark transition-all border border-gray-100"
                                    >
                                        {currentStep === 1 ? 'Cancelar' : 'Anterior'}
                                    </button>

                                    <div className="flex gap-4">
                                        {currentStep < 3 ? (
                                            <button
                                                type="submit"
                                                className="px-10 py-4 bg-brand-dark text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-primary transition-all shadow-xl shadow-brand-dark/10"
                                            >
                                                Próximo Passo
                                            </button>
                                        ) : (
                                            <button
                                                type="submit"
                                                disabled={isSaving}
                                                className="px-10 py-4 bg-brand-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-dark transition-all shadow-xl shadow-brand-primary/20 flex items-center gap-3 disabled:opacity-50"
                                            >
                                                {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                                                {editingBook ? 'Guardar Alterações' : 'Publicar Obra'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </form>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
                    <div className="relative w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Pesquisar por título ou autor..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-brand-primary/20 transition-all outline-none"
                        />
                    </div>
                </div>
                <div className="flex bg-white p-2 rounded-3xl border border-gray-100 shadow-sm">
                    {['todos', 'físico', 'digital'].map((type) => (
                        <button
                            key={type}
                            onClick={() => setFormatFilter(type)}
                            className={`px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${formatFilter === type ? 'bg-brand-dark text-white' : 'text-gray-400 hover:bg-gray-50'}`}
                        >
                            {type === 'todos' ? 'Todos os Formatos' : type}
                        </button>
                    ))}
                </div>
            </div>

            {/* List */}
            {loading ? (
                <div className="h-64 flex flex-col items-center justify-center gap-4 text-gray-400">
                    <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
                    <span className="text-xs font-bold uppercase tracking-widest">A carregar acervo...</span>
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
                                className="group bg-white p-5 rounded-[2rem] border border-gray-50 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500 flex items-center gap-6"
                            >
                                {/* Cover Preview */}
                                <div className="w-20 h-28 rounded-2xl bg-gray-100 overflow-hidden shadow-md shrink-0 group-hover:scale-105 transition-transform duration-500 border-2 border-white">
                                    <img src={book.coverUrl} alt="" className="w-full h-full object-cover" />
                                </div>

                                {/* Details */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-1">
                                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${book.format === 'digital' ? 'bg-brand-primary/10 text-brand-primary' : 'bg-brand-dark/10 text-brand-dark'}`}>
                                            {book.format}
                                        </span>
                                        {book.featured && (
                                            <span className="px-2 py-0.5 bg-yellow-400/10 text-yellow-600 rounded text-[8px] font-black uppercase tracking-widest">Destaque</span>
                                        )}
                                    </div>
                                    <h3 className="text-xl font-black text-brand-dark truncate group-hover:text-brand-primary transition-colors">
                                        {book.title}
                                    </h3>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                                        {book.author}
                                    </p>
                                </div>

                                {/* Stats & Meta */}
                                <div className="hidden lg:flex items-center gap-8 px-8 border-x border-gray-50">
                                    <div className="text-center">
                                        <div className="flex items-center justify-center gap-1 text-gray-400 mb-1">
                                            <Eye className="w-3 h-3" />
                                            <span className="text-[10px] font-bold tabular-nums">0</span>
                                        </div>
                                        <p className="text-[8px] font-black uppercase tracking-widest text-gray-300">Views</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="flex items-center justify-center gap-1 text-gray-400 mb-1">
                                            <Download className="w-3 h-3" />
                                            <span className="text-[10px] font-bold tabular-nums">0</span>
                                        </div>
                                        <p className="text-[8px] font-black uppercase tracking-widest text-gray-300">Sales</p>
                                    </div>
                                </div>

                                {/* Price & Actions */}
                                <div className="flex items-center gap-8 pl-4">
                                    <div className="text-right">
                                        <p className="text-[8px] font-black uppercase tracking-widest text-gray-400 mb-1">Preço</p>
                                        <p className="text-xl font-black text-brand-dark tabular-nums flex items-baseline">
                                            <span className="text-xs mr-1">Kz</span>
                                            {book.price.toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleOpenModal(book)}
                                            className="p-3 bg-gray-50 hover:bg-brand-dark hover:text-white rounded-2xl transition-all"
                                            title="Editar Obra"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(book.id, book.title)}
                                            className="p-3 bg-gray-50 hover:bg-red-500 hover:text-white rounded-2xl transition-all text-red-500"
                                            title="Eliminar Obra"
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
