import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar, ArrowRight, Sparkles } from 'lucide-react';
import { Book, TeamMember } from '../types';
import { OptimizedImage } from './OptimizedImage';
import { Link } from 'react-router-dom';
import { normalizeString, isReleased } from '../services/dataService';

interface UpcomingReleasesProps {
    books: Book[];
    authors: TeamMember[];
}

const UpcomingReleases: React.FC<UpcomingReleasesProps> = ({ books, authors }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Group future books by author
    const groups = useMemo(() => {
        const now = Date.now();
        const futureBooks = books.filter(b => b.launchDate && !isReleased(b.launchDate, now));
        const authorGroups = new Map<string, Book[]>();

        futureBooks.forEach(book => {
            // Stronger normalization for grouping: remove dots and all spaces
            const key = book.authorId || normalizeString(book.author).replace(/[.\s]/g, '');
            if (!authorGroups.has(key)) {
                authorGroups.set(key, []);
            }
            authorGroups.get(key)!.push(book);
        });

        return Array.from(authorGroups.entries()).map(([key, groupBooks]) => {
            const firstBook = groupBooks[0] as any;

            const teamAuthor = authors.find(a =>
                (a.id && a.id.trim() === firstBook.authorId?.trim()) ||
                (normalizeString(a.name).replace(/[.\s]/g, '') === normalizeString(firstBook.author).replace(/[.\s]/g, ''))
            );

            const authorName = firstBook.author || teamAuthor?.name || 'Autor';
            const authorImg = firstBook.authorImageUrl || firstBook.authorPhoto || teamAuthor?.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=C4A052&color=fff`;

            return {
                author: {
                    name: authorName,
                    role: firstBook.authorRole || teamAuthor?.role || 'Autor da Obra',
                    imageUrl: authorImg
                },
                books: groupBooks.sort((a, b) => new Date(a.launchDate!).getTime() - new Date(b.launchDate!).getTime())
            };
        });
    }, [books, authors]);

    if (groups.length === 0) return null;

    const currentGroup = groups[currentIndex];

    const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % groups.length);
    const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + groups.length) % groups.length);

    return (
        <section className="section-fluid bg-[#0A0A0B] text-white overflow-hidden relative py-24 sm:py-32">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-0 right-0 w-[60vw] h-[60vw] bg-brand-primary/10 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2 animate-pulse" />
                <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-brand-primary/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />
            </div>

            <div className="container relative z-10">
                <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
                    <div className="space-y-4">
                        <motion.span
                            initial={{ opacity: 0, letterSpacing: '0.1em' }}
                            whileInView={{ opacity: 1, letterSpacing: '0.4em' }}
                            className="text-brand-primary font-black text-[10px] sm:text-xs uppercase flex items-center gap-3"
                        >
                            <Sparkles className="w-4 h-4" />
                            Exclusividade & Futuro
                        </motion.span>
                        <h2 className="text-white uppercase tracking-tighter leading-[0.8] text-5xl sm:text-7xl md:text-8xl font-black">
                            Novos <br /><span className="text-brand-primary italic font-serif lowercase font-normal">Capítulos</span>
                        </h2>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Slide Indicator */}
                        <div className="hidden sm:flex items-center gap-2 mr-4">
                            {groups.map((_, idx) => (
                                <div
                                    key={idx}
                                    className={`h-1 rounded-full transition-all duration-500 ${idx === currentIndex ? 'w-8 bg-brand-primary' : 'w-2 bg-white/10'}`}
                                />
                            ))}
                        </div>
                        <div className="flex gap-3">
                            <button onClick={prevSlide} className="w-14 h-14 rounded-2xl border border-white/10 flex items-center justify-center hover:bg-brand-primary hover:border-brand-primary transition-all group backdrop-blur-md">
                                <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
                            </button>
                            <button onClick={nextSlide} className="w-14 h-14 rounded-2xl border border-white/10 flex items-center justify-center hover:bg-brand-primary hover:border-brand-primary transition-all group backdrop-blur-md">
                                <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -40 }}
                        transition={{ duration: 0.8, ease: "circOut" }}
                        className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-start"
                    >
                        {/* Author Profile - sticky on large screens */}
                        <div className="lg:col-span-3 lg:sticky lg:top-32 space-y-10">
                            <div className="relative group mx-auto lg:mx-0 w-fit">
                                <div className="absolute -inset-4 bg-brand-primary/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                                <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-[3rem] overflow-hidden border-2 border-white/5 p-1 bg-white/5 backdrop-blur-xl">
                                    <div className="w-full h-full rounded-[2.8rem] overflow-hidden shadow-inner">
                                        <OptimizedImage
                                            src={currentGroup.author.imageUrl}
                                            alt={currentGroup.author.name}
                                            className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                                            aspectRatio="square"
                                            width={200}
                                            height={200}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3 text-center lg:text-left">
                                <h3 className="text-3xl sm:text-4xl font-black uppercase tracking-tight leading-none text-white">{currentGroup.author.name}</h3>
                                <div className="flex flex-col gap-2">
                                    <span className="inline-block w-fit mx-auto lg:mx-0 px-4 py-1.5 bg-brand-primary/10 text-brand-primary rounded-full text-[10px] font-black uppercase tracking-widest border border-brand-primary/20">
                                        {currentGroup.author.role}
                                    </span>
                                    <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.3em] mt-2">Próximos Lançamentos</p>
                                </div>
                            </div>
                        </div>

                        {/* High-End Books Grid */}
                        <div className="lg:col-span-9">
                            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 sm:gap-12">
                                {currentGroup.books.slice(0, 8).map((book, idx) => (
                                    <motion.div
                                        key={book.id}
                                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        transition={{ delay: idx * 0.12, duration: 0.8, ease: "easeOut" }}
                                        className="group"
                                    >
                                        <Link to={`/livro/${book.id}`} className="block relative">
                                            {/* Glow effect on hover */}
                                            <div className="absolute -inset-4 bg-brand-primary/5 blur-2xl rounded-[3rem] opacity-0 group-hover:opacity-100 transition-all duration-700" />

                                            <div className="relative aspect-[2/3] rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-[0_30px_60px_-12px_rgba(0,0,0,0.5)] border border-white/5 transition-all duration-700 group-hover:-translate-y-4 group-hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.6)] group-hover:border-brand-primary/20">
                                                <OptimizedImage
                                                    src={book.coverUrl}
                                                    alt={book.title}
                                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                                    aspectRatio="book"
                                                    width={400}
                                                />
                                                {/* Sophisticated Overlay */}
                                                <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/95 via-black/40 to-transparent">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <div className="h-[1px] w-4 bg-brand-primary"></div>
                                                        <p className="text-[10px] font-black text-brand-primary uppercase tracking-[0.2em]">
                                                            {new Date(book.launchDate!).toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' })}
                                                        </p>
                                                    </div>
                                                    <h4 className="font-black text-sm sm:text-base uppercase tracking-tight text-white line-clamp-2 leading-tight group-hover:text-brand-primary transition-colors">
                                                        {book.title}
                                                    </h4>
                                                </div>
                                            </div>

                                            <div className="mt-6 flex items-center justify-between px-2">
                                                <div className="flex items-center gap-2 text-white/40 group-hover:text-brand-primary transition-colors">
                                                    <span className="text-[10px] font-black uppercase tracking-[0.15em]">Em Produção</span>
                                                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                                </div>
                                                <Calendar className="w-4 h-4 text-white/10 group-hover:text-brand-primary/30 transition-colors" />
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </section>
    );
};

export default UpcomingReleases;
