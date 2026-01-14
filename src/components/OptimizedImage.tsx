import React, { useState, useEffect } from 'react';
import { ImageOff } from 'lucide-react';

interface OptimizedImageProps {
    src: string;
    alt: string;
    className?: string;
    fallbackSrc?: string;
    onError?: () => void;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
    src,
    alt,
    className = '',
    fallbackSrc = 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=500&fit=crop',
    onError
}) => {
    const [imgSrc, setImgSrc] = useState(src);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        setImgSrc(src);
        setIsLoading(true);
        setHasError(false);
    }, [src]);

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
            <div className={`flex items-center justify-center bg-gray-100 ${className}`}>
                <div className="text-center p-4">
                    <ImageOff className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Imagem não disponível</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative">
            {isLoading && (
                <div className={`absolute inset-0 bg-gray-200 animate-pulse ${className}`} />
            )}
            <img
                src={imgSrc}
                alt={alt}
                loading="lazy"
                className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
                onError={handleError}
                onLoad={handleLoad}
            />
        </div>
    );
};

// Utility function to validate image URL
export const isValidImageUrl = (url: string): boolean => {
    if (!url) return false;
    try {
        const urlObj = new URL(url);
        return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(urlObj.pathname);
    } catch {
        return false;
    }
};

// Utility function to optimize image URL (add query params for resizing)
export const optimizeImageUrl = (url: string, width?: number, height?: number): string => {
    if (!url) return url;

    // Check if it's an Unsplash URL
    if (url.includes('unsplash.com')) {
        const separator = url.includes('?') ? '&' : '?';
        let params = '';
        if (width) params += `w=${width}`;
        if (height) params += `${params ? '&' : ''}h=${height}`;
        if (params) params += '&fit=crop&auto=format';
        return `${url}${separator}${params}`;
    }

    return url;
};
