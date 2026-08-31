import { Tooltip, Button } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <Tooltip content="Vivamus sagittis lacus vel augue laoreet rutrum faucibus." placement="top">
        <Button color="secondary">Tooltip on top</Button>
      </Tooltip>
      <Tooltip
        content="Vivamus sagittis lacus vel augue laoreet rutrum faucibus."
        placement="right"
      >
        <Button color="secondary">Tooltip on right</Button>
      </Tooltip>
      <Tooltip
        content="Vivamus sagittis lacus vel augue laoreet rutrum faucibus."
        placement="bottom"
      >
        <Button color="secondary">Tooltip on bottom</Button>
      </Tooltip>
      <Tooltip content="Vivamus sagittis lacus vel augue laoreet rutrum faucibus." placement="left">
        <Button color="secondary">Tooltip on left</Button>
      </Tooltip>
    </>
  )
}
