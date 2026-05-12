import * as React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { CxCardLink } from '../../../index'

test('loads and displays CxCardLink component', async () => {
  const { container } = render(<CxCardLink>Test</CxCardLink>)
  expect(container).toMatchSnapshot()
})

test('CxCardLink customize', async () => {
  const { container } = render(
    <CxCardLink className="bazinga" href="/bazinga">
      Test
    </CxCardLink>,
  )
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('bazinga')
  expect(container.firstChild).toHaveClass('card-link')
})
