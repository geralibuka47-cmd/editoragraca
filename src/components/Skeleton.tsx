import React from 'react';

interface SkeletonProps {
    className?: string;
    variant?: 'text' | 'circular' | 'rectangular';
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', variant = 'rectangular' }) => {
    const baseClasses = 'animate-pulse bg-gray-200';
    const variantClasses = {
        text: 'h-4 rounded',
        circular: 'rounded-full',
        rectangular: 'rounded-lg'
    };

    return <div className={`${baseClasses} ${variantClasses[variant]} ${className}`} />;
};

export const BookCardSkeleton: React.FC = () => (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <Skeleton className="aspect-[2/3] w-full" />
        <div className="p-4 space-y-3">
            <Skeleton className="h-6 w-3/4" variant="text" />
            <Skeleton className="h-4 w-1/2" variant="text" />
            <Skeleton className="h-4 w-full" variant="text" />
            <Skeleton className="h-10 w-full mt-4" />
        </div>
    </div>
);

export const BlogPostSkeleton: React.FC = () => (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 pb-4">
            <div className="flex items-center gap-3 mb-4">
                <Skeleton variant="circular" className="w-12 h-12" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" variant="text" />
                    <Skeleton className="h-3 w-24" variant="text" />
                </div>
            </div>
            <Skeleton className="h-8 w-3/4 mb-3" variant="text" />
            <Skeleton className="h-4 w-full mb-2" variant="text" />
            <Skeleton className="h-4 w-5/6" variant="text" />
        </div>
        <Skeleton className="aspect-[16/9] w-full" />
        <div className="px-6 py-4">
            <div className="flex gap-4">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-28" />
                <Skeleton className="h-10 w-24" />
            </div>
        </div>
    </div>
);

export const TeamMemberSkeleton: React.FC = () => (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden p-6">
        <Skeleton variant="circular" className="w-32 h-32 mx-auto mb-4" />
        <Skeleton className="h-6 w-3/4 mx-auto mb-2" variant="text" />
        <Skeleton className="h-4 w-1/2 mx-auto" variant="text" />
    </div>
);
