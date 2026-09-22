import {
  ComponentPropsWithoutRef,
  ComponentPropsWithRef,
  createElement,
  ElementType,
  ForwardRefRenderFunction,
  forwardRef,
  Ref
} from 'react'

import { devWarning } from './devWarning'
import { getSlotChild, Slot, SlotProvider } from './slot'

// Ref type inferred from a polymorphic component's currently-selected `component` element type.
export type PolymorphicRef<C extends ElementType> = ComponentPropsWithRef<C>['ref']

/**
 * Ref type for a polymorphic component that can also pick its element from a prop *other* than
 * `component` — `Button`, `Chip`, `Avatar`, `NavbarBrand` and `PaginationItem` all render an
 * `<a>` when given `href`, and `PaginationItem` a `<span>` when `active`, none of which moves `C`
 * off its default. A plain `PolymorphicRef<C>` describes only the `component` branch, so a caller
 * holding a ref for the element that actually gets rendered (`<Button href="/x" ref={anchorRef}>`)
 * got a spurious type error while the runtime happily populated it.
 *
 * `Ref` over the *union* rather than a union of `Ref`s is what makes a
 * `createRef<HTMLButtonElement | HTMLAnchorElement>()` assignable here: `RefObject` is invariant
 * in its type argument, so `RefObject<A | B>` satisfies `Ref<A | B>` but neither `Ref<A>` nor
 * `Ref<B>` on its own.
 */
export type PolymorphicRefWithFallback<C extends ElementType, Fallback extends HTMLElement> =
  PolymorphicRef<C> | Ref<Fallback>

/**
 * The `asChild` prop every polymorphic component accepts alongside `component` — see
 * `createPolymorphicComponent` below for how it's implemented once for all of them.
 */
export interface AsChildProps {
  /**
   * Render the single child element in place of this component's own element, with this
   * component's classes, props and ref merged onto it: `<Button asChild><Link href="/login">Log
   * in</Link></Button>`. The alternative to `component` for React Server Components — an element
   * can be passed from the server to this package's client components, a component reference
   * (`component={Link}`) can't.
   */
  asChild?: boolean
}

/**
 * Props for a polymorphic component: `OwnProps` (which must declare `component?: C`) plus
 * whatever props `C` itself accepts, minus any name already claimed by `OwnProps` so the two
 * don't conflict. Lets consumers swap `component` for e.g. a framework's `Image` and get full
 * type-checking/autocomplete for that component's own props at the call site.
 */
export type PolymorphicComponentProps<C extends ElementType, OwnProps extends object> = OwnProps &
  AsChildProps &
  Omit<ComponentPropsWithoutRef<C>, keyof OwnProps | keyof AsChildProps>

/**
 * Wraps a polymorphic component's render function in `forwardRef` and stamps `displayName` — the
 * two-step wiring every polymorphic component in this library repeats identically. `T` is the
 * fully generic component type (e.g. `ButtonComponent`) that `forwardRef`'s own return type can't
 * express, since `forwardRef` only accepts a non-generic render function — the caller still casts
 * the render function to a concrete `Element`-typed instance before passing it in here.
 *
 * Also implements `asChild` for every polymorphic component at once (#23): the render function
 * gets `component={Slot}` and the child element's own children, so it computes its classes,
 * props and ref exactly as it would for any component reference (`component={Link}`) — `Slot`
 * then clones the caller's child element with all of that merged on (see `./slot`). No render
 * function needs to know `asChild` exists.
 */
export function createPolymorphicComponent<T>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render: ForwardRefRenderFunction<Element, any>,
  displayName: string
): T {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Component = forwardRef<Element, any>(({ asChild, ...props }, ref) => {
    const child = asChild ? getSlotChild(props.children, displayName) : null
    if (!child) return render(props, ref)

    devWarning(
      props.component !== undefined,
      `${displayName}: both \`asChild\` and \`component\` were passed; \`asChild\` wins and ` +
        `\`component\` is ignored.`
    )

    return createElement(
      SlotProvider,
      { value: child },
      render(
        { ...props, component: Slot, children: (child.props as PropsWithChildren).children },
        ref
      )
    )
  }) as unknown as T & { displayName?: string }
  Component.displayName = displayName
  return Component
}

type PropsWithChildren = { children?: unknown }
