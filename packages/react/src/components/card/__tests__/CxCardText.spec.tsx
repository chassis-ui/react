import * as React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { CxCardText } from '../../../index'

test('loads and displays CxCardText component', async () => {
  const { container } = render(<CxCardText>Test</CxCardText>)
  expect(container).toMatchSnapshot()
})

test('CxCardText customize', async () => {
  const { container } = render(
    <CxCardText className="bazinga" component="h3">
      Test
    </CxCardText>,
  )
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('bazinga')
  expect(container.firstChild).toHaveClass('card-body')
})
