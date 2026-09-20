import React from 'react';

type BadgeVariant = 'emerald' | 'amber' | 'rose' | 'blue' | 'slate' | 'cyan' | 'accent';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'slate',
  dot = false,
  className = '',
}) => {
  const variantStyles: Record<BadgeVariant, { badge: string; dot: string }> = {
    emerald: {
      badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25',
      dot: 'bg-emerald-500',
    },
    amber: {
      badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25',
      dot: 'bg-amber-500',
    },
    rose: {
      badge: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/25',
      dot: 'bg-rose-500',
    },
    blue: {
      badge: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/25',
      dot: 'bg-blue-500',
    },
    slate: {
      badge: 'bg-sumi-850/90 text-sumi-300 border-sumi-700/70',
      dot: 'bg-sumi-400',
    },
    cyan: {
      badge: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/25',
      dot: 'bg-cyan-500',
    },
    accent: {
      badge: 'theme-accent-subtle theme-accent-text theme-accent-border',
      dot: 'bg-[var(--theme-accent,#3b82f6)]',
    },
  };

  const current = variantStyles[variant];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-mono font-medium border leading-tight ${current.badge} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${current.dot}`} />}
      {children}
    </span>
  );
};
