import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { CxAccordionBody } from '../../../index'

test('loads and displays CxAccordionBody component', async () => {
  const { container } = render(<CxAccordionBody>Test</CxAccordionBody>)
  expect(container).toMatchSnapshot()
})

test('CxAccordionBody customize', async () => {
  const { container } = render(<CxAccordionBody>Test</CxAccordionBody>)
  expect(container.firstChild).toHaveClass('accordion-body')
  expect(container).toMatchSnapshot()
})
