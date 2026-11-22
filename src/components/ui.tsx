import type { ButtonHTMLAttributes, ReactNode } from 'react';
import * as stylex from '@stylexjs/stylex';
import { bp, colors } from '@/styles/tokens.stylex';

export function Button({ kind = 'solid', children, ...rest }: { kind?: 'solid' | 'line' } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'style'>) {
  return <button type="button" {...rest} {...stylex.props(s.base, kind === 'solid' ? s.solid : s.lined)}>{children}</button>;
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

export function Two({ lead, rest }: { lead: ReactNode; rest: ReactNode }) {
  return <>{lead} <span {...stylex.props(s.rest)}>{rest}</span></>;
}

const s = stylex.create({
  base: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: { default: 40, [bp.phone]: 48 }, paddingInline: 18, borderRadius: 999, fontSize: 15, fontWeight: 450, lineHeight: 1.2, textAlign: 'center', transitionProperty: 'background-color, color, border-color, scale', transitionDuration: '160ms', scale: { default: 1, ':active': 0.97 }, opacity: { default: 1, ':disabled': 0.4 }, cursor: { default: 'pointer', ':disabled': 'default' } },
  solid: { backgroundColor: { default: colors.ink, ':hover': { default: colors.ink, '@media (hover: hover)': '#3A3A3E' } }, color: '#FFFFFF' },
  lined: { borderWidth: 1, borderStyle: 'solid', borderColor: { default: 'rgba(23,23,26,0.28)', ':hover': colors.ink }, color: colors.ink },
  ticks: { display: 'flex', gap: 3, width: '100%' },
  tick: { flex: 1, minWidth: 2, borderRadius: 3, transitionProperty: 'background-color', transitionDuration: '300ms' },
  rest: { color: colors.muted },
});
