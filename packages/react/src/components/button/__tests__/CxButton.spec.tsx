import * as React from 'react'
import { render } from '@testing-library/react'

import { CxButton } from '../../../index'

test('loads and displays CxButton component', async () => {
  const { container } = render(<CxButton>Test</CxButton>)
  expect(container).toMatchSnapshot()
})

test('CxButton customize witch href', async () => {
  const { container } = render(
    <CxButton context="primary" component="span" href="/bazinga">
      Test
    </CxButton>
  )
  expect(container).toMatchSnapshot()
})

test('CxButton customize', async () => {
  const { container } = render(
    <CxButton
      active={true}
      className="bazinga"
      context="warning"
      component="span"
      disabled={true}
      role="bazinga"
      shape="rounded"
      size="large"
      type="submit"
      variant="outline"
    >
      Test
    </CxButton>
  )
  expect(container).toMatchSnapshot()

  expect(container.firstChild).toHaveClass('bazinga')
  expect(container.firstChild).toHaveClass('button')
  expect(container.firstChild).toHaveClass('outline')
  expect(container.firstChild).toHaveClass('warning')
  expect(container.firstChild).toHaveClass('large')
  expect(container.firstChild).toHaveClass('rounded')
})
