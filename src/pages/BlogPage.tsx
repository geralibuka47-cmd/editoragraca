import React, { useEffect, useState } from 'react';
import { Heart, MessageCircle, Share2, BookOpen, Calendar, User, TrendingUp, Send, Play, Pause, Volume2, Clock, Loader2, ExternalLink, Mic } from 'lucide-react';
import { getBlogPosts, getBlogPostInteractions, toggleBlogPostLike, addBlogPostComment, checkUserLike } from '../services/dataService';
import { fetchPodcastEpisodes } from '../services/podcastService';
import { BlogPost, User as UserType, BlogComment, PodcastEpisode } from '../types';
import { OptimizedImage } from '../components/OptimizedImage';

interface BlogPageProps {
    user: UserType | null;
}

const BlogPage: React.FC<BlogPageProps> = ({ user }) => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
    const [postInteractions, setPostInteractions] = useState<Record<string, { likesCount: number, comments: BlogComment[], isLiked: boolean }>>({});
    const [commentText, setCommentText] = useState('');
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);

    // Podcast State
    const [activeTab, setActiveTab] = useState<'feed' | 'podcast'>('feed');
    const [episodes, setEpisodes] = useState<PodcastEpisode[]>([]);
    const [selectedEpisode, setSelectedEpisode] = useState<PodcastEpisode | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoadingPodcast, setIsLoadingPodcast] = useState(false);

    useEffect(() => {
        const loadPosts = async () => {
            setLoading(true);
            const data = await getBlogPosts();
            setPosts(data);

            // Load interactions for all posts
            const interactionData: Record<string, any> = {};
            await Promise.all(data.map(async (post) => {
                const interactions = await getBlogPostInteractions(post.id);
                const isLiked = user ? await checkUserLike(post.id, user.id) : false;
                interactionData[post.id] = { ...interactions, isLiked };
            }));
            setPostInteractions(interactionData);
            setLoading(false);
        };
        loadPosts();
    }, [user]);

    useEffect(() => {
        if (activeTab === 'podcast' && episodes.length === 0) {
            const loadEpisodes = async () => {
                setIsLoadingPodcast(true);
                try {
                    const data = await fetchPodcastEpisodes();
                    setEpisodes(data);
                    if (data.length > 0 && !selectedEpisode) {
                        setSelectedEpisode(data[0]);
                    }
                } catch (error) {
                    console.error("Erro ao carregar episódios:", error);
                } finally {
                    setIsLoadingPodcast(false);
                }
            };
            loadEpisodes();
        }
    }, [activeTab]);

    const currentEpisode = selectedEpisode || (episodes.length > 0 ? episodes[0] : null);

    const handleToggleLike = async (postId: string) => {
        if (!user) {
            alert('Por favor, inicie sessão para gostar deste artigo.');
            return;
        }

        const wasLiked = postInteractions[postId]?.isLiked;
        // Optimistic update
        setPostInteractions(prev => ({
            ...prev,
            [postId]: {
                ...prev[postId],
                isLiked: !wasLiked,
                likesCount: (prev[postId]?.likesCount || 0) + (wasLiked ? -1 : 1),
                comments: prev[postId]?.comments || []
            }
        }));

        await toggleBlogPostLike(postId, user.id);
    };

    const handleAddComment = async (postId: string) => {
        if (!user) {
            alert('Por favor, inicie sessão para comentar.');
            return;
        }
        if (!commentText.trim()) return;

        setIsSubmittingComment(true);
        try {
            await addBlogPostComment({
                postId,
                userId: user.id,
                userName: user.name,
                content: commentText.trim()
            });

            // Reload interactions for this post
            const interactions = await getBlogPostInteractions(postId);
            const isLiked = await checkUserLike(postId, user.id);
            setPostInteractions(prev => ({
                ...prev,
                [postId]: { ...interactions, isLiked }
            }));
            setCommentText('');
        } catch (error) {
            alert('Erro ao adicionar comentário.');
        } finally {
            setIsSubmittingComment(false);
        }
    };


    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <BookOpen className="w-12 h-12 text-brand-primary animate-pulse mx-auto mb-4" />
                    <p className="text-gray-500 font-serif italic">Carregando histórias...</p>
                </div>
            </div>
        );
    }

    if (selectedPost) {
        const interactions = postInteractions[selectedPost.id] || { likesCount: 0, comments: [], isLiked: false };

        return (
            <div className="min-h-screen bg-gray-50 pb-12">
                {/* Header Navigation */}
                <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
                    <div className="container mx-auto px-4 py-4 max-w-3xl">
                        <button
                            onClick={() => setSelectedPost(null)}
                            className="flex items-center gap-2 text-brand-dark hover:text-brand-primary font-bold transition-colors"
                        >
                            <span className="text-xl">←</span> Voltar ao Feed
                        </button>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-6 max-w-3xl">
                    <article className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        {/* Post Header */}
                        <div className="p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-brand-primary/10 rounded-full flex items-center justify-center">
                                    <User className="w-6 h-6 text-brand-primary" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-brand-dark text-lg">{selectedPost.author || 'Editora Graça'}</h3>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <Calendar className="w-4 h-4" />
                                        <span>{new Date(selectedPost.date).toLocaleDateString('pt-PT', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        })}</span>
                                        <span className="mx-1">•</span>
                                        <span className="flex items-center gap-1">🌐 Público</span>
                                    </div>
                                </div>
                            </div>

                            <h1 className="text-3xl md:text-4xl font-black text-brand-dark mb-6 leading-tight">
                                {selectedPost.title}
                            </h1>

                            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4 mb-8">
                                {selectedPost.content.split('\n').map((para, i) => (
                                    <p key={i}>{para}</p>
                                ))}
                            </div>
                        </div>

                        {/* Full Image */}
                        {selectedPost.imageUrl && (
                            <div className="w-full bg-gray-100 border-y border-gray-100 mb-6">
                                <OptimizedImage
                                    src={selectedPost.imageUrl}
                                    alt={selectedPost.title}
                                    className="w-full h-auto max-h-[600px] object-contain mx-auto"
                                />
                            </div>
                        )}

                        {/* Interaction Details */}
                        <div className="px-6 py-3 flex items-center justify-between text-gray-500 text-sm border-b border-gray-50">
                            <div className="flex items-center gap-2">
                                <div className="flex -space-x-1">
                                    <div className="w-5 h-5 bg-brand-primary rounded-full flex items-center justify-center border border-white">
                                        <Heart className="w-3 h-3 text-white fill-current" />
                                    </div>
                                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center border border-white">
                                        <TrendingUp className="w-3 h-3 text-white" />
                                    </div>
                                </div>
                                <span className="hover:underline cursor-pointer">
                                    {interactions.likesCount > 0
                                        ? `${interactions.isLiked ? 'Você e outras ' : ''}${interactions.likesCount} pessoas`
                                        : 'Seja o primeiro a gostar'}
                                </span>
                            </div>
                            <div className="flex gap-3">
                                <span className="hover:underline cursor-pointer">{interactions.comments.length} comentários</span>
                                <span className="hover:underline cursor-pointer">0 partilhas</span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="px-6 py-2">
                            <div className="flex items-center justify-between border-t border-b border-gray-100 py-1">
                                <button
                                    onClick={() => handleToggleLike(selectedPost.id)}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all ${interactions.isLiked
                                        ? 'text-brand-primary'
                                        : 'hover:bg-gray-100 text-gray-600'
                                        }`}
                                >
                                    <Heart className={`w-5 h-5 ${interactions.isLiked ? 'fill-current' : ''}`} />
                                    <span className="text-sm font-bold">Gosto</span>
                                </button>

                                <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-all font-bold text-sm">
                                    <MessageCircle className="w-5 h-5" />
                                    Comentar
                                </button>

                                <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-all font-bold text-sm">
                                    <Share2 className="w-5 h-5" />
                                    Partilhar
                                </button>
                            </div>
                        </div>

                        {/* Comments Section */}
                        <div className="p-6 bg-gray-50/50">
                            <div className="space-y-6 mb-6">
                                {interactions.comments.map((comment) => (
                                    <div key={comment.id} className="flex gap-3">
                                        <div className="w-8 h-8 bg-brand-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                            <User className="w-4 h-4 text-brand-primary" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="bg-white border border-gray-200 rounded-2xl px-4 py-2 inline-block max-w-full">
                                                <p className="font-bold text-sm text-brand-dark">{comment.userName}</p>
                                                <p className="text-sm text-gray-700">{comment.content}</p>
                                            </div>
                                            <div className="flex gap-4 mt-2 text-xs font-bold text-gray-500 px-2">
                                                <button className="hover:underline">Gosto</button>
                                                <button className="hover:underline">Responder</button>
                                                <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {interactions.comments.length === 0 && (
                                    <p className="text-center text-gray-400 text-sm italic py-4">Nenhum comentário ainda. Seja o primeiro!</p>
                                )}
                            </div>

                            {/* Comment Input */}
                            <div className="flex gap-3">
                                <div className="w-8 h-8 bg-brand-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                    <User className="w-4 h-4 text-brand-primary" />
                                </div>
                                <div className="flex-1 relative">
                                    <input
                                        type="text"
                                        placeholder={user ? "Escreva um comentário..." : "Inicie sessão para comentar"}
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                        disabled={!user || isSubmittingComment}
                                        onKeyDown={(e) => e.key === 'Enter' && handleAddComment(selectedPost.id)}
                                        className="w-full bg-gray-100 border-0 rounded-full px-4 py-2 pr-12 text-sm focus:ring-1 focus:ring-brand-primary disabled:opacity-50"
                                    />
                                    <button
                                        onClick={() => handleAddComment(selectedPost.id)}
                                        disabled={!user || isSubmittingComment || !commentText.trim()}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-brand-primary hover:bg-white rounded-full transition-colors disabled:opacity-50"
                                        title="Enviar comentário"
                                        aria-label="Enviar comentário"
                                    >
                                        <Send className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </article>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-black text-brand-dark tracking-tight">
                                Blog & <span className="text-brand-primary italic font-serif font-normal">Novidades</span>
                            </h1>
                            <p className="text-gray-500 mt-2">Explore o universo literário angolano nas nossas plataformas</p>
                        </div>
                        <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
                            <button
                                onClick={() => setActiveTab('feed')}
                                className={`px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest transition-all ${activeTab === 'feed' ? 'bg-white text-brand-primary shadow-sm' : 'text-gray-500 hover:text-brand-dark'}`}
                            >
                                <div className="flex items-center gap-2">
                                    <BookOpen className="w-4 h-4" />
                                    Feed
                                </div>
                            </button>
                            <button
                                onClick={() => setActiveTab('podcast')}
                                className={`px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest transition-all ${activeTab === 'podcast' ? 'bg-white text-brand-primary shadow-sm' : 'text-gray-500 hover:text-brand-dark'}`}
                            >
                                <div className="flex items-center gap-2">
                                    <Mic className="w-4 h-4" />
                                    Podcast
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {activeTab === 'feed' ? (
                /* Feed */
                <div className="container mx-auto px-4 py-8 max-w-3xl animate-in fade-in duration-500">
                    <div className="space-y-6">
                        {posts.map((post) => {
                            const interactions = postInteractions[post.id] || { likesCount: 0, comments: [], isLiked: false };

                            return (
                                <article
                                    key={post.id}
                                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                                >
                                    {/* Post Header */}
                                    <div className="p-6 pb-4">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-12 h-12 bg-brand-primary/10 rounded-full flex items-center justify-center">
                                                <User className="w-6 h-6 text-brand-primary" />
                                            </div>
                                            <div className="flex-1" onClick={() => setSelectedPost(post)}>
                                                <h3 className="font-bold text-brand-dark cursor-pointer hover:underline">{post.author || 'Editora Graça'}</h3>
                                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>{new Date(post.date).toLocaleDateString('pt-PT', {
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric'
                                                    })}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Post Title */}
                                        <h2
                                            onClick={() => setSelectedPost(post)}
                                            className="text-2xl font-black text-brand-dark mb-3 leading-tight cursor-pointer hover:text-brand-primary transition-colors"
                                        >
                                            {post.title}
                                        </h2>

                                        {/* Post Content Preview */}
                                        <p className="text-gray-600 leading-relaxed line-clamp-3">
                                            {post.content.substring(0, 200)}...
                                        </p>
                                    </div>

                                    {/* Post Image */}
                                    {post.imageUrl && (
                                        <div
                                            onClick={() => setSelectedPost(post)}
                                            className="relative w-full aspect-[16/9] bg-gray-100 cursor-pointer overflow-hidden"
                                        >
                                            <OptimizedImage
                                                src={post.imageUrl}
                                                alt={post.title}
                                                className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                                            />
                                        </div>
                                    )}

                                    {/* Interaction Bar */}
                                    <div className="px-6 py-4 border-t border-gray-100">
                                        <div className="flex items-center justify-between">
                                            <button
                                                onClick={() => handleToggleLike(post.id)}
                                                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all ${interactions.isLiked
                                                    ? 'bg-red-50 text-red-600'
                                                    : 'hover:bg-gray-50 text-gray-600'
                                                    }`}
                                            >
                                                <Heart
                                                    className={`w-5 h-5 ${interactions.isLiked ? 'fill-current' : ''}`}
                                                />
                                                <span className="text-sm font-bold">
                                                    {interactions.likesCount > 0 && `${interactions.likesCount} `}
                                                    {interactions.isLiked ? 'Gostei' : 'Gostar'}
                                                </span>
                                            </button>

                                            <button
                                                onClick={() => setSelectedPost(post)}
                                                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-gray-50 text-gray-600 transition-all font-bold text-sm"
                                            >
                                                <MessageCircle className="w-5 h-5" />
                                                {interactions.comments.length} Comentários
                                            </button>

                                            <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-gray-50 text-gray-600 transition-all font-bold text-sm">
                                                <Share2 className="w-5 h-5" />
                                                Partilhar
                                            </button>
                                        </div>
                                    </div>

                                    {/* Read More Button */}
                                    <div className="px-6 pb-6">
                                        <button
                                            onClick={() => setSelectedPost(post)}
                                            className="w-full py-3 bg-brand-light hover:bg-brand-primary/10 text-brand-primary font-bold rounded-xl transition-colors border border-brand-primary/5"
                                        >
                                            Ler Artigo Completo
                                        </button>
                                    </div>
                                </article>
                            );
                        })}

                        {posts.length === 0 && (
                            <div className="text-center py-20">
                                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-gray-400 mb-2">Nenhum artigo publicado</h3>
                                <p className="text-gray-400">Em breve teremos novidades literárias para partilhar!</p>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                /* Podcast Section */
                <div className="animate-in fade-in duration-500">
                    {/* Player */}
                    {currentEpisode && (
                        <div className="bg-white border-b border-gray-100 sticky top-[104px] md:top-[120px] z-10 shadow-sm py-8 md:py-10">
                            <div className="container mx-auto px-4 max-w-4xl">
                                <div className="flex flex-col md:flex-row items-center gap-6">
                                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0 shadow-inner group relative">
                                        <img
                                            src={currentEpisode.imageUrl}
                                            alt={currentEpisode.title}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-brand-dark/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Mic className="w-8 h-8 text-white" />
                                        </div>
                                    </div>

                                    <div className="flex-1 text-center md:text-left min-w-0">
                                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-primary/10 rounded-full mb-3">
                                            <div className="w-2 h-2 bg-brand-primary rounded-full animate-pulse"></div>
                                            <span className="text-[10px] font-black text-brand-primary uppercase tracking-widest">A reproduzir</span>
                                        </div>
                                        <h3 className="text-xl md:text-2xl font-black text-brand-dark mb-2 truncate leading-tight tracking-tighter">{currentEpisode.title}</h3>
                                        <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 text-xs text-gray-500 font-medium">
                                            <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {new Date(currentEpisode.date).toLocaleDateString()}</span>
                                            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {currentEpisode.duration}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-5">
                                        <button
                                            onClick={() => setIsPlaying(!isPlaying)}
                                            className="w-16 h-16 md:w-20 md:h-20 bg-brand-primary rounded-full flex items-center justify-center hover:bg-brand-dark transition-all shadow-xl hover:scale-110 active:scale-95 duration-300"
                                            title={isPlaying ? 'Pausar' : 'Reproduzir'}
                                        >
                                            {isPlaying ? (
                                                <Pause className="w-8 h-8 text-white" />
                                            ) : (
                                                <Play className="w-8 h-8 text-white ml-1.5" />
                                            )}
                                        </button>
                                        <button
                                            className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center hover:bg-gray-100 transition-all text-brand-dark border border-gray-100"
                                            title="Volume"
                                        >
                                            <Volume2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="mt-8">
                                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden relative">
                                        <div
                                            className={`h-full bg-brand-primary rounded-full transition-all duration-300 ${isPlaying ? 'w-1/3' : 'w-[5%]'}`}
                                        />
                                    </div>
                                    <div className="flex justify-between text-[10px] font-bold text-gray-400 mt-3 uppercase tracking-widest">
                                        <span>0:00</span>
                                        <span className="text-brand-primary">{currentEpisode.duration}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Episodes List */}
                    <div className="container mx-auto px-4 py-16 max-w-4xl">
                        {isLoadingPodcast ? (
                            <div className="text-center py-20">
                                <Loader2 className="w-12 h-12 text-brand-primary animate-spin mx-auto mb-4" />
                                <p className="font-serif italic text-gray-500">Sintonizando frequências...</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {episodes.map((episode) => (
                                    <div
                                        key={episode.id}
                                        className={`bg-white rounded-[2rem] shadow-sm p-4 md:p-6 hover:shadow-xl transition-all cursor-pointer border border-gray-50 group ${selectedEpisode?.id === episode.id ? 'ring-2 ring-brand-primary' : ''}`}
                                        onClick={() => setSelectedEpisode(episode)}
                                    >
                                        <div className="flex flex-col sm:flex-row gap-6 items-center">
                                            <div className="w-full sm:w-40 h-40 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
                                                <img
                                                    src={episode.imageUrl}
                                                    alt={episode.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                />
                                            </div>

                                            <div className="flex-1 min-w-0 text-center sm:text-left">
                                                <h3 className="text-xl md:text-2xl font-black text-brand-dark mb-3 group-hover:text-brand-primary transition-colors leading-tight tracking-tighter">
                                                    {episode.title}
                                                </h3>
                                                <p className="text-sm text-gray-600 mb-5 leading-relaxed line-clamp-2 md:line-clamp-none font-medium text-balance">
                                                    {episode.description}
                                                </p>
                                                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-5 text-[11px] font-bold text-gray-400 tracking-widest uppercase">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="w-3.5 h-3.5 text-brand-primary" />
                                                        <span>{new Date(episode.date).toLocaleDateString()}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="w-3.5 h-3.5 text-brand-primary" />
                                                        <span>{episode.duration}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedEpisode(episode);
                                                    setIsPlaying(true);
                                                }}
                                                className="w-14 h-14 bg-brand-primary/10 rounded-full flex items-center justify-center group-hover:bg-brand-primary transition-all flex-shrink-0 shadow-sm"
                                                title="Reproduzir"
                                            >
                                                <Play className="w-6 h-6 text-brand-primary group-hover:text-white ml-1" />
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                {episodes.length === 0 && !isLoadingPodcast && (
                                    <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-gray-200">
                                        <Mic className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                                        <h3 className="text-xl font-bold text-gray-400">Nenhum episódio disponível</h3>
                                        <p className="text-gray-400 mt-2">Estamos a preparar novos conteúdos para breve.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Podcast CTA */}
                    <div className="container mx-auto px-4 pb-20 max-w-4xl text-center">
                        <div className="bg-brand-dark rounded-[3rem] p-10 md:p-16 text-white relative overflow-hidden shadow-2xl">
                            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-brand-primary/20 rounded-full blur-3xl"></div>
                            <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tighter leading-tight">Onde a <span className="text-brand-primary italic font-serif font-normal">Literatura</span> ganha voz</h2>
                            <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto font-medium">Disponível em todas as plataformas de podcast. Siga-nos para não perder nenhum episódio.</p>
                            <div className="flex flex-wrap gap-4 justify-center">
                                <a href="#" className="px-8 py-4 bg-white text-brand-dark font-black rounded-2xl hover:bg-brand-primary hover:text-white transition-all text-xs uppercase tracking-widest flex items-center gap-2">
                                    Spotify <ExternalLink className="w-4 h-4" />
                                </a>
                                <a href="#" className="px-8 py-4 bg-white/10 text-white font-black rounded-2xl hover:bg-white hover:text-brand-dark transition-all text-xs uppercase tracking-widest flex items-center gap-2">
                                    Apple Podcasts
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BlogPage;
