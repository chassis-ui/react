import * as React from 'react'
import { render } from '@testing-library/react'

import { CxDrawerTitle } from '../../../index'

test('loads and displays CxDrawerTitle component', async () => {
  const { container } = render(<CxDrawerTitle>Test</CxDrawerTitle>)
  expect(container).toMatchSnapshot()
  expect(container.firstChild?.nodeName).toBe('H2')
})

test('CxDrawerTitle customize', async () => {
  const { container } = render(
    <CxDrawerTitle className="bazinga" component="h3">
      Test
    </CxDrawerTitle>
  )
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('bazinga')
  expect(container.firstChild).toHaveClass('drawer-title')
})
