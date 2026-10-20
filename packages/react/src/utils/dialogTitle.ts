import { isValidElement, ReactNode } from 'react'

import { isElementOfType, resolveLazy } from './lazyElement'

export interface DialogTitleLookup {
  /** The dialog itself: a title inside a nested one of the same kind labels that one instead. */
  dialog: object
  /** The id the title takes when it has none of its own (the dialog's context `titleId`). */
  generatedId: string
  /** The dialog's title part (`ModalTitle`, `DrawerTitle`). */
  title: object
}

const ownId = (id: unknown): string | undefined =>
  typeof id === 'string' && id !== '' ? id : undefined

// The id the title found here renders, as the title works it out: the `asChild` element's own
// `id`, the title's `id`, or the generated one. An empty `id` is rendered and registers nothing.
function renderedTitleId(props: Record<string, unknown>, generatedId: string): string | undefined {
  if (props.asChild) {
    const child = resolveLazy(props.children)
    const slottedId = isValidElement(child)
      ? ownId((child.props as { id?: unknown }).id)
      : undefined
    if (slottedId) return slottedId
  }
  if (props.id === '') return undefined
  return ownId(props.id) ?? generatedId
}

// The title a dialog renders, read from its children before they render, for the HTML a server
// sends: a title registers its id from a layout effect (`useDialogTitle`), which a server never
// runs, and a server can't otherwise know whether a title renders or under what id. This finds a
// title written among the children, at any depth of the elements given, and returns the id it
// will have. A title that a component renders by itself, not one it is given, isn't found: the
// dialog then has no `aria-labelledby` until hydration, which is a missing name for that moment
// and never a reference to an id the HTML doesn't hold.
//
// Children are read as `CONVENTIONS.md` "Reading children" asks: lazy nodes and lazy types are
// resolved, so a dialog composed in a Server Component finds its title too. Anything that isn't
// an element is passed over; a child that is still loading suspends the dialog, as it does every
// component that reads its children.
export function findDialogTitleId(
  children: ReactNode,
  lookup: DialogTitleLookup
): string | undefined {
  const pending: unknown[] = [children]
  while (pending.length > 0) {
    const node = resolveLazy(pending.shift())
    if (Array.isArray(node)) {
      pending.unshift(...node)
      continue
    }
    if (!isValidElement(node)) continue
    const props = node.props as Record<string, unknown>
    if (isElementOfType(node, lookup.dialog)) continue
    if (isElementOfType(node, lookup.title)) return renderedTitleId(props, lookup.generatedId)
    pending.unshift(props.children)
  }
  return undefined
}
