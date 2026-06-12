/**
 * Shiki transformer that wraps every highlighted <pre> in the Ground Control
 * terminal chrome: window dots, a filename/lang title, and a copy chip. The
 * faint grid, drifting scanlines, and low-glow cyan are layered on by CSS
 * (`.gc-terminal` in tailwind.css). Title comes from the fence meta, e.g.
 *
 *   ```ts title="src/content.config.ts"
 *
 * falling back to the language.
 */

// Minimal hast element helpers (kept untyped to avoid a hard shiki type dep).
type El = { type: 'element'; tagName: string; properties: Record<string, unknown>; children: El[] };
const el = (tagName: string, className?: string[], children: unknown[] = []): El => ({
  type: 'element',
  tagName,
  properties: className ? { className } : {},
  children: children as El[],
});
const text = (value: string) => ({ type: 'text', value });

export function transformerTerminal() {
  return {
    name: 'gc:terminal-chrome',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    root(this: any, root: { children: any[] }) {
      const pre = root.children.find((n) => n?.type === 'element' && n.tagName === 'pre');
      if (!pre) return;

      const raw: string = this.options?.meta?.__raw ?? '';
      const match = /title=(?:"([^"]+)"|'([^']+)')/.exec(raw);
      const title = match?.[1] ?? match?.[2] ?? this.options?.lang ?? 'text';

      const head = el(
        'div',
        ['gc-term-head'],
        [
          el('span', ['gc-term-dot', 'r']),
          el('span', ['gc-term-dot', 'y']),
          el('span', ['gc-term-dot', 'g']),
          el('span', ['gc-term-title'], [text(String(title))]),
          {
            type: 'element',
            tagName: 'span',
            properties: { className: ['gc-term-copy'], 'data-gc-copy': '' },
            children: [text('copy')],
          },
        ]
      );

      root.children = [el('div', ['gc-terminal'], [head, pre])];
    },
  };
}
