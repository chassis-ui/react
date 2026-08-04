import React, { forwardRef, HTMLAttributes, ReactElement, ReactNode } from 'react'
import { Item, Key, useTabListState } from 'react-stately'

import { TabProps } from './Tab'
import { TabList } from './TabList'
import { TabsContext } from './context'

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  /**
   * A `TabList` (containing `Tab` children) followed by one `TabPanel` per tab.
   */
  children: ReactNode
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
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

export const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  (
    {
      children,
      className,
      defaultSelectedKey,
      disabledKeys,
      keyboardActivation,
      onSelectionChange,
      orientation,
      selectedKey,
      ...rest
    },
    ref
  ) => {
    // `TabList`'s own children (the `Tab`s) are the source of truth for the collection —
    // `TabList` never renders them directly (see its own comment), it only reads them here,
    // at the point react-stately actually needs a collection to build `state` from. This keeps
    // the public authoring shape as plain composed JSX (matching every other chassis-react
    // component) instead of exposing react-aria's raw `items`/`Item` collection API directly.
    const childArray = React.Children.toArray(children)
    const tabListChild = childArray.find(
      (child): child is ReactElement<{ children?: ReactNode }> =>
        React.isValidElement(child) && child.type === TabList
    )
    const panelChildren = childArray.filter((child) => child !== tabListChild)
    const tabs = (tabListChild ? React.Children.toArray(tabListChild.props.children) : []).filter(
      (child): child is ReactElement<TabProps> => React.isValidElement(child)
    )

    const tabDisabledKeys = tabs.filter((tab) => tab.props.disabled).map((tab) => tab.props.id)
    const allDisabledKeys = disabledKeys ? [...disabledKeys, ...tabDisabledKeys] : tabDisabledKeys

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
      defaultSelectedKey,
      disabledKeys: allDisabledKeys,
      selectedKey,
      onSelectionChange
    })

    return (
      <TabsContext.Provider value={{ keyboardActivation, orientation, state }}>
        <div className={className} {...rest} ref={ref}>
          {tabListChild}
          <div className="tab-content">{panelChildren}</div>
        </div>
      </TabsContext.Provider>
    )
  }
)

Tabs.displayName = 'Tabs'
