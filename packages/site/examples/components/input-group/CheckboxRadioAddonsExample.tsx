import {
  Checkbox,
  TextInput,
  Radio,
  RadioGroup,
  InputGroup,
  InputGroupAddon
} from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <InputGroup className="mb-medium">
        <InputGroupAddon>
          <Checkbox value="" aria-label="Checkbox for following text input" />
        </InputGroupAddon>
        <TextInput aria-label="Text input with checkbox" />
      </InputGroup>

      <InputGroup>
        <InputGroupAddon>
          <RadioGroup aria-label="Radio button for following text input" defaultValue="">
            <Radio value="" aria-label="Radio button for following text input" />
          </RadioGroup>
        </InputGroupAddon>
        <TextInput aria-label="Text input with radio button" />
      </InputGroup>
    </>
  )
}
