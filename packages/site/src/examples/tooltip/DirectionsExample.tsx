import { CxTooltip, CxButton } from '@chassis-ui/react'

export const DirectionsExample = () => {
  return (
    <>
      <CxTooltip
        content="Vivamus sagittis lacus vel augue laoreet rutrum faucibus."
        placement="top"
      >
        <CxButton context="secondary">Tooltip on top</CxButton>
      </CxTooltip>
      <CxTooltip
        content="Vivamus sagittis lacus vel augue laoreet rutrum faucibus."
        placement="right"
      >
        <CxButton context="secondary">Tooltip on right</CxButton>
      </CxTooltip>
      <CxTooltip
        content="Vivamus sagittis lacus vel augue laoreet rutrum faucibus."
        placement="bottom"
      >
        <CxButton context="secondary">Tooltip on bottom</CxButton>
      </CxTooltip>
      <CxTooltip
        content="Vivamus sagittis lacus vel augue laoreet rutrum faucibus."
        placement="left"
      >
        <CxButton context="secondary">Tooltip on left</CxButton>
      </CxTooltip>
    </>
  )
}
