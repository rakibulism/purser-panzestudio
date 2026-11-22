'use client';
import { useId } from 'react';
import * as stylex from '@stylexjs/stylex';
import { AGENTS } from '@/lib/data';
import { arc, at, wedge } from '@/lib/geometry';
import { pct, usd } from '@/lib/format';
import { useEased } from '@/lib/hooks';
import { SPENT, spentBy } from '@/lib/model';
import { useStore } from '@/lib/store';
import { HEX } from '@/styles/brand';
import { colors } from '@/styles/tokens.stylex';

const R0 = 108, R1 = 258, ROUND = 13, GAP = 3, BOX = 326;
const TRACK = '#E6E6E4';
const STEP = (Math.PI * 2) / AGENTS.length;
const radius = (v: number) => R0 + v * (R1 - R0);

/** Each wedge is an agent. The gray track is its limit, the fill is its spend, the dotted arc is where it lands. */
export function Wheel() {
  const { month, limitOf, selected, select } = useStore();
  const uid = useId().replace(/:/g, '');
  const eased = useEased(AGENTS.flatMap((a) => [spentBy(a.id) / limitOf(a.id), month.byAgent[a.id] / limitOf(a.id)]));
  const sel = AGENTS.find((a) => a.id === selected) ?? null;

  return (
    <svg viewBox={`${-BOX} ${-BOX} ${BOX * 2} ${BOX * 2}`} {...stylex.props(s.svg)} role="group" aria-label="Spend against limit for each agent">
      <defs>
        <radialGradient id={`${uid}f`} gradientUnits="userSpaceOnUse" cx="0" cy="0" r={R1}>
          <stop offset="0.38" stopColor={HEX.hot} /><stop offset="0.52" stopColor="#FF7F63" /><stop offset="0.74" stopColor="#F9BDB0" /><stop offset="0.94" stopColor="#F6DDD8" />
        </radialGradient>
        <radialGradient id={`${uid}o`} gradientUnits="userSpaceOnUse" cx="0" cy="0" r={R1 + 20}>
          <stop offset="0.4" stopColor={HEX.hot} /><stop offset="1" stopColor="#FF6238" />
        </radialGradient>
      </defs>
      {AGENTS.map((a, i) => {
        const a0 = i * STEP, a1 = a0 + STEP, mid = a0 + STEP / 2;
        const spent = eased[i * 2], lands = eased[i * 2 + 1];
        const over = spent > 1;
        const fill = `url(#${uid}${over ? 'o' : 'f'})`;
        const [lx, ly] = at(194, mid);
        const r = radius(lands);
        const [tx, ty] = at(r, a1 - 0.07);
        const dim = sel !== null && sel.id !== a.id;
        const lines = a.lines.filter(Boolean);
        return (
          <g key={a.id} role="button" tabIndex={0} aria-pressed={selected === a.id}
            aria-label={`${a.name}: ${usd(spentBy(a.id))} of ${usd(limitOf(a.id))}, on pace for ${usd(month.byAgent[a.id])}`}
            onClick={() => select(selected === a.id ? null : a.id)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(selected === a.id ? null : a.id); } if (e.key === 'Escape') select(null); }}
            {...stylex.props(s.slice, dim && s.dim)}>
            <path d={wedge(a0, a1, R0, R1, ROUND, GAP)} fill={TRACK} stroke={TRACK} strokeWidth={ROUND * 2} strokeLinejoin="round" />
            <path d={wedge(a0, a1, R0, radius(spent), ROUND, GAP)} fill={fill} stroke={fill} strokeWidth={ROUND * 2} strokeLinejoin="round" />
            <path d={arc(r, a0 + 0.05, a1 - 0.07)} fill="none" stroke={lands > 1 ? HEX.hot : '#8B8B88'} strokeWidth={2} strokeDasharray="0.1 6" strokeLinecap="round" />
            <path d="M-5 -5.5L5 0L-5 5.5Z" transform={`translate(${tx} ${ty}) rotate(${(a1 * 180) / Math.PI - 4})`} fill={lands > 1 ? HEX.hot : '#8B8B88'} />
            <text x={lx} y={ly - (lines.length > 1 ? 15 : 4)} textAnchor="middle" {...stylex.props(s.value)}>{pct(spent)}</text>
            {lines.map((l, k) => <text key={l} x={lx} y={ly + (lines.length > 1 ? 8 : 20) + k * 21} textAnchor="middle" {...stylex.props(s.name)}>{l}</text>)}
          </g>
        );
      })}
      <circle r={96} fill={HEX.paper} />
      <circle r={84} fill={HEX.hot} />
      <text y={-20} textAnchor="middle" {...stylex.props(s.hubLabel)}>{sel ? sel.lines.filter(Boolean)[0] : 'Spent'}</text>
      <text y={17} textAnchor="middle" {...stylex.props(s.hub)}>{usd(sel ? spentBy(sel.id) : SPENT)}</text>
      <text y={46} textAnchor="middle" {...stylex.props(s.hubLabel)}>{sel ? `of ${usd(limitOf(sel.id))}` : 'through Sunday'}</text>
    </svg>
  );
}

const s = stylex.create({
  svg: { width: '100%', height: '100%', maxHeight: '100%', minHeight: 0, overflow: 'visible', userSelect: 'none' },
  slice: { cursor: 'pointer', transitionProperty: 'opacity', transitionDuration: '220ms', outline: 'none', opacity: { default: 1, ':focus-visible': 1 }, strokeOpacity: 1 },
  dim: { opacity: { default: 0.42, ':hover': { default: 0.42, '@media (hover: hover)': 0.7 } } },
  value: { fontSize: 30, fontWeight: 300, fill: colors.ink, letterSpacing: '-0.02em' },
  name: { fontSize: 21, fontWeight: 400, fill: colors.ink },
  hub: { fontSize: 33, fontWeight: 300, fill: colors.ink, letterSpacing: '-0.03em' },
  hubLabel: { fontSize: 18, fill: colors.ink },
});
