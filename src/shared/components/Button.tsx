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
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 gap-2 cursor-pointer';

  const sizeStyles: Record<ButtonSize, string> = {
    sm: 'text-xs px-3 py-1.5 h-8',
    md: 'text-xs sm:text-sm px-3.5 py-2 h-9',
    lg: 'text-sm px-4 py-2.5 h-11',
  };

  const variantStyles: Record<ButtonVariant, string> = {
    primary: 'bg-blue-600 hover:bg-blue-500 text-white shadow-sm hover:shadow border border-blue-500/80',
    gradient: 'theme-accent-gradient text-white shadow-sm hover:brightness-105 border border-white/20',
    secondary: 'bg-sumi-850 hover:bg-sumi-800 text-sumi-100 border border-sumi-700/80 hover:border-sumi-600',
    outline: 'bg-transparent hover:bg-sumi-850 text-sumi-200 border border-sumi-700/90 hover:border-sumi-600',
    danger: 'bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/40',
    ghost: 'bg-transparent hover:bg-sumi-850 text-sumi-400 hover:text-sumi-100',
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
