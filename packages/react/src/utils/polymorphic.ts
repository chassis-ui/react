import { ComponentPropsWithoutRef, ComponentPropsWithRef, ElementType } from 'react'

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
