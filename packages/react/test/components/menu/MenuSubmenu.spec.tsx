import * as React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { axe } from 'jest-axe'

import {
  I18nProvider,
  Menu,
  MenuList,
  MenuItem,
  MenuSubmenu,
  MenuSubmenuBack
} from '../../../src/index'

// The nested submenu panel is a `.menu` div with role="menu" (see MenuList), but a menu can
// have several nested submenus open/closed at once, each with that same role — disambiguating
// "the panel that contains this item" needs a class-scoped traversal from the item's text, not
// an ambiguous getByRole('menu').
const getNestedMenu = (itemText: string) =>
  // eslint-disable-next-line testing-library/no-node-access
  screen.getByText(itemText).closest('.menu') as HTMLElement

describe('MenuSubmenu', () => {
  // jsdom never runs real layout — offsetWidth/offsetHeight/getClientRects() are always zero for
  // every element, regardless of what's actually rendered — but menuNavigation's `isVisible`
  // filter (used by focus-on-open) depends on non-zero dimensions to tell a hidden item from a
  // shown one. Stub a non-zero offsetHeight file-wide so the "focuses the first item" assertions
  // below exercise the real focus call instead of silently seeing an always-empty items list.
  beforeEach(() => {
    vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(1)
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('rendering', () => {
    test('matches the baseline markup snapshot and renders the submenu wrapper', () => {
      const { container } = render(
        <Menu visible>
          <MenuList>
            <MenuSubmenu trigger="File">
              <MenuItem>New</MenuItem>
              <MenuItem>Open</MenuItem>
            </MenuSubmenu>
          </MenuList>
        </Menu>
      )
      expect(container).toMatchSnapshot()
      // The outer .submenu wrapper is a plain div with no role/name of its own.
      // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
      expect(container.querySelector('.submenu')).not.toBeNull()
    })
  })

  describe('open/close behavior', () => {
    test('opens and closes on trigger click', () => {
      render(
        <Menu visible>
          <MenuList>
            <MenuSubmenu trigger="File">
              <MenuItem>New</MenuItem>
            </MenuSubmenu>
          </MenuList>
        </Menu>
      )
      const trigger = screen.getByText('File')
      const nestedMenu = getNestedMenu('New')

      expect(nestedMenu).not.toHaveClass('show')
      fireEvent.click(trigger)
      expect(nestedMenu).toHaveClass('show')
      expect(trigger).toHaveAttribute('aria-expanded', 'true')

      fireEvent.click(trigger)
      expect(nestedMenu).not.toHaveClass('show')
    })

    test('closes when its ancestor Menu closes', () => {
      const { rerender } = render(
        <Menu visible>
          <MenuList>
            <MenuSubmenu trigger="File">
              <MenuItem>New</MenuItem>
            </MenuSubmenu>
          </MenuList>
        </Menu>
      )
      const nestedMenu = getNestedMenu('New')

      fireEvent.click(screen.getByText('File'))
      expect(nestedMenu).toHaveClass('show')

      rerender(
        <Menu visible={false}>
          <MenuList>
            <MenuSubmenu trigger="File">
              <MenuItem>New</MenuItem>
            </MenuSubmenu>
          </MenuList>
        </Menu>
      )
      expect(nestedMenu).not.toHaveClass('show')
    })

    test('closes sibling submenus when a new one opens', () => {
      render(
        <Menu visible>
          <MenuList>
            <MenuSubmenu trigger="File">
              <MenuItem>New</MenuItem>
            </MenuSubmenu>
            <MenuSubmenu trigger="Edit">
              <MenuItem>Cut</MenuItem>
            </MenuSubmenu>
          </MenuList>
        </Menu>
      )
      const fileMenu = getNestedMenu('New')
      const editMenu = getNestedMenu('Cut')

      fireEvent.click(screen.getByText('File'))
      expect(fileMenu).toHaveClass('show')

      fireEvent.click(screen.getByText('Edit'))
      expect(editMenu).toHaveClass('show')
      expect(fileMenu).not.toHaveClass('show')
    })

    test('MenuSubmenuBack closes the submenu and refocuses its trigger', () => {
      render(
        <Menu visible>
          <MenuList>
            <MenuSubmenu trigger="File" stacked>
              <MenuSubmenuBack>Back</MenuSubmenuBack>
              <MenuItem>New</MenuItem>
            </MenuSubmenu>
          </MenuList>
        </Menu>
      )
      const trigger = screen.getByText('File')
      const nestedMenu = getNestedMenu('New')

      fireEvent.click(trigger)
      expect(nestedMenu).toHaveClass('show')

      fireEvent.click(screen.getByText('Back'))
      expect(nestedMenu).not.toHaveClass('show')
      expect(trigger).toHaveFocus()
    })

    test('MenuSubmenuBack suppresses the focus-ring outline and forwards a caller onPointerDown', () => {
      const onPointerDown = vi.fn()
      render(
        <Menu visible>
          <MenuList>
            <MenuSubmenu trigger="File" stacked>
              <MenuSubmenuBack onPointerDown={onPointerDown} style={{ outline: '2px solid red' }}>
                Back
              </MenuSubmenuBack>
              <MenuItem>New</MenuItem>
            </MenuSubmenu>
          </MenuList>
        </Menu>
      )
      const back = screen.getByText('Back')

      fireEvent.pointerDown(back)

      expect(back.style.outline).toBe('none')
      expect(onPointerDown).toHaveBeenCalledTimes(1)
    })
  })

  describe('keyboard navigation', () => {
    test('ArrowRight on the trigger opens the submenu and focuses its first item; ArrowLeft on an item closes it and refocuses the trigger', async () => {
      render(
        <Menu visible>
          <MenuList>
            <MenuSubmenu trigger="File">
              <MenuItem href="#">New</MenuItem>
            </MenuSubmenu>
          </MenuList>
        </Menu>
      )
      const trigger = screen.getByText('File')
      const nestedMenu = getNestedMenu('New')

      trigger.focus()
      fireEvent.keyDown(trigger, { key: 'ArrowRight' })
      expect(nestedMenu).toHaveClass('show')
      await waitFor(() => expect(screen.getByText('New')).toHaveFocus())

      fireEvent.keyDown(screen.getByText('New'), { key: 'ArrowLeft' })
      expect(nestedMenu).not.toHaveClass('show')
      expect(trigger).toHaveFocus()
    })

    test('placement defaults to right-start under an LTR locale', () => {
      render(
        <Menu visible>
          <MenuList>
            <MenuSubmenu trigger="File">
              <MenuItem>New</MenuItem>
            </MenuSubmenu>
          </MenuList>
        </Menu>
      )
      expect(getNestedMenu('New')).toHaveAttribute('data-cx-placement', 'right-start')
    })
  })

  describe('RTL locale', () => {
    test('placement defaults to left-start, and ArrowLeft/ArrowRight swap roles', async () => {
      render(
        <I18nProvider locale="ar-SA">
          <Menu visible>
            <MenuList>
              <MenuSubmenu trigger="File">
                <MenuItem href="#">New</MenuItem>
              </MenuSubmenu>
            </MenuList>
          </Menu>
        </I18nProvider>
      )
      const trigger = screen.getByText('File')
      const nestedMenu = getNestedMenu('New')
      expect(nestedMenu).toHaveAttribute('data-cx-placement', 'left-start')

      trigger.focus()
      fireEvent.keyDown(trigger, { key: 'ArrowLeft' })
      expect(nestedMenu).toHaveClass('show')
      await waitFor(() => expect(screen.getByText('New')).toHaveFocus())

      fireEvent.keyDown(screen.getByText('New'), { key: 'ArrowRight' })
      expect(nestedMenu).not.toHaveClass('show')
      expect(trigger).toHaveFocus()
    })

    test('an explicit placement prop still wins over the locale-based default', () => {
      render(
        <I18nProvider locale="ar-SA">
          <Menu visible>
            <MenuList>
              <MenuSubmenu placement="right-start" trigger="File">
                <MenuItem>New</MenuItem>
              </MenuSubmenu>
            </MenuList>
          </Menu>
        </I18nProvider>
      )
      expect(getNestedMenu('New')).toHaveAttribute('data-cx-placement', 'right-start')
    })

    test('has no axe violations when open', async () => {
      const { container } = render(
        <I18nProvider locale="ar-SA">
          <Menu visible>
            <MenuList>
              <MenuSubmenu trigger="File">
                <MenuItem href="#">New</MenuItem>
                <MenuItem href="#">Open</MenuItem>
              </MenuSubmenu>
            </MenuList>
          </Menu>
        </I18nProvider>
      )
      fireEvent.click(screen.getByText('File'))
      expect(await axe(container)).toHaveNoViolations()
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the outer wrapper element', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(
        <Menu visible>
          <MenuList>
            <MenuSubmenu ref={ref} trigger="File">
              <MenuItem>New</MenuItem>
            </MenuSubmenu>
          </MenuList>
        </Menu>
      )
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
      expect(ref.current).toHaveClass('submenu')
    })
  })

  describe('accessibility', () => {
    test('has no axe violations when open', async () => {
      const { container } = render(
        <Menu visible>
          <MenuList>
            <MenuSubmenu trigger="File">
              <MenuItem href="#">New</MenuItem>
              <MenuItem href="#">Open</MenuItem>
            </MenuSubmenu>
          </MenuList>
        </Menu>
      )
      fireEvent.click(screen.getByText('File'))
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
