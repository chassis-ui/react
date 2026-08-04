import { Accordion } from '@chassis-ui/react'

const items = [
  {
    id: 'item-1',
    header: 'Accordion Item #1',
    body: (
      <>
        <strong>This is the first item's accordion body.</strong> Rendered from a plain data array
        instead of composed children.
      </>
    ),
    open: true
  },
  {
    id: 'item-2',
    header: 'Accordion Item #2',
    body: <strong>This is the second item's accordion body.</strong>
  },
  {
    id: 'item-3',
    header: 'Accordion Item #3',
    body: <strong>This is the third item's accordion body.</strong>,
    alwaysOpen: true
  }
]

export const Example = () => {
  return <Accordion name="json-content-example" items={items} />
}
