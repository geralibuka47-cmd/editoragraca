export interface GoogleBookVolumeInfo {
    title: string;
    authors?: string[];
    publisher?: string;
    publishedDate?: string;
    description?: string;
    pageCount?: number;
    categories?: string[];
    imageLinks?: {
        thumbnail?: string;
        smallThumbnail?: string;
    };
    previewLink?: string;
    infoLink?: string;
}

export const fetchBookByISBN = async (isbn: string): Promise<GoogleBookVolumeInfo | null> => {
    try {
        const cleanIsbn = isbn.replace(/[- ]/g, '');
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${cleanIsbn}`);
        const data = await response.json();

        if (data.totalItems > 0) {
            return data.items[0].volumeInfo as GoogleBookVolumeInfo;
        }
        return null;
    } catch (error) {
        console.error('Google Books API Error:', error);
        return null;
    }
};
