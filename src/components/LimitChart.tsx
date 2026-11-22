'use client';
import { useId, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import * as stylex from '@stylexjs/stylex';
import { LAST, MONTH_DAYS, TODAY } from '@/lib/data';
import { cap, num, onDay, usd, weekday, whoStops } from '@/lib/format';
import { useEased, useSize } from '@/lib/hooks';
import { SPENT, forecast, planFor } from '@/lib/model';
import { useStore } from '@/lib/store';
import { HEX } from '@/styles/brand';
import { bp, colors } from '@/styles/tokens.stylex';
import { Button, TileTitle } from './ui';

const STEP = 500, MIN = Math.ceil((SPENT + 2000) / STEP) * STEP, MAX = 230_000;
const clamp = (v: number) => Math.max(MIN, Math.min(MAX, Math.round(v / STEP) * STEP));

/** `brief` is the Overview tile: it fills whatever height it is given and keeps the drag. */
export function LimitChart({ brief = false }: { brief?: boolean }) {
  const { limit, planned, off, commitLimit } = useStore();
  const [draft, setDraft] = useState<number | null>(null);
  const value = draft ?? limit;
  const [ref, w, boxH] = useSize<HTMLDivElement>(brief ? 420 : 760, brief ? 260 : 500);
  const svg = useRef<SVGSVGElement>(null);
  const grab = useRef<{ id: number; off: number } | null>(null);
  const [hover, setHover] = useState<number | null>(null);
  const uid = useId().replace(/:/g, '');

  const free = useMemo(() => forecast(value, off), [value, off]);
  const plan = useMemo(() => planFor(value, off), [value, off]);
  const bars = useEased(plan.days, 260);
  const narrow = w < (brief ? 320 : 560);
  const H = brief ? Math.max(170, boxH) : narrow ? 300 : Math.max(420, boxH), padT = brief ? 4 : 12, padB = 28, padR = narrow ? 0 : brief ? 44 : 52;
  const TOP = brief ? 232_000 : 240_000;
  const plotW = w - padR, slot = plotW / MONTH_DAYS, bw = Math.max(3, slot * (narrow ? 0.66 : 0.7));
  const y = (v: number) => padT + (1 - v / TOP) * (H - padT - padB);
  const ly = y(value);
  const hx = (LAST - 1) * slot + slot / 2;

  const toValue = (clientY: number) => {
    const r = svg.current!.getBoundingClientRect();
    return (1 - (clientY - r.top - padT) / (H - padT - padB)) * TOP;
  };
  const down = (e: PointerEvent<SVGElement>) => {
    grab.current = { id: e.pointerId, off: value - toValue(e.clientY) };
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* pointer already gone */ }
    setHover(null);
  };
  const move = (e: PointerEvent<SVGElement>) => { if (grab.current?.id === e.pointerId) setDraft(clamp(toValue(e.clientY) + grab.current.off)); };
  const up = () => { grab.current = null; };
  const keys = (e: KeyboardEvent) => {
    const by = { ArrowUp: STEP, ArrowRight: STEP, ArrowDown: -STEP, ArrowLeft: -STEP, PageUp: STEP * 10, PageDown: -STEP * 10 }[e.key];
    if (by) { e.preventDefault(); setDraft(clamp(value + by)); }
    if (e.key === 'Home') { e.preventDefault(); setDraft(MIN); }
    if (e.key === 'End') { e.preventDefault(); setDraft(MAX); }
    if (e.key === 'Escape') setDraft(null);
  };

  const settled = planned && value === limit;
  const names = whoStops(plan.stops.map((x) => x.agent.name));
  const tip = hover !== null ? { day: hover + 1, total: plan.days[hover], today: plan.days[hover] - (plan.days[hover - 1] ?? 0) } : null;
  const tipX = hover !== null ? Math.min(Math.max(hover * slot + slot / 2, 80), plotW - 80) : 0;

  const plot = (
        <div ref={ref} {...stylex.props(s.plot, brief ? s.plotBrief : !narrow && s.plotFull)}>
          <svg ref={svg} width={w} height={H} role="group" aria-label="Spend by day in November, with the limit" {...stylex.props(s.svg, (brief || !narrow) && s.svgBrief)}
            onPointerMove={(e) => { if (grab.current) return; const r = e.currentTarget.getBoundingClientRect(); const i = Math.floor((e.clientX - r.left) / slot); setHover(i >= 0 && i < MONTH_DAYS ? i : null); }}
            onPointerLeave={() => setHover(null)}>
            <defs><linearGradient id={`${uid}g`} x1="0" y1="0" x2="0" y2="1"><stop stopColor={HEX.rose} /><stop offset="1" stopColor={HEX.hot} /></linearGradient></defs>
            {!narrow && [0, 50_000, 100_000, 150_000, 200_000].map((v) => <text key={v} x={w} y={y(v) + 4} textAnchor="end" {...stylex.props(s.axis)}>{v ? `$${v / 1000}k` : '$0'}</text>)}
            {bars.map((v, i) => {
              const x = i * slot + (slot - bw) / 2;
              const last = i === LAST - 1;
              const base = H - padB;
              const ghost = free.days[i] - plan.days[i] > 1;
              return (
                <g key={i} opacity={hover !== null && hover !== i && !last ? 0.6 : 1}>
                  {ghost && <rect x={x + 0.5} y={y(free.days[i])} width={bw - 1} height={Math.max(0, y(v) - y(free.days[i]) - 2)} rx={3} fill="none" stroke={HEX.hot} strokeWidth={1.2} strokeDasharray="1.5 3" />}
                  <rect x={x} y={y(v)} width={bw} height={base - y(v)} rx={Math.min(4, bw / 3)} fill={last ? `url(#${uid}g)` : i < LAST ? colors.bar : colors.barSoft} />
                </g>
              );
            })}
            {[1, 8, 15, TODAY - 1, MONTH_DAYS].map((d) => <text key={d} x={(d - 1) * slot + slot / 2} y={H - 8} textAnchor={d === 1 ? 'start' : d === 30 ? 'end' : 'middle'} dx={d === 1 ? -bw / 2 : d === 30 ? bw / 2 : 0} {...stylex.props(s.axis)}>{d === 1 ? 'Nov 1' : d}</text>)}
            <line x1={0} x2={plotW} y1={ly} y2={ly} stroke={colors.ink} strokeWidth={1.5} strokeDasharray="6 5" pointerEvents="none" />
            <text x={0} y={ly - 10} {...stylex.props(s.limitText)}>Limit {usd(value)}</text>
            <g role="slider" tabIndex={0} aria-label="Monthly limit" aria-orientation="vertical" aria-valuemin={MIN} aria-valuemax={MAX} aria-valuenow={value} aria-valuetext={`${usd(value)}, ${plan.stops.length ? `${names} would stop` : 'nobody stops'}`}
              onKeyDown={keys} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} {...stylex.props(s.handle)}>
              <rect x={0} y={ly - 14} width={plotW} height={28} fill="transparent" />
              <circle cx={hx} cy={ly} r={24} fill="transparent" />
              <circle cx={hx} cy={ly} r={11} fill="#fff" stroke={colors.ink} strokeWidth={1.5} {...stylex.props(s.knob)} />
              <path d={`M${hx - 3.5} ${ly - 2}L${hx} ${ly - 5.5}L${hx + 3.5} ${ly - 2}M${hx - 3.5} ${ly + 2}L${hx} ${ly + 5.5}L${hx + 3.5} ${ly + 2}`} fill="none" stroke={colors.ink} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
            </g>
          </svg>
          {tip && (
            <div {...stylex.props(s.tip)} style={{ left: tipX }}>
              <span>{weekday(tip.day)} {tip.day}</span><span>{usd(tip.today)} that day</span><span {...stylex.props(s.muted)}>{usd(tip.total)} {tip.day > LAST ? 'expected' : 'so far'}</span>
            </div>
          )}
        </div>
  );
  const set = () => { commitLimit(value, plan.stops.length ? `Limit set to ${usd(value)}. ${cap(names)} will stop.` : `Limit set to ${usd(value)}. Nobody stops.`); setDraft(null); };
  const action = settled
    ? <p {...stylex.props(s.muted)}>This is in force.</p>
    : <Button onClick={set}>{value === limit ? (brief ? `Stop ${plan.stops.length === 1 ? 'it' : 'them'}` : `Keep ${usd(value)} and stop them`) : brief ? `Set ${usd(value)}` : `Set the limit to ${usd(value)}`}</Button>;

  if (brief) {
    return (
      <section aria-label="Limit" {...stylex.props(s.brief)}>
        <TileTitle href="/limit">Drag the limit. <span {...stylex.props(s.muted)}>See who stops.</span></TileTitle>
        {plot}
        <div aria-live="polite" {...stylex.props(s.briefFoot)}>
          <p {...stylex.props(s.briefText)}><span {...stylex.props(s.briefBig)}>{usd(plan.landing)}</span>{plan.stops.length ? `if ${names} ${plan.stops.length > 1 ? 'stop' : 'stops'}, ${plan.stops[0].agent.name} first` : `and nobody stops, ${usd(value - plan.landing)} left`}</p>
          {action}
        </div>
      </section>
    );
  }

  return (
    <section aria-label="Limit" {...stylex.props(s.wrap)}>
      <div {...stylex.props(s.grid)}>
{plot}
        <div aria-live="polite" {...stylex.props(s.side)}>
          <div>
            <p {...stylex.props(s.big)}>{usd(plan.landing)}</p>
            <p {...stylex.props(s.lead)}>{plan.stops.length ? `if ${names} ${plan.stops.length > 1 ? 'stop' : 'stops'}` : 'and nobody stops'}</p>
          </div>
          {plan.stops.length > 0 ? (
            <ul {...stylex.props(s.stops)}>
              {plan.stops.map((x) => (
                <li key={x.agent.id} {...stylex.props(s.stop)}>
                  <span>{x.agent.name}</span><span {...stylex.props(s.when)}>{x.from === TODAY ? 'today' : `${weekday(x.from)} ${x.from}`}</span>
                  <span {...stylex.props(s.undone)}>{num(x.undone)} {x.undone === 1 ? x.agent.job : x.agent.jobs} left undone</span>
                </li>
              ))}
            </ul>
          ) : <p {...stylex.props(s.muted)}>{usd(value - plan.landing)} would be left on the 30th.</p>}
          <div {...stylex.props(s.actions)}>
            {action}
            {draft !== null && draft !== limit && <Button kind="line" onClick={() => setDraft(null)}>Back to {usd(limit)}</Button>}
          </div>
          {!planned && value === limit && free.runsOut && <p {...stylex.props(s.small)}>Leave it, and all eight stop on {onDay(free.runsOut)}. Agents that cost more than they save stop first.</p>}
        </div>
      </div>
    </section>
  );
}

const s = stylex.create({
  wrap: { display: 'flex', flexDirection: 'column', gap: 24, height: '100%' },
  title: { fontSize: { default: 26, [bp.phone]: 24 }, fontWeight: 300, letterSpacing: '-0.02em', lineHeight: 1.15 },
  muted: { color: colors.muted },
  grid: { display: 'grid', gridTemplateColumns: { default: '1fr', '@media (min-width: 1000px)': 'minmax(0, 1fr) 268px' }, gap: { default: 28, [bp.desk]: 36 } },
  plot: { position: 'relative', minWidth: 0 },
  plotBrief: { flex: 1, minHeight: { default: 170, [bp.phone]: 240 } },
  plotFull: { minHeight: 'max(420px, calc(100svh - 290px))' },
  svgBrief: { position: 'absolute', inset: 0 },
  brief: { display: 'flex', flexDirection: 'column', gap: 14, height: '100%' },
  briefFoot: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16 },
  briefText: { minWidth: 0, textWrap: 'pretty', color: colors.muted, minHeight: { default: 76, '@media (min-width: 1200px) and (max-height: 879px)': 0 } },
  briefBig: { display: 'block', fontSize: 30, fontWeight: 300, letterSpacing: '-0.03em', lineHeight: 1.1, color: colors.ink },
  svg: { overflow: 'visible', touchAction: 'pan-y', userSelect: 'none' },
  axis: { fontSize: 13, fill: colors.muted },
  limitText: { fontSize: 14, fill: colors.ink, paintOrder: 'stroke', stroke: '#FFFFFF', strokeWidth: 5, strokeLinejoin: 'round' },
  handle: { cursor: { default: 'ns-resize' }, touchAction: 'none' },
  knob: { transitionProperty: 'r', transitionDuration: '160ms', r: { default: 11, ':hover': 13 } },
  tip: { position: 'absolute', bottom: 44, translate: '-50% 0', pointerEvents: 'none', display: 'flex', flexDirection: 'column', backgroundColor: '#FFFFFF', borderWidth: 1, borderStyle: 'solid', borderColor: colors.line, borderRadius: 10, paddingInline: 12, paddingBlock: 8, fontSize: 13, whiteSpace: 'nowrap' },
  side: { display: 'flex', flexDirection: 'column', gap: 18 },
  big: { fontSize: 44, fontWeight: 300, letterSpacing: '-0.04em', lineHeight: 1 },
  lead: { marginTop: 8, textWrap: 'pretty' },
  stops: { borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: colors.line },
  stop: { display: 'grid', gridTemplateColumns: '1fr auto', columnGap: 12, paddingBlock: 9, borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: colors.line },
  when: { color: colors.hotDeep },
  undone: { gridColumn: '1 / -1', fontSize: 14, color: colors.muted },
  actions: { display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 'auto' },
  small: { fontSize: 14, color: colors.muted, textWrap: 'pretty' },
});
