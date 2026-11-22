'use client';
import { useId, useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import { REQUESTS, agentById, type Request } from '@/lib/data';
import { squircle } from '@/lib/geometry';
import { usd } from '@/lib/format';
import { useStore } from '@/lib/store';
import { bp, colors, ease } from '@/styles/tokens.stylex';
import { Button } from './ui';

/** Outer shape: what it asks for. Dotted shape: what it may do without asking. Areas are to scale. */
function Authority({ r, amount }: { r: Request; amount: number }) {
  const uid = useId().replace(/:/g, '');
  const S = 188;
  const inner = S * Math.sqrt(amount / r.ask);
  const full = amount >= r.ask;
  return (
    <svg viewBox="-96 -190 192 192" {...stylex.props(s.art)} role="img" aria-label={`${usd(amount)} of ${usd(r.ask)}`}>
      <defs>
        <linearGradient id={`${uid}a`} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#C6D5C7" /><stop offset="1" stopColor="#94AA95" /></linearGradient>
        <linearGradient id={`${uid}b`} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#94AA95" /><stop offset="1" stopColor="#4F6F5B" /></linearGradient>
        <pattern id={`${uid}d`} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="translate(0 -2)"><circle cx="3" cy="3" r="1.15" fill="#fff" /></pattern>
      </defs>
      <path d={squircle(S, S)} fill={`url(#${uid}a)`} />
      <path d={squircle(inner, inner)} fill={`url(#${uid}b)`} />
      <path d={squircle(inner, inner)} fill={`url(#${uid}d)`} opacity={full ? 0.55 : 1} />
    </svg>
  );
}

function Open({ r }: { r: Request }) {
  const { decide } = useStore();
  const [amount, setAmount] = useState(r.ask);
  const [standing, setStanding] = useState(false);
  const agent = agentById(r.agent);
  const full = amount >= r.ask;
  const unchanged = amount <= r.alone;
  const said = r.kind === 'budget' ? `${agent.name} may spend ${usd(amount)} in November` : `${agent.name} may ${r.verb} up to ${usd(amount)}${standing ? ' from now on' : ' this time'}`;
  return (
    <div {...stylex.props(s.body)}>
      <div {...stylex.props(s.top)}>
        <div {...stylex.props(s.numbers)}>
          <div {...stylex.props(s.figure)}><p {...stylex.props(s.big)}>{usd(amount)}</p><p {...stylex.props(s.cap)}>{full ? 'what it asked for' : unchanged ? r.alonePhrase : 'what you would allow'}</p></div>
          <p {...stylex.props(s.small)}>{usd(r.alone)} {r.alonePhrase}</p>
        </div>
        <Authority r={r} amount={amount} />
      </div>
      <label {...stylex.props(s.slide)}>
        <span {...stylex.props(s.hidden)}>Amount to allow</span>
        <input type="range" min={r.alone} max={r.ask} step={r.step} value={amount} aria-valuetext={usd(amount)} onChange={(e) => setAmount(+e.target.value)} {...stylex.props(s.range)} style={{ backgroundImage: `linear-gradient(to right, #4F6F5B ${((amount - r.alone) / (r.ask - r.alone)) * 100}%, #DADAD8 0)` }} />
      </label>
      <p {...stylex.props(s.why)}>{r.why} <span {...stylex.props(s.muted)}>If you refuse, {r.ifNo}</span></p>
      {r.kind === 'authority' && (
        <div role="radiogroup" aria-label="How long this lasts" {...stylex.props(s.modes)}>
          {[['This time', false], ['From now on', true]].map(([l, v]) => (
            <button key={l as string} type="button" role="radio" aria-checked={standing === v} onClick={() => setStanding(v as boolean)} {...stylex.props(s.mode, standing === v && s.modeOn)}>{l as string}</button>
          ))}
        </div>
      )}
      <div {...stylex.props(s.actions)}>
        <Button disabled={unchanged} onClick={() => decide(r.id, { kind: 'allow', amount, standing }, said)}>{full ? `Allow ${usd(amount)}` : `Allow up to ${usd(amount)}`}</Button>
        <Button kind="line" onClick={() => decide(r.id, { kind: 'refuse', amount: 0, standing: false }, `${agent.name} was refused`)}>Refuse</Button>
      </div>
    </div>
  );
}

export function Requests() {
  const { decisions, waiting } = useStore();
  const [openId, setOpenId] = useState<string | null>(REQUESTS[0].id);
  const current = openId && !decisions[openId] ? openId : openId === null ? null : REQUESTS.find((r) => !decisions[r.id])?.id ?? null;
  return (
    <section id="decide" aria-labelledby="decide-title" {...stylex.props(s.wrap)}>
      <h2 id="decide-title" {...stylex.props(s.title)}>{waiting === 0 ? 'Nothing is waiting on you.' : waiting === 1 ? 'One agent is waiting on you.' : `${waiting === 3 ? 'Three' : 'Two'} agents are waiting on you.`}</h2>
      <ul {...stylex.props(s.list)}>
        {REQUESTS.map((r) => {
          const d = decisions[r.id];
          const agent = agentById(r.agent);
          if (d) {
            return (
              <li key={r.id} {...stylex.props(s.item)}>
                <p {...stylex.props(s.done)}>{d.kind === 'refuse' ? `You refused ${agent.name}. ${r.ifNo.charAt(0).toUpperCase() + r.ifNo.slice(1)}` : r.kind === 'budget' ? `${agent.name} may spend ${usd(d.amount)} in November.` : `${agent.name} may ${r.verb} up to ${usd(d.amount)}${d.standing ? ' from now on' : ', this time'}.`}</p>
              </li>
            );
          }
          const on = current === r.id;
          return (
            <li key={r.id} {...stylex.props(s.item)}>
              <button type="button" aria-expanded={on} onClick={() => setOpenId(on ? null : r.id)} {...stylex.props(s.head)}>
                <span {...stylex.props(s.headText, !on && s.headOff)}>{r.title}</span>
                <span {...stylex.props(s.due)}>{r.due}</span>
              </button>
              {on && <Open r={r} />}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

const show = stylex.keyframes({ from: { opacity: 0, translate: '0 -6px' }, to: { opacity: 1, translate: '0 0' } });
const thumb = { appearance: 'none', width: 28, height: 28, borderRadius: 999, backgroundColor: '#FFFFFF', borderWidth: 7, borderStyle: 'solid', borderColor: '#4F6F5B', cursor: 'grab' } as const;
const s = stylex.create({
  wrap: { display: 'flex', flexDirection: 'column', gap: 20 },
  title: { fontSize: { default: 26, [bp.phone]: 24 }, fontWeight: 300, letterSpacing: '-0.02em', lineHeight: 1.15 },
  list: { display: 'flex', flexDirection: 'column' },
  item: { borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: colors.line },
  head: { width: '100%', paddingBlock: 16, display: 'flex', flexDirection: 'column', gap: 2 },
  headText: { fontSize: 17, lineHeight: 1.3, color: colors.ink },
  headOff: { color: { default: colors.muted, ':hover': colors.ink } },
  due: { fontSize: 14, color: colors.muted },
  body: { paddingBottom: 22, display: 'flex', flexDirection: 'column', gap: 16, animationName: show, animationDuration: '320ms', animationTimingFunction: ease.out },
  top: { display: 'flex', justifyContent: 'space-between', alignItems: 'stretch', gap: 16 },
  numbers: { display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderInlineStartWidth: 1, borderInlineStartStyle: 'solid', borderInlineStartColor: colors.sage, paddingInlineStart: 14, minWidth: 0 },
  figure: { minWidth: 0 },
  big: { fontSize: 35, fontWeight: 300, letterSpacing: '-0.04em', lineHeight: 1 },
  cap: { marginTop: 8, color: colors.ink },
  small: { fontSize: 14, color: colors.muted },
  art: { width: { default: 148, '@media (min-width: 1200px) and (max-width: 1365px)': 128 }, flexShrink: 0 },
  slide: { display: 'block' },
  hidden: { position: 'absolute', width: 1, height: 1, overflow: 'hidden', clipPath: 'inset(50%)' },
  range: { appearance: 'none', display: 'block', width: '100%', height: 4, marginBlock: 12, marginInline: 0, borderRadius: 2, cursor: 'pointer', backgroundRepeat: 'no-repeat', '::-webkit-slider-thumb': thumb, '::-moz-range-thumb': thumb },
  why: { textWrap: 'pretty' },
  muted: { color: colors.muted },
  modes: { display: 'flex', gap: 20 },
  mode: { minHeight: { default: 28, [bp.phone]: 44 }, color: { default: colors.muted, ':hover': colors.ink }, borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: 'transparent' },
  modeOn: { color: colors.ink, borderBottomColor: colors.ink },
  actions: { display: 'flex', gap: 8, flexWrap: 'wrap' },
  done: { paddingBlock: 16, color: colors.muted, textWrap: 'pretty' },
});
