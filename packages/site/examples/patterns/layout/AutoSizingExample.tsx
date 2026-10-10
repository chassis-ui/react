import {
  Button,
  Checkbox,
  Flex,
  Form,
  FormLabel,
  InputGroup,
  InputGroupAddon,
  Select,
  TextInput
} from '@chassis-ui/react'

export const Example = () => {
  return (
    <Flex component={Form} wrap="wrap" align="center" columnGap="md" rowGap="xs">
      <div>
        <FormLabel className="visually-hidden" htmlFor="autoSizingInput" id="autoSizingInputLabel">
          Name
        </FormLabel>
        <TextInput
          id="autoSizingInput"
          aria-labelledby="autoSizingInputLabel"
          placeholder="Jane Doe"
        />
      </div>
      <div>
        <FormLabel
          className="visually-hidden"
          htmlFor="autoSizingInputGroup"
          id="autoSizingInputGroupLabel"
        >
          Username
        </FormLabel>
        <InputGroup>
          <InputGroupAddon>@</InputGroupAddon>
          <TextInput
            id="autoSizingInputGroup"
            aria-labelledby="autoSizingInputGroupLabel"
            placeholder="Username"
          />
        </InputGroup>
      </div>
      <div>
        <FormLabel className="visually-hidden" htmlFor="autoSizingSelect">
          Preference
        </FormLabel>
        <Select id="autoSizingSelect">
          <option>Choose...</option>
          <option value="1">One</option>
          <option value="2">Two</option>
          <option value="3">Three</option>
        </Select>
      </div>
      <div>
        <Checkbox id="autoSizingCheck" label="Remember me" />
      </div>
      <div>
        <Button type="submit">Submit</Button>
      </div>
    </Flex>
  )
}
