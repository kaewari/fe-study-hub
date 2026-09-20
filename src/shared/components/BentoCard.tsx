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
      className={`bg-sumi-900/85 backdrop-blur-md border border-sumi-800/90 hover:border-sumi-700 rounded-xl p-5 md:p-6 flex flex-col justify-between shadow-sm hover:shadow-md hover:shadow-black/10 transition-all duration-200 ${className}`}
    >
      {(title || action || badge) && (
        <div className="flex items-start justify-between gap-3 mb-4 pb-3 border-b border-sumi-800/60">
          <div>
            {title && (
              <h3 className="font-semibold text-sumi-100 text-sm tracking-wide flex items-center gap-2">
                {title}
              </h3>
            )}
            {subtitle && <p className="text-xs text-sumi-400 mt-0.5">{subtitle}</p>}
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
