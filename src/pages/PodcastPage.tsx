import React, { useState } from 'react';
import { Play, Pause, Volume2, Calendar, Clock } from 'lucide-react';
import { ViewState, PodcastEpisode } from '../types';

interface PodcastPageProps {
    onNavigate: (view: ViewState) => void;
}

const PodcastPage: React.FC<PodcastPageProps> = ({ onNavigate }) => {
    const [selectedEpisode, setSelectedEpisode] = useState<PodcastEpisode | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const episodes: PodcastEpisode[] = [
        {
            id: '1',
            title: 'O Futuro da Literatura Angolana',
            description: 'Conversamos com jovens autores sobre suas expectativas e desafios no cenário literário angolano.',
            date: '2026-01-10',
            duration: '45:30',
            audioUrl: '#',
            imageUrl: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400&h=400&fit=crop'
        },
        {
            id: '2',
            title: 'Histórias Por Trás das Capas',
            description: 'Um designer gráfico partilha os bastidores da criação de capas icónicas de livros angolanos.',
            date: '2026-01-03',
            duration: '38:15',
            audioUrl: '#',
            imageUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&h=400&fit=crop'
        },
        {
            id: '3',
            title: 'Marketing para Autores Independentes',
            description: 'Estratégias práticas para promover seu livro e alcançar mais leitores sem grande orçamento.',
            date: '2025-12-27',
            duration: '52:00',
            audioUrl: '#',
            imageUrl: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400&h=400&fit=crop'
        },
        {
            id: '4',
            title: 'A Arte da Revisão',
            description: 'Revisores profissionais explicam como transformam manuscritos em obras polidas e prontas para publicação.',
            date: '2025-12-20',
            duration: '41:45',
            audioUrl: '#',
            imageUrl: 'https://images.unsplash.com/photo-1590935216814-f162c873e678?w=400&h=400&fit=crop'
        }
    ];

    const currentEpisode = selectedEpisode || episodes[0];

    return (
        <div className="min-h-screen bg-brand-light">
            {/* Hero */}
            <section className="bg-brand-dark text-white py-20">
                <div className="container mx-auto px-8">
                    <div className="flex items-center gap-2 text-sm text-brand-primary uppercase tracking-widest font-bold mb-6">
                        <button onClick={() => onNavigate('HOME')} className="hover:underline">Início</button>
                        <span>/</span>
                        <span>Podcast</span>
                    </div>

                    <div className="max-w-4xl">
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
                            Vozes da <span className="text-brand-primary italic font-serif font-normal">Literatura</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-300 leading-relaxed font-medium">
                            Conversas inspiradoras sobre literatura, publicação e o mundo editorial angolano.
                        </p>
                    </div>
                </div>
            </section>

            {/* Player */}
            <section className="py-12 bg-white border-b border-gray-200 sticky top-0 z-40 shadow-md">
                <div className="container mx-auto px-8">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-200 flex-shrink-0">
                            <img
                                src={currentEpisode.imageUrl}
                                alt={currentEpisode.title}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            <h3 className="text-xl font-bold text-brand-dark mb-1">{currentEpisode.title}</h3>
                            <p className="text-sm text-gray-600">{currentEpisode.duration}</p>
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setIsPlaying(!isPlaying)}
                                className="w-16 h-16 bg-brand-primary rounded-full flex items-center justify-center hover:bg-brand-dark transition-all shadow-lg"
                                title={isPlaying ? 'Pausar' : 'Reproduzir'}
                                aria-label={isPlaying ? 'Pausar episódio' : 'Reproduzir episódio'}
                            >
                                {isPlaying ? (
                                    <Pause className="w-8 h-8 text-white" />
                                ) : (
                                    <Play className="w-8 h-8 text-white ml-1" />
                                )}
                            </button>
                            <button
                                className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-all"
                                title="Volume"
                                aria-label="Controle de volume"
                            >
                                <Volume2 className="w-5 h-5 text-brand-dark" />
                            </button>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-6">
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-brand-primary rounded-full transition-all duration-300"
                                style={{ width: isPlaying ? '30%' : '0%' }}
                            />
                        </div>
                        <div className="flex justify-between text-xs text-gray-600 mt-2">
                            <span>0:00</span>
                            <span>{currentEpisode.duration}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Episodes */}
            <section className="py-24">
                <div className="container mx-auto px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black text-brand-dark tracking-tighter mb-6">
                            Episódios <span className="text-brand-primary italic font-serif font-normal">Recentes</span>
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Ouça conversas inspiradoras com autores, editores e profissionais do setor.
                        </p>
                    </div>

                    <div className="max-w-4xl mx-auto space-y-6">
                        {episodes.map((episode) => (
                            <div
                                key={episode.id}
                                className={`bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all cursor-pointer ${selectedEpisode?.id === episode.id ? 'ring-2 ring-brand-primary' : ''
                                    }`}
                                onClick={() => setSelectedEpisode(episode)}
                            >
                                <div className="flex gap-6">
                                    <div className="w-32 h-32 rounded-xl overflow-hidden bg-gray-200 flex-shrink-0">
                                        <img
                                            src={episode.imageUrl}
                                            alt={episode.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    <div className="flex-1">
                                        <h3 className="text-2xl font-black text-brand-dark mb-2 hover:text-brand-primary transition-colors">
                                            {episode.title}
                                        </h3>
                                        <p className="text-gray-700 mb-4 leading-relaxed">
                                            {episode.description}
                                        </p>
                                        <div className="flex items-center gap-6 text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4" />
                                                <span>{new Date(episode.date).toLocaleDateString('pt-AO', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4" />
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
                                        className="w-12 h-12 bg-brand-primary rounded-full flex items-center justify-center hover:bg-brand-dark transition-all flex-shrink-0"
                                        title="Reproduzir"
                                        aria-label="Reproduzir episódio"
                                    >
                                        <Play className="w-6 h-6 text-white ml-1" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
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
                        <button className="px-8 py-3 bg-white text-brand-primary font-bold rounded-lg hover:bg-brand-dark hover:text-white transition-all">
                            Spotify
                        </button>
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
