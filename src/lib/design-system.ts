/**
 * AI Components Design System
 * Composable utilities for accessible, fast, delightful UIs
 */

export const breakpoints = {
  xs: 320,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
  '3xl': 1920,
} as const;

export type Breakpoint = keyof typeof breakpoints;

export const mq = {
  xs: `@media (min-width: ${breakpoints.xs}px)`,
  sm: `@media (min-width: ${breakpoints.sm}px)`,
  md: `@media (min-width: ${breakpoints.md}px)`,
  lg: `@media (min-width: ${breakpoints.lg}px)`,
  xl: `@media (min-width: ${breakpoints.xl}px)`,
  touch: '@media (pointer: coarse)',
  reducedMotion: '@media (prefers-reduced-motion: reduce)',
} as const;

export const hitTargets = {
  desktop: 24,
  mobile: 44,
  sm: 32,
  md: 40,
  lg: 48,
} as const;

export const hitTargetClasses = {
  expand: 'relative after:absolute after:inset-[-8px] after:content-[\'\']',
  expandMobile: 'relative after:absolute after:inset-[-10px] after:content-[\'\'] md:after:inset-[-4px]',
} as const;

export const focusRing = {
  default: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
  within: 'focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2',
  inset: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500',
} as const;

export const typography = {
  tabular: 'font-variant-numeric: tabular-nums',
  tabularClass: '[font-variant-numeric:tabular-nums]',
  curlyQuotes: (text: string) => text.replace(/"/g, '\u201C').replace(/'/g, '\u2019'),
  nbsp: '\u00A0',
  ellipsis: '\u2026',
} as const;

export const animations = {
  duration: { instant: 0, fast: 100, normal: 200, slow: 300, slower: 500 },
  easing: {
    linear: 'linear',
    easeOut: 'cubic-bezier(0.16, 1, 0.3, 1)',
    easeIn: 'cubic-bezier(0.7, 0, 0.84, 0)',
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
  reducedMotion: { duration: 0, transition: 'none' },
} as const;

export const animationClasses = {
  fadeIn: 'animate-fadeIn motion-reduce:animate-none motion-reduce:opacity-100',
  slideUp: 'animate-slideUp motion-reduce:animate-none motion-reduce:translate-y-0',
  scaleIn: 'animate-scaleIn motion-reduce:animate-none motion-reduce:scale-100',
  spin: 'animate-spin motion-reduce:animate-none',
} as const;

export const spacing = {
  safeArea: {
    top: 'env(safe-area-inset-top)',
    right: 'env(safe-area-inset-right)',
    bottom: 'env(safe-area-inset-bottom)',
    left: 'env(safe-area-inset-left)',
  },
  scrollMargin: 'scroll-mt-20',
} as const;

export const contrast = {
  body: 60,
  largeText: 45,
  interactive: 75,
  decorative: 30,
} as const;

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.03), 0 1px 3px 0 rgb(0 0 0 / 0.06)',
  md: '0 2px 4px -1px rgb(0 0 0 / 0.04), 0 4px 6px -1px rgb(0 0 0 / 0.08)',
  lg: '0 4px 6px -2px rgb(0 0 0 / 0.03), 0 10px 15px -3px rgb(0 0 0 / 0.08)',
  xl: '0 10px 10px -5px rgb(0 0 0 / 0.02), 0 20px 25px -5px rgb(0 0 0 / 0.08)',
} as const;

export const radii = { none: 0, sm: 4, md: 8, lg: 12, xl: 16, '2xl': 24, full: 9999 } as const;

export function nestedRadius(parentRadius: number, padding: number): number {
  return Math.max(0, parentRadius - padding);
}

export const zIndex = {
  hide: -1, base: 0, dropdown: 10, sticky: 20, fixed: 30,
  overlay: 40, modal: 50, popover: 60, toast: 70, tooltip: 80, max: 9999,
} as const;

export const aria = {
  live: {
    polite: { 'aria-live': 'polite', 'aria-atomic': true } as const,
    assertive: { 'aria-live': 'assertive', 'aria-atomic': true } as const,
  },
  decorative: { 'aria-hidden': true } as const,
  loading: (isLoading: boolean) => ({ 'aria-busy': isLoading, 'aria-live': 'polite' as const }),
} as const;

export const inputDefaults = {
  mobileFontSize: 16,
  touchAction: 'manipulation' as const,
  autocomplete: {
    email: 'email', password: 'current-password', newPassword: 'new-password',
    name: 'name', phone: 'tel', otp: 'one-time-code',
  },
} as const;

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(pointer: coarse)').matches;
}

export function safeAnimationDuration(duration: number): number {
  return prefersReducedMotion() ? 0 : duration;
}

export function trapFocus(element: HTMLElement): () => void {
  const focusable = element.querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  const handler = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last?.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first?.focus();
    }
  };

  element.addEventListener('keydown', handler);
  first?.focus();
  return () => element.removeEventListener('keydown', handler);
}

export function formatWithNbsp(value: string | number, unit: string): string {
  return `${value}\u00A0${unit}`;
}

export function generateIdempotencyKey(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
