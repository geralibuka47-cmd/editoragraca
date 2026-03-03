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
    const { showToast } = useToast();

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
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author.toLowerCase().includes(searchTerm.toLowerCase())
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
                <button className="flex items-center gap-2 px-6 py-4 bg-brand-dark text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-brand-primary transition-all shadow-xl shadow-brand-dark/20 group">
                    <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                    Novo Artigo
                </button>
            </div>

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
                                            <button className="p-3 bg-gray-50 hover:bg-brand-dark hover:text-white rounded-xl transition-all" title="Editar Artigo">
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
