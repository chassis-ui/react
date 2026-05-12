import * as React from 'react'
import { render } from '@testing-library/react'

import { CxModalContent } from '../../../index'

test('loads and displays CxModalContent component', async () => {
  const { container } = render(<CxModalContent>Test</CxModalContent>)
  expect(container).toMatchSnapshot()
})

test('CxModalContent customize', async () => {
  const { container } = render(<CxModalContent className="bazinga">Test</CxModalContent>)
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('bazinga')
  expect(container.firstChild).toHaveClass('modal-content')
})
