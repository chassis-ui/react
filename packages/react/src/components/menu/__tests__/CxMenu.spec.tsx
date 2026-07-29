import * as React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { axe } from 'jest-axe'

import { CxMenu, CxMenuToggle, CxMenuList, CxMenuItem } from '../../../index'

describe('CxMenu', () => {
  describe('rendering', () => {
    test('matches the baseline markup snapshot', () => {
      const { container } = render(<CxMenu>Test</CxMenu>)
      expect(container).toMatchSnapshot()
    })

    test('renders as a custom component with className merged', () => {
      render(
        <CxMenu className="bazinga" component="h3" placement="right-end" visible={true}>
          Test
        </CxMenu>
      )
      expect(screen.getByText('Test')).toHaveClass('bazinga')
    })

    test('matches the baseline markup snapshot when open', () => {
      const { container } = render(
        <CxMenu visible>
          <CxMenuToggle>Test</CxMenuToggle>
          <CxMenuList>
            <CxMenuItem>A</CxMenuItem>
            <CxMenuItem>B</CxMenuItem>
          </CxMenuList>
        </CxMenu>
      )
      expect(container).toMatchSnapshot()
    })
  })

  describe('open/close behavior', () => {
    test('reflects the visible prop on the menu panel', () => {
      render(
        <CxMenu visible={false}>
          <CxMenuToggle>Toggle</CxMenuToggle>
          <CxMenuList>
            <CxMenuItem>A</CxMenuItem>
          </CxMenuList>
        </CxMenu>
      )
      expect(screen.getByRole('menu', { hidden: true })).not.toHaveClass('show')
    })

    test('click toggles the menu and closes on outside click', () => {
      vi.useFakeTimers()
      render(
        <CxMenu>
          <CxMenuToggle>Toggle</CxMenuToggle>
          <CxMenuList>
            <CxMenuItem>A</CxMenuItem>
            <CxMenuItem>B</CxMenuItem>
          </CxMenuList>
        </CxMenu>
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

    test('autoClose="inside" only closes on clicks inside the menu', () => {
      vi.useFakeTimers()
      render(
        <CxMenu autoClose="inside">
          <CxMenuToggle>Toggle</CxMenuToggle>
          <CxMenuList>
            <CxMenuItem>A</CxMenuItem>
          </CxMenuList>
        </CxMenu>
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
        <CxMenu autoClose={false}>
          <CxMenuToggle>Toggle</CxMenuToggle>
          <CxMenuList>
            <CxMenuItem>A</CxMenuItem>
          </CxMenuList>
        </CxMenu>
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
        <CxMenu visible>
          <CxMenuToggle>Test</CxMenuToggle>
          <CxMenuList>
            <CxMenuItem href="#">A</CxMenuItem>
            <CxMenuItem href="#">B</CxMenuItem>
          </CxMenuList>
        </CxMenu>
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
