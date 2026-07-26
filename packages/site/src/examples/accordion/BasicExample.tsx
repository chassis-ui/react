import React from 'react'
import { CxAccordion, CxAccordionBody, CxAccordionHeader, CxAccordionItem } from '@chassis-ui/react'

export const Example = () => {
  return (
    <CxAccordion>
      <CxAccordionItem>
        <CxAccordionHeader>Accordion Item #1</CxAccordionHeader>
        <CxAccordionBody>
          <strong>This is the first item's accordion body.</strong> It is hidden by default. Just
          about any HTML can go within the <code>.accordion-body</code>.
        </CxAccordionBody>
      </CxAccordionItem>
      <CxAccordionItem open>
        <CxAccordionHeader>Accordion Item #2</CxAccordionHeader>
        <CxAccordionBody>
          <strong>This is the second item's accordion body.</strong> It is shown by default via the{' '}
          <code>open</code> prop.
        </CxAccordionBody>
      </CxAccordionItem>
      <CxAccordionItem>
        <CxAccordionHeader>Accordion Item #3</CxAccordionHeader>
        <CxAccordionBody>
          <strong>This is the third item's accordion body.</strong> It is hidden by default.
        </CxAccordionBody>
      </CxAccordionItem>
    </CxAccordion>
  )
}
