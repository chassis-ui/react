import * as React from 'react'
import { render } from '@testing-library/react'

import { CxMenu, CxMenuList, CxMenuItem } from '../../../index'

test('loads and displays CxMenuList component', async () => {
  render(
    <CxMenu>
      <CxMenuList className="bazinga">
        <CxMenuItem>A</CxMenuItem>
      </CxMenuList>
    </CxMenu>,
  )
  const menu = document.querySelector('.menu')
  expect(menu).toHaveClass('bazinga')
  expect(menu).toHaveAttribute('aria-hidden', 'true')
})

test('CxMenuList reflects the menu visibility', async () => {
  render(
    <CxMenu visible>
      <CxMenuList>
        <CxMenuItem>A</CxMenuItem>
      </CxMenuList>
    </CxMenu>,
  )
  const menu = document.querySelector('.menu')
  expect(menu).toHaveClass('show')
  expect(menu).toHaveAttribute('aria-hidden', 'false')
})

test('CxMenuList portals to a container when requested', async () => {
  render(
    <CxMenu container>
      <CxMenuList>
        <CxMenuItem>A</CxMenuItem>
      </CxMenuList>
    </CxMenu>,
  )
  const menu = document.body.querySelector(':scope > .menu')
  expect(menu).not.toBeNull()
})
