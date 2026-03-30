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
    fallbackSrc = 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=600&fit=crop',
    onError,
    width,
    height,
    priority = false,
    aspectRatio = 'auto'
}) => {
    const optimized = optimizeImageUrl(src, width, height);
    const [imgSrc, setImgSrc] = useState(optimized);
    const [isLoading, setIsLoading] = useState(!priority);
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
        // On error: try direct URL first, then fallback
        if (imgSrc !== src && imgSrc !== fallbackSrc) {
            setImgSrc(src); // try original
        } else if (imgSrc !== fallbackSrc) {
            setImgSrc(fallbackSrc);
        } else {
            setHasError(true);
        }
        setIsLoading(false);
        onError?.();
    };

    if (hasError) {
        return (
            <div className={`flex items-center justify-center bg-gray-100 ${aspectClasses[aspectRatio]} ${className}`}>
                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Sem imagem</span>
                </div>
            </div>
        );
    }

    return (
        <div className={`relative overflow-hidden ${aspectClasses[aspectRatio]} ${className}`}>
            {/* Skeleton shown while loading */}
            {isLoading && !priority && (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse" />
            )}
            <img
                src={imgSrc}
                alt={alt}
                width={width}
                height={height}
                loading={priority ? 'eager' : 'lazy'}
                fetchPriority={priority ? 'high' : 'auto'}
                decoding={priority ? 'sync' : 'async'}
                className={`w-full h-full object-cover transition-opacity duration-500 ${isLoading && !priority ? 'opacity-0' : 'opacity-100'}`}
                onError={handleError}
                onLoad={() => setIsLoading(false)}
            />
        </div>
    );
};

// Proxy universal de redimensionamento via weserv.nl
// Suporta: Firebase Storage, Unsplash, URLs genéricos
export const optimizeImageUrl = (url: string, width?: number, height?: number): string => {
    if (!url || url.startsWith('data:')) return url;

    try {
        // Unsplash — parâmetros nativos
        if (url.includes('unsplash.com')) {
            const sep = url.includes('?') ? '&' : '?';
            let p = 'auto=format&q=75&fm=webp';
            if (width) p += `&w=${width}`;
            if (height) p += `&h=${height}`;
            if (width && height) p += '&fit=crop';
            return `${url}${sep}${p}`;
        }

        // Cloudinary — parâmetros nativos
        if (url.includes('cloudinary.com') && width) {
            return url.replace('/upload/', `/upload/w_${width},q_auto,f_webp/`);
        }

        // Firebase Storage & outros URLs — proxy weserv.nl para resize + WebP
        if (width || height) {
            const encoded = encodeURIComponent(url);
            let params = `url=${encoded}&output=webp&q=80`;
            if (width) params += `&w=${width}`;
            if (height) params += `&h=${height}`;
            if (width && height) params += '&fit=cover';
            return `https://wsrv.nl/?${params}`;
        }
    } catch (e) {
        return url;
    }

    return url;
};
