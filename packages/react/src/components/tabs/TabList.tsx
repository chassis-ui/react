import React, {
  AriaAttributes,
  FocusEvent,
  forwardRef,
  KeyboardEvent,
  ReactElement,
  ReactNode,
  useContext,
  useRef,
  useState
} from 'react'
import classNames from 'classnames'
import { useLocale, useTab, useTabList } from 'react-aria'
import { Key, Node } from 'react-stately'

import { useForkedRef, useIsomorphicLayoutEffect } from '../../hooks'
import { NavOverflowContext, NavOverflowItems, useNavOverflowItem } from '../../utils/navOverflow'
import { NavVariant, navVariantClassName } from '../../utils/navVariant'
import { mergeUnhandledProps } from '../../utils/unhandledProps'
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
   * Size the component sm or lg.
   */
  size?: 'sm' | 'lg'
  /**
   * Set the tab list variant to tabs, to segments (a segmented control) or to underline, which
   * underlines the selected tab. `'pills'` is the former name of `'segments'`: deprecated, it
   * renders the same.
   *
   * @type { 'tabs' | 'segments' | 'underline' | 'pills' }
   */
  variant?: NavVariant
}

// Renders the actual, focusable tabs from `state.collection` — built by the ancestor `Tabs`
// from this component's own `children` (see the comment there). This component's own `children`
// prop is intentionally unused for rendering.
export const TabList = forwardRef<HTMLUListElement, TabListProps>(
  ({ className, size, variant = 'tabs', ...rest }, ref) => {
    const { keyboardActivation, orientation, state } = useTabsContext()
    const listRef = useRef<HTMLUListElement>(null)
    const forkedRef = useForkedRef(ref, listRef)
    const { direction } = useLocale()
    const { tabListProps } = useTabList(
      { keyboardActivation, orientation, ...rest },
      state,
      listRef
    )
    const overflows = useContext(NavOverflowContext) !== null
    const [tabKeys] = useState(() => new WeakMap<Element, Key>())
    // The list is one Tab stop. While the toggle has focus it is that stop, and no tab is: Tab
    // and Shift+Tab then leave the list from it, instead of stopping at a tab on the way.
    const [toggleFocused, setToggleFocused] = useState(false)

    // chassis-css has no rule on `aria-orientation`: a vertical list is stacked by `flex-column`.
    const _className = classNames(
      'nav',
      size,
      navVariantClassName(variant, 'TabList'),
      { 'flex-column': orientation === 'vertical' },
      className
    )

    // Inside a `NavOverflow` some tabs are in its menu, hidden here, and its toggle is one more
    // stop among the tabs. react-aria's own arrow keys walk the whole collection, so they would
    // give focus to a hidden tab and never reach the toggle: the arrow keys, Home and End are
    // handled here instead, among the tabs that are shown and the toggle.
    const handleKeyDownCapture = (event: KeyboardEvent<HTMLUListElement>) => {
      if (!overflows || orientation === 'vertical') return
      const step = keyStep(event.key, direction === 'rtl')
      if (step === undefined) return
      const stops = tabStops(event.currentTarget)
      const index = stops.findIndex((stop) => stop.contains(event.target as globalThis.Node))
      if (index === -1) return

      event.preventDefault()
      event.stopPropagation()
      const next =
        step === 'first'
          ? stops[0]
          : step === 'last'
            ? stops[stops.length - 1]
            : stops[(index + step + stops.length) % stops.length]
      if (!next) return
      next.focus()
      const key = tabKeys.get(next)
      if (key !== undefined && keyboardActivation !== 'manual') state.setSelectedKey(key)
    }

    return (
      <ul
        className={_className}
        {...mergeUnhandledProps(tabListProps, rest, ['children'])}
        onKeyDownCapture={handleKeyDownCapture}
        {...(overflows && {
          onBlurCapture: () => setToggleFocused(false),
          onFocusCapture: (event: FocusEvent) =>
            setToggleFocused((event.target as Element).matches('.nav-overflow-toggle'))
        })}
        ref={forkedRef}
      >
        <NavOverflowItems tabs>
          {[...state.collection].map((item) => (
            <TabItem key={item.key} item={item} tabKeys={tabKeys} tabStop={!toggleFocused} />
          ))}
        </NavOverflowItems>
      </ul>
    )
  }
)

TabList.displayName = 'TabList'

const keyStep = (key: string, rtl: boolean): 1 | -1 | 'first' | 'last' | undefined => {
  switch (key) {
    case 'ArrowRight':
      return rtl ? -1 : 1
    case 'ArrowLeft':
      return rtl ? 1 : -1
    case 'Home':
      return 'first'
    case 'End':
      return 'last'
    default:
      return undefined
  }
}

// What the arrow keys move among: the tabs that are shown and enabled, then the overflow toggle
// while it is shown. Walks `children` rather than querying with `:scope`, which jsdom misreads
// under an id with a colon (see `menu/menuNavigation.ts`).
const tabStops = (list: HTMLElement): HTMLElement[] =>
  Array.from(list.children).flatMap((item) => {
    if (item.hasAttribute('data-cx-nav-overflow') || item.classList.contains('d-none')) return []
    const stop = item.querySelector<HTMLElement>('[role="tab"]:not([aria-disabled="true"])')
    return stop ? [stop] : []
  })

interface TabItemProps {
  item: Node<ReactElement<TabProps>>
  tabKeys: WeakMap<Element, Key>
  /**
   * Whether a tab may be the list's Tab stop now.
   */
  tabStop: boolean
}

const TabItem = ({ item, tabKeys, tabStop }: TabItemProps) => {
  const { state } = useTabsContext()
  const ref = useRef<HTMLAnchorElement>(null)
  const { tabProps, isSelected, isDisabled } = useTab({ key: item.key }, state, ref)

  // Inside a `NavOverflow`, a tab that doesn't fit is shown in its menu as an item that selects
  // it. Selected, the tab is back in the list (the selected tab always is), and takes the focus
  // the menu item had.
  const focusWhenShownRef = useRef(false)
  const overflow = useNavOverflowItem({
    children: item.rendered,
    disabled: isDisabled,
    onClick: () => {
      focusWhenShownRef.current = true
      // Dropped if the tab isn't shown by then: a controlled `selectedKey` that didn't follow.
      requestAnimationFrame(() => {
        focusWhenShownRef.current = false
      })
      state.setSelectedKey(item.key)
    }
  })

  useIsomorphicLayoutEffect(() => {
    if (ref.current) tabKeys.set(ref.current, item.key)
  })

  useIsomorphicLayoutEffect(() => {
    if (overflow.hidden || !focusWhenShownRef.current) return
    focusWhenShownRef.current = false
    ref.current?.focus()
  }, [overflow.hidden])

  return (
    // ARIA's `tablist` role only permits `tab`-role children — `role="presentation"` opts this
    // `<li>` wrapper out without hiding its content, same pattern as `MenuHeader`.
    <li
      className={classNames('nav-item', { 'nav-overflow-keep': item.value?.props.keepVisible })}
      role="presentation"
      {...(overflow.hidden && { 'data-cx-nav-overflow': 'true' })}
      ref={overflow.ref}
    >
      <a
        className={classNames('nav-link', { active: isSelected, disabled: isDisabled })}
        {...tabProps}
        // react-aria makes the selected tab the tab stop in an effect, so the server's HTML had no
        // tab stop and Tab skipped the list until the JavaScript had loaded. A disabled tab never
        // is one.
        tabIndex={
          !tabStop
            ? -1
            : isSelected && !isDisabled && state.selectionManager.focusedKey == null
              ? 0
              : tabProps.tabIndex
        }
        ref={ref}
      >
        {item.rendered}
      </a>
    </li>
  )
}
