import { Button, Checkbox, Form, FormLabel, Select, TextInput } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Form>
      <fieldset disabled>
        <legend>Disabled fieldset example</legend>
        <div className="mb-medium">
          <FormLabel htmlFor="disabledTextInput">Disabled input</FormLabel>
          <TextInput id="disabledTextInput" placeholder="Disabled input" />
        </div>
        <div className="mb-medium">
          <FormLabel htmlFor="disabledSelect">Disabled select menu</FormLabel>
          <Select id="disabledSelect">
            <option>Disabled select</option>
          </Select>
        </div>
        <div className="mb-medium">
          <Checkbox id="disabledFieldsetCheck" label="Can't check this" disabled />
        </div>
        <Button type="submit">Submit</Button>
      </fieldset>
    </Form>
  )
}
