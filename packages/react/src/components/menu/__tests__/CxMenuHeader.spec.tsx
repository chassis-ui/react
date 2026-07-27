import * as React from 'react'
import { render, screen } from '@testing-library/react'

import { CxMenuHeader } from '../../../index'

test('loads and displays CxMenuHeader component', async () => {
  const { container } = render(<CxMenuHeader>Test</CxMenuHeader>)
  expect(container).toMatchSnapshot()
  expect(screen.getByText('Test')).toHaveClass('menu-header')
})

test('CxMenuHeader customize', async () => {
  render(
    <CxMenuHeader component="h5" className="bazinga">
      Test
    </CxMenuHeader>
  )
  const header = screen.getByText('Test')
  expect(header).toHaveClass('bazinga')
  expect(header.tagName).toBe('H5')
})
