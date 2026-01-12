import React, { useState, useEffect } from 'react';
import { Calendar, User, ArrowRight, Search, Loader2 } from 'lucide-react';
import { ViewState, BlogPost } from '../types';
import { getBlogPosts } from '../services/dataService';

interface BlogPageProps {
    onNavigate: (view: ViewState) => void;
}

const BlogPage: React.FC<BlogPageProps> = ({ onNavigate }) => {
    const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const FALLBACK_POSTS: BlogPost[] = [
        {
            id: 'f-1',
            title: 'O Renascimento da Literatura Angolana',
            content: 'Nos últimos anos, temos assistido a um verdadeiro renascimento da literatura angolana. Novos autores emergem com histórias autênticas que capturam a essência da nossa cultura e identidade. Esta nova geração de escritores não só preserva as tradições literárias, mas também as reinventa para os tempos modernos...',
            imageUrl: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&h=500&fit=crop',
            date: '2026-01-05',
            author: 'Maria Santos'
        },
        {
            id: 'f-2',
            title: 'Como Publicar Seu Primeiro Livro',
            content: 'Publicar um livro pode parecer intimidante, mas com a orientação certa, o processo torna-se muito mais acessível. Desde a finalização do manuscrito até a distribuição, cada etapa requer atenção aos detalhes. Neste artigo, partilhamos um guia completo para autores de primeira viagem...',
            imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=500&fit=crop',
            date: '2025-12-28',
            author: 'Geral Ibuka'
        },
        {
            id: 'f-3',
            title: 'A Importância da Revisão Editorial',
            content: 'Um manuscrito bem escrito pode ser transformado numa obra-prima através de uma revisão editorial profissional. A revisão não se limita à correção de erros; ela aprimora a narrativa, fortalece a voz do autor e garante que a mensagem chegue clara aos leitores...',
            imageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=500&fit=crop',
            date: '2025-12-15',
            author: 'Carlos Mendes'
        }
    ];

    useEffect(() => {
        const loadPosts = async () => {
            setIsLoading(true);
            try {
                const data = await getBlogPosts();
                setPosts(data.length > 0 ? data : FALLBACK_POSTS);
            } catch (error) {
                console.error("Erro ao carregar posts:", error);
                setPosts(FALLBACK_POSTS);
            } finally {
                setIsLoading(false);
            }
        };
        loadPosts();
    }, []);

    const filteredPosts = searchQuery.trim()
        ? posts.filter(post =>
            post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.author.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : posts;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-brand-light flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-brand-primary animate-spin mx-auto mb-4" />
                    <p className="font-serif text-xl font-bold text-brand-dark italic">Folheando as novidades...</p>
                </div>
            </div>
        );
    }

    if (selectedPost) {
        return (
            <div className="min-h-screen bg-brand-light">
                <article className="bg-white">
                    <div className="aspect-[21/9] overflow-hidden bg-gray-200 relative">
                        <img
                            src={selectedPost.imageUrl}
                            alt={selectedPost.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    </div>

                    <div className="container mx-auto px-4 md:px-8 py-12 md:py-16 max-w-4xl">
                        <button
                            onClick={() => setSelectedPost(null)}
                            className="flex items-center gap-2 text-brand-primary hover:underline font-bold mb-8 group"
                        >
                            <span className="group-hover:-translate-x-1 transition-transform">←</span> Voltar aos Artigos
                        </button>

                        <div className="flex flex-wrap items-center gap-4 md:gap-8 text-sm text-gray-600 mb-8 border-b border-gray-100 pb-8">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-brand-primary/10 rounded-lg">
                                    <Calendar className="w-4 h-4 text-brand-primary" />
                                </div>
                                <span>{new Date(selectedPost.date).toLocaleDateString('pt-AO', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-brand-primary/10 rounded-lg">
                                    <User className="w-4 h-4 text-brand-primary" />
                                </div>
                                <span className="font-bold text-brand-dark">{selectedPost.author}</span>
                            </div>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-black text-brand-dark tracking-tighter mb-10 leading-[1.1]">
                            {selectedPost.title}
                        </h1>

                        <div className="prose prose-xl max-w-none">
                            <div className="text-gray-700 leading-relaxed space-y-6">
                                {selectedPost.content.split('\n').map((para, i) => (
                                    <p key={i}>{para}</p>
                                ))}
                            </div>
                        </div>
                    </div>
                </article>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brand-light">
            {/* Hero */}
            <section className="bg-brand-dark text-white py-12 md:py-24">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="flex items-center justify-center md:justify-start gap-2 text-[10px] md:text-sm text-brand-primary uppercase tracking-widest font-bold mb-6">
                        <button onClick={() => onNavigate('HOME')} className="hover:underline">Início</button>
                        <span>/</span>
                        <span>Blog</span>
                    </div>

                    <div className="max-w-4xl text-center md:text-left">
                        <h1 className="text-4xl md:text-7xl font-black tracking-tighter mb-4 md:mb-6 leading-tight">
                            Nosso <span className="text-brand-primary italic font-serif font-normal">Blog</span>
                        </h1>
                        <p className="text-lg md:text-2xl text-gray-300 leading-relaxed font-medium">
                            Insights, dicas e notícias sobre o mundo editorial e a literatura angolana.
                        </p>
                    </div>
                </div>
            </section>

            {/* Search */}
            <section className="py-8 md:py-12 bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="max-w-2xl mx-auto relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Pesquisar artigos por título, autor ou conteúdo..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 md:pl-12 pr-4 py-3 md:py-4 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all font-medium"
                        />
                    </div>
                </div>
            </section>

            {/* Blog Posts */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4 md:px-8">
                    {filteredPosts.length > 0 ? (
                        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
                            {filteredPosts.map((post) => (
                                <article
                                    key={post.id}
                                    className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 group cursor-pointer flex flex-col h-full"
                                    onClick={() => setSelectedPost(post)}
                                >
                                    <div className="aspect-video overflow-hidden bg-gray-200 relative">
                                        <img
                                            src={post.imageUrl}
                                            alt={post.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute top-4 left-4">
                                            <span className="px-4 py-1.5 bg-brand-primary text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg">
                                                Artigo
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-6 md:p-10 flex flex-col flex-1">
                                        <div className="flex items-center gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-3.5 h-3.5 text-brand-primary" />
                                                <span>{new Date(post.date).toLocaleDateString('pt-AO', { day: 'numeric', month: 'short' })}</span>
                                            </div>
                                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                            <div className="flex items-center gap-2">
                                                <User className="w-3.5 h-3.5 text-brand-primary" />
                                                <span className="text-gray-600">{post.author}</span>
                                            </div>
                                        </div>
                                        <h2 className="text-2xl md:text-3xl font-black text-brand-dark mb-4 group-hover:text-brand-primary transition-colors leading-tight">
                                            {post.title}
                                        </h2>
                                        <p className="text-gray-600 leading-relaxed mb-8 line-clamp-3 font-medium">
                                            {post.content}
                                        </p>
                                        <div className="mt-auto">
                                            <button className="flex items-center gap-2 text-brand-primary font-bold hover:gap-4 transition-all uppercase text-xs tracking-widest">
                                                Ler Artigo Completo <ArrowRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200 max-w-2xl mx-auto">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Search className="w-10 h-10 text-gray-300" />
                            </div>
                            <h3 className="text-2xl font-black text-brand-dark mb-4 tracking-tighter">Nenhum artigo encontrado</h3>
                            <p className="text-gray-500 font-medium px-8">Nenhum resultado para "{searchQuery}". Tente pesquisar com outros termos.</p>
                            <button
                                onClick={() => setSearchQuery('')}
                                className="mt-8 btn-premium"
                            >
                                Limpar Pesquisa
                            </button>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default BlogPage;
