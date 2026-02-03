import React from 'react';
import { cn } from '../../lib/utils';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    error?: string;
    label?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, error, label, ...props }, ref) => {
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
                        'w-full bg-gray-50 border-2 border-transparent rounded-[2rem] text-brand-dark font-medium transition-all outline-none placeholder:text-gray-300 resize-none',
                        'focus:bg-white focus:border-brand-primary/20 focus:shadow-sm',
                        'px-8 py-6 text-sm min-h-[120px]',
                        error && 'border-red-200 bg-red-50 focus:border-red-300',
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
