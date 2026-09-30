import React, {
  createContext,
  CSSProperties,
  FocusEvent,
  ReactNode,
  useContext,
  useRef,
  useState,
  useSyncExternalStore
} from 'react'
import classNames from 'classnames'

import { useIsomorphicLayoutEffect } from '../../hooks'
import { IconValue } from '../../utils/iconConfig'
import { IconSlot } from '../../utils/iconSlot'
import { NavOverflowLinkProps, NavOverflowMoreProps } from '../../utils/navOverflow'
import { Placement } from '../../utils/overlayPlacement'
import { Menu } from '../menu/Menu'
import { MenuItem } from '../menu/MenuItem'
import { MenuList } from '../menu/MenuList'
import { MenuToggle } from '../menu/MenuToggle'

// From `NavOverflow` to the toggle item, which a list renders for it: the items in the menu, the
// props their links registered, and how the toggle looks.
export interface NavOverflowMoreState {
  getLink: (id: string) => NavOverflowLinkProps | null
  getVersion: () => number
  hidden: readonly string[]
  iconPlacement: 'start' | 'end'
  menuContainer: boolean | Element | undefined
  menuPlacement: Placement
  moreIcon: IconValue | undefined
  moreLabel: string
  moreText: ReactNode | false
  subscribe: (listener: () => void) => () => void
}

export const NavOverflowMoreContext = createContext<NavOverflowMoreState | null>(null)

// The nearest item before `item` that is shown and can take focus: its link, or its tab.
function lastShownStop(item: HTMLElement): HTMLElement | null {
  for (let shown = item.previousElementSibling; shown; shown = shown.previousElementSibling) {
    if (shown.hasAttribute('data-cx-nav-overflow')) continue
    const stop = shown.querySelector<HTMLElement>('a[href], button:not(:disabled), [tabindex]')
    if (stop) return stop
  }
  return null
}

// chassis-css's markup (`nav-overflow.js`): a `.nav-item.nav-overflow-item` holding the
// `.nav-link.nav-overflow-toggle` button and the `.menu.nav-overflow-menu`. It is in the list at
// all times, hidden while every item fits, so its width can be measured before it is needed.
export function NavOverflowMore({ tabs }: NavOverflowMoreProps) {
  const state = useContext(NavOverflowMoreContext)
  const [visible, setVisible] = useState(false)
  const itemRef = useRef<HTMLLIElement>(null)
  const focusWithinRef = useRef(false)
  const hidden = state?.hidden
  const empty = !hidden?.length

  // A resize can take away what has focus here: the toggle, when the last item leaves the menu,
  // or a menu item, when its item is back in the list. Neither blurs first, and focus would fall
  // to the page. It goes to the toggle while there is one, and to the last item otherwise.
  useIsomorphicLayoutEffect(() => {
    const item = itemRef.current
    if (!item || !focusWithinRef.current) return
    const active = item.ownerDocument.activeElement
    const lost = !active || active === item.ownerDocument.body || (empty && item.contains(active))
    if (!lost) return
    focusWithinRef.current = !empty
    const stop = empty
      ? lastShownStop(item)
      : item.querySelector<HTMLElement>('.nav-overflow-toggle')
    stop?.focus()
  }, [hidden, empty])

  const handleFocus = (event: FocusEvent) => {
    focusWithinRef.current = true
    // react-aria's tab list takes focus back to the selected tab when focus enters the list from
    // outside, which a click on the toggle does. The toggle is reached with the arrow keys, from
    // a tab (`TabList`), so the list doesn't need to hear of its focus.
    if (tabs) event.stopPropagation()
  }
  const handleBlur = () => {
    focusWithinRef.current = false
  }
  // A hidden item's link re-registers its props on each of its renders.
  useSyncExternalStore(
    state?.subscribe ?? subscribeToNothing,
    state?.getVersion ?? zero,
    state?.getVersion ?? zero
  )

  if (!state || !hidden) return null

  const { getLink, iconPlacement, menuContainer, menuPlacement, moreIcon, moreLabel, moreText } =
    state
  // The toggle goes when the last item leaves the menu, and an open menu with it.
  if (empty && visible) setVisible(false)

  // Keyed, so `iconPlacement` moves the two spans instead of turning one into the other.
  const icon = (
    <span key="icon" className="nav-overflow-icon" style={ICON_STYLE}>
      <IconSlot icon="more" override={moreIcon} />
    </span>
  )
  const text =
    moreText === false ? null : (
      <span key="text" className="nav-overflow-text">
        {moreText}
      </span>
    )

  return (
    <Menu
      component="li"
      className={classNames('nav-item nav-overflow-item', { [HIDDEN_CLASS]: empty })}
      // A `tablist` owns tabs only. The toggle is one of them, and the menu is rendered outside.
      // (No `instanceof Element`: a server has no `Element`.)
      container={tabs ? (typeof menuContainer === 'object' ? menuContainer : true) : menuContainer}
      onBlur={handleBlur}
      onFocus={handleFocus}
      onVisibleChange={setVisible}
      placement={menuPlacement}
      visible={visible && !empty}
      {...(tabs && { role: 'presentation' })}
      ref={itemRef}
    >
      <MenuToggle
        aria-label={moreText === false ? moreLabel : undefined}
        caret={false}
        className="nav-link nav-overflow-toggle"
        component="button"
        {...(tabs && { 'aria-selected': false, role: 'tab', tabIndex: -1 })}
      >
        {iconPlacement === 'end' ? [text, icon] : [icon, text]}
      </MenuToggle>
      <MenuList className="nav-overflow-menu">
        {hidden.map((id) => {
          const link = getLink(id)
          return link && <MenuItem key={id} {...link} />
        })}
      </MenuList>
    </Menu>
  )
}

const HIDDEN_CLASS = 'd-none'
// The icon as chassis-css's plugin draws its own: in the color of the toggle's text, and 1rem
// wide. The default icon size is taller than a link's text, and would make the list a little
// taller each time the toggle appeared.
const ICON_STYLE = { '--cx-icon-color': 'currentcolor', '--cx-icon-size': '1rem' } as CSSProperties
const subscribeToNothing = () => () => {}
const zero = () => 0
