import { CxTooltip, CxButton } from '@chassis-ui/react'

export const DirectionsExample = () => {
  return (
    <>
      <CxTooltip
        content="Vivamus sagittis lacus vel augue laoreet rutrum faucibus."
        placement="top"
      >
        <CxButton color="secondary">Tooltip on top</CxButton>
      </CxTooltip>
      <CxTooltip
        content="Vivamus sagittis lacus vel augue laoreet rutrum faucibus."
        placement="right"
      >
        <CxButton color="secondary">Tooltip on right</CxButton>
      </CxTooltip>
      <CxTooltip
        content="Vivamus sagittis lacus vel augue laoreet rutrum faucibus."
        placement="bottom"
      >
        <CxButton color="secondary">Tooltip on bottom</CxButton>
      </CxTooltip>
      <CxTooltip
        content="Vivamus sagittis lacus vel augue laoreet rutrum faucibus."
        placement="left"
      >
        <CxButton color="secondary">Tooltip on left</CxButton>
      </CxTooltip>
    </>
  )
}
