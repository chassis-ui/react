import React, { AriaAttributes, forwardRef, ReactElement, ReactNode, useRef } from 'react'
import classNames from 'classnames'
import { useTab, useTabList } from 'react-aria'
import { Node } from 'react-stately'

import { useForkedRef } from '../../hooks'
import { TabProps } from './Tab'
import { useTabsContext } from './context'

export interface TabListProps extends AriaAttributes {
  /**
   * `Tab` elements — read as data by `Tabs` to build the tab collection (see `Tabs.tsx`). Not
   * rendered directly.
   */
  children: ReactNode
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * Set the tab list variant to tabs or pills.
   */
  variant?: 'tabs' | 'pills'
}

// Renders the actual, focusable tabs from `state.collection` — built by the ancestor `Tabs`
// from this component's own `children` (see the comment there). This component's own `children`
// prop is intentionally unused for rendering.
export const TabList = forwardRef<HTMLUListElement, TabListProps>(
  ({ className, variant = 'tabs', ...rest }, ref) => {
    const { keyboardActivation, orientation, state } = useTabsContext()
    const listRef = useRef<HTMLUListElement>(null)
    const forkedRef = useForkedRef(ref, listRef)
    const { tabListProps } = useTabList(
      { keyboardActivation, orientation, ...rest },
      state,
      listRef
    )

    const _className = classNames('nav', `nav-${variant}`, className)

    return (
      <ul className={_className} {...tabListProps} ref={forkedRef}>
        {[...state.collection].map((item) => (
          <TabItem key={item.key} item={item} />
        ))}
      </ul>
    )
  }
)

TabList.displayName = 'TabList'

interface TabItemProps {
  item: Node<ReactElement<TabProps>>
}

const TabItem = ({ item }: TabItemProps) => {
  const { state } = useTabsContext()
  const ref = useRef<HTMLAnchorElement>(null)
  const { tabProps, isSelected, isDisabled } = useTab({ key: item.key }, state, ref)

  return (
    // ARIA's `tablist` role only permits `tab`-role children — `role="presentation"` opts this
    // `<li>` wrapper out without hiding its content, same pattern as `MenuHeader`.
    <li className="nav-item" role="presentation">
      <a
        className={classNames('nav-link', { active: isSelected, disabled: isDisabled })}
        {...tabProps}
        ref={ref}
      >
        {item.rendered}
      </a>
    </li>
  )
}
