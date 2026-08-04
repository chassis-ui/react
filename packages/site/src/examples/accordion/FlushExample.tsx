import { Accordion } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Accordion flush>
      <Accordion.Item>
        <Accordion.Header>Accordion Item #1</Accordion.Header>
        <Accordion.Body>
          <strong>This is the first item's accordion body.</strong>
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item>
        <Accordion.Header>Accordion Item #2</Accordion.Header>
        <Accordion.Body>
          <strong>This is the second item's accordion body.</strong>
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item>
        <Accordion.Header>Accordion Item #3</Accordion.Header>
        <Accordion.Body>
          <strong>This is the third item's accordion body.</strong>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  )
}
