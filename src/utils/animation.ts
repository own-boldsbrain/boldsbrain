/**
 * Animation utilities following accessibility guidelines
 * MUST: Honor prefers-reduced-motion, use only transform/opacity
 */

import { prefersReducedMotion } from './accessibility';

/**
 * MUST: Only animate transform and opacity for 60fps performance
 */
export const SAFE_ANIMATION_PROPERTIES = ['transform', 'opacity'] as const;

/**
 * Get animation duration based on user preferences
 * MUST: Reduce to 0.01ms if user prefers reduced motion
 */
export function getAnimationDuration(normalDuration: number): number {
  return prefersReducedMotion() ? 0.01 : normalDuration;
}

/**
 * SHOULD: Choose easing based on distance and size
 */
export const EASINGS = {
  // For small, quick movements
  snappy: [0.4, 0, 0.2, 1],
  
  // For medium movements
  smooth: [0.4, 0, 0.6, 1],
  
  // For large movements or entering
  entrance: [0, 0, 0.2, 1],
  
  // For exiting
  exit: [0.4, 0, 1, 1],
  
  // Spring-like for interactive feedback
  bounce: [0.68, -0.55, 0.265, 1.55],
} as const;

/**
 * Framer Motion variants that respect reduced motion
 */
export function createMotionVariants(config: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initial?: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  animate?: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  exit?: Record<string, any>;
  duration?: number;
}) {
  const duration = getAnimationDuration(config.duration ?? 0.2);
  const shouldAnimate = !prefersReducedMotion();

  return {
    initial: shouldAnimate ? config.initial : config.animate,
    animate: config.animate,
    exit: shouldAnimate ? config.exit : config.animate,
    transition: {
      duration,
      ease: EASINGS.smooth,
    },
  };
}

/**
 * Common animation variants for modals/dialogs
 */
export const modalVariants = createMotionVariants({
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  duration: 0.2,
});

/**
 * Common animation variants for toasts
 */
export const toastVariants = createMotionVariants({
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  duration: 0.3,
});

/**
 * Common animation variants for drawers
 */
export const drawerVariants = {
  bottom: createMotionVariants({
    initial: { opacity: 0, y: '100%' },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: '100%' },
    duration: 0.3,
  }),
  top: createMotionVariants({
    initial: { opacity: 0, y: '-100%' },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: '-100%' },
    duration: 0.3,
  }),
  left: createMotionVariants({
    initial: { opacity: 0, x: '-100%' },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: '-100%' },
    duration: 0.3,
  }),
  right: createMotionVariants({
    initial: { opacity: 0, x: '100%' },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: '100%' },
    duration: 0.3,
  }),
};

/**
 * Fade animation
 */
export const fadeVariants = createMotionVariants({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  duration: 0.15,
});

/**
 * MUST: CSS animation with reduced motion support
 */
export function getCSSAnimation(
  property: string,
  duration: number,
  easing: keyof typeof EASINGS = 'smooth'
): string {
  if (prefersReducedMotion()) {
    return 'none';
  }
  
  const easingArray = EASINGS[easing];
  return `${property} ${duration}s cubic-bezier(${easingArray.join(', ')})`;
}

/**
 * Create CSS transition string with safe properties
 */
export function createTransition(
  properties: Array<'transform' | 'opacity'>,
  duration: number = 0.2,
  easing: keyof typeof EASINGS = 'smooth'
): string {
  if (prefersReducedMotion()) {
    return 'none';
  }

  const easingArray = EASINGS[easing];
  return properties
    .map(prop => `${prop} ${duration}s cubic-bezier(${easingArray.join(', ')})`)
    .join(', ');
}
