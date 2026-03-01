import React from 'react';
import { cn } from '../../lib/utils';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    error?: string;
    label?: string;
    variant?: 'light' | 'glass';
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, error, label, variant = 'light', ...props }, ref) => {
        return (
            <div className="w-full space-y-2">
                {label && (
                    <label htmlFor={props.id} className="ml-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                        {label}
                    </label>
                )}
                <textarea
                    ref={ref}
                    className={cn(
                        'w-full border-2 border-transparent rounded-[2rem] font-medium transition-all outline-none placeholder:text-gray-400 resize-none',
                        variant === 'light'
                            ? 'bg-gray-50 text-brand-dark focus:bg-white focus:border-brand-primary/20 focus:shadow-sm placeholder:text-gray-300'
                            : 'bg-white/5 text-white border-white/5 focus:bg-white/10 focus:border-brand-primary/20 placeholder:text-gray-600',
                        'px-8 py-6 text-sm min-h-[120px]',
                        error && (variant === 'light' ? 'border-red-200 bg-red-50 focus:border-red-300' : 'border-red-500/50 bg-red-500/10 focus:border-red-500'),
                        className
                    )}
                    {...props}
                />
                {error && (
                    <p className="ml-4 text-[10px] font-bold text-red-500 uppercase tracking-wide animate-pulse">{error}</p>
                )}
            </div>
        );
    }
);

Textarea.displayName = 'Textarea';
