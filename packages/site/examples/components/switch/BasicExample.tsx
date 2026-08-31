import { Switch } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <Switch label="Default switch checkbox input" id="formSwitchCheckDefault" />
      <Switch label="Checked switch checkbox input" id="formSwitchCheckChecked" defaultSelected />
      <Switch label="Disabled switch checkbox input" id="formSwitchCheckDisabled" disabled />
      <Switch
        label="Disabled checked switch checkbox input"
        id="formSwitchCheckCheckedDisabled"
        defaultSelected
        disabled
      />
    </>
  )
}
