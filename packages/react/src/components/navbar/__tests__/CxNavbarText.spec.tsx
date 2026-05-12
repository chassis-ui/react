import * as React from 'react'
import { render } from '@testing-library/react'

import { CxNavbarText } from '../../../index'

test('loads and displays CxNavbarText component', async () => {
  const { container } = render(<CxNavbarText>Test</CxNavbarText>)
  expect(container).toMatchSnapshot()
})

test('CxNavbarText customize', async () => {
  const { container } = render(<CxNavbarText className="bazinga">Test</CxNavbarText>)
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('navbar-text')
  expect(container.firstChild).toHaveClass('bazinga')
})
