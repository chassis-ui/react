import React from 'react'
import { CxChipInput } from '@chassis-ui/react'

export const DisabledExample = () => {
  return <CxChipInput aria-label="Skills" defaultValue={['React', 'CSS']} disabled />
}
