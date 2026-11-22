import type { ReactNode } from 'react';
import * as stylex from '@stylexjs/stylex';
import { bp, colors } from '@/styles/tokens.stylex';

/** Flush bands for the full pages. */
export function Band({ tone = 'ground', grow = false, children }: { tone?: 'ground' | 'paper' | 'sage'; grow?: boolean; children: ReactNode }) {
  return <div {...stylex.props(s.band, s[tone], grow && s.grow)}>{children}</div>;
}
export const Page = ({ children }: { children: ReactNode }) => <div {...stylex.props(s.page)}>{children}</div>;

const s = stylex.create({
  page: { display: 'flex', flexDirection: 'column', minHeight: { default: '100svh', [bp.phone]: 'calc(100svh - 160px)' } },
  band: { paddingInline: { default: 28, [bp.desk]: 36, [bp.phone]: 20 }, paddingBlock: { default: 32, [bp.phone]: 22 }, minWidth: 0 },
  grow: { flex: 1 },
  ground: {},
  paper: { backgroundColor: colors.paper },
  sage: { backgroundColor: colors.sage },
});
