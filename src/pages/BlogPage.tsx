import React, { useEffect, useState } from 'react';
import { Heart, MessageCircle, Share2, BookOpen, Calendar, User, TrendingUp } from 'lucide-react';
import { getBlogPosts } from '../services/dataService';
import { BlogPost } from '../types';

const BlogPage: React.FC = () => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

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

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
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
                                    <div className="flex-1">
                                        <h3 className="font-bold text-brand-dark">{post.author || 'Editora Graça'}</h3>
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
                                <h2 className="text-2xl font-black text-brand-dark mb-3 leading-tight">
                                    {post.title}
                                </h2>

                                {/* Post Content Preview */}
                                <p className="text-gray-600 leading-relaxed line-clamp-3">
                                    {post.content.substring(0, 200)}...
                                </p>
                            </div>

                            {/* Post Image */}
                            {post.imageUrl && (
                                <div className="relative w-full aspect-[16/9] bg-gray-100">
                                    <img
                                        src={post.imageUrl}
                                        alt={post.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}

                            {/* Interaction Bar */}
                            <div className="px-6 py-4 border-t border-gray-100">
                                <div className="flex items-center justify-between">
                                    <button
                                        onClick={() => toggleLike(post.id)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${likedPosts.has(post.id)
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

                                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-50 text-gray-600 transition-all">
                                        <MessageCircle className="w-5 h-5" />
                                        <span className="text-sm font-bold">Comentar</span>
                                    </button>

                                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-50 text-gray-600 transition-all">
                                        <Share2 className="w-5 h-5" />
                                        <span className="text-sm font-bold">Partilhar</span>
                                    </button>
                                </div>
                            </div>

                            {/* Read More */}
                            <div className="px-6 pb-6">
                                <button className="w-full py-3 bg-brand-light hover:bg-brand-primary/10 text-brand-primary font-bold rounded-xl transition-colors">
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
