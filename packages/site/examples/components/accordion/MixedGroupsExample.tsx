import { Accordion, AccordionBody, AccordionHeader, AccordionItem } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Accordion name="mixed-groups-example">
      <AccordionItem open alwaysOpen>
        <AccordionHeader>Accordion Item #1</AccordionHeader>
        <AccordionBody>
          <strong>This item sets its own</strong> <code>alwaysOpen</code>, so it stays open
          independently of the group below.
        </AccordionBody>
      </AccordionItem>
      <AccordionItem name="mixed-groups-example-b" open>
        <AccordionHeader>Accordion Item #2</AccordionHeader>
        <AccordionBody>
          <strong>This item overrides</strong> <code>name</code> to join a separate group with
          Accordion Item #3, so opening either one closes the other without affecting Item #1.
        </AccordionBody>
      </AccordionItem>
      <AccordionItem name="mixed-groups-example-b">
        <AccordionHeader>Accordion Item #3</AccordionHeader>
        <AccordionBody>
          <strong>This item shares Item #2's group name.</strong>
        </AccordionBody>
      </AccordionItem>
    </Accordion>
  )
}
