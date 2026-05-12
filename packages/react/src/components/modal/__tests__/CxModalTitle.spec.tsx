import * as React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { CxModalTitle } from '../../../index'

test('loads and displays CxModalTitle component', async () => {
  const { container } = render(<CxModalTitle>Test</CxModalTitle>)
  expect(container).toMatchSnapshot()
})

test('CxModalTitle customize', async () => {
  const { container } = render(
    <CxModalTitle className="bazinga" component="h3">
      Test
    </CxModalTitle>,
  )
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('bazinga')
  expect(container.firstChild).toHaveClass('modal-title')
})
