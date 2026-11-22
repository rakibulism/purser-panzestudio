'use client';
import * as stylex from '@stylexjs/stylex';
import { Caught } from '@/components/Caught';
import { Landing, WheelNote } from '@/components/Landing';
import { Ledger } from '@/components/Ledger';
import { LimitChart } from '@/components/LimitChart';
import { Requests } from '@/components/Requests';
import { RunSheet } from '@/components/RunSheet';
import { Header, TabBar, Toast } from '@/components/Shell';
import { Wheel } from '@/components/Wheel';
import { Worth } from '@/components/Worth';
import { SECTIONS, useStore } from '@/lib/store';
import { bp, colors } from '@/styles/tokens.stylex';

export default function Page() {
  const { tab } = useStore();
  const on = (t: typeof tab) => (tab === t ? null : s.phoneOff);
  return (
    <>
      <Header />
      <main {...stylex.props(s.main)}>
        <p aria-hidden="true" {...stylex.props(s.large)}>{SECTIONS.find((x) => x.tab === tab)!.label}</p>
        <div id="today" {...stylex.props(s.first)}>
          <div {...stylex.props(s.tile, s.landing, on('today'))}><Landing /></div>
          <div {...stylex.props(s.tile, s.wheel, on('today'))}><div {...stylex.props(s.wheelIn)}><div {...stylex.props(s.wheelBox)}><Wheel /></div><WheelNote /></div></div>
          <div {...stylex.props(s.tile, s.paper, s.requests, on('decide'))}><Requests /></div>
        </div>
        <div {...stylex.props(s.second)}>
          <div {...stylex.props(s.tile, s.paper, on('limit'))}><LimitChart /></div>
          <div {...stylex.props(s.tile, s.sage, on('today'))}><Caught /></div>
        </div>
        <div id="agents" {...stylex.props(s.tile, s.worth, on('agents'))}><Worth /></div>
        <div {...stylex.props(s.tile, s.paper, s.ledger, on('agents'))}><Ledger /></div>
      </main>
      <TabBar />
      <RunSheet />
      <Toast />
    </>
  );
}

const s = stylex.create({
  main: { paddingBottom: { default: 0, [bp.phone]: 'calc(54px + env(safe-area-inset-bottom))' }, minHeight: { default: 0, [bp.phone]: 'calc(100dvh - 48px)' } },
  large: { display: { default: 'none', [bp.phone]: 'block' }, fontSize: 34, fontWeight: 500, letterSpacing: '-0.03em', lineHeight: 1.1, paddingInline: 20, paddingTop: 6, paddingBottom: 12 },
  phoneOff: { display: { default: 'block', [bp.phone]: 'none' } },
  tile: { paddingInline: { default: 28, [bp.desk]: 36, [bp.phone]: 20 }, paddingBlock: { default: 36, [bp.phone]: 24 }, minWidth: 0 },
  first: { display: 'grid', gridTemplateColumns: { default: '1fr', [bp.tabUp]: '1fr 1fr', [bp.desk]: 'minmax(300px, 27fr) minmax(0, 44fr) minmax(384px, 29fr)' }, minHeight: { default: 0, [bp.desk]: 'calc(100svh - 64px)' } },
  landing: { gridColumn: { default: 'auto', [bp.tabUp]: '1 / -1', [bp.desk]: 'auto' }, paddingTop: { default: 24, [bp.phone]: 4 } },
  wheelIn: { display: 'flex', flexDirection: 'column', justifyContent: { default: 'flex-start', [bp.desk]: 'center' }, height: '100%', gap: { default: 8, [bp.phone]: 0 } },
  wheel: { paddingInline: { default: 20, [bp.phone]: 10 }, paddingBlock: { default: 20, [bp.phone]: 0 } },
  wheelBox: { width: '100%', maxWidth: 760, marginInline: 'auto', aspectRatio: '1' },
  paper: { backgroundColor: colors.paper },
  requests: { paddingTop: { default: 28, [bp.phone]: 24 }, minHeight: { default: 0, [bp.phone]: 'calc(100dvh - 160px)' } },
  second: { display: 'grid', gridTemplateColumns: { default: 'minmax(0, 1fr)', [bp.desk]: 'minmax(0, 71fr) minmax(384px, 29fr)' } },
  sage: { backgroundColor: colors.sage },
  worth: { paddingBlock: { default: 56, [bp.phone]: 12 } },
  ledger: { paddingBlock: { default: 56, [bp.phone]: 28 } },
});
