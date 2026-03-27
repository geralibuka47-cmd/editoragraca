import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar, User, BookOpen, Quote, ArrowRight } from 'lucide-react';
import { Book, TeamMember } from '../types';
import { OptimizedImage, optimizeImageUrl } from './OptimizedImage';
import { Link } from 'react-router-dom';
import { normalizeString, isReleased } from '../services/dataService';

interface UpcomingReleasesProps {
    books: Book[];
    authors: TeamMember[];
}

const UpcomingReleases: React.FC<UpcomingReleasesProps> = ({ books, authors }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Prepare future books with their authors (One slide per book)
    const futureItems = useMemo(() => {
        const now = Date.now();
        const filtered = books.filter(b => b.launchDate && !isReleased(b.launchDate, now));

        // Sort by launch date (nearest first)
        return filtered.sort((a, b) => {
            const dateA = new Date(a.launchDate!).getTime();
            const dateB = new Date(b.launchDate!).getTime();
            return dateA - dateB;
        }).map(book => {
            const authorKey = book.authorId || book.author;
            const authorData = authors.find(a =>
                (a.id && a.id.trim() === authorKey.trim()) ||
                (normalizeString(a.name) === normalizeString(authorKey))
            );
            return {
                book,
                author: authorData || {
                    name: book.author || 'Autor da Obra',
                    role: 'Autor',
                    bio: 'Escritor de prestígio da Editora Graça.',
                    imageUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(book.author || 'A')}&background=C4A052&color=fff`
                }
            };
        });
    }, [books, authors]);

    if (futureItems.length === 0) return null;

    const currentItem = futureItems[currentIndex];

    const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % futureItems.length);
    const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + futureItems.length) % futureItems.length);

    return (
        <section className="section-fluid bg-brand-dark text-white overflow-hidden relative">
            {/* Background Decorative Element */}
            <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-brand-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />

            <div className="container relative z-10">
                <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
                    <div className="space-y-4">
                        <span className="text-brand-primary font-black text-xs uppercase tracking-[0.4em] flex items-center gap-3">
                            <Calendar className="w-4 h-4" />
                            Em Antevisão
                        </span>
                        <h2 className="text-white uppercase tracking-tighter leading-[0.85]">
                            Futuros <br /><span className="text-brand-primary italic font-serif lowercase font-normal">Lançamentos</span>
                        </h2>
                    </div>

                    <div className="flex gap-4">
                        <button onClick={prevSlide} className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center hover:bg-brand-primary hover:border-brand-primary transition-all group">
                            <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
                        </button>
                        <button onClick={nextSlide} className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center hover:bg-brand-primary hover:border-brand-primary transition-all group">
                            <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentItem.book.id}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.6, ease: "circOut" }}
                        className="grid lg:grid-cols-12 gap-16 items-center"
                    >
                        {/* Author Info Column */}
                        <div className="lg:col-span-4 space-y-10">
                            <div className="flex items-center gap-6">
                                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-[2rem] overflow-hidden border-2 border-brand-primary/20 p-1">
                                    <div className="w-full h-full rounded-[1.8rem] overflow-hidden">
                                        <OptimizedImage
                                            src={currentItem.author.imageUrl}
                                            alt={currentItem.author.name}
                                            className="w-full h-full object-cover"
                                            aspectRatio="square"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">{currentItem.author.name}</h3>
                                    <span className="inline-block px-3 py-1 bg-brand-primary/10 text-brand-primary rounded-lg text-[10px] font-black uppercase tracking-widest border border-brand-primary/20">
                                        {currentItem.author.role || 'Autor'}
                                    </span>
                                </div>
                            </div>

                            <div className="relative">
                                <Quote className="absolute -top-6 -left-6 w-12 h-12 text-white/5" />
                                <p className="text-xl text-gray-400 font-medium leading-relaxed italic border-l-2 border-brand-primary/30 pl-8">
                                    {currentItem.author.bio || 'Escritor de prestígio da Editora Graça.'}
                                </p>
                            </div>

                            <div className="pt-6 flex items-center gap-6 opacity-40">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">
                                        Previsto: {new Date(currentItem.book.launchDate!).toLocaleDateString('pt-PT', { day: '2-digit', month: 'long', year: 'numeric' })}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Featured Book Column */}
                        <div className="lg:col-span-8 flex justify-center lg:justify-end">
                            <div className="relative group w-full max-w-2xl">
                                <div className="absolute inset-0 bg-brand-primary/20 blur-[100px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                                <Link to={`/livro/${currentItem.book.id}`} className="block relative z-10">
                                    <div className="aspect-[16/9] sm:aspect-[21/9] rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/5 flex bg-brand-dark/50">
                                        {/* Cover Image Side */}
                                        <div className="w-1/3 sm:w-1/4 h-full relative">
                                            <OptimizedImage
                                                src={currentItem.book.coverUrl}
                                                alt={currentItem.book.title}
                                                className="w-full h-full object-cover"
                                                aspectRatio="book"
                                                priority={true}
                                            />
                                        </div>
                                        {/* Content Side */}
                                        <div className="flex-1 flex flex-col justify-center p-8 sm:p-12 space-y-4">
                                            <div className="flex items-center gap-3">
                                                <span className="h-[2px] w-8 bg-brand-primary" />
                                                <span className="text-brand-primary font-black uppercase tracking-[0.2em] text-[10px]">Em Produção</span>
                                            </div>
                                            <h4 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter leading-none">{currentItem.book.title}</h4>
                                            <p className="text-gray-400 text-sm sm:text-base line-clamp-3 font-medium">{currentItem.book.description}</p>
                                            <div className="pt-4">
                                                <button className="flex items-center gap-3 text-white/60 hover:text-brand-primary transition-colors font-black uppercase tracking-widest text-[10px] group/btn">
                                                    Explorar Projeto <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </section>
    );
};

export default UpcomingReleases;
