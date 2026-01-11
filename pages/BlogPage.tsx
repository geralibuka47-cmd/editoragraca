
import React from 'react';
import SectionHeader from '../components/SectionHeader';
import { BLOG_POSTS } from '../constants';

const BlogPage: React.FC = () => {
    return (
        <div className="py-16 md:py-32 max-w-7xl mx-auto px-4 md:px-6 animate-fade-in">
            <SectionHeader title="Espaço Literário" subtitle="Notícias e Artigos" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                {BLOG_POSTS.map(post => (
                    <div key={post.id} className="group cursor-pointer">
                        <div className="overflow-hidden rounded-3xl aspect-video mb-6">
                            <img src={post.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" alt={post.title} loading="lazy" />
                        </div>
                        <span className="text-accent-gold font-bold text-[9px] uppercase tracking-widest">{post.date}</span>
                        <h3 className="text-xl md:text-2xl font-serif font-bold text-brand-900 mt-2 group-hover:text-accent-gold transition-colors">{post.title}</h3>
                        <p className="text-sm text-gray-500 mt-4 line-clamp-2 leading-relaxed">{post.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BlogPage;
