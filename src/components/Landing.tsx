'use client';
import { useRouter } from 'next/navigation';
import * as stylex from '@stylexjs/stylex';
import { AGENTS, LAST, MONTH_DAYS, TODAY, agentById } from '@/lib/data';
import { andList, cap, onDay, pct, usd, word } from '@/lib/format';
import { SPENT, spentBy } from '@/lib/model';
import { useStore } from '@/lib/store';
import { bp, colors } from '@/styles/tokens.stylex';
import { Ticks, TileTitle } from './ui';

/** The answer, then how fast the money goes beside how fast the month goes. */
export function Landing() {
  const { limit, month, planned } = useStore();
  const gap = month.landing - limit;
  const rest = gap > 0
    ? `That is ${usd(gap)} over the limit, and the money runs out on ${onDay(month.runsOut!)}.`
    : month.stops.length
      ? `That is inside the ${usd(limit)} limit. ${month.stops.length > 2 ? `${cap(word(month.stops.length))} agents stop along the way, ${month.stops[0].agent.name} first.` : `${andList(month.stops.map((x) => `${x.agent.name} stops ${x.from === TODAY ? 'today' : onDay(x.from)}`))}.`}`
      : `That is inside the ${usd(limit)} limit, with ${usd(-gap)} left${planned ? ' and nobody stopped' : ''}.`;
  return (
    <div {...stylex.props(s.wrap)}>
      <div>
        <p {...stylex.props(s.date)}>Monday, November 23</p>
        <h1 {...stylex.props(s.title)}>November lands at {usd(month.landing)}. <span {...stylex.props(s.rest)}>{rest}</span></h1>
      </div>
      <div {...stylex.props(s.meters)}>
        <div>
          <Ticks value={SPENT / limit} height={34} label={`${pct(SPENT / limit)} of the limit spent`} />
          <p {...stylex.props(s.meter)}><span {...stylex.props(s.big)}>{pct(SPENT / limit)}</span><span {...stylex.props(s.cap)}>of {usd(limit)}<br />is spent</span></p>
        </div>
        <div>
          <Ticks value={LAST / MONTH_DAYS} height={34} color={colors.ink} label={`${LAST} of ${MONTH_DAYS} days gone`} />
          <p {...stylex.props(s.meter)}><span {...stylex.props(s.big)}>{pct(LAST / MONTH_DAYS)}</span><span {...stylex.props(s.cap)}>of November<br />is gone</span></p>
        </div>
      </div>
    </div>
  );
}

/** The wheel's headline. It always holds two lines, so selecting a wedge moves nothing. */
export function WheelTitle() {
  const { selected, select, limitOf, month, open } = useStore();
  const router = useRouter();
  const over = AGENTS.filter((a) => month.byAgent[a.id] > limitOf(a.id));
  if (!selected) {
    return (
      <div {...stylex.props(s.note)}><TileTitle href="/agents">
        {over.length ? <>{cap(word(over.length))} {over.length === 1 ? 'agent' : 'agents'} will pass {over.length === 1 ? 'its limit' : 'their limits'}. </> : <>Every agent stays inside its limit. </>}
        <span {...stylex.props(s.rest)}>Dotted arcs show where each one lands.</span>
      </TileTitle></div>
    );
  }
  const a = agentById(selected);
  const lands = month.byAgent[a.id], max = limitOf(a.id);
  return (
    <p {...stylex.props(s.note, s.noteText)}>
      {a.name} {spentBy(a.id) > max ? 'is already over' : lands > max ? 'will pass' : 'stays inside'} its limit, <span {...stylex.props(s.rest)}>landing at {usd(lands)}.</span>{' '}
      <button type="button" {...stylex.props(s.link)} onClick={() => { open(a.id); router.push('/ledger'); }}>See its runs</button>{' '}
      <button type="button" {...stylex.props(s.link)} onClick={() => select(null)}>Show all</button>
    </p>
  );
}

const s = stylex.create({
  wrap: { display: 'grid', gridTemplateColumns: { default: 'minmax(0, 1fr)', [bp.desk]: 'minmax(0, 1fr) minmax(0, 432px)' }, gap: { default: 24, [bp.desk]: 40, [bp.phone]: 22 }, alignItems: 'end' },
  date: { display: { default: 'block', [bp.phone]: 'none' }, color: colors.muted, marginBottom: 6, fontSize: 14 },
  title: { fontSize: { default: 34, [bp.desk]: 'clamp(22px, 2.02vw - (1440px - min(100vw, 1440px)) * 0.018, 38px)', [bp.phone]: 27 }, lineHeight: 1.12, letterSpacing: '-0.03em', fontWeight: 300, textWrap: 'pretty' },
  rest: { color: colors.muted },
  meters: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: { default: 28, [bp.phone]: 18 } },
  meter: { display: 'flex', flexDirection: { default: 'row', [bp.phone]: 'column' }, alignItems: { default: 'center', [bp.phone]: 'flex-start' }, gap: { default: 12, [bp.phone]: 4 }, marginTop: 10 },
  big: { fontSize: { default: 40, [bp.phone]: 36 }, lineHeight: 1, letterSpacing: '-0.04em', fontWeight: 300 },
  cap: { color: colors.muted, fontSize: 14, lineHeight: 1.35 },
  note: { minHeight: { default: 46, '@media (min-width: 1200px) and (max-width: 1399px)': 40 } },
  noteText: { fontSize: 18, lineHeight: 1.25, letterSpacing: '-0.01em' },
  link: { color: colors.ink, textDecorationLine: 'underline', textDecorationThickness: 1, textUnderlineOffset: 3, whiteSpace: 'nowrap', fontSize: 15, marginInlineStart: 6 },
});
