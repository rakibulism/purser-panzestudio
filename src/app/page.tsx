import * as stylex from '@stylexjs/stylex';
import { Caught } from '@/components/Caught';
import { Landing, WheelTitle } from '@/components/Landing';
import { TeamsBrief } from '@/components/Ledger';
import { LimitChart } from '@/components/LimitChart';
import { RequestsBrief } from '@/components/Requests';
import { Wheel } from '@/components/Wheel';
import { WorthBrief } from '@/components/Worth';
import { bp, colors } from '@/styles/tokens.stylex';

/** One screen: the answer on top, then every block the month turns on. */
export default function Overview() {
  return (
    <div {...stylex.props(s.grid)}>
      <div {...stylex.props(s.tile, s.landing)}><Landing /></div>
      <div {...stylex.props(s.tile, s.wheel)}><WheelTitle /><div {...stylex.props(s.wheelBox)}><Wheel /></div></div>
      <div {...stylex.props(s.tile, s.paper, s.limit)}><LimitChart brief /></div>
      <div {...stylex.props(s.tile, s.paper, s.requests)}><RequestsBrief /></div>
      <div {...stylex.props(s.tile, s.worth)}><WorthBrief /></div>
      <div {...stylex.props(s.tile, s.paper, s.teams)}><TeamsBrief /></div>
      <div {...stylex.props(s.tile, s.sage, s.caught)}><Caught brief /></div>
    </div>
  );
}

const hair = { borderStyle: 'solid', borderColor: colors.line } as const;
const s = stylex.create({
  grid: {
    display: 'grid',
    minHeight: { default: 0, [bp.desk]: '100svh' },
    gridTemplateColumns: { default: 'minmax(0, 1fr)', [bp.tabUp]: 'minmax(0, 1fr) minmax(0, 1fr)', [bp.desk]: 'minmax(0, 34fr) minmax(0, 36fr) minmax(312px, 30fr)' },
    gridTemplateRows: { default: 'none', [bp.tabUp]: 'auto minmax(420px, auto) minmax(360px, auto) 280px', [bp.desk]: 'auto minmax(300px, 1fr) minmax(224px, 0.42fr)' },
  },
  tile: { paddingInline: { default: 24, [bp.phone]: 20 }, paddingBlock: { default: 18, '@media (min-width: 1200px) and (max-height: 879px)': 14, [bp.phone]: 22 }, minWidth: 0, minHeight: 0, ...hair, borderWidth: 0, borderTopWidth: 1 },
  paper: { backgroundColor: colors.paper },
  sage: { backgroundColor: colors.sage, borderTopColor: colors.sage },
  landing: { gridColumn: '1 / -1', borderTopWidth: 0, paddingTop: { default: 24, [bp.phone]: 2 }, paddingBottom: { default: 20, [bp.phone]: 22 } },
  wheel: { display: 'flex', flexDirection: 'column', gap: 4, order: { default: 0, [bp.phone]: 2 }, paddingBottom: 8 },
  wheelBox: { flex: 1, minHeight: 0, height: { default: 0, [bp.phone]: 'auto' }, aspectRatio: { default: 'auto', [bp.phone]: '1' }, marginInline: { default: 0, [bp.phone]: -10 } },
  limit: { order: { default: 0, [bp.tabUp]: 1, [bp.desk]: 0, [bp.phone]: 3 } },
  requests: { borderInlineStartWidth: { default: 1, [bp.phone]: 0 }, order: { default: 0, [bp.phone]: 1 } },
  worth: { order: { default: 0, [bp.tabUp]: 2, [bp.desk]: 0, [bp.phone]: 5 } },
  teams: { order: { default: 0, [bp.tabUp]: 3, [bp.desk]: 0, [bp.phone]: 6 } },
  caught: { order: { default: 0, [bp.tabUp]: 4, [bp.desk]: 0, [bp.phone]: 4 } },
});
