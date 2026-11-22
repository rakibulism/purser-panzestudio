import type { ReactNode } from 'react';
import * as stylex from '@stylexjs/stylex';
import { sageScope } from '@/styles/themes';
import { bp, colors, SHORT, space } from '@/styles/tokens.stylex';

/** The one surface everything sits on: same padding, same radius, everywhere. */
export function Card({ tone = 'paper', children, style }: { tone?: 'paper' | 'sage'; children: ReactNode; style?: stylex.StyleXStyles }) {
  return <div {...stylex.props(s.card, s[tone], style)} style={tone === 'sage' ? sageScope : undefined}>{children}</div>;
}

/** A full page: heading, then cards on the shared gutter. */
export const Page = ({ children }: { children: ReactNode }) => <div {...stylex.props(s.page)}>{children}</div>;
export const Columns = ({ children, kind = 'even' }: { children: ReactNode; kind?: 'even' | 'lead' | 'thirds' }) => <div {...stylex.props(s.columns, s[kind])}>{children}</div>;

const s = stylex.create({
  card: { borderRadius: { default: 16, [bp.phone]: 18 }, padding: { default: space.card, [SHORT.q]: 16, [bp.phone]: 16 }, minWidth: 0, minHeight: 0 },
  paper: { backgroundColor: colors.paper },
  sage: { backgroundColor: colors.sage, color: colors.ink },
  page: { display: 'flex', flexDirection: 'column', gap: { default: space.gutter, [bp.phone]: 12 }, padding: { default: space.page, [bp.phone]: 16 }, paddingTop: { default: space.page, [bp.phone]: 0 } },
  columns: { display: 'grid', gap: { default: space.gutter, [bp.phone]: 12 } },
  even: { gridTemplateColumns: { default: 'minmax(0, 1fr)', '@media (min-width: 1000px)': 'repeat(2, minmax(0, 1fr))' } },
  lead: { gridTemplateColumns: { default: 'minmax(0, 1fr)', '@media (min-width: 1000px)': 'minmax(0, 2fr) minmax(0, 1fr)' } },
  thirds: { gridTemplateColumns: { default: 'minmax(0, 1fr)', '@media (min-width: 1000px)': 'repeat(3, minmax(0, 1fr))' } },
});
