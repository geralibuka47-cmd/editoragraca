import React, { useEffect, useState } from 'react';
import { Heart, MessageCircle, Share2, BookOpen, Calendar, User, TrendingUp, Send, Clock, Loader2 } from 'lucide-react';
import { getBlogPosts, getBlogPostInteractions, toggleBlogPostLike, addBlogPostComment, checkUserLike } from '../services/dataService';
import { BlogPost, User as UserType, BlogComment } from '../types';
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

    useEffect(() => {
        const loadPosts = async () => {
            setLoading(true);
            try {
                const data = await getBlogPosts();
                setPosts(data || []);

                // Load interactions only for the visible posts or in batch
                const interactionData: Record<string, any> = {};
                // Limit the number of parallel requests or batch them
                await Promise.all((data || []).slice(0, 10).map(async (post) => {
                    try {
                        const interactions = await getBlogPostInteractions(post.id);
                        const isLiked = user ? await checkUserLike(post.id, user.id) : false;
                        interactionData[post.id] = { ...interactions, isLiked };
                    } catch (e) {
                        console.error(`Error loading interactions for post ${post.id}:`, e);
                    }
                }));
                setPostInteractions(interactionData);
            } catch (error) {
                console.error("Error loading blog posts:", error);
            } finally {
                setLoading(false);
            }
        };
        loadPosts();
    }, [user]);



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

                            <div className="text-reading space-y-4 mb-8">
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
                                        className="w-full bg-gray-100 border-0 rounded-full px-6 py-3 pr-14 text-sm focus:ring-2 focus:ring-brand-primary/50 transition-all disabled:opacity-50"
                                    />
                                    <button
                                        onClick={() => handleAddComment(selectedPost.id)}
                                        disabled={!user || isSubmittingComment || !commentText.trim()}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-brand-primary text-white rounded-full transition-all hover:brightness-110 shadow-lg shadow-brand-primary/20 disabled:opacity-50"
                                        title="Enviar comentário"
                                        aria-label="Enviar comentário"
                                    >
                                        {isSubmittingComment ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Send className="w-4 h-4" />
                                        )}
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
            {/* Nav Padding Spacer */}
            <div className="h-20 md:h-24 bg-brand-dark"></div>

            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-20 md:top-24 z-10 shadow-sm">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-black text-brand-dark tracking-tight">
                                Blog & <span className="text-brand-primary italic font-serif font-normal">Novidades</span>
                            </h1>
                            <p className="text-gray-500 mt-2">Explore o universo literário angolano nas nossas plataformas</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Feed */}
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
                                    <p className="text-gray-500 leading-relaxed line-clamp-3 text-sm">
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
        </div>
    );
};

export default BlogPage;
