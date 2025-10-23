/**
 * Focus management hooks following WAI-ARIA APG patterns
 * MUST: Implement proper focus trap, return to trigger, etc.
 */

import { useEffect, useRef, useCallback } from 'react';
import { createFocusTrap, focusElement } from '../utils/accessibility';

/**
 * MUST: Focus trap hook for modals/dialogs
 * Automatically manages focus trap lifecycle
 */
export function useFocusTrap(isActive: boolean) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    // MUST: Save the element that triggered the modal
    previouslyFocusedElement.current = document.activeElement as HTMLElement;

    const trap = createFocusTrap(containerRef.current);
    
    // MUST: Move focus to first interactive element
    trap.activate();

    return () => {
      trap.deactivate();
      
      // MUST: Return focus to the trigger element
      if (previouslyFocusedElement.current) {
        focusElement(previouslyFocusedElement.current);
      }
    };
  }, [isActive]);

  return containerRef;
}

/**
 * MUST: Keyboard navigation hook for complex widgets
 */
export function useArrowNavigation(
  items: Array<HTMLElement | null>,
  options: {
    orientation?: 'horizontal' | 'vertical' | 'both';
    loop?: boolean;
  } = {}
) {
  const { orientation = 'vertical', loop = true } = options;
  const currentIndexRef = useRef(0);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const validItems = items.filter((item): item is HTMLElement => item !== null);
      if (validItems.length === 0) return;

      let handled = false;
      let nextIndex = currentIndexRef.current;

      switch (e.key) {
        case 'ArrowDown':
          if (orientation === 'vertical' || orientation === 'both') {
            nextIndex = currentIndexRef.current + 1;
            handled = true;
          }
          break;
        case 'ArrowUp':
          if (orientation === 'vertical' || orientation === 'both') {
            nextIndex = currentIndexRef.current - 1;
            handled = true;
          }
          break;
        case 'ArrowRight':
          if (orientation === 'horizontal' || orientation === 'both') {
            nextIndex = currentIndexRef.current + 1;
            handled = true;
          }
          break;
        case 'ArrowLeft':
          if (orientation === 'horizontal' || orientation === 'both') {
            nextIndex = currentIndexRef.current - 1;
            handled = true;
          }
          break;
        case 'Home':
          nextIndex = 0;
          handled = true;
          break;
        case 'End':
          nextIndex = validItems.length - 1;
          handled = true;
          break;
      }

      if (handled) {
        e.preventDefault();

        // Handle looping
        if (loop) {
          nextIndex = (nextIndex + validItems.length) % validItems.length;
        } else {
          nextIndex = Math.max(0, Math.min(nextIndex, validItems.length - 1));
        }

        currentIndexRef.current = nextIndex;
        focusElement(validItems[nextIndex]);
      }
    },
    [items, orientation, loop]
  );

  return { handleKeyDown };
}

/**
 * MUST: Auto-focus hook with desktop/mobile consideration
 * SHOULD: Only autofocus on desktop for primary single input
 */
export function useAutoFocus(
  shouldFocus: boolean,
  options: { desktopOnly?: boolean } = {}
) {
  const { desktopOnly = true } = options;
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!shouldFocus || !elementRef.current) return;

    const isMobile = window.innerWidth <= 768;
    
    // SHOULD: Avoid autofocus on mobile
    if (desktopOnly && isMobile) return;

    focusElement(elementRef.current);
  }, [shouldFocus, desktopOnly]);

  return elementRef;
}

/**
 * MUST: Focus on first error in form validation
 */
export function useFocusOnError(errorFields: string[]) {
  useEffect(() => {
    if (errorFields.length === 0) return;

    // Find first error field and focus it
    const firstErrorField = document.querySelector<HTMLElement>(
      `[name="${errorFields[0]}"], [id="${errorFields[0]}"]`
    );

    if (firstErrorField) {
      focusElement(firstErrorField);
    }
  }, [errorFields]);
}

/**
 * MUST: Escape key handler (e.g., for closing modals)
 */
export function useEscapeKey(onEscape: () => void, isActive: boolean = true) {
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onEscape();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onEscape, isActive]);
}

/**
 * SHOULD: Delay first tooltip in a group
 */
export function useTooltipDelay(groupId?: string) {
  const hasShownInGroup = useRef(false);

  useEffect(() => {
    if (!groupId) return;

    // Reset on unmount
    return () => {
      hasShownInGroup.current = false;
    };
  }, [groupId]);

  const getDelay = useCallback(() => {
    if (!groupId) return 500; // Default delay

    if (hasShownInGroup.current) {
      return 0; // No delay for subsequent tooltips
    }

    hasShownInGroup.current = true;
    return 500; // Delay first tooltip
  }, [groupId]);

  return getDelay;
}
