import React, { useState } from 'react';
import { Calendar, User, ArrowRight, Search } from 'lucide-react';
import { ViewState, BlogPost } from '../types';

interface BlogPageProps {
    onNavigate: (view: ViewState) => void;
}

const BlogPage: React.FC<BlogPageProps> = ({ onNavigate }) => {
    const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const blogPosts: BlogPost[] = [
        {
            id: '1',
            title: 'O Renascimento da Literatura Angolana',
            content: 'Nos últimos anos, temos assistido a um verdadeiro renascimento da literatura angolana. Novos autores emergem com histórias autênticas que capturam a essência da nossa cultura e identidade. Esta nova geração de escritores não só preserva as tradições literárias, mas também as reinventa para os tempos modernos...',
            imageUrl: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&h=500&fit=crop',
            date: '2026-01-05',
            author: 'Maria Santos'
        },
        {
            id: '2',
            title: 'Como Publicar Seu Primeiro Livro',
            content: 'Publicar um livro pode parecer intimidante, mas com a orientação certa, o processo torna-se muito mais acessível. Desde a finalização do manuscrito até a distribuição, cada etapa requer atenção aos detalhes. Neste artigo, partilhamos um guia completo para autores de primeira viagem...',
            imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=500&fit=crop',
            date: '2025-12-28',
            author: 'Geral Ibuka'
        },
        {
            id: '3',
            title: 'A Importância da Revisão Editorial',
            content: 'Um manuscrito bem escrito pode ser transformado numa obra-prima através de uma revisão editorial profissional. A revisão não se limita à correção de erros; ela aprimora a narrativa, fortalece a voz do autor e garante que a mensagem chegue clara aos leitores...',
            imageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=500&fit=crop',
            date: '2025-12-15',
            author: 'Carlos Mendes'
        },
        {
            id: '4',
            title: 'Tendências Editoriais para 2026',
            content: 'O mercado editorial está em constante evolução, e 2026 promete ser um ano de transformações significativas. Desde o crescimento dos audiolivros até novas estratégias de marketing digital, exploramos as principais tendências que moldarão o futuro da publicação em Angola...',
            imageUrl: 'https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?w=800&h=500&fit=crop',
            date: '2025-12-01',
            author: 'Ana Costa'
        }
    ];

    const filteredPosts = searchQuery.trim()
        ? blogPosts.filter(post =>
            post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.author.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : blogPosts;

    if (selectedPost) {
        return (
            <div className="min-h-screen bg-brand-light">
                <article className="bg-white">
                    <div className="aspect-[21/9] overflow-hidden bg-gray-200">
                        <img
                            src={selectedPost.imageUrl}
                            alt={selectedPost.title}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="container mx-auto px-8 py-16 max-w-4xl">
                        <button
                            onClick={() => setSelectedPost(null)}
                            className="flex items-center gap-2 text-brand-primary hover:underline font-bold mb-8"
                        >
                            ← Voltar aos Artigos
                        </button>

                        <div className="flex items-center gap-6 text-sm text-gray-600 mb-6">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>{new Date(selectedPost.date).toLocaleDateString('pt-AO', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                <span>{selectedPost.author}</span>
                            </div>
                        </div>

                        <h1 className="text-5xl font-black text-brand-dark tracking-tighter mb-8">
                            {selectedPost.title}
                        </h1>

                        <div className="prose prose-lg max-w-none">
                            <p className="text-gray-700 leading-relaxed text-lg">
                                {selectedPost.content}
                            </p>
                            <p className="text-gray-700 leading-relaxed text-lg mt-6">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                            </p>
                            <p className="text-gray-700 leading-relaxed text-lg mt-6">
                                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                            </p>
                        </div>
                    </div>
                </article>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brand-light">
            {/* Hero */}
            <section className="bg-brand-dark text-white py-12 md:py-20">
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
            <section className="py-8 md:py-12 bg-white border-b border-gray-200">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="max-w-2xl mx-auto relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Pesquisar artigos..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 md:pl-12 pr-4 py-3 md:py-4 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all"
                        />
                    </div>
                </div>
            </section>

            {/* Blog Posts */}
            <section className="py-24">
                <div className="container mx-auto px-8">
                    {filteredPosts.length > 0 ? (
                        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                            {filteredPosts.map((post) => (
                                <article
                                    key={post.id}
                                    className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group cursor-pointer"
                                    onClick={() => setSelectedPost(post)}
                                >
                                    <div className="aspect-video overflow-hidden bg-gray-200">
                                        <img
                                            src={post.imageUrl}
                                            alt={post.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="p-8">
                                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4" />
                                                <span>{new Date(post.date).toLocaleDateString('pt-AO', { day: 'numeric', month: 'short' })}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <User className="w-4 h-4" />
                                                <span>{post.author}</span>
                                            </div>
                                        </div>
                                        <h2 className="text-2xl font-black text-brand-dark mb-4 group-hover:text-brand-primary transition-colors">
                                            {post.title}
                                        </h2>
                                        <p className="text-gray-700 leading-relaxed mb-6 line-clamp-3">
                                            {post.content}
                                        </p>
                                        <button className="flex items-center gap-2 text-brand-primary font-bold hover:gap-4 transition-all">
                                            Ler Mais <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <h3 className="text-2xl font-bold text-brand-dark mb-4">Nenhum artigo encontrado</h3>
                            <p className="text-gray-600">Tente pesquisar com outros termos.</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default BlogPage;
