import { SPACING } from '../../types'

const SPACING_TOKENS = new Set<string>(SPACING)

// `Spacing` tokens map to the matching `--cx-space-*` custom property; anything else (a raw CSS
// value, e.g. `"1rem"` or `".25rem 1rem"`) passes through unchanged.
export const resolveGap = (gap: string) =>
  SPACING_TOKENS.has(gap) ? `var(--cx-space-${gap})` : gap
