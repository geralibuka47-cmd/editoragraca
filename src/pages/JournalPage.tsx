import React, { useEffect, useState } from 'react';
import {
    Heart, MessageCircle, Share2, BookOpen, User, Send, Loader2,
    ArrowLeft, ArrowUpRight, MessageSquare, Clock, Bookmark,
    MoreHorizontal, ChevronRight, TrendingUp
} from 'lucide-react';
import { m, AnimatePresence } from 'framer-motion';
import {
    getBlogPosts, getBlogPostInteractions, toggleBlogPostLike,
    addBlogPostComment, checkUserLike
} from '../services/dataService';
import { BlogPost, User as UserType, BlogComment } from '../types';
import { OptimizedImage } from '../components/OptimizedImage';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import { PageHero } from '../components/PageHero';

interface JournalPageProps {
    user: UserType | null;
}

const JournalPage: React.FC<JournalPageProps> = ({ user }) => {
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
                console.error("Error loading journal posts:", error);
            } finally {
                setLoading(false);
            }
        };
        loadPosts();
    }, [user]);

    const handleToggleLike = async (postId: string) => {
        if (!user) return;

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
        if (!user || !commentText.trim()) return;

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
            console.error('Error adding comment:', error);
        } finally {
            setIsSubmittingComment(false);
        }
    };

    // Article View
    if (selectedPost) {
        const interactions = postInteractions[selectedPost.id] || { likesCount: 0, comments: [], isLiked: false };

        return (
            <div className="min-h-screen bg-white selection:bg-brand-primary selection:text-white">
                <SEO
                    title={selectedPost.title}
                    description={selectedPost.content.substring(0, 160)}
                    image={selectedPost.imageUrl}
                    type="article"
                />

                <m.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="relative"
                >
                    {/* Floating Back Button */}
                    <button
                        onClick={() => setSelectedPost(null)}
                        className="fixed top-24 left-6 md:left-12 z-50 p-4 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl hover:bg-brand-primary hover:text-white transition-all group"
                        title="Voltar ao Jornal"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    </button>

                    {/* Editorial Header */}
                    <header className="pt-32 pb-16 md:pt-40 md:pb-24 border-b border-gray-100">
                        <div className="container mx-auto px-6 md:px-12">
                            <div className="max-w-4xl mx-auto space-y-8">
                                <div className="flex items-center gap-6 justify-center md:justify-start">
                                    <span className="px-5 py-2 bg-brand-light text-brand-primary rounded-full text-[10px] font-black uppercase tracking-[0.3em]">
                                        Crónica Editorial
                                    </span>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        <Clock className="w-3 h-3" /> 5 min de leitura
                                    </span>
                                </div>

                                <h1 className="text-4xl md:text-7xl lg:text-8xl font-black text-brand-dark uppercase leading-[0.9] tracking-tighter text-center md:text-left">
                                    {selectedPost.title}
                                </h1>

                                <div className="flex flex-col md:flex-row items-center gap-8 pt-8 border-t border-gray-50 uppercase tracking-[0.2em] font-black text-[10px]">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gray-100 rounded-2xl overflow-hidden border-4 border-white shadow-sm">
                                            <div className="w-full h-full flex items-center justify-center text-brand-primary">
                                                <User className="w-6 h-6" />
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-brand-dark">Por {selectedPost.author || 'Editora Graça'}</p>
                                            <p className="text-gray-400">{new Date(selectedPost.date).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="hidden md:block h-6 w-[1px] bg-gray-200"></div>
                                    <div className="flex items-center gap-6">
                                        <button
                                            title="Partilhar Artigo"
                                            aria-label="Partilhar Artigo"
                                            className="flex items-center gap-2 hover:text-brand-primary transition-colors"
                                        >
                                            <Share2 className="w-4 h-4" /> Partilhar
                                        </button>
                                        <button
                                            title="Guardar Artigo"
                                            aria-label="Guardar Artigo"
                                            className="flex items-center gap-2 hover:text-brand-primary transition-colors"
                                        >
                                            <Bookmark className="w-4 h-4" /> Guardar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Featured Image */}
                    <div className="container mx-auto px-6 md:px-12 -mt-8 relative z-10">
                        <div className="max-w-6xl mx-auto aspect-[16/7] rounded-[3rem] overflow-hidden shadow-2xl shadow-brand-dark/10 bg-gray-100">
                            <OptimizedImage
                                src={selectedPost.imageUrl}
                                alt={selectedPost.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    {/* Article Body */}
                    <main className="py-24 container mx-auto px-6 md:px-12">
                        <div className="max-w-3xl mx-auto">
                            <div className="space-y-10">
                                {selectedPost.content.split('\n').filter(p => p.trim()).map((para, i) => (
                                    <p key={i} className="text-lg md:text-2xl text-gray-700 leading-relaxed font-serif first-letter:text-5xl first-letter:font-black first-letter:mr-3 first-letter:float-left first-letter:text-brand-primary">
                                        {para}
                                    </p>
                                ))}
                            </div>

                            {/* Interaction Zone */}
                            <div className="mt-24 p-12 bg-gray-50 rounded-[3rem] border border-gray-100 space-y-12">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-8">
                                        <button
                                            onClick={() => handleToggleLike(selectedPost.id)}
                                            className={`flex items-center gap-3 transition-all ${interactions.isLiked ? 'text-brand-primary' : 'text-gray-400 hover:text-brand-dark'}`}
                                        >
                                            <m.div whileTap={{ scale: 1.5 }}>
                                                <Heart className={`w-8 h-8 ${interactions.isLiked ? 'fill-current' : ''}`} />
                                            </m.div>
                                            <span className="font-black text-xs uppercase tracking-widest">{interactions.likesCount} Reações</span>
                                        </button>
                                        <div className="flex items-center gap-3 text-gray-400">
                                            <MessageCircle className="w-8 h-8" />
                                            <span className="font-black text-xs uppercase tracking-widest">{interactions.comments.length} Comentários</span>
                                        </div>
                                    </div>
                                    <button
                                        title="Mais opções"
                                        aria-label="Mais opções"
                                        className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-brand-primary hover:border-brand-primary transition-all"
                                    >
                                        <MoreHorizontal className="w-6 h-6" />
                                    </button>
                                </div>

                                {/* Comments List */}
                                <div className="space-y-6 pt-12 border-t border-gray-200">
                                    {interactions.comments.map(c => (
                                        <div key={c.id} className="flex gap-6 pb-6 border-b border-gray-200 last:border-0">
                                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-gray-100 text-brand-primary shrink-0">
                                                <User className="w-5 h-5" />
                                            </div>
                                            <div className="space-y-1 flex-grow">
                                                <div className="flex items-center justify-between">
                                                    <p className="font-black text-[10px] uppercase tracking-widest">{c.userName}</p>
                                                    <p className="text-[9px] text-gray-400 font-bold uppercase">{new Date(c.createdAt).toLocaleDateString()}</p>
                                                </div>
                                                <p className="text-sm text-gray-600 leading-relaxed font-medium">{c.content}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Add Comment */}
                                <div className="pt-8">
                                    <div className="relative">
                                        <textarea
                                            placeholder={user ? "Sua reflexão sobre esta obra..." : "Inicie sessão para participar na conversa"}
                                            value={commentText}
                                            onChange={(e) => setCommentText(e.target.value)}
                                            disabled={!user || isSubmittingComment}
                                            className="w-full h-32 px-8 py-6 bg-white rounded-3xl border-none focus:ring-4 focus:ring-brand-primary/10 text-brand-dark font-medium transition-all shadow-sm placeholder:text-gray-300"
                                        />
                                        <button
                                            onClick={() => handleAddComment(selectedPost.id)}
                                            disabled={!user || isSubmittingComment || !commentText.trim()}
                                            className="absolute bottom-4 right-4 p-4 bg-brand-primary text-white rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:scale-100"
                                            title="Publicar Comentário"
                                        >
                                            {isSubmittingComment ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>

                    {/* Read More Section */}
                    <aside className="py-24 bg-gray-50">
                        <div className="container mx-auto px-6 md:px-12">
                            <div className="max-w-4xl mx-auto space-y-12">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-3xl font-black uppercase tracking-tighter">Continuar a ler</h2>
                                    <button onClick={() => setSelectedPost(null)} className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-primary flex items-center gap-2">
                                        Ver Jornal Inteiro <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="grid md:grid-cols-2 gap-8">
                                    {posts.filter(p => p.id !== selectedPost.id).slice(0, 2).map(p => (
                                        <div
                                            key={p.id}
                                            onClick={() => { setSelectedPost(p); window.scrollTo(0, 0); }}
                                            className="group cursor-pointer bg-white p-6 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all border border-gray-100 flex gap-6 items-center"
                                        >
                                            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-100 shrink-0">
                                                <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-[9px] font-black text-brand-primary uppercase tracking-widest">{new Date(p.date).toLocaleDateString()}</p>
                                                <h3 className="font-black text-sm uppercase tracking-tight line-clamp-2 leading-tight group-hover:text-brand-primary transition-colors">{p.title}</h3>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>
                </m.div>
            </div>
        );
    }

    // Grid Feed View
    return (
        <div className="min-h-screen bg-white">
            <SEO
                title="Jornal Literário"
                description="Novidades, ensaios e crónicas da Editora Graça. Um olhar profundo sobre a cultura angolana."
            />

            <PageHero
                title={<>O Nosso <br /><span className="text-brand-primary italic font-serif font-normal lowercase text-4xl sm:text-6xl md:text-8xl">Blog</span></>}
                subtitle="Ensaios literários, notícias de autor e crónicas que exploram a identidade angolana através da escrita."
                breadcrumb={[{ label: 'Voz Autoral' }]}
                decorativeText="BLOG"
                titleClassName="text-4xl sm:text-5xl md:text-7xl lg:text-[10rem] font-black uppercase leading-[0.8] tracking-tighter mb-4"
            />

            {/* Trending Section */}
            {!loading && posts.length > 0 && (
                <section className="py-12 md:py-20 -mt-20 relative z-20">
                    <div className="container mx-auto px-6 md:px-12">
                        <div className="grid lg:grid-cols-2 gap-12">
                            {/* Featured Post */}
                            <m.article
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                onClick={() => setSelectedPost(posts[0])}
                                className="group relative aspect-[16/10] md:aspect-[16/8] lg:aspect-square rounded-[3rem] overflow-hidden cursor-pointer shadow-2xl shadow-brand-dark/20"
                            >
                                <img src={posts[0].imageUrl} alt={posts[0].title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/40 to-transparent"></div>
                                <div className="absolute bottom-0 left-0 p-8 md:p-14 space-y-6">
                                    <div className="flex items-center gap-4">
                                        <span className="px-5 py-2 bg-brand-primary text-white text-[9px] font-black uppercase tracking-widest rounded-lg">Edição Especial</span>
                                        <TrendingUp className="w-5 h-5 text-brand-primary animate-pulse" />
                                    </div>
                                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white uppercase leading-none tracking-tighter">
                                        {posts[0].title}
                                    </h2>
                                    <button className="flex items-center gap-3 text-brand-primary font-black text-[10px] uppercase tracking-[0.4em] pt-4 group-hover:gap-6 transition-all">
                                        Ler Narrativa Completa <ArrowUpRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </m.article>

                            {/* Top List */}
                            <div className="space-y-8 flex flex-col justify-center">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-primary border-l-4 border-brand-primary pl-6">Leituras Essenciais</h3>
                                <div className="space-y-6">
                                    {posts.slice(1, 4).map((p, i) => (
                                        <m.div
                                            key={p.id}
                                            initial={{ opacity: 0, x: 30 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: i * 0.1 }}
                                            onClick={() => setSelectedPost(p)}
                                            className="group flex items-center gap-8 p-6 rounded-3xl hover:bg-gray-50 transition-all cursor-pointer border border-transparent hover:border-gray-100"
                                        >
                                            <span className="text-4xl md:text-5xl font-black text-gray-100 group-hover:text-brand-primary transition-colors italic font-serif">0{i + 2}</span>
                                            <div className="space-y-1">
                                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{new Date(p.date).toLocaleDateString()}</p>
                                                <h4 className="text-lg md:text-xl font-black uppercase tracking-tight leading-none group-hover:text-brand-dark transition-colors">{p.title}</h4>
                                            </div>
                                            <ArrowUpRight className="w-5 h-5 ml-auto text-gray-200 group-hover:text-brand-primary transition-colors shrink-0" />
                                        </m.div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Newsletter Hook */}
            <section className="py-24 bg-brand-light relative overflow-hidden">
                <div className="container mx-auto px-6 md:px-12 relative z-10 flex flex-col items-center text-center space-y-10">
                    <h2 className="text-4xl md:text-6xl font-black text-brand-dark uppercase tracking-tighter leading-none">Subscreva o <br />nosso <span className="text-brand-primary italic">manifesto</span></h2>
                    <p className="text-gray-500 font-medium max-w-sm">Receba crónicas exclusivas e convites para lançamentos literários diretamente no seu email.</p>
                    <div className="w-full max-w-md relative">
                        <input type="email" placeholder="O seu melhor email..." className="w-full h-16 pl-8 pr-40 bg-white rounded-2xl border-none shadow-sm font-bold text-sm focus:ring-4 focus:ring-brand-primary/10" />
                        <button className="absolute right-2 top-2 h-12 px-8 bg-brand-dark text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-brand-primary transition-all">Subscrever</button>
                    </div>
                </div>
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/5 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-primary/5 blur-[80px] rounded-full -translate-x-1/2 translate-y-1/2"></div>
            </section>

            {/* Main Feed */}
            <section className="py-32">
                <div className="container mx-auto px-6 md:px-12">
                    <div className="flex items-center justify-between mb-20">
                        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">Arquivo Recente</h2>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-3 bg-gray-50 px-6 py-3 rounded-xl border border-gray-100">
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Filtrar:</span>
                                <select
                                    title="Filtrar por categoria"
                                    aria-label="Filtrar por categoria"
                                    className="bg-transparent border-none text-[10px] font-black uppercase tracking-widest text-brand-dark focus:ring-0 cursor-pointer"
                                >
                                    <option>Tudo</option>
                                    <option>Crónicas</option>
                                    <option>Notícias</option>
                                    <option>Ensaios</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-16">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="animate-pulse space-y-6">
                                    <div className="aspect-[16/10] bg-gray-100 rounded-[2.5rem]"></div>
                                    <div className="space-y-3">
                                        <div className="h-4 bg-gray-100 rounded-md w-1/4"></div>
                                        <div className="h-8 bg-gray-100 rounded-lg w-full"></div>
                                        <div className="h-20 bg-gray-50 rounded-xl w-full"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <m.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                            className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24"
                        >
                            {posts.slice(4).map(post => {
                                const interactions = postInteractions[post.id] || { likesCount: 0, comments: [], isLiked: false };
                                return (
                                    <m.article
                                        key={post.id}
                                        variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
                                        onClick={() => { setSelectedPost(post); window.scrollTo(0, 0); }}
                                        className="group cursor-pointer flex flex-col gap-8"
                                    >
                                        <div className="relative aspect-[16/10] rounded-[2.5rem] overflow-hidden shadow-sm transition-all duration-700 group-hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.15)] group-hover:-translate-y-4">
                                            <OptimizedImage src={post.imageUrl} alt={post.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                                            <div className="absolute top-6 right-6 bg-white/80 backdrop-blur-md px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                                Ler Agora
                                            </div>
                                        </div>

                                        <div className="space-y-4 px-2">
                                            <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-brand-primary">
                                                <span>{new Date(post.date).toLocaleDateString()}</span>
                                                <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                                                <span className="text-gray-400">{post.author || 'Editora Graça'}</span>
                                            </div>
                                            <h3 className="text-2xl font-black uppercase tracking-tighter leading-none group-hover:text-brand-primary transition-colors line-clamp-2">
                                                {post.title}
                                            </h3>
                                            <p className="text-gray-500 font-medium leading-relaxed line-clamp-3 italic">
                                                "{post.content.substring(0, 140)}..."
                                            </p>
                                            <div className="pt-4 flex items-center gap-6 border-t border-gray-50">
                                                <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-300">
                                                    <Heart className="w-3 h-3" /> {interactions.likesCount}
                                                </span>
                                                <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-300">
                                                    <MessageSquare className="w-3 h-3" /> {interactions.comments.length}
                                                </span>
                                            </div>
                                        </div>
                                    </m.article>
                                );
                            })}
                        </m.div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default JournalPage;
