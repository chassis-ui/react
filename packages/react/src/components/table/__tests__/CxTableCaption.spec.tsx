import * as React from 'react'
import { render } from '@testing-library/react'

import { CxTableCaption } from '../../../index'

test('loads and displays CxTableCaption component', async () => {
  const table = document.createElement('table')
  const { container } = render(<CxTableCaption />, {
    container: document.body.appendChild(table),
  })
  expect(container).toMatchSnapshot()
})

test('CxTableCaption customize', async () => {
  const table = document.createElement('table')
  const { container } = render(<CxTableCaption>Test</CxTableCaption>, {
    container: document.body.appendChild(table),
  })
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveTextContent('Test')
})
