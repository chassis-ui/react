import React, {
  cloneElement,
  createContext,
  CSSProperties,
  forwardRef,
  Fragment,
  isValidElement,
  ReactElement,
  ReactNode,
  Ref,
  useContext
} from 'react'
import { mergeProps } from 'react-aria'

import { useForkedRef } from '../hooks/useForkedRef'
import { devWarning } from './devWarning'
import { ElementKind, resolveSlottedKind } from './elementKind'
import { joinIds } from './idRefs'
import { resolveLazy } from './lazyElement'

// Backs the `asChild` prop every polymorphic component accepts (see `createPolymorphicComponent`).
// The component renders a `Slot` as its `component`; the `Slot` then renders the caller's child
// element in its place, with the props the component computed (className, handlers, ARIA
// attributes, ref) merged onto it.
//
// There is one `Slot` per tag, and one for every component element, and the component gets the
// one that matches the child. A render function reads the child's kind and tag back with
// `resolveElementKind(Component)`/`resolveElementTag(Component)` (see `./elementKind`) and gives a
// slotted `<a>` the handling it gives `component="a"`. A tag's kind travels on its `Slot` rather
// than in a prop, so nothing extra can reach the DOM. A component element's kind is whether it
// has a link target, which can change between renders, so it is read from the element while the
// render function runs (`withSlottedElement`): a `Slot` per kind would remount the child when its
// `href` came or went.
//
// The child element travels through context rather than a prop because a render function spreads
// its `rest` props onto `component` in its own way (some filter them, some don't forward every
// one) — context reaches `Slot` no matter how the render function wires it up. `Slot` resets the
// context for its own subtree, so a polymorphic component nested *inside* the child doesn't pick
// up the outer one's element.
type SlotElement = ReactElement<Record<string, unknown>>

const SlotContext = createContext<SlotElement | null>(null)

export const SlotProvider = SlotContext.Provider

// The element `asChild` handed to the nearest polymorphic component, for a component rendered
// beside its `Slot`. A render function can't read it: it runs above the provider.
export const useSlotElement = (): SlotElement | null => useContext(SlotContext)

// The ref the caller put on an element. React 19 made `ref` an ordinary prop, and warns on
// reading `element.ref`.
export function getElementRef<T = unknown>(element: ReactElement): Ref<T> | undefined {
  return (element.props as { ref?: Ref<T> }).ref
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
    // Descriptions add up too: a child's own `aria-describedby` keeps the component's (a
    // `Tooltip`'s) rather than replacing it.
    const props: Record<string, unknown> = { ...mergeProps(slotProps, element.props) }
    // `mergeProps` takes the child's `style` whole, which dropped the inline styles the component
    // computed (a `Grid`'s `--cx-grid-gap`, a `GridItem`'s `gridTemplateRows`) under a child with
    // any style of its own. Property by property instead, the child's winning.
    const slotStyle = slotProps.style as CSSProperties | undefined
    const childStyle = element.props.style as CSSProperties | undefined
    if (slotStyle && childStyle) props.style = { ...slotStyle, ...childStyle }
    // Written only when there is one: a key set to `undefined` would replace a description the
    // child's own component writes before spreading its props.
    const describedBy = joinIds(
      slotProps['aria-describedby'] as string | undefined,
      element.props['aria-describedby'] as string | undefined
    )
    if (describedBy) props['aria-describedby'] = describedBy
    else delete props['aria-describedby']
    // The child's own name wins too. `aria-labelledby` outranks `aria-label` when an element is
    // named, so the component's (a `Divider`'s label) would replace the name the child was given.
    if (element.props['aria-label'] != null && element.props['aria-labelledby'] == null) {
      delete props['aria-labelledby']
    }
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

// The `Slot` of every component element, and the one `renderSlotted` renders for any element. A
// `Slot` has to be the same component on every render, or React would remount the child, and one
// chosen by the element's kind would change when its `href` came or went.
const ComponentSlot = createSlot('component', undefined)

// Created on first use and kept, for the same reason. A host element changes with its tag
// anyway, so its `Slot` can carry the tag and the kind.
const tagSlots = new Map<string, ReturnType<typeof createSlot>>()

// The `Slot` a component renders for this child element.
export function getSlot(element: SlotElement) {
  const tag = element.type
  if (typeof tag !== 'string') return ComponentSlot
  let slot = tagSlots.get(tag)
  if (!slot) {
    slot = createSlot(resolveSlottedKind(element), tag)
    tagSlots.set(tag, slot)
  }
  return slot
}

// Renders an element the component doesn't own, such as the trigger of a `Tooltip` or a
// `Popover`, the way `asChild` renders a child: with the component's `props` merged into the
// element's own and `ref` forked with the element's ref. `owned` holds the attributes that state
// the component's own condition (a `Popover` trigger's `aria-expanded` and `aria-controls`): they
// win over the element's, which the merge would otherwise let win.
export function renderSlotted(
  element: SlotElement,
  props: object,
  ref: Ref<unknown>,
  owned: Record<string, unknown> = {}
): ReactElement {
  const defined = Object.entries(owned).filter(([, value]) => value !== undefined)
  const slotted = defined.length ? cloneElement(element, Object.fromEntries(defined)) : element
  return (
    <SlotProvider value={slotted}>
      <ComponentSlot {...props} ref={ref}>
        {element.props.children as ReactNode}
      </ComponentSlot>
    </SlotProvider>
  )
}

// Whether a render function's `component` is a `Slot`, that is, whether it renders under `asChild`.
export const isSlot = (component: unknown): boolean =>
  typeof (component as { slotKind?: ElementKind } | null)?.slotKind === 'string'

// The single element in `children`, or `null` when it isn't exactly one (text, a fragment,
// several elements).
//
// A Server Component's child can arrive as a lazy node (#37, see `./lazyElement`): it is resolved
// first, which suspends this component while the child is still loading.
function getSingleElement(children: ReactNode): SlotElement | null {
  const child = resolveLazy(children)
  return isValidElement<Record<string, unknown>>(child) && child.type !== Fragment ? child : null
}

// The single element `asChild` renders in place of the component's own element, or `null` (with
// a dev warning) when `children` isn't exactly one — the component then falls back to rendering
// its default element, so a misuse degrades to a working, if unstyled-as-intended, UI.
export function getSlotChild(children: ReactNode, displayName: string): SlotElement | null {
  const child = getSingleElement(children)
  devWarning(
    !child,
    `${displayName}: \`asChild\` expects exactly one React element as its child (not text, a ` +
      `fragment, or several elements); rendering the default element instead.`
  )
  return child
}

// The trigger of a `Tooltip` or `Popover`, rendered with `renderSlotted`, or `null` (with a dev
// warning) when `children` isn't exactly one element. The component then renders `children` as
// they are, with nothing to open it.
export function getTriggerChild(children: ReactNode, displayName: string): SlotElement | null {
  const child = getSingleElement(children)
  devWarning(
    !child,
    `${displayName}: expects exactly one React element as its trigger (not text, a fragment, ` +
      `or several elements); rendering the children with nothing to open it.`
  )
  return child
}
