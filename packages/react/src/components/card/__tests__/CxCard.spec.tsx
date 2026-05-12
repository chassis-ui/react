import * as React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { CxCard } from '../../../index'

test('loads and displays CxCard component', async () => {
  const { container } = render(<CxCard>Test</CxCard>)
  expect(container).toMatchSnapshot()
})

test('CxCard customize', async () => {
  const { container } = render(
    <CxCard className="bazinga" context="primary" textColor="warning">
      Test
    </CxCard>,
  )
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('bazinga')
  expect(container.firstChild).toHaveClass('card')
  expect(container.firstChild).toHaveClass('bg-primary')
  expect(container.firstChild).toHaveClass('text-warning')
})
