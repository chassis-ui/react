import { Popover, Button } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <Popover content="Vivamus sagittis lacus vel augue laoreet rutrum faucibus." placement="top">
        <Button color="secondary">Popover on top</Button>
      </Popover>
      <Popover
        content="Vivamus sagittis lacus vel augue laoreet rutrum faucibus."
        placement="right"
      >
        <Button color="secondary">Popover on right</Button>
      </Popover>
      <Popover
        content="Vivamus sagittis lacus vel augue laoreet rutrum faucibus."
        placement="bottom"
      >
        <Button color="secondary">Popover on bottom</Button>
      </Popover>
      <Popover content="Vivamus sagittis lacus vel augue laoreet rutrum faucibus." placement="left">
        <Button color="secondary">Popover on left</Button>
      </Popover>
    </>
  )
}
