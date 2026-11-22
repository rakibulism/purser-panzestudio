/** Rounded so the server and the browser print the same digits. */
const tidy = (n: number) => Math.round(n * 100) / 100 + 0;
const pt = (r: number, a: number): [number, number] => [tidy(r * Math.sin(a)), tidy(-r * Math.cos(a))];
const f = (n: number) => n.toFixed(2);
export const at = pt;

/**
 * A wedge from r0 to r1, inset by `round` so a round-joined stroke of 2×round gives it soft corners.
 * Edges run parallel to their neighbors, so the gap between wedges stays even.
 */
export function wedge(a0: number, a1: number, r0: number, r1: number, round: number, gap: number) {
  const d = round + gap / 2;
  const half = (a1 - a0) / 2;
  const inner = Math.max(r0 + round, d / Math.sin(half) + 0.5);
  const outer = Math.max(inner + 0.5, r1 - round);
  const edge = (r: number) => Math.asin(Math.min(1, d / r));
  const [x1, y1] = pt(inner, a0 + edge(inner));
  const [x2, y2] = pt(outer, a0 + edge(outer));
  const [x3, y3] = pt(outer, a1 - edge(outer));
  const [x4, y4] = pt(inner, a1 - edge(inner));
  return `M${f(x1)} ${f(y1)}L${f(x2)} ${f(y2)}A${f(outer)} ${f(outer)} 0 0 1 ${f(x3)} ${f(y3)}L${f(x4)} ${f(y4)}A${f(inner)} ${f(inner)} 0 0 0 ${f(x1)} ${f(y1)}Z`;
}

export function arc(r: number, a0: number, a1: number) {
  const [x0, y0] = pt(r, a0);
  const [x1, y1] = pt(r, a1);
  return `M${f(x0)} ${f(y0)}A${f(r)} ${f(r)} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${f(x1)} ${f(y1)}`;
}

export const polygon = (radii: number[]) => `M${radii.map((r, i) => pt(r, (i / radii.length) * Math.PI * 2).map(f).join(' ')).join('L')}Z`;

/** A squircle resting on y = 0, centered on x = 0. */
export function squircle(w: number, h: number, n = 3.6) {
  const pts = Array.from({ length: 72 }, (_, i) => {
    const t = (i / 72) * Math.PI * 2;
    const c = Math.cos(t), s = Math.sin(t);
    const x = (Math.sign(c) * Math.pow(Math.abs(c), 2 / n) * w) / 2;
    const y = (Math.sign(s) * Math.pow(Math.abs(s), 2 / n) * h) / 2 - h / 2;
    return `${f(x)} ${f(y)}`;
  });
  return `M${pts.join('L')}Z`;
}
