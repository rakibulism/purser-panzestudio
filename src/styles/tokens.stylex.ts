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
  ground: '#EAEAE9',
  paper: '#FFFFFF',
  track: '#DADAD8',
  tick: '#E0E0DE',
  bar: '#DFE2DE',
  barSoft: '#EBEEEA',
  ink: '#17171A',
  muted: '#5E5E5C',
  line: '#D6D6D3',
  hot: '#FF461D',
  hotDeep: '#BF2E0B',
  rose: '#F79DB0',
  blush: '#FBD8D0',
  sage: '#94AA95',
  sageDeep: '#3F5C48',
  scrim: 'rgba(23,23,26,0.32)',
});

export const fonts = stylex.defineVars({ sans: 'var(--font-sans), system-ui, sans-serif' });
export const ease = stylex.defineVars({ out: 'cubic-bezier(0.22, 1, 0.36, 1)' });
