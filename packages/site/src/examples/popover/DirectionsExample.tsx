import { CxPopover, CxButton } from '@chassis-ui/react'

export const DirectionsExample = () => {
  return (
    <>
      <CxPopover
        content="Vivamus sagittis lacus vel augue laoreet rutrum faucibus."
        placement="top"
      >
        <CxButton color="secondary">Popover on top</CxButton>
      </CxPopover>
      <CxPopover
        content="Vivamus sagittis lacus vel augue laoreet rutrum faucibus."
        placement="right"
      >
        <CxButton color="secondary">Popover on right</CxButton>
      </CxPopover>
      <CxPopover
        content="Vivamus sagittis lacus vel augue laoreet rutrum faucibus."
        placement="bottom"
      >
        <CxButton color="secondary">Popover on bottom</CxButton>
      </CxPopover>
      <CxPopover
        content="Vivamus sagittis lacus vel augue laoreet rutrum faucibus."
        placement="left"
      >
        <CxButton color="secondary">Popover on left</CxButton>
      </CxPopover>
    </>
  )
}
