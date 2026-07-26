import React from 'react'
import { CxAccordion, CxAccordionBody, CxAccordionHeader, CxAccordionItem } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <CxAccordion size="large" name="size-example-large" className="mb-medium">
        <CxAccordionItem open>
          <CxAccordionHeader>Large Accordion Item #1</CxAccordionHeader>
          <CxAccordionBody>
            <strong>This is the first item's accordion body.</strong>
          </CxAccordionBody>
        </CxAccordionItem>
        <CxAccordionItem>
          <CxAccordionHeader>Large Accordion Item #2</CxAccordionHeader>
          <CxAccordionBody>
            <strong>This is the second item's accordion body.</strong>
          </CxAccordionBody>
        </CxAccordionItem>
      </CxAccordion>
      <CxAccordion size="small" name="size-example-small">
        <CxAccordionItem open>
          <CxAccordionHeader>Small Accordion Item #1</CxAccordionHeader>
          <CxAccordionBody>
            <strong>This is the first item's accordion body.</strong>
          </CxAccordionBody>
        </CxAccordionItem>
        <CxAccordionItem>
          <CxAccordionHeader>Small Accordion Item #2</CxAccordionHeader>
          <CxAccordionBody>
            <strong>This is the second item's accordion body.</strong>
          </CxAccordionBody>
        </CxAccordionItem>
      </CxAccordion>
    </>
  )
}
