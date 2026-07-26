import { CxPopover, CxButton } from '@chassis-ui/react'

export const DirectionsExample = () => {
  return (
    <>
      <CxPopover
        content="Vivamus sagittis lacus vel augue laoreet rutrum faucibus."
        placement="top"
      >
        <CxButton context="secondary">Popover on top</CxButton>
      </CxPopover>
      <CxPopover
        content="Vivamus sagittis lacus vel augue laoreet rutrum faucibus."
        placement="right"
      >
        <CxButton context="secondary">Popover on right</CxButton>
      </CxPopover>
      <CxPopover
        content="Vivamus sagittis lacus vel augue laoreet rutrum faucibus."
        placement="bottom"
      >
        <CxButton context="secondary">Popover on bottom</CxButton>
      </CxPopover>
      <CxPopover
        content="Vivamus sagittis lacus vel augue laoreet rutrum faucibus."
        placement="left"
      >
        <CxButton context="secondary">Popover on left</CxButton>
      </CxPopover>
    </>
  )
}
