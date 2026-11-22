'use client';
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { AGENTS, REQUESTS, START_LIMIT, TODAY, type AgentId } from './data';
import { dayPast, forecast, planFor, type Forecast, type Off } from './model';

export type Decision = { kind: 'allow' | 'refuse'; amount: number; standing: boolean };
export type LoopState = 'stopped' | 'resumed' | 'held';
type Core = { limit: number; planned: boolean; decisions: Record<string, Decision>; loop: LoopState };

type Store = Core & {
  off: Off;
  month: Forecast;
  limitOf: (id: AgentId) => number;
  selected: AgentId | null; select: (id: AgentId | null) => void;
  opened: AgentId | null; open: (id: AgentId | null) => void;
  run: { agent: AgentId; index: number } | null; setRun: (r: { agent: AgentId; index: number } | null) => void;
  reset: () => void;
  waiting: number;
  commitLimit: (limit: number, message: string) => void;
  decide: (id: string, d: Decision, message: string) => void;
  setLoop: (l: LoopState, message: string) => void;
  toast: { message: string; id: number } | null; undo: () => void; dismiss: () => void;
};
const FRESH: Core = { limit: START_LIMIT, planned: false, decisions: {}, loop: 'stopped' };
const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [core, setCore] = useState<Core>(FRESH);
  const [last, setLast] = useState<Core | null>(null);
  const [selected, select] = useState<AgentId | null>(null);
  const [opened, open] = useState<AgentId | null>(null);
  const [run, setRun] = useState<Store['run']>(null);
  const [toast, setToast] = useState<Store['toast']>(null);

  const change = useCallback((patch: Partial<Core>, message: string) => {
    setLast(core);
    setCore({ ...core, ...patch });
    setToast({ message, id: Date.now() });
  }, [core]);

  const refused = core.decisions.budget?.kind === 'refuse';
  const off = useMemo<Off>(() => {
    const past = refused ? dayPast('answers', AGENTS.find((a) => a.id === 'answers')!.limit) : null;
    return { ...(core.loop === 'held' && { reading: TODAY }), ...(past && { answers: past }) };
  }, [core.loop, refused]);
  const month = useMemo(() => (core.planned ? planFor(core.limit, off) : forecast(core.limit, off)), [core.planned, core.limit, off]);
  const budget = core.decisions.budget;
  const limitOf = useCallback((id: AgentId) => (id === 'answers' && budget?.kind === 'allow' ? budget.amount : AGENTS.find((a) => a.id === id)!.limit), [budget]);

  const value: Store = {
    ...core, off, month, limitOf, selected, select, opened, open, run, setRun,
    reset: () => { change(FRESH, 'Back to Monday morning'); select(null); open(null); },
    waiting: REQUESTS.filter((r) => !core.decisions[r.id]).length,
    commitLimit: (limit, message) => change({ limit, planned: true }, message),
    decide: (id, d, message) => change({ decisions: { ...core.decisions, [id]: d } }, message),
    setLoop: (loop, message) => change({ loop }, message),
    toast,
    undo: () => { if (last) setCore(last); setLast(null); setToast(null); },
    dismiss: () => setToast(null),
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
export const useStore = () => useContext(Ctx)!;

export type Place = 'overview' | 'requests' | 'limit' | 'agents' | 'ledger';
export const PLACES: { id: Place; href: string; label: string }[] = [
  { id: 'overview', href: '/', label: 'Overview' },
  { id: 'requests', href: '/requests', label: 'Requests' },
  { id: 'limit', href: '/limit', label: 'Limit' },
  { id: 'agents', href: '/agents', label: 'Agents' },
  { id: 'ledger', href: '/ledger', label: 'Ledger' },
];
