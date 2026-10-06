import { SPACING } from '../../types'

const SPACING_TOKENS = new Set<string>(SPACING)

// A `Spacing` token is chassis-css's own `gap-{token}` utility, which a breakpoint prefix makes
// responsive. Anything else (a raw CSS value, e.g. `"1rem"` or `".25rem 1rem"`) has no class and
// goes to the `--cx-grid-gap` custom property instead: see `gapValue`.
export const gapClassName = (gap: string | undefined, prefix = ''): string | null =>
  gap !== undefined && SPACING_TOKENS.has(gap) ? `${prefix}gap-${gap}` : null

export const gapValue = (gap: string | undefined): string | undefined =>
  gap !== undefined && !SPACING_TOKENS.has(gap) ? gap : undefined
