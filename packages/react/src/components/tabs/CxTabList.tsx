import React, { AriaAttributes, ReactElement, ReactNode, useRef } from 'react'
import classNames from 'classnames'
import { useTab, useTabList } from 'react-aria'
import { Node } from 'react-stately'

import { CxTabProps } from './CxTab'
import { useCxTabsContext } from './CxTabs'

export interface CxTabListProps extends AriaAttributes {
  /**
   * `CxTab` elements — read as data by `CxTabs` to build the tab collection (see `CxTabs.tsx`).
   * Not rendered directly.
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

// Renders the actual, focusable tabs from `state.collection` — built by the ancestor `CxTabs`
// from this component's own `children` (see the comment there). This component's own `children`
// prop is intentionally unused for rendering.
export const CxTabList = ({ className, variant = 'tabs', ...rest }: CxTabListProps) => {
  const { keyboardActivation, orientation, state } = useCxTabsContext()
  const ref = useRef<HTMLUListElement>(null)
  const { tabListProps } = useTabList({ keyboardActivation, orientation, ...rest }, state, ref)

  const _className = classNames('nav', `nav-${variant}`, className)

  return (
    <ul className={_className} {...tabListProps} ref={ref}>
      {[...state.collection].map((item) => (
        <TabItem key={item.key} item={item} />
      ))}
    </ul>
  )
}

CxTabList.displayName = 'CxTabList'

interface TabItemProps {
  item: Node<ReactElement<CxTabProps>>
}

const TabItem = ({ item }: TabItemProps) => {
  const { state } = useCxTabsContext()
  const ref = useRef<HTMLAnchorElement>(null)
  const { tabProps, isSelected, isDisabled } = useTab({ key: item.key }, state, ref)

  return (
    <li className="nav-item">
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
