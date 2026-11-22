import * as stylex from '@stylexjs/stylex';

export const bp = stylex.defineConsts({
  phone: '@media (max-width: 767px)',
  tabUp: '@media (min-width: 768px)',
  desk: '@media (min-width: 1200px)',
  wide: '@media (min-width: 1600px)',
  hover: '@media (hover: hover)',
});

/** Short laptop screens, where the Overview still has to fit. */
export const SHORT = stylex.defineConsts({ q: '@media (min-width: 1200px) and (max-height: 879px)', tall: '@media (min-width: 1200px) and (min-height: 880px)' });

/** One spacing scale: 4, 8, 12, 16, 20, 24. */
export const space = stylex.defineConsts({ page: '24px', gutter: '16px', card: '20px' });

export const colors = stylex.defineVars({
  // Surfaces
  ground: '#EAEAE9',
  paper: '#FFFFFF',
  raised: '#FFFFFF',
  tabbar: 'rgba(250,250,249,0.9)',
  scrim: 'rgba(23,23,26,0.32)',
  rowHover: 'rgba(23,23,26,0.025)',
  // Text and lines
  ink: '#17171A',
  muted: '#5E5E5C',
  line: '#D6D6D3',
  lineStrong: 'rgba(23,23,26,0.28)',
  inkHover: '#3A3A3E',
  onInk: '#FFFFFF',
  undo: '#FFB9A6',
  // Hot: money spent
  hot: '#FF461D',
  onHot: '#17171A',
  hotText: '#BF2E0B',
  badge: '#BF2E0B',
  onBadge: '#FFFFFF',
  rose: '#F79DB0',
  fieldMid: '#FC7270',
  fieldEnd: '#FE5C41',
  part2: '#F3927F',
  part3: '#E7B3A8',
  // Charts
  tick: '#E0E0DE',
  bar: '#DFE2DE',
  barSoft: '#EBEEEA',
  track: '#E6E6E4',
  pace: '#8B8B88',
  fill2: '#FF7F63',
  fill3: '#F9BDB0',
  fill4: '#F6DDD8',
  over2: '#FF6238',
  onFill: '#17171A',
  radarOld: '#D6D6D4',
  radarIn: '#CDCDCB',
  axis: '#6E6E6B',
  // Sage: authority
  sage: '#94AA95',
  onSage: '#17171A',
  onSageSoft: '#2B3A2F',
  sageLine: 'rgba(23,23,26,0.28)',
  askTop: '#C6D5C7',
  askEnd: '#94AA95',
  mayTop: '#94AA95',
  mayEnd: '#4F6F5B',
  rail: '#DADAD8',
  thumb: '#FFFFFF',
  grab: '#DADAD8',
});

export const fonts = stylex.defineVars({ sans: 'var(--font-sans), system-ui, sans-serif' });
export const ease = stylex.defineVars({ out: 'cubic-bezier(0.22, 1, 0.36, 1)' });
