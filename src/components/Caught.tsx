'use client';
import { useId } from 'react';
import * as stylex from '@stylexjs/stylex';
import { LOOP, TODAY } from '@/lib/data';
import { arc, at } from '@/lib/geometry';
import { num, onDay, usd } from '@/lib/format';
import { useStore } from '@/lib/store';
import { HEX } from '@/styles/brand';
import { bp, colors } from '@/styles/tokens.stylex';
import { PlayIcon, PowerIcon } from '@hugeicons/core-free-icons';
import { Button, CardHead } from './ui';

const CLOCK = (h: number, m: number) => ((h * 60 + m) / 720) * Math.PI * 2;

function LoopArt({ still, brief = false }: { still: boolean; brief?: boolean }) {
  const R = 78, D = 64;
  const spots = [0, 1, 2].map((i) => at(D, (i / 3) * Math.PI * 2));
  const words = [['Reads', 'page 88'], ['Gets the', 'same file'], ['Asks for', 'a rescan']];
  const uid = useId().replace(/:/g, '');
  return (
      <svg viewBox={brief ? "-182 -182 364 364" : "-200 -196 400 392"} {...stylex.props(brief ? s.artBrief : s.art)} role="img" aria-label={`The loop: reads page 88, asks for a rescan, gets the same file. It ran from ${LOOP.from} to ${LOOP.to}.`}>
        <defs>
          <linearGradient id={`${uid}g`}><stop offset="0" stopColor={HEX.rose} /><stop offset="0.45" stopColor="#FC7270" /><stop offset="1" stopColor="#FE5C41" /></linearGradient>
          <filter id={`${uid}b`} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="17" /></filter>
        </defs>
        <rect x={-104} y={-104} width={208} height={204} rx={18} fill={`url(#${uid}g)`} filter={`url(#${uid}b)`} />
        <circle r={172} fill="none" stroke="#fff" strokeOpacity={0.5} />
        {Array.from({ length: 12 }, (_, i) => { const [x1, y1] = at(172, (i / 12) * Math.PI * 2); const [x2, y2] = at(165, (i / 12) * Math.PI * 2); return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#fff" strokeOpacity={0.6} />; })}
        <path d={arc(172, CLOCK(0, 6), CLOCK(3, 12))} fill="none" stroke="#fff" strokeWidth={brief ? 8 : 5} strokeLinecap="round" />
        {!brief && <text x={14} y={-180} {...stylex.props(s.time)}>{LOOP.from}</text>}
        {!brief && <text x={198} y={46} textAnchor="end" {...stylex.props(s.time)}>{LOOP.to}</text>}
        {spots.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={R} fill="none" stroke="#fff" strokeWidth={brief ? 2.6 : 1.6} strokeDasharray={i === 2 ? '4 4' : undefined} />)}
        <g {...stylex.props(s.spin, still && s.still)}><circle cx={0} cy={-118} r={brief ? 9 : 5} fill="#fff" /></g>
        {!brief && spots.map(([x, y], i) => { const k = 1.36; return words[i].map((t, j) => <text key={t} x={Math.round(x * k)} y={Math.round(y * k) + j * 17 - 3} textAnchor="middle" {...stylex.props(s.word)}>{t}</text>); })}
      </svg>
  );
}

export function Caught({ brief = false }: { brief?: boolean }) {
  const { loop, setLoop, month, limit } = useStore();
  const cut = month.stops.find((x) => x.agent.id === 'reading');
  const cutDay = cut && (cut.from === TODAY ? 'today' : `on ${onDay(cut.from)}`);
  const actions = (
    <div {...stylex.props(s.actions)}>
      {loop !== 'resumed' && <Button size={brief ? 'small' : 'normal'} icon={PlayIcon} onClick={() => setLoop('resumed', cut ? `Document reading may work again, until your limit stops it ${cutDay}` : 'Document reading is working again, without that file')}>{brief ? 'Resume' : 'Resume without that file'}</Button>}
      {loop !== 'held' && <Button size={brief ? 'small' : 'normal'} kind="line" icon={PowerIcon} onClick={() => setLoop('held', 'Document reading stays off')}>{loop === 'resumed' ? 'Turn it off' : 'Keep it off'}</Button>}
    </div>
  );
  if (brief) {
    return (
      <section aria-label="Caught overnight" {...stylex.props(s.brief)}>
        <CardHead href="/agents" title={`Document reading looped ${num(LOOP.passes)} times`} sub={<span {...stylex.props(s.soft)}>{loop === 'stopped' ? `Stopped Sunday at ${LOOP.to}` : loop === 'held' ? 'It stays off' : cut ? `Your limit stops it ${cutDay}` : 'It is working again'}</span>} />
        <div {...stylex.props(s.briefBody)}>
          <div {...stylex.props(s.briefText)}><p><span {...stylex.props(s.briefBig)}>{usd(LOOP.cost)}</span>spent on one file</p>{actions}</div>
          <LoopArt brief still={loop !== 'stopped'} />
        </div>
      </section>
    );
  }
  return (
    <section aria-label="Caught overnight" {...stylex.props(s.wrap)}>
      <div {...stylex.props(s.words)}>
      <CardHead title={`Document reading looped ${num(LOOP.passes)} times`} sub={<span {...stylex.props(s.soft)}>Purser stopped it on Sunday at {LOOP.to}</span>} />
      <p><span {...stylex.props(s.huge)}>{usd(LOOP.cost)}</span>spent on one file</p>
      <div {...stylex.props(s.foot)}>
        <p {...stylex.props(s.text)}>
          {loop === 'stopped' && <>It kept asking for a better scan of one {LOOP.file}, and kept getting the same one. {num(LOOP.queued)} documents are queued behind it.</>}
          {loop === 'resumed' && (cut ? <>That file went to a person on Emre Aydin’s team. It may work again, but your {usd(limit)} limit stops it {cutDay}.</> : <>It is working again. That file went to a person on Emre Aydin’s team, and the {num(LOOP.queued)} queued documents come next.</>)}
          {loop === 'held' && <>It stays off. Emre Aydin’s team takes the {num(LOOP.queued)} queued documents, and the month’s forecast no longer counts on it.</>}
        </p>
        {actions}
      </div>
      </div>
      <LoopArt still={loop !== 'stopped'} />
    </section>
  );
}

const turn = stylex.keyframes({ to: { rotate: '360deg' } });
const s = stylex.create({
  wrap: { display: 'grid', gridTemplateColumns: { default: 'minmax(0, 1fr)', '@media (min-width: 1000px)': 'minmax(0, 1fr) minmax(0, 1fr)' }, gap: 28, alignItems: 'center', },
  words: { display: 'flex', flexDirection: 'column', gap: 20 },
  huge: { display: 'block', fontSize: 44, lineHeight: 1.1, fontWeight: 300, letterSpacing: '-0.04em' },
  soft: { color: '#2B3A2F' },
  art: { width: '100%', maxWidth: 420, marginInline: 'auto', overflow: 'visible' },
  time: { fontSize: 14, fill: colors.ink },
  word: { fontSize: 15, fill: colors.ink },
  spin: { transformOrigin: '0 0', animationName: turn, animationDuration: '7s', animationTimingFunction: 'linear', animationIterationCount: 'infinite' },
  still: { animationName: 'none' },
  artBrief: { position: 'absolute', insetInlineEnd: 0, top: 0, width: 'auto', height: { default: 'calc(100% - 40px)', [bp.phone]: 'calc(100% - 52px)' }, maxWidth: '46%', overflow: 'visible' },
  brief: { display: 'flex', flexDirection: 'column', gap: 12, height: '100%', minHeight: 0 },
  briefBody: { position: 'relative', display: 'flex', gap: 10, flex: 1, minHeight: { default: 0, [bp.phone]: 170 }, height: { default: 0, [bp.phone]: 170 }, justifyContent: 'space-between' },
  briefBig: { display: 'block', fontSize: { default: 34, '@media (min-width: 1200px) and (max-height: 879px)': 28 }, fontWeight: 300, letterSpacing: '-0.03em', lineHeight: 1.15 },
  briefText: { position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 14, flex: 1, minWidth: 0 },
  foot: { display: 'flex', flexDirection: 'column', gap: 16 },
  text: { textWrap: 'pretty' },
  actions: { display: 'flex', gap: 8, flexWrap: 'wrap' },
});
