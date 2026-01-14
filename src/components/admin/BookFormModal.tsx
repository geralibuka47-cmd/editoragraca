import React, { useState, useEffect } from 'react';
import { X, Upload, Image, File, CheckCircle, AlertCircle, Calendar, Loader2 } from 'lucide-react';
import { Book } from '../../types';

interface BookFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    book: Book | null; // If null, we are adding a new book
    onSave: (bookData: any, coverFile: File | null, digitalFile: File | null) => Promise<void>;
}

const BookFormModal: React.FC<BookFormModalProps> = ({ isOpen, onClose, book, onSave }) => {
    const [activeTab, setActiveTab] = useState<'info' | 'details' | 'files' | 'payment'>('info');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        price: '',
        category: 'Ficção',
        description: '',
        stock: '0',
        isbn: '',
        format: 'físico',
        coverUrl: '',
        digitalFileUrl: '',
        paymentInfo: '',
        paymentInfoNotes: '',
        launchDate: ''
    });

    // File State
    const [coverType, setCoverType] = useState<'file' | 'link'>('file');
    const [digitalFileType, setDigitalFileType] = useState<'file' | 'link'>('file');
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [digitalFile, setDigitalFile] = useState<File | null>(null);
    const [coverPreview, setCoverPreview] = useState<string>('');

    // Initialize/Reset Form
    useEffect(() => {
        if (isOpen) {
            if (book) {
                setFormData({
                    title: book.title,
                    author: book.author,
                    price: book.price.toString(),
                    category: book.category,
                    description: book.description,
                    stock: (book.stock || 0).toString(),
                    isbn: book.isbn || '',
                    format: book.format || 'físico',
                    coverUrl: book.coverUrl,
                    digitalFileUrl: book.digitalFileUrl || '',
                    paymentInfo: book.paymentInfo || '',
                    paymentInfoNotes: book.paymentInfoNotes || '',
                    launchDate: book.launchDate || ''
                });

                const isCoverLink = book.coverUrl.startsWith('http');
                setCoverType(isCoverLink ? 'link' : 'file');
                setCoverPreview(book.coverUrl); // Show existing cover

                const isDigitalLink = book.digitalFileUrl?.startsWith('http') || false;
                setDigitalFileType(isDigitalLink ? 'link' : 'file');
            } else {
                // Reset for new book
                setFormData({
                    title: '',
                    author: '',
                    price: '',
                    category: 'Ficção',
                    description: '',
                    stock: '0',
                    isbn: '',
                    format: 'físico',
                    coverUrl: '',
                    digitalFileUrl: '',
                    paymentInfo: '',
                    paymentInfoNotes: '',
                    launchDate: ''
                });
                setCoverType('file');
                setDigitalFileType('file');
                setCoverPreview('');
            }
            setCoverFile(null);
            setDigitalFile(null);
            setActiveTab('info');
        }
    }, [isOpen, book]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'cover' | 'digital') => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (type === 'cover') {
                setCoverFile(file);
                // Create object URL for preview
                const objectUrl = URL.createObjectURL(file);
                setCoverPreview(objectUrl);
            } else {
                setDigitalFile(file);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onSave(formData, coverFile, digitalFile);
            onClose();
        } catch (error) {
            console.error("Error submitting form", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    const tabs = [
        { id: 'info', label: 'Info Básica' },
        { id: 'details', label: 'Detalhes' },
        { id: 'files', label: 'Imagens & Arquivos' },
        { id: 'payment', label: 'Pagamento' }
    ];

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-fade-in">

                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
                    <h2 className="text-2xl font-bold text-brand-dark font-serif">
                        {book ? 'Editar Livro' : 'Adicionar Novo Livro'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                        title="Fechar modal"
                        aria-label="Fechar modal"
                    >
                        <X className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-100 px-6">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`px-6 py-4 text-sm font-bold uppercase tracking-wider relative transition-colors
                                ${activeTab === tab.id ? 'text-brand-primary' : 'text-gray-400 hover:text-gray-600'}
                            `}
                        >
                            {tab.label}
                            {activeTab === tab.id && (
                                <div className="absolute bottom-0 left-0 w-full h-1 bg-brand-primary rounded-t-full"></div>
                            )}
                        </button>
                    ))}
                </div>

                {/* Form Content */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8">

                    {/* INFO TAB */}
                    {activeTab === 'info' && (
                        <div className="grid md:grid-cols-2 gap-6 animate-fade-in">
                            <div className="form-group-premium">
                                <label htmlFor="title" className="label-premium">Título do Livro</label>
                                <input
                                    id="title"
                                    type="text"
                                    required
                                    className="input-premium"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Ex: O Menino que curava"
                                />
                            </div>
                            <div className="form-group-premium">
                                <label htmlFor="author" className="label-premium">Autor</label>
                                <input
                                    id="author"
                                    type="text"
                                    required
                                    className="input-premium"
                                    value={formData.author}
                                    onChange={e => setFormData({ ...formData, author: e.target.value })}
                                    placeholder="Nome do Autor"
                                />
                            </div>
                            <div className="form-group-premium">
                                <label htmlFor="category-select" className="label-premium">Categoria</label>
                                <select
                                    id="category-select"
                                    className="input-premium"
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    title="Selecione a categoria do livro"
                                >
                                    <option value="Ficção">Ficção</option>
                                    <option value="Não-Ficção">Não-Ficção</option>
                                    <option value="Técnico">Técnico</option>
                                    <option value="Infantil">Infantil</option>
                                    <option value="Poesia">Poesia</option>
                                    <option value="Literatura Angolana">Literatura Angolana</option>
                                </select>
                            </div>
                            <div className="form-group-premium">
                                <label htmlFor="isbn" className="label-premium">ISBN</label>
                                <input
                                    id="isbn"
                                    type="text"
                                    className="input-premium"
                                    value={formData.isbn}
                                    onChange={e => setFormData({ ...formData, isbn: e.target.value })}
                                    placeholder="ISBN-13"
                                />
                            </div>
                            <div className="form-group-premium md:col-span-2">
                                <label htmlFor="description" className="label-premium">Descrição / Sinopse</label>
                                <textarea
                                    id="description"
                                    required
                                    className="input-premium h-32 resize-none"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Escreva um resumo cativante sobre o livro..."
                                />
                            </div>
                            <div className="md:col-span-2 bg-brand-primary/5 p-4 rounded-2xl border border-brand-primary/10">
                                <div className="flex items-center gap-2 mb-2">
                                    <Calendar className="w-4 h-4 text-brand-primary" />
                                    <label className="text-xs font-bold uppercase tracking-widest text-brand-primary">Data de Lançamento (Lançamentos Futuros)</label>
                                </div>
                                <input
                                    type="datetime-local"
                                    className="input-premium w-full bg-white"
                                    value={formData.launchDate}
                                    onChange={e => setFormData({ ...formData, launchDate: e.target.value })}
                                    aria-label="Data de Lançamento"
                                    title="Data de Lançamento"
                                />
                                <p className="text-xs text-brand-primary/70 mt-2 font-medium">Use isso apenas para livros que ainda serão lançados. Isso ativará a contagem regressiva na página inicial.</p>
                            </div>
                        </div>
                    )}

                    {/* DETAILS TAB */}
                    {activeTab === 'details' && (
                        <div className="grid md:grid-cols-2 gap-6 animate-fade-in">
                            <div className="flex gap-4">
                                <div className="form-group-premium flex-1">
                                    <label htmlFor="price" className="label-premium">Preço (Kz)</label>
                                    <input
                                        id="price"
                                        type="number"
                                        required
                                        className="input-premium"
                                        value={formData.price}
                                        onChange={e => setFormData({ ...formData, price: e.target.value })}
                                        placeholder="0"
                                    />
                                </div>
                                <div className="form-group-premium flex-1">
                                    <label htmlFor="stock" className="label-premium">Stock</label>
                                    <input
                                        id="stock"
                                        type="number"
                                        required
                                        className="input-premium"
                                        value={formData.stock}
                                        onChange={e => setFormData({ ...formData, stock: e.target.value })}
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                            <div className="form-group-premium">
                                <label className="label-premium">Formato</label>
                                <div className="flex gap-4 p-1 bg-gray-100 rounded-2xl">
                                    <button
                                        type="button"
                                        className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${formData.format === 'físico' ? 'bg-white shadow text-brand-dark' : 'text-gray-500 hover:text-gray-700'}`}
                                        onClick={() => setFormData({ ...formData, format: 'físico' })}
                                    >
                                        Físico
                                    </button>
                                    <button
                                        type="button"
                                        className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${formData.format === 'digital' ? 'bg-white shadow text-brand-dark' : 'text-gray-500 hover:text-gray-700'}`}
                                        onClick={() => setFormData({ ...formData, format: 'digital' })}
                                    >
                                        Digital
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* FILES TAB */}
                    {activeTab === 'files' && (
                        <div className="space-y-8 animate-fade-in">
                            {/* Cover Image */}
                            <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                                <div className="flex justify-between items-center mb-4">
                                    <label className="flex items-center gap-2 text-sm font-bold text-brand-dark">
                                        <Image className="w-5 h-5 text-brand-primary" /> Capa do Livro
                                    </label>
                                    <div className="flex gap-2 text-xs">
                                        <button
                                            type="button"
                                            className={`px-3 py-1 rounded-full border transition-all ${coverType === 'file' ? 'bg-brand-primary text-white border-brand-primary' : 'bg-white text-gray-500 border-gray-200'}`}
                                            onClick={() => setCoverType('file')}
                                        >
                                            Upload
                                        </button>
                                        <button
                                            type="button"
                                            className={`px-3 py-1 rounded-full border transition-all ${coverType === 'link' ? 'bg-brand-primary text-white border-brand-primary' : 'bg-white text-gray-500 border-gray-200'}`}
                                            onClick={() => setCoverType('link')}
                                        >
                                            Link
                                        </button>
                                    </div>
                                </div>

                                <div className="flex gap-6 items-start">
                                    {/* Preview Box */}
                                    <div className="w-32 h-44 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0 border-2 border-dashed border-gray-300 flex items-center justify-center relative group">
                                        {coverPreview ? (
                                            <img src={coverPreview} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <Image className="w-10 h-10 text-gray-400" />
                                        )}
                                        {coverType === 'file' && (
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer text-white text-xs font-bold text-center p-2">
                                                Mudar Capa
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1">
                                        {coverType === 'file' ? (
                                            <div className="relative">
                                                <input
                                                    type="file"
                                                    onChange={(e) => handleFileChange(e, 'cover')}
                                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-brand-primary/10 file:text-brand-primary hover:file:bg-brand-primary/20"
                                                    accept="image/*"
                                                    aria-label="Upload da Capa"
                                                    title="Upload da Capa"
                                                />
                                                <p className="text-xs text-gray-400 mt-2">Recomendado: 1200x1600px, Max 5MB</p>
                                            </div>
                                        ) : (
                                            <input
                                                type="url"
                                                className="input-premium w-full"
                                                value={formData.coverUrl}
                                                onChange={e => {
                                                    setFormData({ ...formData, coverUrl: e.target.value });
                                                    setCoverPreview(e.target.value);
                                                }}
                                                placeholder="https://exemplo.com/imagem.jpg"
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Digital File */}
                            {formData.format === 'digital' && (
                                <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                                    <div className="flex justify-between items-center mb-4">
                                        <label className="flex items-center gap-2 text-sm font-bold text-brand-dark">
                                            <File className="w-5 h-5 text-brand-primary" /> Arquivo Digital (PDF/EPUB)
                                        </label>
                                        <div className="flex gap-2 text-xs">
                                            <button
                                                type="button"
                                                className={`px-3 py-1 rounded-full border transition-all ${digitalFileType === 'file' ? 'bg-brand-primary text-white border-brand-primary' : 'bg-white text-gray-500 border-gray-200'}`}
                                                onClick={() => setDigitalFileType('file')}
                                            >
                                                Upload
                                            </button>
                                            <button
                                                type="button"
                                                className={`px-3 py-1 rounded-full border transition-all ${digitalFileType === 'link' ? 'bg-brand-primary text-white border-brand-primary' : 'bg-white text-gray-500 border-gray-200'}`}
                                                onClick={() => setDigitalFileType('link')}
                                            >
                                                Link
                                            </button>
                                        </div>
                                    </div>

                                    {digitalFileType === 'file' ? (
                                        <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:bg-white transition-colors cursor-pointer relative">
                                            <input
                                                type="file"
                                                onChange={(e) => handleFileChange(e, 'digital')}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                accept=".pdf,.epub"
                                                aria-label="Upload do Arquivo Digital"
                                                title="Upload do Arquivo Digital"
                                            />
                                            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                                            <p className="text-sm font-medium text-gray-600">
                                                {digitalFile ? digitalFile.name : 'Clique para enviar o arquivo'}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">PDF ou EPUB até 100MB</p>
                                        </div>
                                    ) : (
                                        <input
                                            type="url"
                                            className="input-premium w-full"
                                            value={formData.digitalFileUrl}
                                            onChange={e => setFormData({ ...formData, digitalFileUrl: e.target.value })}
                                            placeholder="https://exemplo.com/livro.pdf"
                                        />
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* PAYMENT TAB */}
                    {activeTab === 'payment' && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="bg-yellow-50 p-4 rounded-2xl flex gap-3 text-yellow-800 text-sm">
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                <p>Estas opções são para pagamentos quando a venda não é feita pelo sistema automático. Pode deixar em branco se usar o sistema padrão.</p>
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Detalhes de Pagamento (IBAN/Conta)</label>
                                <textarea
                                    className="input-premium w-full h-24"
                                    value={formData.paymentInfo}
                                    onChange={e => setFormData({ ...formData, paymentInfo: e.target.value })}
                                    placeholder="Ex: Banco BAI\nIBAN: AO06..."
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Notas sobre Pagamento</label>
                                <textarea
                                    className="input-premium w-full h-24"
                                    value={formData.paymentInfoNotes}
                                    onChange={e => setFormData({ ...formData, paymentInfoNotes: e.target.value })}
                                    placeholder="Ex: Enviar comprovativo para..."
                                />
                            </div>
                        </div>
                    )}
                </form>

                {/* Footer Actions */}
                <div className="p-6 border-t border-gray-100 flex justify-end gap-4 bg-gray-50/50">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-200 transition-colors"
                        disabled={isSubmitting}
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="btn-premium flex items-center gap-2"
                        title={book ? 'Atualizar Livro' : 'Publicar Livro'}
                        aria-label={book ? 'Atualizar Livro' : 'Publicar Livro'}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Guardando...</span>
                            </>
                        ) : (
                            <>
                                <CheckCircle className="w-5 h-5" />
                                <span>{book ? 'Atualizar Livro' : 'Publicar Livro'}</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookFormModal;
