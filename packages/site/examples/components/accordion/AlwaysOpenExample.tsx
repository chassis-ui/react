import { Accordion, AccordionBody, AccordionHeader, AccordionItem } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Accordion alwaysOpen>
      <AccordionItem open>
        <AccordionHeader>Accordion Item #1</AccordionHeader>
        <AccordionBody>
          <strong>This is the first item's accordion body.</strong>
        </AccordionBody>
      </AccordionItem>
      <AccordionItem open>
        <AccordionHeader>Accordion Item #2</AccordionHeader>
        <AccordionBody>
          <strong>This is the second item's accordion body.</strong>
        </AccordionBody>
      </AccordionItem>
      <AccordionItem>
        <AccordionHeader>Accordion Item #3</AccordionHeader>
        <AccordionBody>
          <strong>This is the third item's accordion body.</strong>
        </AccordionBody>
      </AccordionItem>
    </Accordion>
  )
}
