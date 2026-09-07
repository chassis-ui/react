import { HTMLAttributes, ReactElement, Ref, version as reactVersion } from 'react'

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

export const asTriggerElement = (element: ReactElement): TriggerElement => element as TriggerElement

// React 19 turned `ref` into an ordinary prop; before that it lived on the element itself and was
// stripped out of `props`. React 19's development build installs a warning getter on
// `element.ref`, so this reads only the location that's correct for the React actually running
// rather than probing both and tripping that warning on every trigger that has no ref at all.
const REF_LIVES_IN_PROPS = parseInt(reactVersion, 10) >= 19

export const getTriggerRef = (element: TriggerElement): Ref<HTMLElement> | undefined =>
  REF_LIVES_IN_PROPS ? element.props.ref : (element as { ref?: Ref<HTMLElement> }).ref
