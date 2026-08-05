import { Checkbox, TextInput, Radio, RadioGroup, InputGroup } from '@chassis-ui/react'

export const CheckboxRadioAddonsExample = () => {
  return (
    <>
      <InputGroup className="mb-medium">
        <InputGroup.Addon>
          <Checkbox value="" aria-label="Checkbox for following text input" />
        </InputGroup.Addon>
        <TextInput aria-label="Text input with checkbox" />
      </InputGroup>

      <InputGroup>
        <InputGroup.Addon>
          <RadioGroup aria-label="Radio button for following text input" defaultValue="">
            <Radio value="" aria-label="Radio button for following text input" />
          </RadioGroup>
        </InputGroup.Addon>
        <TextInput aria-label="Text input with radio button" />
      </InputGroup>
    </>
  )
}
