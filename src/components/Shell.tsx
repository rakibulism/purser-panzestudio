'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import * as stylex from '@stylexjs/stylex';
import { COMPANY, USER } from '@/lib/data';
import { useOutside, useScrolledPast } from '@/lib/hooks';
import { SITE } from '@/lib/site';
import { PLACES, useStore, type Place } from '@/lib/store';
import { bp, colors, ease } from '@/styles/tokens.stylex';
import type { IconSvgElement } from '@hugeicons/react';
import { AiBrain01Icon, DashboardSquare01Icon, InboxCheckIcon, Invoice03Icon, SlidersHorizontalIcon, UndoIcon, UnfoldMoreIcon } from '@hugeicons/core-free-icons';
import { Icon } from './Icon';
import { Mark } from './Logo';
import { RunSheet } from './RunSheet';

const ICONS: Record<Place, IconSvgElement> = { overview: DashboardSquare01Icon, requests: InboxCheckIcon, limit: SlidersHorizontalIcon, agents: AiBrain01Icon, ledger: Invoice03Icon };

/** The signed-in person: photo, name, and a way to put the morning back as it was. */
function User({ phone = false }: { phone?: boolean }) {
  const { reset } = useStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useOutside(open, ref, close);
  return (
    <div ref={ref} {...stylex.props(s.user, phone ? s.userPhone : s.userSide)}>
      <button type="button" aria-expanded={open} aria-haspopup="menu" aria-label={`${USER.name}, account`} onClick={() => setOpen(!open)} {...stylex.props(s.userBtn)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={USER.photo} alt="" width={38} height={38} {...stylex.props(s.photo, phone && s.photoPhone)} />
        {!phone && <span {...stylex.props(s.label, s.userText)}><span>{USER.name}</span><span {...stylex.props(s.sub)}>{USER.role}</span></span>}
        {!phone && <span {...stylex.props(s.label, s.more)}><Icon icon={UnfoldMoreIcon} size={18} /></span>}
      </button>
      {open && (
        <div role="menu" {...stylex.props(s.menu, phone ? s.menuPhone : s.menuSide)}>
          <p {...stylex.props(s.menuHead)}>{USER.name}<span {...stylex.props(s.sub)}>{USER.role}, {COMPANY}</span></p>
          <button type="button" role="menuitem" onClick={() => { reset(); close(); }} {...stylex.props(s.menuItem)}><Icon icon={UndoIcon} size={18} />Undo everything you decided</button>
        </div>
      )}
    </div>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  const path = usePathname();
  const { waiting } = useStore();
  const past = useScrolledPast(40);
  const here = PLACES.find((p) => p.href === path) ?? PLACES[0];
  return (
    <div {...stylex.props(s.frame)}>
      <aside {...stylex.props(s.side)}>
        <Link href="/" aria-label={SITE.name} {...stylex.props(s.brand)}><Mark size={28} /><span {...stylex.props(s.label, s.word)}>{SITE.name}</span></Link>
        <nav aria-label="Main" {...stylex.props(s.nav)}>
          {PLACES.map((p) => {
            const on = p.id === here.id;
            return (
              <Link key={p.id} href={p.href} aria-label={p.label} aria-current={on ? 'page' : undefined} {...stylex.props(s.link, on && s.linkOn)}>
                <span {...stylex.props(s.icon)}><Icon icon={ICONS[p.id]} size={21} stroke={on ? 2 : 1.5} />{p.id === 'requests' && waiting > 0 && <span {...stylex.props(s.badge, s.railBadge)}>{waiting}</span>}</span>
                <span {...stylex.props(s.label)}>{p.label}</span>
                {p.id === 'requests' && waiting > 0 && <span {...stylex.props(s.label, s.count)}>{waiting}</span>}
              </Link>
            );
          })}
        </nav>
        <User />
      </aside>

      <div {...stylex.props(s.page)}>
        <header {...stylex.props(s.top)}>
          <Link href="/" aria-label={SITE.name}><Mark size={26} /></Link>
          <span aria-hidden="true" {...stylex.props(s.compact, past && s.compactOn)}>{here.label}</span>
          <User phone />
        </header>
        <p aria-hidden="true" {...stylex.props(s.large)}>{here.label}</p>
        <main {...stylex.props(s.main)}>{children}</main>
      </div>

      <nav aria-label="Tabs" {...stylex.props(s.tabs)}>
        {PLACES.map((p) => {
          const on = p.id === here.id;
          return <Link key={p.id} href={p.href} aria-current={on ? 'page' : undefined} {...stylex.props(s.tab, on && s.tabOn)}><span {...stylex.props(s.icon)}><Icon icon={ICONS[p.id]} size={25} stroke={on ? 2 : 1.5} />{p.id === 'requests' && waiting > 0 && <span {...stylex.props(s.badge)}>{waiting}</span>}</span>{p.label}</Link>;
        })}
      </nav>
      <RunSheet />
      <Toast />
    </div>
  );
}

function Toast() {
  const { toast, undo, dismiss } = useStore();
  const id = toast?.id;
  useEffect(() => { if (!id) return; const t = setTimeout(dismiss, 7000); return () => clearTimeout(t); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [id]);
  return <div role="status" {...stylex.props(s.toastWrap)}>{toast && <div key={toast.id} {...stylex.props(s.toast)}><span>{toast.message}</span><button type="button" onClick={undo} {...stylex.props(s.undo)}>Undo</button></div>}</div>;
}

const up = stylex.keyframes({ from: { opacity: 0, translate: '0 12px' }, to: { opacity: 1, translate: '0 0' } });
const s = stylex.create({
  frame: { display: 'grid', gridTemplateColumns: { default: '76px minmax(0, 1fr)', [bp.desk]: '212px minmax(0, 1fr)', [bp.phone]: 'minmax(0, 1fr)' }, minHeight: '100svh' },
  side: { display: { default: 'flex', [bp.phone]: 'none' }, flexDirection: 'column', position: 'sticky', top: 0, height: '100svh', paddingBlock: 28, paddingInlineStart: { default: 16, [bp.desk]: 20 }, paddingInlineEnd: { default: 0, [bp.desk]: 4 }, alignItems: { default: 'center', [bp.desk]: 'stretch' }, zIndex: 35 },
  label: { display: { default: 'none', [bp.desk]: 'inline' } },
  brand: { display: 'flex', alignItems: 'center', gap: 10, paddingInline: { default: 0, [bp.desk]: 8 }, marginBottom: 36 },
  word: { fontSize: 20, letterSpacing: '-0.02em' },
  nav: { display: 'flex', flexDirection: 'column', gap: 2 },
  link: { display: 'flex', alignItems: 'center', gap: 12, height: 44, minWidth: 44, justifyContent: { default: 'center', [bp.desk]: 'flex-start' }, paddingInline: { default: 0, [bp.desk]: 8 }, fontSize: 16, color: { default: colors.muted, ':hover': colors.ink } },
  linkOn: { color: colors.ink },
  count: { marginInlineStart: 'auto', color: colors.hotDeep },
  user: { position: 'relative' },
  userSide: { marginTop: 'auto' },
  userPhone: { marginInlineStart: 'auto' },
  userBtn: { display: 'flex', alignItems: 'center', gap: 11, borderRadius: 999, width: '100%' },
  userText: { display: { default: 'none', [bp.desk]: 'flex' }, flexDirection: 'column', lineHeight: 1.25, minWidth: 0 },
  sub: { display: 'block', color: colors.muted, fontSize: 14 },
  photo: { width: 38, height: 38, borderRadius: 999, objectFit: 'cover', flexShrink: 0 },
  photoPhone: { width: 32, height: 32 },
  more: { marginInlineStart: 'auto', color: colors.muted },
  menu: { position: 'absolute', width: 250, backgroundColor: colors.paper, borderWidth: 1, borderStyle: 'solid', borderColor: colors.line, borderRadius: 14, padding: 6, zIndex: 45, animationName: up, animationDuration: '180ms', animationTimingFunction: ease.out },
  menuSide: { bottom: 'calc(100% + 10px)', insetInlineStart: 0 },
  menuPhone: { top: 'calc(100% + 8px)', insetInlineEnd: 0 },
  menuHead: { paddingInline: 12, paddingTop: 8, paddingBottom: 10 },
  menuItem: { display: 'flex', alignItems: 'center', gap: 10, width: '100%', minHeight: 44, paddingInline: 12, borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: colors.line, color: { default: colors.ink, ':hover': colors.hotDeep } },
  page: { minWidth: 0, paddingBottom: { default: 0, [bp.phone]: 'calc(54px + env(safe-area-inset-bottom))' } },
  main: { minWidth: 0 },
  top: { display: { default: 'none', [bp.phone]: 'flex' }, alignItems: 'center', position: 'sticky', top: 0, zIndex: 30, height: 'calc(48px + env(safe-area-inset-top))', paddingTop: 'env(safe-area-inset-top)', paddingInline: 16, backgroundColor: colors.ground },
  compact: { position: 'absolute', left: '50%', translate: '-50% 0', fontSize: 17, fontWeight: 500, opacity: 0, transitionProperty: 'opacity', transitionDuration: '180ms' },
  compactOn: { opacity: 1 },
  large: { display: { default: 'none', [bp.phone]: 'block' }, fontSize: 34, fontWeight: 500, letterSpacing: '-0.03em', lineHeight: 1.1, paddingInline: 16, paddingTop: 4, paddingBottom: 12 },
  tabs: { display: { default: 'none', [bp.phone]: 'grid' }, gridTemplateColumns: 'repeat(5, 1fr)', position: 'fixed', insetInline: 0, bottom: 0, zIndex: 40, paddingBottom: 'env(safe-area-inset-bottom)', backgroundColor: 'rgba(250,250,249,0.9)', backdropFilter: 'blur(20px)', borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: colors.line },
  tab: { height: 54, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, fontSize: 11, color: colors.muted },
  tabOn: { color: colors.ink },
  icon: { position: 'relative', display: 'block' },
  badge: { position: 'absolute', top: -4, insetInlineStart: 16, minWidth: 18, height: 18, paddingInline: 5, borderRadius: 9, backgroundColor: colors.hotDeep, color: '#fff', fontSize: 11, lineHeight: '18px', textAlign: 'center' },
  railBadge: { display: { default: 'block', [bp.desk]: 'none' } },
  toastWrap: { position: 'fixed', zIndex: 50, insetInline: 16, bottom: { default: 20, [bp.phone]: 'calc(68px + env(safe-area-inset-bottom))' }, display: 'grid', justifyItems: 'center', pointerEvents: 'none' },
  toast: { pointerEvents: 'auto', backgroundColor: colors.ink, color: '#fff', borderRadius: 24, paddingInlineStart: 20, paddingInlineEnd: 8, paddingBlock: 6, display: 'flex', gap: 14, alignItems: 'center', animationName: up, animationDuration: '320ms', animationTimingFunction: ease.out, maxWidth: 560 },
  undo: { minHeight: 36, paddingInline: 12, color: '#FFB9A6', flexShrink: 0 },
});
