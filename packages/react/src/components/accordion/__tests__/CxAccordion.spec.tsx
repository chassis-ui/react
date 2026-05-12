import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { CxAccordion } from '../../../index'

test('loads and displays CxAccordion component', async () => {
  const { container } = render(<CxAccordion>Test</CxAccordion>)
  expect(container).toMatchSnapshot()
})

test('CxAccordion customize', async () => {
  const { container } = render(<CxAccordion className="bazinga">Test</CxAccordion>)
  expect(container.firstChild).toHaveClass('bazinga')
  expect(container).toMatchSnapshot()
})

test('CxAccordion use case test', async () => {
  jest.useFakeTimers()
  const { rerender } = render(<CxAccordion flush={false}>Test</CxAccordion>)
  expect(screen.getByText('Test')).toHaveClass('accordion')
  expect(screen.getByText('Test')).not.toHaveClass('accordion-flush')
  rerender(<CxAccordion flush={true}>Test</CxAccordion>)
  expect(screen.getByText('Test')).toHaveClass('accordion')
  expect(screen.getByText('Test')).toHaveClass('accordion-flush')
  jest.runAllTimers()
  expect(screen.getByText('Test')).toHaveClass('accordion')
  expect(screen.getByText('Test')).toHaveClass('accordion-flush')
  rerender(<CxAccordion flush={false}>Test</CxAccordion>)
  expect(screen.getByText('Test')).toHaveClass('accordion')
  expect(screen.getByText('Test')).not.toHaveClass('accordion-flush')
  jest.runAllTimers()
  expect(screen.getByText('Test')).toHaveClass('accordion')
  expect(screen.getByText('Test')).not.toHaveClass('accordion-flush')
  jest.runAllTimers()
  jest.useRealTimers()
})
