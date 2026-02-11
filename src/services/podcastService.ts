export interface PodcastEpisode {
    id: string;
    title: string;
    description: string;
    pubDate: string;
    audioUrl: string;
    link: string;
    duration: string;
}

const RSS_URL = 'https://anchor.fm/s/10838fbcc/podcast/rss';

/**
 * Fetches and parses the podcast RSS feed from Anchor.fm using a JSON converter.
 */
export const getPodcastEpisodes = async (): Promise<PodcastEpisode[]> => {
    try {
        // Use rss2json for robust cross-origin fetching and parsing
        const API_KEY = ''; // Free tier usually works without one for low traffic
        const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_URL)}&api_key=${API_KEY}`);

        if (!response.ok) throw new Error('Failed to fetch podcast JSON');

        const data = await response.json();

        if (data.status !== 'ok') {
            console.warn('RSS2JSON status failed:', data.message);
            return [];
        }

        return data.items.map((item: any, index: number) => ({
            id: item.guid || `ep-${index}`,
            title: item.title || "Sem título",
            description: (item.description || "").replace(/<[^>]*>?/gm, '').substring(0, 150) + '...',
            pubDate: item.pubDate || "",
            audioUrl: item.enclosure?.link || "",
            link: item.link || "",
            duration: item.itunes_duration || ""
        }));
    } catch (error) {
        console.error('Error fetching podcast feed:', error);
        return [];
    }
};
