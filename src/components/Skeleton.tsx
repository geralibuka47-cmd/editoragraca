import React from 'react';

interface SkeletonProps {
    className?: string;
    variant?: 'text' | 'circular' | 'rectangular';
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', variant = 'rectangular' }) => {
    const baseClasses = 'animate-pulse bg-gray-200 dark:bg-white/5';
    const variantClasses = {
        text: 'h-4 rounded',
        circular: 'rounded-full',
        rectangular: 'rounded-lg'
    };

    return <div className={`${baseClasses} ${variantClasses[variant]} ${className}`} />;
};

export const BookCardSkeleton: React.FC = () => (
    <div className="flex flex-col gap-6 animate-pulse">
        <div className="aspect-[2/3] rounded-[2.5rem] bg-gray-100 dark:bg-white/5 w-full shadow-sm" />
        <div className="space-y-4 px-2">
            <div className="flex justify-between items-start gap-4">
                <div className="space-y-2 flex-1">
                    <div className="h-6 bg-gray-100 dark:bg-white/10 rounded-xl w-full" />
                    <div className="h-4 bg-gray-100 dark:bg-white/5 rounded-lg w-2/3" />
                </div>
                <div className="w-20">
                    <div className="h-6 bg-gray-100 dark:bg-white/10 rounded-xl w-full mb-2" />
                    <div className="h-3 bg-gray-100 dark:bg-white/5 rounded w-1/2 ml-auto" />
                </div>
            </div>
            <div className="h-8 bg-gray-50 dark:bg-white/5 rounded-lg w-24" />
        </div>
    </div>
);

export const PostCardSkeleton: React.FC = () => (
    <div className="bg-white dark:bg-white/5 p-8 rounded-[2rem] border border-gray-100 dark:border-white/10 flex flex-col gap-6 animate-pulse">
        <div className="w-full aspect-video rounded-2xl bg-gray-100 dark:bg-white/10" />
        <div className="space-y-4">
            <div className="h-4 bg-gray-100 dark:bg-white/10 rounded-lg w-1/4" />
            <div className="h-8 bg-gray-100 dark:bg-white/10 rounded-xl w-full" />
            <div className="h-8 bg-gray-100 dark:bg-white/10 rounded-xl w-2/3" />
            <div className="h-4 bg-gray-100 dark:bg-white/10 rounded-lg w-1/2" />
        </div>
    </div>
);

export const BlogPostSkeleton: React.FC = () => (
    <div className="bg-white dark:bg-white/5 rounded-2xl shadow-sm overflow-hidden animate-pulse">
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

export const StatsCardSkeleton: React.FC = () => (
    <div className="bg-white dark:bg-white/5 p-10 rounded-[2.5rem] border border-gray-100 dark:border-white/10 animate-pulse">
        <div className="w-12 h-12 bg-gray-100 dark:bg-white/10 rounded-2xl mb-6" />
        <div className="h-10 bg-gray-100 dark:bg-white/10 rounded-2xl w-1/2 mb-4" />
        <div className="h-4 bg-gray-100 dark:bg-white/5 rounded-lg w-1/3" />
    </div>
);

export const ServiceCardSkeleton: React.FC = () => (
    <div className="bg-white dark:bg-white/5 rounded-[3rem] p-12 border border-gray-100 dark:border-white/10 animate-pulse flex flex-col h-full">
        <div className="w-24 h-24 bg-gray-100 dark:bg-white/10 rounded-[2rem] mb-12" />
        <div className="h-10 bg-gray-100 dark:bg-white/10 rounded-2xl w-3/4 mb-6" />
        <div className="h-8 bg-gray-100 dark:bg-white/10 rounded-2xl w-1/2 mb-12" />
        <div className="space-y-4 mb-12 flex-1">
            <div className="h-4 bg-gray-100 dark:bg-white/10 rounded-lg w-full" />
            <div className="h-4 bg-gray-100 dark:bg-white/10 rounded-lg w-5/6" />
            <div className="h-4 bg-gray-100 dark:bg-white/10 rounded-lg w-4/6" />
        </div>
        <div className="h-20 bg-gray-100 dark:bg-white/20 rounded-3xl w-full" />
    </div>
);

export const TeamMemberSkeleton: React.FC = () => (
    <div className="bg-white dark:bg-white/5 rounded-2xl shadow-sm overflow-hidden p-6 animate-pulse text-center">
        <Skeleton variant="circular" className="w-32 h-32 mx-auto mb-4" />
        <Skeleton className="h-6 w-3/4 mx-auto mb-2" variant="text" />
        <Skeleton className="h-4 w-1/2 mx-auto" variant="text" />
    </div>
);
