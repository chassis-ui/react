import { Grid, GridItem, TextInput } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Grid gap="md">
      <GridItem span={{ base: 'full', sm: 6 }}>
        <TextInput placeholder="City" aria-label="City" />
      </GridItem>
      <GridItem span={{ base: 'full', sm: 3 }}>
        <TextInput placeholder="State" aria-label="State" />
      </GridItem>
      <GridItem span={{ base: 'full', sm: 3 }}>
        <TextInput placeholder="Zip" aria-label="Zip" />
      </GridItem>
    </Grid>
  )
}
