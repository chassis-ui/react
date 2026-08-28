import { useState } from 'react'
import { Accordion, Button, ButtonGroup } from '@chassis-ui/react'

const items = [
  {
    id: 'item-1',
    header: 'Accordion Item #1',
    body: <strong>This is the first item's accordion body.</strong>
  },
  {
    id: 'item-2',
    header: 'Accordion Item #2',
    body: <strong>This is the second item's accordion body.</strong>
  },
  {
    id: 'item-3',
    header: 'Accordion Item #3',
    body: <strong>This is the third item's accordion body.</strong>
  }
]

export const Example = () => {
  const [expandedKeys, setExpandedKeys] = useState<Array<number | string>>(['item-1'])

  return (
    <>
      <ButtonGroup className="mb-3">
        <Button size="small" onClick={() => setExpandedKeys(items.map((item) => item.id))}>
          Expand all
        </Button>
        <Button size="small" onClick={() => setExpandedKeys([])}>
          Collapse all
        </Button>
      </ButtonGroup>
      <Accordion
        alwaysOpen
        items={items}
        expandedKeys={expandedKeys}
        onExpandedChange={setExpandedKeys}
      />
    </>
  )
}
