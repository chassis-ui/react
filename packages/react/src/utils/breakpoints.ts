import { Breakpoint, ContainerBreakpoint } from '../types'

// Mobile-first ascending order. Every responsive layout prop (`Flex`/`Stack`/`Grid`/`GridItem`/
// `Skeleton`'s `responsive`) keys its overrides by these literal chassis-css breakpoint names.
export const BREAKPOINTS: Breakpoint[] = ['sm', 'md', 'lg', 'xl', '2xl']

// The keys of chassis-css's container-query classes (`@md:col-span-4`), which follow the width of
// the nearest query container where a breakpoint class follows the viewport. Only `Grid` and
// `GridItem` take them.
export const CONTAINER_BREAKPOINTS: ContainerBreakpoint[] = ['@sm', '@md', '@lg', '@xl', '@2xl']

// Viewport keys first: chassis-css writes its container rules after every breakpoint rule, so
// the container class wins on an element both apply to, and the class list reads in that order.
export const GRID_BREAKPOINTS: Array<Breakpoint | ContainerBreakpoint> = [
  ...BREAKPOINTS,
  ...CONTAINER_BREAKPOINTS
]

// A width in twelfths of the parent: a count, `'auto'` for the natural width, or `true` to fill
// the rest of a flex row. `Skeleton` maps it to chassis-css's width utilities.
export type WidthSpan = 'auto' | number | string | boolean

/**
 * Builds the class list for a component's base layout plus per-breakpoint overrides supplied via
 * a `responsive` prop — the pattern shared by `Flex`, `Stack`, `Grid` and `GridItem`.
 *
 * `toClassNames` maps one breakpoint's layout value to class name fragments for a given prefix
 * (`''` for the base/unprefixed case, `` `${breakpoint}:` `` otherwise). Falsy entries in its
 * return value are fine — `classnames` drops them at the call site — so fields the layout object
 * doesn't set can just map to `undefined`/`false`.
 *
 * `keys` is the list of keys read from `responsive`, in class order: the viewport breakpoints
 * unless the component also takes the container ones (`GRID_BREAKPOINTS`).
 */
export function buildResponsiveClassNames<TLayout>(
  toClassNames: (layout: TLayout, prefix: string) => Array<string | false | null | undefined>,
  base: TLayout,
  responsive?: Partial<Record<Breakpoint | ContainerBreakpoint, TLayout>>,
  keys: ReadonlyArray<Breakpoint | ContainerBreakpoint> = BREAKPOINTS
): Array<string | false | null | undefined> {
  const responsiveClassNames = responsive
    ? keys
        .filter((bp) => responsive[bp])
        .flatMap((bp) => toClassNames(responsive[bp] as TLayout, `${bp}:`))
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
