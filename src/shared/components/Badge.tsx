import React from 'react';

type BadgeVariant = 'emerald' | 'amber' | 'rose' | 'blue' | 'slate' | 'cyan' | 'accent';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'slate',
  className = '',
}) => {
  const variantStyles: Record<BadgeVariant, string> = {
    emerald: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    amber: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
    rose: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30',
    blue: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30',
    slate: 'bg-sumi-850/80 text-sumi-200 border-sumi-700/80',
    cyan: 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/30',
    accent: 'theme-accent-subtle theme-accent-text theme-accent-border',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono font-medium border ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
