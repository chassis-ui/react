import { CxRadio, CxRadioGroup } from '@chassis-ui/react'

export const ContextColorExample = () => {
  return (
    <CxRadioGroup label="Success option" defaultValue="checkSuccess">
      <CxRadio context="success" value="checkSuccess" label="Success radio" />
    </CxRadioGroup>
  )
}
