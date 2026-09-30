import { HTMLAttributes, ReactElement, Ref } from 'react'

import { resolveLazy } from './lazyElement'

/**
 * `Popover`/`Tooltip` both take their trigger as a single `ReactElement` child and re-render it
 * with `cloneElement`. A bare `ReactElement` types its props as `unknown`, which makes
 * `cloneElement`'s config `Partial<unknown> & Attributes` — no `ref`, no event handlers, nothing
 * to merge against. This is the narrowed view both components read the child through.
 *
 * Kept internal: each component's own public `children: ReactElement` stays as-is, so a caller
 * can still pass any element without having to satisfy this shape.
 */
export type TriggerElementProps = HTMLAttributes<HTMLElement> & { ref?: Ref<HTMLElement> }

export type TriggerElement = ReactElement<TriggerElementProps>

// A Server Component's trigger can arrive as a lazy node, which has no `props` to read (see
// `./lazyElement`): it is resolved first, which suspends the component while it is still loading.
export const asTriggerElement = (element: ReactElement): TriggerElement =>
  resolveLazy(element) as TriggerElement

// React 19 made `ref` an ordinary prop, and its development build warns on reading `element.ref`.
export const getTriggerRef = (element: TriggerElement): Ref<HTMLElement> | undefined =>
  element.props.ref
