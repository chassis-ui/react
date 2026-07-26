import { CxFormRadio, CxFormRadioGroup } from '@chassis-ui/react'

export const ContextColorExample = () => {
  return (
    <CxFormRadioGroup label="Success option" defaultValue="checkSuccess">
      <CxFormRadio context="success" value="checkSuccess" label="Success radio" />
    </CxFormRadioGroup>
  )
}
