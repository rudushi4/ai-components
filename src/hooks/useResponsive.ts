import { useState, useEffect, useCallback, useRef } from 'react';
import { breakpoints, type Breakpoint } from '../lib/design-system';

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

export function useCurrentBreakpoint(): Breakpoint {
  const [current, setCurrent] = useState<Breakpoint>('xs');
  useEffect(() => {
    const check = () => {
      const w = window.innerWidth;
      if (w >= breakpoints['3xl']) return setCurrent('3xl');
      if (w >= breakpoints['2xl']) return setCurrent('2xl');
      if (w >= breakpoints.xl) return setCurrent('xl');
      if (w >= breakpoints.lg) return setCurrent('lg');
      if (w >= breakpoints.md) return setCurrent('md');
      if (w >= breakpoints.sm) return setCurrent('sm');
      setCurrent('xs');
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return current;
}

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

export function useFocusTrap(isActive: boolean) {
  const containerRef = useRef<HTMLElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;
    previousFocusRef.current = document.activeElement as HTMLElement;
    const container = containerRef.current;
    const focusable = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    first?.focus();

    const handler = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first?.focus();
      }
    };

    container.addEventListener('keydown', handler);
    return () => {
      container.removeEventListener('keydown', handler);
      previousFocusRef.current?.focus();
    };
  }, [isActive]);

  return containerRef;
}

export function useFocusReturn() {
  const triggerRef = useRef<HTMLElement | null>(null);
  const storeFocus = useCallback(() => {
    triggerRef.current = document.activeElement as HTMLElement;
  }, []);
  const returnFocus = useCallback(() => { triggerRef.current?.focus(); }, []);
  return { storeFocus, returnFocus };
}

export function useArrowNavigation(
  items: HTMLElement[] | null,
  options: { orientation?: 'horizontal' | 'vertical' | 'both'; wrap?: boolean; onSelect?: (index: number) => void } = {}
) {
  const { orientation = 'vertical', wrap = true, onSelect } = options;
  const [activeIndex, setActiveIndex] = useState(0);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!items?.length) return;
    let next = activeIndex;
    const isV = orientation === 'vertical' || orientation === 'both';
    const isH = orientation === 'horizontal' || orientation === 'both';

    if ((e.key === 'ArrowDown' && isV) || (e.key === 'ArrowRight' && isH)) {
      e.preventDefault();
      next = wrap ? (activeIndex + 1) % items.length : Math.min(activeIndex + 1, items.length - 1);
    } else if ((e.key === 'ArrowUp' && isV) || (e.key === 'ArrowLeft' && isH)) {
      e.preventDefault();
      next = wrap ? (activeIndex - 1 + items.length) % items.length : Math.max(activeIndex - 1, 0);
    } else if (e.key === 'Home') { e.preventDefault(); next = 0; }
    else if (e.key === 'End') { e.preventDefault(); next = items.length - 1; }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect?.(activeIndex); return; }
    else return;

    setActiveIndex(next);
    items[next]?.focus();
  }, [items, activeIndex, orientation, wrap, onSelect]);

  return { activeIndex, setActiveIndex, handleKeyDown };
}

export function useFormSubmit<T>(submitFn: (data: T) => Promise<void>, options: { idempotent?: boolean } = {}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const idempotencyKeyRef = useRef<string | null>(null);

  const handleSubmit = useCallback(async (data: T) => {
    if (isSubmitting) return;
    if (options.idempotent) idempotencyKeyRef.current = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setIsSubmitting(true);
    setError(null);
    try { await submitFn(data); }
    catch (err) { setError(err instanceof Error ? err : new Error('Submission failed')); }
    finally { setIsSubmitting(false); }
  }, [submitFn, isSubmitting, options.idempotent]);

  return { isSubmitting, error, handleSubmit, idempotencyKey: idempotencyKeyRef.current };
}

export function useUnsavedChanges(hasChanges: boolean, message = 'You have unsaved changes.') {
  useEffect(() => {
    if (!hasChanges) return;
    const handler = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = message; return message; };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [hasChanges, message]);
}

export function useScrollRestoration() {
  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    const positions = new Map<string, number>();
    const save = () => { positions.set(location.pathname, window.scrollY); };
    const restore = () => {
      const saved = positions.get(location.pathname);
      if (saved !== undefined) window.scrollTo(0, saved);
    };
    window.addEventListener('scroll', save);
    window.addEventListener('popstate', restore);
    return () => { window.removeEventListener('scroll', save); window.removeEventListener('popstate', restore); };
  }, []);
}

export function useTooltipDelay(groupId: string, baseDelay = 500) {
  const [delay, setDelay] = useState(baseDelay);
  useEffect(() => {
    const key = `tooltip-group-${groupId}`;
    const lastShown = sessionStorage.getItem(key);
    const now = Date.now();
    if (lastShown && now - parseInt(lastShown) < 1000) setDelay(0);
    else setDelay(baseDelay);
    return () => { sessionStorage.setItem(key, now.toString()); };
  }, [groupId, baseDelay]);
  return delay;
}

export default {
  useBreakpoint, useCurrentBreakpoint, useIsMobile, useReducedMotion,
  useFocusTrap, useFocusReturn, useArrowNavigation, useFormSubmit,
  useUnsavedChanges, useScrollRestoration, useTooltipDelay,
};
