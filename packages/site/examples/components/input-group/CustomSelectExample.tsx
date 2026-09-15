import { Button, InputGroup, InputGroupAddon, Select } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <InputGroup className="mb-md">
        <InputGroupAddon component="label" htmlFor="inputGroupSelect01">
          Options
        </InputGroupAddon>
        <Select id="inputGroupSelect01">
          <option>Choose...</option>
          <option value="1">One</option>
          <option value="2">Two</option>
          <option value="3">Three</option>
        </Select>
      </InputGroup>

      <InputGroup className="mb-md">
        <Select id="inputGroupSelect02">
          <option>Choose...</option>
          <option value="1">One</option>
          <option value="2">Two</option>
          <option value="3">Three</option>
        </Select>
        <InputGroupAddon component="label" htmlFor="inputGroupSelect02">
          Options
        </InputGroupAddon>
      </InputGroup>

      <InputGroup className="mb-md">
        <Button type="button" color="secondary" variant="outline">
          Button
        </Button>
        <Select id="inputGroupSelect03" aria-label="Example select with button addon">
          <option>Choose...</option>
          <option value="1">One</option>
          <option value="2">Two</option>
          <option value="3">Three</option>
        </Select>
      </InputGroup>

      <InputGroup>
        <Select id="inputGroupSelect04" aria-label="Example select with button addon">
          <option>Choose...</option>
          <option value="1">One</option>
          <option value="2">Two</option>
          <option value="3">Three</option>
        </Select>
        <Button type="button" color="secondary" variant="outline">
          Button
        </Button>
      </InputGroup>
    </>
  )
}
