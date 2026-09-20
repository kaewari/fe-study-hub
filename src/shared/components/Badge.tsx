import React from 'react';

type BadgeVariant = 'emerald' | 'amber' | 'rose' | 'blue' | 'slate' | 'cyan';

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
    emerald: 'bg-emerald-950/70 text-emerald-400 border-emerald-800/80',
    amber: 'bg-amber-950/70 text-amber-400 border-amber-800/80',
    rose: 'bg-rose-950/70 text-rose-400 border-rose-800/80',
    blue: 'bg-blue-950/70 text-blue-400 border-blue-800/80',
    slate: 'bg-sumi-850 text-sumi-200 border-sumi-700',
    cyan: 'bg-cyan-950/70 text-cyan-400 border-cyan-800/80',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono font-medium border ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
