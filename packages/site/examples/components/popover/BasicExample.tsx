import { Popover, Button } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Popover
      title="Popover title"
      content="And here's some amazing content. It's very engaging. Right?"
      placement="right"
    >
      <Button color="danger" size="large">
        Click to toggle popover
      </Button>
    </Popover>
  )
}
