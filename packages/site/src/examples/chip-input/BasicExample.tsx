import React from 'react'
import { CxChipInput } from '@chassis-ui/react'

export const BasicExample = () => {
  return (
    <CxChipInput
      aria-label="Skills"
      defaultValue={['React', 'TypeScript']}
      placeholder="Add skill…"
    />
  )
}
