import * as React from 'react'
import { render, screen } from '@testing-library/react'

import { CxMenu, CxMenuToggle, CxMenuList, CxMenuItem } from '../../../index'

test('loads and displays CxMenuToggle component', async () => {
  render(
    <CxMenu>
      <CxMenuToggle>Test</CxMenuToggle>
      <CxMenuList>
        <CxMenuItem>A</CxMenuItem>
      </CxMenuList>
    </CxMenu>,
  )
  const toggle = screen.getByText('Test')
  expect(toggle).toHaveClass('button')
  expect(toggle).toHaveClass('caret')
  expect(toggle).toHaveAttribute('aria-expanded', 'false')
})

test('CxMenuToggle forwards ref to the underlying button', async () => {
  const ref = React.createRef<HTMLButtonElement>()
  render(
    <CxMenu>
      <CxMenuToggle ref={ref}>Test</CxMenuToggle>
      <CxMenuList>
        <CxMenuItem>A</CxMenuItem>
      </CxMenuList>
    </CxMenu>,
  )
  expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  expect(ref.current).toBe(screen.getByText('Test'))
})

test('CxMenuToggle forwards custom props to the underlying button', async () => {
  render(
    <CxMenu>
      <CxMenuToggle context="secondary" className="bazinga">
        Test
      </CxMenuToggle>
      <CxMenuList>
        <CxMenuItem>A</CxMenuItem>
      </CxMenuList>
    </CxMenu>,
  )
  const toggle = screen.getByText('Test')
  expect(toggle).toHaveClass('secondary')
  expect(toggle).toHaveClass('bazinga')
})
