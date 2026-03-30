import React from 'react';
import { useNavigate } from 'react-router-dom';
import { m } from 'framer-motion';

interface PageHeroProps {
    title: React.ReactNode;
    subtitle?: React.ReactNode;
    breadcrumb?: { label: string; path?: string }[];
    decorativeText?: string;
    gradientBottom?: boolean;
    titleClassName?: string;
    className?: string;
}

export const PageHero: React.FC<PageHeroProps> = ({
    title,
    subtitle,
    breadcrumb,
    decorativeText,
    gradientBottom = true,
    titleClassName,
    className = '',
}) => {
    const navigate = useNavigate();

    return (
        <section className={`relative bg-brand-dark text-white pt-20 sm:pt-24 md:pt-32 pb-24 sm:pb-32 md:pb-48 overflow-hidden ${className}`}>
            {decorativeText && (
                <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/4 select-none pointer-events-none opacity-[0.03] whitespace-nowrap hidden sm:block">
                    <span className="text-[15rem] md:text-[22rem] lg:text-[28rem] font-black uppercase tracking-tighter leading-none">
                        {decorativeText}
                    </span>
                </div>
            )}

            <div className="container mx-auto px-4 sm:px-6 md:px-12 relative z-10">
                <m.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-4xl"
                >
                    {breadcrumb && breadcrumb.length > 0 && (
                        <nav className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-primary mb-6">
                            <button
                                type="button"
                                onClick={() => navigate('/')}
                                className="hover:text-white transition-colors min-touch"
                            >
                                Início
                            </button>
                            {breadcrumb.map((item, i) => (
                                <span key={i} className="flex items-center gap-2">
                                    <span className="text-gray-500">/</span>
                                    {item.path ? (
                                        <button
                                            type="button"
                                            onClick={() => item.path && navigate(item.path)}
                                            className="hover:text-white transition-colors min-touch"
                                        >
                                            {item.label}
                                        </button>
                                    ) : (
                                        <span className="text-white">{item.label}</span>
                                    )}
                                </span>
                            ))}
                        </nav>
                    )}

                    <h1 className={titleClassName || "text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black uppercase leading-[0.9] tracking-tight mb-4"}>
                        {title}
                    </h1>

                    {subtitle && (
                        <p className="text-base sm:text-lg md:text-xl text-gray-400 font-light leading-relaxed max-w-2xl">
                            {subtitle}
                        </p>
                    )}
                </m.div>
            </div>

            {gradientBottom && (
                <div className="absolute bottom-0 left-0 w-full h-24 sm:h-32 bg-gradient-to-t from-white to-transparent pointer-events-none" />
            )}
        </section>
    );
};
