import * as React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { CxSpinner } from '../../../index'

test('loads and displays CxSpinner component', async () => {
  const { container } = render(<CxSpinner>Test</CxSpinner>)
  expect(container).toMatchSnapshot()
})

test('CxSpinner customize', async () => {
  const { container } = render(
    <CxSpinner className="bazinga" context="warning" component="h3" size="small" variant="grow">
      Test
    </CxSpinner>,
  )
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('bazinga')
  expect(container.firstChild).toHaveClass('spinner-grow')
  expect(container.firstChild).toHaveClass('fg-warning')
  expect(container.firstChild).toHaveClass('spinner-grow-small')
})
