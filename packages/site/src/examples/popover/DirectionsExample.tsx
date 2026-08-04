import { CxPopover, Button } from '@chassis-ui/react'

export const DirectionsExample = () => {
  return (
    <>
      <CxPopover
        content="Vivamus sagittis lacus vel augue laoreet rutrum faucibus."
        placement="top"
      >
        <Button color="secondary">Popover on top</Button>
      </CxPopover>
      <CxPopover
        content="Vivamus sagittis lacus vel augue laoreet rutrum faucibus."
        placement="right"
      >
        <Button color="secondary">Popover on right</Button>
      </CxPopover>
      <CxPopover
        content="Vivamus sagittis lacus vel augue laoreet rutrum faucibus."
        placement="bottom"
      >
        <Button color="secondary">Popover on bottom</Button>
      </CxPopover>
      <CxPopover
        content="Vivamus sagittis lacus vel augue laoreet rutrum faucibus."
        placement="left"
      >
        <Button color="secondary">Popover on left</Button>
      </CxPopover>
    </>
  )
}
