/* Invented company, invented numbers. Every total on screen is summed from these rows. */
export type AgentId = 'claims' | 'fraud' | 'answers' | 'renewals' | 'reading' | 'notes' | 'recoveries' | 'code';
export type Agent = { id: AgentId; name: string; lines: [string, string]; team: string; limit: number; rate: number; before: number; unit: number; job: string; jobs: string; steps: string[]; runs: [string, string, number][] };

export const COMPANY = 'Fernhollow Mutual';
export const TODAY = 23; // Monday, November 23, 2026. Data runs through Sunday the 22nd.
export const LAST = TODAY - 1;
export const MONTH_DAYS = 30;
export const START_LIMIT = 200_000;

/** rate: dollars on a normal weekday. unit: cost of one finished job. before: cost of that job before agents. */
export const AGENTS: Agent[] = [
  { id: 'claims', name: 'Claims intake', lines: ['Claims', 'intake'], team: 'Claims', limit: 46_000, rate: 1900, unit: 3.8, before: 11.2, job: 'claim', jobs: 'claims', steps: ['Read the claim form and photos', 'Checked the policy and the deductible', 'Wrote the estimate and set the reserve'], runs: [['Sun 11:52 PM', 'Kitchen leak, Maple Court', 4.06], ['Sun 11:38 PM', 'Hail on a garage roof', 3.41], ['Sun 11:20 PM', 'Stolen bicycle', 2.88], ['Sun 10:57 PM', 'Tree through a fence', 4.22]] },
  { id: 'fraud', name: 'Fraud review', lines: ['Fraud', 'review'], team: 'Claims', limit: 28_500, rate: 1150, unit: 9.2, before: 14.5, job: 'review', jobs: 'reviews', steps: ['Compared the claim with past losses', 'Checked the photo dates and locations', 'Scored the claim and gave its reasons'], runs: [['Sun 11:44 PM', 'Two claims, same photo', 11.75], ['Sun 11:02 PM', 'Late-reported injury', 9.1], ['Sun 10:31 PM', 'New policy, early loss', 8.64], ['Sun 9:48 PM', 'Invoice with altered total', 9.93]] },
  { id: 'answers', name: 'Policy answers', lines: ['Policy', 'answers'], team: 'Service', limit: 37_000, rate: 1700, unit: 0.68, before: 4.1, job: 'question', jobs: 'questions', steps: ['Found the policyholder’s wording', 'Wrote an answer from that wording', 'Checked the answer before sending it'], runs: [['Sun 11:59 PM', 'Is a rental car covered?', 0.61], ['Sun 11:57 PM', 'Change of address', 0.38], ['Sun 11:55 PM', 'Adding a teen driver', 0.92], ['Sun 11:51 PM', 'What counts as flood?', 0.84]] },
  { id: 'renewals', name: 'Renewals', lines: ['Renewals', ''], team: 'Service', limit: 20_000, rate: 820, unit: 4.1, before: 5.6, job: 'renewal', jobs: 'renewals', steps: ['Compared this year with last year', 'Priced the renewal inside its limits', 'Sent the offer and logged the reply'], runs: [['Sun 8:14 PM', 'Home policy, 6-year customer', 4.48], ['Sun 7:52 PM', 'Two-car household', 3.97], ['Sun 7:30 PM', 'Landlord policy', 5.06], ['Sun 6:59 PM', 'Condo policy', 3.2]] },
  { id: 'reading', name: 'Document reading', lines: ['Document', 'reading'], team: 'Operations', limit: 27_000, rate: 1400, unit: 0.56, before: 0.38, job: 'document', jobs: 'documents', steps: ['Scanned the pages', 'Pulled out names, dates and amounts', 'Filed the document to its claim'], runs: [['Sun 3:12 AM', 'Survey file, 212 pages (stopped)', 4112], ['Sat 11:58 PM', 'Plumber’s invoice', 0.44], ['Sat 11:56 PM', 'Medical bill, 9 pages', 0.97], ['Sat 11:55 PM', 'Police report', 0.71]] },
  { id: 'notes', name: 'Underwriting notes', lines: ['Underwriting', 'notes'], team: 'Underwriting', limit: 18_500, rate: 980, unit: 19.6, before: 16, job: 'note', jobs: 'notes', steps: ['Gathered the inspection and loss history', 'Drafted the risk note', 'Marked what an underwriter must check'], runs: [['Sun 5:40 PM', 'Bakery with a gas line', 22.15], ['Sun 4:12 PM', 'Warehouse, sprinklers out of date', 19.04], ['Sun 2:33 PM', 'Lake house, seasonal', 17.6], ['Sun 1:05 PM', 'Auto shop, new owner', 20.88]] },
  { id: 'recoveries', name: 'Recoveries', lines: ['Recoveries', ''], team: 'Claims', limit: 13_000, rate: 540, unit: 27, before: 96, job: 'recovery', jobs: 'recoveries', steps: ['Found who was at fault', 'Built the demand from the claim file', 'Negotiated within its authority'], runs: [['Sun 6:21 PM', 'Contractor’s burst pipe', 31.4], ['Sun 3:50 PM', 'Rear-end collision', 24.75], ['Sun 12:44 PM', 'Faulty water heater', 28.3], ['Sun 11:18 AM', 'Fallen scaffold', 26.1]] },
  { id: 'code', name: 'Code assistant', lines: ['Code', 'assistant'], team: 'Operations', limit: 10_000, rate: 380, unit: 7.6, before: 12.2, job: 'change', jobs: 'changes', steps: ['Read the ticket and the code around it', 'Wrote the change and its tests', 'Opened it for an engineer to review'], runs: [['Sun 9:26 PM', 'Fix a date on the claim form', 5.9], ['Sun 8:03 PM', 'Faster policy search', 9.45], ['Sun 5:17 PM', 'Remove an unused export', 4.8], ['Sun 3:39 PM', 'Test for late payments', 7.72]] },
];
export const agentById = (id: AgentId) => AGENTS.find((a) => a.id === id)!;

export const USER = { name: 'Tom Keller', role: 'Head of finance', photo: '/people/you.jpg' };
export const TEAMS: { name: string; owner: string; photo: string; you?: boolean }[] = [
  { name: 'Claims', owner: 'Owen Pryce', photo: '/people/owner-1.jpg' },
  { name: 'Service', owner: 'Lukas Brandt', photo: '/people/owner-2.jpg' },
  { name: 'Operations', owner: 'Emre Aydin', photo: '/people/owner-3.jpg' },
  { name: 'Underwriting', owner: 'Tom Keller', photo: '/people/you.jpg', you: true },
];

export type Request = { id: string; agent: AgentId; ask: number; alone: number; step: number; verb: string; title: string; alonePhrase: string; now: string; why: string; ifNo: string; due: string; kind: 'authority' | 'budget' };
export const REQUESTS: Request[] = [
  { id: 'settle', agent: 'recoveries', kind: 'authority', ask: 18_500, alone: 10_000, step: 500, verb: 'settle for', title: 'Recoveries wants to settle for $18,500', alonePhrase: 'it may settle alone', now: 'Up to $10,000 alone', why: 'A contractor’s insurer offered 82% of the $22,560 we paid for a burst pipe. Going to court took 14 months on average last year.', ifNo: 'Owen Pryce’s desk takes over the negotiation and the offer lapses.', due: 'Offer ends today at 5 PM' },
  { id: 'claim', agent: 'claims', kind: 'authority', ask: 6_400, alone: 2_500, step: 100, verb: 'pay', title: 'Claims intake wants to pay a $6,400 claim', alonePhrase: 'it may pay alone', now: 'Up to $2,500 alone', why: 'Kitchen leak at Maple Court. The photos match the plumber’s invoice, and fraud review scored it low risk.', ifNo: 'an adjuster picks it up, and the wait is nine days right now.', due: 'Asked Sunday, 11:52 PM' },
  { id: 'budget', agent: 'answers', kind: 'budget', ask: 40_500, alone: 37_000, step: 500, verb: 'spend', title: 'Policy answers wants $3,500 more for November', alonePhrase: 'its limit today', now: '$37,000 today', why: 'A rate change letter went out on the 16th, and questions have stayed high since. It passes its limit on Friday.', ifNo: 'it stops on Friday the 27th and questions go to the phone team.', due: 'Asked Sunday, 9:05 PM' },
];

export const LOOP = { day: 22, cost: 4112, passes: 6180, from: '12:06 AM', to: '3:12 AM', file: 'survey file, 212 pages', queued: 1012 };
