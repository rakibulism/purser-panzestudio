'use client';
import { useId } from 'react';
import * as stylex from '@stylexjs/stylex';
import { AGENTS, type AgentId } from '@/lib/data';
import { at, polygon } from '@/lib/geometry';
import { usdc } from '@/lib/format';
import { costPerJob, jobsBy, ratio } from '@/lib/model';
import { num } from '@/lib/format';
import { useStore } from '@/lib/store';
import { HEX } from '@/styles/brand';
import { bp, colors } from '@/styles/tokens.stylex';
import { Card, Columns } from './Page';
import { CardHead } from './ui';

const U = 140, N = AGENTS.length, HALF = Math.PI / N;
const sorted = [...AGENTS].sort((a, b) => ratio(b) - ratio(a));

/** The gray octagon is what each job cost before. A point outside it costs more than the old way. */
function Radar({ brief = false }: { brief?: boolean }) {
  const { selected } = useStore();
  const uid = useId().replace(/:/g, '');
  const shape = polygon(AGENTS.map((a) => ratio(a) * U));
  return (
        <svg viewBox={brief ? "-262 -256 524 524" : "-330 -300 660 600"} {...stylex.props(brief ? s.svgBrief : s.svg)} role="img" aria-label="Cost per finished job compared with before, for each agent. The list beside this chart has the values.">
          <defs>{[0.25, 0.5, 0.75].map((k) => <clipPath key={k} id={`${uid}${k * 100}`}><path d={polygon(Array(N).fill(U * k))} /></clipPath>)}</defs>
          <g transform={`rotate(${(HALF * 180) / Math.PI})`}>
            <path d={polygon(Array(N).fill(U))} fill="#D6D6D4" />
            {[0.75, 0.5, 0.25].map((k) => <path key={k} d={polygon(Array(N).fill(U * k))} fill="#CDCDCB" opacity={0.7} />)}
            <path d={shape} fill={HEX.hot} opacity={0.42} />
            {[0.75, 0.5, 0.25].map((k) => <path key={k} d={shape} fill={HEX.hot} opacity={0.16} clipPath={`url(#${uid}${k * 100})`} />)}
            {AGENTS.map((a, i) => {
              const t = (i / N) * Math.PI * 2;
              const [x, y] = at(U * 1.86, t);
              return <g key={a.id}><line x1={0} y1={0} x2={x} y2={y} stroke="#6E6E6B" strokeWidth={brief ? 2.4 : 1.3} strokeDasharray="0.1 5" strokeLinecap="round" /><path d="M-4.5 4L0 -7L4.5 4L0 1.6Z" transform={`translate(${x} ${y}) rotate(${(t * 180) / Math.PI})`} fill="#6E6E6B" /></g>;
            })}
            {AGENTS.map((a, i) => { const [x, y] = at(ratio(a) * U, (i / N) * Math.PI * 2); return <circle key={a.id} cx={x} cy={y} r={(selected === a.id ? 9 : 5.5) * (brief ? 1.7 : 1)} fill={ratio(a) > 1 ? HEX.hot : '#fff'} stroke={HEX.hot} strokeWidth={1.5} />; })}
          </g>
          {!brief && AGENTS.map((a, i) => {
            const t = ((i + 0.5) / N) * Math.PI * 2;
            const [x, y] = at(U * 1.86 + 20, t);
            const anchor = Math.sin(t) > 0.5 ? 'start' : Math.sin(t) < -0.5 ? 'end' : Math.sin(t) > 0 ? 'start' : 'end';
            const lines = a.lines.filter(Boolean);
            const up = Math.cos(t) > 0.8 ? -10 : Math.cos(t) < -0.8 ? 12 : 4;
            return lines.map((l, k) => <text key={l} x={Math.round(Math.max(-326, Math.min(326, x + (Math.abs(Math.sin(t)) > 0.8 ? (Math.sin(t) > 0 ? -18 : 18) : Math.sin(t) > 0 ? -30 : 30))))} y={Math.round(y + up + (k - (lines.length - 1) / 2) * 20 + (Math.abs(Math.sin(t)) > 0.8 ? (Math.cos(t) > 0 ? -22 : 26) : 0))} textAnchor={Math.abs(Math.sin(t)) > 0.8 ? (Math.sin(t) > 0 ? 'middle' : 'middle') : anchor} {...stylex.props(s.axis, selected === a.id && s.axisOn)}>{l}</text>);
          })}
        </svg>
  );
}

export function Worth() {
  const { selected, select } = useStore();
  const pick = (id: AgentId) => select(selected === id ? null : id);
  return (
    <Columns>
      <Card><section aria-label="Cost per job" {...stylex.props(s.wrap)}><CardHead title="Cost beside the old way" sub="The gray shape is the old cost. A point outside it costs more now" /><Radar /></section></Card>
      <Card><section aria-label="Every agent" {...stylex.props(s.wrap)}><CardHead title="Every agent, by finished job" sub="This month with waste included, beside last year" />
          <ul>
            {sorted.map((a) => {
              const r = ratio(a), loses = r > 1;
              return (
                <li key={a.id}>
                  <button type="button" aria-pressed={selected === a.id} onClick={() => pick(a.id)} {...stylex.props(s.row, selected !== null && selected !== a.id && s.dim)}>
                    <span {...stylex.props(s.name)}>{a.name}<span {...stylex.props(s.jobs)}>{num(jobsBy(a))} {a.jobs}</span></span>
                    <span {...stylex.props(s.cost)}>{usdc(costPerJob(a))}<span {...stylex.props(s.was)}>was {usdc(a.before)}</span></span>
                    <span {...stylex.props(s.delta, loses && s.bad)}>{loses ? `${Math.round((r - 1) * 100)}% more` : `${Math.round((1 - r) * 100)}% less`}</span>
                  </button>
                </li>
              );
            })}
          </ul>
      </section></Card>
    </Columns>
  );
}

/** The Overview tile: the two that lose, and the two that win by most. */
export function WorthBrief() {
  const { selected, select } = useStore();
  const rows = [...sorted.slice(0, 2), ...sorted.slice(-2).reverse()];
  return (
    <section aria-label="Cost per job" {...stylex.props(s.brief)}>
      <CardHead href="/agents" title="Two agents cost more than before" sub="Cost of one finished job, beside last year" />
      <div {...stylex.props(s.briefBody)}>
        <Radar brief />
        <ul {...stylex.props(s.briefList)}>
          {rows.map((a) => {
            const r = ratio(a), loses = r > 1;
            return <li key={a.id}><button type="button" aria-pressed={selected === a.id} onClick={() => select(selected === a.id ? null : a.id)} {...stylex.props(s.briefRow, selected !== null && selected !== a.id && s.dim)}><span>{a.name}</span><span {...stylex.props(s.delta, loses && s.bad)}>{loses ? `${Math.round((r - 1) * 100)}% more` : `${Math.round((1 - r) * 100)}% less`}</span></button></li>;
          })}
        </ul>
      </div>
    </section>
  );
}

const s = stylex.create({
  wrap: { display: 'flex', flexDirection: 'column', gap: 16, height: '100%' },
  svg: { width: '100%', maxWidth: 600, margin: 'auto', overflow: 'visible' },
  axis: { fontSize: { default: 15, [bp.phone]: 22 }, fill: colors.muted },
  axisOn: { fill: colors.ink },
  row: { width: '100%', display: 'grid', gridTemplateColumns: { default: '1fr 132px 88px', [bp.phone]: '1fr auto 78px' }, gap: 12, alignItems: 'center', paddingBlock: 10, borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: colors.line, transitionProperty: 'opacity', transitionDuration: '200ms', minHeight: 44 },
  dim: { opacity: { default: 0.45, ':hover': 1 } },
  name: { display: 'flex', flexDirection: 'column' },
  jobs: { fontSize: 14, color: colors.muted },
  cost: { display: 'flex', flexDirection: 'column', textAlign: 'end' },
  was: { fontSize: 14, color: colors.muted },
  delta: { textAlign: 'end', color: colors.muted, whiteSpace: 'nowrap' },
  bad: { color: colors.hotDeep },
  svgBrief: { height: '100%', width: 'auto', maxWidth: { default: '32%', '@media (min-width: 1200px) and (max-width: 1339px)': '24%' }, minHeight: 0, flexShrink: 0, overflow: 'visible' },
  brief: { display: 'flex', flexDirection: 'column', gap: 12, height: '100%', minHeight: 0 },
  briefBody: { display: 'flex', alignItems: 'center', gap: { default: 14, '@media (min-width: 1200px) and (max-width: 1339px)': 10 }, flex: 1, minHeight: { default: 0, [bp.phone]: 170 }, height: { default: 0, [bp.phone]: 170 } },
  briefList: { flex: 1, minWidth: 0, fontSize: { default: 14, '@media (min-width: 1200px) and (max-width: 1339px)': 13 } },
  briefRow: { width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, minHeight: { default: 36, '@media (min-width: 1200px) and (max-height: 879px)': 30, [bp.phone]: 44 }, borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: colors.line, transitionProperty: 'opacity', transitionDuration: '200ms' },
});
