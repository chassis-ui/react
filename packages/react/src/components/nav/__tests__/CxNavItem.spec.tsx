import * as React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { CxNavItem } from '../../../index'

test('loads and displays CxNavItem component', async () => {
  const { container } = render(<CxNavItem>Test</CxNavItem>)
  expect(container).toMatchSnapshot()
})

test('CxNavItem customize', async () => {
  const { container } = render(
    <CxNavItem active={true} className="bazinga" component="h3" disabled={true} href="/bazinga">
      Test
    </CxNavItem>,
  )
  expect(container).toMatchSnapshot()
  expect(container.firstChild?.firstChild).toHaveClass('nav-link')
  expect(container.firstChild).toHaveClass('nav-item')
  expect(container.firstChild).toHaveClass('bazinga')
  expect(container).toMatchSnapshot()
})
