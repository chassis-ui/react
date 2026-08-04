import { Accordion } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Accordion name="basic-example">
      <Accordion.Item open>
        <Accordion.Header>Accordion Item #1</Accordion.Header>
        <Accordion.Body>
          <strong>This is the first item's accordion body.</strong> It is hidden by default. Just
          about any HTML can go within the <code>.accordion-body</code>.
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item>
        <Accordion.Header>Accordion Item #2</Accordion.Header>
        <Accordion.Body>
          <strong>This is the second item's accordion body.</strong> It is shown by default via the{' '}
          <code>open</code> prop.
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item>
        <Accordion.Header>Accordion Item #3</Accordion.Header>
        <Accordion.Body>
          <strong>This is the third item's accordion body.</strong> It is hidden by default.
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  )
}
