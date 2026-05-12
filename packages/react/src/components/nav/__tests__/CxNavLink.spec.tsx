import * as React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { CxNavLink } from '../../../index'

test('loads and displays CxNavLink component', async () => {
  const { container } = render(<CxNavLink>Test</CxNavLink>)
  expect(container).toMatchSnapshot()
})

test('CxNavLink customize', async () => {
  const { container } = render(
    <CxNavLink active={true} className="bazinga" component="h3" disabled={true} href="/bazinga">
      Test
    </CxNavLink>,
  )
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('nav-link')
  expect(container.firstChild).toHaveClass('bazinga')
})

test('CxNavLink witch "to" prop', async () => {
  const { container } = render(<CxNavLink to="/bazinga">Test</CxNavLink>)
  expect(container).toMatchSnapshot()
})
