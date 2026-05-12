import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { CxAccordionItem } from '../../../index'

test('loads and displays CxAccordionItem component', async () => {
  const { container } = render(<CxAccordionItem>Test</CxAccordionItem>)
  expect(container).toMatchSnapshot()
})

test('CxAccordionItem customize', async () => {
  const { container } = render(<CxAccordionItem className="bazinga">Test</CxAccordionItem>)
  expect(container.firstChild).toHaveClass('bazinga')
  expect(container.firstChild).toHaveClass('accordion-item')
  expect(container).toMatchSnapshot()
})
