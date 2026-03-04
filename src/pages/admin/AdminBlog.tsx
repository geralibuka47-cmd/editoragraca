import React, { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    MessageSquare,
    Clock,
    User,
    Image as ImageIcon,
    Loader2,
    ChevronRight,
    ThumbsUp,
    MessageCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getBlogPosts, saveBlogPost, deleteBlogPost } from '../../services/dataService';
import { BlogPost } from '../../types';
import { useToast } from '../../components/Toast';

const AdminBlog: React.FC = () => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
    const { showToast } = useToast();

    // Form State
    const [formData, setFormData] = useState<Partial<BlogPost>>({
        title: '',
        content: '',
        author: '',
        imageUrl: '',
        date: new Date().toISOString()
    });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        loadPosts();
    }, []);

    const loadPosts = async () => {
        setLoading(true);
        try {
            const data = await getBlogPosts(true);
            setPosts(data);
        } catch (error) {
            showToast('Erro ao carregar blog', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (post?: BlogPost) => {
        if (post) {
            setEditingPost(post);
            setFormData(post);
        } else {
            setEditingPost(null);
            setFormData({
                title: '',
                content: '',
                author: '',
                imageUrl: '',
                date: new Date().toISOString()
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const postToSave = {
                ...formData,
                id: editingPost?.id || `temp_${Date.now()}`,
                date: formData.date || new Date().toISOString()
            } as BlogPost;

            await saveBlogPost(postToSave);
            showToast(editingPost ? 'Artigo atualizado!' : 'Artigo publicado!', 'success');
            setIsModalOpen(false);
            loadPosts();
        } catch (error) {
            showToast('Erro ao gravar artigo', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string, title: string) => {
        if (window.confirm(`Tem a certeza que deseja eliminar o post "${title}"?`)) {
            try {
                await deleteBlogPost(id);
                setPosts(prev => prev.filter(p => p.id !== id));
                showToast('Post eliminado com sucesso', 'success');
            } catch (error) {
                showToast('Erro ao eliminar post', 'error');
            }
        }
    };

    const filteredPosts = posts.filter(post =>
        (post.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (post.author?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <span className="text-brand-primary font-bold uppercase tracking-[0.4em] text-[10px]">Gestão de Jornal</span>
                    <h2 className="text-4xl sm:text-5xl font-black text-brand-dark uppercase tracking-tighter leading-none mt-2">
                        Blog
                    </h2>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 px-6 py-4 bg-brand-dark text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-brand-primary transition-all shadow-xl shadow-brand-dark/20 group"
                >
                    <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                    Novo Artigo
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
                                    {editingPost ? 'Editar Artigo' : 'Novo Artigo'}
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
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Título do Artigo</label>
                                        <input
                                            required
                                            type="text"
                                            value={formData.title}
                                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                                            className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-lg font-black outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all placeholder:text-gray-200"
                                            placeholder="Título impactante..."
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">URL da Imagem</label>
                                            <input
                                                required
                                                type="url"
                                                value={formData.imageUrl}
                                                onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                                                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all"
                                                placeholder="https://images.unsplash.com/..."
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Conteúdo do Artigo</label>
                                        <textarea
                                            required
                                            rows={12}
                                            value={formData.content}
                                            onChange={e => setFormData({ ...formData, content: e.target.value })}
                                            className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all resize-none italic"
                                            placeholder="Escreva aqui o seu texto..."
                                        />
                                    </div>
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
                                    {editingPost ? 'Atualizar Artigo' : 'Publicar Artigo'}
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Search */}
            <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
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

            {/* Blog Posts List */}
            {loading ? (
                <div className="h-64 flex flex-col items-center justify-center gap-4 text-gray-400">
                    <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
                    <span className="text-xs font-bold uppercase tracking-widest">A carregar artigos...</span>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <AnimatePresence mode="popLayout">
                        {filteredPosts.map((post, index) => (
                            <motion.div
                                key={post.id}
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: index * 0.05 }}
                                className="group bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500 overflow-hidden flex flex-col"
                            >
                                {/* Post Image Preview */}
                                <div className="h-48 bg-gray-100 relative overflow-hidden shrink-0">
                                    {post.imageUrl ? (
                                        <img src={post.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                            <ImageIcon className="w-10 h-10" />
                                        </div>
                                    )}
                                    <div className="absolute top-4 left-4">
                                        <div className="px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[8px] font-black uppercase tracking-widest text-brand-dark shadow-sm">
                                            {new Date(post.date).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-8 flex-1 flex flex-col">
                                    <h3 className="text-xl font-black text-brand-dark mb-4 group-hover:text-brand-primary transition-colors line-clamp-2">
                                        {post.title}
                                    </h3>

                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                                            <User className="w-4 h-4" />
                                        </div>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{post.author}</span>
                                    </div>

                                    {/* Actions & Stats */}
                                    <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-1.5 text-gray-300">
                                                <ThumbsUp className="w-3.5 h-3.5" />
                                                <span className="text-[10px] font-black text-gray-400">{post.likesCount || 0}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-gray-300">
                                                <MessageCircle className="w-3.5 h-3.5" />
                                                <span className="text-[10px] font-black text-gray-400">{post.commentsCount || 0}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleOpenModal(post)}
                                                className="p-3 bg-gray-50 hover:bg-brand-dark hover:text-white rounded-xl transition-all"
                                                title="Editar Artigo"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(post.id, post.title)}
                                                className="p-3 bg-gray-50 hover:bg-red-500 hover:text-white rounded-xl transition-all text-red-500"
                                                title="Eliminar Artigo"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {!loading && filteredPosts.length === 0 && (
                <div className="py-20 text-center">
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Nenhum artigo encontrado</p>
                </div>
            )}
        </div>
    );
};

export default AdminBlog;
