import React from 'react'
import {
  ChipInput,
  ColorInput,
  Combobox,
  ComboboxItem,
  Form,
  Select,
  Stack,
  Textarea,
  TextInput
} from '@chassis-ui/react'

export const Example = () => (
  <Form className="validation-icons">
    <Stack gap="medium">
      <TextInput label="Text input" defaultValue="John" valid validFeedback="Looks good!" />

      <Select label="State" invalid invalidFeedback="Please select a valid state.">
        <option disabled value="">
          Choose...
        </option>
        <option>California</option>
        <option>New York</option>
      </Select>

      <ColorInput label="Color" defaultValue="#3366ff" valid validFeedback="Looks good!" />

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

      <Textarea
        label="Textarea (no icon by design)"
        invalid
        invalidFeedback="Textareas never render a validation icon."
      />
    </Stack>
  </Form>
)
