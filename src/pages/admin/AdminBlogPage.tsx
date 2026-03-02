import React, { useState, useEffect } from 'react';
import { motion as m, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, Calendar, MapPin, X, Plus, Loader2, Send, Search, Trash2, Type, Zap } from 'lucide-react';
import { BlogPost } from '../../types';
import { saveBlogPost, deleteBlogPost } from '../../services/dataService';
import { useToast } from '../../components/Toast';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';

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

const AdminBlogPage: React.FC<AdminBlogTabProps> = ({ posts: initialPosts, onRefresh }) => {
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
        <div className="space-y-6">
            <AdminPageHeader title="Blog & Notícias" subtitle="Publicações e eventos" highlight="Conteúdo">
                <input
                    type="text"
                    placeholder="Pesquisar no feed..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full sm:w-64 pl-4 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-slate-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                />
            </AdminPageHeader>

            {/* Creation Console */}
            <m.div
                layout
                className="bg-white rounded-xl border border-gray-200 p-6 overflow-hidden shadow-sm relative group/console"
            >
                {!isCreating ? (
                    <div className="flex items-center gap-4 relative z-10">
                        <div className="w-12 h-12 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center flex-shrink-0 group-hover/console:border-brand-primary/30 transition-colors">
                            <Plus className="w-6 h-6 text-brand-primary" />
                        </div>
                        <button
                            onClick={() => setIsCreating(true)}
                            className="flex-1 text-left px-6 py-4 bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 font-medium text-sm transition-all border border-transparent"
                        >
                            Escreva algo para o feed ou agende um evento...
                        </button>
                    </div>
                ) : (
                    <m.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-6 relative z-10"
                    >
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex bg-gray-100 p-1 rounded-lg w-fit">
                                <button
                                    onClick={() => setContentType('post')}
                                    className={`px-6 py-2 rounded-md text-xs font-semibold transition-all ${contentType === 'post'
                                        ? 'bg-white text-brand-primary shadow-sm border border-gray-200'
                                        : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    Notícia
                                </button>
                                <button
                                    onClick={() => setContentType('event')}
                                    className={`px-6 py-2 rounded-md text-xs font-semibold transition-all ${contentType === 'event'
                                        ? 'bg-white text-brand-primary shadow-sm border border-gray-200'
                                        : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    Evento
                                </button>
                            </div>
                            <button
                                onClick={() => setIsCreating(false)}
                                title="Cancelar"
                                className="p-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {contentType === 'post' && (
                            <div className="space-y-6">
                                <Textarea
                                    value={postContent}
                                    onChange={(e) => setPostContent(e.target.value)}
                                    placeholder="Qual é a novidade?"
                                    className="h-48 text-lg font-medium placeholder:text-gray-400 border border-gray-200 bg-gray-50/50 rounded-xl"
                                />

                                <Input
                                    label="Imagem (URL)"
                                    icon={<ImageIcon className="w-4 h-4" />}
                                    value={postImage}
                                    onChange={(e) => setPostImage(e.target.value)}
                                    placeholder="https://images.unsplash.com/..."
                                    className="rounded-lg"
                                />

                                {postImage && (
                                    <m.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="relative rounded-xl overflow-hidden aspect-video border border-gray-200 shadow-sm"
                                    >
                                        <img src={postImage} alt="Preview" className="w-full h-full object-cover" />
                                        <button
                                            onClick={() => setPostImage('')}
                                            title="Remover Imagem"
                                            className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-lg shadow-lg hover:bg-red-600 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </m.div>
                                )}

                                <Button
                                    onClick={handleCreatePost}
                                    disabled={isSubmitting}
                                    isLoading={isSubmitting}
                                    className="w-full py-4 rounded-lg font-semibold"
                                >
                                    Publicar Notícia
                                </Button>
                            </div>
                        )}

                        {contentType === 'event' && (
                            <div className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <Input
                                        label="Título do Evento"
                                        value={eventData.title}
                                        onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
                                        placeholder="Ex: Noite de Autógrafos"
                                        className="rounded-lg"
                                    />
                                    <Input
                                        label="Localização"
                                        icon={<MapPin className="w-4 h-4" />}
                                        value={eventData.location}
                                        onChange={(e) => setEventData({ ...eventData, location: e.target.value })}
                                        placeholder="Local do evento..."
                                        className="rounded-lg"
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <Input
                                        type="date"
                                        label="Data"
                                        value={eventData.date}
                                        onChange={(e) => setEventData({ ...eventData, date: e.target.value })}
                                        className="rounded-lg"
                                    />
                                    <Input
                                        type="time"
                                        label="Horário"
                                        value={eventData.time}
                                        onChange={(e) => setEventData({ ...eventData, time: e.target.value })}
                                        className="rounded-lg"
                                    />
                                </div>

                                <Textarea
                                    label="Descrição"
                                    value={eventData.description}
                                    onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
                                    className="h-32 rounded-lg"
                                />

                                <Input
                                    label="Thumbnail do Evento (URL)"
                                    value={eventData.imageUrl}
                                    onChange={(e) => setEventData({ ...eventData, imageUrl: e.target.value })}
                                    placeholder="https://images.unsplash.com/..."
                                    className="rounded-lg"
                                />

                                <Button
                                    onClick={handleCreateEvent}
                                    disabled={isSubmitting}
                                    isLoading={isSubmitting}
                                    className="w-full py-4 rounded-lg font-semibold"
                                >
                                    Criar Evento
                                </Button>
                            </div>
                        )}
                    </m.div>
                )}
            </m.div>

            {/* Timeline Section */}
            <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-2">
                        <Type className="w-5 h-5 text-brand-primary" />
                        <h3 className="text-lg font-bold text-gray-900">Feed de Actividade</h3>
                    </div>
                    <div className="px-3 py-1 bg-gray-100 border border-gray-200 rounded-full text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                        {filteredPosts.length} Publicações
                    </div>
                </div>

                <div className="grid gap-6">
                    <AnimatePresence mode="popLayout">
                        {filteredPosts.map((post, idx) => (
                            <m.div
                                key={post.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: idx * 0.05 }}
                                className="bg-white rounded-xl border border-gray-200 overflow-hidden group/item relative shadow-sm"
                            >
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-brand-primary/10 rounded-lg flex items-center justify-center font-bold text-brand-primary text-sm">
                                                EG
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900 text-sm tracking-tight">{post.author}</p>
                                                <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-medium">
                                                    <Calendar className="w-3 h-3" />
                                                    {new Date(post.date).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleDelete(post.id)}
                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                                                title="Eliminar"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-xl font-bold text-gray-900 mb-2 leading-tight">{post.title}</h4>
                                        <p className="text-gray-600 font-medium text-sm leading-relaxed mb-6 whitespace-pre-wrap max-w-4xl">{post.content}</p>

                                        {post.imageUrl && (
                                            <div className="relative rounded-lg overflow-hidden aspect-[21/9] bg-gray-100 border border-gray-200">
                                                <img
                                                    src={post.imageUrl}
                                                    alt={post.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </m.div>
                        ))}
                    </AnimatePresence>

                    {filteredPosts.length === 0 && (
                        <div className="py-24 text-center space-y-4">
                            <Plus className="w-12 h-12 mx-auto text-gray-200" />
                            <p className="font-semibold text-gray-400 text-sm">O feed está em standby</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminBlogPage;

