'use client';

import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type RefObject } from 'react';

/**
 * For drawers, sheets, dialogs and popovers: while `open`, moves focus into `ref`, closes on Escape,
 * locks page scroll (optional), and returns focus to whatever opened it on close.
 */
export function useDismissable<T extends HTMLElement>(open: boolean, onClose: () => void, { lockScroll = true } = {}): RefObject<T | null> {
  const ref = useRef<T>(null);
  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    ref.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    if (lockScroll) document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      if (lockScroll) document.body.style.overflow = prev;
      opener?.focus();
    };
  }, [open, onClose, lockScroll]);
  return ref;
}

/** True once the page has scrolled past `px` — for an iOS large title that turns into a compact nav bar. */
export function useScrolledPast(px = 44) {
  const [past, setPast] = useState(false);
  useEffect(() => {
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setPast(window.scrollY > px));
    };
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', on);
    };
  }, [px]);
  return past;
}

/**
 * Swipe-down-to-close for a bottom sheet. Spread `handlers` on the grabber (give it `touch-action: none`)
 * and translate the sheet by `dy`; past `threshold` px it calls `onClose`, otherwise it springs back.
 */
export function useDragToClose(onClose: () => void, threshold = 90) {
  const drag = useRef<{ y: number; id: number } | null>(null);
  const [dy, setDy] = useState(0);
  const reset = useCallback(() => setDy(0), []);
  const handlers = {
    onPointerDown: (e: ReactPointerEvent) => {
      drag.current = { y: e.clientY, id: e.pointerId };
      try {
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      } catch {
        /* pointer already gone */
      }
    },
    onPointerMove: (e: ReactPointerEvent) => {
      if (drag.current?.id === e.pointerId) setDy(Math.max(0, e.clientY - drag.current.y));
    },
    onPointerUp: (e: ReactPointerEvent) => {
      if (drag.current?.id !== e.pointerId) return;
      drag.current = null;
      if (dy > threshold) onClose();
      else setDy(0);
    },
    onPointerCancel: () => {
      drag.current = null;
      setDy(0);
    },
  };
  return { dy, dragging: drag.current !== null, handlers, reset };
}

/** Width and height of an element in CSS pixels. */
export function useSize<T extends HTMLElement>(w0: number, h0: number): [RefObject<T | null>, number, number] {
  const ref = useRef<T>(null);
  const [size, set] = useState([w0, h0]);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => set((old) => [Math.round(e.contentRect.width) || old[0], Math.round(e.contentRect.height) || old[1]]));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, size[0], size[1]];
}

/** Closes a popover when a pointer goes down outside it. */
export function useOutside(open: boolean, ref: RefObject<HTMLElement | null>, close: () => void) {
  useEffect(() => {
    if (!open) return;
    const down = (e: PointerEvent) => { if (!ref.current?.contains(e.target as Node)) close(); };
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    document.addEventListener('pointerdown', down);
    document.addEventListener('keydown', key);
    return () => { document.removeEventListener('pointerdown', down); document.removeEventListener('keydown', key); };
  }, [open, ref, close]);
}

/** Eases a list of numbers toward its target. Starts at the target, so the first paint is final. */
export function useEased(target: number[], ms = 420): number[] {
  const [now, setNow] = useState(target);
  const from = useRef(target);
  const key = target.join();
  useEffect(() => {
    const start = from.current;
    if (start.join() === key) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { from.current = target; setNow(target); return; }
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / ms);
      const e = 1 - Math.pow(1 - p, 4);
      const v = target.map((x, i) => start[i] + (x - start[i]) * e);
      from.current = v;
      setNow(v);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, ms]);
  return now;
}
