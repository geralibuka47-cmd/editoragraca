import React, { useEffect, useState } from 'react';
import { Heart, MessageCircle, Share2, BookOpen, Calendar, User, TrendingUp } from 'lucide-react';
import { getBlogPosts } from '../services/dataService';
import { BlogPost } from '../types';
import { OptimizedImage } from '../components/OptimizedImage';

const BlogPage: React.FC = () => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
    const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

    useEffect(() => {
        const loadPosts = async () => {
            setLoading(true);
            const data = await getBlogPosts();
            setPosts(data);
            setLoading(false);
        };
        loadPosts();
    }, []);

    const toggleLike = (postId: string) => {
        setLikedPosts(prev => {
            const newSet = new Set(prev);
            if (newSet.has(postId)) {
                newSet.delete(postId);
            } else {
                newSet.add(postId);
            }
            return newSet;
        });
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
                                    {likedPosts.has(selectedPost.id) ? 'Você e outras 42 pessoas' : '42 pessoas'}
                                </span>
                            </div>
                            <div className="flex gap-3">
                                <span className="hover:underline cursor-pointer">8 comentários</span>
                                <span className="hover:underline cursor-pointer">12 partilhas</span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="px-6 py-2">
                            <div className="flex items-center justify-between border-t border-b border-gray-100 py-1">
                                <button
                                    onClick={() => toggleLike(selectedPost.id)}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all ${likedPosts.has(selectedPost.id)
                                            ? 'text-brand-primary'
                                            : 'hover:bg-gray-100 text-gray-600'
                                        }`}
                                >
                                    <Heart className={`w-5 h-5 ${likedPosts.has(selectedPost.id) ? 'fill-current' : ''}`} />
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

                        {/* Comments Section (Static Placeholder) */}
                        <div className="p-6 bg-gray-50/50">
                            <div className="flex gap-3 mb-6">
                                <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0" />
                                <div className="flex-1">
                                    <div className="bg-white border border-gray-200 rounded-2xl px-4 py-2 inline-block max-w-full">
                                        <p className="font-bold text-sm text-brand-dark">Visitante</p>
                                        <p className="text-sm text-gray-700">Artigo fantástico! Angola precisa de mais iniciativas como esta.</p>
                                    </div>
                                    <div className="flex gap-4 mt-2 text-xs font-bold text-gray-500 px-2">
                                        <button className="hover:underline">Gosto</button>
                                        <button className="hover:underline">Responder</button>
                                        <span>2h</span>
                                    </div>
                                </div>
                            </div>

                            {/* Comment Input */}
                            <div className="flex gap-3">
                                <div className="w-8 h-8 bg-brand-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                    <User className="w-4 h-4 text-brand-primary" />
                                </div>
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        placeholder="Escreva um comentário..."
                                        className="w-full bg-gray-100 border-0 rounded-full px-4 py-2 text-sm focus:ring-1 focus:ring-brand-primary"
                                    />
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
                            <p className="text-gray-500 mt-2">Histórias, reflexões e o universo literário angolano</p>
                        </div>
                        <div className="hidden md:flex items-center gap-2 bg-brand-light px-4 py-2 rounded-full">
                            <TrendingUp className="w-5 h-5 text-brand-primary" />
                            <span className="text-sm font-bold text-brand-dark">{posts.length} Artigos</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Feed */}
            <div className="container mx-auto px-4 py-8 max-w-3xl">
                <div className="space-y-6">
                    {posts.map((post) => (
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
                                        onClick={() => toggleLike(post.id)}
                                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all ${likedPosts.has(post.id)
                                                ? 'bg-red-50 text-red-600'
                                                : 'hover:bg-gray-50 text-gray-600'
                                            }`}
                                    >
                                        <Heart
                                            className={`w-5 h-5 ${likedPosts.has(post.id) ? 'fill-current' : ''}`}
                                        />
                                        <span className="text-sm font-bold">
                                            {likedPosts.has(post.id) ? 'Gostei' : 'Gostar'}
                                        </span>
                                    </button>

                                    <button
                                        onClick={() => setSelectedPost(post)}
                                        className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-gray-50 text-gray-600 transition-all font-bold text-sm"
                                    >
                                        <MessageCircle className="w-5 h-5" />
                                        Comentar
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
                    ))}

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
