'use client';
import * as stylex from '@stylexjs/stylex';
import { AGENTS, LAST, MONTH_DAYS, TODAY, agentById } from '@/lib/data';
import { andList, cap, onDay, pct, usd, word } from '@/lib/format';
import { SPENT, spentBy } from '@/lib/model';
import { useGoTo, useStore } from '@/lib/store';
import { bp, colors } from '@/styles/tokens.stylex';
import { Ticks } from './ui';

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
      <h1 {...stylex.props(s.title)}>November lands at {usd(month.landing)}. <span {...stylex.props(s.rest)}>{rest}</span></h1>
      <div {...stylex.props(s.meters)}>
        <div>
          <Ticks value={SPENT / limit} height={48} label={`${pct(SPENT / limit)} of the limit spent`} />
          <p {...stylex.props(s.big)}>{pct(SPENT / limit)}</p>
          <p {...stylex.props(s.cap)}>of the money is spent,<br />{usd(SPENT)} of {usd(limit)}</p>
        </div>
        <div>
          <Ticks value={LAST / MONTH_DAYS} color={colors.ink} height={48} label={`${LAST} of ${MONTH_DAYS} days gone`} />
          <p {...stylex.props(s.big)}>{pct(LAST / MONTH_DAYS)}</p>
          <p {...stylex.props(s.cap)}>of the month is gone,<br />{LAST} of {MONTH_DAYS} days</p>
        </div>
      </div>
    </div>
  );
}

/** The line under the wheel. It always holds its space, so selecting a wedge moves nothing. */
export function WheelNote() {
  const { selected, limitOf, month, open } = useStore();
  const go = useGoTo();
  const over = AGENTS.filter((a) => month.byAgent[a.id] > limitOf(a.id));
  if (!selected) {
    return <p {...stylex.props(s.note)}>{over.length ? `${over.length === 1 ? 'One agent is' : `${cap(word(over.length))} agents are`} on pace to pass ${over.length === 1 ? 'its limit' : 'their limits'}.` : 'Every agent is on pace to stay inside its limit.'} The dotted arc is where each one lands on the 30th.</p>;
  }
  const a = agentById(selected);
  const lands = month.byAgent[a.id], max = limitOf(a.id);
  return (
    <p {...stylex.props(s.note)}>
      {a.name} {spentBy(a.id) > max ? 'is already over' : lands > max ? 'is on pace to go over' : 'stays inside'} its limit, landing at {usd(lands)}.{' '}
      <button type="button" {...stylex.props(s.link)} onClick={() => { open(a.id); go('agents', `row-${a.id}`); }}>See its runs</button>
    </p>
  );
}

const s = stylex.create({
  wrap: { display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: { default: 40, [bp.phone]: 28 }, height: '100%' },
  title: { fontSize: { default: 40, [bp.desk]: 'clamp(30px, 2.5vw, 50px)', [bp.phone]: 30 }, lineHeight: 1.1, letterSpacing: '-0.03em', fontWeight: 300, textWrap: 'pretty' },
  rest: { color: colors.muted },
  meters: { display: 'grid', gridTemplateColumns: { default: '1fr 1fr', [bp.desk]: '1fr' }, gap: { default: 28, [bp.phone]: 20 } },
  big: { fontSize: { default: 48, [bp.phone]: 44 }, lineHeight: 1, letterSpacing: '-0.04em', fontWeight: 300, marginTop: 14 },
  cap: { color: colors.muted, marginTop: 6, fontSize: { default: 15, [bp.phone]: 14 } },
  note: { color: colors.muted, textAlign: 'center', maxWidth: 440, marginInline: 'auto', minHeight: { default: 44, [bp.phone]: 66 }, textWrap: 'balance' },
  link: { color: colors.ink, textDecorationLine: 'underline', textDecorationThickness: 1, textUnderlineOffset: 3, whiteSpace: 'nowrap' },
});
