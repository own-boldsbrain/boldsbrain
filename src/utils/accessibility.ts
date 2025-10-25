/**
 * Accessibility utilities following WAI-ARIA APG guidelines
 * MUST: Implement according to the UI interaction mega prompts
 */

/**
 * MUST: Focus management - move focus with preventScroll option
 */
export function focusElement(
  element: HTMLElement | null,
  options: { preventScroll?: boolean } = {}
) {
  if (!element) return;
  
  element.focus({ preventScroll: options.preventScroll ?? false });
}

/**
 * MUST: Get all focusable elements within a container
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]',
  ].join(',');

  return Array.from(container.querySelectorAll<HTMLElement>(focusableSelectors));
}

/**
 * MUST: Focus trap for modals and dialogs
 */
export function createFocusTrap(container: HTMLElement) {
  const focusableElements = getFocusableElements(container);
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement?.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement?.focus();
      }
    }
  };

  container.addEventListener('keydown', handleKeyDown);

  return {
    activate: () => {
      // MUST: Move to first interactive element
      firstElement?.focus({ preventScroll: true });
    },
    deactivate: () => {
      container.removeEventListener('keydown', handleKeyDown);
    },
  };
}

/**
 * MUST: Check if element meets minimum target size (24x24 CSS px)
 */
export function meetsMinimumTargetSize(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  const minSize = 24; // CSS pixels
  
  return rect.width >= minSize && rect.height >= minSize;
}

/**
 * MUST: Check if mobile input has proper font-size (>= 16px)
 */
export function validateMobileInputFontSize(input: HTMLInputElement): boolean {
  const isMobile = window.innerWidth <= 768;
  if (!isMobile) return true;

  const fontSize = window.getComputedStyle(input).fontSize;
  const fontSizeNum = parseFloat(fontSize);
  
  return fontSizeNum >= 16;
}

/**
 * MUST: Announce to screen readers using aria-live
 */
export function announce(
  message: string,
  priority: 'polite' | 'assertive' = 'polite'
) {
  const announcer = document.getElementById('aria-live-announcer');
  
  if (announcer) {
    announcer.setAttribute('aria-live', priority);
    announcer.textContent = message;
    
    // Clear after announcement
    setTimeout(() => {
      announcer.textContent = '';
    }, 1000);
  }
}

/**
 * SHOULD: Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * MUST: Non-breaking space utility
 */
export function nbsp(text: string): string {
  return text.replace(/ /g, '\u00A0');
}

/**
 * MUST: Use ellipsis character
 */
export function ellipsis(): string {
  return '…';
}

/**
 * SHOULD: Format placeholders with ellipsis and concrete examples
 */
export function formatPlaceholder(example: string): string {
  return `${example}${ellipsis()}`;
}

/**
 * MUST: Check if zoom is disabled (should never be)
 */
export function isZoomDisabled(): boolean {
  const viewport = document.querySelector('meta[name="viewport"]');
  if (!viewport) return false;

  const content = viewport.getAttribute('content') || '';
  
  return (
    content.includes('user-scalable=no') ||
    content.includes('maximum-scale=1') ||
    content.includes('maximum-scale=1.0')
  );
}

/**
 * MUST: Validate accessible name exists
 */
export function hasAccessibleName(element: HTMLElement): boolean {
  const ariaLabel = element.getAttribute('aria-label');
  const ariaLabelledBy = element.getAttribute('aria-labelledby');
  const title = element.getAttribute('title');
  const textContent = element.textContent?.trim();

  return !!(ariaLabel || ariaLabelledBy || title || textContent);
}

/**
 * MUST: Generate unique ID for aria associations
 */
let idCounter = 0;
export function generateId(prefix = 'a11y'): string {
  return `${prefix}-${++idCounter}`;
}
