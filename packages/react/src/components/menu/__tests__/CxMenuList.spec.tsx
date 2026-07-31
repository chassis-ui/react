import * as React from 'react'
import { render, screen } from '@testing-library/react'

import { CxMenu, CxMenuList, CxMenuItem } from '../../../index'

describe('CxMenuList', () => {
  describe('rendering', () => {
    test('renders a hidden menu with the base class and className merged', () => {
      render(
        <CxMenu>
          <CxMenuList className="bazinga">
            <CxMenuItem>A</CxMenuItem>
          </CxMenuList>
        </CxMenu>
      )
      const menu = screen.getByRole('menu', { hidden: true })
      expect(menu).toHaveClass('bazinga')
      expect(menu).toHaveAttribute('aria-hidden', 'true')
    })

    test('reflects the menu visibility', () => {
      render(
        <CxMenu visible>
          <CxMenuList>
            <CxMenuItem>A</CxMenuItem>
          </CxMenuList>
        </CxMenu>
      )
      const menu = screen.getByRole('menu')
      expect(menu).toHaveClass('show')
      expect(menu).toHaveAttribute('aria-hidden', 'false')
    })
  })

  describe('items prop', () => {
    test('renders items as menu items', () => {
      render(
        <CxMenu visible>
          <CxMenuList
            items={[
              { id: 'a', label: 'Alpha' },
              { id: 'b', label: 'Beta' }
            ]}
          />
        </CxMenu>
      )
      expect(screen.getByRole('menuitem', { name: 'Alpha' })).toBeInTheDocument()
      expect(screen.getByRole('menuitem', { name: 'Beta' })).toBeInTheDocument()
    })

    test('items wins over children when both are given', () => {
      render(
        <CxMenu visible>
          <CxMenuList items={[{ id: 'a', label: 'From items' }]}>
            <CxMenuItem>From children</CxMenuItem>
          </CxMenuList>
        </CxMenu>
      )
      expect(screen.getByRole('menuitem', { name: 'From items' })).toBeInTheDocument()
      expect(screen.queryByText('From children')).not.toBeInTheDocument()
    })

    test('renders a button item without href, and a link item with href', () => {
      render(
        <CxMenu visible>
          <CxMenuList
            items={[
              { id: 'a', label: 'Action' },
              { id: 'b', label: 'Link', href: '#' }
            ]}
          />
        </CxMenu>
      )
      expect(screen.getByRole('menuitem', { name: 'Action' }).tagName).toBe('BUTTON')
      const link = screen.getByRole('menuitem', { name: 'Link' })
      expect(link.tagName).toBe('A')
      expect(link).toHaveAttribute('href', '#')
    })

    test('calls onClick for an item def', () => {
      const onClick = vi.fn()
      render(
        <CxMenu visible>
          <CxMenuList items={[{ id: 'a', label: 'Action', onClick }]} />
        </CxMenu>
      )
      screen.getByRole('menuitem', { name: 'Action' }).click()
      expect(onClick).toHaveBeenCalledTimes(1)
    })

    test('applies disabled and selected state from an item def', () => {
      render(
        <CxMenu visible>
          <CxMenuList
            items={[
              { id: 'a', label: 'Disabled', disabled: true },
              { id: 'b', label: 'Selected', selected: true }
            ]}
          />
        </CxMenu>
      )
      const disabled = screen.getByRole('menuitem', { name: 'Disabled' })
      expect(disabled).toHaveClass('disabled')
      expect(disabled).toBeDisabled()
      expect(screen.getByRole('menuitem', { name: 'Selected' })).toHaveClass('selected')
    })

    test('renders a header def as a non-interactive CxMenuHeader', () => {
      render(
        <CxMenu visible>
          <CxMenuList items={[{ type: 'header', id: 'h', label: 'Group' }]} />
        </CxMenu>
      )
      expect(screen.getByText('Group').tagName).toBe('H4')
      expect(screen.getByText('Group')).toHaveClass('menu-header')
      expect(screen.queryByRole('menuitem')).not.toBeInTheDocument()
    })

    test('renders a divider def as an hr.menu-divider', () => {
      const { container } = render(
        <CxMenu visible>
          <CxMenuList items={[{ type: 'divider', id: 'd' }]} />
        </CxMenu>
      )
      // eslint-disable-next-line testing-library/no-node-access, testing-library/no-container
      const divider = container.querySelector('hr.menu-divider')
      expect(divider).toBeInTheDocument()
    })

    test('renders icon/description rich content from an item def', () => {
      render(
        <CxMenu visible>
          <CxMenuList
            items={[
              { id: 'a', label: 'Admin', icon: <span data-testid="icon" />, description: 'Full access' }
            ]}
          />
        </CxMenu>
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
        <CxMenu container>
          <CxMenuList>
            <CxMenuItem>A</CxMenuItem>
          </CxMenuList>
        </CxMenu>
      )
      // Verifying the portal actually landed on document.body requires checking direct DOM
      // parentage - no Testing Library query expresses "is a child of".
      // eslint-disable-next-line testing-library/no-node-access
      expect(screen.getByRole('menu', { hidden: true }).parentElement).toBe(document.body)
    })
  })
})
