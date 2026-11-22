import Link from 'next/link';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import * as stylex from '@stylexjs/stylex';
import { bp, colors } from '@/styles/tokens.stylex';

export function Button({ kind = 'solid', size = 'normal', children, ...rest }: { kind?: 'solid' | 'line'; size?: 'normal' | 'small' } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'style'>) {
  return <button type="button" {...rest} {...stylex.props(s.base, kind === 'solid' ? s.solid : s.lined, size === 'small' && s.smallBtn)}>{children}</button>;
}

/** Twenty-five to thirty ticks, the last few lit ones fading, as in the metrics reference. */
export function Ticks({ value, count = 30, height = 56, color = colors.hot, off = colors.tick, label }: { value: number; count?: number; height?: number; color?: string; off?: string; label: string }) {
  const lit = Math.max(value > 0 ? 1 : 0, Math.min(count, Math.round(value * count)));
  return (
    <div role="img" aria-label={label} {...stylex.props(s.ticks)} style={{ height }}>
      {Array.from({ length: count }, (_, i) => {
        const fade = lit - i;
        const on = i < lit;
        const strength = !on ? 0 : fade > 4 || value >= 1 || lit < 5 ? 100 : [0, 34, 52, 70, 86][fade];
        return <span key={i} {...stylex.props(s.tick)} style={{ backgroundColor: on ? `color-mix(in srgb, ${color} ${strength}%, ${off})` : off }} />;
      })}
    </div>
  );
}

/** A tile's headline on the Overview. The whole line opens the page behind it. */
export function TileTitle({ href, children }: { href: string; children: ReactNode }) {
  return (
    <h2 {...stylex.props(s.tileTitle)}>
      <Link href={href} {...stylex.props(s.tileLink, stylex.defaultMarker())}>
        <span>{children}</span>
        <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" {...stylex.props(s.arrow)}><path d="M5 13L13 5M6.5 5H13v6.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </Link>
    </h2>
  );
}

/** The headline of a full page. */
export function PageTitle({ lead, rest }: { lead: ReactNode; rest: ReactNode }) {
  return <h1 {...stylex.props(s.pageTitle)}>{lead} <span {...stylex.props(s.rest)}>{rest}</span></h1>;
}

const s = stylex.create({
  base: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: { default: 40, [bp.phone]: 48 }, paddingInline: 18, borderRadius: 999, fontSize: 15, fontWeight: 450, lineHeight: 1.2, textAlign: 'center', whiteSpace: 'nowrap', flexShrink: 0, transitionProperty: 'background-color, color, border-color, scale', transitionDuration: '160ms', scale: { default: 1, ':active': 0.97 }, opacity: { default: 1, ':disabled': 0.4 }, cursor: { default: 'pointer', ':disabled': 'default' } },
  solid: { backgroundColor: { default: colors.ink, ':hover': { default: colors.ink, '@media (hover: hover)': '#3A3A3E' } }, color: '#FFFFFF' },
  lined: { borderWidth: 1, borderStyle: 'solid', borderColor: { default: 'rgba(23,23,26,0.28)', ':hover': colors.ink }, color: colors.ink },
  smallBtn: { minHeight: { default: 32, [bp.phone]: 44 }, paddingInline: 14, fontSize: 14 },
  ticks: { display: 'flex', gap: 3, width: '100%' },
  tick: { flex: 1, minWidth: 2, borderRadius: 3, transitionProperty: 'background-color', transitionDuration: '300ms' },
  rest: { color: colors.muted },
  tileTitle: { fontSize: { default: 18, '@media (min-width: 1200px) and (max-width: 1399px)': 16 }, lineHeight: 1.25, letterSpacing: '-0.01em' },
  tileLink: { display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start' },
  arrow: { flexShrink: 0, marginTop: 2, color: { default: colors.muted, [stylex.when.ancestor(':hover')]: colors.ink } },
  pageTitle: { fontSize: { default: 40, [bp.phone]: 28 }, lineHeight: 1.1, fontWeight: 300, letterSpacing: '-0.03em', textWrap: 'pretty', maxWidth: 860 },
});
