import { Accordion } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <Accordion size="large" name="size-example-large" className="mb-medium">
        <Accordion.Item open>
          <Accordion.Header>Large Accordion Item #1</Accordion.Header>
          <Accordion.Body>
            <strong>This is the first item's accordion body.</strong>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item>
          <Accordion.Header>Large Accordion Item #2</Accordion.Header>
          <Accordion.Body>
            <strong>This is the second item's accordion body.</strong>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      <Accordion size="small" name="size-example-small">
        <Accordion.Item open>
          <Accordion.Header>Small Accordion Item #1</Accordion.Header>
          <Accordion.Body>
            <strong>This is the first item's accordion body.</strong>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item>
          <Accordion.Header>Small Accordion Item #2</Accordion.Header>
          <Accordion.Body>
            <strong>This is the second item's accordion body.</strong>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </>
  )
}
