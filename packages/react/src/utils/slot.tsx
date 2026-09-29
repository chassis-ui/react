import React, {
  cloneElement,
  createContext,
  forwardRef,
  Fragment,
  isValidElement,
  ReactElement,
  ReactNode,
  Ref,
  useContext,
  version
} from 'react'
import { mergeProps } from 'react-aria'

import { useForkedRef } from '../hooks/useForkedRef'
import { devWarning } from './devWarning'
import { ElementKind, resolveSlottedKind } from './elementKind'

// Backs the `asChild` prop every polymorphic component accepts (see `createPolymorphicComponent`).
// The component renders a `Slot` as its `component`; the `Slot` then renders the caller's child
// element in its place, with the props the component computed (className, handlers, ARIA
// attributes, ref) merged onto it.
//
// There is one `Slot` per tag, and two for component elements (a link, anything else), and the
// component gets the one that matches the child. A render function reads the child's kind and
// tag back with `resolveElementKind(Component)`/`resolveElementTag(Component)` (see
// `./elementKind`) and gives a slotted `<a>` the handling it gives `component="a"`. Both travel
// on the component rather than in a prop, so nothing extra can reach the DOM.
//
// The child element travels through context rather than a prop because a render function spreads
// its `rest` props onto `component` in its own way (some filter them, some don't forward every
// one) — context reaches `Slot` no matter how the render function wires it up. `Slot` resets the
// context for its own subtree, so a polymorphic component nested *inside* the child doesn't pick
// up the outer one's element.
type SlotElement = ReactElement<Record<string, unknown>>

const SlotContext = createContext<SlotElement | null>(null)

export const SlotProvider = SlotContext.Provider

// React 19 moved `ref` onto `props` (and warns on reading `element.ref`); React 18 only has
// `element.ref`. The package supports both (`peerDependencies.react: ^18.0.0 || ^19.0.0`).
const REACT_19 = parseInt(version, 10) >= 19

function getElementRef(element: SlotElement): Ref<unknown> | undefined {
  return REACT_19
    ? (element.props as { ref?: Ref<unknown> }).ref
    : (element as unknown as { ref?: Ref<unknown> }).ref
}

// `Record` rather than a declared prop list: `Slot` forwards whatever the render function hands it.
type SlotProps = Record<string, unknown>

function createSlot(slotKind: ElementKind, slotTag: string | undefined) {
  const Slot = forwardRef<unknown, SlotProps>(function Slot({ children, ...slotProps }, ref) {
    const element = useContext(SlotContext)
    const forkedRef = useForkedRef(ref, element ? getElementRef(element) : undefined)
    if (!element) return null

    // react-aria's `mergeProps`: the child's own props win over the component's, except that
    // classNames concatenate, event handlers chain (the component's first), and ids merge.
    const props: Record<string, unknown> = { ...mergeProps(slotProps, element.props) }
    // A component marks an element that has no `disabled` attribute (an `<a>`, a `<div>`) with
    // `aria-disabled`, and blocks its click itself. The child's own `onClick` would still run
    // from the chain, so the component's handler replaces it: a disabled element doesn't act on
    // a click.
    if (slotProps['aria-disabled'] === true) props.onClick = slotProps.onClick

    return (
      <SlotContext.Provider value={null}>
        {cloneElement(element, { ...props, ref: forkedRef }, children as ReactNode)}
      </SlotContext.Provider>
    )
  })
  return Object.assign(Slot, { slotKind, slotTag })
}

// Created on first use and kept: a `Slot` has to be the same component on every render, or React
// would remount the child. Keyed by tag, or by kind for a component element (a tag can't start
// with a colon).
const slots = new Map<string, ReturnType<typeof createSlot>>()

// The `Slot` a component renders for this child element.
export function getSlot(element: SlotElement) {
  const kind = resolveSlottedKind(element)
  const tag = typeof element.type === 'string' ? element.type : undefined
  const key = tag ?? `:${kind}`
  let slot = slots.get(key)
  if (!slot) {
    slot = createSlot(kind, tag)
    slots.set(key, slot)
  }
  return slot
}

// Whether a render function's `component` is a `Slot`, that is, whether it renders under `asChild`.
export const isSlot = (component: unknown): boolean =>
  typeof (component as { slotKind?: ElementKind } | null)?.slotKind === 'string'

// The single element `asChild` renders in place of the component's own element, or `null` (with
// a dev warning) when `children` isn't exactly one — the component then falls back to rendering
// its default element, so a misuse degrades to a working, if unstyled-as-intended, UI.
export function getSlotChild(children: ReactNode, displayName: string): SlotElement | null {
  if (isValidElement<Record<string, unknown>>(children) && children.type !== Fragment) {
    return children
  }
  devWarning(
    true,
    `${displayName}: \`asChild\` expects exactly one React element as its child (not text, a ` +
      `fragment, or several elements); rendering the default element instead.`
  )
  return null
}
