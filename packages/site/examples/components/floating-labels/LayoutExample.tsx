import { FloatingInput, Grid, Select, TextInput } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Grid columns={1} gap="sm" responsive={{ md: { columns: 2 } }}>
      <div>
        <FloatingInput label="Email address" ids={{ input: 'floatingInputGrid' }}>
          <TextInput
            type="email"
            id="floatingInputGrid"
            placeholder="name@example.com"
            defaultValue="email@example.com"
          />
        </FloatingInput>
      </div>
      <div>
        <FloatingInput label="Works with selects" ids={{ input: 'floatingSelectGrid' }}>
          <Select id="floatingSelectGrid">
            <option>Open this select menu</option>
            <option value="1">One</option>
            <option value="2">Two</option>
            <option value="3">Three</option>
          </Select>
        </FloatingInput>
      </div>
    </Grid>
  )
}
