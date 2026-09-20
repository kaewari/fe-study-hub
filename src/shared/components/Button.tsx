import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
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
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 gap-2';

  const sizeStyles: Record<ButtonSize, string> = {
    sm: 'text-xs px-2.5 py-1.5 h-8',
    md: 'text-sm px-3.5 py-2 h-9',
    lg: 'text-sm px-4 py-2.5 h-11',
  };

  const variantStyles: Record<ButtonVariant, string> = {
    primary: 'bg-blue-600 hover:bg-blue-500 text-white shadow-sm border border-blue-500',
    secondary: 'bg-sumi-850 hover:bg-sumi-800 text-sumi-100 border border-sumi-700 hover:border-sumi-600',
    outline: 'bg-transparent hover:bg-sumi-850 text-sumi-200 border border-sumi-700 hover:border-sumi-600',
    danger: 'bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800',
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
