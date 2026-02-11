const INSTAGRAM_TOKEN = import.meta.env.VITE_INSTAGRAM_TOKEN;

export interface InstagramPost {
    id: string;
    media_url: string;
    permalink: string;
    caption?: string;
    timestamp: string;
}

/**
 * Get Instagram posts for the official @editoragraca account.
 * If no VITE_INSTAGRAM_TOKEN is found, it returns a curated set of 
 * representative posts with direct links to the official profile.
 */
export const getInstagramPosts = async (limit: number = 4): Promise<InstagramPost[]> => {
    // Falls back to curated simulation if no token is available
    if (!INSTAGRAM_TOKEN) {
        console.warn('Instagram Token not found. Feed is in simulation mode (Official @editoragraca links).');
        return [
            {
                id: 'sim_1',
                media_url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80',
                permalink: 'https://www.instagram.com/p/DFoX5K7tY_V/', // Example real-ish permalink
                caption: 'Explorando novas histórias na Editora Graça.',
                timestamp: new Date().toISOString()
            },
            {
                id: 'sim_2',
                media_url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80',
                permalink: 'https://www.instagram.com/editoragraca/',
                caption: 'O design da próxima capa. #EditoraGraca',
                timestamp: new Date().toISOString()
            },
            {
                id: 'sim_3',
                media_url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80',
                permalink: 'https://www.instagram.com/editoragraca/',
                caption: 'Clássicos que inspiram o nosso legado.',
                timestamp: new Date().toISOString()
            },
            {
                id: 'sim_4',
                media_url: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=800&q=80',
                permalink: 'https://www.instagram.com/editoragraca/',
                caption: 'Nossa essência editorial. @editoragraca',
                timestamp: new Date().toISOString()
            }
        ];
    }

    try {
        const response = await fetch(`https://graph.instagram.com/me/media?fields=id,media_url,permalink,caption,timestamp&limit=${limit}&access_token=${INSTAGRAM_TOKEN}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.data || [];
    } catch (error) {
        console.error('Instagram API Error:', error);
        return [];
    }
};
