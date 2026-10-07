import { Breakpoint, ContainerBreakpoint, Responsive } from '../types'

// Mobile-first ascending order. Every responsive layout prop (of `Flex`, `Stack`, `Grid`,
// `GridItem`, `Card`, `CardBody`, `CardImage` and `Skeleton`) keys its values by these literal
// chassis-css breakpoint names, after `base`.
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

type ResponsiveKey = Breakpoint | ContainerBreakpoint
type ResponsiveObject<T> = { base?: T } & Partial<Record<ResponsiveKey, T>>
type ClassName = string | false | null | undefined

// No responsive prop takes an object as its plain value, so an object is the per-width form.
const isResponsiveObject = <T>(
  value: Responsive<T, ResponsiveKey> | undefined
): value is ResponsiveObject<T> => typeof value === 'object' && value !== null

/**
 * The value a responsive prop has below the first breakpoint: the plain value, or `base` of the
 * per-width object. A component reads it for what only the base can do, such as a default class
 * or an inline style, which holds no media query.
 */
export const baseValue = <T>(value: Responsive<T, ResponsiveKey> | undefined): T | undefined =>
  isResponsiveObject<T>(value) ? value.base : (value as T | undefined)

/**
 * One responsive prop, ready for `responsiveClassNames` to read at each width.
 */
export type ResponsiveProp = (key: 'base' | ResponsiveKey) => ClassName

/**
 * Pairs a responsive prop with the class it maps to. `toClassName` gets one width's value and
 * its prefix: `''` for the base, `` `${breakpoint}:` `` otherwise. A falsy return is no class.
 */
export const responsiveProp =
  <T>(
    value: Responsive<T, ResponsiveKey> | undefined,
    toClassName: (value: T, prefix: string) => ClassName
  ): ResponsiveProp =>
  (key) => {
    const at = isResponsiveObject<T>(value)
      ? value[key]
      : key === 'base'
        ? (value as T | undefined)
        : undefined

    return at === undefined || at === null ? null : toClassName(at, key === 'base' ? '' : `${key}:`)
  }

/**
 * Builds the class list of a component's responsive props: the base class of every prop first,
 * then the classes of each breakpoint in turn, as in `flex-column gap-sm md:flex-row md:gap-md`.
 *
 * `keys` is the list of keys read from each prop after `base`, in class order: the viewport
 * breakpoints unless the component also takes the container ones (`GRID_BREAKPOINTS`).
 */
export const responsiveClassNames = (
  props: ResponsiveProp[],
  keys: ReadonlyArray<ResponsiveKey> = BREAKPOINTS
): ClassName[] => (['base', ...keys] as const).flatMap((key) => props.map((prop) => prop(key)))

export type FlexDirection = 'row' | 'column'

// The `responsiveProp` class of the `flex-row`/`flex-column` direction toggle shared by `Card`
// and `CardBody`, both of which map a `direction` prop to the same chassis-css class.
export const flexDirectionClassName = (direction: FlexDirection, prefix: string): string =>
  `${prefix}flex-${direction}`
