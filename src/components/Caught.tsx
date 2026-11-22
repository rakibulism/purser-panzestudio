'use client';
import * as stylex from '@stylexjs/stylex';
import { LOOP, TODAY } from '@/lib/data';
import { arc, at } from '@/lib/geometry';
import { num, onDay, usd } from '@/lib/format';
import { useStore } from '@/lib/store';
import { HEX } from '@/styles/brand';
import { bp, colors } from '@/styles/tokens.stylex';
import { Button } from './ui';

const CLOCK = (h: number, m: number) => ((h * 60 + m) / 720) * Math.PI * 2;

export function Caught() {
  const { loop, setLoop, month, limit } = useStore();
  const cut = month.stops.find((x) => x.agent.id === 'reading');
  const cutDay = cut && (cut.from === TODAY ? 'today' : `on ${onDay(cut.from)}`);
  const R = 78, D = 64;
  const spots = [0, 1, 2].map((i) => at(D, (i / 3) * Math.PI * 2));
  const words = [['Reads', 'page 88'], ['Gets the', 'same file'], ['Asks for', 'a rescan']];
  return (
    <section id="caught" aria-labelledby="caught-title" {...stylex.props(s.wrap)}>
      <h2 id="caught-title" {...stylex.props(s.title)}>Document reading went in circles {num(LOOP.passes)} times and spent {usd(LOOP.cost)}. <span {...stylex.props(s.soft)}>Purser stopped it at {LOOP.to} on Sunday.</span></h2>
      <svg viewBox="-200 -196 400 392" {...stylex.props(s.art)} role="img" aria-label={`The loop: reads page 88, asks for a rescan, gets the same file. It ran from ${LOOP.from} to ${LOOP.to}.`}>
        <defs>
          <linearGradient id="caught-g"><stop offset="0" stopColor={HEX.rose} /><stop offset="0.45" stopColor="#FC7270" /><stop offset="1" stopColor="#FE5C41" /></linearGradient>
          <filter id="caught-b" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="17" /></filter>
        </defs>
        <rect x={-104} y={-104} width={208} height={204} rx={18} fill="url(#caught-g)" filter="url(#caught-b)" />
        <circle r={172} fill="none" stroke="#fff" strokeOpacity={0.5} />
        {Array.from({ length: 12 }, (_, i) => { const [x1, y1] = at(172, (i / 12) * Math.PI * 2); const [x2, y2] = at(165, (i / 12) * Math.PI * 2); return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#fff" strokeOpacity={0.6} />; })}
        <path d={arc(172, CLOCK(0, 6), CLOCK(3, 12))} fill="none" stroke="#fff" strokeWidth={5} strokeLinecap="round" />
        <text x={14} y={-180} {...stylex.props(s.time)}>{LOOP.from}</text>
        <text x={198} y={46} textAnchor="end" {...stylex.props(s.time)}>{LOOP.to}</text>
        {spots.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={R} fill="none" stroke="#fff" strokeWidth={1.6} strokeDasharray={i === 2 ? '4 4' : undefined} />)}
        <g {...stylex.props(s.spin, loop !== 'stopped' && s.still)}><circle cx={0} cy={-118} r={5} fill="#fff" /></g>
        {spots.map(([x, y], i) => { const k = 1.36; return words[i].map((t, j) => <text key={t} x={Math.round(x * k)} y={Math.round(y * k) + j * 17 - 3} textAnchor="middle" {...stylex.props(s.word)}>{t}</text>); })}
      </svg>
      <div {...stylex.props(s.foot)}>
        <p {...stylex.props(s.text)}>
          {loop === 'stopped' && <>It kept asking for a better scan of one {LOOP.file}, and kept getting the same one. {num(LOOP.queued)} documents are queued behind it.</>}
          {loop === 'resumed' && (cut ? <>That file went to a person on Emre Aydin’s team. It may work again, but your {usd(limit)} limit stops it {cutDay}.</> : <>It is working again. That file went to a person on Emre Aydin’s team, and the {num(LOOP.queued)} queued documents come next.</>)}
          {loop === 'held' && <>It stays off. Emre Aydin’s team takes the {num(LOOP.queued)} queued documents, and the month’s forecast no longer counts on it.</>}
        </p>
        <div {...stylex.props(s.actions)}>
          {loop !== 'resumed' && <Button onClick={() => setLoop('resumed', cut ? `Document reading may work again, until your limit stops it ${cutDay}` : 'Document reading is working again, without that file')}>Resume without that file</Button>}
          {loop !== 'held' && <Button kind="line" onClick={() => setLoop('held', 'Document reading stays off')}>{loop === 'resumed' ? 'Turn it off' : 'Keep it off'}</Button>}
        </div>
      </div>
    </section>
  );
}

const turn = stylex.keyframes({ to: { rotate: '360deg' } });
const s = stylex.create({
  wrap: { display: 'flex', flexDirection: 'column', gap: 20, height: '100%' },
  title: { fontSize: { default: 26, [bp.phone]: 24 }, fontWeight: 300, letterSpacing: '-0.02em', lineHeight: 1.15, textWrap: 'pretty' },
  soft: { color: '#2B3A2F' },
  art: { width: '100%', maxWidth: 420, marginInline: 'auto', flex: 1, minHeight: 0, overflow: 'visible' },
  time: { fontSize: 14, fill: colors.ink },
  word: { fontSize: 15, fill: colors.ink },
  spin: { transformOrigin: '0 0', animationName: turn, animationDuration: '7s', animationTimingFunction: 'linear', animationIterationCount: 'infinite' },
  still: { animationName: 'none' },
  foot: { display: 'flex', flexDirection: 'column', gap: 16 },
  text: { textWrap: 'pretty' },
  actions: { display: 'flex', gap: 8, flexWrap: 'wrap' },
});
