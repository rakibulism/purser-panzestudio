'use client';
import { useEffect } from 'react';
import * as stylex from '@stylexjs/stylex';
import { agentById } from '@/lib/data';
import { usdc } from '@/lib/format';
import { useDismissable, useDragToClose } from '@/lib/hooks';
import { useStore } from '@/lib/store';
import { bp, colors, ease } from '@/styles/tokens.stylex';
import { Cancel01Icon } from '@hugeicons/core-free-icons';
import { Button } from './ui';

const close = (set: (r: null) => void) => () => set(null);

/** One run, and where its money went. A side panel on wide screens, a bottom sheet on phones. */
export function RunSheet() {
  const { run, setRun } = useStore();
  const shut = close(setRun);
  const ref = useDismissable<HTMLDivElement>(run !== null, shut);
  const drag = useDragToClose(shut);
  const { reset } = drag;
  useEffect(() => { if (run) reset(); }, [run, reset]);
  if (!run) return null;
  const a = agentById(run.agent);
  const [time, what, cost] = a.runs[run.index];
  const c = Math.round(cost * 100), reading = Math.round(c * 0.46), thinking = Math.round(c * 0.39);
  const parts: [string, number][] = [['Reading', reading], ['Thinking and writing', thinking], ['Tools it called', c - reading - thinking]];
  const looped = a.id === 'reading' && run.index === 0;
  const steps = looped ? ['Read page 88 and could not make out the stamp', 'Asked the archive for a better scan', 'Got the same file back, and started over'] : a.steps;
  return (
    <div {...stylex.props(s.layer)}>
      <div {...stylex.props(s.scrim)} onClick={shut} />
      <div ref={ref} tabIndex={-1} role="dialog" aria-modal="true" aria-label={what} {...stylex.props(s.sheet)} style={{ transform: drag.dy ? `translateY(${drag.dy}px)` : undefined }}>
        <div {...drag.handlers} {...stylex.props(s.grab)}><span {...stylex.props(s.grabBar)} /></div>
        <div {...stylex.props(s.body)}>
          <p {...stylex.props(s.muted)}>{a.name}, {time}</p>
          <h2 {...stylex.props(s.title)}>{what}</h2>
          <p {...stylex.props(s.big)}>{usdc(cost)}</p>
          <div {...stylex.props(s.split)} aria-hidden="true">{parts.map(([l, v], i) => <span key={l} {...stylex.props(s.part)} style={{ flexGrow: v, backgroundColor: [colors.hot, colors.part2, colors.part3][i] }} />)}</div>
          <ul>{parts.map(([l, v], i) => <li key={l} {...stylex.props(s.line)}><span {...stylex.props(s.key)}><i {...stylex.props(s.dot)} style={{ backgroundColor: [colors.hot, colors.part2, colors.part3][i] }} />{l}</span><span>{usdc(v / 100)}</span></li>)}</ul>
          <h3 {...stylex.props(s.h3)}>What it did{looped ? ', 6,180 times' : ''}</h3>
          <ol>{steps.map((x) => <li key={x} {...stylex.props(s.line)}>{x}</li>)}</ol>
          <div {...stylex.props(s.foot)}><Button kind="line" icon={Cancel01Icon} onClick={shut}>Close</Button></div>
        </div>
      </div>
    </div>
  );
}

const rise = stylex.keyframes({ from: { translate: '0 100%' }, to: { translate: '0 0' } });
const slide = stylex.keyframes({ from: { translate: '100% 0' }, to: { translate: '0 0' } });
const fade = stylex.keyframes({ from: { opacity: 0 }, to: { opacity: 1 } });
const s = stylex.create({
  layer: { position: 'fixed', inset: 0, zIndex: 60 },
  scrim: { position: 'absolute', inset: 0, backgroundColor: colors.scrim, animationName: fade, animationDuration: '200ms' },
  sheet: { position: 'absolute', backgroundColor: colors.raised, outline: 'none', display: 'flex', flexDirection: 'column', animationDuration: '360ms', animationTimingFunction: ease.out, animationName: { default: slide, [bp.phone]: rise }, top: { default: 0, [bp.phone]: 'auto' }, bottom: 0, insetInlineEnd: 0, width: { default: 440, [bp.phone]: '100%' }, maxHeight: { default: 'none', [bp.phone]: '88dvh' }, borderTopLeftRadius: { default: 0, [bp.phone]: 22 }, borderTopRightRadius: { default: 0, [bp.phone]: 22 } },
  grab: { display: { default: 'none', [bp.phone]: 'grid' }, placeItems: 'center', height: 28, touchAction: 'none', flexShrink: 0 },
  grabBar: { width: 36, height: 5, borderRadius: 3, backgroundColor: colors.grab },
  body: { overflowY: 'auto', overscrollBehavior: 'contain', paddingInline: { default: 36, [bp.phone]: 20 }, paddingTop: { default: 36, [bp.phone]: 4 }, paddingBottom: 'calc(24px + env(safe-area-inset-bottom))', display: 'flex', flexDirection: 'column', flex: 1 },
  muted: { color: colors.muted },
  title: { fontSize: 26, fontWeight: 300, letterSpacing: '-0.02em', lineHeight: 1.15, marginTop: 4 },
  big: { fontSize: 64, fontWeight: 300, letterSpacing: '-0.04em', lineHeight: 1, marginTop: 36, marginBottom: 20 },
  split: { display: 'flex', gap: 3, height: 40, marginBottom: 10 },
  part: { flexBasis: 0, borderRadius: 4 },
  line: { display: 'flex', justifyContent: 'space-between', gap: 16, paddingBlock: 11, borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: colors.line },
  key: { display: 'flex', alignItems: 'center', gap: 10 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  h3: { marginTop: 32, marginBottom: 4, color: colors.muted },
  foot: { marginTop: 'auto', paddingTop: 28, display: 'grid' },
});
