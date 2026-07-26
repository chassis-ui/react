import { CxAccordion, CxAccordionBody, CxAccordionHeader, CxAccordionItem } from '@chassis-ui/react'

export const Example = () => {
  return (
    <CxAccordion name="mixed-groups-example">
      <CxAccordionItem open alwaysOpen>
        <CxAccordionHeader>Accordion Item #1</CxAccordionHeader>
        <CxAccordionBody>
          <strong>This item sets its own</strong> <code>alwaysOpen</code>, so it stays open
          independently of the group below.
        </CxAccordionBody>
      </CxAccordionItem>
      <CxAccordionItem name="mixed-groups-example-b" open>
        <CxAccordionHeader>Accordion Item #2</CxAccordionHeader>
        <CxAccordionBody>
          <strong>This item overrides</strong> <code>name</code> to join a separate group with
          Accordion Item #3, so opening either one closes the other without affecting Item #1.
        </CxAccordionBody>
      </CxAccordionItem>
      <CxAccordionItem name="mixed-groups-example-b">
        <CxAccordionHeader>Accordion Item #3</CxAccordionHeader>
        <CxAccordionBody>
          <strong>This item shares Item #2's group name.</strong>
        </CxAccordionBody>
      </CxAccordionItem>
    </CxAccordion>
  )
}
