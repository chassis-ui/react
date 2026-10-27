import { ElementType, isValidElement, ReactElement, ReactNode } from 'react'

import { devWarning } from './devWarning'
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

type SlottedElement = ReactElement<Record<string, unknown>>

// The element the `Slot` of the render function now running stands in for. A host element's
// `Slot` carries its kind, which can't change without the element changing. A component element's
// kind follows its `href` and `to`, which come and go, and a `Slot` chosen by them would be a new
// component, remounting the caller's child, each time they did. So component elements share one
// `Slot`, and their kind is read from the element itself while the render function runs.
let slotted: SlottedElement | null = null

// Runs a render function whose `component` is a `Slot` standing in for `element`. Only
// `createPolymorphicComponent` calls it.
export function withSlottedElement<T>(element: SlottedElement | null, render: () => T): T {
  const previous = slotted
  slotted = element
  try {
    return render()
  } finally {
    slotted = previous
  }
}

export function resolveElementKind(component: ElementType): ElementKind {
  if (typeof component === 'string') return kindOfTag(component)
  const kind = (component as SlotLike).slotKind
  // `component` only for the `Slot` of a component element: a tag is never that kind.
  if (kind === 'component' && slotted) return resolveSlottedKind(slotted)
  return kind ?? 'component'
}

// The `id` the caller's `asChild` element carries, which wins over the component's own in the
// `Slot`'s merge. A component that points another element at its own (a dialog title, a context
// menu region) reads it here, while it renders, so the reference names the id that is rendered.
export function resolveSlottedId(component: ElementType): string | undefined {
  if (typeof (component as SlotLike).slotKind !== 'string' || !slotted) return undefined
  const id = slotted.props.id
  return typeof id === 'string' && id !== '' ? id : undefined
}

// The `role` the caller's `asChild` element carries, which wins over the component's own the same
// way. A component whose markup depends on the role (`Button` gives a link `aria-pressed` only
// when it is a button) reads it here; the role in its own props is the fallback.
export function resolveSlottedRole(component: ElementType): string | undefined {
  if (typeof (component as SlotLike).slotKind !== 'string' || !slotted) return undefined
  const role = slotted.props.role
  return typeof role === 'string' && role !== '' ? role : undefined
}

// The HTML tag that gets rendered, for a render function whose markup depends on a tag that has
// no kind of its own (`List` renders `<li>` items only inside a `<ul>`/`<ol>`). `undefined` for a
// component, whose output isn't known.
export function resolveElementTag(component: ElementType): string | undefined {
  return typeof component === 'string' ? component : (component as SlotLike).slotTag
}

// The kind of what a component renders, given the props it renders it with. A component reference
// with a link target (`<Link href="/login">` of Next.js, `<Link to="/login">` of React Router)
// counts as an anchor: router links render an `<a>` and forward what they're given to it, so they
// need the anchor's disabled handling (`aria-disabled`, `tabindex="-1"`, a blocked click), not a
// `disabled` attribute passed through. This holds for the link passed as `component` and for the
// one handed to `asChild` alike. `props` is where `to` is found: a component's remaining props.
export function resolveLinkKind(
  component: ElementType,
  href: unknown,
  props?: Record<string, unknown> | object
): ElementKind {
  const kind = resolveElementKind(component)
  if (kind !== 'component') return kind
  const to = (props as { to?: unknown } | undefined)?.to
  return href != null || to != null ? 'anchor' : kind
}

// The kind of the element a caller handed to `asChild`.
export function resolveSlottedKind(element: SlottedElement): ElementKind {
  return resolveLinkKind(element.type as ElementType, element.props.href, element.props)
}

// The same question asked from outside, by a parent reading a child's props (`List` deciding its
// own tag from its `ListItem`s). `undefined` when the child chose nothing and renders its default.
export function resolveKindFromProps(props: {
  asChild?: boolean
  children?: ReactNode
  component?: ElementType
  href?: string
  to?: unknown
}): ElementKind | undefined {
  const child = props.asChild ? resolveLazy(props.children) : undefined
  if (isValidElement<Record<string, unknown>>(child)) return resolveSlottedKind(child)
  if (props.component !== undefined) return resolveLinkKind(props.component, props.href, props)
  return hasHref(props.href) ? 'anchor' : undefined
}

// One rule for `href`, followed by every component that accepts one:
//
// - The element is `component`, or the `asChild` element, when one is given. Otherwise `href` makes
//   it an `<a>`, and without `href` the component renders its own default (`linkElement`).
// - `href` reaches the rendered element only when that element can take it: an `<a>`, or a
//   component reference, which is trusted to take it (a router link does). A `<button>`, an `<li>`
//   or any other tag never gets one, and in development the component says so (`hrefProps`).
// - A component reference given `href` or `to` is a link, and is handled as an anchor
//   (`resolveLinkKind`).
//
// An empty string is set: `href=""` is a link to the current document.
export const hasHref = (href: string | null | undefined): href is string => href != null

export function linkElement(
  component: ElementType | undefined,
  href: string | undefined,
  fallback: ElementType
): ElementType {
  return component ?? (hasHref(href) ? 'a' : fallback)
}

export function hrefProps(
  kind: ElementKind,
  href: string | undefined,
  displayName: string
): { href?: string } {
  if (!hasHref(href)) return {}
  if (kind === 'anchor' || kind === 'component') return { href }
  devWarning(
    true,
    `${displayName}: \`href\` was ignored, because the element it renders isn't a link. Leave ` +
      `out \`component\` to render an <a>, or pass a link as \`component\` or as the \`asChild\` ` +
      `element.`
  )
  return {}
}

export const isInteractiveKind = (kind: ElementKind | undefined): boolean =>
  kind === 'anchor' || kind === 'button'
