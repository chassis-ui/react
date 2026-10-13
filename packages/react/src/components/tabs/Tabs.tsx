import React, {
  ElementType,
  ForwardRefRenderFunction,
  ReactElement,
  ReactNode,
  useEffect,
  useRef
} from 'react'
import { Item, Key, useTabListState } from 'react-stately'

import { isElementOfType } from '../../utils/lazyElement'
import {
  createPolymorphicComponent,
  PolymorphicComponentProps,
  PolymorphicRef
} from '../../utils/polymorphic'
import { TabProps } from './Tab'
import { TabList } from './TabList'
import { TabPanel } from './TabPanel'
import { TabsContext } from './context'

type TabsOwnProps<C extends ElementType> = {
  /**
   * A `TabList` (containing `Tab` children) followed by one `TabPanel` per tab.
   */
  children?: ReactNode
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C
  /**
   * The initially selected tab's key (uncontrolled).
   */
  defaultSelectedKey?: Key
  /**
   * The keys of tabs that cannot be selected, focused, or otherwise interacted with.
   */
  disabledKeys?: Iterable<Key>
  /**
   * Whether tabs are selected automatically on arrow-key focus (`'automatic'`, the default) or
   * only on explicit activation — Enter/Space or click (`'manual'`).
   */
  keyboardActivation?: 'automatic' | 'manual'
  /**
   * Callback fired when the selected tab changes.
   */
  onSelectionChange?: (key: Key) => void
  /**
   * The orientation of the tab list. `'vertical'` stacks the tabs, with the `flex-column` class
   * on the list, and moves between them with the up and down arrow keys. The panels stay below
   * the list: to put them beside it, lay out the root with `className`.
   */
  orientation?: 'horizontal' | 'vertical'
  /**
   * The selected tab's key (controlled).
   */
  selectedKey?: Key
}

export type TabsProps<C extends ElementType = 'div'> = PolymorphicComponentProps<C, TabsOwnProps<C>>

type TabsComponent = (<C extends ElementType = 'div'>(
  props: TabsProps<C> & { ref?: PolymorphicRef<C> }
) => ReactElement | null) & { displayName?: string }

function TabsRender<C extends ElementType = 'div'>(
  {
    children,
    className,
    component,
    defaultSelectedKey,
    disabledKeys,
    keyboardActivation,
    onSelectionChange,
    orientation,
    selectedKey,
    ...rest
  }: TabsProps<C>,
  ref: PolymorphicRef<C>
) {
  const Component = component ?? 'div'
  // `TabList`'s own children (the `Tab`s) are the source of truth for the collection —
  // `TabList` never renders them directly (see its own comment), it only reads them here,
  // at the point react-stately actually needs a collection to build `state` from. This keeps
  // the public authoring shape as plain composed JSX (matching every other chassis-react
  // component) instead of exposing react-aria's raw `items`/`Item` collection API directly.
  //
  // `isElementOfType` rather than `child.type === TabList`: written in a Server Component, the
  // children's types are lazy wrappers (see `utils/lazyElement`).
  const childArray = React.Children.toArray(children)
  // The `TabList`, or the element that holds it: a `NavOverflow` around the list is found inside
  // it, and rendered where the list would be.
  const tabListHolder = childArray.find((child) => findTabList(child) !== undefined)
  const tabListChild = findTabList(tabListHolder)
  const panelChildren = childArray.filter((child) => child !== tabListHolder)
  const tabs = (tabListChild ? React.Children.toArray(tabListChild.props.children) : []).filter(
    (child): child is ReactElement<TabProps> => React.isValidElement(child)
  )

  // react-stately keys its collection by the React `key` of each `Item`, which is a string
  // whatever it was given. An `id` is a `Key`, so it may be a number: every id is compared with
  // the collection as a string, or `<Tab id={1}>` never matched its own key (no panel, and a
  // `disabled` that didn't hold).
  const tabDisabledKeys = tabs.filter((tab) => tab.props.disabled).map((tab) => collectionKey(tab))
  const allDisabledKeys = disabledKeys
    ? [...Array.from(disabledKeys, String), ...tabDisabledKeys]
    : tabDisabledKeys

  // With no key given, react-stately selects the first enabled tab in an effect, which never runs
  // on the server: the server HTML had no selected tab and no panel. Choosing that tab here, by
  // react-stately's own rule (the first enabled tab, or the first tab when all are disabled),
  // selects it on the first render.
  const initialKey =
    defaultSelectedKey == null
      ? firstEnabledKey(tabs, new Set(allDisabledKeys))
      : String(defaultSelectedKey)

  // The id as the `Tab` has it, so a number given comes back a number.
  const idOfKey = (key: Key): Key => tabs.find((tab) => collectionKey(tab) === key)?.props.id ?? key

  const state = useTabListState<ReactElement<TabProps>>({
    children: (tab) => (
      <Item
        key={collectionKey(tab)}
        textValue={typeof tab.props.children === 'string' ? tab.props.children : undefined}
      >
        {tab.props.children}
      </Item>
    ),
    items: tabs,
    defaultSelectedKey: initialKey,
    disabledKeys: allDisabledKeys,
    selectedKey: selectedKey == null ? selectedKey : String(selectedKey),
    onSelectionChange: onSelectionChange && ((key) => onSelectionChange(idOfKey(key)))
  })

  // react-stately's own selection of that tab reported it through `onSelectionChange`, which a key
  // given up front doesn't: report it once on mount, as before, so state kept from it (a
  // `selectedKey` that starts unset) learns the initial tab.
  const reportedInitialKeyRef = useRef(false)
  useEffect(() => {
    if (reportedInitialKeyRef.current) return
    reportedInitialKeyRef.current = true
    if (selectedKey == null && defaultSelectedKey == null && initialKey != null) {
      onSelectionChange?.(idOfKey(initialKey))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Flipped to `false` once the initial commit has painted, so `TabPanel` can tell "selected on
  // load" apart from "selected by switching" and only fade in the latter.
  const isInitialSelectionRef = useRef(true)
  useEffect(() => {
    isInitialSelectionRef.current = false
  }, [])

  return (
    <TabsContext.Provider value={{ keyboardActivation, orientation, state, isInitialSelectionRef }}>
      <Component className={className} {...rest} ref={ref}>
        {tabListHolder}
        <div className="tab-content">{panelChildren}</div>
      </Component>
    </TabsContext.Provider>
  )
}

type TabListElement = ReactElement<{ children?: ReactNode }>

const isTabList = (child: unknown): child is TabListElement =>
  isElementOfType<{ children?: ReactNode }>(child, TabList)

// `child` when it is the `TabList`, or the `TabList` inside it: one level down, or two, which is
// where `<NavOverflow asChild>` around an element of the caller's puts it. Never inside a
// `TabPanel`: reading a panel's children would wait for content that isn't shown.
function findTabList(child: unknown, depth = 2): TabListElement | undefined {
  if (isTabList(child)) return child
  if (depth === 0 || isElementOfType(child, TabPanel)) return undefined
  if (!React.isValidElement<{ children?: ReactNode }>(child)) return undefined
  for (const inner of React.Children.toArray(child.props.children)) {
    const found = findTabList(inner, depth - 1)
    if (found) return found
  }
  return undefined
}

// The key react-stately's collection has for a tab.
const collectionKey = (tab: ReactElement<TabProps>): string => String(tab.props.id)

function firstEnabledKey(
  tabs: ReactElement<TabProps>[],
  disabled: Set<string>
): string | undefined {
  const first = tabs.find((tab) => !disabled.has(collectionKey(tab))) ?? tabs[0]
  return first && collectionKey(first)
}

export const Tabs = createPolymorphicComponent<TabsComponent>(
  TabsRender as ForwardRefRenderFunction<Element, TabsProps<ElementType>>,
  'Tabs'
)
