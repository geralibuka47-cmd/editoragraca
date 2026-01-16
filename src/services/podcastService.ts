
import { PodcastEpisode } from '../types';

const RSS_URL = 'https://anchor.fm/s/10838fbcc/podcast/rss';
const TIMEOUT_MS = 3000; // 3 seconds timeout
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

// Cache
let podcastCache: PodcastEpisode[] | null = null;
let lastPodcastFetch = 0;

// Timeout wrapper for fetch
const fetchWithTimeout = async (url: string, timeout: number): Promise<Response> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);
        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        throw error;
    }
};

export const fetchPodcastEpisodes = async (forceRefresh = false): Promise<PodcastEpisode[]> => {
    const now = Date.now();

    // Return cache if valid
    if (!forceRefresh && podcastCache && (now - lastPodcastFetch < CACHE_DURATION)) {
        console.log("podcastService - Retornando episódios do cache");
        return podcastCache;
    }

    try {
        // Use timeout to prevent blocking
        const response = await fetchWithTimeout(
            `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_URL)}`,
            TIMEOUT_MS
        );

        const data = await response.json();

        if (data.status !== 'ok') {
            throw new Error('Failed to fetch RSS feed');
        }

        const episodes = data.items.map((item: any, index: number) => ({
            id: item.guid || index.toString(),
            title: item.title,
            description: item.description.replace(/<[^>]*>?/gm, '').substring(0, 250) + '...',
            date: item.pubDate,
            duration: item.itunes_duration || '00:00',
            audioUrl: item.enclosure.link,
            imageUrl: item.thumbnail || item.enclosure.thumbnail || 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400&h=400&fit=crop'
        }));

        // Update cache
        podcastCache = episodes;
        lastPodcastFetch = now;

        return episodes;
    } catch (error) {
        console.warn('Podcast service timeout or error - returning cached or empty:', error);
        // Return cache if available, otherwise empty array
        return podcastCache || [];
    }
};
