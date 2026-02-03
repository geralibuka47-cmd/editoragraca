import React from 'react';
import { cn } from '../../lib/utils';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    error?: string;
    label?: string;
    options: { value: string; label: string }[];
    icon?: React.ReactNode;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, error, label, options, icon, placeholder, ...props }, ref) => {
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
                    <select
                        ref={ref}
                        className={cn(
                            'w-full bg-gray-50 border-2 border-transparent rounded-[2rem] text-brand-dark font-bold transition-all outline-none appearance-none cursor-pointer',
                            'focus:bg-white focus:border-brand-primary/20 focus:shadow-sm',
                            icon ? 'pl-14 pr-12' : 'pl-8 pr-12',
                            'py-5 text-sm',
                            error && 'border-red-200 bg-red-50 focus:border-red-300',
                            className
                        )}
                        {...props}
                    >
                        {placeholder && (
                            <option value="" disabled className="text-gray-400">
                                {placeholder}
                            </option>
                        )}
                        {options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                        <ChevronDown className="w-4 h-4" />
                    </div>
                </div>
                {error && (
                    <p className="ml-4 text-[10px] font-bold text-red-500 uppercase tracking-wide animate-pulse">{error}</p>
                )}
            </div>
        );
    }
);

Select.displayName = 'Select';
