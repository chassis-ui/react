import { Breakpoint } from '../types'

// Mobile-first ascending order. Every responsive layout prop (`Flex`/`Stack`/`Row`/`Col`/
// `Skeleton`'s `responsive`) keys its overrides by these literal chassis-css breakpoint names.
export const BREAKPOINTS: Breakpoint[] = ['small', 'medium', 'large', 'xlarge', '2xlarge']

// A column/width span: a track count, `'auto'` for a natural-width track, or `true` for the bare
// (no explicit width) case. Shared by `Col` and `Skeleton`, both of which map it to the same
// `col-{n}` / `col` chassis-css classes.
export type Span = 'auto' | number | string | boolean

/**
 * Builds the class list for a component's base layout plus per-breakpoint overrides supplied via
 * a `responsive` prop — the pattern shared by `Flex`, `Stack`, and (from Phase 2) `Row`/`Col`.
 *
 * `toClassNames` maps one breakpoint's layout value to class name fragments for a given prefix
 * (`''` for the base/unprefixed case, `` `${breakpoint}:` `` otherwise). Falsy entries in its
 * return value are fine — `classnames` drops them at the call site — so fields the layout object
 * doesn't set can just map to `undefined`/`false`.
 */
export function buildResponsiveClassNames<TLayout>(
  toClassNames: (layout: TLayout, prefix: string) => Array<string | false | null | undefined>,
  base: TLayout,
  responsive?: Partial<Record<Breakpoint, TLayout>>
): Array<string | false | null | undefined> {
  const responsiveClassNames = responsive
    ? BREAKPOINTS.filter((bp) => responsive[bp]).flatMap((bp) =>
        toClassNames(responsive[bp] as TLayout, `${bp}:`)
      )
    : []

  return [...toClassNames(base, ''), ...responsiveClassNames]
}

export type FlexDirection = 'row' | 'column'

// A `buildResponsiveClassNames` `toClassNames` fn for the `flex-row`/`flex-column` direction
// toggle shared by `Card` and `CardBody`, both of which map a `direction` prop to the same
// chassis-css class.
export const flexDirectionClassNames = (
  direction: FlexDirection | undefined,
  prefix: string
): Array<string | false | undefined> => [direction && `${prefix}flex-${direction}`]
