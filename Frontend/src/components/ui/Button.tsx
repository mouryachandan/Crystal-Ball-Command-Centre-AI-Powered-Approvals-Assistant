import React from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = 'primary', size = 'md', className, disabled, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center font-medium transition-all rounded-md focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
      primary: 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm',
      secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-700',
      outline: 'border border-slate-300 hover:bg-slate-50 text-slate-700',
      ghost: 'hover:bg-slate-100 text-slate-600',
      danger: 'bg-red-600 hover:bg-red-700 text-white',
    }[variant];

    const sizes = {
      sm: 'px-2.5 py-1 text-xs',
      md: 'px-3.5 py-1.5 text-sm',
      lg: 'px-4 py-2 text-base',
    }[size];

    return (
      <button ref={ref} className={cn(base, variants, sizes, className)} disabled={disabled} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

