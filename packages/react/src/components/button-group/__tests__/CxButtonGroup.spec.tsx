import * as React from 'react'
import { render } from '@testing-library/react'

import { CxButtonGroup, CxButton } from '../../../index'

test('loads and displays CxButtonGroup component', async () => {
  const { container } = render(<CxButtonGroup></CxButtonGroup>)
  expect(container).toMatchSnapshot()
})

test('CxButtonGroup customize', async () => {
  const { container } = render(
    <CxButtonGroup className="bazinga" size="large" vertical={false}>
      <CxButton>Test A</CxButton>
      <CxButton>Test B</CxButton>
      <CxButton>Test C</CxButton>
    </CxButtonGroup>
  )
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('bazinga')
  expect(container.firstChild).toHaveClass('button-group')
  expect(container.firstChild).toHaveClass('large')
})

test('CxButtonGroup customize vertical', async () => {
  const { container } = render(
    <CxButtonGroup className="bazinga" size="large" vertical={true}>
      <CxButton>Test A</CxButton>
      <CxButton>Test B</CxButton>
      <CxButton>Test C</CxButton>
    </CxButtonGroup>
  )
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('bazinga')
  expect(container.firstChild).toHaveClass('button-group')
  expect(container.firstChild).toHaveClass('vertical')
  expect(container.firstChild).toHaveClass('large')
})
