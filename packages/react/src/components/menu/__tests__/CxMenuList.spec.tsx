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
