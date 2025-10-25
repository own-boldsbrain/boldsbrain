/**
 * Accessible Link component
 * MUST: Use <a> for navigation, support Cmd/Ctrl/middle-click
 */

import { forwardRef, type AnchorHTMLAttributes } from 'react';

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** External link - opens in new tab with proper security */
  external?: boolean;
  /** Indicates current page (for navigation) */
  'aria-current'?: 'page' | 'step' | 'location' | 'date' | 'time' | boolean;
}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  (
    {
      children,
      className = '',
      external = false,
      href,
      target,
      rel,
      ...props
    },
    ref
  ) => {
    // MUST: External links should open in new tab with security
    const externalProps = external
      ? {
          target: target || '_blank',
          rel: rel || 'noopener noreferrer',
        }
      : { target, rel };

    const baseClasses = `
      inline-flex items-center gap-1
      text-blue-600 hover:text-blue-700 active:text-blue-800
      underline decoration-1 underline-offset-2
      focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600
      transition-colors duration-200
      min-h-[24px] min-w-[24px]
      ${className}
    `;

    return (
      <a
        ref={ref}
        href={href}
        className={baseClasses}
        {...externalProps}
        {...props}
      >
        {children}
        {external && (
          <svg
            className="h-3 w-3"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z"
              clipRule="evenodd"
            />
            <path
              fillRule="evenodd"
              d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </a>
    );
  }
);

Link.displayName = 'Link';
