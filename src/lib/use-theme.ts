'use client';
import { useSyncExternalStore } from 'react';
import type { Choice } from './theme';

type Api = { get: () => Choice; dark: () => boolean; set: (c: Choice) => void; sub: (f: () => void) => () => void; apply: () => void };
const api = () => (window as unknown as { __theme: Api }).__theme;

export function useTheme() {
  const choice = useSyncExternalStore((f) => api().sub(f), () => api().get(), () => 'system' as Choice);
  const dark = useSyncExternalStore((f) => api().sub(f), () => api().dark(), () => false);
  return { choice, dark, setTheme: (c: Choice) => api().set(c) };
}
