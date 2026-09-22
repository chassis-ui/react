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

// Backs the `asChild` prop every polymorphic component accepts (see `createPolymorphicComponent`).
// The component renders `Slot` as its `component`, exactly like any other component reference;
// `Slot` then renders the caller's child element in its place, with the props the component
// computed (className, handlers, ARIA attributes, ref) merged onto it.
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
// `element.ref`. The package supports both (`peerDependencies.react: >=18`).
const REACT_19 = parseInt(version, 10) >= 19

function getElementRef(element: SlotElement): Ref<unknown> | undefined {
  return REACT_19
    ? (element.props as { ref?: Ref<unknown> }).ref
    : (element as unknown as { ref?: Ref<unknown> }).ref
}

// `Record` rather than a declared prop list: `Slot` forwards whatever the render function hands it.
type SlotProps = Record<string, unknown>

export const Slot = forwardRef<unknown, SlotProps>(function Slot({ children, ...slotProps }, ref) {
  const element = useContext(SlotContext)
  const forkedRef = useForkedRef(ref, element ? getElementRef(element) : undefined)
  if (!element) return null

  return (
    <SlotContext.Provider value={null}>
      {cloneElement(
        element,
        // react-aria's `mergeProps`: the child's own props win over the component's, except that
        // classNames concatenate, event handlers chain (the component's first), and ids merge.
        { ...mergeProps(slotProps, element.props), ref: forkedRef } as Record<string, unknown>,
        children as ReactNode
      )}
    </SlotContext.Provider>
  )
})

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
