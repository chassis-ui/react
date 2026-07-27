import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { CxMenu, CxMenuToggle, CxMenuList, CxMenuItem } from '../../../index'

describe('CxMenuToggle', () => {
  describe('rendering', () => {
    test('renders a button with the caret class and aria-expanded', () => {
      render(
        <CxMenu>
          <CxMenuToggle>Test</CxMenuToggle>
          <CxMenuList>
            <CxMenuItem>A</CxMenuItem>
          </CxMenuList>
        </CxMenu>
      )
      const toggle = screen.getByRole('button', { name: 'Test' })
      expect(toggle).toHaveClass('button', 'caret')
      expect(toggle).toHaveAttribute('aria-expanded', 'false')
    })

    test('forwards custom props to the underlying button', () => {
      render(
        <CxMenu>
          <CxMenuToggle context="secondary" className="bazinga">
            Test
          </CxMenuToggle>
          <CxMenuList>
            <CxMenuItem>A</CxMenuItem>
          </CxMenuList>
        </CxMenu>
      )
      const toggle = screen.getByRole('button', { name: 'Test' })
      expect(toggle).toHaveClass('secondary', 'bazinga')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying button', () => {
      const ref = React.createRef<HTMLButtonElement>()
      render(
        <CxMenu>
          <CxMenuToggle ref={ref}>Test</CxMenuToggle>
          <CxMenuList>
            <CxMenuItem>A</CxMenuItem>
          </CxMenuList>
        </CxMenu>
      )
      expect(ref.current).toBeInstanceOf(HTMLButtonElement)
      expect(ref.current).toBe(screen.getByRole('button'))
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(
        <CxMenu>
          <CxMenuToggle>Test</CxMenuToggle>
          <CxMenuList>
            <CxMenuItem href="#">A</CxMenuItem>
          </CxMenuList>
        </CxMenu>
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
