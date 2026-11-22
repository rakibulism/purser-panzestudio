import type { Metadata } from 'next';
import { Caught } from '@/components/Caught';
import { Band, Page } from '@/components/Page';
import { Worth } from '@/components/Worth';

export const metadata: Metadata = { title: 'Agents | Purser' };
export default function AgentsPage() { return <Page><Band><Worth /></Band><Band tone="sage" grow><Caught /></Band></Page>; }
