import {
  ComponentPropsWithoutRef,
  ComponentPropsWithRef,
  ElementType,
  ForwardRefRenderFunction,
  forwardRef
} from 'react'

// Ref type inferred from a polymorphic component's currently-selected `component` element type.
export type PolymorphicRef<C extends ElementType> = ComponentPropsWithRef<C>['ref']

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
