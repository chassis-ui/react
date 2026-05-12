import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { CxAccordionHeader } from '../../../index'

test('loads and displays CxAccordionHeader component', async () => {
  const { container } = render(<CxAccordionHeader>Test</CxAccordionHeader>)
  expect(container).toMatchSnapshot()
})

test('CxAccordionHeader customize', async () => {
  const { container } = render(<CxAccordionHeader className="bazinga">Test</CxAccordionHeader>)
  expect(container.firstChild).toHaveClass('bazinga')
  expect(container).toMatchSnapshot()
})
