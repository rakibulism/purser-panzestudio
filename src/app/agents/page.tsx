import type { Metadata } from 'next';
import { Caught } from '@/components/Caught';
import { Card, Page } from '@/components/Page';
import { PageHead } from '@/components/ui';
import { Worth } from '@/components/Worth';

export const metadata: Metadata = { title: 'Agents | Purser' };
export default function AgentsPage() { return <Page><PageHead title="Six agents cost less than what they replaced" sub="Two cost more, and they stop first when the money runs short." /><Worth /><Card tone="sage"><Caught /></Card></Page>; }
