import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { CxCollapse } from '../../../index'

test('loads and displays CxCollapse component', async () => {
  const { container } = render(<CxCollapse>Test</CxCollapse>)
  expect(container).toMatchSnapshot()
})

test('CxCollapse customize', async () => {
  const { container } = render(<CxCollapse className="bazinga">Test</CxCollapse>)
  expect(container.firstChild).toHaveClass('bazinga')
  expect(container).toMatchSnapshot()
})

test('CxCollapse use case test', async () => {
  jest.useFakeTimers()
  const { rerender } = render(<CxCollapse visible={false}>Test</CxCollapse>)
  expect(screen.getByText('Test')).toHaveClass('collapse')
  expect(screen.getByText('Test')).not.toHaveClass('show')
  expect(screen.getByText('Test')).not.toHaveClass('collapsing')
  rerender(<CxCollapse visible={true}>Test</CxCollapse>)
  expect(screen.getByText('Test')).not.toHaveClass('collapse')
  expect(screen.getByText('Test')).not.toHaveClass('show')
  expect(screen.getByText('Test')).toHaveClass('collapsing')
  jest.runAllTimers()
  expect(screen.getByText('Test')).toHaveClass('collapse')
  expect(screen.getByText('Test')).toHaveClass('show')
  expect(screen.getByText('Test')).not.toHaveClass('collapsing')
  rerender(<CxCollapse visible={false}>Test</CxCollapse>)
  expect(screen.getByText('Test')).not.toHaveClass('collapse')
  expect(screen.getByText('Test')).not.toHaveClass('show')
  expect(screen.getByText('Test')).toHaveClass('collapsing')
  jest.runAllTimers()
  expect(screen.getByText('Test')).toHaveClass('collapse')
  expect(screen.getByText('Test')).not.toHaveClass('show')
  expect(screen.getByText('Test')).not.toHaveClass('collapsing')
  jest.runAllTimers()
  jest.useRealTimers()
})
