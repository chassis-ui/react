import * as React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'

import { Menu, MenuToggle, MenuList, MenuItem } from '../../../src/index'

describe('Menu', () => {
  describe('rendering', () => {
    test('matches the baseline markup snapshot', () => {
      const { container } = render(<Menu>Test</Menu>)
      expect(container).toMatchSnapshot()
    })

    test('renders as a custom component with className merged', () => {
      render(
        <Menu className="bazinga" component="h3" placement="right-end" visible={true}>
          Test
        </Menu>
      )
      expect(screen.getByText('Test')).toHaveClass('bazinga')
    })

    test('matches the baseline markup snapshot when open', () => {
      const { container } = render(
        <Menu visible>
          <MenuToggle>Test</MenuToggle>
          <MenuList>
            <MenuItem>A</MenuItem>
            <MenuItem>B</MenuItem>
          </MenuList>
        </Menu>
      )
      expect(container).toMatchSnapshot()
    })
  })

  describe('open/close behavior', () => {
    test('reflects the visible prop on the menu panel', () => {
      render(
        <Menu visible={false}>
          <MenuToggle>Toggle</MenuToggle>
          <MenuList>
            <MenuItem>A</MenuItem>
          </MenuList>
        </Menu>
      )
      expect(screen.getByRole('menu', { hidden: true })).not.toHaveClass('show')
    })

    test('click toggles the menu and closes on outside click', () => {
      vi.useFakeTimers()
      render(
        <Menu>
          <MenuToggle>Toggle</MenuToggle>
          <MenuList>
            <MenuItem>A</MenuItem>
            <MenuItem>B</MenuItem>
          </MenuList>
        </Menu>
      )
      const toggle = screen.getByText('Toggle')
      expect(screen.getByRole('menu', { hidden: true })).not.toHaveClass('show')

      fireEvent.click(toggle)
      expect(screen.getByRole('menu')).toHaveClass('show')
      expect(toggle).toHaveAttribute('aria-expanded', 'true')

      vi.runAllTimers()
      fireEvent.click(document)
      expect(screen.getByRole('menu', { hidden: true })).not.toHaveClass('show')
      vi.useRealTimers()
    })

    test('clicking the toggle again while open closes the menu', async () => {
      const user = userEvent.setup()
      render(
        <Menu>
          <MenuToggle>Toggle</MenuToggle>
          <MenuList>
            <MenuItem>A</MenuItem>
          </MenuList>
        </Menu>
      )
      const toggle = screen.getByText('Toggle')

      await user.click(toggle)
      expect(toggle).toHaveAttribute('aria-expanded', 'true')

      await user.click(toggle)
      expect(toggle).toHaveAttribute('aria-expanded', 'false')
    })

    test('autoClose="inside" only closes on clicks inside the menu', () => {
      vi.useFakeTimers()
      render(
        <Menu autoClose="inside">
          <MenuToggle>Toggle</MenuToggle>
          <MenuList>
            <MenuItem>A</MenuItem>
          </MenuList>
        </Menu>
      )
      fireEvent.click(screen.getByText('Toggle'))
      vi.runAllTimers()

      fireEvent.click(document.body)
      expect(screen.getByRole('menu')).toHaveClass('show')

      fireEvent.click(screen.getByText('A'))
      expect(screen.getByRole('menu', { hidden: true })).not.toHaveClass('show')
      vi.useRealTimers()
    })

    test('autoClose={false} never closes automatically', () => {
      vi.useFakeTimers()
      render(
        <Menu autoClose={false}>
          <MenuToggle>Toggle</MenuToggle>
          <MenuList>
            <MenuItem>A</MenuItem>
          </MenuList>
        </Menu>
      )
      fireEvent.click(screen.getByText('Toggle'))
      vi.runAllTimers()
      fireEvent.click(document.body)
      expect(screen.getByRole('menu')).toHaveClass('show')
      vi.useRealTimers()
    })
  })

  describe('accessibility', () => {
    test('has no axe violations when open', async () => {
      const { container } = render(
        <Menu visible>
          <MenuToggle>Test</MenuToggle>
          <MenuList>
            <MenuItem href="#">A</MenuItem>
            <MenuItem href="#">B</MenuItem>
          </MenuList>
        </Menu>
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
