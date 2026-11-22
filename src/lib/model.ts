import { AGENTS, LAST, LOOP, MONTH_DAYS, TODAY, agentById, type Agent, type AgentId } from './data';

/** Weekends run at 40%, Thanksgiving and the Friday after are quieter. */
const weight = (d: number) => {
  const wd = (d - 1) % 7;
  if (wd === 0 || wd === 6) return 0.4;
  if (d === 26) return 0.4;
  if (d === 27) return 0.7;
  return 1;
};
const wobble = (a: number, d: number) => (d > LAST ? 1 : 1 + 0.11 * Math.sin(d * 1.7 + a * 2.3));

const DAILY: Record<AgentId, number[]> = Object.fromEntries(
  AGENTS.map((a, i) => [a.id, Array.from({ length: MONTH_DAYS }, (_, k) => Math.round(a.rate * weight(k + 1) * wobble(i, k + 1)) + (a.id === 'reading' && k + 1 === LOOP.day ? LOOP.cost : 0))]),
) as Record<AgentId, number[]>;

const sum = (xs: number[]) => xs.reduce((t, x) => t + x, 0);
export const spentBy = (id: AgentId) => sum(DAILY[id].slice(0, LAST));
export const jobsBy = (a: Agent) => Math.round((spentBy(a.id) - (a.id === 'reading' ? LOOP.cost : 0)) / a.unit);
/** True cost of a finished job so far this month, waste included. */
export const costPerJob = (a: Agent) => spentBy(a.id) / jobsBy(a);
export const ratio = (a: Agent) => costPerJob(a) / a.before;
export const SPENT = sum(AGENTS.map((a) => spentBy(a.id)));

/** Agents that cost more than they save stop first. */
export const STOP_ORDER = [...AGENTS].sort((a, b) => ratio(b) - ratio(a)).map((a) => a.id);

export type Stop = { agent: Agent; from: number; saved: number; undone: number };
export type Forecast = { days: number[]; landing: number; runsOut: number | null; byAgent: Record<AgentId, number>; stops: Stop[] };

const build = (stopFrom: Partial<Record<AgentId, number>>, limit: number, stops: Stop[]): Forecast => {
  let total = 0;
  let runsOut: number | null = null;
  const byAgent = Object.fromEntries(AGENTS.map((a) => [a.id, 0])) as Record<AgentId, number>;
  const days = Array.from({ length: MONTH_DAYS }, (_, k) => {
    for (const a of AGENTS) {
      const stop = stopFrom[a.id];
      const v = stop && k + 1 >= stop ? 0 : DAILY[a.id][k];
      byAgent[a.id] += v;
      total += v;
    }
    if (runsOut === null && total > limit) runsOut = k + 1;
    return total;
  });
  return { days, landing: total, runsOut, byAgent, stops };
};

/** Agents already switched off, and the first day each one is off. */
export type Off = Partial<Record<AgentId, number>>;

/** The first day an agent would pass `cap`, or null if it never does. */
export const dayPast = (id: AgentId, cap: number) => {
  let t = 0;
  for (let d = 1; d <= MONTH_DAYS; d += 1) { t += DAILY[id][d - 1]; if (t > cap) return Math.max(d, TODAY); }
  return null;
};

/** What happens if nobody steps in. */
export const forecast = (limit: number, off: Off = {}) => build(off, limit, []);

/** The shortest set of stops that keeps the month under `limit`. Whole days, from the end of the month back. */
export const planFor = (limit: number, off: Off = {}): Forecast => {
  const stopFrom: Off = { ...off };
  const stops: Stop[] = [];
  let need = forecast(limit, off).landing - limit;
  for (const id of STOP_ORDER) {
    if (need <= 0) break;
    const end = off[id] ?? MONTH_DAYS + 1;
    let saved = 0;
    let from = end;
    while (from > TODAY && saved < need) {
      from -= 1;
      saved += DAILY[id][from - 1];
    }
    if (saved === 0) continue;
    stopFrom[id] = from;
    stops.push({ agent: agentById(id), from, saved, undone: Math.round(saved / agentById(id).unit) });
    need -= saved;
  }
  return build(stopFrom, limit, stops);
};
