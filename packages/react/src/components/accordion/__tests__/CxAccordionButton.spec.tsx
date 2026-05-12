import React from 'react'
import { render } from '@testing-library/react'

import { CxAccordionButton } from '../../../index'

test('loads and displays CxAccordionButton component', async () => {
  const { container } = render(<CxAccordionButton>Test</CxAccordionButton>)
  expect(container).toMatchSnapshot()
})

test('CxAccordionButton customize', async () => {
  const { container } = render(<CxAccordionButton className="bazinga">Test</CxAccordionButton>)
  expect(container.firstChild).toHaveClass('bazinga')
  expect(container.firstChild).toHaveClass('accordion-title')
  expect(container).toMatchSnapshot()
})
