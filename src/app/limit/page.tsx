import type { Metadata } from 'next';
import { LimitChart } from '@/components/LimitChart';
import { Page } from '@/components/Page';
import { PageHead } from '@/components/ui';

export const metadata: Metadata = { title: 'Limit | Purser' };
export default function LimitPage() { return <Page><PageHead title="The limit for November" sub="Move it, and see who stops, when, and what is left undone." /><LimitChart /></Page>; }
