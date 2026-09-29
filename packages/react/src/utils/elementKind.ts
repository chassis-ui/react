import { ElementType, isValidElement, ReactElement, ReactNode } from 'react'

import { resolveLazy } from './lazyElement'

// What a polymorphic component ends up rendering, as far as its own semantics care:
//
// - `anchor`, `button`, `input`: the native element, which the component gives its full handling
//   (a real `disabled` attribute, or `aria-disabled`/`tabIndex`/a click guard on an anchor).
// - `host`: any other HTML tag, which has no semantics of its own to rely on.
// - `component`: a component reference, trusted to handle its own semantics.
//
// A render function asks `resolveElementKind(Component)` instead of comparing `Component` to a tag
// name, because under `asChild` `Component` is a `Slot` (see `./slot`), not the tag the caller's
// child element renders. The `Slot` carries that element's kind and tag.
export type ElementKind = 'anchor' | 'button' | 'input' | 'host' | 'component'

function kindOfTag(tag: string): ElementKind {
  switch (tag) {
    case 'a':
      return 'anchor'
    case 'button':
      return 'button'
    case 'input':
      return 'input'
    default:
      return 'host'
  }
}

type SlotLike = { slotKind?: ElementKind; slotTag?: string }

export function resolveElementKind(component: ElementType): ElementKind {
  if (typeof component === 'string') return kindOfTag(component)
  return (component as SlotLike).slotKind ?? 'component'
}

// The HTML tag that gets rendered, for a render function whose markup depends on a tag that has
// no kind of its own (`List` renders `<li>` items only inside a `<ul>`/`<ol>`). `undefined` for a
// component, whose output isn't known.
export function resolveElementTag(component: ElementType): string | undefined {
  return typeof component === 'string' ? component : (component as SlotLike).slotTag
}

// The kind of the element a caller handed to `asChild`. A component element with a link target
// (`<Link href="/login">` of Next.js, `<Link to="/login">` of React Router) counts as an anchor:
// router links render an `<a>` and forward what they're given to it, so they need the anchor's
// disabled handling, not a `disabled` attribute passed through.
export function resolveSlottedKind(element: ReactElement<Record<string, unknown>>): ElementKind {
  const kind = resolveElementKind(element.type as ElementType)
  if (kind !== 'component') return kind
  return element.props.href !== undefined || element.props.to !== undefined ? 'anchor' : kind
}

// The same question asked from outside, by a parent reading a child's props (`List` deciding its
// own tag from its `ListItem`s). `undefined` when the child chose nothing and renders its default.
export function resolveKindFromProps(props: {
  asChild?: boolean
  children?: ReactNode
  component?: ElementType
}): ElementKind | undefined {
  const child = props.asChild ? resolveLazy(props.children) : undefined
  if (isValidElement<Record<string, unknown>>(child)) return resolveSlottedKind(child)
  return props.component === undefined ? undefined : resolveElementKind(props.component)
}

export const isInteractiveKind = (kind: ElementKind | undefined): boolean =>
  kind === 'anchor' || kind === 'button'
