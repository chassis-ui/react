import {
  ComponentPropsWithoutRef,
  ComponentPropsWithRef,
  ElementType,
  ForwardRefRenderFunction,
  forwardRef,
  Ref
} from 'react'

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
 * Props for a polymorphic component: `OwnProps` (which must declare `component?: C`) plus
 * whatever props `C` itself accepts, minus any name already claimed by `OwnProps` so the two
 * don't conflict. Lets consumers swap `component` for e.g. a framework's `Image` and get full
 * type-checking/autocomplete for that component's own props at the call site.
 */
export type PolymorphicComponentProps<C extends ElementType, OwnProps extends object> = OwnProps &
  Omit<ComponentPropsWithoutRef<C>, keyof OwnProps>

/**
 * Wraps a polymorphic component's render function in `forwardRef` and stamps `displayName` — the
 * two-step wiring every polymorphic component in this library repeats identically. `T` is the
 * fully generic component type (e.g. `ButtonComponent`) that `forwardRef`'s own return type can't
 * express, since `forwardRef` only accepts a non-generic render function — the caller still casts
 * the render function to a concrete `Element`-typed instance before passing it in here.
 */
export function createPolymorphicComponent<T>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render: ForwardRefRenderFunction<Element, any>,
  displayName: string
): T {
  const Component = forwardRef(render) as unknown as T & { displayName?: string }
  Component.displayName = displayName
  return Component
}
