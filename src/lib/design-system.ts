/**
 * AI Components Design System
 *
 * Composable utilities for building accessible, fast, delightful UIs
 * Uses MUST/SHOULD/NEVER guidelines for decisions
 */

// ============================================================================
// BREAKPOINTS & RESPONSIVE
// ============================================================================

export const breakpoints = {
  xs: 320,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
  '3xl': 1920, // Ultra-wide
} as const;

export type Breakpoint = keyof typeof breakpoints;

// Media query helpers
export const mq = {
  xs: `@media (min-width: ${breakpoints.xs}px)`,
  sm: `@media (min-width: ${breakpoints.sm}px)`,
  md: `@media (min-width: ${breakpoints.md}px)`,
  lg: `@media (min-width: ${breakpoints.lg}px)`,
  xl: `@media (min-width: ${breakpoints.xl}px)`,
  '2xl': `@media (min-width: ${breakpoints['2xl']}px)`,
  '3xl': `@media (min-width: ${breakpoints['3xl']}px)`,
  // Special queries
  touch: '@media (pointer: coarse)',
  mouse: '@media (pointer: fine)',
  reducedMotion: '@media (prefers-reduced-motion: reduce)',
  dark: '@media (prefers-color-scheme: dark)',
  light: '@media (prefers-color-scheme: light)',
  landscape: '@media (orientation: landscape)',
  portrait: '@media (orientation: portrait)',
} as const;

// ============================================================================
// HIT TARGETS (MUST: >=24px desktop, >=44px mobile)
// ============================================================================

export const hitTargets = {
  // MUST: Minimum hit target sizes
  desktop: 24,
  mobile: 44,
  // Recommended sizes
  sm: 32,
  md: 40,
  lg: 48,
} as const;

// CSS classes for expanding hit areas
export const hitTargetClasses = {
  // Expands hit area while keeping visual size
  expand: 'relative after:absolute after:inset-[-8px] after:content-[\'\']',
  expandMobile: 'relative after:absolute after:inset-[-10px] after:content-[\'\'] md:after:inset-[-4px]',
} as const;

// ============================================================================
// FOCUS MANAGEMENT (MUST: Visible focus rings)
// ============================================================================

export const focusRing = {
  // Standard focus ring
  default: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
  // Focus within for groups
  within: 'focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2',
  // Inset focus (for inputs)
  inset: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500',
  // High contrast focus
  contrast: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900',
} as const;

// ============================================================================
// TYPOGRAPHY (MUST: Tabular nums, proper quotes)
// ============================================================================

export const typography = {
  // Tabular numbers for comparisons
  tabular: 'font-variant-numeric: tabular-nums',
  tabularClass: '[font-variant-numeric:tabular-nums]',
  // Proper quotes - use Unicode escape sequences
  curlyQuotes: (text: string) => text.replace(/"/g, '\u201C').replace(/'/g, '\u2019'),
  // Non-breaking spaces
  nbsp: '\u00A0',
  // Ellipsis character (MUST use this, not ...)
  ellipsis: '\u2026',
} as const;

// ============================================================================
// ANIMATIONS (MUST: Honor prefers-reduced-motion)
// ============================================================================

export const animations = {
  // Duration tokens
  duration: {
    instant: 0,
    fast: 100,
    normal: 200,
    slow: 300,
    slower: 500,
  },
  // Easing functions
  easing: {
    linear: 'linear',
    easeOut: 'cubic-bezier(0.16, 1, 0.3, 1)',
    easeIn: 'cubic-bezier(0.7, 0, 0.84, 0)',
    easeInOut: 'cubic-bezier(0.65, 0, 0.35, 1)',
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
  // Reduced motion variants
  reducedMotion: {
    duration: 0,
    transition: 'none',
  },
} as const;

// Animation CSS classes with reduced-motion support
export const animationClasses = {
  fadeIn: 'animate-fadeIn motion-reduce:animate-none motion-reduce:opacity-100',
  fadeOut: 'animate-fadeOut motion-reduce:animate-none',
  slideUp: 'animate-slideUp motion-reduce:animate-none motion-reduce:translate-y-0',
  slideDown: 'animate-slideDown motion-reduce:animate-none motion-reduce:translate-y-0',
  scaleIn: 'animate-scaleIn motion-reduce:animate-none motion-reduce:scale-100',
  spin: 'animate-spin motion-reduce:animate-none',
} as const;

// ============================================================================
// SPACING & LAYOUT
// ============================================================================

export const spacing = {
  // Safe area insets
  safeArea: {
    top: 'env(safe-area-inset-top)',
    right: 'env(safe-area-inset-right)',
    bottom: 'env(safe-area-inset-bottom)',
    left: 'env(safe-area-inset-left)',
  },
  // Scroll margins for anchored links
  scrollMargin: 'scroll-mt-20',
} as const;

// ============================================================================
// COLORS & CONTRAST (MUST: Meet APCA contrast)
// ============================================================================

export const contrast = {
  // Minimum contrast ratios (APCA Lc values)
  body: 60, // Body text minimum
  largeText: 45, // Large text (18px+)
  interactive: 75, // Interactive elements
  decorative: 30, // Decorative/non-essential
} as const;

// ============================================================================
// SHADOWS (SHOULD: Layered shadows)
// ============================================================================

export const shadows = {
  // Layered shadows (ambient + direct)
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.03), 0 1px 3px 0 rgb(0 0 0 / 0.06)',
  md: '0 2px 4px -1px rgb(0 0 0 / 0.04), 0 4px 6px -1px rgb(0 0 0 / 0.08)',
  lg: '0 4px 6px -2px rgb(0 0 0 / 0.03), 0 10px 15px -3px rgb(0 0 0 / 0.08)',
  xl: '0 10px 10px -5px rgb(0 0 0 / 0.02), 0 20px 25px -5px rgb(0 0 0 / 0.08)',
} as const;

// ============================================================================
// RADII (SHOULD: Nested radii concentric)
// ============================================================================

export const radii = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999,
} as const;

// Calculate nested radius (child <= parent; concentric)
export function nestedRadius(parentRadius: number, padding: number): number {
  return Math.max(0, parentRadius - padding);
}

// ============================================================================
// Z-INDEX SCALE
// ============================================================================

export const zIndex = {
  hide: -1,
  base: 0,
  dropdown: 10,
  sticky: 20,
  fixed: 30,
  overlay: 40,
  modal: 50,
  popover: 60,
  toast: 70,
  tooltip: 80,
  max: 9999,
} as const;

// ============================================================================
// ARIA HELPERS
// ============================================================================

export const aria = {
  // Live regions for toasts/validation (MUST: polite)
  live: {
    polite: { 'aria-live': 'polite', 'aria-atomic': true } as const,
    assertive: { 'aria-live': 'assertive', 'aria-atomic': true } as const,
  },
  // Hide decorative elements
  decorative: { 'aria-hidden': true } as const,
  // Loading states
  loading: (isLoading: boolean) => ({
    'aria-busy': isLoading,
    'aria-live': 'polite' as const,
  }),
} as const;

// ============================================================================
// INPUT HELPERS
// ============================================================================

export const inputDefaults = {
  // MUST: Mobile input font-size >=16px to prevent zoom
  mobileFontSize: 16,
  // MUST: touch-action to prevent double-tap zoom
  touchAction: 'manipulation' as const,
  // Common autocomplete values
  autocomplete: {
    email: 'email',
    password: 'current-password',
    newPassword: 'new-password',
    name: 'name',
    phone: 'tel',
    address: 'street-address',
    otp: 'one-time-code',
  },
} as const;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Check if device is touch-primary
 */
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(pointer: coarse)').matches;
}

/**
 * Get safe animation duration (respects reduced motion)
 */
export function safeAnimationDuration(duration: number): number {
  return prefersReducedMotion() ? 0 : duration;
}

/**
 * Trap focus within an element (for modals/dialogs)
 */
export function trapFocus(element: HTMLElement): () => void {
  const focusableElements = element.querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable?.focus();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable?.focus();
      }
    }
  };

  element.addEventListener('keydown', handleKeyDown);
  firstFocusable?.focus();

  return () => element.removeEventListener('keydown', handleKeyDown);
}

/**
 * Format with non-breaking spaces (MUST for units)
 */
export function formatWithNbsp(value: string | number, unit: string): string {
  return `${value}\u00A0${unit}`;
}

/**
 * Generate idempotency key for form submissions
 */
export function generateIdempotencyKey(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
