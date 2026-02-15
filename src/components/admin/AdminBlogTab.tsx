import React, { useState, useEffect } from 'react';
import { motion as m, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, Calendar, MapPin, Users, X, Plus, Loader2, Send, Search, Trash2, Type, Zap } from 'lucide-react';
import { BlogPost } from '../../types';
import { saveBlogPost, deleteBlogPost } from '../../services/dataService';
import { useToast } from '../Toast';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';

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
        <div className="max-w-5xl mx-auto space-y-12">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-8 bg-brand-primary rounded-full shadow-[0_0_15px_rgba(189,147,56,0.5)]" />
                        <h2 className="text-3xl font-black text-white tracking-tighter uppercase mb-0">Gestão de <span className="text-brand-primary italic font-light lowercase">Conteúdo</span></h2>
                    </div>
                    <p className="text-gray-500 font-bold text-xs uppercase tracking-widest pl-4">Editor de Terminais e Eventos</p>
                </div>

                <div className="relative group w-full md:w-80">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-brand-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="PESQUISAR NO FEED..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/5 focus:border-brand-primary/20 focus:bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white outline-none transition-all shadow-xl"
                    />
                </div>
            </div>

            {/* Creation Console */}
            <m.div
                layout
                className="bg-white/5 rounded-[2.5rem] border border-white/5 p-10 overflow-hidden shadow-2xl relative group/console"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />

                {!isCreating ? (
                    <div className="flex items-center gap-8 relative z-10">
                        <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-[1.5rem] flex items-center justify-center flex-shrink-0 group-hover/console:border-brand-primary/30 transition-colors">
                            <Plus className="w-8 h-8 text-brand-primary" />
                        </div>
                        <button
                            onClick={() => setIsCreating(true)}
                            className="flex-1 text-left px-10 py-6 bg-white/[0.03] hover:bg-white/[0.05] rounded-[2rem] text-gray-500 hover:text-gray-300 font-black text-[11px] uppercase tracking-[0.2em] transition-all border border-transparent hover:border-white/5"
                        >
                            INICIAR NOVA TRANSMISSÃO PARA O FEED...
                        </button>
                    </div>
                ) : (
                    <m.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-10 relative z-10"
                    >
                        <div className="flex items-center justify-between gap-6">
                            <div className="flex bg-white/5 p-1.5 rounded-2xl w-fit border border-white/5">
                                <button
                                    onClick={() => setContentType('post')}
                                    className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${contentType === 'post'
                                        ? 'bg-brand-primary text-white shadow-xl shadow-brand-primary/20'
                                        : 'text-gray-500 hover:text-white'
                                        }`}
                                >
                                    Log de Notícias
                                </button>
                                <button
                                    onClick={() => setContentType('event')}
                                    className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${contentType === 'event'
                                        ? 'bg-brand-primary text-white shadow-xl shadow-brand-primary/20'
                                        : 'text-gray-500 hover:text-white'
                                        }`}
                                >
                                    Agendamento
                                </button>
                            </div>
                            <button
                                onClick={() => setIsCreating(false)}
                                title="Fechar Terminal"
                                aria-label="Fechar Terminal"
                                className="w-12 h-12 flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-gray-500 hover:text-white transition-all group/close"
                            >
                                <X className="w-5 h-5 transition-transform group-hover/close:rotate-90" />
                            </button>
                        </div>

                        {contentType === 'post' && (
                            <div className="space-y-10">
                                <Textarea
                                    variant="glass"
                                    value={postContent}
                                    onChange={(e) => setPostContent(e.target.value)}
                                    placeholder="QUAL A NOVIDADE DO DIA?"
                                    className="h-64 text-2xl font-black placeholder:text-gray-800 border-none bg-transparent pt-0"
                                />

                                <Input
                                    label="MEDIA ASSET (URL)"
                                    variant="glass"
                                    icon={<ImageIcon className="w-4 h-4" />}
                                    value={postImage}
                                    onChange={(e) => setPostImage(e.target.value)}
                                    placeholder="HTTPS://IMAGES.UNSPLASH.COM/..."
                                />

                                {postImage && (
                                    <m.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="relative rounded-[2.5rem] overflow-hidden aspect-video border border-white/10 group/preview shadow-2xl"
                                    >
                                        <img src={postImage} alt="Preview Asset" className="w-full h-full object-cover transition-transform duration-1000 group-hover/preview:scale-105" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                            <button
                                                onClick={() => setPostImage('')}
                                                className="bg-red-500 text-white p-5 rounded-full shadow-2xl hover:scale-110 transition-all border border-red-400/50"
                                                title="Remover Asset"
                                                aria-label="Remover Asset"
                                            >
                                                <Trash2 className="w-6 h-6" />
                                            </button>
                                        </div>
                                    </m.div>
                                )}

                                <Button
                                    onClick={handleCreatePost}
                                    disabled={isSubmitting}
                                    isLoading={isSubmitting}
                                    className="w-full py-6 rounded-[1.5rem]"
                                    leftIcon={!isSubmitting && <Send className="w-4 h-4" />}
                                >
                                    Transmitir Publicação
                                </Button>
                            </div>
                        )}

                        {contentType === 'event' && (
                            <div className="space-y-10">
                                <div className="grid md:grid-cols-2 gap-10">
                                    <Input
                                        label="DESIGNAÇÃO DO EVENTO"
                                        variant="glass"
                                        value={eventData.title}
                                        onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
                                        placeholder="EX: NOITE DE AUTÓGRAFOS"
                                    />
                                    <Input
                                        label="LOCALIZAÇÃO / COORDENADAS"
                                        variant="glass"
                                        icon={<MapPin className="w-4 h-4" />}
                                        value={eventData.location}
                                        onChange={(e) => setEventData({ ...eventData, location: e.target.value })}
                                        placeholder="LOCAL DO EVENTO..."
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-10">
                                    <Input
                                        type="date"
                                        label="DATA DO SISTEMA"
                                        variant="glass"
                                        value={eventData.date}
                                        onChange={(e) => setEventData({ ...eventData, date: e.target.value })}
                                    />
                                    <Input
                                        type="time"
                                        label="THRONOS (TIME)"
                                        variant="glass"
                                        value={eventData.time}
                                        onChange={(e) => setEventData({ ...eventData, time: e.target.value })}
                                    />
                                </div>

                                <Textarea
                                    label="SÍNTESE DA MISSÃO"
                                    variant="glass"
                                    value={eventData.description}
                                    onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
                                    className="h-32"
                                />

                                <Input
                                    label="ASSET VISUAL DO EVENTO"
                                    variant="glass"
                                    value={eventData.imageUrl}
                                    onChange={(e) => setEventData({ ...eventData, imageUrl: e.target.value })}
                                    placeholder="URL DA IMAGEM OPTIMIZADA..."
                                />

                                <Button
                                    onClick={handleCreateEvent}
                                    disabled={isSubmitting}
                                    isLoading={isSubmitting}
                                    className="w-full py-6 rounded-[1.5rem]"
                                    leftIcon={!isSubmitting && <Zap className="w-4 h-4" />}
                                >
                                    Marcar no Calendário Global
                                </Button>
                            </div>
                        )}
                    </m.div>
                )}
            </m.div>

            {/* Timeline Section */}
            <div className="space-y-10">
                <div className="flex items-center justify-between px-6">
                    <div className="flex items-center gap-4">
                        <Type className="w-5 h-5 text-brand-primary" />
                        <h3 className="text-xl font-black text-white tracking-widest uppercase">Timeline de Missões</h3>
                    </div>
                    <div className="px-5 py-2 bg-white/5 border border-white/5 rounded-full text-[9px] font-black text-gray-600 uppercase tracking-[0.4em]">
                        {filteredPosts.length} Entradas Activas
                    </div>
                </div>

                <div className="grid gap-10">
                    <AnimatePresence mode="popLayout">
                        {filteredPosts.map((post, idx) => (
                            <m.div
                                key={post.id}
                                layout
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: idx * 0.05 }}
                                className="bg-white/5 rounded-[3rem] border border-white/5 overflow-hidden group/item relative shadow-2xl"
                            >
                                <div className="p-12">
                                    <div className="flex items-center justify-between mb-10 relative z-10">
                                        <div className="flex items-center gap-6">
                                            <div className="w-14 h-14 bg-gradient-to-br from-brand-primary to-brand-primary/40 rounded-2xl flex items-center justify-center font-black text-white text-xl shadow-lg">
                                                EG
                                            </div>
                                            <div>
                                                <p className="font-black text-white text-[11px] uppercase tracking-[0.2em] mb-1">{post.author}</p>
                                                <div className="flex items-center gap-2 text-[10px] text-gray-500 font-black uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full">
                                                    <Calendar className="w-3 h-3 text-brand-primary" />
                                                    {new Date(post.date).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => handleDelete(post.id)}
                                                className="w-12 h-12 flex items-center justify-center bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all border border-red-500/10 shadow-lg group/trash"
                                                title="Eliminar Publicação"
                                                aria-label="Eliminar Publicação"
                                            >
                                                <Trash2 className="w-5 h-5 transition-transform group-hover/trash:scale-110" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="relative z-10">
                                        <h4 className="text-3xl font-black text-white tracking-tighter mb-6 leading-none group-hover/item:text-brand-primary transition-colors">{post.title}</h4>
                                        <p className="text-gray-400 font-medium text-[15px] leading-relaxed mb-10 whitespace-pre-wrap max-w-3xl italic">{post.content}</p>

                                        {post.imageUrl && (
                                            <div className="relative rounded-[3rem] overflow-hidden aspect-[21/9] bg-white/5 border border-white/5 shadow-inner group/asset">
                                                <img
                                                    src={post.imageUrl}
                                                    alt={post.title}
                                                    className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover/asset:scale-110 grayscale-[0.5] group-hover/asset:grayscale-0"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-bottom p-10 opacity-0 group-hover/asset:opacity-100 transition-opacity">
                                                    <div className="mt-auto">
                                                        <span className="bg-brand-primary text-white text-[9px] font-black px-4 py-2 rounded-lg uppercase tracking-widest shadow-2xl">Visual Asset Verified</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </m.div>
                        ))}
                    </AnimatePresence>

                    {filteredPosts.length === 0 && (
                        <div className="py-40 text-center space-y-8 opacity-10">
                            <Plus className="w-24 h-24 mx-auto text-brand-primary" />
                            <p className="font-black uppercase tracking-[0.5em] text-[11px]">Sistema de Feed em Standby</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminBlogTab;

