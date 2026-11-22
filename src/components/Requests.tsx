'use client';
import { useId, useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import { REQUESTS, agentById, type Request } from '@/lib/data';
import { squircle } from '@/lib/geometry';
import { usd } from '@/lib/format';
import { useStore, type Decision } from '@/lib/store';
import { bp, colors, ease } from '@/styles/tokens.stylex';
import { Button, TileTitle } from './ui';

/** Outer shape: what it asks for. Dotted shape: what it may do without asking. Areas are to scale. */
function Authority({ r, amount, mini = false }: { r: Request; amount: number; mini?: boolean }) {
  const uid = useId().replace(/:/g, '');
  const S = 188;
  const inner = S * Math.sqrt(amount / r.ask);
  const full = amount >= r.ask;
  return (
    <svg viewBox="-96 -190 192 192" {...stylex.props(mini ? s.mini : s.art)} role="img" aria-label={`${usd(amount)} of ${usd(r.ask)}`}>
      <defs>
        <linearGradient id={`${uid}a`} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#C6D5C7" /><stop offset="1" stopColor="#94AA95" /></linearGradient>
        <linearGradient id={`${uid}b`} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#94AA95" /><stop offset="1" stopColor="#4F6F5B" /></linearGradient>
        <pattern id={`${uid}d`} width={mini ? 18 : 6} height={mini ? 18 : 6} patternUnits="userSpaceOnUse" patternTransform="translate(0 -2)"><circle cx={mini ? 9 : 3} cy={mini ? 9 : 3} r={mini ? 3.4 : 1.15} fill="#fff" /></pattern>
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

/** What happened to a request, in one line. */
const outcome = (r: Request, d: Decision) => {
  const name = agentById(r.agent).name;
  if (d.kind === 'refuse') return `You refused ${name}. ${r.ifNo.charAt(0).toUpperCase() + r.ifNo.slice(1)}`;
  return r.kind === 'budget' ? `${name} may spend ${usd(d.amount)} in November.` : `${name} may ${r.verb} up to ${usd(d.amount)}${d.standing ? ' from now on' : ', this time'}.`;
};

/** The Overview tile: decide from here, or open the page to change the amount. */
export function RequestsBrief() {
  const { decisions, waiting, decide } = useStore();
  return (
    <section aria-label="Requests" {...stylex.props(s.brief)}>
      <TileTitle href="/requests">{waiting === 0 ? 'Nothing is waiting on you.' : `${waiting === 1 ? 'One agent is' : waiting === 2 ? 'Two agents are' : 'Three agents are'} waiting on you.`}</TileTitle>
      <ul {...stylex.props(s.briefList)}>
        {REQUESTS.map((r) => {
          const d = decisions[r.id], agent = agentById(r.agent);
          return (
            <li key={r.id} {...stylex.props(s.briefItem)}>
              {d ? <p {...stylex.props(s.muted)}>{outcome(r, d)}</p> : (
                <>
                  <div {...stylex.props(s.briefTop)}>
                    <div><p {...stylex.props(s.briefText)}>{r.title}</p><p {...stylex.props(s.due)}>{r.due}</p><p {...stylex.props(s.roomy)}>{r.why}</p></div>
                    <Authority r={r} amount={r.alone} mini />
                  </div>
                  <div {...stylex.props(s.briefActions)}>
                    <Button size="small" onClick={() => decide(r.id, { kind: 'allow', amount: r.ask, standing: false }, r.kind === 'budget' ? `${agent.name} may spend ${usd(r.ask)} in November` : `${agent.name} may ${r.verb} up to ${usd(r.ask)} this time`)}>Allow</Button>
                    <Button size="small" kind="line" onClick={() => decide(r.id, { kind: 'refuse', amount: 0, standing: false }, `${agent.name} was refused`)}>Refuse</Button>
                    <span {...stylex.props(s.due, s.now)}>{r.now}</span>
                  </div>
                </>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/** The full page: every request open, side by side, with the amount to set. */
export function Requests() {
  const { decisions } = useStore();
  return (
    <ul {...stylex.props(s.columns)}>
      {REQUESTS.map((r) => {
        const d = decisions[r.id];
        return (
          <li key={r.id} {...stylex.props(s.column)}>
            <h2 {...stylex.props(s.headText)}>{r.title}</h2>
            <p {...stylex.props(s.due)}>{r.due}</p>
            {d ? <p {...stylex.props(s.done)}>{outcome(r, d)}</p> : <Open r={r} />}
          </li>
        );
      })}
    </ul>
  );
}

const show = stylex.keyframes({ from: { opacity: 0, translate: '0 -6px' }, to: { opacity: 1, translate: '0 0' } });
const thumb = { appearance: 'none', width: 28, height: 28, borderRadius: 999, backgroundColor: '#FFFFFF', borderWidth: 7, borderStyle: 'solid', borderColor: '#4F6F5B', cursor: 'grab' } as const;
const s = stylex.create({
  columns: { display: 'grid', gridTemplateColumns: { default: '1fr', '@media (min-width: 1000px)': 'repeat(3, minmax(0, 1fr))' }, gap: { default: 0, '@media (min-width: 1000px)': 40 } },
  column: { paddingBlock: { default: 22, '@media (min-width: 1000px)': 18 }, borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: colors.ink, display: 'flex', flexDirection: 'column' },
  headText: { fontSize: 19, lineHeight: 1.3, letterSpacing: '-0.01em', textWrap: 'pretty', minHeight: { default: 0, '@media (min-width: 1000px)': 50 } },
  due: { fontSize: 14, color: colors.muted },
  body: { paddingTop: 20, display: 'flex', flexDirection: 'column', gap: 16, flex: 1, animationName: show, animationDuration: '320ms', animationTimingFunction: ease.out },
  top: { display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'stretch', gap: 16 },
  numbers: { display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 14, borderInlineStartWidth: 1, borderInlineStartStyle: 'solid', borderInlineStartColor: colors.sage, paddingInlineStart: 14, minWidth: 0, flex: 1 },
  figure: { minWidth: 0 },
  big: { fontSize: { default: 37, '@media (min-width: 1000px) and (max-width: 1399px)': 32 }, fontWeight: 300, letterSpacing: '-0.04em', lineHeight: 1 },
  cap: { marginTop: 8, color: colors.ink },
  small: { fontSize: 14, color: colors.muted },
  art: { width: { default: 148, '@media (min-width: 1000px) and (max-width: 1399px)': 108 }, flexShrink: 0 },
  mini: { width: { default: 46, '@media (min-width: 1200px) and (max-height: 879px)': 38 }, flexShrink: 0 },
  slide: { display: 'block' },
  hidden: { position: 'absolute', width: 1, height: 1, overflow: 'hidden', clipPath: 'inset(50%)' },
  range: { appearance: 'none', display: 'block', width: '100%', height: 4, marginBlock: 12, marginInline: 0, borderRadius: 2, cursor: 'pointer', backgroundRepeat: 'no-repeat', '::-webkit-slider-thumb': thumb, '::-moz-range-thumb': thumb },
  why: { textWrap: 'pretty' },
  muted: { color: colors.muted, textWrap: 'pretty' },
  modes: { display: 'flex', gap: 20 },
  mode: { minHeight: { default: 28, [bp.phone]: 44 }, color: { default: colors.muted, ':hover': colors.ink }, borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: 'transparent' },
  modeOn: { color: colors.ink, borderBottomColor: colors.ink },
  actions: { display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 'auto' },
  done: { paddingBlock: 16, color: colors.muted, textWrap: 'pretty' },
  brief: { display: 'flex', flexDirection: 'column', gap: { default: 12, '@media (min-width: 1200px) and (max-height: 879px)': 8 }, height: '100%' },
  briefList: { display: 'flex', flexDirection: 'column', flex: 1 },
  briefItem: { flex: 1, borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: colors.line, paddingBlock: { default: 11, '@media (min-width: 1200px) and (max-height: 879px)': 7 }, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: { default: 8, '@media (min-width: 1200px) and (max-height: 879px)': 3 } },
  briefTop: { display: 'flex', justifyContent: 'space-between', gap: 12 },
  briefText: { lineHeight: 1.25, fontSize: { default: 15, '@media (min-width: 1200px) and (max-height: 879px)': 14 }, textWrap: 'pretty' },
  roomy: { display: { default: 'none', '@media (min-width: 768px) and (max-width: 1199px)': '-webkit-box', '@media (min-width: 1200px) and (min-height: 960px)': '-webkit-box' }, WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, overflow: 'hidden', marginTop: 6, color: colors.muted, fontSize: 14 },
  now: { marginInlineStart: 'auto', whiteSpace: 'nowrap' },
  briefActions: { display: 'flex', alignItems: 'center', gap: 8 },
});
