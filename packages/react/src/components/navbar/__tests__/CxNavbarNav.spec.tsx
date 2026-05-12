import * as React from 'react'
import { render } from '@testing-library/react'

import { CxNavbarNav } from '../../../index'

test('loads and displays CxNavbarNav component', async () => {
  const { container } = render(<CxNavbarNav>Test</CxNavbarNav>)
  expect(container).toMatchSnapshot()
})

test('CxNavbarNav customize', async () => {
  const { container } = render(
    <CxNavbarNav className="bazinga" component="h3">
      Test
    </CxNavbarNav>,
  )
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('bazinga')
  expect(container.firstChild).toHaveClass('navbar-nav')
  expect(container.firstChild).toHaveAttribute('role', 'navigation')
})
