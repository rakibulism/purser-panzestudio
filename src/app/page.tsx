import * as stylex from '@stylexjs/stylex';
import { Caught } from '@/components/Caught';
import { Landing, MoneyMeter, MonthMeter, WheelHead } from '@/components/Landing';
import { TeamsBrief } from '@/components/Ledger';
import { LimitChart } from '@/components/LimitChart';
import { Card } from '@/components/Page';
import { RequestsBrief } from '@/components/Requests';
import { Wheel } from '@/components/Wheel';
import { WorthBrief } from '@/components/Worth';
import { bp, SHORT, space } from '@/styles/tokens.stylex';

/** One screen on one grid: three equal columns, three rows, one gutter. */
export default function Overview() {
  return (
    <div {...stylex.props(s.grid)}>
      <div {...stylex.props(s.landing)}><Landing /></div>
      <Card style={s.money}><MoneyMeter /></Card>
      <Card style={s.month}><MonthMeter /></Card>
      <Card style={s.wheel}><WheelHead /><div {...stylex.props(s.wheelBox)}><div {...stylex.props(s.wheelIn)}><Wheel /></div></div></Card>
      <Card style={s.limit}><LimitChart brief /></Card>
      <Card style={s.requests}><RequestsBrief /></Card>
      <Card style={s.worth}><WorthBrief /></Card>
      <Card style={s.teams}><TeamsBrief /></Card>
      <Card tone="sage" style={s.caught}><Caught brief /></Card>
    </div>
  );
}

const s = stylex.create({
  grid: {
    display: 'grid',
    gap: { default: space.gutter, [SHORT.q]: '12px', [bp.phone]: '12px' },
    padding: { default: space.page, [SHORT.q]: '16px', [bp.phone]: '16px' },
    paddingTop: { default: space.page, [SHORT.q]: '16px', [bp.phone]: '0px' },
    minHeight: { default: 0, [bp.desk]: '100svh' },
    gridTemplateColumns: { default: 'minmax(0, 1fr)', [bp.tabUp]: 'repeat(2, minmax(0, 1fr))', [bp.desk]: 'repeat(3, minmax(0, 1fr))' },
    gridTemplateRows: { default: 'none', '@media (min-width: 768px) and (max-width: 1199px)': 'auto auto minmax(460px, auto) minmax(360px, auto) minmax(260px, auto)', [SHORT.tall]: 'auto minmax(0, 1fr) clamp(250px, 29svh, 320px)', [SHORT.q]: 'auto minmax(0, 1fr) 214px' },
  },
  landing: { gridColumn: { default: 'auto', [bp.tabUp]: '1 / -1', [bp.desk]: 'auto' }, alignSelf: 'center' },
  money: { order: { default: 0, [bp.phone]: 1 } },
  month: { order: { default: 0, [bp.phone]: 2 } },
  wheel: { display: 'flex', flexDirection: 'column', gap: 12, order: { default: 0, [bp.phone]: 4 } },
  wheelBox: { position: 'relative', flex: { default: 1, [bp.phone]: 'none' }, minHeight: 0, height: { default: 0, [bp.phone]: 'auto' }, aspectRatio: { default: 'auto', [bp.phone]: '1' }, marginInline: { default: 0, [bp.phone]: -8 } },
  wheelIn: { position: { default: 'absolute', [bp.phone]: 'static' }, inset: 0 },
  requests: { order: { default: 0, [bp.phone]: 3 } },
  limit: { order: { default: 0, [bp.tabUp]: 1, [bp.desk]: 0, [bp.phone]: 5 } },
  worth: { order: { default: 0, [bp.tabUp]: 2, [bp.desk]: 0, [bp.phone]: 7 } },
  teams: { order: { default: 0, [bp.tabUp]: 3, [bp.desk]: 0, [bp.phone]: 8 } },
  caught: { order: { default: 0, [bp.tabUp]: 4, [bp.desk]: 0, [bp.phone]: 6 } },
});
