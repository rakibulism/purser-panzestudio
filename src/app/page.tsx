import * as stylex from '@stylexjs/stylex';
import { SITE } from '@/lib/site';

// Holding page. The look is decided before any dashboard UI is built here.
const styles = stylex.create({
  main: { padding: 32, fontFamily: 'system-ui, sans-serif' },
});

export default function Page() {
  return (
    <main {...stylex.props(styles.main)}>
      <h1>{SITE.name}</h1>
      <p>{SITE.tagline}</p>
    </main>
  );
}
