export const SITE = {
  name: 'Purser',
  tagline: 'What your AI agents spend, and what they may do without asking.',
  author: { name: 'Rakibul Islam', url: 'https://rakibulism.space' },
} as const;
const host = process.env.NEXT_PUBLIC_SITE_URL ?? (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:3252');
export const siteUrl = host;
