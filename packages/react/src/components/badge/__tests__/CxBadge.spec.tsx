import * as React from 'react'
import { render } from '@testing-library/react'

import { CxBadge } from '../../../index'

test('loads and displays CxBadge component', async () => {
  const { container } = render(<CxBadge context="primary">Test</CxBadge>)
  expect(container).toMatchSnapshot()
})

test('CxBadge customize', async () => {
  const { container } = render(
    <CxBadge className="bazinga" context="warning" component="div" shape="rounded" textColor="white">
      Test
    </CxBadge>,
  )
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('bazinga')
  expect(container.firstChild).toHaveClass('badge')
  expect(container.firstChild).toHaveClass('warning')
  expect(container.firstChild).toHaveClass('rounded')
})
