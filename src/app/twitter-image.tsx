import { renderOgCard } from '@/lib/og-card';
import { SITE } from '@/lib/site';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = `${SITE.name}: ${SITE.tagline}`;
export default function Image() { return renderOgCard(); }
