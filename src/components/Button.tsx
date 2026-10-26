import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'secondary' | 'danger' | 'ghost';
  size?: 'xs' | 'sm' | 'md';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Button({
  children,
  variant = 'primary',
  size = 'sm',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const sizeClass = size === 'xs' ? 'portal-btn-xs' : 'portal-btn-sm';
  const variantClass =
    variant === 'outline'
      ? 'portal-btn-outline'
      : variant === 'secondary'
      ? 'bg-[#f1f3f4] hover:bg-[#e8eaed] text-[#202124]'
      : variant === 'danger'
      ? 'bg-red-600 hover:bg-red-700 text-white'
      : variant === 'ghost'
      ? 'bg-transparent hover:bg-gray-100 text-[#5f6368]'
      : 'portal-btn-primary';

  return (
    <button
      className={`portal-btn ${sizeClass} ${variantClass} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        leftIcon
      )}
      {children}
      {!isLoading && rightIcon}
    </button>
  );
}

export default Button;
