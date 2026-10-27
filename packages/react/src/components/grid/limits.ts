import { devWarning } from '../../utils/devWarning'

// chassis-css generates the placement and template classes for twelve columns and six rows
// (grid.mdx, "Placement classes stop at twelve columns and six rows"): past them, a class names
// no rule, and a count that isn't a whole number from 1 up names none at any size.
export const GRID_COLUMNS = 12
export const GRID_ROWS = 6

export const isCount = (value: unknown, max = Infinity): value is number =>
  typeof value === 'number' && Number.isInteger(value) && value >= 1 && value <= max

/**
 * Whether chassis-css has a class for a placement value: a word (`'full'`, `'auto'`), or a whole
 * number from 1 to `max`. For any other value the component renders none, with a development
 * warning, as `CardImage` and `Skeleton` render none for a value without a rule. The component
 * spells the class itself, so the Tailwind sweep (`test/utils/tailwindClassNames.spec.tsx`)
 * reads its template.
 */
export const hasPlacementClass = (
  component: 'Grid' | 'GridItem',
  prop: string,
  value: number | string,
  base: string,
  max: number
): boolean => {
  const hasRule = typeof value === 'string' || isCount(value, max)
  devWarning(
    !hasRule,
    `${component}: \`${prop}\` has no class to render for ${JSON.stringify(value)}: ` +
      `@chassis-ui/css has \`${base}-1\` to \`${base}-${max}\`, so the value does nothing.`
  )
  return hasRule
}
