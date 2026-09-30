// Attributes whose value is a list of ids of other elements in the document.
const ID_REFERENCES = [
  'aria-activedescendant',
  'aria-controls',
  'aria-describedby',
  'aria-errormessage',
  'aria-labelledby',
  'aria-owns',
  'for'
]

// Every id reference in `html` to an element that isn't in it, and every such attribute written
// empty, as `<tag attribute="id">`. A server's HTML with one points assistive technology at
// nothing until the page has hydrated, if ever; html-validate's `no-missing-references` reports it.
export function danglingReferences(html: string): string[] {
  const ids = new Set([...html.matchAll(/\sid="([^"]*)"/g)].map((match) => match[1]))
  const found: string[] = []
  for (const tag of html.matchAll(/<([a-z][\w-]*)\b[^>]*>/gi)) {
    for (const [, name, value] of tag[0].matchAll(/\s([a-z-]+)="([^"]*)"/g)) {
      if (!ID_REFERENCES.includes(name!)) continue
      const missing = value!.trim() === '' ? [''] : value!.split(/\s+/).filter((id) => !ids.has(id))
      for (const id of missing) found.push(`<${tag[1]} ${name}="${id}">`)
    }
  }
  return found
}
