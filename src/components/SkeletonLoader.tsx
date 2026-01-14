import React from 'react';

export const BookCardSkeleton: React.FC = () => (
    <div className="bg-white rounded-[2.5rem] p-4 shadow-xl border border-gray-50 flex flex-col h-full animate-pulse">
        <div className="aspect-[3/4] rounded-3xl bg-gray-200 mb-6 w-full" />
        <div className="px-2 space-y-3 flex-1">
            <div className="h-4 bg-gray-200 rounded w-1/3" />
            <div className="h-6 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
        <div className="mt-6 flex items-center justify-between px-2 pb-2">
            <div className="h-8 bg-gray-200 rounded w-1/4" />
            <div className="h-10 bg-gray-200 rounded-xl w-1/2" />
        </div>
    </div>
);

export const PostCardSkeleton: React.FC = () => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4 animate-pulse">
        <div className="w-full aspect-video rounded-xl bg-gray-200" />
        <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-1/4" />
            <div className="h-6 bg-gray-200 rounded w-full" />
            <div className="h-6 bg-gray-200 rounded w-2/3" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
    </div>
);

export const StatsCardSkeleton: React.FC = () => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-pulse">
        <div className="w-10 h-10 bg-gray-200 rounded-lg mb-4" />
        <div className="h-8 bg-gray-200 rounded w-1/2 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-1/3" />
    </div>
);

export const ServiceCardSkeleton: React.FC = () => (
    <div className="bg-white rounded-[2.5rem] shadow-xl p-10 border border-gray-100 animate-pulse flex flex-col h-full">
        <div className="w-20 h-20 bg-gray-200 rounded-3xl mb-10" />
        <div className="h-8 bg-gray-200 rounded w-3/4 mb-4" />
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-10" />
        <div className="space-y-4 mb-10 flex-1">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
            <div className="h-4 bg-gray-200 rounded w-4/6" />
        </div>
        <div className="h-14 bg-gray-200 rounded-2xl w-full" />
    </div>
);
