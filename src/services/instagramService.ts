const INSTAGRAM_TOKEN = import.meta.env.VITE_INSTAGRAM_TOKEN;

export interface InstagramPost {
    id: string;
    media_url: string;
    permalink: string;
    caption?: string;
    timestamp: string;
}

export const getInstagramPosts = async (limit: number = 4): Promise<InstagramPost[]> => {
    if (!INSTAGRAM_TOKEN) {
        console.warn('Instagram Token not found. Feed is in simulation mode.');
        return [
            {
                id: '1',
                media_url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80',
                permalink: 'https://instagram.com',
                caption: 'Explorando novas histórias.',
                timestamp: new Date().toISOString()
            },
            {
                id: '2',
                media_url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80',
                permalink: 'https://instagram.com',
                caption: 'O design da próxima capa.',
                timestamp: new Date().toISOString()
            },
            {
                id: '3',
                media_url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80',
                permalink: 'https://instagram.com',
                caption: 'Clássicos que inspiram.',
                timestamp: new Date().toISOString()
            },
            {
                id: '4',
                media_url: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=800&q=80',
                permalink: 'https://instagram.com',
                caption: 'Nossa sede em Malanje.',
                timestamp: new Date().toISOString()
            }
        ];
    }

    try {
        const response = await fetch(`https://graph.instagram.com/me/media?fields=id,media_url,permalink,caption,timestamp&limit=${limit}&access_token=${INSTAGRAM_TOKEN}`);
        const data = await response.json();
        return data.data || [];
    } catch (error) {
        console.error('Instagram API Error:', error);
        return [];
    }
};
