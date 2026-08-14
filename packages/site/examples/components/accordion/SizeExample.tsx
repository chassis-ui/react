import { Accordion, AccordionBody, AccordionHeader, AccordionItem } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <Accordion size="large" name="size-example-large" className="mb-medium">
        <AccordionItem open>
          <AccordionHeader>Large Accordion Item #1</AccordionHeader>
          <AccordionBody>
            <strong>This is the first item's accordion body.</strong>
          </AccordionBody>
        </AccordionItem>
        <AccordionItem>
          <AccordionHeader>Large Accordion Item #2</AccordionHeader>
          <AccordionBody>
            <strong>This is the second item's accordion body.</strong>
          </AccordionBody>
        </AccordionItem>
      </Accordion>
      <Accordion size="small" name="size-example-small">
        <AccordionItem open>
          <AccordionHeader>Small Accordion Item #1</AccordionHeader>
          <AccordionBody>
            <strong>This is the first item's accordion body.</strong>
          </AccordionBody>
        </AccordionItem>
        <AccordionItem>
          <AccordionHeader>Small Accordion Item #2</AccordionHeader>
          <AccordionBody>
            <strong>This is the second item's accordion body.</strong>
          </AccordionBody>
        </AccordionItem>
      </Accordion>
    </>
  )
}
