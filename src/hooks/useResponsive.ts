/**
 * Responsive & Accessibility Hooks
 *
 * MUST: Honor prefers-reduced-motion
 * MUST: Support keyboard navigation
 * MUST: Manage focus properly
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { breakpoints, type Breakpoint } from '../lib/design-system';

// ============================================================================
// BREAKPOINT HOOKS
// ============================================================================

/**
 * Hook to check if viewport matches a breakpoint
 * MUST: Verify mobile, laptop, ultra-wide
 */
export function useBreakpoint(breakpoint: Breakpoint): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(`(min-width: ${breakpoints[breakpoint]}px)`);
    setMatches(query.matches);

    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    query.addEventListener('change', handler);
    return () => query.removeEventListener('change', handler);
  }, [breakpoint]);

  return matches;
}

/**
 * Get current breakpoint name
 */
export function useCurrentBreakpoint(): Breakpoint {
  const [current, setCurrent] = useState<Breakpoint>('xs');

  useEffect(() => {
    const checkBreakpoint = () => {
      const width = window.innerWidth;
      if (width >= breakpoints['3xl']) return setCurrent('3xl');
      if (width >= breakpoints['2xl']) return setCurrent('2xl');
      if (width >= breakpoints.xl) return setCurrent('xl');
      if (width >= breakpoints.lg) return setCurrent('lg');
      if (width >= breakpoints.md) return setCurrent('md');
      if (width >= breakpoints.sm) return setCurrent('sm');
      setCurrent('xs');
    };

    checkBreakpoint();
    window.addEventListener('resize', checkBreakpoint);
    return () => window.removeEventListener('resize', checkBreakpoint);
  }, []);

  return current;
}

/**
 * Check if device is mobile (touch-primary)
 * MUST: Hit target >=44px on mobile
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(pointer: coarse)');
    setIsMobile(query.matches);

    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    query.addEventListener('change', handler);
    return () => query.removeEventListener('change', handler);
  }, []);

  return isMobile;
}

// ============================================================================
// REDUCED MOTION HOOK
// ============================================================================

/**
 * Hook to check if user prefers reduced motion
 * MUST: Honor prefers-reduced-motion
 */
export function useReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(query.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    query.addEventListener('change', handler);
    return () => query.removeEventListener('change', handler);
  }, []);

  return prefersReduced;
}

// ============================================================================
// FOCUS MANAGEMENT HOOKS
// ============================================================================

/**
 * Hook to trap focus within an element (for modals/dialogs)
 * MUST: Manage focus (trap, move, and return) per APG patterns
 */
export function useFocusTrap(isActive: boolean) {
  const containerRef = useRef<HTMLElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    // Store previous focus
    previousFocusRef.current = document.activeElement as HTMLElement;

    const container = containerRef.current;
    const focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const focusableElements = container.querySelectorAll<HTMLElement>(focusableSelector);
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    // Focus first element
    firstFocusable?.focus();

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

    container.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
      // Return focus
      previousFocusRef.current?.focus();
    };
  }, [isActive]);

  return containerRef;
}

/**
 * Hook to manage focus return after modal/dialog closes
 */
export function useFocusReturn() {
  const triggerRef = useRef<HTMLElement | null>(null);

  const storeFocus = useCallback(() => {
    triggerRef.current = document.activeElement as HTMLElement;
  }, []);

  const returnFocus = useCallback(() => {
    triggerRef.current?.focus();
  }, []);

  return { storeFocus, returnFocus };
}

// ============================================================================
// KEYBOARD NAVIGATION HOOKS
// ============================================================================

/**
 * Hook for arrow key navigation (lists, grids)
 * MUST: Full keyboard support per WAI-ARIA APG
 */
export function useArrowNavigation(
  items: HTMLElement[] | null,
  options: {
    orientation?: 'horizontal' | 'vertical' | 'both';
    wrap?: boolean;
    onSelect?: (index: number) => void;
  } = {}
) {
  const { orientation = 'vertical', wrap = true, onSelect } = options;
  const [activeIndex, setActiveIndex] = useState(0);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!items?.length) return;

      const isVertical = orientation === 'vertical' || orientation === 'both';
      const isHorizontal = orientation === 'horizontal' || orientation === 'both';

      let nextIndex = activeIndex;

      switch (e.key) {
        case 'ArrowDown':
          if (isVertical) {
            e.preventDefault();
            nextIndex = wrap
              ? (activeIndex + 1) % items.length
              : Math.min(activeIndex + 1, items.length - 1);
          }
          break;
        case 'ArrowUp':
          if (isVertical) {
            e.preventDefault();
            nextIndex = wrap
              ? (activeIndex - 1 + items.length) % items.length
              : Math.max(activeIndex - 1, 0);
          }
          break;
        case 'ArrowRight':
          if (isHorizontal) {
            e.preventDefault();
            nextIndex = wrap
              ? (activeIndex + 1) % items.length
              : Math.min(activeIndex + 1, items.length - 1);
          }
          break;
        case 'ArrowLeft':
          if (isHorizontal) {
            e.preventDefault();
            nextIndex = wrap
              ? (activeIndex - 1 + items.length) % items.length
              : Math.max(activeIndex - 1, 0);
          }
          break;
        case 'Home':
          e.preventDefault();
          nextIndex = 0;
          break;
        case 'End':
          e.preventDefault();
          nextIndex = items.length - 1;
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          onSelect?.(activeIndex);
          return;
        default:
          return;
      }

      setActiveIndex(nextIndex);
      items[nextIndex]?.focus();
    },
    [items, activeIndex, orientation, wrap, onSelect]
  );

  return { activeIndex, setActiveIndex, handleKeyDown };
}

// ============================================================================
// FORM HOOKS
// ============================================================================

/**
 * Hook for form submission with loading state
 * MUST: Keep submit enabled until request starts; then disable, show spinner
 */
export function useFormSubmit<T>(
  submitFn: (data: T) => Promise<void>,
  options: { idempotent?: boolean } = {}
) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const idempotencyKeyRef = useRef<string | null>(null);

  const handleSubmit = useCallback(
    async (data: T) => {
      if (isSubmitting) return;

      // Generate idempotency key if needed
      if (options.idempotent) {
        idempotencyKeyRef.current = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      }

      setIsSubmitting(true);
      setError(null);

      try {
        await submitFn(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Submission failed'));
      } finally {
        setIsSubmitting(false);
      }
    },
    [submitFn, isSubmitting, options.idempotent]
  );

  return {
    isSubmitting,
    error,
    handleSubmit,
    idempotencyKey: idempotencyKeyRef.current,
  };
}

/**
 * Hook to warn on unsaved changes before navigation
 * MUST: Warn on unsaved changes before navigation
 */
export function useUnsavedChanges(hasChanges: boolean, message = 'You have unsaved changes. Are you sure you want to leave?') {
  useEffect(() => {
    if (!hasChanges) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = message;
      return message;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasChanges, message]);
}

// ============================================================================
// SCROLL HOOKS
// ============================================================================

/**
 * Hook to restore scroll position on back/forward
 * MUST: Back/Forward restores scroll
 */
export function useScrollRestoration() {
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    const positions = new Map<string, number>();

    const savePosition = () => {
      positions.set(location.pathname, window.scrollY);
    };

    const restorePosition = () => {
      const savedPosition = positions.get(location.pathname);
      if (savedPosition !== undefined) {
        window.scrollTo(0, savedPosition);
      }
    };

    window.addEventListener('scroll', savePosition);
    window.addEventListener('popstate', restorePosition);

    return () => {
      window.removeEventListener('scroll', savePosition);
      window.removeEventListener('popstate', restorePosition);
    };
  }, []);
}

// ============================================================================
// TOOLTIP DELAY HOOK
// ============================================================================

/**
 * Hook for tooltip delay management
 * MUST: Delay first tooltip in a group; subsequent peers no delay
 */
export function useTooltipDelay(groupId: string, baseDelay = 500) {
  const [delay, setDelay] = useState(baseDelay);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const key = `tooltip-group-${groupId}`;

    // Check if another tooltip in group was recently shown
    const lastShown = sessionStorage.getItem(key);
    const now = Date.now();

    if (lastShown && now - parseInt(lastShown) < 1000) {
      setDelay(0); // No delay for subsequent tooltips
    } else {
      setDelay(baseDelay);
    }

    return () => {
      // Mark this tooltip as shown
      sessionStorage.setItem(key, now.toString());
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [groupId, baseDelay]);

  return delay;
}

export default {
  useBreakpoint,
  useCurrentBreakpoint,
  useIsMobile,
  useReducedMotion,
  useFocusTrap,
  useFocusReturn,
  useArrowNavigation,
  useFormSubmit,
  useUnsavedChanges,
  useScrollRestoration,
  useTooltipDelay,
};
