import type { Metadata } from 'next';
import { LimitChart } from '@/components/LimitChart';
import { Band, Page } from '@/components/Page';
import { PageTitle } from '@/components/ui';

export const metadata: Metadata = { title: 'Limit | Purser' };
export default function LimitPage() { return <Page><Band><PageTitle lead="Drag the limit." rest="See who stops, when, and what is left undone." /></Band><Band tone="paper" grow><LimitChart /></Band></Page>; }
