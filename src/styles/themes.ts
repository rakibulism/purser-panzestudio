import type React from 'react';
import * as stylex from '@stylexjs/stylex';
import { colors } from './tokens.stylex';

/** Dark steps are chosen for the dark canvas. They are not an automatic flip. */
export const darkTheme = stylex.createTheme(colors, {
  ground: '#141110',
  paper: '#23201F',
  raised: '#2D2927',
  tabbar: 'rgba(19,16,15,0.9)',
  scrim: 'rgba(8,5,4,0.62)',
  rowHover: 'rgba(255,236,226,0.04)',
  ink: '#F0ECE9',
  muted: '#AEA8A5',
  line: '#403B38',
  lineStrong: 'rgba(241,236,232,0.34)',
  inkHover: '#D6CFCC',
  onInk: '#181514',
  undo: '#AA2E10',
  hot: '#FF461D',
  onHot: '#130D0A',
  hotText: '#FF7757',
  badge: '#FF7757',
  onBadge: '#130D0A',
  rose: '#F08CA1',
  part2: '#EE8A74',
  part3: '#F4C4B8',
  tick: '#423D3B',
  bar: '#5E5956',
  barSoft: '#3A3533',
  track: '#3A3634',
  pace: '#A39D9A',
  fill2: '#C2361F',
  fill3: '#AC3121',
  fill4: '#7E2A20',
  over2: '#FF6B45',
  onFill: '#F4EFED',
  radarOld: '#3D3836',
  radarIn: '#4C4644',
  axis: '#A9A3A0',
  sage: '#3F5242',
  onSage: '#F2F4EE',
  onSageSoft: '#BFD0C1',
  sageLine: 'rgba(238,246,239,0.38)',
  askTop: '#435346',
  askEnd: '#354337',
  mayTop: '#8FAA93',
  mayEnd: '#69866E',
  rail: '#4C4644',
  thumb: '#23201F',
  grab: '#A39D9A',
  fieldMid: '#FC7270',
  fieldEnd: '#FE5C41',
});

const nameOf = (v: string) => v.slice(4, -1);

/**
 * Inside a sage card, text and outlines come from sage's own steps, in either theme.
 * Set as plain custom properties: a StyleX theme would put every other color back to light.
 */
export const sageScope = { [nameOf(colors.ink)]: colors.onSage, [nameOf(colors.muted)]: colors.onSageSoft, [nameOf(colors.lineStrong)]: colors.sageLine } as React.CSSProperties;
