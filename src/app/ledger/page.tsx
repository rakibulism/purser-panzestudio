import type { Metadata } from 'next';
import { Ledger } from '@/components/Ledger';
import { Page } from '@/components/Page';
import { PageHead } from '@/components/ui';
import { usd } from '@/lib/format';
import { SPENT } from '@/lib/model';

export const metadata: Metadata = { title: 'Ledger | Purser' };
export default function LedgerPage() { return <Page><PageHead title={`Who spent the ${usd(SPENT)}`} sub="Open an agent to see single runs." /><Ledger /></Page>; }
