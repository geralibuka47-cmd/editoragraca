import React, { useState, useEffect } from 'react';
import { ImageOff } from 'lucide-react';

interface OptimizedImageProps {
    src: string;
    alt: string;
    className?: string;
    fallbackSrc?: string;
    onError?: () => void;
    width?: number;
    height?: number;
    priority?: boolean;
    aspectRatio?: 'book' | 'square' | 'video' | 'auto';
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
    src,
    alt,
    className = '',
    fallbackSrc = 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=500&fit=crop',
    onError,
    width,
    height,
    priority = false,
    aspectRatio = 'auto'
}) => {
    const [imgSrc, setImgSrc] = useState(src);
    const [isLoading, setIsLoading] = useState(!priority); // Skip loading state if priority
    const [hasError, setHasError] = useState(false);

    const aspectClasses = {
        book: 'aspect-[2/3]',
        square: 'aspect-square',
        video: 'aspect-video',
        auto: ''
    };

    useEffect(() => {
        setImgSrc(optimizeImageUrl(src, width, height));
        if (!priority) setIsLoading(true);
        setHasError(false);
    }, [src, width, height, priority]);

    const handleError = () => {
        if (imgSrc !== fallbackSrc) {
            setImgSrc(fallbackSrc);
        } else {
            setHasError(true);
        }
        setIsLoading(false);
        onError?.();
    };

    const handleLoad = () => {
        setIsLoading(false);
    };

    if (hasError) {
        return (
            <div className={`flex items-center justify-center bg-gray-100 ${aspectClasses[aspectRatio]} ${className}`}>
                <div className="text-center p-4">
                    <ImageOff className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500 uppercase font-black text-[10px] tracking-widest">Erro de Mídia</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`relative overflow-hidden ${aspectClasses[aspectRatio]} ${className}`}>
            {isLoading && !priority && (
                <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin" />
                </div>
            )}
            <img
                src={imgSrc}
                alt={alt}
                width={width}
                height={height}
                loading={priority ? 'eager' : 'lazy'}
                fetchPriority={priority ? 'high' : 'auto'}
                decoding={priority ? 'sync' : 'async'}
                className={`w-full h-full object-cover transition-all duration-700 ${isLoading && !priority ? 'opacity-0 scale-105' : 'opacity-100 scale-100'}`}
                onError={handleError}
                onLoad={handleLoad}
            />
        </div>
    );
};

// Utility function to optimize image URL (add query params for resizing)
export const optimizeImageUrl = (url: string, width?: number, height?: number): string => {
    if (!url) return url;

    try {
        // Check if it's an Unsplash URL
        if (url.includes('unsplash.com')) {
            const separator = url.includes('?') ? '&' : '?';
            let params = 'auto=format&q=80';
            if (width) params += `&w=${width}`;
            if (height) params += `&h=${height}`;
            if (width && height) params += '&fit=crop';
            return `${url}${separator}${params}`;
        }

        // Google Drive Optimization (Basic)
        if (url.includes('drive.google.com')) {
            // Convert to direct link if possible or use proxy
            return url.replace('file/d/', 'uc?id=').replace('/view?usp=sharing', '');
        }

        // Generic size hints for CDN-like URLs that support ?w= or ?width=
        if (width && (url.includes('cloudinary') || url.includes('imgix') || url.includes('images.weserv.nl'))) {
            const separator = url.includes('?') ? '&' : '?';
            return `${url}${separator}w=${width}${height ? `&h=${height}` : ''}`;
        }
    } catch (e) {
        return url;
    }

    return url;
};
