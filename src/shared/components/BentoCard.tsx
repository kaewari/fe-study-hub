import React from 'react';

interface BentoCardProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  badge?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const BentoCard: React.FC<BentoCardProps> = ({
  title,
  subtitle,
  action,
  badge,
  children,
  className = '',
}) => {
  return (
    <div
      className={`bg-sumi-900 border border-sumi-800 hover:border-sumi-700/80 rounded-xl p-4 sm:p-5 flex flex-col justify-between transition-colors duration-150 ${className}`}
    >
      {(title || action || badge) && (
        <div className="flex items-start justify-between gap-3 mb-3.5 pb-2.5 border-b border-sumi-800/70">
          <div className="min-w-0">
            {title && (
              <h3 className="font-semibold text-sumi-100 text-sm tracking-tight flex items-center gap-2 truncate">
                {title}
              </h3>
            )}
            {subtitle && <p className="text-xs text-sumi-400 mt-0.5 leading-normal truncate">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {badge}
            {action}
          </div>
        </div>
      )}
      <div className="flex-1">{children}</div>
    </div>
  );
};
