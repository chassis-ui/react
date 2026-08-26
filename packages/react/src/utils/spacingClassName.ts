import { Spacing } from '../types'

// A spacing prop (`gap`/`rowGap`/`gutter`/...) is typed `Spacing | 0`, but `0` is meaningful
// (chassis-css's `gap-0` etc. exist) while `undefined`/`false`-ish values mean "not set" — a
// plain truthy check would drop `0`, so every caller needs this same `typeof` guard instead.
// Shared by `Flex`, `Stack`, `Row`, and `CardBody`'s own `layoutClassNames`/`_className` builders,
// which otherwise duplicated it once per spacing prop (`gap`, `rowGap`, `columnGap`, `gutter`,
// `gutterX`, `gutterY`, ...).
export const spacingClassName = (
  base: string,
  value: Spacing | 0 | undefined,
  prefix = ''
): string | null =>
  typeof value === 'string' || typeof value === 'number' ? `${prefix}${base}-${value}` : null
