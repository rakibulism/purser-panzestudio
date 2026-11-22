'use client';
import * as stylex from '@stylexjs/stylex';
import { AGENTS, TEAMS } from '@/lib/data';
import { pct, usd, usdc } from '@/lib/format';
import { SPENT, jobsBy, spentBy } from '@/lib/model';
import { num } from '@/lib/format';
import { useStore } from '@/lib/store';
import { bp, colors, ease } from '@/styles/tokens.stylex';
import { Ticks } from './ui';

export function Ledger() {
  const { month, limitOf, opened, open, setRun } = useStore();
  return (
    <section id="ledger" aria-labelledby="ledger-title" {...stylex.props(s.wrap)}>
      <h2 id="ledger-title" {...stylex.props(s.title)}>Who spent the {usd(SPENT)}. <span {...stylex.props(s.muted)}>Open an agent to see single runs.</span></h2>
      <div {...stylex.props(s.heads)} aria-hidden="true"><span /><span>Share of limit</span><span {...stylex.props(s.end)}>Spent</span><span {...stylex.props(s.end)}>Limit</span><span {...stylex.props(s.end)}>On pace for</span></div>
      {TEAMS.map((t) => {
        const agents = AGENTS.filter((a) => a.team === t.name);
        const spent = agents.reduce((x, a) => x + spentBy(a.id), 0);
        const cap = agents.reduce((x, a) => x + limitOf(a.id), 0);
        const lands = agents.reduce((x, a) => x + month.byAgent[a.id], 0);
        return (
          <div key={t.name} {...stylex.props(s.team)}>
            <div {...stylex.props(s.row, s.teamRow)}>
              <span {...stylex.props(s.owner)}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={t.photo} alt="" width={40} height={40} {...stylex.props(s.photo)} />
                <span><span {...stylex.props(s.teamName)}>{t.name}</span><span {...stylex.props(s.sub)}>{t.owner} answers for it</span></span>
              </span>
              <span {...stylex.props(s.wideOnly)} />
              <span {...stylex.props(s.end)}>{usd(spent)}</span><span {...stylex.props(s.end, s.muted, s.wideOnly)}>{usd(cap)}</span><span {...stylex.props(s.end, s.wideOnly, lands > cap && s.bad)}>{usd(lands)}</span>
            </div>
            {agents.map((a) => {
              const on = opened === a.id, v = spentBy(a.id) / limitOf(a.id);
              return (
                <div key={a.id} id={`row-${a.id}`}>
                  <button type="button" aria-expanded={on} onClick={() => open(on ? null : a.id)} {...stylex.props(s.row, s.agentRow)}>
                    <span {...stylex.props(s.agent)}><svg width="10" height="10" viewBox="0 0 10 10" {...stylex.props(s.chev, on && s.chevOn)} aria-hidden="true"><path d="M3 1l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>{a.name}</span>
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
          </div>
        );
      })}
    </section>
  );
}

const show = stylex.keyframes({ from: { opacity: 0, translate: '0 -4px' }, to: { opacity: 1, translate: '0 0' } });
const COLS = 'minmax(0, 1.3fr) minmax(0, 1.4fr) 76px 76px 86px';
const s = stylex.create({
  wrap: { display: 'flex', flexDirection: 'column' },
  title: { fontSize: { default: 26, [bp.phone]: 24 }, fontWeight: 300, letterSpacing: '-0.02em', lineHeight: 1.15, marginBottom: 20, textWrap: 'pretty' },
  muted: { color: colors.muted },
  heads: { display: { default: 'grid', [bp.phone]: 'none' }, gridTemplateColumns: COLS, gap: { default: 16, [bp.desk]: 28 }, fontSize: 14, color: colors.muted, paddingBottom: 10 },
  end: { textAlign: 'end' },
  bad: { color: colors.hotDeep },
  team: { borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: colors.ink, paddingBottom: 16 },
  row: { width: '100%', display: 'grid', gridTemplateColumns: { default: COLS, [bp.phone]: 'minmax(0, 1fr) auto' }, gap: { default: 16, [bp.desk]: 28, [bp.phone]: 12 }, alignItems: 'center' },
  teamRow: { paddingBlock: 16 },
  owner: { display: 'flex', gap: 12, alignItems: 'center', minWidth: 0 },
  photo: { width: 40, height: 40, borderRadius: 999, objectFit: 'cover', flexShrink: 0 },
  teamName: { display: 'block', fontSize: 17 },
  sub: { display: 'block', fontSize: 14, color: colors.muted },
  agentRow: { minHeight: 48, borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: colors.line, paddingBlock: { default: 0, [bp.phone]: 10 }, backgroundColor: { default: 'transparent', ':hover': { default: 'transparent', '@media (hover: hover)': 'rgba(23,23,26,0.025)' } } },
  agent: { display: 'flex', alignItems: 'center', gap: 12, paddingInlineStart: { default: 15, [bp.phone]: 0 } },
  chev: { color: colors.muted, transitionProperty: 'rotate', transitionDuration: '200ms' },
  chevOn: { rotate: '90deg' },
  meter: { display: 'flex', alignItems: 'center', gap: 14, gridColumn: { default: 'auto', [bp.phone]: '1 / -1' }, gridRow: { default: 'auto', [bp.phone]: 2 } },
  pct: { width: 44, textAlign: 'end', color: colors.muted, fontSize: 14, flexShrink: 0 },
  wideOnly: { display: { default: 'block', [bp.phone]: 'none' } },
  runs: { paddingInlineStart: { default: 37, [bp.phone]: 0 }, paddingBottom: 12, animationName: show, animationDuration: '260ms', animationTimingFunction: ease.out },
  run: { width: '100%', display: 'grid', gridTemplateColumns: { default: '130px 1fr auto', [bp.phone]: '1fr auto' }, gap: 12, minHeight: { default: 38, [bp.phone]: 48 }, alignItems: 'center', color: { default: colors.muted, ':hover': colors.ink } },
  runTime: { gridColumn: { default: 'auto', [bp.phone]: '1 / -1' }, fontSize: { default: 15, [bp.phone]: 13 }, marginBottom: { default: 0, [bp.phone]: -12 } },
  more: { fontSize: 14, color: colors.muted, paddingTop: 6 },
});
