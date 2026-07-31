import { CxRadio, CxRadioGroup } from '@chassis-ui/react'

export const ContextColorExample = () => {
  return (
    <CxRadioGroup label="Success option" defaultValue="checkSuccess">
      <CxRadio color="success" value="checkSuccess" label="Success radio" />
    </CxRadioGroup>
  )
}
