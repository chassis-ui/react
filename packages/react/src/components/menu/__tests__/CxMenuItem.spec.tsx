import * as React from 'react'
import { render, screen } from '@testing-library/react'

import { CxMenuItem } from '../../../index'

test('loads and displays CxMenuItem component', async () => {
  const { container } = render(<CxMenuItem href="#">Test</CxMenuItem>)
  expect(container).toMatchSnapshot()
  expect(screen.getByText('Test')).toHaveClass('menu-item')
})

test('CxMenuItem selected', async () => {
  render(
    <CxMenuItem component="button" selected>
      Test
    </CxMenuItem>,
  )
  expect(screen.getByText('Test')).toHaveClass('selected')
})

test('CxMenuItem disabled', async () => {
  render(
    <CxMenuItem href="#" disabled>
      Test
    </CxMenuItem>,
  )
  const item = screen.getByText('Test')
  expect(item).toHaveClass('disabled')
  expect(item).toHaveAttribute('aria-disabled', 'true')
})
