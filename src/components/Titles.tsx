'use client';
import { useStore } from '@/lib/store';
import { PageHead } from './ui';

export function RequestsTitle() {
  const { waiting } = useStore();
  return <PageHead title={waiting === 0 ? 'Nothing is waiting on you' : `${waiting === 1 ? 'One agent is' : waiting === 2 ? 'Two agents are' : 'Three agents are'} waiting on you`} sub={waiting === 0 ? 'New requests land here as agents reach the edge of their authority.' : 'Pull the amount down, or refuse and see what happens instead.'} />;
}
