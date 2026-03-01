import { algoliasearch } from 'algoliasearch';
import { Book, BlogPost } from '../types';
import { getBooks, getBlogPosts } from './dataService';

const ALGOLIA_APP_ID = import.meta.env.VITE_ALGOLIA_APP_ID;
const ALGOLIA_SEARCH_KEY = import.meta.env.VITE_ALGOLIA_SEARCH_KEY;
const ALGOLIA_INDEX = import.meta.env.VITE_ALGOLIA_INDEX || 'books';

export interface SearchResult {
    id: string;
    title: string;
    type: 'book' | 'post';
    url: string;
    image?: string;
    subtitle?: string;
}

export const instantSearch = async (query: string): Promise<SearchResult[]> => {
    if (!query || query.length < 2) return [];

    // 1. If Algolia is configured, use it
    if (ALGOLIA_APP_ID && ALGOLIA_SEARCH_KEY) {
        try {
            const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_SEARCH_KEY);
            const { results } = await client.search({
                requests: [
                    {
                        indexName: ALGOLIA_INDEX,
                        query: query,
                        hitsPerPage: 5,
                    },
                ],
            });

            // Map Algolia hits to SearchResult
            // This assumes the index is already populated with books/posts
            const hits = (results[0] as any).hits as any[];
            return hits.map(hit => ({
                id: hit.objectID,
                title: hit.title,
                type: hit.type || 'book',
                url: hit.type === 'post' ? `/blog/${hit.objectID}` : `/livros/${hit.objectID}`,
                image: hit.coverUrl || hit.imageUrl,
                subtitle: hit.author || hit.excerpt
            }));
        } catch (error) {
            console.error('Algolia Search Error:', error);
            // Fallback to local search if Algolia fails
        }
    }

    // 2. Local Fallback (Simulation but functional)
    try {
        const [books, posts] = await Promise.all([getBooks(), getBlogPosts()]);
        const lowQuery = query.toLowerCase();

        const bookResults: SearchResult[] = books
            .filter(b => b.title.toLowerCase().includes(lowQuery) || b.author.toLowerCase().includes(lowQuery))
            .slice(0, 3)
            .map(b => ({
                id: b.id,
                title: b.title,
                type: 'book',
                url: `/livros/${b.id}`,
                image: b.coverUrl,
                subtitle: b.author
            }));

        const postResults: SearchResult[] = (posts || [])
            .filter(p => p.title.toLowerCase().includes(lowQuery))
            .slice(0, 3)
            .map(p => ({
                id: p.id,
                title: p.title,
                type: 'post',
                url: `/blog/${p.id}`,
                image: p.imageUrl,
                subtitle: 'Blog Post'
            }));

        return [...bookResults, ...postResults];
    } catch (error) {
        console.error('Local Search Error:', error);
        return [];
    }
};
