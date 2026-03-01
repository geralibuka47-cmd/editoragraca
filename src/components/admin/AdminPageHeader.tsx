import React from 'react';

interface AdminPageHeaderProps {
    title: string;
    subtitle?: string;
    highlight?: string;
    children?: React.ReactNode;
}

export const AdminPageHeader: React.FC<AdminPageHeaderProps> = ({ title, subtitle, highlight, children }) => {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
            <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                    {title}
                    {highlight && <span className="text-brand-primary font-normal ml-1">{highlight}</span>}
                </h2>
                {subtitle && (
                    <p className="text-gray-500 text-sm mt-1">{subtitle}</p>
                )}
            </div>
            {children && <div className="flex flex-wrap items-center gap-2 shrink-0">{children}</div>}
        </div>
    );
};
