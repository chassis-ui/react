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
   * The orientation of the tab list.
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
  const tabListChild = childArray.find((child) =>
    isElementOfType<{ children?: ReactNode }>(child, TabList)
  )
  const panelChildren = childArray.filter((child) => child !== tabListChild)
  const tabs = (tabListChild ? React.Children.toArray(tabListChild.props.children) : []).filter(
    (child): child is ReactElement<TabProps> => React.isValidElement(child)
  )

  const tabDisabledKeys = tabs.filter((tab) => tab.props.disabled).map((tab) => tab.props.id)
  const allDisabledKeys = disabledKeys ? [...disabledKeys, ...tabDisabledKeys] : tabDisabledKeys

  // With no key given, react-stately selects the first enabled tab in an effect, which never runs
  // on the server: the server HTML had no selected tab and no panel. Choosing that tab here, by
  // react-stately's own rule (the first enabled tab, or the first tab when all are disabled),
  // selects it on the first render.
  const initialKey = defaultSelectedKey ?? firstEnabledKey(tabs, new Set(allDisabledKeys))

  const state = useTabListState<ReactElement<TabProps>>({
    children: (tab) => (
      <Item
        key={tab.props.id}
        textValue={typeof tab.props.children === 'string' ? tab.props.children : undefined}
      >
        {tab.props.children}
      </Item>
    ),
    items: tabs,
    defaultSelectedKey: initialKey,
    disabledKeys: allDisabledKeys,
    selectedKey,
    onSelectionChange
  })

  // react-stately's own selection of that tab reported it through `onSelectionChange`, which a key
  // given up front doesn't: report it once on mount, as before, so state kept from it (a
  // `selectedKey` that starts unset) learns the initial tab.
  const reportedInitialKeyRef = useRef(false)
  useEffect(() => {
    if (reportedInitialKeyRef.current) return
    reportedInitialKeyRef.current = true
    if (selectedKey == null && defaultSelectedKey == null && initialKey != null) {
      onSelectionChange?.(initialKey)
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
        {tabListChild}
        <div className="tab-content">{panelChildren}</div>
      </Component>
    </TabsContext.Provider>
  )
}

function firstEnabledKey(tabs: ReactElement<TabProps>[], disabled: Set<Key>): Key | undefined {
  return (tabs.find((tab) => !disabled.has(tab.props.id)) ?? tabs[0])?.props.id
}

export const Tabs = createPolymorphicComponent<TabsComponent>(
  TabsRender as ForwardRefRenderFunction<Element, TabsProps<ElementType>>,
  'Tabs'
)
