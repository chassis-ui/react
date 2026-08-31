import { Checkbox } from '@chassis-ui/react'

export const Example = () => {
  return (
    <div className="d-flex gap-medium">
      <Checkbox id="inlineCheckbox1" value="option1" label="1" />
      <Checkbox id="inlineCheckbox2" value="option2" label="2" />
      <Checkbox id="inlineCheckbox3" value="option3" label="3 (disabled)" disabled />
    </div>
  )
}
