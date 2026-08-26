import React from 'react'
import {
  Checkbox,
  ChipInput,
  ColorInput,
  Combobox,
  ComboboxItem,
  FileInput,
  FloatingInput,
  FormFeedback,
  FormLabel,
  InputGroup,
  InputAdorn,
  InputGroupAddon,
  RadioGroup,
  Radio,
  RangeInput,
  Select,
  Stack,
  Switch,
  Textarea,
  TextInput
} from '@chassis-ui/react'

export const Example = () => (
  <Stack gap="medium" direction="vertical">
    <TextInput label="Text input" invalid invalidFeedback="Example invalid feedback text." />

    <Textarea
      label="Textarea"
      placeholder="Required example textarea"
      invalid
      invalidFeedback="Example invalid textarea feedback."
    />

    <Select label="Select" invalid invalidFeedback="Example invalid select feedback.">
      <option value="">Choose an option</option>
      <option value="1">Option one</option>
      <option value="2">Option two</option>
    </Select>

    <div>
      <Checkbox label="Check this checkbox" aria-describedby="checkboxFeedback" invalid />
      <FormFeedback id="checkboxFeedback" invalid>
        Example invalid checkbox feedback.
      </FormFeedback>
    </div>

    <RadioGroup
      label="Radio"
      name="validation-radio"
      invalid
      errorMessage="Example invalid radio feedback."
    >
      <Radio value="radio1" label="Toggle this radio" />
      <Radio value="radio2" label="Or this other radio" />
    </RadioGroup>

    <div>
      <Switch label="Check this switch" aria-describedby="switchFeedback" invalid />
      <FormFeedback id="switchFeedback" invalid>
        Example invalid switch feedback.
      </FormFeedback>
    </div>

    <FileInput
      label="File input"
      aria-label="file example"
      invalid
      invalidFeedback="Example invalid file feedback."
    />

    <ColorInput
      label="Color input"
      defaultValue="#3366ff"
      invalid
      invalidFeedback="Example invalid color feedback."
    />

    <RangeInput label="Range input" invalid invalidFeedback="Example invalid range feedback." />

    <div>
      <FormLabel htmlFor="validationInputGroup">Input group</FormLabel>
      <InputGroup>
        <InputGroupAddon>@</InputGroupAddon>
        <TextInput
          id="validationInputGroup"
          placeholder="Username"
          aria-describedby="inputGroupFeedback"
          invalid
        />
      </InputGroup>
      <FormFeedback id="inputGroupFeedback" invalid>
        Example invalid input group feedback.
      </FormFeedback>
    </div>

    <TextInput
      label="Input help"
      adornStart={<InputAdorn>$</InputAdorn>}
      adornEnd={<InputAdorn>.00</InputAdorn>}
      invalid
      invalidFeedback="Enter an amount greater than zero."
    />

    <ChipInput
      label="Chip input"
      defaultValue={['HTML', 'CSS']}
      invalid
      invalidFeedback="Add at least one more skill."
    />

    <Combobox
      label="Combobox"
      placeholder="Choose a role…"
      invalid
      invalidFeedback="Please pick a role."
    >
      <ComboboxItem id="admin">Admin</ComboboxItem>
      <ComboboxItem id="editor">Editor</ComboboxItem>
      <ComboboxItem id="viewer">Viewer</ComboboxItem>
    </Combobox>

    <FloatingInput
      label="Floating label"
      ids={{ feedback: 'validationFloatingFeedback', input: 'validationFloating' }}
      invalid
      invalidFeedback="Example invalid floating label feedback."
    >
      <TextInput
        type="email"
        id="validationFloating"
        placeholder="name@example.com"
        defaultValue="test@example.com"
        aria-describedby="validationFloatingFeedback"
        invalid
      />
    </FloatingInput>
  </Stack>
)
