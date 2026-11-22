'use client';
import * as stylex from '@stylexjs/stylex';
import { AGENTS, TEAMS } from '@/lib/data';
import { pct, usd, usdc } from '@/lib/format';
import { jobsBy, spentBy } from '@/lib/model';
import { num } from '@/lib/format';
import { useStore } from '@/lib/store';
import { bp, colors, ease, SHORT } from '@/styles/tokens.stylex';
import { ArrowRight01Icon } from '@hugeicons/core-free-icons';
import { Icon } from './Icon';
import { Card } from './Page';
import { CardHead, Ticks } from './ui';

export function Ledger() {
  const { month, limitOf, opened, open, setRun } = useStore();
  return (
    <section aria-label="Ledger" {...stylex.props(s.wrap)}>
      {TEAMS.map((t) => {
        const agents = AGENTS.filter((a) => a.team === t.name);
        const spent = agents.reduce((x, a) => x + spentBy(a.id), 0);
        const cap = agents.reduce((x, a) => x + limitOf(a.id), 0);
        const lands = agents.reduce((x, a) => x + month.byAgent[a.id], 0);
        return (
          <Card key={t.name}>
            <div {...stylex.props(s.row, s.teamRow)}>
              <span {...stylex.props(s.owner)}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={t.photo} alt="" width={40} height={40} {...stylex.props(s.photo)} />
                <span><h2 {...stylex.props(s.teamName)}>{t.name}</h2><span {...stylex.props(s.sub)}>{t.you ? 'You answer for it' : `${t.owner} answers for it`}</span></span>
              </span>
              <span {...stylex.props(s.wideOnly)} />
              <span {...stylex.props(s.end)}><span {...stylex.props(s.col)}>Spent</span>{usd(spent)}</span><span {...stylex.props(s.end, s.muted, s.wideOnly)}><span {...stylex.props(s.col)}>Limit</span>{usd(cap)}</span><span {...stylex.props(s.end, s.wideOnly, lands > cap && s.bad)}><span {...stylex.props(s.col)}>On pace for</span>{usd(lands)}</span>
            </div>
            {agents.map((a) => {
              const on = opened === a.id, v = spentBy(a.id) / limitOf(a.id);
              return (
                <div key={a.id} id={`row-${a.id}`}>
                  <button type="button" aria-expanded={on} onClick={() => open(on ? null : a.id)} {...stylex.props(s.row, s.agentRow)}>
                    <span {...stylex.props(s.agent)}><span {...stylex.props(s.chev, on && s.chevOn)}><Icon icon={ArrowRight01Icon} size={18} /></span>{a.name}</span>
                    <span {...stylex.props(s.meter)}><Ticks value={v} count={20} height={18} label={`${pct(v)} of its limit`} /><span {...stylex.props(s.pct)}>{pct(v)}</span></span>
                    <span {...stylex.props(s.end)}>{usd(spentBy(a.id))}</span>
                    <span {...stylex.props(s.end, s.muted, s.wideOnly)}>{usd(limitOf(a.id))}</span>
                    <span {...stylex.props(s.end, s.wideOnly, month.byAgent[a.id] > limitOf(a.id) && s.bad)}>{usd(month.byAgent[a.id])}</span>
                  </button>
                  {on && (
                    <ul {...stylex.props(s.runs)}>
                      {a.runs.map(([time, what, cost], i) => (
                        <li key={what}><button type="button" onClick={() => setRun({ agent: a.id, index: i })} {...stylex.props(s.run)}><span {...stylex.props(s.runTime)}>{time}</span><span>{what}</span><span {...stylex.props(s.end)}>{cost >= 1000 ? usd(cost) : usdc(cost)}</span></button></li>
                      ))}
                      <li {...stylex.props(s.more)}>The latest 4 of {num(jobsBy(a) + (a.id === 'reading' ? 1 : 0))} runs this month</li>
                    </ul>
                  )}
                </div>
              );
            })}
          </Card>
        );
      })}
    </section>
  );
}

/** The Overview tile: each team against its limit. */
export function TeamsBrief() {
  const { month, limitOf } = useStore();
  const rows = TEAMS.map((t) => {
    const agents = AGENTS.filter((a) => a.team === t.name);
    const add = (f: (id: (typeof agents)[number]['id']) => number) => agents.reduce((x, a) => x + f(a.id), 0);
    return { ...t, spent: add(spentBy), cap: add(limitOf), lands: add((id) => month.byAgent[id]) };
  });
  const worst = [...rows].sort((a, b) => b.lands / b.cap - a.lands / a.cap)[0];
  return (
    <section aria-label="Spend by team" {...stylex.props(s.brief)}>
      <CardHead href="/ledger" title={worst.lands > worst.cap ? `${worst.name} is furthest over` : 'Every team is inside its limit'} sub={worst.lands > worst.cap ? `It lands ${pct(worst.lands / worst.cap - 1)} past its limit` : `${worst.name} is closest to its limit`} />
      <ul {...stylex.props(s.briefList)}>
        {rows.map((t) => (
          <li key={t.name} {...stylex.props(s.briefRow)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={t.photo} alt={t.you ? 'You' : t.owner} width={28} height={28} {...stylex.props(s.photo, s.small)} />
            <span>{t.name}</span>
            <Ticks value={t.spent / t.cap} count={16} height={16} label={`${pct(t.spent / t.cap)} of its limit`} />
            <span {...stylex.props(s.end, t.lands > t.cap && s.bad)}>{usd(t.spent)}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

const show = stylex.keyframes({ from: { opacity: 0, translate: '0 -4px' }, to: { opacity: 1, translate: '0 0' } });
const COLS = 'minmax(0, 1.3fr) minmax(0, 1.4fr) 76px 76px 86px';
const s = stylex.create({
  wrap: { display: 'flex', flexDirection: 'column', gap: { default: 16, [bp.phone]: 12 } },
  col: { display: 'block', fontSize: 14, color: colors.muted },
  muted: { color: colors.muted },
  end: { textAlign: 'end' },
  bad: { color: colors.hotDeep },
  row: { width: '100%', display: 'grid', gridTemplateColumns: { default: COLS, '@media (min-width: 768px) and (max-width: 999px)': 'minmax(0, 1fr) 160px 70px 70px 84px', [bp.phone]: 'minmax(0, 1fr) auto' }, gap: { default: 16, [bp.desk]: 28, [bp.phone]: 12 }, alignItems: 'center' },
  teamRow: { paddingBottom: 16 },
  owner: { display: 'flex', gap: 12, alignItems: 'center', minWidth: 0 },
  photo: { width: 40, height: 40, borderRadius: 999, objectFit: 'cover', flexShrink: 0 },
  teamName: { fontSize: 17, fontWeight: 500, lineHeight: '22px', letterSpacing: '-0.01em' },
  sub: { display: 'block', fontSize: 14, color: colors.muted },
  agentRow: { minHeight: 48, borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: colors.line, paddingBlock: { default: 0, [bp.phone]: 10 }, backgroundColor: { default: 'transparent', ':hover': { default: 'transparent', '@media (hover: hover)': 'rgba(23,23,26,0.025)' } } },
  agent: { display: 'flex', alignItems: 'center', gap: 12, paddingInlineStart: { default: 11, [bp.phone]: 0 } },
  chev: { display: 'block', color: colors.muted, transitionProperty: 'rotate', transitionDuration: '200ms' },
  chevOn: { rotate: '90deg' },
  meter: { display: 'flex', alignItems: 'center', gap: 14, gridColumn: { default: 'auto', [bp.phone]: '1 / -1' }, gridRow: { default: 'auto', [bp.phone]: 2 } },
  pct: { width: 44, textAlign: 'end', color: colors.muted, fontSize: 14, flexShrink: 0 },
  wideOnly: { display: { default: 'block', [bp.phone]: 'none' } },
  runs: { paddingInlineStart: { default: 37, [bp.phone]: 0 }, paddingBottom: 12, animationName: show, animationDuration: '260ms', animationTimingFunction: ease.out },
  run: { width: '100%', display: 'grid', gridTemplateColumns: { default: '130px 1fr auto', [bp.phone]: '1fr auto' }, gap: 12, minHeight: { default: 38, [bp.phone]: 48 }, alignItems: 'center', color: { default: colors.muted, ':hover': colors.ink } },
  runTime: { gridColumn: { default: 'auto', [bp.phone]: '1 / -1' }, fontSize: { default: 15, [bp.phone]: 13 }, marginBottom: { default: 0, [bp.phone]: -12 } },
  small: { width: 28, height: 28 },
  brief: { display: 'flex', flexDirection: 'column', gap: 12, height: '100%' },
  briefList: { display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 },
  briefRow: { display: 'grid', gridTemplateColumns: '28px minmax(0, 96px) minmax(0, 1fr) 62px', alignItems: 'center', gap: 12, minHeight: { default: 36, [SHORT.q]: 30, [bp.phone]: 44 } },
  more: { fontSize: 14, color: colors.muted, paddingTop: 6 },
});
