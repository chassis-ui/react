import React, {
  createContext,
  forwardRef,
  HTMLAttributes,
  ReactElement,
  ReactNode,
  useContext
} from 'react'
import { Item, Key, TabListState, useTabListState } from 'react-stately'

import { CxTabProps } from './CxTab'
import { CxTabList } from './CxTabList'

export interface CxTabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  /**
   * A `CxTabList` (containing `CxTab` children) followed by one `CxTabPanel` per tab.
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

export interface CxTabsContextValue {
  keyboardActivation?: 'automatic' | 'manual'
  orientation?: 'horizontal' | 'vertical'
  state: TabListState<ReactElement<CxTabProps>>
}

export const CxTabsContext = createContext<CxTabsContextValue | null>(null)

export const useCxTabsContext = (): CxTabsContextValue => {
  const context = useContext(CxTabsContext)
  if (!context) {
    throw new Error('CxTabList and CxTabPanel must be rendered inside a CxTabs')
  }
  return context
}

export const CxTabs = forwardRef<HTMLDivElement, CxTabsProps>(
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
    // `CxTabList`'s own children (the `CxTab`s) are the source of truth for the collection —
    // `CxTabList` never renders them directly (see its own comment), it only reads them here,
    // at the point react-stately actually needs a collection to build `state` from. This keeps
    // the public authoring shape as plain composed JSX (matching every other chassis-react
    // component) instead of exposing react-aria's raw `items`/`Item` collection API directly.
    const childArray = React.Children.toArray(children)
    const tabListChild = childArray.find(
      (child): child is ReactElement<{ children?: ReactNode }> =>
        React.isValidElement(child) && child.type === CxTabList
    )
    const panelChildren = childArray.filter((child) => child !== tabListChild)
    const tabs = (tabListChild ? React.Children.toArray(tabListChild.props.children) : []).filter(
      (child): child is ReactElement<CxTabProps> => React.isValidElement(child)
    )

    const tabDisabledKeys = tabs.filter((tab) => tab.props.disabled).map((tab) => tab.props.id)
    const allDisabledKeys = disabledKeys ? [...disabledKeys, ...tabDisabledKeys] : tabDisabledKeys

    const state = useTabListState<ReactElement<CxTabProps>>({
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
      <CxTabsContext.Provider value={{ keyboardActivation, orientation, state }}>
        <div className={className} {...rest} ref={ref}>
          {tabListChild}
          <div className="tab-content">{panelChildren}</div>
        </div>
      </CxTabsContext.Provider>
    )
  }
)

CxTabs.displayName = 'CxTabs'
