
import { PodcastEpisode } from '../types';

const RSS_URL = 'https://anchor.fm/s/10838fbcc/podcast/rss';

export const fetchPodcastEpisodes = async (): Promise<PodcastEpisode[]> => {
    try {
        // Use rss2json to bypass CORS issues if fetching directly fails in browser
        const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_URL)}`);
        const data = await response.json();

        if (data.status !== 'ok') {
            throw new Error('Failed to fetch RSS feed');
        }

        return data.items.map((item: any, index: number) => ({
            id: item.guid || index.toString(),
            title: item.title,
            description: item.description.replace(/<[^>]*>?/gm, '').substring(0, 250) + '...',
            date: item.pubDate,
            duration: item.itunes_duration || '00:00', // rss2json sometimes includes itunes tags
            audioUrl: item.enclosure.link,
            imageUrl: item.thumbnail || item.enclosure.thumbnail || 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400&h=400&fit=crop'
        }));
    } catch (error) {
        console.error('Error fetching podcast episodes:', error);
        return [];
    }
};
