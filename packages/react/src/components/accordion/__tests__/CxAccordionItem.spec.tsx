import React from 'react'
import { render } from '@testing-library/react'

import { CxAccordion, CxAccordionItem } from '../../../index'

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

test('CxAccordionItem falls back to the accordion group name', async () => {
  const { container } = render(
    <CxAccordion name="group-name">
      <CxAccordionItem>Test</CxAccordionItem>
    </CxAccordion>
  )
  expect(container.querySelector('details')).toHaveAttribute('name', 'group-name')
})

test('CxAccordionItem name overrides the accordion group name', async () => {
  const { container } = render(
    <CxAccordion name="group-name">
      <CxAccordionItem name="item-name">Test</CxAccordionItem>
    </CxAccordion>
  )
  expect(container.querySelector('details')).toHaveAttribute('name', 'item-name')
})

test('CxAccordionItem alwaysOpen overrides the accordion alwaysOpen setting', async () => {
  const { container } = render(
    <CxAccordion name="group-name">
      <CxAccordionItem alwaysOpen>Test</CxAccordionItem>
    </CxAccordion>
  )
  expect(container.querySelector('details')).not.toHaveAttribute('name')
})

test('CxAccordion alwaysOpen removes the name attribute unless the item overrides it', async () => {
  const { container } = render(
    <CxAccordion name="group-name" alwaysOpen>
      <CxAccordionItem>Test</CxAccordionItem>
      <CxAccordionItem alwaysOpen={false} name="solo">
        Test
      </CxAccordionItem>
    </CxAccordion>
  )
  const details = container.querySelectorAll('details')
  expect(details[0]).not.toHaveAttribute('name')
  expect(details[1]).toHaveAttribute('name', 'solo')
})
