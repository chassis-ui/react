import { Grid, TextInput } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Grid columns={2} gap="xs">
      <div>
        <TextInput placeholder="First name" aria-label="First name" />
      </div>
      <div>
        <TextInput placeholder="Last name" aria-label="Last name" />
      </div>
    </Grid>
  )
}
