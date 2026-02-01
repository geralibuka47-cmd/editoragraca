import React from 'react';

export const BookCardSkeleton: React.FC = () => (
    <div className="flex flex-col gap-6 animate-pulse">
        <div className="aspect-[2/3] rounded-[2.5rem] bg-gray-100 w-full" />
        <div className="space-y-4 px-2">
            <div className="flex justify-between items-start gap-4">
                <div className="space-y-2 flex-1">
                    <div className="h-6 bg-gray-100 rounded-xl w-full" />
                    <div className="h-4 bg-gray-100 rounded-lg w-2/3" />
                </div>
                <div className="w-20">
                    <div className="h-6 bg-gray-100 rounded-xl w-full mb-2" />
                    <div className="h-3 bg-gray-100 rounded w-1/2 ml-auto" />
                </div>
            </div>
            <div className="h-8 bg-gray-50 rounded-lg w-24" />
        </div>
    </div>
);

export const PostCardSkeleton: React.FC = () => (
    <div className="bg-white p-8 rounded-[2rem] border border-gray-100 flex flex-col gap-6 animate-pulse">
        <div className="w-full aspect-video rounded-2xl bg-gray-100" />
        <div className="space-y-4">
            <div className="h-4 bg-gray-100 rounded-lg w-1/4" />
            <div className="h-8 bg-gray-100 rounded-xl w-full" />
            <div className="h-8 bg-gray-100 rounded-xl w-2/3" />
            <div className="h-4 bg-gray-100 rounded-lg w-1/2" />
        </div>
    </div>
);

export const StatsCardSkeleton: React.FC = () => (
    <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 animate-pulse">
        <div className="w-12 h-12 bg-gray-100 rounded-2xl mb-6" />
        <div className="h-10 bg-gray-100 rounded-2xl w-1/2 mb-4" />
        <div className="h-4 bg-gray-100 rounded-lg w-1/3" />
    </div>
);

export const ServiceCardSkeleton: React.FC = () => (
    <div className="bg-white rounded-[3rem] p-12 border border-gray-100 animate-pulse flex flex-col h-full">
        <div className="w-24 h-24 bg-gray-100 rounded-[2rem] mb-12" />
        <div className="h-10 bg-gray-100 rounded-2xl w-3/4 mb-6" />
        <div className="h-8 bg-gray-100 rounded-2xl w-1/2 mb-12" />
        <div className="space-y-4 mb-12 flex-1">
            <div className="h-4 bg-gray-100 rounded-lg w-full" />
            <div className="h-4 bg-gray-100 rounded-lg w-5/6" />
            <div className="h-4 bg-gray-100 rounded-lg w-4/6" />
        </div>
        <div className="h-20 bg-gray-100 rounded-3xl w-full" />
    </div>
);
