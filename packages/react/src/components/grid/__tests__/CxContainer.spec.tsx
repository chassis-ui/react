import * as React from 'react'
import { render } from '@testing-library/react'

import { CxContainer } from '../../../index'

test('loads and displays CxContainer component', async () => {
  const { container } = render(<CxContainer>Test</CxContainer>)
  expect(container).toMatchSnapshot()
})

test('CxContainer customize fluid', async () => {
  const { container } = render(
    <CxContainer className="bazinga" fluid>
      Test
    </CxContainer>,
  )
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('bazinga')
  expect(container.firstChild).toHaveClass('container-fluid')
})

test('CxContainer customize', async () => {
  const { container } = render(
    <CxContainer md className="bazinga">
      Test
    </CxContainer>,
  )
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('bazinga')
  expect(container.firstChild).toHaveClass('container-medium')
})
