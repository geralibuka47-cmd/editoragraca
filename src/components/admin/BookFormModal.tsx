import React, { useState, useEffect } from 'react';
import { motion as m, AnimatePresence } from 'framer-motion';
import { X, Upload, Image as ImageIcon, FileText, CheckCircle, AlertCircle, Calendar, Loader2, Info, DollarSign, Package, Tag, Layers, Globe, BookOpen } from 'lucide-react';
import { Book } from '../../types';

interface BookFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    book: Book | null;
    onSave: (bookData: any, coverFile: File | null, digitalFile: File | null) => Promise<void>;
}

const BookFormModal: React.FC<BookFormModalProps> = ({ isOpen, onClose, book, onSave }) => {
    const [activeTab, setActiveTab] = useState<'info' | 'details' | 'files' | 'payment'>('info');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [formData, setFormData] = useState({
        id: '',
        title: '',
        author: '',
        price: '',
        genre: 'Ficção',
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

    const [coverType, setCoverType] = useState<'file' | 'link'>('file');
    const [digitalFileType, setDigitalFileType] = useState<'file' | 'link'>('file');
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [digitalFile, setDigitalFile] = useState<File | null>(null);
    const [coverPreview, setCoverPreview] = useState<string>('');

    useEffect(() => {
        if (isOpen) {
            if (book) {
                setFormData({
                    id: book.id,
                    title: book.title,
                    author: book.author,
                    price: book.price.toString(),
                    genre: book.genre,
                    description: book.description || '',
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
                setCoverPreview(book.coverUrl);

                const isDigitalLink = book.digitalFileUrl?.startsWith('http') || false;
                setDigitalFileType(isDigitalLink ? 'link' : 'file');
            } else {
                setFormData({
                    id: '',
                    title: '',
                    author: '',
                    price: '',
                    genre: 'Ficção',
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
            setErrors({});
        }
    }, [isOpen, book]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'cover' | 'digital') => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (type === 'cover') {
                setCoverFile(file);
                setCoverPreview(URL.createObjectURL(file));
            } else {
                setDigitalFile(file);
            }
        }
    };

    const isFree = !formData.price || Number(formData.price) === 0;

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.title.trim()) newErrors.title = 'Título é obrigatório';
        if (!formData.author.trim()) newErrors.author = 'Autor é obrigatório';
        if (!formData.description.trim()) newErrors.description = 'Descrição é obrigatória';
        if (!formData.price || isNaN(Number(formData.price))) newErrors.price = 'Preço inválido';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) {
            setActiveTab('info');
            return;
        }

        setIsSubmitting(true);
        try {
            const sanitizedData = {
                ...formData,
                title: formData.title.trim(),
                author: formData.author.trim(),
                description: formData.description.trim(),
                isbn: formData.isbn.trim(),
                price: Number(formData.price) || 0,
                stock: Number(formData.stock) || 0,
                id: formData.id || undefined
            };

            await onSave(sanitizedData, coverFile, digitalFile);
            onClose();
        } catch (error: any) {
            console.error("Error submitting form", error);
            setErrors({ form: "Erro ao salvar livro. Verifique os dados." });
        } finally {
            setIsSubmitting(false);
        }
    };

    const tabs = [
        { id: 'info', label: 'Essência', icon: FileText },
        { id: 'details', label: 'Ecom', icon: DollarSign },
        { id: 'files', label: 'Digital', icon: Layers },
        ...(!isFree ? [{ id: 'payment', label: 'Checkout', icon: Globe }] : [])
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <m.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-brand-dark/60 backdrop-blur-2xl"
                    />

                    <m.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="bg-white rounded-[4rem] w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] flex flex-col relative z-20 border border-white/20"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center p-12 border-b border-gray-100 bg-gray-50/30">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-white rounded-3xl shadow-xl flex items-center justify-center">
                                    <BookOpen className="w-8 h-8 text-brand-primary" />
                                </div>
                                <div>
                                    <h2 className="text-4xl font-black text-brand-dark tracking-tighter uppercase leading-none mb-2">
                                        {book ? 'Lapidar' : 'Esculpir'} <span className="text-brand-primary lowercase italic font-light">Obra</span>
                                    </h2>
                                    <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">Metadata editorial e configuração de loja.</p>
                                </div>
                            </div>
                            <m.button
                                whileHover={{ rotate: 90, scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={onClose}
                                className="w-14 h-14 flex items-center justify-center bg-white shadow-lg border border-gray-100 text-gray-400 hover:text-brand-dark rounded-full transition-all"
                                title="Fechar"
                            >
                                <X className="w-6 h-6" />
                            </m.button>
                        </div>

                        {/* Custom Tabs */}
                        <div className="flex px-12 gap-2 border-b border-gray-100 bg-gray-50/50">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`px-10 py-8 text-[11px] font-black uppercase tracking-[0.2em] relative transition-all flex items-center gap-3 overflow-hidden
                                        ${activeTab === tab.id ? 'text-brand-primary' : 'text-gray-400 hover:text-brand-dark'}
                                    `}
                                >
                                    <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-brand-primary' : 'text-gray-300'}`} />
                                    {tab.label}
                                    {activeTab === tab.id && (
                                        <m.div
                                            layoutId="activeTabGlow"
                                            className="absolute bottom-0 left-0 w-full h-1 bg-brand-primary rounded-t-full shadow-[0_-4px_12px_rgba(var(--brand-primary-rgb),0.3)]"
                                        />
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Content Area */}
                        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-12 custom-scrollbar space-y-12">
                            <AnimatePresence mode="wait">
                                <m.div
                                    key={activeTab}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                >
                                    {activeTab === 'info' && (
                                        <div className="grid md:grid-cols-2 gap-12">
                                            <div className="space-y-4">
                                                <label htmlFor="b-title" className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-4">Título da Obra</label>
                                                <div className="relative">
                                                    <Tag className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                                    <input
                                                        id="b-title"
                                                        type="text"
                                                        required
                                                        className={`w-full pl-14 pr-8 py-6 bg-gray-50/50 rounded-3xl border-2 transition-all outline-none font-black text-brand-dark text-lg focus:bg-white ${errors.title ? 'border-red-100' : 'border-transparent focus:border-brand-primary/10'}`}
                                                        value={formData.title}
                                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                                        placeholder="Ex: O Pequeno Caminho"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <label htmlFor="b-author" className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-4">Autor(a)</label>
                                                <div className="relative">
                                                    <BookOpen className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                                    <input
                                                        id="b-author"
                                                        type="text"
                                                        required
                                                        className={`w-full pl-14 pr-8 py-6 bg-gray-50/50 rounded-3xl border-2 transition-all outline-none font-bold text-gray-600 focus:bg-white ${errors.author ? 'border-red-100' : 'border-transparent focus:border-brand-primary/10'}`}
                                                        value={formData.author}
                                                        onChange={e => setFormData({ ...formData, author: e.target.value })}
                                                        placeholder="Nome completo..."
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <label htmlFor="b-genre" className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-4">Gênero Literário</label>
                                                <div className="relative">
                                                    <Layers className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
                                                    <select
                                                        id="b-genre"
                                                        className="w-full pl-14 pr-8 py-6 bg-gray-50/50 rounded-3xl border-2 border-transparent transition-all outline-none font-bold text-brand-dark appearance-none focus:bg-white focus:border-brand-primary/10"
                                                        value={formData.genre}
                                                        onChange={e => setFormData({ ...formData, genre: e.target.value })}
                                                        title="Gênero"
                                                    >
                                                        <option>Ficção</option>
                                                        <option>Não-Ficção</option>
                                                        <option>Técnico</option>
                                                        <option>Espiritualidade</option>
                                                        <option>Biografia</option>
                                                        <option>Literatura Angolana</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <label htmlFor="b-isbn" className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-4">ISBN (Identificador)</label>
                                                <input
                                                    id="b-isbn"
                                                    type="text"
                                                    className="w-full px-8 py-6 bg-gray-50/50 rounded-3xl border-2 border-transparent transition-all outline-none font-bold text-brand-dark focus:bg-white focus:border-brand-primary/10"
                                                    value={formData.isbn}
                                                    onChange={e => setFormData({ ...formData, isbn: e.target.value })}
                                                    placeholder="978-..."
                                                />
                                            </div>

                                            <div className="md:col-span-2 space-y-4">
                                                <label htmlFor="b-desc" className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-4">Sinopse da Obra</label>
                                                <textarea
                                                    id="b-desc"
                                                    required
                                                    rows={6}
                                                    className={`w-full px-8 py-8 bg-gray-50/50 rounded-[2.5rem] border-2 transition-all outline-none font-medium text-gray-600 focus:bg-white resize-none leading-relaxed ${errors.description ? 'border-red-100' : 'border-transparent focus:border-brand-primary/10'}`}
                                                    value={formData.description}
                                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                                    placeholder="Uma descrição envolvente que capte a alma da obra..."
                                                />
                                            </div>

                                            <div className="md:col-span-2 p-10 bg-brand-primary/[0.03] rounded-[3rem] border-2 border-dashed border-brand-primary/10">
                                                <div className="flex items-center gap-4 mb-6">
                                                    <Calendar className="w-5 h-5 text-brand-primary" />
                                                    <span className="text-[11px] font-black uppercase tracking-widest text-brand-primary">Lançamento & Destaque</span>
                                                </div>
                                                <input
                                                    type="datetime-local"
                                                    id="b-launch"
                                                    className="w-full px-8 py-5 bg-white rounded-2xl border-2 border-transparent transition-all outline-none font-black text-brand-dark focus:border-brand-primary/20"
                                                    value={formData.launchDate}
                                                    onChange={e => setFormData({ ...formData, launchDate: e.target.value })}
                                                    title="Data de Lançamento"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'details' && (
                                        <div className="grid md:grid-cols-2 gap-12">
                                            <div className="space-y-4">
                                                <label htmlFor="b-price" className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-4">Preço de Venda (Kz)</label>
                                                <div className="relative">
                                                    <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-primary" />
                                                    <input
                                                        id="b-price"
                                                        type="number"
                                                        required
                                                        className="w-full pl-16 pr-8 py-8 bg-gray-50/50 rounded-3xl border-2 border-transparent transition-all outline-none font-black text-brand-primary text-3xl focus:bg-white focus:border-brand-primary/20"
                                                        value={formData.price}
                                                        onChange={e => setFormData({ ...formData, price: e.target.value })}
                                                        placeholder="0"
                                                    />
                                                </div>
                                                {isFree && (
                                                    <m.div
                                                        initial={{ opacity: 0, y: -10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className="flex items-center gap-3 px-6 py-3 bg-emerald-50 text-emerald-600 rounded-2xl text-[10px] font-black uppercase tracking-widest w-fit mt-4"
                                                    >
                                                        <CheckCircle className="w-4 h-4" /> Distribuição Benevolente (Grátis)
                                                    </m.div>
                                                )}
                                            </div>

                                            <div className="space-y-4">
                                                <label htmlFor="b-stock" className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-4">Unidades no Armazém</label>
                                                <div className="relative">
                                                    <Package className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                                                    <input
                                                        id="b-stock"
                                                        type="number"
                                                        required
                                                        className="w-full pl-16 pr-8 py-8 bg-gray-50/50 rounded-3xl border-2 border-transparent transition-all outline-none font-black text-brand-dark text-3xl focus:bg-white focus:border-brand-primary/20"
                                                        value={formData.stock}
                                                        onChange={e => setFormData({ ...formData, stock: e.target.value })}
                                                        placeholder="0"
                                                    />
                                                </div>
                                            </div>

                                            <div className="md:col-span-2 space-y-6 pt-6">
                                                <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-4 text-center block">Suporte Editorial</label>
                                                <div className="flex gap-6 p-3 bg-gray-50/50 rounded-[3rem] border-2 border-gray-100">
                                                    <button
                                                        type="button"
                                                        onClick={() => setFormData({ ...formData, format: 'físico' })}
                                                        className={`flex-1 flex flex-col items-center gap-2 py-8 rounded-[2.5rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all relative overflow-hidden ${formData.format === 'físico' ? 'bg-white shadow-2xl text-brand-dark ring-1 ring-black/5' : 'text-gray-400 hover:text-gray-600'}`}
                                                    >
                                                        <Package className={`w-6 h-6 ${formData.format === 'físico' ? 'text-brand-primary' : 'text-gray-200'}`} />
                                                        Livro de Capa (Físico)
                                                        {formData.format === 'físico' && <m.div layoutId="formatIndicator" className="absolute bottom-0 w-8 h-1 bg-brand-primary rounded-full" />}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setFormData({ ...formData, format: 'digital' })}
                                                        className={`flex-1 flex flex-col items-center gap-2 py-8 rounded-[2.5rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all relative overflow-hidden ${formData.format === 'digital' ? 'bg-white shadow-2xl text-brand-dark ring-1 ring-black/5' : 'text-gray-400 hover:text-gray-600'}`}
                                                    >
                                                        <Layers className={`w-6 h-6 ${formData.format === 'digital' ? 'text-brand-primary' : 'text-gray-200'}`} />
                                                        E-book (Distribuição Digital)
                                                        {formData.format === 'digital' && <m.div layoutId="formatIndicator" className="absolute bottom-0 w-8 h-1 bg-brand-primary rounded-full" />}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'files' && (
                                        <div className="space-y-12">
                                            <div className="p-10 bg-gray-50/50 rounded-[3rem] border-2 border-gray-100">
                                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
                                                    <h4 className="text-[12px] font-black uppercase tracking-widest text-brand-dark flex items-center gap-3">
                                                        <ImageIcon className="w-5 h-5 text-brand-primary" />
                                                        Veste da Obra (Capa)
                                                    </h4>
                                                    <div className="flex bg-white p-1.5 rounded-full shadow-sm border border-gray-100">
                                                        {(['file', 'link'] as const).map(type => (
                                                            <button
                                                                key={type}
                                                                type="button"
                                                                onClick={() => setCoverType(type)}
                                                                className={`px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${coverType === type ? 'bg-brand-primary text-white shadow-lg' : 'text-gray-400 hover:text-brand-dark'}`}
                                                            >
                                                                {type === 'file' ? 'Upload Local' : 'Link Remoto'}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="flex flex-col lg:flex-row gap-12 items-center lg:items-end">
                                                    <m.div
                                                        whileHover={{ scale: 1.05 }}
                                                        className="w-48 h-64 bg-white rounded-3xl border-2 border-dashed border-brand-primary/20 flex flex-col items-center justify-center overflow-hidden shadow-2xl flex-shrink-0 relative group"
                                                    >
                                                        {coverPreview ? (
                                                            <m.img
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                src={coverPreview}
                                                                alt="Previsão da Capa"
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="text-center p-8">
                                                                <ImageIcon className="w-10 h-10 text-brand-primary/10 mx-auto mb-4" />
                                                                <p className="text-[8px] font-black uppercase tracking-widest text-gray-300">Sem Imagem</p>
                                                            </div>
                                                        )}
                                                        <div className="absolute inset-0 bg-brand-primary/0 group-hover:bg-brand-primary/5 transition-colors pointer-events-none" />
                                                    </m.div>

                                                    <div className="flex-1 w-full space-y-4">
                                                        {coverType === 'file' ? (
                                                            <div className="relative group">
                                                                <input
                                                                    type="file"
                                                                    id="cover-upload"
                                                                    onChange={e => handleFileChange(e, 'cover')}
                                                                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                                                    accept="image/*"
                                                                    title="Mudar Capa"
                                                                />
                                                                <div className="px-10 py-8 bg-white rounded-[2rem] border-2 border-gray-100 text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center justify-center gap-4 group-hover:border-brand-primary/30 group-hover:text-brand-primary transition-all shadow-sm">
                                                                    <Upload className="w-5 h-5" />
                                                                    {coverFile ? coverFile.name : 'Vincular Novo Arquivo Visual'}
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="space-y-2">
                                                                <span className="text-[9px] font-black uppercase tracking-widest text-gray-300 ml-4">Endereço da Imagem</span>
                                                                <input
                                                                    type="url"
                                                                    className="w-full px-8 py-6 bg-white rounded-[2rem] border-2 border-gray-100 outline-none font-bold text-sm text-brand-dark focus:border-brand-primary/20 transition-all"
                                                                    value={formData.coverUrl}
                                                                    onChange={e => {
                                                                        setFormData({ ...formData, coverUrl: e.target.value });
                                                                        setCoverPreview(e.target.value);
                                                                    }}
                                                                    placeholder="https://servidor.com/capa.jpg"
                                                                />
                                                            </div>
                                                        )}
                                                        <p className="text-[9px] font-bold text-gray-400 italic ml-4">* Recomendado 1200x1800px para nitidez suprema.</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {formData.format === 'digital' && (
                                                <m.div
                                                    initial={{ opacity: 0, scale: 0.98 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    className="p-10 bg-brand-primary/[0.03] rounded-[3.5rem] border-2 border-dashed border-brand-primary/10"
                                                >
                                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
                                                        <h4 className="text-[12px] font-black uppercase tracking-widest text-brand-primary flex items-center gap-3">
                                                            <FileText className="w-5 h-5 text-brand-primary" />
                                                            Cesto de Dados (PDF/EPUB)
                                                        </h4>
                                                        <div className="flex bg-white p-1.5 rounded-full shadow-sm border border-brand-primary/5">
                                                            {(['file', 'link'] as const).map(type => (
                                                                <button
                                                                    key={type}
                                                                    type="button"
                                                                    onClick={() => setDigitalFileType(type)}
                                                                    className={`px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${digitalFileType === type ? 'bg-brand-primary text-white shadow-lg' : 'text-gray-400 hover:text-brand-primary/60'}`}
                                                                >
                                                                    {type === 'file' ? 'Upload' : 'URL'}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {digitalFileType === 'file' ? (
                                                        <div className="relative group">
                                                            <input type="file" onChange={e => handleFileChange(e, 'digital')} className="absolute inset-0 opacity-0 cursor-pointer z-10" accept=".pdf,.epub" title="Upload" />
                                                            <div className="p-16 bg-white rounded-[2.5rem] border-2 border-dashed border-brand-primary/10 flex flex-col items-center gap-6 text-center group-hover:bg-brand-primary/[0.01] transition-all">
                                                                <div className="w-16 h-16 bg-brand-primary/5 rounded-full flex items-center justify-center text-brand-primary shadow-inner">
                                                                    <Upload className="w-6 h-6" />
                                                                </div>
                                                                <div>
                                                                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-brand-dark mb-2">
                                                                        {digitalFile ? digitalFile.name : 'Derrame o arquivo aqui'}
                                                                    </p>
                                                                    <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">Formatos Aceites: PDF ou EPUB</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <input
                                                            type="url"
                                                            className="w-full px-10 py-8 bg-white rounded-[2rem] border-2 border-brand-primary/10 outline-none font-bold text-sm text-brand-dark focus:border-brand-primary/30 transition-all placeholder:text-gray-200"
                                                            value={formData.digitalFileUrl}
                                                            onChange={e => setFormData({ ...formData, digitalFileUrl: e.target.value })}
                                                            placeholder="Endereço de acesso remoto..."
                                                        />
                                                    )}
                                                </m.div>
                                            )}
                                        </div>
                                    )}

                                    {activeTab === 'payment' && (
                                        <div className="space-y-12">
                                            <div className="p-10 bg-brand-dark/5 rounded-[3rem] border border-brand-dark/10 flex gap-6 items-start">
                                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm flex-shrink-0">
                                                    <Info className="w-6 h-6 text-brand-dark" />
                                                </div>
                                                <p className="text-[11px] font-bold text-brand-dark/70 leading-relaxed uppercase tracking-wider italic">
                                                    Fluxo de Liquidação Manual: Estes dados serão exibidos no checkout quando o leitor optar por pagamento direto. Mantenha os detalhes do IBAN atualizados.
                                                </p>
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-12">
                                                <div className="space-y-4">
                                                    <label htmlFor="b-pay-info" className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-4">Coordenadas Bancárias (IBAN/Conta)</label>
                                                    <textarea
                                                        id="b-pay-info"
                                                        className="w-full px-10 py-8 bg-gray-50/50 rounded-[2.5rem] border-2 border-transparent transition-all outline-none font-black text-brand-dark h-48 resize-none focus:bg-white focus:border-brand-primary/10"
                                                        value={formData.paymentInfo}
                                                        onChange={e => setFormData({ ...formData, paymentInfo: e.target.value })}
                                                        placeholder="Ex: BAI AO06 0000..."
                                                    />
                                                </div>

                                                <div className="space-y-4">
                                                    <label htmlFor="b-pay-notes" className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-4">Notas de Procedimento</label>
                                                    <textarea
                                                        id="b-pay-notes"
                                                        className="w-full px-10 py-8 bg-gray-50/50 rounded-[2.5rem] border-2 border-transparent transition-all outline-none font-medium text-gray-500 h-48 resize-none focus:bg-white focus:border-brand-primary/10"
                                                        value={formData.paymentInfoNotes}
                                                        onChange={e => setFormData({ ...formData, paymentInfoNotes: e.target.value })}
                                                        placeholder="Instruções para o envio do comprovativo..."
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </m.div>
                            </AnimatePresence>
                        </form>

                        {/* Footer Actions */}
                        <div className="p-12 border-t border-gray-100 flex justify-end gap-8 bg-gray-50/30">
                            <m.button
                                whileHover={{ x: -10 }}
                                whileTap={{ scale: 0.95 }}
                                type="button"
                                onClick={onClose}
                                className="px-10 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] text-gray-400 hover:text-brand-dark transition-all"
                                disabled={isSubmitting}
                            >
                                Abandonar Edição
                            </m.button>
                            <m.button
                                whileHover={{ scale: 1.05, y: -5 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="btn-premium px-16 py-6 shadow-[0_20px_50px_-10px_rgba(var(--brand-primary-rgb),0.3)] text-[11px]"
                                title={book ? 'Gravar Alterações' : 'Publicar Obra'}
                            >
                                {isSubmitting ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <CheckCircle className="w-5 h-5" />
                                )}
                                <span>{isSubmitting ? 'Cristalizando...' : book ? 'Gravar Master' : 'Publicar Edição'}</span>
                            </m.button>
                        </div>

                        {errors.form && (
                            <m.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="absolute bottom-32 right-12 bg-red-500 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 z-50 overflow-hidden"
                            >
                                <AlertCircle className="w-5 h-5 text-white" />
                                <span className="text-[10px] font-black uppercase tracking-widest">{errors.form}</span>
                                <m.div
                                    initial={{ width: "100%" }}
                                    animate={{ width: 0 }}
                                    transition={{ duration: 5 }}
                                    className="absolute bottom-0 left-0 h-1 bg-white/30"
                                />
                            </m.div>
                        )}
                    </m.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default BookFormModal;
