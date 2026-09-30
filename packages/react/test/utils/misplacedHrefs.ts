// Elements `href` is valid on. `use` is SVG's, which `Icon` renders.
const LINK_TAGS = new Set(['a', 'area', 'base', 'link', 'use'])

// The tag of every element in `html` that carries `href` but can't take it. See
// `href.matrix.spec.tsx` for the rule, and `test/ssr/render.spec.tsx`, which checks every story.
export function misplacedHrefs(html: string): string[] {
  return [...html.matchAll(/<([a-z][\w-]*)\b[^>]*?\shref="/gi)]
    .map((match) => match[1]!.toLowerCase())
    .filter((tag) => !LINK_TAGS.has(tag))
}
