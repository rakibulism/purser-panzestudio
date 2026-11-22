import type { Metadata } from 'next';
import { Page } from '@/components/Page';
import { Requests } from '@/components/Requests';
import { RequestsTitle } from '@/components/Titles';

export const metadata: Metadata = { title: 'Requests | Purser' };
export default function RequestsPage() { return <Page><RequestsTitle /><Requests /></Page>; }
