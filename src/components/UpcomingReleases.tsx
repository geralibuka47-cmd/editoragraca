import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar, ArrowRight } from 'lucide-react';
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
            const key = book.authorId || normalizeString(book.author);
            if (!authorGroups.has(key)) {
                authorGroups.set(key, []);
            }
            authorGroups.get(key)!.push(book);
        });

        return Array.from(authorGroups.entries()).map(([key, groupBooks]) => {
            const firstBook = groupBooks[0] as any;

            const teamAuthor = authors.find(a =>
                (a.id && a.id.trim() === firstBook.authorId?.trim()) ||
                (normalizeString(a.name) === normalizeString(firstBook.author))
            );

            const authorName = firstBook.author || teamAuthor?.name || 'Autor';
            const authorImg = firstBook.authorImageUrl || firstBook.authorPhoto || teamAuthor?.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=C4A052&color=fff`;

            return {
                author: {
                    name: authorName,
                    role: firstBook.authorRole || teamAuthor?.role || 'Autor de Referência',
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
                        key={currentIndex}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.6, ease: "circOut" }}
                        className="grid lg:grid-cols-12 gap-12 items-center"
                    >
                        {/* Compact Author Info Column */}
                        <div className="lg:col-span-3 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
                            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-[2.5rem] overflow-hidden border-2 border-brand-primary/20 p-1 bg-brand-dark/50">
                                <div className="w-full h-full rounded-[2.2rem] overflow-hidden">
                                    <OptimizedImage
                                        src={currentGroup.author.imageUrl}
                                        alt={currentGroup.author.name}
                                        className="w-full h-full object-cover"
                                        aspectRatio="square"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight leading-tight">{currentGroup.author.name}</h3>
                                <span className="inline-block px-3 py-1 bg-brand-primary/10 text-brand-primary rounded-lg text-[10px] font-black uppercase tracking-widest border border-brand-primary/20">
                                    {currentGroup.author.role}
                                </span>
                            </div>
                        </div>

                        {/* Expanded Books Grid Column */}
                        <div className="lg:col-span-9">
                            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
                                {currentGroup.books.slice(0, 8).map((book, idx) => (
                                    <motion.div
                                        key={book.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 + (idx * 0.1) }}
                                        className="group"
                                    >
                                        <Link to={`/livro/${book.id}`} className="block space-y-4">
                                            <div className="aspect-[2/3] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 group-hover:scale-[1.05] group-hover:-translate-y-2 border border-white/5 relative">
                                                <OptimizedImage
                                                    src={book.coverUrl}
                                                    alt={book.title}
                                                    className="w-full h-full object-cover"
                                                    aspectRatio="book"
                                                    width={400}
                                                />
                                                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
                                                    <p className="text-[10px] font-black text-brand-primary uppercase tracking-[0.2em] mb-1">
                                                        {new Date(book.launchDate!).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short' })}
                                                    </p>
                                                    <h4 className="font-black text-xs sm:text-sm uppercase tracking-tight text-white line-clamp-2 leading-tight">{book.title}</h4>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 text-brand-primary/60 group-hover:text-brand-primary transition-colors">
                                                <span className="text-[9px] font-black uppercase tracking-widest">Ver Detalhes</span>
                                                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
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
