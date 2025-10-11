'use client';

import { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  children: ReactNode;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

/**
 * Reusable Button Component
 * Implements industry-standard button patterns with accessibility
 * Supports loading states, icons, and multiple variants
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  disabled,
  children,
  leftIcon,
  rightIcon,
  className = '',
  type = 'button',
  ...props
}: ButtonProps) {
  // Variant styles
  const variantStyles = {
    primary: 'btn-hustle',
    secondary: 'bg-hustleGold text-black hover:bg-yellow-500 hover:shadow-[0_0_20px_rgba(255,215,0,0.6)]',
    danger: 'bg-red-600 text-white hover:bg-red-700 hover:shadow-[0_0_20px_rgba(239,68,68,0.6)]',
    ghost: 'bg-transparent border-2 border-hustleGold text-hustleGold hover:bg-hustleGold/10',
  };

  // Size styles
  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  // Base styles (always applied)
  const baseStyles = `
    inline-flex items-center justify-center gap-2
    font-bold uppercase tracking-wide
    rounded-full
    transition-all duration-300 ease-in-out
    focus:outline-none focus-visible:ring-4 focus-visible:ring-hustleGold/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black
    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none
    ${fullWidth ? 'w-full' : ''}
    ${loading ? 'cursor-wait' : ''}
  `;

  const combinedClassName = `
    ${baseStyles}
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${className}
  `.trim();

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={combinedClassName}
      aria-busy={loading}
      aria-disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      
      {!loading && leftIcon && <span aria-hidden="true">{leftIcon}</span>}
      
      <span>{children}</span>
      
      {!loading && rightIcon && <span aria-hidden="true">{rightIcon}</span>}
    </button>
  );
}
