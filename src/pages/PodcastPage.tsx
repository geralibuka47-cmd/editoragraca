import React, { useState, useEffect } from 'react';
import { Play, Pause, Volume2, Calendar, Clock, Loader2, ExternalLink } from 'lucide-react';
import { ViewState, PodcastEpisode } from '../types';
import { fetchPodcastEpisodes } from '../services/podcastService';

interface PodcastPageProps {
    onNavigate: (view: ViewState) => void;
}

const PodcastPage: React.FC<PodcastPageProps> = ({ onNavigate }) => {
    const [episodes, setEpisodes] = useState<PodcastEpisode[]>([]);
    const [selectedEpisode, setSelectedEpisode] = useState<PodcastEpisode | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadEpisodes = async () => {
            setIsLoading(true);
            try {
                const data = await fetchPodcastEpisodes();
                setEpisodes(data);
                if (data.length > 0) {
                    setSelectedEpisode(data[0]);
                }
            } catch (error) {
                console.error("Erro ao carregar episódios:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadEpisodes();
    }, []);

    const currentEpisode = selectedEpisode || (episodes.length > 0 ? episodes[0] : null);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-brand-light flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-brand-primary animate-spin mx-auto mb-4" />
                    <p className="font-serif text-xl font-bold text-brand-dark italic">Sintonizando frequençias...</p>
                </div>
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
                        <span>Podcast</span>
                    </div>

                    <div className="max-w-4xl text-center md:text-left">
                        <h1 className="text-4xl md:text-7xl font-black tracking-tighter mb-4 md:mb-6 leading-tight">
                            Vozes da <span className="text-brand-primary italic font-serif font-normal">Literatura</span>
                        </h1>
                        <p className="text-lg md:text-2xl text-gray-300 leading-relaxed font-medium">
                            Conversas inspiradoras sobre literatura, publicação e o mundo editorial angolano.
                        </p>
                    </div>
                </div>
            </section>

            {/* Player */}
            {currentEpisode && (
                <section className="py-8 md:py-12 bg-white border-b border-gray-200 sticky top-0 z-40 shadow-md">
                    <div className="container mx-auto px-4 md:px-8">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden bg-gray-200 flex-shrink-0 shadow-inner">
                                <img
                                    src={currentEpisode.imageUrl}
                                    alt={currentEpisode.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className="flex-1 text-center md:text-left min-w-0">
                                <h3 className="text-lg md:text-xl font-bold text-brand-dark mb-1 truncate">{currentEpisode.title}</h3>
                                <p className="text-xs md:text-sm text-gray-600">{currentEpisode.duration}</p>
                            </div>

                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setIsPlaying(!isPlaying)}
                                    className="w-14 h-14 md:w-16 md:h-16 bg-brand-primary rounded-full flex items-center justify-center hover:bg-brand-dark transition-all shadow-lg"
                                    title={isPlaying ? 'Pausar' : 'Reproduzir'}
                                    aria-label={isPlaying ? 'Pausar episódio' : 'Reproduzir episódio'}
                                >
                                    {isPlaying ? (
                                        <Pause className="w-6 h-6 md:w-8 md:h-8 text-white" />
                                    ) : (
                                        <Play className="w-6 h-6 md:w-8 md:h-8 text-white ml-1" />
                                    )}
                                </button>
                                <button
                                    className="w-10 h-10 md:w-12 md:h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-all text-brand-dark"
                                    title="Volume"
                                    aria-label="Controle de volume"
                                >
                                    <Volume2 className="w-4 h-4 md:w-5 md:h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-6">
                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className={`h-full bg-brand-primary rounded-full transition-all duration-300 ${isPlaying ? 'progress-bar-playing' : 'progress-bar-stopped'}`}
                                />
                            </div>
                            <div className="flex justify-between text-xs text-gray-600 mt-2">
                                <span>0:00</span>
                                <span>{currentEpisode.duration}</span>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Episodes */}
            <section className="py-24">
                <div className="container mx-auto px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black text-brand-dark tracking-tighter mb-6">
                            Episódios <span className="text-brand-primary italic font-serif font-normal">Recentes</span>
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Ouça conversas inspiradoras com autores, editores e profissionais do setor diretamente do nosso feed RSS.
                        </p>
                    </div>

                    {episodes.length > 0 ? (
                        <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
                            {episodes.map((episode) => (
                                <div
                                    key={episode.id}
                                    className={`bg-white rounded-2xl shadow-lg p-4 md:p-6 hover:shadow-xl transition-all cursor-pointer ${selectedEpisode?.id === episode.id ? 'ring-2 ring-brand-primary' : ''
                                        }`}
                                    onClick={() => setSelectedEpisode(episode)}
                                >
                                    <div className="flex flex-col sm:flex-row gap-4 md:gap-6 relative">
                                        <div className="w-full sm:w-32 h-48 sm:h-32 rounded-xl overflow-hidden bg-gray-200 flex-shrink-0">
                                            <img
                                                src={episode.imageUrl}
                                                alt={episode.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        <div className="flex-1 min-w-0 pr-14 sm:pr-0">
                                            <h3 className="text-xl md:text-2xl font-black text-brand-dark mb-2 hover:text-brand-primary transition-colors leading-tight">
                                                {episode.title}
                                            </h3>
                                            <p className="text-sm md:text-base text-gray-700 mb-4 leading-relaxed line-clamp-2 md:line-clamp-none">
                                                {episode.description}
                                            </p>
                                            <div className="flex flex-wrap items-center gap-4 md:gap-6 text-[11px] md:text-sm text-gray-600">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                                    <span>{new Date(episode.date).toLocaleDateString('pt-AO', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                                    <span>{episode.duration}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedEpisode(episode);
                                                setIsPlaying(!isPlaying);
                                            }}
                                            className="absolute top-0 right-0 sm:relative w-12 h-12 bg-brand-primary rounded-full flex items-center justify-center hover:bg-brand-dark transition-all flex-shrink-0"
                                            title="Reproduzir"
                                            aria-label="Reproduzir episódio"
                                        >
                                            <Play className="w-5 h-5 text-white ml-0.5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-500 italic">Nenhum episódio encontrado no momento.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 bg-brand-primary text-white">
                <div className="container mx-auto px-8 text-center">
                    <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-6">
                        Inscreva-se no Podcast
                    </h2>
                    <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
                        Não perca os novos episódios. Disponível em todas as plataformas de podcast.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <a
                            href="https://open.spotify.com/show/5tmoJM2XJ6BxLAekz4Wmzl"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-8 py-3 bg-white text-brand-primary font-bold rounded-lg hover:bg-brand-dark hover:text-white transition-all flex items-center gap-2"
                        >
                            Spotify <ExternalLink className="w-4 h-4" />
                        </a>
                        <button className="px-8 py-3 bg-white text-brand-primary font-bold rounded-lg hover:bg-brand-dark hover:text-white transition-all">
                            Apple Podcasts
                        </button>
                        <button className="px-8 py-3 bg-white text-brand-primary font-bold rounded-lg hover:bg-brand-dark hover:text-white transition-all">
                            Google Podcasts
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default PodcastPage;
