import { ImageResponse } from 'next/og';
import { Mark } from '@/components/Logo';
import { AGENTS } from './data';
import { wedge } from './geometry';
import { usd } from './format';
import { SPENT, forecast, spentBy } from './model';
import { SITE } from './site';
import { HEX } from '@/styles/brand';

export const OG_SIZE = { width: 1200, height: 630 };
const STEP = (Math.PI * 2) / AGENTS.length;
const r = (v: number) => 108 + v * 150;

/** The social card: the sentence the product opens with, beside the real wheel. */
export function renderOgCard() {
  const landing = forecast(200_000).landing;
  return new ImageResponse(
    <div style={{ width: '100%', height: '100%', display: 'flex', background: HEX.ground, color: HEX.ink }}>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: 600, padding: '64px 0 64px 72px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 38 }}><Mark size={48} />{SITE.name}</div>
        <div style={{ display: 'flex', flexDirection: 'column', fontSize: 58, letterSpacing: -2, lineHeight: 1.14 }}>
          <div style={{ display: 'flex' }}>November lands</div>
          <div style={{ display: 'flex' }}>at {usd(landing)}.</div>
          <div style={{ display: 'flex', color: HEX.muted }}>Your AI agents</div>
          <div style={{ display: 'flex', color: HEX.muted }}>are over by {usd(landing - 200_000)}.</div>
        </div>
      </div>
      <div style={{ display: 'flex', position: 'relative', width: 600, height: 630, alignItems: 'center', justifyContent: 'center' }}>
        <svg width="560" height="560" viewBox="-280 -280 560 560">
          <defs>
            <radialGradient id="f" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="258"><stop offset="0.38" stopColor={HEX.hot} /><stop offset="0.52" stopColor="#FF7F63" /><stop offset="0.74" stopColor="#F9BDB0" /><stop offset="0.94" stopColor="#F6DDD8" /></radialGradient>
          </defs>
          {AGENTS.map((a, i) => {
            const v = spentBy(a.id) / a.limit;
            const fill = v > 1 ? HEX.hot : 'url(#f)';
            return [
              <path key={`t${a.id}`} d={wedge(i * STEP, (i + 1) * STEP, 108, 258, 13, 3)} fill={HEX.track} stroke={HEX.track} strokeWidth={26} strokeLinejoin="round" />,
              <path key={a.id} d={wedge(i * STEP, (i + 1) * STEP, 108, r(v), 13, 3)} fill={fill} stroke={fill} strokeWidth={26} strokeLinejoin="round" />,
            ];
          })}
          <circle r="84" fill={HEX.hot} />
        </svg>
        <div style={{ position: 'absolute', display: 'flex', fontSize: 32, letterSpacing: -1 }}>{usd(SPENT)}</div>
      </div>
    </div>,
    OG_SIZE,
  );
}
