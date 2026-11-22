import type { Metadata } from 'next';
import { SITE } from '@/lib/site';
import './globals.css';

export const metadata: Metadata = {
  title: `Overview | ${SITE.name}`,
  description: SITE.tagline,
  authors: [SITE.author],
  creator: SITE.author.name,
  publisher: SITE.author.name,
  robots: { index: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-US">
      <body>{children}</body>
    </html>
  );
}
