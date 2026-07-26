import React from 'react'
import { CxAccordion, CxAccordionBody, CxAccordionHeader, CxAccordionItem } from '@chassis-ui/react'

export const Example = () => {
  return (
    <CxAccordion flush>
      <CxAccordionItem>
        <CxAccordionHeader>Accordion Item #1</CxAccordionHeader>
        <CxAccordionBody>
          <strong>This is the first item's accordion body.</strong>
        </CxAccordionBody>
      </CxAccordionItem>
      <CxAccordionItem>
        <CxAccordionHeader>Accordion Item #2</CxAccordionHeader>
        <CxAccordionBody>
          <strong>This is the second item's accordion body.</strong>
        </CxAccordionBody>
      </CxAccordionItem>
      <CxAccordionItem>
        <CxAccordionHeader>Accordion Item #3</CxAccordionHeader>
        <CxAccordionBody>
          <strong>This is the third item's accordion body.</strong>
        </CxAccordionBody>
      </CxAccordionItem>
    </CxAccordion>
  )
}
