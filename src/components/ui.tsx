import Link from 'next/link';
import type { IconSvgElement } from '@hugeicons/react';
import { ArrowUpRight01Icon } from '@hugeicons/core-free-icons';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import * as stylex from '@stylexjs/stylex';
import { Icon } from './Icon';
import { bp, colors } from '@/styles/tokens.stylex';

export function Button({ kind = 'solid', size = 'normal', icon, children, ...rest }: { kind?: 'solid' | 'line'; size?: 'normal' | 'small'; icon?: IconSvgElement } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'style'>) {
  return <button type="button" {...rest} {...stylex.props(s.base, kind === 'solid' ? s.solid : s.lined, size === 'small' && s.smallBtn, icon && s.iconed)}>{icon && <Icon icon={icon} size={size === 'small' ? 16 : 18} stroke={1.8} />}{children}</button>;
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

/** Every card opens the same way: a title, and a subtitle under it. With `href`, the pair opens the full page. */
export function CardHead({ title, sub, href }: { title: ReactNode; sub: ReactNode; href?: string }) {
  const text = <div {...stylex.props(s.headText)}><h2 {...stylex.props(s.h2)}>{title}</h2><p {...stylex.props(s.sub)}>{sub}</p></div>;
  if (!href) return <header {...stylex.props(s.head)}>{text}</header>;
  return (
    <header><Link href={href} {...stylex.props(s.head, stylex.defaultMarker())}>{text}<span {...stylex.props(s.arrow)}><Icon icon={ArrowUpRight01Icon} /></span></Link></header>
  );
}

/** The heading of a page: h1 and its subtitle. */
export function PageHead({ title, sub, fit = false }: { title: ReactNode; sub: ReactNode; fit?: boolean }) {
  return <header {...stylex.props(s.pageHead)}><h1 {...stylex.props(s.h1, fit && s.h1Fit)}>{title}</h1><p {...stylex.props(s.lead)}>{sub}</p></header>;
}

const s = stylex.create({
  base: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: { default: 40, [bp.phone]: 48 }, paddingInline: 18, borderRadius: 999, fontSize: 15, fontWeight: 450, lineHeight: 1.2, textAlign: 'center', whiteSpace: 'nowrap', flexShrink: 0, transitionProperty: 'background-color, color, border-color, scale', transitionDuration: '160ms', scale: { default: 1, ':active': 0.97 }, opacity: { default: 1, ':disabled': 0.4 }, cursor: { default: 'pointer', ':disabled': 'default' } },
  solid: { backgroundColor: { default: colors.ink, ':hover': { default: colors.ink, '@media (hover: hover)': colors.inkHover } }, color: colors.onInk },
  lined: { borderWidth: 1, borderStyle: 'solid', borderColor: { default: colors.lineStrong, ':hover': colors.ink }, color: colors.ink },
  smallBtn: { minHeight: { default: 32, [bp.phone]: 44 }, paddingInline: 14, fontSize: 14 },
  ticks: { display: 'flex', gap: 3, width: '100%' },
  tick: { flex: 1, minWidth: 2, borderRadius: 3, transitionProperty: 'background-color', transitionDuration: '300ms' },
  head: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 },
  headText: { minWidth: 0 },
  h2: { fontSize: 17, fontWeight: 500, lineHeight: '22px', letterSpacing: '-0.01em', textWrap: 'pretty' },
  sub: { fontSize: 14, lineHeight: '20px', color: colors.muted, marginTop: 2, textWrap: 'pretty' },
  arrow: { flexShrink: 0, color: { default: colors.muted, [stylex.when.ancestor(':hover')]: colors.ink } },
  pageHead: { paddingBlock: { default: 4, [bp.phone]: 0 }, paddingBottom: { default: 8, [bp.phone]: 4 } },
  h1: { fontSize: { default: 30, [bp.phone]: 26 }, fontWeight: 400, lineHeight: 1.15, letterSpacing: '-0.025em', textWrap: 'pretty' },
  h1Fit: { fontSize: { default: 30, [bp.desk]: 'clamp(22px, 1.88vw, 34px)', [bp.phone]: 26 } },
  lead: { fontSize: 16, lineHeight: 1.4, color: colors.muted, marginTop: 6, maxWidth: 640, textWrap: 'pretty' },
  iconed: { gap: 7, paddingInlineStart: 13 },
});
