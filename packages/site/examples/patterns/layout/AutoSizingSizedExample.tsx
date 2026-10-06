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
      <div className="w-100 sm:w-3/12">
        <FormLabel className="visually-hidden" htmlFor="specificSizeInputName">
          Name
        </FormLabel>
        <TextInput id="specificSizeInputName" placeholder="Jane Doe" />
      </div>
      <div className="w-100 sm:w-3/12">
        <FormLabel className="visually-hidden" htmlFor="specificSizeInputGroupUsername">
          Username
        </FormLabel>
        <InputGroup>
          <InputGroupAddon>@</InputGroupAddon>
          <TextInput id="specificSizeInputGroupUsername" placeholder="Username" />
        </InputGroup>
      </div>
      <div className="w-100 sm:w-3/12">
        <FormLabel className="visually-hidden" htmlFor="specificSizeSelect">
          Preference
        </FormLabel>
        <Select id="specificSizeSelect">
          <option>Choose...</option>
          <option value="1">One</option>
          <option value="2">Two</option>
          <option value="3">Three</option>
        </Select>
      </div>
      <div>
        <Checkbox id="autoSizingCheck2" label="Remember me" />
      </div>
      <div>
        <Button type="submit">Submit</Button>
      </div>
    </Flex>
  )
}
