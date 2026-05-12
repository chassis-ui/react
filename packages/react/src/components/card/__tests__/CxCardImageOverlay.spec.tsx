import * as React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { CxCardImageOverlay } from '../../../index'

test('loads and displays CxCardImageOverlay component', async () => {
  const { container } = render(<CxCardImageOverlay />)
  expect(container).toMatchSnapshot()
})

test('CxCardImageOverlay customize', async () => {
  const { container } = render(<CxCardImageOverlay className="bazinga">Test</CxCardImageOverlay>)
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('card-img-overlay')
  expect(container.firstChild).toHaveClass('bazinga')
  expect(container.firstChild).toHaveTextContent('Test')
})
