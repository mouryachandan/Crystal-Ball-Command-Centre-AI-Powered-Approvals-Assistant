import React from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'folder' | 'video' | 'pdf' | 'image' | 'pending' | 'approved' | 'rejected' | 'critical' | 'high' | 'medium';
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'folder', className, ...props }) => {
  const variantStyles = {
    folder: 'bg-amber-50 text-amber-700 border-amber-200',
    video: 'bg-rose-50 text-rose-700 border-rose-200',
    pdf: 'bg-blue-50 text-blue-700 border-blue-200',
    image: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    pending: 'bg-orange-100 text-orange-800 border-orange-200 font-medium',
    approved: 'bg-emerald-100 text-emerald-800 border-emerald-200 font-medium',
    rejected: 'bg-red-100 text-red-800 border-red-200 font-medium',
    critical: 'bg-red-600 text-white font-bold',
    high: 'bg-amber-500 text-white font-semibold',
    medium: 'bg-blue-500 text-white font-medium',
  }[variant];

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs border transition-colors',
        variantStyles,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

