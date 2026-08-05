import * as React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { axe } from 'jest-axe'

import { Menu, MenuList, MenuItem, MenuSubmenu, MenuSubmenuBack } from '../../../index'

// The nested submenu panel is a `.menu` div with role="menu" (see MenuList), but a menu can
// have several nested submenus open/closed at once, each with that same role — disambiguating
// "the panel that contains this item" needs a class-scoped traversal from the item's text, not
// an ambiguous getByRole('menu').
const getNestedMenu = (itemText: string) =>
  // eslint-disable-next-line testing-library/no-node-access
  screen.getByText(itemText).closest('.menu') as HTMLElement

describe('MenuSubmenu', () => {
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
