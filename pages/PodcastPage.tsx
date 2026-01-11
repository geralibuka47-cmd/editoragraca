
import React from 'react';
import SectionHeader from '../components/SectionHeader';
import { PODCAST_EPISODES } from '../constants';
import { Play, Clock, Calendar } from 'lucide-react';

const PodcastPage: React.FC = () => {
    return (
        <div className="py-16 md:py-32 max-w-7xl mx-auto px-4 md:px-6 animate-fade-in">
            <SectionHeader title="Podcast Graça" subtitle="Conversas Literárias" />
            <div className="space-y-8">
                {PODCAST_EPISODES.map(ep => (
                    <div key={ep.id} className="bg-white p-6 md:p-8 rounded-[2rem] border border-brand-100 shadow-sm flex flex-col md:flex-row gap-8 items-center">
                        <div className="w-full md:w-48 aspect-square rounded-2xl overflow-hidden shrink-0">
                            <img src={ep.imageUrl} className="w-full h-full object-cover" alt={ep.title} />
                        </div>
                        <div className="flex-1 space-y-4">
                            <div className="flex flex-wrap gap-4 text-[10px] font-bold text-accent-gold uppercase tracking-widest">
                                <span className="flex items-center gap-1"><Calendar size={12} /> {ep.date}</span>
                                <span className="flex items-center gap-1"><Clock size={12} /> {ep.duration}</span>
                            </div>
                            <h3 className="text-2xl font-serif font-bold text-brand-900">{ep.title}</h3>
                            <p className="text-sm text-gray-500">{ep.description}</p>
                            <button className="flex items-center gap-2 px-6 py-3 bg-brand-900 text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-accent-gold transition-all">
                                <Play size={14} fill="currentColor" /> Ouvir Episódio
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PodcastPage;
