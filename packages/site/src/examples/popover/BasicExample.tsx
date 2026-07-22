import React from 'react'
import { CxPopover, CxButton } from '@chassis-ui/react'

export const BasicExample = () => {
  return (
    <CxPopover
      title="Popover title"
      content="And here's some amazing content. It's very engaging. Right?"
      placement="right"
    >
      <CxButton context="danger" size="large">
        Click to toggle popover
      </CxButton>
    </CxPopover>
  )
}
