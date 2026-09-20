import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'gradient';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'secondary',
  size = 'md',
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 gap-1.5 cursor-pointer select-none';

  const sizeStyles: Record<ButtonSize, string> = {
    sm: 'text-xs px-2.5 py-1.5 h-7.5',
    md: 'text-xs sm:text-sm px-3.5 py-2 h-9',
    lg: 'text-sm px-4 py-2.5 h-10.5',
  };

  const variantStyles: Record<ButtonVariant, string> = {
    primary: 'bg-blue-600 hover:bg-blue-500 text-white shadow-xs border border-blue-500/80',
    gradient: 'bg-[var(--theme-accent,#3b82f6)] hover:brightness-110 text-white shadow-xs border border-white/20',
    secondary: 'bg-sumi-850 hover:bg-sumi-800 text-sumi-200 hover:text-sumi-100 border border-sumi-700/70 hover:border-sumi-600',
    outline: 'bg-transparent hover:bg-sumi-850 text-sumi-300 hover:text-sumi-100 border border-sumi-700/70 hover:border-sumi-600',
    danger: 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30',
    ghost: 'bg-transparent hover:bg-sumi-850 text-sumi-400 hover:text-sumi-200',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
};
