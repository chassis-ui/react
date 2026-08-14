import { Accordion, AccordionBody, AccordionHeader, AccordionItem } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Accordion name="basic-example">
      <AccordionItem open>
        <AccordionHeader>Accordion Item #1</AccordionHeader>
        <AccordionBody>
          <strong>This is the first item's accordion body.</strong> It is hidden by default. Just
          about any HTML can go within the <code>.accordion-body</code>.
        </AccordionBody>
      </AccordionItem>
      <AccordionItem>
        <AccordionHeader>Accordion Item #2</AccordionHeader>
        <AccordionBody>
          <strong>This is the second item's accordion body.</strong> It is shown by default via the{' '}
          <code>open</code> prop.
        </AccordionBody>
      </AccordionItem>
      <AccordionItem>
        <AccordionHeader>Accordion Item #3</AccordionHeader>
        <AccordionBody>
          <strong>This is the third item's accordion body.</strong> It is hidden by default.
        </AccordionBody>
      </AccordionItem>
    </Accordion>
  )
}
