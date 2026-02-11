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
 * Fetches and parses the podcast RSS feed from Anchor.fm.
 */
export const getPodcastEpisodes = async (): Promise<PodcastEpisode[]> => {
    try {
        // Note: Direct fetch to anchor.fm might encounter CORS issues in some environments.
        // We use a try/catch and could potentially use a proxy if needed.
        const response = await fetch(RSS_URL);
        if (!response.ok) throw new Error('Failed to fetch RSS feed');

        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "text/xml");

        const items = xmlDoc.querySelectorAll("item");
        const episodes: PodcastEpisode[] = [];

        items.forEach((item, index) => {
            const title = item.querySelector("title")?.textContent || "Sem título";
            const description = item.querySelector("description")?.textContent || "";
            const pubDate = item.querySelector("pubDate")?.textContent || "";
            const link = item.querySelector("link")?.textContent || "";
            const audioUrl = item.querySelector("enclosure")?.getAttribute("url") || "";
            const duration = item.querySelector("itunes\\:duration, duration")?.textContent || "";

            // Generate a simple ID if none exists
            const id = item.querySelector("guid")?.textContent || `ep-${index}`;

            // Clean up description (remove HTML if necessary)
            const cleanDescription = description.replace(/<[^>]*>?/gm, '').substring(0, 150) + '...';

            episodes.push({
                id,
                title,
                description: cleanDescription,
                pubDate,
                audioUrl,
                link,
                duration
            });
        });

        return episodes;
    } catch (error) {
        console.error('Error fetching podcast feed:', error);
        return [];
    }
};
