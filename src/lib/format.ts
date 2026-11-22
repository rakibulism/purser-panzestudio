const whole = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
const cents = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
const count = new Intl.NumberFormat('en-US');
export const usd = (n: number) => whole.format(n);
export const usdc = (n: number) => cents.format(n);
export const num = (n: number) => count.format(n);
export const pct = (n: number) => `${Math.round(n * 100)}%`;
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
/** November 1, 2026 is a Sunday. */
export const weekday = (d: number) => DAYS[(d - 1) % 7];
export const onDay = (d: number) => `${weekday(d)} the ${d}${d % 10 === 1 && d !== 11 ? 'st' : d % 10 === 2 && d !== 12 ? 'nd' : d % 10 === 3 && d !== 13 ? 'rd' : 'th'}`;
const WORDS = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight'];
export const word = (n: number) => WORDS[n];
export const cap = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);
/** Names up to two agents, counts the rest. */
export const whoStops = (names: string[]) => (names.length > 2 ? `${word(names.length)} agents` : andList(names));
export const andList = (xs: string[]) => (xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`);
