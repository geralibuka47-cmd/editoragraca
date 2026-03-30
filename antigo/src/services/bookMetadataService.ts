export interface BookMetadata {
    title: string;
    authors?: string[];
    publisher?: string;
    publishedDate?: string;
    description?: string;
    pageCount?: number;
    categories?: string[];
    coverUrl?: string;
    previewLink?: string;
    source: 'google' | 'openlibrary';
}

import { fetchBookByISBN as fetchFromGoogle } from './googleBooksService';

export const fetchBookMetadata = async (isbn: string): Promise<BookMetadata | null> => {
    const cleanIsbn = isbn.replace(/[- ]/g, '');

    // 1. Try Google Books first
    try {
        const googleData = await fetchFromGoogle(cleanIsbn);
        if (googleData) {
            return {
                title: googleData.title,
                authors: googleData.authors,
                publisher: googleData.publisher,
                publishedDate: googleData.publishedDate,
                description: googleData.description,
                pageCount: googleData.pageCount,
                categories: googleData.categories,
                coverUrl: googleData.imageLinks?.thumbnail,
                previewLink: googleData.previewLink,
                source: 'google'
            };
        }
    } catch (error) {
        console.error('Google Books fallback error:', error);
    }

    // 2. Try Open Library as fallback
    try {
        const response = await fetch(`https://openlibrary.org/api/books?bibkeys=ISBN:${cleanIsbn}&format=json&jscmd=data`);
        const data = await response.json();
        const bookKey = `ISBN:${cleanIsbn}`;

        if (data[bookKey]) {
            const olBook = data[bookKey];
            return {
                title: olBook.title,
                authors: olBook.authors?.map((a: any) => a.name),
                publisher: olBook.publishers?.map((p: any) => p.name).join(', '),
                publishedDate: olBook.publish_date,
                description: olBook.notes || olBook.excerpt,
                pageCount: olBook.number_of_pages,
                coverUrl: olBook.cover?.large || olBook.cover?.medium,
                previewLink: olBook.url,
                source: 'openlibrary'
            };
        }
    } catch (error) {
        console.error('Open Library API error:', error);
    }

    return null;
};
