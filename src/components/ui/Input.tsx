import React from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: string;
    label?: string;
    icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, error, label, icon, ...props }, ref) => {
        return (
            <div className="w-full space-y-2">
                {label && (
                    <label htmlFor={props.id} className="ml-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                        {label}
                    </label>
                )}
                <div className="relative group">
                    {icon && (
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-brand-primary transition-colors duration-300 pointer-events-none">
                            {icon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        className={cn(
                            'w-full bg-gray-50 border-2 border-transparent rounded-[2rem] text-brand-dark font-bold transition-all outline-none placeholder:text-gray-300',
                            'focus:bg-white focus:border-brand-primary/20 focus:shadow-sm',
                            icon ? 'pl-14 pr-6' : 'px-8',
                            'py-5 text-sm',
                            error && 'border-red-200 bg-red-50 focus:border-red-300',
                            className
                        )}
                        {...props}
                    />
                </div>
                {error && (
                    <p className="ml-4 text-[10px] font-bold text-red-500 uppercase tracking-wide animate-pulse">{error}</p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';
