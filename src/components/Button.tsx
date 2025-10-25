/**
 * Accessible Button component following WAI-ARIA guidelines
 * MUST: Proper touch targets, keyboard support, loading states
 */

import { forwardRef, type ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** MUST: For icon-only buttons, provide accessible label */
  'aria-label'?: string;
  /** Loading state - MUST: show spinner while maintaining label */
  isLoading?: boolean;
  /** Size variants ensuring minimum touch targets */
  size?: 'sm' | 'md' | 'lg';
  /** Visual variant */
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  /** Icon only mode - MUST: require aria-label */
  iconOnly?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className = '',
      isLoading = false,
      size = 'md',
      variant = 'primary',
      iconOnly = false,
      disabled,
      type = 'button',
      'aria-label': ariaLabel,
      ...props
    },
    ref
  ) => {
    // MUST: Icon-only buttons require aria-label
    if (iconOnly && !ariaLabel && !children) {
      console.error('Icon-only buttons must have an aria-label');
    }

    // Size classes ensuring MUST: 24x24 minimum (44x44 on mobile)
    const sizeClasses = {
      sm: 'min-h-[24px] min-w-[24px] px-3 py-1.5 text-sm md:min-h-[24px] md:min-w-[24px]',
      md: 'min-h-[44px] min-w-[44px] px-4 py-2 text-base md:min-h-[32px] md:min-w-[32px]',
      lg: 'min-h-[48px] min-w-[48px] px-6 py-3 text-lg md:min-h-[40px] md:min-w-[40px]',
    };

    const variantClasses = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800',
      secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 active:bg-gray-400',
      ghost: 'bg-transparent hover:bg-gray-100 active:bg-gray-200',
      destructive: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800',
    };

    const baseClasses = `
      inline-flex items-center justify-center gap-2
      rounded-lg font-medium
      transition-colors duration-200
      focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600
      disabled:opacity-50 disabled:cursor-not-allowed
      ${sizeClasses[size]}
      ${variantClasses[variant]}
      ${className}
    `;

    return (
      <button
        ref={ref}
        type={type}
        className={baseClasses}
        disabled={disabled || isLoading}
        aria-label={ariaLabel}
        aria-busy={isLoading}
        {...props}
      >
        {/* MUST: Loading spinner maintains original label */}
        {isLoading && (
          <svg
            className="spinner h-4 w-4"
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
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
