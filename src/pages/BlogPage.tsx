import React, { useEffect, useState } from 'react';
import { Heart, MessageCircle, Share2, BookOpen, Calendar, User, TrendingUp, Send, Clock, Loader2, ArrowLeft, ArrowUpRight, MessageSquare } from 'lucide-react';
import { m, AnimatePresence } from 'framer-motion';
import { getBlogPosts, getBlogPostInteractions, toggleBlogPostLike, addBlogPostComment, checkUserLike } from '../services/dataService';
import { BlogPost, User as UserType, BlogComment } from '../types';
import { OptimizedImage, optimizeImageUrl } from '../components/OptimizedImage';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';

interface BlogPageProps {
    user: UserType | null;
}

const BlogPage: React.FC<BlogPageProps> = ({ user }) => {
    const navigate = useNavigate();
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

                const interactionData: Record<string, any> = {};
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
            <div className="min-h-screen bg-white">
                <SEO
                    title={selectedPost.title}
                    description={selectedPost.content.substring(0, 160)}
                    image={selectedPost.imageUrl}
                    type="article"
                />
                {/* 1. CINEMATIC SINGLE POST HEADER */}
                <section className="relative h-[60vh] md:h-[80vh] bg-brand-dark overflow-hidden">
                    {selectedPost.imageUrl ? (
                        <div className="absolute inset-0">
                            <OptimizedImage
                                src={selectedPost.imageUrl}
                                alt={selectedPost.title}
                                className="w-full h-full object-cover opacity-60 scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-white via-brand-dark/20 to-transparent"></div>
                        </div>
                    ) : (
                        <div className="absolute inset-0 bg-brand-dark"></div>
                    )}

                    <div className="container mx-auto px-6 md:px-12 h-full flex flex-col justify-end pb-12 relative z-10">
                        <m.button
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            onClick={() => setSelectedPost(null)}
                            className="absolute top-32 left-6 md:left-12 p-4 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-brand-dark transition-all border border-white/20"
                            title="Voltar ao Feed"
                            aria-label="Voltar ao Feed"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </m.button>

                        <m.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="max-w-4xl"
                        >
                            <div className="flex items-center gap-4 text-[10px] text-brand-primary font-black uppercase tracking-[0.4em] mb-8">
                                <span className="px-3 py-1 bg-brand-primary text-white rounded-md">Editora Graça</span>
                                <span className="text-white/50">{new Date(selectedPost.date).toLocaleDateString()}</span>
                            </div>
                            <h1 className="text-4xl md:text-8xl font-black text-white uppercase leading-[0.8] tracking-tighter mb-8">
                                {selectedPost.title}
                            </h1>
                        </m.div>
                    </div>
                </section>

                {/* 2. POST CONTENT AREA */}
                <section className="py-24 bg-white relative">
                    <div className="container mx-auto px-6 md:px-12">
                        <div className="grid lg:grid-cols-[1fr_350px] gap-24">

                            {/* Main Content */}
                            <m.article
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="space-y-12"
                            >
                                <div className="max-w-none">
                                    {selectedPost.content.split('\n').map((para, i) => (
                                        <p key={i} className="mb-8 text-reading md:text-xl text-gray-600 leading-relaxed font-light">
                                            {para}
                                        </p>
                                    ))}
                                </div>

                                {/* Interaction Bar */}
                                <div className="pt-20 border-t border-gray-100 flex items-center justify-between">
                                    <div className="flex items-center gap-8">
                                        <button
                                            onClick={() => handleToggleLike(selectedPost.id)}
                                            className={`flex items-center gap-3 font-black text-sm uppercase tracking-widest transition-all ${interactions.isLiked ? 'text-brand-primary' : 'text-gray-400 hover:text-brand-dark'}`}
                                            title={interactions.isLiked ? "Remover Gosto" : "Gostar"}
                                        >
                                            <Heart className={`w-6 h-6 ${interactions.isLiked ? 'fill-current' : ''}`} />
                                            <span>{interactions.likesCount} Reações</span>
                                        </button>
                                        <div className="flex items-center gap-3 text-gray-400 font-black text-sm uppercase tracking-widest">
                                            <MessageCircle className="w-6 h-6" />
                                            <span>{interactions.comments.length} Comentários</span>
                                        </div>
                                    </div>
                                    <button
                                        className="p-4 rounded-full border border-gray-100 text-gray-400 hover:border-brand-primary hover:text-brand-primary transition-all shadow-sm"
                                        title="Partilhar Artigo"
                                        aria-label="Partilhar Artigo"
                                    >
                                        <Share2 className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Comments Section */}
                                <div className="pt-12 space-y-12">
                                    <h3 className="text-2xl font-black text-brand-dark uppercase tracking-tighter">Diálogo Literário</h3>

                                    <div className="space-y-8">
                                        {interactions.comments.map((comment) => (
                                            <div key={comment.id} className="flex gap-6 p-8 bg-gray-50 rounded-[2rem] border border-gray-100">
                                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
                                                    <User className="w-6 h-6 text-brand-primary" />
                                                </div>
                                                <div className="flex-1 space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <p className="font-black text-brand-dark text-sm uppercase tracking-widest">{comment.userName}</p>
                                                        <p className="text-[10px] text-gray-400 font-bold uppercase">{new Date(comment.createdAt).toLocaleDateString()}</p>
                                                    </div>
                                                    <p className="text-gray-600 leading-relaxed">{comment.content}</p>
                                                </div>
                                            </div>
                                        ))}

                                        {interactions.comments.length === 0 && (
                                            <div className="py-12 text-center text-gray-300 italic">
                                                Inicie esta conversa. Seja o primeiro a comentar.
                                            </div>
                                        )}
                                    </div>

                                    {/* Add Comment */}
                                    <div className="bg-brand-dark p-10 md:p-12 rounded-[3rem] shadow-2xl relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/10 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2"></div>

                                        <h4 className="text-white text-xl font-black uppercase tracking-widest mb-8 relative z-10">Partilhe sua Perspectiva</h4>
                                        <div className="relative z-10">
                                            <textarea
                                                placeholder={user ? "Sua reflexão sobre este artigo..." : "Inicie sessão para participar"}
                                                value={commentText}
                                                onChange={(e) => setCommentText(e.target.value)}
                                                disabled={!user || isSubmittingComment}
                                                className="w-full bg-white/5 border-0 rounded-2xl p-6 text-white placeholder:text-gray-500 focus:ring-4 focus:ring-brand-primary/20 transition-all resize-none h-32 mb-6"
                                            />
                                            <button
                                                onClick={() => handleAddComment(selectedPost.id)}
                                                disabled={!user || isSubmittingComment || !commentText.trim()}
                                                className="w-full py-5 bg-brand-primary text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-brand-primary/20 hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                                            >
                                                {isSubmittingComment ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                                Publicar Reflexão
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </m.article>

                            {/* Sidebar / More News */}
                            <aside className="space-y-12">
                                <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 space-y-8">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-primary">Outras Narrativas</h4>
                                    <div className="space-y-8">
                                        {posts.filter(p => p.id !== selectedPost.id).slice(0, 4).map(p => (
                                            <div
                                                key={p.id}
                                                className="group cursor-pointer space-y-3"
                                                onClick={() => setSelectedPost(p)}
                                            >
                                                <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-gray-100">
                                                    <OptimizedImage
                                                        src={p.imageUrl}
                                                        alt={p.title}
                                                        className="w-full h-full object-cover transition-transform group-hover:scale-110"
                                                    />
                                                </div>
                                                <h5 className="font-sans font-black text-brand-dark text-sm leading-tight uppercase tracking-tight line-clamp-2 group-hover:text-brand-primary transition-colors">
                                                    {p.title}
                                                </h5>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </aside>
                        </div>
                    </div>
                </section>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <SEO
                title="Blog & Imprensa"
                description="Acompanhe as últimas novidades, lançamentos e críticas literárias da Editora Graça."
            />
            {/* Nav Padding Spacer */}
            <div className="h-20 md:h-24 bg-brand-dark"></div>

            {/* 1. CINEMATIC HERO */}
            <section className="relative bg-brand-dark text-white pt-24 pb-48 md:pt-32 md:pb-64 overflow-hidden">
                {/* Background Decorative Text */}
                <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/4 select-none pointer-events-none opacity-[0.03] whitespace-nowrap">
                    <span className="text-[30rem] font-black uppercase tracking-tighter leading-none">
                        EDITORIAL
                    </span>
                </div>

                <div className="container mx-auto px-6 md:px-12 relative z-10">
                    <m.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-5xl"
                    >
                        <div className="flex items-center gap-4 text-[10px] text-brand-primary font-black uppercase tracking-[0.4em] mb-12">
                            <span>Imprensa</span>
                            <span className="text-gray-700">/</span>
                            <span className="text-white font-black">Blog & Novidades</span>
                        </div>

                        <h1 className="text-6xl md:text-[10rem] font-black uppercase leading-[0.8] tracking-tighter mb-12">
                            Pulsar da <br />
                            <span className="text-brand-primary italic font-serif font-normal lowercase md:text-[8rem]">Cultura</span>
                        </h1>
                        <p className="text-xl md:text-3xl text-gray-400 font-light leading-relaxed max-w-2xl">
                            Críticas, lançamentos e diálogos que transcendem as páginas. Seu portal para a <span className="text-white font-black italic">alma angolana</span>.
                        </p>
                    </m.div>
                </div>

                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent"></div>
            </section>

            {/* 2. EDITORIAL FEED */}
            <section className="py-24 md:py-48 bg-white relative z-10 -mt-20">
                <div className="container mx-auto px-6 md:px-12">

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="animate-pulse space-y-6">
                                    <div className="aspect-[16/9] bg-gray-100 rounded-[2.5rem]"></div>
                                    <div className="h-8 bg-gray-100 rounded-xl w-3/4"></div>
                                    <div className="h-20 bg-gray-50 rounded-2xl w-full"></div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <m.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={{
                                visible: { transition: { staggerChildren: 0.1 } }
                            }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-20"
                        >
                            {posts.map((post) => {
                                const interactions = postInteractions[post.id] || { likesCount: 0, comments: [], isLiked: false };

                                return (
                                    <m.article
                                        key={post.id}
                                        variants={{
                                            hidden: { opacity: 0, y: 30 },
                                            visible: { opacity: 1, y: 0 }
                                        }}
                                        className="group flex flex-col gap-8"
                                    >
                                        {/* Image Box */}
                                        <div
                                            onClick={() => setSelectedPost(post)}
                                            className="relative aspect-[16/9] rounded-[2.5rem] overflow-hidden bg-gray-50 shadow-sm cursor-pointer transition-all duration-700 group-hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] group-hover:-translate-y-4"
                                        >
                                            <OptimizedImage
                                                src={post.imageUrl}
                                                alt={post.title}
                                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                            />

                                            {/* Tech Overlay */}
                                            <div className="absolute inset-0 bg-brand-dark/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 backdrop-blur-[2px] flex items-center justify-center">
                                                <div className="flex gap-4 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                                                    <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full text-brand-dark text-[10px] font-black uppercase tracking-widest shadow-xl">
                                                        <Heart className="w-3 h-3 text-red-500 fill-current" />
                                                        {interactions.likesCount}
                                                    </div>
                                                    <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full text-brand-dark text-[10px] font-black uppercase tracking-widest shadow-xl">
                                                        <MessageSquare className="w-3 h-3 text-brand-primary" />
                                                        {interactions.comments.length}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Info Box */}
                                        <div className="space-y-4 px-2">
                                            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-brand-primary">
                                                <span>{new Date(post.date).toLocaleDateString()}</span>
                                                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                                <span className="text-gray-400">{post.author || 'Editora Graça'}</span>
                                            </div>

                                            <h2
                                                onClick={() => setSelectedPost(post)}
                                                className="text-2xl font-black text-brand-dark uppercase tracking-tighter leading-[1.1] group-hover:text-brand-primary transition-colors cursor-pointer line-clamp-2"
                                            >
                                                {post.title}
                                            </h2>

                                            <p className="text-gray-500 line-clamp-3 font-medium leading-relaxed">
                                                {post.content.substring(0, 160)}...
                                            </p>

                                            <button
                                                onClick={() => setSelectedPost(post)}
                                                className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-brand-dark group-hover:text-brand-primary transition-all border-b-2 border-transparent group-hover:border-brand-primary pb-1"
                                                title="Ler Artigo Completo"
                                            >
                                                Explorar Narrativa <ArrowUpRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </m.article>
                                );
                            })}
                        </m.div>
                    )}

                    {!loading && posts.length === 0 && (
                        <div className="py-40 text-center space-y-8">
                            <div className="w-32 h-32 bg-gray-50 rounded-[3rem] flex items-center justify-center mx-auto text-gray-200">
                                <BookOpen className="w-12 h-12" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-3xl font-black text-brand-dark tracking-tighter uppercase">Silêncio Editorial</h3>
                                <p className="text-gray-400 font-medium">Estamos a preparar novas crónicas e estudos literários.</p>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default BlogPage;
