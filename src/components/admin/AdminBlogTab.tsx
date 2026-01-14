import React, { useState } from 'react';
import { Image, Calendar, MapPin, Users, X, Plus, Smile } from 'lucide-react';
import { BlogPost } from '../../types';
import { saveBlogPost } from '../../services/dataService';
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

const AdminBlogTab: React.FC<AdminBlogTabProps> = ({ posts, onRefresh }) => {
    const { showToast } = useToast();
    const [contentType, setContentType] = useState<ContentType>('post');
    const [isCreating, setIsCreating] = useState(false);

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

    const handleCreatePost = async () => {
        if (!postContent.trim()) {
            showToast('Por favor, escreva algo para publicar', 'error');
            return;
        }

        try {
            const newPost: BlogPost = {
                id: `temp_${Date.now()}`,
                title: postContent.substring(0, 100),
                content: postContent,
                imageUrl: postImage || 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=500&fit=crop',
                date: new Date().toISOString(),
                author: 'Editora Graça'
            };

            await saveBlogPost(newPost);
            showToast('Post publicado com sucesso!', 'success');
            setPostContent('');
            setPostImage('');
            setIsCreating(false);
            onRefresh();
        } catch (error) {
            showToast('Erro ao publicar post', 'error');
        }
    };

    const handleCreateEvent = async () => {
        if (!eventData.title || !eventData.date) {
            showToast('Preencha pelo menos o título e a data do evento', 'error');
            return;
        }

        try {
            // Create event as a special blog post with event metadata
            const eventPost: BlogPost = {
                id: `temp_${Date.now()}`,
                title: `📅 ${eventData.title}`,
                content: `${eventData.description}\n\n📍 Local: ${eventData.location}\n🕐 Horário: ${eventData.time}`,
                imageUrl: eventData.imageUrl || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=500&fit=crop',
                date: eventData.date,
                author: 'Editora Graça'
            };

            await saveBlogPost(eventPost);
            showToast('Evento criado com sucesso!', 'success');
            setEventData({ title: '', date: '', time: '', location: '', description: '', imageUrl: '' });
            setIsCreating(false);
            onRefresh();
        } catch (error) {
            showToast('Erro ao criar evento', 'error');
        }
    };

    return (
        <div className="space-y-6">
            {/* Create Post/Event Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                {!isCreating ? (
                    <button
                        onClick={() => setIsCreating(true)}
                        className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
                    >
                        No que está a pensar, Administrador?
                    </button>
                ) : (
                    <div className="space-y-4">
                        {/* Content Type Selector */}
                        <div className="flex gap-2 border-b border-gray-200 pb-4">
                            <button
                                onClick={() => setContentType('post')}
                                className={`flex-1 py-2 px-4 rounded-lg font-bold transition-colors ${contentType === 'post'
                                    ? 'bg-brand-primary text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                Criar Post
                            </button>
                            <button
                                onClick={() => setContentType('event')}
                                className={`flex-1 py-2 px-4 rounded-lg font-bold transition-colors ${contentType === 'event'
                                    ? 'bg-brand-primary text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                Criar Evento
                            </button>
                        </div>

                        {/* Post Form */}
                        {contentType === 'post' && (
                            <div className="space-y-4">
                                <textarea
                                    value={postContent}
                                    onChange={(e) => setPostContent(e.target.value)}
                                    placeholder="No que está a pensar?"
                                    className="w-full p-4 border-0 resize-none focus:outline-none text-lg"
                                    rows={4}
                                />

                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-gray-700">URL da Imagem (opcional)</label>
                                    <input
                                        type="url"
                                        value={postImage}
                                        onChange={(e) => setPostImage(e.target.value)}
                                        placeholder="https://exemplo.com/imagem.jpg"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                                    />
                                </div>

                                {postImage && (
                                    <div className="relative rounded-lg overflow-hidden">
                                        <img src={postImage} alt="Preview" className="w-full h-64 object-cover" />
                                        <button
                                            onClick={() => setPostImage('')}
                                            className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
                                            aria-label="Remover imagem"
                                            title="Remover imagem"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}

                                <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                                    <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors">
                                        <Image className="w-5 h-5 text-green-600" />
                                        <span className="text-sm font-bold text-gray-700">Foto</span>
                                    </button>
                                    <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors">
                                        <Smile className="w-5 h-5 text-yellow-600" />
                                        <span className="text-sm font-bold text-gray-700">Sentimento</span>
                                    </button>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setIsCreating(false)}
                                        className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg font-bold text-gray-700 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleCreatePost}
                                        className="flex-1 py-3 bg-brand-primary hover:bg-brand-primary/90 rounded-lg font-bold text-white transition-colors"
                                    >
                                        Publicar
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Event Form */}
                        {contentType === 'event' && (
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    value={eventData.title}
                                    onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
                                    placeholder="Nome do evento"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary text-lg font-bold"
                                />

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Data</label>
                                        <input
                                            type="date"
                                            value={eventData.date}
                                            onChange={(e) => setEventData({ ...eventData, date: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Horário</label>
                                        <input
                                            type="time"
                                            value={eventData.time}
                                            onChange={(e) => setEventData({ ...eventData, time: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Local</label>
                                    <input
                                        type="text"
                                        value={eventData.location}
                                        onChange={(e) => setEventData({ ...eventData, location: e.target.value })}
                                        placeholder="Onde será o evento?"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Descrição</label>
                                    <textarea
                                        value={eventData.description}
                                        onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
                                        placeholder="Descreva o evento..."
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary resize-none"
                                        rows={4}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">URL da Imagem</label>
                                    <input
                                        type="url"
                                        value={eventData.imageUrl}
                                        onChange={(e) => setEventData({ ...eventData, imageUrl: e.target.value })}
                                        placeholder="https://exemplo.com/imagem.jpg"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                                    />
                                </div>

                                {eventData.imageUrl && (
                                    <div className="relative rounded-lg overflow-hidden">
                                        <img src={eventData.imageUrl} alt="Preview" className="w-full h-64 object-cover" />
                                    </div>
                                )}

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setIsCreating(false)}
                                        className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg font-bold text-gray-700 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleCreateEvent}
                                        className="flex-1 py-3 bg-brand-primary hover:bg-brand-primary/90 rounded-lg font-bold text-white transition-colors"
                                    >
                                        Criar Evento
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Posts List */}
            <div className="space-y-4">
                <h3 className="text-xl font-black text-brand-dark">Posts Publicados ({posts.length})</h3>
                {posts.map((post) => (
                    <div key={post.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-brand-primary/10 rounded-full flex items-center justify-center">
                                    <Users className="w-5 h-5 text-brand-primary" />
                                </div>
                                <div>
                                    <p className="font-bold text-brand-dark">{post.author}</p>
                                    <p className="text-xs text-gray-500">{new Date(post.date).toLocaleDateString('pt-PT')}</p>
                                </div>
                            </div>
                            <h4 className="font-bold text-lg mb-2">{post.title}</h4>
                            <p className="text-gray-600 line-clamp-2">{post.content}</p>
                        </div>
                        {post.imageUrl && (
                            <img src={post.imageUrl} alt={post.title} className="w-full h-64 object-cover" />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminBlogTab;
