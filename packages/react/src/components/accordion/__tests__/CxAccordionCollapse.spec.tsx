import React from 'react'
import { render } from '@testing-library/react'

import { CxAccordionCollapse } from '../../../index'

test('loads and displays CxAccordionCollapse component', async () => {
  const { container } = render(<CxAccordionCollapse>Test</CxAccordionCollapse>)
  expect(container).toMatchSnapshot()
})
