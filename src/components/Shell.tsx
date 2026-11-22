'use client';
import { useEffect, useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import { COMPANY } from '@/lib/data';
import { useScrolledPast } from '@/lib/hooks';
import { SITE } from '@/lib/site';
import { SECTIONS, useGoTo, useStore, type Tab } from '@/lib/store';
import { bp, colors, ease } from '@/styles/tokens.stylex';
import { Mark } from './Logo';

const NAV: { tab: Tab; id: string; label: string }[] = [...SECTIONS.filter((x) => x.id !== 'agents'), { tab: 'agents', id: 'worth', label: 'Worth' }, { tab: 'agents', id: 'ledger', label: 'Ledger' }];

export function Header() {
  const { waiting, tab } = useStore();
  const go = useGoTo();
  const past = useScrolledPast(40);
  const [here, setHere] = useState('today');
  useEffect(() => {
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (window.scrollY < 80) return setHere('today');
        const end = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
        const seen = ['limit', 'worth', 'ledger'].filter((id) => (document.getElementById(id)?.getBoundingClientRect().top ?? 1e9) < window.innerHeight * 0.4);
        setHere(end ? 'ledger' : seen[seen.length - 1] ?? 'today');
      });
    };
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', on); };
  }, []);
  return (
    <header {...stylex.props(s.header)}>
      <a href="#today" aria-label={SITE.name} {...stylex.props(s.brand)} onClick={(e) => { e.preventDefault(); go('today', 'today'); }}><Mark /><span {...stylex.props(s.word)}>{SITE.name}</span></a>
      <span aria-hidden="true" {...stylex.props(s.compact, past && s.compactOn)}>{SECTIONS.find((x) => x.tab === tab)!.label}</span>
      <nav aria-label="Sections" {...stylex.props(s.nav)}>
        {NAV.map((n) => <a key={n.id} href={`#${n.id}`} aria-current={here === n.id ? 'location' : undefined} onClick={(e) => { e.preventDefault(); go(n.tab, n.id); }} {...stylex.props(s.link, here === n.id && s.linkOn)}>{n.label}{n.id === 'decide' && waiting > 0 && <span {...stylex.props(s.count)}>{waiting}</span>}</a>)}
      </nav>
      <span {...stylex.props(s.who)}>{COMPANY}</span>
      <span {...stylex.props(s.date, past && s.dateOff)}>Monday, November 23</span>
    </header>
  );
}

const ICONS: Record<Tab, React.ReactNode> = {
  today: <path d="M12 3a9 9 0 1 0 9 9M12 3v9h9A9 9 0 0 0 12 3Z" />,
  decide: <path d="M4 11.5C4 6 6 4 12 4s8 2 8 7.5S18 19 12 19H5.5L4 20.5ZM9 12l2.2 2.2L15.5 10" />,
  limit: <path d="M5 20v-5M12 20v-8M19 20v-10.5M3 5h4M10 5h4M17 5h4" />,
  agents: <path d="M4 6.5h16M4 12h16M4 17.5h10" />,
};
export function TabBar() {
  const { tab, waiting } = useStore();
  const go = useGoTo();
  return (
    <nav aria-label="Tabs" {...stylex.props(s.tabs)}>
      {SECTIONS.map((x) => (
        <button key={x.tab} type="button" aria-current={tab === x.tab ? 'page' : undefined} onClick={() => go(x.tab, x.id)} {...stylex.props(s.tab, tab === x.tab && s.tabOn)}>
          <span {...stylex.props(s.icon)}><svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={tab === x.tab ? 1.9 : 1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{ICONS[x.tab]}</svg>{x.tab === 'decide' && waiting > 0 && <span {...stylex.props(s.badge)}>{waiting}</span>}</span>
          {x.label}
        </button>
      ))}
    </nav>
  );
}

export function Toast() {
  const { toast, undo, dismiss } = useStore();
  const id = toast?.id;
  useEffect(() => { if (!id) return; const t = setTimeout(dismiss, 7000); return () => clearTimeout(t); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [id]);
  return <div role="status" {...stylex.props(s.toastWrap)}>{toast && <div key={toast.id} {...stylex.props(s.toast)}><span>{toast.message}</span><button type="button" onClick={undo} {...stylex.props(s.undo)}>Undo</button></div>}</div>;
}

const up = stylex.keyframes({ from: { opacity: 0, translate: '0 12px' }, to: { opacity: 1, translate: '0 0' } });
const s = stylex.create({
  header: { position: 'sticky', top: 0, zIndex: 30, height: { default: 64, [bp.phone]: 'calc(48px + env(safe-area-inset-top))' }, paddingTop: { default: 0, [bp.phone]: 'env(safe-area-inset-top)' }, paddingInline: { default: 28, [bp.desk]: 36, [bp.phone]: 20 }, display: 'flex', alignItems: 'center', gap: { default: 20, [bp.desk]: 32 }, backgroundColor: colors.ground },
  brand: { display: 'flex', alignItems: 'center', gap: 10 },
  word: { fontSize: 19, letterSpacing: '-0.02em', display: { default: 'inline', [bp.phone]: 'none' } },
  compact: { display: { default: 'none', [bp.phone]: 'block' }, position: 'absolute', left: '50%', translate: '-50% 0', fontSize: 17, fontWeight: 500, opacity: 0, transitionProperty: 'opacity', transitionDuration: '180ms' },
  compactOn: { opacity: 1 },
  nav: { display: { default: 'flex', [bp.phone]: 'none' }, gap: { default: 18, [bp.desk]: 26 }, marginInlineEnd: 'auto' },
  link: { color: { default: colors.muted, ':hover': colors.ink }, display: 'inline-flex', gap: 6, minHeight: 40, alignItems: 'center' },
  linkOn: { color: colors.ink },
  count: { color: colors.hotDeep },
  who: { display: { default: 'none', '@media (min-width: 1000px)': 'inline' } },
  date: { color: colors.muted, fontSize: { default: 15, [bp.phone]: 14 }, marginInlineStart: { default: 0, [bp.phone]: 'auto' }, whiteSpace: 'nowrap', transitionProperty: 'opacity', transitionDuration: '180ms' },
  dateOff: { opacity: { default: 1, [bp.phone]: 0 } },
  tabs: { display: { default: 'none', [bp.phone]: 'grid' }, gridTemplateColumns: 'repeat(4, 1fr)', position: 'fixed', insetInline: 0, bottom: 0, zIndex: 40, paddingBottom: 'env(safe-area-inset-bottom)', backgroundColor: 'rgba(250,250,249,0.88)', backdropFilter: 'blur(20px)', borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: colors.line },
  tab: { height: 54, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, fontSize: 11, color: colors.muted },
  tabOn: { color: colors.ink },
  icon: { position: 'relative' },
  badge: { position: 'absolute', top: -4, insetInlineStart: 17, minWidth: 18, height: 18, paddingInline: 5, borderRadius: 9, backgroundColor: colors.hotDeep, color: '#fff', fontSize: 11, lineHeight: '18px', textAlign: 'center' },
  toastWrap: { position: 'fixed', zIndex: 50, insetInline: 16, bottom: { default: 24, [bp.phone]: 'calc(68px + env(safe-area-inset-bottom))' }, display: 'grid', justifyItems: 'center', pointerEvents: 'none' },
  toast: { pointerEvents: 'auto', backgroundColor: colors.ink, color: '#fff', borderRadius: 24, paddingInlineStart: 20, paddingInlineEnd: 8, paddingBlock: 6, display: 'flex', gap: 14, alignItems: 'center', animationName: up, animationDuration: '320ms', animationTimingFunction: ease.out, maxWidth: 560 },
  undo: { minHeight: 36, paddingInline: 12, color: '#FFB9A6', flexShrink: 0 },
});
