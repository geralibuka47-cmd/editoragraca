import React, { useState, useEffect } from 'react';
import { motion as m, AnimatePresence } from 'framer-motion';
import { X, Upload, Image as ImageIcon, FileText, CheckCircle, AlertCircle, Calendar, Loader2, Info, DollarSign, Package, Tag, Layers, Globe, BookOpen, Sparkles, RefreshCw } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Book } from '../../types';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { fetchBookMetadata } from '../../services/bookMetadataService';

// Validation Schema
const bookSchema = z.object({
    title: z.string().min(1, 'Título é obrigatório'),
    author: z.string().min(1, 'Autor é obrigatório'),
    genre: z.string().min(1, 'Gênero é obrigatório'),
    isbn: z.string().optional(),
    description: z.string().min(1, 'Descrição é obrigatória'),
    launchDate: z.string().optional(),
    price: z.coerce.number().min(0, 'Preço inválido'),
    stock: z.coerce.number().min(0, 'Stock inválido'),
    format: z.string().optional(),
    coverUrl: z.string().optional(),
    digitalFileUrl: z.string().optional(),
    paymentInfo: z.string().optional(),
    paymentInfoNotes: z.string().optional(),
});

type BookFormData = z.infer<typeof bookSchema>;

interface BookFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    book: Book | null;
    onSave: (bookData: any, coverFile: File | null, digitalFile: File | null) => Promise<void>;
}

const BookFormModal: React.FC<BookFormModalProps> = ({ isOpen, onClose, book, onSave }) => {
    const [activeTab, setActiveTab] = useState<'info' | 'details' | 'files' | 'payment'>('info');
    const [coverType, setCoverType] = useState<'file' | 'link'>('file');
    const [digitalFileType, setDigitalFileType] = useState<'file' | 'link'>('file');
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [digitalFile, setDigitalFile] = useState<File | null>(null);
    const [coverPreview, setCoverPreview] = useState<string>('');
    const [isFetchingMetadata, setIsFetchingMetadata] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<any>({
        resolver: zodResolver(bookSchema),
        defaultValues: {
            title: '',
            author: '',
            genre: 'Ficção',
            isbn: '',
            description: '',
            price: 0,
            stock: 0,
            format: 'físico',
            coverUrl: '',
            digitalFileUrl: '',
            paymentInfo: '',
            paymentInfoNotes: '',
            launchDate: '',
        }
    });

    const watchedPrice = watch('price');
    const watchedFormat = watch('format');
    const watchedCoverUrl = watch('coverUrl');

    useEffect(() => {
        if (isOpen) {
            if (book) {
                reset({
                    title: book.title,
                    author: book.author,
                    genre: book.genre,
                    isbn: book.isbn || '',
                    description: book.description || '',
                    price: Number(book.price),
                    stock: Number(book.stock || 0),
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
                reset({
                    title: '',
                    author: '',
                    genre: 'Ficção',
                    isbn: '',
                    description: '',
                    price: 0,
                    stock: 0,
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
    }, [isOpen, book, reset]);

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

    const isFree = !watchedPrice || Number(watchedPrice) === 0;

    const handleFetchMetadata = async () => {
        const isbn = watch('isbn');
        if (!isbn || isbn.length < 10) return;

        setIsFetchingMetadata(true);
        try {
            const data = await fetchBookMetadata(isbn);
            if (data) {
                if (data.title) setValue('title', data.title);
                if (data.authors?.[0]) setValue('author', data.authors[0]);
                if (data.description) setValue('description', data.description);

                // Map categories to local genres if possible
                if (data.categories?.[0]) {
                    const category = data.categories[0];
                    if (category.includes('Fiction')) setValue('genre', 'Ficção');
                    else if (category.includes('Biography')) setValue('genre', 'Biografia');
                    else if (category.includes('Spirituality') || category.includes('Religion')) setValue('genre', 'Espiritualidade');
                }

                if (data.coverUrl) {
                    setCoverType('link');
                    const secureUrl = data.coverUrl.replace('http:', 'https:');
                    setValue('coverUrl', secureUrl);
                    setCoverPreview(secureUrl);
                }
            }
        } catch (error) {
            console.error('Error fetching metadata:', error);
        } finally {
            setIsFetchingMetadata(false);
        }
    };

    const onSubmit = async (data: BookFormData) => {
        try {
            const sanitizedData = {
                ...data,
                id: book?.id,
                price: Number(data.price),
                stock: data.format === 'digital' ? null : Number(data.stock),
            };
            await onSave(sanitizedData, coverFile, digitalFile);
            onClose();
        } catch (error) {
            console.error("Error submitting form", error);
        }
    };

    const tabs = [
        { id: 'info', label: 'Essência', icon: FileText },
        { id: 'details', label: 'Ecom', icon: DollarSign },
        { id: 'files', label: 'Digital', icon: Layers },
        ...(!isFree ? [{ id: 'payment', label: 'Checkout', icon: Globe }] : [])
    ];

    if (!isOpen) return null;

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
                        className="bg-[#050505] rounded-[4rem] w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] flex flex-col relative z-20 border border-white/5"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center p-12 border-b border-white/5 bg-white/[0.02]">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-white/[0.05] rounded-3xl border border-white/10 shadow-2xl flex items-center justify-center">
                                    <BookOpen className="w-8 h-8 text-brand-primary" />
                                </div>
                                <div className="space-y-1">
                                    <h2 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">
                                        {book ? 'Lapidar' : 'Esculpir'} <span className="text-brand-primary lowercase italic font-light">Obra</span>
                                    </h2>
                                    <p className="text-gray-500 font-bold text-[10px] uppercase tracking-[0.3em]">Metadata editorial e configuração de loja.</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={onClose}
                                className="w-14 h-14 flex items-center justify-center bg-white/5 border border-white/5 text-gray-500 hover:text-white rounded-full transition-all hover:rotate-90 hover:scale-110 shadow-2xl"
                                title="Fechar"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Custom Tabs */}
                        <div className="flex px-12 gap-2 border-b border-white/5 bg-white/[0.01]">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`px-10 py-8 text-[11px] font-black uppercase tracking-[0.2em] relative transition-all flex items-center gap-3 overflow-hidden
                                        ${activeTab === tab.id ? 'text-brand-primary' : 'text-gray-600 hover:text-white'}
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
                        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-12 custom-scrollbar space-y-12">
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
                                            <Input
                                                label="Título da Obra"
                                                variant="glass"
                                                placeholder="Ex: O Pequeno Caminho"
                                                icon={<Tag className="w-4 h-4" />}
                                                {...register('title')}
                                                error={errors.title?.message as string}
                                            />

                                            <Input
                                                label="Autor(a)"
                                                variant="glass"
                                                placeholder="Nome completo..."
                                                icon={<BookOpen className="w-4 h-4" />}
                                                {...register('author')}
                                                error={errors.author?.message as string}
                                            />

                                            <Select
                                                label="Gênero Literário"
                                                variant="glass"
                                                icon={<Layers className="w-4 h-4" />}
                                                options={[
                                                    { value: 'Ficção', label: 'Ficção' },
                                                    { value: 'Não-Ficção', label: 'Não-Ficção' },
                                                    { value: 'Técnico', label: 'Técnico' },
                                                    { value: 'Espiritualidade', label: 'Espiritualidade' },
                                                    { value: 'Biografia', label: 'Biografia' },
                                                    { value: 'Literatura Angolana', label: 'Literatura Angolana' },
                                                ]}
                                                {...register('genre')}
                                                error={errors.genre?.message as string}
                                            />

                                            <div className="relative group">
                                                <Input
                                                    label="ISBN (Identificador)"
                                                    variant="glass"
                                                    placeholder="978-..."
                                                    {...register('isbn')}
                                                    error={errors.isbn?.message as string}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleFetchMetadata}
                                                    disabled={isFetchingMetadata}
                                                    className="absolute right-4 top-[38px] p-2 bg-brand-primary/10 text-brand-primary rounded-xl hover:bg-brand-primary hover:text-white transition-all group/fetch disabled:opacity-50"
                                                    title="Procurar metadados (Google/Open Library)"
                                                >
                                                    {isFetchingMetadata ? (
                                                        <RefreshCw className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <Sparkles className="w-4 h-4 group-hover/fetch:scale-110 transition-transform" />
                                                    )}
                                                </button>
                                            </div>

                                            <div className="md:col-span-2">
                                                <Textarea
                                                    label="Sinopse da Obra"
                                                    variant="glass"
                                                    placeholder="Uma descrição envolvente..."
                                                    rows={6}
                                                    {...register('description')}
                                                    error={errors.description?.message as string}
                                                />
                                            </div>

                                            <div className="md:col-span-2 p-10 bg-brand-primary/[0.03] rounded-[3rem] border border-white/5">
                                                <div className="flex items-center gap-4 mb-6">
                                                    <Calendar className="w-5 h-5 text-brand-primary" />
                                                    <span className="text-[11px] font-black uppercase tracking-widest text-brand-primary">Lançamento & Destaque</span>
                                                </div>
                                                <input
                                                    type="datetime-local"
                                                    className="w-full px-8 py-5 bg-white/5 rounded-2xl border-2 border-transparent transition-all outline-none font-black text-white focus:border-brand-primary/20"
                                                    {...register('launchDate')}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'details' && (
                                        <div className="grid md:grid-cols-2 gap-12">
                                            <div className="space-y-4">
                                                <Input
                                                    type="number"
                                                    label="Preço (Kz)"
                                                    variant="glass"
                                                    placeholder="0"
                                                    icon={<DollarSign className="w-4 h-4" />}
                                                    {...register('price')}
                                                    error={errors.price?.message as string}
                                                />
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

                                            {watchedFormat !== 'digital' && (
                                                <Input
                                                    type="number"
                                                    label="Stock em Armazém"
                                                    variant="glass"
                                                    placeholder="0"
                                                    icon={<Package className="w-4 h-4" />}
                                                    {...register('stock')}
                                                    error={errors.stock?.message as string}
                                                />
                                            )}

                                            {watchedFormat === 'digital' && (
                                                <div className="flex flex-col gap-2 p-10 bg-blue-500/5 rounded-[2.5rem] border border-blue-500/10">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <Zap className="w-5 h-5 text-blue-500" />
                                                        <span className="text-[11px] font-black uppercase tracking-widest text-blue-500">Distribuição Infinita</span>
                                                    </div>
                                                    <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider leading-relaxed">
                                                        O formato digital não requer controlo de stock físico. A obra estará sempre disponível para download após a validação do pagamento.
                                                    </p>
                                                </div>
                                            )}

                                            <div className="md:col-span-2 space-y-6 pt-6">
                                                <label className="text-[11px] font-black uppercase tracking-widest text-gray-500 ml-4 text-center block">Suporte Editorial</label>
                                                <div className="flex gap-6 p-3 bg-white/5 rounded-[3rem] border border-white/10">
                                                    <button
                                                        type="button"
                                                        onClick={() => setValue('format', 'físico')}
                                                        className={`flex-1 flex flex-col items-center gap-2 py-8 rounded-[2.5rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all relative overflow-hidden ${watchedFormat === 'físico' ? 'bg-white/10 shadow-2xl text-white ring-1 ring-white/10' : 'text-gray-600 hover:text-gray-400'}`}
                                                    >
                                                        <Package className={`w-6 h-6 ${watchedFormat === 'físico' ? 'text-brand-primary' : 'text-gray-800'}`} />
                                                        Livro de Capa (Físico)
                                                        {watchedFormat === 'físico' && <m.div layoutId="formatIndicator" className="absolute bottom-0 w-8 h-1 bg-brand-primary rounded-full" />}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setValue('format', 'digital')}
                                                        className={`flex-1 flex flex-col items-center gap-2 py-8 rounded-[2.5rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all relative overflow-hidden ${watchedFormat === 'digital' ? 'bg-white/10 shadow-2xl text-white ring-1 ring-white/10' : 'text-gray-600 hover:text-gray-400'}`}
                                                    >
                                                        <Layers className={`w-6 h-6 ${watchedFormat === 'digital' ? 'text-brand-primary' : 'text-gray-800'}`} />
                                                        E-book (Distribuição Digital)
                                                        {watchedFormat === 'digital' && <m.div layoutId="formatIndicator" className="absolute bottom-0 w-8 h-1 bg-brand-primary rounded-full" />}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'files' && (
                                        <div className="space-y-12">
                                            <div className="p-10 bg-white/5 rounded-[3rem] border border-white/5">
                                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
                                                    <h4 className="text-[12px] font-black uppercase tracking-widest text-white flex items-center gap-3">
                                                        <ImageIcon className="w-5 h-5 text-brand-primary" />
                                                        Veste da Obra (Capa)
                                                    </h4>
                                                    <div className="flex bg-white/5 p-1.5 rounded-full border border-white/5 shadow-2xl">
                                                        {(['file', 'link'] as const).map(type => (
                                                            <button
                                                                key={type}
                                                                type="button"
                                                                onClick={() => setCoverType(type)}
                                                                className={`px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${coverType === type ? 'bg-brand-primary text-white shadow-lg' : 'text-gray-600 hover:text-white'}`}
                                                            >
                                                                {type === 'file' ? 'Upload Local' : 'Link Remoto'}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="flex flex-col lg:flex-row gap-12 items-center lg:items-end">
                                                    <m.div
                                                        whileHover={{ scale: 1.05 }}
                                                        className="w-48 h-64 bg-white/5 rounded-3xl border border-white/10 flex flex-col items-center justify-center overflow-hidden shadow-2xl flex-shrink-0 relative group"
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
                                                                <ImageIcon className="w-10 h-10 text-white/5 mx-auto mb-4" />
                                                                <p className="text-[8px] font-black uppercase tracking-widest text-gray-700">Sem Imagem</p>
                                                            </div>
                                                        )}
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
                                                                <div className="px-10 py-8 bg-white/5 rounded-[2rem] border border-white/5 text-[11px] font-black uppercase tracking-[0.2em] text-gray-600 flex items-center justify-center gap-4 group-hover:border-brand-primary/30 group-hover:text-brand-primary transition-all shadow-sm">
                                                                    <Upload className="w-5 h-5" />
                                                                    {coverFile ? coverFile.name : 'Vincular Novo Arquivo Visual'}
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="space-y-4">
                                                                <Input
                                                                    label="Endereço da Imagem (URL)"
                                                                    variant="glass"
                                                                    placeholder="https://servidor.com/capa.jpg"
                                                                    {...register('coverUrl')}
                                                                    onChange={(e) => {
                                                                        register('coverUrl').onChange(e);
                                                                        setCoverPreview(e.target.value);
                                                                    }}
                                                                />
                                                            </div>
                                                        )}
                                                        <p className="text-[9px] font-bold text-gray-400 italic ml-4">* Recomendado 1200x1800px para nitidez suprema.</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {watchedFormat === 'digital' && (
                                                <m.div
                                                    initial={{ opacity: 0, scale: 0.98 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    className="p-10 bg-brand-primary/[0.03] rounded-[3.5rem] border border-white/5 shadow-2xl overflow-hidden"
                                                >
                                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
                                                        <h4 className="text-[12px] font-black uppercase tracking-widest text-brand-primary flex items-center gap-3">
                                                            <FileText className="w-5 h-5 text-brand-primary" />
                                                            Cesto de Dados (PDF/EPUB)
                                                        </h4>
                                                        <div className="flex bg-white/5 p-1.5 rounded-full border border-white/5 shadow-inner">
                                                            {(['file', 'link'] as const).map(type => (
                                                                <button
                                                                    key={type}
                                                                    type="button"
                                                                    onClick={() => setDigitalFileType(type)}
                                                                    className={`px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${digitalFileType === type ? 'bg-brand-primary text-white shadow-lg' : 'text-gray-600 hover:text-white'}`}
                                                                >
                                                                    {type === 'file' ? 'Upload' : 'URL'}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {digitalFileType === 'file' ? (
                                                        <div className="relative group">
                                                            <input type="file" onChange={e => handleFileChange(e, 'digital')} className="absolute inset-0 opacity-0 cursor-pointer z-10" accept=".pdf,.epub" title="Upload" />
                                                            <div className="p-16 bg-white/10 rounded-[2.5rem] border border-white/10 flex flex-col items-center gap-6 text-center group-hover:bg-white/[0.15] transition-all">
                                                                <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary shadow-[0_0_30px_rgba(189,147,56,0.2)]">
                                                                    <Upload className="w-6 h-6" />
                                                                </div>
                                                                <div>
                                                                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white mb-2">
                                                                        {digitalFile ? digitalFile.name : 'Derrame o arquivo aqui'}
                                                                    </p>
                                                                    <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">Formatos Aceites: PDF ou EPUB</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <Input
                                                            label="URL do Arquivo"
                                                            variant="glass"
                                                            placeholder="Endereço de acesso remoto..."
                                                            {...register('digitalFileUrl')}
                                                        />
                                                    )}
                                                </m.div>
                                            )}
                                        </div>
                                    )}

                                    {activeTab === 'payment' && (
                                        <div className="space-y-12">
                                            <div className="p-10 bg-white/[0.03] rounded-[3rem] border border-white/10 flex gap-6 items-start">
                                                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center shadow-2xl flex-shrink-0 border border-white/5">
                                                    <Info className="w-6 h-6 text-brand-primary" />
                                                </div>
                                                <p className="text-[11px] font-bold text-gray-400 leading-relaxed uppercase tracking-wider italic">
                                                    Fluxo de Liquidação Manual: Estes dados serão exibidos no checkout quando o leitor optar por pagamento direto. Mantenha os detalhes do IBAN atualizados.
                                                </p>
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-12">
                                                <Textarea
                                                    label="Coordenadas Bancárias (IBAN/Conta)"
                                                    variant="glass"
                                                    placeholder="Ex: BAI AO06 0000..."
                                                    className="h-48"
                                                    {...register('paymentInfo')}
                                                />
                                                <Textarea
                                                    label="Notas de Procedimento"
                                                    variant="glass"
                                                    placeholder="Instruções para o envio do comprovativo..."
                                                    className="h-48"
                                                    {...register('paymentInfoNotes')}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </m.div>
                            </AnimatePresence>
                        </form>

                        {/* Footer Actions */}
                        <div className="p-12 border-t border-white/5 flex justify-end gap-8 bg-white/[0.02]">
                            <m.button
                                whileHover={{ x: -10 }}
                                whileTap={{ scale: 0.95 }}
                                type="button"
                                onClick={onClose}
                                className="px-10 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] text-gray-600 hover:text-white transition-all"
                                disabled={isSubmitting}
                            >
                                Abandonar Edição
                            </m.button>
                            <Button
                                onClick={handleSubmit(onSubmit)}
                                isLoading={isSubmitting}
                                disabled={isSubmitting}
                                className="px-16"
                                leftIcon={!isSubmitting && <CheckCircle className="w-5 h-5" />}
                            >
                                {book ? 'Gravar Master' : 'Publicar Edição'}
                            </Button>
                        </div>

                        {Object.keys(errors).length > 0 && (
                            <m.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="absolute bottom-32 right-12 bg-red-500 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 z-50 overflow-hidden"
                            >
                                <AlertCircle className="w-5 h-5 text-white" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Verifique os campos obrigatórios em {activeTab}</span>
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
