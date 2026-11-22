import { wedge } from '@/lib/geometry';
import { HEX } from '@/styles/brand';

/** Three even shares and one that reaches past its ring. */
const Q = Math.PI / 2;
export const MARK = [1, 2, 3].map((i) => wedge(i * Q - Q, i * Q, 0, 10, 2, 1.3)).map((d) => d);
export const MARK_HOT = wedge(-Q, 0, 0, 13.5, 2, 1.3);

export function Mark({ size = 26, ink = 'currentColor', hot = HEX.hot }: { size?: number; ink?: string; hot?: string }) {
  return (
    <svg width={size} height={size} viewBox="-13.5 -13.5 24 24" aria-hidden="true">
      {MARK.map((d) => <path key={d} d={d} fill={ink} stroke={ink} strokeWidth={4} strokeLinejoin="round" />)}
      <path d={MARK_HOT} fill={hot} stroke={hot} strokeWidth={4} strokeLinejoin="round" />
    </svg>
  );
}
