import { Accordion } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Accordion name="mixed-groups-example">
      <Accordion.Item open alwaysOpen>
        <Accordion.Header>Accordion Item #1</Accordion.Header>
        <Accordion.Body>
          <strong>This item sets its own</strong> <code>alwaysOpen</code>, so it stays open
          independently of the group below.
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item name="mixed-groups-example-b" open>
        <Accordion.Header>Accordion Item #2</Accordion.Header>
        <Accordion.Body>
          <strong>This item overrides</strong> <code>name</code> to join a separate group with
          Accordion Item #3, so opening either one closes the other without affecting Item #1.
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item name="mixed-groups-example-b">
        <Accordion.Header>Accordion Item #3</Accordion.Header>
        <Accordion.Body>
          <strong>This item shares Item #2's group name.</strong>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  )
}
