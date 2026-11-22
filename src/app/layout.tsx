import type { Metadata, Viewport } from 'next';
import { Host_Grotesk } from 'next/font/google';
import * as stylex from '@stylexjs/stylex';
import { Shell } from '@/components/Shell';
import { SITE, siteUrl } from '@/lib/site';
import { StoreProvider } from '@/lib/store';
import { themeScript } from '@/lib/theme';
import { darkTheme } from '@/styles/themes';
import { colors, fonts } from '@/styles/tokens.stylex';
import './globals.css';

const sans = Host_Grotesk({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: `Overview | ${SITE.name}`,
  description: SITE.tagline,
  authors: [SITE.author],
  creator: SITE.author.name,
  publisher: SITE.author.name,
  openGraph: { title: SITE.name, description: SITE.tagline, siteName: SITE.name, type: 'website' },
  twitter: { card: 'summary_large_image', title: SITE.name, description: SITE.tagline },
  appleWebApp: { capable: true, title: SITE.name, statusBarStyle: 'default' },
};
export const viewport: Viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover' };

const s = stylex.create({ body: { backgroundColor: colors.ground, color: colors.ink, fontFamily: fonts.sans } });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-US" className={sans.variable} suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: themeScript(stylex.props(darkTheme).className ?? '') }} /></head>
      <body {...stylex.props(s.body)}><StoreProvider><Shell>{children}</Shell></StoreProvider></body>
    </html>
  );
}
