'use client';
import { SPENT } from '@/lib/model';
import { usd } from '@/lib/format';
import { useStore } from '@/lib/store';
import { PageTitle } from './ui';

export function RequestsTitle() {
  const { waiting } = useStore();
  return <PageTitle lead={waiting === 0 ? 'Nothing is waiting on you.' : `${waiting === 1 ? 'One agent is' : waiting === 2 ? 'Two agents are' : 'Three agents are'} waiting on you.`} rest={waiting === 0 ? 'New requests land here as agents reach the edge of their authority.' : 'Pull the amount down, or refuse and see what happens instead.'} />;
}
export const LedgerTitle = () => <PageTitle lead={`Who spent the ${usd(SPENT)}.`} rest="Open an agent to see single runs." />;
