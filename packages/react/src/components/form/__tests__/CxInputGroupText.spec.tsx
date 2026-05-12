import * as React from 'react'
import { render } from '@testing-library/react'

import { CxInputGroupText } from '../../../index'

test('loads and displays CxInputGroupText component', async () => {
  const { container } = render(<CxInputGroupText>Test</CxInputGroupText>)
  expect(container).toMatchSnapshot()
})

test('CxInputGroupText customize', async () => {
  const { container } = render(<CxInputGroupText className="bazinga">Test</CxInputGroupText>)
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('bazinga')
  expect(container.firstChild).toHaveClass('input-group-text')
})
