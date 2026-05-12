import * as React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { CxTabContent } from '../../../index'

test('loads and displays CxTabContent component', async () => {
  const { container } = render(<CxTabContent>Test</CxTabContent>)
  expect(container).toMatchSnapshot()
})

test('CxTabContent customize', async () => {
  const { container } = render(<CxTabContent className="bazinga">Test</CxTabContent>)
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('bazinga')
  expect(container.firstChild).toHaveClass('tab-content')
})
