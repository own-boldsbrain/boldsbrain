/**
 * Accessible Input component
 * MUST: Proper labels, autocomplete, inline errors, no paste blocking
 */

import { forwardRef, useId, type InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Label text - MUST for accessibility */
  label?: string;
  /** Error message - MUST: Display inline */
  error?: string;
  /** Helper text */
  helperText?: string;
  /** MUST: Semantic autocomplete value */
  autoComplete?: string;
  /** MUST: Proper inputMode for mobile keyboards */
  inputMode?: 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search';
  /** Container class */
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      id,
      name,
      type = 'text',
      required = false,
      disabled = false,
      autoComplete,
      inputMode,
      placeholder,
      className = '',
      containerClassName = '',
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    // MUST: spellcheck disabled for certain types
    const shouldDisableSpellCheck = ['email', 'tel', 'url'].includes(type);

    // SHOULD: Placeholder with ellipsis and concrete examples
    const formattedPlaceholder = placeholder ? `${placeholder}…` : undefined;

    const baseInputClasses = `
      w-full px-3 py-2
      min-h-[44px]
      text-base md:text-sm
      border rounded-lg
      transition-colors duration-200
      focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-blue-600
      disabled:opacity-50 disabled:cursor-not-allowed
      ${error 
        ? 'border-red-500 focus-visible:outline-red-600' 
        : 'border-gray-300 focus:border-blue-500'
      }
      ${className}
    `;

    return (
      <div className={`flex flex-col gap-1 ${containerClassName}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-gray-700"
          >
            {label}
            {required && (
              <span className="text-red-500 ml-1" aria-label="obrigatório">
                *
              </span>
            )}
          </label>
        )}

        <input
          ref={ref}
          id={inputId}
          name={name}
          type={type}
          required={required}
          disabled={disabled}
          autoComplete={autoComplete}
          inputMode={inputMode}
          placeholder={formattedPlaceholder}
          spellCheck={shouldDisableSpellCheck ? false : undefined}
          className={baseInputClasses}
          aria-invalid={!!error}
          aria-describedby={
            error ? errorId : helperText ? helperId : undefined
          }
          aria-required={required}
          {...props}
        />

        {/* MUST: Error inline next to field */}
        {error && (
          <div
            id={errorId}
            className="text-sm text-red-600 flex items-center gap-1"
            role="alert"
            aria-live="polite"
          >
            <svg
              className="h-4 w-4 flex-shrink-0"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </div>
        )}

        {/* Helper text */}
        {helperText && !error && (
          <div id={helperId} className="text-sm text-gray-500">
            {helperText}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
