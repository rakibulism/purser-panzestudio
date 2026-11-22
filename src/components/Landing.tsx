'use client';
import { useRouter } from 'next/navigation';
import * as stylex from '@stylexjs/stylex';
import { AGENTS, LAST, MONTH_DAYS, TODAY, agentById } from '@/lib/data';
import { andList, cap, onDay, pct, usd, word } from '@/lib/format';
import { SPENT, spentBy } from '@/lib/model';
import { useStore } from '@/lib/store';
import { colors } from '@/styles/tokens.stylex';
import { CardHead, PageHead, Ticks } from './ui';

/** The answer, as the page's heading. */
export function Landing() {
  const { limit, month, planned } = useStore();
  const gap = month.landing - limit;
  const sub = gap > 0
    ? `${usd(gap)} over the limit. The money runs out on ${onDay(month.runsOut!)}.`
    : month.stops.length
      ? `Inside the ${usd(limit)} limit. ${month.stops.length > 2 ? `${cap(word(month.stops.length))} agents stop along the way, ${month.stops[0].agent.name} first.` : `${andList(month.stops.map((x) => `${x.agent.name} stops ${x.from === TODAY ? 'today' : onDay(x.from)}`))}.`}`
      : `Inside the ${usd(limit)} limit, with ${usd(-gap)} left${planned ? ' and nobody stopped' : ''}.`;
  return <PageHead fit title={<>November lands at {usd(month.landing)}</>} sub={sub} />;
}

function Meter({ title, sub, value, color }: { title: string; sub: string; value: number; color?: string }) {
  return (
    <section aria-label={title} {...stylex.props(s.meter)}>
      <div {...stylex.props(s.meterTop)}><CardHead title={title} sub={sub} /><p {...stylex.props(s.big)}>{pct(value)}</p></div>
      <Ticks value={value} height={26} color={color} label={`${title}: ${pct(value)}`} />
    </section>
  );
}
export function MoneyMeter() {
  const { limit } = useStore();
  return <Meter title="Money spent" sub={`${usd(SPENT)} of ${usd(limit)}`} value={SPENT / limit} />;
}
export const MonthMeter = () => <Meter title="Month gone" sub={`${LAST} of ${MONTH_DAYS} days, through Sunday`} value={LAST / MONTH_DAYS} color={colors.ink} />;

/** The wheel's heading: the whole crew, or the one agent picked on it. */
export function WheelHead() {
  const { selected, select, limitOf, month, open } = useStore();
  const router = useRouter();
  const over = AGENTS.filter((a) => month.byAgent[a.id] > limitOf(a.id));
  if (!selected) return <CardHead href="/agents" title={over.length ? `${cap(word(over.length))} ${over.length === 1 ? 'agent will pass its limit' : 'agents will pass their limits'}` : 'Every agent stays inside its limit'} sub="Dotted arcs show where each one lands" />;
  const a = agentById(selected);
  const lands = month.byAgent[a.id], max = limitOf(a.id);
  return (
    <CardHead
      title={`${a.name} ${spentBy(a.id) > max ? 'is over its limit' : lands > max ? 'will pass its limit' : 'stays inside its limit'}`}
      sub={<>Lands at {usd(lands)} <button type="button" {...stylex.props(s.link)} onClick={() => { open(a.id); router.push('/ledger'); }}>See its runs</button> <button type="button" {...stylex.props(s.link)} onClick={() => select(null)}>Show all</button></>}
    />
  );
}

const s = stylex.create({
  meter: { display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 12, height: '100%' },
  meterTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 },
  big: { fontSize: 36, lineHeight: '42px', letterSpacing: '-0.04em', fontWeight: 300 },
  link: { color: colors.ink, textDecorationLine: 'underline', textDecorationThickness: 1, textUnderlineOffset: 3, whiteSpace: 'nowrap', marginInlineStart: 8 },
});
