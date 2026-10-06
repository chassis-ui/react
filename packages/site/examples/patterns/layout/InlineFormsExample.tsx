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
    <Flex
      component={Form}
      direction="column"
      gap="md"
      responsive={{ lg: { direction: 'row', align: 'center' } }}
    >
      <div>
        <FormLabel className="visually-hidden" htmlFor="inlineFormInputGroupUsername">
          Username
        </FormLabel>
        <InputGroup>
          <InputGroupAddon>@</InputGroupAddon>
          <TextInput id="inlineFormInputGroupUsername" placeholder="Username" />
        </InputGroup>
      </div>
      <div>
        <FormLabel className="visually-hidden" htmlFor="inlineFormSelectPref">
          Preference
        </FormLabel>
        <Select id="inlineFormSelectPref">
          <option>Choose...</option>
          <option value="1">One</option>
          <option value="2">Two</option>
          <option value="3">Three</option>
        </Select>
      </div>
      <div>
        <Checkbox id="inlineFormCheck" label="Remember me" />
      </div>
      <div>
        <Button type="submit">Submit</Button>
      </div>
    </Flex>
  )
}
