import * as React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { axe } from 'jest-axe'

import {
  Menu,
  MenuList,
  MenuItem,
  MenuText,
  MenuToggle,
  Modal,
  TextInput
} from '../../../src/index'

describe('MenuList', () => {
  describe('rendering', () => {
    test('renders a hidden menu with the base class and className merged', () => {
      render(
        <Menu>
          <MenuList className="bazinga">
            <MenuItem>A</MenuItem>
          </MenuList>
        </Menu>
      )
      // Hidden by chassis-css's `display: none` on `.menu:not(.show)`, not by `aria-hidden`: the
      // attribute over focusable items is redundant, and html-validate flags it.
      const menu = screen.getByRole('menu')
      expect(menu).toHaveClass('bazinga')
      expect(menu).not.toHaveClass('show')
      expect(menu).not.toHaveAttribute('aria-hidden')
    })

    test('is labelled by the toggle, unless it is given an `aria-label`, and not at all outside a Menu', () => {
      const { rerender } = render(
        <Menu visible>
          <MenuToggle>Toggle</MenuToggle>
          <MenuList>
            <MenuItem>A</MenuItem>
          </MenuList>
        </Menu>
      )
      expect(screen.getByRole('menu')).toHaveAttribute(
        'aria-labelledby',
        screen.getByRole('button', { name: 'Toggle' }).id
      )

      rerender(
        <Menu visible>
          <MenuToggle>Toggle</MenuToggle>
          <MenuList aria-label="Actions">
            <MenuItem>A</MenuItem>
          </MenuList>
        </Menu>
      )
      expect(screen.getByRole('menu', { name: 'Actions' })).not.toHaveAttribute('aria-labelledby')

      rerender(
        <MenuList>
          <MenuItem>A</MenuItem>
        </MenuList>
      )
      expect(screen.getByRole('menu')).not.toHaveAttribute('aria-labelledby')
    })

    test('reflects the menu visibility', () => {
      render(
        <Menu visible>
          <MenuList>
            <MenuItem>A</MenuItem>
          </MenuList>
        </Menu>
      )
      const menu = screen.getByRole('menu')
      expect(menu).toHaveClass('show')
      expect(menu).not.toHaveAttribute('aria-hidden')
    })
  })

  describe('items prop', () => {
    test('renders items as menu items', () => {
      render(
        <Menu visible>
          <MenuList
            items={[
              { id: 'a', label: 'Alpha' },
              { id: 'b', label: 'Beta' }
            ]}
          />
        </Menu>
      )
      expect(screen.getByRole('menuitem', { name: 'Alpha' })).toBeInTheDocument()
      expect(screen.getByRole('menuitem', { name: 'Beta' })).toBeInTheDocument()
    })

    test('items wins over children when both are given', () => {
      render(
        <Menu visible>
          <MenuList items={[{ id: 'a', label: 'From items' }]}>
            <MenuItem>From children</MenuItem>
          </MenuList>
        </Menu>
      )
      expect(screen.getByRole('menuitem', { name: 'From items' })).toBeInTheDocument()
      expect(screen.queryByText('From children')).not.toBeInTheDocument()
    })

    test('renders a button item without href, and a link item with href', () => {
      render(
        <Menu visible>
          <MenuList
            items={[
              { id: 'a', label: 'Action' },
              { id: 'b', label: 'Link', href: '#' }
            ]}
          />
        </Menu>
      )
      expect(screen.getByRole('menuitem', { name: 'Action' }).tagName).toBe('BUTTON')
      const link = screen.getByRole('menuitem', { name: 'Link' })
      expect(link.tagName).toBe('A')
      expect(link).toHaveAttribute('href', '#')
    })

    test('calls onClick for an item def', () => {
      const onClick = vi.fn()
      render(
        <Menu visible>
          <MenuList items={[{ id: 'a', label: 'Action', onClick }]} />
        </Menu>
      )
      fireEvent.click(screen.getByRole('menuitem', { name: 'Action' }))
      expect(onClick).toHaveBeenCalledTimes(1)
    })

    test('applies disabled and selected state from an item def', () => {
      render(
        <Menu visible>
          <MenuList
            items={[
              { id: 'a', label: 'Disabled', disabled: true },
              { id: 'b', label: 'Selected', selected: true }
            ]}
          />
        </Menu>
      )
      const disabled = screen.getByRole('menuitem', { name: 'Disabled' })
      expect(disabled).toHaveClass('disabled')
      expect(disabled).toBeDisabled()
      expect(screen.getByRole('menuitem', { name: 'Selected' })).toHaveClass('selected')
    })

    test('renders a header def as a non-interactive MenuHeader', () => {
      render(
        <Menu visible>
          <MenuList items={[{ type: 'header', id: 'h', label: 'Group' }]} />
        </Menu>
      )
      expect(screen.getByText('Group').tagName).toBe('H4')
      expect(screen.getByText('Group')).toHaveClass('menu-header')
      expect(screen.queryByRole('menuitem')).not.toBeInTheDocument()
    })

    test('renders a divider def as an hr.menu-divider', () => {
      const { container } = render(
        <Menu visible>
          <MenuList items={[{ type: 'divider', id: 'd' }]} />
        </Menu>
      )
      // eslint-disable-next-line testing-library/no-node-access, testing-library/no-container
      const divider = container.querySelector('hr.menu-divider')
      expect(divider).toBeInTheDocument()
    })

    test('renders icon/description rich content from an item def', () => {
      render(
        <Menu visible>
          <MenuList
            items={[
              {
                id: 'a',
                label: 'Admin',
                icon: <span data-testid="icon" />,
                description: 'Full access'
              }
            ]}
          />
        </Menu>
      )
      const item = screen.getByRole('menuitem', { name: 'AdminFull access' })
      // eslint-disable-next-line testing-library/no-node-access
      expect(item.querySelector('.menu-item-icon')).toBeInTheDocument()
      // eslint-disable-next-line testing-library/no-node-access
      expect(item.querySelector('.menu-item-description')).toHaveTextContent('Full access')
    })
  })

  describe('portal behavior', () => {
    test('portals to a container when requested', () => {
      render(
        <Menu container>
          <MenuList>
            <MenuItem>A</MenuItem>
          </MenuList>
        </Menu>
      )
      // Verifying the portal actually landed on document.body requires checking direct DOM
      // parentage - no Testing Library query expresses "is a child of".
      // eslint-disable-next-line testing-library/no-node-access
      expect(screen.getByRole('menu', { hidden: true }).parentElement).toBe(document.body)
    })

    test('portals to the element given as container', () => {
      const target = document.createElement('div')
      document.body.append(target)
      render(
        <Menu container={target} visible>
          <MenuToggle>Toggle</MenuToggle>
          <MenuList>
            <MenuItem>A</MenuItem>
          </MenuList>
        </Menu>
      )
      expect(target).toContainElement(screen.getByRole('menu'))
      target.remove()
    })

    // Regression test: `container` always meant `document.body`, which lies under the top layer
    // a modal dialog is in: the list of a menu in a `Modal` opened behind it.
    test('portals into the open dialog the menu is in, where its top layer is', () => {
      render(
        <Modal instant visible>
          <Menu container>
            <MenuToggle>Toggle</MenuToggle>
            <MenuList>
              <MenuItem>A</MenuItem>
            </MenuList>
          </Menu>
        </Modal>
      )
      fireEvent.click(screen.getByRole('button', { name: 'Toggle' }))
      const list = screen.getByRole('menu')
      expect(list).toHaveClass('show')
      // The dialog itself, not somewhere deeper in it.
      // eslint-disable-next-line testing-library/no-node-access
      expect(list.parentElement).toBe(screen.getByRole('dialog'))
      expect(screen.getByRole('menuitem', { name: 'A' })).toBeInTheDocument()
    })
  })

  // The menu's arrow navigation took Home, End and the arrows from a text field in the list: the
  // caret didn't move, and ArrowDown left the field for an item.
  describe('form controls in the list', () => {
    const prevented = (target: HTMLElement, key: string) =>
      !fireEvent.keyDown(target, { key, bubbles: true, cancelable: true })

    test('leaves the keys of a text field, a select and a textarea to them', () => {
      render(
        <Menu defaultVisible>
          <MenuToggle>Toggle</MenuToggle>
          <MenuList>
            <MenuText>
              <TextInput aria-label="Email" defaultValue="someone@example.com" />
              <select aria-label="Size">
                <option>S</option>
                <option>M</option>
              </select>
              <textarea aria-label="Note" />
            </MenuText>
            <MenuItem>A</MenuItem>
          </MenuList>
        </Menu>
      )
      for (const control of [
        screen.getByRole('textbox', { name: 'Email' }),
        screen.getByRole('combobox', { name: 'Size' }),
        screen.getByRole('textbox', { name: 'Note' })
      ]) {
        control.focus()
        for (const key of ['Home', 'End', 'ArrowDown', 'ArrowUp']) {
          expect(prevented(control, key)).toBe(false)
          expect(control).toHaveFocus()
        }
      }
    })

    test('a checkbox in the list still steps on to the items', () => {
      vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(1)
      render(
        <Menu defaultVisible>
          <MenuToggle>Toggle</MenuToggle>
          <MenuList>
            <MenuText>
              <input aria-label="Remember" type="checkbox" />
            </MenuText>
            <MenuItem>A</MenuItem>
          </MenuList>
        </Menu>
      )
      const checkbox = screen.getByRole('checkbox', { name: 'Remember' })
      checkbox.focus()
      expect(prevented(checkbox, 'ArrowDown')).toBe(true)
      expect(screen.getByRole('menuitem', { name: 'A' })).toHaveFocus()
      vi.restoreAllMocks()
    })

    test('Escape in a text field still closes the menu', () => {
      render(
        <Menu defaultVisible>
          <MenuToggle>Toggle</MenuToggle>
          <MenuList>
            <MenuText>
              <TextInput aria-label="Email" />
            </MenuText>
          </MenuList>
        </Menu>
      )
      const field = screen.getByRole('textbox', { name: 'Email' })
      field.focus()
      fireEvent.keyDown(field, { key: 'Escape' })
      expect(screen.getByRole('button', { name: 'Toggle' })).toHaveAttribute(
        'aria-expanded',
        'false'
      )
    })
  })

  describe('accessibility', () => {
    test('has no axe violations rendering items with headers, dividers and disabled state', async () => {
      const { container } = render(
        <Menu visible>
          <MenuList
            items={[
              { type: 'header', id: 'h', label: 'Group' },
              {
                id: 'a',
                label: 'Admin',
                icon: <span aria-hidden="true" />,
                description: 'Full access'
              },
              { type: 'divider', id: 'd' },
              { id: 'b', label: 'Disabled', disabled: true },
              { id: 'c', label: 'Link', href: '#' }
            ]}
          />
        </Menu>
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
