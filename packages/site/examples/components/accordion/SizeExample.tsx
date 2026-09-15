import { Accordion, AccordionBody, AccordionHeader, AccordionItem } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <Accordion size="lg" name="size-example-lg" className="mb-md">
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
      <Accordion size="sm" name="size-example-sm">
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
