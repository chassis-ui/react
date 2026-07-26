import React from 'react'
import { render, screen } from '@testing-library/react'

import { CxAccordion, CxAccordionItem } from '../../../index'

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
  expect(screen.getByText('Test')).not.toHaveClass('flush')
  rerender(<CxAccordion flush={true}>Test</CxAccordion>)
  expect(screen.getByText('Test')).toHaveClass('accordion')
  expect(screen.getByText('Test')).toHaveClass('flush')
  jest.runAllTimers()
  expect(screen.getByText('Test')).toHaveClass('accordion')
  expect(screen.getByText('Test')).toHaveClass('flush')
  rerender(<CxAccordion flush={false}>Test</CxAccordion>)
  expect(screen.getByText('Test')).toHaveClass('accordion')
  expect(screen.getByText('Test')).not.toHaveClass('flush')
  jest.runAllTimers()
  expect(screen.getByText('Test')).toHaveClass('accordion')
  expect(screen.getByText('Test')).not.toHaveClass('flush')
  jest.runAllTimers()
  jest.useRealTimers()
})

test('CxAccordion applies size and caretEnd classes', async () => {
  const { rerender } = render(<CxAccordion size="large">Test</CxAccordion>)
  expect(screen.getByText('Test')).toHaveClass('large')
  rerender(<CxAccordion size="small">Test</CxAccordion>)
  expect(screen.getByText('Test')).toHaveClass('small')
  rerender(<CxAccordion caretEnd>Test</CxAccordion>)
  expect(screen.getByText('Test')).toHaveClass('caret-end')
})

test('CxAccordion renders items from JSON content', async () => {
  render(
    <CxAccordion
      items={[
        { id: 'a', header: 'Header A', body: 'Body A', open: true },
        { id: 'b', header: 'Header B', body: 'Body B' }
      ]}
    />
  )
  expect(screen.getByText('Header A')).toBeInTheDocument()
  expect(screen.getByText('Body A')).toBeInTheDocument()
  expect(screen.getByText('Header B')).toBeInTheDocument()
  expect(screen.getByText('Body B')).toBeInTheDocument()
})

test('CxAccordion name sets the shared group name for items', async () => {
  const { container } = render(
    <CxAccordion name="shared-name">
      <CxAccordionItem>Item</CxAccordionItem>
    </CxAccordion>
  )
  expect(container.querySelector('details')).toHaveAttribute('name', 'shared-name')
})
