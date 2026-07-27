import * as React from 'react'
import { render } from '@testing-library/react'

import { CxBadge } from '../../../index'

test('loads and displays CxBadge component', async () => {
  const { container } = render(<CxBadge context="primary">Test</CxBadge>)
  expect(container).toMatchSnapshot()
})

test('CxBadge customize', async () => {
  const { container } = render(
    <CxBadge className="bazinga" context="warning" component="div" circle size="small">
      Test
    </CxBadge>
  )
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('bazinga')
  expect(container.firstChild).toHaveClass('badge')
  expect(container.firstChild).toHaveClass('warning')
  expect(container.firstChild).toHaveClass('circle')
  expect(container.firstChild).toHaveClass('small')
})

test('CxBadge variant', async () => {
  const { container } = render(
    <CxBadge context="primary" variant="outline">
      Test
    </CxBadge>
  )
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('outline')
})

test('CxBadge position', async () => {
  const { container } = render(
    <CxBadge context="danger" position="top-end">
      Test
    </CxBadge>
  )
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('position-absolute')
  expect(container.firstChild).toHaveClass('translate-middle')
  expect(container.firstChild).toHaveClass('top-0')
  expect(container.firstChild).toHaveClass('start-100')
})
