import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Button({
    children,
    className,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    ...props
}) {
    const baseStyles = 'inline-flex items-center justify-center rounded-xl font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]';

    const variants = {
        primary: 'bg-gradient-to-r from-brand-600 to-brand-300 text-white shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 border-0',
        secondary: 'bg-white text-text-secondary border border-border hover:bg-surface-2 focus:ring-border shadow-sm',
        ghost: 'bg-transparent text-text-muted hover:bg-surface-2 hover:text-text-primary',
        outline: 'bg-transparent text-brand-700 border border-brand-200 hover:bg-brand-50',
        destructive: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500',
    };

    const sizes = {
        sm: 'h-8 px-3 text-sm rounded-full',
        md: 'h-12 px-6 text-base rounded-full', // Pill shape as requested
        lg: 'h-14 px-8 text-lg rounded-full',
    };

    return (
        <button
            className={twMerge(
                baseStyles,
                variants[variant],
                sizes[size],
                fullWidth && 'w-full',
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
}
