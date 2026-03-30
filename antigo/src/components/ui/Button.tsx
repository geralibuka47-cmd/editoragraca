import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils'; // Assuming you will create this utility or use clsx/tailwind-merge directly if utils doesn't exist yet

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'link';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {

        const variants = {
            primary: 'bg-brand-primary text-white hover:bg-brand-primary/90 shadow-lg shadow-brand-primary/20',
            secondary: 'bg-brand-dark text-white hover:bg-brand-dark/90 shadow-lg shadow-brand-dark/20',
            outline: 'border-2 border-gray-200 bg-transparent hover:bg-gray-50 text-gray-700',
            ghost: 'bg-transparent hover:bg-gray-100 text-gray-700',
            danger: 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20',
            link: 'text-brand-primary underline-offset-4 hover:underline p-0 h-auto bg-transparent shadow-none',
        };

        const sizes = {
            sm: 'h-9 px-4 text-xs',
            md: 'h-12 px-6 text-sm',
            lg: 'h-14 px-8 text-base',
            icon: 'h-10 w-10 p-2 justify-center',
        };

        return (
            <button
                ref={ref}
                className={cn(
                    'relative inline-flex items-center justify-center rounded-2xl font-black uppercase tracking-widest transition-all duration-200 active:scale-95 disabled:pointer-events-none disabled:opacity-50',
                    variants[variant],
                    sizes[size],
                    className
                )}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
                {children}
                {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
            </button>
        );
    }
);

Button.displayName = 'Button';
