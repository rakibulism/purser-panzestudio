import type { Metadata } from 'next';
import { Ledger } from '@/components/Ledger';
import { Band, Page } from '@/components/Page';
import { LedgerTitle } from '@/components/Titles';

export const metadata: Metadata = { title: 'Ledger | Purser' };
export default function LedgerPage() { return <Page><Band><LedgerTitle /></Band><Band tone="paper" grow><Ledger /></Band></Page>; }
