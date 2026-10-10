import { Button, Checkbox, Form, Select, TextInput } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Form>
      <fieldset disabled>
        <legend>Disabled fieldset example</legend>
        <div className="mb-md">
          <TextInput label="Disabled input" placeholder="Disabled input" />
        </div>
        <div className="mb-md">
          <Select label="Disabled select menu">
            <option>Disabled select</option>
          </Select>
        </div>
        <div className="mb-md">
          <Checkbox id="disabledFieldsetCheck" label="Can't check this" disabled />
        </div>
        <Button type="submit">Submit</Button>
      </fieldset>
    </Form>
  )
}
