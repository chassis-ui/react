import * as React from 'react'
import { act } from 'react'
import { render, screen } from '@testing-library/react'

import { CxTabPane, CxTabContent } from '../../../index'

test('loads and displays CxTabPane component', async () => {
  const { container } = render(<CxTabPane>Test</CxTabPane>)
  expect(container).toMatchSnapshot()
})

test('CxTabPane customize', async () => {
  const { container } = render(
    <CxTabPane className="bazinga" visible={true}>
      Test
    </CxTabPane>
  )
  expect(container).toMatchSnapshot()
})

test('CxTabContent use case test', async () => {
  jest.useFakeTimers()
  const { rerender } = render(
    <CxTabContent>
      <CxTabPane visible={false}>Test</CxTabPane>
    </CxTabContent>
  )
  expect(screen.getByText('Test')).not.toHaveClass('show')
  expect(screen.getByText('Test')).not.toHaveClass('active')
  rerender(
    <CxTabContent>
      <CxTabPane visible={true}>Test</CxTabPane>
    </CxTabContent>
  )
  expect(screen.getByText('Test')).not.toHaveClass('show')
  expect(screen.getByText('Test')).toHaveClass('active')
  act(() => jest.runAllTimers())
  expect(screen.getByText('Test')).toHaveClass('show')
  expect(screen.getByText('Test')).toHaveClass('active')
  rerender(
    <CxTabContent>
      <CxTabPane visible={false}>Test</CxTabPane>
    </CxTabContent>
  )
  expect(screen.getByText('Test')).not.toHaveClass('show')
  expect(screen.getByText('Test')).not.toHaveClass('active')
  act(() => jest.runAllTimers())
  expect(screen.getByText('Test')).not.toHaveClass('show')
  expect(screen.getByText('Test')).not.toHaveClass('active')
  act(() => jest.runAllTimers())
  jest.useRealTimers()
})
