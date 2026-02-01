import React, { useState, useEffect } from 'react';
import { motion as m, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, Calendar, MapPin, Users, X, Plus, Smile, Loader2, Send, Search, Trash2, Edit3, MoreHorizontal } from 'lucide-react';
import { BlogPost } from '../../types';
import { saveBlogPost, deleteBlogPost } from '../../services/dataService';
import { useToast } from '../Toast';

interface AdminBlogTabProps {
    posts: BlogPost[];
    onRefresh: () => void;
}

type ContentType = 'post' | 'event';

interface EventData {
    title: string;
    date: string;
    time: string;
    location: string;
    description: string;
    imageUrl: string;
}

const AdminBlogTab: React.FC<AdminBlogTabProps> = ({ posts: initialPosts, onRefresh }) => {
    const { showToast } = useToast();
    const [contentType, setContentType] = useState<ContentType>('post');
    const [isCreating, setIsCreating] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>(initialPosts);

    // Post state
    const [postContent, setPostContent] = useState('');
    const [postImage, setPostImage] = useState('');

    // Event state
    const [eventData, setEventData] = useState<EventData>({
        title: '',
        date: '',
        time: '',
        location: '',
        description: '',
        imageUrl: ''
    });

    useEffect(() => {
        const query = searchQuery.toLowerCase();
        setFilteredPosts(
            initialPosts.filter(p =>
                p.title.toLowerCase().includes(query) ||
                p.content.toLowerCase().includes(query)
            )
        );
    }, [searchQuery, initialPosts]);

    const handleCreatePost = async () => {
        if (!postContent.trim()) {
            showToast('Por favor, escreva algo para publicar', 'error');
            return;
        }

        setIsSubmitting(true);
        try {
            const newPost: BlogPost = {
                id: `post_${Date.now()}`,
                title: postContent.trim().substring(0, 100).split('\n')[0],
                content: postContent.trim(),
                imageUrl: postImage.trim() || 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=500&fit=crop',
                date: new Date().toISOString(),
                author: 'Editora Graça'
            };

            await saveBlogPost(newPost);
            showToast('Post publicado com sucesso!', 'success');
            setPostContent('');
            setPostImage('');
            setIsCreating(false);
            onRefresh();
        } catch (error: any) {
            console.error('Erro ao publicar post:', error);
            showToast('Erro ao publicar post. Tente novamente.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCreateEvent = async () => {
        if (!eventData.title || !eventData.date) {
            showToast('Preencha pelo menos o título e a data do evento', 'error');
            return;
        }

        setIsSubmitting(true);
        try {
            const eventPost: BlogPost = {
                id: `event_${Date.now()}`,
                title: `📅 ${eventData.title.trim()}`,
                content: `${eventData.description.trim()}\n\n📍 Local: ${eventData.location.trim()}\n🕐 Horário: ${eventData.time.trim()}`,
                imageUrl: eventData.imageUrl.trim() || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=500&fit=crop',
                date: eventData.date,
                author: 'Editora Graça'
            };

            await saveBlogPost(eventPost);
            showToast('Evento criado com sucesso!', 'success');
            setEventData({ title: '', date: '', time: '', location: '', description: '', imageUrl: '' });
            setIsCreating(false);
            onRefresh();
        } catch (error: any) {
            console.error('Erro ao criar evento:', error);
            showToast('Erro ao criar evento. Tente novamente.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Tem certeza que deseja excluir esta publicação?')) {
            try {
                await deleteBlogPost(id);
                showToast('Publicação excluída com sucesso!', 'success');
                onRefresh();
            } catch (error) {
                showToast('Erro ao excluir publicação.', 'error');
            }
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-12">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-4xl font-black text-brand-dark tracking-tighter uppercase mb-2">Editor de <span className="text-brand-primary lowercase italic font-light text-5xl">Feed</span></h2>
                    <p className="text-gray-400 font-bold text-sm italic">Crie conexões reais com a sua comunidade de leitores.</p>
                </div>

                <div className="relative group w-full md:w-72">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-brand-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Pesquisar publicações..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-6 py-4 bg-white border border-gray-100 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest outline-none transition-all shadow-sm focus:shadow-md"
                    />
                </div>
            </div>

            {/* Create Post/Event Section */}
            <m.div
                layout
                className="bg-white rounded-[2.5rem] shadow-2xl shadow-brand-dark/5 border border-gray-100 p-8 overflow-hidden transition-all"
            >
                {!isCreating ? (
                    <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-brand-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0 animate-pulse">
                            <Plus className="w-6 h-6 text-brand-primary" />
                        </div>
                        <button
                            onClick={() => setIsCreating(true)}
                            className="flex-1 text-left px-8 py-5 bg-gray-50/50 hover:bg-gray-50 rounded-[1.5rem] text-gray-400 font-bold text-sm transition-all border border-transparent hover:border-gray-100"
                        >
                            No que está a pensar hoje, Administrador?
                        </button>
                    </div>
                ) : (
                    <m.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                    >
                        {/* Header of creation */}
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex bg-gray-50/50 p-1.5 rounded-2xl w-fit">
                                <button
                                    onClick={() => setContentType('post')}
                                    className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${contentType === 'post'
                                        ? 'bg-white text-brand-dark shadow-sm'
                                        : 'text-gray-400 hover:text-gray-600'
                                        }`}
                                >
                                    Publicação
                                </button>
                                <button
                                    onClick={() => setContentType('event')}
                                    className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${contentType === 'event'
                                        ? 'bg-white text-brand-dark shadow-sm'
                                        : 'text-gray-400 hover:text-gray-600'
                                        }`}
                                >
                                    Evento
                                </button>
                            </div>
                            <button
                                onClick={() => setIsCreating(false)}
                                className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-full text-gray-400 hover:text-brand-dark transition-all"
                                title="Fechar editor"
                                aria-label="Fechar editor"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Post Form */}
                        {contentType === 'post' && (
                            <div className="space-y-6">
                                <textarea
                                    id="blog-content"
                                    value={postContent}
                                    onChange={(e) => setPostContent(e.target.value)}
                                    placeholder="Escreva algo inspirador..."
                                    autoFocus
                                    className="w-full h-40 bg-transparent text-xl font-medium placeholder:text-gray-200 outline-none resize-none border-b border-gray-50 pb-4"
                                />

                                <div className="space-y-2">
                                    <label htmlFor="blog-image" className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Link da Imagem (Unsplash, etc)</label>
                                    <div className="relative">
                                        <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                        <input
                                            id="blog-image"
                                            type="url"
                                            value={postImage}
                                            onChange={(e) => setPostImage(e.target.value)}
                                            placeholder="https://images.unsplash.com/..."
                                            className="w-full pl-12 pr-6 py-4 bg-gray-50/50 rounded-2xl border-2 border-transparent focus:border-brand-primary/20 focus:bg-white outline-none transition-all text-xs font-bold text-gray-600"
                                        />
                                    </div>
                                </div>

                                {postImage && (
                                    <m.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="relative rounded-[2rem] overflow-hidden aspect-video group"
                                    >
                                        <img src={postImage} alt="Preview" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                        <div className="absolute inset-0 bg-brand-dark/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button
                                                onClick={() => setPostImage('')}
                                                className="bg-white/90 backdrop-blur-md p-4 rounded-full shadow-2xl hover:bg-white transform hover:scale-110 transition-all"
                                                title="Remover imagem"
                                                aria-label="Remover imagem"
                                            >
                                                <Trash2 className="w-6 h-6 text-red-600" />
                                            </button>
                                        </div>
                                    </m.div>
                                )}

                                <div className="flex gap-4 pt-4">
                                    <m.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleCreatePost}
                                        disabled={isSubmitting}
                                        className="flex-1 btn-premium py-5 text-xs shadow-xl shadow-brand-primary/20"
                                    >
                                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Publicar no Feed</span>}
                                    </m.button>
                                </div>
                            </div>
                        )}

                        {/* Event Form */}
                        {contentType === 'event' && (
                            <div className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label htmlFor="event-title" className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Título do Evento</label>
                                        <input
                                            id="event-title"
                                            type="text"
                                            value={eventData.title}
                                            onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
                                            className="w-full px-6 py-4 bg-gray-50/50 rounded-2xl border-2 border-transparent focus:border-brand-primary/20 focus:bg-white outline-none transition-all font-black text-brand-dark"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="event-location" className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Local / Plataforma</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                            <input
                                                id="event-location"
                                                type="text"
                                                value={eventData.location}
                                                onChange={(e) => setEventData({ ...eventData, location: e.target.value })}
                                                className="w-full pl-12 pr-6 py-4 bg-gray-50/50 rounded-2xl border-2 border-transparent focus:border-brand-primary/20 focus:bg-white outline-none transition-all font-bold text-gray-600"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label htmlFor="event-date" className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Data</label>
                                        <input
                                            id="event-date"
                                            type="date"
                                            value={eventData.date}
                                            onChange={(e) => setEventData({ ...eventData, date: e.target.value })}
                                            className="w-full px-6 py-4 bg-gray-50/50 rounded-2xl border-2 border-transparent focus:border-brand-primary/20 focus:bg-white outline-none transition-all font-bold"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="event-time" className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Horário</label>
                                        <input
                                            id="event-time"
                                            type="time"
                                            value={eventData.time}
                                            onChange={(e) => setEventData({ ...eventData, time: e.target.value })}
                                            className="w-full px-6 py-4 bg-gray-50/50 rounded-2xl border-2 border-transparent focus:border-brand-primary/20 focus:bg-white outline-none transition-all font-bold"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="event-description" className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Descrição Curta</label>
                                    <textarea
                                        id="event-description"
                                        value={eventData.description}
                                        onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
                                        className="w-full h-24 bg-gray-50/50 rounded-2xl border-2 border-transparent focus:border-brand-primary/20 focus:bg-white outline-none transition-all p-6 resize-none font-medium"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="event-image" className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Banner do Evento</label>
                                    <input
                                        id="event-image"
                                        type="url"
                                        value={eventData.imageUrl}
                                        onChange={(e) => setEventData({ ...eventData, imageUrl: e.target.value })}
                                        placeholder="URL da imagem (1200x630 recomendado)"
                                        className="w-full px-6 py-4 bg-gray-50/50 rounded-2xl border-2 border-transparent focus:border-brand-primary/20 focus:bg-white outline-none transition-all text-xs font-bold"
                                    />
                                </div>

                                <m.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleCreateEvent}
                                    disabled={isSubmitting}
                                    className="w-full btn-premium py-5 text-xs shadow-xl shadow-brand-primary/20"
                                >
                                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Confirmar Evento</span>}
                                </m.button>
                            </div>
                        )}
                    </m.div>
                )}
            </m.div>

            {/* Posts Feed */}
            <div className="space-y-8 pb-20">
                <div className="flex items-center justify-between px-4">
                    <h3 className="text-xl font-black text-brand-dark tracking-tight">Timeline da Editora</h3>
                    <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        <MoreHorizontal className="w-4 h-4" />
                        Gerir Posts
                    </div>
                </div>

                <div className="space-y-6">
                    <AnimatePresence mode="popLayout">
                        {filteredPosts.map((post, idx) => (
                            <m.div
                                key={post.id}
                                layout
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: idx * 0.05 }}
                                className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-brand-dark/[0.02] overflow-hidden group"
                            >
                                <div className="p-8">
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-brand-primary/10 rounded-2xl flex items-center justify-center font-black text-brand-primary text-xl">
                                                EG
                                            </div>
                                            <div>
                                                <p className="font-black text-brand-dark text-sm">{post.author}</p>
                                                <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                                    <Calendar className="w-3 h-3" />
                                                    {new Date(post.date).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleDelete(post.id)}
                                                className="w-10 h-10 flex items-center justify-center bg-red-50 text-red-600 rounded-full hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                                title="Eliminar post"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <h4 className="text-2xl font-black text-brand-dark tracking-tighter mb-4 leading-tight">{post.title}</h4>
                                    <p className="text-gray-500 font-medium leading-relaxed mb-8 whitespace-pre-wrap">{post.content}</p>

                                    {post.imageUrl && (
                                        <div className="relative rounded-[2rem] overflow-hidden aspect-[16/9] bg-gray-100">
                                            <img
                                                src={post.imageUrl}
                                                alt={post.title}
                                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                            />
                                        </div>
                                    )}
                                </div>
                            </m.div>
                        ))}
                    </AnimatePresence>

                    {filteredPosts.length === 0 && (
                        <div className="py-20 text-center space-y-4 opacity-20 grayscale">
                            <Plus className="w-16 h-16 mx-auto" />
                            <p className="font-black uppercase tracking-[0.3em] text-[10px]">Nenhuma publicação disponível.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminBlogTab;
