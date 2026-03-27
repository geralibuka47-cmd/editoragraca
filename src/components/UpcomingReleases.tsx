import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar, User, BookOpen, Quote } from 'lucide-react';
import { Book, TeamMember } from '../types';
import { optimizeImageUrl } from './OptimizedImage';
import { Link } from 'react-router-dom';

interface UpcomingReleasesProps {
    books: Book[];
    authors: TeamMember[];
}

const UpcomingReleases: React.FC<UpcomingReleasesProps> = ({ books, authors }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Group future books by author
    const groups = useMemo(() => {
        const futureBooks = books.filter(b => b.launchDate && new Date(b.launchDate) > new Date());
        const authorGroups = new Map<string, Book[]>();

        futureBooks.forEach(book => {
            const key = book.authorId || book.author;
            if (!authorGroups.has(key)) {
                authorGroups.set(key, []);
            }
            authorGroups.get(key)!.push(book);
        });

        return Array.from(authorGroups.entries()).map(([key, books]) => {
            const authorData = authors.find(a => a.id === key || a.name === key);
            return {
                author: authorData || { name: key, role: 'Autor', bio: 'Escritor de prestígio da Editora Graça.', imageUrl: `https://ui-avatars.com/api/?name=${key}&background=C4A052&color=fff` },
                books
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
                        className="grid lg:grid-cols-12 gap-16 items-center"
                    >
                        {/* Author Info Column */}
                        <div className="lg:col-span-5 space-y-10">
                            <div className="flex items-center gap-6">
                                <div className="w-24 h-24 rounded-3xl overflow-hidden border-2 border-brand-primary/20 p-1">
                                    <img
                                        src={currentGroup.author.imageUrl}
                                        alt={currentGroup.author.name}
                                        className="w-full h-full object-cover rounded-2xl"
                                    />
                                </div>
                                <div>
                                    <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">{currentGroup.author.name}</h3>
                                    <p className="text-brand-primary font-bold uppercase text-[10px] tracking-widest mt-1">{currentGroup.author.role || 'Autor'}</p>
                                </div>
                            </div>

                            <div className="relative">
                                <Quote className="absolute -top-6 -left-6 w-12 h-12 text-white/5" />
                                <p className="text-xl text-gray-400 font-medium leading-relaxed italic border-l-2 border-brand-primary/30 pl-8">
                                    {currentGroup.author.bio}
                                </p>
                            </div>

                            <div className="pt-6 flex items-center gap-6 opacity-40">
                                <div className="flex items-center gap-2">
                                    <BookOpen className="w-4 h-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">{currentGroup.books.length} Obras em Produção</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Autor Exclusivo</span>
                                </div>
                            </div>
                        </div>

                        {/* Books Grid Column */}
                        <div className="lg:col-span-7">
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-10">
                                {currentGroup.books.map((book, idx) => (
                                    <motion.div
                                        key={book.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 + (idx * 0.1) }}
                                        className="group"
                                    >
                                        <Link to={`/livro/${book.id}`} className="block space-y-4">
                                            <div className="aspect-[2/3] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 group-hover:scale-[1.05] group-hover:-translate-y-2 border border-white/5">
                                                <img
                                                    src={optimizeImageUrl(book.coverUrl)}
                                                    alt={book.title}
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                                                    <p className="text-[9px] font-black text-brand-primary uppercase tracking-widest">
                                                        {new Date(book.launchDate!).toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' })}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <h4 className="font-black text-sm sm:text-base uppercase tracking-tight group-hover:text-brand-primary transition-colors line-clamp-2">{book.title}</h4>
                                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Brevemente</p>
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
